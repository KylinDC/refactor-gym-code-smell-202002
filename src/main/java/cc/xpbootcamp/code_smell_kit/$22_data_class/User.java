package cc.xpbootcamp.code_smell_kit.$22_data_class;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class User {
    private String name;
    private List<Project> projects;
}
