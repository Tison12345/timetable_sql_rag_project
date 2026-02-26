package backend_auth.for_sqlRag.Utils;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
        private final String SECRET= "PreethamPistahBadamParuppuChennaikaraveerasuura";
        private final long EXPIRATION =1000*60*60*24;

        private final Key secretKey= Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

        public String generateToken(String email)
        {
            return Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION))
                    .signWith(secretKey, SignatureAlgorithm.HS256)
                    .compact();
        }

    public String extractEmail(String Token){
        String email=Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(Token)
                .getBody()
                .getSubject();
        return email;
    }

    public boolean validateJwtToken(String Token)
    {
        try{
            extractEmail(Token);
            return true;
        }
        catch (JwtException exception){
            return false;
        }
    }
}
