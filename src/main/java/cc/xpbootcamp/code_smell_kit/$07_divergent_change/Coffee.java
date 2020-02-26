

import lombok.Getter;

@Getter
public class Coffee {
    private double amount = 0;
    private double price =0.00;
    private int water = 0;
    private int milk = 0;
    private int sugar = 0;
    private int coffee = 0;



    public void water() {
        water = 1;
    }

    public void milk() {
        milk = 1;
    }

    public void sugar() {
        sugar = 1;
    }

    public void stock() {
        amount++;
    }

    public void sell() {
        amount--;
    }

    private void setPrice(double price) {
        this.price = price;
    }

    private boolean isAddWater() {
        return water == 1;
    }

    private boolean isAddMilk() {
        return milk == 1;
    }

    public String toXml() {
        return "<ingredient><water>" + isAddWater()
                + "</water><milk>" + isAddMilk()
                + "</milk></ingredient>";
    }

    public String toText() {
        return "water: " + water + "\nmilk: " + milk;
    }
}
