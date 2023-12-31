import { gunMap } from '../assets/Weapons';
import { Bomb, Defuse } from '../assets/Icons';
import { type Player } from '../data_interface';
import React from 'react';

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

export function getPrimaryWeapon(player: Player): JSX.Element {
    if (player.weapons == null || player.weapons.weapon_0 == null) {
        return <img alt="Primary Weapon" src={gunMap.get('')}></img>;
    }

    // If player is dead, no need to render any image, just returns a blank png
    if (player.state.health === 0) {
        return <img alt="Primary Weapon" src={gunMap.get('')}></img>;
    }

    let gun: any;
    let primary = '';
    let equipped = true; // Assumes weapon is equipped unless told otherwise

    // Iterates through all weapons of the given player
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];

        if (
            gun.type === 'Rifle' ||
            gun.type === 'SniperRifle' ||
            gun.type === 'Submachine Gun' ||
            gun.type === 'Shotgun' ||
            gun.type === 'Machine Gun'
        ) {
            primary = gun.name;
            equipped = gun.state === 'active';
        }
    });

    // If we get here, then it means that there were no primary weapons (ie.  Rifles, Snipers, etc)
    if (primary === '') {
        // Looking for pistols
        Object.keys(player.weapons).forEach(function (key) {
            gun = player.weapons[key];

            if (gun.type === 'Pistol') {
                primary = gun.name;
                equipped = gun.state === 'active';
            }
        });
    }

    // If we get here, then there are no pistols or primary weapons (ie. Just a knife or util)
    if (primary === '') {
        return (
            <img
                alt="knife"
                className="primary"
                src={gunMap.get(player.weapons.weapon_0.name)}
            />
        );
    }

    return (
        <img
            alt="weapon"
            className="primary"
            style={equipped ? {} : { opacity: 0.4 }}
            src={gunMap.get(primary)}
        ></img>
    );
}

export function getSecondaryWeapon(player: Player): JSX.Element {
    let equipped = true; // Assumes weapon is equipped unless told otherwise
    let secondary = ''; // Initialize secondary weapon name to ""
    if (player.weapons == null || player.weapons.weapon_0 == null) {
        return <img alt="Primary Weapon" src={gunMap.get('')}></img>;
    }

    if (!hasPrimary(player)) {
        return <img alt="no primary" src={gunMap.get('')}></img>;
    }

    let gun;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === 'Pistol') {
            secondary = gun.name;
            equipped = gun.state === 'active';
        }
    });
    if (gunMap.get(secondary) != null) {
        return (
            <img
                alt="gun"
                className="secondary"
                style={equipped ? {} : { opacity: 0.5 }}
                src={gunMap.get(secondary)}
            ></img>
        );
    }
    return <img alt="no gun" src={gunMap.get(secondary)}></img>;
}

function hasPrimary(player: Player): boolean {
    let primary = false;
    let gun;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (
            gun.type === 'Rifle' ||
            gun.type === 'SniperRifle' ||
            gun.type === 'Submachine Gun' ||
            gun.type === 'Shotgun' ||
            gun.type === 'Machine Gun'
        ) {
            primary = true;
        }
    });
    return primary;
}

export function hasBomb(player: Player): JSX.Element {
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
        return <Bomb />;
    }
    return <div></div>;
}

export function hasKit(player: Player): JSX.Element {
    if (player.team !== 'CT') {
        return <div></div>;
    }

    if (player.state.defusekit != null) {
        if (player.state.defusekit) {
            return <Defuse />;
        }
    }
    return <div></div>;
}

export function getNades(player: Player): JSX.Element {
    if (player.weapons == null || player.weapons.weapon_0 == null) {
        return <div className="leftTeamNades"></div>;
    }

    let grenade = '';
    let gun;
    const nades = Array(4).fill('');
    let spot = 0;
    let equippedIndex = -1;

    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === 'Grenade') {
            grenade = gun.name;
            nades[spot] = grenade;
            spot++;
            if (gun.state === 'active') {
                equippedIndex = spot - 1;
            }
        }
    });

    if (nades[0] === '') {
        return <div></div>;
    }
    nades.sort((a, b) => a.localeCompare(b));
    nades.reverse();

    if (gunMap.get(grenade) !== null) {
        return teamNades(nades, equippedIndex);
    }

    return (
        <div className="leftTeamNades">
            <img alt="no nades" src={gunMap.get(grenade)} />
        </div>
    );
}

function teamNades(nades: string[], equippedIndex: number): JSX.Element {
    // If you're wondering why the code is so ugly and the css is weird, it's because nade svgs are non-uniform and I'm trying to make them all line up
    return (
        <div className="teamNades">
            <img
                alt="nades"
                className={`${nades[3]}`}
                src={gunMap.get(nades[3])}
                style={equippedIndex === 3 ? {} : { opacity: 0.5 }}
            />
            <img
                alt="nades"
                className={`${nades[2]}`}
                src={gunMap.get(nades[2])}
                style={equippedIndex === 2 ? {} : { opacity: 0.5 }}
            />
            <img
                alt="nades"
                className={`${nades[1]}`}
                src={gunMap.get(nades[1])}
                style={equippedIndex === 1 ? {} : { opacity: 0.5 }}
            />
            <img
                alt="nades"
                className={`${nades[0]}`}
                src={gunMap.get(nades[0])}
                style={equippedIndex === 0 ? {} : { opacity: 0.5 }}
            />
        </div>
    );
}
