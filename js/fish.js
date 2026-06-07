/* js/fish.js — Samanko canvas renderer */

const FishRenderer = (() => {
  const canvas = document.getElementById('fish-canvas');
  const ctx = canvas.getContext('2d');

  const W = canvas.width;   // 200
  const H = canvas.height;  // 160

  let frame    = 0;
  let bobY     = 0;
  let bobDir   = 1;
  let tailPh   = 0;
  let blinkT   = 0;
  let blinking = false;
  let wiggle   = 0;
  let wiggling = false;

  function startWiggle() { wiggling = true; wiggle = 0; }

  function getMood(s) {
    if (s.sleeping)       return 'sleeping';
    if (s.hunger < 20)    return 'hungry';
    if (s.happy > 80 && s.hunger > 60) return 'love';
    if (s.happy > 55 && s.hunger > 35) return 'happy';
    if (s.happy < 30 || s.hunger < 30 || s.clean < 30) return 'sad';
    return 'neutral';
  }

  function draw(state) {
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2 + 10;
    const cy = H / 2 - 4 + Math.sin(bobY) * 3;

    // Body colors based on cleanliness
    const bodyHue   = state.clean > 50 ? '#E8A87C' : '#B8875A';
    const bellyHue  = state.clean > 50 ? '#F5C99A' : '#D4A880';
    const finColor  = '#C85030';
    const spotColor = '#B06028';

    ctx.save();

    // Wiggle transform
    if (wiggling) {
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(wiggle * 0.35) * 0.1);
      ctx.translate(-cx, -cy);
    }

    // ── Tail ──
    const tailWag = (wiggling
      ? Math.sin(wiggle * 0.45) * 7
      : Math.sin(tailPh) * 3);

    ctx.fillStyle = finColor;
    ctx.beginPath();
    ctx.moveTo(cx + 44, cy - 2);
    ctx.lineTo(cx + 74, cy - 16 + tailWag);
    ctx.lineTo(cx + 72, cy);
    ctx.lineTo(cx + 74, cy + 16 + tailWag * 0.6);
    ctx.closePath();
    ctx.fill();

    // ── Rear fin ──
    ctx.fillStyle = finColor;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(cx + 28, cy + 19, 12, 6, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Body ──
    ctx.fillStyle = bodyHue;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 48, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Belly ──
    ctx.fillStyle = bellyHue;
    ctx.beginPath();
    ctx.ellipse(cx + 6, cy + 6, 26, 13, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // ── Scale spots ──
    ctx.fillStyle = spotColor;
    ctx.globalAlpha = 0.4;
    [[-8,-6,9,6,-0.3],[-24,-2,7,5,-0.1],[8,-10,6,4,0.2]].forEach(([x,y,rx,ry,ang]) => {
      ctx.beginPath();
      ctx.ellipse(cx+x, cy+y, rx, ry, ang, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // ── Top fin ──
    ctx.fillStyle = finColor;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 18);
    ctx.quadraticCurveTo(cx, cy - 36, cx + 16, cy - 18);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Side fin ──
    ctx.fillStyle = finColor;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.ellipse(cx - 8, cy + 20, 8, 5, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Eye white ──
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 4, 8, 0, Math.PI * 2);
    ctx.fill();

    // ── Eye pupil / expression ──
    const mood = getMood(state);
    const eyeColor = (state.sleeping || blinking) ? 'transparent' : '#1E1410';

    if (state.sleeping || blinking) {
      // closed eye arc
      ctx.strokeStyle = '#2A1A10';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 4, 5, Math.PI, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      // eye shine
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx - 32, cy - 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Mouth expression ──
    if (!state.sleeping) {
      ctx.strokeStyle = '#2A1A10';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (mood === 'love' || mood === 'happy') {
        // smile
        ctx.arc(cx - 18, cy + 6, 6, 0.2, Math.PI - 0.2);
      } else if (mood === 'sad' || mood === 'hungry') {
        // frown
        ctx.arc(cx - 18, cy + 12, 6, Math.PI + 0.2, Math.PI * 2 - 0.2);
      } else {
        // neutral line
        ctx.moveTo(cx - 24, cy + 6);
        ctx.lineTo(cx - 12, cy + 6);
      }
      ctx.stroke();
    }

    // ── Hunger alert ──
    if (state.hunger < 25 && !state.sleeping) {
      ctx.fillStyle = '#C8392B';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('!', cx - 44, cy - 24);
    }

    // ── Dirty dots ──
    if (state.clean < 30 && !state.sleeping) {
      ctx.fillStyle = '#8A7060';
      ctx.globalAlpha = 0.5;
      [[10,8],[22,-4],[-5,14]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.arc(cx+dx, cy+dy, 2.5, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function tick(state) {
    frame++;
    tailPh += 0.07;
    bobY   += 0.04 * bobDir;
    if (Math.abs(bobY) > 1.2) bobDir *= -1;

    blinkT++;
    if (blinkT > 140 && !blinking) {
      blinking = true;
      setTimeout(() => { blinking = false; blinkT = 0; }, 140);
    }

    if (wiggling) {
      wiggle++;
      if (wiggle > 36) { wiggling = false; wiggle = 0; }
    }

    draw(state);
  }

  return { tick, startWiggle, getMood };
})();
