/* ============================================================
   Sokoni — shared app engine
   Catalog data · cart (localStorage) · UI helpers
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
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    watch: '<circle cx="12" cy="12" r="6"/><path d="M12 9.5V12l1.8 1.6"/><path d="M9.5 2.5h5l.6 3.2M9.5 21.5h5l.6-3.2"/>',
    sofa: '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4H2z"/><path d="M5 17v3M19 17v3"/>',
    shirt: '<path d="M20 5.5 16 2.5l-4 2.6-4-2.6-4 3 1.8 4.5L7.5 9v12h9V9l1.7 1Z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13C4 8 10 4 20 3c0 10-4 16-9 17Z"/><path d="M4 21c2-6 6-10 12-12"/>',
    tag: '<path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
    sparkles: '<path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z"/><path d="m18 15 .9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    userPlus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M19 8v6M22 11h-6"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M14 9l2 2"/>',
    clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 11h6M9 15h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    alert: '<path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
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
    facebook: '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1.1"/>',
    twitter: '<path d="M18.2 3H21l-6.3 7.2L22 21h-5.7l-4.5-5.9L6.6 21H3.8l6.7-7.7L2.6 3h5.8l4.1 5.4Zm-1 16.2h1.6L7.9 4.7H6.2Z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.6v.01M12 17v-3.6a2.2 2.2 0 0 1 4.4 0V17"/>',
    whatsapp: '<path d="M21 11.8a9 9 0 0 1-13.3 7.9L3 21l1.4-4.5A9 9 0 1 1 21 11.8Z"/><path d="M8.4 9.2c.3 2.6 2 4.3 4.6 4.6l1-1.3 1.7.8v1.4c-2.9.3-6.9-3.6-6.6-6.5h1.4l.8 1.7Z"/>'
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
    { id: 'electronics', name: 'Electronics', blurb: 'Phones, laptops & tablets', icon: 'cpu' },
    { id: 'audio',       name: 'Audio',       blurb: 'Headphones & speakers',   icon: 'headphones' },
    { id: 'wearables',   name: 'Wearables',   blurb: 'Smart & classic watches', icon: 'watch' },
    { id: 'home',        name: 'Home & Living', blurb: 'Furniture & lighting',  icon: 'sofa' },
    { id: 'fashion',     name: 'Fashion',     blurb: 'Bags, shoes & shades',    icon: 'shirt' },
    { id: 'wellness',    name: 'Wellness',    blurb: 'Care, coffee & fitness',  icon: 'leaf' }
  ];

  /* ---------- Products (sample catalog) ---------- */
  var PRODUCTS = [
    {
      id: 'aurora-x1', name: 'Aurora X1 Smartphone', category: 'electronics', brand: 'Aurora',
      price: 649, oldPrice: 749, rating: 4.7, reviewCount: 214, badge: 'bestseller', stock: 42,
      image: 'images/product-phone.png', scene: 'images/scene-hero.png',
      short: '6.5" OLED flagship with a 3-day battery and a 50MP main camera.',
      description: 'The Aurora X1 pairs a bright 6.5-inch OLED display with an efficient octa-core chip and a 5,000 mAh battery. The 50MP main sensor captures clean shots in low light, and dual stereo speakers make it just as good for films as it is for calls.',
      features: ['6.5" OLED display, 120Hz refresh', '50MP triple camera with night mode', '5,000 mAh battery, quick charge', '128GB storage, 8GB RAM'],
      specs: { Display: '6.5" OLED 120Hz', Battery: '5,000 mAh', Camera: '50MP + 12MP + 8MP', Storage: '128GB', Connectivity: '5G, Wi-Fi 6', Weight: '192 g' }
    },
    {
      id: 'nova-tab-11', name: 'Nova Tab 11 Tablet', category: 'electronics', brand: 'Nova',
      price: 429, oldPrice: null, rating: 4.5, reviewCount: 132, badge: 'new', stock: 28,
      image: 'images/product-tablet.png', scene: 'images/scene-hero.png',
      short: 'An 11-inch tablet with an included stylus, built for notes and sketches.',
      description: 'A light 11-inch tablet with a laminated screen and pressure-sensitive stylus included. Great for handwriting notes, annotating PDFs and light creative work — and it still lasts a full day of classes or meetings.',
      features: ['11" laminated display', 'Stylus included in the box', '8,000 mAh battery', 'Quad stereo speakers'],
      specs: { Display: '11" LCD 90Hz', Battery: '8,000 mAh', Storage: '128GB', Stylus: 'Included', Weight: '480 g' }
    },
    {
      id: 'vertex-14', name: 'Vertex 14 Ultrabook', category: 'electronics', brand: 'Vertex',
      price: 1149, oldPrice: 1299, rating: 4.8, reviewCount: 98, badge: 'sale', stock: 12,
      image: 'images/product-laptop.png', scene: 'images/scene-hero.png',
      short: 'A 14-inch aluminium laptop that stays quiet and cool all day.',
      description: 'Machined from a single aluminium block, the Vertex 14 weighs just 1.2 kg and runs silently thanks to a fanless thermal design. The 2.8K display covers 100% sRGB, making it a genuinely pleasant machine to work on.',
      features: ['14" 2.8K display, 100% sRGB', 'Fanless, silent operation', '16GB RAM / 512GB SSD', '16-hour battery life'],
      specs: { Display: '14" 2.8K', Memory: '16GB', Storage: '512GB SSD', Battery: '16 hours', Weight: '1.2 kg', Ports: '2× USB-C, 1× USB-A' }
    },
    {
      id: 'pulse-buds', name: 'Pulse Buds Pro', category: 'audio', brand: 'Pulse',
      price: 129, oldPrice: 159, rating: 4.6, reviewCount: 407, badge: 'bestseller', stock: 76,
      image: 'images/product-sneaker.png', scene: 'images/scene-hero.png',
      short: 'Compact earbuds with adaptive noise cancelling and 32h total playtime.',
      description: 'Pulse Buds Pro tune themselves to the shape of your ear and cancel up to 38dB of surrounding noise. Six microphones keep calls clear, and the case adds three extra charges for 32 hours of listening.',
      features: ['Adaptive noise cancelling', '32h total battery with case', 'IPX5 water resistance', 'Wireless charging case'],
      specs: { Driver: '11mm dynamic', ANC: 'Up to 38dB', Battery: '8h + 24h case', Rating: 'IPX5', Connectivity: 'Bluetooth 5.3' }
    },
    {
      id: 'halo-headphones', name: 'Halo Over-Ear Headphones', category: 'audio', brand: 'Halo',
      price: 249, oldPrice: null, rating: 4.8, reviewCount: 356, badge: 'new', stock: 33,
      image: 'images/product-headphones.png', scene: 'images/scene-hero.png',
      short: 'Wireless over-ears with plush memory-foam cups and studio tuning.',
      description: 'Halo headphones use 40mm drivers tuned flat, with memory-foam ear cushions that stay comfortable through a long working day. Forty hours of battery and multipoint pairing mean you can move between laptop and phone without reconnecting.',
      features: ['40mm tuned drivers', '40-hour battery life', 'Multipoint Bluetooth pairing', 'Foldable travel design'],
      specs: { Driver: '40mm dynamic', Battery: '40 hours', Weight: '253 g', Mic: 'Dual beamforming', Connectivity: 'Bluetooth 5.3 / 3.5mm' }
    },
    {
      id: 'boom-mini', name: 'Boom Mini Speaker', category: 'audio', brand: 'Boom',
      price: 69, oldPrice: 89, rating: 4.4, reviewCount: 521, badge: 'sale', stock: 88,
      image: 'images/product-speaker.png', scene: 'images/scene-hero.png',
      short: 'A pocket-sized speaker with surprising punch and full water resistance.',
      description: 'Small enough to clip to a bag, loud enough for a picnic. The Boom Mini is fully waterproof and dustproof, runs 20 hours per charge, and can be paired with a second unit for true stereo.',
      features: ['20-hour playtime', 'IP67 waterproof & dustproof', 'Stereo pairing with two units', 'Woven carry strap included'],
      specs: { Output: '10W', Battery: '20 hours', Rating: 'IP67', Weight: '310 g', Connectivity: 'Bluetooth 5.2' }
    },
    {
      id: 'orbit-watch-s2', name: 'Orbit Watch S2', category: 'wearables', brand: 'Orbit',
      price: 219, oldPrice: 259, rating: 4.7, reviewCount: 289, badge: 'bestseller', stock: 54,
      image: 'images/product-smartwatch.png', scene: 'images/scene-hero.png',
      short: 'A square-face smartwatch with GPS, SpO2 and 14-day battery.',
      description: 'Orbit Watch S2 tracks heart rate, blood oxygen and sleep, with built-in GPS so you can leave your phone behind on a run. The always-on display is readable in direct sun, and the battery genuinely lasts about two weeks.',
      features: ['Always-on AMOLED display', 'Built-in GPS + SpO2', '14-day typical battery', '5ATM water resistance'],
      specs: { Display: '1.75" AMOLED', Battery: '14 days typical', Sensors: 'HR, SpO2, GPS', Rating: '5ATM', Compatibility: 'iOS & Android' }
    },
    {
      id: 'meridian-watch', name: 'Meridian Classic Watch', category: 'wearables', brand: 'Meridian',
      price: 179, oldPrice: null, rating: 4.6, reviewCount: 143, badge: null, stock: 21,
      image: 'images/product-watch.png', scene: 'images/scene-hero.png',
      short: 'A quiet, automatic-feel dress watch with a sapphire crystal.',
      description: 'Clean dial, brushed steel case and a genuine leather strap. The Meridian Classic uses a reliable quartz movement with a five-year battery, and the sapphire crystal resists everyday scratches.',
      features: ['Sapphire crystal glass', 'Genuine leather strap', '50m water resistance', '5-year battery'],
      specs: { Case: '38mm brushed steel', Glass: 'Sapphire crystal', Movement: 'Quartz', Rating: '5ATM / 50m', Strap: 'Leather, 20mm' }
    },
    {
      id: 'terra-lounge', name: 'Terra Lounge Chair', category: 'home', brand: 'Terra',
      price: 389, oldPrice: 459, rating: 4.9, reviewCount: 76, badge: 'limited', stock: 9,
      image: 'images/product-chair.png', scene: 'images/scene-customer.png',
      short: 'A low, deep armchair in stain-resistant weave with oak legs.',
      description: 'The Terra is designed for long afternoons. The seat is deep, the back supports properly, and the fabric is treated to resist spills. Solid oak legs bolt on in minutes with the included tool.',
      features: ['Stain-resistant woven upholstery', 'Solid oak legs', 'Tool-free assembly in ~5 min', 'Seat height 42 cm'],
      specs: { Dimensions: '78 × 82 × 74 cm', Frame: 'Solid oak', Upholstery: 'Polyester weave', Weight: '19 kg', Assembly: 'Included tool' }
    },
    {
      id: 'lumen-lamp', name: 'Lumen Ceramic Table Lamp', category: 'home', brand: 'Lumen',
      price: 89, oldPrice: null, rating: 4.5, reviewCount: 188, badge: null, stock: 61,
      image: 'images/product-lamp.png', scene: 'images/scene-customer.png',
      short: 'A ceramic lamp with a warm linen shade and dimmable warmth control.',
      description: 'A simple, well-proportioned lamp. The matte ceramic base grounds it, the linen shade softens the light, and the inline dimmer lets you move from bright task light to something much warmer in the evening.',
      features: ['Dimmable warmth control', 'Hand-finished ceramic base', 'Natural linen shade', 'E27 fitting, bulb included'],
      specs: { Height: '46 cm', Base: 'Matte ceramic', Shade: 'Linen', Fitting: 'E27 (bulb included)', Cord: '1.8 m' }
    },
    {
      id: 'voyager-backpack', name: 'Voyager Canvas Backpack', category: 'fashion', brand: 'Voyager',
      price: 119, oldPrice: 149, rating: 4.7, reviewCount: 342, badge: 'bestseller', stock: 47,
      image: 'images/product-backpack.png', scene: 'images/scene-customer.png',
      short: 'A 24L waxed-canvas pack with a padded 16" laptop sleeve.',
      description: 'Built from waxed cotton canvas with full-grain leather trim, the Voyager carries a 24-litre load comfortably. The back panel is ventilated and the shoulder straps are genuinely padded, not decorative.',
      features: ['24L capacity', 'Padded 16" laptop sleeve', 'Waxed canvas, leather trim', 'Ventilated back panel'],
      specs: { Capacity: '24 L', Laptop: 'Up to 16"', Material: 'Waxed canvas', Trim: 'Full-grain leather', Weight: '1.1 kg' }
    },
    {
      id: 'drift-sneakers', name: 'Drift Low Sneakers', category: 'fashion', brand: 'Drift',
      price: 139, oldPrice: null, rating: 4.6, reviewCount: 264, badge: 'new', stock: 38,
      image: 'images/product-sneaker.png', scene: 'images/scene-customer.png',
      short: 'Clean leather low-tops on a flexible gum sole.',
      description: 'A minimal everyday sneaker in smooth leather, built on a flexible gum rubber sole. The insole is removable and cushioned, so they are comfortable without looking bulky.',
      features: ['Full-grain leather upper', 'Flexible gum rubber sole', 'Removable cushioned insole', 'Reinforced heel counter'],
      specs: { Upper: 'Full-grain leather', Sole: 'Gum rubber', Insole: 'Removable, cushioned', Sizes: '38–46', Weight: '340 g (size 42)' }
    },
    {
      id: 'solstice-shades', name: 'Solstice Sunglasses', category: 'fashion', brand: 'Solstice',
      price: 99, oldPrice: 129, rating: 4.4, reviewCount: 176, badge: null, stock: 52,
      image: 'images/product-sunglasses.png', scene: 'images/scene-customer.png',
      short: 'Lightweight acetate frames with polarised UV400 lenses.',
      description: 'Hand-finished acetate frames with polarised lenses that cut glare properly. They come with a hard case and a microfibre cloth, and the hinges are adjustable so they actually sit straight.',
      features: ['Polarised UV400 lenses', 'Hand-finished acetate', 'Adjustable hinges', 'Hard case included'],
      specs: { Frame: 'Acetate', Lens: 'Polarised UV400', Width: '145 mm', Case: 'Hard shell', Weight: '24 g' }
    },
    {
      id: 'verde-skincare', name: 'Verde Skincare Duo', category: 'wellness', brand: 'Verde',
      price: 59, oldPrice: null, rating: 4.8, reviewCount: 412, badge: 'bestseller', stock: 94,
      image: 'images/product-skincare.png', scene: 'images/scene-warehouse.png',
      short: 'A gentle cleanser and moisturiser pair for daily use.',
      description: 'A simple two-step routine: a fragrance-free gel cleanser that does not strip the skin, and a light moisturiser with ceramides and squalane. Suitable for daily use on most skin types.',
      features: ['Fragrance-free formulas', 'Ceramides + squalane', 'Dermatologist tested', 'Recyclable packaging'],
      specs: { Set: 'Cleanser 150ml + Moisturiser 100ml', Skin: 'All types', 'Free from': 'Fragrance, sulphates', Tested: 'Dermatologist', 'Shelf life': '24 months' }
    },
    {
      id: 'summit-roast', name: 'Summit Roast Coffee', category: 'wellness', brand: 'Summit',
      price: 24, oldPrice: 29, rating: 4.9, reviewCount: 638, badge: 'sale', stock: 120,
      image: 'images/product-coffee.png', scene: 'images/scene-warehouse.png',
      short: 'Single-origin whole beans, medium roast, roasted to order.',
      description: 'A balanced medium roast with notes of cocoa and orange peel. Beans are roasted in small batches the week they ship, and the bag has a one-way valve to keep them fresh.',
      features: ['Single-origin Arabica', 'Roasted to order', 'Cocoa & citrus notes', 'Resealable valve bag'],
      specs: { Weight: '1 kg', Roast: 'Medium', Origin: 'Single origin', Grind: 'Whole bean', Process: 'Washed' }
    },
    {
      id: 'flow-yoga-mat', name: 'Flow Yoga Mat', category: 'wellness', brand: 'Flow',
      price: 49, oldPrice: null, rating: 4.7, reviewCount: 297, badge: null, stock: 66,
      image: 'images/product-yoga.png', scene: 'images/scene-warehouse.png',
      short: 'A 6mm non-slip mat with alignment lines and a carry strap.',
      description: 'Six millimetres of cushioning with a grippy top layer that holds even when your hands get damp. Subtle alignment lines help with positioning, and the included strap makes it easy to carry.',
      features: ['6mm cushioned thickness', 'Non-slip textured surface', 'Alignment guide lines', 'Carry strap included'],
      specs: { Thickness: '6 mm', Dimensions: '183 × 61 cm', Material: 'TPE, latex-free', Weight: '1.0 kg', Strap: 'Included' }
    }
  ];

  /* ---------- Reviews ---------- */
  var REVIEWERS = [
    { name: 'Amara O.', color: '#0f9d76' },
    { name: 'Daniel K.', color: '#f5a524' },
    { name: 'Priya S.', color: '#3d5a80' },
    { name: 'Miguel R.', color: '#e5484d' },
    { name: 'Lena B.', color: '#0b7d5e' },
    { name: 'Tomas H.', color: '#7c5cff' },
    { name: 'Zainab A.', color: '#0891b2' },
    { name: 'Grace N.', color: '#d97706' }
  ];
  var REVIEW_TITLES = ['Exactly as described', 'Great value', 'Better than expected', 'Solid buy', 'Would buy again', 'Very happy'];
  var REVIEW_TEXTS = [
    'Arrived two days ahead of schedule and the packaging was genuinely nice. Build quality feels like it costs more than I paid.',
    'I compared three options before choosing this one and I do not regret it. Does everything it promises.',
    'Looks better in person than in the photos. Everything was in perfect condition out of the box.',
    'Took a day or two to get used to, but now I use it every single day. Very pleased.',
    'Ordered a second one as a gift right after mine arrived. That says it all really.',
    'Had a question about it before ordering and support replied within the hour. No complaints.',
    'Been using it for about a month now and it still feels brand new. Recommended.',
    'Better than the one it replaced in every way — lighter, nicer to use and better looking.',
    'Shipping was quick and the price here beat everywhere else I checked. Happy customer.',
    'Simple, well made and it just works. Exactly what I was looking for.'
  ];

  function hash(str) {
    var h = 0, i;
    for (i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) % 99991; }
    return h;
  }
  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }
  function reviewsFor(p) {
    var n = 4 + (hash(p.id) % 2);
    var out = [], i;
    var spread = [5, Math.round(p.rating), Math.max(4, Math.round(p.rating) - 1), Math.round(p.rating), 5];
    for (i = 0; i < n; i++) {
      var r = REVIEWERS[(hash(p.id) + i * 3) % REVIEWERS.length];
      out.push({
        name: r.name,
        color: r.color,
        rating: spread[i % spread.length],
        date: daysAgo(5 + i * 13 + (hash(p.id) % 7)),
        title: REVIEW_TITLES[(hash(p.id) + i) % REVIEW_TITLES.length],
        text: REVIEW_TEXTS[(hash(p.id) + i * 5) % REVIEW_TEXTS.length]
      });
    }
    return out;
  }
  function ratingBreakdown(p) {
    var r = p.rating;
    var five = Math.round((r - 3.2) / 1.8 * 78); five = Math.max(38, Math.min(84, five));
    var four = Math.round((100 - five) * 0.62);
    var three = Math.round((100 - five - four) * 0.6);
    var two = Math.max(1, Math.round((100 - five - four - three) * 0.6));
    var one = Math.max(1, 100 - five - four - three - two);
    return [five, four, three, two, one];
  }

  /* ---------- Helpers ---------- */
  function money(n) {
    var v = Math.round(n * 100) / 100;
    return '$' + (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2));
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function discountOf(p) {
    if (!p.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round((1 - p.price / p.oldPrice) * 100);
  }
  function catName(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
    return 'Products';
  }
  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }
  function starHTML(rating, count, size) {
    var full = Math.round(rating), i, s = '<span class="stars">', t = '';
    for (i = 1; i <= 5; i++) {
      t += '<span style="opacity:' + (i <= full ? 1 : .28) + '">' + icon('star') + '</span>';
    }
    s += '<span class="s-icons">' + t + '</span>';
    s += '<span>' + rating.toFixed(1) + (count != null ? ' (' + count + ')' : '') + '</span></span>';
    return s;
  }
  function badgeHTML(p) {
    var out = '', d = discountOf(p);
    var map = { bestseller: ['best', 'Bestseller'], new: ['new', 'New'], limited: ['limited', 'Limited'] };
    if (p.badge && map[p.badge]) out += '<span class="tag ' + map[p.badge][0] + '">' + map[p.badge][1] + '</span>';
    if (p.badge === 'sale' || d >= 12) out += '<span class="tag sale">-' + (d || 15) + '%</span>';
    return out;
  }

  /* ---------- Wishlist ---------- */
  var WKEY = 'sokoni_wishlist';
  function wishlist() { try { return JSON.parse(localStorage.getItem(WKEY)) || []; } catch (e) { return []; } }
  function toggleWish(id) {
    var w = wishlist(), i = w.indexOf(id);
    if (i > -1) { w.splice(i, 1); } else { w.push(id); }
    try { localStorage.setItem(WKEY, JSON.stringify(w)); } catch (e) {}
    return i === -1;
  }

  /* ---------- Cart ---------- */
  var CKEY = 'sokoni_cart';
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CKEY)) || []; } catch (e) { return []; }
  }
  function setCart(c) {
    try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {}
    updateBadge();
    document.dispatchEvent(new CustomEvent('sokoni:cart'));
  }
  function addToCart(id, qty) {
    qty = qty || 1;
    var p = getProduct(id);
    if (!p) return 0;
    var c = getCart(), found = false;
    for (var i = 0; i < c.length; i++) {
      if (c[i].id === id) { c[i].qty = Math.min(99, c[i].qty + qty); found = true; }
    }
    if (!found) c.push({ id: id, qty: Math.min(99, qty) });
    setCart(c);
    pulseBadge();
    return qty;
  }
  function setQty(id, qty) {
    var c = getCart();
    if (qty <= 0) { c = c.filter(function (x) { return x.id !== id; }); }
    else { c = c.map(function (x) { return x.id === id ? { id: x.id, qty: Math.min(99, qty) } : x; }); }
    setCart(c);
  }
  function removeFromCart(id) { setQty(id, 0); }
  function clearCart() { setCart([]); }
  function cartCount() { return getCart().reduce(function (s, x) { return s + x.qty; }, 0); }
  function cartLines() {
    return getCart().map(function (x) {
      var p = getProduct(x.id);
      return p ? { product: p, qty: x.qty, line: p.price * x.qty } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() { return cartLines().reduce(function (s, l) { return s + l.line; }, 0); }
  function shippingFor(sub) { return sub === 0 ? 0 : (sub >= 100 ? 0 : 9.9); }

  var PROMOS = { SOKONI10: { type: 'percent', value: 10, label: '10% off' }, FREESHIP: { type: 'ship', label: 'Free shipping' } };
  function applyPromo(code) {
    code = String(code || '').trim().toUpperCase();
    return PROMOS[code] ? { code: code, ok: true, promo: PROMOS[code] } : { code: code, ok: false };
  }
  function totals(promoCode) {
    var sub = cartSubtotal();
    var ship = shippingFor(sub);
    var disc = 0;
    var pr = promoCode ? PROMOS[promoCode] : null;
    if (pr) {
      if (pr.type === 'percent') disc = sub * (pr.value / 100);
      else ship = 0;
    }
    var tax = (sub - disc) * 0.075;
    return { sub: sub, ship: ship, disc: disc, tax: tax, total: Math.max(0, sub - disc + ship + tax) };
  }

  /* ---------- Badge ---------- */
  function setBadge(sel, n) {
    document.querySelectorAll(sel).forEach(function (b) {
      b.textContent = n > 99 ? '99+' : n;
      b.classList.toggle('show', n > 0);
    });
  }
  function updateBadge() {
    setBadge('.cart-badge', cartCount());
    setBadge('.wish-badge', wishlist().length);
  }
  function pulseBadge() {
    var b = document.querySelector('.cart-badge');
    if (!b) return;
    b.classList.remove('pulse');
    void b.offsetWidth;
    b.classList.add('pulse');
  }

  /* ---------- Toast ---------- */
  function toast(msg, icoName) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="t-ico">' + icon(icoName || 'check') + '</span><span>' + esc(msg) + '</span>';
    wrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, 2600);
  }

  /* ---------- Product card ---------- */
  function productCardHTML(p) {
    var d = discountOf(p);
    return '<article class="pcard reveal">' +
      '<div class="pcard-media">' +
        '<div class="badges">' + badgeHTML(p) + '</div>' +
        '<button class="wish" data-wish="' + p.id + '" aria-label="Save ' + esc(p.name) + '">' + icon('heart') + '</button>' +
        '<a href="product.html?id=' + p.id + '" aria-label="' + esc(p.name) + '">' +
          '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '</div>' +
      '<div class="pcard-body">' +
        '<span class="pcard-cat">' + esc(catName(p.category)) + '</span>' +
        '<h3 class="pcard-title"><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' +
        starHTML(p.rating, p.reviewCount) +
        '<div class="price-row">' +
          '<span class="price">' + money(p.price) + '</span>' +
          (p.oldPrice ? '<span class="price-old">' + money(p.oldPrice) + '</span>' : '') +
          (d ? '<span class="save">Save ' + d + '%</span>' : '') +
        '</div>' +
        '<div class="pcard-actions">' +
          '<button class="btn btn-primary btn-sm" data-add="' + p.id + '">' + icon('cart') + '<span>Add to cart</span></button>' +
          '<a class="btn btn-outline btn-sm" href="product.html?id=' + p.id + '" aria-label="View details">' + icon('eye') + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function renderProducts(sel, list) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<div class="empty" style="grid-column:1/-1"><b>No products found</b>Try removing a filter or two, or search for something else.</div>';
      return;
    }
    el.innerHTML = list.map(productCardHTML).join('');
    observeReveals(el);
  }

  /* ---------- Reveal on scroll ---------- */
  var io = null;
  function observeReveals(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var el = en.target, d = el.getAttribute('data-delay');
            if (d) el.style.setProperty('--d', d);
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -40px' });
    }
    els.forEach(function (e) { io.observe(e); });
  }
  /* Safety net: never leave content hidden. Scroll-reveal is a flourish, not a
     requirement — anything not yet revealed shortly after load (short viewport,
     embedded/scrollless iframe, print, screenshot) is shown outright. */
  function revealSafety() {
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (e, i) {
        e.style.setProperty('--d', Math.min(i * 0.04, 0.4).toFixed(2) + 's');
        e.classList.add('in');
      });
    }, 900);
  }
  function stagger(sel, step) {
    var els = document.querySelectorAll(sel);
    els.forEach(function (e, i) { e.setAttribute('data-delay', (i * (step || 0.06)).toFixed(2) + 's'); });
  }

  /* ---------- Shared chrome (header + footer) ---------- */
  var NAV_ITEMS = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'products.html', label: 'Shop', key: 'products' },
    { href: 'search.html', label: 'Search', key: 'search' },
    { href: 'wishlist.html', label: 'Wishlist', key: 'wishlist' },
    { href: 'workflows.html', label: 'Workflows & Integrations', key: 'workflows' }
  ];

  var LOGO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16l-1.4 12.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8Z"/><path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7"/></svg>';

  function headerHTML() {
    var nav = NAV_ITEMS.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.key + '">' + n.label + '</a>';
    }).join('');
    var drawer = NAV_ITEMS.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.key + '">' + n.label + ' ' + icon('chevronRight') + '</a>';
    }).join('');
    return '' +
    '<div class="topbar"><div class="wrap">' +
      '<span>Free delivery on orders over ' + money(100) + ' &nbsp;<span class="dot">&middot;</span>&nbsp; 30-day easy returns</span>' +
      '<span class="topbar-links"><a href="account.html#orders">Track order</a><a href="wishlist.html">Wishlist</a><a href="account.html">Account</a></span>' +
    '</div></div>' +
    '<header class="header"><div class="wrap">' +
      '<a class="logo" href="index.html" aria-label="Sokoni home"><span class="logo-mark">' + LOGO_SVG + '</span>Sokoni</a>' +
      '<form class="search" role="search" autocomplete="off"><label for="siteSearch" class="sr-only">Search products</label>' +
        icon('search') +
        '<input id="siteSearch" type="search" placeholder="Search products, brands and categories" autocomplete="off" aria-label="Search products">' +
        '<div class="search-suggest" id="searchSuggest" hidden></div>' +
      '</form>' +
      '<nav class="nav" aria-label="Primary">' + nav + '</nav>' +
      '<div class="header-actions">' +
        '<a class="icon-btn" href="wishlist.html" aria-label="Wishlist">' + icon('heart') + '<span class="wish-badge">0</span></a>' +
        '<span class="acct-slot" id="acctSlot"></span>' +
        '<button class="icon-btn hamburger" aria-label="Open menu">' + icon('menu') + '</button>' +
        '<a class="icon-btn" href="cart.html" aria-label="Cart">' + icon('cart') + '<span class="cart-badge">0</span></a>' +
      '</div>' +
    '</div></header>' +
    '<div class="scrim"></div>' +
    '<aside class="drawer" aria-label="Mobile menu">' +
      '<div class="drawer-head"><a class="logo" href="index.html"><span class="logo-mark">' + LOGO_SVG + '</span>Sokoni</a>' +
      '<button class="icon-btn" data-close-drawer aria-label="Close menu">' + icon('close') + '</button></div>' +
      '<form class="drawer-search" id="drawerSearch" role="search">' + icon('search') +
        '<input type="search" placeholder="Search products" aria-label="Search products"></form>' +
      drawer +
      '<a class="btn btn-primary" href="cart.html" style="margin-top:14px">' + icon('cart') + ' View cart</a>' +
      '<a class="btn btn-outline" href="account.html" style="margin-top:10px">' + icon('user') + ' Your account</a>' +
      '<a class="btn btn-outline" href="wishlist.html" style="margin-top:10px">' + icon('heart') + ' Wishlist</a>' +
    '</aside>';
  }

  function footerHTML() {
    var cats = CATEGORIES.slice(0, 5).map(function (c) {
      return '<a href="products.html?cat=' + c.id + '">' + c.name + '</a>';
    }).join('');
    return '' +
    '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div class="footer-about">' +
          '<a class="logo" href="index.html"><span class="logo-mark">' + LOGO_SVG + '</span>Sokoni</a>' +
          '<p>A clean, simple marketplace for everyday technology, home and lifestyle goods — delivered fast, returned easily.</p>' +
          '<ul class="contact-list">' +
            '<li>' + icon('mapPin') + '<span>14 Harbour Way, Victoria Island<br>Lagos, Nigeria</span></li>' +
            '<li>' + icon('phone') + '<a href="tel:+2348007654321">+234 800 765 4321</a></li>' +
            '<li>' + icon('mail') + '<a href="mailto:hello@sokoni.example">hello@sokoni.example</a></li>' +
            '<li>' + icon('clock') + '<span>Support daily, 8:00–20:00 WAT</span></li>' +
          '</ul>' +
          '<div class="socials">' +
            '<a href="index.html" aria-label="Facebook">' + icon('facebook') + '</a>' +
            '<a href="index.html" aria-label="Instagram">' + icon('instagram') + '</a>' +
            '<a href="index.html" aria-label="X">' + icon('twitter') + '</a>' +
            '<a href="index.html" aria-label="YouTube">' + icon('youtube') + '</a>' +
            '<a href="index.html" aria-label="LinkedIn">' + icon('linkedin') + '</a>' +
          '</div>' +
        '</div>' +
        '<div><h4>Shop</h4><nav class="footer-links">' + cats +
          '<a href="search.html">Search products</a><a href="wishlist.html">Wishlist</a></nav></div>' +
        '<div><h4>Your account</h4><nav class="footer-links">' +
          '<a href="login.html">Sign in</a><a href="signup.html">Create account</a><a href="account.html">My account</a>' +
          '<a href="account.html#orders">Order history</a><a href="forgot.html">Forgot password</a></nav></div>' +
        '<div><h4>Company</h4><nav class="footer-links">' +
          '<a href="index.html">About us</a><a href="workflows.html">Careers</a><a href="workflows.html">Sell on Sokoni</a>' +
          '<a href="workflows.html">Affiliates</a><a href="workflows.html">Press</a></nav></div>' +
        '<div><h4>Support</h4><nav class="footer-links">' +
          '<a href="workflows.html">Help centre</a><a href="account.html#orders">Track your order</a><a href="workflows.html">Shipping &amp; delivery</a>' +
          '<a href="workflows.html">Returns &amp; refunds</a><a href="workflows.html">Contact us</a></nav></div>' +
        '<div><h4>Stay in the loop</h4>' +
          '<p style="font-size:.89rem;margin-bottom:14px">Deals and new arrivals, roughly twice a month. No noise.</p>' +
          '<form class="nl-form" data-nl style="flex-direction:column">' +
            '<input type="email" placeholder="you@example.com" aria-label="Email address" required>' +
            '<button class="btn btn-accent btn-block" type="submit">' + icon('send') + ' Subscribe</button>' +
          '</form></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; <span data-year></span> Sokoni Marketplace. A fictional store built as a demonstration — no real payments are processed.</span>' +
        '<div class="pay-badges"><span>VISA</span><span>MASTERCARD</span><span>PAYSTACK</span><span>FLUTTERWAVE</span><span>PAY ON DELIVERY</span></div>' +
      '</div>' +
    '</div></footer>';
  }

  /* ---------- Header / nav ---------- */
  function initChrome() {
    var h = document.getElementById('site-header');
    if (h && !h.childElementCount) h.innerHTML = headerHTML();
    var f = document.getElementById('site-footer');
    if (f && !f.childElementCount) f.innerHTML = footerHTML();

    updateBadge();

    var header = document.querySelector('.header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var year = document.querySelectorAll('[data-year]');
    year.forEach(function (e) { e.textContent = new Date().getFullYear(); });

    var page = document.body.getAttribute('data-page');
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('is-active');
    });

    var hb = document.querySelector('.hamburger');
    var drawer = document.querySelector('.drawer');
    var scrim = document.querySelector('.scrim');
    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (scrim) scrim.classList.remove('show');
      var f = document.querySelector('.filters');
      if (f && f.classList.contains('open')) f.classList.remove('open');
    }
    if (hb && drawer) {
      hb.addEventListener('click', function () {
        drawer.classList.toggle('open');
        if (scrim) scrim.classList.toggle('show', drawer.classList.contains('open'));
      });
    }
    if (scrim) scrim.addEventListener('click', closeDrawer);
    document.querySelectorAll('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    var dForm = document.getElementById('drawerSearch');
    if (dForm) {
      dForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = dForm.querySelector('input').value.trim();
        window.location.href = 'search.html' + (v ? '?q=' + encodeURIComponent(v) : '');
      });
    }

    document.querySelectorAll('form[data-nl]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = f.querySelector('input');
        if (inp && inp.value.trim()) { toast('Thanks — you are on the list!', 'mail'); inp.value = ''; }
        else { toast('Please enter an email address', 'bell'); }
      });
    });

    initHeaderSearch();
    initAccountSlot();
  }

  /* ---------- Header: live search dropdown ---------- */
  function searchMatches(q, limit) {
    var s = String(q || '').toLowerCase().trim();
    if (!s) return [];
    var out = PRODUCTS.filter(function (p) {
      return (p.name + ' ' + p.brand + ' ' + catName(p.category) + ' ' + p.short).toLowerCase().indexOf(s) > -1;
    });
    out.sort(function (a, b) { return b.rating - a.rating; });
    return limit ? out.slice(0, limit) : out;
  }

  function initHeaderSearch() {
    var form = document.querySelector('.search');
    var input = document.getElementById('siteSearch');
    var box = document.getElementById('searchSuggest');
    if (form && form.tagName === 'FORM') {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = (input && input.value || '').trim();
        window.location.href = 'search.html' + (v ? '?q=' + encodeURIComponent(v) : '');
      });
    }
    if (!input || !box) return;

    var cats = CATEGORIES.slice(0, 4).map(function (c) { return c.name; });
    var POPULAR = ['headphones', 'smartwatch', 'coffee', 'backpack', 'lamp', 'sneakers'];

    function panelHTML() {
      var q = input.value.trim();
      if (!q) {
        return '<p class="ss-head">' + icon('search') + ' Popular searches</p>' +
          '<div class="ss-terms">' + POPULAR.map(function (w) {
            return '<button type="button" class="ss-term" data-term="' + esc(w) + '">' + esc(w) + '</button>';
          }).join('') + '</div>' +
          '<p class="ss-head" style="margin-top:14px">' + icon('grid') + ' Browse categories</p>' +
          '<div class="ss-terms">' + cats.map(function (c) {
            return '<button type="button" class="ss-term" data-term="' + esc(c) + '">' + esc(c) + '</button>';
          }).join('') + '</div>';
      }
      var matches = searchMatches(q, 5);
      var head = '<p class="ss-head">' + (matches.length
        ? matches.length + ' match' + (matches.length === 1 ? '' : 'es') + ' for \u201c' + esc(q) + '\u201d'
        : 'No products match \u201c' + esc(q) + '\u201d') + '</p>';
      if (!matches.length) return head + '<p class="ss-empty">Try a different word, or browse the full catalogue.</p>';
      return head + matches.map(function (p) {
        return '<a class="sug" href="product.html?id=' + p.id + '">' +
          '<span class="sug-media"><img src="' + p.image + '" alt=""></span>' +
          '<span class="sug-info"><b>' + esc(p.name) + '</b><small>' + esc(catName(p.category)) + '</small></span>' +
          '<span class="sug-price">' + money(p.price) + '</span></a>';
      }).join('') +
      '<a class="ss-all" href="search.html?q=' + encodeURIComponent(q) + '">See all results ' + icon('arrowRight') + '</a>';
    }
    function open() { box.innerHTML = panelHTML(); box.hidden = false; }
    function close() { box.hidden = true; }

    input.addEventListener('input', open);
    input.addEventListener('focus', open);
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); input.blur(); } });
    box.addEventListener('click', function (e) {
      var term = e.target.closest('[data-term]');
      if (term) { input.value = term.getAttribute('data-term'); input.focus(); open(); }
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });
  }

  /* ---------- Header: account slot ---------- */
  function initAccountSlot() {
    var slot = document.getElementById('acctSlot');
    if (!slot) return;
    var u = currentUser();
    if (u) {
      var label = u.firstName || u.name || u.email || 'Account';
      slot.innerHTML = '<a class="account-chip" href="account.html" title="' + esc(label + ' \u00b7 ' + (u.email || '')) + '">' +
        '<span class="av">' + esc(label.charAt(0).toUpperCase()) + '</span>' +
        '<span class="u-name">' + esc(u.firstName || 'Account') + '</span></a>';
    } else {
      slot.innerHTML = '<a class="icon-btn" href="login.html" aria-label="Sign in">' + icon('user') + '</a>';
    }
  }

  /* ---------- Wishlist UI sync ---------- */
  function refreshWishUI() {
    updateBadge();
    document.querySelectorAll('[data-wish]').forEach(function (b) {
      var on = wishlist().indexOf(b.getAttribute('data-wish')) > -1;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- Global delegated clicks ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var id = add.getAttribute('data-add');
      var qtyEl = document.getElementById('pdpQty');
      var q = (add.getAttribute('data-from') === 'pdp' && qtyEl) ? parseInt(qtyEl.value, 10) || 1 : 1;
      addToCart(id, q);
      var p = getProduct(id);
      toast((p ? p.name : 'Item') + ' added to cart');
      return;
    }
    var wish = e.target.closest('[data-wish]');
    if (wish) {
      var on = toggleWish(wish.getAttribute('data-wish'));
      refreshWishUI();
      toast(on ? 'Saved to your wishlist' : 'Removed from wishlist', 'heart');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js-ready');
    /* one-time demo data: an account and a few past orders */
    try { seedDemoUser(); seedOrders(); } catch (e) {}
    initChrome();
    refreshWishUI();
    observeReveals();
    revealSafety();
  });

  /* ============================================================
     Auth & orders — entirely client-side (localStorage).
     No backend, no network requests, no data leaves the browser.
     This exists to demonstrate a sign-up → verify → login → account flow.
     ============================================================ */
  var USERS_KEY   = 'sokoni_users';
  var SESSION_KEY = 'sokoni_session';
  var ORDERS_KEY  = 'sokoni_orders';
  var DAYS        = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function lsGet(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function fmtDate(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function fmtDateFull(d) { return DAYS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
  function isEmail(s) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s || '').trim()); }

  function users() { return lsGet(USERS_KEY, []) || []; }
  function findUser(email) {
    email = String(email || '').trim().toLowerCase();
    var list = users();
    for (var i = 0; i < list.length; i++) if (list[i].email === email) return list[i];
    return null;
  }
  function currentUser() {
    var email = lsGet(SESSION_KEY, null);
    return email ? findUser(email) : null;
  }

  /* A demo account is pre-seeded so the account dashboard has something to show. */
  function seedDemoUser() {
    if (findUser('alex@example.com')) return;
    var list = users();
    list.push({
      id: 'u-demo',
      email: 'alex@example.com',
      firstName: 'Alex', lastName: 'Morgan',
      password: 'demo1234',
      phone: '+234 801 234 5678',
      dob: '1994-06-12',
      marketing: true,
      verified: true,
      createdAt: '12 Sep 2026',
      addresses: [{
        id: 'addr-home', label: 'Home', name: 'Alex Morgan',
        line1: '27 Bourdillon Road', city: 'Lagos', region: 'Lagos State',
        postal: '101241', country: 'Nigeria', phone: '+234 801 234 5678', isDefault: true
      }]
    });
    lsSet(USERS_KEY, list);
  }

  function signup(data) {
    var email = String(data.email || '').trim().toLowerCase();
    if (!isEmail(email)) return { ok: false, error: 'Please enter a valid email address.' };
    if (!data.password || data.password.length < 6) return { ok: false, error: 'Choose a password with at least 6 characters.' };
    if (findUser(email)) return { ok: false, error: 'An account with that email already exists — try signing in instead.' };
    var user = {
      id: 'u-' + Date.now().toString(36),
      email: email,
      firstName: String(data.firstName || '').trim(),
      lastName: String(data.lastName || '').trim(),
      password: data.password,
      phone: String(data.phone || '').trim(),
      dob: String(data.dob || ''),
      marketing: !!data.marketing,
      verified: false,
      createdAt: fmtDate(new Date()),
      addresses: []
    };
    var list = users();
    list.push(user);
    lsSet(USERS_KEY, list);
    /* Verification is simulated: mark verified right away and start the session. */
    setTimeout(function () {
      var l = users();
      for (var i = 0; i < l.length; i++) if (l[i].email === email) { l[i].verified = true; }
      lsSet(USERS_KEY, l);
    }, 1200);
    lsSet(SESSION_KEY, email);
    return { ok: true, email: email };
  }

  function login(email, password) {
    var u = findUser(email);
    if (!u) return { ok: false, error: 'We could not find an account with that email.' };
    if (u.password !== password) return { ok: false, error: 'That password does not match our records.' };
    lsSet(SESSION_KEY, u.email);
    return { ok: true, email: u.email };
  }
  function logout() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }
  function updateUser(patch) {
    var u = currentUser();
    if (!u) return null;
    var list = users();
    for (var i = 0; i < list.length; i++) {
      if (list[i].email === u.email) {
        for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) list[i][k] = patch[k];
        lsSet(USERS_KEY, list);
        return list[i];
      }
    }
    return null;
  }
  function setPassword(email, password) {
    var list = users();
    for (var i = 0; i < list.length; i++) {
      if (list[i].email === String(email || '').trim().toLowerCase()) { list[i].password = password; lsSet(USERS_KEY, list); return true; }
    }
    return false;
  }

  /* ---------- Orders ---------- */
  function orders() { return lsGet(ORDERS_KEY, []) || []; }
  function saveOrder(order) {
    var list = orders();
    list.unshift(order);
    lsSet(ORDERS_KEY, list);
    return order;
  }
  function orderLines(o) {
    return (o.items || []).map(function (it) {
      var p = getProduct(it.id);
      return p ? { product: p, qty: it.qty, line: p.price * it.qty } : null;
    }).filter(Boolean);
  }
  function orderCount(o) { return (o.items || []).reduce(function (s, x) { return s + x.qty; }, 0); }
  function orderTotal(o) {
    return orderLines(o).reduce(function (s, l) { return s + l.line; }, 0);
  }
  var STATUS_FLOW = [
    { key: 'placed',     label: 'Order placed',        blurb: 'We received your order and sent a confirmation.' },
    { key: 'confirmed',  label: 'Payment confirmed',   blurb: 'Your payment was authorised successfully.' },
    { key: 'packed',     label: 'Packed & dispatched',  blurb: 'Picked, packed and labelled at the warehouse.' },
    { key: 'transit',    label: 'Out for delivery',    blurb: 'With the courier for the final leg.' },
    { key: 'delivered',  label: 'Delivered',           blurb: 'Confirmed at the door with a photo.' }
  ];
  function statusIndex(key) {
    for (var i = 0; i < STATUS_FLOW.length; i++) if (STATUS_FLOW[i].key === key) return i;
    return 0;
  }
  function statusLabel(key) {
    if (key === 'cancelled') return 'Cancelled';
    return STATUS_FLOW[statusIndex(key)].label;
  }

  function seedOrders() {
    var existing = orders();
    var hasDemo = existing.some(function (o) { return o.email === 'alex@example.com'; });
    if (hasDemo) return;
    function mk(ago, statusKey, pay, payLabel, methodLabel, items) {
      var placed = addDays(-ago);
      var etaDays = methodLabel === 'Express delivery' ? 1 : 3;
      var eta = addDays(-ago + etaDays);
      return {
        code: 'SKN-' + placed.getFullYear() + '-' + (10000 + (hash('seed' + ago + statusKey) % 89999)),
        date: fmtDate(placed), placedDaysAgo: ago,
        statusKey: statusKey, eta: fmtDate(eta),
        pay: pay, payLabel: payLabel, methodLabel: methodLabel,
        name: 'Alex Morgan', email: 'alex@example.com',
        address: '27 Bourdillon Road', city: 'Lagos',
        items: items
      };
    }
    var seeded = [
      mk(2,  'transit',   'card',     'Card ending 4242',  'Standard delivery', [{ id: 'halo-headphones', qty: 1 }, { id: 'pulse-buds', qty: 1 }, { id: 'summit-roast', qty: 2 }]),
      mk(23, 'delivered', 'cod',      'Pay on delivery',   'Express delivery',  [{ id: 'terra-lounge', qty: 1 }, { id: 'lumen-lamp', qty: 2 }]),
      mk(64, 'delivered', 'transfer', 'Bank transfer',     'Standard delivery', [{ id: 'aurora-x1', qty: 1 }, { id: 'drift-sneakers', qty: 1 }])
    ];
    lsSet(ORDERS_KEY, existing.concat(seeded));
  }

  /* ---------- Public API ---------- */
  window.Sokoni = {
    icon: icon, money: money, esc: esc,
    CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS,
    catName: catName, getProduct: getProduct, param: param,
    starHTML: starHTML, badgeHTML: badgeHTML, discountOf: discountOf,
    reviewsFor: reviewsFor, ratingBreakdown: ratingBreakdown,
    productCardHTML: productCardHTML, renderProducts: renderProducts,
    observeReveals: observeReveals, stagger: stagger,
    getCart: getCart, setCart: setCart, addToCart: addToCart, setQty: setQty,
    removeFromCart: removeFromCart, clearCart: clearCart,
    cartCount: cartCount, cartLines: cartLines, cartSubtotal: cartSubtotal,
    shippingFor: shippingFor, totals: totals, applyPromo: applyPromo,
    updateBadge: updateBadge, toast: toast,
    wishlist: wishlist, toggleWish: toggleWish,
    searchMatches: searchMatches, refreshWishUI: refreshWishUI,
    /* auth */
    signup: signup, login: login, logout: logout,
    currentUser: currentUser, updateUser: updateUser, setPassword: setPassword,
    seedDemoUser: seedDemoUser, isEmail: isEmail,
    /* orders */
    orders: orders, saveOrder: saveOrder, orderLines: orderLines,
    orderTotal: orderTotal, orderCount: orderCount, seedOrders: seedOrders,
    statusLabel: statusLabel, statusIndex: statusIndex, STATUS_FLOW: STATUS_FLOW,
    fmtDate: fmtDate, fmtDateFull: fmtDateFull, addDays: addDays
  };
})();
