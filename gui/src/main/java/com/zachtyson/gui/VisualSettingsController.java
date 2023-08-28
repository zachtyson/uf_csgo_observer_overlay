package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ColorPicker;
import javafx.scene.paint.Color;

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
    //        backgroundSolid: 'rgba(33, 42, 52, 1)',
    //        backgroundOpacity: 'rgba(38, 48, 58, 0.76)',
    //        backgroundOpacity2: 'rgba(38, 48, 58, 0.7)',
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        Color[] colors = new Color[5];
        //              Color.rgb(213, 96, 0),
        //                Color.rgb(0, 135, 176),
        //                Color.rgb(38, 48, 58),
        //                Color.rgb(33, 42, 52),
        //                Color.rgb(38, 48, 58)
        colors[0] = Color.rgb(213, 96, 0, 1);
        colors[1] = Color.rgb(0, 135, 176, 1);
        colors[2] = Color.rgb(33, 42, 52, 1);
        colors[3] = Color.rgb(38, 48, 58,0.76);
        colors[4] = Color.rgb(38, 48, 58, 0.7);

        colorPicker1.setValue(colors[0]);
        colorPicker2.setValue(colors[1]);
        colorPicker3.setValue(colors[2]);
        colorPicker4.setValue(colors[3]);
        colorPicker5.setValue(colors[4]);

        colorPicker1.getCustomColors().addAll(colors);
        colorPicker2.getCustomColors().addAll(colors);
        colorPicker3.getCustomColors().addAll(colors);
        colorPicker4.getCustomColors().addAll(colors);
        colorPicker5.getCustomColors().addAll(colors);
    }
}
