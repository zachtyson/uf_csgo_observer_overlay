package com.zachtyson.gui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;
import java.util.Objects;
import java.io.*;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.annotations.SerializedName;

public class GUIApplication extends Application {
    private static final String EXE_FILE_1 = "frontend/frontend.exe";
    private static final String EXE_FILE_2 = "backend/backend.exe";

    private Process process1;
    private Process process2;
    private Thread processThread1;
    private Thread processThread2;
    private String host = "http://localhost";
    private int port = 25566;
    private AtomicBoolean isFrontendRunning = new AtomicBoolean(false);
    private AtomicBoolean isBackendRunning = new AtomicBoolean(false);

    public static String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return ""; // Empty extension
        }
        return name.substring(lastIndexOf + 1).toLowerCase();
    }

    private String getBase64(File file) throws IOException {
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        return "data:image/" + getFileExtension(file) + ";base64," + Base64.getEncoder().encodeToString(fileBytes);
    }

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(GUIApplication.class.getResource("hello-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 800, 800);
        scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource("styles.css")).toExternalForm());
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }

    private void executeProcess(String fileName, int processNumber) {
        File exeFile = new File(fileName);
        if (exeFile.exists() && !exeFile.isDirectory()) {
            try {
                Process process = Runtime.getRuntime().exec(fileName);
                if (processNumber == 1) {
                    process1 = process;
                } else if (processNumber == 2) {
                    process2 = process;
                }

                Thread processThread = new Thread(() -> {
                    BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                    String line;
                    try {
                        while ((line = input.readLine()) != null && !Thread.currentThread().isInterrupted()) {
                            System.out.println(line);
                        }
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                });
                if(processNumber == 1) {
                    processThread1 = processThread;
                } else if (processNumber == 2) {
                    processThread2 = processThread;
                }
                processThread.start();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        } else {
            System.out.println("File '" + fileName + "' does not exist");
        }
    }

    private void stopProcess(int processNumber) {
        System.out.println("Stopping '" + (processNumber == 1 ? EXE_FILE_1 : EXE_FILE_2) + "'");
        if (processNumber == 1 && process1 != null) {
            process1.destroy();
            if (processThread1 != null && processThread1.isAlive()) {
                processThread1.interrupt();
                processThread1 = null;
            }
            System.out.println("Stopped '" + EXE_FILE_1 + "'");
        } else if (processNumber == 2 && process2 != null) {
            process2.destroy();
            if (processThread2 != null && processThread2.isAlive()) {
                processThread2.interrupt();
                processThread2 = null;
            }
            System.out.println("Stopped '" + EXE_FILE_2 + "'");
        }
    }

    private String createConfigFile(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo,
                                    String teamOneStartingSide, int bombTime) {
        ApplicationData applicationData = new ApplicationData("info", port, host);
        TeamData teamData = new TeamData(teamOneName, teamTwoName, teamOneLogo, teamTwoLogo, teamOneStartingSide, bombTime);
        ConfigData configData = new ConfigData(applicationData, teamData);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(configData);
    }

    private static void writeJsonToFile(String jsonData, String filename) throws IOException {
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(jsonData);
            System.out.println("JSON data written to file: " + filename);
        } catch (IOException e) {
            throw new IOException("Unable to write JSON data to file: " + filename, e);
        }
    }
    static class ConfigData {
        @SerializedName("application")
        private ApplicationData application;

        @SerializedName("team_data")
        private TeamData teamData;

        public ConfigData(ApplicationData application, TeamData teamData) {
            this.application = application;
            this.teamData = teamData;
        }
    }

    static class TeamData {
        @SerializedName("teamOneName")
        private String teamOneName;

        @SerializedName("teamOneLogo")
        private String teamOneLogo;

        @SerializedName("teamTwoName")
        private String teamTwoName;

        @SerializedName("teamTwoLogo")
        private String teamTwoLogo;

        @SerializedName("teamOneStartingSide")
        private String teamOneStartingSide;

        @SerializedName("bombTime")
        private int bombTime;

        public TeamData(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo, String teamOneStartingSide, int bombTime) {
            this.teamOneName = teamOneName;
            this.teamTwoName = teamTwoName;
            this.teamOneLogo = teamOneLogo;
            this.teamTwoLogo = teamTwoLogo;
            this.teamOneStartingSide = teamOneStartingSide;
            this.bombTime = bombTime;
        }

    }

    static class ApplicationData {
        @SerializedName("logLevel")
        private String logLevel;

        @SerializedName("port")
        private int port;

        @SerializedName("host")
        private String host;

        public ApplicationData(String logLevel, int port, String host) {
            this.logLevel = logLevel;
            this.port = port;
            this.host = host;
        }
    }


    public static void main(String[] args) {
        launch();
    }
}

//import javax.swing.*;
//import java.awt.*;
//import java.awt.event.WindowAdapter;
//import java.awt.event.WindowEvent;
//
//public class Main {
//
//    public static void main(String[] args) {
//        new Main();
//    }
//
//    public Main() {
//        JFrame frame = new JFrame("EXE Runner");
//        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        frame.setSize(600, 600);
//
//        frame.addWindowListener(new WindowAdapter() {
//            public void windowClosing(WindowEvent e) {
//                if (process1 != null) {
//                    process1.destroy();
//                }
//                if (process2 != null) {
//                    process2.destroy();
//                }
//                if (processThread1 != null) {
//                    processThread1.interrupt();
//                }
//                if (processThread2 != null) {
//                    processThread2.interrupt();
//                }
//                System.exit(0); // This is to terminate the program after the processes are stopped
//            }
//        });
//
//        // Create JTabbedPane
//        JTabbedPane tabbedPane = new JTabbedPane();
//
//        // Start
//        JPanel panel1 = new JPanel();
//        panel1.setLayout(new BoxLayout(panel1, BoxLayout.Y_AXIS));
//        panel1.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10)); // Add padding
//
//        JButton frontendButton = new JButton("Start FRONTEND");
//        frontendButton.setFont(new Font("Arial", Font.BOLD, 14));
//        frontendButton.setBackground(Color.CYAN);
//
//        JButton backendButton = new JButton("Start BACKEND");
//        backendButton.setFont(new Font("Arial", Font.BOLD, 14));
//        backendButton.setBackground(Color.CYAN);
//
//        JTextArea outputArea1 = new JTextArea();
//        outputArea1.setEditable(false);
//        outputArea1.setMargin(new Insets(5, 5, 5, 5)); // Add margins
//
//        JScrollPane scrollPane1 = new JScrollPane(outputArea1);

//
//        frontendButton.addActionListener(e -> {
//            if (isFrontendRunning.get()) {
//                stopProcess(outputArea1, 1);
//                frontendButton.setText("Start FRONTEND");
//                frontendButton.setBackground(Color.CYAN);
//                isFrontendRunning.set(false);
//            } else {
//                executeProcess(EXE_FILE_1, outputArea1, 1);
//                frontendButton.setText("Stop FRONTEND");
//                frontendButton.setBackground(Color.RED);
//                isFrontendRunning.set(true);
//            }
//        });
//
//        backendButton.addActionListener(e -> {
//            if (isBackendRunning.get()) {
//                stopProcess(outputArea1, 2);
//                backendButton.setText("Start BACKEND");
//                backendButton.setBackground(Color.CYAN);
//                isBackendRunning.set(false);
//            } else {
//                executeProcess(EXE_FILE_2, outputArea1, 2);
//                backendButton.setText("Stop BACKEND");
//                backendButton.setBackground(Color.RED);
//                isBackendRunning.set(true);
//            }
//        });
//
//        panel1.add(frontendButton);
//        panel1.add(Box.createRigidArea(new Dimension(0, 10))); // Add vertical spacing between buttons
//        panel1.add(backendButton);
//        panel1.add(Box.createRigidArea(new Dimension(0, 10)));
//        panel1.add(scrollPane1);
//
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
//        JButton createButton = new JButton("Create JSON");
//        createButton.addActionListener(e -> {
//            try {
//                port = Integer.parseInt(portField.getText());
//                host = hostField.getText();
//                String cfg = createConfigFile(
//                        teamOneNameField.getText(),
//                        teamTwoNameField.getText(),
//                        teamOneLogo.get(),
//                        teamTwoLogo.get(),
//                        (String) teamOneStartingSideComboBox.getSelectedItem(),
//                        Integer.parseInt(bombTimerField.getText()));
//                writeJsonToFile(cfg, "config.json");
//            } catch (NumberFormatException ex) {
//                System.out.println("Error: Invalid number format.");
//                outputArea2.setText("Error: Invalid number format.");
//                ex.printStackTrace();
//            } catch (NullPointerException ex) {
//                System.out.println("Error: Some fields are null or not initialized.");
//                outputArea2.setText("Error: Some fields are null or not initialized.");
//                ex.printStackTrace();
//            } catch (IllegalArgumentException ex) {
//                System.out.println("Error: Illegal argument.");
//                outputArea2.setText("Error: Illegal argument.");
//                ex.printStackTrace();
//            } catch (Exception ex) {
//                System.out.println("An unknown error occurred.");
//                outputArea2.setText("An unknown error occurred.");
//                ex.printStackTrace();
//            }
//
//        });
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
//
//
//
//        // Add tabs to JTabbedPane
//        tabbedPane.addTab("Start", panel1);
//        tabbedPane.addTab("Settings", panel2);
//        tabbedPane.addTab("Game Location", panel3);
//
//        frame.add(tabbedPane);
//        frame.setVisible(true);
//    }
//
//}
