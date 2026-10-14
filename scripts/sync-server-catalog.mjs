import { build } from "esbuild";
import { writeFile } from "node:fs/promises";
const result = await build({
  stdin: {
    contents:
      "export { PRODUCTS } from './src/data/products'; export { BRAND_CONFIG } from './src/config/brandConfig';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  define: { "import.meta.env": "{}" },
  loader: {
    ".webp": "dataurl",
    ".jpg": "dataurl",
    ".png": "dataurl",
    ".svg": "dataurl",
  },
});
const module = { exports: {} };
new Function("module", "exports", result.outputFiles[0].text)(
  module,
  module.exports,
);
const { PRODUCTS, BRAND_CONFIG } = module.exports;
await writeFile(
  "public/storefront.json",
  JSON.stringify({
    products: PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images.primary.startsWith("data:") ? "" : p.images.primary,
      packs: p.packOptions.map((o) => ({
        size: o.size,
        price: o.retailPrice,
        mrp: o.mrp,
      })),
    })),
  }),
);
await writeFile(
  "public/store-rules.json",
  JSON.stringify({
    delivery: BRAND_CONFIG.delivery,
    cashOnDelivery: BRAND_CONFIG.payments.cashOnDelivery,
    // First-run defaults for the database store; after that the admin page's Settings tab is in charge.
    upiId: BRAND_CONFIG.payments.upiId,
    upiPayeeName: BRAND_CONFIG.payments.upiPayeeName,
  }),
);
console.log("Synchronized server catalog and delivery rules.");
