import express from 'express';
import fs from 'fs';
import http from 'http';
import socketIo from 'socket.io';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let halfLength = 15; // 30 rounds in a game, 15 rounds in a half
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let maxRounds = 30; // 30 rounds in a game, 15 rounds in a half
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let overtimeHalfLength = 3; // 6 rounds in overtime, 3 rounds in a half
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type teamType = 'T' | 'CT';
let teamOneCurrentSide: teamType = 'CT';
let teamOneStartingSide: teamType = 'CT';

async function getConfig(): Promise<any> {
    // read config.json
    try {
        const c = fs.readFileSync('config.json', 'utf8');
        return JSON.parse(c);
    } catch (err) {
        console.error('Error reading config.json:', err);
        return null;
    }
}

type PlayerADRStore = Record<string, Record<number, number>>;

const playerADRStore: PlayerADRStore = {};

type PlayerADR = Record<string, number>;

const playerADR: PlayerADR = {};

let teamOne: any[] = [];

let teamTwo: any[] = [];

function updateData(userId: string, roundNum: number, value: number): void {
    if (playerADRStore[userId] == null) {
        playerADRStore[userId] = {};
    }

    if (playerADRStore[userId][roundNum] !== value) {
        playerADRStore[userId][roundNum] = value;
    }
}

function getADRForUser(userId: string): number {
    const levels = playerADRStore[userId];
    const totalLevels = Object.keys(levels).length;

    const sum = Object.values(levels).reduce((acc, curr) => acc + curr, 0);

    if (totalLevels === 0) {
        return 0;
    }

    if (totalLevels === 1) {
        return sum;
    }

    return Math.round(sum / (totalLevels - 1));
}

function appendADR(jsonData: any): void {
    const keys = Object.keys(jsonData.allplayers);
    if (
        jsonData.allplayers == null ||
        jsonData.round == null ||
        jsonData.map == null ||
        keys.length === 0 ||
        jsonData.round.phase == null
    ) {
        return;
    }
    for (let i = 0; i < keys.length; i++) {
        const steamID = keys[i];
        const player = jsonData.allplayers[steamID];
        if (player != null) {
            const adr = player.state.round_totaldmg;
            const roundNum = jsonData.map.round;
            if (jsonData.round.phase === 'over') {
                updateData(steamID, roundNum - 1, adr);
            } else {
                updateData(steamID, roundNum, adr);
            }
            if (jsonData.round.phase === 'freezetime') {
                const currPlayerADR = getADRForUser(steamID);
                playerADR[steamID] = currPlayerADR;
                jsonData.allplayers[steamID].state.adr = currPlayerADR;
            } else {
                jsonData.allplayers[steamID].state.adr = playerADR[steamID];
            }
        }
    }
}

function getTeamOne(allplayers: any, round: number): any[] {
    const teamOne: any[] = [];
    const keys = Object.keys(allplayers);
    for (let i = 0; i < keys.length; i++) {
        const steamID = keys[i];
        const player = allplayers[steamID];
        if (player.team === teamOneCurrentSide) {
            player.steamid = steamID;
            teamOne.push(player);
        }
    }
    return teamOne;
}

function getTeamTwo(allplayers: any, round: number): any[] {
    const teamTwo: any[] = [];
    const keys = Object.keys(allplayers);
    for (let i = 0; i < keys.length; i++) {
        const steamID = keys[i];
        const player = allplayers[steamID];
        if (player.team !== teamOneCurrentSide) {
            player.steamid = steamID;
            teamTwo.push(player);
        }
    }
    return teamTwo;
}

function getSideForTeamOne(
    currRound: number,
    halfLength: number,
    maxRounds: number,
    overtimeHalfLength: number,
    teamOneStartingSide: teamType,
    phase: string,
): teamType {
    if (currRound < maxRounds) {
        if (teamOneStartingSide === 'CT') {
            if (phase === 'intermission') {
                return currRound < halfLength ? 'T' : 'CT';
            }
            return currRound < halfLength ? 'CT' : 'T';
        }
        if (phase === 'intermission') {
            return currRound < halfLength ? 'CT' : 'T';
        }
        return currRound < halfLength ? 'T' : 'CT';
    } else {
        // We're in overtime
        const overtimeRound = currRound - maxRounds;
        const period = Math.floor(overtimeRound / overtimeHalfLength) % 4;
        if (period === 3) {
            // Non-starting side for teamOne
            if (phase === 'intermission') {
                // Swap sides
                teamOneStartingSide = teamOneStartingSide === 'T' ? 'CT' : 'T';
            }
            return teamOneStartingSide === 'T' ? 'CT' : 'T';
        } else if (period === 0) {
            return teamOneStartingSide === 'T' ? 'CT' : 'T';
        } else if (period === 2) {
            return teamOneStartingSide;
        } else {
            // Starting side for teamOne
            if (phase === 'intermission') {
                // Swap sides
                teamOneStartingSide = teamOneStartingSide === 'T' ? 'CT' : 'T';
            }
            return teamOneStartingSide;
        }
    }
}

function splitPlayersIntoTeams(jsonData: any): void {
    if (
        jsonData.allplayers == null ||
        jsonData.map == null ||
        jsonData.map.round == null
    ) {
        return;
    }
    // teamOne swaps sides every half (15 rounds) or overtime (3 rounds)
    // So it can be like this:
    // 1st half: CT (rounds 0 - 14)
    // 2nd half: T (rounds 15 - 29)
    // 1st overtime: T (rounds 30 - 32)
    // 2nd overtime: CT (rounds 33 - 35)
    // 3rd overtime: CT (rounds 36 - 38)
    // 4th overtime: T (rounds 39 - 41)
    // etc.
    teamOne = getTeamOne(jsonData.allplayers, jsonData.map.round);
    teamTwo = getTeamTwo(jsonData.allplayers, jsonData.map.round);
    // If it is round 15,30,33,39, etc. then we need to swap sides because I HATE VALVE
    delete jsonData.allplayers;
    jsonData.allplayers = {};
    jsonData.allplayers.teamOne = teamOne;
    jsonData.allplayers.teamTwo = teamTwo;
    if (jsonData.map == null || jsonData.map.round == null) {
        return;
    }
    const currRound = jsonData.map.round;
    const side = getSideForTeamOne(
        currRound,
        halfLength,
        maxRounds,
        overtimeHalfLength,
        teamOneStartingSide,
        jsonData.map.phase,
    );

    teamOneCurrentSide = side;
    jsonData.allplayers.teamOneSide = side;
    jsonData.allplayers.teamTwoSide = side === 'CT' ? 'T' : 'CT';
}

// const utilityTypes = [
//     'weapon_flashbang',
//     'weapon_hegrenade',
//     'weapon_smokegrenade',
//     'weapon_molotov',
//     'weapon_incgrenade',
// ];

function getTotalUtility(allplayers: any[]): void {
    const teamOneUtility = getTotalUtilityForTeam(teamOne);
    const teamTwoUtility = getTotalUtilityForTeam(teamTwo);
    // @ts-expect-error fix later
    allplayers.teamOneUtility = {
        flash: teamOneUtility[0],
        he: teamOneUtility[1],
        smoke: teamOneUtility[2],
        fire: teamOneUtility[3],
    };
    // @ts-expect-error fix later
    allplayers.teamTwoUtility = {
        flash: teamTwoUtility[0],
        he: teamTwoUtility[1],
        smoke: teamTwoUtility[2],
        fire: teamTwoUtility[3],
    };
}

function getTotalUtilityForTeam(team: any[]): number[] {
    let totalFlash = 0;
    let totalHE = 0;
    let totalSmoke = 0;
    let totalFire = 0;
    for (let i = 0; i < team.length; i++) {
        const player = team[i];
        const weaponData = player.weapons;
        for (const weaponKey in weaponData) {
            if (Object.prototype.hasOwnProperty.call(weaponData, weaponKey)) {
                const weapon = weaponData[weaponKey];
                const weaponName = weapon.name;
                switch (weaponName) {
                    case 'weapon_flashbang':
                        totalFlash += 1;
                        break;
                    case 'weapon_hegrenade':
                        totalHE += 1;
                        break;
                    case 'weapon_smokegrenade':
                        totalSmoke += 1;
                        break;
                    case 'weapon_molotov':
                    case 'weapon_incgrenade':
                        totalFire += 1;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    return [totalFlash, totalHE, totalSmoke, totalFire];
}

async function startServer(): Promise<void> {
    let config: any;
    try {
        config = await getConfig();
    } catch (e) {
        config = null;
    }
    let port = 3000;
    let host = '';
    if (config == null) {
        port = 25566;
        host = '127.0.0.1';
    } else {
        port = config.application.port;
        host = config.application.host;
        teamOneCurrentSide = config.team_data.teamOneStartingSide;
        teamOneStartingSide = config.team_data.teamOneStartingSide;
        halfLength = config.team_data.halfLength;
        maxRounds = config.team_data.maxRounds;
        overtimeHalfLength = config.team_data.overtimeHalfLength;
    }
    try {
        const app = express();

        app.use(express.json());
        app.use((req: any, res: any) => {
            res.header('Access-Control-Allow-Origin', '*');
        });
        const server = http.createServer((req: any, res: any) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (req.method === 'POST') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // log.trace("Handling POST Request");
                req.on('data', (data: any) => {
                    try {
                        let jsonData;
                        if (data != null) {
                            jsonData = JSON.parse(data);
                        }
                        if (connectionCount === 0) {
                            // log.error("[SYSTEM] Frontend connection not found via socket");
                        } else if (jsonData.allplayers == null) {
                            io.emit('spec', false);
                            // log.info("[SYSTEM] Player is not a spectator, refusing to send information via socket");
                        } else {
                            io.emit('spec', true);
                            // log.info("[SYSTEM] Sent data to frontend via socket");
                            appendADR(jsonData);
                            splitPlayersIntoTeams(jsonData);
                            getTotalUtility(jsonData.allplayers);
                            io.emit('data', jsonData);
                            // console.log(playerADRStore);
                            // console.log(playerADR);
                        }
                    } catch (e) {
                        // log.error(`[WEBDATA] Error retrieving data from API: ${e}`);
                    }
                });
                req.on('end', () => {
                    res.end('');
                });
            } else if (req.method === 'GET') {
                // Handle the GET request here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(config));
            }
            req.on('ping', (data: any) => {
                console.log('hello!');
            });
        });

        // @ts-expect-error too lazy to add type
        const io = socketIo(server, {
            cors: {
                origin: '*',
            },
        });

        let connectionCount = 0;
        io.on('connection', (socket: any) => {
            connectionCount++;
            // log.info("A user connected, total connections: " + connectionCount);
            socket.on('disconnect', () => {
                connectionCount--;
                // log.info("A user disconnected, total connections: " + connectionCount);
            });
        });

        console.log('Starting CS:GO Gamestate Server', host, port);
        server.listen(port, host);
        // log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
        module.exports = server;
    } catch (e) {
        console.error(e);
    }
}

void startServer();
