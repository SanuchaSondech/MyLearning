package Lab5_2;

public class Person {
    
    // Attributes of the Person class
    private String name;
    private String address;

    // Constructor with name and address
    public Person(String name, String address) {
        
        System.out.println("Invoke Person(String name, String address)");
        this.name = name;
        this.address = address;
    }

    // Gets the name of the person
    public String getName() {
        return name;
    }

    // Sets the name of the person
    public String getAddress() {
        return address;
    }

    // Sets the address of the person
    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return String.format("%s[name=%s,address=%s]", 
            this.getClass().getName(), name, address);
    }
    
}
