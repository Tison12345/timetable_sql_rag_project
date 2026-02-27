package backend_auth.for_sqlRag.Controller;

import backend_auth.for_sqlRag.Service.UserService;
import backend_auth.for_sqlRag.Utils.JwtUtil;
import backend_auth.for_sqlRag.models.Users;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> user)
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
        String accessToken=jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        ResponseCookie accessCookie = ResponseCookie.from("accessCookie", accessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Lax")
                .secure(false)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshCookie", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .secure(false)
                .build();

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
            ResponseCookie accessCookie = ResponseCookie.from("accessCookie", accessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(Duration.ofMinutes(15))
                    .sameSite("Lax")
                    .secure(false)
                    .build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,accessCookie.toString()).build();
        }
        else{
            return new  ResponseEntity<>("Unauthorized",HttpStatus.UNAUTHORIZED);
        }
    }
}
