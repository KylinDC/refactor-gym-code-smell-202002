package cc.xpbootcamp.code_smell_kit.$22_data_class;

public class ProjectService {
    public boolean isFinishedProject(Project project){
        return project.getProgress() == 100;
    }
}
