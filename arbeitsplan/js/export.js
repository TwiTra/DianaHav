/* ============================================================
   Arbeitsplaner – Export & Druck
   PNG (Canvas), PDF (eigener Mini-Writer), Word, Excel, CSV,
   Drucken auf A4 quer – alles ohne externe Bibliotheken.
   ============================================================ */

/* Metadaten eines Monats: alle Tage mit Wochentag + Feiertag */
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

function planTitle(year, month) {
  const firma = state.settings.firma ? state.settings.firma + ' – ' : '';
  return firma + 'Arbeitsplan ' + MONTHS[month] + ' ' + year;
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

/* ============================================================
   CANVAS-RENDERER (Basis für PNG und PDF)
   ============================================================ */

function renderPlanCanvas(year, month) {
  const days = monthMeta(year, month);
  const persons = activePersons();
  const shifts = state.shiftTypes;

  const SCALE = 2;                       // für scharfe Ausgabe
  const W = 1122;                        // A4 quer bei 96 dpi ≈ 1122×793
  const M = 28;                          // Rand
  const nameW = 150;
  const titleH = 46;
  const headH = 40;
  const rowH = Math.max(26, Math.min(40, Math.floor(560 / Math.max(1, persons.length + 1))));
  const legendRowH = 22;
  const legendCols = 3;
  const legendRows = Math.ceil(shifts.length / legendCols);
  const legendH = legendRows * legendRowH + 26;
  const tableH = headH + persons.length * rowH + rowH; // + Besetzungszeile
  const H = M + titleH + tableH + 16 + legendH + M;

  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  const font = '"Inter", "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Titel
  ctx.fillStyle = '#0b0b0b';
  ctx.font = '700 21px ' + font;
  ctx.textBaseline = 'middle';
  ctx.fillText(planTitle(year, month), M, M + 14);
  ctx.font = '400 11px ' + font;
  ctx.fillStyle = '#52514e';
  ctx.fillText('Erstellt am ' + fmtDateDE(fmtISO(new Date())), M, M + 34);

  const tX = M, tY = M + titleH;
  const dayW = (W - 2 * M - nameW) / days.length;

  // Kopfzeile
  ctx.fillStyle = '#f0efec';
  ctx.fillRect(tX, tY, W - 2 * M, headH);
  days.forEach((d, i) => {
    const x = tX + nameW + i * dayW;
    if (d.weekend || d.holiday) {
      ctx.fillStyle = d.holiday ? hexToRgba('#e34948', 0.13) : '#e1e0d9';
      ctx.fillRect(x, tY, dayW, headH + (persons.length + 1) * rowH);
    }
    ctx.fillStyle = '#0b0b0b';
    ctx.font = '600 11px ' + font;
    ctx.textAlign = 'center';
    ctx.fillText(String(d.day), x + dayW / 2, tY + 13);
    ctx.fillStyle = '#52514e';
    ctx.font = '400 9px ' + font;
    ctx.fillText(d.wdShort, x + dayW / 2, tY + 28);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0b0b0b';
  ctx.font = '600 11px ' + font;
  ctx.fillText('Mitarbeiter', tX + 8, tY + headH / 2);

  // Personenzeilen
  persons.forEach((p, r) => {
    const y = tY + headH + r * rowH;
    if (r % 2 === 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.025)';
      ctx.fillRect(tX, y, nameW, rowH);
    }
    // Farbpunkt + Name
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(tX + 12, y + rowH / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b0b0b';
    ctx.font = '500 11px ' + font;
    let name = p.name;
    while (ctx.measureText(name).width > nameW - 30 && name.length > 3) name = name.slice(0, -2) + '…';
    ctx.fillText(name, tX + 22, y + rowH / 2);

    days.forEach((d, i) => {
      const x = tX + nameW + i * dayW;
      const sid = getShift(d.iso, p.id);
      const shift = sid ? shiftById(sid) : null;
      if (shift) {
        ctx.fillStyle = hexToRgba(shift.color, 0.22);
        ctx.fillRect(x + 1, y + 2, dayW - 2, rowH - 4);
        ctx.fillStyle = darken(shift.color, 0.75);
        ctx.font = '700 10px ' + font;
        ctx.textAlign = 'center';
        ctx.fillText(shift.code, x + dayW / 2, y + rowH / 2);
        ctx.textAlign = 'left';
      } else if (vacationOn(d.iso, p.id)) {
        // Urlaub aus dem Urlaubsplan, noch nicht im Plan eingetragen
        ctx.fillStyle = hexToRgba('#008300', 0.10);
        ctx.fillRect(x + 1, y + 2, dayW - 2, rowH - 4);
        ctx.fillStyle = '#008300';
        ctx.font = '400 9px ' + font;
        ctx.textAlign = 'center';
        ctx.fillText('u', x + dayW / 2, y + rowH / 2);
        ctx.textAlign = 'left';
      }
    });
  });

  // Besetzungszeile (Anzahl arbeitender Personen pro Tag)
  const by = tY + headH + persons.length * rowH;
  ctx.fillStyle = '#f0efec';
  ctx.fillRect(tX, by, W - 2 * M, rowH);
  ctx.fillStyle = '#52514e';
  ctx.font = '600 10px ' + font;
  ctx.fillText('Besetzung', tX + 8, by + rowH / 2);
  days.forEach((d, i) => {
    const x = tX + nameW + i * dayW;
    const count = persons.filter(p => {
      const s = shiftById(getShift(d.iso, p.id));
      return s && s.kind === 'arbeit';
    }).length;
    ctx.fillStyle = count === 0 ? '#898781' : '#0b0b0b';
    ctx.font = '600 10px ' + font;
    ctx.textAlign = 'center';
    ctx.fillText(String(count), x + dayW / 2, by + rowH / 2);
    ctx.textAlign = 'left';
  });

  // Gitterlinien
  ctx.strokeStyle = '#c9c8c1';
  ctx.lineWidth = 0.75;
  const gridBottom = tY + tableH;
  for (let r = 0; r <= persons.length + 2; r++) {
    const y = tY + (r === 0 ? 0 : headH + (r - 1) * rowH);
    ctx.beginPath(); ctx.moveTo(tX, y); ctx.lineTo(W - M, y); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(tX, gridBottom); ctx.lineTo(W - M, gridBottom); ctx.stroke();
  for (let c = 0; c <= days.length; c++) {
    const x = tX + nameW + c * dayW;
    ctx.beginPath(); ctx.moveTo(x, tY); ctx.lineTo(x, gridBottom); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(tX, tY); ctx.lineTo(tX, gridBottom); ctx.stroke();

  // Legende
  let ly = gridBottom + 26;
  ctx.fillStyle = '#0b0b0b';
  ctx.font = '600 11px ' + font;
  ctx.fillText('Legende:', tX, ly - 4);
  const colW = (W - 2 * M - 70) / legendCols;
  shifts.forEach((s, i) => {
    const cx = tX + 70 + (i % legendCols) * colW;
    const cy = ly - 10 + Math.floor(i / legendCols) * legendRowH;
    ctx.fillStyle = hexToRgba(s.color, 0.25);
    ctx.fillRect(cx, cy, 16, 12);
    ctx.strokeStyle = s.color;
    ctx.strokeRect(cx, cy, 16, 12);
    ctx.fillStyle = '#0b0b0b';
    ctx.font = '400 10px ' + font;
    const times = s.start ? ` (${s.start}–${s.end})` : '';
    ctx.fillText(`${s.code} = ${s.label}${times}`, cx + 22, cy + 6);
  });

  return canvas;
}

/* ============================================================
   PNG
   ============================================================ */

function exportPlanPNG(year, month) {
  const canvas = renderPlanCanvas(year, month);
  canvas.toBlob(blob => {
    downloadBlob(blob, dateiName(year, month) + '.png');
    toast('PNG exportiert ✓', 'success');
  }, 'image/png');
}

/* ============================================================
   PDF – minimaler PDF-Writer, bettet das Canvas als JPEG ein
   (A4 quer, 842 × 595 pt)
   ============================================================ */

function exportPlanPDF(year, month) {
  const canvas = renderPlanCanvas(year, month);
  const jpegData = canvas.toDataURL('image/jpeg', 0.92);
  const jpegBytes = base64ToBytes(jpegData.split(',')[1]);

  const pageW = 842, pageH = 595, margin = 24;
  const imgW = canvas.width, imgH = canvas.height;
  const scale = Math.min((pageW - 2 * margin) / imgW, (pageH - 2 * margin) / imgH);
  const w = imgW * scale, h = imgH * scale;
  const x = (pageW - w) / 2, y = (pageH - h) / 2;

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
   HTML-TABELLE (Basis für Word, Excel und Druck)
   ============================================================ */

function buildPlanTableHTML(year, month) {
  const days = monthMeta(year, month);
  const persons = activePersons();

  let html = '<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:9pt;width:100%">';
  html += '<tr style="background:#f0efec"><th style="text-align:left;padding:4px 6px">Mitarbeiter</th>';
  for (const d of days) {
    const bg = d.holiday ? '#fbdedd' : (d.weekend ? '#e1e0d9' : '#f0efec');
    html += `<th style="background:${bg};padding:2px" title="${esc(d.holiday || '')}">${d.day}<br><span style="font-weight:400;font-size:7pt">${d.wdShort}</span></th>`;
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
        html += `<td style="background:${wkBg}">&nbsp;</td>`;
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

  // Legende
  html += '<p style="font-family:Arial,sans-serif;font-size:8pt;margin-top:8px"><b>Legende:</b> ';
  html += state.shiftTypes.map(s => {
    const times = s.start ? ` (${s.start}–${s.end})` : '';
    return `<span style="background:${hexToRgba(s.color, 0.25)};padding:1px 5px;border:1px solid ${s.color}">${esc(s.code)}</span> = ${esc(s.label)}${times}`;
  }).join(' &nbsp; ');
  html += '</p>';
  return html;
}

function dateiName(year, month) {
  return 'Arbeitsplan_' + year + '-' + String(month + 1).padStart(2, '0');
}

/* ============================================================
   WORD (.doc)
   ============================================================ */

function exportPlanWord(year, month) {
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${esc(planTitle(year, month))}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page { size: 29.7cm 21cm; margin: 1cm; mso-page-orientation: landscape; }</style>
</head><body>
<h2 style="font-family:Arial,sans-serif">${esc(planTitle(year, month))}</h2>
${buildPlanTableHTML(year, month)}
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
<b>${esc(planTitle(year, month))}</b>
${buildPlanTableHTML(year, month)}
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
   DRUCKEN (A4 quer)
   ============================================================ */

function printPlan(year, month) {
  const area = document.getElementById('print-area');
  area.innerHTML =
    `<h2 style="font-family:Arial,sans-serif;margin:0 0 8px">${esc(planTitle(year, month))}</h2>` +
    buildPlanTableHTML(year, month) +
    `<p style="font-family:Arial,sans-serif;font-size:7pt;color:#666;margin-top:6px">Erstellt am ${fmtDateDE(fmtISO(new Date()))} mit Arbeitsplaner</p>`;
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing');
    area.innerHTML = '';
  }, 500);
}
