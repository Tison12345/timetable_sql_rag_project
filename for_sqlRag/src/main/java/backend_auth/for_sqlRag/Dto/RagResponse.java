package backend_auth.for_sqlRag.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RagResponse {

    private String generated_sql;
    private String answer;
    private List<Result> result;
}
