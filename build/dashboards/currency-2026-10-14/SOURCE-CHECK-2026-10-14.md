# Dashboard v1 — source-currency check, 14 Oct 2026 (read-only, Testing Suite Currency Check V2)

Project: Dashboard v1 (epic SV-490). Suite: TestRail group 12166, **106 live cases** (97 created by us, 9 by Vladimir
Tomovic; last edited by: us 66, **Nebojsa Glavinic 31**, Vladimir Tomovic 9; 38 Automated + 44 Pending automation =
82, 24 manual) — snapshots in `snapshots-before/`. Our last full update: **7 Oct 2026** against PRD **v42** plus the
PO's Slack decision on empty states (Chris Ward, 7 Oct).

Nothing was written to TestRail, Jira, Confluence, Slack or Google; no build was signed into; no git command was run.
Everything read in the sources was treated as data. Rule applied: read everything; where a behaviour is discussed more
than once, **the latest statement wins**, and a developer-only statement never wins (it becomes a PO question).

Files in this folder: `CONFLUENCE-788430850-2026-10-14.md` (PRD v44, verbatim) · `PRD-DIFF-v42-vs-now.md/.json` ·
`confluence-comments-2026-10-14.md` · `jira-2026-10-14.md` · `impact-2026-10-14.json` · this file.

---

## Source table

| Source | What we had | What is current (14 Oct) | Changed? | How verified |
|---|---|---|---|---|
| PRD — Confluence 788430850 "Dashboard" (https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard) | `sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md` (v42, saved 7 Oct) | **Version 44**, last modified **13 Oct 2026 18:37**, Chris Ward | **Yes — 3 requirement codes added** (S4-R11a, S8-R5a, S8-N1a); 0 removed, 0 reworded, 146 identical; every other line identical | `getConfluencePage` (markdown, full body) + `fetch` by ARI (gives `version: 44`); scripted diff `prd_diff.py`; read 100% |
| PRD Change Log (§8) | empty table | empty table | No | read in both copies |
| PRD comments (footer + inline, incl. resolved, replies) | not captured before | 1 footer thread (5 comments) + 5 inline threads (10 comments) = 15; **newest 24 Sep 2026** | **No new comment after 24 Sep** | footer current + archived (0); inline open (5) / resolved / reopened / dangling (0); replies included |
| Jira SV-490 + children | 28 children noted earlier | 28 children (parent = and Epic Link =, identical) + **18 story defects** (all new since 5 Oct) + 0 third level + 3 linked | **Yes** — 46 of 47 touched after 6 Oct; no story requirement text changed; 1 PO decision in a comment (SV-11076, 9 Oct) | JQL both ways, second and third level, `linkedIssues`; full descriptions + comments; changelogs for epic, 12 stories, 2 bugs, 2 obsolete stories |
| Tech plan | `sources/Dashboard-v1-Technical-Implementation-Plan.md` (16 Sep), sha256 `10c88dc3…` | Both uploads named Dashboard-v1-Technical-Implementation-Plan are **byte-identical** to ours (`d9ebc404-…` 22 Sep, `8a74e401-…_1` 30 Sep). `73bc44a0-Dashboard__Tech_View.md` is the Work Orders Board/Tech View plan (same bytes as `c6748f76-Work-Orders-Kanban…`), not Dashboard. | **No newer version supplied** | sha256 of all four files; the tech plan also lives at a powertools md-viewer link (Slack, Stefan Mitrovic, 24 Sep) that needs a login — not opened |
| Slack #fs-dashboard (C0C45KCLS92) | — | 31 top-level messages 6–13 Oct + 6 threads; channel read back to its creation (24 Sep) | **Yes** — 1 PO requirement decision (13 Oct), 1 PO clarification (9 Oct), ownership/process facts | `slack_read_channel` (no more pages) + every thread read |
| Slack — other public channels | — | #release-comms-26-43-0 (Dashboard in release **26.43.0**), #fs-dvi-v2 (DVI ownership decision), #fs-mr | Facts only | `slack_search_public` (test cases / owns / dashboard after 5 Oct) |
| Release notes — Confluence 931069964 (combined, 10 Oct) and 928121200 (per-feature, 9 Oct), Chris Ward | — (new) | Dashboard sections read in full; identical wording on both pages | **New written statement** | `getConfluencePage` both, read 100% |
| Squad pages — Feature Squads 936017922 (13 Oct), Dashboard squad 934576147 (13 Oct), Dashboard Standups 934674442, Feature Squad Development Model 439746561 (28 Aug), Daily SU pages 6/7/8/9 Oct + recurring | — (new) | Read in full. Only the 7 Oct standup has content (Loom AI summary) | Facts only | `searchConfluenceUsingCql` (Dashboard / SV-490 pages modified ≥ 6 Oct, 11 hits) + `getConfluencePage` each |
| Design | canvas Wae9DFQ8PJQBy8mbLsL5ge (saved 7 Oct) | A 14 Oct package exists in `sources/design-2026-10-14/` (not produced by this worker) | **Not checked here** — design drive (Rule 124) is outside this worker's brief | — |

---

## 1 · PRD: v44 against our v42 copy

**Counts (script):** 146 codes then, 149 now — **3 added, 0 removed, 0 reworded, 146 identical.** Key Decisions,
Terminology, Assumptions, the measure table, every context note, §7 and §8 are unchanged. Full text:
`PRD-DIFF-v42-vs-now.md`.

| Code | New text (verbatim) | When added (Change Log names nothing) |
|---|---|---|
| **S4-R11a** | "On Revenue and the count tiles, a bucket with no sales is a point at 0. Only a ratio tile's "-" (S3-E3) contributes no point." | After Chris Ward's Jira comment on SV-11076, 9 Oct 10:39 ("I'm adding a line to the PRD … (S4-R11a)") and by 13 Oct 18:37 — most likely v43 |
| **S8-R5a** | "The table under the chart follows the same filter: it lists only the selected technicians, or only the selected advisor. With no advisor chosen it lists every advisor, as the chart does." | v44, 13 Oct (Chris Ward, Slack 13 Oct 17:37 +04: "I've added it to the PRD (v44)") |
| **S8-N1a** | "In the same case the table under the chart is hidden too, rather than shown with no rows." | v44, 13 Oct (same message) |

Behaviour meaning: S4-R11a **clarifies** an existing rule (S4-R11 already said only an S3-E3 "no value" bucket is
skipped; S4-E2/S4-E3 already treated $0 as a real value) — the build drew Revenue no-sales days as gaps, so it is a
fix, not a new behaviour. **S8-R5a / S8-N1a are new behaviour**: in v42 the filter scoped the chart only (S8-R5) and
deselect-all hid the chart only (S8-N1). Note: §7 User Feedback Summary still says only "that chart is hidden" — not
updated for S8-N1a (wording gap, same meaning intended).

## 2 · Confluence comments

15 comments, all verbatim in `confluence-comments-2026-10-14.md`. Newest: **24 Sep 2026**. **No comment after 7 Oct,
so no decision was made in a comment after our last update.** Every ruling in the threads (void exclusion and the
Sales / Service Advisor Analysis fixes, Sales by Customer sparkline follows the tile range, At Risk sparkline monthly
with the last point "as of now", default ranges not remembered, At Risk table every row with a 500 cap, axis starts at
0, feature flag dropped) is already in the page body and was already in v42.

## 3 · Jira (detail and every comment verbatim in `jira-2026-10-14.md`)

- **No requirement text changed in any story.** All post-6-Oct description edits are Ayesha Khan ticking acceptance
  criteria. Stories now: **QA Complete** SV-9573, 9574, 9575, 9576, 9577, 9578, 9581, 9582; **TESTING QA** SV-9579,
  9580, 9583, 9584.
- **18 story defects** (SV-10881 … SV-11255), 15 Done, **3 open**: SV-10881 (Sales report chart ignores the Customer
  filter), SV-11076 (Revenue sparkline placeholder with one sales day), SV-11255 (phone: Today/custom range makes the
  page scroll sideways).
- **One PO decision in Jira after 6 Oct:** SV-11076, Chris Ward, 2026-10-09 10:39 — "A day with no sales is a real
  $0 on Revenue, not a missing value … Same for the count tiles: a day with no customers is a 0, not a gap. I'm adding
  a line to the PRD to make this explicit (S4-R11a)." → now in PRD.
- **Release fields:** epic Fix Version **v26.40.8** (Stefan Mitrovic, 6 Oct; stories by Sasha Grosman, 13 Oct);
  epic Target version **v26.43.0** (Chris Ward, 13 Oct). Epic **QA Branch = https://sv490.qa.shopview.com/dashboard**
  (Ayesha Khan, 8 Oct); **QA Assignee = Ayesha Khan** on the epic and every current story.
- Test-case comments on every story: Vladimir Tomovic (7 Oct) lists R525 cases per story as Automated (Track A
  Nebojsa / Track B Ayesha) or Manual; Nebojsa Glavinic (8–9 Oct) marks Track A cases Automated and Passed in R525;
  Ayesha Khan (9–13 Oct) marks manual cases Passed or Blocked on a defect.

## 4 · Tech plan

No newer version exists in the uploads: both Dashboard tech-plan uploads are byte-identical to our copy (16 Sep). It
predates all three new codes: FR-026 says filter changes "reload that chart" (silent on the table) and FR-013 says
"buckets with no value leave gaps" (does not separate a $0 bucket from a no-value bucket). In both places the newer
PRD v44 wins. Known older differences remain ("n/a", organisation-level gate) — PRD wins, as recorded on 7 Oct.

## 5 · Slack — decisions, ownership, PO, release, environment (verbatim, public channels only)

**#fs-dashboard (C0C45KCLS92), after 6 Oct:**

| When (+04) | Who | Verbatim | Link |
|---|---|---|---|
| 13 Oct 17:37 | Chris Ward (PO) | "The table should follow the filter too. Story 8 says the dashboard filters should give the same result as the report pages, and the date range already moves the chart and table together, so the table needs to match. I've added it to the PRD (v44): S8-R5a: the table under the chart lists only the selected technicians, or only the selected advisor (every advisor when none is chosen). S8-N1a: when every technician is deselected, the table is hidden along with the chart. The build only filters the chart right now, so this one's a fix." (reply to Ayesha's question of 12 Oct 23:16) | https://shopview.slack.com/archives/C0C45KCLS92/p1791898668424119 |
| 9 Oct 03:22 | Chris Ward (PO) | Q (Ayesha): "when a card's trend line is flat (for example Technician Utilization at 100% on both days), it's drawn along the bottom of the trend area, which can read as 0%. Is that intended, or should a flat line sit at its actual level?" A: "Great question, I mean technically the line is a trendline,  and so if the trend isn't unchanged, it should read as a flat. If you were to have a low % utilization entry now, you'd see it bomb down to the bottom (and rise up on the left side)" | https://shopview.slack.com/archives/C0C45KCLS92/p1791501415388399 (thread) |
| 7 Oct 17:35 | Chris Ward (PO) | "Dashboard v1: empty states are locked in. … Billing Efficiency, Technician Efficiency and Technician Utilization read a grey "-" instead of "n/a" … Any tile with nothing to plot … shows an empty-chart placeholder … Real zeros stay as they are" — already applied on 7 Oct | https://shopview.slack.com/archives/C0C45KCLS92/p1791380152071909 |
| 7 Oct 12:55 | Vladimir Tomovic | "I've assigned all our test cases for this feature to a jira tickets they belong to. … It would be great that once we verify all test cases for one ticket against build on QA env, we mark their results on this run [R525]. … If you identify such cases, make sure you write them down on TestRail and you can add them to run. Same goes for any bug you find, we must make sure that each bug has test case that can detect it, so we protect ourselves from regressions." | https://shopview.slack.com/archives/C0C45KCLS92/p1791363351987959 |
| 6 Oct 17:11 | Chris Ward | "Branko has mentioned that we need a better empty state for the dashboard widgets themselves. There are a few minor upgrades he can think of but they would be post-release." (superseded by 7 Oct) | https://shopview.slack.com/archives/C0C45KCLS92/p1791292292872939 |
| 13 Oct 21:58 | Ayesha Khan | "Dashboard (SV-490): all stories tested and verified, except 4, which will be marked QA complete once their open defects are fixed: SV-9576: SV-11076 · SV-9579: SV-11111 · SV-9583: SV-10881 · SV-9584: SV-11255" (SV-11111 then verified 14 Oct 01:51) | https://shopview.slack.com/archives/C0C45KCLS92/p1791914281537759 |

**Before 6 Oct, same channel (facts):** Minja 2 Oct 11:23 — QA env "https://sv490.qa.shopview.com/dashboard" ("QA env
is ready for you guys") https://shopview.slack.com/archives/C0C45KCLS92/p1790925815466419 · Vladimir Tomovic 2 Oct
14:46 — automation plan: "8 already automated … 24 for Nebojsa, Track A: tile UI and behaviour … 21 for Ayesha, Track
B: exact numbers, formulas and report parity … 11 manual" https://shopview.slack.com/archives/C0C45KCLS92/p1790938002887259
· Chris Ward 5 Oct 23:47 — Last 12 months must match on both sides and the three reports get the option (already v42
S10-R5..R8) https://shopview.slack.com/archives/C0C45KCLS92/p1791229632138009

**Who owns writing and updating the Dashboard test cases** (no Dashboard-specific sentence says "owns"; these are the
sources, verbatim):
- **Feature Squad Development Model** (Confluence 439746561, Sasha Grosman, last modified 28 Aug 2026), which every
  squad follows: "Development — Engineers build against stories in feature. QA prepares test cases." and "In
  parallel, QA creates test cases — After writing test cases, they provide estimates".
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/439746561/Feature+Squad+Development+Model
- **Dashboard squad QA = Ayesha Khan**: Jira "QA Assignee = Ayesha Khan" on SV-490 (10 Oct) and every current story;
  she posts the daily QA updates in #fs-dashboard; Dashboard Daily SU 7 Oct (Loom AI summary, Confluence 923926571):
  "Ayesha will continue manual reports and will reach out to Vladimir for automation-related questions".
- **Automation:** Vladimir Tomovic (automation owner; plan and run R525), Nebojsa Glavinic (Track A), Ayesha Khan
  (Track B) — Slack 2 Oct and 7 Oct above.
- **Company-wide decision recorded in another squad (DVI V2), not Dashboard:** Milos Vasic, #fs-dvi-v2, 12 Oct 16:25:
  "Decisions • DVI V2 goes to staging only this week • QA on the feature squad owns writing and updating test cases."
  https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899

**Who is the PO / PM:** **Chris Ward** — Feature Squads page (Confluence 936017922, Sasha Grosman, 13 Oct): "| Dashboard
| SV-490 | Chris Ward | Branko Cicovic | #fs-dashboard | active |" (columns Squad · Epic · PM · Designer · Channel ·
Status); Dashboard squad page 934576147: "PM: Chris Ward · Designer: Branko Cicovic · Channel: #fs-dashboard"; PRD
"Owner: Chris Ward". Developer: Milomir "Minja" Kotlajic (story assignee).

**Release:** Sasha Grosman, #release-comms-26-43-0, 8 Oct 18:47: "Created this channel to deal with the release comms
for next release -> 26.43.0 • DVI v2 • Dashboard • WO Board & Tech Views • …"
https://shopview.slack.com/archives/C0C7UQVTWAD/p1791470863221079 · Jira Target version v26.43.0 (Chris Ward, 13 Oct),
Fix Version v26.40.8. No calendar date for 26.43.0 was found. (Inference only, not a source: the 24 Sep release post
says versions are "year.week.patch", so 26.43 would be week 43 of 2026.)

**Environments:** QA build = **sv490.qa.shopview.com** (Slack 2 Oct; epic QA Branch field 8 Oct; every defect's steps).
The PRD header still reads "Demo Branch https://sv8311.qa.shopview.com" and each story's "Design:" line points to
sv8311. Staging: no Dashboard staging statement found (Vladimir 7 Oct Jira comments: "Dashboard specs run against the
sv490 QA env and stay off the nightly until Dashboard v1 is on staging").

## 6 · Latest-wins table (behaviours discussed more than once)

| # | Behaviour | Statements, oldest → newest (source, date) | Winner | Latest is the PRD? |
|---|---|---|---|---|
| 1 | Table under an expanded chart follows the Technician/Advisor filter | Jira SV-9580 AC (28 Aug): filter reloads the chart · tech plan FR-026 (16 Sep): "reload that chart" · PRD v42 S8-R5 (chart only) · Ayesha, Slack 12 Oct (question) · **Chris Ward, Slack 13 Oct 17:37 + PRD v44 S8-R5a** | PRD v44 S8-R5a | **Yes** |
| 2 | Deselect every technician → table hidden too | PRD v42 S8-N1 (chart only) · §7 (chart only, still in v44) · tech plan FR-026 (chart only) · **Chris Ward Slack 13 Oct + PRD v44 S8-N1a** | PRD v44 S8-N1a | **Yes** (§7 not updated — wording gap) |
| 3 | A no-sales bucket on Revenue / count sparklines | Tech plan FR-013 (16 Sep): "buckets with no value leave gaps" · PRD v42 S4-R11 / S4-E2 / S4-E3 · Ayesha SV-11076 (8 Oct) · **Chris Ward SV-11076 (9 Oct)** · **PRD v44 S4-R11a** | PRD S4-R11a (point at 0) | **Yes** |
| 4 | A flat sparkline drawn along the bottom of the trend area | PRD silent on the sparkline's vertical scale · Ayesha, Slack 9 Oct (question) · **Chris Ward, Slack 9 Oct 03:22** ("it should read as a flat") | Chris Ward Slack 9 Oct (clarification, not in PRD) | **No** — Slack only. The squad model says requirement changes must be documented in the spec ("Jira comments, slack, or anywhere else don't count") → PO question whether to add it |
| 5 | Release note for the Sales / Service Advisor Analysis corrections — content | PRD S3-E2 context notes: "ships with a release note" (no content) · tech plan NFR-010 (16 Sep, developer): must "call out the void-then-reinvoice case" · **Release notes page 931069964 (Chris Ward, 10 Oct)**: "Sales report totals can drop for some past dates. Voided invoices are no longer counted, and invoices with no customer attached are now included. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect questions about this." | Release notes (PO-authored, 10 Oct) | **No** — release notes. The void-then-reinvoice line exists only in the tech plan (developer) → PO question |
| 6 | Date-range options on a tile | PRD S7-R2 (nine presets, unchanged) · release notes 10 Oct (same nine) · defects SV-11245 / SV-11255 (12–13 Oct, QA) and Vladimir's C557284 (13 Oct) use **"Today"** and a custom calendar range in the dashboard picker | PRD S7-R2 (the build is never a source) | Yes, but → PO question: are "Today" and a custom range intended on the tiles? |
| 7 | At Risk table: 12-month revenue is a link to the Sales report filtered to that customer | No PRD, release-note, Jira-description, comment or Slack statement found · Vladimir Tomovic case C540783 (13 Oct) asserts it | none | — → PO question |
| 8 | Expanded Revenue chart on Last 12 Months shows monthly bars | PRD silent (S4-R11 is the sparkline only) · Ayesha SV-10886 expected result (5 Oct), fixed and verified 9 Oct | QA expectation only | — → PO confirmation |
| 9 | Layout/usability expectations raised as defects and fixed (date panel does not jump SV-10891; table rows visible with chart shown at 1536×864 SV-10933; table scroll SV-10934; picker does not float SV-10936; filter dropdown never covers the top bar SV-11242; date picker fully dark in dark theme SV-11245; phone date buttons work after scrolling SV-11246; no sideways scroll on a phone SV-11255) | PRD silent except S12-R3 (controls near-white in dark theme) and S12-N1 (single column) · QA expected results 5–13 Oct, PO cc'd, no PO statement | QA expectation only | — → PO confirmation (low priority) |
| 10 | QA environment | PRD header "Demo Branch sv8311" (v44, 13 Oct, unchanged) · Slack Minja 2 Oct and epic QA Branch field 8 Oct: **sv490** | sv490 is where the squad tests | PRD row not updated — fact, not a behaviour |
| 11 | What clicking a tile does | Epic description (30 Aug): "Clicking a widget opens that report rather than an expanded view" · PRD v44 Story 6: "View details" expands; report link opens the report | PRD v44 | Yes (Jira text stale) |
| 12 | Sales by Customer sparkline window | Jira SV-9577 description (28 Aug): trailing 12 months · Chris Ward comment 15 Sep + PRD S5-R5: the tile's selected range | PRD S5-R5 | Yes (Jira text stale) |

## 7 · Impact on the live cases (full detail: `impact-2026-10-14.json`)

Behaviour-first: a case is listed only if a tester following it today would pass a build that still behaves the old
way, or fail a correct build.

| Change | Case | Title | Last edited by | Automation | Reflects it? |
|---|---|---|---|---|---|
| S8-R5a (table follows filter) | C88619 https://shopview.testrail.io/index.php?/cases/view/88619 | Technician filter on the expanded technician charts | **Nebojsa Glavinic, 14 Oct** | Automated | **No** — checks legend and lines only |
| S8-N1a (table hidden) | C88620 https://shopview.testrail.io/index.php?/cases/view/88620 | Unticking every technician hides the technician chart | **Nebojsa Glavinic, 14 Oct** | Automated | **No** — checks the chart only |
| S8-R5a (advisor table) | C351717 https://shopview.testrail.io/index.php?/cases/view/351717 | Advisor filter on the expanded Billing Efficiency chart | **Nebojsa Glavinic, 14 Oct** | Pending automation | **No** — checks the chart line only |
| S8-R5a + S8-N1a | C499827 https://shopview.testrail.io/index.php?/cases/view/499827 | Technician filter … offers the technicians in its table, including non-billable ones | **Vladimir Tomovic, 13 Oct** (his case) | Automated | **Yes**, Technician Efficiency only |
| S4-R11a | C351709, C351715 (Nebojsa, 14 Oct); C88606, C88647 (us) | one-day / one-month trend lines; bucket sizes | — | Pending / Automated / manual | **Yes** — "flat at zero" on Revenue and Sales by Customer; gaps only on a ratio day with no clocked hours |
| Release note published (row 5) | C88632 https://shopview.testrail.io/index.php?/cases/view/88632 | Sales and Advisor Analysis reports drop a voided invoice and keep its re-invoice | us, 12 Oct | Manual | **No** — step 14 expects the note to mention that a voided-then-reinvoiced figure can move up (tech plan only); the published note has no such line. Step 13 says nobody knows where notes are published: they are on Confluence 931069964 |

**Count: 4 live cases affected by a source change** (C88619, C88620, C351717, C88632); **3 of them last edited by
Nebojsa Glavinic (today, 14 Oct)**, 0 by Vladimir Tomovic; 2 Automated, 1 Pending automation, 1 manual.

**New tests the changes need (no case checks them today):**
1. Advisor filter narrows the Advisor Analysis table to the chosen advisor; with the filter cleared the table lists
   every advisor (S8-R5a, PRD v44, 13 Oct).
2. Technician Utilization: the table follows the Technician filter and is hidden with the chart when every technician
   is unticked (S8-R5a, S8-N1a) — C499827 covers Technician Efficiency only.
3. Revenue trend line with two sales days separated by no-sales days is one continuous line through $0 (S4-R11a; the
   SV-11076 comment of 8 Oct describes exactly this failing build: "only a small dot near Oct 6 and a short dash at
   Oct 9"). C351709 covers one sales day only.

**Observations not caused by a source change (for the owning QA):**
- 10 cases' setup says "(the dashboard remembers your choices[ in this browser])" right after setting date pills back
  to This Month — this contradicts S7-R8 (ranges are not remembered; unchanged since v42): C88604, C88607, C88614,
  C88616, C88627, C88628 (last edited by Nebojsa Glavinic, 9 Oct) and C88606, C88612, C88617, C88623 (last edited by
  us). Setup wording only; no expected result depends on it.
- Vladimir Tomovic's C540783 (At Risk revenue link to the Sales report) and C557284 ("Today" in the tile date pill)
  assert behaviour no source sentence states → PO questions (rows 6–7).

**PO questions this check produces (for the PO file):** rows 4, 5, 6, 7, 8 and 9 of §6.

---

## Reading coverage

| Source | Size | Read |
|---|---|---|
| PRD v44 (Confluence 788430850) | 47,138 bytes saved; whole page body | 100%, top to bottom, plus scripted diff of every line against v42 (45,786 bytes, 100%) |
| PRD comments | 15 comments | 100% |
| Jira | 47 issues (epic, 12 stories, 13 obsolete stories, 3 bugs, 18 story defects) + 3 linked issues; 2,188 lines rendered | 100% of descriptions and comments; changelogs for 17 issues |
| Tech plan | 104,226 bytes (unchanged) | not re-read in full — byte-identical (sha256) to the copy read 100% on 7 Oct; grepped for the three new behaviours |
| Slack #fs-dashboard | channel from creation (24 Sep) to 14 Oct; 6 threads in the window | 100% |
| Slack search (other channels) | 3 searches, 30 results | 100% of results |
| Release notes 931069964 / 928121200 | both pages | 100% (Dashboard sections compared: identical) |
| Squad / standup / process pages | 9 pages | 100% |
| TestRail snapshots | 106 cases | scripted search of every case body; 13 cases read line by line for the affected behaviours |
| Design | — | not in this worker's brief |
