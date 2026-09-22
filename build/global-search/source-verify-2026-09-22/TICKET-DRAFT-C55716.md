# PREPARED, READY TO SEND — waiting only on a live sign-in to re-measure (Rule 62-c, skill 06 §6e)

**He instructed this ticket on 22 September and supplied the reproduction steps himself.** All the
filing gates pass:

| Gate | State |
|---|---|
| His per-ticket go-ahead (62 / 113) | **given** — *"For this create a ticket with a proper Quote from the Sources"* |
| Owning story in Ready for QA or Testing QA (112) | **SV-9165 — TESTING QA**, read live 22 Sep |
| Nothing already filed (97) | **nothing** — searched for recency, tie and recently-updated since 1 Sep |
| The source quote (114 / 106) | **verbatim below**, page read live 22 Sep, version 17 |
| Reproduced at the moment of filing (62-c, §6e) | **NOT YET** — the branch sign-in expired; this is the only thing outstanding |

**Why his steps are better than anything I built.** Changing a name's capitalisation is a change
search **indexes**, so the entry must rebuild — and search is **case-blind** (proved by C55671), so
match quality cannot move. Every nudge I tried on jobs failed one of those two tests: engine hours
is not indexed, the technician assignment saves nothing, and adding a line flips the job to
Approved, which outranks the rule. **His fixture has neither flaw.**

---

**Fields:** `issuetype` **Story Defect** · `parent` **SV-9165** · `priority` **Medium** ·
also link SV-9165 *relates to* · no Product Area.
**Route:** `PUT /rest/api/2/issue/{KEY}` via `build/atlassian-login/jira.sh` (wiki markup).

**Title:** `Global Search Does Not List the Most Recently Updated Record First When Two Tie`

---

h3. Description

When two records match a search equally well, global search is meant to break the tie by putting the
one that was changed most recently at the top.

It does not. Two records that are alike in every way keep their original order no matter which one
is edited, so a record somebody has just worked on stays below an identical one nobody has touched.

h3. Steps to Reproduce

# Add *two vendors* with the same full name and the same details.
# Open global search and type that name.
#* both vendors appear in the results
# Note which one is listed first.
# Edit *one* of them: change the first letter of the last name to lower case, so one reads for example {{Halloway brothers}} and the other {{Halloway Brothers}}. Change nothing else.
# Search for the name again and read the order.

h3. Actual Result

The order is unchanged. The vendor that was just edited is still listed where it was.

*QA Example:*

* Two vendors both named {{ZZTIEVEND Halloway Brothers}}, same telephone and same address
* Search {{ZZTIEVEND}} — both appear
* The second one is renamed {{ZZTIEVEND Halloway brothers}}, nothing else touched
* Search {{ZZTIEVEND}} again — the renamed one is *still second*

h3. Expected Result

The vendor edited most recently is listed *first*, because everything else about the two records is
identical and recency is the rule that decides a tie.

h3. Environment

QA branch [https://sv9160.qa.shopview.com|https://sv9160.qa.shopview.com] · build
{{v26.36.8-2a96702}} · signed in as an administrator · desktop · observed 22 September 2026.

h3. Sources

*Global Search - Product Requirements*, Confluence page 576978945, version 17 (v1.5 in the body,
last updated 8 September 2026), read live on 22 September 2026. Section 6.1, Ranking, reads:

{quote}The score is clamped to a sane range; ties are broken by recency (most recently updated wins). Because search returns at most 20 records per entity type (§5.2), ranking quality is what decides whether the record the user wanted is reachable at all.{quote}

Two vendors identical in every indexed field score identically, so this sentence is the only thing
that decides their order — which is what makes it testable at all.

---

## Pre-answering the challenge this will draw

**"Capitalisation is not a real change, so nothing was reindexed."** It is indexed: the vendor's
name is a matched field (§4), and the lower-case spelling becomes visible in the result row, which
is proof the entry rebuilt. And it cannot distort the comparison, because matching is case-blind —
covered by its own passing check, C55671, where the same company is returned for `bridgeport`,
`BRIDGEPORT` and `BrIdGePoRt` alike.
