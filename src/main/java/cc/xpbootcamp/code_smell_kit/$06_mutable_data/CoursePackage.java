package cc.xpbootcamp.code_smell_kit.$06_mutable_data;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CoursePackage {
    private int id;
    private String name;
    private String description;
    private int totalHours;
    private int progress;
    private List<Course> courses;

    //腐坏点： 可以同时通过setProgress和calculateProgress给progress赋值
    public void calculateProgress(){
        progress =  courses.stream().mapToInt(Course::getProgress).sum();
    }
}
