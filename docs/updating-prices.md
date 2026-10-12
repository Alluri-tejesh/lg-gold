# Updating the daily rice prices

Prices are not hard-coded in the pages. The site reads them every time a visitor opens it, so you can change them without a developer.
The date you set is shown next to the price ("Retail price, 12 Oct 2026") and is added to every WhatsApp order message.

Customers order only on WhatsApp, and the mill confirms the final rate there, so these prices are what visitors see first.

## Option 1: edit one file (works today)

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

## Option 2: a Google Sheet (instant, no rebuild)

Best if the price changes every day. Edit a sheet on your phone and the site updates within a minute.

1. Create a Google Sheet with these columns, one row per pack, no header row needed:

   | A | B | C | D |
   | --- | --- | --- | --- |
   | hmt-rice | 26kg Bag | 1650 | 1850 |
   | hmt-rice | 26kg x 5 Bags (130kg) | 8000 | 9250 |
   | jsr-rice | 26kg Bag | 1820 | 2050 |
   | updated | 2026-10-13 | | |

2. In Google Sheets choose File, Share, Publish to web. Pick this sheet and the format "Comma-separated values (.csv)", then Publish. Copy the link.
3. Paste the link into `src/config/brandConfig.ts` as `pricesCsvUrl` and merge once.

From then on, change the numbers in the sheet and the site follows. If the sheet cannot be reached, the site falls back to `public/prices.json`.

Anyone who has the link can read the sheet, so do not put anything private in it. Only people you share the sheet with can edit it.

## If something goes wrong

- A wrong or missing price is ignored and the previous one stays, so a typo cannot blank the site.
- Visitors may need to refresh once to see a new price if they already had the page open.
