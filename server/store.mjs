import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * The shop's products, prices and settings live in one MongoDB document, edited from the admin page.
 * A change is visible to the next visitor straight away: no rebuild, no deploy, no GitHub.
 *
 *   catalog   products added later, extra pack sizes, name/photo changes   (same shape as public/catalog.json)
 *   prices    every pack's price, MRP and stock                            (same shape as public/prices.json)
 *   settings  delivery charge and free-delivery threshold, payment options
 *
 * On first start the document is created from the JSON files in public/, so nothing is lost.
 */
const ID = "storefront";

const readJson = async (dataDir, file, fallback) => {
  try {
    return JSON.parse(await readFile(resolve(dataDir, file), "utf8"));
  } catch {
    return fallback;
  }
};

export async function defaultStore(dataDir = resolve("public")) {
  const [catalog, prices, rules] = await Promise.all([
    readJson(dataDir, "catalog.json", { products: [] }),
    readJson(dataDir, "prices.json", { prices: {} }),
    readJson(dataDir, "store-rules.json", {}),
  ]);
  return {
    catalog,
    prices,
    settings: {
      delivery: rules.delivery || { freeFromOrderValue: 2500, charge: 50 },
      cashOnDelivery: rules.cashOnDelivery ?? true,
      upiId: rules.upiId || "",
      upiPayeeName: rules.upiPayeeName || "LG Gold Rice",
      smsLogin: false,
    },
  };
}

export function createStore(db, dataDir) {
  const col = db.collection("store");
  return {
    async get() {
      const doc = await col.findOne({ _id: ID });
      if (doc) return doc;
      const fresh = { _id: ID, ...(await defaultStore(dataDir)), version: 1, updatedAt: new Date() };
      try {
        await col.insertOne(fresh);
        return fresh;
      } catch (err) {
        if (err.code !== 11000) throw err;
        return col.findOne({ _id: ID }); // another request created it first
      }
    },
    /** Saves only if nobody else saved since `version` was read. Returns null on a conflict. */
    async save(version, data) {
      await this.get();
      return col.findOneAndUpdate(
        { _id: ID, version },
        { $set: { ...data, updatedAt: new Date() }, $inc: { version: 1 } },
        { returnDocument: "after" },
      );
    },
  };
}

export const publicStore = (s) => ({
  catalog: s.catalog,
  prices: s.prices,
  settings: s.settings,
  version: s.version,
  updatedAt: s.updatedAt,
});
