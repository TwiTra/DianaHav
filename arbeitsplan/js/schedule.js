/* ============================================================
   Arbeitsplaner – Arbeitspläne (Schichtplan)
   Drei wählbare Designs (Klassisch, Wochen-Vorlage, Excel),
   Klick-Planung mit Schicht-Pinsel, Urlaubs-Hinweise,
   Stundensumme, Export & Druck. Die Schichtdaten sind vom
   Design unabhängig – ein Wechsel behält alle Einträge.
   ============================================================ */

let planView = { year: new Date().getFullYear(), month: new Date().getMonth() };
let planBrush = null; // ausgewählte Schicht-ID, 'ERASE' oder null (= Auswahl-Dialog)

function renderPlanPage(el) {
  const { year, month } = planView;
  const persons = activePersons();

  if (!persons.length) {
    el.innerHTML = `
      <div class="page-head"><h1>Arbeitspläne</h1></div>
      <div class="card empty-state">
        <div class="empty-icon">👥</div>
        <h2>Noch keine Personen angelegt</h2>
        <p>Lege zuerst deine Mitarbeiter an, dann kannst du hier den Schichtplan erstellen.</p>
        <a class="btn btn-primary" href="#/personen">Personen anlegen</a>
      </div>`;
    return;
  }

  const design = currentPlanDesign();

  // Pinsel-Palette
  const brushes = state.shiftTypes.map(s =>
    `<button class="brush ${planBrush === s.id ? 'active' : ''}" data-brush="${s.id}" style="--c:${s.color}" title="${esc(s.label)}${s.start ? ' (' + s.start + '–' + s.end + ')' : ''}">
      ${esc(s.code)}<span class="brush-label">${esc(s.label)}</span>
    </button>`).join('');

  let planBody;
  if (design === 'wochen')     planBody = planScreenWochen(year, month, persons);
  else if (design === 'excel') planBody = planScreenExcel(year, month, persons);
  else                         planBody = planScreenClassic(year, month, persons);

  // Notizen unter dem Plan (wie in der Vorlage) – im Wochen- und Klassisch-Design
  const notesCard = design === 'excel' ? '' : planNotesCard(year, month);

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Arbeitsplan – ${MONTHS[month]} ${year}</h1>
        <p class="page-sub">Schicht wählen und auf die Tage klicken. Rechtsklick löscht eine Zelle. 🌴 = laut Urlaubsplan im Urlaub.</p>
      </div>
      <div class="btn-row">
        <select id="plan-design" class="design-select" title="Design des Arbeitsplans – die Schichten bleiben beim Wechsel erhalten">
          ${PLAN_DESIGNS.map(d => `<option value="${d.id}" ${design === d.id ? 'selected' : ''}>🎨 ${d.label}</option>`).join('')}
        </select>
        <button class="btn" id="plan-prev" title="Voriger Monat">‹</button>
        <button class="btn" id="plan-today">Heute</button>
        <button class="btn" id="plan-next" title="Nächster Monat">›</button>
      </div>
    </div>

    <div class="card brush-bar">
      <span class="brush-bar-label">Schicht-Pinsel:</span>
      ${brushes}
      <button class="brush brush-erase ${planBrush === 'ERASE' ? 'active' : ''}" data-brush="ERASE" title="Zellen leeren">⌫<span class="brush-label">Radierer</span></button>
      <button class="brush brush-none ${planBrush === null ? 'active' : ''}" data-brush="" title="Bei Klick Auswahl anzeigen">🖱️<span class="brush-label">Auswahl</span></button>
    </div>

    ${planBody}

    ${notesCard}

    <div class="card export-bar">
      <span class="export-label">Exportieren &amp; Drucken (im gewählten Design):</span>
      <button class="btn" id="exp-print">🖨️ Drucken (A4)</button>
      <button class="btn" id="exp-pdf">📄 PDF</button>
      <button class="btn" id="exp-png">🖼️ PNG</button>
      <button class="btn" id="exp-word">📝 Word</button>
      <button class="btn" id="exp-excel">📊 Excel</button>
      <button class="btn" id="exp-csv">🗂️ CSV</button>
      <span class="export-spacer"></span>
      <button class="btn" id="plan-copy">↩︎ Vormonat übernehmen</button>
      <button class="btn btn-danger-ghost" id="plan-clear">Monat leeren</button>
    </div>`;

  // Design-Wechsel: nur die Ansicht ändert sich, alle Schichten bleiben
  el.querySelector('#plan-design').onchange = (e) => {
    state.settings.planDesign = e.target.value;
    saveState();
    renderPlanPage(el);
    toast('Design gewechselt – alle Schichten wurden übernommen ✓', 'success');
  };

  // Navigation
  el.querySelector('#plan-prev').onclick = () => { shiftPlanMonth(-1); renderPlanPage(el); };
  el.querySelector('#plan-next').onclick = () => { shiftPlanMonth(1); renderPlanPage(el); };
  el.querySelector('#plan-today').onclick = () => {
    planView = { year: new Date().getFullYear(), month: new Date().getMonth() };
    renderPlanPage(el);
  };

  // Pinsel
  el.querySelectorAll('.brush').forEach(b => b.onclick = () => {
    const v = b.dataset.brush;
    planBrush = v === '' ? null : v;
    el.querySelectorAll('.brush').forEach(x => x.classList.toggle('active', x === b));
  });

  bindPlanCells(el);
  if (notesCard) bindPlanNotes(el, year, month);

  // Export
  el.querySelector('#exp-print').onclick = () => printPlan(year, month);
  el.querySelector('#exp-pdf').onclick   = () => exportPlanPDF(year, month);
  el.querySelector('#exp-png').onclick   = () => exportPlanPNG(year, month);
  el.querySelector('#exp-word').onclick  = () => exportPlanWord(year, month);
  el.querySelector('#exp-excel').onclick = () => exportPlanExcel(year, month);
  el.querySelector('#exp-csv').onclick   = () => exportPlanCSV(year, month);

  // Vormonat übernehmen / Monat leeren
  el.querySelector('#plan-copy').onclick = () => copyPreviousMonth(el);
  el.querySelector('#plan-clear').onclick = () => {
    confirmDialog(`Wirklich alle Schichten im ${MONTHS[month]} ${year} löschen?`, () => {
      for (const d of monthMeta(year, month)) delete state.schedule[d.iso];
      saveState();
      renderPlanPage(el);
      toast('Monat geleert', 'success');
    });
  };
}

/* ============================================================
   NOTIZEN unter dem Plan (pro Monat, wie in der Vorlage)
   ============================================================ */

function planNotesCard(year, month) {
  const notes = planNotesFor(year, month);
  const rows = notes.map(n => `
    <div class="note-item" data-id="${n.id}">
      <span class="note-bullet"></span>
      <div class="note-text" contenteditable="true">${esc(n.text)}</div>
      <button class="icon-btn note-del" title="Notiz löschen">🗑️</button>
    </div>`).join('');
  return `<div class="card notes-card">
    <div class="notes-head">
      <span class="notes-title">📝 Notizen zum Plan – ${MONTHS[month]} ${year}</span>
      <button class="btn btn-sm" id="note-add">+ Notiz hinzufügen</button>
    </div>
    <div id="note-list">${rows || '<p class="muted note-empty">Noch keine Notizen. Beispiele: „Krankmeldungen bitte bis 8:00 Uhr melden.", „Schichttausch nur nach Absprache."</p>'}</div>
  </div>`;
}

function bindPlanNotes(el, year, month) {
  const notes = planNotesFor(year, month);

  el.querySelector('#note-add').onclick = () => {
    notes.push({ id: uid(), text: '' });
    saveState();
    renderPlanPage(el);
    const fields = el.querySelectorAll('.note-text');
    if (fields.length) fields[fields.length - 1].focus();
  };

  el.querySelectorAll('.note-item').forEach(item => {
    const note = notes.find(n => n.id === item.dataset.id);
    if (!note) return;
    const field = item.querySelector('.note-text');
    field.onblur = () => {
      const text = field.innerText.replace(/\s+$/g, '');
      if (text !== note.text) {
        note.text = text;
        saveState();
      }
    };
    item.querySelector('.note-del').onclick = () => {
      const idx = notes.findIndex(n => n.id === note.id);
      if (idx >= 0) notes.splice(idx, 1);
      saveState();
      renderPlanPage(el);
      toast('Notiz gelöscht', 'success');
    };
  });
}

/* Klick-/Rechtsklick-Verhalten – für alle Designs identisch */
function bindPlanCells(el) {
  el.querySelectorAll('.plan-cell[data-date]').forEach(cell => {
    cell.onclick = () => {
      const { date, person } = cell.dataset;
      if (planBrush === 'ERASE') { setShift(date, person, null); renderPlanPage(el); }
      else if (planBrush)        { applyBrush(date, person); renderPlanPage(el); }
      else                       openShiftPicker(date, person);
    };
    cell.oncontextmenu = (ev) => {
      ev.preventDefault();
      setShift(cell.dataset.date, cell.dataset.person, null);
      renderPlanPage(el);
    };
  });
}

/* ============================================================
   DESIGN 1: „Klassisch" – ganzer Monat kompakt
   ============================================================ */

function planScreenClassic(year, month, persons) {
  const days = monthMeta(year, month);

  let head = '<tr><th class="plan-name-col">Mitarbeiter</th>';
  for (const d of days) {
    const cls = (d.holiday ? 'plan-ft' : d.weekend ? 'plan-we' : '') + (d.iso === fmtISO(new Date()) ? ' plan-today' : '');
    head += `<th class="${cls}" title="${esc(d.holiday || WEEKDAYS[d.wd])}"><span class="plan-day">${d.day}</span><span class="plan-wd">${d.wdShort}</span></th>`;
  }
  head += '<th class="plan-sum-col" title="Arbeitsstunden im Monat (abzüglich Pausen)">Std.</th></tr>';

  let rows = '';
  for (const p of persons) {
    let hours = 0;
    let cells = '';
    for (const d of days) {
      const sid = getShift(d.iso, p.id);
      const shift = sid ? shiftById(sid) : null;
      const vac = vacationOn(d.iso, p.id);
      if (shift && shift.kind === 'arbeit') hours += shiftHours(shift);
      const conflict = vac && shift && shift.kind === 'arbeit';
      const cls = (d.holiday ? 'plan-ft' : d.weekend ? 'plan-we' : '') + (conflict ? ' plan-conflict' : '');
      let inner = '';
      if (shift) {
        inner = `<span class="shift-chip" style="--c:${shift.color}">${esc(shift.code)}</span>`;
      } else if (vac) {
        inner = `<span class="vac-hint" title="Laut Urlaubsplan im Urlaub (${fmtDateDE(vac.from)}–${fmtDateDE(vac.to)})">🌴</span>`;
      }
      const tip = conflict ? '⚠️ Achtung: laut Urlaubsplan im Urlaub!' : (vac && !shift ? 'Im Urlaubsplan eingetragen' : '');
      cells += `<td class="plan-cell ${cls}" data-date="${d.iso}" data-person="${p.id}" ${tip ? `title="${esc(tip)}"` : ''}>${inner}${conflict ? '<span class="conflict-mark">⚠️</span>' : ''}</td>`;
    }
    rows += `<tr>
      <td class="plan-name-col"><span class="person-dot" style="background:${p.color}"></span>${esc(p.name)}</td>
      ${cells}
      <td class="plan-sum-col">${hours ? hours.toFixed(1).replace('.', ',') : '–'}</td>
    </tr>`;
  }

  let staffing = '<tr class="plan-staffing"><td class="plan-name-col">Besetzung</td>';
  for (const d of days) {
    const count = persons.filter(p => {
      const s = shiftById(getShift(d.iso, p.id));
      return s && s.kind === 'arbeit';
    }).length;
    staffing += `<td class="${count === 0 ? 'staffing-zero' : ''}">${count}</td>`;
  }
  staffing += '<td></td></tr>';

  return `<div class="card plan-card">
    <div class="plan-scroll">
      <table class="plan-table">
        <thead>${head}</thead>
        <tbody>${rows}${staffing}</tbody>
      </table>
    </div>
  </div>`;
}

/* ============================================================
   DESIGN 2: „Wochen" – nach der hochgeladenen Vorlage
   (dunkles Kopfband, KW-Gruppen, farbige Zeit-Pillen)
   ============================================================ */

function planScreenWochen(year, month, persons) {
  const weeks = monthWeeks(year, month);
  const todayISO = fmtISO(new Date());

  let kwRow = '<tr><th class="w-corner plan-name-col">MITARBEITER</th>';
  for (const w of weeks) kwRow += `<th class="w-kw" colspan="6">KW ${w.kw}</th>`;
  kwRow += '<th class="w-corner w-sumh">Σ Std.</th></tr>';

  let dayRow = '<tr><th class="w-dayhead plan-name-col"></th>';
  for (const w of weeks) {
    w.days.filter(d => d.wd < 6).forEach((d, i) => {
      const cls = 'w-dayhead' + (d.holiday ? ' w-ft' : d.wd === 5 ? ' w-sat' : '') + (i === 0 ? ' wsep' : '') +
        (d.inMonth ? '' : ' w-out') + (d.iso === todayISO ? ' plan-today' : '');
      dayRow += `<th class="${cls}" title="${esc(d.holiday || WEEKDAYS[d.wd])}"><b>${WEEKDAYS_SHORT[d.wd]}</b><span>${fmtDDMM(d.date)}</span></th>`;
    });
  }
  dayRow += '<th class="w-dayhead"></th></tr>';

  let rows = '';
  for (const p of persons) {
    const initials = p.name.split(' ').map(x => x[0] || '').slice(0, 2).join('').toUpperCase();
    let cells = '';
    for (const w of weeks) {
      w.days.filter(d => d.wd < 6).forEach((d, i) => {
        const sep = i === 0 ? ' wsep' : '';
        if (!d.inMonth) { cells += `<td class="w-cell plan-out${sep}"></td>`; return; }
        const shift = shiftById(getShift(d.iso, p.id));
        const vac = vacationOn(d.iso, p.id);
        const conflict = vac && shift && shift.kind === 'arbeit';
        const cls = 'plan-cell w-cell' + (d.holiday ? ' w-ftcol' : d.wd === 5 ? ' w-satcol' : '') + sep + (conflict ? ' plan-conflict' : '');
        let inner;
        if (shift) inner = `<div class="wpill" style="--c:${shift.color}">${esc(shiftPillLabel(shift))}</div>`;
        else if (vac) inner = `<span class="vac-hint" title="Laut Urlaubsplan im Urlaub">🌴</span>`;
        else inner = '<span class="w-dot">·</span>';
        const tip = conflict ? '⚠️ Achtung: laut Urlaubsplan im Urlaub!' : '';
        cells += `<td class="${cls}" data-date="${d.iso}" data-person="${p.id}" ${tip ? `title="${esc(tip)}"` : ''}>${inner}</td>`;
      });
    }
    const hours = monthWorkHours(p.id, year, month);
    rows += `<tr>
      <td class="plan-name-col w-name"><span class="w-avatar">${esc(initials)}</span>${esc(p.name)}</td>
      ${cells}
      <td class="w-sum">${hours ? hours.toFixed(1).replace('.', ',') : '–'}</td>
    </tr>`;
  }

  return `<div class="card wochen-card">
    <div class="wochen-band">
      <div>
        <span class="wochen-label">ARBEITSPLAN</span>
        <div class="wochen-title">${MONTHS[month]} ${year}</div>
      </div>
      <div class="wochen-meta">${state.settings.firma ? 'Standort / Team: <b>' + esc(state.settings.firma) + '</b>' : ''}</div>
    </div>
    <div class="plan-scroll">
      <table class="wochen-table">
        <thead>${kwRow}${dayRow}</thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

/* ============================================================
   DESIGN 3: „Excel-Tabelle" – exakte Kopie der hochgeladenen
   Arbeitsplan.xlsx: zwei Wochenblöcke nebeneinander, drei
   Blockzeilen = 6 Wochen (Woche 5 und 6 ergänzt). Alle Tage
   sind klickbar – auch die aus Nachbarmonaten.
   ============================================================ */

function planScreenExcel(year, month, persons) {
  const weeks = monthWeeks6(year, month);
  const left = weeks.slice(0, 3), right = weeks.slice(3, 6);
  const todayISO = fmtISO(new Date());

  const dayHead = d => {
    const cls = 'xls-dh' + (d.holiday ? ' xls-dh-ft' : d.wd === 5 ? ' xls-dh-sa' : '') +
      (d.inMonth ? '' : ' xls-out') + (d.iso === todayISO ? ' plan-today' : '');
    return `<td class="${cls}" title="${esc(d.holiday || WEEKDAYS[d.wd])}">${WEEKDAYS_SHORT[d.wd]} ${fmtDDMMs(d.date)}</td>`;
  };
  const valCell = (d, p) => {
    const s = shiftById(getShift(d.iso, p.id));
    const vac = vacationOn(d.iso, p.id);
    const conflict = vac && s && s.kind === 'arbeit';
    let cls = 'plan-cell xls-cell' + (d.wd === 5 ? ' xls-sa' : '') + (conflict ? ' plan-conflict' : '');
    let inner = '';
    if (s) {
      if (s.id === 'FT') cls += ' xls-ft';
      inner = esc(excelCellText(s));
    } else if (d.holiday) {
      cls += ' xls-ft';
      inner = 'Feiertag';
    } else if (vac) {
      inner = '<span class="vac-hint" title="Laut Urlaubsplan im Urlaub">🌴</span>';
    }
    const tip = conflict ? '⚠️ Achtung: laut Urlaubsplan im Urlaub!' : '';
    return `<td class="${cls}" data-date="${d.iso}" data-person="${p.id}" ${tip ? `title="${esc(tip)}"` : ''}>${inner}</td>`;
  };

  const kwLabel = ws => ws.map(w => 'KW ' + w.kw).join('  /  ');
  let rows = '';
  for (const p of persons) {
    for (let i = 0; i < 3; i++) {
      rows += '<tr>';
      if (i === 0) rows += `<td class="xls-name" rowspan="6">${esc(p.name)}</td>`;
      rows += left[i].days.filter(d => d.wd < 6).map(dayHead).join('');
      rows += '<td class="xls-gap"></td>';
      rows += right[i].days.filter(d => d.wd < 6).map(dayHead).join('');
      rows += '</tr><tr>';
      rows += left[i].days.filter(d => d.wd < 6).map(d => valCell(d, p)).join('');
      rows += '<td class="xls-gap"></td>';
      rows += right[i].days.filter(d => d.wd < 6).map(d => valCell(d, p)).join('');
      rows += '</tr>';
    }
    rows += '<tr class="xls-sep"><td colspan="14"></td></tr>';
  }

  return `<div class="card xls-card">
    <div class="plan-scroll">
      <table class="xls-table">
        <colgroup><col class="xls-namecol">${'<col>'.repeat(6)}<col class="xls-gapcol">${'<col>'.repeat(6)}</colgroup>
        <tbody>
          <tr><td class="xls-title" colspan="14">${esc(planTitle(year, month))}</td></tr>
          <tr>
            <td class="xls-gap"></td>
            <td class="xls-kw" colspan="6">${kwLabel(left)}</td>
            <td class="xls-gap"></td>
            <td class="xls-kw" colspan="6">${kwLabel(right)}</td>
          </tr>
          ${rows}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ============================================================
   Gemeinsame Logik
   ============================================================ */

function applyBrush(dateISO, personId) {
  const vac = vacationOn(dateISO, personId);
  const shift = shiftById(planBrush);
  if (vac && shift && shift.kind === 'arbeit') {
    toast(`⚠️ ${personById(personId)?.name || 'Person'} ist hier laut Urlaubsplan im Urlaub!`, 'warn');
  }
  setShift(dateISO, personId, planBrush);
}

function shiftPlanMonth(n) {
  let m = planView.month + n, y = planView.year;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  planView = { year: y, month: m };
}

/* Klick ohne Pinsel: Schicht-Auswahl für eine Zelle */
function openShiftPicker(dateISO, personId) {
  const p = personById(personId);
  const current = getShift(dateISO, personId);
  const vac = vacationOn(dateISO, personId);
  openModal(`
    <h2 class="modal-title">${esc(p ? p.name : '?')} – ${fmtDateDE(dateISO)}</h2>
    ${vac ? `<div class="day-info">🌴 Laut Urlaubsplan im Urlaub (${fmtDateDE(vac.from)} – ${fmtDateDE(vac.to)})</div>` : ''}
    <div class="picker-grid">
      ${state.shiftTypes.map(s => `
        <button class="picker-btn ${current === s.id ? 'active' : ''}" data-shift="${s.id}" style="--c:${s.color}">
          <span class="shift-chip" style="--c:${s.color}">${esc(s.code)}</span>
          <span>${esc(s.label)}</span>
          ${s.start ? `<span class="muted">${s.start}–${s.end}</span>` : ''}
        </button>`).join('')}
      <button class="picker-btn" data-shift=""><span class="shift-chip" style="--c:#898781">–</span><span>Leeren</span></button>
    </div>`);
  document.querySelectorAll('#modal-body .picker-btn').forEach(b => b.onclick = () => {
    setShift(dateISO, personId, b.dataset.shift || null);
    closeModal();
    renderPlanPage(document.getElementById('page-wrap'));
  });
}

/* Plan des Vormonats wochentagsgleich übernehmen */
function copyPreviousMonth(el) {
  const { year, month } = planView;
  const pm = month === 0 ? 11 : month - 1;
  const py = month === 0 ? year - 1 : year;
  const prevDays = monthMeta(py, pm);
  const curDays = monthMeta(year, month);

  confirmDialog(`Schichten aus ${MONTHS[pm]} ${py} in den ${MONTHS[month]} ${year} übernehmen? Bestehende Einträge werden überschrieben.`, () => {
    // Für jede Person: Wochentag-Muster der letzten 4 vollen Wochen fortschreiben
    for (const p of activePersons()) {
      const pattern = [];
      const startIdx = Math.max(0, prevDays.length - 28);
      for (let i = startIdx; i < prevDays.length; i++) {
        pattern.push(getShift(prevDays[i].iso, p.id));
      }
      if (!pattern.some(Boolean)) continue;
      curDays.forEach((d, i) => {
        const sid = pattern[i % pattern.length];
        if (sid) setShift(d.iso, p.id, sid);
      });
    }
    saveState();
    renderPlanPage(el);
    toast('Vormonat übernommen ✓', 'success');
  });
}
