'use strict';

const Vocab = {
  STORE_KEY: 'diana_vocab_v1',
  PROGRESS_KEY: 'diana_progress_v1',

  _data: [],

  init() {
    this._load();
    this._updateBadge();
  },

  _load() {
    try {
      this._data = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
    } catch { this._data = []; }
  },

  _save() {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(this._data));
    this._updateBadge();
  },

  _updateBadge() {
    const el = document.getElementById('vocab-badge');
    if (el) el.textContent = this._data.length;
  },

  getCount() { return this._data.length; },

  getAll() { return [...this._data]; },

  add(word, translation, example = '', level = 'B1', article = '') {
    if (!word.trim() || !translation.trim()) return false;
    const exists = this._data.find(v => v.word.toLowerCase() === word.toLowerCase());
    if (exists) return 'exists';
    this._data.unshift({
      id: Date.now() + Math.random(),
      word: word.trim(),
      article: article.trim(),
      translation: translation.trim(),
      example: example.trim(),
      level,
      learned: false,
      added: new Date().toLocaleDateString('de-DE'),
    });
    this._save();
    return true;
  },

  delete(id) {
    this._data = this._data.filter(v => v.id !== id);
    this._save();
  },

  toggleLearned(id) {
    const v = this._data.find(v => v.id === id);
    if (v) { v.learned = !v.learned; this._save(); }
  },

  search(q) {
    const lq = q.toLowerCase();
    return this._data.filter(v =>
      v.word.toLowerCase().includes(lq) ||
      v.translation.toLowerCase().includes(lq) ||
      v.example.toLowerCase().includes(lq)
    );
  },

  filterByLevel(level) {
    if (!level || level === 'all') return this._data;
    return this._data.filter(v => v.level === level);
  },

  getLearnedCount() { return this._data.filter(v => v.learned).length; },

  // Save exercise progress
  saveProgress(unitId, skill, exIdx) {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(this.PROGRESS_KEY)) || {}; } catch {}
    if (!p[unitId]) p[unitId] = {};
    if (!p[unitId][skill]) p[unitId][skill] = [];
    if (!p[unitId][skill].includes(exIdx)) p[unitId][skill].push(exIdx);
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(p));
  },

  getProgress(unitId, skill) {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(this.PROGRESS_KEY)) || {}; } catch {}
    return (p[unitId] && p[unitId][skill]) ? p[unitId][skill] : [];
  },

  getLevelProgress(levelId) {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(this.PROGRESS_KEY)) || {}; } catch {}
    const data = LESSONS_DATA[levelId];
    if (!data) return 0;
    let total = 0, done = 0;
    data.units.forEach(unit => {
      Object.entries(unit.skills).forEach(([skill, s]) => {
        s.exercises.forEach((_, i) => {
          total++;
          if (p[unit.id] && p[unit.id][skill] && p[unit.id][skill].includes(i)) done++;
        });
      });
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },

  getGlobalStats() {
    let completed = 0;
    try {
      const p = JSON.parse(localStorage.getItem(this.PROGRESS_KEY)) || {};
      Object.values(p).forEach(unit =>
        Object.values(unit).forEach(arr => { completed += arr.length; })
      );
    } catch {}
    return { completed, vocab: this._data.length };
  },
};
