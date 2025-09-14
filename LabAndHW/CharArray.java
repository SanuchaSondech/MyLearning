import java.util.Scanner;

public class CharArray {
    
    public static void main(String[] args) {
        
        Scanner input = new Scanner (System.in);
         
        String name = input.nextLine();
        
        name = name.replace(" ", "");
        
        char[] charName = name.toCharArray();

        for (char c : charName) {
            
                System.out.println(c);
        }
        
    }
}