# Cosmic Discover

เว็บไซต์เนื้อหาอวกาศ: ภาพดาราศาสตร์ประจำวันจาก NASA (APOD) และข่าวอวกาศล่าสุด

A space-content website showing NASA's Astronomy Picture of the Day and the latest spaceflight news.

## Pages

| Path | What it shows |
| --- | --- |
| `/` | Hero, today's APOD and the 3 latest news articles |
| `/apod` | APOD with a date picker and previous/next day (`/apod?date=2024-12-02`) |
| `/news` | Spaceflight news, 12 per page (`/news?page=2`) |

## Tech

- Next.js 15 (App Router, Server Components) + TypeScript
- Plain CSS (`app/globals.css`), no UI library
- Data is fetched **on the server** and cached (`next.revalidate`), so the NASA key never reaches the browser
- No database, no login

## Project structure

```
app/                  routes (page.tsx per URL) + layout, error, loading, not-found
components/layout/    site header, nav, footer
components/features/  APOD media, news card, pagination
lib/                  API clients (nasa.ts, news.ts) and date helpers
public/               static files (logo)
```

## Run locally

```bash
npm install
cp .env.example .env.local   # then put your NASA key in .env.local
npm run dev                  # http://localhost:3000
```

Get a free NASA key at <https://api.nasa.gov>. Without one the site falls back to `DEMO_KEY`, which is rate-limited.

> `.env.local` is git-ignored. Never commit a real key.

## Deploy on Vercel

1. Import this repository at <https://vercel.com/new>
2. Under **Environment Variables**, add `NASA_API_KEY` = your key
3. Click **Deploy**

Every push to `main` redeploys automatically.

## Data sources

- [NASA APOD API](https://github.com/nasa/apod-api)
- [Spaceflight News API v4](https://api.spaceflightnewsapi.net/v4/docs/)
