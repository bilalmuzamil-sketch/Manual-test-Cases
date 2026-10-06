# SV-10804 — Vendor credit tax goes to Sales Tax Expense — QA findings (6 Oct 2026)

**Ticket:** [SV-10804](https://shopview.atlassian.net/browse/SV-10804) (ours, filed from SV-10406) · Bug · Medium · status Blocked at test time · assignee Nikola Mitrovic
**Handoff:** comment 77976 (Nikola, 6 Oct 07:53 −0500): core PR ShopView/shopview#3517 (head `3f0f9c0`), accounting PR ShopView/shopview-accounting#79 (head `11005d8`), "both PRs are deployed" on sv10360.
**AFTER build:** `sv10360.qa.shopview.com`, app-version `v26.40.8-1bc3b12` = merge of `origin/SV-10804-vendor-credit-tax` (parent `3f0f9c0`, the core PR head) into SV-10360-accounting-qa. Read at 13:4x and again at the gate 14:52:30Z — unchanged. Accounting-service build not readable from the client; deployment of #79 is evidenced by the behaviour (split lines + `vendor_credit_taxes` lines on the credit page).
**BEFORE (Rule 86):** production `app.shopview.com` (`v26.40.8-1e8e914`) has **no AccountingHub** — admin gets `403 Missing permission: bills.view`, onboarding `idle`. Fallback = staging pre-fix capture, 2 Oct 2026, build `v26.40.3-36ebbb0`, credit C-13808 / Journal Entry #15501 (`ev/raw/BEFORE-staging-je15501.png`), same flow, GST 5%. Disclosed in the comment.

## SOURCE-CURRENCY
| Source | Identifier | Checked | Verdict |
|---|---|---|---|
| Ticket + comments | SV-10804, 3 comments (last 77976) | 13:3x UTC, re-read at gate 14:52Z | CURRENT |
| Core PR | #3517 head 3f0f9c0, 3 commits | 13:4x | CURRENT |
| Accounting PR | #79 head 11005d8 | 13:4x | CURRENT |
| Build | v26.40.8-1bc3b12 | start + gate | CURRENT |
| Expected-behaviour sources | SV-9537 AC, SV-10370 S3-R10 (quoted in the ticket) | — | unchanged |

## Set-up (not the thing under test)
AccountingHub on sv10360 was provisioned (09:10Z) but never live. Settings → Onboarding sync → **Sync catalogs** (POST 200) → **Go live** dated 2026-10-06 → dialog *"Start accounting as of 10/06/2026?"* → **Start accounting** → `POST /api/accounting-onboarding/go-live` 202, activated 13:50:52Z. Status reported `completed` at 14:04:08Z but bill events kept draining until ~14:25Z; our receipts posted at ~14:24Z. (The Go live button now works — the SV-10406 §6 failure did not recur.)
Test work order **S2-17435** (b94d839f…), Staging Heavy Duty - 9919. Parts seeded by §AJ API (make-request + order); **receive, return, credit all driven on screen**; AccountingHub read by API and on screen.

## Variant matrix (Rule 96) — every cell observed live
| Run | Kind | Vendor / rate | ShopView credit | Receipt entry | Credit entry | Result |
|---|---|---|---|---|---|---|
| A | WO part, ticket example | 5 Star Truck Repair / GST 5% | C-13665 $171.00 + $8.55 = $179.55 | #13729 Dr COGS 171 · Dr 6110 8.55 · Cr AP 179.55 | #13732 Dr AP 179.55 · Cr 1300 171.00 · **Cr 6110 8.55** | PASS |
| B | other rate | Asbury Park Truck Repair / HST BC 12% | C-13666 $171 + $20.52 | #13730 6110 20.52 | #13733 Cr 1300 171.00 · **Cr 6110 20.52** | PASS |
| C | no tax | Antioch Diesel & Fleet Repair / 0% | C-13667 $171.00 | #13731 no tax line | #13734 one line Cr 1300 171.00 | PASS |
| D | restocking fee $10 | 5 Star / 5% | C-13668 $161 + $8.05 = $169.05 (tax recalculated on screen) | — | Cr 1300 161.00 · Cr 6110 8.05 | PASS |
| E | accepted 1 of 2 | 5 Star / 5% | C-13669 $85.50 + $4.28 = $89.78 | — | Cr 1300 85.50 · Cr 6110 4.28 | PASS |
| F | tax typed $5.00 | 5 Star / 5% | C-13670 $171 + $5.00 = $176.00 | — | Cr 1300 171.00 · Cr 6110 5.00 | PASS |
| G | manual return (Create Return), 2 × P550848 | 5 Star / 5% | C-13671 $107.04 + $5.35 = $112.39 | — | Cr 1300 107.04 · Cr 6110 5.35 | PASS |
| H | manual vendor credit (vendor page New Credit) $50 | 5 Star | C-13672 $50.00 | — | #13742 one line Cr 1300 50.00 | PASS (tax:null path) |
| J | tax with own account (HST BC Paid → new 1315) | Asbury Park / 12% | C-13673 $191.52 | #13743 Dr **1315** 20.52 | #13744 Cr 1300 171.00 · **Cr 1315 20.52** | PASS |

Also: credit detail pages list the same split lines (`GST — C-13665` 6110 $8.55); Sales Tax Detail (6 Oct) lists every taxed credit as a negative purchase row under its tax code (totals: taxable −$11.54, tax $2.97 = 54.72 − 51.75 ✓); clicking C-13665 / C-13671 opens `/accounting/purchases/credits/<id>` (PR commit 3f0f9c0), clicking ZZ10804RCV-A still opens the bill. C and H correctly absent from the tax report.

## Observations, bucketed (Rule 93)
- **(b) already tracked — SV-10370 (Open, "Route the complete inventory lifecycle"):** a work-order part's receipt goes to 5000 Parts COGS but its credit comes out of 1300 Parts Inventory; the restocking fee in run D just lowers the credit (no Restocking Fees line); the manual credit (H) posts to Parts Inventory whereas SV-10370 S3-R10 plans Parts COGS. All are the vendor-credit attribution rework in SV-10370, not this tax ticket. Not in the comment; raised with the QA lead in chat.
- **(c) my own harness artefact, not a defect:** the first on-screen Add Part attempt typed a new part number into the inline row and pressed Enter, which picks the first catalogue match, so a stray inventory request **FS19947** sits on line 1 of S2-17435. Left in place (per-ticket branch).
- Onboarding status says `completed` ~20 min before its events finish posting — explained by async processing; not raised.

## Environment changes
Branch only (no clean-up required): AccountingHub taken live; account **1315 ZZ10804 HST Receivable** created; HST BC Paid mapping changed for run J and **restored to 6110** (read back). ZZAUTOTEST parts/returns/credits left on S2-17435.

## Pre-post gate (Rule 72) — 14:52:30Z
Marker `v26.40.8-1bc3b12` unchanged · C-13665 re-read live ($179.55; 1300 $171.00, 6110 $8.55; JE #13732) · ticket Blocked/Medium, 3 comments, nothing new since 77976 · tone/fingerprint scan 0 hits · no technical section (Rule 84 — to be asked) · 12 named checks all run (Rule 91).
**Posted comment 77983.** Attachments 61851/61852/61853. Read back (v3 ADF): first node panel `success` "OVERALL QA STATUS: PASSED"; 3 media type `file` in order (1662×596, 1544×1043, 1191×593); table 13 rows (header + 12); ordered list 12 steps.

## Learning check (Rule 95)
New and recorded in the playbook §AJ addendum 2: inline Add Part + Enter picks a catalogue match; vendor tax rates come from `GET /api/parts-catalogue/options`; received part row menu is `button_part_context_menu_<partId>_line_<lineId>`; go-live/accounting endpoints + journal-entry shape; tax-mapping PUT; manual vendor credit route; curl cookie-jar polling of a QA branch. Lessons index: one row (the Enter trap).
