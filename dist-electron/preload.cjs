"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const twitchApi = {
    startAuth: () => electron_1.ipcRenderer.invoke('twitch:startAuth'),
    reconnect: () => electron_1.ipcRenderer.invoke('twitch:reconnect'),
    disconnect: () => electron_1.ipcRenderer.invoke('twitch:disconnect'),
    getStatus: () => electron_1.ipcRenderer.invoke('twitch:getStatus'),
    onStatus: (listener) => {
        const wrapped = (_event, status) => listener(status);
        electron_1.ipcRenderer.on('twitch:status', wrapped);
        return () => electron_1.ipcRenderer.removeListener('twitch:status', wrapped);
    },
    onChatMessage: (listener) => {
        const wrapped = (_event, message) => listener(message);
        electron_1.ipcRenderer.on('twitch:chatMessage', wrapped);
        return () => electron_1.ipcRenderer.removeListener('twitch:chatMessage', wrapped);
    },
};
const api = {
    window: {
        minimize: () => electron_1.ipcRenderer.send('window:minimize'),
        close: () => electron_1.ipcRenderer.send('window:close'),
    },
    storage: {
        readJson: (fileName) => electron_1.ipcRenderer.invoke('storage:readJson', fileName),
        writeJson: (fileName, data) => electron_1.ipcRenderer.invoke('storage:writeJson', fileName, data),
    },
    display: {
        getSettings: () => electron_1.ipcRenderer.invoke('display:getSettings'),
        setSettings: (settings) => electron_1.ipcRenderer.invoke('display:setSettings', settings),
        onSettingsChanged: (listener) => {
            const wrapped = (_event, settings) => listener(settings);
            electron_1.ipcRenderer.on('display:settingsChanged', wrapped);
            return () => electron_1.ipcRenderer.removeListener('display:settingsChanged', wrapped);
        },
    },
    twitch: twitchApi,
};
const electronAPI = {
    isDesktop: true,
    bridgeReady: true,
    twitch: twitchApi,
    elGeel: api,
};
electron_1.contextBridge.exposeInMainWorld('elGeel', api);
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
electron_1.contextBridge.exposeInMainWorld('desktopTwitchBridge', twitchApi);
electron_1.contextBridge.exposeInMainWorld('desktopTwitch', twitchApi);
electron_1.contextBridge.exposeInMainWorld('twitchBridge', twitchApi);
electron_1.contextBridge.exposeInMainWorld('__TA7ADY_PRELOAD_READY__', true);
//# sourceMappingURL=preload.cjs.map