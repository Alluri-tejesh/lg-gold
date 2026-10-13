# Adding products and changing product pictures

You do this from GitHub with a short form. It saves the product and its picture, then redeploys the site.
Nothing needs to be edited in code. Prices and stock are covered in `docs/updating-prices.md`.

## Step 1: get the picture online

Pick whichever is easiest. JPG, PNG or WebP, under 8 MB. For a bag or pack photo use a clean, straight-on picture.

**A. Upload it to the repository (best, it stays with the site)**
1. On github.com open the repository, then the `public` folder, then the `products` folder.
2. Click **Add file**, then **Upload files**. Drag the picture in and click **Commit changes**.
3. Remember the file name, for example `basmati-bag.jpg`.

**B. Use a link**
Any public link that opens the picture itself works, for example an image link from your own website. The form downloads it and keeps a copy.
A quick trick: on github.com, open any issue or pull request, drag the picture into the comment box, and copy the link GitHub gives you. You do not need to post the comment.

## Step 2: run the form

1. Repository, **Actions** tab, **Add or update product** (left list), **Run workflow**. Keep the branch on `main`.
2. Fill in the fields:

| Field | What to enter |
| --- | --- |
| What to do | `add or update product`, `remove pack size`, or `remove product` (for one you added) |
| Product id | Lowercase with dashes, for example `basmati-rice`. This becomes the product's web address. |
| Full name | `LG Gold Basmati Rice` (needed for a new product) |
| Short name | `Basmati`. Used on the filter buttons. |
| One line under the name | `Long grain aged basmati` |
| A few sentences | A short description shown on the card and product page |
| Picture | The file name from step 1 (`basmati-bag.jpg`) or a link |
| Picture fit | `contain` shows the whole picture (use it for bags). `cover` fills the frame (use it for food photos). |
| Pack size | Pick from the list: `5kg Bag`, `10kg Bag`, `26kg Bag`, `50kg Bag`. For any other size pick `other (type below)`. Leave it on `none` when you are not changing a pack. |
| Other pack size | Only when you picked `other`, for example `25kg Bag` or `1kg Pouch` |
| Price and MRP | In rupees. MRP is the crossed-out price and is optional. |
| Stock | `in stock`, `out of stock` or `no change` |

3. Click the green **Run workflow** button. After about 2 minutes the product is live.

A **new product** needs: id, full name, picture, and a price for one pack.

## Common jobs

- **Add a 5kg, 10kg or 50kg bag (also to HMT and JSR):** product id (for example `hmt-rice`), pick the pack size from the list, type its price. Nothing else is needed. The earlier packs stay, and the new one appears in size order with the 26kg bag still selected first.
- **Change the price of a pack you added:** the same as adding it, with the new price.
- **Stop selling a pack you added:** What to do = `remove pack size`, the product id and the pack size. (The built-in 26kg packs of HMT and JSR cannot be removed; mark them out of stock instead.)
- **Change a product's price:** run the form with the same product id, the same pack size and the new price. (The 26kg prices of HMT and JSR are changed with the "Update prices and stock" form instead.)
- **Replace a product's picture:** run the form with just the product id and the new picture. Works for `hmt-rice` and `jsr-rice` too.
- **Mark a product out of stock:** product id and Stock set to `out of stock`.
- **Remove a product you added:** What to do = `remove product` and the product id. HMT and JSR are built in and cannot be removed.

## What to know

- New products show a card with the picture, name, description, pack sizes and prices, and an order button that sends the order on WhatsApp. They do not have grain specs, cooking guide or nutrition sections, so nothing looks empty.
- Star ratings are hidden until a product has real reviews.
- If the form rejects something (a missing name, a price below ₹100, a picture that is not an image) the run turns red and says what to fix. Nothing is published in that case.
- Each upload gets a new file name, so visitors never see an old cached picture.
- The home page, the Products page, search and the cart all pick up new products automatically.
