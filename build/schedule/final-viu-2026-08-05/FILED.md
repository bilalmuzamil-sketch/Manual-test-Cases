# Schedule — tickets filed and deliberately not filed, 5 August 2026

## FILED: one

### [SV-8886](https://shopview.atlassian.net/browse/SV-8886) — Schedule scope picker: tick-box mode has no Select all and no Cancel, and the tally text differs from the spec

| Field | Value | Verified |
|---|---|---|
| Type | **Bug** | read back |
| Priority | **Low** | read back — Rule 53, always Low |
| Parent | **SV-8685** (the epic) | read back — Rule 52, never a story, never a subtask |
| Owning story | **SV-8689 Scope Picker**, linked **Relates** | read back |
| Product Area | **Schedule** (`customfield_10153`) | read back — mandatory, a create without it returns 400 |
| Status | **Open** | read back |
| Description | 7 sections in the required order | **byte-equal, 5,412 chars sent and returned** |

**11 field checks read back from Jira, all PASS.**

**Duplicate search run FIRST, and what was searched, stated:** four JQL queries over the whole SV
project — `text ~ "scope picker"`, `text ~ "Select all"`, `text ~ "Select multiple"`, and
`text ~ "Cancel button" OR text ~ "confirm bar"`. 100 results read. The only Schedule scope-picker
item is the **story SV-8689 itself**; none of the 22 existing story defects on this epic, and none of
Mudassir Qamar's or Ayesha Khan's tickets, covers it. **Not a duplicate.**

**Test data named by its on-screen name** (Rule 50's reproduction requirement): work order
**S-12876**, customer **Pamill Paving**, unit **713**, lines **"Replace - Rear ramp handles"** (1h)
and **"Quality control check over"** (no estimate), lead technician **Brittany Anderson**, placed on
technician **MQ Test Tech Qamar** for **Thursday, Aug 6**, at location **Staging Heavy Duty - 9919**.
The ticket also states what was ruled out: the fault does not depend on which multi-line work order
is used, and says how that was established.

**No barred content:** 0 references to our test cases, 0 C-ids, 0 TestRail links, and no
"branch is not final / this is provisional" hedge.

## DELIBERATELY NOT FILED

### 1. The C29939 technician-name search fault — already filed by someone else
**[SV-8873](https://shopview.atlassian.net/browse/SV-8873)** (Story Defect, **Ready to Fix**, parent
SV-8687, Mudassir Qamar, 5 Aug) reports exactly it. Our live evidence confirms it and goes further —
it names every form tried and shows the multi-word customer search works, so it is not a spaces
problem. **The ticket is not ours to touch (Rule 38); the evidence is recorded on our case and in
FINDINGS.md** so whoever fixes it has the exact strings.

### 2. SCH-MODAL-03 = C30010 — an eleventh ticket would be a duplicate
**[SV-8834](https://shopview.atlassian.net/browse/SV-8834)** already covers the time-logged bar
reading full when nothing was clocked. The case text used to say the fault *"has no developer ticket
yet"*; that was **false and has been corrected** to name SV-8834.

### 3. SCH-TOOL-03 = C30041 — likewise
**[SV-8874](https://shopview.atlassian.net/browse/SV-8874)** now covers the toolbar search removing
non-matching blocks instead of fading them. Same correction applied.

### 4. SV-8868's underlying question — a coverage question, not a defect of ours to raise
The Schedule status filter offers 8 statuses and 6 of them can never match, because the schedule list
is scoped to schedulable work while the org holds 1,200 work orders across 6 statuses. **The ticket
already exists and is Ready to Fix.** Our finding that the filter *mechanics* are correct (0 leaks
over all 8) is recorded for whoever fixes it, because it changes what the fix should be.

### 5. The API-only finding — STILL not filed, still waiting on the QA lead (Standing Rule 51)
`SCH-API-02` = [C38873](https://shopview.atlassian.net/index.php?/cases/view/38873)'s 409/422 series
limits are reachable only by calling the endpoint directly with a request no screen sends. **Rule 51:
an API-only defect is never filed on our own initiative, and no batch approval covers it.** It is
written up in `API-ASK.md` and needs an explicit yes or no.

### 6. The two contradictions with Branko's rulings — questions, not tickets
**SV-8835** (VIN on hover) and **SV-8829** (money in the shift modal) contradict Branko's rulings of
31 and 22 July. **Per Rule 33 the rulings STAND.** Neither ticket was touched and neither side was
changed. Our cases assert the rulings and disclose the divergence.

### 7. The specification's own left-click / right-click contradiction — reported, not ticketed
§7 says the cell menu opens on **left-click**; §14.1 and §14.2 both describe a **right-click context
menu** as an editing affordance a permission tier unlocks. Our cases follow §7 and the build agrees,
so no case is wrong — but **the specification needs correcting by Branko**, and a reader of §14 alone
would test the wrong gesture. This is a document defect, not a build defect, so it is an ask rather
than a Jira bug.
