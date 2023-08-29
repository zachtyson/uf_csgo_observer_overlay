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
    public TeamData teamData;

    private ConfigData(ApplicationData application, TeamData teamData, UIColorsData uiColorsData) {

    }

    @SerializedName("ui_colors")
    public UIColorsData uiColorsData;

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
