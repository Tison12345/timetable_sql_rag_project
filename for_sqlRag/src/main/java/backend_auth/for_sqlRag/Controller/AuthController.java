package backend_auth.for_sqlRag.Controller;

import backend_auth.for_sqlRag.Service.UserService;
import backend_auth.for_sqlRag.Utils.JwtUtil;
import backend_auth.for_sqlRag.models.Users;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String,String> user)
    {
        // get the email from map
        // hash the password
        // send it through repo
        String email= user.get("email");
        String password=user.get("password");
        String salt=BCrypt.gensalt(12);
        String hashedPassword = BCrypt.hashpw(password,salt);

        if(userService.isUserExist(email))
        {
            return new ResponseEntity<>("Already User Present",HttpStatus.CONFLICT);
        }
        userService.registerUser(Users.builder().email(email).password(hashedPassword).build());
        System.out.println("hi");
        Users userRegister=userService.getUser(email).get();
//        System.out.println(userRegister.getId());

        return new ResponseEntity<>("Successfully Registered",HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> user)
    {
        String email= user.get("email");
        String hashedPassword= user.get("password");

        if(!userService.isUserExist(email))
        {
            return new ResponseEntity<>("User not registered",HttpStatus.UNAUTHORIZED);
        }

        Users userRegister=userService.getUser(email).get();

        if(!passwordEncoder.matches(hashedPassword, userRegister.getPassword())){
            return new ResponseEntity<>("Invalid password",HttpStatus.NOT_FOUND);
        }
        long Id=userService.getUser(email).get().getId();
        String accessToken=jwtUtil.generateToken(email);
        String refreshToken = jwtUtil.generateToken(Long.toString(Id));
        return new ResponseEntity<>(Map.of("accessToken",accessToken,"refreshToken",refreshToken,"info","successfull login"),HttpStatus.OK);
    }
}
