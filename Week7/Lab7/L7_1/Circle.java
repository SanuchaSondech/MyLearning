package L7_1;

public class Circle extends Shape {

protected double radius;

    public Circle() {
        super();
    }

    public Circle(double radius) {
        super();
        this.radius = radius;
    }

    public Circle(double radius, String color, boolean filled) {
        super(color, filled);
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public double getArea() {
        return Math.PI * radius * radius;
    }

    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }

    public String toString() {
        return String.format("A Circle with radius=%.2f, which is a subclass of %s", radius, super.toString());
    }

     /**
     * เปรียบเทียบความเท่ากันของวงกลมโดย radius, filled, color ต้องเท่ากัน
     * @param c1
     * @return 
     */
    public boolean equals(Object c1) {
        
        Circle that = (Circle) c1; // Downcasting
        
        return this.radius == that.radius && this.color.equals(that.color) && this.filled == that.filled;
    }
    
    @Override
    public int hashCode() {
        int hash = 7;
        hash = 13 * hash + (int) (Double.doubleToLongBits(this.radius) ^ (Double.doubleToLongBits(this.radius) >>> 32));
        return hash;
    }
    
}
