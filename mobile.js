/* ============ MOBILE LAYER ============
   Shared by index.html, agentic-patterns.html and handbook.html.
   Phone-only additions (nothing changes on desktop):
   - bottom tab bar (Home, Case Lab, Frameworks, Cards, Menu)
   - sticky mini audio player when the lesson player scrolls out of view
   - swipe to grade flashcards, swipe to close the menu drawer
   - bigger tap targets, no iOS zoom on inputs, touch-friendly hints, safe areas */
(function () {
  var MQ = window.matchMedia('(max-width:900px)');
  var TOUCH = window.matchMedia('(hover:none)').matches || 'ontouchstart' in window;

  /* ---------- CSS ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.mtab,.mini{display:none}',
    '@media (max-width:900px){',
    ' .content{padding-bottom:calc(150px + env(safe-area-inset-bottom))!important}',
    ' .topbar{padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}',
    ' .iconbtn{min-width:40px;min-height:40px}',
    ' .rail{z-index:40;padding-bottom:env(safe-area-inset-bottom)}',
    ' body.rail-lock{overflow:hidden}',
    /* tab bar */
    ' .mtab{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:32;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:4px 4px calc(4px + env(safe-area-inset-bottom))}',
    ' .mtab button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;border:0;background:none;color:var(--tx3);font:600 10.5px var(--sans,system-ui);cursor:pointer;position:relative;border-radius:10px;-webkit-tap-highlight-color:transparent}',
    ' .mtab button svg{width:22px;height:22px}',
    ' .mtab button.on{color:var(--acc)}',
    ' .mtab button.on::before{content:"";position:absolute;top:-4px;left:30%;right:30%;height:3px;border-radius:0 0 3px 3px;background:var(--acc)}',
    ' .mtab .bdg{position:absolute;top:2px;left:calc(50% + 6px);min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--gold,#b8860b);color:#fff;font:700 10px var(--mono,monospace);display:grid;place-items:center}',
    ' .mtab .bdg[hidden]{display:none}',
    /* mini player */
    ' .mini.on{display:flex;position:fixed;left:8px;right:8px;bottom:calc(64px + env(safe-area-inset-bottom));z-index:31;align-items:center;gap:6px;padding:6px 8px 9px 6px;border:1px solid var(--line);border-radius:14px;background:var(--surf);box-shadow:var(--shadow2,0 6px 24px rgba(0,0,0,.18));overflow:hidden;animation:miniIn .2s ease}',
    ' @keyframes miniIn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}',
    ' .mini-play{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:var(--acc);color:var(--onfill,#fff);display:grid;place-items:center;cursor:pointer}',
    ' .mini-play svg{width:16px;height:16px}',
    ' .mini-t{flex:1;min-width:0;border:0;background:none;text-align:left;color:var(--tx);cursor:pointer;padding:2px 4px}',
    ' .mini-t b{display:block;font:650 13px var(--sans,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    ' .mini-t span{display:block;font:500 11px var(--mono,monospace);color:var(--tx3)}',
    ' .mini-b{flex:none;min-width:40px;height:40px;border:0;background:none;color:var(--tx2);font:650 12px var(--sans,system-ui);border-radius:10px;cursor:pointer}',
    ' .mini-r{border:1px solid var(--line);border-radius:999px;min-width:46px;height:32px;color:var(--acc)}',
    ' .mini-p{position:absolute;left:0;bottom:0;height:3px;background:var(--acc);width:0}',
    ' .toast{bottom:calc(84px + env(safe-area-inset-bottom))!important}',
    ' body:has(.mini.on) .toast{bottom:calc(140px + env(safe-area-inset-bottom))!important}',
    /* tap targets */
    ' .la-btn{min-width:48px;min-height:42px;font-size:13px}',
    ' .la-rate{min-height:36px}',
    ' .la-play{width:52px;height:52px}',
    ' .la-auto{min-height:36px}',
    ' .btn.sm{min-height:38px}',
    ' .opt{min-height:48px;padding:12px 13px}',
    ' .crumb b{display:inline-block;padding:8px 2px;margin:-8px 0}',
    ' .fwln{display:inline-block;padding:4px 0}',
    ' .ord-btn{width:38px!important;height:30px!important;font-size:12px!important}',
    ' .fc-grade .btn{flex:1;min-height:48px;justify-content:center}',
    ' .fc{height:min(320px,48vh)}',
    /* readable small text */
    ' .kbd,.casetype,.tag,.fwtag,.lab,.mn,.mp{font-size:11px!important}',
    /* no zoom on focus (iOS zooms when inputs are under 16px) */
    ' input,textarea,select{font-size:16px!important}',
    /* modal fits the screen */
    ' .modal{padding:12px;align-items:flex-end}',
    ' .modal>*{max-width:100%!important;max-height:calc(100vh - 24px);overflow:auto}',
    '}',
    '@media (hover:none){.touch-hide{display:none!important}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- icons ---------- */
  function ic(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var I = {
    home: ic('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
    lab: ic('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
    grid: ic('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    cards: ic('<rect x="6" y="3" width="13" height="17" rx="2"/><path d="M3 7v12a2 2 0 002 2h10"/>'),
    menu: ic('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
  };
  function hashSeg() { return (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/')[0]; }

  /* ---------- bottom tab bar ---------- */
  var tabs = [['dashboard', 'Home', I.home, ['dashboard', 'module', 'lesson', 'exam']], ['lab', 'Case Lab', I.lab, ['lab', 'case']]];
  if (window.FRAMEWORKS) tabs.push(['frameworks', 'Frameworks', I.grid, ['frameworks', 'fw']]);
  tabs.push(['cards', 'Cards', I.cards, ['cards']]);
  var bar = document.createElement('nav');
  bar.className = 'mtab';
  bar.setAttribute('aria-label', 'Sections');
  bar.innerHTML = tabs.map(function (t) {
    return '<button type="button" data-go="' + t[0] + '">' + t[2] + '<span>' + t[1] + '</span>' + (t[0] === 'cards' ? '<i class="bdg" hidden></i>' : '') + '</button>';
  }).join('') + '<button type="button" data-menu="1">' + I.menu + '<span>Menu</span></button>';
  document.body.appendChild(bar);
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.menu) { if (typeof openRail === 'function') { openRail(); document.body.classList.add('rail-lock'); } return; }
    if (hashSeg() === b.dataset.go && b.dataset.go !== 'cards') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    location.hash = b.dataset.go;
  });
  function paintTabs() {
    var seg = hashSeg();
    bar.querySelectorAll('button[data-go]').forEach(function (b) {
      var t = tabs.filter(function (x) { return x[0] === b.dataset.go; })[0];
      b.classList.toggle('on', t[3].indexOf(seg) >= 0);
    });
    var bdg = bar.querySelector('.bdg');
    try {
      var n = typeof cardsDue === 'function' ? cardsDue() : 0;
      if (typeof n === 'object' && n) n = n.length;
      bdg.hidden = !(n > 0); bdg.textContent = n > 99 ? '99+' : n;
    } catch (e) { bdg.hidden = true; }
  }

  /* ---------- drawer: lock scroll, swipe left to close ---------- */
  var scrim = document.getElementById('scrim'), rail = document.getElementById('rail');
  var burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', function () { document.body.classList.add('rail-lock'); });
  function unlock() { document.body.classList.remove('rail-lock'); }
  if (scrim) scrim.addEventListener('click', unlock);
  if (rail) {
    var sx = null, sy = null;
    rail.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    rail.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (dx < -60 && Math.abs(dy) < 50 && typeof closeRail === 'function') { closeRail(); unlock(); }
    }, { passive: true });
  }

  /* ---------- touch-friendly hints + flashcard swipe ---------- */
  function touchHints() {
    if (!TOUCH) return;
    var fh = document.getElementById('fcHint');
    if (fh && !fh.dataset.m) {
      fh.dataset.m = 1;
      fh.textContent = 'Tap to flip · then swipe ← missed it, → got it';
    }
    document.querySelectorAll('#view .kbd').forEach(function (k) {
      var p = k.parentElement;
      if (p && p.id !== 'view' && p.id !== 'fcHint' && (p.textContent || '').length < 140) p.classList.add('touch-hide');
    });
  }
  var fx = null, fy = null;
  document.addEventListener('touchstart', function (e) {
    var fc = e.target.closest && e.target.closest('#fc');
    if (fc) { fx = e.touches[0].clientX; fy = e.touches[0].clientY; } else fx = null;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (fx === null) return;
    var fc = document.getElementById('fc');
    var dx = e.changedTouches[0].clientX - fx, dy = e.changedTouches[0].clientY - fy; fx = null;
    if (!fc || Math.abs(dx) < 70 || Math.abs(dy) > 60) return;
    if (!fc.classList.contains('flip')) { fc.click(); return; }
    if (typeof window.__grade === 'function') {
      fc.style.transition = 'transform .18s,opacity .18s';
      fc.style.transform = 'translateX(' + (dx > 0 ? 120 : -120) + '%)'; fc.style.opacity = '0';
      setTimeout(function () { window.__grade(dx > 0); }, 170);
    }
  }, { passive: true });

  /* ---------- mini player ---------- */
  var LA = window.LessonAudio, audio = LA && LA.audio;
  var mini = document.createElement('div');
  mini.className = 'mini';
  mini.setAttribute('role', 'region');
  mini.setAttribute('aria-label', 'Now playing');
  mini.innerHTML = '<button class="mini-play" type="button" aria-label="Play or pause"></button>' +
    '<button class="mini-t" type="button" aria-label="Back to the player"><b></b><span></span></button>' +
    '<button class="mini-b" type="button" data-s="-15" aria-label="Back 15 seconds">−15</button>' +
    '<button class="mini-b" type="button" data-s="15" aria-label="Forward 15 seconds">+15</button>' +
    '<button class="mini-b mini-r" type="button" aria-label="Change speed"></button><i class="mini-p"></i>';
  document.body.appendChild(mini);
  var playerVisible = true, io = null;
  function fmt(s) { if (!isFinite(s)) return '0:00'; s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function paintMini() {
    if (!audio) return;
    var la = document.querySelector('#view .la:not(.hide)');
    var started = audio.currentTime > 0 || !audio.paused;
    var show = MQ.matches && la && !playerVisible && started;
    mini.classList.toggle('on', !!show);
    if (!show) return;
    mini.querySelector('.mini-play').innerHTML = audio.paused ? I.play : I.pause;
    var h = document.querySelector('#view h1');
    mini.querySelector('.mini-t b').textContent = h ? h.textContent : 'Lesson audio';
    mini.querySelector('.mini-t span').textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    mini.querySelector('.mini-r').textContent = (audio.playbackRate || 1) + '×';
    mini.querySelector('.mini-p').style.width = (audio.duration ? audio.currentTime / audio.duration * 100 : 0) + '%';
  }
  function watchPlayer() {
    if (io) { io.disconnect(); io = null; }
    playerVisible = true;
    var la = document.querySelector('#view .la');
    if (la && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { playerVisible = es[0].isIntersecting; paintMini(); });
      io.observe(la);
    }
    paintMini();
  }
  if (audio) {
    ['play', 'pause', 'timeupdate', 'ratechange', 'durationchange'].forEach(function (ev) { audio.addEventListener(ev, paintMini); });
    mini.querySelector('.mini-play').onclick = function () { audio.paused ? audio.play() : audio.pause(); };
    mini.querySelectorAll('[data-s]').forEach(function (b) {
      b.onclick = function () { audio.currentTime = Math.min(audio.duration || 0, Math.max(0, audio.currentTime + (+b.dataset.s))); };
    });
    mini.querySelector('.mini-r').onclick = function () {
      var R = (LA.rates || [0.75, 1, 1.25, 1.5, 1.75, 2]), i = R.indexOf(audio.playbackRate);
      var r = R[(i + 1) % R.length];
      if (LA.setRate) LA.setRate(r); else audio.playbackRate = r;
    };
    mini.querySelector('.mini-t').onclick = function () {
      var la = document.querySelector('#view .la');
      if (la) la.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }

  /* ---------- keep everything in sync with the router ---------- */
  function refresh() { paintTabs(); touchHints(); watchPlayer(); unlock(); }
  window.addEventListener('hashchange', function () { setTimeout(refresh, 0); });
  var view = document.getElementById('view');
  if (view && 'MutationObserver' in window) {
    var t = null;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { touchHints(); paintTabs(); if (!document.querySelector('#view .la') || !io) watchPlayer(); }, 30); })
      .observe(view, { childList: true, subtree: true });
  }
  MQ.addEventListener ? MQ.addEventListener('change', paintMini) : MQ.addListener(paintMini);
  refresh();
})();
