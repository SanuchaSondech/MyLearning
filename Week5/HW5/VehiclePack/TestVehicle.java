package VehiclePack;

public class TestVehicle {

    public static void main(String[] args){

        //สร้างอ็อบเจ็กต์ของแต่ละคลาส
        Vehicle aVehicle = new Vehicle("Generic", 2020);
    
        Car aCar = new Car("Toyota", 2021, 4);
        
        ElectricCar anElectricCar = new ElectricCar("Tesla", 2022, 4, 75.0);
        
        SportsCar aSportsCar = new SportsCar("Ferrari", 2023, 2, 350);  

        Motorcycle aMotorcycle = new Motorcycle("Harley-Davidson", 2021, false);

        //เรียกใช้เมธอดของแต่ละอ็อบเจ็กต์
        aVehicle.move();
        aCar.honk();
        anElectricCar.charge();
        aVehicle.move();
        aCar.honk();
        aSportsCar.turboBoost();
        aVehicle.move();
        aMotorcycle.revEngine();
    }
}
