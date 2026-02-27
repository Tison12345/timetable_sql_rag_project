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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


//        if(authHeader!=null && authHeader.startsWith("Bearer ")){
//            String token=authHeader.substring(7);
//
//            if(jwt.validateJwtToken(token))
//            {
//                String email= jwt.extractEmail(token);
//                var auth=new UsernamePasswordAuthenticationToken(email,null, List.of());
//
//                SecurityContextHolder.getContext().setAuthentication(auth);
//            }
//        }

        Cookie[] cookies = request.getCookies();
        String accessToken=null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if("accessCookie".equals(cookie.getName()))
                {
                    accessToken=cookie.getValue();
                    break;
                }
            }
        }

        if(accessToken!=null && jwt.validateJwtToken(accessToken))
        {
            String email= jwt.extractEmail(accessToken);
            var auth=new UsernamePasswordAuthenticationToken(email,null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }


        filterChain.doFilter(request,response);
    }

}
