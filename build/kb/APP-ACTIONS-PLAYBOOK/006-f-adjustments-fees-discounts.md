## F. Adjustments / Fees & Discounts
- **Add a WO adjustment:** `POST /api/work-orders/adjustments/add {workOrderId, kind:'fee'|'discount'|
  'processing_fee', name, calculationType:'flat'|'pct_labor'|'pct_parts'|'pct_subtotal'|
  'pct_grand_total', amount, maxCap, scope:'whole_wo'|'labor_line'|'part_line', targetId, taxable,
  templateId, description}`. **Part-sales percent uses `pct_subtotal`** (`pct_total` → 400 "Invalid
  calculation type"). *Source: CLAUDE.md + F&D appendices.*
- **Remove:** `POST /api/work-orders/adjustments/remove {adjustmentId, workOrderId}` → 204.
- **Change:** `POST /api/work-orders/adjustments/change {adjustmentId, workOrderId, name, amount,
  maxCap, taxable}` (kind/calc immutable). **A `processing_fee` → HTTP 409 "cannot be edited through
  this endpoint" = REMOVE-ONLY (spec-correct);** manual add of a processing_fee → 400.
- **Base calc note:** processing-fee base = net subtotal (labour+parts+shop)×(1+tax) EXCLUDING
  whole-WO fees (§5-R4, VIU-confirmed 2026-07-23). Customer default fees auto-apply on WO create.
- **Templates:** `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`;
  `DELETE .../{id}`. Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
  (POST `{templateIds:[…]}`). Fuller F&D contract + Quasar dialog driving in the F&D appendices below.

