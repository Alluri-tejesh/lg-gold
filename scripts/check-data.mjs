#!/usr/bin/env node
/**
 * Checks public/catalog.json and public/prices.json (the starting data for a new database, and the shop's
 * fallback when the server cannot be reached), so a broken hand edit fails the build instead of the live shop.
 * Exits with an error listing every problem found.
 */
import { existsSync, readFileSync } from 'node:fs';

const problems = [];
const read = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    problems.push(`${file} is not valid JSON: ${e.message}`);
    return null;
  }
};

const catalog = read('public/catalog.json');
const prices = read('public/prices.json');
const isPrice = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0 && n <= 500000;

if (catalog) {
  if (!Array.isArray(catalog.products)) problems.push('catalog.json needs a "products" list.');
  const seen = new Set();
  for (const p of catalog.products ?? []) {
    if (!p?.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) problems.push(`catalog.json: bad product id "${p?.slug}".`);
    if (seen.has(p.slug)) problems.push(`catalog.json: "${p.slug}" is listed twice.`);
    seen.add(p.slug);
    if (p.image && !/^https?:\/\//.test(p.image) && !existsSync(`public/${decodeURI(p.image)}`)) {
      problems.push(`catalog.json: picture "${p.image}" for ${p.slug} is missing from public/.`);
    }
    for (const pack of p.packs ?? []) {
      if (!pack.size) problems.push(`catalog.json: ${p.slug} has a pack without a size.`);
      if (!isPrice(pack.price)) problems.push(`catalog.json: ${p.slug} ${pack.size} has a bad price (${pack.price}).`);
    }
    const builtIn = ['hmt-rice', 'jsr-rice'].includes(p.slug);
    if (!builtIn && (!p.name || !p.image || !(p.packs ?? []).length)) {
      problems.push(`catalog.json: new product ${p.slug} needs a name, a picture and at least one pack.`);
    }
  }
}

if (prices) {
  if (prices.updated && !/^\d{4}-\d{2}-\d{2}$/.test(prices.updated)) problems.push(`prices.json: date "${prices.updated}" must look like 2026-10-13.`);
  for (const [slug, packs] of Object.entries(prices.prices ?? {})) {
    for (const [size, e] of Object.entries(packs ?? {})) {
      if (!isPrice(e?.price)) problems.push(`prices.json: ${slug} ${size} has a bad price (${e?.price}).`);
      if (e?.mrp !== undefined && !(isPrice(e.mrp) && e.mrp >= e.price)) problems.push(`prices.json: ${slug} ${size} MRP must be at least the price.`);
    }
  }
}

if (problems.length) {
  console.error('The product data has problems, so the site was not published:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('Product and price data look good.');
