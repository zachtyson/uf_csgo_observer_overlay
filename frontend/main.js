const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');

let server;
let mainWindow;

app.on('ready', function () {
    // Start express app
    const reactApp = express();
    reactApp.use('/', express.static(path.join(__dirname, './build'))); // Serve your static React build
    server = reactApp.listen(3000, () => console.log('React App on localhost:3000'));

    // Create new browser window
    mainWindow = new BrowserWindow({
        show: false, // This will hide the electron browser window
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
