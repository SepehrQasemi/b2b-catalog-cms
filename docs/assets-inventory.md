# Assets Inventory

## Direct crm-platform brand assets

| Asset | Source | Type | Status | Recommended use |
| --- | --- | --- | --- | --- |
| Catalog logo | `the local CRM reference project\web\public\catalog-logo.svg` | SVG logo | observed and reusable | reuse as website logo for Demo B2B Catalog, with `Catalog` as compact brand shorthand |
| Favicon | `the local CRM reference project\web\app\favicon.ico` | ICO | observed but inconsistent | do not reuse; replace with Catalog-branded favicon set |

## Token and style sources

| Source | What it provides | Use in website phase |
| --- | --- | --- |
| `the local CRM reference project\web\app\globals.css` | color palette, radius, shadow, surface treatment | primary design-token reference |
| `the local CRM reference project\web\components\brand-logo.tsx` | logo naming and usage pattern | reference only |
| `the local CRM reference project\web\components\app-shell.tsx` | brand application inside CRM | reference only; do not copy layout directly |
| `the local CRM reference project\web\components\public-landing.tsx` | dormant public-facing brand attempt | reference only; not production-proof |

## Non-brand or placeholder assets found in crm-platform

| Asset | Source | Notes | Reuse? |
| --- | --- | --- | --- |
| `file.svg` | `the local CRM reference project\web\public\file.svg` | generic starter asset | no |
| `globe.svg` | `the local CRM reference project\web\public\globe.svg` | generic starter asset | no |
| `next.svg` | `the local CRM reference project\web\public\next.svg` | default framework asset | no |
| `vercel.svg` | `the local CRM reference project\web\public\vercel.svg` | default framework asset | no |
| `window.svg` | `the local CRM reference project\web\public\window.svg` | generic starter asset | no |

## Brand primitives extracted

### Colors

- Primary red: `#e41414`
- Darker red: `#b51010`
- Warm background: `#fff5f5`
- Panel white: `#ffffff`
- Primary text: `#151515`
- Muted text: `#5f5963`
- Border tint: `#efcdcd`
- Danger: `#cc2350`
- Positive: `#2a8f60`
- Accent plum gradient: `#4d0f22 -> #2b0813`

### Shape and spacing

- base radius: `14px`
- small radius: `10px`
- large/auth/hero radii: `18px` to `20px`
- soft shadow: `0 14px 34px rgba(96, 18, 18, 0.1)`

### Typography evidence and decision

- CSS stack names `Manrope` and `Space Grotesk` were observed in crm-platform
- logo uses `Arial Black` inside the SVG artwork
- no formal font loading implementation was found in crm-platform
- final website MVP decision: use `Manrope` only

## Reuse policy for the new website

### Approved starting points

- Catalog logo asset
- red/blush/plum palette
- rounded-card and soft-shadow language
- restrained gradient usage
- `Manrope` as the cleaned-up MVP typography system

### Require redesign or replacement

- favicon
- iconography system
- starter public assets
- dashboard-specific layout patterns

## Notes

- No assets were copied from crm-platform into this repository during this phase
- This file inventories reference sources only
