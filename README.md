# RateGrid

A fast, static currency-rate site (base currency: **SGD**) built to be SEO-friendly, resilient, and almost zero-maintenance.

## How it works
- **Data:** mid-market rates from the [Frankfurter API](https://frankfurter.dev) (ECB data, no API key). The API is only called at **build time** — visitors read static files from a CDN, so the site stays up even if the data source is down.
- **Pages:** one page per currency pair (`pair-USD.html` → production `/sgd-to-usd/`), a `/rates` directory, editorial `/guides`, and a brand landing page.
- **SEO baked in:** unique titles + meta descriptions, one `<h1>` per page, canonical tags, JSON-LD (`Dataset` + `FAQPage`), `sitemap.xml`, `robots.txt`.

## Files
| File | Purpose |
|---|---|
| `index.html` | Premium landing page (brand-first) |
| `rates.html` | All-rates directory, filterable by region |
| `pair-*.html` | Per-pair page: live rate + converter + 5-year chart |
| `guide-*.html` | Editorial hub pages |
| `styles.css`, `app.js` | Shared styling + converter/chart logic |
| `sitemap.xml`, `robots.txt` | SEO essentials |

## Go live (minimum path)
1. **Deploy:** enable GitHub Pages (Settings → Pages → deploy from `main`) **or** connect the repo to Cloudflare Pages. The site is live instantly — it's pure static.
2. **Domain:** point a custom domain (optional, ~$10/yr).
3. **Replace the base URL:** swap `https://rategrid.example` in `sitemap.xml`, `robots.txt`, and the `<link rel=canonical>` tags for your real domain.
4. **Search Console:** verify the domain, submit `sitemap.xml`.
5. **Daily refresh (later):** a GitHub Actions cron re-fetches Frankfurter, regenerates pages, commits. (Scaffold to come.)

## Roadmap
- GitHub Actions daily cron + multi-provider fallback + history archive
- Pretty URLs (`/sgd-to-usd/`) via a static generator (Astro/Eleventy)
- More editorial guides + currency profile pages
- Embeddable FX widget (backlink engine)

*Demo build. Data as of 2026-06-19. Not financial advice.*
