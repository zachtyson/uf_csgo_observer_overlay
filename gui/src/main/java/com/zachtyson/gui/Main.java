package com.zachtyson.gui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;
import java.util.Objects;
import java.io.*;
import java.io.FileWriter;
import java.nio.file.Files;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicBoolean;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;

public class Main extends Application {

    @Override
    public void start(Stage stage) throws IOException {
        Parent root = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("main-page.fxml")));
        StartTabController startTabController = new StartTabController();
        startTabController.setCloseBehavior(stage);
        Scene scene = new Scene(root, 800, 800);
        scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource("styles.css")).toExternalForm());
        stage.setTitle("CSGO Observer Overlay GUI");
        stage.setScene(scene);
        stage.show();
    }

    public static void writeJsonToFile(String jsonData, String filename) throws IOException {
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(jsonData);
            System.out.println("JSON data written to file: " + filename);
        } catch (IOException e) {
            throw new IOException("Unable to write JSON data to file: " + filename, e);
        }
    }


    public static void main(String[] args) {
        System.setProperty("java.library.path", "path/to/your/native/libs");
        launch(args);
    }
}

//public class Main {
//
//    public static void main(String[] args) {
//        new Main();
//    }
//
//    public Main() {
//        // Settings
//        JPanel panel2 = new JPanel(new GridLayout(10, 2));
//
//        JLabel portLabel = new JLabel("Port:");
//        JTextField portField = new JTextField("25566");
//        portField.setEditable(false);
//        panel2.add(portLabel);
//        panel2.add(portField);
//
//        JLabel hostLabel = new JLabel("Host:");
//        JTextField hostField = new JTextField("127.0.0.1");
//        hostField.setEditable(false);
//        panel2.add(hostLabel);
//        panel2.add(hostField);
//
//        JLabel teamOneNameLabel = new JLabel("Team One Name:");
//        JTextField teamOneNameField = new JTextField();
//        panel2.add(teamOneNameLabel);
//        panel2.add(teamOneNameField);
//
//        JLabel teamOneLogoLabel = new JLabel("Team One Logo:");
//        JButton teamOneLogoButton = new JButton("Select Team One Logo");
//        AtomicReference<String> teamOneLogo = new AtomicReference<>("");
//        teamOneLogoButton.addActionListener(e -> {
//            JFileChooser fileChooser = new JFileChooser();
//            int returnValue = fileChooser.showOpenDialog(null);
//            if (returnValue == JFileChooser.APPROVE_OPTION) {
//                File selectedFile = fileChooser.getSelectedFile();
//                try {
//                    teamOneLogo.set(getBase64(selectedFile));
//                    teamOneLogoButton.setText(selectedFile.getName());
//                } catch (IOException ex) {
//                    ex.printStackTrace();
//                }
//            }
//        });
//        panel2.add(teamOneLogoLabel);
//        panel2.add(teamOneLogoButton);
//
//        JLabel teamTwoNameLabel = new JLabel("Team Two Name:");
//        JTextField teamTwoNameField = new JTextField();
//        panel2.add(teamTwoNameLabel);
//        panel2.add(teamTwoNameField);
//
//
//        JLabel teamTwoLogoLabel = new JLabel("Team Two Logo:");
//        JButton teamTwoLogoButton = new JButton("Select Team Two Logo");
//        AtomicReference<String> teamTwoLogo = new AtomicReference<>("");
//        teamTwoLogoButton.addActionListener(e -> {
//            JFileChooser fileChooser = new JFileChooser();
//            int returnValue = fileChooser.showOpenDialog(null);
//            if (returnValue == JFileChooser.APPROVE_OPTION) {
//                File selectedFile = fileChooser.getSelectedFile();
//                try {
//                    teamTwoLogo.set(getBase64(selectedFile));
//                    teamTwoLogoButton.setText(selectedFile.getName());
//                } catch (IOException ex) {
//                    ex.printStackTrace();
//                }
//            }
//        });
//        panel2.add(teamTwoLogoLabel);
//        panel2.add(teamTwoLogoButton);
//
//        JLabel teamOneStartingSideLabel = new JLabel("Team One Starting Side:");
//        String[] sides = { "CT", "T" };
//        JComboBox<String> teamOneStartingSideComboBox = new JComboBox<>(sides);
//        panel2.add(teamOneStartingSideLabel);
//        panel2.add(teamOneStartingSideComboBox);
//
//        JLabel bombTimerLabel = new JLabel("Bomb Timer:");
//        JTextField bombTimerField = new JTextField("40"); // default to 40
//        panel2.add(bombTimerLabel);
//        panel2.add(bombTimerField);
//
//        JTextArea outputArea2 = new JTextArea("");
//        outputArea2.setEditable(false);
//        JScrollPane scrollPane2 = new JScrollPane(outputArea2);
//

//
//        panel2.add(createButton);
//        panel2.add(scrollPane2);
//
//        //JButton gameLocationButton = new JButton("Select Directory");
//        //        gameLocationButton.setAlignmentX(Component.CENTER_ALIGNMENT);
//        //        gameLocationButton.setBackground(Color.LIGHT_GRAY);
//        //
//        //        JFileChooser gameDirectoryChooser = new JFileChooser();
//        //        gameDirectoryChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
//        //
//        //        // Add ActionListener to JButton
//        //        gameLocationButton.addActionListener(e -> {
//        //            int returnValue = gameDirectoryChooser.showOpenDialog(null);
//        //            if (returnValue == JFileChooser.APPROVE_OPTION) {
//        //                File selectedDirectory = gameDirectoryChooser.getSelectedFile();
//        //                gameLocationButton.setText(selectedDirectory.getName());
//        //            }
//        //        });
//        JTextArea outputArea3 = new JTextArea("");
//        outputArea3.setEditable(false);
//        JScrollPane scrollPane3 = new JScrollPane(outputArea3);
//
//        JButton importConfig = new JButton("Import Config");
//        JFileChooser importConfigChooser = new JFileChooser();
//        importConfigChooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
//        importConfig.addActionListener(e -> {
//            int returnValue = importConfigChooser.showOpenDialog(null);
//            File selectedGameConfig = null;
//            if (returnValue == JFileChooser.APPROVE_OPTION) {
//                selectedGameConfig = importConfigChooser.getSelectedFile();
//                importConfig.setText(selectedGameConfig.getName());
//            }
//            try {
//                if(selectedGameConfig == null) {
//                    throw new NullPointerException("Selected game config is null.");
//                }
//                FileReader reader = new FileReader(selectedGameConfig);
//                Gson gson = new Gson();
//                ConfigData configObj = gson.fromJson(reader, ConfigData.class);
//                String cfg = createConfigFile(
//                        configObj.teamData.teamOneName,
//                        configObj.teamData.teamTwoName,
//                        configObj.teamData.teamOneLogo,
//                        configObj.teamData.teamTwoLogo,
//                        configObj.teamData.teamOneStartingSide,
//                        configObj.teamData.bombTime);
//                writeJsonToFile(cfg, "config.json");
//                reader.close();
//            }
//            catch (JsonSyntaxException ex)  {
//                System.out.println("Error: Invalid JSON syntax.");
//                outputArea3.setText("Error: Invalid JSON syntax.");
//            }
//            catch (JsonIOException ex) {
//                System.out.println("Error: Invalid JSON IO.");
//                outputArea3.setText("Error: Failed to read JSON.");
//            }
//            catch (NullPointerException ex) {
//                //User opened file chooser but didn't select a file
//                System.out.println("Error: No file selected.");
//            }
//            catch (FileNotFoundException ex) {
//                System.out.println("Error: File not found.");
//                outputArea3.setText("Error: File not found.");
//            }
//            catch (Exception ex) {
//                System.out.println("Error: Failed to import config.");
//                outputArea3.setText("Error: Failed to import config.");
//                ex.printStackTrace();
//            }
//        });
//
//        panel2.add(importConfig);
//        LayoutManager layout = new BoxLayout(frame.getContentPane(), BoxLayout.Y_AXIS);
//        frame.setLayout(layout);
//        panel2.add(scrollPane3);
//
//        // Create components
//        JLabel gameLocationLabel = new JLabel("Select Game Location:");
//        gameLocationLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
//        gameLocationLabel.setFont(new Font("Arial", Font.BOLD, 18));
//
//        JButton gameLocationButton = new JButton("Select Directory");
//        gameLocationButton.setAlignmentX(Component.CENTER_ALIGNMENT);
//        gameLocationButton.setBackground(Color.LIGHT_GRAY);
//
//        JFileChooser gameDirectoryChooser = new JFileChooser();
//        gameDirectoryChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
//
//        // Add ActionListener to JButton
//        gameLocationButton.addActionListener(e -> {
//            int returnValue = gameDirectoryChooser.showOpenDialog(null);
//            if (returnValue == JFileChooser.APPROVE_OPTION) {
//                File selectedDirectory = gameDirectoryChooser.getSelectedFile();
//                gameLocationButton.setText(selectedDirectory.getName());
//            }
//        });
//
//        JButton cfgButton = new JButton("Generate cfg file in game");
//        cfgButton.setAlignmentX(Component.CENTER_ALIGNMENT);
//        cfgButton.setBackground(Color.LIGHT_GRAY);
//
//        // Create a JPanel with a border
//        JPanel panel3 = new JPanel();
//        panel3.setLayout(new BoxLayout(panel3, BoxLayout.Y_AXIS));
//        panel3.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10)); // padding
//
//        // Add components to panel
//        panel3.add(gameLocationLabel);
//        panel3.add(Box.createRigidArea(new Dimension(0, 10))); // Add space
//        panel3.add(gameLocationButton);
//        panel3.add(Box.createRigidArea(new Dimension(0, 10))); // Add space
//        panel3.add(cfgButton);
//    }
//
//}
