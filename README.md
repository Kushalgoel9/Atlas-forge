# Atlas Forge

A live WebGL showcase for the Copilot UI (Atlas) Figma kit, in the Classical look: ivory paper, one amber accent, Cormorant Garamond headlines, hairline icons.

Every page is a **Forge variant**. Press `F` (or click the Forge button) to open the panel and change the layout, springs, copy, colour and scene of the page you are on. Nothing needs code. **Copy remix link** puts your changes in the URL so anyone who opens it sees the same remix; **Reset** clears them; **Export** saves the values as JSON.

## Under the hood

- React 19, TypeScript (strict), Tailwind CSS 4, Motion, TanStack Start
- three.js through React Three Fiber for the paper shader, star chart and map lines
- Prerendered to static HTML at build time (`dist/client`), so it hosts anywhere, including GitHub Pages
- Components documented prop by prop on `/docs`, generated from `src/atlas/registry.tsx` and each page's Forge schema

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in dist/client
npm run typecheck
```

`npm run build:pages` builds with the `/atlas-forge/` base path for GitHub Pages. The workflow in `.github/workflows/pages.yml` deploys on every push to `main`.

## Layout

| Path | What it holds |
| --- | --- |
| `src/forge/core.tsx` | Variant schema, store, URL-hash remix encoding |
| `src/forge/Panel.tsx` | The panel, generated from the active schema |
| `src/atlas/components.tsx` | Atlas components in the Classical style |
| `src/atlas/registry.tsx` | Prop docs and live demos for each component |
| `src/webgl/Scene.tsx` | The one WebGL canvas behind the site |
| `src/site/shell.tsx` | Nav, theme sync, section primitives |
| `src/routes/*.tsx` | One Forge variant per page |
| `src/styles.css` | Tailwind theme mapped to the Atlas variables |

## Adding a control

Add a key to the page's `defineVariant(...)` schema. It appears in the panel, in the docs table and in remix links with no other change.
