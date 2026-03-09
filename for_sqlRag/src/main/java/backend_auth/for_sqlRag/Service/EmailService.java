package backend_auth.for_sqlRag.Service;


import backend_auth.for_sqlRag.models.EmailDetails;

public interface EmailService {

    public String sendEmail(EmailDetails emailDetails);
}
