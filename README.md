# CSGO Observer Overlay

Custom overlay for CSGO Casters and Observers which uses an Express for backend, React for frontend, and Java for GUI.
![img.png](img.png)

## Setup

-   The Java Runtime Environment (JRE) is required to run the GUI and can be downloaded [here](https://www.java.com/en/download/)
-   Place `gamestate_integration_uf.cfg` in your CSGO cfg folder (`C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg`) (this is the default location and may be different for you)
-   Download the latest release
-   Extract the zip file
-   Run `gui.exe`
-   Create your config file in the settings tab
-   Click `Create Json` to create the overlay config file
-   Select `Run Backend` and `Run Frontend`
-   Open CSGO and join a match as a spectator
-   Run `cl_draw_only_deathnotices 1` in console to get rid of default HUD
-   Open OBS and add a Browser Source with URL `http://localhost:3000/` and width/height `1920x1080`

## OBS Setup

-   Make Browser Source for Custom HUD with URL `http://localhost:3000/` and width/height `1920x1080`.
-   Make Game Capture for CSGO

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
2. Install maven dependencies
3. cd gui
4. mvn clean package
5. The executable file is in the gui-output folder

Release:
1. npm run pre-release
2. npm run release
