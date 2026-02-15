package Lab9;

import java.io.File;
import java.io.FileReader;
import java.io.FileNotFoundException; // เพิ่ม import นี้

public class Exceptionsssss {
    public static void main(String[] args) {

        try {
            File file = new File("E://file.txt");
            FileReader fr = new FileReader(file);
        } catch (FileNotFoundException e) {
            System.out.println("Exception caught: " + e.getMessage());
        }
        System.out.println("Will this print ?");
    }
}

