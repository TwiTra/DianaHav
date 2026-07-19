/* ============================================================
   Arbeitsplaner – Statistik
   Wer hatte an welchem Wochentag frei? Wer machte welche
   Schichten? Übersichtlich und pro Person vergleichbar.
   ============================================================ */

let statsView = {
  mode: 'monat', // 'monat' | 'jahr'
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
};

/* Sequentielle Blau-Rampe (hell → dunkel) für die Heatmap */
const SEQ_BLUE = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];

function statsRangeDays() {
  const { mode, year, month } = statsView;
  const days = [];
  const months = mode === 'jahr' ? [...Array(12).keys()] : [month];
  for (const m of months) days.push(...monthMeta(year, m));
  return days;
}

function computeStats() {
  const days = statsRangeDays();
  const persons = activePersons();
  const per = {};
  for (const p of persons) {
    per[p.id] = {
      shiftCounts: {},          // shiftId -> Anzahl
      hours: 0,
      workDays: 0,
      weekendShifts: 0,
      holidayShifts: 0,
      freeByWeekday: [0,0,0,0,0,0,0], // Mo..So – explizit »frei« (frei/urlaub/krank zählt getrennt)
      offByWeekday: [0,0,0,0,0,0,0],  // Mo..So – kein Arbeitsdienst (frei, Urlaub, krank oder leer)
    };
  }
  for (const d of days) {
    for (const p of persons) {
      const st = per[p.id];
      const shift = shiftById(getShift(d.iso, p.id));
      if (shift) st.shiftCounts[shift.id] = (st.shiftCounts[shift.id] || 0) + 1;
      if (shift && shift.kind === 'arbeit') {
        st.workDays++;
        st.hours += shiftHours(shift);
        if (d.weekend) st.weekendShifts++;
        if (d.holiday) st.holidayShifts++;
      } else {
        st.offByWeekday[d.wd]++;
        if (shift && shift.kind === 'frei') st.freeByWeekday[d.wd]++;
      }
    }
  }
  return { days, persons, per };
}

function renderStatsPage(el) {
  const persons = activePersons();
  if (!persons.length) {
    el.innerHTML = `
      <div class="page-head"><h1>Statistik</h1></div>
      <div class="card empty-state">
        <div class="empty-icon">📊</div>
        <h2>Noch keine Daten</h2>
        <p>Lege Personen an und fülle den Arbeitsplan – dann erscheinen hier die Auswertungen.</p>
        <a class="btn btn-primary" href="#/personen">Personen anlegen</a>
      </div>`;
    return;
  }

  const { mode, year, month } = statsView;
  const { per } = computeStats();
  const workShifts = state.shiftTypes.filter(s => s.kind === 'arbeit');
  const absShifts = state.shiftTypes.filter(s => s.kind !== 'arbeit');
  const periodLabel = mode === 'jahr' ? String(year) : MONTHS[month] + ' ' + year;

  // Hinweis, wenn im gewählten Zeitraum gar nichts eingetragen ist
  const hasData = persons.some(p => Object.keys(per[p.id].shiftCounts).length > 0);
  const emptyHint = hasData ? '' : `
    <div class="card stats-empty-hint">
      ⚠️ Im Zeitraum <b>${periodLabel}</b> sind keine Schichten eingetragen.
      Wechsle mit den Pfeilen <b>‹ ›</b> oben rechts zu dem Monat, den du geplant hast –
      oder stelle auf <b>„Jahr"</b> um, um das ganze Jahr ${year} auszuwerten.
    </div>`;

  /* --- 1. Übersichtstabelle: alle Personen vergleichbar --- */
  let tableHead = '<tr><th class="plan-name-col">Person</th>' +
    workShifts.map(s => `<th title="${esc(s.label)}"><span class="shift-chip" style="--c:${s.color}">${esc(s.code)}</span></th>`).join('') +
    '<th>Arbeitstage</th><th>Stunden</th><th>Wochenende</th><th>Feiertage</th>' +
    absShifts.map(s => `<th title="${esc(s.label)}"><span class="shift-chip" style="--c:${s.color}">${esc(s.code)}</span></th>`).join('') +
    '</tr>';
  let tableRows = persons.map(p => {
    const st = per[p.id];
    return `<tr>
      <td class="plan-name-col"><span class="person-dot" style="background:${p.color}"></span>${esc(p.name)}</td>
      ${workShifts.map(s => `<td>${st.shiftCounts[s.id] || '–'}</td>`).join('')}
      <td><b>${st.workDays}</b></td>
      <td><b>${st.hours.toFixed(1).replace('.', ',')}</b></td>
      <td>${st.weekendShifts || '–'}</td>
      <td>${st.holidayShifts || '–'}</td>
      ${absShifts.map(s => `<td>${st.shiftCounts[s.id] || '–'}</td>`).join('')}
    </tr>`;
  }).join('');

  /* --- 2. Heatmap: Frei nach Wochentag --- */
  const maxOff = Math.max(1, ...persons.map(p => Math.max(...per[p.id].offByWeekday)));
  let heatRows = persons.map(p => {
    const st = per[p.id];
    const cells = st.offByWeekday.map((n, wd) => {
      const level = n === 0 ? -1 : Math.min(SEQ_BLUE.length - 1, Math.floor((n / maxOff) * (SEQ_BLUE.length - 1)));
      const bg = n === 0 ? 'transparent' : SEQ_BLUE[level];
      const ink = level >= 3 ? '#ffffff' : '#0b0b0b';
      const free = st.freeByWeekday[wd];
      return `<td class="heat-cell" style="background:${bg};color:${n === 0 ? 'var(--text3)' : ink}"
        title="${esc(p.name)} – ${WEEKDAYS[wd]}: ${n}× kein Dienst${free ? ` (davon ${free}× explizit frei)` : ''}">${n || '·'}</td>`;
    }).join('');
    return `<tr><td class="plan-name-col"><span class="person-dot" style="background:${p.color}"></span>${esc(p.name)}</td>${cells}</tr>`;
  }).join('');

  /* --- 3. Balkendiagramm: Schichten pro Person --- */
  const maxCount = Math.max(1, ...persons.flatMap(p => workShifts.map(s => per[p.id].shiftCounts[s.id] || 0)));
  let bars = persons.map(p => {
    const st = per[p.id];
    const rows = workShifts.map(s => {
      const n = st.shiftCounts[s.id] || 0;
      const w = (n / maxCount) * 100;
      return `<div class="bar-row" title="${esc(p.name)}: ${n}× ${esc(s.label)}">
        <span class="bar-label">${esc(s.code)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${s.color}"></div></div>
        <span class="bar-value">${n || ''}</span>
      </div>`;
    }).join('');
    return `<div class="bar-group">
      <div class="bar-group-head"><span class="person-dot" style="background:${p.color}"></span><b>${esc(p.name)}</b>
        <span class="muted">${st.workDays} Arbeitstage · ${st.hours.toFixed(1).replace('.', ',')} Std.</span></div>
      ${rows}
    </div>`;
  }).join('');

  const shiftLegend = workShifts.map(s =>
    `<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${esc(s.code)} = ${esc(s.label)}</span>`).join('');

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Statistik – ${periodLabel}</h1>
        <p class="page-sub">Auswertung des Arbeitsplans: Schichten, Stunden und freie Tage im Vergleich.</p>
      </div>
      <div class="btn-row">
        <div class="seg">
          <button class="seg-btn ${mode === 'monat' ? 'active' : ''}" id="st-monat">Monat</button>
          <button class="seg-btn ${mode === 'jahr' ? 'active' : ''}" id="st-jahr">Jahr</button>
        </div>
        <button class="btn" id="st-prev">‹</button>
        <button class="btn" id="st-today">Heute</button>
        <button class="btn" id="st-next">›</button>
      </div>
    </div>

    ${emptyHint}

    <div class="card">
      <h3 class="card-title">Übersicht pro Person</h3>
      <div class="plan-scroll">
        <table class="stats-table">
          <thead>${tableHead}</thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="cal-legend" style="margin-top:10px">${shiftLegend}
        ${absShifts.map(s => `<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${esc(s.code)} = ${esc(s.label)}</span>`).join('')}
      </div>
    </div>

    <div class="stats-2col">
      <div class="card">
        <h3 class="card-title">Freie Tage nach Wochentag</h3>
        <p class="muted" style="margin-bottom:10px">Wie oft hatte jede Person am jeweiligen Wochentag keinen Arbeitsdienst? (dunkler = öfter)</p>
        <div class="plan-scroll">
          <table class="stats-table heat-table">
            <thead><tr><th class="plan-name-col">Person</th>${WEEKDAYS_SHORT.map(w => `<th>${w}</th>`).join('')}</tr></thead>
            <tbody>${heatRows}</tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Schichten im Vergleich</h3>
        <p class="muted" style="margin-bottom:10px">Anzahl der Schichten pro Person und Schichtart.</p>
        ${bars || '<p class="muted">Keine Schichten im Zeitraum.</p>'}
      </div>
    </div>`;

  el.querySelector('#st-monat').onclick = () => { statsView.mode = 'monat'; renderStatsPage(el); };
  el.querySelector('#st-jahr').onclick = () => { statsView.mode = 'jahr'; renderStatsPage(el); };
  el.querySelector('#st-prev').onclick = () => { shiftStatsPeriod(-1); renderStatsPage(el); };
  el.querySelector('#st-next').onclick = () => { shiftStatsPeriod(1); renderStatsPage(el); };
  el.querySelector('#st-today').onclick = () => {
    statsView.year = new Date().getFullYear();
    statsView.month = new Date().getMonth();
    renderStatsPage(el);
  };
}

function shiftStatsPeriod(n) {
  if (statsView.mode === 'jahr') { statsView.year += n; return; }
  let m = statsView.month + n, y = statsView.year;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  statsView.month = m;
  statsView.year = y;
}
