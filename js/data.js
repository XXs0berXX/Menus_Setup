/*
 * Shared information architecture.
 * Every menu condition renders exactly this content, so the only thing that
 * differs between conditions is the menu's structure and interaction.
 * 6 departments x 6 pages = 36 destinations.
 *
 * Edit freely, but keep the same IA for every condition in a given study.
 *   desc      one-line description (shown by the guided menu)
 *   keywords  synonyms for the search palette (vocabulary problem, Furnas et al. 1987)
 *   badge     optional "New" / "Popular" tag (shown by the mega menu)
 */
window.EM = window.EM || {};

EM.storeName = 'Everyday Market';

EM.categories = [
  {
    id: 'electronics', label: 'Electronics', icon: 'electronics',
    blurb: 'Devices, audio gear and the cables that connect them.',
    items: [
      { id: 'phones', label: 'Phones', desc: 'Smartphones and basic mobile phones.', keywords: ['mobile', 'smartphone', 'cell'] },
      { id: 'laptops', label: 'Laptops', desc: 'Notebooks for work, study and gaming.', keywords: ['computer', 'notebook', 'pc', 'macbook'], badge: 'Popular' },
      { id: 'headphones', label: 'Headphones', desc: 'Over-ear, in-ear and wireless earbuds.', keywords: ['earbuds', 'earphones', 'audio'] },
      { id: 'cameras', label: 'Cameras', desc: 'Digital cameras, lenses and action cams.', keywords: ['photo', 'lens', 'photography'] },
      { id: 'smartwatches', label: 'Smart Watches', desc: 'Smart watches and fitness trackers.', keywords: ['wearable', 'fitness tracker', 'watch'], badge: 'New' },
      { id: 'chargers', label: 'Chargers & Cables', desc: 'Chargers, power banks, adapters and cables.', keywords: ['usb', 'power bank', 'adapter', 'cable', 'charger'] }
    ]
  },
  {
    id: 'home', label: 'Home & Kitchen', icon: 'home',
    blurb: 'Everything for cooking, sleeping and keeping the place tidy.',
    items: [
      { id: 'cookware', label: 'Cookware', desc: 'Pots, pans, baking trays and utensils.', keywords: ['pots', 'pans', 'kitchen', 'baking'] },
      { id: 'appliances', label: 'Small Appliances', desc: 'Kettles, toasters, blenders and coffee makers.', keywords: ['kettle', 'toaster', 'blender', 'coffee', 'microwave'] },
      { id: 'bedding', label: 'Bedding', desc: 'Sheets, duvets, pillows and blankets.', keywords: ['sheets', 'pillow', 'duvet', 'blanket', 'bed'] },
      { id: 'lighting', label: 'Lighting', desc: 'Lamps, bulbs and fairy lights.', keywords: ['lamp', 'bulb', 'light'], badge: 'New' },
      { id: 'storage', label: 'Storage', desc: 'Boxes, shelves and organisers.', keywords: ['boxes', 'shelf', 'organiser', 'organizer'] },
      { id: 'cleaning', label: 'Cleaning Supplies', desc: 'Detergents, mops, sponges and bins.', keywords: ['detergent', 'mop', 'sponge', 'clean'] }
    ]
  },
  {
    id: 'clothing', label: 'Clothing', icon: 'clothing',
    blurb: 'Clothes, shoes and accessories for every season.',
    items: [
      { id: 'tops', label: 'Tops & T-shirts', desc: 'T-shirts, shirts, hoodies and sweaters.', keywords: ['shirt', 'tshirt', 'hoodie', 'sweater'] },
      { id: 'trousers', label: 'Trousers & Jeans', desc: 'Jeans, chinos, joggers and shorts.', keywords: ['pants', 'jeans', 'shorts', 'joggers'] },
      { id: 'jackets', label: 'Jackets & Coats', desc: 'Rain jackets, winter coats and blazers.', keywords: ['coat', 'jacket', 'blazer', 'raincoat'] },
      { id: 'shoes', label: 'Shoes', desc: 'Trainers, boots, sandals and formal shoes.', keywords: ['sneakers', 'trainers', 'boots', 'sandals'], badge: 'Popular' },
      { id: 'bags', label: 'Bags', desc: 'Backpacks, handbags and travel bags.', keywords: ['backpack', 'handbag', 'luggage'] },
      { id: 'accessories', label: 'Accessories', desc: 'Belts, hats, scarves and sunglasses.', keywords: ['belt', 'hat', 'scarf', 'sunglasses'] }
    ]
  },
  {
    id: 'books', label: 'Books & Stationery', icon: 'books',
    blurb: 'Reading, writing and drawing supplies.',
    items: [
      { id: 'fiction', label: 'Fiction', desc: 'Novels, short stories and graphic novels.', keywords: ['novel', 'story', 'comics'] },
      { id: 'nonfiction', label: 'Non-fiction', desc: 'Biographies, history, science and self-help.', keywords: ['biography', 'history', 'science'] },
      { id: 'textbooks', label: 'Textbooks', desc: 'Course books for school and university.', keywords: ['course', 'university', 'study', 'academic'], badge: 'Popular' },
      { id: 'notebooks', label: 'Notebooks', desc: 'Notebooks, journals and planners.', keywords: ['journal', 'planner', 'diary', 'notepad'] },
      { id: 'pens', label: 'Pens & Markers', desc: 'Pens, pencils, highlighters and markers.', keywords: ['pencil', 'highlighter', 'marker', 'pen'] },
      { id: 'art', label: 'Art Supplies', desc: 'Paints, brushes, sketchbooks and canvases.', keywords: ['paint', 'brush', 'sketch', 'canvas', 'drawing'] }
    ]
  },
  {
    id: 'sports', label: 'Sports & Outdoors', icon: 'sports',
    blurb: 'Gear for training, the outdoors and team sports.',
    items: [
      { id: 'fitness', label: 'Fitness Equipment', desc: 'Weights, mats, bands and home gym gear.', keywords: ['gym', 'weights', 'dumbbell', 'exercise'] },
      { id: 'cycling', label: 'Cycling', desc: 'Bikes, helmets, lights and repair kits.', keywords: ['bike', 'bicycle', 'helmet'] },
      { id: 'camping', label: 'Camping', desc: 'Tents, sleeping bags and stoves.', keywords: ['tent', 'sleeping bag', 'hiking', 'outdoor'], badge: 'New' },
      { id: 'yoga', label: 'Yoga', desc: 'Yoga mats, blocks and straps.', keywords: ['mat', 'pilates', 'stretch'] },
      { id: 'teamsports', label: 'Team Sports', desc: 'Footballs, cricket bats, nets and kits.', keywords: ['football', 'cricket', 'basketball', 'soccer'] },
      { id: 'swimming', label: 'Swimming', desc: 'Swimwear, goggles and caps.', keywords: ['swim', 'goggles', 'pool'] }
    ]
  },
  {
    id: 'account', label: 'Account & Help', icon: 'account',
    blurb: 'Orders, deliveries, returns and getting help.',
    items: [
      { id: 'orders', label: 'Your Orders', desc: 'See what you have ordered and reorder.', keywords: ['order history', 'purchases', 'bought'] },
      { id: 'track', label: 'Track a Package', desc: 'Find out where your delivery is right now.', keywords: ['delivery', 'shipping', 'where is my order', 'parcel'] },
      { id: 'returns', label: 'Returns & Refunds', desc: 'Send something back or check a refund.', keywords: ['return', 'refund', 'money back', 'exchange'] },
      { id: 'payment', label: 'Payment Methods', desc: 'Add or remove cards and wallets.', keywords: ['card', 'billing', 'wallet', 'pay'] },
      { id: 'settings', label: 'Account Settings', desc: 'Change your name, email, password or address.', keywords: ['profile', 'password', 'email', 'address'] },
      { id: 'support', label: 'Contact Support', desc: 'Chat, call or email the help team.', keywords: ['help', 'chat', 'customer service', 'call'] }
    ]
  }
];

/*
 * Pages promoted to the first layer of the layered (anxiety) menu.
 * Keep this to 4-5 items; everything else stays reachable under "More options".
 */
EM.primary = [
  ['account', 'track'],
  ['account', 'orders'],
  ['account', 'returns'],
  ['account', 'support']
];

/* Simple 24x24 line icons, drawn with stroke only. */
EM.icons = {
  electronics: 'M5 5h14v10H5z M3 19h18',
  home: 'M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6',
  clothing: 'M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3c-1 2-2.5 3-4 3S9 5 8 3z',
  books: 'M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z',
  sports: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c3.5 3 3.5 15 0 18 M12 3c-3.5 3-3.5 15 0 18',
  account: 'M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8z M4 21c0-4 3.6-6 8-6s8 2 8 6'
};

EM.findCategory = function (catId) {
  return EM.categories.find(function (c) { return c.id === catId; });
};

EM.findItem = function (catId, itemId) {
  var cat = EM.findCategory(catId);
  return cat ? cat.items.find(function (i) { return i.id === itemId; }) : null;
};
