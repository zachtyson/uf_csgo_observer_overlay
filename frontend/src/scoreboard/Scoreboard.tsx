import React from 'react';
import {RootObject} from "../data_interface";
import './Scoreboard.scss';
import {Defuse, FlashingBomb} from "../assets/Icons";
import {teamOneLogo, teamOneName, teamTwoLogo, teamTwoName,} from "../teamInfo.js"

let swap = 0;
let startingSide = 'ct';
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

    if (phase_ends_in < 10) {
        if(phase_countdowns.phase === "live") {
            return <div className="time low">{phase_ends_in}</div>;
        }
        if(phase_countdowns.phase === "over") {
            return <div className="time">{phase_ends_in}</div>;
        }
    }
    phase_ends_in = Math.floor(phase_ends_in);
    const minutes = Math.floor(phase_ends_in / 60);
    const seconds = phase_ends_in % 60;
    const formattedSeconds = `${minutes} : ${seconds}`;

    return <div className="time">{formattedSeconds}</div>;
}

function printTeamLogo(side:boolean) {
    if (side) {
        if(swap === 0){
            return teamOneLogo;
        } else {
            return teamTwoLogo;
        }
    } else {
        if(swap === 0) {
            return teamTwoLogo;
        } else {
            return teamOneLogo;
        }
    }
}


function printCTWinLogo(){
    if(swap) {
        return teamTwoLogo;
    } else {
        return teamOneLogo;
    }
}

function printTWinLogo(){
    if(swap) {
        return teamOneLogo;
    } else {
        return teamTwoLogo;
    }
}

function printTeamName(side:string){
    //team one is always at left
    //team one should start ct, if they don't, press 0
    if(side === "R") {
        if(startingSide === 't') {
            return teamOneName;
        }
        return teamTwoName
    } else {
        if(startingSide === 't') {
            return teamTwoName;
        }
        return teamOneName
    }
}

const Scoreboard: React.FC<ScoreboardProps> = ({ data }) => {
    if (!data) return <div>Loading...</div>;

    const { team_ct, team_t } = data.map;
    const isLeftCT = true; // Replace with your logic to determine leftCT

    const allPlayers = data.allplayers;
    console.log(data);
    return (
        <div className="parent">
            <div className="TeamName"
                 {...(data.map.phase !== "freezetime"
                     ? { id:"hidden" }
                     : {})}
            >
                <p className="teamLeftName">
                    {printTeamName("L")}
                </p>
            </div>
            <div className="scoreBoard">
                <div className="teamImage">
                    <img src={teamOneLogo} alt="CT Logo" />
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
                    <img src={teamTwoLogo} alt="T Logo" />
                </div>
            </div>
            <div className="TeamName"
                 {...(data.map.phase !== "freezetime"
                     ? { id:"hidden" }
                     : {})}
            >
                <p className="teamRightName">
                    {printTeamName("R")}
                </p>
            </div>
        </div>
    );
};


export default Scoreboard;
