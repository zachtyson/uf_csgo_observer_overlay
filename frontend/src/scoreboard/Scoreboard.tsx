import React from 'react';
import {RootObject} from "../data_interface";
import './Scoreboard.scss';
import {FlashingBomb, Bomb, Defuse } from "../assets/Icons";
import CTLogo from '../assets/images/testUFBlueIcon.png';
import TLogo from '../assets/images/testUFOrangeIcon.png';

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

const Scoreboard: React.FC<ScoreboardProps> = ({ data }) => {
    if (!data) return <div>Loading...</div>;

    const { team_ct, team_t } = data.map;
    const isLeftCT = true; // Replace with your logic to determine leftCT

    return (
        <div className="scoreBoard">
            <div className="teamImage">
                <img src={CTLogo} alt="CT Logo" />
            </div>
            <div className="teamScore">
                <p className={isLeftCT ? "defender-score" : "attacker-score"}>
                    {isLeftCT ? team_ct.score : team_t.score}
                </p>
            </div>
            <div className="matchInfo">
                {printTime(data.phase_countdowns)}
                {printRound(data.map.round, team_ct.score, team_t.score)}
            </div>
            <div className="teamScore">
                <p className={isLeftCT ? "attacker-score" : "defender-score"}>
                    {isLeftCT ? team_t.score : team_ct.score}
                </p>
            </div>
            <div className="teamImage">
                <img src={TLogo} alt="T Logo" />
            </div>
        </div>
    );
};


export default Scoreboard;
