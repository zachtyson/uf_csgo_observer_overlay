import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Scoreboard from './scoreboard/Scoreboard';
import Teams from './teams/Teams';
import CurrentPlayer from './current_player/CurrentPlayer';
import { type ConfigData, type UIColors } from './config_interface';
import RoundWin from './round_win/RoundWin';
import './_variables.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const backupTeamOneLogo = require('./config/teamOneBackup.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const backupTeamTwoLogo = require('./config/teamTwoBackup.png');

interface AppProps {
    appConfiguration: ConfigData | null;
}

declare module 'react' {
    interface CSSProperties {
        '--T-color'?: string;
        '--CT-color'?: string;
        '--Background-opacity'?: string;
        '--Background-solid'?: string;
        '--Background-opacity2'?: string;
    }
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
        halfLength: 15,
        overtimeHalfLength: 3,
        maxRounds: 30,
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
                bombTime: appConfiguration.team_data.bombTime,
                halfLength: appConfiguration.team_data.halfLength,
                overtimeHalfLength:
                    appConfiguration.team_data.overtimeHalfLength,
                maxRounds: appConfiguration.team_data.maxRounds,
                teamOneStartingSide:
                    appConfiguration.team_data.teamOneStartingSide,
            };
            setConfig(configData);
            if (
                appConfiguration.ui_colors !== undefined &&
                appConfiguration.ui_colors != null
            ) {
                setColors(appConfiguration.ui_colors);
            }
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
    const [colors, setColors] = useState<UIColors>({
        tColor: 'rgb(213, 96, 0)',
        ctColor: 'rgb(0, 135, 176)',
        backgroundOpacity: 'rgba(38, 48, 58, 0.76)',
        backgroundSolid: 'rgba(33, 42, 52, 1)',
        backgroundOpacity2: 'rgba(38, 48, 58, 0.7)',
    });
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                '--T-color': colors.tColor,
                '--CT-color': colors.ctColor,
                '--Background-opacity': colors.backgroundOpacity,
                '--Background-solid': colors.backgroundSolid,
                '--Background-opacity2': colors.backgroundOpacity2,
            }}
        >
            <RoundWin data={response} config={config} />{' '}
            <Scoreboard data={response} config={config} />{' '}
            <Teams data={response} config={config} />{' '}
            <CurrentPlayer data={response} config={config} />{' '}
        </div>
    );
};

export default App;
