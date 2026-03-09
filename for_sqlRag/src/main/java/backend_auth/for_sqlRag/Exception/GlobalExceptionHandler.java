package backend_auth.for_sqlRag.Exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> catchError(ConstraintViolationException ex) {

        Map<String, String> errors = new HashMap<>();

        String field = null;
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            field = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(field, message);
        }
//        System.out.println(errors);


        return new ResponseEntity<>(errors.get(field), HttpStatus.BAD_REQUEST);
    }
}