package cc.xpbootcamp.code_smell_kit.$06_mutable_data;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Course {
    private int id;
    private String name;
    private String description;
    private String url;
    private int serialNumber;
    private int progress;
}
