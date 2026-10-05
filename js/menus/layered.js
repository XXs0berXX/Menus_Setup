/*
 * ANXIETY / STRESS — layered "focus" menu (reduced-choice first layer).
 * Pre-established pattern: Training Wheels (Carroll & Carrithers, 1984) and
 * multi-layer interfaces (Shneiderman, 2003).
 *
 * Design moves, each tied to the rationale in README.md:
 *  - First layer shows only EM.primary (4 items): fewer alternatives -> faster,
 *    less effortful choice (Hick-Hyman) when anxiety has eaten working memory
 *    (Eysenck et al., 2007).
 *  - Large targets, fixed order, no motion: nothing moves or surprises
 *    (anxiety primes uncertainty reduction; Raghunathan & Pham, 1999).
 *  - Everything else is one disclosure away, never removed, and only one
 *    department is open at a time, so no screen shows more than ~7 choices.
 */
EM.menus.layered = {
  label: 'Layered focus menu',
  mount: function (slot) {
    var h = EM.h;
    var isOpen = false;
    var off = null;

    var trigger = h('button', { type: 'button', class: 'lay-trigger', 'aria-expanded': 'false', 'aria-controls': 'lay-panel' }, [
      h('span', { class: 'lay-burger', 'aria-hidden': 'true' }, [h('span'), h('span'), h('span')]), 'Menu'
    ]);

    var primaryList = h('div', { class: 'lay-primary-list' });
    EM.primary.forEach(function (ref) {
      var cat = EM.findCategory(ref[0]);
      var item = EM.findItem(ref[0], ref[1]);
      if (!item) return;
      primaryList.append(h('button', {
        type: 'button', class: 'lay-primary',
        onclick: function () { close(false); EM.navigate(cat.id, item.id, 'primary layer'); }
      }, [h('span', { class: 'lay-primary-label', text: item.label }), EM.chevron('right')]));
    });

    var moreBody = h('div', { class: 'lay-more-body', hidden: true });
    var moreBtn = h('button', { type: 'button', class: 'lay-more', 'aria-expanded': 'false' }, [
      h('span', { text: 'More options' }), EM.chevron('down')
    ]);
    moreBtn.addEventListener('click', function () {
      var show = moreBody.hidden;
      moreBody.hidden = !show;
      moreBtn.setAttribute('aria-expanded', String(show));
      EM.log(show ? 'expand' : 'back', { detail: 'more options' });
      if (!show) collapseAll();
    });

    var sections = [];
    EM.categories.forEach(function (cat) {
      var items = h('div', { class: 'lay-items', hidden: true });
      cat.items.forEach(function (item) {
        items.append(h('button', {
          type: 'button', class: 'lay-item', text: item.label,
          onclick: function () { close(false); EM.navigate(cat.id, item.id, 'more options'); }
        }));
      });
      var head = h('button', { type: 'button', class: 'lay-cat', 'aria-expanded': 'false' }, [
        h('span', { text: cat.label }), EM.chevron('down')
      ]);
      head.addEventListener('click', function () {
        var show = items.hidden;
        collapseAll();
        if (show) {
          items.hidden = false;
          head.setAttribute('aria-expanded', 'true');
          items.lastChild.scrollIntoView({ block: 'nearest' });
          EM.log('expand', { category: cat.id });
        } else {
          EM.log('back', { category: cat.id });
        }
      });
      sections.push({ head: head, items: items });
      moreBody.append(h('div', { class: 'lay-section' }, [head, items]));
    });

    function collapseAll() {
      sections.forEach(function (s) {
        s.items.hidden = true;
        s.head.setAttribute('aria-expanded', 'false');
      });
    }

    var panel = h('div', { class: 'lay-panel', id: 'lay-panel', hidden: true }, [
      h('p', { class: 'lay-title', text: 'What would you like to do?' }),
      primaryList,
      moreBtn,
      moreBody
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
      moreBody.hidden = true;
      moreBtn.setAttribute('aria-expanded', 'false');
      collapseAll();
      if (off) { off(); off = null; }
    }

    slot.append(h('div', { class: 'lay-wrap' }, [trigger, panel]));
  }
};
