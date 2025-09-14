import java.util.Scanner;
public class StudentID {
    public static void main(String[] args) {     
        Scanner input = new Scanner(System.in);   
        
        System.out.print("Input your ID : ");
        String id = input.nextLine();
        
        
        if (id.length() == 10) {
            System.out.print("รหัสนักศึกษาถูกต้อง");
        } else {
            System.out.print("โปรดลองใส่อีกครั้ง");
        }
        
    }
}