package backend_auth.for_sqlRag.RateLimiter;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;

@Component
@AllArgsConstructor
public class RateLimiterc {

    private final StringRedisTemplate redisTemplate;

    // Maximum bucket size
    private static final int CAPACITY = 5;

    // Tokens added per minute
    private static final int REFILL_RATE = 5;

    private static final String LUA_SCRIPT = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local current_time = tonumber(ARGV[3])

        local bucket = redis.call("HMGET", key, "tokens", "last_refill")

        local tokens = tonumber(bucket[1])
        local last_refill = tonumber(bucket[2])

        if tokens == nil then
            tokens = capacity
            last_refill = current_time
        end

        local elapsed = current_time - last_refill
        local refill = math.floor((elapsed * refill_rate) / 60)

        tokens = math.min(capacity, tokens + refill)

        if tokens > 0 then
            tokens = tokens - 1
            redis.call("HMSET", key, "tokens", tokens, "last_refill", current_time)
            redis.call("EXPIRE", key, 120)
            return 1
        else
            return 0
        end
    """;

    private static final DefaultRedisScript<Long> SCRIPT;

    static {
        SCRIPT = new DefaultRedisScript<>();
        SCRIPT.setScriptText(LUA_SCRIPT);
        SCRIPT.setResultType(Long.class);
    }

    public boolean isAllowed(String key) {

        Long result = redisTemplate.execute(
                SCRIPT,
                Collections.singletonList(key),
                String.valueOf(CAPACITY),
                String.valueOf(REFILL_RATE),
                String.valueOf(Instant.now().getEpochSecond())
        );

        return result != null && result == 1;
    }
}