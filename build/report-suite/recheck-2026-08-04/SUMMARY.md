# Report Suite re-check after the 2026-08-04 redeploy — the whole thing in one page

**Trigger:** the QA branch was redeployed **2026-08-04 10:41:58 UTC**, `v3.4.1-0ed4433` →
**`v3.4.1-3d03023`**, so under Standing Rule 49 every re-check row fell due.
**QA lead's instruction:** *"If recheck is due and if that is for Reports. Please do it."*

**Build marker read three times — start, middle, end of the run — `v3.4.1-3d03023` every time.**
It did not move under us. (`evidence/build-marker-MIDRUN.json`.)

**Session:** logged in **once**. The previous worker burned its session by calling `quick-login`
repeatedly — it rotates the shared `PHPSESSID` — so this run captured the cookie **and** the SPA user
payload in a single atomic login and reused them throughout. That is now the recorded recipe.

---

## 1 · Queue outcome — all 469 cases

| | Count |
|---|---:|
| **CONFIRMED** — re-observed, unchanged | **451** |
| **CHANGED** — a reportable finding | **4** |
| **RESIDUAL** — obligation carried forward, honestly not re-checked | **14** |
| **Total** | **469** |

Row-level cells written into the queue itself: **212 CONFIRMED · 5 CHANGED**. Per-case record:
`per-case-recheck-verdicts.csv`.

**The 14 RESIDUAL** are the Sales-Representative deactivation cases and the assignments export: creating
an invoice on this estate fails (SV-8821) and the assignments export is not built, so the data those
rows need could not be seeded. **Not claimed as checked.**

## 2 · The three open defects

| Ticket | Jira (read live) | Outcome |
|---|---|---|
| **SV-8818** PDF fails at scale | Open, Low | **CONFIRMED still reproducible** — 500 after 30–45 s on Parts Velocity, Technician Utilization Expanded, Inventory Value; CSV of the same scope fine; PDF fine narrowed |
| **SV-8819** Turns/Yr window | Open, Low | ⭐ **FIXED** — `This Year` now implies the inclusive **216**-day window (was **215**) and matches a hand-picked range exactly |
| **SV-8820** IV values stock a day late | Open, Low | **CONFIRMED** — identical +1 day shift on every date tried |

**SV-8819's two cases were proven to pass, then had their "known issue" line removed** —
PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367),
PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374).
**SV-8819 itself is still `Open` in Jira** — Jira and the build now disagree, and moving the ticket is
not ours to do (Rules 6/53).

## 3 · What the deploy broke — and the honest size of it

A **`"Date Range:"` line is now line 1 of every export** (36 of 36 surfaces re-captured).
**All 469 cases swept** for first-line / line-order claims: **24 candidates, exactly 1 false** —
**IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)**, corrected and
rewritten scope-conditionally. **The other 23 survived because they were already written without pinning
a line number.** That is Standing Rule 42 paying for itself in a single afternoon.

## 4 · The Location column, end to end

Server-side rule **correct and unchanged**: the per-row Location column appears **only** with more than
one location in scope, on all six reports, in every format. Two screen-vs-file position deviations
persist unchanged (**Technician Utilization** — screen `Technician · Location`, file `Location ·
Technician`; **Inventory Value** — `Total Cost` last on screen, 9th in the file).
The single-location **filter** question is **still open** and labelled as such: proving it needs a user
account restricted to one location, which was not created.

## 5 · The two carried-forward items — both settled

- **IV on-screen column order** — observed live; the order genuinely differs from the file.
- **Per-cell API cross-check** — **55,584 cells, 0 genuine value mismatches**. Two honest caveats
  recorded rather than buried: a first run's 10 "mismatches" were **my own** negative-money formatter
  (`$-33.73` vs the build's `-$33.73`), and 11 rows are unpaired because several part numbers contain
  embedded quotes.

## 6 · Money format — unchanged, and the closing condition still holds

**55,656 of 55,656** money/percent cells fail a numeric parse; **Qty parses fine** (9,271). And the
amounts **are correct**. So the QA lead's condition — *"if that still shows the amount in number and
that amount is correct then its good to stay closed"* — **is still met.**
The **`columns=` half is also unchanged**: three different requests return a **byte-identical** file.

## 7 · TestRail — `update_case` only, 471 operations, all verified

**469** provenance re-stamps (one also carrying the C30590 correction) **+ 2** SV-8819 line removals.
**Every one HTTP 200 + byte-verified, 28 fields compared each, 0 mismatches.**
**No add, no delete, no section, no run write, no result write.**
Run **359** proven untouched — 469 tests, **all 529 results present by ID**, `include_all` still false,
case_ids set-equal both ways. The **5 foreign cases proven byte-identical**, timestamps included.

**The provenance line now names the build as well as the date**, because two builds existed on
2026-08-04 and the date alone had become ambiguous — and **Rule 49 obligation (3) requires the marker to
live on the case**. The stamper is **idempotent**.

## 8 · Reconciliation

**Four counts all 469** — live-ours, local active, id-map, import — **set-equal in both directions**.
Live total under the group is **474 = ours 469 + 5 foreign** (Rule 38: both numbers, always).
Import header **SHA-256 identical to all three peer projects**; 0 duplicate titles, 0 "VIU" words,
0 flag words, 0 internal-ID leaks, 0 titles over 80. **47 DO-NOT-AUTOMATE warnings counted live — all
present.** **Rule-28 sweep: 0 contradictions introduced.** **0 secrets in any tracked file.**

## 9 · Automation readiness

**394 of 469 automatable, up from 392** — because a real bug was fixed.
Full table: `../READINESS-2026-08-04-POST-DEPLOY.md`.

## 10 · The queue stays OPEN

Engineering never withdrew "not final", and **this deploy proved the point within hours of the branch
being treated as stable**. Everything here is **PROVISIONAL** and carries a standing obligation against
the next marker change.

---

## OUTSTANDING — what I need from you

1. **SV-8819 is fixed but still `Open` in Jira.** Please move it to a resolved state.
2. **The Inventory Value columns defect was NOT filed, and here is exactly why.** You said *"FILE IT …
   search Jira for duplicates first … and do not file if one exists — report instead."* **A duplicate
   exists: [SV-8823](https://shopview.atlassian.net/browse/SV-8823)**, whose title already names both
   halves — *"money arrives as text, **and the file ignores the chosen columns and re-orders them**"*.
   You closed it **OBSOLETE on the money half only**. So: **re-open SV-8823 for the columns half, or
   tell me to raise a separate ticket.** I will not file a duplicate on my own initiative.
3. **Chris Ward's 47 answers.** Outstanding since 2026-08-03; those 47 cases carry the
   DO-NOT-AUTOMATE line until he replies.
4. **A user account restricted to one location** — the last thing needed to settle the Location filter
   question.
5. **Tell me when engineering declares the branch final** — that is the trigger to re-run the queue one
   final time and close it.
