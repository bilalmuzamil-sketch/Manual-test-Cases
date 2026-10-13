## D. WO Lines
- **`POST /api/work-orders/lines/create` SUCCEEDS with a canned line** — body `{canned_line_id,
  work_order_id, status:'authorized'}` (get a `canned_line_id` from the canned-lines list). It only
  returns **HTTP 500 when called WITHOUT a canned line / labor** (bare or empty body). So: to add a WO
  line via API, ALWAYS supply a `canned_line_id`; for a line that needs labor / has no canned line, use
  the **UI New Line dialog** (WO detail → Lines tab → New Line → pick a canned line → Save & Close) as
  the fallback. *(confirmed live 2026-07-27, SV-8721 side project; supersedes the earlier "always 500s
  → use UI" note. On qb, lines/create still 500s on ALL payloads incl. `create-from-canned-line`.)*
  **UPDATE 2026-07-29 (staging):** `lines/create` with a canned_line_id now returns **400 "Labor or
  fixed prices must be set"** on staging too (same as prod) — use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201** on staging as well (proven live 2026-07-29). Note: a line created from a canned line can
  AUTO-CREATE a part request (with the canned line's part category) — remove it via
  `part/remove-request/{id}` if the test needs a clean line.
- **Change line status:** `POST /api/work-orders/lines/change-status {line_id, status:'authorized',
  workOrderId}` → 200 (enum `authorization_required|authorization_declined|authorized|complete`).
  Bulk: `POST /api/work-orders/lines/change-lines` → 201. Delete: `POST
  /api/work-orders/lines/delete-lines` → 200 (deletable in any status except Complete).

