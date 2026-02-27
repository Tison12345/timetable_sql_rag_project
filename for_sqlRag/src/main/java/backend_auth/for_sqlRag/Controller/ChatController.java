package backend_auth.for_sqlRag.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @PostMapping("/history")
    public String getHistory()
    {
        return "history";
    }
}
