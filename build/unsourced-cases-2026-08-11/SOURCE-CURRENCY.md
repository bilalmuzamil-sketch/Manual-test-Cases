# SOURCE CURRENCY — unsourced-case survey — 2026-08-11

**Standing Rule 31.** Every source this survey rests on, with its identifier, the version-or-last-updated
value, the date read, a verdict, and — where the verdict is not CURRENT — the exact shortfall.

**READ-ONLY throughout. Zero TestRail writes. Zero Jira writes. No build was opened.
`quick-login` and `switch-user` were deliberately not called.**

---

## The table

| # | Source | Identifier | Version / last-updated | Read | Verdict |
|---|---|---|---|---|---|
| 1 | Filters specification | Confluence **572030978** "Filters" | **v19**, 2026-08-06T11:48:47Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 2 | Schedule specification | Confluence **713031682** "Schedule" | **v27**, 2026-08-07T15:01:20Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 3 | SBC — Sales By Customer | Confluence **577634305** | **v17**, 2026-08-10T17:22:42Z | 2026-08-11, live, HTTP 200 | **CURRENT · ⚠️ MOVED — the brief expected v16** |
| 4 | SBR — Sales By Representative | Confluence **585629698** | **v18**, 2026-08-07T03:43:08Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 5 | PV — Parts Velocity | Confluence **620888066** | **v6**, 2026-08-07T03:43:09Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 6 | TU — Technician Utilization | Confluence **641400833** | **v7**, 2026-08-07T03:43:12Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 7 | WIP — Work In Progress | Confluence **703660034** | **v11**, 2026-08-10T17:21:17Z | 2026-08-11, live, HTTP 200 | **CURRENT** |
| 8 | IV — Inventory Value | Confluence **720142338** | **v5**, 2026-08-07T03:43:11Z | 2026-08-11, live, HTTP 200 | **CURRENT · ⚠️ MOVED — the brief expected v4** |
| 9 | TestRail case suite | project 1 / suite 1, groups **4110 / 4254 / 4281** | read live | 2026-08-11 | **CURRENT** — 781 cases live, 764 ours, 17 foreign |
| 10 | Jira ticket keys cited by our cases | 119 distinct keys | read live via JQL | 2026-08-11 | **CURRENT** — 119/119 resolve, 0 missing |
| 11 | Epic story SV-8686 | acceptance criteria | read live, HTTP 200 | 2026-08-11 | **CURRENT** — quoted verbatim below |
| 12 | Schedule engineering tech plan | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | no version in the document | 2026-08-11, on disk | **CURRENT as an artefact · PARTIAL as authority** — see note A |
| 13 | Filters engineering tech plan | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | no version in the document | 2026-08-11, on disk | **CURRENT as an artefact · PARTIAL as authority** — see note A |
| 14 | Branko answer files | `build/filters/branko-answers-{2026-07-31,2026-08-04,round2-2026-07-20}/` | dated by folder | 2026-08-11, on disk | **CURRENT** — all present |
| 15 | Filters + Schedule `.md` handovers | `ed9bc33e-FIlters_HANDOVER…`, `af54d7ba-Schedule_scheduledesignreview20260805` | no version (Filters) · dated Aug 5 (Schedule) | 2026-08-11 | **PARTIAL** — see note B |
| 16 | Designs / Figma | Figma node ids cited in `refs` (e.g. 11884-16885, 11903-10573) | **no version, no date** | not fetched this pass | **PARTIAL** — see note C |
| 17 | The build | any QA branch | — | — | **NOT OBSERVED** — irrelevant to this survey (Rule 57: the build is never a source) |

---

## Note A — the two tech plans are CURRENT as files but their AUTHORITY is an open question

Both files exist and **every tech-plan item id our cases cite was verified present in them**
(`NFR-005`, `FR-015`, `FR-016`, `AppointmentScheduler`, `NFR-001`, `FR-P4` — each found by direct
search). So as *artefacts* they are current and the citations are real.

**What is PARTIAL is not the file — it is whether it can carry a product expectation on its own.**
Standing Rule 30 says a tech plan *informs but never overrules* product truth; Rule 57's 2026-08-06
amendment puts "the Technical design" on the authoritative list at (d3). **Rule 57 records that tension
as an OUTSTANDING question to the QA lead and expressly does not answer it.**

This matters here because **11 cases rest on a tech plan as their only source of a behaviour** — 7 of
them on Schedule and **all 7 of those are flagged Automated**. They are listed in `CANDIDATES.md`
class (c). **Nothing is proposed for deletion on this ground**, precisely because the authority
question is open.

## Note B — the handovers

Recorded as PARTIAL by the 2026-08-10 ingest
(`build/handover-ingest-2026-08-10/SOURCE-CURRENCY.md`), and that verdict is carried forward, not
re-measured. The Filters handover carries **no version and no date**; the Schedule design review is
**a second-hand extraction of a meeting**. One case cites the Filters handover (**C38909**, `§3+§8`)
and that citation is legitimate — see `METHOD.md`, where it is also the first of the two places my own
tooling was wrong.

**Shortfall, stated exactly:** the uploaded `.md` files are no longer present at
`/root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/` (that directory holds only a July 31
`.xlsx`). I read the **ingested record** of them, not the originals. Nothing in this survey turns on a
passage I could not read, but that limit is stated rather than glossed.

## Note C — designs and Figma are PARTIAL and were not fetched

Ten Filters cases cite Figma node ids. **I did not fetch Figma this pass** — no token was available and
the survey did not turn on a design detail. Under Rule 57 as amended the design and Figma are
*authoritative*, so an unfetched design is a real shortfall and is recorded as PARTIAL rather than
waved through. **Consequence, stated plainly:** for those ten cases I verified that the *spec prose* and
*PO answers* they also cite are real and on point; I did **not** independently verify the Figma node
contents. None of them is proposed for deletion.

---

## Verbatim quotations relied on

**SV-8686 acceptance criterion** (read live 2026-08-11, HTTP 200), sourcing **C43554**:

> "…when the Schedule page loads, when the user has Schedule: View permission, then the grid displays
> with **day view as default** showing all department-grouped technician rows."

**Filters v19 `S8-R3`** — the requirement **C29600** cites:

> "S8-R3: When the combination of active filters and any active search query produces **no matching
> records**, the table shows an **empty state** with a message indicating no results were found for the
> current filters and search"

**Filters v19 `S13-R10`**, cited by C38884 — included because the contrast is the point:

> "…works **additively** with the filter bar: a query narrows within the active filters"

The spec therefore **does** state how *search* combines with *filters*, and **nowhere** states how two
*different filters* combine with each other. That asymmetry is the whole of the C29600 finding.

---

## ⚠️ A currency finding this survey turned up and is reporting, not fixing

**377 of 764 cases carry a Rule-54 provenance line naming a spec version that is no longer live.**

| Spec | Live | Cases naming a stale version | Of |
|---|---|---|---|
| Filters | v19 | **0** | 114 |
| Schedule | v27 | **0** | 174 |
| TU | v7 | **0** | 60 |
| SBC | v17 | **86** (name v16) | 87 |
| SBR | v18 | **76** (name v17) | 112 |
| PV | v6 | **70** (name v5) | 71 |
| WIP | v11 | **77** (name v10) | 78 |
| IV | v5 | **68** (name v4) | 68 |

**This is a version-pin staleness finding, NOT a claim that any of those cases is wrong.** Per Rule 31
trap (c), a page moving says nothing about whether a given requirement inside it moved; establishing
that needs a per-requirement diff, which this survey did not do and does not claim to have done.
**Filters, Schedule and TU are fully current** — recent passes re-stamped them.

A worker is live under `build/report-suite/source-accuracy-remaining-2026-08-11/`; those paths were not
touched.
