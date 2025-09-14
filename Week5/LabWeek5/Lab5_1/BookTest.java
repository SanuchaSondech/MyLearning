package Lab5_1;

public class BookTest {
    
  public static void main (String [] args) {

    // Create an Author object 0
    Author a = new Author("CK","oakabc@gmail.com",'M');
    System.out.println(a);

    // Create a Book object 0
    Book b0 = new Book ("My name is CK", a, 100);
    System.out.println(b0);
    
    // Create an Author object 1
    Author a1 = new Author("ศุภณัฐ ไพโรหกุล", "suphanatpai@gxample.com", 'M');
    System.out.println(a1);

    // Create a Book object 1
    Book b1 = new Book ("BIOLOGY ชีววิทยา", a1, 501);
    System.out.println(b1);

    // Create a Book object 2
    Book b2 = new Book ("CHEMISTRY เคมี", a1, 246, 5);
    System.out.println(b2);

    // Create a Book object 3
    Book b3 = new Book ("ESSENTIAL BIOLOGY PLUS", a1, 272, 5);
    System.out.println(b3);

    }
}