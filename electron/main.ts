import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import dotenv from 'dotenv';

// Fix: Provide a type declaration for the Node.js `__dirname` global variable, which is not available in TypeScript's default scope.
declare const __dirname: string;

// Load environment variables from .env file
dotenv.config();

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    // Vite dev server URL
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  // Fix: Cast `process` to `any` to access the `platform` property. This bypasses a TypeScript error where the inferred type for `process` is incomplete.
  if ((process as any).platform !== 'darwin') app.quit();
});

// Expose API Key to preload script
ipcMain.handle('get-api-key', () => {
    return process.env.API_KEY;
});
