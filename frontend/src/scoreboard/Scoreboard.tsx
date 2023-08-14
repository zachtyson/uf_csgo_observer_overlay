import React from 'react';
import { type RootObject, type AllPlayers, type Player } from '../data_interface';
import './Scoreboard.scss';
import { Defuse, FlashingBomb } from '../assets/Icons';
import { type TeamData } from '../config_interface';

let teamOneSide: string = 'CT';
let swap = 0;
interface ScoreboardProps {
    data: RootObject // Update the type according to your data structure
    config: TeamData | null
}

window.addEventListener('keydown', (event) => {
    if (event.key === '`') {
        if (swap === 0) {
            swap = 1;
        } else {
            swap = 0;
        }
    }
    if (event.key === '0') {
        if (teamOneSide === 'CT') {
            teamOneSide = 'T';
        } else {
            teamOneSide = 'CT';
        }
    }
});

function printRound (num: number, CTScore: number, TScore: number): JSX.Element {
    if (num <= 29) {
        return <div> ROUND {num + 1}/30 </div>;
    } else {
        let OTNumber = Math.floor((num - 30) / 6) + 1;
        const OTModulo = (num - 30) % 6;
        if (OTModulo === 0) {
            if (CTScore !== TScore) {
                OTNumber = OTNumber - 1;
            }
        }
        return <div>
            <div> Overtime {OTNumber}</div>
            <div> First to {15 + OTNumber * 3 + 1} </div>
        </div>;
    }
}

function printTime (phaseCountdowns: RootObject['phase_countdowns']): JSX.Element {
    if (phaseCountdowns.phase === 'bomb') {
        return <FlashingBomb className="bombImage" />;
    }
    if (phaseCountdowns.phase === 'defuse') {
        return <Defuse className="bombImage" />;
    }
    let phaseEndsIn: number;
    try {
        phaseEndsIn = parseFloat(phaseCountdowns.phase_ends_in);
    } catch (e) {
        phaseEndsIn = 0;
    }

    if (phaseEndsIn < 10) {
        if (phaseCountdowns.phase === 'live') {
            return <div className="time low">{phaseEndsIn}</div>;
        }
        if (phaseCountdowns.phase === 'over') {
            return <div className="time">{phaseEndsIn}</div>;
        }
    }
    phaseEndsIn = Math.floor(phaseEndsIn);
    const minutes = Math.floor(phaseEndsIn / 60);
    const seconds = phaseEndsIn % 60;
    let formattedSeconds: string;
    if (seconds < 10) {
        formattedSeconds = `${minutes} : 0${seconds}`;
    } else {
        formattedSeconds = `${minutes} : ${seconds}`;
    }

    return <div className="time">{formattedSeconds}</div>;
}

function printTeamLogo (side: boolean, teamOneLogo: any, teamTwoLogo: any): any {
    if (side) {
        if (swap === 0) {
            return teamOneLogo;
        } else {
            return teamTwoLogo;
        }
    } else {
        if (swap === 0) {
            return teamTwoLogo;
        } else {
            return teamOneLogo;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printCTWinLogo (teamOneLogo: any, teamTwoLogo: any): any {
    if (swap !== 0) {
        return teamTwoLogo;
    } else {
        return teamOneLogo;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printTWinLogo (teamOneLogo: any, teamTwoLogo: any): any {
    if (swap !== 0) {
        return teamOneLogo;
    } else {
        return teamTwoLogo;
    }
}

function printTeamName (side: string, teamOneName: string, teamTwoName: string): string {
    // team one is always at left
    // team one should start ct, if they don't, press 0
    if (side === 'R') {
        if (teamOneSide === 'T') {
            return teamOneName;
        }
        return teamTwoName;
    } else {
        if (teamOneSide === 'T') {
            return teamTwoName;
        }
        return teamOneName;
    }
}

function hasCTPlayerOnSlots1To5 (allPlayers: AllPlayers): boolean {
    if (allPlayers == null) {
        return false;
    }
    return Object.values(allPlayers).some(
        (player: Player) => player.team === 'CT' && player.observer_slot >= 1 && player.observer_slot <= 5
    );
}

const Scoreboard: React.FC<ScoreboardProps> = ({ data, config }) => {
    if (data == null) return <div>Loading...</div>;
    if (config == null) return <div>Loading...</div>;
    teamOneSide = config.teamOneStartingSide;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { team_ct, team_t } = data.map;
    // console.log(data);
    const isLeftCT: boolean = hasCTPlayerOnSlots1To5(data.allplayers);
    if (data.phase_countdowns === undefined) return <div>Loading...</div>;
    return (
        <div className="parent">
            <div className="TeamName" id={data.phase_countdowns.phase === 'live' ? 'hidden' : ''}>
                <p className="teamLeftName">
                    {printTeamName('L', config.teamOneName, config.teamTwoName)}
                </p>
            </div>
            <div className="scoreBoard">
                <div className="teamImage">
                    <img src={printTeamLogo(isLeftCT, config.teamOneLogo, config.teamTwoLogo)} alt="CT Logo" />
                </div>
                <div className="teamScore">
                    <p className={isLeftCT ? 'defender-score' : 'attacker-score'}>
                        {isLeftCT ? team_ct.score : team_t.score}
                    </p>
                </div>
                <div className="matchInfo">
                    {printTime(data.phase_countdowns)}
                    {printRound(data.map.round, team_ct.score, team_t.score)}
                </div>
                <div className="teamScore">
                    <p className={isLeftCT ? 'attacker-score' : 'defender-score'}>
                        {isLeftCT ? team_t.score : team_ct.score}
                    </p>
                </div>
                <div className="teamImage">
                    <img src={printTeamLogo(!isLeftCT, config.teamOneLogo, config.teamTwoLogo)} alt="T Logo" />
                </div>
            </div>
            <div className="TeamName" id={data.phase_countdowns.phase === 'live' ? 'hidden' : ''}>
                <p className="teamRightName">
                    {printTeamName('R', config.teamOneName, config.teamTwoName)}
                </p>
            </div>
        </div>
    );
};

export default Scoreboard;
