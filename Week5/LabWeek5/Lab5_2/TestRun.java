package Lab5_2;

public class TestRun {
    public static void main(String[] args){

        //Create Staff object
        System.out.println ("======== Staff1 ============================");    
        Staff Kongg = new Staff("Kongpop Suksap", "80/1 PIM Nonthaburi", "PIM", 1000000);
        System.out.println(Kongg);

        //Create Student object 1
        System.out.println ("======== Student1 ============================");
        Student Phai = new Student("Thanachaporn Chuaynak", "85/1 PIM Nonthaburi", "CAI",20, 2800000);
        System.out.println(Phai);
        
        //Create Student object 2
        System.out.println ("======== Student2 ============================");
        Student Mark = new Student("Mark lnwza", "85/2 PIM Nonthaburi", "CAI", 19, 2500000);
        System.out.println(Mark);

        //Create Student object 3
        System.out.println ("======== Student3 ============================");
        Student Ice = new Student("Ice Bear", "85/3 PIM Nonthaburi", "CAI", 18, 3000000);
        System.out.println(Ice);

        //Create Person object 1
        System.out.println ("======== Person1 ============================");
        Person John = new Person("John Doe", "75/1 PIM Nonthaburi");
        System.out.println(John);
    }
    
}
