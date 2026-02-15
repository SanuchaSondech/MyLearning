package L6_1;

public class Car implements Vehicle {

    @Override
    public void startEngine() {
        System.out.println("เสียงของการสตาร์ทรถ");
    }

    @Override
    public void stopEngine() {
        System.out.println("เสียงของการดับรถ");
    }

    @Override
    public int getNumberOfWheels() {
        return 4;
    }

}
