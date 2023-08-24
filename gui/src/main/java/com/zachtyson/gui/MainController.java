package com.zachtyson.gui;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;

import java.net.URL;
import java.nio.file.Files;
import java.util.Base64;
import java.util.ResourceBundle;
import javafx.stage.FileChooser;
import java.io.File;
import java.io.IOException;

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
    @FXML
    public Button teamOneLogoButton;
    @FXML
    public Button teamTwoLogoButton;

    @FXML
    public void handleTeamOneLogoSelection(ActionEvent actionEvent) {
        selectLogo(teamOneLogoButton);
    }

    @FXML
    public void handleTeamTwoLogoSelection(ActionEvent actionEvent) {
        selectLogo(teamTwoLogoButton);
    }

    private void selectLogo(Button button) {
        FileChooser fileChooser = new FileChooser();
        File selectedFile = fileChooser.showOpenDialog(null);
        if (selectedFile != null) {
            try {
                // Note: getBase64(...) method is not provided in the given code, so this is a placeholder
                String base64Logo = getBase64(selectedFile);
                button.setText(selectedFile.getName());
                // Optionally, you can store the base64 representation in a variable or use it further.
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}
