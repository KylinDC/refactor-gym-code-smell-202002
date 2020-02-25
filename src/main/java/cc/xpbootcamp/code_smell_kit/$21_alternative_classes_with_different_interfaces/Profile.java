package cc.xpbootcamp.code_smell_kit.$21_alternative_classes_with_different_interfaces;

public class Profile {
    public String generateInformation(Person person) {
        return person.getFirstName() + " " + person.getLastName();
    }
}
