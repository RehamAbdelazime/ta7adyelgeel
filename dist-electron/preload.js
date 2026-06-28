import { contextBridge, ipcRenderer } from 'electron';
const twitchApi = {
    startAuth: () => ipcRenderer.invoke('twitch:startAuth'),
    reconnect: () => ipcRenderer.invoke('twitch:reconnect'),
    disconnect: () => ipcRenderer.invoke('twitch:disconnect'),
    getStatus: () => ipcRenderer.invoke('twitch:getStatus'),
    onStatus: (listener) => {
        const wrapped = (_event, status) => listener(status);
        ipcRenderer.on('twitch:status', wrapped);
        return () => ipcRenderer.removeListener('twitch:status', wrapped);
    },
    onChatMessage: (listener) => {
        const wrapped = (_event, message) => listener(message);
        ipcRenderer.on('twitch:chatMessage', wrapped);
        return () => ipcRenderer.removeListener('twitch:chatMessage', wrapped);
    },
};
const api = {
    window: {
        minimize: () => ipcRenderer.send('window:minimize'),
        close: () => ipcRenderer.send('window:close'),
    },
    storage: {
        readJson: (fileName) => ipcRenderer.invoke('storage:readJson', fileName),
        writeJson: (fileName, data) => ipcRenderer.invoke('storage:writeJson', fileName, data),
    },
    display: {
        getSettings: () => ipcRenderer.invoke('display:getSettings'),
        setSettings: (settings) => ipcRenderer.invoke('display:setSettings', settings),
        onSettingsChanged: (listener) => {
            const wrapped = (_event, settings) => listener(settings);
            ipcRenderer.on('display:settingsChanged', wrapped);
            return () => ipcRenderer.removeListener('display:settingsChanged', wrapped);
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
contextBridge.exposeInMainWorld('elGeel', api);
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('desktopTwitchBridge', twitchApi);
contextBridge.exposeInMainWorld('desktopTwitch', twitchApi);
contextBridge.exposeInMainWorld('twitchBridge', twitchApi);
contextBridge.exposeInMainWorld('__TA7ADY_PRELOAD_READY__', true);
//# sourceMappingURL=preload.js.map