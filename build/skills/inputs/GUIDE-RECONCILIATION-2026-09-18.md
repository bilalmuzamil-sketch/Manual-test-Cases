# The ShopView Jira Ticket Guide (2026-09-18) reconciled against our recorded rules

Source: `build/skills/inputs/SHOPVIEW-JIRA-TICKET-GUIDE-2026-09-18.md`, sent by the QA lead with the
instruction: *"enhance something which you are missing and never to loose or unlearn something which
you are doing great."*

Three buckets. **Nothing in the third bucket is acted on until he rules** (Rule 63 — a conflict with a
recorded ruling is surfaced, never resolved quietly; Rule 72 — skills are not edited without his word).

## 1 · ADOPT — genuinely new, no conflict with anything recorded

| From the guide | Why it is an improvement |
|---|---|
| **One named example per record type**, each under its own sub-heading, 3–5 steps | already learned from his rewrite (L0167); the guide confirms it |
| **`Permission Configuration` block** listing each permission and its ON/OFF state | we have never had a standard place for this and permission tickets need it |
| **403 shape**: UI offers the action → backend refuses → *either* it should work *or* it should not be shown | makes a front/back mismatch unarguable in three lines |
| **Regression wording discipline** — *"started occurring after deployment"*, never *"the deployment broke this"* | matches our honesty bar; now has a form of words |
| **Data/migration shape** — state before · expectation · state after | clean, and we had nothing for it |
| **`Expected Result / Product Clarification Needed`** when the requirement is ambiguous, showing both valid readings | this is Rule 58 with a heading; adopt the heading |
| **Never write an unconfirmed root cause as fact** | Rules 12 and 104 already say it; the guide's phrasing is sharper |
| **One ticket, one primary failure**, split unrelated ones | matches practice, now written down |
| **The final self-check list**, including the `blob:` trap and *"if image preservation is uncertain, do not overwrite the description"* | the strongest part of the guide; adopt whole |

## 2 · ALREADY OURS — keep as is, the guide agrees

Annotated screenshots kept and placed beside the step they prove · pictures inline, never pooled at
the bottom · front-end-first reproduction steps with real data · actual result stated as what was
observed · expected result taken from the specification or a recorded product decision.

## 3 · CONFLICTS WITH A RECORDED RULING — HELD FOR HIS DECISION

| # | The guide says | What he ruled earlier | Why I have not just followed the guide |
|---|---|---|---|
| **A** | Add a **`Technical Evidence`** section: HTTP codes, request ids, network bodies, backend observations | **2026-09-16/17 he removed the technical-details section**; the recorded layout ends at Sources, and *"no developer-details section"* is listed as company-wide (Rule 110/111) | Both instructions are his. The newer one is the guide, but it was written by a tool rather than dictated, so I am asking rather than assuming. **My recommendation: adopt it** — a network body genuinely helps a developer, and it sits below everything a non-technical reader needs. |
| **B** | Put **Environment last** | **2026-09-16: Environment second-to-last, Sources last** | Ours is the more recent explicit instruction from him in his own words. **Recommendation: keep ours.** |
| **C** | Call the source section **`Spec Reference`**, and its example paraphrases the requirement | Ours is **`Sources`** with the requirement **quoted verbatim**, plus page id, version and the date it was read | The verbatim quote is what ends arguments about what the specification says. **Recommendation: keep ours**, and treat the guide's shorter form as the minimum, not the model. |
| **D** | *"Do not over-explain obvious points"* — its example of over-explaining is close to an impact paragraph | **He struck impact paragraphs out by name on 2026-09-10**: *no assumed effects, no severity, no impact paragraph* | **No conflict — they agree, and I was the one out of step.** Acted on already: see below. |
| **E** | (silent on it) | Our recorded layout still lists a final **`Test cases`** heading, but **he removed case ids and run links from Jira descriptions on 2026-09-16/17** | The skill's table is stale on this row; it should be deleted when the skill is next edited. |

## 4 · A CORRECTION TO MYSELF, MADE TODAY

Yesterday I "restored" a **Why it matters** paragraph to SV-10238 and recorded it in L0167 as
load-bearing. It was an **impact paragraph**, which he had explicitly struck out on 2026-09-10, and
the guide independently says the same thing. Two sources against one opinion of mine.

**Removed from the ticket.** In its place, one factual sentence that states only what was observed:

> Adding a second valid search term removes a record that the previous search had already returned,
> and the search gives no indication that some of the typed words were ignored.

`L0167` is corrected to match. **What stays load-bearing is the evidence**: the memorable one-line
statement of the fault, the control case, the verbatim source, and the caveat where the specification
is silent — none of which is an impact paragraph.
