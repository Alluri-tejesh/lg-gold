# Where to change photos and content

Everything below is placeholder or inconsistent today. Items are ordered by how much they affect a buyer's trust.

## Photos

| What | Where | Why change it |
| --- | --- | --- |
| HMT bag artwork | `src/data/products.ts` (HMT block, `images`), add the file to `src/assets/images/` | Only the JSR bag artwork exists. HMT still shows a stock rice photo. |
| JSR gallery (3 more images) | `src/data/products.ts` (JSR `images.gallery`, `rawGrain`, `cookedDish`) | These are stock photos. Use your own: close-up of the grain, a cooked plate, the bag in hand. |
| Mill photo | `src/assets/images/mill_processing_plant_*.jpg` (used on Home, Quality, About) | Good. Add 2 or 3 more: stitching and packing, loading a truck, a container being sealed. |
| Home "heritage" photo | `src/views/HomeView.tsx` (Unsplash farm image) | Stock farm photo. Use a real photo of your paddy fields or your team. The About page reuses the mill photo, so a team photo would help there too. |
| Recipe photos | `src/data/recipes.ts` (`image` on each recipe) | All stock food photos. Replace with dishes cooked with LG Gold rice. |
| Logo | Currently plain text "LG GOLD" in `src/components/layout/Header.tsx` and `Footer.tsx` | Use the real round LG logo from your bag. |

## Content that disagrees with itself

| Issue | Where | Suggested fix |
| --- | --- | --- |
| JSR is named "Jeera Sanna Rice" on the site, "JSR Lachkari Kolam Rice" on your bag | `src/data/products.ts`, `src/views/HomeView.tsx` | Use the name printed on the bag everywhere. |
| Pack sizes: the site says 26kg, but several places say 25kg, 50kg, 5kg or 10kg | `src/data/trustPoints.ts` (FAQs), `src/views/ExportView.tsx`, `src/views/ContactView.tsx`, `src/config/brandConfig.ts` | List only the sizes you really sell. |
| Price: the bag prints MRP Rs 2000 for 26kg, the site shows MRP 2050 (JSR) and 1850 (HMT) | `src/data/products.ts` (`packOptions`) | Make the site match the printed MRP. |
| Opening hours differ between pages | `src/config/brandConfig.ts` (`operatingHours`), `src/views/ContactView.tsx` (Operating Hours box) | Pick one set of hours and use it in both places. |
| The bag prints customer care +91-9866230062 | Packaging artwork | The site uses one number, +91 97015 35231. Update the next print run, or the two will confuse buyers. |
| Nutrition: the bag prints 376 kcal per 100g, the site shows 352 kcal (JSR) and 356 kcal (HMT) | `src/data/products.ts` (`nutritionalInfo`) | Use the lab-tested figures from the bag. |

## Claims to verify before launch

| Claim | Where |
| --- | --- |
| "LG GOLD is a registered brand" (needs a trademark registration number or removal) | `src/components/layout/Footer.tsx` |
| "Japanese Sortex", "30,000 frames per second", "Milltec units 12, 14, 15" | `src/views/QualityView.tsx`, `src/data/trustPoints.ts` |
| Ratings 4.9 with 148 and 119 reviews | `src/data/products.ts` (`rating`, `reviewCount`) |
| Customer reviews (names, cities, "6 containers monthly") | `src/data/trustPoints.ts` (`REVIEWS`) |
| Email addresses at lggoldrice.com (care@, wholesale@, exports@) | `src/config/brandConfig.ts` |
| Certificates mentioned: phytosanitary, COA, lab reports | `src/views/ExportView.tsx`, `src/views/QualityView.tsx` |

Reviews and ratings should be real. If you do not have them yet, remove them rather than show invented ones.
