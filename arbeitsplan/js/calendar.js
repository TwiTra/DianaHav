/* ============================================================
   Arbeitsplaner – Monatskalender (Hauptseite)
   Termine, Aufgaben und Notizen wie im Google-Kalender
   ============================================================ */

const ENTRY_TYPES = {
  termin:  { label: 'Termin',  color: '#2a78d6', icon: '📅' },
  aufgabe: { label: 'Aufgabe', color: '#008300', icon: '☑️' },
  notiz:   { label: 'Notiz',   color: '#eda100', icon: '📝' },
};

let calView = { year: new Date().getFullYear(), month: new Date().getMonth() };

function entriesOn(dateISO) {
  return state.calendar
    .filter(e => e.date === dateISO)
    .sort((a, b) => (a.time || '99') < (b.time || '99') ? -1 : 1);
}

function renderCalendarPage(el) {
  const { year, month } = calView;
  const todayISO = fmtISO(new Date());
  const first = new Date(year, month, 1);
  const startOffset = weekdayMon0(first);
  const nDays = daysInMonth(year, month);
  const prevDays = daysInMonth(year, (month + 11) % 12);
  const totalCells = Math.ceil((startOffset + nDays) / 7) * 7;

  let cells = '';
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    let d, other = false;
    if (dayNum < 1)      { d = new Date(year, month - 1, prevDays + dayNum); other = true; }
    else if (dayNum > nDays) { d = new Date(year, month + 1, dayNum - nDays); other = true; }
    else                 d = new Date(year, month, dayNum);
    const iso = fmtISO(d);
    const holiday = holidayName(iso);
    const entries = entriesOn(iso);
    const vacs = activePersons().filter(p => vacationOn(iso, p.id));
    const isToday = iso === todayISO;
    const wd = weekdayMon0(d);

    let chips = '';
    if (holiday) chips += `<div class="cal-chip cal-holiday" title="${esc(holiday)}">🎉 ${esc(holiday)}</div>`;
    for (const p of vacs.slice(0, 2)) {
      chips += `<div class="cal-chip cal-vac" style="--c:${p.color}" title="${esc(p.name)} hat Urlaub">🌴 ${esc(p.name.split(' ')[0])}</div>`;
    }
    if (vacs.length > 2) chips += `<div class="cal-chip cal-more">+${vacs.length - 2} im Urlaub</div>`;
    const maxE = 3 - Math.min(1, vacs.length);
    for (const e of entries.slice(0, maxE)) {
      const t = ENTRY_TYPES[e.type] || ENTRY_TYPES.notiz;
      const done = e.type === 'aufgabe' && e.done;
      chips += `<div class="cal-chip ${done ? 'cal-done' : ''}" style="--c:${t.color}">` +
        (e.time ? `<b>${esc(e.time)}</b> ` : '') + esc(e.title) + '</div>';
    }
    if (entries.length > maxE) chips += `<div class="cal-chip cal-more">+${entries.length - maxE} weitere</div>`;

    cells += `<div class="cal-cell ${other ? 'cal-other' : ''} ${wd >= 5 ? 'cal-we' : ''} ${isToday ? 'cal-today' : ''} ${holiday ? 'cal-ft' : ''}" data-date="${iso}">
      <div class="cal-daynum">${d.getDate()}</div>
      <div class="cal-chips">${chips}</div>
    </div>`;
  }

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>${MONTHS[month]} ${year}</h1>
        <p class="page-sub">Termine, Aufgaben und Notizen – klicke auf einen Tag zum Eintragen</p>
      </div>
      <div class="btn-row">
        <button class="btn" id="cal-prev" title="Voriger Monat">‹</button>
        <button class="btn" id="cal-today">Heute</button>
        <button class="btn" id="cal-next" title="Nächster Monat">›</button>
        <button class="btn btn-primary" id="cal-add">+ Neuer Eintrag</button>
      </div>
    </div>
    <div class="card cal-card">
      <div class="cal-weekdays">${WEEKDAYS_SHORT.map(w => `<div>${w}</div>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
    </div>
    <div class="cal-legend">
      ${Object.values(ENTRY_TYPES).map(t => `<span class="legend-item"><span class="legend-dot" style="background:${t.color}"></span>${t.label}</span>`).join('')}
      <span class="legend-item"><span class="legend-dot" style="background:#1baf7a">🌴</span>Urlaub</span>
      <span class="legend-item"><span class="legend-dot" style="background:#e34948"></span>Feiertag</span>
    </div>`;

  el.querySelector('#cal-prev').onclick = () => { shiftCalMonth(-1); renderCalendarPage(el); };
  el.querySelector('#cal-next').onclick = () => { shiftCalMonth(1); renderCalendarPage(el); };
  el.querySelector('#cal-today').onclick = () => {
    calView = { year: new Date().getFullYear(), month: new Date().getMonth() };
    renderCalendarPage(el);
  };
  el.querySelector('#cal-add').onclick = () => openDayModal(fmtISO(new Date()), true);
  el.querySelectorAll('.cal-cell').forEach(c => {
    c.onclick = () => openDayModal(c.dataset.date);
  });
}

function shiftCalMonth(n) {
  let m = calView.month + n, y = calView.year;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  calView = { year: y, month: m };
}

/* ---------- Tages-Dialog ---------- */

function openDayModal(dateISO, addMode = false) {
  const d = parseISO(dateISO);
  const holiday = holidayName(dateISO);
  const entries = entriesOn(dateISO);
  const vacs = activePersons().filter(p => vacationOn(dateISO, p.id));
  const working = activePersons().map(p => {
    const s = shiftById(getShift(dateISO, p.id));
    return s && s.kind === 'arbeit' ? { p, s } : null;
  }).filter(Boolean);

  let list = '';
  if (holiday) list += `<div class="day-info day-info-ft">🎉 Feiertag: <b>${esc(holiday)}</b></div>`;
  if (vacs.length) list += `<div class="day-info">🌴 Im Urlaub: ${vacs.map(p => `<b>${esc(p.name)}</b>`).join(', ')}</div>`;
  if (working.length) list += `<div class="day-info">👷 Im Dienst: ${working.map(w => `<b>${esc(w.p.name)}</b> <span class="pill" style="--c:${w.s.color}">${esc(w.s.code)}</span>`).join(' ')}</div>`;

  if (entries.length) {
    list += entries.map(e => {
      const t = ENTRY_TYPES[e.type] || ENTRY_TYPES.notiz;
      return `<div class="entry-row" style="--c:${t.color}">
        ${e.type === 'aufgabe'
          ? `<input type="checkbox" class="entry-check" data-id="${e.id}" ${e.done ? 'checked' : ''} title="Erledigt?">`
          : `<span class="entry-icon">${t.icon}</span>`}
        <div class="entry-main ${e.type === 'aufgabe' && e.done ? 'entry-done' : ''}">
          <div class="entry-title">${e.time ? `<b>${esc(e.time)}${e.endTime ? '–' + esc(e.endTime) : ''}</b> ` : ''}${esc(e.title)}</div>
          ${e.desc ? `<div class="entry-desc">${esc(e.desc)}</div>` : ''}
        </div>
        <button class="icon-btn entry-edit" data-id="${e.id}" title="Bearbeiten">✏️</button>
        <button class="icon-btn entry-del" data-id="${e.id}" title="Löschen">🗑️</button>
      </div>`;
    }).join('');
  } else {
    list += '<p class="muted" style="margin:10px 0">Noch keine Einträge an diesem Tag.</p>';
  }

  openModal(`
    <h2 class="modal-title">${WEEKDAYS[weekdayMon0(d)]}, ${fmtDateDE(dateISO)}</h2>
    <div id="day-list">${list}</div>
    <div id="entry-form-wrap"></div>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-primary" id="day-add">+ Eintrag hinzufügen</button>
    </div>
  `);

  const body = document.getElementById('modal-body');
  body.querySelectorAll('.entry-check').forEach(cb => cb.onchange = () => {
    const e = state.calendar.find(x => x.id === cb.dataset.id);
    if (e) { e.done = cb.checked; saveState(); refreshCalIfVisible(); }
  });
  body.querySelectorAll('.entry-del').forEach(b => b.onclick = () => {
    state.calendar = state.calendar.filter(x => x.id !== b.dataset.id);
    saveState();
    openDayModal(dateISO);
    refreshCalIfVisible();
  });
  body.querySelectorAll('.entry-edit').forEach(b => b.onclick = () => {
    showEntryForm(dateISO, state.calendar.find(x => x.id === b.dataset.id));
  });
  body.querySelector('#day-add').onclick = () => showEntryForm(dateISO);
  if (addMode) showEntryForm(dateISO);
}

function showEntryForm(dateISO, entry = null) {
  const wrap = document.getElementById('entry-form-wrap');
  const e = entry || { type: 'termin', title: '', time: '', endTime: '', desc: '', date: dateISO };
  wrap.innerHTML = `
    <div class="form-card">
      <h3>${entry ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h3>
      <div class="form-row">
        <label>Art</label>
        <div class="seg" id="ef-type">
          ${Object.entries(ENTRY_TYPES).map(([k, t]) =>
            `<button class="seg-btn ${e.type === k ? 'active' : ''}" data-v="${k}" style="--c:${t.color}">${t.icon} ${t.label}</button>`).join('')}
        </div>
      </div>
      <div class="form-row"><label>Datum</label><input type="date" id="ef-date" value="${esc(e.date)}"></div>
      <div class="form-row"><label>Titel *</label><input type="text" id="ef-title" value="${esc(e.title)}" placeholder="z. B. Teambesprechung" maxlength="120"></div>
      <div class="form-row form-row-2" id="ef-times" ${e.type === 'notiz' ? 'style="display:none"' : ''}>
        <div><label>Uhrzeit</label><input type="time" id="ef-time" value="${esc(e.time || '')}"></div>
        <div><label>bis (optional)</label><input type="time" id="ef-end" value="${esc(e.endTime || '')}"></div>
      </div>
      <div class="form-row"><label>Beschreibung</label><textarea id="ef-desc" rows="2" placeholder="Details (optional)">${esc(e.desc || '')}</textarea></div>
      <div class="btn-row">
        <button class="btn btn-primary" id="ef-save">Speichern</button>
        <button class="btn" id="ef-cancel">Abbrechen</button>
      </div>
    </div>`;

  let type = e.type;
  wrap.querySelectorAll('#ef-type .seg-btn').forEach(b => b.onclick = () => {
    type = b.dataset.v;
    wrap.querySelectorAll('#ef-type .seg-btn').forEach(x => x.classList.toggle('active', x === b));
    wrap.querySelector('#ef-times').style.display = type === 'notiz' ? 'none' : '';
  });
  wrap.querySelector('#ef-cancel').onclick = () => { wrap.innerHTML = ''; };
  wrap.querySelector('#ef-save').onclick = () => {
    const title = wrap.querySelector('#ef-title').value.trim();
    const date = wrap.querySelector('#ef-date').value;
    if (!title) { toast('Bitte einen Titel eingeben', 'error'); return; }
    if (!date)  { toast('Bitte ein Datum wählen', 'error'); return; }
    const data = {
      type, title, date,
      time: type === 'notiz' ? '' : wrap.querySelector('#ef-time').value,
      endTime: type === 'notiz' ? '' : wrap.querySelector('#ef-end').value,
      desc: wrap.querySelector('#ef-desc').value.trim(),
    };
    if (entry) Object.assign(entry, data);
    else state.calendar.push({ id: uid(), done: false, ...data });
    saveState();
    toast('Eintrag gespeichert ✓', 'success');
    openDayModal(date);
    refreshCalIfVisible();
  };
  wrap.querySelector('#ef-title').focus();
}

function refreshCalIfVisible() {
  if (currentPage === 'kalender') renderCalendarPage(document.getElementById('page-wrap'));
}
