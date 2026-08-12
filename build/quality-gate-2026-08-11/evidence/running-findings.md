# Running findings log — written AS the audit proceeds, not at the end

Standing Rule 29: a session limit killed six workers today; unpushed work is the only kind lost.
This file is appended to as each finding is established and is committed with the batch it came from.

---

## F-01 · C38914 · Rule-61 block missing on an EXPECT-FAIL case · **HIGH**

[C38914](https://shopview.testrail.io/index.php?/cases/view/38914) — Report Suite, Parts Velocity.

Marker `AUTOMATION: READY - EXPECT FAIL (SV-8938)`. It is **1 of 107** EXPECT-FAIL cases in the
population, and **the only one**, that carries **no symptom sentence and none of the three
outcomes** Standing Rule 61 requires. The other 106 all carry the full block.

Consequence for a tester tomorrow: expected item 1 says the Location column is *"the LEFTMOST
column, before Type"*. It is not — it sits sixth, after Vendor. The tester sees a failure with no
instruction, and the two available wrong moves are both costly: raise a **duplicate** of SV-8938, or
assume it is the known one when it is not.

The symptom is **already recorded from a live observation**, so repairing this asserts no new build
fact — `build/report-suite/full-viu-2026-08-06/FINDINGS.md` line 65:

> C38914 | S7-R8 — leftmost, before Type, on screen and in both downloads | **Sixth** in all three
> places (values themselves are correct, incl. "Multiple") | SV-8938

and the build named there is the same one the case's own provenance names
(`v3.5-16cf83f`, 8/6/2026). Its sibling on the same ticket,
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352), already carries the full block.

**REPAIRED** — see `testrail-execution-log.md`.

---

## F-02 · Six new Schedule panel cases marked READY for a feature with no UI · **MEDIUM**

[C43582](https://shopview.testrail.io/index.php?/cases/view/43582) ·
[C43583](https://shopview.testrail.io/index.php?/cases/view/43583) ·
[C43584](https://shopview.testrail.io/index.php?/cases/view/43584) ·
[C43585](https://shopview.testrail.io/index.php?/cases/view/43585) ·
[C43586](https://shopview.testrail.io/index.php?/cases/view/43586) ·
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)

All six carry `AUTOMATION: READY`, and each says in its own body that when last checked on
11 August *"the Schedule toolbar had no panel button at all"* and the test therefore **fails**.

The same suite uses `HOLD` for exactly this situation on three other cases —
*"HOLD - the Dashboard section this test needs does not exist in the build"*, *"HOLD - work order
creation offers no appointment in the build"*, *"HOLD - the Priority field this test needs does not
exist in the build"* — and the Report Suite likewise has *"HOLD - this part of the report is not
built yet"*. So the marker convention is **inconsistent within one suite for one situation**.

It matters to the automation engineer, not the tester: he builds his worklist from `READY`, and
these six would be automated against a control that does not exist. **The manual tester is safe** —
the body tells them plainly to mark it failed — which is why this is MEDIUM, not HIGH.

**NOT CHANGED.** It turns on a build fact (the button's absence) that this pass has no session to
verify, and re-classifying a marker is a judgement, not a repair. The QA lead's call.

---

## F-03 · `later later` is the BUILD's own typo, not ours — do not "fix" it · **NOT A DEFECT**

Six cases quote a server error as *"An error occurred. We're sorry for this inconvenience, please
try again a bit later later."* — [C30512](https://shopview.testrail.io/index.php?/cases/view/30512),
[C30513](https://shopview.testrail.io/index.php?/cases/view/30513),
[C30514](https://shopview.testrail.io/index.php?/cases/view/30514),
[C30518](https://shopview.testrail.io/index.php?/cases/view/30518),
[C30595](https://shopview.testrail.io/index.php?/cases/view/30595),
[C43548](https://shopview.testrail.io/index.php?/cases/view/43548).

It reads like a copy-paste slip in six of our cases. It is not. The raw captured response body in
`build/ticket-reformat-2026-08-06/report-suite/snapshots/working-set.json` records the product's own
JSON:

> `{"errors":[{"error":"An error occurred. We're sorry for this inconvenience, please try again a bit later later."}`

**Quoting it exactly is Standing Rule 9 working correctly**, and "correcting" it would have put a
wrong label into six cases and made a tester report a mismatch that is not there. Recorded so that
the next reader does not repeat the reasoning. Worth telling the QA lead only as a **product typo**.

---

## F-04 · C29624's `refs` contradicts its own expected result · **MEDIUM (metadata only)**

[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) — mobile single-filter sheet.

Its `refs` carries *"individual-chip real-time per S12-R2 + S2-R6 + tech-plan …; only the combined
All Filters sheet is batch; CONFIRMED by Branko answers 2026-08-04 Q1"*, i.e. the single sheet
should apply **instantly with no Apply button**. Its expected result asserts the opposite — that the
list *"does NOT change while you tick"* and an Apply button applies the choice — and its symptom
block calls the instant-apply behaviour the **failure** (SV-8875).

The **expected result is the correct side**: Branko settled this on **5 August** (SV-8825, closed),
and spec v19 S12-R6 covers a single filter's sheet. The `refs` note is the **superseded 4 August**
position that was never removed. The same stale sentence is appended to
[C29621](https://shopview.testrail.io/index.php?/cases/view/29621),
[C29623](https://shopview.testrail.io/index.php?/cases/view/29623),
[C29625](https://shopview.testrail.io/index.php?/cases/view/29625),
[C29626](https://shopview.testrail.io/index.php?/cases/view/29626),
[C29627](https://shopview.testrail.io/index.php?/cases/view/29627),
[C29628](https://shopview.testrail.io/index.php?/cases/view/29628).

**A manual tester never sees `refs`, so nobody is misled tomorrow.** NOT CHANGED: `refs` is the
field two passes re-pinned today (20:55 and 21:13–21:31), and cutting across that on release eve to
fix a metadata note is the worse trade.

---

## F-05 · C38882 dates spec version 19 to the wrong day · **LOW (traceability)**

[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) — Reports page date-range filter.

Its provenance reads *"Confluence version 19 … published on the afternoon of 4 August 2026, which
changed the date filter description"*. **108 of the other 110 Filters cases say version 19 was
published 6 August**, and the repo's own cached Confluence metadata agrees:

- `build/filters/sv9041-2026-08-11/evidence/versions/meta-v19.json` → `"when":
  "2026-08-06T11:48:47.371Z"`, message *"S1-R3: filter chips display a leading type-icon…"*
- the date-filter change is **v18**'s message: *"Date-range filter: reflect current in-app default
  range and standard predefined ranges"*, published 4 August afternoon.

So the version number is right, the **date and the attribution are v18's**, left behind when the pin
was moved v18 → v19. No tester acts on it; it matters because Rule 42's whole mechanism is the
version pin, and Rule 31's trap (c) is precisely a mis-dated source flipping latest-wins.

**NOT CHANGED** — same reason as F-04: provenance re-dating is owned by today's read-dates pass and
the brief bars re-dating. One-line fix for whoever owns it next.

---

## F-06 · C29600 is the only case in 771 with unnumbered preconditions and expected · **LOW**

[C29600](https://shopview.testrail.io/index.php?/cases/view/29600).

Preconditions are one run-on line — *"Logged in as Admin on the Work Orders page, All tab; customer
A has an Estimate and an Approved WO, customer B has an Estimate WO (all API-seeded)"* — and the
expected result is a single unnumbered sentence. Every other case in all three suites uses numbered
lines. `(all API-seeded)` is also mild jargon for a non-technical reader.

**NOT CHANGED.** The case is one of Vladimir Tomovic's `custom_atmstatus = 3` Automated cases, so its
text has a downstream consumer and Rule 65 would oblige telling him; the content is runnable as it
stands; and a pass touched it hours ago and deliberately sent these two fields **byte-identical**,
so reformatting them would cut across a deliberate decision. Reported instead.
