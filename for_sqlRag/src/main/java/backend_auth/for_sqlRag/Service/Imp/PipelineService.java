package backend_auth.for_sqlRag.Service.Imp;

import backend_auth.for_sqlRag.Dto.RagResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PipelineService {

    private final WebClient webClient ;

    public RagResponse callPipeline(String message){
        return webClient.post()
                .uri("/process")
                .bodyValue(Map.of("question",message))
                .retrieve()
                .bodyToMono(RagResponse.class)
                .block();
    }
}
