# OUTSTANDING — what I need from you (epic SV-8582 re-read, 2026-08-04)

> Standing Rule 36: every report ends with this section, and it is **never omitted** — if nothing is
> outstanding it says so. All six categories are swept below, in order, whether or not they have items.
> Items blocked on the QA lead himself carry the **five Rule-48 fields**.

---

## THE ONE-LINE VERSION

**One thing would materially improve this work: a fresh Atlassian session cookie**, so the epic can be
re-read live instead of from a 4-day-old snapshot. Everything else is either already ruled on by you,
or is a recommendation waiting on your go-ahead.

---

## 1 · MISSING SOURCES

| What is missing | Who owes it | What it BLOCKS | Since |
| --- | --- | --- | --- |
| **A live read of epic SV-8582.** No Atlassian MCP is configured and no credential survives in `/tmp`; `GET /rest/api/3/myself` returns **HTTP 401**. I worked from the committed 2026-07-31 snapshot. | **You** (a cookie header), or dev/IT (an API token) | The re-read cannot be certified **CURRENT** — only **PARTIAL**, with a 4-day blind spot (2026-07-31 → 2026-08-04). A description edit, status move, new comment or new child in that window is invisible to me. **The two-way child-count JQL also could not be re-run for today.** | 2026-08-04 (this run) |
| **Jira development-panel data** (linked PRs / branches / commits per ticket) — not returned by `fields=*all`. | Same credential | Nothing testable. Recorded only so "no linked PRs" is not over-claimed: it is verified **for ticket bodies**, not for the dev panel. | 2026-08-04 |

**Exactly what to give me, and where it goes:**

> Write your Atlassian session cookie header to **`/tmp/fd-tickets/all-cookie-header.txt`** — the path
> `build/epic-recheck-2026-07-31/fetch_epic.py` already reads. Then that fetcher plus
> `epic-reread-2026-08-04/extract.py` reproduces this entire analysis against live data in a few
> minutes. **A cookie is short-lived and `/tmp` is wiped between sessions, so this will need
> re-supplying each time** — an **API token** would end the problem permanently.

**Not missing:** the six Confluence spec pages (all held; five of six were confirmed same-version as
live on 2026-08-03, SBC refreshed to v13), the engineering tech plan (Rule 30 — held and reconciled),
and designs (none exist for this project, spec-only by decision).

---

## 2 · UNANSWERED QUESTIONS — PO or dev

| Question | Who owes it | What it BLOCKS | Since |
| --- | --- | --- | --- |
| **NEW — the epic says "All Time stays on WIP only", the build story says WIP uses a 366-day capped selector.** Which is right? Our cases say **no report offers All Time**, on all six. | **Chris Ward** (product) / dev (epic text) | Nothing in our suite — we are consistent and sourced (`REQ-E3`). But while the epic sentence stands, **a reviewer reading it would report a false defect** ("WIP is missing All Time"). This is a paperwork fix, not a test fix. | **2026-08-04 (new today)** |
| **NEW — the epic says "single visual theme (two-tone)", but the six build stories assign two different themes** (PV + SBC two-tone; WIP, TU, IV, SBR all-white). | **Chris Ward** / dev (epic text) | Nothing — our six visual cases match their build stories **6/6** (`REQ-E4`). Same false-defect risk as above. | **2026-08-04 (new today)** |
| **Print: sweep the two leftover spec lines.** SBC v13 retired Story 16, but **S18-R7** and **S18-R10** still read *"Exports (CSV, PDF, **Print**)"*. | **Chris Ward** | No test change. A reader can still find "Print" in a current spec version and conclude the feature exists. **LOW.** | 2026-08-03 (re-confirmed today) |
| **Close SV-8614** — *"SBC – Story 16 – Print the report"*, still **Open**, never transitioned, for a feature Chris removed on 2026-07-29 and which **does not exist on the build**. | **dev / board owner** (parth fadadu ran both prior sweeps) | An Open ticket is a standing instruction to build the thing. If someone picks it up, **SBC-EXP-01 = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) would fail a build that did exactly what its ticket asked.** Keeps `RECHECK-QUEUE` row B9 open. | 2026-08-03 (evidence completed today: it is the **only** Print ticket in all 97 children) |
| **The SBR Esc-to-dismiss decision.** Spec S13-R8 wants Escape to close the deactivation dialog; Golden Rule #9 forbids Esc. **Engineering explicitly declines to decide** — SV-8599 says *"surface as decision"*. | **Chris Ward** | **SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255)** currently asserts Escape does *not* dismiss. Cannot be closed by us, by the spec, or by a live check — **only by the PO.** | 2026-07-31 (unchanged) |

---

## 3 · MISSING GO-AHEADS / AUTHORISATIONS

**Nothing has been authored, staged or pushed.** These are recommendations from
`NEW-OR-CHANGED-REQUIREMENTS.md` §8, in the order I would argue for them.

| # | Ask | What it BLOCKS | Priority |
| --- | --- | --- | --- |
| 1 | **3 new cases** — empty-set export produces a header-only file, on **PV, TU and IV** (`REQ-A3-4`). Covered today on SBC, SBR and WIP only. | A shared export rule whose failure mode **reads as a bug**: a tester filtering to an empty result and exporting sees either a header-only file (correct), nothing, or the *too-large* toast (a real defect — the cap guard mis-firing at zero). With no case, whatever happens gets accepted. | **Recommended** |
| 2 | **Extend 5 persistence cases** — a saved view beats a link/URL parameter (`REQ-A5-1`). Asserted today on **SBC only** ([C30179](https://shopview.testrail.io/index.php?/cases/view/30179)). | The most **counter-intuitive** behaviour in the shared shell — most people expect a shared link to win. A tester sharing a WIP or SBR link and finding their own saved range applied has no case telling them that is correct. | **Recommended** |
| 3 | **4 small extensions** — IV 366-day cap ([C30566](https://shopview.testrail.io/index.php?/cases/view/30566)); clock-edit-after-invoicing on SBC's Inv. Hrs; two contacts at one company = one SBC row; export delivery convention on [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) (API, low value). | Hygiene. Each closes a shared rule asserted on some reports but not all. | Medium / low |
| 4 | **Version-pin two closed enumerations** (Rule 42) — PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) *"exactly the eleven bounded options"* and SBR-STAT-01 = [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) *"exactly four options"*. | Both are the shape that **fails a correct build** if the list grows. C30208 is the sharper risk: it depends on a payment mapping engineering itself calls the *"most bug-prone point"*, pending Minja's payments rewrite. | Medium |
| 5 | **Add a tester note** to the PV netting cases: quantities before the precision fix were stored as whole numbers, so very old fractional movements may not reconcile — expected, not a bug (`REQ-PR1-2`). Also needs a **shipped-date from dev**. | A tester reconciling PV over an old window could raise a bug against unreconstructible historical data. | Low |
| 6 | **Mark our own stale spec mirror superseded** — `build/report-suite/specs/sbc-sales-by-customer.md` still carries **the full original Story 16 Print** (S16-R1…R6) and an S14-R1 naming *"Print"*. | Anyone reading that file concludes Print is a live requirement. It is our file, it is wrong, and it is a genuine foot-gun. **Outside my folder, so untouched.** | **Cheap and worth doing** |

---

## 4 · ACCESS / CREDENTIALS

| What | Who | What it BLOCKS | Since |
| --- | --- | --- | --- |
| **Atlassian session cookie or API token** — see §1. | **You** | The live confirmation of this entire re-read. | 2026-08-04 |

**Already in hand, not re-asked:** the Report Suite QA branch (`sv8582.qa.shopview.com`, build
`v3.4.1-0ed4433`, access proven 2026-08-03) and the TestRail API.

---

## 5 · DECISIONS YOU DEFERRED OR HELD — the five Rule-48 fields

### 5.1 SV-8780 — out of scope by your own ruling (NOT an ask)

1. **The ruling, verbatim:** *"Ignore this ticket."*
2. **When and in what context:** **2026-08-03**, answering whether we should post the drafted follow-up
   comment on **SV-8780** — the Story Defect we filed under SV-8598 about the SBC permission atom.
   Recorded at `build/OUTSTANDING-ITEMS-REGISTER.md` under *"OUT OF SCOPE BY YOUR RULING — SV-8780"*.
3. **What it blocks:** nothing in the suite. It is the **only** ticket in the epic tree I did not read —
   it post-dates the 2026-07-31 snapshot, so a live credential would surface it. Because of your ruling
   **I did not attempt to read it**, and it is **not** counted as a gap.
4. **Why the ruling was reasonable:** the underlying question it was filed about — whether SBC needs its
   own permission — **was settled the same day by you** (*"Yes all the reports will be gated by ONE
   permission FOR NOW"*) and by Chris's ruling that the built atom is **hidden and left inert**. The
   ticket had already been overtaken by decisions, so chasing it would have re-opened a closed
   question. **Nothing I found today changes that** — SV-8598's own text is the older source and loses
   to Chris's ruling under Rule 32.
5. **What would unblock it:** only you reversing the ruling, and I see **no reason to suggest that**.

### 5.2 Everything else you have already ruled on — listed so it is not re-asked

- **Vladimir Tomovic's 5 automation cases** — *"do NOT message Vladimir"* (2026-07-31). Untouched,
  hands-off per Rule 38. **Nothing outstanding.**
- **One suite-wide permission** — *"Yes all the reports will be gated by ONE permission FOR NOW"*
  (2026-08-03). My re-read **confirms this is the right call against SV-8598's contrary text**, because
  Chris's ruling and the updated spec are the newer sources (`REQ-B5-1`).

---

## 6 · WHAT ANOTHER TEAM OWES

| What | Who | What it BLOCKS | Since |
| --- | --- | --- | --- |
| **Close SV-8614** (Print) | **dev / board owner** | See §2. The single highest-value paperwork fix. | 2026-08-03 |
| **Sweep Print from S18-R7 / S18-R10** | **Chris Ward** | See §2. LOW. | 2026-08-03 |
| **Correct the two epic sentences** (All Time; single theme) | **Chris Ward / dev** | Nothing in our suite; prevents false defect reports. | **2026-08-04** |
| **A "branch is final" signal** for `sv8582` | **Engineering** | Standing Rule 49: **35 rows of `viu-2026-08-03/RECHECK-QUEUE.md` are PENDING** and no Report Suite deliverable may claim VIU-complete while it is OPEN. | 2026-08-03 |
| **Ship PR-1 (SV-8589)** — the only In Progress ticket; **blocks B3 (PV)** | **Dev** | PV Units Sold precision. Also carries a permanent caveat: *"Forward-only (historical truncation unreconstructible)"*. | pre-existing |
| **The A4 backfill-NULL risk** — if the branch deploys before `BackfillInvoiceFinancialColumnsCommand` finishes, older invoices carry NULL financials and **SBC/SBR money columns may read blank or zero, which looks exactly like a calculation bug** | **Dev** (confirm backfill ran) | Could produce a batch of false VIU failures on SBC/SBR. **Worth asking before the next VIU pass.** | **2026-08-04 (new today)** |
| **The B4 sizing gate** — SV-8597 warns `inventory_value_snapshot` could reach 50–200M rows/yr fleet-wide without retention | **Dev** | If unbounded, IV as-of queries could be slow enough to read as a hang. Retention is specified (≤13mo daily → monthly) and covered by IV-API-05/06; this is a "did they actually apply it" question. | **2026-08-04 (new today)** |

---

## SUMMARY — what I actually need from you

1. **An Atlassian credential** (cookie now, or an API token permanently) — the only thing that turns
   this **PARTIAL** re-read into a **CURRENT** one and closes the 4-day window.
2. **A go-ahead on items 1 and 2 of §3** — the 3 empty-export cases and the 5 persistence extensions.
   Those are the only two gaps I would argue for on merit.
3. **A nudge to Chris and dev** on the Print ticket and the two wrong epic sentences — all three are
   other people's paperwork, none of them touches a test case.

**And the direct answers to your two questions:** the six reopened stories **did not change scope** —
it was an erroneous bulk close reversed by the same developer 48 hours later, with **no description
ever edited**. **SV-8614 should be closed**: five sources agree Print is gone, including the running
build, and only three stale artefacts say otherwise.
