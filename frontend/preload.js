const { contextBridge, ipcRenderer, app } = require('electron');

const os = require('os');

contextBridge.exposeInMainWorld(
    'electron',
    {
        homeDir: () => os.homedir(),
        receive: (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);
