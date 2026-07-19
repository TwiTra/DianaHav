# Arbeitsplaner – Desktop-Programm (Windows EXE)

Dieser Ordner verpackt die Web-App aus `../arbeitsplan` mit [Electron](https://www.electronjs.org/) in ein Windows-Programm.

## Fertige EXE herunterladen

Die EXE wird automatisch von GitHub gebaut (Workflow „Windows-Programm bauen"):

- **Nach jedem Update auf `main`** erscheint die neueste Version unter
  **Releases → „Arbeitsplaner für Windows"**:
  - `Arbeitsplaner-Setup-….exe` – Installer (empfohlen)
  - `Arbeitsplaner-Portable-….exe` – läuft ohne Installation
- Alternativ: im Reiter **Actions** den Workflow „Windows-Programm bauen (EXE)" öffnen und das Artefakt `Arbeitsplaner-Windows` herunterladen.

## Selbst bauen

```bash
cd desktop
npm install
npm run dist        # erzeugt dist/Arbeitsplaner-Setup-*.exe und -Portable-*.exe
```

Zum Entwickeln: `npm start` (startet das Programm direkt).

## Hinweise

- Die Daten speichert das Programm lokal im Windows-Benutzerprofil – wie im Browser bleibt alles auf dem PC.
- Die EXE ist nicht code-signiert; Windows SmartScreen kann beim ersten Start warnen („Weitere Informationen" → „Trotzdem ausführen").
