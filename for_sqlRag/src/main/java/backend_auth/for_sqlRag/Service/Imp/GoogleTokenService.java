package backend_auth.for_sqlRag.Service.Imp;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class GoogleTokenService {

    private static final String GoogleClientId="1011757238042-f866dokep98e8vtuvemog9mf0rcaml0j.apps.googleusercontent.com";


    public GoogleIdToken.Payload verify(String googleIdToken) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(GoogleClientId))
                .build();

        GoogleIdToken idToken=verifier.verify(googleIdToken);
        if(idToken==null)
        {
            throw new RuntimeException("Google Id Token not valid");
        }
        return idToken.getPayload();
    }
}
