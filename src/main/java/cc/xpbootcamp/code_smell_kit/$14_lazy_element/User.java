package cc.xpbootcamp.code_smell_kit.$14_lazy_element;

public class User {
    private int id;
    private String name;
    private ActivatedStatus activatedStatus;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ActivatedStatus getActivatedStatus() {
        return activatedStatus;
    }

    public boolean isActivated(){
        return this.activatedStatus == ActivatedStatus.Activated;
    }
}
