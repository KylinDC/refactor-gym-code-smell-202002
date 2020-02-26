package cc.xpbootcamp.code_smell_kit.$22_data_class;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Project {
    private int id;
    private String name;
    private String description;
    private String Cover;
    private int totalHours;
    private int progress;
}
