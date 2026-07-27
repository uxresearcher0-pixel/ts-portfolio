# Taslima Akter Rumky Portfolio CMS

Responsive Next.js portfolio with a password-protected admin editor and MongoDB persistence.

## Local setup

1. Copy `.env.example` to `.env.local` and replace every placeholder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `/` for the portfolio and `/admin` for the CMS.

If MongoDB is not configured, the public site safely renders the editable default content. Saving through the CMS requires MongoDB.

## Vercel variables

- `MONGODB_URI`
- `MONGODB_DB`
- `ADMIN_PASSWORD`
- `AUTH_SECRET` (at least 32 random characters)

The résumé and Figma portfolio are stored as URLs in the CMS, so no binary upload service is required.
