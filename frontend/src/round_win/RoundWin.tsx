import React from 'react';
import { type RootObject } from '../data_interface';
import './RoundWin.scss';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}

function WinningTeamLogo({
    winTeam,
    teamOneLogo,
    teamTwoLogo,
    teamOneSide,
    teamTwoSide,
}: {
    winTeam: string;
    teamOneLogo: any;
    teamTwoLogo: any;
    teamOneSide: string | undefined;
    teamTwoSide: string | undefined;
}): JSX.Element {
    if (teamOneSide === winTeam) {
        return (
            <div className="roundWinLogo">
                <img
                    src={teamOneLogo}
                    alt="Team One Logo"
                    className="roundWinLogoImg"
                />
            </div>
        );
    } else if (teamTwoSide === winTeam) {
        return (
            <div className="roundWinLogo">
                <img
                    src={teamTwoLogo}
                    alt="Team Two Logo"
                    className="roundWinLogoImg"
                />
            </div>
        );
    } else {
        // either winTeam is not T/CT or teamOneSide/teamTwoSide is not T/CT
        // this shouldn't ever happen, but just in case
        return <div></div>;
    }
}

const RoundWin: React.FC<TeamProps> = ({ data, config }) => {
    if (data == null) {
        return <div></div>;
    }
    if (config == null) return <div></div>;
    if (data.map.phase === 'warmup') return <div></div>;
    if (data.round == null) return <div></div>;
    const round = data.round;
    if (round.phase !== 'over' || round.win_team == null) return <div></div>;
    const winTeam = round.win_team;
    const teamOneLogo = config.teamOneLogo;
    const teamTwoLogo = config.teamTwoLogo;

    return (
        <div className="roundWinParent">
            <div className="roundWinChild">
                <WinningTeamLogo
                    winTeam={winTeam}
                    teamOneLogo={teamOneLogo}
                    teamTwoLogo={teamTwoLogo}
                    teamOneSide={data.allplayers.teamOneSide}
                    teamTwoSide={data.allplayers.teamTwoSide}
                />
            </div>
        </div>
    );
};

export default RoundWin;
