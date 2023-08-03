import * as path from "path";
const express = require("express");
const fs = require("fs");
const config = require("../config.json");
const log = require("simple-node-logger").createSimpleFileLogger("csgo-gamestate.log");
const http = require("http");
const socketIo = require("socket.io");


const app = express();

app.use(express.json());
app.use((req:any, res:any) => {
    res.header("Access-Control-Allow-Origin", "*");
});

const directoryPath = __dirname; // This will get the current directory path
async function readImages(logoName: string) {
    const fileExtension = path.extname(logoName);
    let base64 = 'data:image/' + fileExtension.slice(1) + ';base64,'; // .slice(1) is used to remove the dot from extension
    try {
        const files = await fs.promises.readdir(directoryPath);
        if (files.includes(logoName)) {
            const filePath = path.join(directoryPath, logoName);
            const data = await fs.promises.readFile(filePath);

            base64 += data.toString('base64');
        } else {
            return '';
        }
    } catch (err) {
        return '';
    }
    return base64;
}

async function getImages(logoNameOne:string, logoNameTwo:string):Promise<any> {
    return new Promise(async (resolve, reject) => {
        let fileOneBase64:string|null = await readImages(logoNameOne);
        let fileTwoBase64:string|null = await readImages(logoNameTwo);
        if(!fileOneBase64) {
            fileOneBase64 = null;
        }
        if(!fileTwoBase64) {
            fileTwoBase64 = null;
        }
        resolve([fileOneBase64, fileTwoBase64]);
    });
}

function getConfig():Promise<any> {
    return new Promise(async (resolve, reject) => {
        //read config.json
        try {
            const c = fs.readFileSync('config.json', 'utf8');
            const config = JSON.parse(c);
            const logoOneName = config.teamOneLogo;
            const logoTwoName = config.teamTwoLogo;
            // const teamOneBase64 = await readImages(logoOneName);
            // const teamTwoBase64 = await readImages(logoTwoName);
            const [teamOneBase64, teamTwoBase64] = await getImages(logoOneName, logoTwoName);
            const configData = {
                teamOneName: config.teamOneName,
                teamTwoName: config.teamTwoName,
                teamOneLogo: teamOneBase64,
                teamTwoLogo: teamTwoBase64,
                teamOneStartingSide: config.teamOneStartingSide,
            };
            resolve(configData);
        } catch (err) {
            console.error('Error reading config.json:', err);
            reject(err);
        }
    });
}


console.log("Starting CS:GO Gamestate Server",config.application.port);
const server = http.createServer((req:any, res:any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method == "POST") {
        res.writeHead(200, { "Content-Type": "text/html" });
        log.trace("Handling POST Request");
        req.on("data", (data:any) => {
            try {
                let jsonData;
                if(data) {
                    jsonData = JSON.parse(data);
                }
                if (connectionCount === 0) {
                    log.error("[SYSTEM] Frontend connection not found via socket");
                } else if (!jsonData.allplayers) {
                    io.emit("spec", false);
                    log.info("[SYSTEM] Player is not a spectator, refusing to send information via socket");
                } else {
                    io.emit("spec", true);
                    log.info("[SYSTEM] Sent data to frontend via socket");
                    io.emit("data", jsonData);
                }
            } catch (e) {
                log.error(`[WEBDATA] Error retrieving data from API: ${e}`);
            }
        });
        req.on("end", () => {
            res.end("");
        });
    } else if (req.method === "GET") {
        // Handle the GET request here
        res.writeHead(200, { "Content-Type": "application/json" });
        getConfig().then((configData:any) => {
            res.end(JSON.stringify(configData));
        });
    }
    req.on("ping", (data:any) => {
        console.log("hello!")
    });


});

const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

let connectionCount = 0;
io.on("connection", (socket:any) => {
    connectionCount++;
    log.info("A user connected, total connections: " + connectionCount);
    socket.on("disconnect", () => {
        connectionCount--;
        log.info("A user disconnected, total connections: " + connectionCount);

    });

});


server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
module.exports = server;
