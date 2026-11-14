/* ============ FLASHCARD DECKS ============
   Shared by all three courses. Replaces the single-deck flashcard view with sections:
   - Review due (everything you've studied that is due today)
   - Concepts by module (one card per term, from concepts-*.js)
   - Frameworks (Consulting only, built from window.FRAMEWORKS)
   - Quick one-liners (the original CARDS deck, unchanged)
   Routes: #cards (deck picker), #cards/due, #cards/<deckId>
   Cards only count as "due" once you've studied them, so new decks don't flood the badge. */
(function () {
  var REV_KEY = 'aim_fc_reverse';
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- build decks ---------- */
  var DECKS = [];
  var modNum = {};
  (window.MODULES || []).forEach(function (m) { modNum[m.id] = m.n || m.id.replace(/\D/g, ''); });
  (window.CONCEPT_DECKS || []).forEach(function (d) {
    var mid = d[0], title = d[1];
    DECKS.push({
      id: mid, group: 'concepts', title: title, num: modNum[mid] || mid.replace(/\D/g, ''),
      cards: d[2].map(function (c, i) { return { id: 'k-' + mid + '-' + (i + 1), k: 'Module ' + (modNum[mid] || '') + ' · ' + title, q: c[0], a: c[1], concept: true }; })
    });
  });
  /* cards for lessons added in extras-*.js: appended to their module's deck (or a new deck) */
  if (window.EXTRAS && window.EXTRAS.cards) {
    Object.keys(window.EXTRAS.cards).forEach(function (mid) {
      var mod = (window.MODULES || []).filter(function (m) { return m.id === mid; })[0];
      var title = mod ? mod.t : mid, num = (mod && mod.n) || modNum[mid] || mid.replace(/\D/g, '');
      var deck = DECKS.filter(function (d) { return d.id === mid; })[0];
      if (!deck) { deck = { id: mid, group: 'concepts', title: title, num: num, cards: [] }; DECKS.push(deck); }
      window.EXTRAS.cards[mid].forEach(function (c, i) {
        deck.cards.push({ id: 'k-' + mid + '-x' + (i + 1), k: 'Module ' + num + ' · ' + title, q: c[0], a: c[1], concept: true });
      });
    });
  }
  if (window.FRAMEWORKS && window.FRAMEWORKS.length) {
    DECKS.push({
      id: 'frameworks', group: 'frameworks', title: 'Frameworks & interview playbook', num: 'F',
      cards: window.FRAMEWORKS.map(function (f) {
        var a = f.one.replace(/<[^>]+>/g, '');
        return { id: 'kf-' + f.id, k: f.tag, q: f.name.replace(/<[^>]+>/g, ''), a: a, concept: true };
      })
    });
  }
  var core = (typeof CARDS !== 'undefined' ? CARDS : window.CARDS) || [];
  DECKS.push({ id: 'oneliners', group: 'oneliners', title: 'Quick one-liners', num: '★', cards: core });

  function allCards() { var out = []; DECKS.forEach(function (d) { out = out.concat(d.cards); }); return out; }
  function isDue(c) {
    var st = cardState(c.id);
    if (!st.seen) return false;   // cards you've never studied are 'new', not 'due'
    return st.due <= today();
  }
  function isNew(c) { return !cardState(c.id).seen; }
  function isKnown(c) { var st = cardState(c.id); return st.seen && st.box >= 2; }
  function stats(cards) {
    var due = 0, nw = 0, known = 0;
    cards.forEach(function (c) { if (isNew(c)) nw++; if (isDue(c) && !isNew(c)) due++; if (isKnown(c)) known++; });
    return { n: cards.length, due: due, nw: nw, known: known, pct: cards.length ? Math.round(known / cards.length * 100) : 0 };
  }

  /* due count used by the sidebar, dashboard and phone tab bar */
  window.cardsDue = function () { return allCards().filter(isDue).length; };

  /* ---------- styles ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.dk-top{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0 6px}',
    '.dk-big{display:flex;flex-direction:column;gap:6px;text-align:left;cursor:pointer;border:1px solid var(--line);border-radius:var(--r);background:var(--surf);padding:16px 18px;box-shadow:var(--shadow);color:var(--tx);font:inherit}',
    '.dk-big.pri{background:var(--accwash);border-color:var(--acc)}',
    '.dk-big b{font-size:16px}.dk-big span{font-size:13px;color:var(--tx2)}',
    '.dk-big .n{font-family:var(--mono);font-size:26px;font-weight:800;color:var(--acc)}',
    '.dk-sec{margin:28px 0 10px}.dk-sec p{font-size:13px;color:var(--tx2);margin:4px 0 0}',
    '.dk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}',
    '.dk{display:flex;flex-direction:column;gap:8px;text-align:left;cursor:pointer;border:1px solid var(--line);border-radius:12px;background:var(--surf);padding:14px;color:var(--tx);font:inherit;transition:.12s}',
    '.dk:hover{border-color:var(--acc)}',
    '.dk .t{display:flex;gap:10px;align-items:flex-start}',
    '.dk .nm{flex:none;width:30px;height:30px;border-radius:8px;background:var(--surf2);display:grid;place-items:center;font-family:var(--mono);font-weight:800;font-size:12.5px;color:var(--tx2)}',
    '.dk h3{font-size:14px;margin:4px 0 0;line-height:1.35;font-weight:650}',
    '.dk .m{display:flex;gap:10px;flex-wrap:wrap;font-family:var(--mono);font-size:11px;color:var(--tx3)}',
    '.dk .m .d{color:var(--gold);font-weight:700}.dk .m .w{color:var(--acc2)}',
    '.dk .pb{height:4px;border-radius:2px;background:var(--surf2);overflow:hidden}.dk .pb i{display:block;height:100%;background:var(--acc)}',
    '.dk-opts{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--tx2);margin-top:10px;cursor:pointer;user-select:none}',
    '.dk-opts input{accent-color:var(--acc);width:16px;height:16px}',
    '.fc-front .q.term{font-size:24px;font-weight:700}',
    '.fc-back .a.def{font-size:16.5px;line-height:1.55;text-align:left}',
    '.fc-face{overflow:auto}',
    '@media (max-width:600px){.dk-top{grid-template-columns:1fr}.dk-grid{grid-template-columns:1fr}.fc-front .q.term{font-size:21px}.fc-face{padding:22px!important}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- deck picker ---------- */
  function home(v) {
    setCrumb('Flashcards');
    var all = allCards(), sAll = stats(all), dueN = window.cardsDue();
    function tile(d) {
      var s = stats(d.cards);
      return '<button class="dk" onclick="go(\'cards/' + d.id + '\')"><div class="t"><span class="nm">' + esc(d.num) + '</span><h3>' + esc(d.title) + '</h3></div>' +
        '<div class="m"><span>' + s.n + ' cards</span>' + (s.nw ? '<span class="w">' + s.nw + ' new</span>' : '') + (s.due ? '<span class="d">' + s.due + ' due</span>' : '') + '<span>' + s.pct + '% known</span></div>' +
        '<div class="pb"><i style="width:' + s.pct + '%"></i></div></button>';
    }
    function section(group, title, sub) {
      var ds = DECKS.filter(function (d) { return d.group === group; });
      if (!ds.length) return '';
      return '<div class="dk-sec"><div class="eyebrow" style="color:var(--acc2)">' + title + '</div><p>' + sub + '</p></div><div class="dk-grid">' + ds.map(tile).join('') + '</div>';
    }
    var rev = lsGet(REV_KEY, false);
    v.innerHTML = '<div class="page-in">' +
      '<div class="eyebrow">Spaced repetition · ' + sAll.n + ' cards · ' + sAll.pct + '% known</div>' +
      '<h1 class="h-hero">Flashcards</h1>' +
      '<p class="sub">Pick a deck. The concept decks have one card per term from each module, so you can learn the definitions one at a time.</p>' +
      '<div class="dk-top">' +
        '<button class="dk-big pri" onclick="go(\'cards/due\')"' + (dueN ? '' : ' disabled style="opacity:.6;cursor:default"') + '><span class="n">' + dueN + '</span><b>Review due</b><span>' + (dueN ? 'Cards you\'ve studied that are due today' : 'Nothing due. Start a deck below.') + '</span></button>' +
        '<button class="dk-big" onclick="go(\'cards/mix\')"><span class="n">' + Math.min(20, sAll.n) + '</span><b>Quick mix</b><span>20 random cards from every deck</span></button>' +
      '</div>' +
      '<label class="dk-opts"><input type="checkbox" id="dkRev"' + (rev ? ' checked' : '') + '> Show the definition first, guess the term</label>' +
      section('concepts', 'Concepts by module', 'One card per concept, written from that module\'s lessons.') +
      section('frameworks', 'Frameworks', 'Every framework and interview format from the Frameworks section.') +
      section('oneliners', 'Quick one-liners', 'The original deck: numbers and one-liners to know cold.') +
      '</div>';
    var cb = document.getElementById('dkRev');
    if (cb) cb.onchange = function () { lsSet(REV_KEY, cb.checked); };
  }

  /* ---------- study session ---------- */
  function session(v, which) {
    var deck = DECKS.filter(function (d) { return d.id === which; })[0];
    var title, queue, mode;
    if (which === 'due') {
      title = 'Review due'; queue = shuffle(allCards().filter(isDue)); mode = 'Due for review';
    } else if (which === 'mix') {
      title = 'Quick mix'; queue = shuffle(allCards().slice()).slice(0, 20); mode = 'Mixed practice';
    } else if (deck) {
      title = deck.title;
      var due = deck.cards.filter(function (c) { return isDue(c) && !isNew(c); });
      var nw = deck.cards.filter(isNew);
      queue = shuffle(due).concat(deck.group === 'concepts' ? nw : shuffle(nw));
      mode = queue.length ? (due.length ? due.length + ' due' : '') + (due.length && nw.length ? ' + ' : '') + (nw.length ? nw.length + ' new' : '') : 'Practice round';
      if (!queue.length) queue = shuffle(deck.cards.slice());
    } else { go('cards'); return; }
    setCrumb('<b onclick="go(\'cards\')" style="cursor:pointer">Flashcards</b> / ' + esc(title));
    var rev = lsGet(REV_KEY, false), i = 0, right = 0;
    render();
    function render() {
      if (i >= queue.length) {
        v.innerHTML = '<div class="page-in fc-stage empty">' + svg(IC.check, 2) + '<h2 style="margin:10px 0 6px">Deck done</h2>' +
          '<p class="sub" style="margin:0 auto">' + right + ' of ' + queue.length + ' got right. Missed cards come back sooner; known ones space out.</p>' +
          '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn" onclick="go(\'cards\')">All decks</button>' +
          '<button class="btn pri" onclick="window.__fcAgain()">Go again</button></div></div>';
        return;
      }
      var c = queue[i];
      var front = rev && c.concept ? c.a : c.q, back = rev && c.concept ? c.q : c.a;
      var fCls = c.concept ? (rev ? 'q' : 'q term') : 'q', bCls = c.concept ? (rev ? 'a' : 'a def') : 'a';
      v.innerHTML = '<div class="page-in fc-stage">' +
        '<div class="eyebrow">' + esc(title) + ' · ' + mode + ' · card ' + (i + 1) + ' / ' + queue.length + '</div>' +
        '<div class="bar" style="margin:14px 0"><i style="width:' + (i / queue.length * 100) + '%"></i></div>' +
        '<div class="fc" id="fc" tabindex="0" role="button" aria-label="Flashcard, activate to reveal answer"><div class="fc-inner">' +
          '<div class="fc-face fc-front"><span class="k">' + esc(c.k || '') + '</span><div class="' + fCls + '">' + (c.concept ? esc(front) : front) + '</div></div>' +
          '<div class="fc-face fc-back"><span class="k">' + (c.concept ? (rev ? 'term' : 'definition') : 'answer') + '</span><div class="' + bCls + '">' + (c.concept ? esc(back) : back) + '</div></div>' +
        '</div></div>' +
        '<div class="fc-hint" id="fcHint"><span class="kbd">Space</span> flip · <span class="kbd">1</span> missed · <span class="kbd">2</span> got it</div>' +
        '<div class="fc-grade" id="fcGrade" style="visibility:hidden"><button class="btn" onclick="window.__grade(false)">Missed it</button><button class="btn pri" onclick="window.__grade(true)">Got it ✓</button></div>' +
        '</div>';
      var fc = document.getElementById('fc');
      fc.addEventListener('click', function () {
        fc.classList.toggle('flip');
        if (fc.classList.contains('flip')) { document.getElementById('fcGrade').style.visibility = 'visible'; document.getElementById('fcHint').textContent = 'how did you do?'; }
      });
    }
    window.__grade = function (ok) {
      var c = queue[i]; touchStreak(); gradeCard(c.id, ok);
      if (ok) { right++; addXP(4, 'Card reviewed'); }
      i++; render(); renderNav();
    };
    window.__fcAgain = function () { session(v, which); };
  }

  /* ---------- route ---------- */
  window.viewCards = function (v) {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    if (p[1]) session(v, p[1]); else home(v);
  };
})();

/* The main app routes once before this file loads; route again so the new view and counts apply. */
if (typeof route === 'function') route();
