import React from 'react';
import { type RootObject } from '../data_interface';
import './RoundWin.scss';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}

function WinningTeamLogo({ team }: { team: string }): JSX.Element {
    return <div></div>;
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

    return (
        <div className="roundWinParent">
            <div className="roundWinChild">{winTeam}</div>
            <WinningTeamLogo team={winTeam} />
        </div>
    );
};

export default RoundWin;
