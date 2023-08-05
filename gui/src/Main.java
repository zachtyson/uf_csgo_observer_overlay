import netscape.javascript.JSObject;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    private static final String EXE_FILE_1 = "frontend/frontend.exe";
    private static final String EXE_FILE_2 = "backend/backend.exe";

    private Process process1;
    private Process process2;

    public static void main(String[] args) {
        new Main();
    }

    public Main() {
        JFrame frame = new JFrame("EXE Runner");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);

        // Create JTabbedPane
        JTabbedPane tabbedPane = new JTabbedPane();

        // TAB 1
        JPanel panel1 = new JPanel(new GridLayout(5, 1));

        JButton startButton1 = new JButton("Start FRONTEND");
        JButton stopButton1 = new JButton("Stop FRONTEND");
        JButton startButton2 = new JButton("Start BACKEND");
        JButton stopButton2 = new JButton("Stop BACKEND");
        JTextArea outputArea1 = new JTextArea();
        outputArea1.setEditable(false);
        JScrollPane scrollPane1 = new JScrollPane(outputArea1);

        startButton1.addActionListener(e -> executeProcess(EXE_FILE_1, outputArea1, 1));
        stopButton1.addActionListener(e -> stopProcess(outputArea1, 1));
        startButton2.addActionListener(e -> executeProcess(EXE_FILE_2, outputArea1, 2));
        stopButton2.addActionListener(e -> stopProcess(outputArea1, 2));

        panel1.add(startButton1);
        panel1.add(stopButton1);
        panel1.add(startButton2);
        panel1.add(stopButton2);
        panel1.add(scrollPane1);

        // TAB 2
        JPanel panel2 = new JPanel(new GridLayout(2, 1));
        JTextArea outputArea2 = new JTextArea("Tab 2 content here");
        outputArea2.setEditable(false);
        JScrollPane scrollPane2 = new JScrollPane(outputArea2);

        JButton createButton = new JButton("Create JSON");
        createButton.addActionListener(e -> {
            try {
                File file = new File("test.json");
                if (file.createNewFile()) {
                    System.out.println("File created: " + file.getName());
                } else {
                    System.out.println("File already exists.");
                }
            } catch (IOException ex) {
                System.out.println("An error occurred.");
                ex.printStackTrace();
            }
        });

        panel2.add(createButton);
        panel2.add(scrollPane2);

        // Add tabs to JTabbedPane
        tabbedPane.addTab("Tab 1", panel1);
        tabbedPane.addTab("Tab 2", panel2);

        frame.add(tabbedPane);
        frame.setVisible(true);
    }


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
                new Thread(() -> {
                    BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                    String line;
                    try {
                        while ((line = input.readLine()) != null) {
                            outputArea.append(line + "\n");
                        }
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }).start();
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
            outputArea.append("Stopped '" + EXE_FILE_1 + "'\n");
        } else if (processNumber == 2 && process2 != null) {
            process2.destroy();
            outputArea.append("Stopped '" + EXE_FILE_2 + "'\n");
        }
    }

    private static String createConfigFile(String logLevel, int port, String host,
                                           String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo,
                                           String teamOneStartingSide, int bombTime) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{");
        // Too lazy to figure out how to create a JSON object in Java that works with Launch4j, so I'm just going to
        // build the JSON string manually. Once I feel like it, I'll do it the right way.
        // Application section
        jsonBuilder.append("\n  \"application\": {");
        jsonBuilder.append("\n    \"logLevel\": \"").append(logLevel).append("\",");
        jsonBuilder.append("\n    \"port\": ").append(port).append(",");
        jsonBuilder.append("\n    \"host\": \"").append(host).append("\"");
        jsonBuilder.append("\n  },");
        // Currently port and host are not able to change since I got a small bootstrap problem in the frontend, so I'm just going to hardcode them for now.
        // Team data section
        jsonBuilder.append("\n  \"team_data\": {");
        jsonBuilder.append("\n    \"teamOneName\": \"").append(teamOneName).append("\",");
        jsonBuilder.append("\n    \"teamTwoName\": \"").append(teamTwoName).append("\",");
        jsonBuilder.append("\n    \"teamOneLogo\": \"").append(teamOneLogo).append("\",");
        jsonBuilder.append("\n    \"teamTwoLogo\": \"").append(teamTwoLogo).append("\",");
        jsonBuilder.append("\n    \"teamOneStartingSide\": \"").append(teamOneStartingSide).append("\",");
        jsonBuilder.append("\n    \"bombTime\": ").append(bombTime);
        jsonBuilder.append("\n  }");

        jsonBuilder.append("\n}");

        return jsonBuilder.toString();
    }

    private static void writeJsonToFile(String jsonData, String filename) {
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(jsonData);
            System.out.println("JSON data written to file: " + filename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
