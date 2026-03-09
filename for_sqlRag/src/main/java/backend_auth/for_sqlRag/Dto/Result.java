package backend_auth.for_sqlRag.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Result {
    @JsonProperty("Basket ID")
    private String Basket_Id;

    @JsonProperty("Class Type")
    private String Class_type;

    @JsonProperty("Course Code")
    private String CourseCode;

    @JsonProperty("Course Name")
    private String CourseName;

    @JsonProperty("Day")
    private String Day;

    @JsonProperty("End Time")
    private String EndTime;

    @JsonProperty("Faculty Name")
    private String FacultyName;

    @JsonProperty("Room")
    private String Room;

    @JsonProperty("Semester")
    private String Semester;

    @JsonProperty("Start Time")
    private String StartTime;
}
