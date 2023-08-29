package com.zachtyson.gui;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.annotations.SerializedName;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.stage.FileChooser;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.ResourceBundle;

import static com.zachtyson.gui.Main.writeJsonToFile;

public class SettingsController implements Initializable {
    @FXML
    public TextField teamOneNameField;
    @FXML
    public TextField teamTwoNameField;
    @FXML
    public ComboBox<String> teamOneStartingSideComboBox;
    @FXML
    public TextField bombTimerField;
    @FXML
    public Button createButton;
    @FXML
    public TextArea createButtonOutputArea;
    @FXML
    public Button importConfig;
    @FXML
    public TextArea ImportConfigOutputArea;

    @FXML
    public TextField roundTimerField;
    @FXML
    public TextField gameLengthField;
    @FXML
    public TextField overtimeLengthField;
    private String host = "127.0.0.1";
    private int port = 25566;
    public void createConfigFile() {
        try {
            ApplicationData applicationData = new ApplicationData("info", port, host);
            String teamOneName = teamOneNameField.getText();
            File teamOneLogoFile = new File(teamOneLogoButton.getText());
            String teamOneLogo = getBase64(teamOneLogoFile);
            String teamTwoName = teamTwoNameField.getText();
            File teamTwoLogoFile = new File(teamTwoLogoButton.getText());
            String teamTwoLogo = getBase64(teamTwoLogoFile);
            String teamOneStartingSide = teamOneStartingSideComboBox.getSelectionModel().getSelectedItem();
            int bombTime = Integer.parseInt(bombTimerField.getText());
            int halfLength = Integer.parseInt(roundTimerField.getText());
            int gameLength = Integer.parseInt(gameLengthField.getText());
            int overtimeHalfLength = Integer.parseInt(overtimeLengthField.getText());
            TeamData teamData = new TeamData(teamOneName, teamTwoName, teamOneLogo, teamTwoLogo, teamOneStartingSide, bombTime, halfLength, overtimeHalfLength, gameLength);
            ConfigData configData = ConfigData.getInstance();
            configData.setApplication(applicationData);
            configData.setTeamData(teamData);
            configData.writeToFile();
            createButtonOutputArea.setText("Successfully created config.json");
        } catch (IOException e) {
            createButtonOutputArea.setText("Error getting file: " + e.getMessage());
        } catch (NumberFormatException e) {
            createButtonOutputArea.setText("Error: Invalid number format.");
        } catch (Exception e) {
            createButtonOutputArea.setText("Error: " + e.getMessage());
        }
    }
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        teamOneStartingSideComboBox.getSelectionModel().selectFirst();
        createButton.setOnAction(event -> createConfigFile());
        importConfig.setOnAction(event -> handleImportConfig());
    }


    private String getBase64(File file) throws IOException {
        byte[] fileBytes = Files.readAllBytes(Path.of(file.getAbsolutePath()));
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
            button.setText(selectedFile.getAbsolutePath());
        }
    }

    public void handleImportConfig() {
        ConfigData configData = ConfigData.getInstance();
        FileChooser importConfigChooser = new FileChooser();
        File selectedGameConfig = importConfigChooser.showOpenDialog(null);
        configData.importConfig(selectedGameConfig);
    }
}
