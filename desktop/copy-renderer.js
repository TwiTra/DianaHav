/* Kopiert die Web-App (../arbeitsplan) nach ./renderer,
   damit electron-builder sie mit einpacken kann. */

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'arbeitsplan');
const dest = path.join(__dirname, 'renderer');

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('renderer/ aktualisiert aus', src);
