package com.zachtyson.gui;

import com.google.gson.annotations.SerializedName;

public class ApplicationData {
    @SerializedName("logLevel")
    public String logLevel;

    @SerializedName("port")
    public int port;

    @SerializedName("host")
    public String host;

    public ApplicationData(String logLevel, int port, String host) {
        this.logLevel = logLevel;
        this.port = port;
        this.host = host;
    }
}
