# C-Enterprise Services - Lawn Care Website

A simple, responsive 3-page static website for an independent lawn care contractor.

Pages:
- `/index.html` – Home
- `/services.html` – Services
- `/contact.html` – Contact / quote request (mailto-based form)

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

## Customize

- Update contact info in the footer and contact page (`tel:` and `mailto:` links).
- Replace `/assets/images/hero-lawn.jpg` with a real photo and update OpenGraph meta in `index.html`.
- Adjust services and copy in each page as needed.
- Add Google Maps or a booking link on `contact.html` if desired.

## Assets

- `/assets/css/styles.css` – shared styles
- `/assets/js/main.js` – nav toggle, year, and mailto builder for form
- `/assets/favicon.svg` – lightweight logo favicon

## Notes

- The contact form uses `mailto:` so submissions open the visitor's email client. For a serverless form backend (no server), try services like Formspree or Basin and replace the form `action`.
- Accessibility: skip link, landmarks, and keyboard-friendly nav are included. Colors meet contrast guidelines.
