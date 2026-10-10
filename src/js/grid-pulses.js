/* Quiet light pulses travelling along the CSS background grid. */
(function () {
  // Tuning (grid spacing is read from --grid-size in style.css)
  var CONFIG = {
    maxPulses: 6,
    minDuration: 12, // seconds to cross the viewport
    maxDuration: 25,
    trail: 70, // px, varied +/-40% per pulse
    opacity: [0.35, 0.6], // head brightness range
    glow: 0.1, // glow opacity around the head
    glowRadius: 9,
    minDelay: 1500, // ms between spawns
    maxDelay: 5000,
    lineStep: [1, 6], // lines skipped between consecutive picks
    colors: ['6,182,212', '45,212,191', '45,212,191', '6,182,212', '59,130,246'],
    maxDpr: 2,
    fps: 30
  };

  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canvas, ctx, size, w, h, pulses, busy, last, next, raf, resizeTimer;
  var lastIdx = { h: 0, v: 0 };
  var warmup = 3;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function setup() {
    var dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-size')) || 48;
    pulses = [];
    busy = { h: {}, v: {} };
  }

  function spawn(now) {
    // The first pulses start already inside the visible area, shortly after load
    var warm = warmup > 0;
    if (warm) warmup--;
    next = now + (warm ? 800 : rand(CONFIG.minDelay, CONFIG.maxDelay));
    if (pulses.length >= CONFIG.maxPulses) return;
    var axis = Math.random() < 0.5 ? 'h' : 'v';
    var lines = Math.floor((axis === 'h' ? h : w) / size) + 1;
    var idx = (lastIdx[axis] + Math.round(rand(CONFIG.lineStep[0], CONFIG.lineStep[1]))) % lines;
    lastIdx[axis] = idx;
    if (busy[axis][idx]) return; // one pulse per line
    busy[axis][idx] = true;
    var length = CONFIG.trail * rand(0.6, 1.4);
    var span = axis === 'h' ? w : h;
    pulses.push({
      axis: axis,
      idx: idx,
      len: length,
      pos: warm ? (span + length) * rand(0.2, 0.4) : 0,
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: (span + length) / rand(CONFIG.minDuration, CONFIG.maxDuration),
      span: span,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
      alpha: rand(CONFIG.opacity[0], CONFIG.opacity[1])
    });
  }

  function draw(p) {
    // pos runs 0..span+len so the whole trail leaves the screen before removal
    var head = p.dir === 1 ? p.pos : p.span - p.pos;
    var tail = head - p.dir * p.len;
    var c = idxCoord(p);
    var x0 = p.axis === 'h' ? tail : c, y0 = p.axis === 'h' ? c : tail;
    var x1 = p.axis === 'h' ? head : c, y1 = p.axis === 'h' ? c : head;
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(' + p.color + ',0)');
    g.addColorStop(1, 'rgba(' + p.color + ',' + p.alpha + ')');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    var r = CONFIG.glowRadius;
    var hx = x1, hy = y1;
    var rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, r);
    rg.addColorStop(0, 'rgba(' + p.color + ',' + CONFIG.glow * 2 + ')');
    rg.addColorStop(1, 'rgba(' + p.color + ',0)');
    ctx.fillStyle = rg;
    ctx.fillRect(hx - r, hy - r, r * 2, r * 2);
  }

  // Grid lines are 1px wide at multiples of the grid size; aim for the pixel centre
  function idxCoord(p) { return p.idx * size + 0.5; }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = now - last;
    if (dt < 1000 / CONFIG.fps) return;
    last = now;
    dt = Math.min(dt, 100) / 1000;
    if (now >= next) spawn(now);
    ctx.clearRect(0, 0, w, h);
    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.pos += p.speed * dt;
      if (p.pos > p.span + p.len) {
        delete busy[p.axis][p.idx];
        pulses.splice(i, 1);
      } else {
        draw(p);
      }
    }
  }

  function start() {
    if (raf || !canvas || document.hidden || motion.matches) return;
    last = performance.now();
    next = next || last;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'gridPulses';
    canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.body.insertBefore(canvas, document.body.firstChild);
    setup();
    start();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        ctx.clearRect(0, 0, w, h);
        setup();
      }, 150);
    });
    motion.addEventListener('change', function () {
      if (motion.matches) { stop(); ctx.clearRect(0, 0, w, h); pulses = []; busy = { h: {}, v: {} }; }
      else start();
    });
  }

  if (motion.matches) {
    // Still wait for a preference change before doing any work
    motion.addEventListener('change', function onChange() {
      if (!motion.matches && !canvas) { motion.removeEventListener('change', onChange); init(); }
    });
  } else {
    init();
  }
})();
