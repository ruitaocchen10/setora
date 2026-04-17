@AGENTS.md

## Commands

```bash
npm run dev        # Dev server at localhost:3000 (--webpack, PWA service worker disabled)
npm run build      # Production build (--webpack, generates public/sw.js)
npm start          # Serve production build
npm run lint       # ESLint
```

## Gotchas

- **`--webpack` flag**: `next-pwa` 5.x is incompatible with Next.js 16 Turbopack. Both `dev` and `build` scripts use `--webpack` explicitly. Do not remove it.
- **PWA testing**: Service worker only activates in production. Test install behavior with `npm run build && npm start`, not `npm run dev`.
- **Generated files**: `public/sw.js` and `public/workbox-*.js` are build artifacts — gitignored, do not edit manually.
