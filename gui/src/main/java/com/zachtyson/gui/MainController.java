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
    public TextField teamOneNameField;
    @FXML
    public TextField teamTwoNameField;

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
                String base64Logo = getBase64(selectedFile);
                button.setText(selectedFile.getName());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private String getBase64(File file) throws IOException {
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        return "data:image/" + getFileExtension(file) + ";base64," + Base64.getEncoder().encodeToString(fileBytes);
    }

    public static String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return ""; // Empty extension
        }
        return name.substring(lastIndexOf + 1).toLowerCase();
    }
}
