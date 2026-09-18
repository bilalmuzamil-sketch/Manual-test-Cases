# PROPOSED patch to `build/skills/06-DEFECT-PREP.md` — awaiting the QA lead's go-ahead (Rule 72)

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
