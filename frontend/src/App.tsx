import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import Scoreboard from "./scoreboard/Scoreboard";
import Teams from "./teams/Teams";
import CurrentPlayer from "./current_player/current_player";
import {teamOneLogo, teamOneName, teamTwoLogo, teamTwoName, teamOneStartingSide} from "./teamInfo.js"
import {ConfigData} from "./config_interface";
import fs from "fs";
const ENDPOINT = "http://localhost:25566"; // replace with your server's address and port
const backupTeamOneLogo = require("./config/teamOneLogo.png");
const backupTeamTwoLogo = require("./config/teamTwoLogo.png");

const App: React.FC = () => {
    const [response, setResponse] = useState<any>(null);
    const [config, setConfig] = useState<ConfigData | null>(null); // State to store the config data
    useEffect(() => {
        let socket: Socket;

        // Connect and setup event listener
        socket = io(ENDPOINT);
        socket.on("data", (data: any) => {
            setResponse(data);
        });

        // Cleanup the effect
        return () => {
            // Before the component is destroyed
            // we disconnect the socket
            socket.disconnect();
        }
    }, []);
    useEffect(() => {
        // Read the config data from window.electronConfig
        const electronConfig = (window as any).electronConfig;
        if (electronConfig) {
            setConfig(electronConfig);
        }
    }, []);

    if(!config) {

        const configData = backupConfig();
        setConfig(configData);

    }

    return (
        <div>
            <Scoreboard data={response} config={config}/>
            <Teams data={response} config={config}/> {/* Pass the object as a prop */}
            <CurrentPlayer data={response} config={config}/> {/* Pass the object as a prop */}
        </div>
    );
}


function backupConfig() {
    //Read image data local file
    const imageDataOne= backupTeamOneLogo
    const imageDataTwo = backupTeamTwoLogo
    const configData = {
        "teamOneName": "Iowa State",
        "teamTwoName": "Gator Esports",
        "teamOneLogo": imageDataOne,
        "teamTwoLogo": imageDataTwo,
        "teamOneStartingSide": "CT"
    }
    return configData as ConfigData;
}
export default App;
