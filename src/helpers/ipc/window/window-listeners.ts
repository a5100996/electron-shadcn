import { BrowserWindow, ipcMain } from "electron";
import {
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL,
} from "./window-channels";

// // The original version of this file has caused 
// // so much anguish and missed deadlines.
// // To be fair, most Electron apps don't spawn multiple windows.
export function addWindowEventListeners(mainWindow: BrowserWindow) {
  ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
      //mainWindow.minimize();
      BrowserWindow.getFocusedWindow()?.minimize();
  });
  ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
    //if (mainWindow.isMaximized()) {
    if (BrowserWindow.getFocusedWindow()?.isMaximized()) {
      //mainWindow.unmaximize();
      BrowserWindow.getFocusedWindow()?.unmaximize();
    } else {
      //mainWindow.maximize();
      BrowserWindow.getFocusedWindow()?.maximize();
    }
  });
  ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
    //mainWindow.close();
    BrowserWindow.getFocusedWindow()?.close();
  });
}
