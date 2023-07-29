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

const Teams: React.FC<TeamProps> = ({ data }) => {
    if(!data) {
        return <div></div>;
    }
    let leftTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot < 6 && p.observer_slot !== 0);
    let rightTeam: Player[] = Object.values(data.allplayers).filter((p: Player) => p.observer_slot >= 6 || p.observer_slot === 0);

    const player: Player | null = data.allplayers[data.player.steamid] || null;


    console.log(data);

    if(!leftTeam && !rightTeam) {
        return <div></div>;
    }
    return <div/>;
};
export default Teams;
