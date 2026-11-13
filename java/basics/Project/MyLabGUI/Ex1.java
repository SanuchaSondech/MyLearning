package MyLabGUI;

import javax.swing.*;  // ใช้สำหรับ Swing Components

public class Ex1 {
    public static void main(String[] args) {
        // สร้างหน้าต่าง (JFrame)
        JFrame frame = new JFrame("My First Swing App");
        frame.setSize(400, 300);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // สร้างปุ่ม (JButton)
        JButton button = new JButton("Click Me!");

        // สร้างข้อความ (JLabel)
        JLabel label = new JLabel("Hello, Swing!", JLabel.CENTER);

        // กำหนด Layout เป็น BorderLayout (ค่า default)
        frame.setLayout(new java.awt.BorderLayout());

        // เพิ่มข้อความตรงกลาง
        frame.add(label, java.awt.BorderLayout.CENTER);

        // เพิ่มปุ่มด้านล่าง
        frame.add(button, java.awt.BorderLayout.SOUTH);

        // แสดงผลหน้าต่าง
        frame.setVisible(true);
    }
}