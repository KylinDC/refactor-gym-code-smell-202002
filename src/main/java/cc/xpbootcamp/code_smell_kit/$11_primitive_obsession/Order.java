package cc.xpbootcamp.code_smell_kit.$11_primitive_obsession;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class Order {
    private String id;
    private BigDecimal price;

    // primitive obsession
    private List<String> goods;
    private String address;

    // ignore some other fields

    // ignore some other business logic method
}
