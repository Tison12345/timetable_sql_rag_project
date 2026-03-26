package backend_auth.for_sqlRag.Dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EmailInfo {
    private String branch;
    private Integer semester;
}
