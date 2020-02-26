package cc.xpbootcamp.code_smell_kit.$03_long_method;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

public class OrderPriceService {
    private MockPriceClient mockPriceClient;

    /*
     * long method
     * can extract as some private calculate methods
     * */
    public double calculateOrderPrice(Order order) {
        String shippingId =
                order.getShipping().getId();
        MockPriceClient.Price orderPrice = mockPriceClient.getOrderPrice(shippingId);

        Double totalVolume = order.getGoods().stream()
                .map(goods -> goods.getVolume().doubleValue() * (goods.getQuantity()))
                .reduce(0.0, Double::sum);
        double totalOrderPriceByVolume = totalVolume * orderPrice.getUnitPriceByVolume();

        Double totalWeight = order.getGoods().stream()
                .map(goods -> goods.getWeight().doubleValue() * goods.getQuantity())
                .reduce(0.0, Double::sum);
        double totalOrderPriceByWeight = totalWeight * orderPrice.getUnitPriceByWeight();

        Double pickUpFee = order.getShipping().isPickedUp() ? 0 : orderPrice.getPickUpPrice();
        Double dropOffFee = order.getShipping().isDropedOff() ? 0 : orderPrice.getDropOffPrice();
        Double totalOrderFee = Math.max(totalOrderPriceByVolume, totalOrderPriceByWeight);

        // ignore some other calculate logic

        return pickUpFee + dropOffFee + totalOrderFee;
    }

    @Getter
    private static class Order {
        private Shipping shipping;
        private List<Goods> goods;
    }

    @Getter
    private static class Shipping {
        private String id;
        private boolean isPickedUp;
        private boolean isDropedOff;
    }

    @Getter
    private static class Goods {
        private BigDecimal weight;
        private BigDecimal volume;
        private Double quantity;
    }
}
