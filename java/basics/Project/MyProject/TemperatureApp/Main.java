package MyProject.TemperatureApp;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            TempView view = new TempView();
            TempModel model = new TempModel();
            TempController controller = new TempController(view, model);
        });
    }
}