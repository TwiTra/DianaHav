/* ============================================================
   Arbeitsplaner – Arbeitspläne (Schichtplan)
   Mitarbeiter × Tage, Klick-Planung mit Schicht-Pinsel,
   Urlaubs-Hinweise, Stundensumme, Export & Druck
   ============================================================ */

let planView = { year: new Date().getFullYear(), month: new Date().getMonth() };
let planBrush = null; // ausgewählte Schicht-ID, 'ERASE' oder null (= Auswahl-Dialog)

function renderPlanPage(el) {
  const { year, month } = planView;
  const days = monthMeta(year, month);
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

  // Pinsel-Palette
  const brushes = state.shiftTypes.map(s =>
    `<button class="brush ${planBrush === s.id ? 'active' : ''}" data-brush="${s.id}" style="--c:${s.color}" title="${esc(s.label)}${s.start ? ' (' + s.start + '–' + s.end + ')' : ''}">
      ${esc(s.code)}<span class="brush-label">${esc(s.label)}</span>
    </button>`).join('');

  // Tabellenkopf
  let head = '<tr><th class="plan-name-col">Mitarbeiter</th>';
  for (const d of days) {
    const cls = (d.holiday ? 'plan-ft' : d.weekend ? 'plan-we' : '') + (d.iso === fmtISO(new Date()) ? ' plan-today' : '');
    head += `<th class="${cls}" title="${esc(d.holiday || WEEKDAYS[d.wd])}"><span class="plan-day">${d.day}</span><span class="plan-wd">${d.wdShort}</span></th>`;
  }
  head += '<th class="plan-sum-col" title="Arbeitsstunden im Monat (abzüglich Pausen)">Std.</th></tr>';

  // Personenzeilen
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

  // Besetzungszeile
  let staffing = '<tr class="plan-staffing"><td class="plan-name-col">Besetzung</td>';
  for (const d of days) {
    const count = persons.filter(p => {
      const s = shiftById(getShift(d.iso, p.id));
      return s && s.kind === 'arbeit';
    }).length;
    staffing += `<td class="${count === 0 ? 'staffing-zero' : ''}">${count}</td>`;
  }
  staffing += '<td></td></tr>';

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Arbeitsplan – ${MONTHS[month]} ${year}</h1>
        <p class="page-sub">Schicht wählen und auf die Tage klicken. Rechtsklick löscht eine Zelle. 🌴 = laut Urlaubsplan im Urlaub.</p>
      </div>
      <div class="btn-row">
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

    <div class="card plan-card">
      <div class="plan-scroll">
        <table class="plan-table">
          <thead>${head}</thead>
          <tbody>${rows}${staffing}</tbody>
        </table>
      </div>
    </div>

    <div class="card export-bar">
      <span class="export-label">Exportieren &amp; Drucken:</span>
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

  // Zellen
  el.querySelectorAll('.plan-cell').forEach(cell => {
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
      for (const d of days) delete state.schedule[d.iso];
      saveState();
      renderPlanPage(el);
      toast('Monat geleert', 'success');
    });
  };
}

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

  // Muster: Schichten des Vormonats nach Wochentag+Woche übertragen
  confirmDialog(`Schichten aus ${MONTHS[pm]} ${py} in den ${MONTHS[month]} ${year} übernehmen? Bestehende Einträge werden überschrieben.`, () => {
    // Für jede Person: Wochentag-Muster der ersten 4 Wochen des Vormonats fortschreiben
    for (const p of activePersons()) {
      // Muster der letzten 28 Tage des Vormonats (volle 4 Wochen)
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
