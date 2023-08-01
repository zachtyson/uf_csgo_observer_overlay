const { app, BrowserWindow, ipcMain } = require('electron');
const { contextBridge, ipcRenderer } = require('electron')
const path = require('path');
const url = require('url');
const express = require('express');
const fs = require('fs');

let server;
let mainWindow;



function readConfigFile() {
    try {
        const configFileContent = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
        const config = JSON.parse(configFileContent);
        return config;
    } catch (err) {
        console.error('Error reading config file:', err);
        return null;
    }
}

async function storeImageAsVariable(filePath) {
    try {
        const imageData= await fs.promises.readFile(filePath);
        return imageData.toString('base64');
    } catch (error) {
        console.error('Error reading the image file:', error);
        return null;
    }
}

app.on('ready', async function () {

    const config = readConfigFile();
    console.log('config:', config);
    const teamOneLogo = storeImageAsVariable(path.join(__dirname, config.teamOneLogo));
    const teamTwoLogo = storeImageAsVariable(path.join(__dirname, config.teamTwoLogo));
    const teamOneName = config.teamOne;
    const teamTwoName = config.teamTwo;
    const teamOneStartingSide = config.teamOneStartingSide;
    //create instance of interface ConfigData
    const configData = {
        teamOneLogo: await teamOneLogo,
        teamOneName,
        teamTwoLogo: await teamTwoLogo,
        teamTwoName,
        teamOneStartingSide,
    }


    // Start express app
    const reactApp = express();
    reactApp.use('/', express.static(path.join(__dirname, './build'))); // Serve your static React build
    server = reactApp.listen(3000, () => console.log('React App on localhost:3000'));

    // Create new browser window
    mainWindow = new BrowserWindow({
        show: false, // This will hide the electron browser window
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
        server.close(); // Close express app when electron app is closed
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
