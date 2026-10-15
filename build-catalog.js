/* Regenerates the manifest block inside app.js PRODUCTS from utils/products-manifest.js.
   Run after editing the manifest:   node build-catalog.js                                  */
const fs = require('fs');
const src = fs.readFileSync('utils/products-manifest.js', 'utf8').replace(/export const/g, 'const');
const manifest = new Function(src + '; return groceryCatalogManifest;')();

function storeCategory(id) {
  if (/^(cust_|cornflakes_|cocopops_)/.test(id)) return 'snacks';
  if (/^(dano_|loyal_|peak_|bev_milo|bev_bournvita|drink_)/.test(id)) return 'beverages';
  if (/^(nan_|diaper_)/.test(id)) return 'baby-kids';
  if (/^fs_mychoice/.test(id)) return 'rice-grains';
  return 'cooking'; // pasta, noodles, soyin, butter
}
function sizeLabel(n) {
  const m = n.match(/\b(Case|Pack|Bag|Roll|Refill|Tin|Can|Bottle)\b/i);
  return m ? m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() : 'Each';
}
const rows = manifest.map(p => '    ' + JSON.stringify({
  id: p.id, name: p.name, category: storeCategory(p.id), size: sizeLabel(p.name),
  price: p.price, oldPrice: null, rating: 0, reviewCount: 0, badge: null, stock: 100,
  image: 'images/product-placeholder.svg', noImage: true, scene: 'images/scene-warehouse.png',
  short: p.name, description: p.name + ' \u2014 available from Ladydee Minimart Store.',
  features: ['Sealed packaging', 'Quality checked'], specs: { Packaging: 'Sealed' }
}) + ',').join('\n');

const A = '/* >>> GENERATED:MANIFEST >>> */', B = '/* <<< GENERATED:MANIFEST <<< */';
let app = fs.readFileSync('app.js', 'utf8');
const re = new RegExp(A.replace(/[*/]/g, '\\$&') + '[\\s\\S]*?' + B.replace(/[*/]/g, '\\$&'));
if (!re.test(app)) throw new Error('Markers not found in app.js');
fs.writeFileSync('app.js', app.replace(re, () => A + '\n' + rows + '\n    ' + B));
console.log('app.js updated with ' + manifest.length + ' manifest products');
