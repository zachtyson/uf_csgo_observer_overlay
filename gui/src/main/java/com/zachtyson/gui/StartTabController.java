package com.zachtyson.gui;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.stage.Stage;

import java.io.*;
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
    private AtomicBoolean isFrontendRunning = new AtomicBoolean(false);
    private AtomicBoolean isBackendRunning = new AtomicBoolean(false);

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
    public void setCloseBehavior(Stage stage) {
        stage.setOnCloseRequest(event -> {
            if (process1 != null) {
                process1.destroy();
            }
            if (process2 != null) {
                process2.destroy();
            }
            if (processThread1 != null && processThread1.isAlive()) {
                processThread1.interrupt();
            }
            if (processThread2 != null && processThread2.isAlive()) {
                processThread2.interrupt();
            }
            System.exit(0);
        });
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }
}
