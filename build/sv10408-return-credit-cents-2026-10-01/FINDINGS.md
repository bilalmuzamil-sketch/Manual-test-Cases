# SV-10408 — Vendor return credits and restocking fees can lose a cent

**Ticket:** [SV-10408](https://shopview.atlassian.net/browse/SV-10408) · status TESTING QA · priority Medium · reporter Chris Ward · assignee parth fadadu · relates to SV-10406 · labels accounting, inventory
**QA branch:** https://sv10408.qa.shopview.com — build **`v26.39.2-998e506`**, last-modified Thu, 01 Oct 2026 04:27:42 GMT, etag `W/"736df3fb526413d198717221673cc027"`
**Production:** https://app.shopview.com — build **`v26.40.1-3a932cf`**, last-modified Thu, 01 Oct 2026 10:36:39 GMT
**Tested against:** the ticket's own Acceptance Criteria (there is no QA handoff on this ticket; the only comment is the developer's note 77292)
**Date:** 2026-10-01

---

## 1. Verdict

**PASS** — every monetary example in the ticket is saved and read back exactly, on **both** of the
code paths the ticket names.

Two things the reader should know, both covered below: the defect **does not reproduce on
production today**, so there is no before-picture to show; and the last acceptance criterion is
about automated tests, which cannot be checked from the running application.

---

## 2. What was checked

The ticket asks for the recorded monetary examples to be verified in the running application, so
each value was typed into the screen, saved, and then read back from a freshly opened page.

| # | Acceptance criterion | Path | Result |
|---|---|---|---|
| 1 | A credit of **$19.99** per unit reads $19.99 | Create Return → confirmed | **PASS** — reads `$19.99000` |
| 2 | A restocking fee of **$4.35** reads $4.35 | Create Return → confirmed | **PASS** — reads `4.35` |
| 3 | A credit of **$0.29** reads $0.29 | Create Return → confirmed | **PASS** — reads `$0.29000` |
| 4 | Whole-dollar amounts are saved exactly as today | Create Return → confirmed | **PASS** — `$20.00000` and fee `20` |
| 5 | A restocking fee of **$4.35** typed on the Confirm screen | work order return → confirmed | **PASS** — reads `4.35` |
| 6 | The credit per unit on a work order return | work order return → confirmed | **PASS** — `$182.51000`, another value the old arithmetic would have cut |
| 7 | The return total is exact | both | **PASS** — subtotal $40.28, total restocking fee $24.64, total credit $16.42 |
| 8 | Automated tests cover $19.99, $4.35 and $0.29 on both paths | — | **not checkable from the application** — see §5 |

### The two paths, and how each was driven

**AddReturnItem** — *Parts → Returns → Create Return*. Three parts on one return, one per amount
(the server rejects the same part twice on a return, so three different parts were used):

| Part | Typed credit | Typed fee | Stored credit | Stored fee |
|---|---|---|---|---|
| SLCSC-100 | 19.99 | 4.35 | **19.99000** | **4.35** |
| SLCSC-075 | 0.29 | 0.29 | **0.29000** | **0.29** |
| SLCSC-062 | 20.00 | 20.00 | **20.00000** | **20** |

**Confirm** — selecting the return and pressing *Receive Credit*, then *Post Credit*. The credit
memo `ZZAUTOTEST-CM-10408` reads back with all three amounts intact, subtotal **$40.28**, total
restocking fee **$24.64**, total **$16.42**.

A second, work-order-sourced return was confirmed as well (`ZZAUTOTEST-CM-10408-WO`), because on
that screen the restocking fee is **typed by the user** rather than inherited. Typed `4.35` against
a credit of `$182.51` per unit × 2: stored as `182.51000` and `4.35`, total credit **$378.70**.

Checked on three surfaces, not one: the Confirm screen before posting, the Credits tab, and the
credit detail page opened fresh afterwards. All agree.

---

## 3. There is no before-picture, and this is why

The reported behaviour **does not reproduce on production**. The same amounts were entered there —
two manual returns, `$19.99 / $4.35` and `$0.29 / $0.29` — and both stored exactly, as did the
confirmed credit (`19.99000`, fee `4.35`, total `$16.42`).

So the honest position is: **this pass proves the branch is correct; it does not show the fault
being fixed**, because the fault is not visible on the live build any more. Production is on
`v26.40.1-3a932cf` while the branch is cut from a `v26.39.2` base, and the ticket was written on
23 September, so the likeliest explanation is that the correction has already reached production
ahead of this branch. **That is an inference, not something I verified** — the developer or the PR
can confirm it in a line, and it is worth confirming, because if it is true the ticket is already
live and this branch is a re-verification.

No before was taken from staging: the standing rule is that a before comes from production or not
at all.

---

## 4. Observations, reported and not treated as faults

1. **A derived subtotal in the API response carries a floating-point tail** — `365.02000000000004`
   on the work-order return, `19.990000000000002` on one production read. It appears on **both**
   builds, it is a computed field in the response rather than a stored amount, and every figure the
   user sees is exact ($360.67, $40.28). Mentioned only because it is the same arithmetic family as
   this ticket; it changes no credit, fee or total.
2. **"Cancel Return" on a manual return needed a second attempt.** The first run through the menu
   and its *Yes* confirmation left the row in place with no request sent; it did take effect
   afterwards. Not investigated further — out of this ticket's scope, and recorded only so nobody
   is surprised by it.

---

## 5. What could not be checked

**Only acceptance criterion 8** — that automated tests cover $19.99, $4.35 and $0.29 on both paths.
That lives in the pull request, not in the running application, so it is a code-review item rather
than something QA can observe. Everything else in the ticket was run.

---

## 6. How it was tested

Viewport 2100 × 1050 (the returns table's row menu sits past 1700 px and is unreachable on a
narrower window). Signed in as Admin on both environments.

Everything under test was driven **on the screen**: the Create Return grid, the vendor and part
pickers, the quantity, price and restocking-fee cells, *Add part*, *Save*, the row selection,
*Receive Credit*, the Confirm screen's credit-memo and restocking-fee fields, and *Post Credit*.
The **read-backs** were taken both from the screen and from the API, so the stored value is proven
rather than inferred from a formatted display.

## 7. Test data

**Branch** (per-ticket QA branches need no cleanup, and this data is the reproduction):
return `ZZAUTOTEST-10408` → credit memo `ZZAUTOTEST-CM-10408` ($16.42), and the work-order return
`ZZAUTOTEST-10408-WO` → credit memo `ZZAUTOTEST-CM-10408-WO` ($378.70).

**Production** — the unconfirmed return `ZZAUTOTEST-10408-P2` was cancelled and is gone, confirmed
by re-reading the Returns tab. The confirmed credit **`ZZAUTOTEST-CM-10408-P1` ($16.42, vendor
"Delete Test")** remains on the Credits tab: a posted credit cannot be unposted, which is correct
behaviour. Flagged here so it is not mistaken for real accounting data.

## 8. Evidence

- `ev/01-entered-and-saved.png` — what was typed, and what it reads after confirming
- `ev/02-work-order-path.png` — the work-order path with the restocking fee typed on the Confirm screen
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw run output: `/tmp/qa10408/` (branch) and `/tmp/qa10408p/` (production), not committed

## 9. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
