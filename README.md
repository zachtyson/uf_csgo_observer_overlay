# CSGO Observer Overlay

Custom overlay for CSGO Casters and Observers which uses an Express API and a React Frontend

## Project Setup

- Install Node.js
- Install npm
- Install pkg (```npm install pkg -g```)
- Install electron (```npm install electron -g```)
- Install the latest version of Java
- Clone repo
- In root directory:
    - ```npm install```
    - ```npm run install```
- Put ```gamestate_integration_uf.cfg``` in your CSGO cfg folder

## Startup

- Launch CSGO
- In root directory:
    - ```npm run dev``` (Runs client and server concurrently in same terminal)
    - **OR**
    - ```npm run backend:start``` & ```npm run frontend:start``` (Each command in a separate terminal, easier to keep track of console logging)
- Join CSGO match as spectator
    - Run ```cl_draw_only_deathnotices 1``` in console to get rid of default HUD

## OBS Setup

- Make Browser Source for Custom HUD with URL ```http://localhost:3000/``` and width/height ```1920x1080```.
- Make Game Capture for CSGO

<!--- At halftime, when teams switch, click on the browser source, select 'interact' and press tilde ` to switch the sides and logos if needed --->

## For future me

For future Zach:

Backend:
1. npm install pkg -g
2. cd backend
3. npm run build
4. cd dist
5. pkg .\index.js

Frontend:
1. npm install electron -g
2. npm install electron-builder --save-dev
3. npm install electron --save-dev
4. npm run build
5. npm run start-electron (to make sure it works)
6. npm run package

GUI:
1. cd gui/src
2. javac -source 15 -target 15 Main.java
3. jar cfm .\Main.jar .\manifest.txt *.class
4. Use Launch4j to package it into an exe using overlay_launch4j.xml


