#!/usr/bin/env node
/**
 * Adds, updates or removes a product in public/catalog.json, and saves its picture in public/products/.
 * Inputs come from environment variables so the GitHub Actions form and a local run use the same code:
 *
 *   ACTION        "add or update product" (default), "remove pack size" or "remove product"
 *   SLUG          lowercase-with-dashes id, e.g. basmati-rice. Use hmt-rice or jsr-rice to change those products,
 *                 including adding new pack sizes such as "5kg Bag" to them.
 *   NAME          full name, e.g. LG Gold Basmati Rice        (required for a new product)
 *   SHORT_NAME    short name for buttons and filters           (optional)
 *   SUBTITLE      one line under the name                      (optional)
 *   DESCRIPTION   a few sentences                              (optional)
 *   IMAGE         a picture: an https link, or a file name already uploaded to public/products/ (required for a new product)
 *   IMAGE_FIT     "contain" (whole picture, best for bag photos) or "cover" (fills the frame)
 *   PACK_SIZE     e.g. "26kg Bag" or "50kg Bag"                (default "26kg Bag" when a price is given)
 *                 "none" means not set; "other (type below)" reads CUSTOM_PACK_SIZE instead.
 *   CUSTOM_PACK_SIZE  any other size, e.g. "1kg Pouch" or "25 kg"  ("25 kg" is tidied to "25kg Bag")
 *   PRICE, MRP    rupees; MRP is the crossed-out price         (price required for a new product)
 *   STOCK         "in stock", "out of stock" or blank/"no change"
 *
 * Test overrides: CATALOG_FILE, PRICES_FILE, PRODUCTS_DIR.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const CATALOG_FILE = process.env.CATALOG_FILE || 'public/catalog.json';
const PRICES_FILE = process.env.PRICES_FILE || 'public/prices.json';
const PRODUCTS_DIR = process.env.PRODUCTS_DIR || 'public/products';
const BUILT_IN = ['hmt-rice', 'jsr-rice'];
// HMT and JSR's own packs. Their prices are changed with the "Update prices and stock" form; any other size can be added here.
const BUILT_IN_PACKS = ['26kg Bag', '26kg x 5 Bags (130kg)', '26kg x 10 Bags (260kg)'];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const env = (k) => (process.env[k] ?? '').trim();
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
const readJson = (file, fallback) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback);
const writeJson = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

const parsePrice = (raw, label) => {
  const n = Number(raw.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n < 100 || n > 500000) fail(`${label} "${raw}" is not a sensible price in rupees.`);
  return n;
};

/** The pack size from the form, tidied so "5 kg", "5KG bag" and "5kg Bag" are all saved as "5kg Bag". Empty when not set. */
const packSize = () => {
  const choice = env('PACK_SIZE');
  const raw = /^other/i.test(choice) ? env('CUSTOM_PACK_SIZE') : /^none$/i.test(choice) ? '' : choice;
  if (/^other/i.test(choice) && !raw) fail('You chose "other" for the pack size. Type the size in "Other pack size", e.g. 25kg Bag.');
  const kg = raw.match(/^(\d+(?:\.\d+)?)\s*kg\s*(?:bags?)?$/i);
  return kg ? `${kg[1]}kg Bag` : raw;
};

const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // 202610131045

/** Saves the picture into public/products and returns its path relative to public/. */
async function saveImage(slug, spec) {
  mkdirSync(PRODUCTS_DIR, { recursive: true });

  if (/^https?:\/\//i.test(spec)) {
    const res = await fetch(spec, { redirect: 'follow' });
    if (!res.ok) fail(`Could not download the picture (${res.status}). Check that the link is public.`);
    const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type];
    if (!ext) fail(`That link is "${type || 'not an image'}". Use a JPG, PNG or WebP picture.`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length > MAX_IMAGE_BYTES) fail(`The picture is ${(bytes.length / 1048576).toFixed(1)} MB. Keep it under 8 MB.`);
    // A new name every time, so browsers never show an old cached picture.
    const file = `${slug}-${stamp()}.${ext}`;
    writeFileSync(path.join(PRODUCTS_DIR, file), bytes);
    return `products/${file}`;
  }

  const name = spec.replace(/^(public\/)?products\//, '');
  if (!/^[\w.\- ]+\.(jpe?g|png|webp)$/i.test(name)) fail(`"${spec}" is not a picture file name (JPG, PNG or WebP).`);
  if (!existsSync(path.join(PRODUCTS_DIR, name))) {
    fail(`"${name}" was not found in the products folder. Upload it to public/products first, or paste a picture link instead.`);
  }
  return `products/${encodeURI(name)}`;
}

async function main() {
  const action = (env('ACTION') || 'add or update product').toLowerCase();
  const slug = env('SLUG').toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`Slug "${slug}" must be lowercase letters, numbers and dashes, like basmati-rice.`);

  const catalog = readJson(CATALOG_FILE, { products: [] });
  catalog.products ??= [];
  const prices = readJson(PRICES_FILE, { updated: undefined, outOfStock: [], prices: {} });
  prices.outOfStock ??= [];
  const index = catalog.products.findIndex((p) => p.slug === slug);
  const out = [];

  if (action === 'remove pack size') {
    const size = packSize();
    if (!size) fail('Choose the pack size to remove.');
    if (BUILT_IN.includes(slug) && BUILT_IN_PACKS.includes(size)) {
      fail(`${size} is one of ${slug}'s own packs and cannot be removed. Mark it out of stock with the "Update prices and stock" form instead.`);
    }
    const entry = catalog.products[index];
    const before = entry?.packs?.length ?? 0;
    if (entry) entry.packs = (entry.packs ?? []).filter((p) => p.size !== size);
    if (!entry || entry.packs.length === before) fail(`${slug} has no "${size}" pack to remove.`);
    if (!BUILT_IN.includes(slug) && entry.packs.length === 0) {
      fail(`${size} is the only pack ${slug} has. Remove the whole product instead, or add another pack first.`);
    }
    if (prices.prices?.[slug]) delete prices.prices[slug][size];
    writeJson(CATALOG_FILE, catalog);
    writeJson(PRICES_FILE, prices);
    console.log(`### Removed the ${size} pack from ${entry.name || slug}\n\nThe other packs stay on the site.`);
    return;
  }

  if (action.startsWith('remove')) {
    if (index === -1) {
      fail(
        BUILT_IN.includes(slug)
          ? `${slug} is a built-in product and has no catalog entry to remove.`
          : `"${slug}" is not in the catalog. Nothing to remove.`,
      );
    }
    catalog.products.splice(index, 1);
    prices.outOfStock = prices.outOfStock.filter((s) => s !== slug);
    delete prices.prices?.[slug];
    writeJson(CATALOG_FILE, catalog);
    writeJson(PRICES_FILE, prices);
    console.log(`### Removed ${slug}\n\nThe product is gone from the site. Its picture file stays in the products folder.`);
    return;
  }

  const builtIn = BUILT_IN.includes(slug);
  const isNew = index === -1;
  const entry = isNew ? { slug } : catalog.products[index];

  if (env('NAME')) entry.name = env('NAME');
  if (env('SHORT_NAME')) entry.shortName = env('SHORT_NAME');
  if (env('SUBTITLE')) entry.subTitle = env('SUBTITLE');
  if (env('DESCRIPTION')) entry.description = env('DESCRIPTION');
  if (env('IMAGE_FIT')) {
    const fit = env('IMAGE_FIT').toLowerCase();
    if (!['contain', 'cover'].includes(fit)) fail('Picture fit must be "contain" or "cover".');
    entry.imageFit = fit;
  }

  let imageNote = '';
  if (env('IMAGE')) {
    entry.image = await saveImage(slug, env('IMAGE'));
    imageNote = `picture saved as \`${entry.image}\``;
  }

  let packNote = '';
  if (env('PRICE') || env('MRP')) {
    if (!env('PRICE')) fail('Enter the price as well as the MRP.');
    const size = packSize() || '26kg Bag';
    if (builtIn && BUILT_IN_PACKS.includes(size)) {
      fail(`Change the ${size} price for ${slug} with the "Update prices and stock" form. This form adds other sizes, like 5kg Bag.`);
    }
    const price = parsePrice(env('PRICE'), 'Price');
    entry.packs ??= [];
    let pack = entry.packs.find((p) => p.size === size);
    if (!pack) entry.packs.push((pack = { size }));
    pack.price = price;
    const mrp = env('MRP') ? parsePrice(env('MRP'), 'MRP') : pack.mrp ?? price;
    pack.mrp = mrp >= price ? mrp : price;
    // The admin page keeps every pack's price in prices.json too, and the site applies prices.json last,
    // so update it here as well or an older price there would win.
    const priced = prices.prices?.[slug]?.[size];
    if (priced) Object.assign(priced, { price: pack.price, mrp: pack.mrp });
    packNote = `${size}: ${inr(price)}${pack.mrp > price ? ` (MRP ${inr(pack.mrp)})` : ''}`;
  } else if (packSize()) {
    fail('A pack size needs a price too.');
  }

  if (isNew && !builtIn) {
    if (!entry.name) fail('A new product needs a name.');
    if (!entry.image) fail('A new product needs a picture: paste a link or a file name.');
    if (!entry.packs?.length) fail('A new product needs a price (and a pack size, such as "26kg Bag").');
    entry.shortName ??= entry.name;
  }

  let stockNote = '';
  const stock = env('STOCK').toLowerCase();
  if (stock && stock !== 'no change') {
    if (stock === 'out of stock') {
      if (!prices.outOfStock.includes(slug)) prices.outOfStock.push(slug);
      stockNote = 'marked **out of stock**';
    } else if (stock === 'in stock') {
      prices.outOfStock = prices.outOfStock.filter((s) => s !== slug);
      stockNote = 'marked **in stock**';
    } else fail('Stock must be "in stock", "out of stock" or "no change".');
  }

  const touched = [imageNote, packNote, stockNote, env('NAME') || env('SHORT_NAME') || env('SUBTITLE') || env('DESCRIPTION') ? 'text updated' : ''].filter(Boolean);
  if (touched.length === 0) fail('Nothing to update: fill in at least one field besides the product slug.');

  if (isNew && !builtIn) catalog.products.push(entry);
  else if (index === -1) catalog.products.push(entry); // first change to a built-in product
  else catalog.products[index] = entry;

  prices.updated = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  writeJson(CATALOG_FILE, catalog);
  writeJson(PRICES_FILE, { updated: prices.updated, outOfStock: prices.outOfStock, prices: prices.prices ?? {} });

  out.push(`### ${isNew && !builtIn ? 'Added' : 'Updated'} ${entry.name || slug}`, '', ...touched.map((t) => `- ${t}`));
  console.log(out.join('\n'));
}

main().catch((e) => fail(`Unexpected error: ${e.message}`));
