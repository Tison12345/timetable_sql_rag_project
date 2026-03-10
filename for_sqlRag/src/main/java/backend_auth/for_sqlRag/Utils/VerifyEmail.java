package backend_auth.for_sqlRag.Utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class VerifyEmail {

    private final static String SECRET="Preethamwillgivemereferal";
    private final static long Expiration=1000*60*5;


    public String emailVerification(String email)
    {
        String Token= Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+Expiration))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
        return Token;
    }
}
