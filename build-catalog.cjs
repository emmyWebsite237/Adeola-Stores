/* Rebuilds the product list and categories inside app.js from data/products.csv.

   Edit data/products.csv (for example to add a missing price), then run:
       npm run build:catalog
   and push the changed app.js.

   Required columns:  Category, Brand, Product Name, Description, Price (NGN)
   Optional columns:  Size, Stock, Old Price (NGN), Badge (bestseller/new), Featured (yes/no)

   A row with no price is NOT put on the website (nobody can buy it). It is
   written to data/needs-price.csv so you can fill the prices in.            */
const fs = require('fs');

function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.some(function (x) { return x.trim() !== ''; })) rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); if (row.some(function (x) { return x.trim() !== ''; })) rows.push(row); }
  return rows;
}
function csvLine(cells) {
  return cells.map(function (v) { v = String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',');
}

/* Category look: order, icon and a short line for the tiles. */
const CATS = [
  ['Pantry Staples & Grains',       'pantry-grains',     'wheat',  'Rice, pasta, semolina & noodles'],
  ['Breakfast & Cereals',           'breakfast-cereals', 'cup',    'Custard, cereals & malt drinks'],
  ['Milk & Dairy',                  'milk-dairy',        'droplet','Powdered milk refills'],
  ['Beverages & Drinks',            'beverages-drinks',  'cup',    'Soft drinks, water & malt'],
  ['Snacks, Sugar & Confectionery', 'snacks-sugar',      'cookie', 'Biscuits, sugar & sweets'],
  ['Condiments & Canned Foods',     'condiments-canned', 'pot',    'Tomato paste, spreads & sardines'],
  ['Baby Care & Infant Nutrition',  'baby-care',         'baby',   'Diapers, formula & baby milk']
];
function slug(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function sizeOf(name) {
  const w = name.match(/\b(\d+(?:\.\d+)?\s?(?:kg|g|l|ml))\b/i);
  if (w) return w[1].replace(/\s+/g, '');
  const u = name.match(/\b(Carton|Refill|Roll|Cup|Tin|Pack|Bag|Sachet|Bottle|Can|Pouch|Box)\b/i);
  return u ? u[1][0].toUpperCase() + u[1].slice(1).toLowerCase() : 'Each';
}
function money(v) { const n = parseFloat(String(v || '').replace(/[^0-9.]/g, '')); return n > 0 ? n : 0; }
function yes(v) { return /^(y|yes|true|1)$/i.test(String(v || '').trim()); }

const rows = parseCSV(fs.readFileSync('data/products.csv', 'utf8'));
const head = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
function col(r, name) { const i = head.indexOf(name.toLowerCase()); return i < 0 ? '' : String(r[i] == null ? '' : r[i]).trim(); }
['category', 'brand', 'product name', 'description', 'price (ngn)'].forEach(function (c) {
  if (head.indexOf(c) < 0) throw new Error('data/products.csv is missing the column: ' + c);
});

const catById = {}, order = [];
CATS.forEach(function (c) { catById[c[0]] = { id: c[1], name: c[0], blurb: c[3], icon: c[2] }; });
const used = {};
const live = [], held = [], ids = {};
rows.forEach(function (r) {
  const name = col(r, 'Product Name'); if (!name) return;
  const catName = col(r, 'Category') || 'Other';
  if (!catById[catName]) catById[catName] = { id: slug(catName), name: catName, blurb: '', icon: 'cookie' };
  const price = money(col(r, 'Price (NGN)'));
  if (!price) { held.push(r); return; }
  let id = slug(name), n = 2; while (ids[id]) id = slug(name) + '-' + n++;
  ids[id] = 1; used[catName] = 1;
  const brand = col(r, 'Brand'), size = col(r, 'Size') || sizeOf(name);
  const old = money(col(r, 'Old Price (NGN)')), stockRaw = col(r, 'Stock');
  const badge = col(r, 'Badge').toLowerCase();
  const p = {
    id: id, name: name, category: catById[catName].id, brand: brand, size: size, price: price,
    oldPrice: old > price ? old : null, rating: 0, reviewCount: 0,
    badge: (badge === 'bestseller' || badge === 'new') ? badge : null,
    stock: stockRaw === '' ? 100 : Math.max(0, Math.floor(Number(stockRaw)) || 0),
    image: 'images/product-placeholder.svg', noImage: true, scene: 'images/scene-warehouse.png',
    short: brand, description: col(r, 'Description'),
    features: [brand ? 'Brand: ' + brand : null, 'Pack: ' + size].filter(Boolean),
    specs: brand ? { Brand: brand, Pack: size } : { Pack: size }
  };
  if (yes(col(r, 'Featured'))) p.featured = true;
  live.push(p);
});

/* categories: the ones from the file that still have live products, in the order above */
const cats = [];
CATS.forEach(function (c) { if (used[c[0]]) cats.push(catById[c[0]]); });
Object.keys(catById).forEach(function (k) { if (used[k] && CATS.every(function (c) { return c[0] !== k; })) cats.push(catById[k]); });

function inject(src, tag, body) {
  const a = '/* >>> GENERATED:' + tag + ' >>> */', b = '/* <<< GENERATED:' + tag + ' <<< */';
  const i = src.indexOf(a), j = src.indexOf(b);
  if (i < 0 || j < 0) throw new Error('Markers for ' + tag + ' not found in app.js');
  return src.slice(0, i) + a + '\n' + body + '\n    ' + b + src.slice(j + b.length);
}
let app = fs.readFileSync('app.js', 'utf8');
app = inject(app, 'CATEGORIES', cats.map(function (c) { return '    { id: ' + JSON.stringify(c.id) + ', name: ' + JSON.stringify(c.name) + ', blurb: ' + JSON.stringify(c.blurb) + ', icon: ' + JSON.stringify(c.icon) + ' }'; }).join(',\n'));
app = inject(app, 'PRODUCTS', live.map(function (p) { return '    ' + JSON.stringify(p) + ','; }).join('\n'));
fs.writeFileSync('app.js', app);

fs.writeFileSync('data/needs-price.csv', csvLine(['Category', 'Brand', 'Product Name', 'Description', 'Price (NGN)']) + '\n' +
  held.map(function (r) { return csvLine([col(r, 'Category'), col(r, 'Brand'), col(r, 'Product Name'), col(r, 'Description'), '']); }).join('\n') + '\n');
console.log('app.js: ' + live.length + ' products live in ' + cats.length + ' categories; ' + held.length + ' held back (no price) -> data/needs-price.csv');
