 package Lab9;

public class Exceptions {
    public static void main(String[] args) {
      int num[]={1,2,3,4};

      try{
      System.out.println(num[5]);
      } catch (ArrayIndexOutOfBoundsException e) {
          System.out.println("Exception caught: " + e.getMessage());
      }
      System.out.println("Will this print ?");
    }
}
