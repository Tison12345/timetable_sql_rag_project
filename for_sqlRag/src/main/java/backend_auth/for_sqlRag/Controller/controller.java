package backend_auth.for_sqlRag.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class controller {

    @GetMapping("/hello")
    public String welcome(){
        return "Hi chellam" ;
    }
}
