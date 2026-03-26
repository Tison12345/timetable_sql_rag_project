package backend_auth.for_sqlRag.Service;

import backend_auth.for_sqlRag.Dto.EmailInfo;
import backend_auth.for_sqlRag.Repository.UserRepository;
import backend_auth.for_sqlRag.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private UserRepository userRepository;


    public EmailInfo getBranch(String email)
    {
        Users user=userRepository.findByEmail(email).get();
        String branchCode= user.getBranch();
        String branch;
        int currentMonth= LocalDate.now().getMonthValue();
        int currentYear=LocalDate.now().getYear();
        int joinYear=2000+Integer.parseInt(email.substring(0,2));
        int year=currentYear-joinYear;
        switch (branchCode) {
            case "bds":
                branch = "ds";
                break;
            case "bcs":
                branch = "cse";
                break;
            case "bec":
                branch = "ece";
                break;
            default:
                throw new IllegalArgumentException("Invalid branch code: " + branchCode);
        }

        int semester;

        // Jan–May → even semester
        if (currentMonth >= 1 && currentMonth <= 5) {
            semester = year * 2;
        }
        // Jul–Nov → odd semester
        else if (currentMonth >= 7 && currentMonth <= 11) {
            semester = (year * 2) + 1;
        }
        // June & December (edge months)
        else {
            semester = year * 2; // safe fallback
        }

        // Step 7: Validate semester range
        if (semester < 1 || semester > 8) {
            throw new IllegalArgumentException("Calculated semester out of range: " + semester);
        }
        EmailInfo emailInfo=EmailInfo.builder().branch(branch).semester(semester).build();
        return emailInfo;





    }



}
