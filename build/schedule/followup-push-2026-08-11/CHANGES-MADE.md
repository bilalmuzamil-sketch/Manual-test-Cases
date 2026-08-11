# Schedule follow-up push — what changed, 2026-08-11

**Two cases. Two `update_case` ops. Nothing else.**
Reconstructed after the fact — see the banner on `testrail-execution-log.md`.

---

## The change list

| # | Internal | C-id | Link | Field | What changed |
|---|---|---|---|---|---|
| I1 | SCH-FILT-03 | **C29944** | [view](https://shopview.testrail.io/index.php?/cases/view/29944) | `custom_expected` | An **unsourced assertion removed** and the list renumbered |
| I2 | SCH-EDGE-08 | **C38866** | [view](https://shopview.testrail.io/index.php?/cases/view/38866) | `custom_expected` | Provenance re-pointed **epic → the two owning stories** |

**`custom_preconds` and `custom_steps` were sent on both payloads but were byte-identical
to what was already stored.** They are on the payload because TestRail re-renders any text
field you *omit* into `<p>`-wrapped HTML with CRLF, and this project shows markup literally
to the tester — so sending an unchanged field verbatim is how you stop it being mangled.

---

## I1 — C29944: an assertion the case could not test

**Removed, verbatim:**

> *"3. Choosing more than one status shows the work orders of all the chosen statuses
> together."*

**Then:** old item 4 became item 3.

**Why it had to go rather than be reworded.** The case's own steps say *"Choose **one**
status under Status."* — so the case never selects more than one, and the assertion could
not be exercised by anyone following it. **No source required it either.** Rules 25/57/58
are explicit that the repair for an unsourced assertion is **removal**, and specifically
**not** substituting what the build does; substituting would have quietly turned the case
into a description of the build.

**What was deliberately NOT touched:** the tester note explaining that this shop's list
holds only Approved and Review work orders, so most status choices correctly come back
empty. That note is doing real work — it stops a tester raising a false bug against a
correct empty list — and it is still there.

## I2 — C38866: per-story precision in the provenance

Sentence 1 named the **epic**; the case's own `refs` already named **two stories**. Rule 20
wants per-story precision, and a provenance line that is vaguer than the `refs` beside it
is the sort of mismatch that makes a reviewer distrust both.

**Now:** *"…as per story **SV-8700** (dark theme)… story **SV-8698** (overtime and conflict
cues are not colour-only)… and the Schedule specification version 27 (§11)…"*

**Sentence 2 was preserved verbatim** — *"Last checked against build v3.5-7ec992f on
8/6/2026."* — and the executor would have stopped rather than lose it. That sentence is the
honest record of the build this case was last checked against, and **nothing in this pass
observed a newer one**, so inventing a newer stamp would have been a false claim (Rule 54).

---

## What did NOT change

- **No expected behaviour was rewritten.** I1 *deleted* an assertion; I2 touched only the
  provenance sentence. Everything before the `---` separator in C38866 was proved
  byte-identical.
- **No automation marker moved.** Both remain `AUTOMATION: READY`. No verdict changed, so
  no marker could (Rule 61).
- **No `refs` field was written** on either case.
- **No title changed.**
- **0 add · 0 delete · 0 section · 0 run · 0 result · 0 Jira.**

## Cross-check against the rest of the day

**C38866 was also touched by the earlier staged push**, so it appears in two op lists.
**Both ops landed and the final content is correct**; TestRail exposes only the most recent
write, so the ordering between them is not reconstructable and is not asserted here.
