package Lab5_2;

public class Staff extends Person {
    
    // Attributes of the Staff class
    private String school;
    private double pay;

    // Constructor with name, address, school, and pay
    public Staff(String name, String address, String school, double pay) {
        
        super(name, address);
        this.school = school;
        this.pay = pay;
        System.out.println("Invoke Staff(String name, String address, String school, double pay)");
    }

    // Gets the school of the staff
    public String getSchool() {
        return school;
    }

    // Sets the school of the staff
    public void setSchool(String school) {
        this.school = school;
    }

    // Gets the pay of the staff
    public double getPay() {
        return pay;
    }

    // Sets the pay of the staff
    public void setPay(double pay) {
        this.pay = pay;
    }

    @Override
    public String toString() {
        return String.format("%s[%s[name=%s,address=%s]school=%s,pay=%.2f]", 
            Staff.class.getName(),Person.class.getName(), getName(), getAddress(), school, pay);
    }

}
