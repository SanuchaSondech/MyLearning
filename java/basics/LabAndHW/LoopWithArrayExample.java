public class LoopWithArrayExample {
    public static void main(String[] args) {
        int[] numbers = {111, 222, 333, 444, 555};
        int sum = 0;
            
        for (int i = 0 ; i < numbers.length ; i=i+1) {
                
            sum = sum + numbers[i];    
            
        }

        System.out.println(sum);
            
            
    }
}
