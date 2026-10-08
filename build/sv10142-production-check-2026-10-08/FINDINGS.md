# SV-10142 — production check after release (8 Oct 2026)

**Ticket:** [SV-10142](https://shopview.atlassian.net/browse/SV-10142) — status **Ready for Production** (read live 8 Oct ~15:50Z; last comment 78152 Chris Ward, 7 Oct 10:49 −0500, signed off on QA).
**QA lead's ask:** *"Now this has been moved to production, we need to test this on Production."* Answers: recording **Yes**, technical section **No**, portal **Yes, check it**.
**Environment:** production `app.shopview.com`, build **v26.40.13-013e543** (last-modified Thu 08 Oct 2026 10:26:43 GMT, etag `W/"29f3cfda4a7c07f6cfc8c94a380f30ca"`), read at start, before the recording and immediately before posting — unchanged. Org = production test org, location **Trucks Hill 2**.
**BEFORE (Rule 86):** production build v26.40.9-27b6bca, 7 Oct 2026, estimate S2-962 (captured in `../sv10142-adjustments-named-rows-2026-10-07/`).
**Posted:** comment **78321** (8 Oct 10:57:40 −0500), verdict **PASSED**; 5 pictures + 1 recording as real attachments.

## Expected behaviour (sources, newest wins)
Chris Ward 77792 (named rows, combine same group + same name, fees and discounts separate, hide $0.00), 77997 (Labor → Parts → work-order-wide; same name different calculation combines), **78126** (inside Labor and Parts: fees before discounts, each A to Z; entry order does not matter). Work-order-wide rows keep entry order and do not combine (Stefan 77809, accepted by Chris 77997). PR #3424 QA step: Legacy layout unchanged.

## Test data (production, tagged ZZAUTOTEST)
| Record | What it carries |
|---|---|
| **S2-965** (wo `5f862733…`, invoice `502a6690…`) | Same 8 adjustments, same entry order as the BEFORE S2-962: Fleet discount $10 (whole WO), Core discount $5 (part), Shop fee $15 ×3 (three labor lines), Environmental fee $3 ×2 (two parts), Diagnostic fee $25 (labor) |
| **S2-966** (wo `e8818160…`, invoice `ef6ff9c6…`) | Labor: Zulu discount 2, zeta fee 7, Shop fee flat 5, Promo discount 4, Alpha fee 4 / Promo fee 10, bravo discount 3, Shop fee 2% of labor (=2). Parts: Tiny fee 0.01% on A35 $0.72 (=0), core discount 2, Waste discount 1. Whole WO: Loyalty discount 5, Admin fee 8, Loyalty discount 2 (in that order) |
| **P2-79** part sale (ps `17db9c70…`, invoice `8fb790ab…`) | Tire fee 2, Core discount 5, Environmental fee 3 ×2, Fleet discount 10 |
Parts: inventory A146 (1237932), A256 (1238042), A35 (1237821). Vendor parts were swapped for inventory parts because vendor parts block completion.

## Results — every cell observed live
| # | Document | Adjustments block (verbatim) | Result |
|---|---|---|---|
| 1 | S2-965 estimate PDF + invoice PDF + Finance tab (new layout) | Labor · Diagnostic fee $25.00 / Labor · Shop fee $45.00 / Parts · Environmental fee $6.00 / Parts · Core discount ($5.00) / Fleet discount ($10.00) | PASS — Chris's 78126 example line for line |
| 2 | S2-966 estimate PDF + invoice PDF + Finance tab | Labor · Alpha fee $4.00 / Promo $10.00 / Shop fee $7.00 / zeta fee $7.00 / bravo discount ($3.00) / Promo ($4.00) / Zulu discount ($2.00) / Parts · core discount ($2.00) / Waste discount ($1.00) / Loyalty discount ($5.00) / Admin fee $8.00 / Loyalty discount ($2.00) | PASS — A to Z case-insensitive, fees before discounts, flat+% combine ($5+$2=$7), Promo fee/discount separate, $0.00 Tiny fee hidden, WO-wide entry order |
| 3 | P2-79 part sale invoice PDF (new layout) | Parts · Environmental fee $6.00 / Parts · Tire fee $2.00 / Parts · Core discount ($5.00) / Fleet discount ($10.00) | PASS |
| 4 | Customer portal invoices S2-965, S2-966, P2-79 | identical to rows 1–3 | PASS |
| 5 | Legacy layout: S2-965 estimate + invoice, P2-79 invoice, Finance tab | Fleet discount ($10.00) / Shop fee (×3) $45.00 / Diagnostic fee $25.00 / Core discount ($5.00) / Environmental fee (×2) $6.00 — **identical text** to production S2-962 Legacy on 7 Oct | PASS (unchanged) |
| 6 | Arithmetic | S2-965 net 61 (76 − 15); S2-966 fees 36, discounts 19, net 17 — match `adjustmentsSummary` | PASS |

**Customer portal has no estimate page** — sidebar: Invoices, Deposits, Service Requests (empty), Contacts, Settings, Payments; the work order offers only Send email / Print / Download for the invoice. So the estimate check is the PDF from the work order (stated in the comment).

## Recording
`ev/sv10142-production-recording.mp4` — 4:32, 1280×800, H.264, decodes clean; frame grid reviewed (captions present, pointer beside the Adjustments block, no sign-in screen). Every caption value was read off the screen at the time (`data/rec-log.json`). Design switched to the new layout for filming and back to **legacy** inside the same run (read back `legacy`).

## Pre-post gate (Rule 72)
Build marker re-read before posting: unchanged. Ticket re-read: Ready for Production, last comment 78152 (Chris). Text scan: no AI fingerprint. No technical section (QA lead: No). Read back from Jira: first line = verdict panel, 6 media all `type:file` in the sent order (widths 512/512/512/420/360 + video), table 1 header + 12 rows.

## Production state after the test
- `documentDesign` = **legacy** (as before) — restored and read back.
- **Left in place on the QA lead's ruling (8 Oct, answer: "Keep them") so the comment's steps keep working:** invoices S2-965, S2-966, P2-79 and their work orders / part sale. The posted "how to see it" steps point at S2-965 / S2-966. Stock used: A146 8 → 5, A256 5 → 2, A35 40 → 39 (`data/stock-before.json`).

## Learning check
- The browser bridge must run as its own long-lived background task (`node build/testing-tools/staging-bridge.mjs` with run_in_background); started with `nohup … &` inside a normal shell call it died when the call's shell was reset. Recorded in the playbook.
- When the recording page is on `portal.shopview.com`, the app's in-page API helper fails (`Failed to fetch`) — go back to the app origin before calling it.
- Captions persist in sessionStorage per origin: clear the caption before each navigation or the previous step's caption shows on the next page.
- Production's Legacy switch: initials → Settings → left menu Settings → Invoice tab → "Legacy invoice layout" → Save Details.
