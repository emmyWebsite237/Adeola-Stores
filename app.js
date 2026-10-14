/* ============================================================
   Ladydee Minimart Store — shared app engine
   Catalogue (Naira) · cart · wishlist · auth · orders
   delivery zones & discounts · coupons · clean URLs
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Icons ---------- */
  var P = {
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.7-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
    truck: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowRight: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/>',
    creditCard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 3-3 4 4 5-6"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    plug: '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    userPlus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M19 8v6M22 11h-6"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M14 9l2 2"/>',
    clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 11h6M9 15h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    alert: '<path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
    package: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v9"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14.5-2 8 5.5-3 5.5 3-2-8"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8S10.2 2.4 7.6 3.6 10 8 12 8Zm0 0s1.8-5.6 4.4-4.4S14 8 12 8Z"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M10.7 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6A17.6 17.6 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m2 2 20 20"/>',
    facebook: '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1.1"/>',
    twitter: '<path d="M18.2 3H21l-6.3 7.2L22 21h-5.7l-4.5-5.9L6.6 21H3.8l6.7-7.7L2.6 3h5.8l4.1 5.4Zm-1 16.2h1.6L7.9 4.7H6.2Z"/>',
    whatsapp: '<path d="M21 11.8a9 9 0 0 1-13.3 7.9L3 21l1.4-4.5A9 9 0 1 1 21 11.8Z"/><path d="M8.4 9.2c.3 2.6 2 4.3 4.6 4.6l1-1.3 1.7.8v1.4c-2.9.3-6.9-3.6-6.6-6.5h1.4l.8 1.7Z"/>',
    wheat: '<path d="M12 22V8"/><path d="M12 8c0-3 2-5 4-5 0 3-2 5-4 5Zm0 0c0-3-2-5-4-5 0 3 2 5 4 5Z"/><path d="M12 14c0-3 2-5 4-5 0 3-2 5-4 5Zm0 0c0-3-2-5-4-5 0 3 2 5 4 5Z"/>',
    pot: '<path d="M4 9h16v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 9h20M8 5c0-1 1-2 2-2M14 5c0-1 1-2 2-2"/>',
    cup: '<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M7 3v2M11 3v2"/>',
    cookie: '<path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-5-5 4 4 0 0 1-4-4Z"/><circle cx="9" cy="10" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="9.5" cy="15" r="1"/>',
    spray: '<path d="M9 8h6v13H9z"/><path d="M10 8V5h4v3"/><path d="M17 5h3M17 8h3M17 11h3"/>',
    droplet: '<path d="M12 2.7 6.8 8a7.3 7.3 0 1 0 10.4 0Z"/>',
    baby: '<circle cx="12" cy="8" r="5"/><path d="M9.5 7h.01M14.5 7h.01"/><path d="M10 10.5a3 3 0 0 0 4 0"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>',
    basket: '<path d="M3 9h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8Z"/><path d="m8 9 4-6 4 6"/><path d="M9 13v3M15 13v3"/>',
    store: '<path d="M3 9.5 5 4h14l2 5.5"/><path d="M4 9.5V20h16V9.5"/><path d="M9 20v-6h6v6"/>',
    tag: '<path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
    sparkles: '<path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z"/><path d="m18 15 .9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9Z"/>',
    wallet: '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="15" r="1.3"/>',
    route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.5-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4Z"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 4.5a4 4 0 0 1 0 7M22 21a6 6 0 0 0-4-5.7"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
  };

  function icon(name, cls) {
    var fill = (name === 'star' || name === 'facebook' || name === 'twitter');
    return '<svg viewBox="0 0 24 24" ' +
      (fill ? 'fill="currentColor" stroke="none"' :
              'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') +
      (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true">' + (P[name] || '') + '</svg>';
  }

  /* ---------- Categories ---------- */
  var CATEGORIES = [
    { id: 'rice-grains',   name: 'Rice & Grains',      blurb: 'Rice, beans, garri & semovita',      icon: 'wheat' },
    { id: 'cooking',       name: 'Cooking Essentials', blurb: 'Oil, tomato, seasoning & pasta',      icon: 'pot' },
    { id: 'beverages',     name: 'Beverages',          blurb: 'Tea, coffee, water & soft drinks',    icon: 'cup' },
    { id: 'snacks',        name: 'Snacks & Pantry',    blurb: 'Cereals, biscuits & treats',          icon: 'cookie' },
    { id: 'household',     name: 'Household',          blurb: 'Detergents, soap & tissue',           icon: 'spray' },
    { id: 'personal-care', name: 'Personal Care',      blurb: 'Oral & everyday care',                icon: 'droplet' },
    { id: 'baby-kids',     name: 'Baby & Kids',        blurb: 'Diapers, cereal & wipes',             icon: 'baby' }
  ];

  /* ---------- Products (sample catalogue, Naira) ---------- */
  var PRODUCTS = [
    {
      id: 'rice-50kg', name: 'Premium Parboiled Rice', category: 'rice-grains', size: '50kg bag',
      price: 78000, oldPrice: 85000, rating: 4.8, reviewCount: 312, badge: 'bestseller', stock: 24,
      image: 'images/rice-50kg.png', scene: 'images/scene-warehouse.png',
      short: 'A full 50kg sack of clean, stone-free long-grain parboiled rice.',
      description: 'Our most popular bulk buy. This 50kg sack of long-grain parboiled rice is double-sorted and de-stoned, so it cooks up separate and fluffy every time. Ideal for large households, events and resellers. The sack is machine-stitched and sealed for safe storage.',
      features: ['50kg machine-stitched sack', 'Long-grain, parboiled', 'Double-sorted and de-stoned', 'Stores well for months'],
      specs: { Weight: '50 kg', Type: 'Long-grain parboiled', Packaging: 'Woven sack, stitched', Origin: 'Nigeria', 'Shelf life': '12 months' }
    },
    {
      id: 'rice-10kg', name: 'Premium Parboiled Rice', category: 'rice-grains', size: '10kg bag',
      price: 17500, oldPrice: 19000, rating: 4.7, reviewCount: 208, badge: 'sale', stock: 60,
      image: 'images/rice-10kg.png', scene: 'images/scene-warehouse.png',
      short: 'The same clean long-grain rice in a handy 10kg sealed bag.',
      description: 'A 10kg sealed bag of our long-grain parboiled rice — the right size for a small family or a monthly top-up. Sealed to keep moisture and weevils out, and it stacks neatly in the pantry.',
      features: ['10kg sealed bag', 'Long-grain, parboiled', 'Moisture-resistant packaging', 'Easy to store and stack'],
      specs: { Weight: '10 kg', Type: 'Long-grain parboiled', Packaging: 'Sealed plastic bag', Origin: 'Nigeria', 'Shelf life': '12 months' }
    },
    {
      id: 'rice-5kg', name: 'Premium Parboiled Rice', category: 'rice-grains', size: '5kg bag',
      price: 9200, oldPrice: null, rating: 4.6, reviewCount: 141, badge: null, stock: 88,
      image: 'images/rice-5kg.png', scene: 'images/scene-warehouse.png',
      short: 'A mini 5kg bag — perfect for trying us out or a small household.',
      description: 'Our smallest rice pack. A 5kg sealed bag of long-grain parboiled rice, ideal for singles, students and anyone who wants to try the quality before buying in bulk.',
      features: ['5kg sealed bag', 'Long-grain, parboiled', 'Great for small households', 'Resealable after opening'],
      specs: { Weight: '5 kg', Type: 'Long-grain parboiled', Packaging: 'Sealed plastic bag', Origin: 'Nigeria', 'Shelf life': '12 months' }
    },
    {
      id: 'beans-10kg', name: 'Honey Beans (Oloyin)', category: 'rice-grains', size: '10kg bag',
      price: 21000, oldPrice: 23000, rating: 4.7, reviewCount: 176, badge: 'sale', stock: 35,
      image: 'images/beans-10kg.png', scene: 'images/scene-warehouse.png',
      short: 'Sweet brown honey beans, hand-picked and cleaned.',
      description: 'Oloyin honey beans are prized for their natural sweetness and soft texture. This 10kg bag is hand-picked and cleaned, so you spend less time sorting at home. They cook down beautifully for beans porridge or moi moi.',
      features: ['10kg sealed bag', 'Hand-picked and cleaned', 'Naturally sweet oloyin variety', 'Cooks soft and fast'],
      specs: { Weight: '10 kg', Variety: 'Brown honey beans (oloyin)', Packaging: 'Sealed plastic bag', Origin: 'Nigeria', 'Shelf life': '9 months' }
    },
    {
      id: 'garri-10kg', name: 'Ijebu Garri', category: 'rice-grains', size: '10kg bag',
      price: 12500, oldPrice: null, rating: 4.5, reviewCount: 98, badge: null, stock: 52,
      image: 'images/garri-10kg.png', scene: 'images/scene-warehouse.png',
      short: 'Sour, fine Ijebu garri — crisp and properly dried.',
      description: 'Authentic Ijebu garri with that characteristic tang. Fine-grained, well-dried and sealed in a 10kg bag so it stays crisp. Great for soaking with groundnut and sugar, or for eba.',
      features: ['10kg sealed bag', 'Fine-grained Ijebu style', 'Properly dried, stays crisp', 'Great for eba or soaking'],
      specs: { Weight: '10 kg', Type: 'Ijebu (sour) garri', Packaging: 'Sealed plastic bag', Origin: 'Nigeria', 'Shelf life': '6 months' }
    },
    {
      id: 'semovita-10kg', name: 'Semovita', category: 'rice-grains', size: '10kg bag',
      price: 15500, oldPrice: 17000, rating: 4.6, reviewCount: 122, badge: 'sale', stock: 40,
      image: 'images/semovita-10kg.png', scene: 'images/scene-warehouse.png',
      short: 'Smooth semolina flour for a soft, lump-free swallow.',
      description: 'A 10kg bag of fine semolina flour that mixes smooth and holds together well. Makes a soft, stretchy swallow that pairs with any soup. Sealed for freshness.',
      features: ['10kg sealed bag', 'Fine, smooth semolina', 'Mixes without lumps', 'Sealed for freshness'],
      specs: { Weight: '10 kg', Type: 'Semolina flour', Packaging: 'Sealed bag', Origin: 'Nigeria', 'Shelf life': '9 months' }
    },
    {
      id: 'oil-5l', name: 'Vegetable Cooking Oil', category: 'cooking', size: '5 litre jerrycan',
      price: 14500, oldPrice: 16000, rating: 4.7, reviewCount: 264, badge: 'bestseller', stock: 45,
      image: 'images/oil-5l.png', scene: 'images/scene-warehouse.png',
      short: 'Cholesterol-free vegetable oil in a sealed 5L jerrycan.',
      description: 'A 5-litre jerrycan of refined vegetable cooking oil. Light, neutral-tasting and cholesterol-free, it works for frying, stews and baking. The jerrycan has a tamper-evident sealed cap.',
      features: ['5 litre sealed jerrycan', 'Cholesterol-free', 'Neutral taste, high smoke point', 'Tamper-evident cap'],
      specs: { Volume: '5 litres', Type: 'Refined vegetable oil', Packaging: 'Sealed jerrycan', 'Shelf life': '18 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'oil-1l', name: 'Vegetable Cooking Oil', category: 'cooking', size: '1 litre bottle',
      price: 3200, oldPrice: null, rating: 4.5, reviewCount: 187, badge: null, stock: 120,
      image: 'images/oil-1l.png', scene: 'images/scene-warehouse.png',
      short: 'A 1 litre bottle of the same oil — handy for small kitchens.',
      description: 'The 1-litre bottle of our refined vegetable oil. Easy to handle and pour, and the right size if you cook in smaller quantities or want to keep a spare.',
      features: ['1 litre sealed bottle', 'Cholesterol-free', 'Easy-pour design', 'Great for small kitchens'],
      specs: { Volume: '1 litre', Type: 'Refined vegetable oil', Packaging: 'Sealed bottle', 'Shelf life': '18 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'tomato-paste', name: 'Tomato Paste', category: 'cooking', size: '400g tin',
      price: 950, oldPrice: 1100, rating: 4.4, reviewCount: 341, badge: 'sale', stock: 200,
      image: 'images/tomato-paste.png', scene: 'images/scene-warehouse.png',
      short: 'Thick, concentrated tomato paste in a sealed tin.',
      description: 'A 400g tin of thick tomato paste made from ripe tomatoes. Concentrated, so a little goes a long way in stews, jollof and sauces. Sealed tin with a long shelf life.',
      features: ['400g sealed tin', 'Thick and concentrated', 'No artificial colouring', 'Long shelf life'],
      specs: { Weight: '400 g', Type: 'Concentrated tomato paste', Packaging: 'Sealed tin', 'Shelf life': '24 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'seasoning-cubes', name: 'Seasoning Cubes', category: 'cooking', size: 'Roll of 10',
      price: 700, oldPrice: null, rating: 4.6, reviewCount: 412, badge: null, stock: 300,
      image: 'images/seasoning-cubes.png', scene: 'images/scene-warehouse.png',
      short: 'A roll of ten classic all-purpose seasoning cubes.',
      description: 'The everyday seasoning cube every Nigerian kitchen runs on. A roll of ten cubes, each individually wrapped, that lifts the flavour of rice, stews, soups and noodles.',
      features: ['Roll of 10 cubes', 'Individually wrapped', 'All-purpose seasoning', 'Long shelf life'],
      specs: { Quantity: '10 cubes', Type: 'All-purpose seasoning', Packaging: 'Foil roll', 'Shelf life': '18 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'spaghetti', name: 'Spaghetti Pasta', category: 'cooking', size: '500g pack',
      price: 1200, oldPrice: 1400, rating: 4.5, reviewCount: 233, badge: 'sale', stock: 150,
      image: 'images/spaghetti.png', scene: 'images/scene-warehouse.png',
      short: 'Durum wheat spaghetti that holds its bite.',
      description: 'A 500g pack of durum wheat spaghetti. Cooks to a firm al dente and holds sauce well — good for a quick jollof spaghetti or a simple tomato pasta.',
      features: ['500g sealed pack', 'Durum wheat semolina', 'Cooks al dente', 'Holds sauce well'],
      specs: { Weight: '500 g', Type: 'Durum wheat spaghetti', Packaging: 'Sealed pack', 'Shelf life': '24 months', Cooking: '8–10 minutes' }
    },
    {
      id: 'noodles', name: 'Instant Noodles', category: 'cooking', size: 'Carton of 40',
      price: 11500, oldPrice: 13000, rating: 4.7, reviewCount: 289, badge: 'bestseller', stock: 30,
      image: 'images/noodles.png', scene: 'images/scene-warehouse.png',
      short: 'A full carton of 40 instant noodle packs with seasoning.',
      description: 'A carton of 40 instant noodle packs, each with its own seasoning sachet. The quickest hot meal in the house — boil, add the seasoning, done. Buying the carton works out much cheaper per pack.',
      features: ['Carton of 40 packs', 'Seasoning sachet in each', 'Ready in 3 minutes', 'Best value per pack'],
      specs: { Quantity: '40 packs', 'Per pack': '70 g', Packaging: 'Sealed carton', 'Shelf life': '12 months', Cooking: '3 minutes' }
    },
    {
      id: 'sugar', name: 'Granulated Sugar', category: 'cooking', size: '2kg bag',
      price: 4200, oldPrice: null, rating: 4.5, reviewCount: 156, badge: null, stock: 90,
      image: 'images/sugar.png', scene: 'images/scene-warehouse.png',
      short: 'Fine white granulated sugar in a sealed 2kg bag.',
      description: 'A 2kg sealed bag of fine white granulated sugar. Dissolves quickly, so it is good for tea, baking and drinks. Sealed to keep it free-flowing and dry.',
      features: ['2kg sealed bag', 'Fine, quick-dissolving grains', 'Good for baking and drinks', 'Stays free-flowing'],
      specs: { Weight: '2 kg', Type: 'White granulated sugar', Packaging: 'Sealed bag', 'Shelf life': '24 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'salt', name: 'Iodised Table Salt', category: 'cooking', size: '1kg bag',
      price: 700, oldPrice: null, rating: 4.4, reviewCount: 198, badge: null, stock: 180,
      image: 'images/salt.png', scene: 'images/scene-warehouse.png',
      short: 'Fine iodised table salt in a sealed 1kg bag.',
      description: 'A 1kg sealed bag of fine iodised table salt. Free-flowing and easy to measure, with iodine added as recommended for everyday cooking.',
      features: ['1kg sealed bag', 'Iodised', 'Fine, free-flowing', 'Everyday cooking salt'],
      specs: { Weight: '1 kg', Type: 'Iodised table salt', Packaging: 'Sealed bag', 'Shelf life': '24 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'flour', name: 'Wheat Flour', category: 'cooking', size: '2kg bag',
      price: 3800, oldPrice: 4200, rating: 4.5, reviewCount: 134, badge: 'sale', stock: 70,
      image: 'images/flour.png', scene: 'images/scene-warehouse.png',
      short: 'All-purpose wheat flour for baking and frying.',
      description: 'A 2kg bag of all-purpose wheat flour, milled fine and sifted. Works for bread, cakes, pancakes and for dusting before frying. Sealed to keep it dry.',
      features: ['2kg sealed bag', 'All-purpose, finely milled', 'Good for bread and cakes', 'Sealed for freshness'],
      specs: { Weight: '2 kg', Type: 'All-purpose wheat flour', Packaging: 'Sealed paper bag', 'Shelf life': '9 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'milk-powder', name: 'Full Cream Milk Powder', category: 'beverages', size: '400g tin',
      price: 6500, oldPrice: 7200, rating: 4.7, reviewCount: 276, badge: 'sale', stock: 55,
      image: 'images/milk-powder.png', scene: 'images/scene-warehouse.png',
      short: 'Rich full-cream milk powder in a sealed 400g tin.',
      description: 'A 400g tin of full-cream milk powder. Dissolves smoothly in hot or cold water and gives tea, pap and cereal a proper creamy body. The tin reseals to keep the powder dry.',
      features: ['400g sealed tin', 'Full cream, rich taste', 'Dissolves smoothly', 'Resealable tin'],
      specs: { Weight: '400 g', Type: 'Full cream milk powder', Packaging: 'Sealed tin', 'Shelf life': '18 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'tea', name: 'Black Tea Bags', category: 'beverages', size: '50 bags',
      price: 3500, oldPrice: null, rating: 4.5, reviewCount: 167, badge: null, stock: 80,
      image: 'images/tea.png', scene: 'images/scene-warehouse.png',
      short: 'A box of 50 black tea bags, individually sealed.',
      description: 'A box of 50 black tea bags. Each bag is individually wrapped so it stays fresh, and the blend brews strong and clear in about three minutes. Good with milk or lemon.',
      features: ['50 individually wrapped bags', 'Strong, clear brew', 'Ready in 3 minutes', 'Sealed for freshness'],
      specs: { Quantity: '50 tea bags', Type: 'Black tea', Packaging: 'Sealed box', 'Shelf life': '24 months', Brewing: '3 minutes' }
    },
    {
      id: 'coffee', name: 'Instant Coffee', category: 'beverages', size: '200g jar',
      price: 7800, oldPrice: 8500, rating: 4.6, reviewCount: 143, badge: 'sale', stock: 42,
      image: 'images/coffee.png', scene: 'images/scene-warehouse.png',
      short: 'Smooth instant coffee granules in a resealable 200g jar.',
      description: 'A 200g jar of instant coffee granules with a rounded, low-acid taste. Dissolves instantly in hot water or milk, and the jar reseals to protect the aroma.',
      features: ['200g resealable jar', 'Smooth, low-acid taste', 'Dissolves instantly', 'Makes about 100 cups'],
      specs: { Weight: '200 g', Type: 'Instant coffee granules', Packaging: 'Glass jar', 'Shelf life': '24 months', Servings: '~100 cups' }
    },
    {
      id: 'water-pack', name: 'Table Water', category: 'beverages', size: 'Pack of 12',
      price: 1800, oldPrice: null, rating: 4.4, reviewCount: 221, badge: null, stock: 200,
      image: 'images/water-pack.png', scene: 'images/scene-warehouse.png',
      short: 'A shrink-wrapped pack of twelve 75cl bottles of table water.',
      description: 'A pack of twelve 75cl bottles of treated table water, shrink-wrapped for easy carrying. Sealed caps, clean taste, and handy for the office, the car or the fridge.',
      features: ['Pack of 12 bottles', '75cl each', 'Shrink-wrapped pack', 'Sealed tamper-proof caps'],
      specs: { Quantity: '12 bottles', 'Per bottle': '75 cl', Type: 'Treated table water', Packaging: 'Shrink-wrapped pack', 'Shelf life': '12 months' }
    },
    {
      id: 'soft-drink', name: 'Orange Soft Drink', category: 'beverages', size: 'Pack of 6',
      price: 3600, oldPrice: 4000, rating: 4.3, reviewCount: 189, badge: 'sale', stock: 110,
      image: 'images/soft-drink.png', scene: 'images/scene-warehouse.png',
      short: 'Six 50cl bottles of fizzy orange soft drink.',
      description: 'A pack of six 50cl bottles of orange soft drink. Properly fizzy and best served cold. The pack is shrink-wrapped and the bottles have sealed caps.',
      features: ['Pack of 6 bottles', '50cl each', 'Chilled best', 'Sealed caps'],
      specs: { Quantity: '6 bottles', 'Per bottle': '50 cl', Flavour: 'Orange', Packaging: 'Shrink-wrapped pack', 'Shelf life': '6 months' }
    },
    {
      id: 'custard', name: 'Custard Powder', category: 'snacks', size: '500g tin',
      price: 4300, oldPrice: null, rating: 4.5, reviewCount: 112, badge: null, stock: 65,
      image: 'images/custard.png', scene: 'images/scene-warehouse.png',
      short: 'Smooth vanilla custard powder in a sealed 500g tin.',
      description: 'A 500g tin of vanilla custard powder. Mixes smooth without lumps and sets to a silky custard — good with bread, cake or on its own as a warm dessert.',
      features: ['500g sealed tin', 'Smooth, lump-free mix', 'Vanilla flavour', 'Ready in minutes'],
      specs: { Weight: '500 g', Flavour: 'Vanilla', Packaging: 'Sealed tin', 'Shelf life': '18 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'cornflakes', name: 'Cornflakes Cereal', category: 'snacks', size: '500g pack',
      price: 4800, oldPrice: 5200, rating: 4.4, reviewCount: 128, badge: 'sale', stock: 58,
      image: 'images/cornflakes.png', scene: 'images/scene-warehouse.png',
      short: 'Crisp golden cornflakes in a sealed 500g pack.',
      description: 'A 500g pack of golden cornflakes that stay crisp in milk. Fortified with vitamins and iron, and quick enough for a school morning. The inner bag reseals.',
      features: ['500g sealed pack', 'Fortified with vitamins', 'Stays crisp in milk', 'Resealable inner bag'],
      specs: { Weight: '500 g', Type: 'Cornflakes cereal', Packaging: 'Sealed carton', 'Shelf life': '12 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'honey', name: 'Pure Honey', category: 'snacks', size: '500ml jar',
      price: 5500, oldPrice: null, rating: 4.7, reviewCount: 96, badge: null, stock: 44,
      image: 'images/honey.png', scene: 'images/scene-warehouse.png',
      short: 'Raw, unfiltered honey in a sealed 500ml glass jar.',
      description: 'A 500ml glass jar of raw, unfiltered honey. Thick and aromatic, with no added sugar or syrup. Good in tea, on bread, or straight off the spoon.',
      features: ['500ml glass jar', 'Raw and unfiltered', 'No added sugar', 'Sealed lid'],
      specs: { Volume: '500 ml', Type: 'Raw honey', Packaging: 'Glass jar', 'Shelf life': '24 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'biscuits', name: 'Cream Sandwich Biscuits', category: 'snacks', size: '300g pack',
      price: 1600, oldPrice: 1800, rating: 4.3, reviewCount: 204, badge: 'sale', stock: 170,
      image: 'images/biscuits.png', scene: 'images/scene-warehouse.png',
      short: 'Vanilla cream sandwich biscuits in a sealed 300g pack.',
      description: 'A 300g pack of vanilla cream sandwich biscuits. Crunchy outside, creamy in the middle — a reliable tea-time and lunchbox biscuit.',
      features: ['300g sealed pack', 'Vanilla cream filling', 'Crunchy and fresh', 'Great for lunchboxes'],
      specs: { Weight: '300 g', Flavour: 'Vanilla cream', Packaging: 'Sealed pack', 'Shelf life': '12 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'chin-chin', name: 'Chin Chin Snack', category: 'snacks', size: '200g pack',
      price: 1200, oldPrice: null, rating: 4.5, reviewCount: 158, badge: null, stock: 190,
      image: 'images/chin-chin.png', scene: 'images/scene-warehouse.png',
      short: 'Crunchy, lightly sweetened chin chin in a sealed pack.',
      description: 'A 200g pack of chin chin — fried dough cubes that are crisp all the way through and only lightly sweet. Sealed to keep them crunchy.',
      features: ['200g sealed pack', 'Crisp and crunchy', 'Lightly sweetened', 'Sealed for crunch'],
      specs: { Weight: '200 g', Type: 'Chin chin snack', Packaging: 'Sealed pack', 'Shelf life': '6 months', Storage: 'Cool, dry place' }
    },
    {
      id: 'detergent', name: 'Washing Detergent Powder', category: 'household', size: '2kg bag',
      price: 4500, oldPrice: 5000, rating: 4.6, reviewCount: 187, badge: 'sale', stock: 95,
      image: 'images/detergent.png', scene: 'images/scene-warehouse.png',
      short: 'High-foam washing powder in a sealed 2kg bag.',
      description: 'A 2kg sealed bag of high-foam washing detergent powder. Cuts through grease and stains in hand-wash or machine, and rinses out clean without leaving residue.',
      features: ['2kg sealed bag', 'High-foam formula', 'Hand-wash and machine', 'Rinses clean'],
      specs: { Weight: '2 kg', Type: 'Washing detergent powder', Packaging: 'Sealed bag', 'Shelf life': '24 months', Use: 'Hand & machine wash' }
    },
    {
      id: 'laundry-soap', name: 'Laundry Soap Bar', category: 'household', size: '800g bar',
      price: 1500, oldPrice: null, rating: 4.5, reviewCount: 143, badge: null, stock: 160,
      image: 'images/laundry-soap.png', scene: 'images/scene-warehouse.png',
      short: 'A long-lasting 800g multi-purpose laundry soap bar.',
      description: 'An 800g bar of multi-purpose laundry soap. Tough on collars, cuffs and stains, and it lasts a long time. Wrapped and sealed to keep it dry.',
      features: ['800g wrapped bar', 'Multi-purpose', 'Tough on stains', 'Long lasting'],
      specs: { Weight: '800 g', Type: 'Laundry soap bar', Packaging: 'Wrapped bar', 'Shelf life': '24 months', Use: 'Hand wash' }
    },
    {
      id: 'tissue', name: 'Toilet Tissue', category: 'household', size: 'Pack of 4',
      price: 2200, oldPrice: 2500, rating: 4.4, reviewCount: 176, badge: 'sale', stock: 130,
      image: 'images/tissue.png', scene: 'images/scene-warehouse.png',
      short: 'Four soft 2-ply toilet tissue rolls, shrink-wrapped.',
      description: 'A shrink-wrapped pack of four 2-ply toilet tissue rolls. Soft but strong, and the pack keeps the rolls clean and dry in storage.',
      features: ['Pack of 4 rolls', '2-ply, soft and strong', 'Shrink-wrapped pack', 'Clean, dry storage'],
      specs: { Quantity: '4 rolls', Ply: '2-ply', Packaging: 'Shrink-wrapped pack', 'Shelf life': 'No expiry', Storage: 'Dry place' }
    },
    {
      id: 'toothpaste', name: 'Fluoride Toothpaste', category: 'personal-care', size: '140g tube',
      price: 1900, oldPrice: null, rating: 4.6, reviewCount: 152, badge: null, stock: 140,
      image: 'images/toothpaste.png', scene: 'images/scene-warehouse.png',
      short: 'Fresh mint fluoride toothpaste in a sealed 140g tube.',
      description: 'A 140g tube of fluoride toothpaste with a clean mint taste. Fights plaque and cavities and leaves your mouth properly fresh. Sealed in a box.',
      features: ['140g sealed tube', 'Fluoride protection', 'Fresh mint flavour', 'Fights plaque'],
      specs: { Weight: '140 g', Type: 'Fluoride toothpaste', Flavour: 'Mint', Packaging: 'Sealed box', 'Shelf life': '24 months' }
    },
    {
      id: 'diapers', name: 'Baby Diapers', category: 'baby-kids', size: 'Jumbo pack',
      price: 12500, oldPrice: 14000, rating: 4.7, reviewCount: 231, badge: 'bestseller', stock: 38,
      image: 'images/diapers.png', scene: 'images/scene-warehouse.png',
      short: 'A jumbo pack of ultra-absorbent baby diapers.',
      description: 'A jumbo pack of ultra-absorbent baby diapers with a soft, breathable back sheet and stretchy side panels. The wetness indicator and leak guards make night-time easier.',
      features: ['Jumbo pack', 'Ultra-absorbent core', 'Breathable back sheet', 'Wetness indicator'],
      specs: { Pack: 'Jumbo', Sizes: 'Medium / Large', Type: 'Disposable diapers', Packaging: 'Sealed pack', 'Shelf life': 'No expiry' }
    },
    {
      id: 'baby-cereal', name: 'Baby Cereal', category: 'baby-kids', size: '400g tin',
      price: 5200, oldPrice: null, rating: 4.6, reviewCount: 118, badge: null, stock: 48,
      image: 'images/baby-cereal.png', scene: 'images/scene-warehouse.png',
      short: 'Fortified infant cereal in a sealed 400g tin.',
      description: 'A 400g tin of fortified infant cereal, milled fine for babies from six months. Mixes smooth with warm water or milk and is fortified with iron and vitamins.',
      features: ['400g sealed tin', 'Fortified with iron', 'Fine, smooth texture', 'From 6 months'],
      specs: { Weight: '400 g', Type: 'Fortified infant cereal', Age: '6 months +', Packaging: 'Sealed tin', 'Shelf life': '18 months' }
    },
    {
      id: 'wet-wipes', name: 'Baby Wet Wipes', category: 'baby-kids', size: '80 sheets',
      price: 1800, oldPrice: 2000, rating: 4.5, reviewCount: 197, badge: 'sale', stock: 150,
      image: 'images/wet-wipes.png', scene: 'images/scene-warehouse.png',
      short: 'Fragrance-free baby wipes, 80 sheets per pack.',
      description: 'A pack of 80 fragrance-free baby wipes, soft and thick enough for nappy changes and sticky hands. The resealable lid keeps them moist to the last sheet.',
      features: ['80 sheets per pack', 'Fragrance-free', 'Soft and thick', 'Resealable lid'],
      specs: { Sheets: '80', Type: 'Baby wet wipes', Scent: 'Fragrance-free', Packaging: 'Resealable pack', 'Shelf life': '24 months' }
    }
  ];

  /* ---------- Delivery zones ---------- */
  var ZONES = [
    { id: 'island',    name: 'Lagos Island & Victoria Island',         fee: 1500, eta: 'Same day' },
    { id: 'mainland',  name: 'Lagos Mainland (Ikeja, Yaba, Surulere)', fee: 2000, eta: 'Same day' },
    { id: 'outskirts', name: 'Lagos Outskirts (Ikorodu, Badagry, Epe)',fee: 3000, eta: '1–2 days' },
    { id: 'abuja',     name: 'Abuja (FCT)',                            fee: 4500, eta: '2–3 days' },
    { id: 'ph',        name: 'Port Harcourt & Rivers',                 fee: 5000, eta: '2–3 days' },
    { id: 'other',     name: 'Other states (nationwide)',              fee: 6000, eta: '3–5 days' },
    { id: 'pickup',    name: 'Pickup at our Lagos store',              fee: 0,    eta: 'Ready in 2 hours' }
  ];

  /* ---------- Delivery discount rules (admin-editable) ---------- */
  var DEFAULT_DELIVERY_RULES = {
    freeOver: 50000,
    percentOff: 0,
    memberFree: true,
    codes: {
      FREEDEL: { type: 'free',    label: 'Free delivery' },
      HALFDEL: { type: 'percent', value: 50, label: '50% off delivery' }
    }
  };

  /* ---------- Seed coupons (admin-managed) ---------- */
  var SEED_COUPONS = [
    { code: 'WELCOME10', type: 'percent', value: 10, limit: 100, used: 23, active: true,  note: 'New customer welcome offer' },
    { code: 'RICE5',     type: 'percent', value: 5,  limit: 50,  used: 8,  active: true,  note: 'Rice & grains promo' },
    { code: 'LAGOS15',   type: 'percent', value: 15, limit: 20,  used: 20, active: true,  note: 'Lagos launch — fully redeemed' }
  ];

  /* ---------- Storage ---------- */
  var K = {
    cart: 'ladydee_cart', wish: 'ladydee_wishlist', users: 'ladydee_users',
    session: 'ladydee_session', orders: 'ladydee_orders', coupons: 'ladydee_coupons',
    delivery: 'ladydee_delivery_rules', admin: 'ladydee_admin_session',
    emails: 'ladydee_email_log', brevi: 'ladydee_brevi_config', seeded: 'ladydee_seeded_v1'
  };

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- Formatting ---------- */
  function money(n) {
    n = Number(n) || 0;
    var neg = n < 0; n = Math.abs(n);
    var s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '−' : '') + '\u20a6' + s;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  function stars(rating, cls) {
    var out = '<span class="stars ' + (cls || '') + '" aria-label="' + rating + ' out of 5">';
    for (var i = 1; i <= 5; i++) {
      out += '<span class="star' + (i <= Math.round(rating) ? ' on' : '') + '">' + icon('star') + '</span>';
    }
    return out + '</span>';
  }
  function fmtDate(d) {
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }
  function daysFromNow(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }

  /* ---------- Catalogue helpers ---------- */
  function product(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function catName(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
    return id;
  }
  function catIcon(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].icon;
    return 'basket';
  }
  function discountOf(p) {
    if (!p.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round((1 - p.price / p.oldPrice) * 100);
  }
  function searchProducts(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return PRODUCTS.slice();
    var words = q.split(/\s+/);
    return PRODUCTS.filter(function (p) {
      var hay = (p.name + ' ' + p.size + ' ' + catName(p.category) + ' ' + p.short + ' ' + p.description).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  }

  /* ---------- Cart ---------- */
  function getCart() { return read(K.cart, []); }
  function setCart(c) { write(K.cart, c); document.dispatchEvent(new Event('ladydee:cart')); }
  function addToCart(id, qty) {
    qty = qty || 1;
    var c = getCart(), found = false;
    for (var i = 0; i < c.length; i++) if (c[i].id === id) { c[i].qty += qty; found = true; }
    if (!found) c.push({ id: id, qty: qty });
    setCart(c);
  }
  function setQty(id, qty) {
    qty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    var c = getCart();
    for (var i = 0; i < c.length; i++) if (c[i].id === id) c[i].qty = qty;
    setCart(c);
  }
  function removeFromCart(id) { setCart(getCart().filter(function (x) { return x.id !== id; })); }
  function clearCart() { setCart([]); }
  function cartCount() { return getCart().reduce(function (n, x) { return n + x.qty; }, 0); }
  function cartLines() {
    return getCart().map(function (x) {
      var p = product(x.id);
      return p ? { product: p, qty: x.qty, line: p.price * x.qty } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() { return cartLines().reduce(function (n, l) { return n + l.line; }, 0); }

  /* ---------- Wishlist ---------- */
  function getWish() { return read(K.wish, []); }
  function setWish(w) { write(K.wish, w); document.dispatchEvent(new Event('ladydee:wish')); }
  function inWish(id) { return getWish().indexOf(id) > -1; }
  function toggleWish(id) {
    var w = getWish(), i = w.indexOf(id);
    if (i > -1) { w.splice(i, 1); setWish(w); return false; }
    w.push(id); setWish(w); return true;
  }
  function wishCount() { return getWish().length; }

  /* ---------- Coupons ---------- */
  function getCoupons() {
    var c = read(K.coupons, null);
    if (!c) { c = SEED_COUPONS.slice(); write(K.coupons, c); }
    return c;
  }
  function setCoupons(c) { write(K.coupons, c); }
  function findCoupon(code) {
    code = (code || '').trim().toUpperCase();
    var list = getCoupons();
    for (var i = 0; i < list.length; i++) if (list[i].code === code) return list[i];
    return null;
  }
  function applyCoupon(code) {
    var c = findCoupon(code);
    if (!c) return { ok: false, reason: 'That code is not recognised.' };
    if (!c.active) return { ok: false, reason: 'That code is no longer active.' };
    if (c.used >= c.limit) return { ok: false, reason: 'That code has reached its usage limit.' };
    return { ok: true, coupon: c };
  }
  function redeemCoupon(code) {
    var list = getCoupons();
    for (var i = 0; i < list.length; i++) {
      if (list[i].code === (code || '').toUpperCase()) { list[i].used = (list[i].used || 0) + 1; }
    }
    setCoupons(list);
  }

  /* ---------- Delivery ---------- */
  function getDeliveryRules() {
    var r = read(K.delivery, null);
    if (!r) { r = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_RULES)); write(K.delivery, r); }
    return r;
  }
  function setDeliveryRules(r) { write(K.delivery, r); }
  function zone(id) {
    for (var i = 0; i < ZONES.length; i++) if (ZONES[i].id === id) return ZONES[i];
    return ZONES[1];
  }
  function deliveryQuote(zoneId, subtotal, opts) {
    opts = opts || {};
    var z = zone(zoneId);
    var rules = getDeliveryRules();
    var base = z.fee;
    var discount = 0;
    var reasons = [];

    if (base === 0) {
      return { base: 0, discount: 0, fee: 0, label: 'Free', reasons: ['Pickup — no delivery fee'] };
    }
    if (rules.freeOver > 0 && subtotal >= rules.freeOver) {
      discount = base;
      reasons.push('Free delivery on orders over ' + money(rules.freeOver));
    } else if (opts.member && rules.memberFree) {
      discount = base;
      reasons.push('Free delivery for signed-in customers');
    } else if (opts.deliveryCode && rules.codes[opts.deliveryCode]) {
      var dc = rules.codes[opts.deliveryCode];
      if (dc.type === 'free') { discount = base; reasons.push(dc.label + ' applied'); }
      else if (dc.type === 'percent') { discount = base * (dc.value / 100); reasons.push(dc.label + ' applied'); }
    } else if (rules.percentOff > 0) {
      discount = base * (rules.percentOff / 100);
      reasons.push(rules.percentOff + '% off delivery');
    }

    discount = Math.min(discount, base);
    var fee = Math.max(0, base - discount);
    return {
      base: base, discount: discount, fee: fee,
      label: fee === 0 ? 'Free' : money(fee),
      reasons: reasons
    };
  }

  /* ---------- Auth ---------- */
  function getUsers() { return read(K.users, []); }
  function setUsers(u) { write(K.users, u); }
  function currentUser() {
    var s = read(K.session, null);
    if (!s) return null;
    var users = getUsers();
    for (var i = 0; i < users.length; i++) if (users[i].id === s.id) return users[i];
    return null;
  }
  function isLoggedIn() { return !!currentUser(); }
  function signup(data) {
    var users = getUsers();
    var email = (data.email || '').trim().toLowerCase();
    for (var i = 0; i < users.length; i++) if (users[i].email === email) return { ok: false, reason: 'An account with that email already exists.' };
    var u = {
      id: 'u' + Date.now(), name: data.name, email: email, phone: data.phone || '',
      password: data.password, verified: false, createdAt: new Date().toISOString(),
      addresses: []
    };
    users.push(u); setUsers(users);
    return { ok: true, user: u };
  }
  function verifyUser(email) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === (email || '').toLowerCase()) { users[i].verified = true; setUsers(users); return users[i]; }
    }
    return null;
  }
  function login(email, password) {
    var users = getUsers();
    email = (email || '').trim().toLowerCase();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        if (users[i].password !== password) return { ok: false, reason: 'That password is not correct.' };
        write(K.session, { id: users[i].id, email: users[i].email, name: users[i].name, at: Date.now() });
        return { ok: true, user: users[i] };
      }
    }
    return { ok: false, reason: 'No account found with that email.' };
  }
  function logout() { localStorage.removeItem(K.session); }
  function updateUser(patch) {
    var u = currentUser(); if (!u) return null;
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === u.id) {
        for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) users[i][k] = patch[k];
        setUsers(users);
        return users[i];
      }
    }
    return null;
  }
  function resetPassword(email, newPassword) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === (email || '').toLowerCase()) { users[i].password = newPassword; setUsers(users); return true; }
    }
    return false;
  }

  /* ---------- Orders ---------- */
  function getOrders() { return read(K.orders, []); }
  function setOrders(o) { write(K.orders, o); }
  function addOrder(o) { var all = getOrders(); all.unshift(o); setOrders(all); return o; }
  function updateOrder(code, patch) {
    var all = getOrders();
    for (var i = 0; i < all.length; i++) {
      if (all[i].code === code) {
        for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) all[i][k] = patch[k];
        setOrders(all); return all[i];
      }
    }
    return null;
  }
  function orderStatuses() {
    return ['placed', 'confirmed', 'packed', 'out-for-delivery', 'delivered'];
  }
  function statusLabel(s) {
    return ({ placed: 'Placed', confirmed: 'Confirmed', packed: 'Packed',
      'out-for-delivery': 'Out for delivery', delivered: 'Delivered',
      rejected: 'Rejected', cancelled: 'Cancelled' })[s] || s;
  }

  /* ---------- Seed demo data ---------- */
  function seed() {
    if (read(K.seeded, false)) return;
    var users = getUsers();
    if (!users.length) {
      users.push({
        id: 'u-demo', name: 'Alex Morgan', email: 'alex@example.com', phone: '+234 801 234 5678',
        password: 'demo1234', verified: true, createdAt: new Date().toISOString(),
        addresses: [
          { id: 'a1', label: 'Home', name: 'Alex Morgan', phone: '+234 801 234 5678',
            address: '27 Bourdillon Road, Ikoyi', city: 'Lagos', zone: 'island', isDefault: true },
          { id: 'a2', label: 'Office', name: 'Alex Morgan', phone: '+234 802 987 6543',
            address: '14 Adeola Odeku Street, Victoria Island', city: 'Lagos', zone: 'island', isDefault: false }
        ]
      });
      setUsers(users);
    }
    if (!getOrders().length) {
      var mk = function (code, daysAgo, status, items, zoneId, pay) {
        var sub = items.reduce(function (n, it) { var p = product(it.id); return n + (p ? p.price * it.qty : 0); }, 0);
        var q = deliveryQuote(zoneId, sub, { member: true });
        var tax = sub * 0.075;
        var d = daysFromNow(-daysAgo);
        return {
          code: code, date: d.toISOString(), status: status,
          items: items.map(function (it) {
            var p = product(it.id);
            return { id: it.id, name: p.name, size: p.size, image: p.image, price: p.price, qty: it.qty };
          }),
          subtotal: sub, discount: 0, deliveryBase: q.base, deliveryDiscount: q.discount,
          deliveryFee: q.fee, tax: tax, total: sub + q.fee + tax,
          coupon: null, deliveryCode: null,
          customer: { name: 'Alex Morgan', email: 'alex@example.com', phone: '+234 801 234 5678',
            address: '27 Bourdillon Road, Ikoyi', city: 'Lagos', zone: zoneId },
          payment: pay, eta: zone(zoneId).eta, source: 'sample'
        };
      };
      setOrders([
        mk('LDM-2026-10482', 2, 'out-for-delivery', [{ id: 'rice-10kg', qty: 1 }, { id: 'oil-5l', qty: 1 }, { id: 'tomato-paste', qty: 4 }], 'island', 'Card'),
        mk('LDM-2026-10391', 9, 'delivered', [{ id: 'noodles', qty: 1 }, { id: 'milk-powder', qty: 2 }, { id: 'sugar', qty: 1 }], 'mainland', 'Bank transfer'),
        mk('LDM-2026-10277', 21, 'delivered', [{ id: 'rice-50kg', qty: 1 }, { id: 'beans-10kg', qty: 1 }], 'island', 'Pay on delivery')
      ]);
    }
    write(K.seeded, true);
  }

  /* ---------- Clean URLs ---------- */
  var ROUTES = {
    'index': '/', 'products': '/products', 'product': '/product', 'cart': '/cart',
    'search': '/search', 'wishlist': '/wishlist', 'account': '/account', 'login': '/login',
    'signup': '/signup', 'forgot': '/forgot', 'workflows': '/workflows',
    'adeolaadaccess112': '/adeolaadaccess112'
  };
  function fileMode() { return /\.html?$/i.test(location.pathname); }
  function baseDir() { return location.pathname.replace(/[^/]*$/, ''); }
  function toHref(clean) {
    if (!fileMode()) return clean;
    var base = baseDir();
    if (clean === '/' || clean === '') return base + 'index.html';
    var parts = clean.replace(/^\//, '').split('?');
    return base + parts[0] + '.html' + (parts[1] ? '?' + parts[1] : '');
  }
  function normalizeLinks(root) {
    if (!fileMode()) return;
    (root || document).querySelectorAll('a[href^="/"]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (h.indexOf('//') === 0) return;
      a.setAttribute('href', toHref(h));
    });
  }
  function go(clean) { location.href = toHref(clean); }

  /* ---------- Toast ---------- */
  function toast(msg, ico) {
    var host = document.getElementById('toastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toastHost'; host.className = 'toast-host';
      document.body.appendChild(host);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="toast-ico">' + icon(ico || 'checkCircle') + '</span><span>' + esc(msg) + '</span>';
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('in'); });
    setTimeout(function () {
      el.classList.remove('in');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, 2600);
  }

  /* ---------- Reveal on scroll (fails open) ---------- */
  function observeReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
    /* Fail open: never leave content permanently hidden. Anything the observer
       has not revealed shortly after load is shown regardless of position —
       this page is also embedded in non-scrolling cards, where below-the-fold
       content would otherwise stay invisible forever. */
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (e) { e.classList.add('in'); });
    }, 1200);
  }

  /* ---------- Header / footer ---------- */
  function headerHTML(active) {
    var u = currentUser();
    var nav = [
      { href: '/', label: 'Home', key: 'home' },
      { href: '/products', label: 'Shop', key: 'products' },
      { href: '/workflows', label: 'How it works', key: 'workflows' }
    ];
    var cats = CATEGORIES.map(function (c) {
      return '<a class="cat-link" href="' + toHref('/products?cat=' + c.id) + '">' +
        '<span class="cat-ico">' + icon(c.icon) + '</span><span><b>' + esc(c.name) + '</b><small>' + esc(c.blurb) + '</small></span></a>';
    }).join('');

    return '' +
    '<div class="topbar"><div class="wrap">' +
      '<span class="topbar-msg">' + icon('truck') + ' Free delivery on orders over ' + money(getDeliveryRules().freeOver) + ' across Lagos</span>' +
      '<span class="topbar-links">' +
        '<a href="' + toHref('/workflows') + '">Delivery &amp; returns</a>' +
        '<a href="tel:+2348012345678">' + icon('phone') + ' 0801 234 5678</a>' +
      '</span>' +
    '</div></div>' +
    '<header class="header" id="siteHeader"><div class="wrap">' +
      '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">' + icon('menu') + '</button>' +
      '<a class="logo" href="' + toHref('/') + '">' +
        '<span class="logo-mark">' + icon('basket') + '</span>' +
        '<span class="logo-text">Ladydee<small>Minimart Store</small></span>' +
      '</a>' +
      '<div class="search-wrap" id="searchWrap">' +
        '<form class="search" id="searchForm" role="search" autocomplete="off">' +
          '<span class="search-ico">' + icon('search') + '</span>' +
          '<input type="search" id="searchInput" placeholder="Search rice, oil, noodles\u2026" aria-label="Search products" value="' + esc(param('q') || '') + '">' +
          '<button class="btn btn-primary btn-sm search-go" type="submit" aria-label="Search">' +
            '<span class="search-go-ico">' + icon('search') + '</span>' +
            '<span class="search-go-label">Search</span>' +
          '</button>' +
        '</form>' +
        '<div class="search-drop" id="searchDrop" hidden></div>' +
      '</div>' +
      '<nav class="mainnav" aria-label="Main">' +
        nav.map(function (n) {
          return '<a href="' + toHref(n.href) + '"' + (active === n.key ? ' class="on"' : '') + '>' + n.label + '</a>';
        }).join('') +
      '</nav>' +
      '<div class="head-actions">' +
        '<a class="icon-btn" href="' + toHref('/wishlist') + '" aria-label="Wishlist">' + icon('heart') +
          '<span class="badge" id="wishBadge"' + (wishCount() ? '' : ' hidden') + '>' + wishCount() + '</span></a>' +
        '<a class="icon-btn" href="' + toHref('/cart') + '" aria-label="Cart">' + icon('cart') +
          '<span class="badge" id="cartBadge"' + (cartCount() ? '' : ' hidden') + '>' + cartCount() + '</span></a>' +
        (u
          ? '<a class="account-chip" href="' + toHref('/account') + '"><span class="ac-av">' + esc((u.name || 'A').charAt(0).toUpperCase()) + '</span><span class="ac-name">' + esc((u.name || '').split(' ')[0]) + '</span></a>'
          : '<a class="icon-btn" href="' + toHref('/login') + '" aria-label="Sign in">' + icon('user') + '</a>') +
      '</div>' +
    '</div>' +
    '<div class="catbar"><div class="wrap">' + cats + '</div></div>' +
    '</header>' +
    '<div class="drawer-scrim" id="drawerScrim" hidden></div>' +
    '<aside class="drawer" id="drawer" aria-hidden="true">' +
      '<div class="drawer-head">' +
        '<a class="logo" href="' + toHref('/') + '"><span class="logo-mark">' + icon('basket') + '</span><span class="logo-text">Ladydee<small>Minimart Store</small></span></a>' +
        '<button class="icon-btn" id="drawerClose" aria-label="Close menu">' + icon('close') + '</button>' +
      '</div>' +
      '<div class="drawer-body">' +
        '<form class="search drawer-search" id="drawerSearchForm" role="search">' +
          '<span class="search-ico">' + icon('search') + '</span>' +
          '<input type="search" id="drawerSearchInput" placeholder="Search products\u2026" aria-label="Search products">' +
        '</form>' +
        '<div class="drawer-sec">' +
          '<span class="drawer-label">Menu</span>' +
          nav.map(function (n) { return '<a class="drawer-link" href="' + toHref(n.href) + '">' + n.label + '</a>'; }).join('') +
          '<a class="drawer-link" href="' + toHref('/wishlist') + '">Wishlist</a>' +
          '<a class="drawer-link" href="' + toHref('/cart') + '">Cart</a>' +
          (u ? '<a class="drawer-link" href="' + toHref('/account') + '">My account</a>'
             : '<a class="drawer-link" href="' + toHref('/login') + '">Sign in</a><a class="drawer-link" href="' + toHref('/signup') + '">Create account</a>') +
        '</div>' +
        '<div class="drawer-sec">' +
          '<span class="drawer-label">Shop by category</span>' +
          '<div class="drawer-cats">' + CATEGORIES.map(function (c) {
            return '<a class="drawer-cat" href="' + toHref('/products?cat=' + c.id) + '"><span class="cat-ico">' + icon(c.icon) + '</span>' + esc(c.name) + '</a>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="drawer-sec drawer-help">' +
          '<span class="drawer-label">Need help?</span>' +
          '<a class="drawer-link" href="tel:+2348012345678">' + icon('phone') + ' 0801 234 5678</a>' +
          '<a class="drawer-link" href="mailto:hello@ladydee.ng">' + icon('mail') + ' hello@ladydee.ng</a>' +
        '</div>' +
      '</div>' +
    '</aside>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '<footer class="footer"><div class="wrap">' +
      '<div class="foot-grid">' +
        '<div class="foot-brand">' +
          '<a class="logo logo-light" href="' + toHref('/') + '"><span class="logo-mark">' + icon('basket') + '</span><span class="logo-text">Ladydee<small>Minimart Store</small></span></a>' +
          '<p>Everyday groceries, sealed and delivered across Nigeria. Rice, oil, noodles, household and baby essentials at fair prices.</p>' +
          '<div class="foot-social">' +
            '<a href="#" aria-label="Facebook">' + icon('facebook') + '</a>' +
            '<a href="#" aria-label="Instagram">' + icon('instagram') + '</a>' +
            '<a href="#" aria-label="X">' + icon('twitter') + '</a>' +
            '<a href="#" aria-label="WhatsApp">' + icon('whatsapp') + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="foot-col"><h4>Shop</h4>' +
          CATEGORIES.slice(0, 5).map(function (c) {
            return '<a href="' + toHref('/products?cat=' + c.id) + '">' + esc(c.name) + '</a>';
          }).join('') +
          '<a href="' + toHref('/products') + '">All products</a>' +
        '</div>' +
        '<div class="foot-col"><h4>Account</h4>' +
          '<a href="' + toHref('/account') + '">My account</a>' +
          '<a href="' + toHref('/login') + '">Sign in</a>' +
          '<a href="' + toHref('/signup') + '">Create account</a>' +
          '<a href="' + toHref('/wishlist') + '">Wishlist</a>' +
          '<a href="' + toHref('/cart') + '">Cart &amp; checkout</a>' +
        '</div>' +
        '<div class="foot-col"><h4>Company</h4>' +
          '<a href="' + toHref('/workflows') + '">How it works</a>' +
          '<a href="' + toHref('/workflows') + '">Delivery &amp; returns</a>' +
          '<a href="' + toHref('/workflows') + '">Integrations</a>' +
          '<a href="' + toHref('/adeolaadaccess112') + '">Staff portal</a>' +
        '</div>' +
        '<div class="foot-col foot-contact"><h4>Contact</h4>' +
          '<a href="tel:+2348012345678">' + icon('phone') + ' 0801 234 5678</a>' +
          '<a href="mailto:hello@ladydee.ng">' + icon('mail') + ' hello@ladydee.ng</a>' +
          '<span>' + icon('mapPin') + ' 12 Adeniran Ogunsanya, Surulere, Lagos</span>' +
          '<span>' + icon('clock') + ' Mon–Sat, 8am – 8pm</span>' +
        '</div>' +
      '</div>' +
      '<div class="foot-bottom">' +
        '<span>&copy; ' + year + ' Ladydee Minimart Store. Demo store — no real payments are processed.</span>' +
        '<span class="foot-pay">' + ['Card', 'Bank transfer', 'Pay on delivery', 'USSD'].map(function (p) { return '<span class="pay-pill">' + p + '</span>'; }).join('') + '</span>' +
      '</div>' +
    '</div></footer>';
  }

  /* ---------- Live search dropdown ---------- */
  function initSearch() {
    var wrap = document.getElementById('searchWrap');
    var input = document.getElementById('searchInput');
    var drop = document.getElementById('searchDrop');
    var form = document.getElementById('searchForm');
    if (!wrap || !input || !drop) return;

    var POPULAR = ['Rice', 'Vegetable oil', 'Noodles', 'Milk powder', 'Diapers', 'Detergent', 'Tomato paste', 'Sugar'];

    function close() { drop.hidden = true; drop.innerHTML = ''; }

    function render(q) {
      q = (q || '').trim();
      if (!q) {
        drop.innerHTML =
          '<div class="sd-sec"><span class="sd-label">Popular searches</span><div class="sd-chips">' +
          POPULAR.map(function (p) { return '<button type="button" class="sd-chip" data-q="' + esc(p) + '">' + esc(p) + '</button>'; }).join('') +
          '</div></div>' +
          '<div class="sd-sec"><span class="sd-label">Shop by category</span><div class="sd-cats">' +
          CATEGORIES.map(function (c) {
            return '<a class="sd-cat" href="' + toHref('/products?cat=' + c.id) + '"><span class="cat-ico">' + icon(c.icon) + '</span>' + esc(c.name) + '</a>';
          }).join('') + '</div></div>';
        drop.hidden = false;
        return;
      }
      var res = searchProducts(q).slice(0, 6);
      if (!res.length) {
        drop.innerHTML = '<div class="sd-empty">' + icon('search') + '<b>No matches for “' + esc(q) + '”</b><small>Try “rice”, “oil” or “noodles”.</small></div>';
        drop.hidden = false;
        return;
      }
      drop.innerHTML =
        '<div class="sd-sec"><span class="sd-label">' + res.length + ' result' + (res.length === 1 ? '' : 's') + '</span>' +
        res.map(function (p) {
          return '<a class="sd-item" href="' + toHref('/product?id=' + p.id) + '">' +
            '<span class="sd-thumb"><img src="' + p.image + '" alt=""></span>' +
            '<span class="sd-info"><b>' + esc(p.name) + '</b><small>' + esc(p.size) + ' · ' + esc(catName(p.category)) + '</small></span>' +
            '<span class="sd-price">' + money(p.price) + '</span></a>';
        }).join('') +
        '</div>' +
        '<a class="sd-all" href="' + toHref('/search?q=' + encodeURIComponent(q)) + '">See all results for “' + esc(q) + '” ' + icon('arrowRight') + '</a>';
      drop.hidden = false;
    }

    input.addEventListener('focus', function () { render(input.value); });
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    drop.addEventListener('click', function (e) {
      var chip = e.target.closest('.sd-chip');
      if (chip) { input.value = chip.getAttribute('data-q'); render(input.value); input.focus(); }
    });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      go('/search' + (q ? '?q=' + encodeURIComponent(q) : ''));
    });
  }

  /* ---------- Drawer ---------- */
  function initDrawer() {
    var btn = document.getElementById('menuBtn');
    var drawer = document.getElementById('drawer');
    var scrim = document.getElementById('drawerScrim');
    var closeBtn = document.getElementById('drawerClose');
    if (!btn || !drawer) return;
    function open() {
      drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
      if (scrim) scrim.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
    function shut() {
      drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
      if (scrim) scrim.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', shut);
    if (scrim) scrim.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
    var df = document.getElementById('drawerSearchForm');
    if (df) df.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('drawerSearchInput').value.trim();
      shut(); go('/search' + (v ? '?q=' + encodeURIComponent(v) : ''));
    });
  }

  /* ---------- Badges ---------- */
  function refreshBadges() {
    var cb = document.getElementById('cartBadge');
    if (cb) { var n = cartCount(); cb.textContent = n; cb.hidden = !n; }
    var wb = document.getElementById('wishBadge');
    if (wb) { var w = wishCount(); wb.textContent = w; wb.hidden = !w; }
  }

  /* ---------- Product card ---------- */
  function productCard(p, opts) {
    opts = opts || {};
    var d = discountOf(p);
    var wished = inWish(p.id);
    var out = p.stock <= 0;
    return '<article class="pcard reveal' + (opts.compact ? ' pcard--compact' : '') + '">' +
      '<div class="pcard-media">' +
        '<a href="' + toHref('/product?id=' + p.id) + '" aria-label="' + esc(p.name) + '">' +
          '<img src="' + p.image + '" alt="' + esc(p.name) + ' ' + esc(p.size) + '">' +
        '</a>' +
        '<div class="pcard-tags">' +
          (d ? '<span class="tag tag-sale">−' + d + '%</span>' : '') +
          (p.badge === 'bestseller' ? '<span class="tag tag-best">Bestseller</span>' : '') +
          (p.badge === 'new' ? '<span class="tag tag-new">New</span>' : '') +
          (out ? '<span class="tag tag-out">Out of stock</span>' : '') +
        '</div>' +
        '<button class="wish-btn' + (wished ? ' on' : '') + '" data-wish="' + p.id + '" type="button" aria-label="' +
          (wished ? 'Remove from wishlist' : 'Add to wishlist') + '" aria-pressed="' + wished + '">' + icon('heart') + '</button>' +
      '</div>' +
      '<div class="pcard-body">' +
        '<span class="pcard-cat">' + esc(catName(p.category)) + '</span>' +
        '<h3 class="pcard-name"><a href="' + toHref('/product?id=' + p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<span class="pcard-size">' + esc(p.size) + '</span>' +
        '<div class="pcard-rate">' + stars(p.rating) + '<small>(' + p.reviewCount + ')</small></div>' +
        '<div class="pcard-foot">' +
          '<span class="pcard-price"><b>' + money(p.price) + '</b>' +
            (p.oldPrice ? '<s>' + money(p.oldPrice) + '</s>' : '') + '</span>' +
          '<button class="btn btn-primary btn-sm add-btn" data-add="' + p.id + '" type="button"' + (out ? ' disabled' : '') + '>' +
            icon('plus') + '<span>Add</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- Global delegated events ---------- */
  function initGlobalEvents() {
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        e.preventDefault();
        var id = add.getAttribute('data-add');
        addToCart(id, 1);
        var p = product(id);
        toast((p ? p.name : 'Item') + ' added to cart', 'cart');
        refreshBadges();
        return;
      }
      var w = e.target.closest('[data-wish]');
      if (w) {
        e.preventDefault();
        var wid = w.getAttribute('data-wish');
        var on = toggleWish(wid);
        w.classList.toggle('on', on);
        w.setAttribute('aria-pressed', String(on));
        w.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
        toast(on ? 'Saved to wishlist' : 'Removed from wishlist', 'heart');
        refreshBadges();
        return;
      }
    });
    document.addEventListener('ladydee:cart', refreshBadges);
    document.addEventListener('ladydee:wish', refreshBadges);
  }

  /* ---------- Boot ---------- */
  function mount(active) {
    seed();
    var h = document.getElementById('site-header');
    if (h) h.innerHTML = headerHTML(active);
    var f = document.getElementById('site-footer');
    if (f) f.innerHTML = footerHTML();
    initSearch();
    initDrawer();
    initGlobalEvents();
    refreshBadges();
    normalizeLinks();
    /* keep links injected after mount clean-URL aware when opened as local files */
    if (fileMode() && 'MutationObserver' in window) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        setTimeout(function () { pending = false; normalizeLinks(); }, 60);
      }).observe(document.body, { childList: true, subtree: true });
    }
    document.body.classList.add('js-ready');
    observeReveals();
    window.addEventListener('scroll', function () {
      var hd = document.getElementById('siteHeader');
      if (hd) hd.classList.toggle('is-stuck', window.scrollY > 8);
    }, { passive: true });
  }

  /* ---------- Public API ---------- */
  window.Ladydee = {
    icon: icon, esc: esc, money: money, param: param, stars: stars, fmtDate: fmtDate, daysFromNow: daysFromNow,
    CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS, ZONES: ZONES,
    product: product, catName: catName, catIcon: catIcon, discountOf: discountOf, searchProducts: searchProducts,
    getCart: getCart, addToCart: addToCart, setQty: setQty, removeFromCart: removeFromCart,
    clearCart: clearCart, cartCount: cartCount, cartLines: cartLines, cartSubtotal: cartSubtotal,
    getWish: getWish, inWish: inWish, toggleWish: toggleWish, wishCount: wishCount,
    getCoupons: getCoupons, setCoupons: setCoupons, findCoupon: findCoupon, applyCoupon: applyCoupon, redeemCoupon: redeemCoupon,
    getDeliveryRules: getDeliveryRules, setDeliveryRules: setDeliveryRules, zone: zone, deliveryQuote: deliveryQuote,
    getUsers: getUsers, setUsers: setUsers, currentUser: currentUser, isLoggedIn: isLoggedIn,
    signup: signup, verifyUser: verifyUser, login: login, logout: logout, updateUser: updateUser, resetPassword: resetPassword,
    getOrders: getOrders, setOrders: setOrders, addOrder: addOrder, updateOrder: updateOrder,
    orderStatuses: orderStatuses, statusLabel: statusLabel,
    toHref: toHref, go: go, normalizeLinks: normalizeLinks, fileMode: fileMode,
    toast: toast, observeReveals: observeReveals, productCard: productCard, refreshBadges: refreshBadges,
    mount: mount, read: read, write: write, K: K
  };
})();
