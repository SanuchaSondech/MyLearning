package VehiclePack;

public class SportsCar extends Car {

    private int maxSpeed;

    public SportsCar(String brand, int year, int numDoors, int maxSpeed) {
        super(brand, year, numDoors);
        this.maxSpeed = maxSpeed;
    }

    public void turboBoost(){
        System.out.println("Sports car turbo boost!");
    }
}
