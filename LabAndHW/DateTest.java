class Date {
    
    private int day;
    private int month;
    private int year;
    
    public Date (int day, int month, int year){ //Con
        
        setDay(day);
        setMonth(month);
        setYear(year);
    }
    
    public int gatDay(){
        
        return day;
    }
    
    public int gatMonth(){
        
        return month;
    }
    
    public int gatYear(){
        
        return year;
    }
    
    public void setDay(int day){
        
        if (day<=31 && day>=1)
            this.day = day;
    }
    
    public void setMonth(int month){
        
        if (month<=12 && month>=1)
            this.month = month;
    }
    
    public void setYear(int year){
        
        if (year<=9999 && year>=1900)
            this.year = year;
    }
    
    public void setDate(int day, int month, int year){
        
        setDay(day);
        setMonth(month);
        setYear(year);
    }
    
    @Override
    public String toString(){
        
         return String.format("%02d/%02d/%04d", day, month, year);
    }
    
}

public class DateTest {
    
    public static void main(String args[]) {
        
        Date holiday = new Date(12,5,2025);
        Date errorday = new Date(122,50,2025);
        Date birthday = new Date(17,2,2006);
        Date date = new Date(20, 6, 2022);

        System.out.println(date.toString());
        System.out.println(holiday.toString());
        System.out.println(errorday.toString());
        System.out.println(birthday.toString());
        
  }
  
}



