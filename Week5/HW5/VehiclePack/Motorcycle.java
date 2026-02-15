package VehiclePack;

public class Motorcycle extends Vehicle {
    
    private boolean hasSidecar;

    public Motorcycle(String brand, int year, boolean hasSidecar) {
        super(brand, year);
        this.hasSidecar = hasSidecar;
    }

    public void revEngine() {
        System.out.println("Motorcycle engine revs!");
    }
    
}
