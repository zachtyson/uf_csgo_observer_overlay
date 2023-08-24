package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.stage.DirectoryChooser;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ResourceBundle;

public class GameLocationController implements Initializable {

    public MainController mainController;
    @FXML
    public Button gameDirectory;
    @FXML
    public Button createIngameCfg;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        gameDirectory.setOnAction(actionEvent -> selectGameDirectory());
        createIngameCfg.setOnAction(actionEvent -> generateIngameCfg());
    }

    private void selectGameDirectory() {
        DirectoryChooser directoryChooser = new DirectoryChooser();
        File selectedFile = directoryChooser.showDialog(null);
        if (selectedFile != null) {
            gameDirectory.setText(selectedFile.getAbsolutePath());
        }
    }

    private void generateIngameCfg() {
        String destination = gameDirectory.getText() + "/" + "gamestate_integration_uf.cfg";
        Path destinationPath = Paths.get(destination);
        Path source = Paths.get("gamestate_integration_uf.cfg");
        try {
            Files.copy(source, destinationPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            System.out.println("Error occurred while copying the file: " + e.getMessage());
        }
    }
}
