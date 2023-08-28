package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ColorPicker;

import java.net.URL;
import java.util.ResourceBundle;

public class VisualSettingsController implements Initializable {
    @FXML
    public ColorPicker colorPicker1;
    @FXML
    public ColorPicker colorPicker2;
    @FXML
    public ColorPicker colorPicker3;
    @FXML
    public ColorPicker colorPicker4;
    @FXML
    public ColorPicker colorPicker5;
    //        tColor: 'rgb(213, 96, 0)',
    //        ctColor: 'rgb(0, 135, 176)',
    //        backgroundOpacity: 'rgba(38, 48, 58, 0.76)',
    //        backgroundSolid: 'rgba(33, 42, 52, 1)',
    //        backgroundOpacity2: 'rgba(38, 48, 58, 0.7)',
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        colorPicker1.setValue(javafx.scene.paint.Color.rgb(213, 96, 0));
        colorPicker2.setValue(javafx.scene.paint.Color.rgb(0, 135, 176));
        colorPicker3.setValue(javafx.scene.paint.Color.rgb(38, 48, 58));
        colorPicker3.setOpacity(0.76);
        colorPicker4.setValue(javafx.scene.paint.Color.rgb(33, 42, 52));
        colorPicker5.setValue(javafx.scene.paint.Color.rgb(38, 48, 58));
        colorPicker5.setOpacity(0.7);
    }
}
