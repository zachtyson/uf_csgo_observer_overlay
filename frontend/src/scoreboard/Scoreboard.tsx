import React, { useEffect, useState } from 'react';
import {
    type RootObject,
    type Map,
    type Round,
    type PhaseCountdowns,
} from '../data_interface';
import './Scoreboard.scss';
import { Defuse, FlashingBomb } from '../assets/Icons';
import { type TeamData } from '../config_interface';

interface ScoreboardProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}

let bombLengthSeconds: number;

function printRound(num: number, CTScore: number, TScore: number): JSX.Element {
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
        return (
            <div>
                <div> Overtime {OTNumber}</div>
                <div> First to {15 + OTNumber * 3 + 1} </div>
            </div>
        );
    }
}

function printTime(
    phaseCountdowns: RootObject['phase_countdowns'],
): JSX.Element {
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

function printTeamLogo(side: string, teamOneLogo: any, teamTwoLogo: any): any {
    if (side === 'L') {
        return teamOneLogo;
    } else {
        return teamTwoLogo;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function printCTWinLogo(teamOneLogo: any, teamTwoLogo: any): any {
//     if (swap !== 0) {
//         return teamTwoLogo;
//     } else {
//         return teamOneLogo;
//     }
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function printTWinLogo(teamOneLogo: any, teamTwoLogo: any): any {
//     if (swap !== 0) {
//         return teamOneLogo;
//     } else {
//         return teamTwoLogo;
//     }
// }

function printTeamName(
    side: string,
    teamOneName: string,
    teamTwoName: string,
): string {
    // team one is always at left
    // team one should start ct, if they don't, press 0
    if (side === 'L') {
        return teamOneName;
    }
    return teamTwoName;
}

interface BombAndDefuseProps {
    map: Map;
    round: Round;
    phaseCountdowns: PhaseCountdowns;
    teamOneSide: string | undefined;
    teamTwoSide: string | undefined;
}

function BombDefusedOrExploded({
    map,
    round,
    phaseCountdowns,
}: BombAndDefuseProps): JSX.Element {
    if (round.bomb === 'exploded') {
        return (
            <div className="scoreBoardBombDefuseTimers">
                <div className="scoreBoardTimerOne">
                    <div className="scoreBoardBarExplodedOrDefused scoreBoardTColor scoreBoardBar100"></div>
                </div>
                <div className="scoreBoardTimerTwo">
                    <div className="scoreBoardBarExplodedOrDefused scoreBoardTColor scoreBoardBar100"></div>
                </div>
            </div>
        );
    } else if (round.bomb === 'defused') {
        return (
            <div className="scoreBoardBombDefuseTimers">
                <div className="scoreBoardTimerOne">
                    <div className="scoreBoardBarExplodedOrDefused scoreBoardCTColor scoreBoardBar100"></div>
                </div>
                <div className="scoreBoardTimerTwo">
                    <div className="scoreBoardBarExplodedOrDefused scoreBoardCTColor scoreBoardBar100"></div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

// React.FC<ScoreboardProps> = ({ data, config }) => {
function BombAndDefuse({
    map,
    round,
    phaseCountdowns,
    teamOneSide,
    teamTwoSide,
}: BombAndDefuseProps): JSX.Element {
    if (map.phase !== 'live') {
        return <div></div>;
    }
    if (round.phase === 'over') {
        return (
            <BombDefusedOrExploded
                map={map}
                round={round}
                phaseCountdowns={phaseCountdowns}
                teamOneSide={teamOneSide}
                teamTwoSide={teamTwoSide}
            />
        );
    }
    if (round.bomb == null || round.bomb !== 'planted') {
        return <div></div>;
    }

    if (bombLengthSeconds === undefined) {
        return <div></div>;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { elapsedMilliseconds, plantBomb, defuseBomb } = useBombTimer();
    if (phaseCountdowns.phase === 'bomb') {
        plantBomb();
    } else if (phaseCountdowns.phase === 'defused') {
        defuseBomb();
    }

    // convert elapsedMilliseconds percentage of bomb remaining
    let bombPercentage =
        100 - (elapsedMilliseconds / (bombLengthSeconds * 1000)) * 100;

    if (bombPercentage < 0) {
        bombPercentage = 0;
    }

    let timerClassOne = '';
    let timerClassTwo = '';

    if (phaseCountdowns.phase === 'defuse') {
        if (teamOneSide === 'CT') {
            const defusePercentage =
                parseFloat(phaseCountdowns.phase_ends_in) * 10;
            timerClassOne =
                'scoreBoardBar scoreBoardCTColor scoreBoardBar' +
                Math.floor(defusePercentage).toString();
            timerClassTwo =
                'scoreBoardBar scoreBoardTColor scoreBoardBar' +
                Math.floor(bombPercentage).toString();
        } else {
            const defusePercentage =
                parseFloat(phaseCountdowns.phase_ends_in) * 10;
            timerClassOne =
                'scoreBoardBar scoreBoardTColor scoreBoardBar' +
                Math.floor(bombPercentage).toString();
            timerClassTwo =
                'scoreBoardBar scoreBoardCTColor scoreBoardBar' +
                Math.floor(defusePercentage).toString();
        }
    } else {
        timerClassOne =
            'scoreBoardBar scoreBoardTColor scoreBoardBar' +
            Math.floor(bombPercentage).toString();

        timerClassTwo =
            'scoreBoardBar scoreBoardTColor scoreBoardBar' +
            Math.floor(bombPercentage).toString();
    }

    return (
        <div className="scoreBoardBombDefuseTimers">
            <div className="scoreBoardTimerOne">
                <div className={timerClassOne}></div>
            </div>
            <div className="scoreBoardTimerTwo">
                <div className={timerClassTwo}></div>
            </div>
        </div>
    );
}

interface BombTimerReturnType {
    elapsedMilliseconds: number;
    plantBomb: () => void;
    defuseBomb: () => void;
}

// unfortunately this is necessary since whenever the bomb is planted, the API returns the bomb timer UNTIL someone starts defusing
// in which case the API returns the defuse time, so we need to keep track of the bomb timer ourselves
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useBombTimer = (): BombTimerReturnType => {
    const [timerStarted, setTimerStarted] = useState(false);
    const [bombPlantTimestamp, setBombPlantTimestamp] = useState<number | null>(
        null,
    );

    useEffect(() => {
        let interval: any;

        if (timerStarted && bombPlantTimestamp != null) {
            interval = setInterval(() => {
                const millisecondsPassed = Date.now() - bombPlantTimestamp;

                if (millisecondsPassed >= bombLengthSeconds * 1000 + 200) {
                    setTimerStarted(false);
                    setBombPlantTimestamp(null);
                }
            }, 100); // Adjust the frequency based on your needs. This checks every 100ms.
        }

        return () => {
            clearInterval(interval); // Cleanup on unmount
        };
    }, [timerStarted, bombPlantTimestamp, bombLengthSeconds]);

    const plantBomb = (): void => {
        if (!timerStarted) {
            setTimerStarted(true);
            setBombPlantTimestamp(Date.now());
        } else {
            // do something else later, like logging elapsed time if needed
        }
    };

    const defuseBomb = (): void => {
        setBombPlantTimestamp(null);
        setTimerStarted(false);
    };

    const elapsedMilliseconds =
        bombPlantTimestamp != null ? Date.now() - bombPlantTimestamp : 0;

    return {
        elapsedMilliseconds,
        plantBomb,
        defuseBomb,
    };
};

const Scoreboard: React.FC<ScoreboardProps> = ({ data, config }) => {
    if (data == null) return <div>Loading...</div>;
    if (config == null) return <div>Loading...</div>;
    useEffect(() => {
        bombLengthSeconds = config.bombTime;
    }, [config]);
    const teamOneSide = data.allplayers.teamOneSide;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const teamTwoSide = data.allplayers.teamTwoSide;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { team_ct, team_t } = data.map;
    if (data.phase_countdowns === undefined) return <div>Loading...</div>;

    return (
        <div className="scoreBoardParent">
            <div className="scoreBoardChild">
                <div
                    className="scoreBoardTeamName"
                    id={data.phase_countdowns.phase === 'live' ? 'hidden' : ''}
                >
                    <p className="teamLeftName">
                        {printTeamName(
                            'L',
                            config.teamOneName,
                            config.teamTwoName,
                        )}
                    </p>
                </div>
                <div className="scoreBoard">
                    <div className="scoreBoardTeamImage">
                        <img
                            src={printTeamLogo(
                                'L',
                                config.teamOneLogo,
                                config.teamTwoLogo,
                            )}
                            alt="CT Logo"
                        />
                    </div>
                    <div className="scoreBoardTeamScore">
                        <p
                            className={
                                teamOneSide === 'CT'
                                    ? 'defender-score'
                                    : 'attacker-score'
                            }
                        >
                            {teamOneSide === 'CT'
                                ? team_ct.score
                                : team_t.score}
                        </p>
                    </div>
                    <div className="scoreBoardMatchInfo">
                        {printTime(data.phase_countdowns)}
                        {printRound(
                            data.map.round,
                            team_ct.score,
                            team_t.score,
                        )}
                    </div>
                    <div className="scoreBoardTeamScore">
                        <p
                            className={
                                teamOneSide === 'CT'
                                    ? 'attacker-score'
                                    : 'defender-score'
                            }
                        >
                            {teamOneSide === 'CT'
                                ? team_t.score
                                : team_ct.score}
                        </p>
                    </div>
                    <div className="scoreBoardTeamImage">
                        <img
                            src={printTeamLogo(
                                'R',
                                config.teamOneLogo,
                                config.teamTwoLogo,
                            )}
                            alt="T Logo"
                        />
                    </div>
                </div>
                <div
                    className="scoreBoardTeamName"
                    id={data.phase_countdowns.phase === 'live' ? 'hidden' : ''}
                >
                    <p className="teamRightName">
                        {printTeamName(
                            'R',
                            config.teamOneName,
                            config.teamTwoName,
                        )}
                    </p>
                </div>
            </div>
            <BombAndDefuse
                phaseCountdowns={data.phase_countdowns}
                map={data.map}
                round={data.round}
                teamOneSide={teamOneSide}
                teamTwoSide={teamTwoSide}
            />
        </div>
    );
};

export default Scoreboard;
