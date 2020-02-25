package cc.xpbootcamp.code_smell_kit.$09_feature_envy;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class Class {

    @Getter
    private List<Student> students = new ArrayList<>();

    public void addStudent(Student student) {
        students.add(student);
    }

    public double getClassTotalScore() {
        return students.stream()
                // 求单个student的总成绩的逻辑应该放到Student类中
                .mapToDouble(student -> student.getScores().values().stream()
                        .mapToDouble(Double::doubleValue).sum())
                .sum();
    }
}
