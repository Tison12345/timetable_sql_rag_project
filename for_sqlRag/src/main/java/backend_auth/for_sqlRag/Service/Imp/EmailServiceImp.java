package backend_auth.for_sqlRag.Service.Imp;

import backend_auth.for_sqlRag.models.EmailDetails;
import backend_auth.for_sqlRag.Service.EmailService;
import com.google.api.client.util.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendEmail(EmailDetails emailDetails) {

        SimpleMailMessage simpleMailMessage=new SimpleMailMessage();

        simpleMailMessage.setFrom(sender);
        simpleMailMessage.setText("Click this link to verify. You will be directed to login page");
        simpleMailMessage.setText("");

//        javaMailSender.send();

        return null;
    }
}
