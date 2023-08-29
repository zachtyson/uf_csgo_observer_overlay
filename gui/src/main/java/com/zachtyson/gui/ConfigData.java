package com.zachtyson.gui;

import com.google.gson.annotations.SerializedName;

public class ConfigData {
    @SerializedName("application")
    public ApplicationData application;

    @SerializedName("team_data")
    public TeamData teamData;

    private ConfigData(ApplicationData application, TeamData teamData) {
        this.application = application;
        this.teamData = teamData;
    }

    public static ConfigData getInstance(ApplicationData application, TeamData teamData) {
        if (singleInstance == null) {
            singleInstance = new ConfigData(application, teamData);
        }
        return singleInstance;
    }

    public static ConfigData getInstance() {
        return singleInstance;
    }

    public void setApplication(ApplicationData application) {
        this.application = application;
    }

    public void setTeamData(TeamData teamData) {
        this.teamData = teamData;
    }

    public ApplicationData getApplication() {
        return application;
    }

    public TeamData getTeamData() {
        return teamData;
    }

    public static ConfigData singleInstance = null;
}
