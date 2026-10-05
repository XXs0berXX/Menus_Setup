/*
 * CONFUSION — guided, self-explaining drill-down menu.
 * Pre-established techniques: look-ahead help fields that preview the next
 * level (Snowberry, Parkinson & Sisson, 1985) and category labels described
 * with examples (Dumais & Landauer, 1984).
 *
 * Design moves, each tied to the rationale in README.md:
 *  - Confusion is an impasse in understanding; it only helps if it gets
 *    resolved (D'Mello et al., 2014), and unresolved it slides into
 *    frustration and boredom (D'Mello & Graesser, 2012). So every option
 *    explains itself instead of relying on a bare label.
 *  - Each department previews exactly what is inside it (look-ahead), raising
 *    information scent (Pirolli & Card, 1999).
 *  - One level at a time, explicit "Step 1 of 2", a visible path and an
 *    explicit Back button: the user always knows where they are.
 *  - Click only, no hover-triggered submenus that vanish unexpectedly.
 */
EM.menus.guided = {
  label: 'Guided drill-down menu',
  mount: function (slot) {
    var h = EM.h;
    var isOpen = false;
    var off = null;

    var trigger = h('button', { type: 'button', class: 'gd-trigger', 'aria-expanded': 'false', 'aria-controls': 'gd-panel' }, [
      'Menu', EM.chevron('down')
    ]);
    var panel = h('div', { class: 'gd-panel', id: 'gd-panel', hidden: true, role: 'region', 'aria-label': 'Guided menu' });

    trigger.addEventListener('click', function () { isOpen ? close(true) : open(); });

    function open() {
      isOpen = true;
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      showDepartments();
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

    function header(step, title, path) {
      return h('div', { class: 'gd-head' }, [
        h('div', { class: 'gd-step' }, [
          h('span', { class: 'gd-step-text', text: 'Step ' + step + ' of 2' }),
          h('span', { class: 'gd-dots', 'aria-hidden': 'true' }, [
            h('span', { class: 'gd-dot is-on' }),
            h('span', { class: 'gd-dot' + (step === 2 ? ' is-on' : '') })
          ])
        ]),
        h('p', { class: 'gd-path' }, path),
        h('p', { class: 'gd-title', text: title })
      ]);
    }

    function showDepartments() {
      var list = h('div', { class: 'gd-list' });
      EM.categories.forEach(function (cat) {
        var inside = cat.items.map(function (i) { return i.label; }).join(', ');
        list.append(h('button', {
          type: 'button', class: 'gd-option',
          onclick: function () {
            EM.log('expand', { category: cat.id });
            showPages(cat);
          }
        }, [
          h('span', { class: 'gd-option-icon' }, EM.icon(cat.icon, 22)),
          h('span', { class: 'gd-option-body' }, [
            h('span', { class: 'gd-option-label', text: cat.label }),
            h('span', { class: 'gd-option-desc', text: cat.blurb }),
            h('span', { class: 'gd-option-peek' }, [h('span', { class: 'gd-peek-label', text: 'Inside: ' }), inside])
          ]),
          EM.chevron('right')
        ]));
      });
      panel.replaceChildren(
        header(1, 'Which department is it in?', [h('strong', { text: 'All departments' })]),
        list
      );
    }

    function showPages(cat) {
      var back = h('button', {
        type: 'button', class: 'gd-back',
        onclick: function () {
          EM.log('back', { category: cat.id });
          showDepartments();
        }
      }, [EM.chevron('left'), 'Back to all departments']);

      var list = h('div', { class: 'gd-list' });
      cat.items.forEach(function (item) {
        list.append(h('button', {
          type: 'button', class: 'gd-option gd-option-page',
          onclick: function () { close(false); EM.navigate(cat.id, item.id); }
        }, [
          h('span', { class: 'gd-option-body' }, [
            h('span', { class: 'gd-option-label', text: item.label }),
            h('span', { class: 'gd-option-desc', text: item.desc })
          ]),
          EM.chevron('right')
        ]));
      });

      panel.replaceChildren(
        header(2, 'Which page do you need?', ['All departments', h('span', { class: 'gd-sep', text: '  ›  ' }), h('strong', { text: cat.label })]),
        back,
        list
      );
      back.focus();
    }

    slot.append(h('div', { class: 'gd-wrap' }, [trigger, panel]));
  }
};
