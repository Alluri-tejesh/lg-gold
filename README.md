# LG Gold Rice

Marketing site for LG Gold by Sri Lakshmi Ganapathi Trading Company: premium HMT & JSR rice for retail, wholesale, bulk and export.

Built with React 19, Vite 6 and Tailwind CSS 4. Navigation uses URL hashes, so it runs on static hosting.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # type-check
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which type-checks, builds and publishes `dist/` to GitHub Pages.
In the repository, set **Settings → Pages → Source** to **GitHub Actions** (one-time).
