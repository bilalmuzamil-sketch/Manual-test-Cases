## 1 · Do all the failed checks have a report attached?

**Thirteen of the sixteen do. Three do not — and none of those three is a fault.**

| | How many | |
|---|---|---|
| Failed, with a report raised | **13** | seven of mine, six from the other stream |
| Failed, no report | **3** | all three are our own wording, waiting on your decision, not on a developer |

The three without: the count of twenty, and the two phone ones. **One of those has changed since this morning** — I read the requirement page live and it says, word for word, that no count anywhere in the search reads higher than twenty, *not even a tab*. Our check is right and the product is wrong. That one is now a real fault waiting for your word, not a wording question.

---

## 2 · Which piece of work has how many faults left to fix

Read live today. **Fourteen faults are still open across seven pieces of work.** None of them can be signed off until those are fixed.

| The piece of work | Still to fix | Fixed, waiting for you | Already verified | Total |
|---|---|---|---|---|
| Search index - making every record findable | **2** | 1 | 9 | 13 |
| Matching - typos, part-words, identifiers | **3** | — | 1 | 4 |
| Ranking - what comes first | **2** | — | 0 | 2 |
| The search box itself and its states | **2** | — | 1 | 3 |
| What each result line shows | **3** | — | 0 | 3 |
| Keyboard use and accessibility | **1** | — | 0 | 1 |
| Wiring the box to the search, errors, page context | **1** | — | 0 | 1 |
| The tab strip and its counts *(this work is obsolete)* | 0 | — | 5 | 5 |


**In plain terms:**

- **What each result line shows — 3 left.** The part-sale line, the vehicle line, and the status colours. All three are mine, raised today.
- **Matching — 3 left.** Typos, part-words and finding a vehicle by year and make. One of those three is itself stuck and cannot be worked on.
- **Search index — 2 left**, and one more **already fixed and waiting for you to check it**.
- **Ranking — 2 left.** Contact-name ranking, and parts already on a work order.
- **The search box and its states — 2 left.** One is a general tidy-up that is being worked on now.
- **Keyboard use — 1 left.** The highlight moving when the mouse passes over the results.
- **The wiring — 1 left.** The missing *Show all* link.

**The tab strip** is the one piece of work that has every fault cleared — but that work is **obsolete**, so signing it off means nothing.

---

## 3 · Is anything ready for you to verify right now?

**No whole piece of work is fully cleared and waiting — but there are four things you can act on today.**

**One fault is fixed and sitting waiting for a check.** It is under the search index work and it is about work orders no longer being findable by typing their number. The developer has finished it. **Nobody has verified it.** That is yours to pick up whenever you want it.

**Four pieces of work have no faults against them at all:**

| The work | Where our checks stand on it | Can you sign it off? |
|---|---|---|
| The search infrastructure decision | Nothing to test — the only thing left on it is writing the decision down | **Yes, on that basis.** It is not a QA question. |
| Recording what a person recently looked at | Four of five checks pass; one is held only because the older date headings cannot be produced on a fresh branch | **Nearly.** Accept the *Today* grouping as the part that can be checked and it is clear. |
| Keeping the last search and grouping recent ones by time | Every check on keeping the last search passes | **Nearly**, same single held check as above. |
| The search itself, scoped and permission-aware | Five of six checks pass; one is held only because the second organisation has nothing searchable in it yet | **Nearly.** Put one customer and one work order into that second organisation and it is clear the same day. |

**So: two small pieces of data are the only thing standing between you and signing off three of those four.** I asked for one of them earlier; the other clears itself with time.

---

## 4 · Do all the live pieces of work have checks covering them?

**Yes for everything the product actually does. Three have no checks, and in each case that is correct rather than a gap.**

| The work | Covered by | 
|---|---|
| Search index — every record findable | The whole regression set, plus the purchase order and vendor invoice checks |
| Matching — typos and part-words | The fuzzy matching set |
| Ranking | The ranking set |
| The search box and its states | The opening and keyboard set, the empty state, the no-results state |
| What each result line shows | The result shape set |
| Keyboard use and accessibility | The opening and keyboard set |
| Recently viewed, and keeping the last search | The recent activity and persisting sets |
| The search, scoped and permission-aware | The permissions set |
| Wiring, errors and page context | The error state set, plus the phone checks |

**The three with nothing, and why that is right:** one is our own test plan, one is the release switch-over, and one is about showing the unit number on the Schedule screen — **that last one is a different feature altogether and does not belong in this suite at all.** If you want it covered, it needs its own checks somewhere else.

**One real weakness worth fixing, and it is ours.** Almost every check in our suite points at the overall project rather than at the individual piece of work inside it. That is why this answer took reading and judgement rather than a single look. **I can put the right piece of work on every check** so that next time you can see the coverage at a glance, and so a developer closing one can see exactly what will be run against it. Say the word and I will do it.

---

## OUTSTANDING — what I need from you

**1. The count of twenty.** The requirement page says no count anywhere reads higher than twenty, not even a tab. The All tab reads 44. **Your ruling this morning said the opposite.** Which stands? If the page, I raise it as a fault today. If your ruling, I correct our check. **Cost of leaving it:** one failure sits unexplained and one piece of work cannot be cleared.

**2. One customer and one work order inside the second organisation** — and the search work can be signed off.

**3. Shall I put the right piece of work on every check?** About two hundred checks. It makes every question you just asked answerable in one look, for you and for the developers.

**4. Still open from earlier:** the eleven checks behind obsolete work, and whether to retire the no-home-branch check.

---REFERENCE---

**Read live from Jira, 17 September 2026.** All Story Defects under every child of epic SV-9160.

| Story | Status | Open / In Progress / Blocked | Done (awaiting QA) | QA Complete | Obsolete | Total |
|---|---|---|---|---|---|---|
| [SV-9163](https://shopview.atlassian.net/browse/SV-9163) BE — Search index | Ready for QA | **SV-10001** (Open) · **SV-10199** (Open) | **SV-10008** | 9 | SV-10110 | 13 |
| [SV-9164](https://shopview.atlassian.net/browse/SV-9164) BE — Matching pipeline | Ready for QA | **SV-10025** (Open) · **SV-10055** (Open) · **SV-10060** (Blocked) | — | 1 (SV-10058) | — | 4 |
| [SV-9165](https://shopview.atlassian.net/browse/SV-9165) BE — Ranking engine | Ready for QA | **SV-10161** · **SV-10188** | — | 0 | — | 2 |
| [SV-9168](https://shopview.atlassian.net/browse/SV-9168) FE — Modal shell | Ready for QA | **SV-10181** (Open) · **SV-10068** (In Progress) | — | 1 (SV-10059) | — | 3 |
| [SV-9170](https://shopview.atlassian.net/browse/SV-9170) FE — Entity result rows | Ready for QA | **SV-10163** · **SV-10178** · **SV-10186** | — | 0 | — | 3 |
| [SV-9171](https://shopview.atlassian.net/browse/SV-9171) FE — Keyboard & WCAG | Ready for QA | **SV-10061** | — | 0 | — | 1 |
| [SV-9174](https://shopview.atlassian.net/browse/SV-9174) FE — Integration | Ready for QA | **SV-10159** | — | 0 | — | 1 |
| [SV-9169](https://shopview.atlassian.net/browse/SV-9169) FE — Scope tab strip | **OBSOLETE** | — | — | 5 | — | 5 |

**14 defects outstanding across 7 stories.** No defects at all on: SV-9161, SV-9162, SV-9166, SV-9172, SV-9175, SV-9176, SV-9307–SV-9313, SV-9594, SV-9167, SV-9173, SV-9306, SV-9310, SV-10031.

**Failed checks in run 415 (16) → ticket → parent story**

| Case | Ticket | Parent story |
|---|---|---|
| C44825 | SV-10159 | SV-9174 |
| C44833 | SV-10178 | SV-9170 |
| C44836 | SV-10163 | SV-9170 |
| C44838 | SV-10186 | SV-9170 |
| C44854 | SV-10188 | SV-9165 |
| C45139 | SV-10161 | SV-9165 |
| C44865 | SV-10181 | SV-9168 |
| C45153 · C53601 | SV-10001 | SV-9163 |
| C53605 | SV-10055 | SV-9164 |
| C55660 | SV-10060 · SV-10025 | SV-9164 |
| C55685 | SV-10025 | SV-9164 |
| C55673 | SV-10061 | SV-9171 |
| **C53476** | **none** | would be SV-9169 (OBSOLETE) — see the conflict below |
| **C45132 · C45136** | **none** | SV-9168 / SV-9174 — pending a decision on the mobile wording |

**🛑 Rule 63 conflict, still open.** Confluence 576978945 v17 §5.2, read live 2026-09-17:
*"Counts are capped at 20. No count in the modal reads higher than 20 — not a tab, not a group
header, not the Show all N link."* The All tab reads **44**. The QA lead's 2026-09-17 ruling said
the cap is per type and the All tab may total more. **C53476 left Failed and unticketed pending his
call.** Note its natural owner, SV-9169, is OBSOLETE — if it is filed it needs a parent decision.

**Coverage mapping** (derived from section → story; our cases cite the epic, not the story):
6721 → SV-9168/9171 · 6722, 6723 → SV-9169 · 6724 → SV-9170 · 6725 → SV-9164 · 6726 → SV-9165 ·
6727, 6730 → SV-9168 · 6728 → SV-9166/9172 · 6729 → SV-9172 · 6732, 6737 → SV-9306 ·
6733, 6738 → SV-9174 · 6734 → SV-9162 · 6739, 6740, 6769, 8056 → SV-9163/9164 · 6774 → SV-9173 ·
6767 → SV-9167.

**No coverage, correctly:** SV-9175 (our own test plan) · SV-9176 (rollout / old-path removal) ·
**SV-9594 (unit number on Schedule work orders — a different feature; belongs in another suite).**

**203 cases sit in the Global Search sections; 155 of them cite only the epic SV-9160.** That is the
weakness behind the proposal in item 3 of the asks.

**Run 415:** 135 Passed · 16 Failed · 11 Retest · 3 Blocked · 1 Untested —
https://shopview.testrail.io/index.php?/runs/view/415
