import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import Scoreboard from "./scoreboard/Scoreboard";
import Teams from "./teams/Teams";
import CurrentPlayer from "./current_player/current_player";
import {ConfigData} from "./config_interface";

interface AppProps {
    appConfiguration: ConfigData|null;
}

const ENDPOINT = "http://localhost:25566/"; // replace with your server's address and port
const backupTeamOneLogo = require("./config/teamOneBackup.png");
const backupTeamTwoLogo = require("./config/teamTwoBackup.png");
function getBackupConfig() {
    //Read image data local file
    const configData = {
        "teamOneName": "Team One",
        "teamTwoName": "Team Two",
        "teamOneLogo": backupTeamOneLogo,
        "teamTwoLogo": backupTeamTwoLogo,
        "teamOneStartingSide": "CT"
    }
    return configData as ConfigData;
}

const App: React.FC<AppProps> = ({ appConfiguration }) => {
    const [response, setResponse] = useState<any>(null);
    const [config,setConfig] = useState<any>(null);

    useEffect(() => {
        if(appConfiguration) {
            const configData = {
                "teamOneName": appConfiguration.teamOneName,
                "teamTwoName": appConfiguration.teamTwoName,
                "teamOneLogo": appConfiguration.teamOneLogo,
                "teamTwoLogo": appConfiguration.teamTwoLogo,
                "teamOneStartingSide": "CT"
            }
            setConfig(configData);
        } else {
            const configData = getBackupConfig();
            setConfig(configData);
        }
    },[])
    getBackupConfig();
    useEffect(() => {
        let socket: Socket;
        socket = io(ENDPOINT);
        // Connect and setup event listener
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

    return (
        <div>
            <Scoreboard data={response} config={config} /> {/* Pass the object as a prop */}
            <Teams data={response} config={config} /> {/* Pass the object as a prop */}
            <CurrentPlayer data={response} config={config} /> {/* Pass the object as a prop */}
        </div>
    );
}

export default App;
