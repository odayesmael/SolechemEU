# SoleChem EU - Improvement Plan

> **Goal:** Surpass the competitor (solechem.eu) in every technical area  
> **Current state:** solechem-eu.vercel.app (Astro 5.8 + React Islands + Vercel SSR)  
> **Date:** 2026-05-22

---

## Status Legend

- [ ] Not started
- [x] Completed

---

## Phase 0: Critical Performance Fix (DONE)

> **Problem:** `/products` page was sending all 4,504 products (~2MB) to the browser via `client:load`

- [x] Create server-side API endpoint `/api/products` with Fuse.js search, filtering, sorting, pagination
- [x] Rewrite `ProductsPage.tsx` as thin API client (initialProducts + fetch on filter change)
- [x] Reduce `products/index.astro` payload from ~2MB to ~5KB (only first 24 products + metadata)
- [x] Fix AnimatePresence ghost-item bug (old products lingering in DOM)
- [x] Add `letter` URL param support on page mount

**Result:** Page payload dropped from ~2MB to ~5KB. Server handles filtering/sorting.

---

## Phase 1: Security, Performance & SEO Foundations

**Priority:** HIGH  
**Estimated time:** 1 day

### 1.1 Security Headers (vercel.json)

- [ ] Add `X-Content-Type-Options: nosniff`
- [ ] Add `X-Frame-Options: DENY`
- [ ] Add `X-XSS-Protection: 1; mode=block`
- [ ] Add `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Add `Permissions-Policy` (camera, microphone, geolocation = deny)
- [ ] Add `Content-Security-Policy` (start with report-only)
- [ ] Add `Strict-Transport-Security` (HSTS)

```json
// vercel.json example
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

### 1.2 Self-Hosted Fonts

- [ ] Download Inter font files (woff2) from Google Fonts
- [ ] Place in `public/fonts/`
- [ ] Add `@font-face` declarations with `font-display: swap`
- [ ] Remove Google Fonts `<link>` from `BaseLayout.astro`
- [ ] Add `<link rel="preload">` for the primary font weight

**Why:** Eliminates render-blocking external request to fonts.googleapis.com. Faster LCP.

### 1.3 robots.txt Enhancement

- [ ] Add explicit `Allow` / `Disallow` rules
- [ ] Point to sitemap: `Sitemap: https://www.solechem.eu/sitemap-index.xml`
- [ ] Block API routes from crawling: `Disallow: /api/`

### 1.4 Hero Image Preload

- [ ] Add `<link rel="preload" as="image">` for above-the-fold hero image on homepage
- [ ] Ensure hero uses `fetchpriority="high"` and `loading="eager"`

### 1.5 Image Optimization Audit

- [ ] Ensure all images use WebP/AVIF format
- [ ] Add explicit `width` and `height` attributes to prevent layout shift (CLS)
- [ ] Use `loading="lazy"` for below-the-fold images
- [ ] Compress category images further if >50KB each

---

## Phase 2: Architecture Upgrade

**Priority:** HIGH  
**Estimated time:** 2-3 days

### 2.1 Hybrid SSG/SSR Mode

- [ ] Switch from `output: 'server'` to `output: 'hybrid'` in `astro.config.mjs`
- [ ] Mark static pages with `export const prerender = true`:
  - [ ] Homepage (`/`)
  - [ ] About page (`/about`)
  - [ ] Contact page (`/contact`)
  - [ ] Industry pages (`/industries/[slug]`)
  - [ ] Category pages (if any)
- [ ] Keep dynamic:
  - [ ] `/products` (server-rendered with API)
  - [ ] `/products/[slug]` (server-rendered, individual product lookup)
  - [ ] `/api/*` endpoints

**Why:** Static pages load instantly from CDN edge. Only dynamic pages hit the server.

### 2.2 Search Engine Upgrade (Typesense or Algolia)

> Competitor uses Typesense. This is a genuine advantage they have.

**Option A: Typesense (Self-hosted or Typesense Cloud)**
- [ ] Deploy Typesense server (or use Typesense Cloud free tier)
- [ ] Create `products` collection with schema (name, cas, formula, category, industry)
- [ ] Index all 4,504 products
- [ ] Replace Fuse.js in `/api/products` with Typesense search
- [ ] Add typo-tolerance, faceted filtering, instant results
- [ ] Add search analytics (popular queries, zero-result queries)

**Option B: Algolia (Managed, free tier up to 10K records)**
- [ ] Create Algolia account and index
- [ ] Use InstantSearch.js or React InstantSearch
- [ ] Configure facets for category, industry

**Recommendation:** Typesense — open source, free self-hosted, better fit for chemical names.

### 2.3 Caching Strategy

- [ ] Add `Cache-Control` headers to static assets: `public, max-age=31536000, immutable`
- [ ] Add `stale-while-revalidate` to API responses (already done for `/api/products`)
- [ ] Use Vercel Edge Config or KV for frequently accessed product data
- [ ] Add ETags for product detail pages

---

## Phase 3: Analytics, GDPR & Business Intelligence

**Priority:** MEDIUM  
**Estimated time:** 1-2 days

### 3.1 Google Tag Manager + GA4

- [ ] Create GTM container
- [ ] Add GTM snippet to `BaseLayout.astro`
- [ ] Configure GA4 via GTM
- [ ] Set up key events:
  - [ ] Product page views
  - [ ] Quote requests (form submissions)
  - [ ] Search queries
  - [ ] Category/industry filter usage
  - [ ] PDF/document downloads

### 3.2 GDPR Cookie Consent Banner

- [ ] Install a lightweight consent solution (e.g., `cookie-consent-banner` or custom)
- [ ] Block GTM/GA4 until user consents
- [ ] Add cookie policy page
- [ ] Store consent state in localStorage
- [ ] Respect `Do Not Track` header

### 3.3 Structured Data Enhancement

- [ ] Add `FAQPage` schema to relevant pages
- [ ] Add `WebSite` schema with `SearchAction` (sitelinks searchbox)
- [ ] Validate all schemas via Google Rich Results Test
- [ ] Add `ItemList` schema to product listing page

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SoleChem Europe",
  "url": "https://www.solechem.eu",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.solechem.eu/products?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## Phase 4: Multi-Language Support (i18n)

**Priority:** MEDIUM-LOW  
**Estimated time:** 3-5 days

### 4.1 Infrastructure

- [ ] Install `astro-i18n` or use Astro's built-in i18n routing
- [ ] Configure supported locales: `en` (default), `de`, `tr`, `ar`
- [ ] Set up URL structure: `/en/products`, `/de/products`, etc.
- [ ] Create translation JSON files per locale

### 4.2 Content Translation

- [ ] Translate UI strings (buttons, labels, navigation)
- [ ] Translate static page content (about, contact)
- [ ] Product names/descriptions — keep in English (chemical names are universal)
- [ ] Add `hreflang` tags for each locale

### 4.3 Language Switcher

- [ ] Add language dropdown to Navbar
- [ ] Preserve current page/filters when switching language
- [ ] Store language preference in cookie

---

## Phase 5: Advanced Features

**Priority:** LOW  
**Estimated time:** ongoing

### 5.1 Product Comparison Tool

- [ ] Allow users to select 2-4 products for side-by-side comparison
- [ ] Compare: CAS, EC, formula, MW, category, industries, specifications
- [ ] Shareable comparison URL

### 5.2 PDF Generation

- [ ] Generate product spec sheets as PDF (Technical Data Sheet)
- [ ] Include: product name, CAS, EC, formula, MW, description, safety info
- [ ] Add SoleChem branding/logo to PDFs

### 5.3 Advanced Filtering

- [ ] Add molecular weight range filter
- [ ] Add multi-category filter (OR logic)
- [ ] Add "recently viewed" products (localStorage)
- [ ] Add "favorites" / product wishlist

### 5.4 Blog / Knowledge Base

- [ ] Add blog section using Astro Content Collections
- [ ] Write SEO-targeted articles:
  - [ ] "What is [Chemical Name]? Uses, Safety & Specifications"
  - [ ] Industry guides: "Essential Chemicals for Pharmaceutical Manufacturing"
  - [ ] Comparison articles: "Citric Acid vs Acetic Acid: Key Differences"
- [ ] Add internal links from product pages to related blog posts

### 5.5 Performance Monitoring

- [ ] Add Web Vitals tracking (CLS, LCP, FID/INP)
- [ ] Set up Vercel Speed Insights
- [ ] Create performance budget:
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms
  - Total page weight < 500KB

---

## Competitor Comparison: Where They're Better (and our plan)

| Area | Competitor (solechem.eu) | Us (solechem-eu.vercel.app) | Plan |
|---|---|---|---|
| Search Engine | Typesense (typo-tolerant, fast) | Fuse.js (good but client-heavy) | Phase 2.2: Switch to Typesense |
| Architecture | SSG (fast static pages) | SSR (server-rendered) | Phase 2.1: Hybrid SSG/SSR |
| Analytics | GTM + GA4 | None | Phase 3.1: Add GTM + GA4 |
| Cookie Consent | Has GDPR banner | None | Phase 3.2: Add consent banner |
| Multi-language | Turkish + English | English only | Phase 4: Add i18n |
| Security Headers | Basic set | None | Phase 1.1: Add all headers |

## Where We're Already Better

| Area | Us | Competitor |
|---|---|---|
| Product Count | 4,504 products | ~3,500 products |
| Schema/SEO | Product + BreadcrumbList + Organization | Basic |
| Product Detail | Rich detail pages (specs, similar products, industries) | Simpler pages |
| UI/UX | Modern dark theme, animations, grid/list toggle, A-Z bar | Standard layout |
| Navigation | Mega menu (20 industries, 27 categories) | Simple dropdown |
| Quote System | Built-in quote modal | External form |

---

## Execution Order (Recommended)

```
Week 1: Phase 1 (Security + Fonts + robots.txt)
         → Immediate wins, minimal risk

Week 2: Phase 2.1 (Hybrid SSG)
         → Big performance improvement

Week 3: Phase 2.2 (Typesense)
         → Close the search gap with competitor

Week 4: Phase 3 (Analytics + GDPR)
         → Start collecting business data

Month 2: Phase 4 (i18n)
          → Expand market reach

Month 3+: Phase 5 (Advanced features)
           → Differentiate and grow
```

---

## Notes

- All changes should be tested locally before deploying
- Use Vercel Preview Deployments for each phase
- Monitor Core Web Vitals after each deployment
- Keep product data in Astro Content Collections (JSON files per product)
- The `/api/products` endpoint is already optimized with server-side pagination
