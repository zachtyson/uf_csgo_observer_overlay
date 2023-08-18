import './CurrentPlayer.scss';
import React from 'react';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HealthFull,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ArmorNone,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ArmorFull,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ArmorHelmet,
    Defuse,
    SmallBomb,
    Bullets,
} from '../assets/Icons';
import { gunMap } from '../assets/Weapons';
import { type RootObject, type Player, type Weapon } from '../data_interface';
import { type TeamData } from '../config_interface';

let swap = 0;
interface CurrentPlayerProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}
window.addEventListener('keydown', (event) => {
    if (event.key === '`') {
        if (swap === 0) {
            swap = 1;
        } else {
            swap = 0;
        }
    }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printTeamLogo(side: string, teamOneLogo: any, teamTwoLogo: any): any {
    if (side === 'CT') {
        if (swap === 0) {
            return teamOneLogo;
        } else {
            return teamTwoLogo;
        }
    } else {
        if (swap === 0) {
            return teamTwoLogo;
        } else {
            return teamOneLogo;
        }
    }
}

function hasKitOrBomb(player: Player): boolean | JSX.Element {
    if (player.state.defusekit === true) {
        return <Defuse />;
    } else {
        const bomb = [...Object.values(player.weapons)].find(
            (w) => w.name === 'weapon_c4',
        );
        if (bomb != null) return <SmallBomb />;
    }
    return false;
}

function getNadeClass(nade: string): string {
    return `Nade ${nade}]}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Grenades(player: Player): JSX.Element {
    if (player == null || player.weapons == null) return <div />;
    let x = '';
    let gun;
    const nades = Array(4).fill('');
    let spot = 0;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === 'Grenade') {
            x = gun.name;
            nades[spot] = x;
            spot++;
        }
    });
    if (nades[0] === '' && hasKitOrBomb(player) == null) {
        return (
            <div className="Nades">
                <p>NO UTILITY</p>
            </div>
        );
    }
    nades.sort((a, b) => a.localeCompare(b));
    nades.reverse();

    return (
        <div className="Nades">
            <img
                alt="Nade"
                className={getNadeClass(nades[3])}
                src={gunMap.get(nades[3])}
            />
            {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
            <img
                alt="Nade"
                className={getNadeClass(nades[2])}
                src={gunMap.get(nades[2])}
            />
            {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
            <img
                alt="Nade"
                className={getNadeClass(nades[1])}
                src={gunMap.get(nades[1])}
            />
            {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
            <img
                alt="Nade"
                className={getNadeClass(nades[0])}
                src={gunMap.get(nades[0])}
            />
            {hasKitOrBomb(player)}
        </div>
    );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAmmo(player: Player, weapon: Weapon): JSX.Element {
    if (player == null) {
        return <div />;
    }
    if (weapon == null) {
        return <div />;
    }

    if (
        weapon.type === 'Knife' ||
        weapon.type === 'Grenade' ||
        weapon.type === 'C4'
    ) {
        return <div />;
    }
    return (
        <div className="ammo">
            <Bullets className="icon" />
            <div className="ammo-clip">{weapon.ammo_clip}</div> /
            {weapon.ammo_reserve}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printHealthBar(side: string, player: Player): JSX.Element {
    let x;
    if (side === 'left') {
        x = 'L';
    } else {
        x = 'R';
    }
    let y;
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
                            side === 'left'
                                ? 'Lbar' +
                                  y.toString() +
                                  '-' +
                                  player.state.health.toString()
                                : 'Rbar' +
                                  y.toString() +
                                  '-' +
                                  player.state.health.toString()
                        }
                    />
                }
            </div>
        );
    }
    return <div className={x + 'Chart'}>{<div className={x + 'bar-D'} />}</div>;
}

interface sectionProps {
    player: Player;
}

function ArmorCurrent({ player }: sectionProps): JSX.Element {
    if (player.state.helmet) {
        return <ArmorHelmet />;
    } else if (player.state.armor > 0) {
        return <ArmorFull />;
    }
    return <ArmorNone />;
}

function LeftSection({ player }: sectionProps): JSX.Element {
    return (
        <div className="leftCurrentSection">
            <div className="upper backgroundSolid">
                <div className="healthRow">
                    <HealthFull /> {player.state.health}
                </div>
                <div className="healthRow">
                    <ArmorCurrent player={player} /> {player.state.armor}
                </div>
            </div>
            <div className="lower backgroundOpacity"></div>
        </div>
    );
}
function RightSection({ player }: sectionProps): JSX.Element {
    return (
        <div className="rightCurrentSection">
            <div className="upper"></div>
            <div className="lower"></div>
        </div>
    );
}

const CurrentPlayer: React.FC<CurrentPlayerProps> = ({ data, config }) => {
    if (data == null) return <div />;
    if (config == null) return <div />;
    const player = data.player;
    let weapon: Weapon | null = null;
    // Iterate over the weapon object to a weapon where weapons.state == active
    for (let i = 0; i < Object.keys(data.player.weapons).length; i++) {
        if (
            data.player.weapons[Object.keys(data.player.weapons)[i]].state ===
            'active'
        ) {
            weapon = data.player.weapons[Object.keys(data.player.weapons)[i]];
            break;
        }
    }
    if (weapon == null) {
        weapon = {
            name: 'weapon_knife',
            type: 'Knife',
            state: 'active',
            paintkit: 'default',
        };
    }

    // if (player != null) {
    //     return (
    //         <div className="currentPlayer">
    //             <div className="playerBlock">
    //                 <div className="playerInfoTop">
    //                     <div className="playerVitals">
    //                         <div className="health">
    //                             <HealthFull
    //                                 className="icon"
    //                                 style={{ fill: 'white' }}
    //                             />
    //                             <div className="vitalNum">
    //                                 {' '}
    //                                 {player.state.health}{' '}
    //                             </div>
    //                         </div>
    //                         <div className="armor">
    //                             {player.state.helmet ? (
    //                                 <ArmorHelmet className="icon" />
    //                             ) : player.state.armor > 0 ? (
    //                                 <ArmorFull className="icon" />
    //                             ) : (
    //                                 <ArmorNone className="icon" />
    //                             )}
    //                             <div className="vitalNum">
    //                                 {' '}
    //                                 {player.state.armor}{' '}
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="player-id">
    //                         <div
    //                             className={
    //                                 player.team === 'CT' ? 'ct-name' : 't-name'
    //                             }
    //                         >
    //                             {' '}
    //                             <p className="pLeft">{player.name}</p>
    //                         </div>
    //                         {printHealthBar('left', player)}
    //                     </div>
    //                 </div>
    //                 <div className="playerInfoBottom">
    //                     <div className="team">
    //                         <img
    //                             className="teamImg"
    //                             src={printTeamLogo(
    //                                 player.team,
    //                                 config.teamOneLogo,
    //                                 config.teamTwoLogo,
    //                             )}
    //                             alt=""
    //                         />
    //                     </div>
    //                     <div className="playerInfo">
    //                         <div className="player-score">
    //                             <div className="score-container">
    //                                 <div className="label">K</div>
    //                                 <div className="value">
    //                                     {player.match_stats.kills}{' '}
    //                                 </div>
    //                             </div>
    //
    //                             <div className="score-container">
    //                                 <div className="label">A</div>
    //                                 <div className="value">
    //                                     {player.match_stats.assists}{' '}
    //                                 </div>
    //                             </div>
    //
    //                             <div className="score-container">
    //                                 <div className="label">D</div>
    //                                 <div className="value">
    //                                     {player.match_stats.deaths}{' '}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="player-equipment">
    //                             <div style={{ height: '50%' }}>
    //                                 {Grenades(player)}
    //                             </div>
    //                             <div style={{ height: '50%' }}>
    //                                 {getAmmo(player, weapon)}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // } else {
    //     return <div />;
    // }
    if (player == null) return <div />;
    return (
        <div className="currentPlayer">
            <LeftSection player={player} />
            <RightSection player={player} />
        </div>
    );
};

export default CurrentPlayer;
