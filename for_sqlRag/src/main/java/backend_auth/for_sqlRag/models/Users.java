package backend_auth.for_sqlRag.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Users {
    @Id
    @GeneratedValue
    private long id;
    @Email
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@iiitdwd\\.ac\\.in$",message = "Use your college Mail")
    private String email;
    @Size(min = 8)
    private String password;
}
