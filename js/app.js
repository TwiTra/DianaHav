'use strict';

/* ============================================================
   DeutschLern App – Main Application Controller
   ============================================================ */

const App = {
  page: 'home',
  level: 'B1',
  unit: null,
  skill: 'schreiben',
  exIndex: 0,
  selectedMatch: null,
  wordOrder: [],

  init() {
    Vocab.init();
    this._bindNav();
    this._bindUI();
    this.navigate('home');
  },

  /* ---- Navigation ---- */
  _bindNav() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const pg = el.dataset.page;
        const lv = el.dataset.level;
        this.navigate(pg, lv ? { level: lv } : {});
      });
    });
  },

  _bindUI() {
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const html = document.documentElement;
      const isLight = html.dataset.theme === 'light';
      html.dataset.theme = isLight ? '' : 'light';
      document.getElementById('theme-toggle').textContent = isLight ? '☀️' : '🌙';
    });
    const menuBtn = document.getElementById('menu-btn');
    menuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      this._ensureOverlay();
    });
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target.id === 'modal') this.closeModal();
    });
  },

  _ensureOverlay() {
    let ov = document.getElementById('sidebar-ov');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'sidebar-ov';
      ov.className = 'sidebar-overlay';
      ov.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
        ov.classList.remove('visible');
      });
      document.body.appendChild(ov);
    }
    ov.classList.toggle('visible', document.getElementById('sidebar').classList.contains('open'));
  },

  navigate(page, opts = {}) {
    this.page = page;
    if (opts.level) this.level = opts.level;
    document.getElementById('sidebar').classList.remove('open');
    const ov = document.getElementById('sidebar-ov');
    if (ov) ov.classList.remove('visible');
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.remove('active');
      const match = el.dataset.page === page &&
        (!opts.level || el.dataset.level === opts.level);
      if (match) el.classList.add('active');
    });
    this._render(page, opts);
  },

  _render(page, opts = {}) {
    const wrap = document.getElementById('page-wrap');
    wrap.innerHTML = '';
    switch (page) {
      case 'home':       this._renderHome(wrap); break;
      case 'level':      this._renderLevel(wrap, opts.level || this.level); break;
      case 'vocabulary': this._renderVocabulary(wrap); break;
      case 'books':      this._renderBooks(wrap); break;
    }
    wrap.scrollTop = 0;
  },

  /* ======================================================
     HOME / DASHBOARD
  ====================================================== */
  _renderHome(wrap) {
    document.getElementById('breadcrumb').textContent = 'Dashboard';
    const stats = Vocab.getGlobalStats();
    const streak = parseInt(localStorage.getItem('diana_streak') || '1');

    wrap.innerHTML = `
      <div class="dash-greeting">
        <div class="dash-title">Willkommen zurück, Diana! 🌸</div>
        <div class="dash-subtitle">Продовжуй – ти впораєшся! (Weiter so – du schaffst das!)</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card" style="--ac:var(--primary)">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${stats.vocab}</div>
          <div class="stat-label">Vokabeln gespeichert</div>
        </div>
        <div class="stat-card" style="--ac:var(--success)">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${stats.completed}</div>
          <div class="stat-label">Übungen abgeschlossen</div>
        </div>
        <div class="stat-card" style="--ac:var(--accent)">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">B1</div>
          <div class="stat-label">Aktuelles Ziel</div>
        </div>
        <div class="stat-card" style="--ac:var(--info)">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${streak}</div>
          <div class="stat-label">Lerntage in Folge</div>
        </div>
      </div>

      <div class="section-title">📊 Alle Sprachniveaus</div>
      <div class="levels-grid">
        ${LEVELS.map(l => {
          const pct = Vocab.getLevelProgress(l.id);
          return `
          <div class="level-card" style="--lc:${l.color}" onclick="App.navigate('level',{level:'${l.id}'})">
            <div class="level-card-head">
              <div class="level-tag">${l.id}</div>
              <div class="level-card-icon">${l.icon}</div>
            </div>
            <div class="level-card-title">${l.title}</div>
            <div class="level-card-desc">${l.description}</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar" style="width:0%" data-target="${pct}"></div>
            </div>
            <div class="progress-text">${pct}% abgeschlossen</div>
          </div>`;
        }).join('')}
      </div>

      <div class="section-title">⚡ Schnellstart</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="App.navigate('level',{level:'B1'})">📖 B1 Lerneinheiten öffnen</button>
        <button class="btn btn-secondary" onclick="App.navigate('vocabulary')">🃏 Vokabeln üben</button>
        <button class="btn btn-secondary" onclick="App.navigate('books')">📚 Bücher ansehen</button>
      </div>
    `;

    setTimeout(() => {
      wrap.querySelectorAll('.progress-bar[data-target]').forEach(bar => {
        const t = bar.dataset.target;
        requestAnimationFrame(() => { bar.style.width = t + '%'; });
      });
    }, 80);
  },

  /* ======================================================
     LEVEL PAGE
  ====================================================== */
  _renderLevel(wrap, levelId) {
    const data = LESSONS_DATA[levelId];
    const meta = LEVELS.find(l => l.id === levelId);
    if (!data || !meta) { wrap.innerHTML = '<p>Keine Daten für dieses Niveau.</p>'; return; }
    document.getElementById('breadcrumb').textContent = `${levelId} – ${meta.title}`;

    this.skill = this.skill || 'schreiben';

    const skillMeta = [
      { key:'schreiben', label:'Schreiben üben', icon:'✏️' },
      { key:'hoeren',    label:'Hören',           icon:'🎧' },
      { key:'lesen',     label:'Lesen & Verstehen',icon:'📖' },
      { key:'sprechen',  label:'Sprechen üben',    icon:'🎤' },
    ];

    wrap.innerHTML = `
      <div class="level-hero" style="--lc:${meta.color}">
        <div class="level-hero-badge">${levelId}</div>
        <div>
          <div class="level-hero-title">${meta.icon} ${meta.title}</div>
          <div class="level-hero-desc">${meta.description}</div>
        </div>
      </div>

      <div class="skill-tabs-wrap">
        ${skillMeta.map(s => `
          <button class="skill-tab${this.skill===s.key?' active':''}" onclick="App._switchSkill('${s.key}','${levelId}')">
            <span class="skill-tab-icon">${s.icon}</span>${s.label}
          </button>`).join('')}
      </div>

      <div id="units-area">
        ${this._buildUnitsGrid(data.units, this.skill, meta.color)}
      </div>
    `;
  },

  _switchSkill(skill, levelId) {
    this.skill = skill;
    document.querySelectorAll('.skill-tab').forEach(t => {
      t.classList.toggle('active', t.textContent.trim().includes(
        {schreiben:'Schreiben',hoeren:'Hören',lesen:'Lesen',sprechen:'Sprechen'}[skill]
      ));
    });
    const data = LESSONS_DATA[levelId];
    document.getElementById('units-area').innerHTML =
      this._buildUnitsGrid(data.units, skill, LEVELS.find(l=>l.id===levelId).color);
  },

  _buildUnitsGrid(units, skill, color) {
    return `<div class="units-grid">
      ${units.map(unit => {
        const skillData = unit.skills[skill];
        const done = Vocab.getProgress(unit.id, skill).length;
        const total = skillData ? skillData.exercises.length : 0;
        const pct = total ? Math.round((done/total)*100) : 0;
        return `
        <div class="unit-card" onclick="App._openUnit('${unit.id}','${skill}')">
          <div class="unit-icon">${unit.icon}</div>
          <div class="unit-title">${unit.title}</div>
          <div class="unit-desc">${unit.desc}</div>
          <div class="unit-skills-row">
            ${Object.keys(unit.skills).map(k => `<span class="skill-chip">${{schreiben:'✏️',hoeren:'🎧',lesen:'📖',sprechen:'🎤'}[k]} ${k}</span>`).join('')}
          </div>
          <div class="unit-progress">
            <div class="progress-bar-wrap">
              <div class="progress-bar" style="width:${pct}%;background:${color}"></div>
            </div>
            <div class="progress-text">${done}/${total} Übungen</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  /* ======================================================
     OPEN UNIT IN MODAL
  ====================================================== */
  _openUnit(unitId, skill) {
    const levelId = Object.keys(LESSONS_DATA).find(lid =>
      LESSONS_DATA[lid].units.some(u => u.id === unitId));
    if (!levelId) return;
    const unit = LESSONS_DATA[levelId].units.find(u => u.id === unitId);
    if (!unit) return;

    this.unit = unit;
    this.skill = skill;
    this.exIndex = 0;
    this.selectedMatch = null;

    const body = document.getElementById('modal-body');
    body.innerHTML = '';
    this._renderExerciseModal(unit, skill, 0);
    document.getElementById('modal').style.display = 'flex';
  },

  _renderExerciseModal(unit, skill, idx) {
    const skillData = unit.skills[skill];
    if (!skillData || !skillData.exercises.length) {
      document.getElementById('modal-body').innerHTML =
        '<div style="padding:30px;text-align:center;color:var(--text3)">Noch keine Übungen für diese Einheit.</div>';
      return;
    }
    const exercises = skillData.exercises;
    const ex = exercises[idx];
    const done = Vocab.getProgress(unit.id, skill);
    const body = document.getElementById('modal-body');

    const skillIcons = {schreiben:'✏️',hoeren:'🎧',lesen:'📖',sprechen:'🎤'};

    body.innerHTML = `
      <div class="modal-title">${unit.icon} ${unit.title}</div>
      <div class="modal-subtitle">${skillIcons[skill]} ${skillData.title}</div>

      <div class="ex-progress-steps" style="display:flex;gap:4px;margin-bottom:20px">
        ${exercises.map((_,i) => `<div class="ex-step${done.includes(i)?' done':i===idx?' current':''}></div>`).join('')}
      </div>

      <div id="ex-container">
        ${this._buildExercise(ex, idx, unit.id, skill)}
      </div>

      <div class="ex-actions" id="ex-actions">
        ${idx > 0 ? `<button class="btn btn-secondary btn-sm" onclick="App._navEx(-1)">← Zurück</button>` : ''}
        ${idx < exercises.length - 1
          ? `<button class="btn btn-primary btn-sm" id="next-btn" onclick="App._navEx(1)">Weiter →</button>`
          : `<button class="btn btn-success btn-sm" onclick="App._finishUnit('${unit.id}','${skill}')">✅ Abgeschlossen!</button>`}
        <button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="App.closeModal()">✕ Schließen</button>
      </div>
    `;
  },

  _navEx(dir) {
    const unit = this.unit;
    const skill = this.skill;
    const exercises = unit.skills[skill].exercises;
    this.exIndex = Math.max(0, Math.min(exercises.length - 1, this.exIndex + dir));
    this._renderExerciseModal(unit, skill, this.exIndex);
  },

  _finishUnit(unitId, skill) {
    this.toast('🎉 Einheit abgeschlossen! Weiter so!', 'success');
    this._confetti();
    this.closeModal();
  },

  /* ======================================================
     BUILD EXERCISE HTML
  ====================================================== */
  _buildExercise(ex, idx, unitId, skill) {
    switch (ex.type) {
      case 'multiple-choice': return this._exMC(ex, idx, unitId, skill);
      case 'fill-blank':      return this._exFill(ex, idx, unitId, skill);
      case 'free-write':      return this._exWrite(ex, idx, unitId, skill);
      case 'reading':         return this._exReading(ex, idx, unitId, skill);
      case 'listening':       return this._exListening(ex, idx, unitId, skill);
      case 'speaking':        return this._exSpeaking(ex);
      case 'dialogue':        return this._exDialogue(ex);
      case 'reorder':         return this._exReorder(ex, idx, unitId, skill);
      default: return `<p>${ex.question || 'Übung'}</p>`;
    }
  },

  _exMC(ex, idx, unitId, skill) {
    const id = `mc_${Date.now()}`;
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Multiple Choice</div>
        <div class="ex-question">${ex.question}</div>
        <div class="choices" id="${id}">
          ${ex.choices.map((c, i) => `
            <button class="choice-btn" onclick="App._checkMC(this,'${id}',${i},${ex.correct},'${unitId}','${skill}',${idx},'${(ex.explanation||'').replace(/'/g,"\\'")}')">
              ${String.fromCharCode(65+i)}. ${c}
            </button>`).join('')}
        </div>
        <div id="fb_${id}"></div>
      </div>`;
  },

  _checkMC(btn, containerId, chosen, correct, unitId, skill, idx, explanation) {
    const container = document.getElementById(containerId);
    container.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add(chosen === correct ? 'correct' : 'wrong');
    if (chosen !== correct) {
      container.querySelectorAll('.choice-btn')[correct].classList.add('correct');
    }
    const fb = document.getElementById(`fb_${containerId}`);
    const ok = chosen === correct;
    fb.innerHTML = `<div class="feedback-box ${ok?'correct':'wrong'}">
      <span class="feedback-icon">${ok?'✅':'❌'}</span>
      <span>${ok ? 'Richtig! 🎉' : 'Leider falsch.'}${explanation ? ' – ' + explanation : ''}</span>
    </div>`;
    if (ok) {
      Vocab.saveProgress(unitId, skill, idx);
      this._markStepDone(idx);
    }
  },

  _exFill(ex, idx, unitId, skill) {
    const id = `fill_${Date.now()}`;
    const parts = ex.parts.map(p => {
      if (typeof p === 'string') return p.replace(/\n/g,'<br>');
      return `<input class="blank-input" data-answer="${p.blank.toLowerCase()}" placeholder="${p.hint||'...'}" onkeypress="if(event.key==='Enter')App._checkFill('${id}','${unitId}','${skill}',${idx},'${(ex.explanation||'').replace(/'/g,"\\'")}')">`;
    }).join('');
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Lückentext</div>
        <div class="ex-question">${ex.question}</div>
        <div class="fill-sentence">${parts}</div>
        <div id="fb_${id}" style="margin-top:12px"></div>
        <div style="margin-top:14px">
          <button class="btn btn-primary btn-sm" onclick="App._checkFill('${id}','${unitId}','${skill}',${idx},'${(ex.explanation||'').replace(/'/g,"\\'")}')>Prüfen ✓</button>
        </div>
      </div>`;
  },

  _checkFill(containerId, unitId, skill, idx, explanation) {
    const wrap = document.getElementById('modal-body');
    const inputs = wrap.querySelectorAll(`#fb_${containerId}`)[0]
      ?.closest('.exercise-card').querySelectorAll('.blank-input');
    if (!inputs) return;
    let allOk = true;
    inputs.forEach(inp => {
      const val = inp.value.trim().toLowerCase();
      const ans = inp.dataset.answer.toLowerCase();
      const ok = val === ans || ans.split('/').map(s=>s.trim()).includes(val);
      inp.classList.toggle('correct', ok);
      inp.classList.toggle('wrong', !ok);
      inp.disabled = true;
      if (!ok) allOk = false;
    });
    const fb = document.getElementById(`fb_${containerId}`);
    fb.innerHTML = `<div class="feedback-box ${allOk?'correct':'wrong'}">
      <span class="feedback-icon">${allOk?'✅':'❌'}</span>
      <span>${allOk ? 'Alles richtig! 🎉' : 'Einige Antworten waren falsch.'}${explanation ? ' – ' + explanation : ''}</span>
    </div>`;
    if (allOk) { Vocab.saveProgress(unitId, skill, idx); this._markStepDone(idx); }
  },

  _exWrite(ex, idx, unitId, skill) {
    const id = `fw_${Date.now()}`;
    const min = ex.minWords || 30;
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Freies Schreiben</div>
        <div class="ex-question">${ex.question}</div>
        ${ex.tip ? `<div class="ex-hint">💡 ${ex.tip}</div>` : ''}
        <textarea class="free-write-area" id="${id}" placeholder="${ex.placeholder || 'Schreibe hier ...'}" oninput="App._wCount('${id}',${min})"></textarea>
        <div class="word-count-bar">
          <span class="word-count-text" id="wc_${id}">0 / ${min} Wörter</span>
          <button class="btn btn-primary btn-sm" id="wc_btn_${id}" onclick="App._submitWrite('${id}',${min},'${unitId}','${skill}',${idx})" disabled>Einreichen</button>
        </div>
        <div id="fb_${id}" style="margin-top:10px"></div>
      </div>`;
  },

  _wCount(id, min) {
    const ta = document.getElementById(id);
    if (!ta) return;
    const words = ta.value.trim().split(/\s+/).filter(w=>w).length;
    const wc = document.getElementById(`wc_${id}`);
    const btn = document.getElementById(`wc_btn_${id}`);
    if (wc) wc.textContent = `${words} / ${min} Wörter`;
    if (btn) btn.disabled = words < min;
  },

  _submitWrite(id, min, unitId, skill, idx) {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.disabled = true;
    document.getElementById(`wc_btn_${id}`).disabled = true;
    const fb = document.getElementById(`fb_${id}`);
    fb.innerHTML = `<div class="feedback-box correct">
      <span class="feedback-icon">✅</span>
      <span>Super! Dein Text wurde gespeichert. Überprüfe Grammatik und Rechtschreibung selbst.</span>
    </div>`;
    Vocab.saveProgress(unitId, skill, idx);
    this._markStepDone(idx);
  },

  _exReading(ex, idx, unitId, skill) {
    const id = `rd_${Date.now()}`;
    const qHTML = ex.questions.map((q, qi) => `
      <div style="margin-bottom:14px">
        <div style="font-weight:600;margin-bottom:8px;font-size:.9rem">${qi+1}. ${q.q}</div>
        <div class="choices" id="rd_mc_${id}_${qi}">
          ${q.choices.map((c,ci) => `
            <button class="choice-btn" onclick="App._checkMCInline(this,'rd_mc_${id}_${qi}',${ci},${q.correct})">
              ${String.fromCharCode(65+ci)}. ${c}
            </button>`).join('')}
        </div>
      </div>`).join('');
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Lesen & Verstehen</div>
        <div class="ex-question">Lies den Text und beantworte die Fragen.</div>
        <div class="ex-text-box reading-container">${ex.text}</div>
        <div id="${id}">${qHTML}</div>
        <div id="fb_rd_${id}"></div>
        <div style="margin-top:12px">
          <button class="btn btn-primary btn-sm" onclick="App._checkReading('${id}',${ex.questions.length},'${unitId}','${skill}',${idx})">Alle prüfen ✓</button>
        </div>
      </div>`;
  },

  _checkMCInline(btn, cid, chosen, correct) {
    const c = document.getElementById(cid);
    if (!c) return;
    c.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add(chosen === correct ? 'correct' : 'wrong');
    if (chosen !== correct) c.querySelectorAll('.choice-btn')[correct].classList.add('correct');
  },

  _checkReading(id, count, unitId, skill, idx) {
    let correct = 0;
    for (let qi = 0; qi < count; qi++) {
      const c = document.getElementById(`rd_mc_${id}_${qi}`);
      if (c) {
        const correctBtn = c.querySelector('.choice-btn.correct');
        if (correctBtn) correct++;
      }
    }
    const fb = document.getElementById(`fb_rd_${id}`);
    const ok = correct === count;
    fb.innerHTML = `<div class="feedback-box ${ok?'correct':'wrong'}">
      <span class="feedback-icon">${ok?'🎉':'📖'}</span>
      <span>${correct}/${count} Fragen richtig.${ok?' Ausgezeichnet!':' Lies den Text nochmal und versuche es erneut.'}</span>
    </div>`;
    if (ok) { Vocab.saveProgress(unitId, skill, idx); this._markStepDone(idx); }
  },

  _exListening(ex, idx, unitId, skill) {
    const tid = `tr_${Date.now()}`;
    const id = `ls_${Date.now()}`;
    const qHTML = ex.questions.map((q, qi) => `
      <div style="margin-bottom:14px">
        <div style="font-weight:600;margin-bottom:8px;font-size:.9rem">${qi+1}. ${q.q}</div>
        <div class="choices" id="ls_mc_${id}_${qi}">
          ${q.choices.map((c,ci) => `
            <button class="choice-btn" onclick="App._checkMCInline(this,'ls_mc_${id}_${qi}',${ci},${q.correct})">
              ${String.fromCharCode(65+ci)}. ${c}
            </button>`).join('')}
        </div>
      </div>`).join('');
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Hören</div>
        <div class="ex-question">${ex.title}</div>
        <div class="audio-player-card">
          <div class="audio-controls">
            <div class="audio-title">🎧 ${ex.title}</div>
            <button class="transcript-toggle" onclick="App._toggleTranscript('${tid}')">Transkript anzeigen</button>
          </div>
          <div class="ex-hint">💡 Tipp: Lies zuerst die Fragen, dann höre (oder lies) den Dialog.</div>
          <div class="transcript-box" id="${tid}">${ex.transcript}</div>
        </div>
        <div style="font-weight:700;margin-bottom:12px;font-size:.9rem">Fragen zum Text:</div>
        ${qHTML}
        <div id="fb_ls_${id}" style="margin-top:10px"></div>
        <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="App._checkReading('${id.replace('ls_','rd_')}',${ex.questions.length},'${unitId}','${skill}',${idx})">
          Prüfen ✓
        </button>
      </div>`;
  },

  _toggleTranscript(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  },

  _exSpeaking(ex) {
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Sprechen üben</div>
        <div class="speaking-wrap">
          <div class="speaking-prompt">${ex.prompt}</div>
          <div class="ex-hint">🎤 Sprich laut und deutlich. Nimm dich wenn möglich auf.</div>
          ${ex.tips ? `<ul class="speaking-tips">${ex.tips.map(t=>`<li>${t}</li>`).join('')}</ul>` : ''}
          ${ex.example ? `<div class="ex-text-box" style="margin-top:16px;text-align:left"><strong>Beispielantwort:</strong><br>${ex.example}</div>` : ''}
        </div>
      </div>`;
  },

  _exDialogue(ex) {
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Dialog üben</div>
        <div class="ex-question">${ex.prompt}</div>
        <div class="dialogue">
          ${ex.lines.map(line => `
            <div class="d-line ${line.side==='right'?'right':''}">
              <div>
                <div class="d-name">${line.speaker}</div>
                <div class="d-bubble">${line.text}</div>
              </div>
            </div>`).join('')}
        </div>
        <div class="ex-hint">💬 Übe beide Rollen. Achte auf Aussprache und Betonung.</div>
      </div>`;
  },

  _exReorder(ex, idx, unitId, skill) {
    const id = `ro_${Date.now()}`;
    const shuffled = [...ex.words].sort(() => Math.random() - 0.5);
    this.wordOrder = [];
    return `
      <div class="exercise-card">
        <div class="ex-type-badge">Wörter ordnen</div>
        <div class="ex-question">${ex.question}</div>
        ${ex.tip ? `<div class="ex-hint">💡 ${ex.tip}</div>` : ''}
        <div style="font-size:.8rem;color:var(--text3);margin-bottom:6px">Klicke auf die Wörter in der richtigen Reihenfolge:</div>
        <div class="word-pool" id="pool_${id}">
          ${shuffled.map(w => `<span class="word-tile" onclick="App._pickWord(this,'${id}')">${w}</span>`).join('')}
        </div>
        <div style="font-size:.8rem;color:var(--text3);margin:10px 0 6px">Deine Antwort:</div>
        <div class="answer-zone" id="ans_${id}"></div>
        <div id="fb_ro_${id}" style="margin-top:10px"></div>
        <div style="margin-top:14px;display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="App._checkReorder('${id}','${(ex.answer||ex.words.join(' ')).replace(/'/g,"\\'")}','${unitId}','${skill}',${idx})">Prüfen ✓</button>
          <button class="btn btn-secondary btn-sm" onclick="App._resetReorder('${id}')">↺ Zurücksetzen</button>
        </div>
      </div>`;
  },

  _pickWord(el, id) {
    const ans = document.getElementById(`ans_${id}`);
    if (!ans) return;
    el.classList.add('answer-zone');
    ans.appendChild(el);
    el.onclick = () => {
      const pool = document.getElementById(`pool_${id}`);
      if (pool) { el.classList.remove('answer-zone'); pool.appendChild(el); }
    };
  },

  _resetReorder(id) {
    const pool = document.getElementById(`pool_${id}`);
    const ans = document.getElementById(`ans_${id}`);
    if (!pool || !ans) return;
    [...ans.children].forEach(c => { c.classList.remove('answer-zone'); pool.appendChild(c); });
    const fb = document.getElementById(`fb_ro_${id}`);
    if (fb) fb.innerHTML = '';
  },

  _checkReorder(id, answer, unitId, skill, idx) {
    const ans = document.getElementById(`ans_${id}`);
    if (!ans) return;
    const given = [...ans.children].map(c => c.textContent.trim()).join(' ');
    const correct = given.toLowerCase() === answer.toLowerCase();
    const fb = document.getElementById(`fb_ro_${id}`);
    fb.innerHTML = `<div class="feedback-box ${correct?'correct':'wrong'}">
      <span class="feedback-icon">${correct?'✅':'❌'}</span>
      <span>${correct ? 'Perfekt! 🎉' : `Nicht ganz. Richtige Reihenfolge: <em>${answer}</em>`}</span>
    </div>`;
    if (correct) { Vocab.saveProgress(unitId, skill, idx); this._markStepDone(idx); }
  },

  _markStepDone(idx) {
    const steps = document.querySelectorAll('.ex-step');
    if (steps[idx]) { steps[idx].classList.add('done'); steps[idx].classList.remove('current'); }
  },

  /* ======================================================
     VOCABULARY PAGE
  ====================================================== */
  _renderVocabulary(wrap) {
    document.getElementById('breadcrumb').textContent = 'Vokabeln';
    let filter = 'all', query = '';

    const render = () => {
      let items = query ? Vocab.search(query) : Vocab.filterByLevel(filter === 'all' ? null : filter);
      const learned = Vocab.getLearnedCount();
      const wrap2 = document.getElementById('vocab-cards');
      if (!wrap2) return;
      if (!items.length) {
        wrap2.innerHTML = `<div class="vocab-empty-state">
          <div class="empty-icon">📭</div>
          <h3>${query ? 'Keine Ergebnisse' : 'Noch keine Vokabeln'}</h3>
          <p>${query ? 'Andere Suche versuchen.' : 'Füge deine ersten Vokabeln oben hinzu!'}</p>
        </div>`;
        return;
      }
      wrap2.innerHTML = items.map(v => this._buildFlipCard(v)).join('');
    };

    wrap.innerHTML = `
      <div class="vocab-page">
        <div class="vocab-page-header">
          <h1>🃏 Meine Vokabeln</h1>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="vocab-stats" id="vocab-total-stat">${Vocab.getCount()} Karten | ${Vocab.getLearnedCount()} gelernt</span>
          </div>
        </div>

        <div class="vocab-add-panel">
          <h3>+ Neue Vokabel hinzufügen</h3>
          <div class="form-row">
            <div>
              <label class="form-label">Deutsches Wort *</label>
              <input class="form-input" id="v-word" placeholder="z.B. die Reise">
            </div>
            <div>
              <label class="form-label">Übersetzung *</label>
              <input class="form-input" id="v-trans" placeholder="z.B. подорож / поездка">
            </div>
            <div>
              <label class="form-label">Beispielsatz</label>
              <input class="form-input" id="v-ex" placeholder="z.B. Die Reise war wunderbar.">
            </div>
            <div>
              <label class="form-label">Niveau</label>
              <select class="form-select" id="v-level" style="width:80px">
                ${LEVELS.map(l=>`<option value="${l.id}"${l.id==='B1'?' selected':''}>${l.id}</option>`).join('')}
              </select>
            </div>
          </div>
          <button class="btn btn-primary" onclick="App._addVocab()">+ Hinzufügen</button>
        </div>

        <div class="vocab-controls">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" id="v-search" placeholder="Vokabeln suchen…" oninput="App._vocabSearch(this.value)">
          </div>
        </div>

        <div class="vocab-filter-row" id="vocab-filters">
          <button class="filter-btn active" onclick="App._vocabFilter('all',this)">Alle</button>
          ${LEVELS.map(l=>`<button class="filter-btn" onclick="App._vocabFilter('${l.id}',this)">${l.id}</button>`).join('')}
          <button class="filter-btn" onclick="App._vocabFilter('learned',this)">✅ Gelernt</button>
        </div>

        <div class="cards-grid" id="vocab-cards"></div>
      </div>
    `;

    this._vocabRenderCards();
  },

  _vocabRenderCards(filter, query) {
    const wrap = document.getElementById('vocab-cards');
    if (!wrap) return;
    let items = Vocab.getAll();
    if (query) {
      const lq = query.toLowerCase();
      items = items.filter(v => v.word.toLowerCase().includes(lq) || v.translation.toLowerCase().includes(lq));
    } else if (filter && filter !== 'all') {
      if (filter === 'learned') items = items.filter(v => v.learned);
      else items = items.filter(v => v.level === filter);
    }
    const stat = document.getElementById('vocab-total-stat');
    if (stat) stat.textContent = `${Vocab.getCount()} Karten | ${Vocab.getLearnedCount()} gelernt`;
    const badge = document.getElementById('vocab-badge');
    if (badge) badge.textContent = Vocab.getCount();

    if (!items.length) {
      wrap.innerHTML = `<div class="vocab-empty-state">
        <div class="empty-icon">📭</div>
        <h3>${query ? 'Keine Treffer' : 'Noch keine Vokabeln'}</h3>
        <p>${query ? 'Andere Suche versuchen.' : 'Füge oben deine ersten Vokabeln hinzu!'}</p>
      </div>`;
      return;
    }
    wrap.innerHTML = items.map(v => this._buildFlipCard(v)).join('');
  },

  _buildFlipCard(v) {
    const levelColors = {A1:'#10b981',A2:'#06b6d4',B1:'#8b5cf6',B2:'#f59e0b',C1:'#ef4444'};
    return `
      <div class="flip-card${v.learned?' learned':''}" id="fc_${v.id}" onclick="App._flip('${v.id}')">
        <div class="flip-card-inner">
          <div class="flip-front">
            <div class="flip-article">${v.article || ''}</div>
            <div class="flip-word">${v.word}</div>
            <div class="flip-level-tag" style="color:${levelColors[v.level]||'#888'}">${v.level}</div>
            <div class="flip-hint">Klicken zum Umdrehen 🔄</div>
          </div>
          <div class="flip-back">
            <div class="flip-translation">${v.translation}</div>
            ${v.example ? `<div class="flip-example">&quot;${v.example}&quot;</div>` : ''}
            <div class="flip-level-tag">Hinzugefügt: ${v.added}</div>
          </div>
        </div>
        <div class="flip-card-actions">
          <button class="flip-btn flip-ok" title="Als gelernt markieren" onclick="event.stopPropagation();App._learnVocab('${v.id}')">${v.learned?'★':'☆'}</button>
          <button class="flip-btn flip-del" title="Löschen" onclick="event.stopPropagation();App._deleteVocab('${v.id}')">🗑</button>
        </div>
      </div>`;
  },

  _flip(id) {
    const el = document.getElementById(`fc_${id}`);
    if (el) el.classList.toggle('flipped');
  },

  _learnVocab(id) {
    Vocab.toggleLearned(id);
    const el = document.getElementById(`fc_${id}`);
    if (el) el.classList.toggle('learned');
    const btn = el?.querySelector('.flip-ok');
    if (btn) btn.textContent = el.classList.contains('learned') ? '★' : '☆';
    const stat = document.getElementById('vocab-total-stat');
    if (stat) stat.textContent = `${Vocab.getCount()} Karten | ${Vocab.getLearnedCount()} gelernt`;
  },

  _deleteVocab(id) {
    const el = document.getElementById(`fc_${id}`);
    if (!el) return;
    el.classList.add('deleting');
    setTimeout(() => {
      Vocab.delete(id);
      el.remove();
      const stat = document.getElementById('vocab-total-stat');
      if (stat) stat.textContent = `${Vocab.getCount()} Karten | ${Vocab.getLearnedCount()} gelernt`;
      const badge = document.getElementById('vocab-badge');
      if (badge) badge.textContent = Vocab.getCount();
    }, 400);
    this.toast('Vokabel gelöscht', 'info');
  },

  _addVocab() {
    const word  = document.getElementById('v-word')?.value.trim();
    const trans = document.getElementById('v-trans')?.value.trim();
    const ex    = document.getElementById('v-ex')?.value.trim();
    const level = document.getElementById('v-level')?.value;
    if (!word || !trans) { this.toast('Bitte Wort und Übersetzung eingeben!', 'error'); return; }
    const result = Vocab.add(word, trans, ex, level);
    if (result === 'exists') { this.toast('Diese Vokabel existiert bereits!', 'error'); return; }
    document.getElementById('v-word').value = '';
    document.getElementById('v-trans').value = '';
    document.getElementById('v-ex').value = '';
    this.toast(`"${word}" hinzugefügt! ✅`, 'success');
    this._vocabRenderCards();
  },

  _vocabSearch(q) {
    this._vocabRenderCards(null, q);
  },

  _vocabFilter(filter, btn) {
    document.querySelectorAll('#vocab-filters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this._vocabRenderCards(filter);
  },

  /* ======================================================
     BOOKS PAGE
  ====================================================== */
  _renderBooks(wrap) {
    document.getElementById('breadcrumb').textContent = 'Bücher';
    const books = [
      { id:'b1', title:'Netzwerk B1', author:'Stefanie Dengler u.a.', level:'B1', color:'#8b5cf6', icon:'📗', desc:'Das Kursbuch für B1-Lernende. Ideal zur Prüfungsvorbereitung.' },
      { id:'b2', title:'Menschen A1', author:'Franz Specht u.a.', level:'A1', color:'#10b981', icon:'📘', desc:'Modernes Lehrwerk für Einsteiger mit viel Sprachpraxis.' },
      { id:'b3', title:'Schritte plus Neu B1', author:'Silke Hilpert u.a.', level:'B1', color:'#7c3aed', icon:'📙', desc:'Intensivtraining für die B1-Prüfung mit Hör- und Lesetexten.' },
      { id:'b4', title:'Deutsch üben – Lesen & Schreiben A2', author:'Anneli Billina', level:'A2', color:'#06b6d4', icon:'📕', desc:'Gezielte Übungen für Lesen und Schreiben auf A2-Niveau.' },
    ];
    const levelColors = {A1:'#10b981',A2:'#06b6d4',B1:'#8b5cf6',B2:'#f59e0b',C1:'#ef4444'};

    wrap.innerHTML = `
      <div class="books-header">
        <h1>📚 Meine Bücher</h1>
        <p>Lerneinheiten basierend auf deinen Lehrbüchern. Lade deine Bücher hoch, um weitere Inhalte freizuschalten.</p>
      </div>
      <div class="books-grid">
        ${books.map(b => `
          <div class="book-card" onclick="App.toast('Buchinhalt für &quot;${b.title}&quot; wird bald verfügbar!','info')">
            <div class="book-cover" style="background:linear-gradient(135deg,${b.color}22,${b.color}44)">
              <span style="font-size:4.5rem">${b.icon}</span>
            </div>
            <div class="book-info">
              <div class="book-level-pill" style="background:${levelColors[b.level]||'#888'}">${b.level}</div>
              <div class="book-title">${b.title}</div>
              <div class="book-author">${b.author}</div>
              <div class="book-desc">${b.desc}</div>
            </div>
          </div>`).join('')}
        <div class="book-placeholder" onclick="App.toast('Buchupload kommt bald!','info')">
          <div class="book-placeholder-icon">➕</div>
          <div class="book-placeholder-text">Neues Buch hinzufügen</div>
          <div style="font-size:.75rem;color:var(--text3)">Kommt bald</div>
        </div>
      </div>
    `;
  },

  /* ======================================================
     MODAL
  ====================================================== */
  closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-body').innerHTML = '';
  },

  /* ======================================================
     TOAST
  ====================================================== */
  toast(msg, type = 'info') {
    const icons = { success:'✅', error:'❌', info:'💬' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="ti">${icons[type]||'ℹ️'}</span>${msg}`;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  },

  /* ======================================================
     CONFETTI
  ====================================================== */
  _confetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#8b5cf6','#f59e0b','#10b981','#06b6d4','#ef4444','#ec4899'];
    const pieces = Array.from({length:80}, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      w: 6 + Math.random() * 6,
      h: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random()*colors.length)],
      vx: (Math.random()-0.5)*4,
      vy: 2 + Math.random()*3,
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*8,
    }));
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame/90);
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      });
      frame++;
      if (frame < 90) requestAnimationFrame(animate);
      else { canvas.style.display='none'; ctx.clearRect(0,0,canvas.width,canvas.height); }
    };
    animate();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
