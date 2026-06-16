
# FLCut

Shorten Links. Track Performance.

FLCut is Finite Loop Club's internal link shortener(like bitly/tinyurl) built for NMAMIT's coding club. You can create short links, set custom names, set when they go live or expire, and see basic analytics like click counts, unique visitors, device breakdown, and where traffic is coming from.
## Tech Stack

- Next.js 16.2.9
- React 19.2.0
- TypeScript
- Prisma 5.22.0
- PostgreSQL (Neon)
- Tailwind CSS
- Vercel

## Getting Started

```bash
git clone https://github.com/your-org/FLCut.git
cd FLCut
npm install


Create a `.env` file in the root and add:

```
SET
DATABASE_URL="YOUR_LINK"

NEXT_PUBLIC_BASE_URL="YOUR_LINK"


Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Notes

Built as a part of recruitment project for Finite Loop Club, NMAMIT by Vishwas Sharma. Unique visitor tracking works through browser cookies, so it's not perfect but good enough for what we need (MVP). Analytics are pretty basic and meant for internal use, not anything production-grade.
