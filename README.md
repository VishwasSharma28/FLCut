
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

## Approach

### Understanding the Problem

The problem statement was that I had to develop an URL shortener that can have custom aliases, launch and expiry date/time and basic analytics tracking for the club's event registrations.

### Design Decisions and Tradeoffs

I used custom aliases and randomly generated short codes. Random codes are simple and reduce predictability(more secure), while aliases give flexibility when needed. No alias given = random short url, if alias is taken, one error message rather than random generation because the person wants a custom memorable name.

The dashboard is stored locally in their browser rather than fetching from database(security issues), since authentication isnt being used.

For analytics, I used browser cookies to identify repeat visitors. Fetches some stuff like short codes, original url, short url from local browser cookies(browser storage) and short codes, expiry and launch timings from db. This is not perfect because users can clear cookies or switch devices, but it is lightweight and does not require authentication. I intentionally avoided more invasive tracking methods. The registration capping was intentionally not added as visiting the link doesnt guarantee the registration.

### Prioritization

The order of implementation was:

1. Link creation
2. Redirect flow
3. Analytics storage
4. Launch and expiry scheduling
5. Unique visitor tracking
6. Traffic source detection
7. UI improvements and deployment

The goal was to make sure the core functionality worked before spending time on visual polish.

### Handling Difficult Parts

**Collisions**

Short codes are generated using NanoID. Database uniqueness constraints prevent duplicate codes, and custom aliases are validated before creation.

**Scheduling**

Launch and expiry times are checked during every redirect request. A link only redirects if the current server time is within the allowed window.

**Analytics**

Each redirect creates a click record containing visitor information, device type, referrer, and detected source when available. Unique visitors are tracked using browser cookies.

### What I Would Improve Next

- Authentication
- Better bot detection
- More accurate traffic attribution
- Geographic analytics
- QR code generation
- Team workspaces and link management

## Getting Started/SETUP

```bash
git clone https://github.com/VishwasSharma28/FLCut.git
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
