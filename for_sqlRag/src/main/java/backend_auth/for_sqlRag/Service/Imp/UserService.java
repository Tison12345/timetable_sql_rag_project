package backend_auth.for_sqlRag.Service.Imp;

import backend_auth.for_sqlRag.Repository.UserRepository;
import backend_auth.for_sqlRag.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Users registerUser(Users user)
    {
        return userRepository.save(user);
    }

    public boolean isUserExist(String email)
    {
        if(userRepository.findByEmail(email).isPresent())
        {
            return true;
        }
        else{
            return false;
        }
    }

    public boolean isVerified(String email){
        Optional<Users> user=userRepository.findByEmail(email);
        System.out.println(user);
        return true;

    }



    public Optional<Users> getUser(String email)
    {
        return userRepository.findByEmail(email);
    }
}
