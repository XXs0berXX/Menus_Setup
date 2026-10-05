/*
 * Page shell: header with a menu slot, a destination page, and an optional
 * researcher panel. URL parameters:
 *   menu  standard | layered | palette | guided | radial | mega
 *   p     participant id written into the log (optional)
 *   task  instruction shown above the page, e.g. task=Find%20the%20returns%20page (optional)
 *   r=1   show the researcher panel (log controls); leave off for participants
 */
(function () {
  var h = EM.h;
  var params = new URLSearchParams(location.search);
  var id = params.get('menu');
  if (!EM.menus[id]) id = 'standard';
  EM.menuId = id;
  EM.participant = params.get('p') || '';
  var task = params.get('task');
  var researcher = params.get('r') === '1';

  document.body.dataset.menu = id;

  var slot = h('div', { class: 'nav-slot' });
  var brand = h('a', { class: 'brand', href: '#' }, [h('span', { class: 'brand-mark', 'aria-hidden': 'true' }), EM.storeName]);
  brand.addEventListener('click', function (e) {
    e.preventDefault();
    EM.log('home');
    renderHome();
  });
  var header = h('header', { class: 'site-header' }, [brand, slot]);
  var taskBar = task ? h('div', { class: 'task-bar', role: 'status' }, [h('strong', { text: 'Your task: ' }), task]) : null;
  var main = h('main', { class: 'page', id: 'page', tabindex: '-1' });
  document.getElementById('app').append(header, taskBar || '', main);

  function renderHome() {
    main.replaceChildren(
      h('p', { class: 'crumbs', text: 'Home' }),
      h('h1', { text: 'Welcome to ' + EM.storeName }),
      h('p', { class: 'lead', text: 'Use the menu at the top of the page to find what you need.' }),
      placeholderGrid(4)
    );
  }

  function renderPage(cat, item) {
    // Breadcrumb is plain text on purpose: clickable crumbs would be a second
    // navigation route and would contaminate the menu comparison.
    main.replaceChildren(
      h('p', { class: 'crumbs', text: 'Home  /  ' + cat.label + '  /  ' + item.label }),
      h('h1', { text: item.label }),
      h('p', { class: 'lead', text: item.desc }),
      placeholderGrid(8)
    );
    main.focus({ preventScroll: true });
  }

  function placeholderGrid(n) {
    var grid = h('div', { class: 'grid', 'aria-hidden': 'true' });
    for (var i = 0; i < n; i++) {
      grid.append(h('div', { class: 'card' }, [
        h('div', { class: 'card-img' }),
        h('div', { class: 'card-line' }),
        h('div', { class: 'card-line short' })
      ]));
    }
    return grid;
  }

  /* Every menu calls this when the user picks a destination. */
  EM.navigate = function (catId, itemId, via) {
    var cat = EM.findCategory(catId);
    var item = EM.findItem(catId, itemId);
    if (!cat || !item) return;
    EM.log('select', { category: catId, item: itemId, detail: via || '' });
    EM.pushRecent(catId, itemId);
    renderPage(cat, item);
  };

  EM.menus[id].mount(slot);
  renderHome();

  if (researcher) mountResearcherPanel();

  function mountResearcherPanel() {
    var count = h('span', { class: 'rp-val' });
    var last = h('span', { class: 'rp-val' });
    var panel = h('aside', { class: 'researcher-panel', 'aria-label': 'Researcher panel' }, [
      h('div', { class: 'rp-row' }, [h('span', { text: 'Menu' }), h('span', { class: 'rp-val', text: id })]),
      h('div', { class: 'rp-row' }, [h('span', { text: 'Participant' }), h('span', { class: 'rp-val', text: EM.participant || '(none)' })]),
      h('div', { class: 'rp-row' }, [h('span', { text: 'Events logged' }), count]),
      h('div', { class: 'rp-row' }, [h('span', { text: 'Last selection' }), last]),
      h('div', { class: 'rp-actions' }, [
        h('button', { type: 'button', onclick: EM.downloadLog, text: 'Download CSV' }),
        h('button', {
          type: 'button', text: 'Clear log',
          onclick: function () { if (window.confirm('Clear every logged event?')) EM.clearLog(); }
        })
      ])
    ]);
    function refresh(ev, events) {
      count.textContent = events.length;
      if (ev && ev.event === 'select') last.textContent = (ev.ms_since_open / 1000).toFixed(2) + ' s';
      if (!ev) last.textContent = '–';
    }
    EM.onLog = refresh;
    refresh(null, EM.getLog());
    var prior = EM.getLog().filter(function (e) { return e.event === 'select'; }).pop();
    if (prior && prior.ms_since_open !== '') last.textContent = (prior.ms_since_open / 1000).toFixed(2) + ' s';
    document.body.append(panel);
  }
})();
