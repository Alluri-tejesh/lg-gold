import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// HMT and JSR come from public/storefront.json (exported from products.ts); everything the admin page edits
// (extra products and packs, prices, stock, delivery rules) comes from the database store.
export async function priceOrder(
  items,
  expectedTotal,
  store,
  dataDir = resolve("public"),
) {
  const base = JSON.parse(
    await readFile(resolve(dataDir, "storefront.json"), "utf8"),
  );
  const { catalog, prices, settings: rules } = store;
  const products = new Map(
    base.products.map((p) => [p.slug, structuredClone(p)]),
  );
  for (const c of catalog.products || []) {
    const p = products.get(c.slug) || {
      slug: c.slug,
      name: c.name,
      image: c.image,
      packs: [],
    };
    if (c.name) p.name = c.name;
    if (c.image) p.image = c.image;
    for (const pack of c.packs || []) {
      const old = p.packs.find((x) => x.size === pack.size);
      if (old) Object.assign(old, pack);
      else p.packs.push(pack);
    }
    products.set(c.slug, p);
  }
  const merged = new Map();
  for (const item of items) {
    const key = `${item.productSlug}/${item.packSize}`;
    const old = merged.get(key);
    merged.set(key, {
      ...item,
      quantity: (old?.quantity || 0) + item.quantity,
    });
  }
  const snapshot = [...merged.values()].map((i) => {
    const p = products.get(i.productSlug);
    const pack = p?.packs.find((x) => x.size === i.packSize);
    const rate = prices.prices?.[i.productSlug]?.[i.packSize];
    const price = rate?.price ?? pack?.price;
    if (
      !p ||
      !pack ||
      !Number.isFinite(price) ||
      price <= 0 ||
      i.quantity > 100 ||
      rate?.inStock === false ||
      prices.outOfStock?.includes(i.productSlug)
    )
      throw Object.assign(
        new Error("An item is unavailable. Please refresh your cart."),
        { status: 409 },
      );
    return {
      id: `${p.slug}-${pack.size}`,
      productId: p.id || p.slug,
      productSlug: p.slug,
      productName: p.name,
      image: p.image,
      packSize: pack.size,
      price,
      mrp: rate?.mrp ?? pack.mrp ?? price,
      quantity: i.quantity,
    };
  });
  const rice =
    snapshot.reduce((n, i) => n + Math.round(i.price * 100) * i.quantity, 0) /
    100;
  const delivery =
    rice >= rules.delivery.freeFromOrderValue ? 0 : rules.delivery.charge;
  const total = Math.round((rice + delivery) * 100) / 100;
  if (Math.abs(total - expectedTotal) > 0.005)
    throw Object.assign(
      new Error(
        "Prices have changed. Refresh the page to review the current total before ordering.",
      ),
      { status: 409 },
    );
  return { items: snapshot, totals: { rice, delivery, total }, rules };
}
