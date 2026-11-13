package MyLabGUI;

import javax.swing.*;
import java.awt.*;

// Model
class UserModel {
    private String name;

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}

// View

class UserView extends JFrame {
    JTextField nameField = new JTextField(15);
    JButton greetButton = new JButton("Greet");

    public UserView() {
        setTitle("Greeting App - MVC");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        panel.add(new JLabel("Enter your name:"));
        panel.add(nameField);
        panel.add(greetButton);
        panel.setPreferredSize(new Dimension(350, 150));

        add(panel);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public String getUserInput() {
        return nameField.getText();
    }
}

// Controller
class UserController {
    private UserModel model;
    private UserView view;

    public UserController(UserModel model, UserView view) {
        this.model = model;
        this.view = view;

        this.view.greetButton.addActionListener(e -> onGreetButtonClick());
    }

    private void onGreetButtonClick() {
        String name = view.getUserInput();
        model.setName(name);
        JOptionPane.showMessageDialog(view, "Hello, " + model.getName() + "!");
    }
}

public class Ex2MVC {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            UserModel model = new UserModel();
            UserView view = new UserView();
            new UserController(model, view);
        });
    }
}