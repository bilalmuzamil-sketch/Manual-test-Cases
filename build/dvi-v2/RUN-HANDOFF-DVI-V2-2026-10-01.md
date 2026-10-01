# HANDOFF → RUN SESSION — DVI V2 (Digital Inspection V2) · 91 cases
### Execute on QA branch **sv8181.qa.shopview.com** (build `v26.36.8-2a64085`) and record results. 2026-10-01.

**You are the run session.** All 91 are build-verified on sv8181 (evidence: `build/dvi-v2/build-verify-2026-10-01/`,
observed labels: `build/dvi-v2/OBSERVED-UI-LABELS-sv8181.md`, routes/API: `build/dvi-v2/NAVIGATION-MAP.md`).
Each is runnable from the UI, renders `fr-view`, stamped *"Last checked against build v26.36.8-2a64085 on 10/1/2026."*,
and marked **AUTOMATION: READY**. Execute each, mark **Passed / Failed / Blocked**.

- **Scope:** **91 cases**, `created_by=3`, TestRail project 1 (suite "Master"), group **6658** "Digital Inspection V2
  (Aug 2026)", 17 story-sections (S1–S19 + tech-plan). 0 foreign, 0 automated.
- **Environment:** QA branch **sv8181.qa.shopview.com** (app) / **sv8181api.qa.shopview.com** (API). Disposable —
  full CRUD, tag throwaway data `ZZAUTOTEST`, restore (Rule 6/107).
- **Build marker:** `v26.36.8-2a64085` (read live 2026-10-01). Re-read before starting; routes/labels hold if it moved.

## Access (QA branch behind Cloudflare — THREE cookies)
- Needs `sv_sso_session` + `PHPSESSID` + `cf_clearance` (ask the QA lead for a fresh set; expire ~24h/on deploy).
  Put in `/tmp/cln/sv8181-cookies.json` (chmod 600, /tmp only, NEVER committed); sso-only in `/tmp/qa-cookies/sv8181-sso.txt`.
- Browser: `node build/testing-tools/qa-branch-boot.mjs sv8181 <route> admin`. Chrome-131 UA (cf_clearance UA-bound);
  node fetch `NODE_USE_ENV_PROXY=1`; refresh bridge `source build/testing-tools/ensure_bridge.sh`.
- TestRail API rate-limits rapid bursts (HTTP 400) — page reads in small paced batches.

## The run + result writes — needs the QA lead's go-ahead (Rule 6)
No manual run exists for these. Ask the QA lead to authorise creating a run "DVI V2 — manual execution (sv8181)"
over these 91 C-ids, then record with `build/testing-tools/push_results_to_run.py`, union-only (Rule 34).

## Glossary is build-aligned; Expected substance is the spec's (Rule 114)
On 2026-10-01 the on-screen names in the cases were aligned to sv8181: role perms read in the build's casing
("Work orders" / "Work order lines" / "Customers" group + "Create & Edit"/"View"); the findings→WO action is
**"Build lines"** / confirm **"Add Lines"**; template builder, field RESPONSE SETTINGS, per-axle and response
badges match the build. The **Expected outcome wording stays the spec's.**

## Key confirmed routes (full map in NAVIGATION-MAP.md)
- Template builder: `/inspection-templates/new` (list under Settings → Service → "Inspection Templates").
- Inspection results (a run): `/inspections/<uuid>` — from a WO line's inspection row, click "Open ›".
- Findings → WO: "Build lines" → "BUILD THE LINES ON" → "A new work order" / open WO; ShopCoach line builder,
  "Add Lines". Asset history: Customers → vehicle record → "Inspections" tab.

## 🔎 Screens to confirm LIVE when you run (entry points + config confirmed; the live-fill render was not raisable via automation)
- **In-progress filling** per-response states: "Marked OK" / "Needs action" / "Follow-up for this response"
  (the completed/locked view shows final OK/Monitor/Not OK/N/A badges; the live-fill states need an inspection
  you fill). Affects S1/S17/S19 filling-side cases.
- **Per-axle filling** controls (Drum / Disc / Single / Dual, unit selector) — S8. (Builder per-axle config IS confirmed.)
- **Customer-facing report** content + "Require acknowledgement" — S13. (The "PDF"/"Customer Report" export IS present.)
- **Phone-width rendering** — S14.
If any label differs from the case wording, it's a build-glossary nit to note (not a Fail).

## The 91 cases (by story)
| C-id | Story | Title |
|---|---|---|
| C88507 | S1 | Note-required option on checkbox and per-axle fields, on by de |
| C88508 | S1 | A required note is enforced on submit and listed as outstandin |
| C88509 | S1 | Note-required rule: negatives and edge cases |
| C88510 | S17 | Photo-required-if-Not-OK option, on by default, enforced on su |
| C88511 | S17 | Photo rule vs unconditional Photo required; target and HEIC |
| C88512 | S17 | Photo-required rule: negatives and edge cases |
| C88513 | S2 | Choose the target work order before drafting; eligibility and  |
| C88514 | S2 | A generated line behaves as an ordinary approved line |
| C88515 | S2 | Landing on Lines tab, actioned state, and a second-build confi |
| C88516 | S2 | Permissions gate the build; the server enforces withheld actio |
| C88517 | S2 | The build is not offered when its preconditions are not met |
| C88518 | S2 | Edge cases: long notes, many findings, concurrent/deleted WOs |
| C88519 | S3 | Build lines from the completed inspection screen, incl. on a p |
| C88520 | S3 | The summary card, per-verdict counts, and the section review |
| C88521 | S3 | Build lines is absent (not disabled) unless preconditions met |
| C88522 | S3 | Edge cases: deleted work order, concurrent build, reopening |
| C88523 | S4 | Build lines from the report note, incl. phone and ineligible W |
| C88524 | S4 | Re-build confirmation is judged on the inspection's current st |
| C88525 | S4 | The note's Build lines action is absent unless preconditions m |
| C88526 | S5 | The Inspections tab appears on the asset and lists every inspe |
| C88527 | S5 | Each column behaves as specified: status, findings, WO, report |
| C88528 | S5 | Filters, summary line, 'needs action' definition, counts acros |
| C88529 | S5 | Links vs buttons, phone usability, and the asset on the inspec |
| C88530 | S5 | How findings are counted: the single definition, per axle |
| C88531 | S5 | The tab and its actions are withheld by permission and configu |
| C88532 | S5 | Edge cases: not-started, all-N/A, deletions, moves, archives,  |
| C88533 | S6 | Build from a needs-action row: shared target menu and eligibil |
| C88534 | S6 | After building, the row shows its outcome and counts update |
| C88535 | S6 | The build action and targets are withheld by permission/config |
| C88536 | S6 | Edge cases: deleted WO, per-row build, a row the viewer can't  |
| C88537 | S7 | A note records the work order was built from an inspection |
| C88538 | S7 | An Audit Log entry records the build, from any entry point |
| C88539 | S7 | The note and Audit Log carry the same facts, incl. line count |
| C88540 | S7 | Edge cases: write failure, deletions, and a split work order |
| C88541 | S15 | The ShopCoach brief: its content, structure and constraints |
| C88542 | S15 | No typing to get lines; the AI treatment; the brief is preserv |
| C88543 | S15 | Drafting runs alongside navigation; nothing added until Add Li |
| C88544 | S15 | Proposed lines arrive selected, editable, traceable; phone mod |
| C88545 | S15 | The proposed-lines panel is shared with the Line Builder |
| C88546 | S15 | The brief is verifiable before release and the model is record |
| C88547 | S15 | Negatives: no ShopCoach, passing findings, ungiven parts, dese |
| C88548 | S15 | Edge cases: empty results, failures, navigation, multi-axle, M |
| C88549 | S8 | Authoring: the Per axle field type, default rows, units, place |
| C88550 | S8 | Authoring: editing rows, reference file, axle count, Measureme |
| C88551 | S8 | Filling: setting up each axle and recording values |
| C88552 | S8 | Filling: verdict tinting, worst-wins derivation, the truck dia |
| C88553 | S8 | Filling: Single/Dual, axle add/delete/expand, per-row units, l |
| C88554 | S8 | Output: the read-only view/report, per-axle counting, per-row  |
| C88555 | S8 | Negatives: unanswered fields, blank brake type, value-without- |
| C88556 | S8 | Edge cases: N/A meanings, free text, road trains, version pinn |
| C88557 | S11 | Attach one file per question: types, panel, size limit, names |
| C88558 | S11 | The technician opens the file; unrenderable types handled hone |
| C88559 | S11 | Attachments are shop-scoped and survive template republishing |
| C88560 | S11 | Negatives: video, other shops, and removed attachments |
| C88561 | S11 | Edge cases: failed upload, replacement, long names, missing fi |
| C88562 | S12 | A brand-new template offers only the starting-point choice |
| C88563 | S12 | The starter library: slots, the pending equipment starter, sec |
| C88564 | S12 | Field properties: measurement row cards and response options |
| C88565 | S12 | Field properties: validation errors and the report-wording too |
| C88566 | S12 | The canvas: field rows, summaries, and empty sections |
| C88567 | S12 | One text field replaces short/long text; the per-axle explanat |
| C88568 | S12 | Preview mode mounts the fill screen, read-only but the axle co |
| C88569 | S12 | Templates list, per-axle starters, the Axles control, required |
| C88570 | S12 | Negatives: reapplying a starting point, cleared labels, descri |
| C88571 | S12 | Edge cases: last section, deleted selected field, long names,  |
| C88572 | S13 | What the report says: content and the removals |
| C88573 | S13 | The work order number and inspected date are formatted correct |
| C88574 | S13 | Who the report is addressed to |
| C88575 | S13 | What the report must survive: regeneration and republishing |
| C88576 | S13 | Negatives/edge: missing company, missing contact, sparse data, |
| C88577 | S14 | Per-axle rendering and touch on a phone |
| C88578 | S14 | Reference files, outstanding work, and the phone back control |
| C88579 | S14 | Negatives/edge on a phone: scrolling, overlap, many axles, lon |
| C88580 | S18 | Mark OK at three levels: what it sets, never invents, untouche |
| C88581 | S18 | After the press: coverage report, nested reporting, Undo, clea |
| C88582 | S18 | Explaining the scope on demand, and the three phone surfaces |
| C88583 | S18 | Negatives/edge: no-verdict fields, read-only/Preview, answered |
| C88584 | S19 | Authoring: the follow-up toggle and the response blocks |
| C88585 | S19 | Authoring: the acknowledgement toggle, slot binding, retention |
| C88586 | S19 | Authoring: the canvas row, on-demand explanations, file labels |
| C88587 | S19 | Filling: the Instruction word, and where and when it opens |
| C88588 | S19 | Filling: the acknowledgement's marker, control, and record |
| C88589 | S19 | Filling: the attached file, the text, and the two layouts |
| C88590 | S19 | Submit and outstanding items: the acknowledgement gate |
| C88591 | S19 | Preview: every follow-up shown, inert acknowledgement, no bann |
| C88592 | S19 | Negatives: per-axle, empty follow-ups, report, ShopCoach, coun |
| C88593 | S19 | Edge cases: changing a response, republish, Mark OK, long text |
| C154644 | TP | Feature flag off: every new inspection surface is absent |
| C154645 | TP | Verdict is never colour alone; colour placement; dark theme |
| C154646 | TP | New read paths are scoped to organisation and workplace |
| C154647 | TP | 'Not inspected' is absence of a verdict, never a selectable op |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | QA lead go-ahead to create the manual run over these 91, then record Passed/Failed/Blocked. |
| 2 | Confirm the four live-only screens above (filling states, per-axle fill, customer report, phone). |

**Standing holds:** no Jira/external artefact without the QA lead; no TestRail case writes to foreign cases;
run creation + result writes need his go-ahead (Rule 6); secrets never committed; QA branch is disposable.

---
_(Rule 95 — Token-Discipline Charter: canonical copy build/skills/TOKEN-DISCIPLINE-CHARTER.md.)_
