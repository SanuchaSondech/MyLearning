public class Car implements Comparable<Car>{

    private String manufacturer; // ยี่ห้อรถ
    private int age; // อายุรถ

    // Constructor
    public Car(String manufacturer, int age) {
        this.manufacturer = manufacturer;
        this.age = age;
    }

    // Getter for manufacturer
    public String getManufacturer() {
        return manufacturer;
    }
    //  param manufacturer the manufacturer to set
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    // return the age
    public int getAge() {
        return age;
    }

    //  param age the age to set
    public void setAge(int age) {
        this.age = age;
    }

    @Override
       public int compareTo(Car otherCar) {
        // เปรียบเทียบรถตามยี่ห้อ
        return this.manufacturer.compareTo(otherCar.getManufacturer());
    }

     @Override
    public String toString () {
        return "Car[age = " + age +", manufacture = " + manufacturer +"]";
    }

}
