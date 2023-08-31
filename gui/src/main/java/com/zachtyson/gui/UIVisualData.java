package com.zachtyson.gui;

import com.google.gson.annotations.SerializedName;

public class UIVisualData {
    //"ui_colors": {
    //        "tColor": "rgb(213, 96, 233)",
    //        "ctColor": "rgb(0, 235, 176)",
    //        "backgroundOpacity": "rgba(108, 48, 58, 0.76)",
    //        "backgroundSolid": "rgba(133, 42, 52, 1)",
    //        "backgroundOpacity2": "rgba(138, 48, 58, 0.7)"
    //    }
    @SerializedName("tColor")
    public String tColor;
    @SerializedName("ctColor")
    public String ctColor;
    @SerializedName("backgroundSolid")
    public String backgroundSolid;
    @SerializedName("backgroundOpacity")
    public String backgroundOpacity;
    @SerializedName("backgroundOpacity2")
    public String backgroundOpacity2;
    public UIVisualData(String tColor, String ctColor, String backgroundSolid, String backgroundOpacity2, String backgroundOpacity, String overlayFont) {
        this.tColor = tColor;
        this.ctColor = ctColor;
        this.backgroundSolid = backgroundSolid;
        this.backgroundOpacity = backgroundOpacity;
        this.backgroundOpacity2 = backgroundOpacity2;
        this.overlayFont = overlayFont;
    }

    @SerializedName("overlayFont")
    public String overlayFont;
}
