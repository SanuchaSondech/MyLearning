package VehiclePack;

public class ElectricCar extends Car {

    private double batteryCapacity;

    public ElectricCar(String brand, int year, int numDoors, double batteryCapacity) {
        super(brand, year, numDoors);
        this.batteryCapacity = batteryCapacity;
    }

    public void charge() {
        System.out.println("Electric car is charging.");
    }
    
}
