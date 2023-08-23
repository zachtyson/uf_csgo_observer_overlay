import './Teams.scss';
import React, { useEffect, useState } from 'react';
import { ArmorHelmet, ArmorFull, Skull } from '../assets/Icons';

import {
    getPrimaryWeapon,
    getSecondaryWeapon,
    hasBomb,
    hasKit,
    getNades,
} from './Equipment';
import { type RootObject, type Player } from '../data_interface';
import { type TeamData } from '../config_interface';

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
    config: TeamData | null;
}

interface PlayerSideProps {
    player: Player;
    side: string;
}

interface ContainerProps {
    players: Player[] | null;
    side: string;
    currentSpec: Player | null;
}

function getHealthColor(health: number): string {
    if (health > 50) {
        return 'white';
    } else if (health > 20) {
        return 'orange';
    }
    return 'red';
}
export function ArmorKitHealth({ player, side }: PlayerSideProps): JSX.Element {
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

interface PlayerProps {
    player: Player;
    side: string;
    currentSpec: Player | null;
}

function DeadPlayer({ player, side }: PlayerSideProps): JSX.Element {
    if (player.observer_slot === undefined) {
        return <div />;
    }
    if (player.match_stats === undefined) {
        return <div />;
    }
    return (
        <div className="dead">
            <div className="deadSkullSection">
                <Skull></Skull>
            </div>
            <div className="deadNameKADSection">
                <div
                    className={
                        side === 'right'
                            ? 'rightContainerText deadName'
                            : 'deadName'
                    }
                >
                    <div
                        style={{
                            ...(side === 'left'
                                ? { marginLeft: '1.5%' }
                                : { marginRight: '1.5%' }),
                        }}
                    >
                        {' '}
                        {side === 'right'
                            ? player.name +
                              ' | ' +
                              player.observer_slot.toString()
                            : player.observer_slot.toString() +
                              ' | ' +
                              player.name}
                    </div>
                </div>
                <div
                    className={
                        side === 'right'
                            ? 'rightContainerText deadKAD'
                            : 'deadKAD'
                    }
                >
                    <div
                        style={{
                            ...(side === 'left'
                                ? { marginLeft: '1.5%' }
                                : { marginRight: '1.5%' }),
                        }}
                    >
                        {player.match_stats.kills.toString() +
                            ' / ' +
                            player.match_stats.assists.toString() +
                            ' / ' +
                            player.match_stats.deaths.toString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerDiv({ player, side, currentSpec }: PlayerProps): JSX.Element {
    if (player.state.health === 0) {
        return <DeadPlayer player={player} side={side} />;
    }
    if (player.observer_slot === undefined) {
        return <div></div>;
    }
    return (
        <div
            className={player === currentSpec ? 'unit spec' : 'unit'}
            key={player.id}
        >
            <div className="armorHealthSubsection">
                {ArmorKitHealth({ player, side })}
            </div>
            <div className="healthBarSection">
                <div className="healthBarSectionBackground1"></div>
                <div className="healthBarSectionBackground2"></div>
                <div
                    className={
                        'HealthBarBase HealthBar' +
                        player.team +
                        'Color HealthBar' +
                        player.state.health.toString()
                    }
                >
                    <div
                        className={
                            side === 'right'
                                ? 'rightContainerText playerName'
                                : 'playerName'
                        }
                        style={{ marginLeft: '1.5%' }}
                    >
                        {side === 'right'
                            ? player.name +
                              ' | ' +
                              player.observer_slot.toString()
                            : player.observer_slot.toString() +
                              ' | ' +
                              player.name}
                    </div>
                    <div>{getPrimaryWeapon(player)}</div>
                </div>
                <div className="utilityBarSection">
                    <div>{getSecondaryWeapon(player)}</div>
                    <div>{getNades(player)}</div>
                    <div
                        className={
                            side === 'right' ? 'kad rightContainerText' : 'kad'
                        }
                    >
                        {player.match_stats.kills.toString() +
                            ' / ' +
                            player.match_stats.assists.toString() +
                            ' / ' +
                            player.match_stats.deaths.toString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Container({
    players,
    side,
    currentSpec,
}: ContainerProps): JSX.Element {
    if (players == null) return <div></div>;
    const className = 'container ' + side + 'Container';
    let currentSpecPlayer: Player | null = null;
    if (currentSpec != null && players != null && currentSpec.steamid !== '1') {
        for (let i = 0; i < players.length; i++) {
            if (players[i].observer_slot === currentSpec.observer_slot) {
                currentSpecPlayer = players[i];
            }
        }
    }
    return (
        <div className={className}>
            {players.map((player) => (
                <div key={player.id}>
                    {PlayerDiv({
                        player,
                        side,
                        currentSpec: currentSpecPlayer,
                    })}
                </div>
            ))}
        </div>
    );
}

const Teams: React.FC<TeamProps> = ({ data, config }) => {
    if (data == null) {
        return <div></div>;
    }
    const [currentSpec, setCurrentSpec] = useState<Player | any>(null);
    if (config == null) return <div>Loading...</div>;
    if (data.allplayers == null) return <div>Loading...</div>;
    useEffect(() => {
        const newSpec = data.player;
        setCurrentSpec(newSpec);
    }, [data]);
    const leftPlayers = data.allplayers.teamOne;
    const rightPlayers = data.allplayers.teamTwo;
    return (
        <div>
            <Container
                players={leftPlayers}
                side={'left'}
                currentSpec={currentSpec}
            />
            <Container
                players={rightPlayers}
                side={'right'}
                currentSpec={currentSpec}
            />
        </div>
    );
};
export default Teams;
