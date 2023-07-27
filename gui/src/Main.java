import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;

public class Main {
    private static final String EXE_FILE_1 = "frontend/frontend.exe";
    private static final String EXE_FILE_2 = "backend.exe";

    private Process process1;
    private Process process2;

    public static void main(String[] args) {
        new Main();
    }

    public Main() {
        JFrame frame = new JFrame("EXE Runner");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);

        Container contentPane = frame.getContentPane();
        contentPane.setLayout(new GridLayout(5, 1));

        JButton startButton1 = new JButton("Start FRONTEND");
        JButton stopButton1 = new JButton("Stop FRONTEND");
        JButton startButton2 = new JButton("Start BACKEND");
        JButton stopButton2 = new JButton("Stop BACKEND");
        JTextArea outputArea = new JTextArea();
        outputArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(outputArea);

        startButton1.addActionListener(e -> executeProcess(EXE_FILE_1, outputArea, 1));
        stopButton1.addActionListener(e -> stopProcess(outputArea, 1));

        startButton2.addActionListener(e -> executeProcess(EXE_FILE_2, outputArea, 2));
        stopButton2.addActionListener(e -> stopProcess(outputArea, 2));

        contentPane.add(startButton1);
        contentPane.add(stopButton1);
        contentPane.add(startButton2);
        contentPane.add(stopButton2);
        contentPane.add(scrollPane);

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
}
