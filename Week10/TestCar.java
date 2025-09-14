import java.util.*;

public class TestCar {
    public static void main(String[] args) {
        
        // create 10 Car objects
        Car car1 = new Car("AA", 11);
        Car car2 = new Car("BB", 22);
        Car car3 = new Car("GG", 77);
        Car car4 = new Car("EE", 55);
        Car car5 = new Car("DD", 44);
        Car car6 = new Car("FF", 66);
        Car car7 = new Car("CC", 33);
        Car car8 = new Car("GG", 88);
        Car car9 = new Car("BB", 22);
        Car car10 = new Car("JJ", 11);

        // create a TreeSet to store the cars
        ArrayList<Car> carList = new ArrayList<>();
        // add cars to the list
        carList.add(car1);
        carList.add(car2);
        carList.add(car3);
        carList.add(car4);
        carList.add(car5);
        carList.add(car6);
        carList.add(car7);
        carList.add(car8);
        carList.add(car9);
        carList.add(car10);

        // print the cars in the list
        for (Car car : carList) {
            System.out.println(car);
        }

        // Use SortByMan Comparator
        Collections.sort(carList, new SortByMan());

        System.out.println("Sort by Manufacturer:");
        
        // print the cars in the list
        for (Car car : carList) {
            System.out.println(car);
        }

        // Use SortByAge Comparator
        Collections.sort(carList, new SortByAge());

        System.out.println("Sort by Age:");

        // print the cars in the list
        for (Car car : carList) {
            System.out.println(car);
        }

        // Use SortByManAge Comparator
        Collections.sort(carList, new SortByManAge());

        System.out.println("Sort by Manufacturer and Age:");

        // print the cars in the list
        for (Car car : carList) {
            System.out.println(car);
        }

    }
}