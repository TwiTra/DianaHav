/* Arbeitsplaner – Desktop-Rahmen (Electron)
   Lädt die Web-App aus renderer/ in ein natives Fenster. */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

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
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

// Die App bringt eigene Buttons für Drucken/Export mit – kein Menü nötig
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
