package Lab5_2;

public class Student extends Person {

    // Attributes of the Student class
    private String program;
    private int year;
    private double fee;

    // Constructor with name, address, program, year, and fee
    public Student(String name, String address, String program, int year, double fee) {
        
        super(name, address); // Call the constructor of the Person class
        this.program = program;
        this.year = year;
        this.fee = fee;
        System.out.println("Invoke Student(String name, String address, String program, int year, double fee)");
    }

    // Gets the program of the student
    public String getProgram() {
        return program;
    }

    // Sets the program of the student
    public void setProgram(String program) {
        this.program = program;
    }

    // Gets the year of the student
    public int getYear() {
        return year;
    }

    // Sets the year of the student
    public void setYear(int year) {
        this.year = year;
    }

    // Gets the fee of the student
    public double getFee() {
        return fee;
    }

    // Sets the fee of the student
    public void setFee(double fee) {    
        this.fee = fee;
    }

    @Override
    public String toString() {
        return String.format("%s[%s[name=%s,address=%s]program=%s,year=%d,fee=%.2f]", 
            Student.class.getName(),Person.class.getName(), getName(), getAddress(), program, year, fee);
    }
    

}
