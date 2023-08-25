package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.atomic.AtomicBoolean;

public class StartTabController implements Initializable {
    private static final String EXE_FILE_1 = "frontend/frontend.exe";
    private static final String EXE_FILE_2 = "backend/backend.exe";

    private Process process1;
    private Process process2;
    private Thread processThread1;
    private Thread processThread2;
    @FXML
    public Button frontendButton;
    @FXML
    public Button backendButton;
    @FXML
    public TextArea outputArea1;
    private final AtomicBoolean isFrontendRunning = new AtomicBoolean(false);
    private final AtomicBoolean isBackendRunning = new AtomicBoolean(false);

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
                    try {
                        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                        String line;
                        while ((line = input.readLine()) != null && !Thread.currentThread().isInterrupted()) {
                            System.out.println(line);
                            outputArea1.appendText(line + "\n");
                        }
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                });
                if (processNumber == 1) {
                    processThread1 = processThread;
                } else if (processNumber == 2) {
                    processThread2 = processThread;
                }
                processThread.start();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        } else {
            outputArea1.appendText("File '" + fileName + "' does not exist\n");
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
    public void setCloseBehavior(Stage stage) {
        stage.setOnCloseRequest(event -> {
            if (process1 != null) {
                process1.destroy();
                process1 = null;
            }
            if (process2 != null) {
                process2.destroy();
                process2 = null;
            }
            if (processThread1 != null && processThread1.isAlive()) {
                processThread1.interrupt();
                processThread1 = null;
            }
            if (processThread2 != null && processThread2.isAlive()) {
                processThread2.interrupt();
                processThread2 = null;
            }
            System.exit(0);
        });
    }

    private void toggleProcess(String fileName, int processNumber) {
        if (processNumber == 1) {
            if (isFrontendRunning.get()) {
                stopProcess(1);
                isFrontendRunning.set(false);
                frontendButton.setText("Start Frontend");
                outputArea1.appendText("Stopped '" + EXE_FILE_1 + "'\n");
            } else {
                executeProcess(fileName, 1);
                isFrontendRunning.set(true);
                frontendButton.setText("Stop Frontend");
                outputArea1.appendText("Started '" + EXE_FILE_1 + "'\n");
            }
        } else if (processNumber == 2) {
            if (isBackendRunning.get()) {
                stopProcess(2);
                isBackendRunning.set(false);
                backendButton.setText("Start Backend");
                outputArea1.appendText("Stopped '" + EXE_FILE_2 + "'\n");
            } else {
                executeProcess(fileName, 2);
                isBackendRunning.set(true);
                backendButton.setText("Stop Backend");
                outputArea1.appendText("Started '" + EXE_FILE_2 + "'\n");
            }
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        frontendButton.setOnAction(event -> toggleProcess(EXE_FILE_1, 1));
        backendButton.setOnAction(event -> toggleProcess(EXE_FILE_2, 2));
    }
}
