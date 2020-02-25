package cc.xpbootcamp.code_smell_kit.$17_message_chains;

import java.util.ArrayList;
import java.util.List;

public class School {

    private List<Class> classes = new ArrayList<>();

    public void addClass(Class klass) {
        classes.add(klass);
    }

    public double getTotalMathScore() {
        return classes.stream()
                .mapToDouble(klass -> klass.getStudents().stream()
                        .mapToDouble(student -> student.getScores().get(Subject.Math))
                        .sum())
                .sum();
    }
}
