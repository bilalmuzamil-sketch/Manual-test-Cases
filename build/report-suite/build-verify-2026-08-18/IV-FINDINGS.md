# IV-FINDINGS — Inventory Value build-verification findings (2026-08-18, v3.8-bd246fd)

Build **`v3.8-bd246fd`** · Location **Staging Heavy Duty - 9919** (+ **All locations** for whole-org
totals) · Admin. Expected behaviour throughout comes from the **documents** (IV spec v10, epic SV-8582
+ stories, Chris Ward's answer file) — the build supplies only labels + the pass/fail verdict (Rule 57).

## 1. The report is fully built and the calc contract is correct
The Inventory Value report is present and functional on v3.8-bd246fd: nav entry under PARTS, all four
filters (single "as of" date defaulting to today · Category · Vendor · Location), Search parts,
12 sortable columns (Total Cost last, default sort Total Cost highest-first), a totals row,
column-selection, three-dot export menu, working CSV export, server pagination (5,703 rows).
**Calc verified per-row over a full 100-row page + the totals row, 0 mismatches:**
`total_cost = qty × unit_cost`, `total_sell = qty × unit_sell`, `margin = total_sell − total_cost`,
`margin_pct = margin ÷ total_sell × 100` (including fractional-qty rows).

## 2. EXPECT-FAIL backing tickets — live status (read from Jira, 2026-08-18)
| Ticket | Status | Cases | Decision |
|---|---|---|---|
| **SV-8818** — PDF export fails/500 on medium+ views | **TESTING QA (OPEN)** | C30587, C30590, C30591, C30593, C30595, C43548 | **KEEP EXPECT-FAIL** — reproduces live |
| **SV-8823** — CSV money-as-text + wrong column order | **TESTING QA (OPEN)** | C30589 | **STRIP → READY** — the money defect this case tests is FIXED (see §4) |
| SV-8820 — "as of" date off by one day | OBSOLETE/Done | C30562, C30564, C30565, C30566 | STRIP → READY |
| SV-8926 — totals row labelled "Totals" not "Total" | OBSOLETE/Done | C30556 | STRIP → READY (reproduces, §3) |
| SV-8928 — part search not persisted | OBSOLETE/Done | C30581 | STRIP → READY |
| SV-8929 — stale saved category not dropped | OBSOLETE/Done | C30582 | STRIP → READY |
| SV-8930 — empty state shows no message | OBSOLETE/Done | C30539 | STRIP → READY (message present but different wording, §3) |
| SV-8931 — first visit opens All locations | OBSOLETE/Done | C30536, C30574 | STRIP → READY (reproduces, §3) |
| SV-8932 — long text no ellipsis; sort a11y | OBSOLETE/Done | C30599, C30601 | STRIP → READY |

**No live-backed EXPECT-FAIL marker is left on a case whose failure no longer reproduces, and no marker
is stripped from a case whose failure DOES reproduce with a live-open ticket** (Rule 61).

## 3. SV-8818 (PDF export) — REPRODUCES LIVE → 6 cases keep EXPECT-FAIL
- **PDF export on the full unfiltered IV view (5,703 rows): times out / no file** (`?format=pdf`, curl
  **HTTP 000 after >45 s, 0 bytes**).
- **PDF export on a small filtered view (`search=R134A`, 4 rows): works** — **HTTP 200, valid PDF v1.7,
  25,235 bytes, 3.2 s.**
- This matches SV-8818 exactly ("fails once the view holds more than a few hundred rows; small views
  work"). SV-8818 is **OPEN (TESTING QA)** → the 6 cases keep `AUTOMATION: READY - EXPECT FAIL (SV-8818)`
  with their symptom + three-outcome blocks. **No Jira action** (creation on hold; ticket already exists
  and is open).

## 4. SV-8823 (CSV money/column order) — MONEY + ORDER APPEAR FIXED → C30589 stripped to READY, flag for QA lead
- **Live CSV export** (`?format=csv`, HTTP 200, 694 KB): money is written as **plain numbers with two
  decimals and NO `$`/comma separators** — e.g. `500.00`, `735.30`, `117650.00`, `250000.00` (0 `$`-prefixed
  cells in the whole file). This is the **correct** behaviour SV-8823 asked for; the money-as-text defect
  is **not reproduced**.
- **Column order in the CSV:** Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin,
  Margin %, Total Sell, **Total Cost** — i.e. **Total Cost is last**, matching the screen. SV-8823's
  "Total Cost sits ninth / Margin % last" order defect is **not reproduced** either.
- **C30589 (IV-EXP-03)** tests the number-format contract (money plain 2-decimals in CSV) → it now
  **PASSES**. Its EXPECT-FAIL marker had no live-reproducing failure to back it, so it was **stripped to
  plain `AUTOMATION: READY`** and its embedded "on this build the money comes out as `$11,176.88`" note
  (now false) was removed.
- **⚠️ RECOMMENDATION FOR THE QA LEAD (outcome 3, Rule 61):** SV-8823 is still **OPEN (TESTING QA)** while
  its money and column-order defects appear fixed on v3.8. Worth confirming the fix and closing the money
  portion. **NOT verified this pass:** SV-8823's third sub-claim — whether the CSV *honours column
  selection* (omits columns switched off on screen). The direct-API export returns the default full
  column set; the column-selection-in-export path was not driven end-to-end. **C30588 (IV-EXP-04-adjacent,
  plain READY)** still carries a "known issue: SV-8823" note about column selection — **left unchanged**
  because that specific sub-claim was not live-verified either way this pass. Recommend a targeted check
  of column-selection-honoured-in-export before fully closing SV-8823.

## 5. OBSOLETE tickets — live status of the deviation (informational; markers stripped either way)
- **SV-8926 (totals label): REPRODUCES.** The totals row's first cell reads **"Totals"** on screen where
  the documented expectation (S4-R1) asks for the literal **"Total"**. Ticket OBSOLETE. C30556 stripped to
  READY; the case body still tells the tester to mark Failed and report if it reads "Totals". **Flag for
  the QA lead: a real (if cosmetic) deviation persists with no open ticket.**
- **SV-8930 (empty-state message): PARTIALLY reproduces / DIFFERENT.** The empty state now **does** show a
  message — **"No inventory value to show for this selection."** — with the totals row correctly hidden.
  But the documented expectation (S1-N2 / Story 12) is the standard reports label **"Empty bays, endless
  possibilities. Get Going!"**. So a message is present but the **wording differs from the spec**. Ticket
  OBSOLETE. C30539 stripped to READY. **Flag for the QA lead: the empty-state wording does not match the
  documented no-data message.**
- **SV-8931 (first-visit location): REPRODUCES (observed on a fresh browser context).** On a fresh boot2
  context (no report prefs seeded) the Location filter opened on **"All locations"** and the report covered
  every location, where S1-R3 / S7-R2 ask for the user's currently active location. The "as of" date did
  open correctly on **today**. Ticket OBSOLETE. C30536 / C30574 stripped to READY. *Honest caveat: whether
  the report's persistence is browser-local or server-side was not fully established, so "fresh context =
  first visit" is the reasonable but not certain reading.* **Flag for the QA lead.**
- **SV-8820 / SV-8928 / SV-8929 / SV-8932:** markers stripped (OBSOLETE). The date-off-by-one (SV-8820)
  and the persistence/a11y items were not each re-driven end-to-end this pass (the "as of" past-date param
  is not directly reachable from the report endpoint without driving the calendar UI). Their markers strip
  regardless of reproduction; the documented expectations are preserved. If any still reproduces a tester
  will fail the case and is right to (Rule 61 — no live-backed ticket, no marker).

## 6. DEFERRED cases lifted (4)
C30561 (single "as of" date control), C30570 (server-side Category/Vendor/search filters), C30573
(filters combine with AND), C43837 (CSV carries the PDF header's "As of:" / "Locations:" metadata lines)
— **all four features are present and runnable live** (date control present; filters present and
server-reloading; CSV carries "As of:" and "Locations:" leading lines) → **lifted to `AUTOMATION: READY`**.

## 7. HOLD cases (10) — reasons re-verified, stand
C30547 (no-category part cannot be saved), C30577 (needs a single-location second sign-in), C30603 /
C30604 (need a reports-only / no-reports second sign-in), C30605 / C30606 / C30607 / C30609 / C30610
(the nightly-capture / retention job is server-side and its stored rows are not reachable from the app),
C38892 (needs a recorded earlier day + the stored capture rows). All genuine unobtainable/access states
— **not written**, reasons stand.

## 8. Defects flagged, none filed (Jira creation on hold — core §11.1)
| # | What | Ticket | Recommendation |
|---|---|---|---|
| 1 | PDF export fails on large IV view (works small) | SV-8818 (OPEN) | Already tracked; kept as EXPECT-FAIL |
| 2 | Totals row reads "Totals" where spec asks "Total" | SV-8926 (OBSOLETE) | Cosmetic; QA lead to decide reopen/accept |
| 3 | Empty-state message wording ≠ spec's "Empty bays…" | SV-8930 (OBSOLETE) | Message present but wrong text; QA lead to decide |
| 4 | First visit opens All locations, not active location | SV-8931 (OBSOLETE) | QA lead to decide reopen/accept |
| 5 | SV-8823 money/order appear FIXED though ticket OPEN | SV-8823 (OPEN) | Confirm fix; verify column-selection-in-export before closing |

**Nothing was created or deleted on the branch. No ZZAUTOTEST data was needed — every state the cases
require already existed and was used read-only.** Env left clean (Search parts box cleared).
