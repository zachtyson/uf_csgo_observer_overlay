import React from 'react';
import { type RootObject } from '../data_interface';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
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
    return <div></div>;
};
export default RoundWin;
