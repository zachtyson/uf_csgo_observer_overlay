import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import Scoreboard from "./scoreboard/Scoreboard";
import Teams from "./teams/Teams";
import CurrentPlayer from "./current_player/current_player";
import {teamOneLogo, teamOneName, teamTwoLogo, teamTwoName, teamOneStartingSide} from "./teamInfo.js"
import {ConfigData} from "./config_interface";

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

        socket.on("Connected", (message: string) => {
            console.log("Connected to server.");
            console.log("Server says:", message);
        });

        // Cleanup the effect
        return () => {
            // Before the component is destroyed
            // we disconnect the socket
            socket.disconnect();
        }
    }, []);
    // useEffect(() => {
    //     // Read the config data from window.electronConfig
    //     let electronConfig:any = null;
    //
    //     if (electronConfig) {
    //         setConfig(electronConfig);
    //         let imageSrc = 'data:image/png;base64,' + config?.teamOneLogo;
    //         let imageSrc2 = 'data:image/png;base64,' + config?.teamTwoLogo;
    //         if(config) {
    //             config.teamOneLogo = imageSrc;
    //             config.teamTwoLogo = imageSrc2;
    //         }
    //     }
    //     // If the config data is not available, use the backup data
    //     if(!config) {
    //         const configData = backupConfig();
    //         setConfig(configData);
    //
    //     }
    // }, []);
    // if (!response || !config) return <div>Loading...</div>;
    // useEffect(() => {
    //
    // }, []);
    // useEffect(() => {
    //     const electron = (window as any).electron;
    //     electron.receive('channel', (data:any) => {
    //         console.log(data); // prints { foo: 'bar' }
    //         //convert base64 to image
    //         let imageSrc = 'data:image/png;base64,' + data.teamOneLogo;
    //         let imageSrc2 = 'data:image/png;base64,' + data.teamTwoLogo;
    //         data.teamOneLogo = imageSrc;
    //         data.teamTwoLogo = imageSrc2;
    //         setConfig(data);
    //     });
    // }, []);

    // electron.receive('receive', (data:any) => {
    //     console.log(data); // prints { foo: 'bar' }
    // });
    return (
        <div>
            hello
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
