#!/usr/bin/env node
/**
 * Applies price and stock changes to public/prices.json.
 * Inputs come from environment variables, so the GitHub Actions form and a local run use the same code:
 *
 *   HMT_26KG, HMT_5BAGS, HMT_10BAGS, JSR_26KG, JSR_5BAGS, JSR_10BAGS   new price in rupees, blank = keep
 *   HMT_STOCK, JSR_STOCK                                                "in stock", "out of stock", blank or "no change" = keep
 *   PRICE_DATE                                                          YYYY-MM-DD, defaults to today in India
 *   PRICES_FILE                                                         path to the JSON file (default public/prices.json)
 *
 * Prints a Markdown summary of what changed. Exits with an error on a value that is not a sensible price.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = process.env.PRICES_FILE || 'public/prices.json';

const PACKS = [
  ['hmt-rice', '26kg Bag', 'HMT_26KG'],
  ['hmt-rice', '26kg x 5 Bags (130kg)', 'HMT_5BAGS'],
  ['hmt-rice', '26kg x 10 Bags (260kg)', 'HMT_10BAGS'],
  ['jsr-rice', '26kg Bag', 'JSR_26KG'],
  ['jsr-rice', '26kg x 5 Bags (130kg)', 'JSR_5BAGS'],
  ['jsr-rice', '26kg x 10 Bags (260kg)', 'JSR_10BAGS'],
];
const STOCK = [
  ['hmt-rice', 'HMT_STOCK'],
  ['jsr-rice', 'JSR_STOCK'],
];

const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
const data = JSON.parse(readFileSync(FILE, 'utf8'));
data.prices ??= {};
data.outOfStock ??= [];

const changes = [];

for (const [slug, pack, envName] of PACKS) {
  const raw = (process.env[envName] ?? '').trim();
  if (!raw) continue;
  const price = Number(raw.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(price) || price < 100 || price > 500000) {
    console.error(`"${raw}" for ${slug} ${pack} is not a sensible price in rupees.`);
    process.exit(1);
  }
  const entry = ((data.prices[slug] ??= {})[pack] ??= { price, mrp: price });
  const before = entry.price;
  entry.price = price;
  if (!(entry.mrp >= price)) entry.mrp = price; // the crossed-out price can never be lower than the price
  if (before !== price) changes.push(`| ${slug} | ${pack} | ${inr(before)} | ${inr(price)} |`);
  else changes.push(`| ${slug} | ${pack} | ${inr(before)} | unchanged |`);
}

const stockChanges = [];
for (const [slug, envName] of STOCK) {
  const v = (process.env[envName] ?? '').trim().toLowerCase();
  if (!v || v === 'no change') continue;
  const wasOut = data.outOfStock.includes(slug);
  if (v === 'out of stock') {
    if (!wasOut) data.outOfStock.push(slug);
    stockChanges.push(`| ${slug} | ${wasOut ? 'already out of stock' : 'now **out of stock**'} |`);
  } else if (v === 'in stock') {
    data.outOfStock = data.outOfStock.filter((s) => s !== slug);
    stockChanges.push(`| ${slug} | ${wasOut ? 'back **in stock**' : 'already in stock'} |`);
  } else {
    console.error(`Stock value "${v}" for ${slug} must be "in stock", "out of stock" or "no change".`);
    process.exit(1);
  }
}

if (changes.length === 0 && stockChanges.length === 0) {
  console.error('Nothing to update: fill in at least one price or choose a stock status.');
  process.exit(1);
}

const date = (process.env.PRICE_DATE ?? '').trim() || today();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`Date "${date}" must look like 2026-10-13.`);
  process.exit(1);
}
data.updated = date;

// Keep the file tidy and in a stable order so the diff shows only what changed.
const ordered = { updated: data.updated, outOfStock: data.outOfStock, prices: data.prices };
writeFileSync(FILE, JSON.stringify(ordered, null, 2) + '\n');

const lines = [`### Prices updated, ${date}`, ''];
if (changes.length) lines.push('| Product | Pack | Before | After |', '| --- | --- | --- | --- |', ...changes, '');
if (stockChanges.length) lines.push('| Product | Stock |', '| --- | --- |', ...stockChanges, '');
console.log(lines.join('\n'));
