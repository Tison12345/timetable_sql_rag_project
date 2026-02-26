package backend_auth.for_sqlRag.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.UUID;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Chat {

    @Id
    @UUID
    Long Id;
}
