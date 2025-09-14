import java.util.Comparator;

public class SortByMan implements Comparator<Car>{

    @Override
    public int compare(Car thisCar, Car otherCar) {
        return thisCar.getManufacturer().compareTo(otherCar.getManufacturer());
    }

}