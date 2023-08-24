package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;

import java.net.URL;
import java.util.ResourceBundle;

public class MainController implements Initializable {
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

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        for(Tab tab: tabPane.getTabs()) {
            tab.setClosable(false);
        }
    }
}
