package com.zachtyson.gui;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ColorPicker;
import javafx.scene.control.ComboBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;

import java.net.URL;
import java.util.ResourceBundle;

import static com.zachtyson.gui.Main.writeJsonToFile;

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
    @FXML
    public Button saveColors;
    public ComboBox fontComboBox;

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

        saveColors.setOnAction(actionEvent -> {
            UIColorsData uiColorsData = new UIColorsData(
                    convertToRGBA(colorPicker1.getValue()),
                    convertToRGBA(colorPicker2.getValue()),
                    convertToRGBA(colorPicker3.getValue()),
                    convertToRGBA(colorPicker4.getValue()),
                    convertToRGBA(colorPicker5.getValue())
            );
            ConfigData configData = ConfigData.getInstance();
            configData.setUiColorsData(uiColorsData);
            configData.writeToFile();

        });

        fontComboBox.getItems().addAll(Font.getFamilies());
    }

    private String convertToRGBA(Color color) {
        double opacity = Math.round(color.getOpacity()*100.0)/100.0;
        String c = "rgba(" + (int)(color.getRed()*255) + ", " + (int)(color.getGreen()*255) + ", " + (int)(color.getBlue()*255) + ", " + opacity + ")";
        return c;
    }
}
