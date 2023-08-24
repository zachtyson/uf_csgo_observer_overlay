package com.zachtyson.gui;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;

public class SettingsController {
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
}
