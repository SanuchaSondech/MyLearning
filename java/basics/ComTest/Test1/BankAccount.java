package Test1;
public class BankAccount {

    // Attributes
    private String accountNumber ;
    private String accountHolderName ;
    private double balance ;

    // Constructor

    public BankAccount(String accountNumber, String accountHolderName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = initialBalance;
    }

    // Get AccountNumber
    public String getAccountNumber() {
        // ต้องมากกว่า 10 หลัก
        if (accountNumber.length() >= 10) {
            return accountNumber;
        } else {
            // ถ้าไม่ใช่ให้แสดงข้อความเตือน
            throw new IllegalArgumentException("หมายเลขบัญชีต้องมีความยาว 10 หลัก");
        }
    }

     // Get AccountHolderName
    public String getAccountHolderName() {
        return accountHolderName;
    }

    // Get Balance
    public double getBalance() {
        // ต้องมากกว่าหรือเท่ากับ 0 เท่านั้น
        if (balance >= 0) {
            return balance;
        } else {
            // ถ้าเป็นลบให้แสดงข้อความเตือน
            throw new IllegalStateException("ยอดเงินในบัญชีต้องไม่เป็นลบ");
        }
    }
    
    // deposit ฝากเงิน
    public void deposit(double amount) {

        // ต้องมากกว่า 0 เท่านั้น
        if (amount > 0) {
            System.out.println("Deposit :" + amount);
            balance += amount;
        } else if (amount <= 0) {

            // ถ้าไม่ใช่ให้แสดงข้อความเตือน
            System.out.println("จำนวนเงินที่ฝากต้องมากกว่า 0");
        }
    }

    // withdraw ถอนเงิน
    public void withdraw(double amount) {

        // ต้องมากกว่า 0 และ ต้องมีเงินมากกว่าหรือเท่ากับจำนวนที่ถอน
        if (amount <= 0) {
            System.out.println("จำนวนเงินที่ถอนต้องมากกว่า 0");
        } else if (amount > balance) {
            System.out.println("ยอดเงินในบัญชีไม่เพียงพอ");
        } else {
            System.out.println("Withdraw :" + amount);
            balance -= amount;
        }
    }

    public void checkBalance() {
        System.out.println("Current balance: " + balance);
    }

    // แสดงข้อมูลบัญชี
    @Override
    public String toString() {
        return String.format("BankAccount{accountNumber='%s', accountHolderName='%s', balance=%.2f}",
                accountNumber, accountHolderName, balance);
    }

}