# C30041 — the sourcing analysis, point by point, and the outcome

**Date:** 2026-08-11 · **Case:** SCH-TOOL-03 =
**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** ·
*"Toolbar search highlights matching blocks and fades non-matching ones"* · `refs: SV-8686 (§6 (Search))`

**THE RULING BEING APPLIED.** QA lead, verbatim: *"If the requirement has been deleted then the test
case should also be deleted. but do tell me whenever you delete any test case or update it so that I
can share the test cases with VLAd to adjust his automation accordingly."*

---

## 🔴 OUTCOME: NOT DELETED. STOPPED AND REPORTED — because the requirement has **not** been deleted from the requirement set.

**It was deleted from the PRD. It is still in the story.** The Schedule epic's story **SV-8686** —
which is a source of expected behaviour in its own right under Standing Rule 57(b), and is the very
ticket this case's `refs` names — **still requires the fade/highlight behaviour, in two separate
places**. Read live today, not taken from our notes.

**And separately, one of the four points is sourced by the LIVE PRD** and was never affected by the
deletion at all.

**So the condition in the ruling — *"if the requirement has been deleted"* — is not met**, and
`delete_case` was not called. Deletion is irreversible; this is the QA lead's call to make with both
texts in front of him.

---

## 1. Source currency — established live today, before any analysis

| Source | Identifier | Version / last edited | Checked | Verdict |
|---|---|---|---|---|
| **PRD (a)** | Confluence page `713031682` "Schedule" | **version 27**, edited **2026-08-07T15:01:20Z** | 2026-08-11 | **CURRENT** — `HTTP 200`, fetched and parsed in full (33,805 characters of text) |
| **Story (b)** | Jira **SV-8686** *"Schedule Grid Layout & Navigation"* | status **TESTING QA**, updated **2026-08-06T20:02:57-0500** | 2026-08-11 | **CURRENT** — `HTTP 200`, description read in full |
| **Design (d)** | `build/schedule/design-2026-07-27/` | ingested 27 July | — | **PARTIAL** — a newer, **undated and editable** design share link exists on SV-8915/8916/8917 and we do not hold it. Recorded, not relied on. |

**No Jira write of any kind was made, and SV-8874 was not called at all** — the two reads above are
`GET`s on a page and a story, which the analysis could not be done without.

---

## 2. What the PRD actually says now — quoted

**Version 23 (§6, Grid toolbar → Search):**

> *"Filters grid blocks by matching against customer name, WO number, unit number, technician name,
> and line name. **Non-matching blocks fade; matching blocks highlight.**"*

**Version 27, live today (§6, Grid toolbar → Search) — quoted verbatim from the live page:**

> *"Search | **Filters grid blocks by matching against customer name, WO number, unit number,
> technician name, and line name.**"*

**The second sentence is gone.** Confirmed exhaustively rather than by eye — across the whole live
v27 text: **`non-matching` appears 0 times · `restore` 0 · `clearing` 0 · `dim` 0 · `opacity` 0 ·
`rearrang` 0**. The word `fade`/`faded` appears **once**, about a *"faded 'continues' label"* on
multi-week series banners in Month view — nothing to do with search. All **five** occurrences of
`highlight` are elsewhere (mini-calendar week highlight, selected date, overtime technicians in a
capacity tooltip, drag drop-target cells).

---

## 3. What the story says now — quoted, read live today

**SV-8686, Requirements section, verbatim:**

> *"Grid search filters blocks by matching against customer name, WO number, unit number, technician
> name, and line name. **Non-matching blocks fade; matching blocks highlight.** — (PRD: §6)"*

**SV-8686, Acceptance Criteria, verbatim:**

> *"Given the user types in the grid search, when the query matches a customer name, then **matching
> blocks highlight and non-matching blocks fade**."*

**The story is not stale by neglect, either.** The text survives all four of Ayesha Khan's description
edits, the most recent at 2026-08-05T19:22:33Z, and the story was updated again on 2026-08-06 — *after*
the PRD deletion — with the requirement still in it.

---

## 4. Point by point

| # | What the case asserts | Sourced? | By what |
|---|---|---|---|
| **1** | *"Blocks that match the search are highlighted; blocks that do not match fade."* | **YES — by the story** | **SV-8686**, Requirements **and** Acceptance Criteria, both verbatim above. **Deleted from the PRD at v24.** ⇒ a **PRD-vs-story conflict**, which Rule 57 says is raised, not resolved by us. |
| **2** | *"All five fields match: customer name, work order number, unit number, technician name, and line name."* | **YES — twice over** | **Live PRD v27 §6**, near-verbatim, **and** SV-8686's Requirements. **Untouched by the deletion.** |
| **3** | *"Matching blocks stay in place on the grid (search visually filters; it does not remove or rearrange)."* | **NO — not stated anywhere** | A **corollary** of the deleted sentence (if non-matching blocks merely fade, they are still there). No source states it in these words, and it is the point that **conflicts most directly** with what the deletion was for. |
| **4** | *"Clearing the search restores all blocks to normal."* | **NO — not stated anywhere** | `restore`/`clearing` appear **0 times** in v27 and the story is silent. A reasonable corollary of any filter, but that is inference, not a source. |

**So the case is 2 points sourced, 1 point sourced-but-contested-between-two-documents, and 2 points
unsourced corollaries.** It is not a case resting on nothing.

---

## 5. Why the PRD deletion does **not** settle it — the audit trail

The deletion was deliberate and it has a documented trail (established by the 2026-08-06 spec-v25 diff
pass, kept here because it is what makes the question answerable):

| Time (UTC) | Who | What |
|---|---|---|
| 2026-08-05 05:26 | Mudassir Qamar | files **SV-8874** *"Grid search hides non-matching shifts instead of fading them"*, quoting the PRD |
| 2026-08-06 08:15:35 | **Stefan Vukovic** | *"per design we show only shifts/events that are matching the search. **This is a gap between PRD and design.**"* |
| 2026-08-06 08:32:34 | **Milos Vasic** | *"All good on this one **updated the PRD**, i will close this ticket as absolute"* |
| 2026-08-06 08:32:42 | Milos Vasic | SV-8874 → **OBSOLETE / Done** |
| 2026-08-06 08:34:03 | Confluence **v24** | **the fade/highlight sentence is deleted — 81 seconds later** |

**What that trail licenses, and what it does not.** It licenses **removing** our fade assertion from
the PRD's authority. It does **not** license asserting the opposite, because **the live PRD is now
silent on what happens to non-matching blocks** — *"Filters grid blocks by matching against…"* is
suggestive but says nothing about removal. Writing "non-matching blocks are removed" into the case
would be taking the expectation from the build, which is precisely what Rule 57 forbids.

**And nobody updated the story.** SV-8686 is now the stale artefact — but it is stale **in another
team's ticket**, which under Rule 38 is theirs to fix and not ours to edit.

---

## 6. Rule 64's automation precondition — checked first, as required

> *"before deleting the case check if that case has 'Automated' marker"*

**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041) carries `custom_atmstatus = 1`
(Not Automated).** So the precondition does **not** block deletion — **but the sourcing does.** Its
own `AUTOMATION:` text marker reads plain `AUTOMATION: READY`.

---

## 7. SV-8874 — checked, and there is nothing left to clean up

The concern was that our cases might still point at a defect raised against a requirement that no
longer exists. **Measured across all 781 cases in the three active groups, searching title,
preconditions, steps, expected results and `refs`: `SV-8874` appears on 0 cases.** C30041's marker was
already moved from `AUTOMATION: READY - EXPECT FAIL (SV-8874)` to plain `AUTOMATION: READY` by the
expect-fail audit earlier today. **No case needs changing, and no Jira call was made.**

---

## 8. What we recommend, for the QA lead's decision

**Do not delete.** Two of the four points would go with it, and one of them —
the five searchable fields — is sourced by the live PRD **word for word**.

**Trim, once Branko answers.** The Rule 25 / Rule 42 repair is to **remove or make scope-conditional
the assertions no source supports**, not to delete the case and not to substitute what the build does:

- **keep point 2** unchanged — live PRD v27 §6;
- **hold point 1** — it is a genuine PRD-vs-story conflict, and Rule 57 (as amended) says that is a
  defect **in the documents**, raised to the PO, while the case discloses the divergence (Rule 56);
- **drop points 3 and 4**, or rewrite them scope-conditionally — no source states either.

**The one question that unblocks all of it, in plain words for Branko:** *when you search the
schedule, should the shifts that do not match fade out but stay where they are, or should they
disappear from the grid until you clear the search?* This is already drafted as **Q1** in
`build/schedule/spec-v25-2026-08-06/QUESTIONS-FOR-BRANKO.md` and **has still not been sent.**

**A second item belongs to somebody else and should be passed on, not fixed by us:** **SV-8686 still
requires the deleted behaviour** in its Requirements and its Acceptance Criteria. Under Rule 38 that
is its owner's to correct.

---

## 9. Honest limits

1. **The design was not consulted, because we do not hold the current one.** Stefan's *"per design we
   show only matching"* is an engineer's statement about a design artefact we have never been given —
   an **undated, editable** share link. If that design is canonical and current, it may source the
   removal behaviour outright and change the recommendation in §8. **Which design artefact is
   canonical is already outstanding with the QA lead.**
2. **Points 3 and 4 are called unsourced on a text search of the live PRD and the story.** That is a
   measurement of those two documents, not proof that no document anywhere states them.
3. **No build was opened**, so nothing here is a statement about what the product currently does.
