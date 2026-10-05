/*
 * JOY / CURIOSITY — mega menu (broad, everything visible at once).
 * Pre-established pattern: mega drop-down menus (Nielsen, 2009).
 *
 * Design moves, each tied to the rationale in README.md:
 *  - Positive emotions broaden attention and the urge to explore
 *    (Fredrickson, 2001) and favour breadth-first thinking with more tolerance
 *    for complexity (Norman, 2002). The whole site is laid out in one
 *    two-dimensional panel, so the menu itself invites browsing.
 *  - Positive affect increases variety-seeking among safe, enjoyable options
 *    (Kahn & Isen, 1993): "New" and "Popular" tags and a one-click random
 *    department give that urge somewhere to go.
 *  - Flat: every one of the 36 pages is a single click after opening.
 */
EM.menus.mega = {
  label: 'Mega menu',
  mount: function (slot) {
    var h = EM.h;
    var isOpen = false;
    var off = null;

    var trigger = h('button', { type: 'button', class: 'mega-trigger', 'aria-expanded': 'false', 'aria-controls': 'mega-panel' }, [
      'Browse everything', EM.chevron('down')
    ]);

    var cols = h('div', { class: 'mega-cols' });
    EM.categories.forEach(function (cat) {
      var links = h('ul', { class: 'mega-links' });
      cat.items.forEach(function (item) {
        links.append(h('li', null, h('button', {
          type: 'button', class: 'mega-link',
          onclick: function () { close(false); EM.navigate(cat.id, item.id); }
        }, [
          item.label,
          item.badge ? h('span', { class: 'mega-badge mega-badge-' + item.badge.toLowerCase(), text: item.badge }) : null
        ])));
      });
      cols.append(h('section', { class: 'mega-col' }, [
        h('p', { class: 'mega-col-head' }, [h('span', { class: 'mega-col-icon' }, EM.icon(cat.icon, 18)), cat.label]),
        links
      ]));
    });

    var surprise = h('button', {
      type: 'button', class: 'mega-surprise',
      onclick: function () {
        var cat = EM.categories[Math.floor(Math.random() * EM.categories.length)];
        var item = cat.items[Math.floor(Math.random() * cat.items.length)];
        close(false);
        EM.navigate(cat.id, item.id, 'surprise me');
      }
    }, 'Surprise me');

    var panel = h('div', { class: 'mega-panel', id: 'mega-panel', hidden: true }, [
      cols,
      h('div', { class: 'mega-foot' }, [
        h('span', { text: 'Not sure what you want yet? Wander a little.' }),
        surprise
      ])
    ]);

    trigger.addEventListener('click', function () { isOpen ? close(true) : open(); });

    function open() {
      isOpen = true;
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      EM.log('open');
      off = EM.onDismiss([panel, trigger], function () { close(true); });
    }

    function close(dismissed) {
      if (!isOpen) return;
      isOpen = false;
      if (dismissed) EM.log('close');
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (off) { off(); off = null; }
    }

    slot.append(trigger, panel);
  }
};
