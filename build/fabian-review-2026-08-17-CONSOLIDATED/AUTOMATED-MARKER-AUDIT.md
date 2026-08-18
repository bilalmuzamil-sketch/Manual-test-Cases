# Automated-Marker Audit — 2026-08-17/18 Fabian-review + currency passes

**Read-only investigation.** Written 2026-08-18. Author: Bilal Muzamil (TestRail user id 3).
Scope: the three active suites written this session — **Schedule** (group 4254), **Report Suite**
(group 4281), **Filters** (group 4110). No TestRail case was written by this audit; only this report
and the companion register were committed.

> **Two different things are called an "automation marker". Keep them apart (the QA lead's own
> distinction, CLAUDE.md Rules 64/65):**
> - **The "Automated" STATUS = TestRail's OWN field `custom_atmstatus`** (dropdown: 1 Not Automated ·
>   2 Cannot be automated · **3 Automated** · 4 Pending). **This is the one the QA lead's rule
>   protects** — a case flagged `3` is one Vladimir Tomovic's automation may already depend on, so it
>   must not be changed without telling him.
> - **The plain-text `AUTOMATION:` line** at the end of Expected Results (e.g. `AUTOMATION: READY`,
>   `AUTOMATION: Not available on Build to test Yet`) is a **text cue for the automation engineer**,
>   NOT the status field. The two can and do disagree.
>
> **This audit answers the question for BOTH, clearly separated, so the QA lead can tell us which he
> meant.**

---

## HEADLINE

**Did we change the "Automated" STATUS FIELD (`custom_atmstatus`) of any case — value set to/from
3 — without permission? → NO. Zero cases, all three projects.**
- No `update_case` payload in any of the seven passes included `custom_atmstatus`. Every update
  executor lists the field in its *frozen / untouched* set and byte-verified it identical to the
  pre-write snapshot (Rule 50). Evidence: grep of every executor script; per-case oplog verification.
- All 44 cases we edited that currently carry `custom_atmstatus = 3` were **already `3` before our
  passes and are still `3`** (Report Suite: `3` on the 2026-08-10 baseline `/tmp/all4281.json`;
  Filters: `3` on the pass-start snapshot `all4110-START.json`).
- All **55 cases we created** (`add_case`) were created `custom_atmstatus = 1` ("Not Automated") —
  0 created as `3`. Confirmed live.

**Did we EDIT (update_case) the CONTENT of cases that TestRail flags as "Automated" (`atmstatus=3`)?
→ YES — 44 cases** (Report Suite 40, Filters 4, Schedule 0). **All 44 are OUR OWN cases**
(`created_by = 3`); the `3` flag on them was set by **Vladimir Tomovic (user id 1)**, the automation
engineer, so these are exactly the cases Standing Rule 65 says we must report to him. Of the 44:
- **11 are bucket A — real test-content change** (title / preconditions / steps / expected-behaviour
  body).
- **33 are bucket B — marker / provenance line / refs only** (the tester-facing test content is
  byte-identical to before our write).

**Did we touch any FOREIGN (someone else's) Automated case? → NO. Zero.** The 12 automated cases
authored by Vladimir Tomovic (Report Suite) are not in our write-set and read byte-identical
including `updated_on` / `updated_by`.

**Deletions this session? → NONE** (0 `delete_case` in any pass).

**Is a revert possible if the QA lead wants one? → YES, byte-for-byte** (see the last section).

---

## Per-project detail

### Schedule (group 4254) — 195 cases; we wrote 195 (19 new + 176 updated)
- **`custom_atmstatus = 3` (Automated): 0 cases.** Nothing here is flagged Automated, so **nothing
  we did touched an Automated case.** (This is consistent with the 2026-08-11 correction that set the
  31 mistakenly-`3` Schedule cases back to `1`.)
- **`custom_atmstatus = 4` (Pending): 20 cases — set by Vladimir Tomovic (user id 1), NOT by us.**
  History (`get_history_for_case`) shows all 20 moved `Not Automated → Pending` by user 1 at
  **2026-08-17T10:15:33 UTC**, which is **BEFORE** our Schedule passes (fabian first write 18:28 UTC;
  currency first write next day 03:25 UTC). Our later updates preserved the `4` (we never sent the
  field). **"Pending" is not "Automated"**, but it means Vlad has queued these for automation, so
  they are listed in the companion register for his awareness. The 20: C29925, C29927, C29928,
  C29931, C29932, C29936 … (full list in the register).

### Report Suite (group 4281) — 519 live (ours 507 / foreign 12); we wrote 507 (27 new + 480 updated)
- **`custom_atmstatus = 3`: 52 cases** — **40 ours** (all 40 edited this session) + **12 foreign**
  (Vladimir Tomovic; **0 touched**).
- Of our 40: **9 bucket A** (content) · **31 bucket B** (marker/provenance/refs only).

### Filters (group 4110) — 129 live (ours 124 / foreign 5); we wrote 124 (9 new + 115 updated)
- **`custom_atmstatus = 3`: 4 cases** — **all 4 ours**, all edited this session. **0 foreign automated.**
- Of our 4: **2 bucket A** (C29600, C29623 — full redesign rewrites) · **2 bucket B** (C29614, C38877).
- Filters also holds **5 foreign cases by Ahtasham Amjad (user id 7)** — C43576–C43580 — which are
  **`atmstatus` unset (not Automated)** and **were not touched** by us.

---

## A vs B — the exact split the QA lead asked for

**Bucket A — we changed real test content (title / preconditions / steps / expected-behaviour body).
11 cases.** Proven by diffing the committed local case-mirror at the pre-pass commit `94a4aab0`
(2026-08-12) against the current mirror (Report Suite), and the pass-start live snapshot
`all4110-START.json` against current live (Filters):

| Project | C-id | Link | Title | What our write changed |
|---|---|---|---|---|
| Filters | C29600 | [open](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Asset on Site together show only work orders matching both | title, preconditions, steps, expected-BODY |
| Filters | C29623 | [open](https://shopview.testrail.io/index.php?/cases/view/29623) | On a phone, choices in a filter sheet apply only when you tap Apply filters | title, preconditions, steps, expected-BODY |
| Report Suite | C30221 | [open](https://shopview.testrail.io/index.php?/cases/view/30221) | Expanding a rep loads its invoices on demand with a row-level spinner | expected-BODY |
| Report Suite | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | Info icons sit on Units Sold, Demand and Turns/Yr with descriptions | expected-BODY |
| Report Suite | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows exactly the 14 default columns in the specified order | expected-BODY |
| Report Suite | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | A re-enabled column returns to its canonical slot, with no reload | expected-BODY |
| Report Suite | C30460 | [open](https://shopview.testrail.io/index.php?/cases/view/30460) | No qualifying work orders: every tab shows the no-data message and no Totals | steps |
| Report Suite | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | preconditions |
| Report Suite | C30508 | [open](https://shopview.testrail.io/index.php?/cases/view/30508) | Remembers the "as of" date, filter selections, location, columns | title, steps, expected-BODY |
| Report Suite | C30535 | [open](https://shopview.testrail.io/index.php?/cases/view/30535) | One row per in-stock part at the selected locations valued at the resolved date | steps, expected-BODY |
| Report Suite | C30563 | [open](https://shopview.testrail.io/index.php?/cases/view/30563) | The "as of" date today, with today not yet recorded, values live stock | title, steps, expected-BODY |

Note on the Report Suite bucket-A cases: most are the **date-range → single "as of" date** model
change the Fabian review required for Work In Progress / Inventory Value (e.g. C30460, C30462, C30508,
C30535, C30563), and PV/label wording (C30221, C30346, C30352, C30353) — genuine tester-facing
changes, not formatting.

**Bucket B — marker / provenance line / refs only; the test content is byte-identical to before our
write. 33 cases.** These were re-stamped with the current spec version in the Rule-54 provenance line
and/or given the Rule-69 `AUTOMATION: Not available on Build to test Yet` marker; the tester still does
and checks exactly the same thing:

| Project | C-id | Link | Title | What our write changed |
|---|---|---|---|---|
| Filters | C29614 | [open](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Filters | C38877 | [open](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30107 | [open](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select: both toggles on by default; S/P prefix filtering | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30114 | [open](https://shopview.testrail.io/index.php?/cases/view/30114) | Pinned control toggles All customers and Clear all; clearing shows empty state | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30121 | [open](https://shopview.testrail.io/index.php?/cases/view/30121) | Each customer gets one summary row with its invoice count in parentheses | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30123 | [open](https://shopview.testrail.io/index.php?/cases/view/30123) | Expanding a customer reveals asset rows; chevrons toggle and are independent | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30138 | [open](https://shopview.testrail.io/index.php?/cases/view/30138) | The invoice number opens the invoice in the same browser tab | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30217 | [open](https://shopview.testrail.io/index.php?/cases/view/30217) | A rep row appears only when the rep has a matching non-reversed invoice | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30262 | [open](https://shopview.testrail.io/index.php?/cases/view/30262) | Show Unassigned adds one top-pinned Unassigned row that acts like a rep row | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30314 | [open](https://shopview.testrail.io/index.php?/cases/view/30314) | Invoice credit snapshot: WO rep, else customer rep, else unassigned | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | Without the Manager or Office User role the report entry is not shown | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter: single-select, first in row, three options, default Both; reloads | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | Toolbar search matches part number or description, case-insensitively | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | Empty state shows the standard no-data message when no parts match the filters | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | Header-click sorting re-queries the server; nulls first asc and last desc | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | Standard no-data message when no time in scope or all technicians cleared | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp) | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | Est. Lost Labor values internal hours at each location's default rate | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | All six columns sort on screen: ascending first, toggling with no third state | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | Deselecting a technician hides the row and recalculates the Summary | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | The Total Hours link opens Timesheet Activities in the same tab | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | The per-day breakdown is fetched only when a technician row is expanded | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | Four tabs in a fixed order with the partially-completed tab selected | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | Total Earned is the hero figure and equals the started-stage figures summed | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30498 | [open](https://shopview.testrail.io/index.php?/cases/view/30498) | The Advisor filter lists the advisors in the loaded jobs; screen only | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV) | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv" | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | Without reports access Work In Progress is absent from the navigation | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | Totals row sums the FULL filtered set on the server, not just the visible page | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | Category and Vendor multi-selects reload the report to matching parts only | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |
| Report Suite | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | Rows are sorted by Total Cost highest first on load and after any reload | marker / provenance line / refs only — title, preconditions, steps and expected-behaviour body byte-identical to pre-write |

---

## Foreign Automated cases — confirmed 0-touched

The 12 Automated cases authored by **Vladimir Tomovic (user id 1)** in Report Suite are **not in our
write-set** and read **byte-identical to the 2026-08-10 baseline** (`/tmp/all4281.json`) including
`updated_on` and `updated_by`:

C38919, C38920, C38921, C38922, C38923, C43567, C43568, C43569, C43570, C43571, C43572, C43573.

The 5 Filters cases by **Ahtasham Amjad (user id 7)** — C43576–C43580 — are not Automated and were not
touched. **No foreign case of any kind appears in any op-log of any of the seven passes.**

---

## SEPARATE: the plain-text `AUTOMATION:` marker (the automation engineer's TEXT cue — NOT the
`custom_atmstatus` field)

This is a **different thing** from the "Automated" status field above, and the QA lead should tell us
which he meant. This session **deliberately (re)wrote the plain-text `AUTOMATION:` marker on the cases
it touched**, mostly setting the Rule-69 `AUTOMATION: Not available on Build to test Yet - Last checked
8/17/2026` marker because build verification was deferred to a later sync. This is a **tester/automation
text cue inside Expected Results**; it does **not** change `custom_atmstatus` and does **not** by itself
change what the tester does.

Current live suite-wide distribution of the plain-text marker (source: consolidated report, re-confirmed
against live):

| Project | `Not available on Build to test Yet` | `READY - EXPECT FAIL` | `HOLD` | plain `READY` |
|---|---:|---:|---:|---:|
| Schedule | 194 | 0 | 1 | 0 |
| Report Suite | 387 | 83 | 37 | 0 |
| Filters | 110 | 4 | 10 | 0 |

We touched essentially every case in each suite, so the plain-text marker was (re)written on the order
of **691 cases** this session. **Again: this is the text cue, not the `custom_atmstatus` "Automated"
field. On the `custom_atmstatus` field we changed nothing.**

---

## Rule-65 "tell Vlad" status of the passes (for the QA lead's awareness)

Standing Rule 65 requires every pass that writes to cases to report which `atmstatus=3` cases it
touched. Checking the pass reports:
- **Report Suite Fabian report** carries a "FOR VLAD" section but lists only its own 4 (C30221, C30460,
  C30462, C30508).
- **Filters Fabian report** says **"None"** for Rule 65 — **this is incorrect**: that pass edited
  C29600 and C29623, both `atmstatus=3`.
- **Report Suite currency (36 cases), Filters currency (2 cases) and the Schedule passes** carry no
  "FOR VLAD" section.

**So the complete, correct tell-Vlad list is the 44 cases in this audit / the companion register** —
which is the gap this audit closes.

---

## Revert — possible, byte-for-byte

If the QA lead rules that any of the 44 edited Automated cases must be reverted:
- **Bucket B (33 cases): trivial** — content was never changed; only the provenance/marker/refs moved.
  The pre-write body is in the committed mirror at commit `94a4aab0` (Report Suite) and in
  `build/filters/fabian-review-2026-08-17/all4110-START.json` (Filters).
- **Bucket A (11 cases): full pre-write text available** — Report Suite from the mirror at `94a4aab0`;
  Filters (C29600, C29623) from `all4110-START.json`. A revert would be one authorised `update_case`
  per case, restoring title/preconditions/steps/expected from that snapshot and byte-verifying.
- The `custom_atmstatus` field needs **no** revert on any case — it was never changed.

Full machine-readable evidence: `/tmp/audit/` (live pull, write-set, intersection, A/B classification,
per-case markers). Companion durable register: `AUTOMATED-CASES-REGISTER.md`.

---

## OUTSTANDING — what the QA lead needs to decide
1. **Which "marker" did you mean?** If the `custom_atmstatus` "Automated" field → **we changed
   nothing** (0 cases). If the plain-text `AUTOMATION:` line → we (re)wrote it on ~691 cases as part
   of the pass, by design.
2. **The 44 edited Automated cases (`atmstatus=3`) should be shared with Vladimir Tomovic** so he can
   adjust his automation — 11 with real content changes (bucket A) matter most; 33 are marker/provenance
   only. The companion register is structured as that hand-off list.
3. **Do you want any of the 44 reverted?** (Not recommended for bucket B; bucket A were required
   Fabian-review content changes — but the choice is yours; byte-for-byte revert is available.)
