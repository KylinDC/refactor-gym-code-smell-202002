package cc.xpbootcamp.code_smell_kit.$17_message_chains;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class Class {

    @Getter
    private List<Student> students = new ArrayList<>();

    public void addStudent(Student student) {
        students.add(student);
    }

    public List<Student> getStudents() {
        return students;
    }
}
