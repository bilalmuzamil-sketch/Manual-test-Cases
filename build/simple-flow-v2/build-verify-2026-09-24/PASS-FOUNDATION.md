# Simple Flow V2 — build-verification pass foundation (2026-09-24)

## Environment (a change from the handoff)
- **The QA branch sv8683 no longer exists — the feature shipped.** Per the QA lead (2026-09-24) this
  pass is run on **PRODUCTION**, in the **disposable Dummy Production test account** the QA lead
  authorised full CRUD on (Standing Rule 6 treats a prod test org as disposable: act freely, tag
  `ZZAUTOTEST`, restore).
- **Account:** `bilal.muzamil@shopview.com` (dummy prod test account). Login `POST /api/login` → PHPSESSID
  (playbook §K; PHPSESSID-only, no SSO on prod). Session cookie in `/tmp/prod/` (chmod 600, NEVER committed).
- **Prod test org workplace:** **Trucks Hill 2** `b617914c-16e9-4485-8e8b-193cd86aa416` (has canned lines;
  org `72b2cc90-6964-4429-a207-76e55f946936`). Scoped via `POST /api/iam/change-location` (HTTP 200).
- **Build marker at pass start:** `v26.39.0-07c719b` (app.shopview.com, 2026-09-24). Re-capture at pass
  end and prove byte-identical (nothing redeployed mid-pass).
- **NEVER** touch a real production org/work order — only Trucks Hill 2, tagged `ZZAUTOTEST`, restored.

## Scope confirmed LIVE from TestRail (matches the handoff exactly)
- **64 ours** (`created_by=3`), across sections 6666–6677. Suite 1, run **R416**.
- **7 Automated (atmstatus=3), HANDS-OFF (Rule 71):** C44557, C44561, C44575, C44583, C44587, C44604, C44605 — read-assess, HOLD for the QA lead.
- **15 foreign (`created_by=1`), HANDS-OFF (Rule 38):** C45202, C45203, C53490–C53493, C53515, C53572–C53574, C53593, C53596, C53597, C55676, C55681. Report ours 64 / live total 79.
- Bodies pulled to `/tmp/sfv2/bodies.json` (Rule 88 — scripted, not bulk-read into context).

## Source currency (Rule 80/81 — do NOT re-run)
- Source-verified **2026-09-24**, spec content unchanged since the 8 Sep revision (handoff §1). Re-read the
  sources immediately before any write (Rule 59).
- Two carried cases PO-confirmed correct 2026-09-24: **C44567** (Decline stays disabled while a line holds
  received/picked parts) and **C44604** (reorder Undo removed; Automated/hands-off). Verify against the case as written.

## The 12 subfolders (drive in this order, batch by subfolder)
| Section | Name | Cases | Notes |
|---|---|---|---|
| 6666 | Work Order Settings | C44549–C44559 (11) | C44557 AUTO. Settings-page + sweep behaviour. |
| 6667 | Completing a Line | C44561–C44565 (5) | C44561 AUTO. |
| 6668 | Line and Part Actions | C44566–C44570 (5) | C44567 = decline-block (PO-confirmed). |
| 6669 | Bulk Action Bar | C44571–C44582, C53486 (13) | C44575 AUTO. Exact counts (Rule 116). |
| 6670 | Receiving | C44583–C44588, C53487 (7) | C44583, C44587 AUTO. Receive modal, vendor/invoice. |
| 6671 | Purchase Order Pages | C44589–C44591, C53488 (4) | Money hidden w/o See Financial Data. |
| 6672 | Receive Later | C44592–C44593, C53489 (3) | New "Received later" perm + setting. |
| 6673 | Completion Wizard | C44594–C44598 (5) | Wizard steps/order/end-point. |
| 6674 | Finish Action | C44599–C44601 (3) | Create invoice + payment. |
| 6675 | Part Rows and Menus | C44602–C44603 (2) | Menu contents/negatives. |
| 6676 | Reordering Parts | C44604–C44605 (2) | BOTH AUTO — hands-off. |
| 6677 | Permissions | C44606–C44609 (4) | "Received later" atom + gating. |

## Seed states needed (handoff §7 — seed in Trucks Hill 2, tag ZZAUTOTEST)
- Each of the 8 org Require settings on AND off; Require ordering parts Manual vs Automatic; the
  "Received later" permission on a role and on a role without it.
- A WO with lines in each status: Needs Approval, Approved, Declined, Complete.
- Parts spanning each state: In Stock, Picked, Auth To Order, Ordered, Awaiting, Received, Returned;
  a line holding received/picked parts (C44567); a part with a core charge; a vendorless part / Vendor-missing PO; a multi-vendor receive.
- Exact numbers (Rule 116): bulk-bar counts, wizard "n parts", "N open", receive totals — computed by hand, UI must equal.

## Marker rules for the write phase (handoff §3) — AFTER the QA-lead write go-ahead (Rule 6)
- Observed PASS → `AUTOMATION: READY` + provenance re-stamped `v26.39.0-07c719b` + 9/24/2026.
- Fails as spec/open defect predicts → `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` + symptom + three outcomes (Rule 61).
- Feature not on build → `AUTOMATION: Not available on Build to test Yet - Last checked 9/24/2026` (Rule 69).
- Cannot run by hand → `AUTOMATION: HOLD - <plain reason>`. Arithmetic gate: READY + EXPECT-FAIL = total − HOLD.
- Expected text itself is the source's verbatim quote and is NEVER changed (Rule 114/57); a build diff is a DEVIATION.

## Status
Access + scope + bodies + seed map established. Next: find the settings/WO route from the project's own
records or a UI walk (Rule 27/97), seed the base states, then drive subfolder 6666 onward. TestRail write
go-ahead (R416 verdicts + 64 marker corrections) still to be confirmed by the QA lead before the write phase.
