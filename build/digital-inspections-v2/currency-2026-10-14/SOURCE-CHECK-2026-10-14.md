# DVI V2 — source-currency check, 14 Oct 2026 (read-only)

Project: Digital Inspections V2 (epic SV-8181), our TestRail suite group 6658, 91 cases (snapshots in
`snapshots-before/`). Nothing was written to TestRail, Jira, Confluence, Slack or Google; no build was
signed into; no git run. Everything read in the sources was treated as data.

Rule applied throughout (QA lead, 14 Oct 2026): read everything top to bottom including comments and
change logs; where a behaviour is discussed more than once, **the latest statement wins**.

## Source table

| Source | What we had | What is current (14 Oct) | Changed? | How verified |
|---|---|---|---|---|
| PRD — Confluence 768507905 "Digital Inspections V2" | `sources/CONFLUENCE-768507905-live-2026-09-22.md` — live copy of 22 Sep (page last modified 18 Sep; the PM's comment of 16 Sep calls that day's page **v30**, the 18 Sep S19 revision followed; the integer was not recorded at the time) | **Version 43**, last modified **13 Oct 2026, 16:56** (Confluence "yesterday at 4:56 PM"), author Milos Vasic. Saved as `CONFLUENCE-768507905-2026-10-14.md` (markdown) and `…-fetch-with-panels.md` (same text plus the S15 status panel the markdown export drops) | **Yes** — 10 change-log entries since (29 Sep → 13 Oct) | `getConfluencePage` + `fetch` (ARI, gives `version: 43`); scripted code diff (`PRD-DIFF-2026-09-22-vs-2026-10-14.md/.json`); read 100% |
| Others' cases cite | — | Viktoria's amendments cite **"version 42 of 7 October 2026"** | v43 is newer | v43 vs v42: change log says only the S15 status-note link and an S15-E2 rewording, "meaning unchanged" |
| PRD comments (footer + inline) | not captured before | 1 footer thread (5 comments) + 9 inline threads (15 comments); newest 2026-09-16 | **No new comment after 22 Sep** | All statuses queried (open/resolved/reopened/dangling; footer current+archived); `confluence-comments-2026-10-14.md` |
| Jira — SV-8181 and children | 38 children noted 22 Sep | 48 children (parent = Epic Link, identical sets) + 23 story defects under stories = 71; 67 touched after 22 Sep | **Yes** — 10 new children, 23 story defects, many comments | JQL both ways, second level, third level (0); `jira-2026-10-14.md` |
| Tech plan | `DVI-V2-Technical-Implementation-Plan.md` (15 Sep base, held 22 Sep) | `…-upload-2026-09-30.md` (revisions to 23 Sep). No newer copy supplied | Yes (between our two copies) | Script diff (CRLF normalised): 1,082 identical lines, 425 added, 45 removed, 54 hunks — all hunks read |
| Design handoff .md (14 Oct package) | 22 Sep copies in `sources/` | `design-2026-10-14/files/` (+ identical copies in `design_handoff_dvi_v2/`) | **Yes**, small — the old "conditional follow-up removed" lines rewritten to the per-response follow-up; FOLLOWUP-handoff aligned with PRD; Advisor/Started question closed | Script diff per file; new file `uploads/dvi-v2-back-to-design.md` (8 Sep) read in full |
| Slack #fs-dvi-v2 (C0C39T5MLMB) | — | 19 messages since 22 Sep, newest 13 Oct | Yes | `slack_read_channel` oldest=22 Sep (no more pages) + thread search |
| Other Confluence found by CQL | — | "Digital Inspections V2 Release Notes" 926384341 (9 Oct, PM); "Project Plan" 902660109 (30 Sep; production release **Thu 15 Oct 2026**); hub 935002119 + "DVI V2 Standups" 935788548 (13 Oct; **no standup child pages exist yet**) | New to us | Read in full |
| Review Decisions 845348865, Run log 845447169 | read 22 Sep | last modified 10 Sep | No | CQL last-modified |
| ShopCoach proposed brief (Slack file F0C8QC8CFTK, linked from PRD v43 S15 status note) | — | — | Unknown | **Not readable** — `slack_read_file` → file_not_found (likely not in a public channel) |

---

## 1 · PRD: v43 against our 22 Sep copy

**Counts (script):** 373 requirement codes then, 377 now — **8 added, 4 removed, 71 reworded, 298
identical**. Full old→new text of every code: `PRD-DIFF-2026-09-22-vs-2026-10-14.md`.

**Added:** S3-R8 (completed footer shows outcome "WO created S-235" / "Lines added S-58"), S4-R5 (note
shows outcome), S11-R11 (reference file opens from its hyperlinked name, no Open/View button), S12-N4
(Text field has no single/multi-line option), S13-R14 (inspected date = first completion; regenerate
does not move it), S13-R15 (regenerate posts no new note), S15-N6 (photos not sent to ShopCoach),
S15-E7 (new WO created on choice stays, empty, if drafting cancelled/fails/returns nothing; retry on
the same WO; inspection stays Needs action).

**Removed:** S2-R15 (unusable destination keeps its place and says why), S4-R3 and S4-E2 (confirm
before building again), S5-R16 (filter row wraps on a phone).

**Key behaviour changes among the 71 rewordings (grouped):**
- **Built once (S2-R13, S2-E6, S3-E2, S4-R5, S3-R8, Key Decisions).** No second build from any entry
  point; a second Add Lines adds nothing and tells the user where the lines went. Replaces "confirm
  before adding a second set".
- **Destination menu (S2-R4/R5, S6-R4).** Menu always opens; an ineligible own WO is simply not offered
  (no "says why"); eligible also requires "no invoice exists".
- **Asset Inspections tab (S5-R9..R12, S5-R21, S5-E3, S6-R7).** No filter row (sort on Inspection,
  Status, Completed); summary "N of M have findings with no lines yet"; **the tab follows the work
  order's current asset** (asset change / merge) — reversed from "record of what was inspected";
  deleted WO: only inspections **with a report** survive as read-only records, outcome shown only while
  its target WO exists, reopened inspection survives as its latest report.
- **Deleted work order elsewhere (S2-E12, S3-R6, S3-E1, S6-E1, S7-R2, S7-R5).** Inspection with a report
  no longer counts as needing a WO; completed footer = View PDF only; note/Audit Log show the deleted
  number as text tagged "Work order deleted".
- **Per-axle (S8-R2..R7, S8-R11, S8-R14, S8-R24..R26, S12-R8..R10).** Four fixed row types, each once;
  only the two tire rows have a scope ('1 per side' / 'Outer + inner', default Outer + inner); brake
  rows always '1 per side', no control; technician never changes scope; renamed row keeps its type; add
  offers only missing types; unit "psi"; worst-wins ranks N/A and ignores empty positions; completed
  view has no per-row verdict; one finding per flagged row naming every flagged position.
- **Report (S13-R0).** One block per axle, never split; axle result in header; OUTER + INNER / 1 PER SIDE
  sub-tables; icons (triangle / clock) as well as colour; grey dash; **no per-row status column**.
- **Builder (S12-R1, R4, R24, R28, R29, R31, R32, S12-N1, S12-E1).** Axles control **1 to 8**
  (was 2–5); Preview read-only except the axle count (Add Axle stops at 8, delete at 1); reference file
  shown but not openable in Preview; starters "verified visually, one to one".
- **Files (S11-R2, R3, R9, R11).** Accept PDF, JPG, PNG, HEIC, Word, Excel; refuse GIF, WEBP, **TIFF**,
  video; size limit **20 MB, not stated in advance**, stated in the rejection.
- **Defaults.** S17-R2 "Photo required if Not OK" **off** by default; S1-R2 note rule on, "starters
  included".
- **Follow-ups (S19-R5, R19, R25, R28, S19-N3).** "A text, a file, or both"; file opens from its name
  (no View Instruction); Submit never disabled, named "Submit & Generate Report", list titled
  "N items before submitting", sign-off labels unchanged; **customer report shows the instruction text
  and acknowledgement (who/when), not the file** (reversed).
- **Phone / Mark OK (S14-R6, S14-R7, S18-R1, S18-R10, S18-R11).** Nothing blocks finishing a section;
  "Go to the first one"; labels 'Mark all OK' / 'Mark section OK' / 'Mark field OK', no axle level;
  phone caption text; Back kept on the last section beside 'Submit & Generate Report'.
- **ShopCoach (S15-R6, S15-E2, S15-E5, S2-R1).** Named in the completed-card note and panel title, not
  the action/menu; failure = told + retry, no empty lines; per flagged row.

**Other sections changed:** Feature Overview (tab "showing which ones still need a work order");
**Glossary added** (Position, Row, Axle, Finding, Count); Key Decisions — 10 bullets changed/added
(photo default off; one Text field; verdict wording per surface — app says Not OK, report never does,
results ATTENTION/MONITOR/PASS; built once; concurrent builds; ShopCoach naming; release cut-off;
failed draft; photos not sent; parts provisional; four fixed row types; TIFF refused); S5 counting
preamble; S11/S19 prerequisites (anyone who can view the inspection can open its files — was
'Work Orders — View'); **S15 status panel** ("ShopCoach drafting in progress … S15-R1, S15-R3, S15-R19,
S15-R20, S15-N3 and the Key Decisions on the brief and on parts are provisional"); change log +10 rows.

**Change log entries read (all):** 2026-09-10, 09-16, 09-18 (already held) and new: 09-29 (QA
contradiction pass vs v31), 10-05 (dev/QA questions), 10-06 (deleted WOs, removed inspections, splits,
psi), 10-07 ×6 (deleted WO after a build; built-once leftovers + 20 MB + submit name; filter leftovers
"removed from the asset tab in v32"; SV-10794 file link; hyperlinked names; SV-10877 fixed row types;
SV-10965 outcome/footer/reopened/merge), 10-13 (link to proposed ShopCoach brief; S15-E2 reworded).

**Inside the PRD itself, latest wins already:** the 09-29 entry says "The row scope is set by the author
and can be changed by the technician"; the 10-07 SV-10877 entry reverses it ("The technician no longer
changes a row's scope while filling"). Body text follows 10-07.

**Residual internal tensions in v43 (record, do not resolve from the build):** S1-E5 still says the note
triggers "when any axle is marked Monitor or Not OK" beside S1-R7/S1-E7 (positions, not axle roll-up);
S2-N4/S2-E4/S6-N3/S6-E3 still say "open"/"closed" work order (flagged by Milan 16 Sep, never reworded);
S12-R6 still does not exist.

## 2 · Comments

Saved verbatim in `confluence-comments-2026-10-14.md` (20 comments, authors resolved). **No comment
after 22 Sep — so no decision was made in a comment after 22 Sep.** Comment-era decisions (all 25 Aug
– 16 Sep) and where they stand: "Review/Complete are open" (Fabian, 25 Aug) superseded by S2-R4/R5;
photo default ON (Milan 16 Sep) superseded by PRD (off); 10 MB (Milan 16 Sep, PM "agree") superseded by
PRD 20 MB (7 Oct); "All and Needs action stay either way" (PM 16 Sep) superseded by v32 (no filters);
deleted-WO option 3 written into S5-E3; **HEIC photo on the report → placeholder naming the format
(Milan proposal (2), PM "I agree with proposed solutions", 16 Sep) — never written into the PRD and
never contradicted.** All 9 inline threads are still "open" (unresolved), including the 25 Aug "open
work order" thread the PM said he would resolve.

## 3 · Jira

`jira-2026-10-14.md`: inventory of all 71 issues, a 28-row table of behaviour statements, then the full
verbatim description + comments of the 67 touched after 22 Sep. Highlights:
- **23 story defects** (Viktoria Videnovic 19, Stefan Vukovic 2, others); 16 "Merged to Staging",
  2 Blocked (SV-10787 ShopCoach env, SV-10910 32→29 lines), 1 Testing Stage (SV-11103), 1 Open
  (SV-11262 Axles hint permanent), 3 OBSOLETE.
- **PM decisions in Jira after 22 Sep:** SV-10877 (fixed row types), SV-10794 (file link), SV-10965
  (deleted WO), SV-10913 (split moves notes), SV-10912 (keep three sortable columns) — all now in the
  PRD; **SV-10960 (8 Oct: asset change/merge never regenerates reports; deleted WO's kept inspection
  takes the WO's asset at that moment) and SV-10938 (9 Oct: phone Save & exit) — not in the PRD.**
- Other later statements: SV-10937 (inspection on a completed line can be submitted — dev, 9 Oct);
  SV-11103 (truncate with "…" + full name on hover — designer Branko Cicovic, 12 Oct); SV-10788
  (deleted-inspection note: View PDF/Download disabled); SV-10910 (backend adds a plain line for an
  uncovered finding — conflicts in spirit with "no empty lines … no non-AI line builder"; PO question).
- Stories carry Vladimir Tomovic's run #494 coverage comments (7–8 Oct) listing our case ids with an
  automation owner per area.
- All stories now "Merged to Staging" (SV-9099 "Ready for Production"); Slack 13 Oct confirms DVI V2
  merged and deployed to staging; project plan release Thu 15 Oct 2026.

## 4 · Tech plan (15 Sep base → 30 Sep upload, revisions to 23 Sep)

Testable changes the newer copy adds:
1. **Axle list is per per-axle field** (Dusan, 23 Sep): two per-axle fields on one template each keep
   their own axles (add twice, Single/Dual twice). PRD silent.
2. **Server seeds each field's starting axles at inspection creation** — positions 1..N, tire
   configuration **Dual**, brake type blank; a seeded axle holds no value or verdict; so Mark all OK as
   the very first action stamps the shown axles (S18-R5).
3. **Starters are applied to the draft and never publish**; no seeding into organisations; two units
   added for the air-brake starter: **`sec` and `psi/min`** (SV-9881); starter definitions served by
   two read-only endpoints.
4. **NFR-017 scoped (22 Sep):** labels satisfy it everywhere; the **truck diagram stays colour-only**
   by Dusan's decision. (Our C154645 already says this.)
5. **S19 Phase 10:** acknowledgement is server-stamped (who/when), cannot be cleared by the technician,
   survives autosave while the response is unchanged, dropped when it changes; unchecked follow-up
   blocks keep their text/file and never gate submit or publish; a Monitor block is rejected if
   "Include Monitor option" is off; turning Monitor off/on keeps a custom Monitor label and its
   follow-up (fixes a shipped defect); the follow-up round-trips save → reload → duplicate field /
   section → publish-then-edit. The plan still says the file action reads "View Instruction" and the
   report is untouched — **both superseded** by PRD 5 Oct (S19-N3) and 7 Oct (S19-R19).
6. Open item it records: "General reference file" label scope (PRD every field type vs handoff
   checkbox-only) — now closed: the 14 Oct FOLLOWUP-handoff and SV-11092 both say every field type.

## 5 · Design-handoff .md documents (14 Oct package vs our 22 Sep copies)

- **DVI-V2-PRD.md / user-stories / CLAUDE-CODE-HANDOFF / README:** the "conditional follow-up is gone"
  lines are rewritten to "branching follow-up … replaced by the per-response follow-up in
  FOLLOWUP-handoff.md"; README gains the Conditional Follow-up V2 file rows; "Acknowledgement toggles
  on OK and N/A" (only) listed as removed; Advisor/Started/progress question **closed — not carried
  onto the completed screen** (matches S3-R7).
- **DVI-V2-build-spec.md:** response options become editable rows (name input + pencil), plus a
  RESPONSE SETTINGS block with the two toggles and the follow-up blocks (matches S12-R11, S19-R1..R6).
- **FOLLOWUP-handoff.md:** requireAck now **Monitor/Not OK only** (was "either way on any of the four");
  **no file button — the name is the link** (was View Instruction); **GENERAL REFERENCE FILE on every
  field type, per-axle included** (was checkbox only); section action not blocked by an unacknowledged
  follow-up (closed). All now match PRD v43.
- **PREVIEW-MODE-handover.md, design-brief, shopcoach-design-prompt:** identical.
- **New to us: `uploads/dvi-v2-back-to-design.md` (dated 8 Sep 2026).** Older than the PRD rulings.
  Facts: "Runs" → "Times used" copy table (matches S12-R26); starter card sub-lines removed (S12-R4);
  "New axle set" → "New axle measurements"; Per axle tooltip text; an axle-field preview **dialog**
  opened from the properties panel (**superseded** by the PRD's Preview mode, whose Key Decision rules
  out a properties-panel or modal preview); A3 "two active starters, four pending" (**superseded** by
  S12-R4: five carry content); A7 destination row "S-81 · Approved" (number + status, matches S2-R14).
- **Still disagreeing with PRD v43 (handoff not updated):** Axles control "2–5" (PRD 1 to 8); file
  copy "PDF, JPG or PNG · up to 10 MB" stated before upload (PRD: six types, 20 MB, not stated in
  advance); TIFF "stays accepted" (PRD: refused); "say whether a row is measured per tire or once per
  side" for any row (PRD: four fixed types, brake rows fixed); a descriptor "measurement rows · verdict
  per tire" in the handoff PRD (PRD S12-N3 bans descriptors). PRD is later in every case → PRD wins.

## 6 · Slack #fs-dvi-v2 after 22 Sep

**Test-case ownership — verbatim:**
> Milos Vasic, 2026-10-12 16:25 (+04), "DVI V2 team sync 10.12.2026":
> "The team reviewed remaining work, staging readiness, mobile polish, QA status, and test-case
> ownership. … • About 75% of test cases were passing, roughly 15% were blocked, and six had not yet
> been tested. Blocked cases can be tested on staging after the merge. Action items • Viktoria: Open a
> ticket for the mobile vertical line; move the Excel/Word preview cases to blocked and add a reference.
> • Stefan Mitrovic: Deploy to staging after the remaining ticket is resolved. Decisions • DVI V2 goes
> to staging only this week • QA on the feature squad owns writing and updating test cases."

Other facts (verbatim where it matters):
- Stefan Vukovic, 2026-10-13: "Team, the DVI v2 feature is officially merged and deployed to staging
  … ShopCoach is also available for some of the test cases … ShopCoach staging still uses old AI model
  (gpt - 4o), since the latest model upgrade is not yet merged and deployed".
- Milos Vasic, 2026-10-05 meeting notes: "Developers and QA had a couple of questions regarding PRD and
  design misalignment • Milos answered those questions and updated the PRD and design".
- Milos Vasic, 2026-10-01: QA environment `sv8181.qa.shopview.com` given to Viktoria Videnovic.
- Milos Vasic, 2026-09-25 standup: Dusan on vacation from 1 Oct, development ownership to Stefan V.
- Milos Vasic, 2026-09-22: "This morning we handed over this feature to dev, note that QA will join us
  as soon as Viktoria is done with payments".
- No behaviour decision is stated in the channel after 22 Sep.

## 7 · Latest-wins table (behaviours discussed more than once)

Rows marked **★** are where the latest statement is **not** the PRD.

| # | Behaviour | Statements in date order (source, date) | Latest — wins |
|---|---|---|---|
| L1 | "Photo required if Not OK" default | Design review: off (3 Sep) · PRD Key Decision: on (to 22 Sep) · Milan comment: build ON (16 Sep) · PRD S17-R2: off (by 29 Sep) · Jira SV-9440 description ON→OFF (2 Oct) · SV-10789 fixed to off (5 Oct) · Release notes "A photo can be required" (9 Oct) | PRD v43 S17-R2: **off** |
| L2 | Asset-tab filters | PRD S5-R10 four filters (22 Sep) · PM comment "All and Needs action stay either way" (16 Sep) · design: no filters, one line · PRD v32 removed filters; 7 Oct leftovers cleaned | PRD v43 S5-R10: **no filter row**, 3 sortable columns (PM re-confirmed on SV-10912, 7 Oct) |
| L3 | Building twice | PRD S2-R13 confirm then add second set (22 Sep) · SV-10792 task "Add … as well?" (2 Oct) · PRD 29 Sep "built from once" · PRD 7 Oct leftovers (S2-E6, S3-E2) | PRD v43: **built once**, second Add Lines adds nothing and says where the lines went |
| L4 | Row scope (per-axle) | PRD 22 Sep per tire / per brake · PRD 29 Sep author sets, technician can change · SV-10877 PM "brake lining and push rod is always single" (5 Oct) · PM decision v41 (7 Oct) | PRD v42/43: **four fixed types; only tire rows scoped; brake rows always 1 per side; technician never changes scope** |
| L5 | Follow-up file action | PRD S19-R19 "View Instruction" (22 Sep) · SV-10325 (22 Sep) · tech plan (30 Sep) · SV-10794 PM: no button (7 Oct) · FOLLOWUP-handoff 14 Oct: name is the link | PRD v43 S19-R19 + S11-R11: **name is the link, no button** |
| L6 | Follow-up on the customer report | PRD S19-N3 "neither reaches the report" (22 Sep) · SV-10325 (22 Sep) · tech plan (30 Sep) · PRD 5 Oct · Release notes 9 Oct | PRD v43 S19-N3: **instruction text + acknowledgement (who/when) on the report, file not** |
| L7 | Reference-file size / types | PRD 20 MB "endpoint enforces" · design "PDF, JPG or PNG · up to 10 MB" · PRD 16 Sep 20/10 conditional · Milan "shipping 10 MB" (16 Sep, PM agreed) · PRD 29 Sep TIFF/GIF/WEBP dropped, limit not stated in advance · PRD 7 Oct "20 MB" · Release notes 20 MB (9 Oct) · 14 Oct handoff still 10 MB | PRD v43 S11-R2/R3: **six types, 20 MB, not stated in advance** |
| L8 | Axles control range | Handoff 2–5 · PRD S12-R29 2–5 (22 Sep) · PRD 29 Sep 1–8 · 14 Oct handoff still 2–5 | PRD v43: **1 to 8**, default 3 |
| L9 | requireAck on OK/N/A | FOLLOWUP-handoff (old) any of four · PRD S19-R6 Monitor/Not OK only · Dusan ruling (23 Sep) · FOLLOWUP-handoff 14 Oct aligned | PRD v43: **Monitor and Not OK only** |
| L10 | "General reference file" label scope | PRD every field type · old handoff checkbox only · tech plan open item (30 Sep) · SV-11092 (9–12 Oct) · 14 Oct handoff every field type | PRD v43 S11-R10: **every field type** |
| L11 | Deleted run-on WO — counts as needing a WO? | PRD S2-E12 "counts as needing a work order again" (22 Sep) · PRD 6–7 Oct · SV-10896/SV-10965 (7–8 Oct) | PRD v43 S2-E12: **does not count** (cannot be built from) |
| L12 | Asset an inspection is listed on | PRD S5-R21 stored asset, a record (22 Sep) · Milan/PM snapshot (16 Sep) · PRD 5 Oct: follows the WO's current asset · PRD 7 Oct: merge moves kept inspections; deleted WO → stored asset · **★ SV-10960 PM (8 Oct): kept inspection takes the asset the WO has at the moment of deletion** (built 8 Oct) | **★ Jira SV-10960 (8 Oct) wins** over PRD v43's "the stored asset is used" for the deleted-WO case; "I'll add this to the PRD" — not done in v43 |
| L13 | Reports after an asset change / merge | PRD S13-R12 "a report already handed … cannot change" · PRD S13-R14 inspected date (5 Oct) · **★ SV-10960 PM (8 Oct): asset change or merge never regenerates; a manual regenerate takes the WO's current asset, inspected date unchanged** | **★ Jira SV-10960 (8 Oct)** — adds behaviour, consistent with PRD |
| L14 | Phone save while filling | V1 S8-R8 (no auto-save; Save button) · V2 PRD silent · **★ SV-10938 PM (9 Oct): phone gets Save & exit like desktop** | **★ Jira SV-10938 (9 Oct)** |
| L15 | Long names | PRD S11-E3/S12-E3/S14-E2 "shortened" · **★ SV-11103 designer Branko Cicovic (12 Oct): "…" plus full name in a tooltip on hover** (built 12–13 Oct) | **★ Jira SV-11103 (12 Oct)** — adds the tooltip |
| L16 | Deleted inspection's note | PRD S4-N2 (22 Sep) "note remains, action not shown" · SV-10788 Viktoria question (2 Oct) · Stefan: note marked "Inspection deleted", greyed, View PDF/Download disabled (6 Oct) · PRD 6 Oct S4-N2: marked "Inspection deleted", leaves the asset tab | PRD v43 for the marking and the asset tab; **★ Jira SV-10788 (6 Oct) adds View PDF/Download disabled** (dev statement of existing SV-7648 behaviour, not a PM ruling) |
| L17 | Inspection on a completed line | V1: read-only until the line is uncompleted · **★ SV-10937 (dev, 9 Oct; QA pass 12 Oct): can be filled and submitted** | **★ Jira SV-10937** — no PM statement; V1 behaviour change PRD does not mention (Rule 96 invariant → PO confirmation advisable) |
| L18 | Uncovered findings | PRD "at least one line … split across runs" + "No empty lines … no non-AI line builder" · **SV-10910 dev (7 Oct): "our backend adds a plain line for any finding still uncovered"** | PRD v43 (dev statement is not a decision) — **PO question** whether a backend "plain line" is allowed |
| L19 | HEIC photograph on the customer report | Milan proposal (2) placeholder naming the format; PM "I agree with proposed solutions" (16 Sep) · PRD S13 silent since | **★ Comment (16 Sep)** — never written in, never contradicted |
| L20 | Starters | back-to-design 8 Sep: two active, four pending · PRD S12-R4 five + pending sixth · tech plan 22 Sep: applied to a draft, never published · SV-9881 · Release notes (9 Oct) five | PRD v43 S12-R4 (five + pending sixth); never-publish from tech plan (PRD silent, consistent) |
| L21 | Axle-field preview in the builder | back-to-design 8 Sep: dialog from the properties panel · PRD Key Decisions: Preview mode mounts the fill screen; panel-inline and modal rejected | PRD v43 |
| L22 | Two per-axle fields on one template | Tech plan 15 Sep: shared axle list · **Dusan 23 Sep (tech plan 30 Sep): per field** · PRD silent | **★ Tech plan (23 Sep)** — each field its own axles |
| L23 | Starting axles' Single/Dual | Design artboard untouched state Dual · tech plan 23 Sep: seeded Dual, brake type blank · PRD silent | **★ Tech plan (23 Sep)** (marked "confirm at Phase 5 build") |
| L24 | Mark field OK on a phone checkbox | Viktoria SV-11231 defect · design shows none · Viktoria (12 Oct): leave as is | Consistent with PRD S18-R11 |
| L25 | Text field label on the phone add-field sheet | PRD S12-R22 "one text option" ("Text") · SV-11089 build lists "Short answer" (12 Oct) | PRD for behaviour; the label is a build fact — **confirm "Short answer" vs "Text"** |

## 8 · Impact on the 91 live cases

Method (script, `impact.py`): every PRD code in every case's preconditions, steps and expected
results was matched against the added/removed/reworded lists; the quoted text was compared (normalised)
with the 22 Sep and the 14 Oct wording; code citations that occur only inside another, unchanged quote
were read in context and set aside. Later-decision rows (L12–L17) were added by grepping the behaviour.

**52 cases are touched; 27 still quote superseded or removed text, 22 already quote the current text,
3 carry current PRD text but miss a later Jira decision.**
- **Viktoria Videnovic's 19 edited cases** — every one quotes the current wording (her amendments cite
  v42; v43 changed nothing they quote): C88549, C88550, C88551, C88553*, C88557, C88558, C88560*,
  C88562, C88563, C88564, C88567, C88568, C88569, C88570, C88584, C88589, C88590, C88591, C88592
  (*cite no changed code).
- **27 quote superseded text**: 19 are **Automated cases flagged by Vladimir Tomovic** (C88513, C88514,
  C88518, C88520, C88522, C88525, C88527, C88528, C88529, C88532, C88533, C88536, C88537, C88538,
  C88539, C88540, C88542, C88548, C88572) — Rule 71 applies before any change; 8 are ours with no other
  editor (C88507, C88515, C88521, C88524, C88530, C88534, C88571, C88578).
- **Our 5 cases already current** from the 30 Sep reformat: C88510, C88552, C88554, C88580, C88582.
- **Later Jira decisions not in any case:** C88575 (SV-10960 reports after asset change), C88561 and
  C88579 (SV-11103 hover tooltip), C88529/C88532 (SV-10960 asset at deletion).

**New requirements with no case at all:** S3-R8, S4-R5 (outcome replaces Build lines on footer/note),
S13-R14, S13-R15 (inspected date; no new note on regenerate), S15-N6 (photos not sent), S15-E7 (empty
new WO stays; retry on same WO); and from later decisions: phone Save & exit (SV-10938), submit on a
completed line (SV-10937), per-field axle lists and Dual starting axles (tech plan), HEIC photo
placeholder on the report (16 Sep comment), S19-N3's new report content (C88592 quotes it — covered).

| Case | Title | Edited by others | Changed codes it cites | What changed / later decision | Reflects current source? |
|---|---|---|---|---|---|
| [C88507](https://shopview.testrail.io/index.php?/cases/view/88507) | Note required option on checkbox and per-axle fields, on by default | ours only | S1-R2 reworded — OLD | S1-R2 adds ", starters included". | NO — quotes superseded text |
| [C88510](https://shopview.testrail.io/index.php?/cases/view/88510) | Photo required if Not OK: off by default, checked on submit | ours only | S17-R2 reworded — current |  | YES — quotes current text |
| [C88513](https://shopview.testrail.io/index.php?/cases/view/88513) | Choose which work order gets the lines, or a new one, before drafting | Vladimir-flagged | S2-R15 removed — REMOVED code still quoted; S2-R4 reworded — OLD; S2-R5 reworded — OLD | S2-R15 removed (an unusable destination is no longer shown with a reason — S2-R5: the menu still opens and offers only a new work order). S2-R4 adds "and no invoice exists". | NO — quotes superseded text |
| [C88514](https://shopview.testrail.io/index.php?/cases/view/88514) | A line built from an inspection behaves like any approved line | Vladimir-flagged | S2-R1 reworded — OLD | S2-R1 adds "When drafting fails, S15-E2 applies instead". | NO — quotes superseded text |
| [C88515](https://shopview.testrail.io/index.php?/cases/view/88515) | After building you land on Lines, the finding is marked done, rebuild asks | ours only | S2-R13 reworded — OLD | S2-R13 rewritten: built once; no entry point offers the build again; a second Add Lines adds nothing and says where the lines went (no confirm-and-add-again). | NO — quotes superseded text |
| [C88518](https://shopview.testrail.io/index.php?/cases/view/88518) | Building lines with long notes, many findings, or a deleted work order | Vladimir-flagged | S2-E6 reworded — OLD; S2-E12 reworded — OLD; S5-R21 reworded — OLD, inside the OLD S2-E12 quote | S2-E6 (second Add Lines adds nothing) and S2-E12 (deleted run-on WO: inspection with report is a read-only record and does NOT count as needing a WO) rewritten — opposite of the old S2-E12 "counts as needing a work order again". | NO — quotes superseded text |
| [C88520](https://shopview.testrail.io/index.php?/cases/view/88520) | The summary card, counts per verdict, and the section review | Vladimir-flagged | S3-R4 reworded — OLD; S3-R6 reworded — OLD | S3-R4 findings list is now per flagged ROW with every flagged position and reading (example given); S3-R6 adds the deleted-WO footer (View PDF only). | NO — quotes superseded text |
| [C88521](https://shopview.testrail.io/index.php?/cases/view/88521) | Build lines is hidden, not greyed out, until the inspection is ready | ours only | S3-N4 reworded — OLD | S3-N4 wording ("and no build action" replaces "and nothing else"). | NO — quotes superseded text |
| [C88522](https://shopview.testrail.io/index.php?/cases/view/88522) | Building lines when the work order is deleted, built twice, or reopened | Vladimir-flagged | S2-R13 reworded — OLD, inside the OLD S3-E2 quote; S3-E1 reworded — OLD; S3-E2 reworded — OLD | S3-E1 (deleted WO: no build action, outcome if built before) and S3-E2 (check on current state per built-once rule) rewritten. | NO — quotes superseded text |
| [C88524](https://shopview.testrail.io/index.php?/cases/view/88524) | Building again asks to confirm, based on the inspection as it is now | ours only | S4-R3 removed — REMOVED code still quoted; S4-E2 removed — REMOVED code still quoted; S2-R13 reworded — OLD, inside the removed S4-R3 quote | S4-R3 and S4-E2 (confirm before building again) removed; replaced by S4-R5 outcome on the note and the built-once rule of S2-R13. | NO — quotes superseded text |
| [C88525](https://shopview.testrail.io/index.php?/cases/view/88525) | The note's Build lines is hidden until the inspection is ready | Vladimir-flagged | S4-N2 reworded — OLD | S4-N2 adds: removing an inspection from its line deletes it, it leaves the asset tab, its note stays marked "Inspection deleted". Jira SV-10788 (6 Oct): View PDF and Download disabled on that note. | NO — quotes superseded text |
| [C88527](https://shopview.testrail.io/index.php?/cases/view/88527) | Inspections tab columns: status, findings, work order, report and action | Vladimir-flagged | S5-R9 reworded — OLD | S5-R9 adds "The same wording is used wherever the outcome replaces the build action (S2-R13)". | NO — quotes superseded text |
| [C88528](https://shopview.testrail.io/index.php?/cases/view/88528) | Inspections tab filters, summary line and needs-action counts | Vladimir-flagged | S5-R10 reworded — OLD; S5-R11 reworded — OLD; S5-R12 reworded — OLD | Asset-tab filters removed (S5-R10 "The table has no filter row"; sort on Inspection, Status, Completed); summary now "N of M have findings with no lines yet"; S5-R12 ends "Those stay listed on the tab, with their issues shown". Case still tests All / Needs action / With issues / Not started filters. | NO — quotes superseded text |
| [C88529](https://shopview.testrail.io/index.php?/cases/view/88529) | Inspections tab links and buttons, phone use, and the inspection's asset | Vladimir-flagged | S5-R16 removed — REMOVED code still quoted; S5-R21 reworded — OLD | S5-R21 now says the tab FOLLOWS the work order when its asset changes or assets merge — the opposite of the old quote and of step 3 ("not a view that follows a later work-order asset change"). S5-R16 (filter row wraps) removed with the filters. Later decision SV-10960 (8 Oct): a WO deleted after an asset change leaves the inspection on the asset the WO had at deletion. | NO — quotes superseded text |
| [C88530](https://shopview.testrail.io/index.php?/cases/view/88530) | How findings are counted, once per axle | ours only | S5-R17 reworded — OLD; S5-R20 reworded — OLD | S5-R17 dropped "when the field is visible"; S5-R20 reworded; steps/expected still name the "Needs action filter". | NO — quotes superseded text |
| [C88532](https://shopview.testrail.io/index.php?/cases/view/88532) | Inspections tab with not-started, all N/A, deleted, moved and many inspections | Vladimir-flagged | S5-E3 reworded — OLD | S5-E3 rewritten (read-only record only if it has a report; no-report inspections are deleted with the WO; outcome shown only while its target WO exists; reopened inspection survives as its latest report). Step 3 "remains usable" no longer matches. Later decision SV-10960 (8 Oct) on which asset a kept inspection lands on. | NO — quotes superseded text |
| [C88533](https://shopview.testrail.io/index.php?/cases/view/88533) | Build lines from a needs-action row, with the same work order choice | Vladimir-flagged | S2-R15 removed — OLD, inside the OLD S6-R4 quote; S2-R5 (cited only inside an unchanged quote); S6-R4 reworded — OLD | S6-R4: an ineligible own WO "is not offered" (was "keeps its place and says why (S2-R15)"). | NO — quotes superseded text |
| [C88534](https://shopview.testrail.io/index.php?/cases/view/88534) | After building, the row shows the result and the counts update | ours only | S6-R7 reworded — OLD | S6-R7 now "the row will show its outcome instead of the action" (no Needs action filter); case step 3 still says "leaves the Needs action filter". | NO — quotes superseded text |
| [C88536](https://shopview.testrail.io/index.php?/cases/view/88536) | Row build with a deleted work order, per row, or a row you can't start | Vladimir-flagged | S6-E1 reworded — OLD; S6-E3 reworded — OLD | S6-E1 (deleted WO: no build action, dash or outcome) and S6-E3 (no explanation text on the dash any more) rewritten. | NO — quotes superseded text |
| [C88537](https://shopview.testrail.io/index.php?/cases/view/88537) | A work order note says its lines were built from an inspection | Vladimir-flagged | S7-R2 reworded — OLD | S7-R2 adds: if the run-on WO was deleted after the build, the note shows its number as text tagged "Work order deleted", no link. | NO — quotes superseded text |
| [C88538](https://shopview.testrail.io/index.php?/cases/view/88538) | The Audit Log records each build, wherever it was started | Vladimir-flagged | S7-R5 reworded — OLD | S7-R5 adds: deleted run-on WO number shown as text, no link. | NO — quotes superseded text |
| [C88539](https://shopview.testrail.io/index.php?/cases/view/88539) | The work order note and Audit Log match, including the line count | Vladimir-flagged | S7-R7 reworded — OLD; S7-R8 reworded — OLD | S7-R8 no longer says the asset row reads "3 lines added"; S7-R7 adds the one-record-failed rule. Case still expects "3 lines added". | NO — quotes superseded text |
| [C88540](https://shopview.testrail.io/index.php?/cases/view/88540) | Lines are kept if the note or Audit Log fails, deleted records handled | Vladimir-flagged | S7-E4 reworded — OLD | S7-E4 adds: inspection report notes move with a split line (SV-10913). | NO — quotes superseded text |
| [C88542](https://shopview.testrail.io/index.php?/cases/view/88542) | ShopCoach drafts lines with no typing, and its instructions are kept | Vladimir-flagged | S15-R6 reworded — OLD | S15-R6 rewritten: ShopCoach named in the completed-card note and the Line Builder panel title; not in the build action or the destination menu (was: named once at the destination step). | NO — quotes superseded text |
| [C88548](https://shopview.testrail.io/index.php?/cases/view/88548) | ShopCoach with no results, failures, leaving the page and several axles | Vladimir-flagged | S15-E2 reworded — OLD; S15-E5 reworded — OLD | S15-E2 rewritten (told it failed and can try again, no empty lines; reworded again 13 Oct, meaning unchanged per change log); S15-E5 now per flagged ROW with its flagged positions. | NO — quotes superseded text |
| [C88549](https://shopview.testrail.io/index.php?/cases/view/88549) | Building a template: the Per axle field, default rows, units, placement | Viktoria-edited | S8-R2 reworded — current; S8-R3 reworded — current; S8-R4 reworded — current; S8-R5 reworded — current; S8-R11 reworded — current |  | YES — quotes current text |
| [C88550](https://shopview.testrail.io/index.php?/cases/view/88550) | Building a template: editing axle rows, reference file and axle count | Viktoria-edited | S8-R6 reworded — current; S8-R7 reworded — current |  | YES — quotes current text |
| [C88551](https://shopview.testrail.io/index.php?/cases/view/88551) | Filling an inspection: setting up each axle and recording values | Viktoria-edited | S8-R11 reworded — current |  | YES — quotes current text |
| [C88552](https://shopview.testrail.io/index.php?/cases/view/88552) | Filling: verdict colours, the worst verdict wins, and the truck diagram | ours only | S8-R14 reworded — current |  | YES — quotes current text |
| [C88554](https://shopview.testrail.io/index.php?/cases/view/88554) | The finished report shows per-axle results and findings per row | ours only | S5-R20 (cited only inside an unchanged quote); S8-R24 reworded — current; S8-R25 reworded — current; S8-R26 reworded — current; S13-R0 (cited only inside an unchanged quote) | Quotes current S8-R24/R25/R26; steps still reference S13-R0 for the report (now rewritten) — check step wording. | YES (check step wording) |
| [C88557](https://shopview.testrail.io/index.php?/cases/view/88557) | Attach one file per question: file types, panel, size limit and names | Viktoria-edited | S11-R2 reworded — current; S11-R3 reworded — current |  | YES — quotes current text |
| [C88558](https://shopview.testrail.io/index.php?/cases/view/88558) | The technician opens the attached file, unsupported types offer download | Viktoria-edited | S11-R11 added — current; S11-R9 reworded — current; S19-R19 (cited only inside an unchanged quote) |  | YES — quotes current text |
| [C88561](https://shopview.testrail.io/index.php?/cases/view/88561) | A failed upload, replacing a file, long names and a missing file | ours only | — | Codes unchanged; SV-11103 (12 Oct) adds full name on hover for shortened names. | PARTLY — current PRD text, later Jira decision not in it |
| [C88562](https://shopview.testrail.io/index.php?/cases/view/88562) | A brand-new template only offers to choose a starting point | Viktoria-edited | S12-R1 reworded — current |  | YES — quotes current text |
| [C88563](https://shopview.testrail.io/index.php?/cases/view/88563) | The starter templates, including the coming soon equipment starter | Viktoria-edited | S12-R4 reworded — current |  | YES — quotes current text |
| [C88564](https://shopview.testrail.io/index.php?/cases/view/88564) | Field settings: measurement row cards and answer options | Viktoria-edited | S8-R7 (cited only inside an unchanged quote); S12-R8 reworded — current; S12-R9 reworded — current; S12-R10 reworded — current |  | YES — quotes current text |
| [C88567](https://shopview.testrail.io/index.php?/cases/view/88567) | One text field replaces short and long text, per-axle explained | Viktoria-edited | S12-N4 added — current; S12-R24 reworded — current |  | YES — quotes current text |
| [C88568](https://shopview.testrail.io/index.php?/cases/view/88568) | Preview shows the fill screen read-only, except the axle control | Viktoria-edited | S12-R29 (cited only inside an unchanged quote); S12-R31 reworded — current; S12-R32 reworded — current |  | YES — quotes current text |
| [C88569](https://shopview.testrail.io/index.php?/cases/view/88569) | Templates list, per-axle starters, the Axles control and required fields | Viktoria-edited | S12-R28 reworded — current; S12-R29 reworded — current |  | YES — quotes current text |
| [C88570](https://shopview.testrail.io/index.php?/cases/view/88570) | Choosing a starting point again, clearing labels, and descriptions | Viktoria-edited | S12-N1 reworded — current |  | YES — quotes current text |
| [C88571](https://shopview.testrail.io/index.php?/cases/view/88571) | Deleting the last section or the selected field, long names, live preview | ours only | S12-E1 reworded — OLD | S12-E1 adds "Starting points are not offered again". Later decision SV-11103 (12 Oct): long names end with "…" and show the full name on hover. | NO — quotes superseded text |
| [C88572](https://shopview.testrail.io/index.php?/cases/view/88572) | What the customer report says, and what it no longer shows | Vladimir-flagged | S13-R0 reworded — OLD | S13-R0 rewritten: one block per axle, never split across a page, axle result in the axle header, sub-tables headed OUTER + INNER / 1 PER SIDE, flagged values carry the tile icon (triangle / clock), grey dash for unmeasured, NO per-row status column. Case still expects "a status column carrying the row's derived verdict". Report never prints Not OK (Key Decision). | NO — quotes superseded text |
| [C88575](https://shopview.testrail.io/index.php?/cases/view/88575) | The customer report stays correct when regenerated or republished | ours only | — | Codes unchanged, but SV-10960 (8 Oct, PM): changing a WO's asset or merging assets does not regenerate existing reports; a manual regenerate takes the WO's current asset and keeps the inspected date (S13-R14 added 5 Oct). Not covered. | PARTLY — current PRD text, later Jira decision not in it |
| [C88578](https://shopview.testrail.io/index.php?/cases/view/88578) | On a phone: reference files, outstanding work and the back button | ours only | S14-R6 reworded — OLD; S14-R7 reworded — OLD | S14-R6 adds "Nothing blocks finishing a section … Everything outstanding is collected at submit"; S14-R7 now "moves to that field" plus a "Go to the first one" action. | NO — quotes superseded text |
| [C88579](https://shopview.testrail.io/index.php?/cases/view/88579) | On a phone: scrolling, overlapping items, many axles and long names | ours only | — | Codes unchanged; SV-11103 (12 Oct) adds full name on hover for shortened names. | PARTLY — current PRD text, later Jira decision not in it |
| [C88580](https://shopview.testrail.io/index.php?/cases/view/88580) | Mark all, section or field OK sets only OK and never adds values | ours only | S18-R1 reworded — current |  | YES — quotes current text |
| [C88582](https://shopview.testrail.io/index.php?/cases/view/88582) | Explaining what Mark OK covers, on the three phone screens | ours only | S18-R10 reworded — current; S18-R11 reworded — current |  | YES — quotes current text |
| [C88584](https://shopview.testrail.io/index.php?/cases/view/88584) | Building a template: the follow-up switch and the answer blocks | Viktoria-edited | S19-R5 reworded — current |  | YES — quotes current text |
| [C88589](https://shopview.testrail.io/index.php?/cases/view/88589) | Filling: the attached file, the instruction text and the two layouts | Viktoria-edited | S19-R19 reworded — current |  | YES — quotes current text |
| [C88590](https://shopview.testrail.io/index.php?/cases/view/88590) | Submitting needs every required acknowledgement, listed as outstanding | Viktoria-edited | S14-R6 (cited only inside an unchanged quote); S19-R25 reworded — current |  | YES — quotes current text |
| [C88591](https://shopview.testrail.io/index.php?/cases/view/88591) | Preview shows every follow-up, acknowledgement inactive, no banner | Viktoria-edited | S12-R31 (cited only inside an unchanged quote); S19-R28 reworded — current |  | YES — quotes current text |
| [C88592](https://shopview.testrail.io/index.php?/cases/view/88592) | Follow-ups: not on per-axle fields, empty ones blocked, report without the file | Viktoria-edited | S5-R17 (cited only inside an unchanged quote); S19-N3 reworded — current |  | YES — quotes current text |


## Reading coverage

| Source | Size | Lines read | Coverage |
|---|---|---|---|
| PRD v43, `CONFLUENCE-768507905-2026-10-14.md` | 112,566 B, 977 lines | 1–977, top to bottom incl. Key Decisions, Glossary and the whole Change Log | 100% |
| PRD v43 panel-preserving fetch (`…-fetch-with-panels.md`) | 115,008 chars | compared to the above by script after normalising markdown; the single difference (S15 status panel) read | 100% (by script + the one differing block) |
| PRD 22 Sep copy | 99,118 B, 951 lines | compared in full by script; every changed line (206 diff lines) read | 100% by script; changed parts read |
| Confluence comments | 20 comments (1 footer thread, 9 inline threads) | all, incl. replies; statuses open/resolved/reopened/dangling; footer current + archived | 100% |
| Jira | 71 issues; 67 touched since 22 Sep; rendered body 209,297 B / 3,378 lines | 1–3,378 (every description and all 103 comments); SV-9440 change history | 100% |
| Tech plan 22 Sep vs 30 Sep | 154,009 B / 1,128 lines → 225,725 B / 1,562 lines | script diff, 584 diff lines (54 hunks) read; the 1,082 identical lines verified identical by script and not re-read this pass (read in the 22 Sep / 30 Sep passes) | changed parts 100% |
| Handoff .md (7 pairs) | 12–62 KB each | script diff per pair, every changed line read; top-level vs `design_handoff_dvi_v2/` copies byte-identical | changed parts 100% |
| `uploads/dvi-v2-back-to-design.md` (new to us) | 11,288 B, 213 lines | 1–213 | 100% |
| `uploads/` design-brief, shopcoach prompt | — | identical to 22 Sep copies | 100% (by script) |
| `_ds/…/README.md` (design-system readme) | — | not read — belongs to the design-screens worker's scope | 0% (out of this worker's scope) |
| Slack #fs-dvi-v2 since 22 Sep | 19 messages | all; thread search (one thread, 21–22 Sep) | 100% |
| Release notes 926384341, Project plan 902660109, hub 935002119, Standups 935788548 | small | all | 100% |
| ShopCoach proposed brief (Slack file F0C8QC8CFTK) | — | **could not be read** (file_not_found via the public-channel tool) | 0% — blocked |
| 91 case snapshots | 91 JSON | scripted only (code and phrase matching), plus context reads of 26 cases | 100% by script |

## Outstanding — what I need from you

1. **27 live cases quote superseded or removed PRD text** (19 of them are Vladimir's Automated cases,
   Rule 71; 8 are ours alone). Editing any of them is a TestRail write and needs your go-ahead; the 19
   also need Vladimir told (Rule 65). Slack 12 Oct says "QA on the feature squad owns writing and
   updating test cases" — please say whether we still edit this suite at all.
2. **Decide on the ★ items** (L12–L19, L22–L23): should cases follow SV-10960, SV-10938, SV-11103,
   SV-10937, the 16 Sep HEIC-placeholder agreement and the tech plan's per-field axles — or wait for the
   PRD? SV-10937 changes V1 behaviour and SV-10910's backend "plain line" is a PO question.
3. **Six new PRD requirements have no case** (S3-R8, S4-R5, S13-R14, S13-R15, S15-N6, S15-E7) — new
   cases are blocked by the active creation hold (Rule 62, H1) unless lifted.
4. **ShopCoach proposed brief** (Slack file F0C8QC8CFTK, linked from PRD v43 S15) is not readable from
   here — share it or its channel if S15 cases should be checked against it.
5. Production release is planned **Thu 15 Oct 2026** (project plan) — tomorrow.
