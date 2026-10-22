# HEPRA Realty

Luxury editorial real-estate discovery website built with Next.js 14 App Router.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm start
```

## Project structure
- `app/page.js` — homepage, search, filters, sorting and property collection
- `app/property/[id]/page.js` — property details
- `app/globals.css` — responsive luxury design system
- `components/Enquiry.js` — WhatsApp enquiry flow
- `components/Art.js` — property photography
- `lib/properties.js` — sample listings
- `lib/site.js` — brand and contact configuration

## Deploy on Vercel
Import this repository at https://vercel.com/new and keep the root directory at `./`. Framework preset: Next.js. Build command: `npm run build`; install command: `npm install`. No environment variables are required for the sample version.

## Before launch
The property entries are sample/illustrative data and must be replaced or verified before publication. Confirm property title, approvals, prices, availability and contact details. Images load from Unsplash. The enquiry flow opens WhatsApp and does not store leads in a database.
