package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TabPane;
import javafx.scene.control.TextArea;

public class GUIController {
    @FXML
    public Button frontendButton;
    @FXML
    public Button backendButton;
    @FXML
    public TabPane tabPane;
    @FXML
    public TextArea outputArea1;
    @FXML
    public TextArea outputArea3;
    @FXML
    public Button importConfig;
    @FXML
    public Button gameLocationButton;
    @FXML
    public Button cfgButton;
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Welcome to JavaFX Application!");
    }
}
