import './Teams.scss';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArmorHelmet, ArmorFull, Skull } from '../assets/Icons';

import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPrimaryWeapon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSecondaryWeapon,
    hasBomb,
    hasKit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getNades,
} from './Equipment';
import { type RootObject, type Player } from '../data_interface';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}

interface ArmorKitHealthProps {
    player: Player;
    side: string;
}

interface ContainerProps {
    players: Player[];
    side: string;
}

function getHealthColor(health: number): string {
    if (health > 50) {
        return 'white';
    } else if (health > 20) {
        return 'orange';
    }
    return 'red';
}

// function printArmorKitHealth(player: Player, side: string): JSX.Element {
//     if (side !== 'L') {
//         return (
//             <div>
//                 {' '}
//                 <p style={{ color: getHealthColor(player.state.health) }}>
//                     {player.state.health}
//                 </p>
//                 {player.state.helmet ? (
//                     <ArmorHelmet />
//                 ) : (
//                     player.state.armor > 0 && <ArmorFull />
//                 )}
//                 {hasBomb(player)}
//                 {hasKit(player)}
//             </div>
//         );
//     }
//     return (
//         <div>
//             <p style={{ color: getHealthColor(player.state.health) }}>
//                 {player.state.health}
//             </p>
//             {hasKit(player)}
//             {hasBomb(player)}
//             {player.state.helmet ? (
//                 <ArmorHelmet />
//             ) : (
//                 player.state.armor > 0 && <ArmorFull />
//             )}
//         </div>
//     );
// }

// function printHealthBar(player: Player, side: string): JSX.Element {
//     let x = '';
//     if (side === 'L') {
//         x = 'L';
//     } else {
//         x = 'R';
//     }
//     let y = '';
//     if (player.team === 'CT') {
//         y = 'CT';
//     } else {
//         y = 'T';
//     }
//     if (player.state.health > 0) {
//         return (
//             <div className={x + 'Chart'}>
//                 {
//                     <div
//                         className={
//                             side === 'L'
//                                 ? 'Lbar' +
//                                   y.toString() +
//                                   '-' +
//                                   player.state.health.toString()
//                                 : 'Rbar' +
//                                   y.toString() +
//                                   '-' +
//                                   player.state.health.toString()
//                         }
//                     />
//                 }
//             </div>
//         );
//     }
//     return <div className={x + 'Chart'}>{<div className={x + 'bar-D'} />}</div>;
// }

// function printTeam(team: Player[], side: string, p: Player): JSX.Element {
//     return (
//         <div className={side === 'L' ? 'Lplayers' : 'Rplayers'}>
//             {team?.map((player: Player, index: number) => (
//                 <div
//                     className={
//                         (player.state.health === 0 ? 'dead ' : 'alive ') +
//                         (side === 'L' ? 'LplayerBlock' : 'RplayerBlock')
//                     }
//                     key={player.observer_slot}
//                     id={player.observer_slot === p.observer_slot ? 'spec' : ''}
//                 >
//                     <div className={side === 'L' ? 'LArmor' : 'RArmor'}>
//                         {player.state.health > 0 ? (
//                             <div>{printArmorKitHealth(player, side)}</div>
//                         ) : (
//                             <Skull className="skull" />
//                         )}
//                     </div>
//                     <div>
//                         <div
//                             className={
//                                 side === 'L' ? 'LplayerInfo' : 'RplayerInfo'
//                             }
//                         >
//                             <div className="healthBarText">
//                                 <div>{getPrimaryWeapon(side, player)}</div>
//
//                                 {side === 'L' ? (
//                                     <p className="pLeft">
//                                         {player.observer_slot} | {player.name}{' '}
//                                     </p>
//                                 ) : (
//                                     <p className="pRight">
//                                         {player.name} | {player.observer_slot}{' '}
//                                     </p>
//                                 )}
//                             </div>
//                             {printHealthBar(player, side)}
//                         </div>
//
//                         <div
//                             className={
//                                 side === 'L' ? 'subTextLeft' : 'subTextRight'
//                             }
//                         >
//                             <div className="secondary">
//                                 {getSecondaryWeapon(side, player)}
//                             </div>
//                             <div className="Nades">
//                                 {getNades(side, player)}
//                             </div>
//                             <div className="playerStats">
//                                 <p>
//                                     {player.match_stats.kills} /{' '}
//                                     {player.match_stats.assists} /{' '}
//                                     {player.match_stats.deaths}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

export function ArmorKitHealth({
    player,
    side,
}: ArmorKitHealthProps): JSX.Element {
    // health,armor,side,helmet,kit,bomb
    const health = player.state.health;
    const armor = player.state.armor;
    const helmet = player.state.helmet;
    const kit = hasKit(player);
    const bomb = hasBomb(player);
    return (
        <div>
            <p
                className={side === 'right' ? 'rightContainerText' : ''}
                style={{
                    color: getHealthColor(health),
                    // eslint-disable-next-line no-constant-condition
                }}
            >
                {health}
            </p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Your content here */}
                {kit}
                {bomb}
                {helmet != null ? <ArmorHelmet /> : armor > 0 && <ArmorFull />}
            </div>
        </div>
    );
}

export function Container({ players, side }: ContainerProps): JSX.Element {
    const className = 'container ' + side + 'Container';
    return (
        <div className={className}>
            {players.map((player) => (
                <div className="unit" key={player.id}>
                    <div className="armorHealthSubsection">
                        {ArmorKitHealth({ player, side })}
                    </div>
                    <div className="healthBarSection">
                        <div
                            className={
                                'HealthBarBase HealthBar' +
                                player.team +
                                'Color HealthBar-' +
                                player.state.health.toString()
                            }
                        >
                            <div
                                className={
                                    side === 'right' ? 'rightContainerText' : ''
                                }
                                style={{ marginLeft: '1.5%' }}
                            >
                                {player.name}
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

    const allPlayers = data.allplayers;
    // convert to array
    const playerArray = Object.keys(allPlayers).map((key) => allPlayers[key]);
    const leftPlayers = getLeftPlayers(playerArray);
    const rightPlayers = getRightPlayers(playerArray);
    return (
        <div>
            <Container players={leftPlayers} side={'left'} />
            <Container players={rightPlayers} side={'right'} />
        </div>
    );
};
export default Teams;

export function getRightPlayers(players: Player[]): Player[] {
    const rightPlayers = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].observer_slot > 5 || players[i].observer_slot === 0) {
            rightPlayers.push(players[i]);
        }
    }
    return rightPlayers;
}
export function getLeftPlayers(players: Player[]): Player[] {
    const leftPlayers = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].observer_slot < 6 && players[i].observer_slot !== 0) {
            leftPlayers.push(players[i]);
        }
    }
    return leftPlayers;
}
