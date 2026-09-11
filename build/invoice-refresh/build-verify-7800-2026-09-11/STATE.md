# Build-verify — Invoice Design Selection (folder 7800) on sv9872 — IN PROGRESS

- Branch sv9872.qa.shopview.com, build **v26.36.2-12974d6**, 2026-09-11.
- 57 cases; **12 WITHDRAWN** (excluded): C53546,53548,53552,53554-53562. **45 active**, all ours (created_by=3, atm=1).
- Anchor observed LIVE and matches the cases' quoted wording exactly (helper text, options Modern/Legacy,
  "Switch to the <X> design?" dialog + body + Cancel/"Switch To <X>" buttons, "Invoice design updated." toast).
  Observed labels: `build/OBSERVED-UI-LABELS-sv9872.md`.

## DONE (setting-picker cluster — 14 cases, runnable-gate clean, render fr-view)
C53518, C53519, C53520, C53521, C53522, C53523, C53524, C53525, C53526, C53528, C53529, C53530, C53532, C53533.
Fix pattern: concrete route (Settings → Invoice tab → "Invoice Design" pick list), dropped the now-false
"provisional / feature not yet built" caveats, used observed button casing. Expected fields untouched (Rule 57).

## LEFT (document-rendering cluster — ~31 cases)
C53527,53531,53534-53545,53547,53549,53550,53551,53553,53563-53571,53590,53591,53592, plus 53542,53543.
These render invoices/estimates/credit-invoices/parts-sales across surfaces (preview, print/PDF, email, portal).
Need concrete document routes observed on the build, then the same fix pattern. Design left on MODERN for these.
