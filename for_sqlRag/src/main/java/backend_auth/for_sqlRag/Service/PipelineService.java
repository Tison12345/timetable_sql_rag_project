package backend_auth.for_sqlRag.Service;

import backend_auth.for_sqlRag.Dto.Query;
import backend_auth.for_sqlRag.Dto.RagResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PipelineService {

    private final WebClient webClient ;

    public RagResponse callPipeline(Query query){
        return webClient.post()
                .uri("/process")
                .bodyValue(query)
                .retrieve()
                .bodyToMono(RagResponse.class)
                .block();
    }
}
