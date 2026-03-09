package backend_auth.for_sqlRag.RateLimiter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@AllArgsConstructor
//@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterc rateLimiterc;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String clientIp=request.getRemoteAddr();
        String key="rate_limit :" + clientIp;

        String uri = request.getRequestURI();

        if (uri.equals("/") || uri.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (rateLimiterc.isAllowed(key)) {
            filterChain.doFilter(request,response);
        }
        else{
            response.setStatus(429);
            response.getWriter().write("too many request");
        }

    }
}
