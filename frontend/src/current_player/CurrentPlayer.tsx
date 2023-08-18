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
    Bullets,
    Bomb,
} from '../assets/Icons';
import { type RootObject, type Player, type Weapon } from '../data_interface';
import { type TeamData } from '../config_interface';
import { gunMap } from '../assets/Weapons';

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

export function getCurrentPlayerNades(player: Player): JSX.Element {
    if (player.weapons == null || player.weapons.weapon_0 == null) {
        return <div></div>;
    }

    let grenade = '';
    let gun;
    const nades = Array(4).fill('');
    let spot = 0;

    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === 'Grenade') {
            grenade = gun.name;
            nades[spot] = grenade;
            spot++;
        }
    });

    if (nades[0] === '') {
        return <div></div>;
    }
    nades.sort((a, b) => a.localeCompare(b));
    nades.reverse();

    if (gunMap.get(grenade) !== null) {
        return teamNades(nades);
    }

    return <div></div>;
}

function teamNades(nades: string[]): JSX.Element {
    // If you're wondering why the code is so ugly and the css is weird, it's because nade svgs are non-uniform and I'm trying to make them all line up
    return (
        <div className="currentPlayerNades">
            <img
                alt="nades"
                className={`${nades[3]}`}
                src={gunMap.get(nades[3])}
            />
            <img
                alt="nades"
                className={`${nades[2]}`}
                src={gunMap.get(nades[2])}
            />
            <img
                alt="nades"
                className={`${nades[1]}`}
                src={gunMap.get(nades[1])}
            />
            <img
                alt="nades"
                className={`${nades[0]}`}
                src={gunMap.get(nades[0])}
            />
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAmmo(player: Player, weapon: Weapon | undefined): JSX.Element {
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
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Bullets
                className="currentPlayerBulletIcon"
                style={{ height: '2.5vh' }}
            ></Bullets>
            <div className="currentPlayerBulletIcon">
                {weapon.ammo_clip}/{weapon.ammo_reserve}
            </div>
        </div>
    );
}

interface sectionProps {
    player: Player;
    config: TeamData;
    weapon?: Weapon;
}

function ArmorCurrent({ player }: sectionProps): JSX.Element {
    if (player.state.helmet) {
        return <ArmorHelmet />;
    } else if (player.state.armor > 0) {
        return <ArmorFull />;
    }
    return <ArmorNone />;
}

function LeftSection({ player, config }: sectionProps): JSX.Element {
    return (
        <div className="leftCurrentSection">
            <div className="upper backgroundSolid">
                <div className="healthRow">
                    <HealthFull /> {player.state.health}
                </div>
                <div className="healthRow">
                    <ArmorCurrent player={player} config={config} />{' '}
                    {player.state.armor}
                </div>
            </div>
            <div className="lower backgroundOpacity teamImg">
                <img
                    src={printTeamLogo(
                        player.team,
                        config.teamOneLogo,
                        config.teamTwoLogo,
                    )}
                    alt="team logo"
                />
            </div>
        </div>
    );
}

function currentPlayerHasBomb(player: Player): JSX.Element {
    if (player.team !== 'T') {
        return <div></div>;
    }

    let s = false;
    Object.keys(player.weapons).forEach(function (key) {
        // Iterates through all weapons of the given player
        if (player.weapons[key].name === 'weapon_c4') {
            s = true;
        }
    });

    if (s) {
        return <Bomb className="currentPlayerHasKitOrBomb" />;
    }
    return <div></div>;
}

function currentPlayerHasKit(player: Player): JSX.Element {
    if (player.team !== 'CT') {
        return <div></div>;
    }

    if (player.state.defusekit != null) {
        if (player.state.defusekit) {
            return <Defuse className="currentPlayerHasKitOrBomb" />;
        }
    }
    return <div></div>;
}

function RightSection({ player, weapon }: sectionProps): JSX.Element {
    const kit = currentPlayerHasKit(player);
    const bomb = currentPlayerHasBomb(player);
    return (
        <div className="rightCurrentSection">
            <div className="upper backgroundOpacity">
                <div
                    className={
                        'currentPlayerHealthBarBase HealthBar' +
                        player.team +
                        'Color HealthBar' +
                        player.state.health.toString()
                    }
                />
                <div className="currentPlayerName"> {player.name} </div>
            </div>
            <div className="lower backgroundOpacity2">
                <div className="currentPlayerKAD">
                    <div className="currentPlayerStat">
                        <div className="currentPlayerStatValue">K</div>
                        <div className="currentPlayerStatValue">
                            {player.match_stats.kills}
                        </div>
                    </div>
                    <div className="currentPlayerStat">
                        <div className="currentPlayerStatValue">A</div>
                        <div className="currentPlayerStatValue">
                            {player.match_stats.assists}
                        </div>
                    </div>
                    <div className="currentPlayerStat">
                        <div className="currentPlayerStatValue">D</div>
                        <div className="currentPlayerStatValue">
                            {player.match_stats.deaths}
                        </div>
                    </div>
                </div>
                <div className="currentPlayerEquipment">
                    <div className="currentPlayerUtilityKitBomb">
                        {getCurrentPlayerNades(player)}
                        {kit}
                        {bomb}
                    </div>
                    <div className="currentPlayerAmmo">
                        {getAmmo(player, weapon)}
                    </div>
                </div>
            </div>
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
    if (player == null) return <div />;
    return (
        <div className="currentPlayer">
            <LeftSection player={player} config={config} />
            <RightSection player={player} config={config} weapon={weapon} />
        </div>
    );
};

export default CurrentPlayer;
