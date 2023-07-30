import React from 'react';
import {RootObject, AllPlayers, Player} from "../data_interface";
import './Scoreboard.scss';
import {Defuse, FlashingBomb} from "../assets/Icons";
import * as string_decoder from "string_decoder";

let teamOneSide:string= 'CT';
let swap = 0;
interface ScoreboardProps {
    data: RootObject; // Update the type according to your data structure
    teamOneLogo: any;
    teamOneName: string;
    teamTwoLogo: any
    teamTwoName: string;
    teamOneStartingSide: string;
}


window.addEventListener("keydown", (event) => {
    if(event.key === "`") {
        if(swap === 0) {
            swap = 1
        } else {
            swap = 0
        }
    }
    if(event.key === "0") {
        if(teamOneSide === 'CT') {
            teamOneSide = 'T'
        } else {
            teamOneSide = 'CT'
        }
    }
});

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
    let formattedSeconds:string;
    if (seconds < 10) {
        formattedSeconds = `${minutes} : 0${seconds}`;
    }
    else {
        formattedSeconds = `${minutes} : ${seconds}`;
    }


    return <div className="time">{formattedSeconds}</div>;
}

function printTeamLogo(side:boolean, teamOneLogo:any, teamTwoLogo:any) {
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


function printCTWinLogo(teamOneLogo:any, teamTwoLogo:any) {
    if(swap) {
        return teamTwoLogo;
    } else {
        return teamOneLogo;
    }
}

function printTWinLogo(teamOneLogo:any, teamTwoLogo:any){
    if(swap) {
        return teamOneLogo;
    } else {
        return teamTwoLogo;
    }
}

function printTeamName(side:string, teamOneName:string, teamTwoName:string){
    //team one is always at left
    //team one should start ct, if they don't, press 0
    if(side === "R") {
        if(teamOneSide === 'T') {
            return teamOneName;
        }
        return teamTwoName
    } else {
        if(teamOneSide === 'T') {
            return teamTwoName;
        }
        return teamOneName
    }
}

function hasCTPlayerOnSlots1To5(allPlayers:AllPlayers): boolean {
    return Object.values(allPlayers).some(
        (player: Player) => player.team === 'CT' && player.observer_slot >= 1 && player.observer_slot <= 5
    );
}

const Scoreboard: React.FC<ScoreboardProps> = ({ data,teamOneLogo,teamOneName,teamTwoLogo,teamTwoName,teamOneStartingSide }) => {
    if (!data) return <div>Loading...</div>;
    teamOneSide = teamOneStartingSide;


    const { team_ct, team_t } = data.map;
    //console.log(data);
    const isLeftCT: boolean = hasCTPlayerOnSlots1To5(data.allplayers);
    return (
        <div className="parent">
            <div className="TeamName" id={data.phase_countdowns.phase === "live" ? "hidden" : ""}>
                <p className="teamLeftName">
                    {printTeamName("L", teamOneName, teamTwoName)}
                </p>
            </div>
            <div className="scoreBoard">
                <div className="teamImage">
                    <img src={printTeamLogo(isLeftCT,teamOneLogo,teamTwoLogo)} alt="CT Logo" />
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
                    <img src={printTeamLogo(!isLeftCT,teamOneLogo,teamTwoLogo)} alt="T Logo" />
                </div>
            </div>
            <div className="TeamName" id={data.phase_countdowns.phase === "live" ? "hidden" : ""}>
                <p className="teamRightName">
                    {printTeamName("R", teamOneName, teamTwoName)}
                </p>
            </div>
        </div>
    );
};


export default Scoreboard;
