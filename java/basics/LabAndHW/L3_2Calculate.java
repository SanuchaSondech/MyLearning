class Calculate {

    public static double calculateAverage (int[] numbers) {
    
      double sum = 0;
    
        for (int i : numbers){
        
            sum = sum+i;
        
        }
    
         return  sum / numbers.length; 
    }
    
    public static int add(int a, int b) {
    
         return  a+b;
    }
    
    public static int subtract(int a, int b) {
    
         return  a-b;
    }
    
    public static int multiply(int a, int b) {
    
         return  a*b;
    }
    
    public static double divide(double a, int b) {
         
        if (b==0){
            return -1;
        } else{   
            return  a/b;}
    }
    
}

public class L3_2Calculate {

    public static void main (String [] args) {

    int [ ] arr = {1,2,3,4,5,6,7,8,9,10};
    
    double Average = Calculate.calculateAverage(arr);
    
    System.out.println("Average is : " + Average);
    
    System.out.println("3 add 2 is : " + Calculate.add(3, 2));
    
    System.out.println("3 subtract 2 is : " + Calculate.subtract(3, 2));
    
    System.out.println("3 multiply 2 is : " + Calculate.multiply(3, 2));
    
    System.out.println("3 divide 2 is : " + Calculate.divide(3, 2));
    System.out.println("3 divide 0 is : " + Calculate.divide(3, 0));
    
    
    }
}