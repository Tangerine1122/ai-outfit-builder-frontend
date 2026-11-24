# DEE'S WARDROBE (frontend)

React frontend for the AI Outfit Builder. Users manage a closet of their own clothing photos and get AI outfit suggestions. The API is the separate `ai-outfit-builder` repo (FastAPI). Production URL: https://dees-wardrobe.vercel.app

## Stack
- React 19 + Vite, plain JavaScript (`.jsx`, no TypeScript)
- React Router v7 (`BrowserRouter` in `src/App.jsx`)
- Plain CSS, no Tailwind. Theme in `src/wardrobe-theme.css`
- Oxlint for linting

## Commands
- `npm run dev` - http://localhost:5173 (the backend's CORS allows this origin)
- `npm run build`, `npm run preview`
- `npm run lint` - Oxlint

There is no test setup yet.

## Layout
- `src/App.jsx` - router, nav tabs, animated header
- `src/ClosetPage.jsx` (`/`) - list, upload, delete clothes
- `src/StylistPage.jsx` (`/stylist`) - prompt → recommended outfit
- `src/MixMatchPage.jsx` (`/mix-match`) - combine items manually
- Pages call the API with `fetch` and `import.meta.env.VITE_API_URL`

## API (backend routes)
`GET /clothes`, `POST /clothes/upload` (multipart), `DELETE /clothes/{id}`, `POST /stylist/recommend` with `{ prompt }`.

## Environment
`VITE_API_URL` is set in `.env` (local) and `.env.production` (deployed). Both files are committed; that's fine because they only hold the public API URL. Never put secrets in `VITE_*` variables: they are bundled into the browser code.

## Design system
Y2K chrome theme. Use the CSS variables in `src/wardrobe-theme.css`; don't hardcode colors.
- Colors: `--ww-pink` #ec0868 (page background), `--ww-purple`, `--ww-purple-light`, `--ww-gold`, `--ww-gold-light`, `--ww-gold-dark`, `--ww-charcoal`, `--ww-black`, `--ww-text-muted`, `--ww-cream`, `--ww-glass`, `--ww-glass-border`
- Fonts: `--font-display` Righteous, `--font-body` Nunito Sans
- Look: pinstripe title bar with traffic-light dots, glass cards with gold borders, uppercase nav tabs
- UI specs from the ui-designer agent go in `docs/specs/`.
