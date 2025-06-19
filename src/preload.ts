import exposeContexts from "./helpers/ipc/context-exposer";
import { contextBridge, ipcRenderer } from "electron";

exposeContexts();

// // get additionalArguments from the process which spawn us in main.ts
const yourl = process.argv.filter((arg) => arg.startsWith('--yourl='))[0]?.split('=')?.[1]
const clean_yourl = yourl || ""

const language = process.argv.filter((arg) => arg.startsWith('--language='))[0]?.split('=')?.[1]
const clean_language = language || ""

console.log('preload: clean_yourl = ', clean_yourl, ', clean_language =', clean_language)

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "apeye", {
        yourl: clean_yourl,
        language: clean_language,
        // // i.e. 'ipcMain.on' in main.js
        // send: (channel, data) => {
        send: (channel, params) => {
            // whitelist channels
            let validChannels = [
                "getCategories",
                "fetchMany",
                "fetchMany_2",
                "deleteSample",
                "deleteItemCode",
                "saveSample",
                "saveItemCode",
                "openNewWindow",
                "tellSearchPageToTriggerSearch",
            ];

            console.log('ipcRenderer.send: channel = ', channel, ';params = ', JSON.stringify(params)?.substring(0, 360), ' ...');

            if (validChannels.includes(channel)) {
                // ipcRenderer.send(channel, data);
                ipcRenderer.send(channel, params);
            }
        },
        // // i.e.' win.webContents.send' in main.js
        receive: (channel, func) => {
            // whitelist channels
            let validChannels = [
                "categories",
                "many",
                "many_2",
                "sampleDeleted",
                "itemCodeDeleted",
                "sampleSaved",
                "itemCodeSaved",
                "pleaseTriggerSearch",
            ];

            console.log('ipcRenderer.receive: channel = ', channel);

            if (validChannels.includes(channel)) {
                // // Deliberately strip event as it includes `sender`
                //ipcRenderer.on(
                ipcRenderer.once(
                    channel, (event, ...args) => func(...args));
            }
        }
    }
);