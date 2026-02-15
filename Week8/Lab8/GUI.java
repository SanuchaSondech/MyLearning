import javax.swing.*; // Import ไลบรารี Swing ทั้งหมด
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Color;


public class GUI {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                createAndShowGUI();
            }
        });

    }

    private static void createAndShowGUI() {
        // Create the JFrame
        JFrame frame = new JFrame("Greeting App"); 
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // ตั้งค่าให้โปรแกรมปิดเมื่อกดปุ่ม X 
        frame.setSize(500, 300); // กำหนดขนาดหน้าต่าง

        // Create a JPanel
        JPanel panel = new JPanel();
        panel.setBackground(new Color(0x90A9D7)); // ตั้งค่าสีพื้นหลังของ Panel 
        frame.add(panel); // เพิ่ม Panel เข้าไปใน Frame
        
        // Components
        JLabel nameLabel = new JLabel("Enter Your Name:"); // สร้างป้ายข้อความ
        panel.add(nameLabel); // เพิ่มป้ายข้อความลงใน Panel

        // JTextField
        JTextField nameField = new JTextField(15); // สร้างช่องกรอกข้อความ
        panel.add(nameField); // เพิ่มช่องกรอกข้อความลงใน Panel

        // JButton
        JButton greetButton = new JButton(); // สร้างปุ่ม
        greetButton.setText("Greet");
        panel.add(greetButton); // เพิ่มปุ่มลงใน Panel


        // When the button is clicked
        greetButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                
                String name = nameField.getText(); // ดึงข้อความจาก JTextField

                // ตรวจสอบว่าผู้ใช้กรอกชื่อหรือไม่
                if (name != null && !name.trim().isEmpty()) {
                    // พิมพ์คำทักทายออกทาง Console
                    System.out.println("Hi, " + name + "! Welcome to the GUI application.");
                    // หรือจะแสดงเป็น Dialog Box ก็ได้
                    JOptionPane.showMessageDialog(frame, "Hi, " + name + "! Welcome to the GUI application.");
                } else {
                    JOptionPane.showMessageDialog(frame, "Please enter your name.");
                }
            }
        });

        
        frame.setLocationRelativeTo(null); // ตั้งให้หน้าต่างอยู่ตรงกลางของหน้าจอ
        frame.setVisible(true); // ทำให้หน้าต่างมองเห็นได้
    }
}

