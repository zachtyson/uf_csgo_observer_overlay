# CSGO Observer Overlay

Custom overlay for CSGO Casters and Observers which uses an Express API and a React Frontend

## Setup

-   The Java Runtime Environment (JRE) is required to run the GUI and can be downloaded [here](https://www.java.com/en/download/)
-   Place `gamestate_integration_uf.cfg` in your CSGO cfg folder (`C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg`)
-   Download the latest release
-   Extract the zip file
-   Run `Main.exe`
-   Select `Run Backend` and `Run Frontend`
-   Open CSGO and join a match as a spectator
-   Run `cl_draw_only_deathnotices 1` in console to get rid of default HUD
-   Open OBS and add a Browser Source with URL `http://localhost:3000/` and width/height `1920x1080`

## Startup

-   Launch CSGO
-   In root directory:
    -   `npm run dev` (Runs client and server concurrently in same terminal)
    -   **OR**
    -   `npm run backend:start` & `npm run frontend:start` (Each command in a separate terminal, easier to keep track of console logging)
-   Join CSGO match as spectator
    -   Run `cl_draw_only_deathnotices 1` in console to get rid of default HUD

## OBS Setup

-   Make Browser Source for Custom HUD with URL `http://localhost:3000/` and width/height `1920x1080`.
-   Make Game Capture for CSGO

<!--- At halftime, when teams switch, click on the browser source, select 'interact' and press tilde ` to switch the sides and logos if needed --->

## Development Setup

-   Install Node.js
-   Install npm
-   Install pkg (`npm install pkg -g`)
-   Install electron (`npm install electron -g`)
-   Install the latest version of Java
-   Clone repo
-   In root directory:
    -   `npm install`
    -   `npm run install`
-   Put `gamestate_integration_uf.cfg` in your CSGO cfg folder

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

1. Install maven (and obviously Java)
2. cd gui
3. mvn clean compile
4. mvn clean package
5. The executable file is in the target folder
