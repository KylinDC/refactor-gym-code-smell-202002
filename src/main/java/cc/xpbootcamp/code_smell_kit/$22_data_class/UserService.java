package cc.xpbootcamp.code_smell_kit.$22_data_class;

public class UserService {
    public boolean hasFinishedAllProjects(User user){
        return user.getProjects().stream().allMatch(project -> project.getProgress() == 100);
    }
}
