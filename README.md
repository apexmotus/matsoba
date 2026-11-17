# Matšoba Floral & Gifting

Website for **Matšoba Floral & Gifting**, a florist with three branches in Limpopo: Lebowakgomo, Burgersfort and Ga‑Nchabeleng.

Live site: https://matsobafloral.co.za

The site is plain HTML, CSS and JavaScript. There is no framework, no build step and no `package.json`. Customers order and request quotes through WhatsApp, so the site has no backend either.

## Running locally

Serve the folder from its root, because asset paths start with `/`:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

Opening `index.html` directly with `file://` won't load images or styles.

## Project structure

```
index.html            Home page: hero, Our Story + branch cards, gallery, FAQ, quote form
catalog/index.html    Catalog page: priced bouquets with "Order via WhatsApp" buttons
assets/
  css/style.css       All styles (colour tokens are CSS variables at the top)
  js/main.js          Mobile nav, scroll reveal, carousel, WhatsApp quote form & order buttons
  img/brand/          Logo, icons, social share image and hero image (see "Brand files")
  img/gallery/        Gallery carousel images (gallery-01 … gallery-20)
  img/catalog/        Catalog product photos
robots.txt            Lets all crawlers in, including AI search bots
sitemap.xml           Page list for search engines, including images
llms.txt              Plain-text summary of the business for AI assistants
site.webmanifest, favicon.ico   Browser and phone home-screen icons
vercel.json           Hosting config (clean URLs, long cache on /assets)
```

## Common edits

### WhatsApp number
The number appears in two places, and both need changing:
- `WHATSAPP_NUMBER` at the top of `assets/js/main.js`. Use international format with no `+`, e.g. `27713291054`.
- The `https://wa.me/27713291054` links in `index.html` and `catalog/index.html`, which are in the header, the footer and the floating button.

### Branch locations
The "Our Story" section in `index.html` has one `<a class="location-card">` per branch. Each card links to Google Maps and shows the address in its `<span>`.

When a branch's details change, also update its entry in the JSON‑LD block in the `<head>` of `index.html` (`address`, `geo`, `hasMap`). Google reads that block for local search results.

Current map links:

| Branch | Map link |
|---|---|
| Lebowakgomo | Google Business listing: `https://maps.google.com/?cid=12033186792989066412` |
| Burgersfort | Pin at -24.66725, 30.320583 |
| Ga‑Nchabeleng | Pin at -24.420583, 29.794 |

If you get a link from the Google Maps app, make sure it isn't a **directions** link. A directions link has your current location built in as the starting point. Use **Share** on the place itself instead.

### Catalog items
Each product in `catalog/index.html` is a `.catalog-card`. When you change a price, update both the visible `.price` text and the button's `data-wa-price`, because the WhatsApp message uses `data-wa-price`.

To offer a new bouquet in the quote form on the home page, add an `<option>` to `#q-bouquet` in `index.html`.

### Images
- Save images as real **WebP** files, about **1100px** on the longest side. Most existing images are 100–200 KB. Renaming a PNG or JPG to `.webp` does not convert it.
- Convert with: `cwebp -q 80 -resize 1100 0 input.jpg -o assets/img/gallery/gallery-21.webp`
- Gallery images are listed directly in `index.html`. Copy an existing slide to add a new one, and keep `alt`, `width` and `height` filled in.
- `manifest.json` in each image folder records file names and alt text. The site doesn't read it.

### Brand files
All in `assets/img/brand/`. They were made from the original logo artwork (a white-background JPEG) by removing the background.

| File | Used for |
|---|---|
| `matsoba-logo.png` | Header and footer logo (transparent background) |
| `logo-square.png` | The logo Google shows for the business (set in the JSON‑LD) |
| `og-image.jpg` | 1200×630 preview image when the site is shared on WhatsApp, Facebook, X etc. |
| `favicon-32.png`, `/favicon.ico` | Browser tab icon (rose head only, so it stays readable at small sizes) |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Phone home-screen icons |

## SEO and AI search

When you change facts about the business, update every place that states them, so that search engines and AI assistants see the same answer everywhere:

1. **Visible page text.** Search engines trust what's on the page most.
2. **JSON‑LD in `index.html`.** The `<script type="application/ld+json">` block describes the business, the three branches and the FAQ. The FAQ answers must match the visible FAQ section word for word.
3. **JSON‑LD in `catalog/index.html`.** Product names, prices and images. These must match the catalog cards.
4. **`llms.txt`.** A short summary that AI assistants such as ChatGPT, Claude and Perplexity read.
5. **`sitemap.xml`.** Update `<lastmod>` when a page changes, and add new images.

After changing JSON‑LD, check it with Google's [Rich Results Test](https://search.google.com/test/rich-results).

Things that help ranking but have to be done outside the code:
- Verify the site in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit `https://matsobafloral.co.za/sitemap.xml`. Bing also feeds ChatGPT search and Copilot.
- Create Google Business Profiles for Burgersfort and Ga‑Nchabeleng. Only Lebowakgomo has one so far.
- Add opening hours and street addresses once they're known, both on the page and in the JSON‑LD (`openingHoursSpecification`, `streetAddress`).

## Deployment

The site is hosted on Vercel. The source is on GitHub at [apexmotus/matsoba](https://github.com/apexmotus/matsoba), and `main` is the production branch. `vercel.json` turns on clean URLs (`/catalog` instead of `/catalog/index.html`) and caches everything under `/assets` for a year.

Because of that long cache, **give a changed image a new file name** instead of overwriting the old one. Otherwise returning visitors may keep seeing the old image.

Screenshots are excluded from git (`.gitignore`). The original photos in `catalog/*.jpg` are kept in git but left out of deployments (`.vercelignore`).
