package Test2;

class Vehicle {

    // ประกาศตัวแปร
    private String vehicleId ;
    private String brand  ;
    private double dailyRate ;
    
    // constructor
    public Vehicle(String vehicleId, String brand, double dailyRate) {
        this.vehicleId = vehicleId;
        this.brand = brand;
        this.dailyRate = dailyRate;
    }

    // getter methods
    public String getVehicleId() {
        return vehicleId;
    }

    public String getBrand() {
        return brand;
    }

    public double getDailyRate() {
        return dailyRate;
    }

    // method คำนวนค่าบริการเช่า
    public String calculateRentalCost(int days) {
        double totalCost = days * dailyRate;
        return String.format("Rental cost for %d days: %.2f"
        , days, totalCost);
    }

    @Override
    public String toString() {
        return String.format("Details: ID: %s, Brand: %s, Daily Rate: %.2f", vehicleId, brand, dailyRate);
    }

}

class Car extends Vehicle{

    // ประกาศตัวแปรเฉพาะของ Car
    private int numberOfSeats;

    // constructor
    public Car(String vehicleId, String brand, double dailyRate, int numberOfSeats) {
        super(vehicleId, brand, dailyRate);
        this.numberOfSeats = numberOfSeats;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    @Override
    public String toString() {
        return String.format("Details: ID: %s, Brand: %s, Daily Rate: %.2f, Seats: %d",
                getVehicleId(), getBrand(), getDailyRate(), numberOfSeats);
    }

}

public class RentalService {
    public static void main(String[] args) {
        
        //  สร้างออบเจกต์ของ Car
        Car car1 = new Car("C001", "Toyota", 55.00, 5);

        // Details ของ car1
        System.out.println(car1.toString());

        // คำนวนค่าบริการเช่า
        String rentalCost = car1.calculateRentalCost(4);
        System.out.println(rentalCost);
    }
}
