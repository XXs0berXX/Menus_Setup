/*
 * BASELINE / CONTROL — standard horizontal menu bar with linear drop-downs.
 * The conventional web pattern that every other condition is compared against.
 */
EM.menus.standard = {
  label: 'Standard drop-down (control)',
  mount: function (slot) {
    var h = EM.h;
    var bar = h('nav', { class: 'std-bar', 'aria-label': 'Main' });
    var openCat = null;
    var off = null;
    var entries = [];

    EM.categories.forEach(function (cat) {
      var btn = h('button', { type: 'button', class: 'std-trigger', 'aria-expanded': 'false' }, [cat.label, EM.chevron('down')]);
      var list = h('ul', { class: 'std-list', hidden: true });
      cat.items.forEach(function (item) {
        list.append(h('li', null, h('button', {
          type: 'button', class: 'std-link', text: item.label,
          onclick: function () { close(false); EM.navigate(cat.id, item.id); }
        })));
      });
      btn.addEventListener('click', function () {
        if (openCat === cat.id) { close(true); return; }
        open(cat.id);
      });
      var wrap = h('div', { class: 'std-item' }, [btn, list]);
      entries.push({ cat: cat, btn: btn, list: list });
      bar.append(wrap);
    });

    function open(catId) {
      if (openCat == null) {
        EM.log('open', { category: catId });
        off = EM.onDismiss(bar, function () { close(true); });
      } else {
        EM.log('expand', { category: catId, detail: 'switched department' });
      }
      openCat = catId;
      entries.forEach(function (e) {
        var on = e.cat.id === catId;
        e.list.hidden = !on;
        e.btn.setAttribute('aria-expanded', String(on));
      });
    }

    function close(dismissed) {
      if (openCat == null) return;
      if (dismissed) EM.log('close');
      openCat = null;
      if (off) { off(); off = null; }
      entries.forEach(function (e) {
        e.list.hidden = true;
        e.btn.setAttribute('aria-expanded', 'false');
      });
    }

    slot.append(bar);
  }
};
