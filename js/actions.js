/* js/actions.js — Samanko action handlers */

const Actions = (() => {
  const { state, clamp } = State;

  const MOOD_MESSAGES = {
    sleeping: ['💤 쿨쿨...', '💤 꿈나라 여행 중...', '💤 zzzz...'],
    hungry:   ['😫 배고파요...', '🥺 뭔가 먹고 싶어요', '😩 팥빵 주세요...'],
    love:     ['😍 너무 행복해요!', '💕 최고야!', '🥰 사랑해요!', '🌸 세상 제일 행복!'],
    happy:    ['😊 기분 좋아!', '🎵 랄랄라~', '✨ 행복해요', '🐟 붕어붕어~'],
    sad:      ['😢 우울해...', '😞 힘들어요...', '😔 누가 돌봐줘요...'],
    neutral:  ['😐 그냥 그래요', '👀 뭐 없어?', '🐟 붕어붕어', '💭 생각 중...'],
  };

  const PHASES = [
    { days: 0,  label: '아기 붕어',    tag: '🐠 BABY' },
    { days: 3,  label: '어린 사만코',  tag: '🐟 YOUNG' },
    { days: 7,  label: '사만코',       tag: '🐡 ADULT' },
    { days: 14, label: '어른 사만코',  tag: '🐠 ELDER' },
  ];

  const defs = {
    feed: {
      cooldown: 5000,
      run(s) {
        if (s.sleeping) return msg('💤 사만코가 자고 있어요!');
        s.hunger = clamp(s.hunger + 28, 0, 100);
        s.happy  = clamp(s.happy  + 5,  0, 100);
        s.clean  = clamp(s.clean  - 6,  0, 100);
        FishRenderer.startWiggle();
        particles(['🍡', '✨', '🍡', '💫']);
        msg('🍡 팥빵을 먹었어요! 냠냠~');
      },
    },
    play: {
      cooldown: 6000,
      run(s) {
        if (s.sleeping) return msg('💤 사만코가 자고 있어요!');
        if (s.hunger < 15) return msg('😫 너무 배고파서 못 놀아요...');
        s.happy  = clamp(s.happy  + 32, 0, 100);
        s.hunger = clamp(s.hunger - 12, 0, 100);
        s.clean  = clamp(s.clean  - 12, 0, 100);
        FishRenderer.startWiggle();
        particles(['🎮', '⭐', '🎵', '✨', '🌟']);
        msg('🎮 신나게 놀았어요!');
      },
    },
    clean: {
      cooldown: 7000,
      run(s) {
        if (s.sleeping) return msg('💤 사만코가 자고 있어요!');
        s.clean = clamp(s.clean + 45, 0, 100);
        s.happy = clamp(s.happy + 8,  0, 100);
        particles(['🛁', '💧', '✨', '💧', '🫧']);
        msg('🛁 깨끗하게 씻었어요!');
      },
    },
    sleep: {
      cooldown: 2000,
      run(s) {
        s.sleeping = !s.sleeping;
        const veil = document.getElementById('sleep-veil');
        veil.classList.toggle('active', s.sleeping);
        if (s.sleeping) {
          msg('💤 사만코가 잠들었어요. 굿나잇~');
        } else {
          s.hunger = clamp(s.hunger - 5,  0, 100);
          s.happy  = clamp(s.happy  + 12, 0, 100);
          msg('☀️ 사만코가 일어났어요! 잘 잤어요?');
          particles(['☀️', '✨', '🌸']);
        }
      },
    },
    pat: {
      cooldown: 3000,
      run(s) {
        if (s.sleeping) return msg('💤 자고 있어요... 조용히!');
        s.happy = clamp(s.happy + 18, 0, 100);
        FishRenderer.startWiggle();
        particles(['🫶', '💕', '✨', '💖']);
        msg('🫶 사만코가 좋아해요!');
      },
    },
    sing: {
      cooldown: 5000,
      run(s) {
        if (s.sleeping) return msg('💤 자는 사만코 앞에서 노래하면 안 돼요!');
        s.happy = clamp(s.happy + 22, 0, 100);
        FishRenderer.startWiggle();
        particles(['🎵', '🎶', '🎵', '🎶', '🎤']);
        msg('🎵 노래에 맞춰 춤을 춰요!');
      },
    },
  };

  function msg(text) {
    addLog(text);
    const el = document.getElementById('mood-text');
    if (el) {
      el.textContent = text;
      setTimeout(updateMoodLabel, 3000);
    }
  }

  function addLog(text) {
    const log = document.getElementById('log-panel');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry first';
    entry.textContent = text;
    log.insertBefore(entry, log.firstChild);
    // Downgrade previous entries
    [...log.querySelectorAll('.log-entry.first')].slice(1).forEach(el => {
      el.classList.remove('first');
    });
    while (log.children.length > 8) log.removeChild(log.lastChild);
  }

  function particles(emojis) {
    const container = document.getElementById('particles');
    if (!container) return;
    emojis.forEach((em, i) => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.textContent = em;
      el.style.left  = (15 + Math.random() * 70) + '%';
      el.style.top   = (30 + Math.random() * 40) + '%';
      el.style.animationDelay = (i * 0.1) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    });
  }

  function updateMoodLabel() {
    const mood = FishRenderer.getMood(state);
    const msgs = MOOD_MESSAGES[mood] || MOOD_MESSAGES.neutral;
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    const el = document.getElementById('mood-text');
    if (el) el.textContent = text;
  }

  function getPhase(days) {
    let phase = PHASES[0];
    for (const p of PHASES) { if (days >= p.days) phase = p; }
    return phase;
  }

  function doAction(name) {
    const def = defs[name];
    if (!def) return;
    const now = Date.now();
    const cd  = state.cooldown[name] || 0;
    const btn = document.querySelector(`[data-action="${name}"]`);

    if (now < cd) {
      const sec = Math.ceil((cd - now) / 1000);
      addLog(`⏳ ${sec}초 기다려주세요...`);
      if (btn) { btn.classList.add('cooling'); setTimeout(() => btn.classList.remove('cooling'), cd - now); }
      return;
    }

    state.cooldown[name] = now + def.cooldown;
    def.run(state);
    updateBars();
    State.save(state);

    // Cooldown visual
    if (btn) {
      btn.classList.add('cooling');
      setTimeout(() => btn.classList.remove('cooling'), def.cooldown);
    }
  }

  function updateBars() {
    const { hunger, happy, clean } = state;
    const set = (id, val) => {
      const bar = document.getElementById('fill-' + id);
      const txt = document.getElementById('val-' + id);
      if (bar) bar.style.width = val + '%';
      if (txt) txt.textContent  = Math.round(val);
    };
    set('hunger', hunger);
    set('happy',  happy);
    set('clean',  clean);
  }

  return { doAction, updateBars, updateMoodLabel, addLog, getPhase, MOOD_MESSAGES };
})();
