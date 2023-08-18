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
let teamOneStartingSide = 'CT';

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
        if (player.team === teamOneStartingSide) {
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
        if (player.team !== teamOneStartingSide) {
            player.steamid = steamID;
            teamTwo.push(player);
        }
    }
    return teamTwo;
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
                            teamOne = getTeamOne(
                                jsonData.allplayers,
                                jsonData.map.round,
                            );
                            teamTwo = getTeamTwo(
                                jsonData.allplayers,
                                jsonData.map.round,
                            );
                            delete jsonData.allplayers;
                            jsonData.allplayers = {};
                            jsonData.allplayers.teamOne = teamOne;
                            jsonData.allplayers.teamTwo = teamTwo;
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
