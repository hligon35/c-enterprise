# C-Enterprise Services

A static landing page deployed on Vercel with a serverless contact endpoint powered by SendGrid and optional Google Sheets logging.

## Quick start (local preview)

You can open `index.html` directly in a browser. For a smoother experience (and to avoid path issues), use a tiny local server.

### Windows PowerShell

```powershell
# Option 1: Use Python if installed
python -m http.server 5173 -d .
# Then open: http://localhost:5173

# Option 2: Node.js (if installed)
# npm i -g serve
serve -l 5173 .
```

## Vercel deployment

This repo is set up for Vercel as:

- a static site rooted at `/index.html`
- a serverless function at `/api/contact`

### Deploy steps

1. Import the GitHub repository into Vercel.
2. Keep the project as an “Other” framework or no framework preset.
3. Leave build command empty.
4. Leave output directory empty.
5. Add the environment variables listed below.
6. Deploy.

### Required environment variables

- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_TO_EMAIL`
- `SENDGRID_LIST_ID`

### Recommended environment variables

- `SENDGRID_FROM_NAME`
- `SENDGRID_REPLY_TO_EMAIL`

### Optional environment variables

- `SENDGRID_CONTACT_SOURCE_FIELD_ID`
- `GOOGLE_SCRIPT_WEB_APP_URL`
- `GOOGLE_SCRIPT_WEBHOOK_SECRET`
- `COMPANY_NAME`
- `COMPANY_PHONE`

### Notes

- `SENDGRID_CONTACT_SOURCE_FIELD_ID` is only needed if you created a custom SendGrid Marketing field, such as `Lead Source`, and want to tag each contact as coming from the landing page.
- `GOOGLE_SCRIPT_WEB_APP_URL` and `GOOGLE_SCRIPT_WEBHOOK_SECRET` are only needed if you want a duplicate contact log written to Google Sheets.
- The landing form posts to `/api/contact`, which is handled by Vercel serverless functions.

## Assets

- `/assets/css/styles.css` – shared styles
- `/assets/js/main.js` – nav behavior and async contact form submission
- `/assets/favicon.svg` – lightweight logo favicon
- `/api/contact.js` – Vercel serverless contact handler
- `/google-apps-script/contact-log.gs` – optional Google Sheets logger

## Site notes

- Accessibility: skip link, landmarks, and keyboard-friendly nav are included. Colors meet contrast guidelines.
