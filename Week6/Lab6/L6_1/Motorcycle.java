package L6_1;

public class Motorcycle implements Vehicle {

    @Override
    public void startEngine() {
        System.out.println("เสียงของการสตาร์ทมอเตอร์ไซค์");
    }

    @Override
    public void stopEngine() {
        System.out.println("เสียงของการดับมอเตอร์ไซค์");
    }

    @Override
    public int getNumberOfWheels() {
        return 2;
    }

}