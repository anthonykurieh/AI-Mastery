/* ============ STUDY NOTES ============
   Shared by all three courses. One study page per module (data in notes-*.js).
   Line format: "## " heading · "- " bullet · "1. " numbered · "! " warning · "> " say-it line ·
   "✎ {json}" diagram · plain text = paragraph · **bold**
   Routes: #notes (list) · #notes/<id> (page) · #notes/print/<id|all> (clean print layout used to build the PDFs).
   PDFs are pre-built into pdf/<course>/ (see scripts/build-notes-pdfs.py) so downloads have no browser headers or watermark. */
(function () {
  if (typeof IC === 'object' && !IC.pen) IC.pen = '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>';
  if (typeof IC === 'object' && !IC.dl) IC.dl = '<path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/>';
  var KEYN = 'aim_notes_' + (typeof KEY === 'string' ? KEY : location.pathname);
  function getDone() { try { return JSON.parse(localStorage.getItem(KEYN) || '{}'); } catch (e) { return {}; } }
  function setDone(o) { try { localStorage.setItem(KEYN, JSON.stringify(o)); } catch (e) {} }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function inline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  var PAGES = window.NOTES || [];
  var PDF = window.NOTES_PDF || '';
  var modNum = {};
  (window.MODULES || []).forEach(function (m) { modNum[m.id] = m.n || ''; });

  /* ---------- diagrams (SVG, themed via CSS variables) ---------- */
  var W = 680;
  function wrap(t, maxCh) {
    var words = String(t).split(' '), lines = [], cur = '';
    words.forEach(function (w) { if ((cur + ' ' + w).trim().length > maxCh && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur); return lines;
  }
  function txt(x, y, t, o) {
    o = o || {}; var size = o.size || 13, lh = size * 1.25, maxCh = o.maxCh || 40;
    var lines = o.nowrap ? [String(t)] : wrap(t, maxCh), y0 = y - (lines.length - 1) * lh / 2;
    return '<text x="' + x + '" y="' + y0 + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" class="' + (o.cls || 'dg-t') + '" font-size="' + size + '"' + (o.bold ? ' font-weight="700"' : '') + '>' +
      lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + esc(l) + '</tspan>'; }).join('') + '</text>';
  }
  function box(x, y, w, h, label, o) {
    o = o || {}; var parts = String(label).split('|'), size = o.size || 13;
    var mainL = wrap(parts[0], Math.max(6, Math.floor(w / (size * 0.58)))), subL = parts[1] ? wrap(parts[1], Math.max(6, Math.floor(w / 6.3))) : [];
    var lhm = size * 1.22, lhs = 13.5, total = mainL.length * lhm + (subL.length ? 3 + subL.length * lhs : 0), y0 = y + h / 2 - total / 2;
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" class="' + (o.cls || 'dg-b') + '"/>';
    s += '<text text-anchor="middle" class="dg-t" font-size="' + size + '" font-weight="700">' + mainL.map(function (l, i) { return '<tspan x="' + (x + w / 2) + '" y="' + (y0 + lhm * (i + 0.5)) + '" dominant-baseline="middle">' + esc(l) + '</tspan>'; }).join('') + '</text>';
    if (subL.length) { var ys = y0 + mainL.length * lhm + 3; s += '<text text-anchor="middle" class="dg-s" font-size="11">' + subL.map(function (l, i) { return '<tspan x="' + (x + w / 2) + '" y="' + (ys + lhs * (i + 0.5)) + '" dominant-baseline="middle">' + esc(l) + '</tspan>'; }).join('') + '</text>'; }
    return s;
  }
  function arrow(x1, y1, x2, y2, cls) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'dg-a') + '" marker-end="url(#dgArr)"/>'; }
  function svgWrap(h, body) {
    return '<svg class="dg" viewBox="0 0 ' + W + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<defs><marker id="dgArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-ah"/></marker></defs>' + body + '</svg>';
  }
  var D = {
    flow: function (d) {
      var n = d.items.length, gap = 26, bw = Math.min(150, (W - 20 - gap * (n - 1)) / n), total = bw * n + gap * (n - 1), x0 = (W - total) / 2, bh = d.tall || (n >= 6 && d.items.some(function (t) { return t.indexOf('|') > 0; })) ? 84 : 66, y = 22, s = '';
      d.items.forEach(function (it, i) { var x = x0 + i * (bw + gap); s += box(x, y, bw, bh, it, { cls: d.hl === i ? 'dg-b hl' : 'dg-b' }); if (i < n - 1) s += arrow(x + bw + 2, y + bh / 2, x + bw + gap - 3, y + bh / 2); });
      var h = y + bh + 20;
      if (d.loop) { var ly = y + bh + 22; s += '<path d="M' + (x0 + total - bw / 2) + ',' + (y + bh) + ' V' + ly + ' H' + (x0 + bw / 2) + ' V' + (y + bh + 4) + '" class="dg-a" fill="none" marker-end="url(#dgArr)"/>' + txt(W / 2, ly + 13, d.loop, { cls: 'dg-s', size: 11.5, maxCh: 80 }); h = ly + 30; }
      if (d.over) { s = txt(W / 2, 12, d.over, { cls: 'dg-s', size: 11.5, maxCh: 90 }) + s.replace(/y="22"/g, 'y="30"'); h += 8; }
      return svgWrap(h, s);
    },
    cycle: function (d) {
      var n = d.items.length, cx = W / 2, cy = 150, R = 105, bw = 128, bh = 46, s = '', pts = [];
      d.items.forEach(function (it, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push([cx + R * 1.55 * Math.cos(a), cy + R * Math.sin(a)]); });
      pts.forEach(function (p, i) {
        var q = pts[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
        var off = function (ux, uy) { var tx = Math.abs(ux) > 0.01 ? (bw / 2 + 6) / Math.abs(ux) : 1e9, ty = Math.abs(uy) > 0.01 ? (bh / 2 + 6) / Math.abs(uy) : 1e9; return Math.min(tx, ty); };
        var o = off(ux, uy); s += arrow(p[0] + ux * o, p[1] + uy * o, q[0] - ux * o, q[1] - uy * o);
      });
      pts.forEach(function (p, i) { s += box(p[0] - bw / 2, p[1] - bh / 2, bw, bh, d.items[i]); });
      if (d.center) s += '<circle cx="' + cx + '" cy="' + cy + '" r="44" class="dg-c"/>' + txt(cx, cy, d.center, { size: 12, maxCh: 12, bold: true });
      return svgWrap(cy + R + 40, s);
    },
    tree: function (d) {
      var n = d.kids.length, rw = 220, s = box((W - rw) / 2, 14, rw, 50, d.root, { cls: 'dg-b hl' }), gap = 16, kw = Math.min(170, (W - 20 - gap * (n - 1)) / n), total = kw * n + gap * (n - 1), x0 = (W - total) / 2, ky = 110, h = ky + 60;
      d.kids.forEach(function (k, i) {
        var x = x0 + i * (kw + gap); s += '<path d="M' + W / 2 + ',64 V88 H' + (x + kw / 2) + ' V' + (ky - 2) + '" class="dg-a" fill="none" marker-end="url(#dgArr)"/>' + box(x, ky, kw, 56, k);
        var lv = d.leaves && d.leaves[i];
        if (lv) { lv.forEach(function (l, j) { var ly = ky + 74 + j * 40; s += '<line x1="' + (x + kw / 2) + '" y1="' + (ly - 18) + '" x2="' + (x + kw / 2) + '" y2="' + ly + '" class="dg-a"/>' + box(x + 8, ly, kw - 16, 32, l, { cls: 'dg-b lt', size: 11.5 }); h = Math.max(h, ly + 46); }); }
      });
      return svgWrap(h, s);
    },
    pyramid: function (d) {
      var n = d.layers.length, lh = 52, top = 14, s = '';
      d.layers.forEach(function (l, i) { var w1 = 120 + i * (440 / Math.max(1, n - 1)) * 0.95, w2 = 120 + (i + 1) * (440 / Math.max(1, n - 1)) * 0.95; if (n === 1) { w1 = 300; w2 = 400; }
        var y = top + i * lh, xa = (W - w1) / 2, xb = (W - w2) / 2;
        s += '<path d="M' + xa + ',' + y + ' H' + (xa + w1) + ' L' + (xb + w2) + ',' + (y + lh - 4) + ' H' + xb + ' Z" class="' + (i === 0 ? 'dg-b hl' : 'dg-b') + '"/>'; var pp = String(l).split('|'); s += pp[1] ? txt(W / 2, y + lh / 2 - 9, pp[0], { bold: true, size: 12.5, nowrap: true }) + txt(W / 2, y + lh / 2 + 8, pp[1], { cls: 'dg-s', size: 11, maxCh: 30 + i * 14 }) : txt(W / 2, y + lh / 2 - 2, l, { bold: i === 0, size: 12.5, maxCh: 26 + i * 12 }); });
      return svgWrap(top + n * lh + 10, s);
    },
    matrix: function (d) {
      var x0 = 150, y0 = 18, cw = 230, ch = 82, s = '';
      for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) s += box(x0 + c * (cw + 8), y0 + r * (ch + 8), cw, ch, d.cells[r * 2 + c], { cls: (d.hl === r * 2 + c) ? 'dg-b hl' : 'dg-b', size: 12.5 });
      s += txt(x0 - 14, y0 + ch / 2, d.yhi || 'High', { anchor: 'end', cls: 'dg-s', size: 11.5, maxCh: 18 }) + txt(x0 - 14, y0 + ch * 1.5 + 8, d.ylo || 'Low', { anchor: 'end', cls: 'dg-s', size: 11.5, maxCh: 18 });
      s += txt(x0 + cw / 2, y0 + ch * 2 + 28, d.xlo || 'Low', { cls: 'dg-s', size: 11.5 }) + txt(x0 + cw * 1.5 + 8, y0 + ch * 2 + 28, d.xhi || 'High', { cls: 'dg-s', size: 11.5 });
      s += txt(x0 + cw + 4, y0 + ch * 2 + 50, d.x, { bold: true, size: 12.5, maxCh: 60 }) + '<text x="40" y="' + (y0 + ch + 4) + '" transform="rotate(-90 40 ' + (y0 + ch + 4) + ')" text-anchor="middle" class="dg-t" font-size="12.5" font-weight="700">' + esc(d.y) + '</text>';
      return svgWrap(y0 + ch * 2 + 66, s);
    },
    triangle: function (d) {
      var A = [W / 2, 30], B = [130, 250], C = [W - 130, 250], s = '<path d="M' + A + ' L' + B + ' L' + C + ' Z" class="dg-tri"/>';
      [A, B, C].forEach(function (p, i) { s += box(p[0] - 85, p[1] - 22, 170, 44, d.corners[i], { cls: 'dg-b hl' }); });
      if (d.center) s += txt(W / 2, 175, d.center, { bold: true, size: 13, maxCh: 22 });
      if (d.note) s += txt(W / 2, 296, d.note, { cls: 'dg-s', size: 11.5, maxCh: 90 });
      return svgWrap(d.note ? 312 : 285, s);
    },
    table: function (d) {
      var cols = d.rows[0].length, cw = (W - 20) / cols, rh = d.rh || 40, s = '';
      d.rows.forEach(function (r, i) { r.forEach(function (c, j) { var x = 10 + j * cw, y = 10 + i * rh; s += '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="' + rh + '" class="' + (i ? 'dg-cell' : 'dg-head') + '"/>' + txt(x + cw / 2, y + rh / 2, c, { bold: !i || j === 0, size: i ? 11.5 : 12, maxCh: Math.floor(cw / 6.6) }); }); });
      return svgWrap(20 + d.rows.length * rh, s);
    },
    bars: function (d) {
      var n = d.items.length, max = Math.max.apply(null, d.items.map(function (x) { return x[1]; })), gap = 22, bw = Math.min(110, (W - 80 - gap * (n - 1)) / n), total = bw * n + gap * (n - 1), x0 = (W - total) / 2, base = 200, s = '<line x1="30" y1="' + base + '" x2="' + (W - 30) + '" y2="' + base + '" class="dg-axis"/>';
      d.items.forEach(function (it, i) { var h = 160 * it[1] / max, x = x0 + i * (bw + gap); s += '<rect x="' + x + '" y="' + (base - h) + '" width="' + bw + '" height="' + h + '" rx="5" class="' + (d.hl === i || d.hl === undefined ? 'dg-bar' : 'dg-bar dim') + '"/>' + txt(x + bw / 2, base + 18, it[0], { size: 11.5, maxCh: Math.floor(bw / 6) }) + (it[2] ? txt(x + bw / 2, base - h - 12, it[2], { size: 11.5, bold: true, nowrap: true }) : ''); });
      if (d.line) { var ly = base - 160 * d.line[0] / max; s += '<line x1="30" y1="' + ly + '" x2="' + (W - 30) + '" y2="' + ly + '" class="dg-dash"/>' + txt(W - 32, ly - 10, d.line[1], { anchor: 'end', cls: 'dg-s', size: 11.5, nowrap: true }); }
      if (d.title) s = txt(W / 2, 12, d.title, { bold: true, size: 13, maxCh: 80 }) + s;
      return svgWrap(base + 40, s);
    },
    stack: function (d) {
      var tot = d.items.reduce(function (a, x) { return a + x[1]; }, 0), x = 20, w = W - 40, s = '';
      d.items.forEach(function (it, i) { var ww = w * it[1] / tot; s += '<rect x="' + x + '" y="40" width="' + (ww - 3) + '" height="56" rx="6" class="dg-seg s' + (i % 5) + '"/>' + txt(x + ww / 2, 68, it[0], { size: 11.5, bold: true, maxCh: Math.max(5, Math.floor(ww / 6.4)) }); x += ww; });
      if (d.limit) s += '<line x1="' + (W - 20) + '" y1="22" x2="' + (W - 20) + '" y2="112" class="dg-dash"/>' + txt(W - 24, 16, d.limit, { anchor: 'end', cls: 'dg-s', size: 11.5, nowrap: true });
      if (d.note) s += txt(W / 2, 128, d.note, { cls: 'dg-s', size: 11.5, maxCh: 95 });
      return svgWrap(d.note ? 144 : 120, s);
    },
    ladder: function (d) {
      var n = d.items.length, sw = (W - 40) / n, inc = Math.min(22, 130 / n), base = 66, tallest = base + (n - 1) * inc, s = '';
      d.items.forEach(function (it, i) { var hh = base + i * inc, x = 20 + i * sw, y = 16 + tallest - hh; s += box(x, y, sw - 6, hh, it, { cls: d.hl === i ? 'dg-b hl' : 'dg-b', size: n > 6 ? 11.5 : 12.5 }); });
      if (d.note) s += txt(W / 2, 36 + tallest, d.note, { cls: 'dg-s', size: 11.5, maxCh: 95 });
      return svgWrap(44 + tallest + (d.note ? 22 : 0), s);
    },
    scatter: function (d) {
      var s = '', cs = [[180, 110], [500, 120], [340, 230]];
      d.clusters.forEach(function (c, i) { var p = cs[i]; s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="135" ry="62" class="dg-c"/>' + txt(p[0], p[1] - 76, c.label, { bold: true, size: 12.5, nowrap: true });
        c.pts.forEach(function (t, j) { var a = j * 2.2, px = p[0] + Math.cos(a) * 62 - 20, py = p[1] + Math.sin(a) * 26; s += '<circle cx="' + px + '" cy="' + py + '" r="4" class="dg-dot"/>' + txt(px + 8, py, t, { anchor: 'start', size: 11, nowrap: true }); }); });
      if (d.star) { var p = cs[d.starIn || 0]; s += txt(p[0] + 48, p[1] + 22, '★', { cls: 'dg-star', size: 22, nowrap: true }) + '<line x1="' + (p[0] + 48) + '" y1="' + (p[1] + 34) + '" x2="' + (p[0] + 30) + '" y2="' + (p[1] + 82) + '" class="dg-a"/>' + txt(p[0] + 30, p[1] + 94, 'question: ' + d.star, { size: 11.5, bold: true, nowrap: true }); }
      return svgWrap(d.clusters.length > 2 ? 320 : 228, s);
    },
    curve: function (d) {
      var s = '<line x1="60" y1="210" x2="640" y2="210" class="dg-axis"/><line x1="60" y1="20" x2="60" y2="210" class="dg-axis"/>' +
        '<path d="M70,60 C200,150 400,190 630,200" class="dg-line"/><path d="M70,70 C220,170 300,175 360,160 S560,80 630,40" class="dg-line b"/>' +
        '<line x1="340" y1="25" x2="340" y2="210" class="dg-dash"/>' + txt(340, 16, 'sweet spot', { bold: true, size: 12, nowrap: true }) +
        txt(560, 214 - 30, 'training error', { size: 11.5, cls: 'dg-s', nowrap: true }) + txt(560, 60, 'validation error', { size: 11.5, nowrap: true, bold: true }) +
        txt(150, 228, '← underfit (bias)', { size: 11.5, cls: 'dg-s', nowrap: true }) + txt(540, 228, 'overfit (variance) →', { size: 11.5, cls: 'dg-s', nowrap: true }) + txt(350, 246, 'model complexity', { size: 12, bold: true, nowrap: true });
      return svgWrap(256, s);
    },
    arrows: function (d) {
      var s = '';
      d.rows.forEach(function (r, i) { var y = 34 + i * 96; s += box(30, y, 150, 50, r.left) + box(W - 180, y, 150, 50, r.right) + txt(W / 2, y - 6, r.label, { bold: true, size: 12.5, nowrap: true });
        s += '<line x1="190" y1="' + (y + (r.two ? 18 : 25)) + '" x2="' + (W - 192) + '" y2="' + (y + (r.two ? 18 : 25)) + '" class="dg-a" marker-end="url(#dgArr)"/>';
        if (r.two) s += '<line x1="' + (W - 190) + '" y1="' + (y + 34) + '" x2="192" y2="' + (y + 34) + '" class="dg-a" marker-end="url(#dgArr)"/>';
        if (r.note) s += txt(W / 2, y + 62, r.note, { cls: 'dg-s', size: 11, maxCh: 50 }); });
      return svgWrap(40 + d.rows.length * 96, s);
    },
    waterfall: function (d) {
      var n = d.items.length, max = d.items[0][1], bw = (W - 80) / n - 14, x0 = 40, base = 210, sc = 170 / max, cur = 0, s = '<line x1="30" y1="' + base + '" x2="' + (W - 30) + '" y2="' + base + '" class="dg-axis"/>';
      d.items.forEach(function (it, i) { var v = it[1], x = x0 + i * (bw + 14), y, h, cls;
        if (i === 0 || it[2] === 'total') { y = base - v * sc; h = v * sc; cur = v; cls = 'dg-bar'; } else { h = Math.abs(v) * sc; y = base - cur * sc; cur += v; cls = 'dg-bar neg'; }
        s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="4" class="' + cls + '"/>' + txt(x + bw / 2, base + 18, it[0], { size: 11, maxCh: Math.floor(bw / 5.8) }) + txt(x + bw / 2, y - 10, (i && it[2] !== 'total' ? '−' : '') + Math.abs(v), { size: 11, bold: true, nowrap: true }); });
      return svgWrap(base + 46, s);
    },
    dial: function (d) {
      var cx = W / 2, cy = 170, r = 130, s = '<path d="M' + (cx - r) + ',' + cy + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + r) + ',' + cy + '" class="dg-arc"/>';
      var a = Math.PI * (1 - (d.at || 0.5)), nx = cx + (r - 18) * Math.cos(a), ny = cy - (r - 18) * Math.sin(a);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + nx + '" y2="' + ny + '" class="dg-needle"/><circle cx="' + cx + '" cy="' + cy + '" r="7" class="dg-dot"/>';
      s += txt(cx - r - 10, cy + 16, d.left, { anchor: 'middle', size: 11.5, maxCh: 18, cls: 'dg-s' }) + txt(cx + r + 10, cy + 16, d.right, { size: 11.5, maxCh: 18, cls: 'dg-s' }) + txt(nx, ny - 22, d.needle, { bold: true, size: 12, maxCh: 30 });
      return svgWrap(cy + 44, s);
    },
    fraction: function (d) {
      var s = txt(W / 2, 40, d.top, { bold: true, size: 17, maxCh: 70 }) + '<line x1="110" y1="72" x2="' + (W - 110) + '" y2="72" class="dg-frac"/>' + txt(W / 2, 104, d.bottom, { bold: true, size: 20, maxCh: 60, cls: 'dg-t hlt' });
      if (d.note) s += txt(W / 2, 138, d.note, { cls: 'dg-s', size: 11.5, maxCh: 90 });
      return svgWrap(d.note ? 152 : 124, s);
    },
    sum: function (d) {
      var s = '';
      d.lines.forEach(function (l, i) { s += '<text x="40" y="' + (30 + i * 30) + '" class="dg-mono' + (i === d.lines.length - 1 ? ' hlt' : '') + '" font-size="15">' + esc(l) + '</text>'; });
      return svgWrap(18 + d.lines.length * 30, s);
    },
    compare: function (d) {
      var cw = (W - 60) / d.cols.length, s = '';
      d.cols.forEach(function (c, i) { var x = 20 + i * (cw + 10); s += box(x, 12, cw, 44, c.title, { cls: 'dg-b hl' });
        c.items.forEach(function (it, j) { s += box(x + 8, 66 + j * 40, cw - 16, 32, it, { cls: 'dg-b lt', size: 11.5 }); }); });
      var rows = Math.max.apply(null, d.cols.map(function (c) { return c.items.length; }));
      return svgWrap(76 + rows * 40, s);
    }
  };
  function diagram(json, caption) {
    try { var d = JSON.parse(json); var fn = D[d.t]; if (!fn) throw new Error('type ' + d.t); return '<figure class="ndraw"><span>✎ Diagram</span>' + fn(d) + (d.cap ? '<figcaption>' + inline(d.cap) + '</figcaption>' : '') + '</figure>'; }
    catch (e) { return '<div class="ndraw"><span>✎ Draw this</span>' + inline(caption || json) + '</div>'; }
  }

  /* ---------- page renderer ---------- */
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
      else if (l.indexOf('✎ ') === 0) { close(); var body = l.slice(2).trim(); out += body.charAt(0) === '{' ? diagram(body) : diagram('{}', body); }
      else { close(); out += '<p>' + inline(l) + '</p>'; }
    });
    close(); return out;
  }

  /* ---------- styles ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.nlist{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:18px}',
    '.nitem{display:flex;gap:10px;align-items:flex-start;text-align:left;cursor:pointer;border:1px solid var(--line);border-radius:12px;background:var(--surf);padding:14px;color:var(--tx);font:inherit}',
    '.nitem:hover{border-color:var(--acc)}',
    '.nitem .nm{flex:none;width:30px;height:30px;border-radius:8px;background:var(--surf2);display:grid;place-items:center;font-family:var(--mono);font-weight:800;font-size:12.5px;color:var(--tx2)}',
    '.nitem.dn .nm{background:var(--acc);color:var(--onfill,#fff)}',
    '.nitem h3{font-size:14px;margin:5px 0 0;font-weight:650;line-height:1.35}',
    '.paper{position:relative;max-width:800px;margin:18px 0;padding:28px 32px 30px 56px;border:1px solid var(--line);border-radius:14px;background:var(--surf);box-shadow:var(--shadow);background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 29px,color-mix(in srgb,var(--acc) 8%,transparent) 29px,color-mix(in srgb,var(--acc) 8%,transparent) 30px);line-height:30px;font-size:15.5px}',
    '.paper::before{content:"";position:absolute;left:38px;top:0;bottom:0;width:1px;background:color-mix(in srgb,#d9534f 45%,transparent)}',
    '.paper h2{font-size:22px;margin:0 0 6px;line-height:1.3}',
    '.paper h3{font-size:16px;margin:20px 0 2px;color:var(--acc2);line-height:30px}',
    '.paper ul,.paper ol{margin:0;padding-left:20px}.paper ol{list-style:none;padding-left:4px}',
    '.paper li{margin:0}.paper p{margin:2px 0 4px}',
    '.paper .nn{display:inline-block;min-width:22px;font-family:var(--mono);font-weight:700;color:var(--acc2)}',
    '.paper b{color:var(--tx);font-weight:700}',
    '.nw{margin:8px 0;padding:4px 12px;border-left:3px solid var(--gold,#b8860b);background:color-mix(in srgb,var(--gold,#b8860b) 10%,transparent);border-radius:0 8px 8px 0;line-height:1.6}',
    '.nsay,.ndraw{margin:16px 0 6px;padding:8px 12px;border-radius:10px;line-height:1.6}',
    '.nsay{background:var(--accwash);border:1px solid color-mix(in srgb,var(--acc) 35%,transparent);font-style:italic}',
    '.ndraw{border:1.5px dashed var(--line2);background:var(--surf);break-inside:avoid;page-break-inside:avoid}',
    '.ndraw figcaption{font-size:13px;color:var(--tx2);text-align:center;line-height:1.5;margin-top:4px}',
    '.nsay>span,.ndraw>span{display:block;font-style:normal;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:2px}',
    'svg.dg{width:100%;height:auto;display:block;font-family:var(--sans,system-ui,sans-serif)}',
    '.dg-b{fill:var(--surf2);stroke:var(--line2);stroke-width:1.2}.dg-b.hl{fill:var(--accwash);stroke:var(--acc)}.dg-b.lt{fill:var(--surf)}',
    '.dg-t{fill:var(--tx)}.dg-s{fill:var(--tx2)}.dg-t.hlt,.dg-mono.hlt{fill:var(--acc2)}',
    '.dg-a{stroke:var(--tx3);stroke-width:1.6;fill:none}.dg-ah{fill:var(--tx3)}',
    '.dg-c{fill:color-mix(in srgb,var(--acc) 7%,transparent);stroke:var(--acc);stroke-width:1.2;stroke-dasharray:4 4}',
    '.dg-tri{fill:color-mix(in srgb,#d9534f 8%,transparent);stroke:#d9534f;stroke-width:1.6}',
    '.dg-cell{fill:var(--surf);stroke:var(--line2)}.dg-head{fill:var(--accwash);stroke:var(--line2)}',
    '.dg-axis{stroke:var(--tx3);stroke-width:1.2}.dg-dash{stroke:var(--gold,#b8860b);stroke-width:1.4;stroke-dasharray:6 5}',
    '.dg-bar{fill:var(--acc)}.dg-bar.dim{fill:var(--line2)}.dg-bar.neg{fill:#d9534f;opacity:.75}',
    '.dg-seg{stroke:var(--surf);stroke-width:1}.dg-seg.s0{fill:color-mix(in srgb,var(--acc) 30%,var(--surf))}.dg-seg.s1{fill:color-mix(in srgb,var(--acc) 45%,var(--surf))}.dg-seg.s2{fill:color-mix(in srgb,var(--acc) 60%,var(--surf))}.dg-seg.s3{fill:color-mix(in srgb,var(--gold,#b8860b) 40%,var(--surf))}.dg-seg.s4{fill:color-mix(in srgb,var(--gold,#b8860b) 60%,var(--surf))}',
    '.dg-dot{fill:var(--acc)}.dg-star{fill:var(--gold,#b8860b)}',
    '.dg-line{fill:none;stroke:var(--tx3);stroke-width:2.2}.dg-line.b{stroke:var(--acc);stroke-width:2.6}',
    '.dg-arc{fill:none;stroke:var(--line2);stroke-width:14;stroke-linecap:round}.dg-needle{stroke:var(--acc);stroke-width:4;stroke-linecap:round}',
    '.dg-frac{stroke:var(--tx);stroke-width:2}.dg-mono{font-family:var(--mono,monospace);fill:var(--tx)}',
    '.nbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;max-width:800px}',
    '.ntools{display:flex;gap:8px;flex-wrap:wrap}',
    '@media (max-width:600px){.paper{padding:18px 14px 20px 30px;font-size:15px;line-height:28px}.paper::before{left:20px}.nlist{grid-template-columns:1fr}}',
    /* print layout */
    'body.nprint .rail,body.nprint .topbar,body.nprint .mtab,body.nprint .mini,body.nprint .scrim,body.nprint #readbar,body.nprint .toast{display:none!important}',
    'html:has(body.nprint),body.nprint,body.nprint .app,body.nprint .content,body.nprint #view{background:#fff!important}'+
    'body.nprint .app{display:block!important}body.nprint .content{padding:0!important;max-width:none!important}',
    'body.nprint .paper{max-width:none;border:0;box-shadow:none;border-radius:0;margin:0 0 0 0;padding:6px 8px 10px 40px;break-after:page;page-break-after:always}',
    'body.nprint .paper:last-child{break-after:auto;page-break-after:auto}',
    'body.nprint .paper::before{left:22px}',
    '.ncover{padding:40px 8px;break-after:page;page-break-after:always}.ncover h1{font-size:34px;margin:0 0 8px}.ncover p{color:var(--tx2);font-size:15px;line-height:1.6}',
    '.ncover ol{font-size:14.5px;line-height:1.9;padding-left:22px}',
    '@media print{.rail,.topbar,.mtab,.mini,.nbar,.nhead,.scrim,#readbar{display:none!important}.app{display:block!important}.content{padding:0!important}.paper{box-shadow:none;border:0;max-width:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function pdfBtn(id, label) {
    if (!PDF) return '';
    return '<a class="btn ' + (id === 'all' ? 'pri' : 'ghost') + ' sm" href="' + PDF + '/' + id + '.pdf" download>' + svg2(IC.dl) + ' ' + label + '</a>';
  }
  function svg2(p) { return typeof window.svg === 'function' ? window.svg(p, 2) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">' + p + '</svg>'; }

  function list(v) {
    setCrumb('Notes');
    var done = getDone(), n = PAGES.filter(function (p) { return done[p[0]]; }).length;
    v.innerHTML = '<div class="page-in"><div class="eyebrow">Study notes · ' + n + ' of ' + PAGES.length + ' marked studied</div>' +
      '<h1 class="h-hero">Study notes</h1>' +
      '<p class="sub">One page per module with everything you need to know, written to study from or copy by hand. Every page ends with a line to say out loud and diagrams to remember it by.</p>' +
      '<div class="ntools" style="margin-top:14px">' + pdfBtn('all', 'Download all notes (PDF)') + '</div>' +
      '<div class="nlist">' + PAGES.map(function (p) {
        var num = modNum[p[0]] || (p[0] === 'play' ? 'F' : '');
        return '<button class="nitem' + (done[p[0]] ? ' dn' : '') + '" onclick="go(\'notes/' + p[0] + '\')"><span class="nm">' + (done[p[0]] ? '✓' : esc(num)) + '</span><h3>' + esc(p[1]) + '</h3></button>';
      }).join('') + '</div></div>';
  }

  function paperHtml(p) { return '<div class="paper"><h2>' + esc(p[1]) + '</h2>' + render(p[2]) + '</div>'; }

  function page(v, id) {
    var ix = -1; PAGES.forEach(function (p, i) { if (p[0] === id) ix = i; });
    if (ix < 0) { go('notes'); return; }
    var p = PAGES[ix], done = getDone(), prev = PAGES[ix - 1], next = PAGES[ix + 1];
    var num = modNum[p[0]] ? 'Module ' + modNum[p[0]] : 'Frameworks';
    setCrumb('<b onclick="go(\'notes\')" style="cursor:pointer">Notes</b> / ' + esc(p[1]));
    v.innerHTML = '<div class="page-in">' +
      '<div class="nbar nhead"><div class="eyebrow">' + num + ' · page ' + (ix + 1) + ' of ' + PAGES.length + '</div>' +
      '<div class="ntools">' + pdfBtn(p[0], 'PDF') + pdfBtn('all', 'All notes') + '</div></div>' +
      paperHtml(p) +
      '<div class="nbar">' +
        (prev ? '<button class="btn ghost" onclick="go(\'notes/' + prev[0] + '\')">← ' + esc(prev[1]) + '</button>' : '<span></span>') +
        '<button class="btn ' + (done[p[0]] ? 'ghost' : 'pri') + '" id="nDone">' + svg2(IC.check) + ' ' + (done[p[0]] ? 'Studied' : 'Mark as studied') + '</button>' +
        (next ? '<button class="btn ghost" onclick="go(\'notes/' + next[0] + '\')">' + esc(next[1]) + ' →</button>' : '<button class="btn ghost" onclick="go(\'notes\')">All notes →</button>') +
      '</div></div>';
    document.getElementById('nDone').onclick = function () {
      var d = getDone(); d[p[0]] = !d[p[0]]; setDone(d);
      if (d[p[0]] && typeof addXP === 'function') { touchStreak(); addXP(10, 'Notes studied'); }
      page(v, id);
    };
  }

  function printView(v, id) {
    document.body.classList.add('nprint');
    var course = window.NOTES_TITLE || document.title.split(/\s+[\u2014-]\s+/)[0];
    if (id === 'all') {
      v.innerHTML = '<div class="ncover"><div class="eyebrow">Study notes</div><h1>' + esc(course.trim()) + '</h1>' +
        '<p>Every module on one page each, with diagrams. Each page ends with a line to say out loud in an interview.</p><ol>' +
        PAGES.map(function (p) { return '<li>' + esc(p[1]) + '</li>'; }).join('') + '</ol></div>' + PAGES.map(paperHtml).join('');
    } else {
      var p = PAGES.filter(function (x) { return x[0] === id; })[0];
      v.innerHTML = p ? paperHtml(p) : '';
    }
    window.__notesReady = true;
  }
  window.addEventListener('hashchange', function () { if (location.hash.indexOf('#notes/print') !== 0) document.body.classList.remove('nprint'); });

  window.viewNotes = function (v, id) {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    if (id === 'print') printView(v, parts[2] || 'all');
    else if (id) page(v, id); else list(v);
  };
})();
