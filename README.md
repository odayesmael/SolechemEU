# SoleChem Europe — B2B Chemical Distribution Platform

Corporate website for **SoleChem Europe S.r.l.**, a B2B chemical distributor and manufacturer headquartered in Milan, Italy. The platform serves as the primary digital presence for product discovery, industry solutions, and commercial inquiries across 50+ countries.

## Tech Stack

- **Framework:** Astro 5 (SSR) with React Islands
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel (auto-deploy from `main`)

  
## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Project Structure

```
src/
├── components/react/   # Interactive React islands
├── data/               # Product catalog, industries, categories, news
├── layouts/            # Base layout with SEO, structured data
├── pages/              # Astro file-based routing
│   ├── products/       # Product catalog + detail pages (4,500+ products)
│   ├── industries/     # Industry landing pages (20 sectors)
│   ├── news/           # News listing + article pages
│   └── ...
└── styles/             # Global CSS + Tailwind theme
public/                 # Static assets (images, favicon, robots.txt)
```

## Build

```bash
npm run build    # Production build (SSR + static assets)
npm run preview  # Preview production build locally
```

## Key Features

- Full product catalog with CAS search, category/industry filtering
- Individual product pages with safety data, physical properties, trade info
- Industry-specific landing pages with relevant product listings
- News & insights section
- Contact and quote request forms
- ISO 9001:2015 & ISO 22000:2018 certified operations

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (for chatbot assistant) |
