package backend_auth.for_sqlRag;

import backend_auth.for_sqlRag.Utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwt;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Cookie[] cookies = request.getCookies();
        String accessToken = null;

        // At the start of doFilterInternal
        String path = request.getRequestURI();
        System.out.println(path);

        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessCookie".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }



        // Only try authentication if token exists
        if (accessToken != null) {

            if (jwt.validateJwtToken(accessToken)) {

                String email = jwt.extractEmail(accessToken);

                var auth = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of()
                );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } else {
                // Invalid token → clear security context but continue
                SecurityContextHolder.clearContext();

            }
        }
        else {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
            return; // Stop the filter chain here
        }

        // Continue the filter chain always
        filterChain.doFilter(request, response);
    }
}