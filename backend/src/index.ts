import express from 'express';
import fs from 'fs';
import http from 'http';
import socketIo from 'socket.io';

async function getConfig (): Promise<any> {
    // read config.json
    try {
        const c = fs.readFileSync('config.json', 'utf8');
        return JSON.parse(c);
    } catch (err) {
        console.error('Error reading config.json:', err);
        return null;
    }
}

async function startServer (): Promise<void> {
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
                            io.emit('data', jsonData);
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
                origin: '*'
            }
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
