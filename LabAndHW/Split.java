import java.util.Scanner;

public class Split {
    
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);

        String num = input.nextLine();

        String number = num.replace("-", "");

        System.out.println(number);

    }
}