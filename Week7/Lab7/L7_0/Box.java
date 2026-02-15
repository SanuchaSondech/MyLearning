package L7_0;

class Box extends Rectangle
{
   private double height;  // To hold height of the box

   /**
    *  The constructor initialize box's 
    *  length, width and height with default value.  
    */

   public Box()
   {
      // Call the superclass default constructor to
      // initialize length and width.
      super();
      //Initialize height.
      height = 0;
   }

   /**
    *  The constructor accepts the box's  
    *  length, width and height.   
    */

    public Box(double length, double width, double height)
    {
      // Call the superclass constructor to
      // initialize length and width.
      super(length, width);
      
      // Initialize height.
      this.height = height;
   }

   /**
    *  The getVolume method returns the volume of 
    *  the box.
    */

   public double getVolume()
   {
      return getArea() * height;
   }
   
   public double getArea()
{
    return  2 * (getLength() * getWidth()
                 + getLength() * height 
                 + getWidth() * height);
}

}
