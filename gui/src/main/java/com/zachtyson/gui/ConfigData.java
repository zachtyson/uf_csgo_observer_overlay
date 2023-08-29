package com.zachtyson.gui;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.annotations.SerializedName;
import java.io.File;
import java.io.FileReader;

import static com.zachtyson.gui.Main.writeJsonToFile;

public class ConfigData {
    @SerializedName("application")
    public ApplicationData application = new ApplicationData("info", 25566, "127.0.0.1");

    @SerializedName("team_data")
    public TeamData teamData = new TeamData("Team One", "Team Two", "teamOneBackup.png", "teamTwoBackup", "CT", 40, 15, 3, 30);

    private ConfigData(ApplicationData application, TeamData teamData, UIColorsData uiColorsData) {
        if(application == null && teamData == null && uiColorsData == null) {
            File f = new File("config.json");
            if(f.exists()) {
                try {
                    importConfig(f);
                } catch (RuntimeException e) {
                    System.out.println("Error: Failed to import config.");
                }
            }
        } else {
            if(application != null) {
                this.application = application;
            }
            if(teamData != null) {
                this.teamData = teamData;
            }
            if(uiColorsData != null) {
                this.uiColorsData = uiColorsData;
            }
        }
    }

    @SerializedName("ui_colors")
    public UIColorsData uiColorsData = new UIColorsData("rgb(213, 96, 233)", "rgb(0, 235, 176)", "rgba(108, 48, 58, 0.76)", "rgba(138, 48, 58, 0.7)", "rgba(133, 42, 52, 1)");
    public static ConfigData getInstance(ApplicationData application, TeamData teamData, UIColorsData uiColorsData) {
        if (singleInstance == null) {
            singleInstance = new ConfigData(application, teamData, uiColorsData);
        }
        if(application != null) {
            singleInstance.application = application;
        }
        if(teamData != null) {
            singleInstance.teamData = teamData;
        }
        if(uiColorsData != null) {
            singleInstance.uiColorsData = uiColorsData;
        }
        return singleInstance;
    }

    public static ConfigData getInstance() {
        if (singleInstance == null) {
            singleInstance = new ConfigData(null, null, null);
        }
        return singleInstance;
    }

    public boolean writeToFile() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String newConfigObj = gson.toJson(this);
        try {
            writeJsonToFile(newConfigObj, "config.json");
            writeJsonToFile(newConfigObj, "backend/config.json");
            return true;
        } catch (Exception e) {
            System.out.println("Error: Failed to write to config.json");
            return false;
        }
    }

    public void setApplication(ApplicationData application) {
        this.application = application;
    }

    public void setTeamData(TeamData teamData) {
        this.teamData = teamData;
    }

    public void setUiColorsData(UIColorsData uiColorsData) {
        this.uiColorsData = uiColorsData;
    }

    public ApplicationData getApplication() {
        return application;
    }

    public TeamData getTeamData() {
        return teamData;
    }

    public UIColorsData getUiColorsData() {
        return uiColorsData;
    }

    public static ConfigData singleInstance = null;

    public void importConfig(File f) throws RuntimeException{
        if (f != null) {
            try (FileReader reader = new FileReader(f)) {
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                ConfigData configObj = gson.fromJson(reader, ConfigData.class);
                String newConfigObj = gson.toJson(configObj);
                writeJsonToFile(newConfigObj, "config.json");
                writeJsonToFile(newConfigObj, "backend/config.json");
            } catch (JsonSyntaxException ex) {
                System.out.println("Error: Invalid JSON syntax.");
                throw new RuntimeException("Error: Invalid JSON syntax.");
            } catch (JsonIOException ex) {
                System.out.println("Error: Invalid JSON IO.");
                throw new RuntimeException("Error: Failed to read JSON.");
            } catch (NullPointerException ex) {
                // User opened file chooser but didn't select a file
                System.out.println("Error: No file selected.");
            } catch (Exception ex) {
                System.out.println("Error: Failed to import config.");
                throw new RuntimeException("Error: Failed to import config.");
            }
        } else {
            System.out.println("Error: No file selected.");
        }
    }
}
