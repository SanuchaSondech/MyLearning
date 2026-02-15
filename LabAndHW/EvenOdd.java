import java.util.Scanner;

public class EvenOdd {
    
  public static void main(String args[]) {
  Scanner input = new Scanner(System.in);

  System.out.print("Enter int number : ");
  int number = input.nextInt();
  
  if(number % 2 == 0 ) {
      
      System.out.printf("%d is Even", number);
      
  }else {
      
      System.out.printf("%d is Odd", number);
      
  }
  
  
  }
  
}