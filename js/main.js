/* js/main.js — Samanko main loop */

(function () {
  const { state, save, clamp } = State;
  const { doAction, updateBars, updateMoodLabel, addLog, getPhase } = Actions;

  // ── Wire up action buttons ──
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => doAction(btn.dataset.action));
  });

  // ── Canvas click = pat ──
  document.getElementById('fish-canvas').addEventListener('click', () => {
    doAction('pat');
  });

  // ── Bubble spawner ──
  let bubbleTimer = 0;
  function spawnBubble() {
    if (state.sleeping) return;
    const el = document.createElement('div');
    el.className = 'bubble';
    const size = 4 + Math.random() * 8;
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.left   = (20 + Math.random() * 60) + '%';
    el.style.bottom = (15 + Math.random() * 20) + '%';
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.getElementById('stage-bubbles').appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  // ── Age tick (every 60s = 1 day) ──
  setInterval(() => {
    state.age++;
    const phase = getPhase(state.age);
    const dayEl  = document.getElementById('day-badge');
    const tagEl  = document.getElementById('phase-tag');
    if (dayEl) dayEl.textContent = 'DAY ' + state.age;
    if (tagEl) tagEl.textContent = phase.label;
    save(state);
  }, 60_000);

  // ── Stat decay (every 4s) ──
  setInterval(() => {
    if (!state.sleeping) {
      state.hunger = clamp(state.hunger - 1.8, 0, 100);
      state.happy  = clamp(state.happy  - 0.9, 0, 100);
      state.clean  = clamp(state.clean  - 0.6, 0, 100);
    } else {
      state.hunger = clamp(state.hunger - 0.3, 0, 100);
      state.happy  = clamp(state.happy  + 0.6, 0, 100);
    }
    updateBars();

    // Danger flash
    if (state.hunger < 15 || state.happy < 15 || state.clean < 15) {
      const stage = document.getElementById('stage');
      if (stage) { stage.classList.add('alert'); setTimeout(() => stage.classList.remove('alert'), 400); }
    }

    save(state);
  }, 4_000);

  // ── Mood label rotation (every 8s) ──
  setInterval(updateMoodLabel, 8_000);

  // ── Bubble interval ──
  setInterval(() => { if (!state.sleeping) spawnBubble(); }, 2_500);

  // ── Main render loop ──
  function loop() {
    FishRenderer.tick(state);
    requestAnimationFrame(loop);
  }

  // ── Init ──
  updateBars();
  updateMoodLabel();

  const phase = getPhase(state.age);
  const dayEl  = document.getElementById('day-badge');
  const tagEl  = document.getElementById('phase-tag');
  if (dayEl) dayEl.textContent = 'DAY ' + state.age;
  if (tagEl) tagEl.textContent = phase.label;

  // Restore sleep state
  const veil = document.getElementById('sleep-veil');
  if (state.sleeping && veil) veil.classList.add('active');

  if (state.age > 0) {
    addLog(`💾 저장된 데이터 불러왔어요! DAY ${state.age} 사만코`);
  }

  loop();
})();
