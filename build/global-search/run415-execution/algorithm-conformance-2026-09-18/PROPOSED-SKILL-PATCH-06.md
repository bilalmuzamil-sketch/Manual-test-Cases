# ✅ APPLIED to `build/skills/06-DEFECT-PREP.md` on 2026-09-18 — his three answers were "keep it the way you already do"

This file is now the record of what was proposed and how it was decided. The text lives in the skill
under *"THE EXAMPLE-BLOCK SHAPE, AND THE SIX THINGS A SIMPLIFICATION MAY NEVER REMOVE"*.

**His rulings, 2026-09-18:** no `Technical Evidence` section · Environment stays second-to-last with
Sources last · the section stays named `Sources` with the requirement quoted verbatim. All three are
written into the skill as "do NOT adopt", with the guide's wording shown beside them so nobody
re-opens the question.

---

## The original proposal (kept for the record)


Rule 72 says skills are not edited without his word, so this sits here until he gives it. The
learning itself is already safe in `build/LEARNINGS-LOG.md` L0167; this is only the wording that
would go into the skill.

---

## §1-b — THE EXAMPLE BLOCK (adopted 2026-09-18 from the QA lead's own rewrite of SV-10238)

**Where a fault shows up on more than one kind of record, write one NAMED example per record type,
each under its own `h3.`, and keep each to three to five steps.**

```
h3. Example 1 - Asset
# Search {{ZZT-4471}}.
#* One vehicle is returned, and its row reads *2019 Freightliner Cascadia*.
# Search {{2019 Freightliner}}.
#* The vehicle is not returned and *Assets shows (0)*.

!PIC1-vehicle.png|width=760,height=543!
```

* The picture for an example goes **immediately under that example**, never collected at the end.
* After the examples, a **summary table** — *record · what works · what fails* — so the pattern is
  visible without re-reading the steps.
* A reader who stops after Example 1 must still have the whole point.

**THE SIX THINGS A SIMPLIFICATION MAY NEVER REMOVE.** Every one of these was lost when SV-10238 was
simplified elsewhere, and every one had to be put back:

1. the one sentence a reader remembers, in the Description (*"a record cannot be found by the words
   the product itself prints for it"*);
2. **why it matters in user terms** — who types this, what they see, why it is worse than it looks;
3. **the control that pins the diagnosis** — the neighbouring case that DOES work, so the fix lands
   in the right layer;
4. the **source quoted verbatim**, with page id, version and the date it was read;
5. the **honest caveat** where the requirement is silent, stated before a developer can say it;
6. the **house order** — Environment second-to-last, Sources last.

**AFTER ANYONE ELSE EDITS A TICKET, RE-READ THE RENDERED DESCRIPTION.** A pasted picture can be
saved as `!blob:https://media…|thumbnail!`, an editor-session handle that points at nothing once the
tab closes — the attachment is still there, the reference is not. Reference pictures by attachment
**filename with the true aspect** (`!PIC1-vehicle.png|width=760,height=543!`) and verify with
`GET /rest/api/2/issue/<KEY>?expand=renderedFields`: the `<img` count must equal the number of
pictures and the `blob:` count must be zero.

---

# ADDITION, 2026-09-18 — the QA lead's ticket guide folded into the same patch

Source: `build/skills/inputs/SHOPVIEW-JIRA-TICKET-GUIDE-2026-09-18.md`, reconciled in
`build/skills/inputs/GUIDE-RECONCILIATION-2026-09-18.md`. **One go-ahead covers both halves.**

## §1-c — SECTIONS THAT APPEAR ONLY WHEN THEY APPLY

* **`Permission Configuration`** — for any permission fault, list each permission and its state
  (`Vendor & Order Management → View = ON`, `View and Manage AP/AR Data = OFF`), then one sentence
  naming the dependency. Never describe a role in prose.
* **`Expected Result / Product Clarification Needed`** — where the requirement is ambiguous (Rule 58),
  state both valid readings and what we would do under each, instead of picking one and calling it a
  bug.
* **`Regression Note`** — when it started, on which environment, whether the live product differs,
  whether it is intermittent. The form of words is *"started occurring after the deployment"*, never
  *"the deployment broke this"*, unless someone has confirmed the cause.
* **Data or migration faults** — three blocks: the state before, what the migration should preserve,
  the state after.
* **A front-end action the back end refuses** — three lines: the screen offers it · the person clicks
  it · the back end refuses. Then the two valid expectations: it should work, or it should not have
  been offered.

## §1-d — ONE TICKET, ONE PRIMARY FAILURE

Several examples of the SAME failure belong in one ticket. Two different failures that happen to sit
on the same screen belong in two.

## §1-e — THE SELF-CHECK BEFORE CREATING OR EDITING ANY TICKET

Can a manual tester reproduce it from the steps alone · is the fault obvious in ten seconds · is the
actual result only what was observed · is the expected result taken from the specification or a
recorded decision · did I avoid stating an unconfirmed cause as fact · did I keep the environment,
the build and the test data · did I keep the annotated pictures, inline, beside what they prove ·
**after any edit, did I re-read the rendered description and count the images** · are there zero
`blob:` references · **if I cannot guarantee the pictures survive my edit, did I stop and hand over
the revised text instead of overwriting the description** · is this one fault rather than several.

## THREE THINGS IN THE GUIDE I HAVE NOT APPLIED, PENDING HIS RULING

1. **A `Technical Evidence` section.** The guide asks for one; he removed the technical-details
   section on 2026-09-16/17 and *"no developer-details section"* is recorded as company-wide.
   **My recommendation: allow it, placed after Expected Result and before Environment**, holding only
   confirmed observations — status codes, request ids, response bodies, measured scores.
2. **Environment last.** The guide puts it last; his own instruction of 2026-09-16 put it
   second-to-last with Sources last. **Recommendation: keep his order.**
3. **`Spec Reference` instead of `Sources`.** **Recommendation: keep `Sources`** with the requirement
   quoted verbatim, its page id, version and read date — the guide's paraphrase is weaker than what
   we already do.

**Also to be deleted when the skill is next edited:** the stale `Test cases` row in the eight-heading
table — he removed case ids and run links from Jira descriptions on 2026-09-16/17.
