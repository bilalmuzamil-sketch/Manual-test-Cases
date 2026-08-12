# DELIBERATE-DECISIONS REGISTER — quality gate, 2026-08-11

**Standing Rule 46.** Everything this gate found and **deliberately did not change**, written down
with its evidence and an honest risk rating **before anyone asks**. An undocumented deliberate
omission is indistinguishable from a miss, and the QA lead must never be blindsided in a public
channel by a decision we made on purpose.

**Read the RISK column honestly: HIGH does not mean we are wrong — it means that if this is raised
publicly we have a concession to make, not just an explanation.**

---

## The one-line answers, for pasting into a channel

| # | Decision | The plain answer | Risk |
|---|---|---|---|
| D1 | The Work In Progress download family contradicts itself and we did not pick a side | *"Nine cases disagree about whether that report can be downloaded. Settling it needs one download attempt on the build, and nobody could sign in today, so we flagged it rather than guess."* | **HIGH** |
| D2 | Three cases state a known failure but carry a plain READY marker | *"Marking a case 'expected to fail' is a claim about how the build behaves today. We had no session, so we recommended the change instead of making it."* | **MEDIUM** |
| D3 | Six new Schedule panel cases are READY for a feature with no UI | *"The tester is safe — each case says plainly to mark it failed. It only affects which cases the automation engineer picks up, so it is his and the QA lead's call."* | **MEDIUM** |
| D4 | C29945 cannot be run and we did not add a Blocked instruction | *"The data it needs cannot be created in the product. The right fix may be to seed the data rather than let the tester skip it, and that is a decision, not a typo."* | **HIGH** |
| D5 | C30102's missing requirement item was not restored | *"A sentence has been lost from that case. Putting it back is writing a requirement, not fixing a formatting slip, so we quoted the exact text to restore and left it."* | **MEDIUM** |
| D6 | `later later` was left exactly as it is | *"That is the product's own typo, quoted word for word on purpose. Correcting it would have made six cases wrong."* | **LOW** |
| D7 | `refs` metadata errors were left alone | *"A tester never sees that field, and two passes re-cut it today. Correcting it on release eve was the worse trade."* | **LOW** |
| D8 | C29600's unnumbered fields were left alone | *"It reads fine and it is one of the automation engineer's own cases, so changing its text obliges us to tell him. Not worth it the night before a release."* | **LOW** |

---

## D1 · The Work In Progress download contradiction — NOT RESOLVED · **RISK: HIGH**

**Decision.** Nine cases split down the middle today — four now say the report downloads, five say
nothing downloads. **No side was picked and no marker was changed.**

**Evidence.** Full working in `CONTRADICTIONS.md` §1 and `DEFECTS-PRIORITISED.md` §P1-1. Baseline
markers measured at `43930ee3`; today's flips measured against live.

**Affected cases.** [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) ·
[C30511](https://shopview.testrail.io/index.php?/cases/view/30511) ·
[C30512](https://shopview.testrail.io/index.php?/cases/view/30512) ·
[C30513](https://shopview.testrail.io/index.php?/cases/view/30513) ·
[C30514](https://shopview.testrail.io/index.php?/cases/view/30514) ·
[C30515](https://shopview.testrail.io/index.php?/cases/view/30515) ·
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516) ·
[C30517](https://shopview.testrail.io/index.php?/cases/view/30517) ·
[C30518](https://shopview.testrail.io/index.php?/cases/view/30518)

**Who closes it.** One download attempt on any Work In Progress tab that has rows.

**Honest risk.** **This is the finding most likely to be raised at us, and the concession is real:
four cases had a build-state claim changed today with no build session behind it** (Rule 12). We did
not do it, but it is our suite. Whichever way it resolves, **at least four cases are wrong tonight**,
and a tester meeting the Work In Progress exports tomorrow will hit it. The mitigation is that Rule
61's third outcome — *"If it PASSES, the fix has shipped: tell the QA lead"* — gives the tester a
correct escape on the five EXPECT-FAIL cases, so the failure mode is confusion and a report, not a
silent wrong verdict.

---

## D2 · Known-failure cases left on a plain READY marker · **RISK: MEDIUM**

**Decision.** [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) (SV-8927),
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588) (SV-8823) and
[C29962](https://shopview.testrail.io/index.php?/cases/view/29962) (SV-8957) were **not** moved to
`READY - EXPECT FAIL`.

**Evidence.** The first two say so in their own bodies (*"Known issue: the product does not currently
do this…"*). C29962's regression was re-confirmed live on 11 August in
`build/schedule/build-viu-2026-08-11/LABEL-DIFF.md` — *"no arm test-id, no `aria-label` containing
'by click', no arm markup anywhere."*

**Why not changed.** Setting `EXPECT FAIL` asserts that a case **currently fails**. The brief is
explicit that no such marker may be added without live backing, and this pass had no session. That
constraint is right even though it leaves a known gap.

**Honest risk.** A tester meeting C29962 gets **no hint at all** that click-to-arm was removed, and
seven other Schedule cases are on HOLD because of that same missing control. **Recommended: one write
each**, adding the marker and the three-outcome block.

---

## D3 · Six new Schedule panel cases marked READY for an unbuilt feature · **RISK: MEDIUM**

**Decision.** [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) keep `AUTOMATION: READY`.

**Evidence.** Each body records that on 11 August *"the Schedule toolbar had no panel button at
all"*. The same suite uses `HOLD - <feature> does not exist in the build` for exactly this
(C38868 Dashboard, C38869 appointment, C38871 Priority), as does the Report Suite.

**Why not changed.** It turns on a build fact this pass cannot verify, and re-classifying a marker is
a judgement rather than a repair. **Rule 60 also gives `READY` a defensible reading** — it asserts
*automatable*, not *currently passing*.

**Honest risk.** CLAUDE.md's own marker convention says not-built cases are **excluded** from any
ready-to-automate figure, which requires them to be `HOLD`. **So the six are inconsistent with the
convention and with their own suite**, and the automation engineer will pick up six cases for a
control that does not exist. **The manual tester is not affected** — the body tells them to mark it
failed — which is the only reason this is MEDIUM.

---

## D4 · C29945 left unrunnable rather than given a Blocked instruction · **RISK: HIGH**

**Decision.** [C29945](https://shopview.testrail.io/index.php?/cases/view/29945)'s precondition —
*"Work orders exist with different priorities"* — was left as it is.

**Evidence.** C38871 holds on *"the Priority field this test needs does not exist in the build"*, and
our 4 August live check recorded *"all three are 0 in this data because no work order carries a
priority"* (`viu-2026-08-04/RECHECK-QUEUE.md` row 60).

**Why not changed.** **Standing Rule 14 says seed the data, do not mark it blocked** — *"there is
nothing like 'require seeding data'"*. Adding a Blocked path would take the easier road past a rule
that exists precisely to stop that. Whether a priority can be set another way (the API returns a
`priority` field) needs a session to establish.

**Honest risk.** **A tester will open the work-order form tomorrow, find no Priority field, and be
stuck with no instruction.** That is a real cost, incurred deliberately, to avoid encoding a
workaround the QA lead may not want.

---

## D5 · C30102's lost requirement item not restored · **RISK: MEDIUM**

**Decision.** The expected result stays numbered 1, 3, 3 with item 2 missing.

**Evidence.** The same sequence is in the pre-today baseline, so it **predates today**. Three sibling
cases carry the full sentence; the exact text to restore is quoted in `DEFECTS-PRIORITISED.md` §P2-3.

**Why not changed.** Restoring it is **authoring a requirement**, not repairing formatting — and
fixing only the numbering would be worse, because it would hide the gap behind tidy-looking text.

**Honest risk.** The title claims *"nine periods in the specified order"* and nothing tests it, on a
**final, shipping** report. A reviewer scanning titles would count the requirement as covered.

---

## D6 · `later later` left exactly as written · **RISK: LOW — and this is the good news entry**

**Decision.** Six cases keep *"…please try again a bit later later."*

**Evidence.** The raw captured API response in
`build/ticket-reformat-2026-08-06/report-suite/snapshots/working-set.json` records the product's own
JSON containing the doubled word. **It is the build's typo, quoted correctly under Rule 9.**

**Honest risk.** Almost none, and it is recorded chiefly so the next reader does not "fix" it:
correcting it would have put a wrong label into six cases and made a tester report a mismatch that is
not there. **Worth telling the QA lead only as a product typo.**

---

## D7 · `refs` metadata errors left alone · **RISK: LOW**

**Decision.** [C38882](https://shopview.testrail.io/index.php?/cases/view/38882)'s wrong publication
date for spec v19, and the superseded 4 August note in
[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) and six siblings, were left.

**Evidence.** v19's true date is `2026-08-06T11:48:47.371Z` from the repo's own cached Confluence
metadata; 108 sibling cases agree. Branko settled the mobile question on 5 August (SV-8825).

**Why not changed.** **A manual tester never sees `refs`, so nobody is misled tomorrow**, and `refs`
plus provenance are the fields two passes re-pinned today (20:55 and 21:13–21:31). Cutting across
that on release eve to correct metadata is the worse trade.

**Honest risk.** A reviewer reading `refs` on C29624 would conclude the case is wrong when it is
right. Real, but it costs a conversation, not a test result.

---

## D8 · C29600's unnumbered fields left alone · **RISK: LOW**

**Decision.** The only case in 771 with run-on preconditions and expected result keeps them.

**Why not changed.** It is one of **Vladimir Tomovic's `custom_atmstatus = 3` Automated cases**, so
its text has a downstream consumer and Rule 65 would oblige telling him; the content **is runnable as
it stands**; and a pass touched it hours ago and deliberately sent those two fields **byte-identical**,
so reformatting would cut across a deliberate decision.

**Honest risk.** Cosmetic inconsistency, visible to anyone comparing it with its 770 siblings.

---

## What this gate did NOT do — stated so it is not assumed

- **No build was opened.** No verdict in this audit rests on an observation made today; every build
  fact cited is quoted from a named earlier record with its date and build marker.
- **No expectation was changed on any case** (Rule 57).
- **No case was cut, merged or deleted.** `delete_case` was called zero times.
- **No run was written to.** Runs 352, 357 and 359 were synced by another pass tonight; `update_run`
  was never called here, and run 359 was proven undisturbed by content after each write batch.
- **No foreign case was read for a verdict or written to** (Rule 38).
- **No Jira ticket was created** — the creation hold stands (Rule 62), and every defect above is
  presented for the QA lead rather than filed.
