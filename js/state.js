/* js/state.js — Samanko persistent state */

const State = (() => {
  const SAVE_KEY = 'samanko_v1';

  const defaults = {
    hunger:   80,
    happy:    70,
    clean:    90,
    age:      0,
    sleeping: false,
    lastSave: Date.now(),
    cooldown: {},
  };

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...defaults };
      const saved = JSON.parse(raw);

      // Simulate offline decay
      const elapsed = (Date.now() - (saved.lastSave || Date.now())) / 1000;
      const decayMins = Math.min(elapsed / 60, 120); // cap at 2hrs

      if (!saved.sleeping) {
        saved.hunger = clamp(saved.hunger - decayMins * 0.5, 0, 100);
        saved.happy  = clamp(saved.happy  - decayMins * 0.25, 0, 100);
        saved.clean  = clamp(saved.clean  - decayMins * 0.15, 0, 100);
      }

      return { ...defaults, ...saved, cooldown: {} };
    } catch {
      return { ...defaults };
    }
  }

  function save(s) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        ...s,
        lastSave: Date.now(),
      }));
    } catch {}
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  const state = load();

  return { state, save, clamp };
})();
