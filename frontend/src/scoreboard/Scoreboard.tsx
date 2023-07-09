import React from 'react';
import {RootObject} from "../data_interface";
import './Scoreboard.scss';
import {FlashingBomb, Bomb, Defuse } from "../assets/Icons";

interface ScoreboardProps {
    data: RootObject; // Update the type according to your data structure
}
function printRound(num:number,CTScore:number,TScore:number) {
    if(num <= 29) {
        return <div> ROUND {num + 1}/30 </div>
    } else {
        let OTNumber = Math.floor((num - 30)/6) + 1
        let OTModulo = (num - 30) % 6;
        if(OTModulo === 0) {
            if(CTScore !== TScore) {
                OTNumber = OTNumber - 1
            }
        }
        return <div>
            <div> Overtime {OTNumber}</div>
            <div> First to {15 + OTNumber*3 + 1} </div>
        </div>
    }
}

function printTime(phase_countdowns:RootObject["phase_countdowns"]){
    if (phase_countdowns.phase === "bomb") {
        return <FlashingBomb className="bombImage" />
    }
    if (phase_countdowns.phase === "defuse"){
        return <Defuse className="bombImage" />
    }
    let phase_ends_in:number;
    try {
        phase_ends_in = parseFloat(phase_countdowns.phase_ends_in);
    } catch (e) {
        phase_ends_in = 0;
    }

    if (phase_ends_in < 10 && phase_countdowns.phase === "live") {
        return <div id="timelow">{phase_countdowns.phase_ends_in}</div>;
    }

    return <div id="time">{phase_countdowns.phase_ends_in}</div>;
}

const Scoreboard: React.FC<ScoreboardProps> = (props) => {
    const { data } = props; // Access the data prop
    let leftCT = true;
    // Use the data object in your component
    if(!data) return (<div>Loading...</div>);
    const [team_ct, team_t] = [data.map.team_ct, data.map.team_t];
    return (
        <div className="scoreboard">
            <div className="TeamLeft">
                <p className={leftCT ? "defender-score" : "attacker-score"}>
                    {leftCT ? team_ct.score : team_t.score}
                </p>
            </div>
            <div className="Match_info">
                {printTime(data.phase_countdowns)}
                {printRound(data.map.round,team_ct.score,team_t.score)}
            </div>
            <div className="TeamRight">
                <p className={leftCT ? "attacker-score" : "defender-score"}>
                    {leftCT ? team_t.score : team_ct.score}
                </p>
            </div>
        </div>
    );
}

export default Scoreboard;
