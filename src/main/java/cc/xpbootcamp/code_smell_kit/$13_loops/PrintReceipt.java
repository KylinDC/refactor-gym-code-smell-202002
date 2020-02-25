package cc.xpbootcamp.code_smell_kit.$13_loops;

import java.util.ArrayList;
import java.util.List;

public class PrintReceipt {
    List<LineItem> LineItems = new ArrayList<>();

    String printLineItems() {
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < LineItems.size(); i++) {
            LineItem lineItem = LineItems.get(i);
            output.append(lineItem.getName()).append(lineItem.getPrice());
        }
    return output.toString();
    }
}
