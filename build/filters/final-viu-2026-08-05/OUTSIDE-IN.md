# Filters — the outside-in gap hunt, 5 August 2026

Standing Rules 45 and 46. A suite may not be called current until it has been looked at from a position
**other than our own**. Rules 40–44 make us follow through on what *we* found; 45 exists because we had
no way to notice that an **outsider could see what we could not** — and today is the clearest possible
demonstration of why it exists.

## (a) The foreign-coverage diff, in both directions

**Direction 1 — their cases duplicating ours.** There are **no foreign cases in group 4110**: all 110
are `created_by = 3` (Bilal Muzamil), verified live twice this pass. So the overlap direction is empty
and there was nothing to diff. That is itself worth recording, because on Report Suite the same check
found five.

**Direction 2 — their assertions with no counterpart in ours.** The population that *does* exist for
Filters is not foreign cases; it is **Ahtasham's tickets and his graded results on run 352**, and under
Rule 45(d) each of those is a **coverage input**, not a message to answer.

| His assertion | Our counterpart | Verdict |
|---|---|---|
| **SV-8875:** *"S12-R6: mobile stages selections and applies them when the user taps an 'Apply filters' button within the sheet. **This applies to individual filter sheets, not only the combined 'All Filters' sheet.**"* | **FLT-MOB-04 C29624:** *"3. You can tick more than one option, and the work order list does NOT change while you tick — your choices are only being held, not applied yet. 4. An 'Apply filters' button is shown inside the sheet."* | **COVERED-BY.** Both texts quoted; they assert the same requirement about the same sheet. His ticket even names C29622/C29623/C29624. |
| **SV-8876:** *"a test case has waived it without the PRD being updated … Test case C29557 carries a note — 'Known and accepted: on the build tested the filter buttons sit on the same row as the tabs…'"* | **FLT-BAR-01 C29557**, as it stood this morning | **CONTRADICTS-OURS — AND HE WAS RIGHT.** Not a coverage gap: a defect in our own case. Repaired this pass. |
| **SV-8872:** *"'Back To My Saved Filters' button shown on user's own view"* | **FLT-URL-06 C38896:** *"on your own view there is no 'Back to my saved filters' option anywhere — it only belongs to a shared-link visit"* | **COVERED-BY.** Both texts quoted; his observation is the failure of our assertion, so the case exists and would catch it. |
| **SV-8878:** *"Desktop filter bar: expanding chips push toolbar actions (Create Work Order…)"* | **nothing asserts what happens to the toolbar buttons when active chips grow wide** | **CANDIDATE GAP.** Named below; not authored. |
| **SV-8832:** deleted filter value still applied | **FLT-PERS-04 C29616** and **FLT-URL-03 C29619** | **COVERED-BY**, and both already carry `EXPECT FAIL (SV-8832)`. |
| **SV-8828:** saved filters do not auto-restore after closing the tab | **FLT-PERS-02 C29614** (permanent persistence) and **FLT-URL-05 C38879** | **COVERED-BY.** |
| **SV-8824:** multi-select dropdown closes after each selection | **FLT-STAT-03 C29562** — proven live this pass: ticking Paid then Declined **without reopening** gave `?status=paid&status=declined` | **COVERED-BY, and now FIXED on the build.** |
| **His 2 Failed results on run 352** | — | Read read-only. They are his grading and were not touched. |

**One candidate gap, stated and not authored:**

> **SV-8878** — when active chips grow wide on the desktop filter bar, the toolbar actions (Create Work
> Order and the icon buttons) get pushed. **No case among the 110 asserts anything about the toolbar's
> layout under wide chips.** The specification's S13-R18 and S13-R19 cover the *search* control's effect
> on the toolbar, but nothing covers the *chips'* effect.
>
> **Not authored.** Authoring needs the QA lead's authorisation (Rule 6), and the underlying question —
> what *should* happen when the bar runs out of room — has no source, so it may be a **Branko question**
> before it is a test case.

## (b) The automation-engineer lens — and today it was not limited

*"If I were automating this from the running build, what would I assert?"*

For the first time on Filters this lens was **not** limited to the document: there was a live session.
What it produced, and every one of these is now asserted somewhere:

- the **exact** button label `"Apply Filters"` and its `data-test-id="apply_filters"` — a document
  reader would have written *"Apply filters"* and the test would have failed a correct build
- that **zero** list requests fire while ticking inside the combined sheet — the only hard proof that
  staging really happens, rather than the list happening to look unchanged
- that the single-filter sheet **closes** on the first tick, which is *why* multi-select appears broken,
  and which no document says
- that a phone sends `filters[0][value]=estimate` for **every** shared link — invisible from the screen,
  because the chips look correct

That last one is the clearest argument for this lens: **the UI lies and the network tells the truth.**

## (c) The hostile-reviewer lens

Run before delivery, not after the challenge. The three questions a hostile reviewer would ask, and the
honest answers:

1. *"Did you observe all 110 today?"* — **No. 29.** The other 81 carry forward from 04:20–04:53Z on the
   same build marker, and each one says so in `FINDINGS.md`.
2. *"You had five tests telling testers to ignore a spec violation. How long?"* — **From the 04:20Z
   pass this morning until 14:20Z today.** Ahtasham spotted it at 06:17. That is the concession.
3. *"Three tickets are closed and still reproduce. Whose fault?"* — two were closed **under our own
   account**, one by Ahtasham. Reported, not reopened; reopening is the QA lead's call.

## (d) Every external signal treated as a coverage input

Four signals arrived from outside today. **All four were diffed against the suite, not answered:**

| Signal | What it changed |
|---|---|
| The QA lead's correction of principle | 6 cases repaired, 110 provenance lines corrected, and a whole audit document |
| **SV-8876** (Ahtasham) | confirmed the class-A finding independently; his ticket left standing as Branko's question |
| **SV-8875** (Ahtasham) | stopped us filing a duplicate; C29624's marker set to EXPECT FAIL against it |
| **SV-8878** (Ahtasham) | the one **candidate coverage gap** above |

## (e) No "covered" verdict without both texts quoted

Every `COVERED-BY` row in section (a) quotes **his assertion and ours, side by side**. A bare
*"covered by C29624"* would have been unfalsifiable and is not used anywhere in this document.

## The honest lesson, repeated because it is the same one

**We did not find the class-A defect by auditing. The QA lead found it, and Ahtasham had independently
filed a ticket about it eight hours earlier.** That is exactly the failure Rule 45 exists to catch, and
this time it was not a coverage gap in the suite — it was **the suite arguing against itself**: five
cases that stated a requirement and then told the tester to ignore it. The tell we did not have, and now
do: **if the expected result cannot be quoted back to a document, the case has been disarmed.**
