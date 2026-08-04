# RULING 1 — SV-8821 "not reproducible": the 15 blocked cases, re-driven live · 2026-08-04

**The QA lead's ruling.** SV-8821 is closed as not reproducible. Our own re-test established the real
condition: `POST /api/invoices/create` fails **only when the work order has no contact person**, and in
that state the product's own Finance tab is **disabled** with the message *"Please select a contact for
the asset"* — so a user can never reach the failure. **Therefore the 15 cases recorded
BLOCKED-BY-DEFECT were never actually blocked.** They needed a contact set during seeding.

This document re-drives all 15 **live** and gives each one a definite verdict. "Blocked" is gone.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBR spec | Confluence 585629698 (mirror `spec-watch-verification-2026-08-03/live-capture-2026-08-03/`) | v15, 2026-07-29 | 2026-08-04 | **CURRENT** |
| SBC spec | Confluence 577634305 | v13, 2026-07-31 | 2026-08-04 | **CURRENT** |
| **Live build** | `sv8582.qa.shopview.com` | **`v3.4.1-0ed4433`**, `index.html` last-modified **Mon, 03 Aug 2026 13:40:38 GMT**, etag `02091e9dc11f187d7739b4efa166ea21` | **captured at start AND end of this pass — identical** | **PARTIAL — DECLARED NOT FINAL (Rule 49)** |
| Epic | SV-8582 | not re-read this pass | — | **PARTIAL** — a Tier-2 re-read is a Rule-37 ask |

Every verdict below is **PROVISIONAL** per Standing Rule 49 and is queued in
`../viu-2026-08-03/RECHECK-QUEUE.md`, which stays **OPEN**.

---

## THE TRUE LIST IS 15 — confirmed against both source documents

Re-derived from `../defect-pack-2026-08-04/RECLASSIFIED.md` (the 9) and
`../defect-pack-2026-08-04/CASE-IMPACT.md` §SV-8821 (the 9 + 5 + 1). All 15 are **ours**
(`created_by == 3`).

**An important distinction the two documents do not make equally clear, and it changes the arithmetic:**
only the **9** were carrying the `BLOCKED-BY-DEFECT` status in the ledger. The **5** invoiced-hours cases
were already `DEVIATION` and **SBR-WO-05** was already `VIU-Observed-PASS` — `CASE-IMPACT.md` counts them
as "blocked" in the sense that *a leg of each could not be exercised*, which is not the same thing.
So the ledger's `BLOCKED-BY-DEFECT` bucket is **9**, not 15.

| # | Case | C-id | Ledger status BEFORE | Which document listed it |
|---|---|---|---|---|
| 1 | SBR-API-06 | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | BLOCKED-BY-DEFECT | both |
| 2 | SBR-DEACT-02 | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) | BLOCKED-BY-DEFECT | both |
| 3 | SBR-DEACT-03 | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) | BLOCKED-BY-DEFECT | both |
| 4 | SBR-DEACT-04 | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | BLOCKED-BY-DEFECT | both |
| 5 | SBR-DEACT-05 | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | BLOCKED-BY-DEFECT | both |
| 6 | SBR-DEACT-06 | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) | BLOCKED-BY-DEFECT | both |
| 7 | SBR-DEACT-07 | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) | BLOCKED-BY-DEFECT | both |
| 8 | SBR-DEACT-08 | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) | BLOCKED-BY-DEFECT | both |
| 9 | SBR-DEACT-09 | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) | BLOCKED-BY-DEFECT | both |
| 10 | SBC-CALC-03 | [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | DEVIATION | CASE-IMPACT only |
| 11 | SBR-CALC-01 | [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) | DEVIATION | CASE-IMPACT only |
| 12 | SBR-CALC-02 | [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) | DEVIATION | CASE-IMPACT only |
| 13 | SBR-CALC-03 | [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) | DEVIATION | CASE-IMPACT only |
| 14 | SBR-CALC-09 | [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) | DEVIATION | CASE-IMPACT only |
| 15 | SBR-WO-05 | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | VIU-Observed-PASS (partial) | CASE-IMPACT only |

---

## THE SEED — every piece of test data named (Standing Rule 50)

An unnamed variable is an unverified variable. This is the exact data; anyone can reproduce it.

**Staff created** (`POST /api/iam/create`, all at **Staging Heavy Duty - 9919**
`b3c8c820-f815-4cf1-8938-10956c5ee71a`, role **Sales Representative**
`b176ec30-2def-49af-ab11-782c2f6bd503`, department **Administration**
`70d5d069-83cf-4c94-9b13-41b967c4afe9`):

| Name | staff_id | user id | Purpose |
|---|---|---|---|
| **ZZAUTOTEST RepA** | `cdeb377b-dd7b-45a4-bcf7-c5bb318dc6c1` | `5885315a-1539-494c-8326-067c55422632` | sales-rep toggle ON, **exactly 1** customer |
| **ZZAUTOTEST RepB** | `51d94833-e76e-444d-9939-2e5a65506bcc` | `663687ab-8b6b-436c-9eca-b523d6784818` | sales-rep toggle ON, **exactly 3** customers |
| **ZZAUTOTEST RepZ** | `1683a17e-fe54-4534-b888-747799bd8ead` | `149d49f6-28b6-4db2-8406-36c80ef09092` | toggle OFF (S13-N2), then ON with **zero** customers (S13-R2) |
| **ZZAUTOTEST StaffX** | — | `1ac75203-d477-4dd9-a82c-c8a1e51b7f8d` | spare active staff member |

**Customer assignments** (`POST /api/customers/change`, the UI's own payload shape):
RepA → **"Aaborough Works"** `7af75d7c-c9f8-4209-860a-e685e9bd7c1c`.
RepB → **"Aacastle Services"** `31938e53-e7a5-4013-8480-bceae4e9b18c`, **"Aachester Partners"**
`ebe26bb2-48ab-44bd-b517-f15567887f21`, **"Aacrest Works"** `5376e5dd-20c9-4783-bd9f-dabf7a722f5b`.

**Canned lines** (`total_parts` **must** be 0):
- **"HD CVIP air brake trailer single/tandem"** `ce1f2549-24a9-485c-a849-267f8918d66e` — Fixed labour,
  `fixed_price` 35000, `tech_time` 210 min.
- **"Service - Perform winterization inspection"** `da0a0c9f-57ee-45f6-901c-aeea01e21665` — hourly,
  `labour_rate` 14995, `tech_time` 90 min. **This one is required to make `hours_invoiced` non-zero** —
  a Fixed-labour line invoices a price, not hours.

**Ruled out and why:** a canned line with `total_parts > 0` cannot reach Complete — its
`lines/change-status {status:'complete'}` answers **400 ``"Line can`t be completed with unfulfilled
part requests."``** and `invoices/create` then correctly answers **400 `"Work order is not complete."`**.
**That 400 is correct behaviour, not a defect.** `mileage` must be the **string** `"123456"`; a number
returns 500.

**Invoiced work orders seeded** (all reached `invoices/create` → **201**, which is the whole point):

| Invoice | Work order | Customer | WO rep | Purpose |
|---|---|---|---|---|
| S-16241 | `ebd3c93f-…` | Aacrest Works | RepB | fixed-labour baseline |
| S-16242 | `998f636b-…` | Aachester Partners | RepB | hourly line |
| S-16243 | `a9f38c28-…` | Aacastle Services | RepB | hourly line |
| S-16244 | `ed29aa49-…` | Aaborough Works | RepA | rep-change immutability test |
| S-16245 | `9e7b5269-…` | Aacastle Services | **none** | customer-rep fallback (C30314 leg b) |
| S-16247 | `109ffc31-…` | **Aadale Motors** (no `sales_rep_id`) | **none** | true unassigned (C30314 leg c) |

---

## THE HEADLINE: THE FEATURE IS BUILT, AND IT WAS HIDING IN PLAIN SIGHT

Story 13's deactivation flow **exists on this build**. It was never found before because:

1. The dialog lives in a **lazily-loaded chunk**, `DeactivateSalesRepDialog.DkfXgk7h.js`, reachable
   only after a **transitive-closure crawl of 591 SPA chunks** (the entry bundle references 119; five
   crawl rounds were needed to reach closure).
2. **Its copy shares almost no wording with the spec**, so searching the bundle for the spec's strings
   ("is the sales rep on", "Their customer assignments will stay where they are") returns **zero hits**
   — which reads exactly like "not built".

**The control is not where the cases say it is either.** There is **no active-status toggle in the
staff list row**. The control is a **button labelled "Deactivate account"** (renders title-cased as
**"Deactivate Account"**, `data-test-id="button_change_account_status"`) **inside the "Edit Staff
Member" dialog**, opened from the row's `staff_edit_button`. Inactive staff are on a separate
**"Deactivated(n)"** tab (`data-test-id="tab_deactivated_staff"`; its label is lowercase in the DOM and
CSS-capitalised).

**The pre-check endpoint:** `GET /api/staff/{staff_id}/sales-rep-assignments` →
`200 {"affectedCompaniesCount":N,"hasAssignments":bool}`. It fires **before** the dialog and **commits
nothing**. It takes the **staff_id**; the user id returns **404**.

### THE DEFECT THAT MATTERS MOST

**`affectedCompaniesCount` is 0 / `hasAssignments` false for reps that demonstrably hold 1 and 3
customer assignments.**

Corroborated **independently, on the same build, in the same session**: the Sales Rep Assignments CSV
(`GET /api/reporting/export/sales_rep_assignments`) lists all four assignments correctly —

```
"Customer Name","Sales Rep","Rep is active?"
"Aaborough Works","ZZAUTOTEST RepA",Yes
"Aacastle Services","ZZAUTOTEST RepB",Yes
"Aachester Partners","ZZAUTOTEST RepB",Yes
"Aacrest Works","ZZAUTOTEST RepB",Yes
```

So **the data is stored and readable; the pre-check does not see it.** Because the count is always 0,
the dialog always renders its **no-assignments** branch, and the count headline, the pluralisation and
the reassurance line can never appear for anyone.

---

## SPEC vs BUILD — the S13 truth table, every row live-observed (Rule 15/25)

| Spec (SBR v15, verbatim) | Build on `v3.4.1-0ed4433` | Verdict |
|---|---|---|
| **S13-R1** pre-check returns "the count of distinct customers currently assigned … plus a flag" | endpoint exists, returns exactly `{affectedCompaniesCount, hasAssignments}`, runs first, commits nothing — **but the count is 0 for 1 and 3 assignments** | **DEVIATION** (count) |
| **S13-R2** "If there are no assignments, the deactivation applies silently — no dialog." | **the dialog opens anyway** (RepZ: toggle ON, genuinely zero assignments) | **DEVIATION** |
| **S13-R3** dialog titled `"Deactivate {Staff Name}?"` | titled **"Deactivate sales rep"** | **DEVIATION** |
| **S13-R4** `"{Staff Name} is the sales rep on {N} customer{s}."` + `"Their customer assignments will stay where they are."` | **"Deactivating this sales rep will remove them from the list of available sales reps. Are you sure you want to proceed?"** — no name, no count, **no reassurance line**. The unreachable N>0 branch reads *"…Deactivating them will **clear** the sales rep on those customers…"* — the **opposite** of S13-R10 | **DEVIATION** |
| **S13-R6** `"Type YES to confirm"` + auto-focused input | label renders **"Type YES To Confirm"**; **autofocus confirmed** (`activeElement` = `input_confirm_yes`); "YES" is not separately emphasised | **PASS on substance** |
| **S13-R7** case-**in**sensitive match, trim, **Enter submits**, tooltip `"Type YES above to enable."` | trim ✓ · **case-SENSITIVE** (`yes`, `Yes`, `YeS` all leave it disabled; only `YES` enables) · **Enter does not submit** · **no tooltip** | **DEVIATION** (3 of 4 legs) |
| **S13-R8** dismisses on Cancel, X **or Escape**; outside click does **not** | Cancel ✓ · X ✓ · **Escape does NOT dismiss** · outside click does not dismiss ✓ | see note below |
| **S13-R9** in-flight loading state, dialog stays open, closes on success | spinner present + Deactivate disabled at ~0.5 s, dialog open, then `POST /api/iam/change-status` → **201** and it closes | **PASS** |
| **S13-R10** assignments **not modified** | all 4 assignments **byte-identical** before/after (`sales_rep_id` + both name strings) | **PASS** |
| **S13-R11** toggle unchanged; CSV "Rep is active?" = "No" | `is_sales_rep` still true, `is_active` false; CSV flipped **Yes→No** for RepB's 3 rows, RepA stayed **Yes** | **PASS** (but see C30257) |
| **S13-R12** focus trapped, returns to invoking control | autofocus into the input confirmed; **full trap/return not driven** | **PARTIAL — honest gap** |
| **S13-N2** no toggle → check skipped, no warning | **0 pre-check calls**, no dialog, direct `change-status` → 201 | **PASS** |
| **S13-N3 / S13-E3** reactivation never shows the dialog; assignments re-surface | button reads **"Activate Account"**, no pre-check, no dialog, 201; assignments intact | **PASS** |
| **S13-N4** failed pre-check → **fallback dialog**, never silent | **dialog opens** ✓ and gate present ✓ and **no silent deactivation** ✓ — but the body is the same no-assignments copy, **no reassurance line** | **DEVIATION** (copy) |
| **S13-N5** error toast; status unchanged; input clears on open | toast **"Ooooops! An error occurred"** + caption verbatim incl. `[request-id]`; status unchanged; input clears | **PASS** |

### ⚠️ A CONTRADICTION BETWEEN OUR OWN CASES AND THE SPEC (Rule 28 / Rule 33)

**S13-R8 says the dialog dismisses on Escape. Our cases C30255 and C30256 say the opposite** — C30255
expectation 3 reads *"Pressing the "Esc" key does NOT close the dialog … (the app's general rule is
that pop-ups do not close with the Esc key)"*.

**The build agrees with our cases, not with the spec** (`persistent: true` on the dialog; observed
live). So this is **not** a build defect — it is a **spec-vs-suite divergence we recorded deliberately**
and it is now **live-confirmed in our favour**. **No case change made.** Logged here so nobody
"corrects" our cases toward the spec later, and flagged as a **spec correction to raise with Chris
Ward** (not filed — Rule 51 keeps the ask with the QA lead first).

---

## THE 15 VERDICTS

| # | Case | C-id | Was | **NOW** | Evidence |
|---|---|---|---|---|---|
| 1 | SBR-API-06 | C30321 | BLOCKED | **DEVIATION** | pre-check runs first ✓, returns count+flag ✓, cancel commits nothing ✓ — **count is 0** for 1 and 3 assignments, so it can never match a headline |
| 2 | SBR-DEACT-02 | C30253 | BLOCKED | **DEVIATION** | title, count headline and reassurance line all differ |
| 3 | SBR-DEACT-03 | C30254 | BLOCKED | **DEVIATION** | autofocus ✓; gate case-sensitive, Enter dead, no tooltip |
| 4 | SBR-DEACT-04 | C30255 | BLOCKED | **VIU-Observed-PASS** | all 5 expectations confirmed live (Cancel ✓ X ✓ Esc-no ✓ outside-no ✓ status unchanged ✓); one wording fix applied — Cancel is **grey**, not "red outline" |
| 5 | SBR-DEACT-05 | C30256 | BLOCKED | **VIU-Observed-PASS** | in-flight lock ✓, closes on success ✓, assignments byte-identical ✓, no reassignment ✓ |
| 6 | SBR-DEACT-06 | C30257 | BLOCKED | **DEVIATION** | toggle unchanged ✓ CSV "No" ✓ credit intact ✓ — but `is_inactive` flips on **staff-active**, while the case (S13-R11/S5-R9) says the "(Inactive)" marker follows the **toggle** |
| 7 | SBR-DEACT-07 | C30258 | BLOCKED | **DEVIATION** | no-toggle ✓ reactivation ✓ — **a rep with zero assignments still gets the dialog** |
| 8 | SBR-DEACT-08 | C30259 | BLOCKED | **VIU-Observed-PASS** | toast + caption + request-id verbatim, status unchanged, input clears. **Our case had the typo** ("occured") — fixed |
| 9 | SBR-DEACT-09 | C30260 | BLOCKED | **DEVIATION** | fallback dialog opens ✓ no silent deactivation ✓ — reassurance line absent |
| 10 | SBC-CALC-03 | C30151 | DEVIATION | **DEVIATION** (confirmed) | heading **"Inv. Hrs"** verbatim ✓; zero renders **"0.0"** in default colour ✓; **`hours_invoiced` stays 0 with 1.5 h of hourly labour billed**, so the ± legs cannot be produced |
| 11 | SBR-CALC-01 | C30229 | DEVIATION | **DEVIATION** (confirmed) | as above |
| 12 | SBR-CALC-02 | C30230 | DEVIATION | **DEVIATION** (confirmed) | as above |
| 13 | SBR-CALC-03 | C30231 | DEVIATION | **DEVIATION** (confirmed) | as above |
| 14 | SBR-CALC-09 | C38894 | DEVIATION | **DEVIATION** (confirmed) | as above |
| 15 | SBR-WO-05 | C30314 | **PASS** | **DEVIATION** | WO-rep credit ✓, unassigned-only ✓, **snapshot immutable ✓** (changing the WO's rep RepA→RepB left S-16244 under RepA) — but the **customer-rep fallback does not happen**: S-16245, whose customer *has* RepB, landed under **"Unassigned"** |

### The two fault paths were forced, not skipped

C30259 and C30260 say *"force the request to fail"* / *"cut the network"*. Both were driven with
**Playwright request interception**, which is that instruction done deterministically — labelled
**FAULT-INJECTED** on every verdict. **C30260's precondition offering "if not forceable, mark Blocked"
is now obsolete: it is forceable.**

**An environment artefact I nearly recorded as a finding.** The first pre-check fault used
`route.abort()`. The result looked dramatic — no dialog at all — but the screenshot showed the sandbox's
**"Environment Sleeping"** interstitial: the transport abort made the SPA re-request the document and a
hibernating sandbox answered it. **That result was void and is discarded.** Re-run with a fulfilled
**HTTP 500** (which is the fault S13-N4 actually describes), the dialog **does** open. Recorded because
Rule 12 cuts both ways — an environment artefact must never be dressed up as a defect. All UI drivers
now carry a wake-guard.

---

## CORRECTED LEDGER TOTALS

| Status | Before | Change | **After** |
|---|---:|---|---:|
| VIU-Observed-PASS | 327 | +3 (C30255, C30256, C30259) −1 (C30314) | **329** |
| DEVIATION | 109 | +6 (C30321, C30253, C30254, C30257, C30258, C30260) +1 (C30314) | **116** |
| NOT-BUILT | 13 | — | **13** |
| EXTERNAL-DEPENDENCY | 20 | — | **20** |
| **BLOCKED-BY-DEFECT** | 9 | **−9** | **0** |
| **TOTAL** | **478** | | **478** |

**Proved both ways:** 329 + 116 + 13 + 20 + 0 = **478**, and 327 + 109 + 13 + 20 + 9 = **478**.
The population is unchanged; **the BLOCKED-BY-DEFECT bucket is now empty.**

---

## TESTRAIL WRITES — 2 operations, both byte-verified

**No case carried an SV-8821 "known issue / filed for a fix" line.** I grepped all 15 for `8821`,
"known issue", "filed for a fix", "blocked", "server error" and "cannot be run": **zero hits**. The
blocked framing lived only in our ledger and defect-pack documents, never in tester-facing text — so
there was nothing to remove, and I am saying so rather than inventing work.

**All 15 provenance lines were already current** — every one reads *"as per the build tested on
8/4/2026"* with the right specification version and anchors. **No re-stamp was needed.**

The only writes are two build-accurate wording corrections the live run exposed (Rule 9, Rule 41):

| Op | C-id | Change | HTTP | Byte-level verification |
|---|---|---|---|---|
| 1 | C30259 | `"Ooooops! An error occured"` → `"Ooooops! An error occurred"` | **200** | **30 fields compared, 1 intended, 0 mismatch** |
| 2 | C30255 | `"Cancel" button (red outline)` → `"Cancel" button (grey) … the "Deactivate" button is the red one` | **200** | **30 fields compared, 1 intended, 0 mismatch** |

Every unintended field proven **byte-identical** to its pre-write snapshot. Local case source patched
and re-verified **byte-identical to live**. Snapshots in `/tmp/testrail/snapshots/`, per-op log in
`testrail-execution-log.md`.

---

## HONEST LIMITS

- **Rule 49:** the build is declared **not final**. Every verdict is provisional and queued.
- **S13-R12** focus **trap** and focus **return** were not driven end to end — only autofocus was.
- **Toast persistence (120 s)** was not timed.
- The **N>0 dialog copy** is quoted from the bundle source, not from a screen, because the count defect
  makes that branch unreachable. It is labelled as such.
- `hours_worked` needs **technician clock records**; no clock-in API was located, so the negative
  (worked > billed) leg of the Inv. Hrs cases remains unexercised. That is a **stated gap, not a pass**.
- The **five CALC cases keep their existing DEVIATION verdict.** What changed is the evidence: from
  *"cannot be exercised"* to *"exercised, and `hours_invoiced` is 0 for an invoice that billed 1.5 h"*.

## A CORRECTION I MADE TO MY OWN WORK

An early extraction reported the SBR `Inv. Hrs` column rendering as **`$0.00`** — money where hours
belong. **That was false.** SBR rep rows carry **11 cells against 14 headers** (the rep row omits
Date/Invoice/Status), so a naive header-index lookup pointed at the wrong column. Re-checked with an
alignment guard, **both reports render `0.0` correctly.** There is **no currency-formatting defect**,
and it is not reported as one.

## OUTSTANDING — what I need from you

1. **A ruling on the six new Story-13 deviations.** The pre-check count returning 0 is the load-bearing
   one — it disables the count headline, the pluralisation and the reassurance line for every user. Do
   you want a defect ticket raised? **Not filed** — it is user-facing, not API-only, but Rule 6 means
   the ask comes to you first.
2. **A ruling on the C30314 customer-rep fallback** (S19-N2). An invoice whose work order has no rep,
   on a customer who *does* have one, lands under "Unassigned". Ticket or PO question?
3. **The S13-R8 Escape divergence is a spec correction for Chris Ward** — the build and our cases agree
   that Escape does not dismiss; the spec says it does. Shall I add it to his sheet?
4. **Was the S13 dialog copy signed off?** The built text tells the user their assignments will be
   **cleared**; the spec promises they will **stay**, and the behaviour keeps them. The copy is simply
   wrong, and it is the kind of thing a PO usually wants to know about directly.
