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

var all_data:any;

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
        const configData = {
            "teamOneName": "Team One",
            "teamTwoName": "Team Two",
            "teamOneLogo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
            "teamTwoLogo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
            "teamOneStartingSide": "CT"
        }
        // Convert the responseData to JSON format and send it as the response
        res.end(JSON.stringify(configData));
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
