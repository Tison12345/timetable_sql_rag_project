package backend_auth.for_sqlRag.Dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Query {
    private String question;
    private String branch;
    private Integer semester;
}
