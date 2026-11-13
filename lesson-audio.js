/* ============ LESSON AUDIO ============
   Narrated audio for each lesson (pre-generated MP3s in audio/<course>/<mid>-<lid>.mp3),
   with play/pause, +-15s, scrubbing, speed control (remembered), auto-continue,
   and lock-screen / headphone controls via the Media Session API.
   Mounted by viewLesson(): LessonAudio.mount(container, {course, mid, lid, title, module, nextHash}) */
(function () {
  var RATE_KEY = 'aim_audio_rate', AUTO_KEY = 'aim_audio_autonext';
  var RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
  var audio = new Audio();
  audio.preload = 'metadata';
  var cur = null, ui = null, autoplayNext = false;

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var rate = get(RATE_KEY, 1), autoNext = get(AUTO_KEY, true);
  if (RATES.indexOf(rate) < 0) rate = 1;

  var css = document.createElement('style');
  css.textContent =
    '.la{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:16px 0 4px;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--surf)}' +
    '.la.hide{display:none}' +
    '.la-play{flex:none;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;background:var(--acc);color:var(--onfill,#fff);display:grid;place-items:center}' +
    '.la-play:focus-visible,.la-btn:focus-visible,.la-rate:focus-visible{outline:2px solid var(--acc);outline-offset:2px}' +
    '.la-play svg{width:18px;height:18px}' +
    '.la-btn{flex:none;border:0;background:none;color:var(--tx2);cursor:pointer;font:600 12px var(--sans,system-ui);padding:6px;border-radius:8px}' +
    '.la-btn:hover{color:var(--tx);background:var(--surf2)}' +
    '.la-mid{flex:1 1 220px;min-width:180px;display:flex;flex-direction:column;gap:4px}' +
    '.la-top{display:flex;justify-content:space-between;font:600 12px var(--sans,system-ui);color:var(--tx2)}' +
    '.la-top b{color:var(--tx);font-weight:650}' +
    '.la-bar{width:100%;accent-color:var(--acc);margin:0;cursor:pointer}' +
    '.la-time{font-variant-numeric:tabular-nums}' +
    '.la-rates{display:flex;gap:4px;flex-wrap:wrap}' +
    '.la-rate{border:1px solid var(--line);background:none;color:var(--tx2);border-radius:999px;padding:4px 9px;cursor:pointer;font:600 12px var(--sans,system-ui);font-variant-numeric:tabular-nums}' +
    '.la-rate.on{background:var(--accwash);border-color:var(--acc);color:var(--acc)}' +
    '.la-auto{display:flex;align-items:center;gap:6px;font:500 12px var(--sans,system-ui);color:var(--tx2);cursor:pointer;user-select:none}' +
    '.la-auto input{accent-color:var(--acc)}' +
    '@media (max-width:560px){.la-mid{order:-1;flex-basis:100%}.la-rates{flex:1 1 100%;justify-content:space-between}.la-rate{flex:1;padding:6px 0}.la-btn{font-size:13px}}';
  document.head.appendChild(css);

  var IC_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  var IC_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

  function fmt(s) { if (!isFinite(s)) return '0:00'; s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function q(s) { return ui && ui.querySelector(s); }

  function paint() {
    if (!ui || !ui.isConnected) return;
    q('.la-play').innerHTML = audio.paused ? IC_PLAY : IC_PAUSE;
    q('.la-play').setAttribute('aria-label', audio.paused ? 'Play narration' : 'Pause narration');
    var d = audio.duration;
    var bar = q('.la-bar');
    if (!bar.dragging) { bar.max = isFinite(d) ? d : 0; bar.value = audio.currentTime; }
    q('.la-time').textContent = fmt(audio.currentTime) + ' / ' + fmt(d);
    q('.la-left').textContent = isFinite(d) ? fmt((d - audio.currentTime) / rate) + ' left at ' + rate + '\u00d7' : 'Listen to this lesson';
    ui.querySelectorAll('.la-rate').forEach(function (b) { b.classList.toggle('on', +b.dataset.r === rate); });
  }

  function setRate(r) {
    rate = r; set(RATE_KEY, r);
    audio.playbackRate = r; audio.defaultPlaybackRate = r;
    paint();
  }

  function mediaSession() {
    if (!('mediaSession' in navigator) || !cur) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: cur.title, artist: cur.module || 'AI Mastery', album: 'AI Mastery' });
      navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
      navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
      navigator.mediaSession.setActionHandler('seekbackward', function () { audio.currentTime = Math.max(0, audio.currentTime - 15); });
      navigator.mediaSession.setActionHandler('seekforward', function () { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
      navigator.mediaSession.setActionHandler('nexttrack', cur.nextHash ? function () { autoplayNext = true; location.hash = cur.nextHash; } : null);
    } catch (e) {}
  }

  ['play', 'pause', 'timeupdate', 'durationchange', 'loadedmetadata', 'ratechange'].forEach(function (ev) { audio.addEventListener(ev, paint); });
  audio.addEventListener('loadedmetadata', function () { audio.playbackRate = rate; });
  audio.addEventListener('error', function () { if (ui) ui.classList.add('hide'); });
  audio.addEventListener('ended', function () {
    if (cur && autoNext && cur.nextHash) { autoplayNext = true; location.hash = cur.nextHash; }
  });

  // Stop narration when leaving the lesson (it lives outside the re-rendered view)
  window.addEventListener('hashchange', function () {
    if (cur && location.hash.replace(/^#/, '') !== 'lesson/' + cur.mid + '/' + cur.lid) audio.pause();
  });

  function mount(container, o) {
    var src = 'audio/' + o.course + '/' + o.mid + '-' + o.lid + '.mp3';
    var same = cur && audio.src && audio.src.indexOf(src) >= 0;
    cur = o;
    ui = document.createElement('div');
    ui.className = 'la';
    ui.setAttribute('role', 'region');
    ui.setAttribute('aria-label', 'Lesson audio');
    ui.innerHTML =
      '<button class="la-play" type="button"></button>' +
      '<button class="la-btn la-back" type="button" aria-label="Back 15 seconds">\u221215s</button>' +
      '<div class="la-mid"><div class="la-top"><b class="la-left">Listen to this lesson</b><span class="la-time">0:00 / 0:00</span></div>' +
      '<input class="la-bar" type="range" min="0" max="0" step="0.1" value="0" aria-label="Seek"></div>' +
      '<button class="la-btn la-fwd" type="button" aria-label="Forward 15 seconds">+15s</button>' +
      '<div class="la-rates" role="group" aria-label="Playback speed">' +
      RATES.map(function (r) { return '<button class="la-rate" type="button" data-r="' + r + '">' + r + '\u00d7</button>'; }).join('') + '</div>' +
      '<label class="la-auto"><input type="checkbox"' + (autoNext ? ' checked' : '') + '> Auto-play next lesson</label>';
    container.appendChild(ui);

    q('.la-play').onclick = function () { audio.paused ? audio.play() : audio.pause(); };
    q('.la-back').onclick = function () { audio.currentTime = Math.max(0, audio.currentTime - 15); };
    q('.la-fwd').onclick = function () { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); };
    var bar = q('.la-bar');
    bar.oninput = function () { bar.dragging = true; q('.la-time').textContent = fmt(+bar.value) + ' / ' + fmt(audio.duration); };
    bar.onchange = function () { audio.currentTime = +bar.value; bar.dragging = false; };
    ui.querySelectorAll('.la-rate').forEach(function (b) { b.onclick = function () { setRate(+b.dataset.r); }; });
    q('.la-auto input').onchange = function (e) { autoNext = e.target.checked; set(AUTO_KEY, autoNext); };

    if (!same) { audio.pause(); audio.src = src; audio.load(); }
    audio.playbackRate = rate;
    mediaSession();
    paint();
    if (autoplayNext) { autoplayNext = false; audio.play().catch(function () {}); }
  }

  window.LessonAudio = { mount: mount, audio: audio, setRate: setRate, rates: RATES };
})();
