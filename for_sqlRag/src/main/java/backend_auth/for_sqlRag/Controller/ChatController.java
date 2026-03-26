package backend_auth.for_sqlRag.Controller;

import backend_auth.for_sqlRag.Dto.EmailInfo;
import backend_auth.for_sqlRag.Dto.Query;
import backend_auth.for_sqlRag.Dto.RagResponse;
import backend_auth.for_sqlRag.Service.ChatService;
import backend_auth.for_sqlRag.Service.PipelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final PipelineService pipelineService;
    private final ChatService chatService;


    @PostMapping("/ask")
    public RagResponse getAnswer(@RequestBody Map<String,String> query)
    {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        System.out.println(query.get("question"));
        EmailInfo getBranch = chatService.getBranch(email);
        Query req=Query.builder().branch(getBranch.getBranch()).question(query.get("question")).semester(getBranch.getSemester()).build();
        return pipelineService.callPipeline(req);


    }
}
