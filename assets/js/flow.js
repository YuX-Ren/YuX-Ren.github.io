/* Hero figure: a point cloud carried from noise to structure along straight
   flow-matching paths, cycling through a molecule, a crystal and a protein. */
(function () {
  var canvas = document.getElementById('flow');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var nameEl = document.getElementById('flow-name');
  var tEl = document.getElementById('flow-t');
  var CHALK = '233,238,240', SULFUR = '237,190,59';

  // --- structures: p = positions, h = highlighted (hetero) atoms, b = bonds
  var caffeine = {
    name: 'caffeine', scale: 1.3,
    p: [[3.18,-0.98,0.04],[2.16,0.03,0.06],[2.36,1.38,0.13],[1.22,2.04,0.13],[0.26,1.07,0.06],[0.81,-0.17,0.01],[0.03,-1.36,-0.06],[0.54,-2.48,-0.1],[-1.34,-1.11,-0.09],[-2.24,-2.24,-0.17],[-1.94,0.17,-0.05],[-3.17,0.29,-0.08],[-1.1,1.27,0.03],[-1.64,2.62,0.08]],
    h: [0,1,0,1,0,0,0,1,1,0,0,1,1,0],
    b: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[6,8],[8,9],[8,10],[10,11],[10,12],[12,13],[5,1],[12,4]]
  };

  function lattice() {            // rock salt, 3 x 3 x 3
    var p = [], h = [], b = [], n = 3, a = 2.1, idx = {};
    for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) for (var z = 0; z < n; z++) {
      idx[x + ',' + y + ',' + z] = p.length;
      p.push([(x - 1) * a, (y - 1) * a, (z - 1) * a]);
      h.push((x + y + z) % 2);
    }
    for (var k in idx) {
      var c = k.split(',').map(Number), i = idx[k];
      [[1,0,0],[0,1,0],[0,0,1]].forEach(function (d) {
        var j = idx[(c[0] + d[0]) + ',' + (c[1] + d[1]) + ',' + (c[2] + d[2])];
        if (j !== undefined) b.push([i, j]);
      });
    }
    return { name: 'rock salt', scale: 1.05, p: p, h: h, b: b };
  }

  function helix() {              // helical backbone trace
    var p = [], h = [], b = [], n = 30;
    for (var i = 0; i < n; i++) {
      var ang = i * 40 * Math.PI / 180;
      p.push([(i - (n - 1) / 2) * 0.29, 2.1 * Math.cos(ang), 2.1 * Math.sin(ang)]);
      h.push(i % 9 === 0 ? 1 : 0);
      if (i) b.push([i - 1, i]);
    }
    return { name: 'α-helix', scale: 0.92, p: p, h: h, b: b };
  }

  var structures = [caffeine, lattice(), helix()];
  var N = 30;

  function gauss() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function noise() {
    var a = [];
    for (var i = 0; i < N; i++) a.push([gauss() * 2.9, gauss() * 2.2, gauss() * 2.4]);
    return a;
  }
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  var FLOW = 3400, HOLD = 3800, RELEASE = 1300;
  var si = 0, x0 = noise(), from = null, phase = 'flow', t0 = performance.now(), rot = 0.6, last = t0;

  function draw(now, staticFrame) {
    var s = structures[si], el = now - t0, t, bondA, pts = [], alpha = [];
    if (staticFrame) { phase = 'hold'; el = 0; }
    if (phase === 'flow') { t = Math.min(el / FLOW, 1); if (t >= 1) { phase = 'hold'; t0 = now; } }
    else if (phase === 'hold') { t = 1; if (el > HOLD && !staticFrame) { phase = 'release'; t0 = now; from = x0; x0 = noise(); } }
    else { t = 1 - Math.min(el / RELEASE, 1); if (el >= RELEASE) { phase = 'flow'; t0 = now; si = (si + 1) % structures.length; s = structures[si]; t = 0; } }

    var e = ease(t), start = (phase === 'release') ? x0 : x0;
    for (var i = 0; i < N; i++) {
      var has = i < s.p.length, target = has ? s.p[i] : start[i], sc = has ? s.scale : 1;
      pts.push([
        (1 - e) * start[i][0] + e * target[0] * sc,
        (1 - e) * start[i][1] + e * target[1] * sc,
        (1 - e) * start[i][2] + e * target[2] * sc
      ]);
      alpha.push(has ? 1 : (1 - e) * 0.9);   // spare points fade out as structure forms
    }
    bondA = Math.max(0, (e - 0.72) / 0.28);

    // project
    var w = canvas.width, h = canvas.height, unit = Math.min(w, h) / 7.4;
    var yaw = 0.62 * Math.sin(rot), cr = Math.cos(yaw), sr = Math.sin(yaw), tilt = 0.42 + 0.12 * Math.cos(rot * 0.7), ct = Math.cos(tilt), st = Math.sin(tilt);
    var P = pts.map(function (p) {
      var x = p[0] * cr + p[2] * sr, z = -p[0] * sr + p[2] * cr;
      var y = p[1] * ct - z * st; z = p[1] * st + z * ct;
      return [w / 2 + x * unit, h / 2 - y * unit, z];
    });

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    if (bondA > 0) {
      s.b.forEach(function (b) {
        var a = P[b[0]], c = P[b[1]], depth = 0.55 + 0.45 * ((a[2] + c[2]) / 2 + 4) / 8;
        ctx.strokeStyle = 'rgba(' + CHALK + ',' + (0.42 * bondA * depth).toFixed(3) + ')';
        ctx.lineWidth = unit * 0.07;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
      });
    }
    var order = P.map(function (_, i) { return i; }).sort(function (a, b) { return P[a][2] - P[b][2]; });
    order.forEach(function (i) {
      var depth = Math.max(0.35, Math.min(1, 0.6 + P[i][2] / 9));
      var hetero = i < s.p.length && s.h[i];
      var col = hetero ? SULFUR : CHALK;
      // colour arrives with the structure: every point is chalk while it is noise
      var mix = hetero ? e : 0;
      var r = unit * (0.15 + 0.06 * depth);
      ctx.beginPath();
      ctx.arc(P[i][0], P[i][1], r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(18,58,90,' + alpha[i].toFixed(3) + ')';   // mask bonds behind the point
      ctx.fill();
      ctx.fillStyle = 'rgba(' + (mix > 0.5 ? col : CHALK) + ',' + (alpha[i] * depth).toFixed(3) + ')';
      ctx.fill();
    });

    if (nameEl && nameEl.textContent !== s.name) nameEl.textContent = s.name;
    if (tEl) tEl.textContent = t.toFixed(2);
  }

  function size() {
    var r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible = true, running = false;

  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    rot += Math.min(now - last, 64) * 0.00042; last = now;
    draw(now, false);
    requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduce) return;
    running = true; last = performance.now();
    requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', function () { size(); if (reduce) draw(performance.now(), true); });
  if (reduce) { draw(performance.now(), true); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  start();
})();
