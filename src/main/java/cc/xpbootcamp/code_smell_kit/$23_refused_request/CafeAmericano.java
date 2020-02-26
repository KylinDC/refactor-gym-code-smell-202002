package cc.xpbootcamp.code_smell_kit.$23_refused_request;

public class CafeAmericano extends Coffee {

    @Override
    public void water() {
        System.out.println("add water");
    }

    @Override
    public void coffee() {
        System.out.println("add coffee");
    }
}
