const path = require('path');
const url = require('url');
const express = require('express');
const fs = require('fs');
const { app, BrowserWindow } = require('electron');

let mainWindow;
let server;

function createWindow() {
    const reactApp = express();
    reactApp.use('/', express.static(path.join(__dirname, './build'))); // Serve your static React build
    server = reactApp.listen(3000, () =>
        console.log('React App on localhost:3000'),
    );

    // Create new browser window
    mainWindow = new BrowserWindow({
        show: false, // This will hide the electron browser window
    });

    mainWindow.on('closed', function () {
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
