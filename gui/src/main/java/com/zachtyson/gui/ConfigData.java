package com.zachtyson.gui;

import com.google.gson.annotations.SerializedName;

public class ConfigData {
    @SerializedName("application")
    public ApplicationData application;

    @SerializedName("team_data")
    public TeamData teamData;

    public ConfigData(ApplicationData application, TeamData teamData) {
        this.application = application;
        this.teamData = teamData;
    }
}
