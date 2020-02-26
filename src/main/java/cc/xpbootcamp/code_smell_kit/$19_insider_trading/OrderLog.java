package cc.xpbootcamp.code_smell_kit.$19_insider_trading;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class OrderLog {
    private String id;
    private Order order;
    private String note;
    private String status;
    private String createdBy;
    private LocalDateTime createdDate;

    public Order getRelatedOrder() {
        return this.order;
    }

    public String getNoteWithOrderInfo() {
        return String.format(
                "%s, %s, %s",
                order.getCreatedBy(), order.getCreatedDate().format(DateTimeFormatter.ISO_DATE), this.note);
    }

    // ignore some other bossiness logic
}
