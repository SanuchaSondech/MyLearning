import java.util.Comparator;

public class SortByManAge implements Comparator<Car> {

    @Override
    public int compare(Car thisCar, Car otherCar) {
        int manuComp = thisCar.getManufacturer().compareTo(otherCar.getManufacturer());
        if (manuComp != 0) {
            return manuComp;
        } else {
            return Integer.compare(thisCar.getAge(), otherCar.getAge());
        }
    }
    
}
