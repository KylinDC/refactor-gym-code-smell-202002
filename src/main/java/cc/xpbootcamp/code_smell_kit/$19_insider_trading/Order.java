package cc.xpbootcamp.code_smell_kit.$19_insider_trading;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Getter
public class Order {
    private String id;
    private String createdBy;
    private LocalDateTime createdDate;
    private List<OrderLog> orderLogs;
    // ignore some other fields

    public List<String> getAllFormatedOrderLogs() {
        return orderLogs.stream()
                .map(
                        log ->
                                String.format(
                                        "%s, %s, %s, %s, %s",
                                        log.getId(),
                                        log.getNote(),
                                        log.getStatus(),
                                        log.getCreatedBy(),
                                        log.getCreatedDate().format(DateTimeFormatter.ISO_DATE)))
                .collect(toList());
    }

    public List<OrderLog> getAllOrderLogsByStatus(String status) {
        return orderLogs.stream()
                .filter(log -> status.equals(log.getStatus()))
                .collect(toList());
    }

    // ignore some other bossiness logic
}
