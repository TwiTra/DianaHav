/* ============================================================
   Arbeitsplaner – Urlaubspläne
   Jahresplanung pro Person, Jahresübersicht, Konflikt-Anzeige
   ============================================================ */

let vacYear = new Date().getFullYear();

function renderVacationPage(el) {
  const persons = activePersons();
  const year = vacYear;

  if (!persons.length) {
    el.innerHTML = `
      <div class="page-head"><h1>Urlaubspläne</h1></div>
      <div class="card empty-state">
        <div class="empty-icon">🌴</div>
        <h2>Noch keine Personen angelegt</h2>
        <p>Lege zuerst deine Mitarbeiter an, dann kannst du hier die Urlaube planen.</p>
        <a class="btn btn-primary" href="#/personen">Personen anlegen</a>
      </div>`;
    return;
  }

  /* --- Jahresübersicht: pro Person 12 Monats-Streifen --- */
  const monthCols = MONTHS.map(m => `<th>${m.slice(0, 3)}</th>`).join('');
  let overviewRows = '';
  for (const p of persons) {
    let cells = '';
    for (let m = 0; m < 12; m++) {
      const n = daysInMonth(year, m);
      let strip = '';
      for (let d = 1; d <= n; d++) {
        const iso = year + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const v = vacationOn(iso, p.id);
        const others = v ? persons.filter(q => q.id !== p.id && vacationOn(iso, q.id)).length : 0;
        const wd = weekdayMon0(new Date(year, m, d));
        let cls = '';
        if (v) cls = others > 0 ? 'vd-overlap' : (v.status === 'genehmigt' ? 'vd-ok' : 'vd-plan');
        else if (wd >= 5) cls = 'vd-we';
        strip += `<span class="vd ${cls}" title="${fmtDateDE(iso)}${v ? ' – ' + (v.status === 'genehmigt' ? 'Urlaub (genehmigt)' : 'Urlaub (geplant)') + (others ? ' – ⚠️ ' + others + ' weitere im Urlaub' : '') : ''}"></span>`;
      }
      cells += `<td><div class="vd-strip">${strip}</div></td>`;
    }
    const used = usedVacationDays(p.id, year);
    const total = p.vacationDays || 30;
    overviewRows += `<tr>
      <td class="plan-name-col"><span class="person-dot" style="background:${p.color}"></span>${esc(p.name)}
        <span class="vac-quota ${used > total ? 'vac-over' : ''}">${used}/${total} Tage</span></td>
      ${cells}
    </tr>`;
  }

  /* --- Urlaubs-Liste pro Person --- */
  let personCards = '';
  for (const p of persons) {
    const vacs = state.vacations
      .filter(v => v.personId === p.id && (v.from.slice(0, 4) == year || v.to.slice(0, 4) == year))
      .sort((a, b) => a.from < b.from ? -1 : 1);
    const used = usedVacationDays(p.id, year);
    const total = p.vacationDays || 30;
    const rows = vacs.map(v => {
      const days = countVacationWorkdays(v.from, v.to);
      const overlaps = persons.filter(q => q.id !== p.id &&
        state.vacations.some(w => w.personId === q.id && w.from <= v.to && w.to >= v.from));
      return `<div class="vac-row">
        <span class="vac-dates">${fmtDateDE(v.from)} – ${fmtDateDE(v.to)}</span>
        <span class="vac-days">${days} Arbeitstage</span>
        <span class="pill" style="--c:${v.status === 'genehmigt' ? '#008300' : '#eda100'}">${v.status === 'genehmigt' ? '✓ genehmigt' : '⏳ geplant'}</span>
        ${overlaps.length ? `<span class="pill" style="--c:#e34948" title="Gleichzeitig im Urlaub: ${esc(overlaps.map(o => o.name).join(', '))}">⚠️ Überschneidung</span>` : ''}
        ${v.note ? `<span class="muted">${esc(v.note)}</span>` : ''}
        <span class="export-spacer"></span>
        <button class="icon-btn vac-to-plan" data-id="${v.id}" title="Als »U« in den Arbeitsplan eintragen">📋→</button>
        <button class="icon-btn vac-edit" data-id="${v.id}" title="Bearbeiten">✏️</button>
        <button class="icon-btn vac-del" data-id="${v.id}" title="Löschen">🗑️</button>
      </div>`;
    }).join('') || '<p class="muted">Kein Urlaub eingetragen.</p>';

    personCards += `<div class="card vac-person-card">
      <div class="vac-person-head">
        <span class="person-dot" style="background:${p.color}"></span>
        <h3>${esc(p.name)}</h3>
        <span class="vac-quota ${used > total ? 'vac-over' : ''}">${used} von ${total} Urlaubstagen verplant${used > total ? ' – zu viel!' : ''}</span>
        <span class="export-spacer"></span>
        <button class="btn btn-sm vac-add" data-person="${p.id}">+ Urlaub</button>
      </div>
      ${rows}
    </div>`;
  }

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Urlaubspläne ${year}</h1>
        <p class="page-sub">Urlaube fürs ganze Jahr einpflegen – sie erscheinen automatisch im Arbeitsplan (🌴) und im Kalender.</p>
      </div>
      <div class="btn-row">
        <button class="btn" id="vac-prev">‹ ${year - 1}</button>
        <button class="btn" id="vac-next">${year + 1} ›</button>
        <button class="btn btn-primary" id="vac-new">+ Urlaub eintragen</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">Jahresübersicht</h3>
      <div class="plan-scroll">
        <table class="vac-year-table">
          <thead><tr><th class="plan-name-col">Person</th>${monthCols}</tr></thead>
          <tbody>${overviewRows}</tbody>
        </table>
      </div>
      <div class="cal-legend" style="margin-top:10px">
        <span class="legend-item"><span class="legend-dot" style="background:#008300"></span>genehmigt</span>
        <span class="legend-item"><span class="legend-dot" style="background:#eda100"></span>geplant</span>
        <span class="legend-item"><span class="legend-dot" style="background:#e34948"></span>Überschneidung mit Kollegen</span>
      </div>
    </div>

    ${personCards}`;

  el.querySelector('#vac-prev').onclick = () => { vacYear--; renderVacationPage(el); };
  el.querySelector('#vac-next').onclick = () => { vacYear++; renderVacationPage(el); };
  el.querySelector('#vac-new').onclick = () => openVacationForm();
  el.querySelectorAll('.vac-add').forEach(b => b.onclick = () => openVacationForm(null, b.dataset.person));
  el.querySelectorAll('.vac-edit').forEach(b => b.onclick = () => openVacationForm(state.vacations.find(v => v.id === b.dataset.id)));
  el.querySelectorAll('.vac-del').forEach(b => b.onclick = () => {
    confirmDialog('Diesen Urlaub wirklich löschen?', () => {
      state.vacations = state.vacations.filter(v => v.id !== b.dataset.id);
      saveState();
      renderVacationPage(el);
      toast('Urlaub gelöscht', 'success');
    });
  });
  el.querySelectorAll('.vac-to-plan').forEach(b => b.onclick = () => {
    const v = state.vacations.find(x => x.id === b.dataset.id);
    if (!v) return;
    confirmDialog('Diesen Urlaub als »U« in den Arbeitsplan eintragen? Bestehende Schichten in dem Zeitraum werden überschrieben.', () => {
      let d = parseISO(v.from);
      const end = parseISO(v.to);
      while (d <= end) {
        setShift(fmtISO(d), v.personId, 'U');
        d = addDays(d, 1);
      }
      toast('In den Arbeitsplan übertragen ✓', 'success');
    });
  });
}

/* Verplante Urlaubstage (Arbeitstage) einer Person in einem Jahr */
function usedVacationDays(personId, year) {
  let n = 0;
  for (const v of state.vacations) {
    if (v.personId !== personId) continue;
    const from = v.from < year + '-01-01' ? year + '-01-01' : v.from;
    const to = v.to > year + '-12-31' ? year + '-12-31' : v.to;
    if (from > to) continue;
    n += countVacationWorkdays(from, to);
  }
  return n;
}

function openVacationForm(vac = null, presetPerson = null) {
  const persons = activePersons();
  const v = vac || { personId: presetPerson || persons[0].id, from: '', to: '', note: '', status: 'geplant' };
  openModal(`
    <h2 class="modal-title">${vac ? 'Urlaub bearbeiten' : 'Urlaub eintragen'}</h2>
    <div class="form-row"><label>Person</label>
      <select id="vf-person">${persons.map(p => `<option value="${p.id}" ${p.id === v.personId ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
    </div>
    <div class="form-row form-row-2">
      <div><label>Von *</label><input type="date" id="vf-from" value="${esc(v.from)}"></div>
      <div><label>Bis *</label><input type="date" id="vf-to" value="${esc(v.to)}"></div>
    </div>
    <div class="form-row"><label>Status</label>
      <div class="seg" id="vf-status">
        <button class="seg-btn ${v.status === 'geplant' ? 'active' : ''}" data-v="geplant" style="--c:#eda100">⏳ geplant</button>
        <button class="seg-btn ${v.status === 'genehmigt' ? 'active' : ''}" data-v="genehmigt" style="--c:#008300">✓ genehmigt</button>
      </div>
    </div>
    <div class="form-row"><label>Notiz</label><input type="text" id="vf-note" value="${esc(v.note || '')}" placeholder="z. B. Sommerurlaub (optional)"></div>
    <p class="muted" id="vf-info"></p>
    <div class="btn-row">
      <button class="btn btn-primary" id="vf-save">Speichern</button>
      <button class="btn" id="vf-cancel">Abbrechen</button>
    </div>`);

  const body = document.getElementById('modal-body');
  let status = v.status;
  body.querySelectorAll('#vf-status .seg-btn').forEach(b => b.onclick = () => {
    status = b.dataset.v;
    body.querySelectorAll('#vf-status .seg-btn').forEach(x => x.classList.toggle('active', x === b));
  });

  const info = body.querySelector('#vf-info');
  const updateInfo = () => {
    const from = body.querySelector('#vf-from').value, to = body.querySelector('#vf-to').value;
    if (from && to && from <= to) {
      info.textContent = `Das sind ${countVacationWorkdays(from, to)} Arbeitstage (Mo–Fr ohne Feiertage).`;
    } else info.textContent = '';
  };
  body.querySelector('#vf-from').onchange = updateInfo;
  body.querySelector('#vf-to').onchange = updateInfo;
  updateInfo();

  body.querySelector('#vf-cancel').onclick = closeModal;
  body.querySelector('#vf-save').onclick = () => {
    const from = body.querySelector('#vf-from').value;
    const to = body.querySelector('#vf-to').value;
    if (!from || !to) { toast('Bitte Von- und Bis-Datum wählen', 'error'); return; }
    if (from > to) { toast('»Von« muss vor »Bis« liegen', 'error'); return; }
    const data = {
      personId: body.querySelector('#vf-person').value,
      from, to, status,
      note: body.querySelector('#vf-note').value.trim(),
    };
    if (vac) Object.assign(vac, data);
    else state.vacations.push({ id: uid(), ...data });
    saveState();
    closeModal();
    toast('Urlaub gespeichert ✓', 'success');
    if (currentPage === 'urlaub') renderVacationPage(document.getElementById('page-wrap'));
  };
}
