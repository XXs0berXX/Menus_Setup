/*
 * FRUSTRATION / ANGER — search-first command palette.
 * Pre-established pattern: type-to-jump command palette, with a "Recent"
 * section on top (the split-menu principle; Sears & Shneiderman, 1994).
 *
 * Design moves, each tied to the rationale in README.md:
 *  - The user states the goal instead of hunting for it: one step to any of
 *    the 36 pages, bypassing the hierarchy that just blocked them
 *    (frustration = blocked goal + lost time; Ceaparu et al., 2004).
 *  - Keyboard-first and user-driven (Ctrl/Cmd+K or "/" from anywhere):
 *    anger carries an appraisal of individual control and an approach
 *    motive (Lerner & Keltner, 2001; Carver & Harmon-Jones, 2009).
 *  - Synonyms in data.js so "refund" or "where is my order" still hit
 *    (vocabulary problem; Furnas et al., 1987).
 *  - With an empty query it still works as a plain grouped list, so typing is
 *    never forced.
 */
EM.menus.palette = {
  label: 'Search-first command palette',
  mount: function (slot) {
    var h = EM.h;
    var isOpen = false;
    var off = null;
    var active = 0;
    var results = [];
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');

    var trigger = h('button', { type: 'button', class: 'pal-trigger', 'aria-haspopup': 'dialog' }, [
      searchIcon(),
      h('span', { class: 'pal-trigger-text', text: 'Search or jump to…' }),
      h('kbd', { text: isMac ? '⌘K' : 'Ctrl K' })
    ]);

    var input = h('input', {
      type: 'text', class: 'pal-input', placeholder: 'Type where you want to go', autocomplete: 'off',
      'aria-label': 'Search pages', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'pal-list'
    });
    var list = h('div', { class: 'pal-list', id: 'pal-list', role: 'listbox' });
    var box = h('div', { class: 'pal-box', role: 'dialog', 'aria-label': 'Jump to a page' }, [
      h('div', { class: 'pal-input-row' }, [searchIcon(), input, h('kbd', { text: 'Esc' })]),
      list,
      h('div', { class: 'pal-foot' }, [
        h('span', null, [h('kbd', { text: '↑' }), h('kbd', { text: '↓' }), ' move']),
        h('span', null, [h('kbd', { text: 'Enter' }), ' open']),
        h('span', null, [h('kbd', { text: 'Esc' }), ' close'])
      ])
    ]);
    var overlay = h('div', { class: 'pal-overlay', hidden: true }, box);
    document.body.append(overlay);

    trigger.addEventListener('click', function () { open('click'); });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      var typing = tag === 'input' || tag === 'textarea';
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        isOpen ? input.focus() : open('shortcut');
      } else if (e.key === '/' && !typing && !isOpen) {
        e.preventDefault();
        open('shortcut');
      }
    });

    input.addEventListener('input', function () { active = 0; render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]); }
    });

    function open(how) {
      if (isOpen) return;
      isOpen = true;
      overlay.hidden = false;
      input.value = '';
      active = 0;
      render();
      input.focus();
      EM.log('open', { detail: how });
      off = EM.onDismiss(box, function () { close(true); });
    }

    function close(dismissed) {
      if (!isOpen) return;
      isOpen = false;
      if (dismissed) EM.log('close', { detail: input.value ? 'query: ' + input.value : '' });
      overlay.hidden = true;
      if (off) { off(); off = null; }
    }

    function choose(r) {
      if (!r) return;
      var q = input.value.trim();
      if (q) EM.log('query', { category: r.cat.id, item: r.item.id, detail: q });
      close(false);
      EM.navigate(r.cat.id, r.item.id, q ? 'search' : (r.recent ? 'recent' : 'browse list'));
    }

    function move(d) {
      if (!results.length) return;
      active = (active + d + results.length) % results.length;
      paintActive(true);
    }

    function score(cat, item, tokens) {
      var label = item.label.toLowerCase();
      var hay = [label, cat.label.toLowerCase()].concat(item.keywords || []).join(' | ');
      var total = 0;
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (label.indexOf(t) === 0) total += 4;
        else if (label.indexOf(' ' + t) >= 0) total += 3;
        else if (label.indexOf(t) >= 0) total += 2;
        else if (hay.indexOf(t) >= 0) total += 1;
        else return 0;
      }
      return total;
    }

    function render() {
      var q = input.value.trim().toLowerCase();
      list.replaceChildren();
      results = [];

      if (!q) {
        if (EM.recents.length) {
          list.append(h('div', { class: 'pal-group', text: 'Recent' }));
          EM.recents.forEach(function (ref) {
            addRow(EM.findCategory(ref[0]), EM.findItem(ref[0], ref[1]), '', true);
          });
        }
        EM.categories.forEach(function (cat) {
          list.append(h('div', { class: 'pal-group', text: cat.label }));
          cat.items.forEach(function (item) { addRow(cat, item, '', false, true); });
        });
      } else {
        var tokens = q.split(/\s+/);
        var scored = [];
        EM.categories.forEach(function (cat) {
          cat.items.forEach(function (item) {
            var s = score(cat, item, tokens);
            if (s > 0) scored.push({ cat: cat, item: item, s: s });
          });
        });
        scored.sort(function (a, b) { return b.s - a.s; });
        if (!scored.length) {
          list.append(h('div', { class: 'pal-empty', text: 'No page matches "' + input.value.trim() + '". Try a different word.' }));
        }
        scored.forEach(function (r) { addRow(r.cat, r.item, tokens[0]); });
      }
      if (active >= results.length) active = 0;
      paintActive(true);
    }

    function addRow(cat, item, hl, recent, grouped) {
      var idx = results.length;
      var row = h('div', { class: 'pal-row', role: 'option', id: 'pal-opt-' + idx }, [
        h('span', { class: 'pal-row-label' }, highlight(item.label, hl)),
        grouped ? null : h('span', { class: 'pal-row-path', text: cat.label })
      ]);
      row.addEventListener('mousemove', function () { if (active !== idx) { active = idx; paintActive(); } });
      row.addEventListener('click', function () { choose(results[idx]); });
      results.push({ cat: cat, item: item, row: row, recent: !!recent });
      list.append(row);
    }

    function paintActive(scroll) {
      results.forEach(function (r, i) {
        var on = i === active;
        r.row.classList.toggle('is-active', on);
        r.row.setAttribute('aria-selected', String(on));
        if (on) {
          input.setAttribute('aria-activedescendant', r.row.id);
          if (scroll) r.row.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function highlight(text, token) {
      if (!token) return [text];
      var i = text.toLowerCase().indexOf(token);
      if (i < 0) return [text];
      return [text.slice(0, i), h('mark', { text: text.slice(i, i + token.length) }), text.slice(i + token.length)];
    }

    function searchIcon() {
      var ns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', 18);
      svg.setAttribute('height', 18);
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'icon');
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M20 20l-4-4');
      svg.append(p);
      return svg;
    }

    slot.append(trigger);
  }
};
