import "./Teams.scss";
import React, { useState } from "react";

import { ArmorHelmet, ArmorFull, SmallBomb, Skull,} from "../assets/Icons";
import { getPrimaryWeapon, getSecondaryWeapon, hasBomb, hasKit, getNades } from "./Equipment.js";
import {RootObject, AllPlayers, Player} from "../data_interface";

interface TeamProps {
    data: RootObject; // Update the type according to your data structure
}

function printArmorKitHealth(player:Player, side:string) {
    if (side != "L") {
        return (
            <div>
                {" "}
                <p
                    style={{
                        color:
                            player.state.health > 50
                                ? "white"
                                : player.state.health > 20
                                    ? "orange"
                                    : "red",
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
                            ? "white"
                            : player.state.health > 20
                                ? "orange"
                                : "red",
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

function printHealthBar(player:Player,side:string) {
    let x = "";
    if (side == "L") {
        x = "L";
    } else {
        x = "R";
    }
    let y = "";
    if (player.team == "CT") {
        y = "CT";
    } else {
        y = "T";
    }
    if (player.state.health > 0) {
        return (
            <div className={x + "Chart"}>
                {
                    <div
                        className={
                            side === "L"
                                ? "Lbar" + y + "-" + player.state.health
                                : "Rbar" + y + "-" + player.state.health
                        }
                    />
                }
            </div>
        );
    }
    return <div className={x + "Chart"}>{<div className={x + "bar-D"} />}</div>;
}
function printTeam(team:Player[],side:string,p:Player) {
    return (
        <div className={side === "L" ? "Lplayers" : "Rplayers"}>
            {team?.map((player: Player, index: number) => (
                <div
                    className={
                        (player.state.health === 0 ? "dead " : "alive ") +
                        (side === "L" ? "LplayerBlock" : "RplayerBlock")
                    }
                    key={player.observer_slot}
                    id={player.observer_slot === p.observer_slot ? "spec" : ""}
                >
                    <div className={side === "L" ? "LArmor" : "RArmor"}>
                        {player.state.health > 0 ? (
                            <div>{printArmorKitHealth(player, side)}</div>
                        ) : (
                            <Skull className="skull" />
                        )}
                    </div>
                    <div className="playerInfo">
                        <div className={side === "L" ? "LplayerInfo" : "RplayerInfo"}>
                            <div className="healthBarText">
                                <div>{getPrimaryWeapon(side, player)}</div>

                                {side === "L" ? (
                                    <p className="pLeft">
                                        {player.observer_slot} | {player.name}{" "}
                                    </p>
                                ) : (
                                    <p className="pRight">
                                        {player.name} | {player.observer_slot}{" "}
                                    </p>
                                )}
                            </div>
                            {printHealthBar(player,side)}
                        </div>

                        <div className={side === "L" ? "subTextLeft" : "subTextRight"}>
                            <div className="secondary">{getSecondaryWeapon(side, player)}</div>
                            <div className="Nades">{getNades(side, player)}</div>
                            <div className="playerStats">
                                <p>
                                    {player.match_stats.kills} / {player.match_stats.assists} /{" "}
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

const Teams: React.FC<TeamProps> = ({ data }) => {
    if(!data) {
        return <div></div>;
    }

    let leftTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot < 6 && p.observer_slot !== 0);
    let rightTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot >= 6 || p.observer_slot === 0);

    const player: Player | null = data.player;

    if(!leftTeam && !rightTeam) {
        return <div></div>;
    }

    return (
        <div>
            {printTeam(leftTeam,"L",player)}
            {printTeam(rightTeam,"R",player)}
        </div>

    );
};
export default Teams;
