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

/**
 * Set global vars for later use
 * @type {{game_mode: boolean, map: boolean, round: number, players: Array, player_ids: Array, bombtime: number, bombtimer: boolean}}
 */

const directoryPath = __dirname; // This will get the current directory path

const logoOneName = 'logoOne.png';
const logoTwoName = 'logoTwo.jpg';

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

        req.on("ping", (data:any) => {
            console.log("hello!")
        });

        req.on("end", () => {
            res.end("");
        });
    } else if (req.method === "GET") {
        // Handle the GET request here
        res.writeHead(200, { "Content-Type": "application/json" });
        // Assume you have some data to send as a response (for example, an object named responseData)
        let teamOneBase64 = '';
        let teamTwoBase64 = '';
        getImages(logoOneName,logoTwoName).then(r => {
            teamOneBase64 = r[0];
            teamTwoBase64 = r[1];
            const configData = {
                teamOneName: 'Team One',
                teamTwoName: 'Team Two',
                teamOneLogo: teamOneBase64,
                teamTwoLogo: teamTwoBase64,
                teamOneStartingSide: 'CT',
            };
            res.end(JSON.stringify(configData));
        })


        // Convert the responseData to JSON format and send it as the response
        // Emit the pingR event to the socket connection
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

var connectionCount = 0;
//Whenever someone connects this gets executed
io.on("connection", (socket:any) => {
    log.info("A user connected");
    console.log("A user connected");
    connectionCount++;
    //
    // Emit the 'Connected' event with the variable and set the flag to true
    // io.emit("Connected", "Hello, client!");
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", () => {
        log.info("A user disconnected");
        connectionCount--;
    });

});


server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
module.exports = server;
