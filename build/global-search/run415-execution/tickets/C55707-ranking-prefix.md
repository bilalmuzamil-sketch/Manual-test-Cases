# FILED as SV-10211 on 17 September 2026 — https://shopview.atlassian.net/browse/SV-10211

Raised on his per-ticket go-ahead. `Story Defect` · parent `SV-9165` · priority `Medium` ·
`relates to` `SV-9165` · the annotated picture embedded inline at `|width=760,height=350!` (Jira
forced `height=183` on the plain `|width=760!` form — the true aspect had to be stated). The ticket
number has been appended to the check's comment in the run (Rule 113).

**Type** `Story Defect` · **Parent** `SV-9165` · **Priority** `Medium` · also link `SV-9165`
*relates to*.

**Owning story — gate passed (Rule 112).** `SV-9165` — *BE — Ranking engine: per-entity scoring,
cross-entity ordering and contextual bias* — status read **live from Jira on 17 September 2026**:
**Ready for QA**. A defect may be raised against it once the go-ahead comes.

**Rule 106 reconciliation, done before this was drafted.**

| | What it says |
|---|---|
| **The case's Expected** (read live from TestRail, C55707, 17 Sep 2026) | *"The record whose name STARTS with the query ranks highest, the whole-word match ranks next, and the typo-only (fuzzy) match ranks lowest."* |
| **The source as it reads today** (Confluence page **576978945**, **version integer 17**, read live 17 Sep 2026, §6.1) | *"Prefix match on primary name field → +0.70."* · *"Whole-word match anywhere in indexed fields → +0.50."* · *"Fuzzy match (see §7) → score scaled by similarity, max +0.40."* |
| **The build observed** (`v26.36.7-29ca209`, 17 Sep 2026) | prefix `0.90000004` · whole-word `0.90000004` · fuzzy `0.45` |

⇒ **The case agrees with the source and the build differs — a real defect.** The case needs no
correction.

**Re-measured at drafting time, 17 September 2026** (Rule 62-c): still reproduces, read twice.

**Ruled out before reporting (Rule 104):** both customers read `openWorkOrderCount: 0`, carry the
same address and telephone and have no contacts, so no entity-specific signal from §6.1 can be
lifting the whole-word row. The fuzzy row behaves correctly, which proves the ranking layer itself
is running — this is a positive control, not a dead instrument.

**Picture:** `C55707-prefix-vs-word.png` in this folder (1002×461, captured at 2× and downsampled).

---

## Title

`A Name Starting With the Search Text Ranks No Higher Than One Containing It`

## Wiki markup body (for `PUT /rest/api/2/issue/<KEY>` via jira.sh)

```
h2. Description

When several records match what was typed in different ways, the search is meant to put the *strongest kind of match* on top: a name that *begins* with the typed text outranks a name that merely *contains* it as a word, which in turn outranks a name reached only through a typo. The search recognises which kind of match each record is, but then scores the first two *identically*, so the stronger match earns no advantage and the order between them is left to chance.

For example, typing {{ZZPREFIX}} and opening the *Customers* tab:

* the name that only *contains* the typed text part-way through is returned *first*,
* the name that *begins* with the typed text is returned *second*,
* both are scored {{0.90000004}} - the same number to the last digit - even though the product has correctly labelled one a *prefix* match and the other a *word* match,
* only the typo-only match is scored differently ({{0.45}}) and placed last, which is correct.

h2. Steps to Reproduce

# Sign in and press {{Ctrl}} + {{K}} to open the search.
# Type {{ZZPREFIX}} and click the *Customers* tab.
#* Three customers are returned.
#* Line 1 is *Bolton ZZPREFIX Services* - the typed text sits part-way through the name.
#* Line 2 is *ZZPREFIX Freight Ltd* - the name begins with the typed text.
#* Line 3 is *ZZPREFIY Cartage* - reachable only through a typo, shown as a close match.
# Compare line 1 and line 2.
#* The stronger match is below the weaker one.
#* The three customers share the same address and telephone, have no contacts and no open work orders, so nothing else can be deciding the order.

!C55707-prefix-vs-word.png|width=760!

*Actual Result* - a name that begins with the typed text is scored exactly the same as a name that merely contains it, so it is not lifted above it and can be returned below it.

*Expected Result* - a name that begins with the typed text scores higher than a name that contains it as a whole word, and is returned above it; a typo-only match stays lowest of the three.

h2. Environment

QA branch [sv9160|https://sv9160.qa.shopview.com/customers], build {{v26.36.7-29ca209}}, observed 17 September 2026.

h2. Sources

*Global Search - Product Requirements*, Confluence page [576978945|https://shopview.atlassian.net/wiki/spaces/SV/pages/576978945], version 17, read 17 September 2026, section 6.1 "Per-entity score", match-quality component, quoted verbatim:

{quote}
Prefix match on primary name field -> +0.70.

Whole-word match anywhere in indexed fields -> +0.50.

Fuzzy match (see 7) -> score scaled by similarity, max +0.40.
{quote}
```

## The comment already sitting on the check in the run

The result is recorded **Failed** with the full finding and the words *"a report is prepared and is
with the QA lead, who approves each one before it is raised."* **When the ticket is created its
number is appended to that comment** (Rule 113).

## How the fixture was made sound (not for the ticket)

The check was Blocked earlier the same day: the record meant to be reachable only by a typo,
`ZZPREFIXX Cartage`, *starts with* `ZZPREFIX`, so the product read it as a prefix match and the
comparison proved nothing. Under the standing authorisation over test data it was renamed to
`ZZPREFIY Cartage` — a substituted letter, never an appended one — and the rename was read back
before anything was concluded. Learning L0162.
