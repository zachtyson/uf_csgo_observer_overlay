package com.zachtyson.gui;

import com.google.gson.annotations.SerializedName;

public class TeamData {
    @SerializedName("teamOneName")
    public String teamOneName;

    @SerializedName("teamOneLogo")
    public String teamOneLogo;

    @SerializedName("teamTwoName")
    public String teamTwoName;

    @SerializedName("teamTwoLogo")
    public String teamTwoLogo;

    @SerializedName("teamOneStartingSide")
    public String teamOneStartingSide;

    @SerializedName("bombTime")
    public int bombTime;

    @SerializedName("halfLength")
    public int halfLength;

    @SerializedName("roundLength")
    public int overtimeHalfLength;

    @SerializedName("gameLength")
    public int gameLength;

    public TeamData(String teamOneName, String teamTwoName, String teamOneLogo, String teamTwoLogo, String teamOneStartingSide, int bombTime, int halfLength, int overtimeHalfLength, int gameLength) {
        this.teamOneName = teamOneName;
        this.teamTwoName = teamTwoName;
        this.teamOneLogo = teamOneLogo;
        this.teamTwoLogo = teamTwoLogo;
        this.teamOneStartingSide = teamOneStartingSide;
        this.bombTime = bombTime;
        this.halfLength = halfLength;
        this.overtimeHalfLength = overtimeHalfLength;
        this.gameLength = gameLength;
    }

}
