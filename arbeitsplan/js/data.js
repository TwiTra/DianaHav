/* ============================================================
   Arbeitsplaner – Datenschicht
   Speicherung in localStorage, Datums-Helfer, Feiertage
   ============================================================ */

const STORAGE_KEY = 'arbeitsplaner-v1';

/* ---------- Standard-Schichtarten ----------
   kind: 'arbeit' | 'frei' | 'urlaub' | 'krank' | 'sonstig'   */
const DEFAULT_SHIFTS = [
  { id: 'F',    code: 'F',  label: 'Frühschicht',  start: '06:00', end: '14:00', breakMin: 30, color: '#2a78d6', kind: 'arbeit' },
  { id: 'S',    code: 'S',  label: 'Spätschicht',  start: '14:00', end: '22:00', breakMin: 30, color: '#eb6834', kind: 'arbeit' },
  { id: 'N',    code: 'N',  label: 'Nachtschicht', start: '22:00', end: '06:00', breakMin: 30, color: '#4a3aa7', kind: 'arbeit' },
  { id: 'T',    code: 'T',  label: 'Tagdienst',    start: '08:00', end: '16:30', breakMin: 30, color: '#1baf7a', kind: 'arbeit' },
  { id: 'FREI', code: 'X',  label: 'Frei',         start: '',      end: '',      breakMin: 0,  color: '#898781', kind: 'frei' },
  { id: 'U',    code: 'U',  label: 'Urlaub',       start: '',      end: '',      breakMin: 0,  color: '#008300', kind: 'urlaub' },
  { id: 'K',    code: 'K',  label: 'Krank',        start: '',      end: '',      breakMin: 0,  color: '#e34948', kind: 'krank' },
];

const PERSON_COLORS = ['#2a78d6','#008300','#e87ba4','#eda100','#1baf7a','#eb6834','#4a3aa7','#e34948'];

const DEFAULT_STATE = () => ({
  settings: {
    theme: 'light',
    firma: '',
    bundesland: 'NW',
  },
  persons: [],          // {id, name, color, hoursPerWeek, vacationDays, note, active}
  shiftTypes: JSON.parse(JSON.stringify(DEFAULT_SHIFTS)),
  schedule: {},         // { 'YYYY-MM-DD': { personId: shiftId } }
  dayNotes: {},         // { 'YYYY-MM-DD': 'text' }  (Notiz im Arbeitsplan)
  calendar: [],         // {id, date, type:'termin'|'aufgabe'|'notiz', title, time, endTime, desc, done}
  vacations: [],        // {id, personId, from, to, note, status:'geplant'|'genehmigt'}
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE();
    const parsed = JSON.parse(raw);
    // fehlende Felder aus Default ergänzen (für App-Updates)
    const def = DEFAULT_STATE();
    for (const k of Object.keys(def)) if (parsed[k] === undefined) parsed[k] = def[k];
    for (const k of Object.keys(def.settings)) if (parsed.settings[k] === undefined) parsed.settings[k] = def.settings[k];
    return parsed;
  } catch (e) {
    console.error('Konnte Daten nicht laden:', e);
    return DEFAULT_STATE();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (typeof toast === 'function') toast('Speichern fehlgeschlagen – Speicher voll?', 'error');
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- Zugriffs-Helfer ---------- */

function activePersons() {
  return state.persons.filter(p => p.active !== false);
}

function personById(id) {
  return state.persons.find(p => p.id === id) || null;
}

function shiftById(id) {
  return state.shiftTypes.find(s => s.id === id) || null;
}

function getShift(dateISO, personId) {
  const day = state.schedule[dateISO];
  return day ? (day[personId] || null) : null;
}

function setShift(dateISO, personId, shiftId) {
  if (!state.schedule[dateISO]) state.schedule[dateISO] = {};
  if (shiftId) state.schedule[dateISO][personId] = shiftId;
  else {
    delete state.schedule[dateISO][personId];
    if (Object.keys(state.schedule[dateISO]).length === 0) delete state.schedule[dateISO];
  }
  saveState();
}

/* Dauer einer Schicht in Stunden (abzüglich Pause) */
function shiftHours(shift) {
  if (!shift || !shift.start || !shift.end) return 0;
  const [sh, sm] = shift.start.split(':').map(Number);
  const [eh, em] = shift.end.split(':').map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60; // über Mitternacht
  mins -= (shift.breakMin || 0);
  return Math.max(0, mins) / 60;
}

/* ---------- Urlaub ---------- */

function vacationsOfPerson(personId, year) {
  return state.vacations.filter(v =>
    v.personId === personId &&
    (!year || v.from.slice(0, 4) == year || v.to.slice(0, 4) == year)
  );
}

/* Ist die Person an diesem Tag im (eingetragenen) Urlaub? */
function vacationOn(dateISO, personId) {
  return state.vacations.find(v => v.personId === personId && v.from <= dateISO && v.to >= dateISO) || null;
}

/* Anzahl Urlaubstage (Werktage Mo–Fr, ohne Feiertage) eines Zeitraums */
function countVacationWorkdays(from, to, bundesland) {
  let n = 0;
  let d = parseISO(from);
  const end = parseISO(to);
  while (d <= end) {
    const wd = d.getDay(); // 0=So
    if (wd !== 0 && wd !== 6 && !holidayName(fmtISO(d), bundesland)) n++;
    d = addDays(d, 1);
  }
  return n;
}

/* ---------- Datums-Helfer ---------- */

const WEEKDAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const WEEKDAYS_SHORT = ['Mo','Di','Mi','Do','Fr','Sa','So'];
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function fmtISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function daysInMonth(year, month) { // month 0-basiert
  return new Date(year, month + 1, 0).getDate();
}

/* Wochentag mit Montag=0 … Sonntag=6 */
function weekdayMon0(d) {
  return (d.getDay() + 6) % 7;
}

function fmtDateDE(dateISO) {
  const d = parseISO(dateISO);
  return String(d.getDate()).padStart(2,'0') + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + d.getFullYear();
}

/* ---------- Feiertage (Deutschland) ---------- */

const BUNDESLAENDER = {
  BW: 'Baden-Württemberg', BY: 'Bayern', BE: 'Berlin', BB: 'Brandenburg',
  HB: 'Bremen', HH: 'Hamburg', HE: 'Hessen', MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen', NW: 'Nordrhein-Westfalen', RP: 'Rheinland-Pfalz',
  SL: 'Saarland', SN: 'Sachsen', ST: 'Sachsen-Anhalt', SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};

/* Gauß'sche Osterformel – liefert Ostersonntag */
function easterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const holidayCache = {};

function holidaysOfYear(year, bundesland) {
  const key = year + '-' + bundesland;
  if (holidayCache[key]) return holidayCache[key];
  const easter = easterSunday(year);
  const H = {};
  const add = (d, name, laender) => {
    if (!laender || laender.includes(bundesland)) H[fmtISO(d)] = name;
  };
  add(new Date(year, 0, 1), 'Neujahr');
  add(new Date(year, 0, 6), 'Heilige Drei Könige', ['BW','BY','ST']);
  add(new Date(year, 2, 8), 'Internationaler Frauentag', ['BE','MV']);
  add(addDays(easter, -2), 'Karfreitag');
  add(addDays(easter, 1), 'Ostermontag');
  add(new Date(year, 4, 1), 'Tag der Arbeit');
  add(addDays(easter, 39), 'Christi Himmelfahrt');
  add(addDays(easter, 50), 'Pfingstmontag');
  add(addDays(easter, 60), 'Fronleichnam', ['BW','BY','HE','NW','RP','SL']);
  add(new Date(year, 7, 15), 'Mariä Himmelfahrt', ['SL']);
  add(new Date(year, 8, 20), 'Weltkindertag', ['TH']);
  add(new Date(year, 9, 3), 'Tag der Deutschen Einheit');
  add(new Date(year, 9, 31), 'Reformationstag', ['BB','HB','HH','MV','NI','SN','ST','SH','TH']);
  add(new Date(year, 10, 1), 'Allerheiligen', ['BW','BY','NW','RP','SL']);
  // Buß- und Bettag: Mittwoch vor dem 23. November
  const nov23 = new Date(year, 10, 23);
  const buss = addDays(nov23, -(((nov23.getDay() + 4) % 7) || 7));
  add(buss, 'Buß- und Bettag', ['SN']);
  add(new Date(year, 11, 25), '1. Weihnachtstag');
  add(new Date(year, 11, 26), '2. Weihnachtstag');
  holidayCache[key] = H;
  return H;
}

function holidayName(dateISO, bundesland) {
  const bl = bundesland || state.settings.bundesland;
  return holidaysOfYear(Number(dateISO.slice(0, 4)), bl)[dateISO] || null;
}

/* ---------- Datensicherung ---------- */

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'arbeitsplaner-sicherung-' + fmtISO(new Date()) + '.json');
}

function importBackup(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.persons || !data.shiftTypes) throw new Error('Ungültiges Format');
      state = data;
      const def = DEFAULT_STATE();
      for (const k of Object.keys(def)) if (state[k] === undefined) state[k] = def[k];
      saveState();
      done(true);
    } catch (e) {
      done(false, e.message);
    }
  };
  reader.readAsText(file);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* HTML-Escaping für Nutzereingaben */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
