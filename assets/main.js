'use strict';
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  var y = $('year'); if (y) y.textContent = String(new Date().getFullYear());

  // sticky nav border on scroll
  var nav = $('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // rotating headline word
  var words = ['intelligent systems', 'autonomous agents', 'AI-driven software', 'critical infrastructure'];
  var rot = $('rotator');
  if (rot && !reduce) {
    var i = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 350);
    }, 3000);
  }

  // typed terminal. Each line = [cssClass, text]; built with DOM APIs only (no innerHTML)
  var term = $('term');
  var script = [
    [['p', '$ '], ['', 'zerox scan --scope authorized.txt']],
    [['d', '  loading scope policy ... '], ['ok', 'enforced']],
    [['d', '  agent#1 '], ['k', 'candidate'], ['d', '  CVE-class: memory corruption']],
    [['d', '  agent#2 '], ['w', 'replaying'], ['d', ' finding independently']],
    [['d', '  agent#2 '], ['ok', 'reproduced'], ['d', ' ✔ verified']],
    [['p', '$ '], ['', 'zerox disclose --coordinated']],
    [['d', '  report queued for vendor ... '], ['ok', 'done']]
  ];
  function render(upToLine, upToChar) {
    term.textContent = '';
    for (var l = 0; l <= upToLine && l < script.length; l++) {
      var budget = l < upToLine ? Infinity : upToChar;
      script[l].forEach(function (seg) {
        if (budget <= 0) return;
        var s = document.createElement('span');
        if (seg[0]) s.className = seg[0];
        s.textContent = seg[1].slice(0, budget);
        budget -= seg[1].length;
        term.appendChild(s);
      });
      if (l < upToLine) term.appendChild(document.createTextNode('\n'));
    }
    var c = document.createElement('span'); c.className = 'cur'; term.appendChild(c);
  }
  if (term) {
    if (reduce) { render(script.length - 1, Infinity); }
    else {
      var line = 0, ch = 0;
      (function tick() {
        var total = script[line].reduce(function (a, s) { return a + s[1].length; }, 0);
        render(line, ch);
        if (ch < total) { ch++; setTimeout(tick, 22); }
        else if (line < script.length - 1) { line++; ch = 0; setTimeout(tick, 380); }
        else { setTimeout(function () { line = 0; ch = 0; tick(); }, 4200); }
      })();
    }
  }

  // scroll reveal
  var items = document.querySelectorAll('.card, .timeline li, .sec-head, .banner');
  items.forEach(function (n) { n.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  } else { items.forEach(function (n) { n.classList.add('in'); }); }

  // card spotlight follows cursor
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // background network
  var c = $('bg');
  if (!c || reduce || !c.getContext) return;
  var ctx = c.getContext('2d'), pts = [], D = 150, W, H;
  function size() {
    var r = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight;
    c.width = W * r; c.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
    var n = Math.min(70, Math.floor(W * H / 22000)); pts = [];
    for (var k = 0; k < n; k++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28 });
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var a = 0; a < pts.length; a++) {
      var p = pts[a]; p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.fillStyle = 'rgba(61,255,176,.7)'; ctx.fillRect(p.x, p.y, 2, 2);
      for (var b = a + 1; b < pts.length; b++) {
        var q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) { ctx.strokeStyle = 'rgba(77,163,255,' + (0.22 * (1 - d / D)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    requestAnimationFrame(frame);
  }
  size(); frame();
  var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(size, 150); });
})();
