/* ============================================================
   Arbeitsplaner – App-Steuerung
   Navigation, Modal, Toasts, Personen, Schichtarten,
   Einstellungen & Datensicherung
   ============================================================ */

let currentPage = 'kalender';

const PAGES = {
  kalender:      { title: 'Monatskalender', render: (el) => renderCalendarPage(el) },
  plan:          { title: 'Arbeitspläne',   render: (el) => renderPlanPage(el) },
  urlaub:        { title: 'Urlaubspläne',   render: (el) => renderVacationPage(el) },
  statistik:     { title: 'Statistik',      render: (el) => {
    // Beim Öffnen den Monat aus dem Arbeitsplan übernehmen –
    // so wird immer der Monat ausgewertet, den man gerade plant
    statsView.year = planView.year;
    statsView.month = planView.month;
    renderStatsPage(el);
  } },
  personen:      { title: 'Personen',       render: (el) => renderPersonsPage(el) },
  schichten:     { title: 'Schichtarten',   render: (el) => renderShiftsPage(el) },
  einstellungen: { title: 'Einstellungen',  render: (el) => renderSettingsPage(el) },
};

function navigate() {
  const hash = location.hash.replace('#/', '') || 'kalender';
  let page = PAGES[hash] ? hash : 'kalender';
  if (window.VIEW_ONLY && ['personen', 'schichten', 'einstellungen'].includes(page)) page = 'kalender';
  currentPage = page;
  document.querySelectorAll('.nav-link').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page));
  document.getElementById('breadcrumb').textContent = PAGES[page].title;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('show');
  PAGES[page].render(document.getElementById('page-wrap'));
  updateBadges();
}

function updateBadges() {
  document.getElementById('person-badge').textContent = activePersons().length;
  const firma = state.settings.firma;
  document.getElementById('logo-firma').textContent = firma || 'Dienstplanung';
}

/* ---------- Modal ---------- */

function openModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-body').innerHTML = '';
}

function confirmDialog(text, onYes) {
  openModal(`
    <h2 class="modal-title">Bist du sicher?</h2>
    <p style="margin:10px 0 18px">${esc(text)}</p>
    <div class="btn-row">
      <button class="btn btn-danger" id="cf-yes">Ja, fortfahren</button>
      <button class="btn" id="cf-no">Abbrechen</button>
    </div>`);
  document.getElementById('cf-yes').onclick = () => { closeModal(); onYes(); };
  document.getElementById('cf-no').onclick = closeModal;
}

/* ---------- Toasts ---------- */

function toast(msg, type = 'info') {
  const wrap = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3200);
}

/* ============================================================
   PERSONEN
   ============================================================ */

function renderPersonsPage(el) {
  const rows = state.persons.map(p => `
    <div class="card person-row ${p.active === false ? 'person-inactive' : ''}">
      <span class="person-dot person-dot-lg" style="background:${p.color}"></span>
      <div class="person-info">
        <b>${esc(p.name)}</b>
        <span class="muted">${p.hoursPerWeek || 40} Std./Woche · ${p.vacationDays || 30} Urlaubstage/Jahr${p.note ? ' · ' + esc(p.note) : ''}${p.active === false ? ' · inaktiv' : ''}</span>
      </div>
      <button class="icon-btn p-edit" data-id="${p.id}" title="Bearbeiten">✏️</button>
      <button class="icon-btn p-del" data-id="${p.id}" title="Löschen">🗑️</button>
    </div>`).join('');

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Personen</h1>
        <p class="page-sub">Deine Mitarbeiter – sie erscheinen im Arbeitsplan, in den Urlaubsplänen und in der Statistik.</p>
      </div>
      <button class="btn btn-primary" id="p-new">+ Person anlegen</button>
    </div>
    ${rows || `<div class="card empty-state"><div class="empty-icon">👥</div><h2>Noch keine Personen</h2><p>Lege deine erste Person an, um mit der Planung zu starten.</p></div>`}`;

  el.querySelector('#p-new').onclick = () => openPersonForm();
  el.querySelectorAll('.p-edit').forEach(b => b.onclick = () => openPersonForm(personById(b.dataset.id)));
  el.querySelectorAll('.p-del').forEach(b => b.onclick = () => {
    const p = personById(b.dataset.id);
    confirmDialog(`»${p.name}« löschen? Alle Schichten und Urlaube dieser Person werden ebenfalls entfernt. Tipp: Du kannst die Person stattdessen auf »inaktiv« setzen (Bearbeiten).`, () => {
      state.persons = state.persons.filter(x => x.id !== p.id);
      state.vacations = state.vacations.filter(v => v.personId !== p.id);
      for (const day of Object.keys(state.schedule)) {
        delete state.schedule[day][p.id];
        if (!Object.keys(state.schedule[day]).length) delete state.schedule[day];
      }
      saveState();
      renderPersonsPage(el);
      updateBadges();
      toast('Person gelöscht', 'success');
    });
  });
}

function openPersonForm(person = null) {
  const p = person || {
    name: '', color: PERSON_COLORS[state.persons.length % PERSON_COLORS.length],
    hoursPerWeek: 40, vacationDays: 30, note: '', active: true,
  };
  openModal(`
    <h2 class="modal-title">${person ? 'Person bearbeiten' : 'Neue Person'}</h2>
    <div class="form-row"><label>Name *</label><input type="text" id="pf-name" value="${esc(p.name)}" placeholder="Vor- und Nachname" maxlength="60"></div>
    <div class="form-row"><label>Farbe</label>
      <div class="color-row" id="pf-colors">
        ${PERSON_COLORS.map(c => `<button class="color-swatch ${p.color === c ? 'active' : ''}" data-c="${c}" style="background:${c}"></button>`).join('')}
      </div>
    </div>
    <div class="form-row form-row-2">
      <div><label>Stunden pro Woche</label><input type="number" id="pf-hours" value="${p.hoursPerWeek || 40}" min="0" max="80" step="0.5"></div>
      <div><label>Urlaubstage pro Jahr</label><input type="number" id="pf-vac" value="${p.vacationDays || 30}" min="0" max="60"></div>
    </div>
    <div class="form-row"><label>Notiz</label><input type="text" id="pf-note" value="${esc(p.note || '')}" placeholder="z. B. nur vormittags (optional)"></div>
    ${person ? `<div class="form-row"><label class="check-label"><input type="checkbox" id="pf-active" ${p.active !== false ? 'checked' : ''}> Aktiv (erscheint im Plan)</label></div>` : ''}
    <div class="btn-row">
      <button class="btn btn-primary" id="pf-save">Speichern</button>
      <button class="btn" id="pf-cancel">Abbrechen</button>
    </div>`);

  const body = document.getElementById('modal-body');
  let color = p.color;
  body.querySelectorAll('.color-swatch').forEach(b => b.onclick = () => {
    color = b.dataset.c;
    body.querySelectorAll('.color-swatch').forEach(x => x.classList.toggle('active', x === b));
  });
  body.querySelector('#pf-cancel').onclick = closeModal;
  body.querySelector('#pf-save').onclick = () => {
    const name = body.querySelector('#pf-name').value.trim();
    if (!name) { toast('Bitte einen Namen eingeben', 'error'); return; }
    const data = {
      name, color,
      hoursPerWeek: Number(body.querySelector('#pf-hours').value) || 40,
      vacationDays: Number(body.querySelector('#pf-vac').value) || 30,
      note: body.querySelector('#pf-note').value.trim(),
      active: person ? body.querySelector('#pf-active').checked : true,
    };
    if (person) Object.assign(person, data);
    else state.persons.push({ id: uid(), ...data });
    saveState();
    closeModal();
    updateBadges();
    toast('Person gespeichert ✓', 'success');
    if (currentPage === 'personen') renderPersonsPage(document.getElementById('page-wrap'));
  };
  body.querySelector('#pf-name').focus();
}

/* ============================================================
   SCHICHTARTEN
   ============================================================ */

const SHIFT_KINDS = {
  arbeit: 'Arbeitsschicht', frei: 'Frei', urlaub: 'Urlaub', krank: 'Krank', sonstig: 'Sonstiges',
};
const SHIFT_COLORS = ['#2a78d6','#eb6834','#4a3aa7','#1baf7a','#eda100','#e87ba4','#008300','#e34948','#898781'];

function renderShiftsPage(el) {
  const rows = state.shiftTypes.map(s => `
    <div class="card person-row">
      <span class="shift-chip shift-chip-lg" style="--c:${s.color}">${esc(s.code)}</span>
      <div class="person-info">
        <b>${esc(s.label)}</b>
        <span class="muted">${SHIFT_KINDS[s.kind] || s.kind}${s.start ? ` · ${s.start}–${s.end} Uhr · ${s.breakMin || 0} Min. Pause · ${shiftHours(s).toFixed(2).replace('.', ',')} Std.` : ''}</span>
      </div>
      <button class="icon-btn s-edit" data-id="${s.id}" title="Bearbeiten">✏️</button>
      <button class="icon-btn s-del" data-id="${s.id}" title="Löschen">🗑️</button>
    </div>`).join('');

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Schichtarten</h1>
        <p class="page-sub">Kürzel, Zeiten und Farben der Schichten. Die Stunden fließen automatisch in die Statistik ein.</p>
      </div>
      <button class="btn btn-primary" id="s-new">+ Schichtart anlegen</button>
    </div>
    ${rows}`;

  el.querySelector('#s-new').onclick = () => openShiftForm();
  el.querySelectorAll('.s-edit').forEach(b => b.onclick = () => openShiftForm(shiftById(b.dataset.id)));
  el.querySelectorAll('.s-del').forEach(b => b.onclick = () => {
    const s = shiftById(b.dataset.id);
    confirmDialog(`Schichtart »${s.label}« löschen? Bereits geplante Einträge dieser Art werden aus dem Plan entfernt.`, () => {
      state.shiftTypes = state.shiftTypes.filter(x => x.id !== s.id);
      for (const day of Object.keys(state.schedule)) {
        for (const pid of Object.keys(state.schedule[day])) {
          if (state.schedule[day][pid] === s.id) delete state.schedule[day][pid];
        }
        if (!Object.keys(state.schedule[day]).length) delete state.schedule[day];
      }
      if (planBrush === s.id) planBrush = null;
      saveState();
      renderShiftsPage(el);
      toast('Schichtart gelöscht', 'success');
    });
  });
}

function openShiftForm(shift = null) {
  const s = shift || { code: '', label: '', start: '', end: '', breakMin: 30, color: SHIFT_COLORS[state.shiftTypes.length % SHIFT_COLORS.length], kind: 'arbeit' };
  openModal(`
    <h2 class="modal-title">${shift ? 'Schichtart bearbeiten' : 'Neue Schichtart'}</h2>
    <div class="form-row form-row-2">
      <div><label>Kürzel * (im Plan sichtbar)</label><input type="text" id="sf-code" value="${esc(s.code)}" maxlength="3" placeholder="z. B. F"></div>
      <div><label>Name *</label><input type="text" id="sf-label" value="${esc(s.label)}" maxlength="40" placeholder="z. B. Frühschicht"></div>
    </div>
    <div class="form-row"><label>Art</label>
      <select id="sf-kind">
        ${Object.entries(SHIFT_KINDS).map(([k, v]) => `<option value="${k}" ${s.kind === k ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="form-row form-row-3" id="sf-times" ${s.kind === 'arbeit' || s.kind === 'sonstig' ? '' : 'style="display:none"'}>
      <div><label>Beginn</label><input type="time" id="sf-start" value="${esc(s.start)}"></div>
      <div><label>Ende</label><input type="time" id="sf-end" value="${esc(s.end)}"></div>
      <div><label>Pause (Min.)</label><input type="number" id="sf-break" value="${s.breakMin || 0}" min="0" max="180" step="5"></div>
    </div>
    <div class="form-row"><label>Farbe</label>
      <div class="color-row" id="sf-colors">
        ${SHIFT_COLORS.map(c => `<button class="color-swatch ${s.color === c ? 'active' : ''}" data-c="${c}" style="background:${c}"></button>`).join('')}
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" id="sf-save">Speichern</button>
      <button class="btn" id="sf-cancel">Abbrechen</button>
    </div>`);

  const body = document.getElementById('modal-body');
  let color = s.color;
  body.querySelectorAll('.color-swatch').forEach(b => b.onclick = () => {
    color = b.dataset.c;
    body.querySelectorAll('.color-swatch').forEach(x => x.classList.toggle('active', x === b));
  });
  body.querySelector('#sf-kind').onchange = (e) => {
    const k = e.target.value;
    body.querySelector('#sf-times').style.display = (k === 'arbeit' || k === 'sonstig') ? '' : 'none';
  };
  body.querySelector('#sf-cancel').onclick = closeModal;
  body.querySelector('#sf-save').onclick = () => {
    const code = body.querySelector('#sf-code').value.trim().toUpperCase();
    const label = body.querySelector('#sf-label').value.trim();
    if (!code || !label) { toast('Bitte Kürzel und Name eingeben', 'error'); return; }
    const kind = body.querySelector('#sf-kind').value;
    const timed = kind === 'arbeit' || kind === 'sonstig';
    const data = {
      code, label, kind, color,
      start: timed ? body.querySelector('#sf-start').value : '',
      end: timed ? body.querySelector('#sf-end').value : '',
      breakMin: timed ? Number(body.querySelector('#sf-break').value) || 0 : 0,
    };
    if (shift) Object.assign(shift, data);
    else state.shiftTypes.push({ id: uid(), ...data });
    saveState();
    closeModal();
    toast('Schichtart gespeichert ✓', 'success');
    if (currentPage === 'schichten') renderShiftsPage(document.getElementById('page-wrap'));
  };
}

/* ============================================================
   EINSTELLUNGEN & DATENSICHERUNG
   ============================================================ */

function renderSettingsPage(el) {
  el.innerHTML = `
    <div class="page-head"><div>
      <h1>Einstellungen</h1>
      <p class="page-sub">Grundeinstellungen und Datensicherung.</p>
    </div></div>

    <div class="card">
      <h3 class="card-title">Allgemein</h3>
      <div class="form-row"><label>Firmen-/Teamname (erscheint auf den Plänen)</label>
        <input type="text" id="set-firma" value="${esc(state.settings.firma)}" placeholder="z. B. Praxis Dr. Müller" maxlength="60">
      </div>
      <div class="form-row"><label>Bundesland (für Feiertage)</label>
        <select id="set-bl">
          ${Object.entries(BUNDESLAENDER).map(([k, v]) => `<option value="${k}" ${state.settings.bundesland === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary" id="set-save">Speichern</button>
    </div>

    <div class="card">
      <h3 class="card-title">Datensicherung</h3>

      <div class="form-row">
        <label>Speicherort der Schnellsicherung (💾-Knopf oben rechts)</label>
        <div class="btn-row">
          <input type="text" id="set-backup-path" value="${esc(state.settings.backupPath || '')}" placeholder="Noch kein Ordner gewählt" readonly style="flex:1;min-width:220px">
          <button class="btn" id="set-backup-choose">📁 Ordner wählen…</button>
          ${state.settings.backupPath ? '<button class="btn" id="set-backup-clear">Entfernen</button>' : ''}
        </div>
        <p class="muted" style="margin-top:6px">Ein Klick auf 💾 (oder Strg+S) legt dort die Datei „${BACKUP_FILENAME}" an und erneuert sie bei jedem weiteren Klick automatisch.</p>
      </div>

      <p class="muted" style="margin-bottom:12px">Alle Daten werden nur lokal gespeichert. Sichere sie zusätzlich regelmäßig als Datei – z. B. bevor du den Browser wechselst oder den Verlauf löschst.</p>
      <div class="btn-row">
        <button class="btn" id="set-export">⬇️ Sicherung herunterladen (JSON)</button>
        <label class="btn" for="set-import-file" style="cursor:pointer">⬆️ Sicherung einspielen</label>
        <input type="file" id="set-import-file" accept=".json,application/json" style="display:none">
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">Online-Freigabe für Mitarbeiter (nur Lesen)</h3>
      <p class="muted" style="margin-bottom:12px">
        Teile deinen Plan über einen Link: Mitarbeiter sehen ihn im Browser, können nichts verändern,
        und die Ansicht aktualisiert sich automatisch, sobald du speicherst (💾).
        Dafür wird ein kostenloses GitHub-Konto mit einem Zugriffsschlüssel benötigt:
        <a href="https://github.com/settings/tokens/new?scopes=gist&description=Arbeitsplaner" target="_blank" rel="noopener">github.com → Token erstellen</a>
        (Haken bei <b>„gist"</b> genügt), den Schlüssel unten einfügen.
      </p>
      <div class="form-row"><label>GitHub-Zugriffsschlüssel (Token mit Berechtigung „gist")</label>
        <input type="password" id="set-share-token" value="${esc(state.settings.shareToken || '')}" placeholder="ghp_…" autocomplete="off">
      </div>
      <div class="form-row"><label class="check-label">
        <input type="checkbox" id="set-share-auto" ${state.settings.shareAuto !== false ? 'checked' : ''}>
        Beim Speichern (💾 / Strg+S) automatisch aktualisieren
      </label></div>
      <div class="btn-row">
        <button class="btn btn-primary" id="set-share-publish">🌐 ${state.settings.shareGistId ? 'Jetzt aktualisieren' : 'Freigabe-Link erstellen'}</button>
        ${state.settings.shareGistId ? '<button class="btn btn-danger-ghost" id="set-share-off">Freigabe beenden</button>' : ''}
      </div>
      ${!state.settings.shareGistId ? `
      <div class="form-row" style="margin-top:12px"><label>Oder: mit bestehender Freigabe verbinden (z. B. von deinem Windows-Programm)</label>
        <div class="btn-row">
          <input type="text" id="set-share-connect" placeholder="Mitarbeiter-Link oder Freigabe-ID hier einfügen…" style="flex:1;min-width:220px">
          <button class="btn" id="set-share-connect-btn">🔗 Verbinden</button>
        </div>
        <p class="muted" style="margin-top:6px">Danach gleicht sich dieses Gerät automatisch mit dem neuesten gespeicherten Stand ab (beim Öffnen und beim Fensterwechsel).</p>
      </div>` : ''}
      ${state.settings.shareGistId ? `
      <div class="form-row" style="margin-top:12px"><label>Link für deine Mitarbeiter</label>
        <div class="btn-row">
          <input type="text" id="set-share-link" value="${esc(shareViewerLink())}" readonly style="flex:1;min-width:220px">
          <button class="btn" id="set-share-copy">📋 Kopieren</button>
        </div>
        <p class="muted" style="margin-top:6px">Wer den Link hat, kann den Plan sehen (nicht ändern). Zum Widerrufen „Freigabe beenden" klicken.</p>
      </div>` : ''}
    </div>

    <div class="card">
      <h3 class="card-title">Gefahrenzone</h3>
      <button class="btn btn-danger-ghost" id="set-reset">Alle Daten löschen und neu starten</button>
    </div>

    <p class="muted" style="text-align:center;margin-top:6px">Arbeitsplaner · läuft komplett im Browser · keine Daten verlassen dein Gerät</p>`;

  el.querySelector('#set-save').onclick = () => {
    state.settings.firma = el.querySelector('#set-firma').value.trim();
    state.settings.bundesland = el.querySelector('#set-bl').value;
    for (const k of Object.keys(holidayCache)) delete holidayCache[k];
    saveState();
    updateBadges();
    toast('Einstellungen gespeichert ✓', 'success');
  };
  el.querySelector('#set-backup-choose').onclick = async () => {
    if (await chooseBackupTarget()) {
      renderSettingsPage(el);
      toast('Speicherort festgelegt ✓ – ab jetzt genügt ein Klick auf 💾', 'success');
    }
  };
  const clearBtn = el.querySelector('#set-backup-clear');
  if (clearBtn) clearBtn.onclick = () => {
    state.settings.backupPath = '';
    saveState();
    clearBackupDirHandle();
    renderSettingsPage(el);
    toast('Speicherort entfernt', 'success');
  };
  el.querySelector('#set-share-token').onchange = (e) => {
    state.settings.shareToken = e.target.value.trim();
    saveState();
  };
  el.querySelector('#set-share-auto').onchange = (e) => {
    state.settings.shareAuto = e.target.checked;
    saveState();
  };
  el.querySelector('#set-share-publish').onclick = async () => {
    state.settings.shareToken = el.querySelector('#set-share-token').value.trim();
    saveState();
    if (await sharePublish(false)) renderSettingsPage(el);
  };
  const shareConnect = el.querySelector('#set-share-connect-btn');
  if (shareConnect) shareConnect.onclick = async () => {
    const id = parseShareId(el.querySelector('#set-share-connect').value);
    if (!id) { toast('Bitte einen gültigen Mitarbeiter-Link oder eine Freigabe-ID einfügen', 'error'); return; }
    state.settings.shareToken = el.querySelector('#set-share-token').value.trim();
    state.settings.shareGistId = id;
    state.settings.syncStand = '';
    saveState();
    clearSyncDirty(); // frisch verbunden: den Online-Stand ohne Nachfrage übernehmen
    toast('🔗 Verbunden – hole den neuesten Stand…', 'success');
    await ownerSyncCheck();
    renderSettingsPage(el);
  };
  const shareOff = el.querySelector('#set-share-off');
  if (shareOff) shareOff.onclick = () => {
    confirmDialog('Freigabe beenden? Der Link funktioniert danach nicht mehr.', async () => {
      await shareDisable();
      renderSettingsPage(el);
      toast('Freigabe beendet – der Link ist deaktiviert', 'success');
    });
  };
  const shareCopy = el.querySelector('#set-share-copy');
  if (shareCopy) shareCopy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareViewerLink());
      toast('Link kopiert ✓ – einfach an die Mitarbeiter schicken', 'success');
    } catch (e) {
      el.querySelector('#set-share-link').select();
      toast('Bitte den markierten Link mit Strg+C kopieren', 'warn');
    }
  };
  el.querySelector('#set-export').onclick = () => { exportBackup(); toast('Sicherung heruntergeladen ✓', 'success'); };
  el.querySelector('#set-import-file').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    confirmDialog('Sicherung einspielen? Die aktuellen Daten werden dabei ersetzt.', () => {
      importBackup(file, (ok, err) => {
        if (ok) { toast('Sicherung eingespielt ✓', 'success'); applyTheme(); navigate(); }
        else toast('Fehler: ' + err, 'error');
      });
    });
    e.target.value = '';
  };
  el.querySelector('#set-reset').onclick = () => {
    confirmDialog('Wirklich ALLE Daten (Personen, Pläne, Urlaube, Kalender) unwiderruflich löschen?', () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  };
}

/* ============================================================
   SCHNELLSICHERUNG (💾-Knopf oben)
   - Windows-Programm: schreibt direkt in den gewählten Ordner
   - Chrome/Edge im Browser: über die Ordner-Freigabe
   - sonst: normaler Download als Ersatz
   Die manuelle Sicherung in den Einstellungen bleibt unberührt.
   ============================================================ */

const BACKUP_FILENAME = 'Arbeitsplaner-Sicherung.json';

function backupJSON() {
  return JSON.stringify(state, null, 2);
}

async function quickBackup() {
  // 1) Desktop-App (Electron): direkt auf die Festplatte schreiben
  if (window.desktop) {
    let folder = state.settings.backupPath;
    if (!folder) {
      folder = await window.desktop.chooseBackupFolder();
      if (!folder) { toast('Kein Ordner gewählt – Sicherung abgebrochen', 'warn'); return; }
      state.settings.backupPath = folder;
      saveState();
      if (currentPage === 'einstellungen') renderSettingsPage(document.getElementById('page-wrap'));
    }
    const res = await window.desktop.writeBackup(folder, BACKUP_FILENAME, backupJSON());
    if (res && res.ok) toast('💾 Sicherung gespeichert: ' + res.path, 'success');
    else toast('Sicherung fehlgeschlagen: ' + ((res && res.error) || 'unbekannter Fehler'), 'error');
    maybeSharePublish();
    return;
  }

  // 2) Browser mit Ordner-Freigabe (Chrome/Edge)
  if ('showDirectoryPicker' in window) {
    try {
      let dir = await loadBackupDirHandle();
      if (dir) {
        let perm = await dir.queryPermission({ mode: 'readwrite' });
        if (perm !== 'granted') perm = await dir.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') dir = null;
      }
      if (!dir) {
        dir = await window.showDirectoryPicker({ mode: 'readwrite' });
        await storeBackupDirHandle(dir);
        state.settings.backupPath = 'Ordner „' + dir.name + '"';
        saveState();
        if (currentPage === 'einstellungen') renderSettingsPage(document.getElementById('page-wrap'));
      }
      const fh = await dir.getFileHandle(BACKUP_FILENAME, { create: true });
      const w = await fh.createWritable();
      await w.write(backupJSON());
      await w.close();
      toast('💾 Sicherung gespeichert im Ordner „' + dir.name + '" ✓', 'success');
      maybeSharePublish();
    } catch (e) {
      if (e && e.name !== 'AbortError') toast('Sicherung fehlgeschlagen: ' + e.message, 'error');
    }
    return;
  }

  // 3) Ersatz: normaler Download
  exportBackup();
  toast('💾 Sicherung als Download gespeichert (Download-Ordner)', 'success');
  maybeSharePublish();
}

/* Ordner-Zugriff des Browsers dauerhaft merken (IndexedDB) */
function backupDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('arbeitsplaner-handles', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('handles');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function storeBackupDirHandle(handle) {
  const db = await backupDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('handles', 'readwrite');
    tx.objectStore('handles').put(handle, 'backupDir');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
async function loadBackupDirHandle() {
  try {
    const db = await backupDB();
    return await new Promise((resolve, reject) => {
      const rq = db.transaction('handles').objectStore('handles').get('backupDir');
      rq.onsuccess = () => resolve(rq.result || null);
      rq.onerror = () => reject(rq.error);
    });
  } catch (e) { return null; }
}
async function clearBackupDirHandle() {
  try {
    const db = await backupDB();
    db.transaction('handles', 'readwrite').objectStore('handles').delete('backupDir');
  } catch (e) { /* ignorieren */ }
}

/* ============================================================
   ONLINE-FREIGABE (nur Lesen) über GitHub Gist
   Der Chef veröffentlicht den Plan; Mitarbeiter öffnen einen
   Nur-Lese-Link, der sich automatisch aktualisiert.
   ============================================================ */

const SHARE_FILENAME = 'arbeitsplan-daten.json';
const SHARE_VIEWER_BASE = 'https://twitra.github.io/DianaHav/arbeitsplan/';

function shareViewerLink() {
  return SHARE_VIEWER_BASE + '?ansicht=' + state.settings.shareGistId;
}

/* Zu veröffentlichende Daten – ohne Token und ohne lokale Pfade */
function sharePayload(stand) {
  return JSON.stringify({
    settings: {
      firma: state.settings.firma,
      bundesland: state.settings.bundesland,
      planDesign: state.settings.planDesign,
      theme: 'light',
    },
    persons: state.persons,
    shiftTypes: state.shiftTypes,
    schedule: state.schedule,
    dayNotes: state.dayNotes,
    planNotes: state.planNotes,
    calendar: state.calendar,
    vacations: state.vacations,
    veroeffentlicht: stand,
  });
}

function shareHeaders(token) {
  return {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function sharePublish(silent) {
  const token = state.settings.shareToken;
  if (!token) {
    if (!silent) toast('Bitte zuerst in den Einstellungen ein GitHub-Token hinterlegen', 'warn');
    return false;
  }
  const stand = new Date().toISOString();
  const body = {
    description: 'Arbeitsplaner – Freigabe für Mitarbeiter (nur Lesen)',
    files: { [SHARE_FILENAME]: { content: sharePayload(stand) } },
  };
  try {
    let res;
    if (state.settings.shareGistId) {
      res = await fetch('https://api.github.com/gists/' + state.settings.shareGistId, {
        method: 'PATCH', headers: shareHeaders(token), body: JSON.stringify(body),
      });
      if (res.status === 404) { // Gist wurde gelöscht → neu anlegen
        state.settings.shareGistId = '';
        saveState();
        return sharePublish(silent);
      }
    } else {
      body.public = false; // geheimer Gist: nur über den Link erreichbar
      res = await fetch('https://api.github.com/gists', {
        method: 'POST', headers: shareHeaders(token), body: JSON.stringify(body),
      });
    }
    if (!res.ok) throw new Error('GitHub antwortete mit Status ' + res.status);
    const data = await res.json();
    state.settings.shareGistId = data.id;
    state.settings.syncStand = stand;
    saveState();
    clearSyncDirty(); // dieser Stand ist jetzt überall verfügbar
    if (!silent) toast('🌐 Freigabe aktualisiert ✓', 'success');
    return true;
  } catch (e) {
    toast('Online-Freigabe fehlgeschlagen: ' + e.message, 'error');
    return false;
  }
}

/* ============================================================
   GERÄTE-ABGLEICH der Chef-Ansicht (EXE ↔ Web-Version)
   Beim Start und beim Fokussieren wird geprüft, ob auf einem
   anderen Gerät ein neuerer Stand veröffentlicht wurde.
   ============================================================ */

function applyRemoteState(data) {
  window.SYNC_APPLYING = true;
  const keep = { ...state.settings };
  const def = DEFAULT_STATE();
  state = Object.assign(def, {
    persons: data.persons || [],
    shiftTypes: (data.shiftTypes && data.shiftTypes.length) ? data.shiftTypes : def.shiftTypes,
    schedule: data.schedule || {},
    dayNotes: data.dayNotes || {},
    planNotes: data.planNotes || {},
    calendar: data.calendar || [],
    vacations: data.vacations || [],
  });
  state.settings = keep; // Token, Pfade und Design-Einstellungen dieses Geräts behalten
  if (data.settings) {
    if (data.settings.firma !== undefined) state.settings.firma = data.settings.firma;
    if (data.settings.bundesland) state.settings.bundesland = data.settings.bundesland;
    if (data.settings.planDesign) state.settings.planDesign = data.settings.planDesign;
  }
  state.settings.syncStand = data.veroeffentlicht || '';
  saveState();
  clearSyncDirty();
  window.SYNC_APPLYING = false;
  applyTheme();
  updateBadges();
  PAGES[currentPage].render(document.getElementById('page-wrap'));
}

let ownerSyncBusy = false;

async function ownerSyncCheck() {
  if (window.VIEW_ONLY || ownerSyncBusy || !state.settings.shareGistId) return;
  ownerSyncBusy = true;
  try {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (state.settings.shareToken) headers['Authorization'] = 'Bearer ' + state.settings.shareToken;
    const res = await fetch('https://api.github.com/gists/' + state.settings.shareGistId, { headers });
    if (!res.ok) return;
    const g = await res.json();
    const f = g.files && g.files[SHARE_FILENAME];
    if (!f) return;
    let content = f.content;
    if (f.truncated) content = await (await fetch(f.raw_url)).text();
    const data = JSON.parse(content);
    if (!data.veroeffentlicht || data.veroeffentlicht === state.settings.syncStand) return;
    const standTxt = new Date(data.veroeffentlicht).toLocaleDateString('de-DE') + ', ' +
      new Date(data.veroeffentlicht).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    if (isSyncDirty()) {
      confirmDialog('Auf einem anderen Gerät wurde ein neuerer Stand gespeichert (' + standTxt + '). ' +
        'Jetzt übernehmen? Nicht veröffentlichte Änderungen auf diesem Gerät gehen dabei verloren. ' +
        'Tipp: Mit „Abbrechen" und anschließend 💾 veröffentlichst du stattdessen den Stand dieses Geräts.', () => {
        applyRemoteState(data);
        toast('🔄 Stand vom ' + standTxt + ' übernommen ✓', 'success');
      });
    } else {
      applyRemoteState(data);
      toast('🔄 Automatisch aktualisiert – Stand vom ' + standTxt + ' ✓', 'success');
    }
  } catch (e) {
    // offline oder nicht erreichbar – still bleiben, nächster Versuch kommt
  } finally {
    ownerSyncBusy = false;
  }
}

/* Freigabe-ID aus einem Mitarbeiter-Link oder einer ID herauslösen */
function parseShareId(text) {
  const m = String(text).match(/[?&]ansicht=([A-Za-z0-9]+)/);
  if (m) return m[1];
  const plain = String(text).trim();
  return /^[A-Za-z0-9]{10,}$/.test(plain) ? plain : '';
}

/* Nach dem Speichern (💾) automatisch veröffentlichen, falls eingerichtet */
function maybeSharePublish() {
  if (state.settings.shareAuto && state.settings.shareGistId && state.settings.shareToken) {
    sharePublish(true);
  }
}

async function shareDisable() {
  const token = state.settings.shareToken;
  const id = state.settings.shareGistId;
  if (token && id) {
    try {
      await fetch('https://api.github.com/gists/' + id, { method: 'DELETE', headers: shareHeaders(token) });
    } catch (e) { /* Link wird lokal trotzdem getrennt */ }
  }
  state.settings.shareGistId = '';
  saveState();
}

/* ============================================================
   NUR-LESE-ANSICHT für Mitarbeiter (?ansicht=<id>)
   ============================================================ */

let viewerStand = '';

async function viewerRefresh(gistId, first) {
  const res = await fetch('https://api.github.com/gists/' + gistId, {
    headers: { 'Accept': 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error('Plan nicht erreichbar (Status ' + res.status + ')');
  const g = await res.json();
  const f = g.files && g.files[SHARE_FILENAME];
  if (!f) throw new Error('Keine Plandaten in der Freigabe gefunden');
  let content = f.content;
  if (f.truncated) content = await (await fetch(f.raw_url)).text();
  const data = JSON.parse(content);
  if (!first && data.veroeffentlicht === viewerStand) return false;
  viewerStand = data.veroeffentlicht || '';

  const def = DEFAULT_STATE();
  state = Object.assign(def, data);
  state.settings = Object.assign(DEFAULT_STATE().settings, data.settings || {});

  const stand = viewerStand ? new Date(viewerStand) : new Date();
  const el = document.getElementById('view-stand');
  if (el) el.textContent = stand.toLocaleDateString('de-DE') + ', ' + stand.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';

  applyTheme();
  updateBadges();
  PAGES[currentPage].render(document.getElementById('page-wrap'));
  if (!first) toast('Der Plan wurde aktualisiert ✓', 'success');
  return true;
}

/* Zoom in der Nur-Lese-Ansicht (bessere Übersicht auf Handy/Tablet) */
let viewerZoomFactor = 1;

function viewerSetZoom(f) {
  viewerZoomFactor = Math.min(2, Math.max(0.5, Math.round(f * 10) / 10));
  document.getElementById('page-wrap').style.zoom = viewerZoomFactor;
  const label = document.getElementById('zoom-label');
  if (label) label.textContent = Math.round(viewerZoomFactor * 100) + '%';
}

async function initViewer(gistId) {
  window.VIEW_ONLY = true;
  document.body.classList.add('view-only');

  const zoom = document.createElement('div');
  zoom.className = 'zoom-controls';
  zoom.innerHTML =
    '<button id="zoom-out" title="Verkleinern">−</button>' +
    '<button id="zoom-label" title="Auf 100 % zurücksetzen">100%</button>' +
    '<button id="zoom-in" title="Vergrößern">+</button>';
  document.querySelector('.topbar').appendChild(zoom);
  zoom.querySelector('#zoom-out').onclick = () => viewerSetZoom(viewerZoomFactor - 0.1);
  zoom.querySelector('#zoom-in').onclick = () => viewerSetZoom(viewerZoomFactor + 0.1);
  zoom.querySelector('#zoom-label').onclick = () => viewerSetZoom(1);

  const banner = document.createElement('div');
  banner.className = 'view-banner';
  banner.innerHTML = '👁️ Nur-Ansicht &middot; Stand: <b id="view-stand">wird geladen…</b> &middot; aktualisiert sich automatisch';
  document.querySelector('.topbar').appendChild(banner);
  try {
    await viewerRefresh(gistId, true);
  } catch (e) {
    document.getElementById('page-wrap').innerHTML =
      `<div class="card empty-state"><div class="empty-icon">📡</div>
       <h2>Plan konnte nicht geladen werden</h2>
       <p>${esc(e.message)}. Bitte prüfe den Link oder versuche es später erneut.</p></div>`;
    return;
  }
  setInterval(() => viewerRefresh(gistId).catch(() => {}), 180000); // alle 3 Minuten
  window.addEventListener('focus', () => viewerRefresh(gistId).catch(() => {}));
}

/* Ordner für die Schnellsicherung wählen (aus den Einstellungen) */
async function chooseBackupTarget() {
  if (window.desktop) {
    const folder = await window.desktop.chooseBackupFolder();
    if (!folder) return false;
    state.settings.backupPath = folder;
    saveState();
    return true;
  }
  if ('showDirectoryPicker' in window) {
    try {
      const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
      await storeBackupDirHandle(dir);
      state.settings.backupPath = 'Ordner „' + dir.name + '"';
      saveState();
      return true;
    } catch (e) { return false; }
  }
  toast('In diesem Browser nicht verfügbar – der 💾-Knopf lädt die Sicherung stattdessen als Datei herunter.', 'warn');
  return false;
}

/* ---------- Theme ---------- */

function applyTheme() {
  const theme = state.settings.theme || 'light';
  document.documentElement.dataset.theme = theme;
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  document.getElementById('theme-toggle').onclick = () => {
    state.settings.theme = (state.settings.theme === 'dark') ? 'light' : 'dark';
    saveState();
    applyTheme();
  };
  document.getElementById('menu-btn').onclick = () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-backdrop').classList.toggle('show');
  };
  document.getElementById('sidebar-backdrop').onclick = () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.remove('show');
  };
  document.getElementById('backup-btn').onclick = () => quickBackup();
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (!window.VIEW_ONLY) quickBackup();
    }
  });
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  window.addEventListener('hashchange', navigate);
  const ansicht = new URLSearchParams(location.search).get('ansicht');
  if (ansicht) {
    initViewer(ansicht).then(() => navigate());
  } else {
    navigate();
    // Geräte-Abgleich: neuen Stand von anderen Geräten übernehmen
    ownerSyncCheck();
    window.addEventListener('focus', () => ownerSyncCheck());
    setInterval(() => ownerSyncCheck(), 300000); // alle 5 Minuten
  }
});
