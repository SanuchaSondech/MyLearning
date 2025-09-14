class Account {
    
    /// ทำเพิ่มเติมเพื่อเก็บข้อมูล
    private double balance;
    
    public Account(double initialBalance) {
        if (initialBalance > 0.0){
            balance=initialBalance;
        } else {
            balance = 0.0;
            System.out.println("Initial balance can't be negative. Set to 0.");
        }
    }
    
    public void deposit(double amount){ /// การเพิ่มเงินเข้าบัญชี
        if (amount > 0.0){
            balance=balance+amount;
        }else {
            System.out.printf("%.2f can't be negative %n",amount);
        }    
    }
    
    public void withdraw(double amount){ /// การถอนเงินออกบัญชี
        if (amount > 0.0 && balance>=amount){
            balance=balance-amount;
        }else if (!(balance>=amount)){
            System.out.println("balance is not enough");
        }else {
            System.out.printf("%.2f can't be negative %n",amount);
        }    
    }
    
    public double getBalance(){ /// ดูยอดเงินในบัญชี
        return balance;
    }
}

public class L3_3Account {
    
    public static void main (String [] args) {
        
        Account me = new Account(100); //เงิน 100
        me.deposit(300); // เงิน 100+300 = 400
        System.out.println(me.getBalance()); 
        me.withdraw(500); // เกินวงเงิน
        System.out.println(me.getBalance());    
        
    }
}
