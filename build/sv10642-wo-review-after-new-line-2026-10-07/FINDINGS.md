# SV-10642 — Work order stays "Ready for Review" after a new line is added — QA findings (7 Oct 2026)

**Ticket:** [SV-10642](https://shopview.atlassian.net/browse/SV-10642) · Bug · Medium · TESTING QA · assignee parth fadadu · reporter Ryan Fyfe (PowerTools, Mike Freeman) · customer Kelly Priece, Crawford Fleet Services (Intercom 215476157207662).
**Source of expected behaviour:** ticket description (Expected: *"the overall Work Order status should automatically update to reflect that there is unresolved work remaining"*), Sasha's comment 77594 (asked for the exact state), Mike Freeman's answer 77597 (*"The work order status then moves to approved state."* — answering "what happens when the user approves the new line?").
**No developer QA handoff comment on the ticket.** PR ShopView/shopview#3367 (head `69702a7`, fix commit `da4d8ca`) used as an input only (Rule 66): completed lines + any line awaiting authorization → **Approved**; only awaiting-auth lines → Estimate; review OFF no longer auto-completes with a pending line; part-sale WOs follow the same branch.
**AFTER build:** `sv10642.qa.shopview.com`, app-version `v26.39.2-8b087eb` (last-modified Wed 30 Sep 2026 11:30:48 GMT) = PR merge commit `8b087eb`, which contains `da4d8ca`. (Later PR commits `4ce42c9`/`69702a7` are merges of `main` only.)
**BEFORE (Rule 86):** production `app.shopview.com`, build `v26.40.8-1e8e914`, prod test org, location Trucks Hill 2.

## SOURCE-CURRENCY
| Source | Identifier | Checked | Verdict |
|---|---|---|---|
| Ticket + comments | SV-10642, 5 comments (last 77597), 3 attachments (Intercom transcript + 2 screenshots, all read) | 7 Oct ~09:05Z | CURRENT |
| Changelog | last content change 30 Sep (TESTING QA, QA branch set); 5–6 Oct customer fields + rank only | 7 Oct | CURRENT |
| PR | #3367 head 69702a7, 3 files (refresher + 2 tests) | 7 Oct | CURRENT |
| Build | v26.39.2-8b087eb | start | CURRENT |

## Variant matrix (Rule 96) — every cell observed live on the branch, the action under test driven ON SCREEN
Set-up (seeding the Review work order: create, mileage, 2 canned lines approved, stories, complete) by API; the line add / approve / decline / delete / complete / Mark Reviewed all clicked on screen.

| # | Work order | What was done on screen | Status before → after | Result |
|---|---|---|---|---|
| A | S10642-17580 | Review WO, **New Line** dialog, canned line *Service - Battery service*, **Line Approved** left unticked, Save & Close | Review → **Approved**; line *Needs Approval*; **Mark Reviewed** button gone | PASS |
| A | same | **Approve** on the new line | Approved → Approved (line Approved, Complete button shows) — matches Mike 77597 | PASS |
| A | same | **Complete** the new line | Approved → **Review**, Mark Reviewed back | PASS |
| A | same | **Mark Reviewed** | Review → **Complete**, no error | PASS |
| B | S10642-17581 | add unapproved line, then **Decline** | Approved → **Review** | PASS |
| B | same | **Approve** the declined line again | Review → Approved | PASS |
| C | S10642-17582 | add unapproved line, then right-click line → **Delete line** → Delete | Approved → **Review** | PASS |
| D | S10642-17583 | add line with **Line Approved ticked** | Review → Approved, line Approved | PASS (unchanged behaviour) |
| E | S10642-17584 | **Require review OFF**: line 1 complete, line 2 approved, add unapproved line 3, then **Complete** line 2 | stays **Approved** (does NOT auto-complete with a pending line) | PASS |
| E | same | approve + complete line 3 | → **Complete** (auto-complete, review off) | PASS |
| F | S10642-17585 | brand-new WO with no lines, add unapproved line | Estimate → **Estimate** (unchanged) | PASS |
| G | S10642-17586 | add a **typed-in** line (no canned line; different save path `lines/create`) + a canned line, both unapproved | Review → Approved | PASS |
| G | same | decline one of the two | stays Approved (other still pending) | PASS |
| G | same | decline the second | → Review | PASS |
| K | S10642-17587 | Work Orders list after adding unapproved line | list row shows **Approved** with a red **1** bubble; work order **⋮** menu has no Complete option | PASS |
| L | S10642-17588 | **ShopCoach Line Builder** ("Battery service" → Add (1 Lines)) | Review → Approved, new line Needs Approval | PASS |

Setting `requireReview` switched OFF for row E then restored to ON (read back).

## Production BEFORE (bug reproduced live)
Work order **S2-960** (prod test org, Trucks Hill 2, customer *aa*, asset 1970 Hyundai Accent 824). `requireReview` was **false** on production; switched ON for the capture (original value recorded), two canned lines completed → **Review**; on screen, New Line → canned line **ER4**, Line Approved unticked, Save & Close → status **still Review**, line *Needs Approval*, **Mark Reviewed** still offered; clicking it → red toast **"Cannot complete work order with incomplete lines."** (`change-status` 400). Matches the customer's report exactly.
(An earlier run timed out after adding the line once, so a second identical line was added; the extra one was deleted before the final capture.)

## Part sales
The PR also routes part-sale work orders through the new rule. Part sales on screen have **no Lines tab** (only Parts / Statistics / Finance) — checked on P2-162 — so a part sale cannot hold a line waiting for approval through the product. Not reachable by a user; raised with the QA lead (Rule 94) rather than probed by API.

## Observations, bucketed (Rule 93)
- **(d) UNVERIFIED — work orders already stuck at Review before the fix ships.** The status is recalculated when a line changes, so a work order that is *already* at Review with a pending line (like the customer's S.-2029, or prod S2-960) will probably keep showing Review after deploy until one of its lines changes. Could not observe on the branch: of its 30 Review work orders, **0** have a pending line (checked all 30). Raised with the QA lead.
- **(d) Decision not ruled in writing:** the ticket never names the state for a work order whose completed lines sit alongside a line *waiting* for approval; Mike's 77597 covers the state *after* approval (Approved). The build shows **Approved** while the line still waits. Raised with the QA lead before posting.

## Environment changes
Branch: ZZAUTOTEST work orders S10642-17580…17590 left (per-ticket branch, no clean-up). Production: see clean-up section.

## Production clean-up (restore-after)
`requireReview` restored to **false** at ~10:00Z and read back: **0 fields differ** from the original settings object. Work order **S2-960** kept for now (status Review, one line Needs Approval) so the QA lead can see the stuck state; delete it after (`change-status` → estimate, then `work-orders/delete`). Session location was switched to Trucks Hill 2 (session-scoped).
Production evidence: `ev/raw/P3x2-still-review.png`, `ev/raw/P4x2-error.png` (toast *"Cannot complete work order with incomplete lines. Please try to resolve this."*, `change-status` 400), build `v26.40.8-1e8e914`.
