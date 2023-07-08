# CSGO Observer Overlay

Custom overlay for CSGO Casters and Observers which uses an Express API and a React Frontend

## Project Setup

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
