# SOURCE-CURRENCY — Filters requirement→case re-derivation, 2026-08-06

Standing Rule 31 pre-flight, run **before** any analysis. **This pass makes no writes at all**, so
Rule 59's second read is recorded as a re-probe of the build marker rather than a pre-write check.

| Source | Identifier | Version / last updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 19**, published **2026-08-06T11:48:47Z** by Branko Cicovic, comment *"S1-R3: filter chips display a leading type-icon per filter (align PRD with design decision / SV-8986)"* | 15:41Z | **CURRENT** — unmoved since the earlier pass this morning. Body still reads *"Version: 1.6"* (Rule 31(a) trap, confirmed again) |
| Specification — requirement inventory | 132 anchored requirements in §7, extracted from the live body | v19 | 15:41Z | **CURRENT** — 104 `R` + 24 `N` + 4 `E`, 0 duplicate anchors; anchor set **byte-identical** to the sibling pass's independent flatten |
| Epic + child stories | **SV-8785** | **19 direct children**, verified two independent ways (`parent=SV-8785` → 19 and `"Epic Link"=SV-8785` → 19, **key sets equal**, `isLast: true`, no paging remainder) | 15:52Z | **CURRENT — but see the discrepancy note below** |
| Story defects under the 14 stories | 18 `Story Defect` children of SV-8786…SV-8799 | newest **SV-9000**, 09:51Z today | 15:55Z | **CURRENT** — used as an outside-in coverage signal, not as a source of expected behaviour |
| Branko's recorded answers | 2026-07-17 (R1 Q4) · 2026-07-20 (R2) · 2026-07-31 (R3 Q5) · 2026-08-04 | read from the committed ingest files | 15:30Z | **CURRENT** |
| Designs (Figma) | file `DR4gEODShYgJqkozs3mF5q`, captured in `build/filters/design-notes.md` | no Rule-35 queue open for Filters (closed 85/85, 2026-07-31) | 15:35Z | **CURRENT** — and load-bearing this pass: it settles G2 |
| Engineering tech plan | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | 2026-07-29 | 15:35Z | **CURRENT but NOT a source of expected behaviour** (Rules 30/57). One case rests on it alone — see ORPHANS.md |
| Build (app) | `sv8785.qa.shopview.com` | **`v3.4.2-d235f37`**, last-modified **Thu 06 Aug 2026 15:35:46 GMT**, etag `08ca96ac75d36af2c116d5a1077ae2d7`, `index.html` sha256 `8b54c256eda891de2e53f51d584dbe3be5695eb47fdca06bcdb0d4a00e10fb33` | 15:58Z | **REDEPLOYED AGAIN — third marker today** |
| Build (API) | `sv8785api.qa.shopview.com` | `GET /api/auth/me/fe-permissions` → **HTTP 200** | 15:58Z | **ALIVE — this contradicts the brief.** See below |
| PO write-up for **Parts and Reports** | Branko | **STILL NEVER SUPPLIED** | — | **MISSING** — 11 cases sit on HOLD for it; fourth week of asking |
| Per-table searchable-field list | engineering | **NEVER SUPPLIED** | — | **MISSING** — `S13-R23` says so in its own text; see GAPS.md G8 |

**No verdict in this pass rests on a live observation.** A coverage re-derivation is entirely
document-side (Rule 57: expected behaviour comes from the documents, never from the build), so the
build's state is recorded and not used.

---

## 1. THE SIGN-IN IS ALIVE, AND THE BUILD HAS MOVED A THIRD TIME TODAY

The brief said the shared sign-in had expired estate-wide and returned HTTP 401 on all three
branches. **At 15:58Z it returned HTTP 200 on the Filters API**, using
`/tmp/qa-cookies/filters-cookie-header.txt` as-is. `quick-login` and `switch-user` were **not
called**, as instructed.

The build marker has moved three times today:

| Marker | `last-modified` | Seen by |
|---|---|---|
| `v3.4.2-d00239b` | Tue 04 Aug 22:51:02 GMT | the 5 August full live pass — **this is the build all 104 provenance lines still name** |
| `v3.4.2-280ca5a` | Thu 06 Aug 09:37:49 GMT | the Vlad-review pass, 12:10Z today |
| **`v3.4.2-d235f37`** | **Thu 06 Aug 15:35:46 GMT** | **this pass, 15:58Z** |

The brief named `v3.4.2-ef30acc`, which is a **fourth** marker nobody in this pass observed. So the
branch has been rebuilt at least three and possibly four times in one day. Under **Rule 60(b)** each
rebuild invalidates the on-screen labels, the pass/fail verdicts and the `HOLD` half of the
automation markers — **and nothing else**, because expectations come from documents.

**What that means for this pass, stated plainly:** the coverage verdicts below are unaffected by any
of it. The verdicts that *are* affected are the 110 pass/fail results from 5 August, which now name
a build three deploys old. That is already tracked in the open Rule-49 queue.

---

## 2. THE EPIC CHILD COUNT: 19, NOT 23 — AND I ESTABLISHED WHY

The sibling pass recorded **23 direct children at 11:58Z**. I measured **19** at 15:52Z, two
independent ways with equal key sets and no paging remainder. Rather than pick one, I traced it.

**Four issues left SV-8785's direct children today, and Jira's changelog names each move:**

| Issue | What happened | When (−0500) | By |
|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | parent `SV-8785 → None` | 09:25:43 | Bilal Muzamil (our shared account) |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | parent `SV-8785 → None` | 09:25:56 | Bilal Muzamil (our shared account) |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | parent `SV-8785 → None` | 09:26:12 | Bilal Muzamil (our shared account) |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | `Bug → Story Defect` **and** parent `SV-8785 → SV-8797`, one atomic action | 09:19:39 | Ahtasham Amjad |

**23 − 4 = 19, and the arithmetic works — but the timing does not.** All four moves happened
between **09:19 and 09:26**, which is **before** the sibling pass measured 23 at 11:58Z. So the
earlier figure of 23 cannot be reproduced from Jira's own history and I could not establish how it
arose. **Recorded as an unresolved discrepancy, not resolved by preferring my own number.**

**Rule 53's corollary applies to the first three:** they were de-parented **under our own shared
account**, which is how the QA lead's own edits appear. That is his triage. **Nothing was
re-parented back.**

The 19 are: the **14 stories** (SV-8786…SV-8799) · **4 clarification Tasks** (SV-8825, SV-8876,
SV-8904, SV-8906 — all `Done` except SV-8906, `Board Backlog`) · **1 Story** SV-8901
("Miscellaneous QA Environment Issues (non-Filters)", `Open`).

**Story statuses moved since the last record:** SV-8787, SV-8788, SV-8791 and SV-8794 are now
**QA Complete**; SV-8792 is **TESTING QA**; the other nine stories are **Ready for QA**.

---

## 3. RULE 31 TRAP (c), APPLIED SIX TIMES — AND IT CHANGED TWO ANSWERS

Trap (c) says: **date a requirement by diffing its own text across spec versions, never by the
page's version or last-updated date.** I fetched all **19 versions** of the page and searched each
for six specific sentences. The result is a birth date per requirement:

| Sentence | First appears | Last edited | Consequence |
|---|---|---|---|
| §4 Key Decisions *"Status filter is hidden on the Estimates and Completed tabs…"* | **v1, 2026-05-13** | never | **Strengthens the Status-chip finding.** There are **TWO** copies of the disputed "hidden" text, and this one is **older than S9-R2's v4** — so both predate Branko's 17 July answer by over two months |
| §4 Key Decisions *"…unlike the filter dropdowns which use targeted copy ('Search customer', 'Search technician')"* | **v7, 2026-07-26** | never | **This is the finding of the pass.** The document was live **nine days before** our 4 August pass replaced that expectation with the build's generic `'Search'`. See GAPS.md **G2** |
| `S7-R2` *"followed by a count of additional selections"* | **v1, 2026-05-13** | never | Long-standing, and it contradicts its own example in the same sentence. Trap (c) rescues neither reading — Branko must choose. **G3** |
| `S13-R21` *"All query behaviour is identical across breakpoints…"* | **v7, 2026-07-26** | never | Live for 11 days, **never mapped, never cited by any case**. **G6** |
| `S13-R22` *"…the scope of this requirement is wider than the S14-R6 surface list…"* | **v12, 2026-07-28** | never | Live for 9 days, uncovered. **G7** |
| `S14-R5` *"QA should treat this as an app-wide sweep, not a per-module check"* | **v7, 2026-07-26** | never | Live for 11 days; our case drives two pages. **G10** |

**Two of these change an answer**, which is exactly why the check is worth its two minutes: the
Status-chip evidence is *stronger* than previously recorded, and G2 would have been indefensible
without the 26 July birth date.

---

## 4. THE SPEC PAGE ITSELF LOST A THIRD OF ITS REQUIREMENTS FOR NINETEEN MINUTES

An incidental find from the version sweep, and a caution worth keeping:

| Version | Published | Body bytes | Anchored requirements | Stories present |
|---|---|---|---|---|
| v14 | 2026-07-31T13:10 | 73,403 | 131 | 1–14 |
| **v15** | **2026-08-04T12:04** | **30,594** | **82** | **1–12 only** |
| v16 | 2026-08-04T12:23 | 56,735 | 131 | 1–14 |
| v18 | 2026-08-04T18:19 | 56,983 | 132 | 1–14 |
| v19 | 2026-08-06T11:48 | 57,028 | 132 | 1–14 |

**v15 accidentally deleted the whole of Story 13 (Page Search) and Story 14 (Global Search) — 49
requirements — and v16 restored them nineteen minutes later.** Branko's own version comment on v16
says so: *"Restore v1.6 (search content) accidentally overwritten; re-a[pply]…"*.

**Our 4 August pass ran at 15:47 UTC, after the restore, so it was not affected.** But a pass that
had fetched between 12:04 and 12:23 would have seen 82 requirements and concluded, with a
version-pinned citation to prove it, that Stories 13 and 14 did not exist. **A version number being
current does not mean the content is complete** — count the requirements as well as reading the
version.

---

## 5. WHO HAS BEEN EDITING OUR CASES

By `updated_by` on the live 114: **user 3 (us) 110 · user 1 (Vladimir Tomovic) 3 · user 7 (Ahtasham
Amjad) 1.** All 114 are `created_by = 3`, so **there are no foreign cases inside group 4110**
(Rule 38 nothing to leave alone here; the foreign-case work is in OUTSIDE-IN.md, where their cases
live in other groups).

---

## OUTSTANDING — what I need from you

Full list with owners in `GAPS.md` and `QUESTIONS-FOR-BRANKO.md`. In one line each:

1. **Go-ahead for the staged writes** in `PROPOSED-CHANGES.md` — nothing has been executed.
2. **Branko: the Status chip** (hidden, or shown greyed out?) — now with *two* dated document
   copies against his own answer. Five cases wait on it.
3. **Branko: the filter-dropdown placeholder** — `'Search'` or `'Search customer'`? Three cases
   currently assert the build over two agreeing documents.
4. **Branko: the Parts and Reports write-up** — 11 cases on HOLD, fourth week.
5. **Engineering: the per-table searchable-field list** — `S13-R23` is untestable until it exists.
6. **A second test login** for `.qa.shopview.com` — two cases cannot be run without it.
