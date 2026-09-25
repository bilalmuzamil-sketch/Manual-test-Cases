# The QA lead's ruling of 25 September 2026, and what was changed because of it

## His words

> Consider this "No record is changed by this switch. Parts already on a work order keep the state
> they are in." as the expected behavior for these test cases.

and, when I flagged that this is the one field I do not change:

> And also for these test cases put this "No record is changed by this switch. Parts already on a work
> order keep the state they are in." as their expected behavior - when we disable or enable the setting.

## What this overrides, said plainly

**Standing Rule 114 says the Expected Results are never changed — expressly including "not with his
go-ahead, which he has now withdrawn for this field".** I raised that before touching anything; he
then instructed it directly, a second time. Under Rule 63 a conflict is surfaced and then his decision
stands, so the three cases were changed. **This is a recorded exception to Rule 114 for these three
cases on this date — it is not a general licence, and the next pass must not read it as one.**

**🛑 HE SET THE LIMIT HIMSELF, 25 September 2026, verbatim:** *"This exception is FOR only when I ask
you to do that if I do not explicitly ask you to do that you are supposed to follow your standing rules
as is."* That is now written into the rule as **114(c)**. The bar is the default in every case except
one: he tells you, in that conversation, to change the Expected of cases he names. **A ruling about how
the product should behave is NOT that instruction** — record it as the run result, report that the case
text diverges, and leave the field alone.

## What was changed

| Case | Title before | Title now |
|---|---|---|
| C44554 | A settings change applies to every open work order, not just new ones | Turning a Work Orders setting on or off leaves existing work orders alone |
| C44555 | Each settings-change record is written to the audit log with its cause | No history entry is added when a Work Orders setting is turned on or off |
| C44559 | Applying a settings change blocks only the acting admin, never the organization | Turning a Work Orders setting on or off saves straight away and blocks no one |

**Titles reworded again, 25 September 2026, QA lead: _"The titles should be human understandable."_**
My first attempt read like rule statements and carried an `SFV2` prefix the sibling cases do not use -
one of them, "saves at once and holds nobody", barely parses. They now read as plain sentences in the
same voice as the rest of the section, and none is longer than 77 characters so nothing truncates on
the case page. The Expected of each was verified untouched by the rename.

**Titles were changed too** because each one asserted the opposite of its own new Expected, which would
have left the case contradicting itself. Titles are fixable under Rule 114; the Expected is what needed
his ruling. Say the word and any of the three goes back.

The Expected of each now leads with his sentence, then the consequence that belongs to that case, then
the provenance naming **his ruling of 25 September 2026** as the source alongside the epic and story.
The build stamp was re-stamped to 9/25/2026 and the automation marker is unchanged.

## Recoverability

`C44554-BEFORE.json`, `C44555-BEFORE.json`, `C44559-BEFORE.json` hold the full previous title, steps,
preconditions and Expected, byte for byte. `*-AFTER.json` hold what is live now. `audit-log.json` records
the write, the HTTP status and the read-back verification for each.

## What this does NOT settle

The written requirement itself — Confluence 771391574, story SV-9248 — has not been read this pass, and
it may still describe the sweep. If it does, the specification and the product now disagree, and that is
a question for the product owner rather than something a test case can decide. Flagged, not resolved.

---

# Second ruling, same day — C44557, the confirmations

## His words

> Either: "confirming on all four is expected" — I pass the check and we're down to four problems.
> And also change the title and expected behavior in the test case and maybe anything else too if
> needed in that test cases, yes even its automated do correct that too- yes its an exception for
> correcting the expected behavior, do not change your rules

## What that authorised, and what it did not

He **named the case**, ruled the behaviour, and lifted **two** standing holds for it explicitly:
**Rule 114** (the Expected is never changed) and **Rule 71** (a case TestRail flags as Automated is
never changed without him). *"do not change your rules"* — so nothing was amended in the rule files
this time; 114(c) already describes exactly this shape, and this is an instance of it, not a new rule.

**It does not reach any other case.** 114(c) is the standing position: the bar lifts only when he names
cases, in that conversation.

## What was changed on C44557

| | Before | After |
|---|---|---|
| Title | Only ordering and picking ask to confirm; picking-off warns of stock deduction | All four Work Orders settings ask you to confirm before they save |
| Expected | only ordering and picking confirm; approval and receiving save directly; picking-off warns of stock deduction | all four confirm; each names the setting and direction, carries a live count, and states that no record is changed by the switch |
| Steps | step 5 asked for a zero-affected state | all four settings switched and their confirmations read |
| Preconditions | required a shop with no matching open records | dropped - the zero-affected state is no longer part of the case |

The Automated flag was **left as it is**. He authorised correcting the text of an automated case, not
un-flagging it.

**🛑 RULE 65 — VLAD MUST BE TOLD.** A case TestRail flags as Automated has been changed. That is an
action for the QA lead to pass on; it is recorded here so it is not lost.

## Two requirements dropped, and they are a question not a decision

The old Expected carried two things neither ruled on nor ever observed:

- *"When the number of affected records is zero, no confirmation shows and the setting saves directly."*
- *"Where a large number of records is affected, the confirmation also advises making the change outside
  working hours; where the number cannot be established it states the consequence without a figure."*

Neither was exercised in this run, and his ruling does not speak to either. They are **out of the case**
rather than silently kept, and raised with him. If he wants them back they return as their own case.

## Recoverability

`C44557-BEFORE.json` holds the entire case as it was; `C44557-AFTER.json` what is live now;
`C44557-audit.json` the write, its status and the field-by-field read-back.
