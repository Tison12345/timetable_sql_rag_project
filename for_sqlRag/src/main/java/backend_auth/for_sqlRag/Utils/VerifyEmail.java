package backend_auth.for_sqlRag.Utils;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class VerifyEmail {

    private final static String SECRET="PreethamwillgivemereferalVanamishisGirlFriendMominisfuturemleraEmployee12345cedceiifjmnrvmrfnrfrjvrfvrvrm";
    private final static long Expiration=1000*60*5;


    public String emailVerificationToken(String email)
    {
        String Token= Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+Expiration))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
        return Token;
    }

    public String extractEmail(String token)
    {
        String email=Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
        return email;
    }

    public boolean verifyEmail(String token,String email)
    {
        if(extractEmail(token).equals(email))
        {
            return true;
        }
        return false;
    }

    public boolean validateToken(String token)
    {
        try {
            extractEmail(token);
            return true;
        }catch (JwtException e){
            return false;        }
    }
}
