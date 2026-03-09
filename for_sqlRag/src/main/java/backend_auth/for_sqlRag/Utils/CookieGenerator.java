package backend_auth.for_sqlRag.Utils;


import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieGenerator {

    public ResponseCookie createAccessCookie(String token)
    {
        return ResponseCookie.from("accessCookie",token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Lax")
                .build();

    }

    public ResponseCookie createRefreshCookie(String token)
    {
        return   ResponseCookie.from("refreshCookie",token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .build();

    }
}
