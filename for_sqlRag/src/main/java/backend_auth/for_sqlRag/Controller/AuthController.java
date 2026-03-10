package backend_auth.for_sqlRag.Controller;

import backend_auth.for_sqlRag.Service.Imp.EmailServiceImp;
import backend_auth.for_sqlRag.Service.Imp.GoogleTokenService;
import backend_auth.for_sqlRag.Service.Imp.UserService;
import backend_auth.for_sqlRag.Utils.CookieGenerator;
import backend_auth.for_sqlRag.Utils.JwtUtil;
import backend_auth.for_sqlRag.models.EmailDetails;
import backend_auth.for_sqlRag.models.Users;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final GoogleTokenService googleTokenService;
    private final CookieGenerator cookieGenerator;
    private final EmailServiceImp emailServiceImp;



    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody Map<String, String> user)
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
            if(userService.isVerified(email))
            {
                return new ResponseEntity<>("Already User Present Login",HttpStatus.CONFLICT);
            }

        }
        userService.registerUser(Users.builder().email(email).password(hashedPassword).isVerified(false).provider_id("null").provider("local").build());

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
        if(!userService.isVerified(email))
        {
//            emailDetails.builder().receiverEmail(email).token(generateVerificationToken.generateVerificationToken()).build();
//            emailServiceImp.sendEmail(emailDetails);
            return new ResponseEntity<>("Email Not verified",HttpStatus.UNAUTHORIZED);
        }
        String accessToken=jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        ResponseCookie accessCookie= cookieGenerator.createAccessCookie(accessToken);

        ResponseCookie refreshCookie=cookieGenerator.createRefreshCookie(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body("Login Successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> generateRefresh(HttpServletRequest request)
    {
       String refreshToken=null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshCookie".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }
        if(refreshToken==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!jwtUtil.validateJwtToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(refreshToken!=null && jwtUtil.validateJwtToken(refreshToken))
        {
            String accessToken=jwtUtil.generateAccessToken(jwtUtil.extractEmail(refreshToken));
            ResponseCookie accessCookie = cookieGenerator.createAccessCookie(accessToken);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,accessCookie.toString()).build();
        }
        else{
            return new  ResponseEntity<>("Unauthorized",HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/google/token")
    public ResponseEntity<?> getToken(@RequestBody Map<String,String> body) throws GeneralSecurityException, IOException {
        String token=body.get("token");

        if(token==null)
        {
            return new ResponseEntity<>("Login failed",HttpStatus.UNAUTHORIZED);

        }
        GoogleIdToken.Payload payload = googleTokenService.verify(token);

        if (payload == null || !payload.getEmailVerified()) {
            return new ResponseEntity<>("Invalid Google login", HttpStatus.UNAUTHORIZED);
        }
        System.out.println(payload);

        String email = payload.getEmail();


        if(email!=null && !email.endsWith("iiitdwd.ac.in")){
            return new ResponseEntity<>("Invalid email Use your College email",HttpStatus.BAD_REQUEST);
        }


        if (!userService.isUserExist(email))
        {
            String provider_id=(String) payload.get("sub");
            boolean isverified=payload.getEmailVerified();
            userService.registerUser(Users.builder().email(email).password("usedgoogle").provider("google").provider_id(provider_id).isVerified(isverified).build());
        }

        ResponseCookie accessCookie=cookieGenerator.createAccessCookie(jwtUtil.generateAccessToken(email));
        ResponseCookie refreshCookie=cookieGenerator.createRefreshCookie(jwtUtil.generateRefreshToken(email));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body("Login Successful");


    }

    @PostMapping("/verify-Email")
    public ResponseEntity<?> verifyEmail(@RequestParam String email)
    {
        EmailDetails emailDetails=new EmailDetails();

//       emailDetails.builder().token(generateVerificationToken.generateVerificationToken()).receiverEmail(email).build();
//       return emailServiceImp.sendEmail(emailDetails);
        return null;
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> getToken(@RequestParam String token){
   return null;
    }
}
