package Lab9;

interface GeometricObject{

    double getPerimeter();
    double getArea();
    
}

interface Resizable {

    void resize(int percent);
}

class Circle implements GeometricObject {

    protected double radius = 1.0;

    public Circle(double radius) {
        if (radius < 0) {
            throw new IllegalArgumentException("Radius must be non-negative");
        }
        this.radius = radius;
    }

    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }

    public double getArea() {
        return Math.PI * radius * radius;
    }
}

class ResizableCircle extends Circle implements Resizable {

    public ResizableCircle(double radius) {
        super(radius);
    }

    @Override
    public void resize(int percent) {
        if (percent <= 0){
            throw new IllegalArgumentException("Resize percent must be positive");
        }
        radius = radius * percent / 100.0;
    }
}

public class TestCircle {
    public static void main(String[] args) {

        try {
            Circle circle1 = new Circle(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Exception caught: " + e.getMessage());
            
        }

        try {
            ResizableCircle circle2 = new ResizableCircle(5);
            circle2.resize(-10);

        }catch (IllegalArgumentException e) {
            System.out.println("Exception caught: " + e.getMessage());
        }
    }
}

