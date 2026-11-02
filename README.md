# Pamsho Media Kit

Static public media kit for Pamsho, deployed as a Vercel static site.

## Project structure

```text
.
├── assets/              # Public images, logos, and thumbnails
├── index.html           # Page markup
├── style.css            # Core site styles
├── motion.css           # Scroll and motion styles
├── audience.css         # Audience section styles
├── app.js               # Page interactions and language switching
├── motion.js            # Scroll-based animation logic
├── audience.js          # Audience dashboard rendering
├── data/audience.json   # Canonical weekly metrics and demographics snapshot
├── data.js              # Loads the JSON snapshot into the page
├── content.js           # Public editorial content
├── video-library.js     # Public video library data
└── vercel.json          # Vercel static-hosting configuration
```

## Development checks

Install dependencies once:

```bash
npm install
```

Run the available checks:

```bash
npm run lint
npm run format:check
```

Apply automatic fixes and formatting:

```bash
npm run lint:fix
npm run format
```

The site has no build step. Open `index.html` in a local static server for preview, then deploy the public files to Vercel.

## Weekly audience update

Update only `data/audience.json` when verified metrics change. It is the canonical source for headline figures, reporting dates, methodology dates, demographics, and coverage status. Do not add values that could not be verified; retain the previous verified value and its real date instead.
