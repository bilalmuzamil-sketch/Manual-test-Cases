# METHOD — how the unsourced-case survey was run, and what would make it wrong — 2026-08-11

**READ-ONLY. 0 `delete_case`. 0 `update_case`. 0 `add_case`. 0 Jira writes of any kind.**
This is a survey. The candidate list goes to the QA lead; nothing is executed.

---

## 1. Population — re-derived live, never carried forward

Pulled every section (626) and every case (4,089) in project 1 / suite 1, built the descendant section
tree of each project group, and split ours from foreign by `created_by`.

| Project | Group | Live total | **Ours** | Foreign | Foreign author |
|---|---|---|---|---|---|
| Filters | 4110 | 119 | **114** | 5 | user 7 — Ahtasham Amjad |
| Schedule | 4254 | 174 | **174** | 0 | — |
| Report Suite | 4281 | 488 | **476** | 12 | user 1 — Vladimir Tomovic |
| | | **781** | **764** | **17** | |

**Foreign cases were excluded and never opened for sourcing judgement** (Rule 38). Their sourcing is
not ours to audit. Where a number appears anywhere in these deliverables it is **ours**, and the live
total is given beside it.

## 2. Both source layers, checked separately, because they can disagree

**Layer 1 — the `refs` field** (Rule 20: ticket AND spec anchor, never ticket alone).
**Layer 2 — the Rule-54 provenance line** at the end of Expected Results.

| Check | Result |
|---|---|
| Cases with a non-empty `refs` | **764 / 764** |
| Cases with `refs` carrying **no** parenthetical anchor (ticket-only) | **0** |
| Cases with a Rule-54 provenance line | **763 / 764** — the one exception is **C29600** |
| Distinct Jira keys cited | 119 — **119 resolve live, 0 missing** |
| Cases citing a **deleted / never-defined** requirement | **0** |
| Cases citing a spec anchor that does not exist | **0** after hand-check |

## 3. Verifying the cited source actually EXISTS

Built a valid-anchor set per spec from the **live body**, then resolved every anchor in every `refs`:

- **Filters / the six report specs** — `S<n>-R<n>` style ids, matched against ids present in the live text.
- **Schedule** — the spec carries **no numbered requirements at all**; it is `§`-structured. Anchors were
  matched against the **41 real headings** parsed from the live body (1 … 15 plus subsections).
  **172 of 174 Schedule cases cite a section that exists in v27; 0 cite one that does not**; the other 2
  cite an epic story and the tech plan.

I also identified **5 ids that appear in a spec but are never defined** — SBC `S16-R6`, `S8-R14a`,
`S8-R14b`; WIP `S7-R7a`, `S9-E2`. Reading them in context, each appears **only in a changelog entry
recording its own deletion** ("deleted the S8-R14 expand gate, S8-R14a, S8-R14b"; "dropped S7-R7a";
"dropped S9-E2"). **No case cites any of the five.**

## 4. Verifying the cited source actually SAYS it — and the honest limit of that

Existence is the cheap half. The C29600 class is a case carrying a **real anchor that points at a
different requirement**, so each cited requirement's verbatim body was extracted and set beside the
case's own assertion (Rule 45(e)).

**Four independent detectors were used, because no single one finds this class:**

1. **Lexical coverage** of the case assertion against the cited requirement bodies. Triage only.
2. **Self-flagging text search** — cases whose own `refs`/Expected admit a gap ("no requirement",
   "spec is silent", "not in the spec", "no source", "says nothing", "confirmation requested").
   **25 hits.**
3. **Over-stretched-anchor detection** — requirements cited by many cases, then cases resting on a
   single heavily-reused generic anchor. **5 hits.**
4. **Assertion-family search** — once the C29600 gap was characterised, every Filters case asserting
   cross-filter combination was pulled and read. **7 hits.**

### 🔴 What was hand-read, stated exactly — this is NOT a claim about all 764

- **All 764** were mechanically checked for layers 1 and 2, anchor existence, and ticket existence.
- **Hand-read side by side against their cited requirement text: 100 cases** — the 100 lowest by
  lexical coverage — **plus** the 25 self-flagged, **plus** the 13 with no resolvable requirement body,
  **plus** the 5 over-stretched-anchor hits, **plus** the 7 combination-family hits, **plus** all 174
  Schedule anchor resolutions. After de-duplication that is **roughly 130 of 764 read closely.**
- **The remaining ~634 were not read assertion-by-assertion against their requirement text.** They sit
  at lexical coverage ≥ 0.26 against a requirement that exists and is on topic. **That is a screen, not
  a reading**, and it is the single largest limit of this survey.

---

## 5. ⚠️ What would make this answer wrong

**(a) The coverage heuristic would nearly have missed the one case we know about.**
**C29600 ranks 85th of 571** on lexical coverage (cov 0.25, median 0.52). It is in the bottom 15% but
**it was not in the bottom 25**. Had I hand-read only the obvious tail — and had the brief not named it
— **I would have missed it.** It was independently re-found by detectors 2, 3 and 4. **Anyone repeating
this survey should not trust coverage alone; it is why four detectors were used and why the hand-read
band was widened to 100.**

**(b) My own tooling was wrong twice, exactly as the brief warned. Both were caught by hand-check.**

- **Apparent finding:** C38909 cites `§8`, which does not exist in the Filters spec.
  **Reality:** `§3+§8` refers to the **engineering handover**, not the spec — my `§` regex scraped
  section numbers from anywhere in the `refs` string, including a handover citation. **The case is fine.**
- **Apparent finding:** 25 cases cite requirements with no body, including PV `S4-R6` and `S5-R7`.
  **Reality:** my indexer required a colon immediately after the id, and the spec writes
  `S4-R6 (view remembered per browser): …`. **This is the identical bug class the brief described — a
  pattern that disallowed a parenthetical in the requirement name.** Fixed; the false list fell from 25
  to 13, and body coverage went from 71/74 to **74/74** on PV and **132/132** on Filters.

**Neither error was found by the tool. Both were found by opening the spec and reading it.** No
"anchor does not exist" result reached `CANDIDATES.md` without being hand-checked first.

**(c) A case can be wrong in a way no detector here looks for.** These detectors find *missing* and
*mismatched* sources. A case whose cited requirement is real, on topic and **superseded** — the Rule 31
trap (c) failure, where a requirement is older than the ruling it is being used to overturn — is
**invisible to every check in this survey**. Establishing that needs a per-requirement diff across spec
versions, which was not done. **The 377 stale version pins in `SOURCE-CURRENCY.md` are where that risk
concentrates.**

**(d) Designs and Figma were not fetched.** Ten Filters cases cite Figma nodes. Under Rule 57 as
amended those are authoritative sources, so I verified the *other* sources those cases cite and did
**not** verify the node contents. If a node says something different, I would not have seen it.

**(e) Class (b) was excluded by search, not by proof of absence.** For every case I judged sourced, the
source was **named and verified present**. But "no document anywhere supports this" is a universal
negative. For the two cases where I make that claim I state exactly which documents were searched and
what was found — see `CANDIDATES.md`. **That is the honest strength of the claim: a thorough search of
the named sources, not a proof.**

---

## 6. The automated-marker precondition

Recorded for every candidate, from **both** places, because they measure different things:

- **The `AUTOMATION:` marker in the case text** — this asserts *automatable*, not *automated*.
  Live census: Filters 93 READY / 20 HOLD / 1 none · Schedule 146 / 28 / 0 ·
  Report Suite 431 / 43 / 2. **Three cases carry no marker: C29600, C30169, C30288.**
- **The TestRail field `custom_atmstatus`** — value labels read live from `get_case_fields`:
  `1 Not Automated · 2 Cannot be automated · 3 Automated · 4 Pending`.
  **75 of our 764 cases carry `atmstatus = 3` (Automated).**

**These two disagree, and the field is the one that matters for the QA lead's precondition.** A case can
read `AUTOMATION: READY` and still be `Not Automated`; **C29600 carries no text marker at all and is
`atmstatus = 3` Automated.** Anyone acting on his instruction must read the field, not the text marker.

## 7. Tools

Working scripts under `/tmp/unsourced/` (ephemeral): `pull.py`, `extract.py`, `reqindex2.py`,
`resolve.py`, `overlap.py`. TestRail read via `/tmp/tr_pull.py` (`get_*` only). Confluence and Jira read
via `/tmp/atlassian/jql.py`. No secret is recorded in this repository.
