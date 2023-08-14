import './Teams.scss';
import React from 'react';

import { ArmorHelmet, ArmorFull, Skull } from '../assets/Icons';
import { getPrimaryWeapon, getSecondaryWeapon, hasBomb, hasKit, getNades } from './Equipment.js';
import { type RootObject, type Player } from '../data_interface';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject // Update the type according to your data structure
    config: TeamData | null
}

function printArmorKitHealth (player: Player, side: string): JSX.Element {
    if (side !== 'L') {
        return (
            <div>
                {' '}
                <p
                    style={{
                        color:
                            player.state.health > 50
                                ? 'white'
                                : player.state.health > 20
                                    ? 'orange'
                                    : 'red'
                    }}
                >
                    {player.state.health}
                </p>
                {player.state.helmet ? <ArmorHelmet /> : player.state.armor > 0 && <ArmorFull />}
                {hasBomb(player)}
                {hasKit(player)}
            </div>
        );
    }
    return (
        <div>
            <p
                style={{
                    color:
                        player.state.health > 50
                            ? 'white'
                            : player.state.health > 20
                                ? 'orange'
                                : 'red'
                }}
            >
                {player.state.health}
            </p>
            {hasKit(player)}
            {hasBomb(player)}
            {player.state.helmet ? <ArmorHelmet /> : player.state.armor > 0 && <ArmorFull />}
        </div>
    );
}

function printHealthBar (player: Player, side: string): JSX.Element {
    let x = '';
    if (side === 'L') {
        x = 'L';
    } else {
        x = 'R';
    }
    let y = '';
    if (player.team === 'CT') {
        y = 'CT';
    } else {
        y = 'T';
    }
    if (player.state.health > 0) {
        return (
            <div className={x + 'Chart'}>
                {
                    <div
                        className={
                            side === 'L'
                                ? 'Lbar' + y.toString() + '-' + player.state.health.toString()
                                : 'Rbar' + y.toString() + '-' + player.state.health.toString()
                        }
                    />
                }
            </div>
        );
    }
    return <div className={x + 'Chart'}>{<div className={x + 'bar-D'} />}</div>;
}
function printTeam (team: Player[], side: string, p: Player): JSX.Element {
    return (
        <div className={side === 'L' ? 'Lplayers' : 'Rplayers'}>
            {team?.map((player: Player, index: number) => (
                <div
                    className={
                        (player.state.health === 0 ? 'dead ' : 'alive ') +
                        (side === 'L' ? 'LplayerBlock' : 'RplayerBlock')
                    }
                    key={player.observer_slot}
                    id={player.observer_slot === p.observer_slot ? 'spec' : ''}
                >
                    <div className={side === 'L' ? 'LArmor' : 'RArmor'}>
                        {player.state.health > 0
                            ? (
                                <div>{printArmorKitHealth(player, side)}</div>
                            )
                            : (
                                <Skull className="skull" />
                            )}
                    </div>
                    <div>
                        <div className={side === 'L' ? 'LplayerInfo' : 'RplayerInfo'}>
                            <div className="healthBarText">
                                <div>{getPrimaryWeapon(side, player)}</div>

                                {side === 'L'
                                    ? (
                                        <p className="pLeft">
                                            {player.observer_slot} | {player.name}{' '}
                                        </p>
                                    )
                                    : (
                                        <p className="pRight">
                                            {player.name} | {player.observer_slot}{' '}
                                        </p>
                                    )}
                            </div>
                            {printHealthBar(player, side)}
                        </div>

                        <div className={side === 'L' ? 'subTextLeft' : 'subTextRight'}>
                            <div className="secondary">{getSecondaryWeapon(side, player)}</div>
                            <div className="Nades">{getNades(side, player)}</div>
                            <div className="playerStats">
                                <p>
                                    {player.match_stats.kills} / {player.match_stats.assists} /{' '}
                                    {player.match_stats.deaths}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Teams: React.FC<TeamProps> = ({ data, config }) => {
    if (data == null) {
        return <div></div>;
    }
    if (config == null) return <div>Loading...</div>;
    if (data.allplayers == null) return <div>Loading...</div>;

    const leftTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot < 6 && p.observer_slot !== 0);
    const rightTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot >= 6 || p.observer_slot === 0);

    const player: Player | null = data.player;

    if (leftTeam == null && rightTeam == null) {
        return <div></div>;
    }

    return (
        <div>
            {printTeam(leftTeam, 'L', player)}
            {printTeam(rightTeam, 'R', player)}
        </div>

    );
};
export default Teams;
