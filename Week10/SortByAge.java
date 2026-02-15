import java.util.Comparator;

public class SortByAge implements Comparator<Car> {

    @Override
    public int compare(Car thisCar, Car otherCar) {
        return Integer.compare(thisCar.getAge(), otherCar.getAge());
    }

}