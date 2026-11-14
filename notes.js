/* ============ HANDWRITTEN NOTES ============
   Shared by all three courses. One copy-by-hand page per module (data in notes-*.js).
   Routes: #notes (list), #notes/<id> (one page). "Written" ticks are stored per course in localStorage. */
(function () {
  if (typeof IC === 'object' && !IC.pen) IC.pen = '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>';
  var KEYN = 'aim_notes_' + (typeof KEY === 'string' ? KEY : location.pathname);
  function getDone() { try { return JSON.parse(localStorage.getItem(KEYN) || '{}'); } catch (e) { return {}; } }
  function setDone(o) { try { localStorage.setItem(KEYN, JSON.stringify(o)); } catch (e) {} }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  var PAGES = window.NOTES || [];
  var modNum = {};
  (window.MODULES || []).forEach(function (m) { modNum[m.id] = m.n || ''; });

  function render(text) {
    var out = '', list = null;
    function close() { if (list) { out += '</' + list + '>'; list = null; } }
    text.trim().split('\n').forEach(function (raw) {
      var l = raw.trim(); if (!l) { close(); return; }
      var m;
      if (l.indexOf('## ') === 0) { close(); out += '<h3>' + inline(l.slice(3)) + '</h3>'; }
      else if (l.indexOf('- ') === 0) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += '<li>' + inline(l.slice(2)) + '</li>'; }
      else if ((m = l.match(/^(\d+(?:–\d+)?)\.\s+(.*)$/))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += '<li><span class="nn">' + m[1] + '</span>' + inline(m[2]) + '</li>'; }
      else if (l.indexOf('! ') === 0) { close(); out += '<div class="nw">⚠ ' + inline(l.slice(2)) + '</div>'; }
      else if (l.indexOf('> ') === 0) { close(); out += '<div class="nsay"><span>Say it</span>' + inline(l.slice(2)) + '</div>'; }
      else if (l.indexOf('✎ ') === 0) { close(); out += '<div class="ndraw"><span>✎ Draw this</span>' + inline(l.slice(2)) + '</div>'; }
      else { close(); out += '<p>' + inline(l) + '</p>'; }
    });
    close(); return out;
  }

  var css = document.createElement('style');
  css.textContent = [
    '.nlist{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:18px}',
    '.nitem{display:flex;gap:10px;align-items:flex-start;text-align:left;cursor:pointer;border:1px solid var(--line);border-radius:12px;background:var(--surf);padding:14px;color:var(--tx);font:inherit}',
    '.nitem:hover{border-color:var(--acc)}',
    '.nitem .nm{flex:none;width:30px;height:30px;border-radius:8px;background:var(--surf2);display:grid;place-items:center;font-family:var(--mono);font-weight:800;font-size:12.5px;color:var(--tx2)}',
    '.nitem.dn .nm{background:var(--acc);color:var(--onfill,#fff)}',
    '.nitem h3{font-size:14px;margin:5px 0 0;font-weight:650;line-height:1.35}',
    '.paper{position:relative;max-width:760px;margin:18px 0;padding:26px 30px 28px 54px;border:1px solid var(--line);border-radius:14px;background:var(--surf);box-shadow:var(--shadow);background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 31px,color-mix(in srgb,var(--acc) 9%,transparent) 31px,color-mix(in srgb,var(--acc) 9%,transparent) 32px);line-height:32px;font-size:15.5px}',
    '.paper::before{content:"";position:absolute;left:38px;top:0;bottom:0;width:1px;background:color-mix(in srgb,#d9534f 45%,transparent)}',
    '.paper h2{font-size:21px;margin:0 0 4px;line-height:1.3}',
    '.paper h3{font-size:15.5px;margin:18px 0 2px;color:var(--acc2);line-height:32px}',
    '.paper ul,.paper ol{margin:0;padding-left:20px}.paper ol{list-style:none;padding-left:4px}',
    '.paper li{margin:0}.paper p{margin:0}',
    '.paper .nn{display:inline-block;min-width:22px;font-family:var(--mono);font-weight:700;color:var(--acc2)}',
    '.paper b{color:var(--tx);font-weight:700}',
    '.nw{margin:6px 0;padding:2px 10px;border-left:3px solid var(--gold,#b8860b);background:color-mix(in srgb,var(--gold,#b8860b) 10%,transparent);border-radius:0 8px 8px 0}',
    '.nsay,.ndraw{margin:14px 0 4px;padding:6px 12px;border-radius:10px;line-height:1.6}',
    '.nsay{background:var(--accwash);border:1px solid color-mix(in srgb,var(--acc) 35%,transparent);font-style:italic}',
    '.ndraw{border:1.5px dashed var(--line2)}',
    '.nsay span,.ndraw span{display:block;font-style:normal;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:2px}',
    '.nbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;max-width:760px}',
    '@media (max-width:600px){.paper{padding:18px 16px 20px 34px;font-size:15px}.paper::before{left:22px}.nlist{grid-template-columns:1fr}}',
    '@media print{.rail,.topbar,.mtab,.mini,.nbar,.nhead,.scrim,#readbar{display:none!important}.app{display:block!important}.content{padding:0!important}.paper{box-shadow:none;border:0;max-width:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function list(v) {
    setCrumb('Notes');
    var done = getDone(), n = PAGES.filter(function (p) { return done[p[0]]; }).length;
    v.innerHTML = '<div class="page-in"><div class="eyebrow">Copy by hand · ' + n + ' of ' + PAGES.length + ' written</div>' +
      '<h1 class="h-hero">Handwritten notes</h1>' +
      '<p class="sub">One page per module with everything you need to know, laid out to copy onto paper. Writing it out is what makes it stick. Each page ends with a line to say out loud and something to draw.</p>' +
      '<div class="nlist">' + PAGES.map(function (p) {
        var num = modNum[p[0]] || (p[0] === 'play' ? 'F' : '');
        return '<button class="nitem' + (done[p[0]] ? ' dn' : '') + '" onclick="go(\'notes/' + p[0] + '\')"><span class="nm">' + (done[p[0]] ? '✓' : esc(num)) + '</span><h3>' + esc(p[1]) + '</h3></button>';
      }).join('') + '</div></div>';
  }

  function page(v, id) {
    var ix = -1; PAGES.forEach(function (p, i) { if (p[0] === id) ix = i; });
    if (ix < 0) { go('notes'); return; }
    var p = PAGES[ix], done = getDone(), prev = PAGES[ix - 1], next = PAGES[ix + 1];
    var num = modNum[p[0]] ? 'Module ' + modNum[p[0]] : 'Frameworks';
    setCrumb('<b onclick="go(\'notes\')" style="cursor:pointer">Notes</b> / ' + esc(p[1]));
    v.innerHTML = '<div class="page-in">' +
      '<div class="nbar nhead"><div class="eyebrow">' + num + ' · page ' + (ix + 1) + ' of ' + PAGES.length + '</div>' +
      '<button class="btn ghost sm" onclick="window.print()">Print</button></div>' +
      '<div class="paper"><h2>' + esc(p[1]) + '</h2>' + render(p[2]) + '</div>' +
      '<div class="nbar">' +
        (prev ? '<button class="btn ghost" onclick="go(\'notes/' + prev[0] + '\')">← ' + esc(prev[1]) + '</button>' : '<span></span>') +
        '<button class="btn ' + (done[p[0]] ? 'ghost' : 'pri') + '" id="nDone">' + svg(IC.check, 2.4) + ' ' + (done[p[0]] ? 'Written' : 'I wrote this page') + '</button>' +
        (next ? '<button class="btn ghost" onclick="go(\'notes/' + next[0] + '\')">' + esc(next[1]) + ' →</button>' : '<button class="btn ghost" onclick="go(\'notes\')">All notes →</button>') +
      '</div></div>';
    document.getElementById('nDone').onclick = function () {
      var d = getDone(); d[p[0]] = !d[p[0]]; setDone(d);
      if (d[p[0]] && typeof addXP === 'function') { touchStreak(); addXP(10, 'Notes written'); }
      page(v, id);
    };
  }

  window.viewNotes = function (v, id) { if (id) page(v, id); else list(v); };
})();
