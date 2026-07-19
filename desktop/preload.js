/* Brücke zwischen der Web-App und Windows:
   erlaubt der App, Sicherungen in einen echten Ordner zu schreiben. */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  chooseBackupFolder: () => ipcRenderer.invoke('choose-backup-folder'),
  writeBackup: (folder, filename, content) => ipcRenderer.invoke('write-backup', folder, filename, content),
});
