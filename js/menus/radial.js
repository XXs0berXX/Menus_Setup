/*
 * BOREDOM — radial (pie) menu with an animated reveal.
 * Pre-established pattern: pie menus (Callahan, Hopkins, Weiser & Shneiderman, 1988).
 *
 * Design moves, each tied to the rationale in README.md:
 *  - Boredom is under-arousal plus failure to engage attention (Eastwood et
 *    al., 2012); bored people seek out more stimulating input (Bryant &
 *    Zillmann, 1984). The pie is spatial, novel for most users and animated,
 *    which raises stimulation without adding choices or steps.
 *  - Pie menus are rated more favourably and more enjoyable than linear or
 *    panel menus (Murano & Khan, 2015; Mao et al., 2024) while keeping speed
 *    and error rate at least as good (Callahan et al., 1988).
 *  - Every wedge is the same distance from the hub and equally large
 *    (Fitts's law); 6 wedges per ring stays inside the 8-item comfort limit.
 */
EM.menus.radial = {
  label: 'Radial (pie) menu',
  mount: function (slot) {
    var h = EM.h;
    var NS = 'http://www.w3.org/2000/svg';
    var R = 170;   // outer radius
    var R0 = 56;   // inner radius (hub edge)
    var isOpen = false;
    var off = null;
    var cx = 0;
    var cy = 0;
    var wedges = [];
    var hubLabel = null;
    var hubSub = null;
    var hubDefault = '';
    var hubAction = null;

    var trigger = h('button', { type: 'button', class: 'rad-trigger', 'aria-haspopup': 'menu' }, [
      h('span', { class: 'rad-trigger-dot', 'aria-hidden': 'true' }), 'Menu'
    ]);
    var overlay = h('div', { class: 'rad-overlay', hidden: true });
    var svg = el('svg', { class: 'rad-svg', role: 'menu', 'aria-label': 'Radial menu' });
    var ring = el('g', { class: 'rad-ring' });
    svg.append(ring);
    overlay.append(svg);
    document.body.append(overlay);

    trigger.addEventListener('click', open);

    svg.addEventListener('keydown', function (e) {
      var i = wedges.indexOf(document.activeElement);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); focusWedge(i + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); focusWedge(i - 1); }
      else if (e.key === 'Backspace') { e.preventDefault(); if (hubAction) hubAction(); }
    });

    // Opens centred in the area below the header. Classic pie menus pop up at
    // the pointer, but the trigger sits at the top edge where a 170px pie
    // cannot be centred on it, and an off-centre pie would land the pointer
    // on a wedge. A fixed centre also keeps every trial identical.
    function open() {
      if (isOpen) return;
      isOpen = true;
      var top = document.querySelector('.site-header').getBoundingClientRect().bottom;
      cx = Math.round(window.innerWidth / 2);
      cy = Math.round(Math.max(top + (window.innerHeight - top) / 2, top + R + 16));
      overlay.hidden = false;
      showDepartments();
      EM.log('open');
      off = EM.onDismiss(ring, function () { close(true); });
    }

    function close(dismissed) {
      if (!isOpen) return;
      isOpen = false;
      if (dismissed) EM.log('close');
      overlay.hidden = true;
      if (off) { off(); off = null; }
      trigger.focus({ preventScroll: true });
    }

    function showDepartments() {
      drawRing(EM.categories.map(function (cat) {
        return {
          label: cat.label, icon: cat.icon,
          pick: function () {
            EM.log('expand', { category: cat.id });
            showPages(cat);
          }
        };
      }), 'Menu', 'close', function () { close(true); });
    }

    function showPages(cat) {
      drawRing(cat.items.map(function (item) {
        return {
          label: item.label,
          pick: function () { close(false); EM.navigate(cat.id, item.id); }
        };
      }), cat.label, 'back', function () {
        EM.log('back', { category: cat.id });
        showDepartments();
      });
    }

    function drawRing(entries, centreText, centreSub, centreAction) {
      ring.replaceChildren();
      wedges = [];
      var n = entries.length;
      var step = (Math.PI * 2) / n;
      var gap = 0.014;
      var animate = !EM.prefersReducedMotion();

      entries.forEach(function (entry, i) {
        var a0 = -Math.PI / 2 - step / 2 + i * step + gap;
        var a1 = a0 + step - gap * 2;
        var mid = (a0 + a1) / 2;
        var rm = (R0 + R) / 2 + 6;
        var lx = cx + rm * Math.cos(mid);
        var ly = cy + rm * Math.sin(mid);

        var g = el('g', { class: 'rad-wedge', tabindex: '0', role: 'menuitem', 'aria-label': entry.label });
        g.style.transformOrigin = cx + 'px ' + cy + 'px';
        g.append(el('path', { d: sector(R0, R, a0, a1), class: 'rad-wedge-bg' }));

        var lines = wrap(entry.label);
        var textY = ly - ((lines.length - 1) * 15) / 2 + 5;
        if (entry.icon) {
          var ic = el('g', { class: 'rad-icon', transform: 'translate(' + (lx - 11) + ' ' + (ly - 30) + ') scale(0.92)' });
          ic.append(el('path', { d: EM.icons[entry.icon] }));
          g.append(ic);
          textY = ly + 8;
        }
        var text = el('text', { x: lx, y: textY, class: 'rad-label', 'text-anchor': 'middle' });
        lines.forEach(function (line, li) {
          var t = el('tspan', { x: lx, dy: li === 0 ? 0 : 15 });
          t.textContent = line;
          text.append(t);
        });
        g.append(text);

        g.addEventListener('click', entry.pick);
        g.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); entry.pick(); }
        });
        g.addEventListener('pointerenter', function () { setHub(entry.label); });
        g.addEventListener('pointerleave', function () { setHub(null); });
        g.addEventListener('focus', function () { setHub(entry.label); });

        if (animate) {
          g.classList.add('is-entering');
          g.style.transitionDelay = (i * 35) + 'ms';
        }
        ring.append(g);
        wedges.push(g);
      });

      var hub = el('g', { class: 'rad-hub', tabindex: '0', role: 'menuitem', 'aria-label': centreSub === 'back' ? 'Back' : 'Close menu' });
      hub.append(el('circle', { cx: cx, cy: cy, r: R0 - 3 }));
      hubLabel = el('text', { x: cx, y: cy - 2, class: 'rad-hub-label', 'text-anchor': 'middle' });
      hubSub = el('text', { x: cx, y: cy + 15, class: 'rad-hub-sub', 'text-anchor': 'middle' });
      hubSub.textContent = centreSub === 'back' ? '‹ back' : '× close';
      hub.append(hubLabel, hubSub);
      hub.addEventListener('click', centreAction);
      hub.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); centreAction(); }
      });
      ring.append(hub);
      hubDefault = centreText;
      hubAction = centreAction;
      setHub(null);

      if (animate) {
        // two frames so the browser paints the start state before transitioning
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            wedges.forEach(function (w) { w.classList.remove('is-entering'); });
          });
        });
      }
      wedges[0].focus({ preventScroll: true });
      setHub(null);
    }

    function setHub(label) {
      var lines = wrap(label || hubDefault);
      hubLabel.replaceChildren();
      lines.forEach(function (line, i) {
        var t = el('tspan', { x: cx, dy: i === 0 ? 0 : 14 });
        t.textContent = line;
        hubLabel.append(t);
      });
      hubLabel.setAttribute('y', cy - (lines.length > 1 ? 12 : 4));
      hubSub.setAttribute('y', cy + (lines.length > 1 ? 22 : 14));
      hubLabel.classList.toggle('is-hover', !!label);
    }

    function focusWedge(i) {
      if (!wedges.length) return;
      wedges[(i + wedges.length) % wedges.length].focus();
    }

    function sector(r0, r1, a0, a1) {
      var p = function (r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); };
      var large = a1 - a0 > Math.PI ? 1 : 0;
      return 'M' + p(r1, a0) + ' A' + r1 + ' ' + r1 + ' 0 ' + large + ' 1 ' + p(r1, a1) +
        ' L' + p(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 ' + large + ' 0 ' + p(r0, a0) + ' Z';
    }

    /* Split long labels onto two lines at the space closest to the middle. */
    function wrap(label) {
      if (label.length <= 12) return [label];
      var best = -1;
      for (var i = 0; i < label.length; i++) {
        if (label[i] === ' ' && (best < 0 || Math.abs(i - label.length / 2) < Math.abs(best - label.length / 2))) best = i;
      }
      return best < 0 ? [label] : [label.slice(0, best), label.slice(best + 1)];
    }

    function el(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    slot.append(trigger);
  }
};
