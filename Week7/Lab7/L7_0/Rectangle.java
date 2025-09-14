package L7_0;

public class Rectangle
{
   private double length;  // To hold length of rectangle
   private double width;  // To hold width of rectangle

   /**
    *  The constructor initialize rectangle's 
    *  length and width with default value    
    */

   public Rectangle()
   {
      length = 0;
      width = 0;
   }

   /**
    *  The constructor accepts the rectangle's  
    *  length and width.   
    */

   public Rectangle(double length, double width)
   {
      this.length = length;
      this.width = width;
   }

   /**
    *  The getArea method returns the area of 
    *  the rectangle.
    */

   public double getArea()
   {
      return getLength() * getWidth();
   }

    /**
     * @return the length
     */
    public double getLength() {
        return length;
    }

    /**
     * @return the width
     */
    public double getWidth() {
        return width;
    }
}