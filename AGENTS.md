# AGENTS.md

Single-page React storefront (Vite + React 19, plain JSX) for the "Aura" boutique. The backend does not exist yet: every page reads from the bundled mock catalog in `src/data/` and makes no network requests.

## Commands

- Install: `pnpm install` (`pnpm-lock.yaml` is the committed lockfile; `package.json` pins `packageManager: pnpm@10.32.1`).
- Dev: `pnpm dev` → http://localhost:3000 (port/host are hardcoded in `package.json`, not configurable via flags).
- Build: `pnpm build` → `dist/`.
- Verify: `pnpm lint` runs `tsc --noEmit` and is the *only* automated check. No ESLint, Prettier, test runner, or CI exists.
- `pnpm clean` uses `rm -rf` and fails in PowerShell; delete `dist/` manually on Windows.

## Environment

- `.env` is gitignored; copy `.env.example` (its keys are unused AI Studio leftovers).
- There is no API layer on purpose: `src/services/apiClient.js`, the `axios` dependency, and `VITE_API_BASE_URL` were removed because the backend has not been built. Do not add fetch/axios calls until it exists.
- `GEMINI_API_KEY`, `express`, `dotenv`, `tsx`, `esbuild`, and `@google/genai` are leftover AI Studio scaffolding; nothing in `src/` uses them, and the `server.js` referenced by `clean` does not exist.

## Architecture

- Entry: `index.html` → `src/main.jsx` → `src/App.jsx` (QueryClient → BrowserRouter → Toast → Wishlist → Cart providers) → `src/routes/AppRoutes.jsx`. Pages are lazy-loaded; register new pages in `AppRoutes.jsx` or they 404.
- Layering: `pages` → `hooks`/`queries` → `services` → `src/data/mock*`. Services stay `async` and return `{ ..., source: 'DEMO_STORE' }` so callers won't need changes when a real backend lands — preserve that shape and the service method signatures.
- Cart and wishlist persist through `src/utils/storage.js` (`STORAGE_KEYS`, versioned `aura_premium_*_v1`; bump the version when changing the stored shape). They store only product IDs + variant + quantity and re-resolve from `src/data/mockProducts.js`, so entries vanish if a product ID disappears from the mock catalog.
- All money math must go through `orderService.calculateTotals` (`src/services/orderService.js`: shipping thresholds, 13% VAT) so Cart and Checkout agree. Currency is NPR — use `formatCurrency` from `src/utils/currency.js`, never hand-format.
- Order placement is simulated inside `orderService.submitOrder` (600 ms fake latency, generated `ECOM-YYYY-#####` reference). `createOrder` resolves to the order object that Checkout renders in its confirmation modal.
- Query keys are centralized in `src/queries/queryKeys.js`; add new ones there.
- Two overlapping data layers exist: `src/hooks/useProducts.js` (used by Shop) and `src/queries/useProductQueries.js` (used by ProductDetails). Prefer `queries/` for new work. `useFeaturedProductsQuery` is dead code calling a non-existent `productService.getFeaturedProducts`.

## Styling

- There is no Tailwind pipeline despite the dependency: `vite.config.ts` registers only `@vitejs/plugin-react`. `flex`, `grid`, `items-center`, `uppercase-tracking`, etc. are hand-written utilities in `src/styles/global.css`; arbitrary Tailwind classes silently do nothing.
- `src/index.css` imports `styles/variables.css` (tokens), `global.css` (reset + utilities), and `components.css` (~1750 lines of component classes: `btn`, `product-card`, `choice-card`, `cart-page-layout`).
- Use `var(--token)` from `variables.css` instead of hex values. Beware the legacy aliases: `--accent-gold*` / `--accent-earth*` map to the near-black `--primary`, so they render black, not gold. Use `--accent` (electric blue) for interactive accents/icons and `--accent-subtle` / `--accent-border` for their tints.
- Reuse primitives in `src/components/common/` (`Button`, `Price`, `Rating`, `EmptyState`, `LoadingState`, `WishlistButton`) rather than restyling buttons per page.
- Wishlist hearts use the shared `src/components/common/WishlistButton.jsx` (ProductCard + ProductDetails): `.wishlist-btn` is muted slate by default, blue on hover, and solid red (`--error`) with a white icon when active. Adding an item remounts the icon via a key so `.heart-bounce` replays; keep that behavior in the component and restyle in `components.css`, not at the call sites.

## Gotchas

- The `@/*` alias points at the repo root, not `src/` (both `tsconfig.json` and `vite.config.ts`), i.e. `@/src/...`. Existing code uses relative imports — follow that.
- Relative imports include the extension (`./Foo.jsx`, `./x.js`); keep it.
- `pnpm install` reports an unmet `esbuild` peer (vite 8 wants `^0.27 || ^0.28`, devDependencies pins `0.25`). It is pre-existing — ignore it unless the build actually fails.
- All app code is `.js`/`.jsx` and `tsconfig.json` sets `checkJs: false`, so `tsc --noEmit` catches almost nothing in components. Passing `lint` does not mean the change works — run the dev server and exercise the page.
- Product images are literal `"/src/assets/images/*.jpg"` strings in `src/data/mockProducts.js`, which Vite serves in dev. Import assets instead if they must survive `vite build`.
- `src/hooks/useCart.js` and `useWishlist.js` are one-line re-exports of the context hooks; import either.
- Category taxonomy is duplicated in `MOCK_CATEGORIES` (`src/services/categoryService.js`) and `CATEGORIES` (`src/components/product/ProductFilters.jsx`) — update both when categories change.
- `ProductCard` renders no corner tag/badge at all — Bestseller, New Arrival, and Limited Stock tags were removed, and the `.product-tag` CSS with them. `isBestseller` / `isNewArrival` / `stockStatus` still drive sorting, the bestseller/new-arrival queries, and stock handling (ProductDetails still shows a low-stock notice); keep those fields, but do not re-add card badges.
- Callbacks returned from hooks must be stable if an effect depends on them. `useProducts` wraps `updateFilters` / `resetFilters` in `useCallback` and bails out of `setFilters` when the merged filters are shallow-equal; the previous inline versions re-triggered `Shop`'s URL-sync effect every render and caused `Maximum update depth exceeded`. Keep that pattern (and the `areFiltersEqual` guard) when extending the hook.
