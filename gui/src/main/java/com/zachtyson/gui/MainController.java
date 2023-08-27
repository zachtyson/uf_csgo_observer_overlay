package com.zachtyson.gui;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.*;

import java.net.URL;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Objects;
import java.util.ResourceBundle;
import javafx.stage.FileChooser;
import java.io.File;
import java.io.IOException;

public class MainController implements Initializable {
    @FXML
    public TabPane tabPane;
    @FXML
    private Tab startTab;
    @FXML
    private Tab settingsTab;
    @FXML
    private Tab gameLocationTab;
    @FXML
    private Tab visualSettingsTab;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        for(Tab tab: tabPane.getTabs()) {
            tab.setClosable(false);
        }
        try {
            startTab.setContent(FXMLLoader.load(Objects.requireNonNull(getClass().getResource("start-tab.fxml"))));
            settingsTab.setContent(FXMLLoader.load(Objects.requireNonNull(getClass().getResource("settings-tab.fxml"))));
            gameLocationTab.setContent(FXMLLoader.load(Objects.requireNonNull(getClass().getResource("game-location.fxml"))));
            visualSettingsTab.setContent(FXMLLoader.load(Objects.requireNonNull(getClass().getResource("visual-settings.fxml"))));
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
