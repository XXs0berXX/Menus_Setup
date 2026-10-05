/*
 * Shared helpers: DOM builder, icons, outside-click handling, event logger.
 * Loaded before any menu file.
 */
window.EM = window.EM || {};
EM.menus = {};

/* ---------- DOM ---------- */

EM.h = function (tag, attrs, children) {
  var el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === false || v == null) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
  }
  [].concat(children || []).forEach(function (c) {
    if (c == null || c === false) return;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  });
  return el;
};

EM.icon = function (name, size) {
  var ns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size || 20);
  svg.setAttribute('height', size || 20);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'icon');
  var p = document.createElementNS(ns, 'path');
  p.setAttribute('d', EM.icons[name] || '');
  svg.append(p);
  return svg;
};

EM.chevron = function (dir) {
  var paths = { down: 'M6 9l6 6 6-6', right: 'M9 6l6 6-6 6', left: 'M15 6l-6 6 6 6' };
  var ns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', 16);
  svg.setAttribute('height', 16);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'icon chevron');
  var p = document.createElementNS(ns, 'path');
  p.setAttribute('d', paths[dir || 'down']);
  svg.append(p);
  return svg;
};

/* Calls fn when a pointerdown happens outside every element in els, or on Escape. */
EM.onDismiss = function (els, fn) {
  els = [].concat(els);
  function onPointer(e) {
    if (!els.some(function (el) { return el && el.contains(e.target); })) fn('outside');
  }
  function onKey(e) { if (e.key === 'Escape') fn('escape'); }
  document.addEventListener('pointerdown', onPointer, true);
  document.addEventListener('keydown', onKey);
  return function off() {
    document.removeEventListener('pointerdown', onPointer, true);
    document.removeEventListener('keydown', onKey);
  };
};

/* ---------- Logger ----------
 * Every menu reports the same event vocabulary so conditions are comparable:
 *   open     menu became visible
 *   expand   user went one level deeper (category, "More options", ...)
 *   back     user went one level up
 *   select   user reached a destination page
 *   close    menu dismissed without a selection
 *   query    search text submitted (palette only)
 * ms_since_open is measured from the most recent "open".
 * The log survives page reloads (localStorage) until cleared.
 */
(function () {
  var KEY = 'emotion-menus-log-v1';
  var events = [];
  var openedAt = null;

  try { events = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { events = []; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (e) { /* storage unavailable */ }
  }

  EM.log = function (type, data) {
    data = data || {};
    var now = performance.now();
    if (type === 'open') openedAt = now;
    var ev = {
      timestamp: new Date().toISOString(),
      participant: EM.participant || '',
      menu: EM.menuId || '',
      event: type,
      category: data.category || '',
      item: data.item || '',
      ms_since_open: openedAt == null ? '' : Math.round(now - openedAt),
      detail: data.detail || ''
    };
    events.push(ev);
    save();
    if (type === 'select' || type === 'close') openedAt = null;
    if (EM.onLog) EM.onLog(ev, events);
    return ev;
  };

  EM.getLog = function () { return events.slice(); };

  EM.clearLog = function () {
    events = [];
    openedAt = null;
    save();
    if (EM.onLog) EM.onLog(null, events);
  };

  EM.downloadLog = function () {
    var cols = ['timestamp', 'participant', 'menu', 'event', 'category', 'item', 'ms_since_open', 'detail'];
    var esc = function (v) {
      v = String(v == null ? '' : v);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    };
    var csv = [cols.join(',')].concat(events.map(function (ev) {
      return cols.map(function (c) { return esc(ev[c]); }).join(',');
    })).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'menu-log-' + new Date().toISOString().replace(/[:.]/g, '-') + '.csv';
    document.body.append(a);
    a.click();
    a.remove();
  };
})();

/* Recently visited pages, newest first (used by the palette's split section). */
EM.recents = [];
EM.pushRecent = function (catId, itemId) {
  EM.recents = EM.recents.filter(function (r) { return !(r[0] === catId && r[1] === itemId); });
  EM.recents.unshift([catId, itemId]);
  EM.recents = EM.recents.slice(0, 4);
};

EM.prefersReducedMotion = function () {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
