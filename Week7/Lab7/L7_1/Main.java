package L7_1;

public class Main {
    public static void main(String[] args) {
        
        Shape s1 = new Circle(5.5, "RED", false);  // Upcast Circle to Shape
        System.out.println(s1);  // A Circle with radius = 5.5, which is a subclass of A Shape with color of RED and not filled
        System.out.println(s1.getClass().getName()); // Circle
        System.out.println(s1.hashCode()); // 1252169911
        System.out.println(s1.getClass() == Shape.class); // false
        System.out.println(s1.getClass() == Circle.class); // true
        System.out.println(s1 instanceof Shape); // true
        System.out.println(s1 instanceof Circle); // true
        System.out.println(s1.getArea());          // 95.03317777109125
        System.out.println(s1.getPerimeter());     // 34.55751918948772
        System.out.println(s1.getColor()); // RED
        System.out.println(s1.isFilled()); // false
        //System.out.println(s1.getRadius()); 

        Circle c1 = (Circle) s1;                   // Downcast back to Circle
        System.out.println(c1);
        System.out.println(c1.hashCode());
        System.out.println(c1.getClass().getName());
        System.out.println(c1 instanceof Shape);
        System.out.println(c1 instanceof Circle);
        //System.o ut.println(c1.getArea());
        System.out.println(c1.getPerimeter());
        System.out.println(c1.getColor());
        System.out.println(c1.isFilled());
        System.out.println(c1.getRadius());

        //   Shape s2 = new Shape();
        Shape s3 = new Rectangle(1.0, 2.0, "RED", false);   // Upcast
        System.out.println(s3);
        System.out.println(s3.hashCode());
        System.out.println(s3.getClass().getName());
        System.out.println(s3 instanceof Shape);
        System.out.println(s3 instanceof Rectangle);
        System.out.println(s3.getArea());
        System.out.println(s3.getPerimeter());
        System.out.println(s3.getColor());
        //System.out.println(s3.getLength());

        Rectangle r1 = (Rectangle) s3;   // downcast
        System.out.println(r1);
        System.out.println(r1.hashCode());
        System.out.println(r1.getClass().getName());
        System.out.println(r1 instanceof Shape);
        System.out.println(r1 instanceof Rectangle);
        System.out.println(r1.getArea());
        System.out.println(r1.getColor());
        System.out.println(r1.getLength());

        Shape s4 = new Square(6.6);     // Upcast
        System.out.println(s4);
        System.out.println(s4.hashCode());
        System.out.println(s4.getClass().getName());
        System.out.println(s4 instanceof Shape);
        System.out.println(s4 instanceof Rectangle);
        System.out.println(s4 instanceof Square);
        System.out.println(s4.getArea());
        System.out.println(s4.getColor());
        //System.out.println(s4.getSide());

// Take note that we downcast Shape s4 to Rectangle, 
//  which is a superclass of Square, instead of Square
        Rectangle r2 = (Rectangle) s4;
        System.out.println(r2);
        System.out.println(r2.hashCode());
        System.out.println(r2.getClass().getName());
        System.out.println(r2 instanceof Shape);
        System.out.println(r2 instanceof Rectangle);
        System.out.println(r2 instanceof Square);
        System.out.println(r2.getArea());
        System.out.println(r2.getColor());
        //System.out.println(r2.getSide());
        System.out.println(r2.getLength());

// Downcast Rectangle r2 to Square
        Square sq1 = (Square) r2;
        System.out.println(sq1);
        System.out.println(sq1.hashCode());
        System.out.println(sq1.getClass().getName());
        System.out.println(sq1 instanceof Shape);
        System.out.println(sq1 instanceof Rectangle);
        System.out.println(sq1 instanceof Square);
        //System.out.println(sq1 instanceof Circle);
        System.out.println(sq1.getArea());
        System.out.println(sq1.getColor());
        System.out.println(sq1.getSide());
        System.out.println(sq1.getLength());

    }

}
