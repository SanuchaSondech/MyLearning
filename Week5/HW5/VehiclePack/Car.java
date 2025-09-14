package VehiclePack;

public class Car extends Vehicle {
    
    private int numDoors;

    public Car(String brand, int year, int numDoors) {
        super(brand, year);
        this.numDoors = numDoors;
    }

    public void honk() {
        System.out.println("Car horn goes beep!");
    }
}
