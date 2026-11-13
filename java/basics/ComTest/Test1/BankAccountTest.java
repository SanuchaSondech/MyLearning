package Test1;
public class BankAccountTest {

    public static void main(String[] args) {
        
        BankAccount account = new BankAccount("6752300542", "John Doe", 1000.0);

        // ทดสอบ get
        System.out.println("Account Number: " + account.getAccountNumber());
        System.out.println("Account Holder Name: " + account.getAccountHolderName());
        System.out.println("Account Balance: " + account.getBalance());

        account.checkBalance();
        account.deposit(500.0);
        account.checkBalance();
        account.withdraw(200.0);
        account.checkBalance();
        account.withdraw(100000.0); // This should throw an exception
        account.checkBalance();
        account.deposit(-50.0); // This should print an error message
        account.checkBalance();

        System.out.println(account.toString());

        BankAccount invalidAccount = new BankAccount("123456789", "Jane", -100.0);

        System.out.println("Invalid Account Number: " + invalidAccount.getAccountNumber());
        System.out.println("Invalid Account Holder Name: " + invalidAccount.getAccountHolderName());
        System.out.println("Invalid Account Balance: " + invalidAccount.getBalance());

    }
    
}
