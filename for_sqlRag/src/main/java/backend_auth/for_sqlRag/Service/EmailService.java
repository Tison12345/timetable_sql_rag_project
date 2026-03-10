package backend_auth.for_sqlRag.Service;


import backend_auth.for_sqlRag.models.EmailDetails;
import org.springframework.http.ResponseEntity;

public interface EmailService {

    public ResponseEntity sendEmail(EmailDetails emailDetails);
}
