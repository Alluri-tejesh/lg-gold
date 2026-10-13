# The admin page: prices, stock, pack sizes and products

Open your website and add `#admin` to the address, for example `https://lggoldrice.com/#admin`.
It works on a phone too. Nothing on the admin page is visible to customers, and search engines are told to skip it.

This page saves product changes to GitHub. Configure the full-stack Node host to redeploy on a repository update for changes to go live. GitHub Actions validation alone does not deploy the server. Customer/order administration is at `#admin-orders` and updates MongoDB directly; see `customer-platform.md` for admin-account setup.

## One-time setup (about 5 minutes)

The admin page saves into the website's GitHub repository, so it needs a private **access key** from GitHub.
The key works like a password that can only change this one website.

1. Sign in to GitHub and open **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
   (direct link: https://github.com/settings/personal-access-tokens/new).
2. Name: `LG Gold admin`. Expiration: 1 year (GitHub will email you before it expires).
3. **Repository access:** choose *Only select repositories* and pick the website repository.
4. **Permissions → Repository permissions:**
   - **Contents:** *Read and write* (needed)
   - **Actions:** *Read-only* (optional: lets the admin page show "Live on the website" when the update has finished)
5. Press **Generate token** and copy it. GitHub shows it only once.
6. Open `#admin` on your website, enter the repository (for example `yourname/lg-gold`) and paste the key.
   Tick **Keep me signed in on this device** on your own phone or computer only.

Tip: put the repository name in `src/config/brandConfig.ts` under `admin.repo`, so the sign-in screen fills it in for you.

**Keep the key private.** Anyone who has it can change the website. If it is ever shared by mistake, delete it on the same
GitHub page and make a new one.

## Everyday jobs

| I want to… | On the admin page |
| --- | --- |
| Change today's price | Type the new price in the pack's **Price** box. Publish. |
| Show a discount | Put the higher printed price in **MRP**. The site shows it crossed out with "% off". |
| Mark a pack out of stock | Switch its **In stock** toggle off. Publish. |
| Stop selling a whole product for now | Switch **Selling** off at the top of the product. Publish. |
| Add a 5kg, 10kg or 50kg bag | In **Add a pack size**, tap the size, type the price, press **Add pack**. Publish. |
| Add any other size | Tap **Other size…**, type it (for example `25kg Bag` or `1kg Pouch`), then the price. |
| Remove a pack you added | Press the bin icon on its row. Publish. (The built-in 26kg packs of HMT and JSR can only be marked out of stock.) |
| Change a name, description or photo | Open **Name, description and photo** on the product. Photos are shrunk automatically. |
| Add a new product | **Add a product** tab: name, photo, first pack size and price. Then Publish. |
| Remove a product you added | **Remove product** at the bottom of its card. Publish. |

Nothing changes on the website until you press **Publish changes**. **Discard** throws away unpublished edits.

The page checks your work before publishing: an empty price, a price under ₹10, an MRP lower than the price or a missing photo
are marked in red and must be fixed first. A price that changes by more than 25% is highlighted so you can double-check it.

Publishing sets the price date shown on the website ("today's mill rate, 13 Oct 2026") to today.

## If something goes wrong

- **"The access key is not valid or has expired"**: make a new key (setup steps 1 to 5) and sign in again.
- **"Prices or products were changed somewhere else"**: someone used the GitHub forms or another device at the same time.
  Press **Reload**, then make your change again.
- **"The website could not be rebuilt"**: your change is saved, but the site update failed. Open **Details on GitHub** and
  send the page to your developer.

The GitHub forms described in `updating-prices.md` and `products-and-photos.md` still work and save into the same files,
so you can use whichever is easier.
