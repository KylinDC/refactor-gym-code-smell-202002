package cc.xpbootcamp.code_smell_kit.$09_feature_envy;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

public class Student {

    @Getter
    private Map<Subject, Double> scores = new HashMap<>();

    public void addScore(Subject subject, Double score) {
        scores.put(subject, score);
    }
}
