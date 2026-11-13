'use strict';
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // footer year (textContent only — never innerHTML)
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // rotating headline word
  var words = ['intelligent systems', 'autonomous agents', 'AI-driven software', 'critical infrastructure'];
  var el = document.getElementById('rotator');
  if (el && !reduce) {
    var i = 0;
    setInterval(function () { i = (i + 1) % words.length; el.textContent = words[i]; }, 2800);
  }

  // scroll reveal
  var items = document.querySelectorAll('.card, .steps li, .section h2');
  items.forEach(function (n) { n.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add('in'); });
  }

  // background: drifting node network
  var c = document.getElementById('bg');
  if (!c || reduce || !c.getContext) return;
  var ctx = c.getContext('2d'), w, h, pts = [], N = 55, D = 140;
  function size() {
    var r = window.devicePixelRatio || 1;
    w = c.width = innerWidth * r; h = c.height = innerHeight * r;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(r, r);
  }
  function init() {
    pts = [];
    for (var k = 0; k < N; k++) pts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 });
  }
  function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var a = 0; a < pts.length; a++) {
      var p = pts[a];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.fillStyle = 'rgba(61,255,176,.7)';
      ctx.fillRect(p.x, p.y, 2, 2);
      for (var b = a + 1; b < pts.length; b++) {
        var q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) { ctx.strokeStyle = 'rgba(77,163,255,' + (0.25 * (1 - d / D)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    requestAnimationFrame(frame);
  }
  size(); init(); frame();
  addEventListener('resize', function () { size(); init(); });
})();
