# HEPRA Realty

Premium editorial real-estate discovery website built with Next.js 14 App Router.

## Features
- Responsive property discovery with keyword, city, type, budget, bedroom and area filters.
- Sort by price or area, save homes in browser storage, and compare up to three listings.
- Property detail pages and WhatsApp enquiry flow.
- Admin login using an HTTP-only signed session cookie.
- Customer registration/login with salted password hashes, account-specific saved homes, and cross-device wishlist sync.
- Admin listing management, document verification checklist, exact verified map pins, and enquiry follow-up dashboard.\n- WhatsApp follow-up links and lead analytics (new, contacted, closed, recent leads, close rate and top enquiry subjects).\n- Saved-search email alerts for city, property type and budget matches, with unsubscribe links.\n- Property-specific SEO metadata, canonical URLs, social-sharing previews and a sitemap that includes verified listings only.
- MongoDB-backed properties and enquiries API; sample listings are shown when the database is not configured or has no records.
- SEO metadata, sitemap and robots rules.

## Run locally
```bash
npm install
npm run dev
```

## Environment variables
Configure these in Vercel Project Settings → Environment Variables before using admin or persistent data:

- `MONGODB_URI` — MongoDB Atlas connection string.
- `MONGODB_DB` — optional database name; defaults to `hepra_realty`.
- `ADMIN_EMAIL` — admin login email.
- `ADMIN_PASSWORD` — strong unique admin password.
- `AUTH_SECRET` — cryptographically random secret of at least 32 characters.
- `NEXT_PUBLIC_SITE_URL` — canonical public URL used for metadata and alert links; defaults to `https://hepra.in`.\n- `RESEND_API_KEY` — optional Resend API key used to deliver new-listing email alerts.\n- `RESEND_FROM_EMAIL` — optional verified sender address configured in Resend; both Resend variables are required for delivery.

Generate a secret locally, for example with `openssl rand -base64 48`. Never commit secrets into GitHub. After setting variables, redeploy on Vercel.

## Data behavior
The MongoDB collections are `properties`, `enquiries`, `users`, and `savedSearches` for email-alert subscriptions. If MongoDB is not configured, the public site falls back to illustrative sample listings, while create/update/delete operations in the admin dashboard return a configuration error. Do not present sample listings as verified inventory. A listing can be marked verified only after all four admin checklist items (ownership/title, approvals, encumbrance certificate, property tax receipt) are checked. This is an internal administrative attestation, not a government certification. Exact map pins require that verified status plus a non-empty address and valid latitude/longitude. Replace or verify every listing and contact detail before launch. Unverified property detail pages are marked noindex and omitted from the sitemap.

The admin dashboard is at `/admin`; admin sign-in is at `/login`; customer sign-in/registration is at `/account`. Admin credentials are server-side environment variables. Customer passwords are stored as salted scrypt hashes and saved homes are synced to the user record. Use a strong password and secret, restrict admin access, and configure monitoring/rate limiting before high-traffic production use.

## Production build and deployment
```bash
npm run build
npm start
```

Import this repository at https://vercel.com/new. Use the Next.js preset and root directory `./`, then add the environment variables above. For email alerts, verify the sender domain/address in Resend before enabling `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Vercel deployment must be verified in the Vercel dashboard after the GitHub push.

## Important
This project provides a lightweight admin authentication implementation; before handling sensitive customer data at scale, add rate limiting, audit logging, backups, and a formal access-control review. Property entries in `lib/properties.js` are illustrative examples, not verified offers.
