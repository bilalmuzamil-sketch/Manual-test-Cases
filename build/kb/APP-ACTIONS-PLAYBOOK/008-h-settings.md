## H. Settings
- **Read:** `GET /api/organizations/settings`. **Write:** `POST /api/organizations/settings/change`
  (send the FULL settings object). Simple Flow behavior is settings-driven (no feature flag).
- **Feature flags:** route `/administration/feature-flags`; org flags
  `GET /api/organization/feature-flags?organization_id={org}`.
- **PRICING MATRIX (parts sell-price rules) — route + API (proven live 2026-07-29):** UI =
  Settings → PARTS → **Pricing** = route `/administration/pricing` (permission `settingsParts`);
  tabs "Pricing Matrices(N)" + "Fixed Rules(N)"; click a matrix row → "Edit Price Matrix" dialog
  (Name, Category multi-select, rule rows Min Cost / Max Cost / Markup % / Margin %). API: list
  `GET /api/pricing-rules/list?limit=200&page=1` → `{data:{collection:[{id,name,categories:[catIds],
  rules:[{rule_id,type:'markup_for_interval',min_cost,max_cost,markup,margin}],is_default}]}}`;
  create `POST /api/pricing-rules/matrix`; edit `POST /api/pricing-rules/change-matrix`; delete
  `POST /api/pricing-rules/remove-matrix`. Fixed sell prices: `GET /api/parts/list-fixed-price`.
  Map category ids via `GET /api/inventory/categories`. **Known state 2026-07-29:** staging org
  d55bc308 has "Default matrix 07/12/2023" covering **Uncategorized** (cat id `b25c5c04-…`, 21 rules,
  e.g. $24.01–55 → markup 150%); prod test org 72b2cc90 has "Default matrix" covering Uncategorized
  (cat id `00e200b1-…`, 1 rule $1–2500 → markup 800%).

