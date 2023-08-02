
const path = require('path');
const url = require('url');
const express = require('express');
const fs = require('fs');
const {app, BrowserWindow} = require('electron');



let mainWindow;

let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
    dev = true;
}

async function readConfigFile() {
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

async function getConfigData() {
    let config = await readConfigFile();
    const teamOneLogo = storeImageAsVariable(path.join(__dirname, config.teamOneLogo));
    const teamTwoLogo = storeImageAsVariable(path.join(__dirname, config.teamTwoLogo));
    const teamOneName = config.teamOne;
    const teamTwoName = config.teamTwo;
    const teamOneStartingSide = config.teamOneStartingSide;
    const ConfigData = {
        teamOneLogo: await teamOneLogo,
        teamOneName,
        teamTwoLogo: await teamTwoLogo,
        teamTwoName,
        teamOneStartingSide,
    };
    return ConfigData;
}

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, './preload.js'),
        }
    });

    // and load the index.html of the app.
    let indexPath;
    let server;
    const reactApp = express();
    reactApp.use('/', express.static(path.join(__dirname, './build'))); // Serve your static React build
    server = reactApp.listen(3000, () => console.log('React App on localhost:3000'));
    if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:3000',
            pathname: 'index.html',
            slashes: true
        });
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'build', 'index.html'),
            slashes: true
        });
    }
    mainWindow.loadURL( indexPath );


    // Don't show until we are ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        getConfigData().then((configData) => {
            mainWindow.webContents.send('channel', configData);
        }).catch((error) => {
            console.error('An error occurred:', error);
        });

        // Open the DevTools automatically if developing
        if ( dev ) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        server.close(); // Close express app when electron app is closed

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
