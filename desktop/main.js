/* Arbeitsplaner – Desktop-Rahmen (Electron)
   Lädt die Web-App aus renderer/ in ein natives Fenster. */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 900,
    minHeight: 620,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#f1f5fb',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

/* Schnellsicherung: Ordner wählen und Sicherungsdatei schreiben */
ipcMain.handle('choose-backup-folder', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Ordner für die Schnellsicherung wählen',
    buttonLabel: 'Diesen Ordner verwenden',
    properties: ['openDirectory', 'createDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('write-backup', async (event, folder, filename, content) => {
  try {
    const target = path.join(folder, path.basename(filename));
    fs.writeFileSync(target, content, 'utf8');
    return { ok: true, path: target };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

// Die App bringt eigene Buttons für Drucken/Export mit – kein Menü nötig
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
