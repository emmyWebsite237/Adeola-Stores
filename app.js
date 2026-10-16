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
    /* >>> GENERATED:CATEGORIES >>> */
    { id: "pantry-grains", name: "Pantry Staples & Grains", blurb: "Rice, pasta, semolina & noodles", icon: "wheat" },
    { id: "breakfast-cereals", name: "Breakfast & Cereals", blurb: "Custard, cereals & malt drinks", icon: "cup" },
    { id: "milk-dairy", name: "Milk & Dairy", blurb: "Powdered milk refills", icon: "droplet" },
    { id: "beverages-drinks", name: "Beverages & Drinks", blurb: "Soft drinks, water & malt", icon: "cup" },
    { id: "snacks-sugar", name: "Snacks, Sugar & Confectionery", blurb: "Biscuits, sugar & sweets", icon: "cookie" },
    { id: "condiments-canned", name: "Condiments & Canned Foods", blurb: "Tomato paste, spreads & sardines", icon: "pot" },
    { id: "baby-care", name: "Baby Care & Infant Nutrition", blurb: "Diapers, formula & baby milk", icon: "baby" }
    /* <<< GENERATED:CATEGORIES <<< */
  ];

  /* ---------- Products (sample catalogue, Naira) ---------- */
  var PRODUCTS = [
    /* >>> GENERATED:PRODUCTS >>> */
    {"id":"custard-3-in-1-refill","name":"Custard 3 in 1 Refill","category":"breakfast-cereals","brand":"Checkers Custard","size":"Refill","price":3500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Checkers Custard","description":"Powdered custard mix containing milk, sugar, and flavorings in a convenient refill pack.","features":["Brand: Checkers Custard","Pack: Refill"],"specs":{"Brand":"Checkers Custard","Pack":"Refill"}},
    {"id":"custard-normal-refill","name":"Custard Normal Refill","category":"breakfast-cereals","brand":"Checkers Custard","size":"Refill","price":2000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Checkers Custard","description":"Standard powdered vanilla custard mix refill pack.","features":["Brand: Checkers Custard","Pack: Refill"],"specs":{"Brand":"Checkers Custard","Pack":"Refill"}},
    {"id":"custard-3-in-1-roll","name":"Custard 3 in 1 Roll","category":"breakfast-cereals","brand":"Checkers Custard","size":"Roll","price":2900,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Checkers Custard","description":"Sachet rolls of 3-in-1 custard mix containing milk and sugar.","features":["Brand: Checkers Custard","Pack: Roll"],"specs":{"Brand":"Checkers Custard","Pack":"Roll"}},
    {"id":"custard-3-in-1-cup","name":"Custard 3 in 1 Cup","category":"breakfast-cereals","brand":"Checkers Custard","size":"Cup","price":7500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Checkers Custard","description":"Premium 3-in-1 vanilla custard powder packed in a large family plastic tub/cup.","features":["Brand: Checkers Custard","Pack: Cup"],"specs":{"Brand":"Checkers Custard","Pack":"Cup"}},
    {"id":"cornflakes-roll","name":"Cornflakes Roll","category":"breakfast-cereals","brand":"Kellogg's / Nasco","size":"Roll","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kellogg's / Nasco","description":"Toasted corn flakes cereal strips packed in retail sachet rolls.","features":["Brand: Kellogg's / Nasco","Pack: Roll"],"specs":{"Brand":"Kellogg's / Nasco","Pack":"Roll"}},
    {"id":"cocopops-roll","name":"Cocopops Roll","category":"breakfast-cereals","brand":"Kellogg's","size":"Roll","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kellogg's","description":"Chocolate flavored puffed rice cereal strips packed in retail sachet rolls.","features":["Brand: Kellogg's","Pack: Roll"],"specs":{"Brand":"Kellogg's","Pack":"Roll"}},
    {"id":"milo-big-size-refill","name":"Milo Big Size Refill","category":"breakfast-cereals","brand":"Nestlé","size":"Refill","price":9000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Large institutional chocolate malt beverage powder economy refill pouch (approx. 800g/1kg).","features":["Brand: Nestlé","Pack: Refill"],"specs":{"Brand":"Nestlé","Pack":"Refill"}},
    {"id":"milo-big-tin","name":"Milo Big Tin","category":"breakfast-cereals","brand":"Nestlé","size":"Tin","price":22000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Premium large metallic tin container of chocolate malt beverage powder.","features":["Brand: Nestlé","Pack: Tin"],"specs":{"Brand":"Nestlé","Pack":"Tin"}},
    {"id":"milo-medium-tin","name":"Milo Medium Tin","category":"breakfast-cereals","brand":"Nestlé","size":"Tin","price":13000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Medium-sized metallic tin container of chocolate malt beverage powder.","features":["Brand: Nestlé","Pack: Tin"],"specs":{"Brand":"Nestlé","Pack":"Tin"}},
    {"id":"milo-small-tin","name":"Milo Small Tin","category":"breakfast-cereals","brand":"Nestlé","size":"Tin","price":7000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Compact small metallic tin container of chocolate malt beverage powder.","features":["Brand: Nestlé","Pack: Tin"],"specs":{"Brand":"Nestlé","Pack":"Tin"}},
    {"id":"milo-small-size-refill","name":"Milo Small Size Refill","category":"breakfast-cereals","brand":"Nestlé","size":"Refill","price":4000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Small economy retail refill pouch of chocolate malt beverage powder.","features":["Brand: Nestlé","Pack: Refill"],"specs":{"Brand":"Nestlé","Pack":"Refill"}},
    {"id":"milo-sachet-roll","name":"Milo Sachet Roll","category":"breakfast-cereals","brand":"Nestlé","size":"Sachet","price":1800,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Strip of small single-serve sachet packs of Milo chocolate malt powder (roll of 10).","features":["Brand: Nestlé","Pack: Sachet"],"specs":{"Brand":"Nestlé","Pack":"Sachet"}},
    {"id":"bournvita-big-tin","name":"Bournvita Big Tin","category":"breakfast-cereals","brand":"Cadbury","size":"Tin","price":11000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Cadbury","description":"Large premium metallic canister of cocoa-based chocolate malt beverage powder.","features":["Brand: Cadbury","Pack: Tin"],"specs":{"Brand":"Cadbury","Pack":"Tin"}},
    {"id":"bournvita-small-tin","name":"Bournvita Small Tin","category":"breakfast-cereals","brand":"Cadbury","size":"Tin","price":7000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Cadbury","description":"Small metallic canister of cocoa-based chocolate malt beverage powder.","features":["Brand: Cadbury","Pack: Tin"],"specs":{"Brand":"Cadbury","Pack":"Tin"}},
    {"id":"bournvita-big-size-refill","name":"Bournvita Big Size Refill","category":"breakfast-cereals","brand":"Cadbury","size":"Refill","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Cadbury","description":"Large economy refill pouch of cocoa chocolate malt beverage powder.","features":["Brand: Cadbury","Pack: Refill"],"specs":{"Brand":"Cadbury","Pack":"Refill"}},
    {"id":"golden-morn-big-size-golden-more","name":"Golden Morn Big Size (Golden More)","category":"breakfast-cereals","brand":"Nestlé","size":"Each","price":5000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Large family pack of nutritious instant whole maize and soya breakfast cereal.","features":["Brand: Nestlé","Pack: Each"],"specs":{"Brand":"Nestlé","Pack":"Each"}},
    {"id":"golden-morn-medium-size","name":"Golden Morn Medium Size","category":"breakfast-cereals","brand":"Nestlé","size":"Each","price":3500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Medium economy pack of instant whole maize and soya breakfast cereal.","features":["Brand: Nestlé","Pack: Each"],"specs":{"Brand":"Nestlé","Pack":"Each"}},
    {"id":"golden-morn-small-size","name":"Golden Morn Small Size","category":"breakfast-cereals","brand":"Nestlé","size":"Each","price":2500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Small retail pack of instant whole maize and soya breakfast cereal.","features":["Brand: Nestlé","Pack: Each"],"specs":{"Brand":"Nestlé","Pack":"Each"}},
    {"id":"golden-morn-roll","name":"Golden Morn Roll","category":"breakfast-cereals","brand":"Nestlé","size":"Roll","price":2800,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé","description":"Strip of single-serve retail sachet packs of maize cereal.","features":["Brand: Nestlé","Pack: Roll"],"specs":{"Brand":"Nestlé","Pack":"Roll"}},
    {"id":"amazing-day-cereal-refill","name":"Amazing Day Cereal Refill","category":"breakfast-cereals","brand":"Kellogg's Tolaram","size":"Refill","price":2700,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kellogg's Tolaram","description":"Nutritious instant multi-grain breakfast cereal in an economy refill pack.","features":["Brand: Kellogg's Tolaram","Pack: Refill"],"specs":{"Brand":"Kellogg's Tolaram","Pack":"Refill"}},
    {"id":"amazing-day-cereal-roll","name":"Amazing Day Cereal Roll","category":"breakfast-cereals","brand":"Kellogg's Tolaram","size":"Roll","price":2400,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kellogg's Tolaram","description":"Single-use retail sachet rolls of multi-grain breakfast cereal.","features":["Brand: Kellogg's Tolaram","Pack: Roll"],"specs":{"Brand":"Kellogg's Tolaram","Pack":"Roll"}},
    {"id":"peak-full-cream-milk-powder-refill","name":"Peak Full Cream Milk Powder Refill","category":"milk-dairy","brand":"FrieslandCampina Peak","size":"Refill","price":5000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"FrieslandCampina Peak","description":"Premium instant whole milk powder in a large value-sized economy refill pack.","features":["Brand: FrieslandCampina Peak","Pack: Refill"],"specs":{"Brand":"FrieslandCampina Peak","Pack":"Refill"}},
    {"id":"peak-refill-big-size-groceries-section","name":"Peak Refill Big Size (Groceries section)","category":"milk-dairy","brand":"FrieslandCampina Peak","size":"Refill","price":10500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"FrieslandCampina Peak","description":"Institutional-sized extra large full cream milk powder economy refill bag.","features":["Brand: FrieslandCampina Peak","Pack: Refill"],"specs":{"Brand":"FrieslandCampina Peak","Pack":"Refill"}},
    {"id":"dano-slim-full-cream-milk-refill","name":"Dano Slim / Full Cream Milk Refill","category":"milk-dairy","brand":"Arla Dano","size":"Refill","price":3000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Arla Dano","description":"High-quality rich instant milk powder formula refill pouch.","features":["Brand: Arla Dano","Pack: Refill"],"specs":{"Brand":"Arla Dano","Pack":"Refill"}},
    {"id":"loyal-milk-powder-refill","name":"Loyal Milk Powder Refill","category":"milk-dairy","brand":"Promasidor Loyal","size":"Refill","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Promasidor Loyal","description":"Affordable formulation powdered milk product in an economy refill pouch.","features":["Brand: Promasidor Loyal","Pack: Refill"],"specs":{"Brand":"Promasidor Loyal","Pack":"Refill"}},
    {"id":"peak-123-growing-up-milk-refill","name":"Peak 123 Growing Up Milk Refill","category":"baby-care","brand":"FrieslandCampina Peak","size":"Refill","price":7000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"FrieslandCampina Peak","description":"Formulated powder milk specialized for young toddlers aged 1 to 3 years.","features":["Brand: FrieslandCampina Peak","Pack: Refill"],"specs":{"Brand":"FrieslandCampina Peak","Pack":"Refill"}},
    {"id":"nan-1-infant-formula","name":"Nan 1 Infant Formula","category":"baby-care","brand":"Nestlé NAN","size":"Each","price":12500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé NAN","description":"Premium starter infant formula powder intended for babies from birth up to 6 months.","features":["Brand: Nestlé NAN","Pack: Each"],"specs":{"Brand":"Nestlé NAN","Pack":"Each"}},
    {"id":"nan-2-follow-up-formula","name":"Nan 2 Follow-up Formula","category":"baby-care","brand":"Nestlé NAN","size":"Each","price":12000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nestlé NAN","description":"Premium follow-up infant formula powder developed for babies aged 6 to 12 months.","features":["Brand: Nestlé NAN","Pack: Each"],"specs":{"Brand":"Nestlé NAN","Pack":"Each"}},
    {"id":"kisskids-diapers-big-size","name":"Kisskids Diapers Big Size","category":"baby-care","brand":"Kisskids","size":"Each","price":12000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kisskids","description":"Bulk/Jumbo pack of highly absorbent disposable baby diapers in a large size option.","features":["Brand: Kisskids","Pack: Each"],"specs":{"Brand":"Kisskids","Pack":"Each"}},
    {"id":"kisskids-diapers-medium-size","name":"Kisskids Diapers Medium Size","category":"baby-care","brand":"Kisskids","size":"Each","price":6500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kisskids","description":"Standard medium pack of highly absorbent disposable baby diapers.","features":["Brand: Kisskids","Pack: Each"],"specs":{"Brand":"Kisskids","Pack":"Each"}},
    {"id":"kisskids-diapers-small-size","name":"Kisskids Diapers Small Size","category":"baby-care","brand":"Kisskids","size":"Each","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Kisskids","description":"Mini starter convenience pack of disposable baby diapers.","features":["Brand: Kisskids","Pack: Each"],"specs":{"Brand":"Kisskids","Pack":"Each"}},
    {"id":"softcare-diapers-big-size","name":"Softcare Diapers Big Size","category":"baby-care","brand":"Softcare","size":"Each","price":12000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Softcare","description":"Premium elastic waistband dry-layer disposable baby diapers, large pack.","features":["Brand: Softcare","Pack: Each"],"specs":{"Brand":"Softcare","Pack":"Each"}},
    {"id":"softcare-diapers-medium-size","name":"Softcare Diapers Medium Size","category":"baby-care","brand":"Softcare","size":"Each","price":6500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Softcare","description":"Premium elastic waistband dry-layer disposable baby diapers, medium pack.","features":["Brand: Softcare","Pack: Each"],"specs":{"Brand":"Softcare","Pack":"Each"}},
    {"id":"softcare-diapers-small-size","name":"Softcare Diapers Small Size","category":"baby-care","brand":"Softcare","size":"Each","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Softcare","description":"Convenience budget mini pack of dry-layer disposable baby diapers.","features":["Brand: Softcare","Pack: Each"],"specs":{"Brand":"Softcare","Pack":"Each"}},
    {"id":"good-fit-diapers-big-size","name":"Good Fit Diapers Big Size","category":"baby-care","brand":"Good Fit","size":"Each","price":10500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Good Fit","description":"High-absorbency leakage protection baby diapers, economy large pack.","features":["Brand: Good Fit","Pack: Each"],"specs":{"Brand":"Good Fit","Pack":"Each"}},
    {"id":"good-fit-diapers-medium-size","name":"Good Fit Diapers Medium Size","category":"baby-care","brand":"Good Fit","size":"Each","price":5500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Good Fit","description":"Leakage protection baby diapers, mid-range size pack.","features":["Brand: Good Fit","Pack: Each"],"specs":{"Brand":"Good Fit","Pack":"Each"}},
    {"id":"good-fit-diapers-small-size","name":"Good Fit Diapers Small Size","category":"baby-care","brand":"Good Fit","size":"Each","price":1200,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Good Fit","description":"Budget single-use or small convenience count pack of diapers.","features":["Brand: Good Fit","Pack: Each"],"specs":{"Brand":"Good Fit","Pack":"Each"}},
    {"id":"maya-diapers-big-size","name":"Maya Diapers Big Size","category":"baby-care","brand":"Maya","size":"Each","price":9000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Maya","description":"Comfort-fit anti-rash tech disposable baby diapers, large size option.","features":["Brand: Maya","Pack: Each"],"specs":{"Brand":"Maya","Pack":"Each"}},
    {"id":"maya-diapers-medium-size","name":"Maya Diapers Medium Size","category":"baby-care","brand":"Maya","size":"Each","price":6000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Maya","description":"Comfort-fit anti-rash tech disposable baby diapers, mid-range size pack.","features":["Brand: Maya","Pack: Each"],"specs":{"Brand":"Maya","Pack":"Each"}},
    {"id":"my-choice-rice-wholesale-bag","name":"My Choice Rice Wholesale Bag","category":"pantry-grains","brand":"My Choice","size":"Bag","price":66000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"My Choice","description":"Commercial bulk commercial bag of parboiled long grain rice (typically 50kg).","features":["Brand: My Choice","Pack: Bag"],"specs":{"Brand":"My Choice","Pack":"Bag"}},
    {"id":"spaghetti-slim-and-big","name":"Spaghetti Slim & Big","category":"pantry-grains","brand":"Golden Penny","size":"Each","price":1200,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Long thin pasta strands made from durum wheat semolina, standard pack.","features":["Brand: Golden Penny","Pack: Each"],"specs":{"Brand":"Golden Penny","Pack":"Each"}},
    {"id":"macaroni-big-size","name":"Macaroni Big Size","category":"pantry-grains","brand":"Golden Penny","size":"Each","price":1200,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Elbow pasta pieces made from premium durum semolina, large retail pack.","features":["Brand: Golden Penny","Pack: Each"],"specs":{"Brand":"Golden Penny","Pack":"Each"}},
    {"id":"macaroni-small-size","name":"Macaroni Small Size","category":"pantry-grains","brand":"Golden Penny","size":"Each","price":700,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Elbow pasta pieces, compact single/double meal consumer pack.","features":["Brand: Golden Penny","Pack: Each"],"specs":{"Brand":"Golden Penny","Pack":"Each"}},
    {"id":"semolina-500g","name":"Semolina 500g","category":"pantry-grains","brand":"Golden Penny Semovita","size":"500g","price":1000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny Semovita","description":"Compact 500g retail pouch of whole wheat flour semolina.","features":["Brand: Golden Penny Semovita","Pack: 500g"],"specs":{"Brand":"Golden Penny Semovita","Pack":"500g"}},
    {"id":"semolina-1kg","name":"Semolina 1kg","category":"pantry-grains","brand":"Golden Penny Semovita","size":"1kg","price":1700,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny Semovita","description":"Standard 1kg convenience retail bag of premium semolina flour.","features":["Brand: Golden Penny Semovita","Pack: 1kg"],"specs":{"Brand":"Golden Penny Semovita","Pack":"1kg"}},
    {"id":"super-pack-indomie-carton","name":"Super Pack Indomie Carton","category":"pantry-grains","brand":"Dufil Prima Indomie","size":"Pack","price":15500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Dufil Prima Indomie","description":"Carton of extra-large portion instant noodles in classic chicken flavor.","features":["Brand: Dufil Prima Indomie","Pack: Pack"],"specs":{"Brand":"Dufil Prima Indomie","Pack":"Pack"}},
    {"id":"indomie-table-size-carton","name":"Indomie Table Size Carton","category":"pantry-grains","brand":"Dufil Prima Indomie","size":"Carton","price":9700,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Dufil Prima Indomie","description":"Carton of standard individual regular portion size instant noodles.","features":["Brand: Dufil Prima Indomie","Pack: Carton"],"specs":{"Brand":"Dufil Prima Indomie","Pack":"Carton"}},
    {"id":"indomie-onion-flavor-carton","name":"Indomie Onion Flavor Carton","category":"pantry-grains","brand":"Dufil Prima Indomie","size":"Carton","price":11000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Dufil Prima Indomie","description":"Carton of savory onion flavored aromatic instant noodles.","features":["Brand: Dufil Prima Indomie","Pack: Carton"],"specs":{"Brand":"Dufil Prima Indomie","Pack":"Carton"}},
    {"id":"oriental-fried-noodles-carton","name":"Oriental Fried Noodles Carton","category":"pantry-grains","brand":"Dufil Prima Indomie","size":"Carton","price":10000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Dufil Prima Indomie","description":"Carton of spice-rich oriental blend instant stir-fry style noodles.","features":["Brand: Dufil Prima Indomie","Pack: Carton"],"specs":{"Brand":"Dufil Prima Indomie","Pack":"Carton"}},
    {"id":"miemie-instant-noodles-carton","name":"Miemie Instant Noodles Carton","category":"pantry-grains","brand":"Miemie Noodles","size":"Carton","price":8500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Miemie Noodles","description":"Competitor value brand instant noodles, whole carton wholesale pricing.","features":["Brand: Miemie Noodles","Pack: Carton"],"specs":{"Brand":"Miemie Noodles","Pack":"Carton"}},
    {"id":"bellefull-indomie-carton","name":"Bellefull Indomie Carton","category":"pantry-grains","brand":"Dufil Bellefull","size":"Carton","price":15000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Dufil Bellefull","description":"Carton of maximum heavy-weight jumbo portion size instant noodles.","features":["Brand: Dufil Bellefull","Pack: Carton"],"specs":{"Brand":"Dufil Bellefull","Pack":"Carton"}},
    {"id":"coca-cola-plastic-pack","name":"Coca-Cola Plastic Pack","category":"beverages-drinks","brand":"Coca-Cola","size":"Pack","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Coca-Cola","description":"Shrink-wrapped wholesale bundle case of plastic carbonated soft drink bottles.","features":["Brand: Coca-Cola","Pack: Pack"],"specs":{"Brand":"Coca-Cola","Pack":"Pack"}},
    {"id":"american-cola-pack","name":"American Cola Pack","category":"beverages-drinks","brand":"American Cola","size":"Pack","price":4000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"American Cola","description":"Value competitor brand carbonated cola bottles shrink wholesale case.","features":["Brand: American Cola","Pack: Pack"],"specs":{"Brand":"American Cola","Pack":"Pack"}},
    {"id":"pepsi-plastic-pack","name":"Pepsi Plastic Pack","category":"beverages-drinks","brand":"Pepsi","size":"Pack","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Pepsi","description":"Shrink-wrapped bundle case of refreshing carbonated cola PET bottles.","features":["Brand: Pepsi","Pack: Pack"],"specs":{"Brand":"Pepsi","Pack":"Pack"}},
    {"id":"fanta-orange-plastic-pack","name":"Fanta Orange Plastic Pack","category":"beverages-drinks","brand":"Fanta","size":"Pack","price":4700,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Fanta","description":"Shrink-wrapped bundle case of fruity orange carbonated beverage PET bottles.","features":["Brand: Fanta","Pack: Pack"],"specs":{"Brand":"Fanta","Pack":"Pack"}},
    {"id":"maltina-plastic-bottle-pack","name":"Maltina Plastic Bottle Pack","category":"beverages-drinks","brand":"Nigerian Breweries Maltina","size":"Bottle","price":6000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nigerian Breweries Maltina","description":"Wholesale case bundle of premium non-alcoholic malt drinks in plastic bottles.","features":["Brand: Nigerian Breweries Maltina","Pack: Bottle"],"specs":{"Brand":"Nigerian Breweries Maltina","Pack":"Bottle"}},
    {"id":"maltina-big-plastic-pack","name":"Maltina Big Plastic Pack","category":"beverages-drinks","brand":"Nigerian Breweries Maltina","size":"Pack","price":9500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Nigerian Breweries Maltina","description":"Wholesale case bundle of non-alcoholic malt drinks in extra-large plastic bottles.","features":["Brand: Nigerian Breweries Maltina","Pack: Pack"],"specs":{"Brand":"Nigerian Breweries Maltina","Pack":"Pack"}},
    {"id":"cway-water-pack-dispenser","name":"Cway Water Pack / Dispenser","category":"beverages-drinks","brand":"Cway","size":"Pack","price":2000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Cway","description":"Bundle pack of clean purified bottled drinking water or dispenser refill.","features":["Brand: Cway","Pack: Pack"],"specs":{"Brand":"Cway","Pack":"Pack"}},
    {"id":"mr-v-purified-water-pack","name":"Mr. V Purified Water Pack","category":"beverages-drinks","brand":"Mr. V","size":"Pack","price":1900,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Mr. V","description":"Case pack of standard filtered treated bottled drinking water.","features":["Brand: Mr. V","Pack: Pack"],"specs":{"Brand":"Mr. V","Pack":"Pack"}},
    {"id":"eva-water-big-size-pack","name":"Eva Water Big Size Pack","category":"beverages-drinks","brand":"Coca-Cola NBC Eva","size":"Pack","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Coca-Cola NBC Eva","description":"Premium purified distilled bottled table water, bundle case of large bottles.","features":["Brand: Coca-Cola NBC Eva","Pack: Pack"],"specs":{"Brand":"Coca-Cola NBC Eva","Pack":"Pack"}},
    {"id":"eva-water-small-size-pack","name":"Eva Water Small Size Pack","category":"beverages-drinks","brand":"Coca-Cola NBC Eva","size":"Pack","price":3500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Coca-Cola NBC Eva","description":"Premium purified distilled bottled table water, bundle case of personal size bottles.","features":["Brand: Coca-Cola NBC Eva","Pack: Pack"],"specs":{"Brand":"Coca-Cola NBC Eva","Pack":"Pack"}},
    {"id":"aquafina-water-pack","name":"Aquafina Water Pack","category":"beverages-drinks","brand":"Varun Aquafina","size":"Pack","price":3000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Varun Aquafina","description":"Premium filtered refreshing clear table water, wholesale shrink pack case.","features":["Brand: Varun Aquafina","Pack: Pack"],"specs":{"Brand":"Varun Aquafina","Pack":"Pack"}},
    {"id":"gino-tomato-party-jollof-paste","name":"Gino Tomato Party Jollof Paste","category":"condiments-canned","brand":"GB Foods Gino","size":"Each","price":1100,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"GB Foods Gino","description":"Concentrated tomato paste pre-spiced with local party jollof seasoning blends.","features":["Brand: GB Foods Gino","Pack: Each"],"specs":{"Brand":"GB Foods Gino","Pack":"Each"}},
    {"id":"gino-pepper-and-onion-paste","name":"Gino Pepper and Onion Paste","category":"condiments-canned","brand":"GB Foods Gino","size":"Each","price":1100,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"GB Foods Gino","description":"Concentrated tomato paste infused with ground habanero peppers and onions.","features":["Brand: GB Foods Gino","Pack: Each"],"specs":{"Brand":"GB Foods Gino","Pack":"Each"}},
    {"id":"sonia-tomato-paste-big-tin","name":"Sonia Tomato Paste Big Tin","category":"condiments-canned","brand":"Sonia Tomato","size":"Tin","price":3000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Sonia Tomato","description":"Large size premium metal tin of highly concentrated double-refined tomato paste.","features":["Brand: Sonia Tomato","Pack: Tin"],"specs":{"Brand":"Sonia Tomato","Pack":"Tin"}},
    {"id":"sonia-tomato-paste-medium-tin","name":"Sonia Tomato Paste Medium Tin","category":"condiments-canned","brand":"Sonia Tomato","size":"Tin","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Sonia Tomato","description":"Medium size metal tin of rich double-refined concentrated tomato paste.","features":["Brand: Sonia Tomato","Pack: Tin"],"specs":{"Brand":"Sonia Tomato","Pack":"Tin"}},
    {"id":"sonia-tomato-paste-small-tin","name":"Sonia Tomato Paste Small Tin","category":"condiments-canned","brand":"Sonia Tomato","size":"Tin","price":1000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Sonia Tomato","description":"Compact small metal tin of double-refined tomato paste for light meals.","features":["Brand: Sonia Tomato","Pack: Tin"],"specs":{"Brand":"Sonia Tomato","Pack":"Tin"}},
    {"id":"sonia-tomato-paste-smallest-tin","name":"Sonia Tomato Paste Smallest Tin","category":"condiments-canned","brand":"Sonia Tomato","size":"Tin","price":200,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Sonia Tomato","description":"Mini pocket size convenience small tin of concentrated tomato paste.","features":["Brand: Sonia Tomato","Pack: Tin"],"specs":{"Brand":"Sonia Tomato","Pack":"Tin"}},
    {"id":"golden-penny-butter-big-size","name":"Golden Penny Butter Big Size","category":"condiments-canned","brand":"Golden Penny","size":"Each","price":2800,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Large tub premium cooking/baking table butter spread margarine.","features":["Brand: Golden Penny","Pack: Each"],"specs":{"Brand":"Golden Penny","Pack":"Each"}},
    {"id":"golden-penny-butter-medium-size","name":"Golden Penny Butter Medium Size","category":"condiments-canned","brand":"Golden Penny","size":"Each","price":1300,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Medium tub cooking/baking table butter spread margarine.","features":["Brand: Golden Penny","Pack: Each"],"specs":{"Brand":"Golden Penny","Pack":"Each"}},
    {"id":"blue-band-margarine-big-size","name":"Blue Band Margarine Big Size","category":"condiments-canned","brand":"Upfield Blue Band","size":"Each","price":4000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Upfield Blue Band","description":"Classic rich spread catering/family sized tub of premium margarine.","features":["Brand: Upfield Blue Band","Pack: Each"],"specs":{"Brand":"Upfield Blue Band","Pack":"Each"}},
    {"id":"bama-mayonnaise-big-size","name":"Bama Mayonnaise Big Size","category":"condiments-canned","brand":"Bama","size":"Each","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Bama","description":"Large glass jar premium rich creamy sandwich spread mayonnaise.","features":["Brand: Bama","Pack: Each"],"specs":{"Brand":"Bama","Pack":"Each"}},
    {"id":"bama-mayonnaise-medium-size","name":"Bama Mayonnaise Medium Size","category":"condiments-canned","brand":"Bama","size":"Each","price":3500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Bama","description":"Medium glass jar premium rich creamy mayonnaise spread.","features":["Brand: Bama","Pack: Each"],"specs":{"Brand":"Bama","Pack":"Each"}},
    {"id":"bama-mayonnaise-small-size","name":"Bama Mayonnaise Small Size","category":"condiments-canned","brand":"Bama","size":"Each","price":2000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Bama","description":"Small glass jar rich creamy sandwich mayonnaise spread.","features":["Brand: Bama","Pack: Each"],"specs":{"Brand":"Bama","Pack":"Each"}},
    {"id":"titus-sardines-can","name":"Titus Sardines Can","category":"condiments-canned","brand":"Titus","size":"Can","price":2000,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Titus","description":"Premium canned Atlantic sardines preserved in pure vegetable oil.","features":["Brand: Titus","Pack: Can"],"specs":{"Brand":"Titus","Pack":"Can"}},
    {"id":"sardines-can-alternative","name":"Sardines Can Alternative","category":"condiments-canned","brand":"Generic","size":"Can","price":4500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Generic","description":"Canned oil-preserved fish sardines alternative brands.","features":["Brand: Generic","Pack: Can"],"specs":{"Brand":"Generic","Pack":"Can"}},
    {"id":"golden-penny-sugar-refill-pouch","name":"Golden Penny Sugar Refill Pouch","category":"snacks-sugar","brand":"Golden Penny","size":"Refill","price":1500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"Golden Penny","description":"Premium refined fine granulated white sugar refill packaging.","features":["Brand: Golden Penny","Pack: Refill"],"specs":{"Brand":"Golden Penny","Pack":"Refill"}},
    {"id":"st-louis-sugar-cube-box","name":"St. Louis Sugar Cube Box","category":"snacks-sugar","brand":"St. Louis","size":"Box","price":2500,"oldPrice":null,"rating":0,"reviewCount":0,"badge":null,"stock":100,"image":"images/product-placeholder.svg","noImage":true,"scene":"images/scene-warehouse.png","short":"St. Louis","description":"Classic premium white hard pressed sugar cubes, traditional package.","features":["Brand: St. Louis","Pack: Box"],"specs":{"Brand":"St. Louis","Pack":"Box"}},
    /* <<< GENERATED:PRODUCTS <<< */
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
    emails: 'ladydee_email_log', brevi: 'ladydee_brevi_config', seeded: 'ladydee_seeded_v1',
    store: 'ladydee_store_info',
    adminProducts: 'ladydee_admin_products', adminDeleted: 'ladydee_admin_deleted',
    paystack: 'ladydee_paystack_demo'
  };

  /* One-time cleanup: API keys used to be typed into the admin and kept in
     localStorage. They now live only in server environment variables, so any
     leftovers in this browser are removed. */
  try { ['ladydee_integrations', 'ladydee_brevi_config'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}

  /* ---------- Store contact details (editable in the admin console) ---------- */
  var STORE_DEFAULTS = {
    name: 'Ladydee Minimart Store',
    phone: '0801 234 5678',
    phoneHref: '+2348012345678',
    email: 'hello@ladydee.ng',
    address: '12 Adeniran Ogunsanya, Surulere, Lagos',
    hours: 'Mon\u2013Sat, 8am \u2013 8pm',
    hoursShort: 'Mon\u2013Sat, 8am\u20138pm'
  };

  function getStoreInfo() {
    var saved = read(K.store, null) || {};
    var out = {};
    Object.keys(STORE_DEFAULTS).forEach(function (k) {
      out[k] = (saved[k] != null && String(saved[k]).trim() !== '') ? String(saved[k]).trim() : STORE_DEFAULTS[k];
    });
    /* keep a dialable href in sync with whatever phone number is set */
    out.phoneHref = '+234' + out.phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
    return out;
  }
  function setStoreInfo(patch) {
    var cur = getStoreInfo();
    Object.keys(patch || {}).forEach(function (k) {
      if (k in STORE_DEFAULTS) cur[k] = patch[k];
    });
    write(K.store, cur);
    return getStoreInfo();
  }

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
  /* The live catalogue = the built-in seed products, plus anything the admin
     has uploaded (ladydee_admin_products), minus anything deleted
     (ladydee_admin_deleted). Admin-uploaded products therefore show up in the
     storefront grid, search, wishlist and product pages automatically. */
  function catalogue() {
    var custom = read(K.adminProducts, null);
    var deleted = read(K.adminDeleted, []) || [];
    var base = PRODUCTS.filter(function (p) { return deleted.indexOf(p.id) < 0; });
    if (!custom || !custom.length) return base;
    var map = {}, order = [];
    base.forEach(function (p) { map[p.id] = p; order.push(p.id); });
    custom.forEach(function (p) {
      if (!p || !p.id || deleted.indexOf(p.id) > -1) return;
      if (!map[p.id]) order.push(p.id);
      map[p.id] = p;
    });
    return order.map(function (id) { return map[id]; });
  }
  function product(id) {
    var all = catalogue();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  /* Cloudinary delivery optimisation: f_auto picks webp/avif, q_auto compresses. */
  function imgUrl(u) {
    if (!u) return u;
    if (u.indexOf('cloudinary.com') < 0) return u;
    if (/[?&]f_auto/.test(u)) return u;
    return u + (u.indexOf('?') > -1 ? '&' : '?') + 'f_auto,q_auto';
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
    var all = catalogue();
    if (!q) return all;
    var words = q.split(/\s+/);
    return all.filter(function (p) {
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

  /* Real accounts live on the server when it has a database and working email. */
  function serverAccounts() {
    var a = window.LadydeeAPI;
    return !!(a && a.available && a.integrations && a.integrations.accounts);
  }
  /* After a successful server login: keep a local profile (addresses, etc.) and start the session. */
  function sessionFromServer(user, token) {
    var users = getUsers();
    var email = String(user.email || '').toLowerCase();
    var found = null;
    for (var i = 0; i < users.length; i++) if (users[i].email === email) { found = users[i]; break; }
    if (!found) {
      found = { id: 's' + user.id, name: user.name, email: email, phone: user.phone || '', password: '',
        verified: true, createdAt: new Date().toISOString(), addresses: [] };
      users.push(found);
    } else {
      found.name = user.name; found.verified = true; found.password = '';
      if (user.phone) found.phone = user.phone;
    }
    setUsers(users);
    write(K.session, { id: found.id, email: found.email, name: found.name, at: Date.now(), token: token || '' });
    return found;
  }
  function authToken() { var s = read(K.session, null); return (s && s.token) || ''; }
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
          items: items.filter(function (it) { return product(it.id); }).map(function (it) {
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
      ].filter(function (o) { return o.items.length; }));
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

  /* ---------- Shared components (header / footer / bottom nav) ----------
     The header, footer and sticky mobile bottom bar are NOT duplicated
     inside the 13 pages any more. They live in ONE file each:

         components/header.html
         components/footer.html
         components/bottom-nav.html

     components.js fetches those files into their mount points
     (#site-header, #site-footer, #bottomNav) and adds the inline fallback
     copy so the site still works when opened straight off disk. app.js then
     fills the {{tokens}} below with live data and wires the interactive parts
     (search, drawer, badges). Edit a component file and every page updates.

     Regenerate the inline fallback after editing components/*.html:
         node build-components.js                                            */

  var COMPONENT_ORDER = ['header', 'footer', 'bottom-nav'];
  var COMPONENT_TOKENS = [
    'topbarMsg', 'nav', 'catBar', 'drawerLinks', 'drawerCats', 'accountArea',
    'footShop', 'payPills', 'items', 'year', 'searchValue',
    'cartCount', 'wishCount', 'cartBadgeHidden', 'wishBadgeHidden'
  ];
  var HREF_KEYS = ['home', 'products', 'workflows', 'wishlist', 'cart', 'checkout', 'account', 'login', 'signup', 'search'];
  var STORE_KEYS = ['name', 'phone', 'phoneHref', 'email', 'address', 'hours', 'hoursShort'];

  function blankTokens() {
    var t = { store: {}, href: {} };
    COMPONENT_TOKENS.forEach(function (k) { t[k] = ''; });
    HREF_KEYS.forEach(function (k) { t.href[k] = ''; });
    STORE_KEYS.forEach(function (k) { t.store[k] = ''; });
    return t;
  }

  /* One token map serves all three components - fill every possible token,
     then hand it to each template after masking irrelevant names. */
  function buildTokens(active) {
    var u = currentUser();
    var store = getStoreInfo();
    var t = blankTokens();
    var cCount = cartCount();
    var wCount = wishCount();

    HREF_KEYS.forEach(function (k) { t.href[k] = toHref('/' + (k === 'home' ? '' : k)); });
    STORE_KEYS.forEach(function (k) { t.store[k] = esc(store[k] == null ? '' : store[k]); });

    t.year = String(new Date().getFullYear());
    t.searchValue = esc(param('q') || '');
    t.topbarMsg = 'Free delivery on orders over ' + money(getDeliveryRules().freeOver) + ' across Lagos';
    t.cartCount = String(cCount);
    t.wishCount = String(wCount);
    t.cartBadgeHidden = cCount ? '' : ' hidden';
    t.wishBadgeHidden = wCount ? '' : ' hidden';

    t.nav = [
      { href: '/', label: 'Home', key: 'home' },
      { href: '/products', label: 'Shop', key: 'products' },
      { href: '/workflows', label: 'How it works', key: 'workflows' }
    ].map(function (n) {
      return '<a href="' + toHref(n.href) + '"' + (active === n.key ? ' class="on"' : '') + '>' + n.label + '</a>';
    }).join('');

    t.catBar = CATEGORIES.map(function (c) {
      return '<a class="cat-link" href="' + toHref('/products?cat=' + c.id) + '">' +
        '<span class="cat-ico" data-i="' + c.icon + '"></span>' +
        '<span><b>' + esc(c.name) + '</b><small>' + esc(c.blurb) + '</small></span></a>';
    }).join('');

    t.accountArea = u
      ? '<a class="account-chip" href="' + toHref('/account') + '"><span class="ac-av">' + esc((u.name || 'A').charAt(0).toUpperCase()) + '</span><span class="ac-name">' + esc((u.name || '').split(' ')[0]) + '</span></a>'
      : '<a class="icon-btn" href="' + toHref('/login') + '" aria-label="Sign in"><span data-i="user"></span></a>';

    t.drawerLinks =
      t.nav.replace(/<a href=/g, '<a class="drawer-link" href=') +
      '<a class="drawer-link" href="' + toHref('/wishlist') + '">Wishlist</a>' +
      '<a class="drawer-link" href="' + toHref('/cart') + '">Cart</a>' +
      (u ? '<a class="drawer-link" href="' + toHref('/account') + '">My account</a>'
         : '<a class="drawer-link" href="' + toHref('/login') + '">Sign in</a><a class="drawer-link" href="' + toHref('/signup') + '">Create account</a>');

    t.drawerCats = CATEGORIES.map(function (c) {
      return '<a class="drawer-cat" href="' + toHref('/products?cat=' + c.id) + '"><span class="cat-ico" data-i="' + c.icon + '"></span>' + esc(c.name) + '</a>';
    }).join('');

    t.footShop = CATEGORIES.slice(0, 5).map(function (c) {
      return '<a href="' + toHref('/products?cat=' + c.id) + '">' + esc(c.name) + '</a>';
    }).join('') + '<a href="' + toHref('/products') + '">All products</a>';

    t.payPills = ['Card', 'Bank transfer', 'Pay on delivery', 'USSD'].map(function (p) {
      return '<span class="pay-pill">' + p + '</span>';
    }).join('');

    t.items = bottomNavItems(t, u);

    return t;
  }

  /* Bottom bar follows the template in components/bottom-nav.html:
     one <a class="bn-item"> per entry, each with {{label}}, {{href}} and an
     optional cart badge token. Only the cart entry shows the badge. */
  function bottomNavItems(t, u) {
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    var entries = [
      { href: toHref('/search'), label: 'Search', ico: 'search', on: page === 'search' },
      { href: toHref('/cart'), label: 'Cart', ico: 'cart', on: page === 'cart', badge: true },
      { href: u ? toHref('/account') : toHref('/login'), label: u ? 'Account' : 'Sign in', ico: 'user', on: page === 'account' || page === 'login' }
    ];
    return entries.map(function (e) {
      return '<a class="bn-item' + (e.on ? ' on' : '') + '" href="' + e.href + '"' + (e.on ? ' aria-current="page"' : '') + '>' +
        '<span class="bn-ico"><span data-i="' + e.ico + '"></span>' +
          (e.badge ? '<span class="bn-badge" id="bnCartBadge"' + (cartCount() ? '' : ' hidden') + '>' + cartCount() + '</span>' : '') +
        '</span><span class="bn-label">' + e.label + '</span></a>';
    }).join('');
  }

  /* Replace {{token}} and {{a.b}} placeholders. Unknown tokens are left
     untouched on purpose so the token-coverage check can spot a typo. */
  function fillTokens(html, t) {
    return String(html).replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (m, path) {
      var parts = path.split('.');
      var v = t;
      for (var i = 0; i < parts.length; i++) {
        if (v == null || typeof v !== 'object' || !(parts[i] in v)) return m;
        v = v[parts[i]];
      }
      return (v == null) ? '' : String(v);
    });
  }

  /* Swap <span data-i="name"> placeholders for the real inline SVG icons.
     Scoped to the components so a page's own [data-i] pass is untouched. */
  function fillIcons(root) {
    (root || document).querySelectorAll('[data-i]').forEach(function (e) {
      e.innerHTML = icon(e.getAttribute('data-i'));
      e.removeAttribute('data-i');
    });
  }

  function renderComponents(active) {
    var C = window.LadydeeComponents;
    if (!C || typeof C.load !== 'function') return false;
    var map = { 'header': 'site-header', 'footer': 'site-footer', 'bottom-nav': 'bottomNav' };
    var any = false;
    Object.keys(map).forEach(function (name) {
      var el = document.getElementById(map[name]);
      if (!el || el.getAttribute('data-loaded') !== '1') return;
      var tpl = el.__raw || C.INLINE[name] || el.innerHTML;
      el.innerHTML = fillTokens(tpl, buildTokens(active));
      fillIcons(el);
      any = true;
    });
    refreshBadges();
    return any;
  }

  /* Wire the interactive parts of the freshly rendered components. Called
     again after a re-render, so it must be safe to run more than once. */
  function initComponents() {
    initSearch();
    initDrawer();
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
    var bb = document.getElementById('bnCartBadge');
    if (bb) { var m = cartCount(); bb.textContent = m > 99 ? '99+' : m; bb.hidden = !m; }
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
          '<span class="img-skel" aria-hidden="true"></span>' +
          '<img class="lazy-img" data-src="' + esc(imgUrl(p.image)) + '" alt="' + esc(p.name) + ' ' + esc(p.size || '') + '" loading="lazy" decoding="async" width="600" height="600">' +
        '</a>' +
        '<div class="pcard-tags">' +
          (d ? '<span class="tag tag-sale">−' + d + '%</span>' : '') +
          (p.badge === 'bestseller' ? '<span class="tag tag-best">Bestseller</span>' : '') +
          (p.badge === 'new' ? '<span class="tag tag-new">New</span>' : '') +
          (out ? '<span class="tag tag-out">Out of stock</span>' : '') +
          (!out && p.stock > 0 && p.stock <= 10 ? '<span class="tag tag-low">Only ' + p.stock + ' left</span>' : '') +
        '</div>' +
        '<button class="wish-btn' + (wished ? ' on' : '') + '" data-wish="' + p.id + '" type="button" aria-label="' +
          (wished ? 'Remove from wishlist' : 'Add to wishlist') + '" aria-pressed="' + wished + '">' + icon('heart') + '</button>' +
      '</div>' +
      '<div class="pcard-body">' +
        '<span class="pcard-cat">' + esc(catName(p.category)) + '</span>' +
        '<h3 class="pcard-name"><a href="' + toHref('/product?id=' + p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<span class="pcard-size">' + esc(p.size) + '</span>' +
        (p.reviewCount ? '<div class="pcard-rate">' + stars(p.rating) + '<small>(' + p.reviewCount + ')</small></div>' : '') +
        '<div class="pcard-foot">' +
          '<span class="pcard-price"><b>' + money(p.price) + '</b>' +
            (p.oldPrice ? '<s>' + money(p.oldPrice) + '</s>' : '') + '</span>' +
          '<button class="btn btn-primary btn-sm add-btn" data-add="' + p.id + '" type="button"' + (out ? ' disabled' : '') + '>' +
            icon('plus') + '<span>Add</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- Lazy images (IntersectionObserver + skeleton) ----------
     The real image is only requested from the CDN when its card is about to
     scroll into view. A skeleton box reserves the exact space (the media box
     already has aspect-ratio 1/1) so the layout never jumps, then the image
     fades in. Fails open: anything still unloaded after 2.5s is loaded anyway,
     so content is never left blank in a non-scrolling embed. */
  function initLazyImages(root) {
    var imgs = (root || document).querySelectorAll('img.lazy-img[data-src]');
    if (!imgs.length) return;
    function reveal(img) {
      img.classList.add('is-loaded');
      var m = img.closest('.pcard-media');
      if (m) m.classList.add('is-ready');
    }
    function load(img) {
      var src = img.getAttribute('data-src');
      if (!src) return;
      img.removeAttribute('data-src');
      img.addEventListener('load', function () { reveal(img); });
      img.addEventListener('error', function () { reveal(img); });
      img.src = src;
      if (img.complete) reveal(img);
    }
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(load);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { load(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '250px 0px', threshold: 0.01 });
    imgs.forEach(function (i) { io.observe(i); });
    setTimeout(function () {
      document.querySelectorAll('img.lazy-img[data-src]').forEach(load);
    }, 2500);
  }

  /* ---------- Recently viewed + WhatsApp ordering ---------- */
  var RECENT_KEY = 'ladydee_recent';
  function getRecent() { var r = read(RECENT_KEY, []); return Array.isArray(r) ? r : []; }
  function trackViewed(id) {
    if (!id) return;
    var r = getRecent().filter(function (x) { return x !== id; });
    r.unshift(id);
    write(RECENT_KEY, r.slice(0, 8));
  }
  function whatsappLink(text) {
    var n = String(getStoreInfo().phoneHref || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
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
    /* Shared header / footer / bottom bar come from components/*.html.
       If the loader has not finished yet, renderComponents() is a no-op and
       initComponents() re-runs from the loader callback below. */
    ACTIVE_PAGE = active;
    var ready = renderComponents(active);
    if (ready) initComponents();
    bootComponents(active);
    initGlobalEvents();
    refreshBadges();
    normalizeLinks();
    initLazyImages();
    /* grids are rendered after mount on most pages — keep wiring new lazy images */
    if ('MutationObserver' in window) {
      var lazyPending = false;
      new MutationObserver(function () {
        if (lazyPending) return;
        lazyPending = true;
        setTimeout(function () { lazyPending = false; initLazyImages(); }, 80);
      }).observe(document.body, { childList: true, subtree: true });
    }
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

  /* ---------- Component bootstrap ----------
     Kicks the shared components off once the page is interactive. mount()
     records which page we're on (for the active nav link / bottom bar),
     then once components.js has the markup we fill the tokens and wire the
     interactive parts. Safe to call more than once - the loader is
     idempotent and re-rendering is harmless. */
  var ACTIVE_PAGE = '';
  function bootComponents(active) {
    if (active !== undefined) ACTIVE_PAGE = active;
    var C = window.LadydeeComponents;
    if (!C || typeof C.load !== 'function') return;
    C.load(COMPONENT_ORDER, function () {
      renderComponents(ACTIVE_PAGE);
      initComponents();
      normalizeLinks();
    });
  }

  /* Safety net: if a page never calls mount(), still load the components. */
  function autoBoot() { bootComponents(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoBoot);
  } else {
    setTimeout(autoBoot, 0);
  }

  /* ---------- Public API ---------- */
  window.Ladydee = {
    icon: icon, esc: esc, money: money, param: param, stars: stars, fmtDate: fmtDate, daysFromNow: daysFromNow,
    CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS, ZONES: ZONES,
    catalogue: catalogue, imgUrl: imgUrl, initLazyImages: initLazyImages,
    getRecent: getRecent, trackViewed: trackViewed, whatsappLink: whatsappLink,
    serverAccounts: serverAccounts, sessionFromServer: sessionFromServer, authToken: authToken,
    product: product, catName: catName, catIcon: catIcon, discountOf: discountOf, searchProducts: searchProducts,
    getCart: getCart, addToCart: addToCart, setQty: setQty, removeFromCart: removeFromCart,
    clearCart: clearCart, cartCount: cartCount, cartLines: cartLines, cartSubtotal: cartSubtotal,
    getWish: getWish, inWish: inWish, toggleWish: toggleWish, wishCount: wishCount,
    getCoupons: getCoupons, setCoupons: setCoupons, findCoupon: findCoupon, applyCoupon: applyCoupon, redeemCoupon: redeemCoupon,
    getDeliveryRules: getDeliveryRules, setDeliveryRules: setDeliveryRules, zone: zone, deliveryQuote: deliveryQuote,
    getStoreInfo: getStoreInfo, setStoreInfo: setStoreInfo, STORE_DEFAULTS: STORE_DEFAULTS,
    getUsers: getUsers, setUsers: setUsers, currentUser: currentUser, isLoggedIn: isLoggedIn,
    signup: signup, verifyUser: verifyUser, login: login, logout: logout, updateUser: updateUser, resetPassword: resetPassword,
    getOrders: getOrders, setOrders: setOrders, addOrder: addOrder, updateOrder: updateOrder,
    orderStatuses: orderStatuses, statusLabel: statusLabel,
    toHref: toHref, go: go, normalizeLinks: normalizeLinks, fileMode: fileMode,
    toast: toast, observeReveals: observeReveals, productCard: productCard, refreshBadges: refreshBadges,
    mount: mount, renderComponents: renderComponents, initComponents: initComponents, bootComponents: bootComponents,
    fillTokens: fillTokens, COMPONENT_ORDER: COMPONENT_ORDER, COMPONENT_TOKENS: COMPONENT_TOKENS,
    read: read, write: write, K: K
  };
})();
