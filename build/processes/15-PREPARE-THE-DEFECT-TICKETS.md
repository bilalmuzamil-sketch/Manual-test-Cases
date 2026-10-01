# PREPARE THE DEFECT TICKETS `<feature>` — build them unchallengeable, then stop at the button

> **Call it:** `PREPARE THE DEFECT TICKETS for Invoicing`
>
> 🔴 **This process never files anything.** It produces approved candidates. **No Jira ticket is
> created without your explicit permission, asked for and granted PER TICKET** — an earlier batch
> approval never covers a later one, and a finding being real and obviously worth filing is not
> permission (Rule 62).

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Permission, per ticket** | Rule 62. A hold has been active since 2026-08-10 — **check whether it has been lifted rather than assuming** |
| **The owning story** for each defect | A `Story Defect` parented to an Epic is rejected with HTTP 400 |
| Confirmation for anything **API-related** | Rule 51 — those are asked about every time, even inside an approved batch |

---

## THE ADMISSIBILITY GATE — a candidate is not ready until all of it passes

- **Reproduced**, on a named build, with the exact steps.
- **Attributed** — the cause is the thing claimed, not something that merely correlates (process 0).
- **Not already filed.** Search Jira first. On Global Search, **all six** "new" findings already had
  a ticket.
- **Not a data problem** wearing a bug's clothes — the identifier exists, the term is proven, the
  field is populated.
- **Not a documented intent.** A V2 spec that deliberately removes something is not a defect.
- **Carries the quoted expectation** it violates, with document + version + section (Rule 25).

---

## THE SHAPE, once permission is given

| Field | Value |
|---|---|
| `issuetype` | **`Story Defect`** — never `Story Defect - Archive` |
| `parent` | **the owning STORY** (an Epic parent → HTTP 400) |
| `priority` | **`Medium`** — 🔴 `High` is barred |
| link | also link the owning story **`relates to`** |
| Product Area | **none** — absent on this type |

**Never convert someone else's ticket** — conversion is UI-only and silently wipes Product Area.
**Foreign tickets are hands-off**: report, never edit (Rule 38).

---

## THE STEPS

1. Collect the findings from the run, the capability check and the root-cause work.
2. Put each through the admissibility gate above; anything that fails goes back, not forward.
3. Write it so a developer can reproduce it without asking a question.
4. **Ask for permission, naming the ticket.** One at a time.
5. On a yes: file it in the shape above, read it back, and record the key.
6. On a no or a hold: keep it as an approved candidate with its evidence, and say so in the report.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| Filing on a batch approval | A ticket nobody sanctioned | Permission is per ask |
| Reporting a loss that is already filed | Duplicate, credibility cost | Search Jira first |
| A finding that is really a data gap | The developer closes it "cannot reproduce" | The admissibility gate |
| Parenting to the Epic | HTTP 400, and a confusing half-filed ticket | Parent the owning STORY |
| Raising priority to High | Barred | Always Medium |

---

## DONE WHEN
Every candidate has passed the gate and is either filed with its key recorded, or held as an approved
candidate with its evidence and the reason it is not filed.

**Canonical:** `build/skills/06-DEFECT-PREP.md`. **Rules:** 62, 94, 52, 53, 51, 25, 38, 73, 110.
**Worked examples:** `build/global-search/ticket-evidence-2026-09-15/`,
`SV-10279-Parts-Prefix-Ranking-Comparison-Evidence.md`.
