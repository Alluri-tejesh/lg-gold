# Updating the daily rice prices and stock

Prices are not hard-coded in the pages. The site reads them every time a visitor opens it, so you can change them without a developer.
The date you set is shown next to the price ("Retail price, 12 Oct 2026") and is added to every WhatsApp order message.

Customers order only on WhatsApp, and the mill confirms the final rate there, so these prices are what visitors see first.

## Easiest: the "Update prices and stock" button (no file editing)

You fill in a short form on GitHub. It edits the price file, saves it and redeploys the site for you.

1. Open the repository on github.com and click the **Actions** tab.
2. In the list on the left choose **Update prices and stock**.
3. Click **Run workflow** (on the right). Make sure the branch says `main`.
4. Fill in only what changed:
   - Type a new price in rupees for any pack, for example `1725`. Leave a box empty to keep its current price.
   - Set **HMT stock** or **JSR stock** to `out of stock` or `in stock`. `no change` leaves it as it is.
5. Click the green **Run workflow** button. After about 2 minutes the new prices are live.

The run page shows a table of what changed (before and after). A price below ₹100 or a value that is not a number is rejected, so a typo cannot go live. If you enter the same values that are already live, nothing changes.

The date shown next to prices is set automatically to today (India time).

You can also run it from a phone browser: open github.com, go to the repository, then Actions.

## Option 1: edit one file by hand

1. Open `public/prices.json` in GitHub (Code tab, `public` folder, pencil icon).
2. Change the numbers and the `updated` date. Keep the quotes and commas exactly as they are:

   ```json
   {
     "updated": "2026-10-13",
     "prices": {
       "hmt-rice": {
         "26kg Bag": { "price": 1680, "mrp": 1850 }
       }
     }
   }
   ```

   - `price` is what the customer pays. `mrp` is the crossed-out price. If `mrp` is lower than `price` it is ignored.
   - You can list only the packs that changed. Anything you leave out keeps its old price.
   - Pack names must match exactly: `26kg Bag`, `26kg x 5 Bags (130kg)`, `26kg x 10 Bags (260kg)`.
   - Product names are `hmt-rice` and `jsr-rice`.
3. Save the change (commit) and merge it. The site rebuilds and goes live in about 2 minutes.

### Marking rice out of stock (Option 1)

In the same file, add the product to the `outOfStock` list. Example: HMT is finished.

```json
"outOfStock": ["hmt-rice"],
```

When it is back, empty the list again: `"outOfStock": [],`.

- A product in this list is out of stock in every pack. Its card says "Out of stock", Add to Cart and Buy Now are switched off, and the WhatsApp button changes to "Ask when back".
- To mark only one pack out of stock, add `"inStock": false` to that pack: `"26kg Bag": { "price": 1650, "mrp": 1850, "inStock": false }`.
- Anything out of stock is also removed from a visitor's saved cart.

## Option 2: a Google Sheet (instant, no rebuild)

Best if the price changes every day. Edit a sheet on your phone and the site updates within a minute.

1. Create a Google Sheet with these columns, one row per pack, no header row needed:

   | A | B | C | D |
   | --- | --- | --- | --- |
   | hmt-rice | 26kg Bag | 1650 | 1850 |
   | hmt-rice | 26kg x 5 Bags (130kg) | 8000 | 9250 |
   | jsr-rice | 26kg Bag | 1820 | 2050 |
   | updated | 2026-10-13 | | |
   | outofstock | hmt-rice | | |

   Column E is optional: type `out` on a pack's row to mark just that pack out of stock. The `outofstock` row marks a whole product out of stock. Delete the row when it is back.

2. In Google Sheets choose File, Share, Publish to web. Pick this sheet and the format "Comma-separated values (.csv)", then Publish. Copy the link.
3. Paste the link into `src/config/brandConfig.ts` as `pricesCsvUrl` and merge once.

From then on, change the numbers in the sheet and the site follows. If the sheet cannot be reached, the site falls back to `public/prices.json`.

Anyone who has the link can read the sheet, so do not put anything private in it. Only people you share the sheet with can edit it.

## If something goes wrong

- A wrong or missing price is ignored and the previous one stays, so a typo cannot blank the site.
- Visitors may need to refresh once to see a new price if they already had the page open.
