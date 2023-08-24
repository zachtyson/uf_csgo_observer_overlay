package com.zachtyson.gui;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.util.Base64;
import java.util.ResourceBundle;

public class SettingsController implements Initializable {
    @FXML
    public TextField teamOneNameField;
    @FXML
    public TextField teamTwoNameField;
    @FXML
    public ComboBox teamOneStartingSideComboBox;
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
    private String host = "http://localhost";
    private int port = 25566;
    private String createConfigFile(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo,
                                    String teamOneStartingSide, int bombTime) {
        ApplicationData applicationData = new ApplicationData("info", port, host);
        TeamData teamData = new TeamData(teamOneName, teamTwoName, teamOneLogo, teamTwoLogo, teamOneStartingSide, bombTime);
        ConfigData configData = new ConfigData(applicationData, teamData);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(configData);
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }

    static class ConfigData {
        @SerializedName("application")
        private ApplicationData application;

        @SerializedName("team_data")
        private TeamData teamData;

        public ConfigData(ApplicationData application, TeamData teamData) {
            this.application = application;
            this.teamData = teamData;
        }
    }

    static class TeamData {
        @SerializedName("teamOneName")
        private String teamOneName;

        @SerializedName("teamOneLogo")
        private String teamOneLogo;

        @SerializedName("teamTwoName")
        private String teamTwoName;

        @SerializedName("teamTwoLogo")
        private String teamTwoLogo;

        @SerializedName("teamOneStartingSide")
        private String teamOneStartingSide;

        @SerializedName("bombTime")
        private int bombTime;

        public TeamData(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo, String teamOneStartingSide, int bombTime) {
            this.teamOneName = teamOneName;
            this.teamTwoName = teamTwoName;
            this.teamOneLogo = teamOneLogo;
            this.teamTwoLogo = teamTwoLogo;
            this.teamOneStartingSide = teamOneStartingSide;
            this.bombTime = bombTime;
        }

    }

    static class ApplicationData {
        @SerializedName("logLevel")
        private String logLevel;

        @SerializedName("port")
        private int port;

        @SerializedName("host")
        private String host;

        public ApplicationData(String logLevel, int port, String host) {
            this.logLevel = logLevel;
            this.port = port;
            this.host = host;
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

    public void handleCreateJson(ActionEvent actionEvent) {
    }

    public void handleImportConfig(ActionEvent actionEvent) {
    }
}
