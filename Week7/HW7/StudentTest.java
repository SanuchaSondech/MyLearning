public class StudentTest {

    public static void main(String[] args) {

        // สร้างตัวอย่างนักเรียน
        Student student1 = new Student("1111", "Soda", 3.5);
        Student student2 = new Student("1111", "Kong", 3.8);
        Student student3 = new Student("3333", "TonKa", 3.2);

        // ทดสอบ equals
        System.out.println("Student A and B are the same student: " + student1.equals(student2));
        System.out.println("Student A and C are the same student: " + student1.equals(student3)); 
        
    }
}