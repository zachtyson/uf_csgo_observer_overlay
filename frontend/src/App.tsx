import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Scoreboard from './scoreboard/Scoreboard';
import Teams from './teams/Teams';
import CurrentPlayer from './current_player/current_player';
import { type ConfigData } from './config_interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const backupTeamOneLogo = require('./config/teamOneBackup.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const backupTeamTwoLogo = require('./config/teamTwoBackup.png');

interface AppProps {
    appConfiguration: ConfigData | null;
}

const ENDPOINT = 'http://localhost:25566/'; // replace with your server's address and port
// this will remain the same for now, but will be changed to the server's address and port
// once I figure out how to fix this bootstrap paradox issue
// since I can't get the endpoint without the config, but I can't get the config without the endpoint

function getBackupConfig(): ConfigData {
    // Read image data local file
    const applicationData = {
        logLevel: 'info',
        port: 25566,
        host: '127.0.0.1',
    };
    const teamData = {
        teamOneName: 'Team One',
        teamTwoName: 'Team Two',
        teamOneLogo: backupTeamOneLogo,
        teamTwoLogo: backupTeamTwoLogo,
        teamOneStartingSide: 'CT',
        bombTime: 40,
    };
    const configData = {
        application_data: applicationData,
        team_data: teamData,
    };
    return configData as ConfigData;
}

const App: React.FC<AppProps> = ({ appConfiguration }) => {
    const [response, setResponse] = useState<any>(null);
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        if (appConfiguration != null) {
            const configData = {
                teamOneName: appConfiguration.team_data.teamOneName,
                teamTwoName: appConfiguration.team_data.teamTwoName,
                teamOneLogo: appConfiguration.team_data.teamOneLogo,
                teamTwoLogo: appConfiguration.team_data.teamTwoLogo,
                teamOneStartingSide: 'CT',
            };
            setConfig(configData);
        } else {
            const configData = getBackupConfig();
            setConfig(configData);
        }
    }, []);
    getBackupConfig();
    useEffect(() => {
        let socket: Socket;
        // eslint-disable-next-line prefer-const
        socket = io(ENDPOINT);
        // Connect and setup event listener
        socket.on('data', (data: any) => {
            setResponse(data);
        });

        // Cleanup the effect
        return () => {
            // Before the component is destroyed
            // we disconnect the socket
            socket.disconnect();
        };
    }, []);
    return (
        <div>
            <Scoreboard data={response} config={config} />{' '}
            {/* Pass the object as a prop */}
            <Teams data={response} config={config} />{' '}
            {/* Pass the object as a prop */}
            <CurrentPlayer data={response} config={config} />{' '}
            {/* Pass the object as a prop */}
        </div>
    );
};

export default App;
