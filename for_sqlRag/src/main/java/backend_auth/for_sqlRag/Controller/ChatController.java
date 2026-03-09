package backend_auth.for_sqlRag.Controller;

import backend_auth.for_sqlRag.Dto.RagResponse;
import backend_auth.for_sqlRag.Service.Imp.PipelineService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/ask")
    public RagResponse getAnswer(@RequestBody Map<String,String> query)
    {
        System.out.println(query.get("question"));

        return pipelineService.callPipeline(query.get("question"));


    }
}
