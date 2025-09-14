import java.util.Scanner;

public class Cipher {
    
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("กรุณาใส่ข้อความ : ");
        
        String text = input.nextLine();
        
        System.out.print("Secret Key : ");
        
        int key = input.nextInt();

        text = text.toLowerCase();
        
        char[] letters = text.toCharArray();
        
        String finalText = "" ;
        
        for (char c : letters) {
            
            if (c >= 'a' && c <= 'z') {
                int index = c - 'a';
                index = (index + key) % 26;
                if (index < 0) {
                    index += 26;
                }
                char finalLetter = (char) (index + 'a');
                finalText = finalText+finalLetter;
            
            } else if(c == ' '){
                finalText = finalText+' ';
            }
            
        }
        System.out.print(finalText);

       
    }
}