package L6_2;

public abstract class Shape {

    public abstract double getArea();

    public abstract double getPerimeter();
    
    public void printInfo() {
        System.out.println("Area : " + getArea());
        System.out.println("Perimeter : " + getPerimeter());
    }
}
