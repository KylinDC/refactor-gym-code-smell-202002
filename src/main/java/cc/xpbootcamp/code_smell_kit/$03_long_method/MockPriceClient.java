package cc.xpbootcamp.code_smell_kit.$03_long_method;

import lombok.Getter;

public interface MockPriceClient {
    Price getOrderPrice(String id);

    @Getter
    class Price {
        private Double unitPriceByVolume;
        private Double unitPriceByWeight;
        private Double pickUpPrice;
        private Double dropOffPrice;
    }
}
