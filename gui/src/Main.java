import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.io.FileWriter;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicBoolean;

public class Main {
    private static final String EXE_FILE_1 = "frontend/frontend.exe";
    private static final String EXE_FILE_2 = "backend/backend.exe";

    private Process process1;
    private Process process2;

    public static void main(String[] args) {
        new Main();
    }

    private String gameDirectoryPath = null;

    private String host = "http://localhost";

    private int port = 25566;

    public Main() {
        JFrame frame = new JFrame("EXE Runner");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600, 600);

        // Create JTabbedPane
        JTabbedPane tabbedPane = new JTabbedPane();

        // Start
        JPanel panel1 = new JPanel();
        panel1.setLayout(new BoxLayout(panel1, BoxLayout.Y_AXIS));
        panel1.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10)); // Add padding

        JButton frontendButton = new JButton("Start FRONTEND");
        frontendButton.setFont(new Font("Arial", Font.BOLD, 14));
        frontendButton.setBackground(Color.CYAN);

        JButton backendButton = new JButton("Start BACKEND");
        backendButton.setFont(new Font("Arial", Font.BOLD, 14));
        backendButton.setBackground(Color.CYAN);

        JTextArea outputArea1 = new JTextArea();
        outputArea1.setEditable(false);
        outputArea1.setMargin(new Insets(5, 5, 5, 5)); // Add margins

        JScrollPane scrollPane1 = new JScrollPane(outputArea1);

        AtomicBoolean isFrontendRunning = new AtomicBoolean(false);
        AtomicBoolean isBackendRunning = new AtomicBoolean(false);

        frontendButton.addActionListener(e -> {
            if (isFrontendRunning.get()) {
                stopProcess(outputArea1, 1);
                frontendButton.setText("Start FRONTEND");
                frontendButton.setBackground(Color.CYAN);
                isFrontendRunning.set(false);
            } else {
                executeProcess(EXE_FILE_1, outputArea1, 1);
                frontendButton.setText("Stop FRONTEND");
                frontendButton.setBackground(Color.RED);
                isFrontendRunning.set(true);
            }
        });

        backendButton.addActionListener(e -> {
            if (isBackendRunning.get()) {
                stopProcess(outputArea1, 2);
                backendButton.setText("Start BACKEND");
                backendButton.setBackground(Color.CYAN);
                isBackendRunning.set(false);
            } else {
                executeProcess(EXE_FILE_2, outputArea1, 2);
                backendButton.setText("Stop BACKEND");
                backendButton.setBackground(Color.RED);
                isBackendRunning.set(true);
            }
        });

        panel1.add(frontendButton);
        panel1.add(Box.createRigidArea(new Dimension(0, 10))); // Add vertical spacing between buttons
        panel1.add(backendButton);
        panel1.add(Box.createRigidArea(new Dimension(0, 10)));
        panel1.add(scrollPane1);

        // Settings
        JPanel panel2 = new JPanel(new GridLayout(10, 2));

        JLabel portLabel = new JLabel("Port:");
        JTextField portField = new JTextField("25566");
        portField.setEditable(false);
        panel2.add(portLabel);
        panel2.add(portField);

        JLabel hostLabel = new JLabel("Host:");
        JTextField hostField = new JTextField("127.0.0.1");
        hostField.setEditable(false);
        panel2.add(hostLabel);
        panel2.add(hostField);

        JLabel teamOneNameLabel = new JLabel("Team One Name:");
        JTextField teamOneNameField = new JTextField();
        panel2.add(teamOneNameLabel);
        panel2.add(teamOneNameField);

        JLabel teamOneLogoLabel = new JLabel("Team One Logo:");
        JButton teamOneLogoButton = new JButton("Select Team One Logo");
        final String[] teamOneLogo = new String[1];
        teamOneLogoButton.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            int returnValue = fileChooser.showOpenDialog(null);
            if (returnValue == JFileChooser.APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                teamOneLogo[0] = selectedFile.getAbsolutePath();
                teamOneLogoButton.setText(selectedFile.getName());
            }
        });
        panel2.add(teamOneLogoLabel);
        panel2.add(teamOneLogoButton);

        JLabel teamTwoNameLabel = new JLabel("Team Two Name:");
        JTextField teamTwoNameField = new JTextField();
        panel2.add(teamTwoNameLabel);
        panel2.add(teamTwoNameField);


        JLabel teamTwoLogoLabel = new JLabel("Team Two Logo:");
        JButton teamTwoLogoButton = new JButton("Select Team Two Logo");
        final String[] teamTwoLogo = new String[1];
        teamTwoLogoButton.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            int returnValue = fileChooser.showOpenDialog(null);
            if (returnValue == JFileChooser.APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                teamTwoLogo[0] = selectedFile.getAbsolutePath();
                teamTwoLogoButton.setText(selectedFile.getName());
            }
        });
        panel2.add(teamTwoLogoLabel);
        panel2.add(teamTwoLogoButton);

        JLabel teamOneStartingSideLabel = new JLabel("Team One Starting Side:");
        String[] sides = { "CT", "T" };
        JComboBox<String> teamOneStartingSideComboBox = new JComboBox<>(sides);
        panel2.add(teamOneStartingSideLabel);
        panel2.add(teamOneStartingSideComboBox);

        JLabel bombTimerLabel = new JLabel("Bomb Timer:");
        JTextField bombTimerField = new JTextField("40"); // default to 40
        panel2.add(bombTimerLabel);
        panel2.add(bombTimerField);

        JTextArea outputArea2 = new JTextArea("");
        outputArea2.setEditable(false);
        JScrollPane scrollPane2 = new JScrollPane(outputArea2);

        JButton createButton = new JButton("Create JSON");
        createButton.addActionListener(e -> {
            try {
                port = Integer.parseInt(portField.getText());
                host = hostField.getText();
                String cfg = createConfigFile(
                        teamOneNameField.getText(),
                        teamTwoNameField.getText(),
                        teamOneLogo[0],
                        teamTwoLogo[0],
                        (String) teamOneStartingSideComboBox.getSelectedItem(),
                        Integer.parseInt(bombTimerField.getText()));
                writeJsonToFile(cfg, "config.json");
            } catch (NumberFormatException ex) {
                System.out.println("Error: Invalid number format.");
                outputArea2.setText("Error: Invalid number format.");
                ex.printStackTrace();
            } catch (NullPointerException ex) {
                System.out.println("Error: Some fields are null or not initialized.");
                outputArea2.setText("Error: Some fields are null or not initialized.");
                ex.printStackTrace();
            } catch (IllegalArgumentException ex) {
                System.out.println("Error: Illegal argument.");
                outputArea2.setText("Error: Illegal argument.");
                ex.printStackTrace();
            } catch (Exception ex) {
                System.out.println("An unknown error occurred.");
                outputArea2.setText("An unknown error occurred.");
                ex.printStackTrace();
            }

        });

        panel2.add(createButton);
        panel2.add(scrollPane2);
        LayoutManager layout = new BoxLayout(frame.getContentPane(), BoxLayout.Y_AXIS);
        frame.setLayout(layout);

        // Create components
        JLabel gameLocationLabel = new JLabel("Select Game Location:");
        gameLocationLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        gameLocationLabel.setFont(new Font("Arial", Font.BOLD, 18));

        JButton gameLocationButton = new JButton("Select Directory");
        gameLocationButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        gameLocationButton.setBackground(Color.LIGHT_GRAY);

        JFileChooser gameDirectoryChooser = new JFileChooser();
        gameDirectoryChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

        // Add ActionListener to JButton
        gameLocationButton.addActionListener(e -> {
            int returnValue = gameDirectoryChooser.showOpenDialog(null);
            if (returnValue == JFileChooser.APPROVE_OPTION) {
                File selectedDirectory = gameDirectoryChooser.getSelectedFile();
                gameLocationButton.setText(selectedDirectory.getName());
            }
        });

        JButton cfgButton = new JButton("Generate cfg file in game");
        cfgButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        cfgButton.setBackground(Color.LIGHT_GRAY);

        // Create a JPanel with a border
        JPanel panel3 = new JPanel();
        panel3.setLayout(new BoxLayout(panel3, BoxLayout.Y_AXIS));
        panel3.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10)); // padding

        // Add components to panel
        panel3.add(gameLocationLabel);
        panel3.add(Box.createRigidArea(new Dimension(0, 10))); // Add space
        panel3.add(gameLocationButton);
        panel3.add(Box.createRigidArea(new Dimension(0, 10))); // Add space
        panel3.add(cfgButton);



        // Add tabs to JTabbedPane
        tabbedPane.addTab("Start", panel1);
        tabbedPane.addTab("Settings", panel2);
        tabbedPane.addTab("Game Location", panel3);

        frame.add(tabbedPane);
        frame.setVisible(true);
    }
    private Thread processThread1;
    private Thread processThread2;

    private void executeProcess(String fileName, JTextArea outputArea, int processNumber) {
        File exeFile = new File(fileName);
        if (exeFile.exists() && !exeFile.isDirectory()) {
            try {
                Process process = Runtime.getRuntime().exec(fileName);
                if (processNumber == 1) {
                    process1 = process;
                } else if (processNumber == 2) {
                    process2 = process;
                }

                outputArea.append("Started '" + fileName + "'\n");
                Thread processThread = new Thread(() -> {
                    BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                    String line;
                    try {
                        while ((line = input.readLine()) != null && !Thread.currentThread().isInterrupted()) {
                            outputArea.append(line + "\n");
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
            outputArea.append("'" + fileName + "' does not exist\n");
        }
    }

    private void stopProcess(JTextArea outputArea, int processNumber) {
        outputArea.append("Stopping '" + (processNumber == 1 ? EXE_FILE_1 : EXE_FILE_2) + "'\n");
        if (processNumber == 1 && process1 != null) {
            process1.destroy();
            if (processThread1 != null && processThread1.isAlive()) {
                processThread1.interrupt();
            }
            outputArea.append("Stopped '" + EXE_FILE_1 + "'\n");
        } else if (processNumber == 2 && process2 != null) {
            process2.destroy();
            if (processThread2 != null && processThread2.isAlive()) {
                processThread2.interrupt();
            }
            outputArea.append("Stopped '" + EXE_FILE_2 + "'\n");
        }
    }

    private String createConfigFile(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo,
                                           String teamOneStartingSide, int bombTime) {
        CustomJSONObject config = new CustomJSONObject();
        CustomJSONObject application = new CustomJSONObject();
        CustomJSONObject teamData = new CustomJSONObject();
        application.put("logLevel", "info");
        application.put("port", port);
        application.put("host", host);
        //Replace all backslashes with forward slashes
        teamOneLogo = teamOneLogo.replace("\\", "/");
        teamTwoLogo = teamTwoLogo.replace("\\", "/");
        teamOneName = teamOneName.replace("\\", "/");
        teamTwoName = teamTwoName.replace("\\", "/");
        teamData.put("teamOneName", teamOneName);
        teamData.put("teamTwoName", teamTwoName);
        teamData.put("teamOneLogo", teamOneLogo);
        teamData.put("teamTwoLogo", teamTwoLogo);
        teamData.put("teamOneStartingSide", teamOneStartingSide);
        teamData.put("bombTime", bombTime);
        config.put("team_data", teamData);
        config.put("application", application);

        return config.toString();
//        jsonBuilder.append("{");
//        // Too lazy to figure out how to create a JSON object in Java that works with Launch4j, so I'm just going to
//        // build the JSON string manually. Once I feel like it, I'll do it the right way.
//        // Application section
//        jsonBuilder.append("\n  \"application\": {");
//        jsonBuilder.append("\n    \"logLevel\": \"").append(logLevel).append("\",");
//        jsonBuilder.append("\n    \"port\": ").append(port).append(",");
//        jsonBuilder.append("\n    \"host\": \"").append(host).append("\"");
//        jsonBuilder.append("\n  },");
//        // Currently port and host are not able to change since I got a small bootstrap problem in the frontend, so I'm just going to hardcode them for now.
//        // Team data section
//        jsonBuilder.append("\n  \"team_data\": {");
//        jsonBuilder.append("\n    \"teamOneName\": \"").append(teamOneName).append("\",");
//        jsonBuilder.append("\n    \"teamTwoName\": \"").append(teamTwoName).append("\",");
//        jsonBuilder.append("\n    \"teamOneLogo\": \"").append(teamOneLogo).append("\",");
//        jsonBuilder.append("\n    \"teamTwoLogo\": \"").append(teamTwoLogo).append("\",");
//        jsonBuilder.append("\n    \"teamOneStartingSide\": \"").append(teamOneStartingSide).append("\",");
//        jsonBuilder.append("\n    \"bombTime\": ").append(bombTime);
//        jsonBuilder.append("\n  }");
//
//        jsonBuilder.append("\n}");
//
//        return jsonBuilder.toString();
    }

    private static void writeJsonToFile(String jsonData, String filename) throws IOException {
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(jsonData);
            System.out.println("JSON data written to file: " + filename);
        } catch (IOException e) {
            throw new IOException("Unable to write JSON data to file: " + filename, e);
        }
    }

    private void generateGSIFile() {
        //"Observer All Players v.1"
        //{
        // "uri" "http://localhost:25566"
        //  "timeout"   "1.1"
        //  "buffer"    "0.05"
        //  "throttle"  "0.0"
        //  "heartbeat" "20.0"
        // "output"
        // {
        //   "precision_time" "1"
        //   "precision_position" "1"
        //   "precision_vector" "3"
        // }
        // "data"
        // {
        //  "provider"				"1"
        //  "player_id"				"1"
        //  "player_state"			"1"
        //  "map"						"1"
        //  "map_round_wins"			"1"
        //  "player_match_stats"		"1"
        //  "player_weapons"			"1"
        //  "round"					"1"
        //  "allplayers_id"			"1"
        //  "allplayers_match_stats"	"1"
        //  "allplayers_position"		"1"
        //  "allplayers_state"		"1"
        //  "allplayers_weapons"		"1"
        //  "bomb"					"1"
        //  "phase_countdowns"		"1"
        //  "player_position"			"1"
        // }
        //}
        try {
            String gsiBuilder = """
                    "Observer All Players v.1"
                    {
                     "uri" \"""" +"http://localhost:" + port + "\"\n" + "  \"timeout\"   \"1.1\"\n" + "  \"buffer\"    \"0.05\"\n" + "  \"throttle\"  \"0.0\"\n" + "  \"heartbeat\" \"20.0\"\n" + " \"output\"\n" + " {\n" + "   \"precision_time\" \"1\"\n" + "   \"precision_position\" \"1\"\n" + "   \"precision_vector\" \"3\"\n" + " }\n" + " \"data\"\n" + " {\n" + "  \"provider\"\t\t\t\t\"1\"\n" + "  \"player_id\"\t\t\t\t\"1\"\n" + "  \"player_state\"\t\t\t\"1\"\n" + "  \"map\"\t\t\t\t\t\t\"1\"\n" + "  \"map_round_wins\"\t\t\t\"1\"\n" + "  \"player_match_stats\"\t\t\"1\"\n" + "  \"player_weapons\"\t\t\t\"1\"\n" + "  \"round\"\t\t\t\t\t\"1\"\n" + "  \"allplayers_id\"\t\t\t\"1\"\n" + "  \"allplayers_match_stats\"\t\"1\"\n" + "  \"allplayers_position\"\t\t\"1\"\n" + "  \"allplayers_state\"\t\t\"1\"\n" + "  \"allplayers_weapons\"\t\t\"1\"\n" + "  \"bomb\"\t\t\t\t\t\"1\"\n" + "  \"phase_countdowns\"\t\t\"1\"\n" + "  \"player_position\"\t\t\t\"1\"\n" + " }\n" + "}";
            //check if /cfg/ folder exists
            File cfgFolder = new File(gameDirectoryPath + "/cfg");
            if (!cfgFolder.exists()) {
                writeJsonToFile(gsiBuilder, gameDirectoryPath+"/gamestate_integration_uf.cfg");
            } else {
                writeJsonToFile(gsiBuilder, gameDirectoryPath+"/cfg/gamestate_integration_uf.cfg");
            }
        } catch (IOException e) {
            throw new RuntimeException("Unable to generate gamestate_integration_uf.cfg file", e);
        }

    }
}
