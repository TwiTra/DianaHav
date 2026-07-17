/* ============================================================
   Arbeitsplaner – Export & Druck
   PNG, PDF (eigener Mini-Writer), Word, Excel, CSV und
   A4-Druck – ohne externe Bibliotheken. Alle Exporte folgen
   dem gewählten Plan-Design.
   ============================================================ */

/* ---------- Plan-Designs ---------- */

const PLAN_DESIGNS = [
  { id: 'klassisch', label: 'Klassisch – Monat kompakt' },
  { id: 'wochen',    label: 'Wochen-Design (Vorlage)' },
  { id: 'excel',     label: 'Excel-Tabelle – Wochenblöcke' },
];

function currentPlanDesign() {
  const d = state.settings.planDesign;
  return PLAN_DESIGNS.some(x => x.id === d) ? d : 'klassisch';
}

/* Breite und Papier-Ausrichtung je Design */
function designExportSpec() {
  switch (currentPlanDesign()) {
    case 'wochen': return { width: 1360, orient: 'landscape' };
    case 'excel':  return { width: 1150, orient: 'landscape' };
    default:       return { width: 1140, orient: 'landscape' };
  }
}

/* ---------- Monats-/Wochen-Helfer ---------- */

function monthMeta(year, month) {
  const days = [];
  const n = daysInMonth(year, month);
  for (let d = 1; d <= n; d++) {
    const date = new Date(year, month, d);
    const iso = fmtISO(date);
    days.push({
      day: d,
      iso,
      wd: weekdayMon0(date),                 // Mo=0 … So=6
      wdShort: WEEKDAYS_SHORT[weekdayMon0(date)],
      holiday: holidayName(iso),
      weekend: weekdayMon0(date) >= 5,
    });
  }
  return days;
}

/* ISO-Kalenderwoche */
function isoWeekNo(date) {
  const t = new Date(date);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const w1 = new Date(t.getFullYear(), 0, 4);
  return 1 + Math.round(((t - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
}

/* Alle Wochen (Mo–So), die den Monat berühren – immer volle Wochen,
   damit sich stets ein kompletter Monat ergibt */
function monthWeeks(year, month) {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let d = addDays(first, -weekdayMon0(first));
  const weeks = [];
  while (d <= lastDay) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dd = addDays(d, i);
      const iso = fmtISO(dd);
      days.push({
        date: dd, iso,
        day: dd.getDate(),
        wd: i,
        inMonth: dd.getMonth() === month,
        holiday: holidayName(iso),
      });
    }
    weeks.push({ kw: isoWeekNo(d), days });
    d = addDays(d, 7);
  }
  return weeks;
}

/* Immer 6 Wochen (voller Monat + Woche 5 und 6) – für das Excel-Design */
function monthWeeks6(year, month) {
  const weeks = monthWeeks(year, month);
  while (weeks.length < 6) {
    const last = weeks[weeks.length - 1].days[6].date;
    const start = addDays(last, 1);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dd = addDays(start, i);
      const iso = fmtISO(dd);
      days.push({ date: dd, iso, day: dd.getDate(), wd: i, inMonth: dd.getMonth() === month, holiday: holidayName(iso) });
    }
    weeks.push({ kw: isoWeekNo(start), days });
  }
  return weeks;
}

function planTitle(year, month) {
  const firma = state.settings.firma ? state.settings.firma + ' – ' : '';
  return firma + 'Arbeitsplan ' + MONTHS[month] + ' ' + year;
}

/* „01.06" ohne Endpunkt – wie in der Excel-Vorlage */
function fmtDDMMs(date) {
  return String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0');
}

/* Text einer Zelle wie in der Excel-Vorlage: Zeiten oder Name */
function excelCellText(shift) {
  return shift.start ? shiftPillLabel(shift) : shift.label;
}

function fmtDDMM(date) {
  return String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.';
}

function hexToRgba(hex, a) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16), g = parseInt(v.slice(2, 4), 16), b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* Etwas dunklere Variante einer Farbe für gut lesbaren Text */
function darken(hex, f) {
  const v = hex.replace('#', '');
  const c = i => Math.round(parseInt(v.slice(i, i + 2), 16) * f);
  return `rgb(${c(0)},${c(2)},${c(4)})`;
}

/* Kurzform einer Uhrzeit: „06:00" → „06", „15:30" bleibt */
function shortTime(t) {
  return t.endsWith(':00') ? t.slice(0, 2) : t;
}

/* Beschriftung einer Schicht-Pille: Zeiten oder Name */
function shiftPillLabel(s) {
  return s.start ? shortTime(s.start) + '–' + shortTime(s.end) : s.label;
}

/* Arbeitsstunden einer Person in einem Monat */
function monthWorkHours(personId, year, month) {
  let h = 0;
  for (const d of monthMeta(year, month)) {
    const s = shiftById(getShift(d.iso, personId));
    if (s && s.kind === 'arbeit') h += shiftHours(s);
  }
  return h;
}

function dateiName(year, month) {
  return 'Arbeitsplan_' + year + '-' + String(month + 1).padStart(2, '0');
}

/* ============================================================
   EXPORT-HTML JE DESIGN (inline gestylt – Basis für Word,
   Excel, Druck sowie PNG/PDF über SVG-foreignObject)
   ============================================================ */

function buildPlanExportHTML(year, month) {
  switch (currentPlanDesign()) {
    case 'wochen': return buildWochenExportHTML(year, month);
    case 'excel':  return buildExcelExportHTML(year, month);
    default:       return buildClassicExportHTML(year, month);
  }
}

function buildLegendInlineHTML(fontFamily) {
  let html = `<p style="font-family:${fontFamily};font-size:8pt;margin:8px 0 0"><b>Legende:</b> `;
  html += state.shiftTypes.map(s => {
    const times = s.start ? ` (${s.start}–${s.end})` : '';
    return `<span style="background:${hexToRgba(s.color, 0.25)};padding:1px 5px;border:1px solid ${s.color}">${esc(s.code)}</span> = ${esc(s.label)}${times}`;
  }).join(' &#160; ');
  html += '</p>';
  return html;
}

/* ---------- Design „Klassisch": Monat kompakt ---------- */

function buildClassicExportHTML(year, month) {
  return `<h2 style="font-family:Arial,sans-serif;margin:0 0 8px">${esc(planTitle(year, month))}</h2>` +
    buildPlanTableHTML(year, month);
}

function buildPlanTableHTML(year, month) {
  const days = monthMeta(year, month);
  const persons = activePersons();

  let html = '<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:9pt;width:100%">';
  html += '<tr style="background:#f0efec"><th style="text-align:left;padding:4px 6px">Mitarbeiter</th>';
  for (const d of days) {
    const bg = d.holiday ? '#fbdedd' : (d.weekend ? '#e1e0d9' : '#f0efec');
    html += `<th style="background:${bg};padding:2px" title="${esc(d.holiday || '')}">${d.day}<br/><span style="font-weight:400;font-size:7pt">${d.wdShort}</span></th>`;
  }
  html += '</tr>';

  for (const p of persons) {
    html += `<tr><td style="white-space:nowrap;padding:2px 6px;font-weight:600">${esc(p.name)}</td>`;
    for (const d of days) {
      const shift = shiftById(getShift(d.iso, p.id));
      const wkBg = d.holiday ? '#fdf0ef' : (d.weekend ? '#f0efec' : '#ffffff');
      if (shift) {
        html += `<td style="background:${hexToRgba(shift.color, 0.2)};color:${darken(shift.color, 0.7)};text-align:center;font-weight:700">${esc(shift.code)}</td>`;
      } else {
        html += `<td style="background:${wkBg}">&#160;</td>`;
      }
    }
    html += '</tr>';
  }

  // Besetzung
  html += '<tr style="background:#f0efec"><td style="padding:2px 6px;font-weight:600">Besetzung</td>';
  for (const d of days) {
    const count = persons.filter(p => {
      const s = shiftById(getShift(d.iso, p.id));
      return s && s.kind === 'arbeit';
    }).length;
    html += `<td style="text-align:center">${count}</td>`;
  }
  html += '</tr></table>';
  html += buildLegendInlineHTML('Arial,sans-serif');
  return html;
}

/* ---------- Design „Wochen" (nach der hochgeladenen Vorlage):
   dunkles Kopfband, KW-Spaltengruppen, farbige Zeit-Pillen ---------- */

function buildWochenExportHTML(year, month) {
  const weeks = monthWeeks(year, month);
  const persons = activePersons();
  const F = 'Arial,Helvetica,sans-serif';

  let h = `<div style="font-family:${F};color:#1c2733">`;

  // Kopfband
  h += `<table style="border-collapse:collapse;width:100%"><tr>` +
    `<td style="background:#233447;color:#fff;padding:14px 20px">` +
    `<span style="font-size:9pt;letter-spacing:3px;color:#9fb4c9;font-weight:700">ARBEITSPLAN</span>` +
    `<div style="font-size:19pt;font-weight:800;margin-top:2px">${esc(MONTHS[month] + ' ' + year)}</div></td>` +
    `<td style="background:#233447;color:#c9d6e2;padding:14px 20px;text-align:right;font-size:9pt;vertical-align:bottom">` +
    (state.settings.firma ? `Standort / Team: <b style="color:#fff">${esc(state.settings.firma)}</b><br/>` : '') +
    `Erstellt am ${fmtDateDE(fmtISO(new Date()))}</td></tr></table>`;

  // Tabelle
  h += `<table style="border-collapse:collapse;width:100%;table-layout:fixed;font-size:8pt;margin-top:8px">`;
  // Spaltenbreiten: Name 120, Tage flexibel, Summe 46
  h += '<colgroup><col style="width:118px"/>' +
    weeks.map(w => w.days.filter(d => d.wd < 6).map(() => '<col/>').join('')).join('') +
    '<col style="width:46px"/></colgroup>';

  // KW-Zeile
  h += `<tr><th style="background:#233447;color:#fff;padding:5px 8px;text-align:left;font-size:7.5pt;letter-spacing:1px;border:1px solid #233447">MITARBEITER</th>`;
  for (const w of weeks) {
    h += `<th colspan="6" style="background:#2e4258;color:#fff;padding:4px;border:1px solid #fff;font-size:8pt">KW ${w.kw}</th>`;
  }
  h += `<th style="background:#233447;color:#fff;padding:4px 2px;border:1px solid #233447;font-size:7pt">Σ Std.</th></tr>`;

  // Tages-Zeile
  h += `<tr><th style="background:#eef1f5;border:1px solid #d8dde4">&#160;</th>`;
  for (const w of weeks) {
    w.days.filter(d => d.wd < 6).forEach((d, i) => {
      const bg = d.holiday ? '#fde7e4' : (d.wd === 5 ? '#f6ecdc' : '#eef1f5');
      const sep = i === 0 ? 'border-left:2px solid #9aa6b4;' : '';
      h += `<th style="background:${bg};border:1px solid #d8dde4;${sep}padding:3px 0;font-size:6.5pt;color:#41566b;${d.inMonth ? '' : 'opacity:.45'}">` +
        `<b>${WEEKDAYS_SHORT[d.wd]}</b><br/><span style="color:#7a8a99;font-weight:400">${fmtDDMM(d.date)}</span></th>`;
    });
  }
  h += `<th style="background:#eef1f5;border:1px solid #d8dde4">&#160;</th></tr>`;

  // Personenzeilen
  for (const p of persons) {
    const initials = p.name.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
    h += `<tr><td style="border:1px solid #d8dde4;padding:4px 6px;white-space:nowrap;overflow:hidden">` +
      `<span style="display:inline-block;width:20px;height:20px;line-height:20px;border-radius:50%;background:#233447;color:#fff;font-size:6.5pt;font-weight:700;text-align:center;vertical-align:middle">${esc(initials)}</span> ` +
      `<b style="font-size:8pt">${esc(p.name)}</b></td>`;
    for (const w of weeks) {
      w.days.filter(d => d.wd < 6).forEach((d, i) => {
        const sep = i === 0 ? 'border-left:2px solid #9aa6b4;' : '';
        if (!d.inMonth) {
          h += `<td style="border:1px solid #d8dde4;${sep}background:#f4f6f8">&#160;</td>`;
          return;
        }
        const bg = d.holiday ? 'background:rgba(192,57,43,.05);' : (d.wd === 5 ? 'background:#fcf8f1;' : '');
        const s = shiftById(getShift(d.iso, p.id));
        if (s) {
          h += `<td style="border:1px solid #d8dde4;${sep}${bg}padding:2px 0;text-align:center">` +
            `<div style="background:${hexToRgba(s.color, 0.3)};border-radius:5px;padding:4px 0;font-weight:700;font-size:6.2pt;letter-spacing:-.03em;color:#1f2937;overflow:hidden;white-space:nowrap">${esc(shiftPillLabel(s))}</div></td>`;
        } else {
          h += `<td style="border:1px solid #d8dde4;${sep}${bg}text-align:center;color:#c7cdd4">·</td>`;
        }
      });
    }
    const hours = monthWorkHours(p.id, year, month);
    h += `<td style="border:1px solid #d8dde4;text-align:center;font-weight:700;background:#f7f9fb;color:#41566b">${hours ? hours.toFixed(1).replace('.', ',') : '–'}</td></tr>`;
  }
  h += '</table>';

  // Legende als Chips
  h += `<div style="margin-top:9px;font-size:8pt">` +
    state.shiftTypes.map(s => {
      const times = s.start ? ` (${s.start}–${s.end})` : '';
      return `<span style="display:inline-block;border:1px solid #d8dde4;border-radius:20px;padding:2px 8px 2px 4px;margin:0 5px 4px 0;background:#fbfcfd">` +
        `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${hexToRgba(s.color, 0.6)};border:1px solid ${s.color};vertical-align:middle"></span> ` +
        (s.start ? `<b>${esc(shiftPillLabel(s))}</b> ${esc(s.label)}` : `<b>${esc(s.label)}</b>`) + `</span>`;
    }).join('') + '</div>';

  h += '</div>';
  return h;
}

/* ---------- Design „Excel-Tabelle": exakte Kopie der
   hochgeladenen Arbeitsplan.xlsx – zwei Wochenblöcke nebeneinander,
   drei Blockzeilen = 6 Wochen (Woche 5 und 6 ergänzt) ---------- */

function buildExcelExportHTML(year, month) {
  const weeks = monthWeeks6(year, month);
  const persons = activePersons();
  const F = 'Calibri,Arial,sans-serif';
  const left = weeks.slice(0, 3), right = weeks.slice(3, 6);
  const B = 'border:1px solid #a0aec0;';

  const dayHead = (d) => {
    const bg = d.holiday ? '#c53030' : (d.wd === 5 ? '#ffedd5' : '#edf2f7');
    const ink = d.holiday ? '#ffffff' : '#2d3748';
    return `<td style="${B}background:${bg};color:${ink};font-weight:700;font-size:7.5pt;text-align:center;padding:3px 1px${d.inMonth ? '' : ';opacity:.55'}" title="${esc(d.holiday || '')}">${WEEKDAYS_SHORT[d.wd]} ${fmtDDMMs(d.date)}</td>`;
  };
  const valCell = (d, p) => {
    const s = shiftById(getShift(d.iso, p.id));
    const satBg = d.wd === 5 ? '#fff7ed' : '#ffffff';
    if (s) {
      const ft = s.id === 'FT';
      const bg = ft ? '#fed7d7' : satBg;
      const ink = ft ? '#742a2a' : '#111111';
      return `<td style="${B}background:${bg};color:${ink};font-weight:700;font-size:8.5pt;text-align:center;padding:6px 1px">${esc(excelCellText(s))}</td>`;
    }
    if (d.holiday) {
      return `<td style="${B}background:#fed7d7;color:#742a2a;font-weight:700;font-size:8.5pt;text-align:center;padding:6px 1px">Feiertag</td>`;
    }
    return `<td style="${B}background:${satBg}">&#160;</td>`;
  };

  let h = `<div style="font-family:${F};color:#111">`;
  h += `<table style="border-collapse:collapse;width:100%;table-layout:fixed">`;
  h += `<colgroup><col style="width:128px"/>${'<col/>'.repeat(6)}<col style="width:10px"/>${'<col/>'.repeat(6)}</colgroup>`;

  // Titelzeile (wie A1: dunkelblau, weiß, groß)
  h += `<tr><td colspan="14" style="background:#1f3a5f;color:#fff;font-size:15pt;font-weight:700;padding:9px 14px">${esc(planTitle(year, month))}</td></tr>`;

  // KW-Zeile (wie B2/I2)
  const kwLabel = ws => ws.map(w => 'KW ' + w.kw).join('  /  ');
  h += `<tr><td style="border:none"></td>` +
    `<td colspan="6" style="${B}background:#4a5568;color:#fff;font-weight:700;font-size:8.5pt;text-align:center;padding:4px">${kwLabel(left)}</td>` +
    `<td style="border:none"></td>` +
    `<td colspan="6" style="${B}background:#4a5568;color:#fff;font-weight:700;font-size:8.5pt;text-align:center;padding:4px">${kwLabel(right)}</td></tr>`;

  // Personenblöcke: 3 Paar-Zeilen (Datumskopf + Schichten) je Person
  for (const p of persons) {
    for (let i = 0; i < 3; i++) {
      h += '<tr>';
      if (i === 0) {
        h += `<td rowspan="6" style="${B}background:#2c5282;color:#fff;font-weight:700;font-size:9.5pt;padding:4px 8px;vertical-align:middle">${esc(p.name)}</td>`;
      }
      h += left[i].days.filter(d => d.wd < 6).map(dayHead).join('');
      h += '<td style="border:none"></td>';
      h += right[i].days.filter(d => d.wd < 6).map(dayHead).join('');
      h += '</tr><tr>';
      h += left[i].days.filter(d => d.wd < 6).map(d => valCell(d, p)).join('');
      h += '<td style="border:none"></td>';
      h += right[i].days.filter(d => d.wd < 6).map(d => valCell(d, p)).join('');
      h += '</tr>';
    }
    // schmale Trennzeile zwischen Personen (wie Zeile 7 der Vorlage)
    h += '<tr><td colspan="14" style="border:none;height:6px"></td></tr>';
  }

  h += '</table>';
  h += buildLegendInlineHTML(F);
  h += '</div>';
  return h;
}

/* ============================================================
   HTML → CANVAS (SVG-foreignObject, ohne Bibliotheken)
   ============================================================ */

async function htmlToCanvas(html, width) {
  // Wrapper mit fester Breite; nur Inline-Stile zählen im SVG
  const holder = document.createElement('div');
  holder.style.cssText = `position:fixed;left:-12000px;top:0;width:${width}px;background:#fff;z-index:-1`;
  const wrap = document.createElement('div');
  wrap.setAttribute('style', `width:${width}px;background:#ffffff;padding:22px;box-sizing:border-box;line-height:1.4;color:#111;font-family:Arial,Helvetica,sans-serif`);
  wrap.innerHTML = html;
  holder.appendChild(wrap);
  document.body.appendChild(holder);
  const height = Math.ceil(holder.getBoundingClientRect().height) + 30;
  const xhtml = new XMLSerializer().serializeToString(wrap);
  holder.remove();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${xhtml}</div></foreignObject></svg>`;

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Design konnte nicht gerendert werden'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });

  const SCALE = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(SCALE, SCALE);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function renderPlanCanvas(year, month) {
  const { width } = designExportSpec();
  return htmlToCanvas(buildPlanExportHTML(year, month), width);
}

/* ============================================================
   PNG
   ============================================================ */

async function exportPlanPNG(year, month) {
  try {
    const canvas = await renderPlanCanvas(year, month);
    canvas.toBlob(blob => {
      downloadBlob(blob, dateiName(year, month) + '.png');
      toast('PNG exportiert ✓', 'success');
    }, 'image/png');
  } catch (e) {
    toast('PNG-Export fehlgeschlagen: ' + e.message, 'error');
  }
}

/* ============================================================
   PDF – minimaler PDF-Writer, bettet das Canvas als JPEG ein
   (A4; Ausrichtung folgt dem Design)
   ============================================================ */

async function exportPlanPDF(year, month) {
  let canvas;
  try {
    canvas = await renderPlanCanvas(year, month);
  } catch (e) {
    toast('PDF-Export fehlgeschlagen: ' + e.message, 'error');
    return;
  }
  const { orient } = designExportSpec();
  const jpegData = canvas.toDataURL('image/jpeg', 0.92);
  const jpegBytes = base64ToBytes(jpegData.split(',')[1]);

  const pageW = orient === 'portrait' ? 595 : 842;
  const pageH = orient === 'portrait' ? 842 : 595;
  const margin = 24;
  const imgW = canvas.width, imgH = canvas.height;
  const scale = Math.min((pageW - 2 * margin) / imgW, (pageH - 2 * margin) / imgH);
  const w = imgW * scale, h = imgH * scale;
  const x = (pageW - w) / 2, y = pageH - margin - h; // oben ausrichten

  const enc = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let pos = 0;
  const push = (data) => {
    const bytes = typeof data === 'string' ? enc.encode(data) : data;
    chunks.push(bytes);
    pos += bytes.length;
  };
  const obj = (str) => { offsets.push(pos); push(str); };

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  obj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  obj(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      `/Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  offsets.push(pos);
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} ` +
       `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  push(jpegBytes);
  push('\nendstream\nendobj\n');
  const content = `q\n${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im1 Do\nQ\n`;
  obj(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

  const xrefPos = pos;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (const off of offsets) xref += String(off).padStart(10, '0') + ' 00000 n \n';
  push(xref);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

  const blob = new Blob(chunks, { type: 'application/pdf' });
  downloadBlob(blob, dateiName(year, month) + '.pdf');
  toast('PDF exportiert ✓', 'success');
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* ============================================================
   WORD (.doc)
   ============================================================ */

function exportPlanWord(year, month) {
  const { orient } = designExportSpec();
  const pageSize = orient === 'portrait' ? '21cm 29.7cm' : '29.7cm 21cm';
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${esc(planTitle(year, month))}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page { size: ${pageSize}; margin: 1cm; mso-page-orientation: ${orient}; }</style>
</head><body>
${buildPlanExportHTML(year, month)}
</body></html>`;
  const blob = new Blob(['﻿' + html], { type: 'application/msword' });
  downloadBlob(blob, dateiName(year, month) + '.doc');
  toast('Word-Datei exportiert ✓', 'success');
}

/* ============================================================
   EXCEL (.xls) + CSV
   ============================================================ */

function exportPlanExcel(year, month) {
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>${esc(MONTHS[month] + ' ' + year)}</x:Name>
<x:WorksheetOptions><x:Print><x:ValidPrinterInfo/></x:Print></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head><body>
${buildPlanExportHTML(year, month)}
</body></html>`;
  const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, dateiName(year, month) + '.xls');
  toast('Excel-Datei exportiert ✓', 'success');
}

function exportPlanCSV(year, month) {
  const days = monthMeta(year, month);
  const persons = activePersons();
  const rows = [];
  rows.push(['Mitarbeiter', ...days.map(d => d.day + ' ' + d.wdShort)]);
  for (const p of persons) {
    rows.push([p.name, ...days.map(d => {
      const s = shiftById(getShift(d.iso, p.id));
      return s ? s.code : '';
    })]);
  }
  const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, dateiName(year, month) + '.csv');
  toast('CSV exportiert ✓', 'success');
}

/* ============================================================
   DRUCKEN (A4; Ausrichtung folgt dem Design)
   ============================================================ */

function printPlan(year, month) {
  const { orient } = designExportSpec();
  const area = document.getElementById('print-area');
  area.innerHTML =
    `<style>@page{size:A4 ${orient};margin:10mm}</style>` +
    buildPlanExportHTML(year, month) +
    `<p style="font-family:Arial,sans-serif;font-size:7pt;color:#666;margin-top:6px">Erstellt am ${fmtDateDE(fmtISO(new Date()))} mit Arbeitsplaner</p>`;
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing');
    area.innerHTML = '';
  }, 500);
}
