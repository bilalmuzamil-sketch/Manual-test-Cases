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
| C44554 | A settings change applies to every open work order, not just new ones | SFV2 Switching a Work Orders setting changes no record that already exists |
| C44555 | Each settings-change record is written to the audit log with its cause | SFV2 Switching a Work Orders setting writes no history entry, because nothing changes |
| C44559 | Applying a settings change blocks only the acting admin, never the organization | SFV2 Switching a Work Orders setting saves at once and holds nobody |

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
