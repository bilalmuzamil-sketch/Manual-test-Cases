import json, re, collections
ROOT = '/home/user/Manual-test-Cases/build/maintenance-reminder-v2/'
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
SP = os.path.join(HERE, 'work') + '/'
P = json.load(open(ROOT + 'source-update-2026-10-06/chunk1-proposals.json'))
import sys
sys.path.insert(0, SP)
import p_new
from p_upd1 import FLAGWHY
NFLAG = sum(1 for u in P['updates'] if u['why'].strip() == FLAGWHY.strip())
A = json.load(open(ROOT + 'source-update-2026-10-06/anchors-old-new.json'))
old, new = A['old'], A['new']
cc = json.load(open(SP + 'casecheck.json'))
oldrows = cc['rows']
cnt = collections.Counter(r[2] for r in oldrows)
link = lambda i: f'[C{i}](https://shopview.testrail.io/index.php?/cases/view/{i})'
cite = collections.defaultdict(list)
for u in P['updates']:
    for ref, q in u['quotes']:
        if re.match(r'^S\d+-[A-Z]+\d+$', ref) and f"C{u['case_id']}" not in cite[ref]: cite[ref].append(f"C{u['case_id']}")
for i, n in enumerate(P['new'], 1):
    for ref, q in n['quotes']:
        if re.match(r'^S\d+-[A-Z]+\d+$', ref) and f'NEW-{i}' not in cite[ref]: cite[ref].append(f'NEW-{i}')
oldcite = collections.defaultdict(set)
for r in oldrows: oldcite[r[1]].add(r[0])
L = []
w = L.append
w('# Chunk 1 source update — findings (Maintenance Reminders, 6 Oct 2026)')
w('')
w('Scope: the 81 live Chunk 1 cases (TestRail folder 19397, C146309–C146389), stories S1–S9, S13, S14, S21, plus the Chunk 1 page\'s copies of S11 and S18 rules. Nothing was written to TestRail and nothing was committed. Proposals: `chunk1-proposals.json` (this folder).')
w('')
w(f"**Counts:** {len(P['updates'])} updates (full replacement content) · {len(P['new'])} new cases · {len(P['diverge'])} DIVERGE items · {len(P['exclude'])} EXCLUDE items.")
w('')
w('**Why all 81 are updates:** every precondition says the feature "ships behind the maintenance_reminders flag"; the 5 Oct spec says it ships to every organization with no feature flag. Every Source line is restamped to the 5 Oct spec. ' + f'{NFLAG} cases change only in that way (plus the Settings-entry wording and the "Enroll in Schedule" label); {len(P["updates"]) - NFLAG} change in substance.')
w('')
w('**Marker and source stamp (coordinator decision, 6 Oct):** every update and new case carries `marker` = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build", and every Source line ends "read 6 Oct 2026. Source-verified 6 October 2026; not yet build-verified." The coordinator\'s renderer takes the Source text as-is; mr_lib\'s old MARKER (which names the flag) and its 29 September stamp are not used.')
w('')
w('**Second pass (coordinator decisions, 6 Oct):** (1) marker and stamp as above; (2) the six S21 audit cases stay manual: each has real hand steps for what is visible, and the plain results say the audit part "cannot be checked by hand in v1 — no screen shows the audit"; (3) reading histories are now seeded by hand through Mark complete On a work order, which records that work order\'s mileage and engine hours as readings dated the Reset date (S18-R19): C146352, C146355, C146357, C146364, C146385, C146386 and NEW-7 carry the recipe ("ZZAUTOTEST Reading seed" schedule, "ZZ Seed n" services, one work order per reading, oldest first) with worked values that produce exactly what each case checks; (4) send cases tell the tester to give the contact an email address they can open, so the reminder lands in their own inbox; (5) NEW-2 uses "the organization\'s Feature flags page" and stays on HOLD until the label is confirmed on the build.')
w('')
w('**Third pass (final design drive, 6 Oct):** DESIGN-DRIVE-FINDINGS.md (646 lines) and spec-comparison.md (134 lines) read in full; every design label used was confirmed against the drive\'s exposed texts (Chunk 1-interactions.jsonl, Chunk 1-pages.txt and the Demo board\'s, gathered by `drive_corpus.py` into 244 distinct texts) or the board text. (a) Design-only details a tester sees (tooltips, hover cards, empty states, messages) were added to the 28 cases that already reach that screen, each as "On the design …" with the artboard in the Source line and the design text quoted: C146310, C146313, C146314, C146316, C146317, C146318, C146320, C146324, C146325, C146326, C146329, C146331, C146338, C146340, C146341, C146343, C146347, C146348, C146352, C146353, C146355, C146360, C146363, C146364, C146366 (design hover wording, for the tester to record), C146371, C146373, C146374, plus NEW-25 (Send email dialog fields). None contradicts the spec, so no new case was needed: every design-only detail sits on a screen an existing case already drives. (b) Every Chunk 1 "design differs from spec" row is now in DIVERGE, both texts verbatim (D34–D53, 20 added: 13 drive 3b rows not already present (rows 1, 2, 4, 5, 15, 16, 17–23), 6 further differences the drive exposed in its 3a list — compliance drag tooltip, two Remind before expiry wordings, blank-date hint only in a hover, the spec\'s own digits-only vs "rejected inline" conflict, "Set contact" vs "Add contact information", the Demo\'s Send reminder confirmation step — and the 35 dead "Create work order" links as a design-package note, no case). Rows already present (D4, D6, D7, D8, D9, D13, D19, D24) stay as they were. (c) Labels settled by the design: Settings entry "Maintenance" (spec and design sidebar; tech plan "Maintenance schedules" stays a DIVERGE), empty list "No schedules yet" / "Create the first schedule", list button "New Schedule", worklist heading "Status", tile "Due in three months", empty worklist "Nothing is due.", record form "Add history record", enrolment title "Enroll in a schedule", send dialog "Send email". Where the spec words differ the case keeps the spec and asks the tester to record the build\'s wording.')
w('')
w('## 1. Per-source verdicts')
w('')
w('| Source | Verdict | What it changed |')
w('|---|---|---|')
w('| Chunk 1 MR (Confluence 886931488) as edited 5 Oct 2026 vs the 29 Sep copy | **UPDATE + ADD** | 270 anchors now (254 before): 49 changed, 19 added, 3 removed, 202 the same. Changes drive the substantive updates; the 19 added anchors drive most new cases; S2-R19 and S7-R7, cited by no case before, are now quoted in C146323 and C146340. |')
w('| Maintenance Reminders V1 main page (833290250), key decisions | **UPDATE + ADD** | No feature flag (all 81). Loading/error/failed-save, phone, and permissions decisions had no case: NEW-20, NEW-22, NEW-23, NEW-24. |')
w('| Review decisions 892305428 (Chunk one), 891944985 (Chunk three), 841678852 (open questions), run log 891519016 | **CONFIRM** | Every Chunk 1 item is answered in or superseded by the 5 Oct spec. Open items left (MF-14/15/16/18, OQ-4) are Chunk 2; OQ-5 is not testable. Nothing to add. |')
w('| Plan 1 — Track, act, clear — Technical Implementation Plan (5,363 lines) | **ADD (informs) + DIVERGE + EXCLUDE** | Added tester-visible details the spec does not give: first Save keeps the editor open with a toast (D21); archived names reserved (S1-E2 row); "Lines from {home}" before first Save (FD-23); read-only lines also hide Move up/down (FD-24); 13/14/15-day and 29/30 boundaries (P1 tests); certificate clamp both ways (Q15, certificateDates tests); Undo complete only for the latest Mark complete and "This can no longer be undone" (§1, §5.4); Open/Invoice offer a location switch (FD-16); Invoice falls back to Open work order (FR10); Settings entry not gated on Digital Inspections (FR13); hover by focus/Enter/tap (NFR-F08); loading never shows 0 (NFR-F03); testability note B5 (no API to backdate a reading; answered by the hand route of S18-R19). Divergences: name matching (TD-23), Status column (P5), toggle disabled vs hidden, Settings entry label. DB/API/architecture excluded. |')
w('| Plan 2 — The work order and the customer (sections touching Chunk 1) | **ADD (informs) + DIVERGE** | Send reminder states and "Last sent {date}" (FD-216); send dialog title and toast differ from the design. (NFR-118 sends QA mail only to allowed addresses; testers use an address they can open.) |')
w('| Design board "Chunk 1.dc.html", 6 Oct vs 29 Sep | **UPDATE (labels) + DIVERGE** | New board: "covered" (not "absorbed"), "Lines from <home>", "Enroll in Schedule", Start/End date, "ends 14 Oct 2026", Mark complete modal, Send email dialog, contact-card states. 33 divergences recorded from the board itself (section 6, D1–D33); the spec wins in every case and no case follows the design where they differ. |')
w('| Design-package reading notes (other worker, 1,277 lines) and NEW-SCREENSHOTS-READ | **CONFIRM + DIVERGE** | Screenshots and handoff markdown are older than the spec (spec wins). Folded in: "Not on a maintenance schedule", "Certificate unknown", "Add history record", rule-in-cell, one-pair Low grade, "Completed", remove-confirm outcome, 2-month default, "at always takes a month", covering (i), 36 months, one labelled phone, phone hover ending, live-WO rows. |')
w('| Design inventories inv1/inv1b/inv1c and audit.json | **CONFIRM (superseded)** | An intermediate snapshot (still "absorbed", Effective/Expiry); nothing new. |')
w('| "Canned lines per location - proposal.dc.html" | **CONFIRM** | Matches S4-R7/R8 and S13-R30/S16-N6 (used in NEW-3 and NEW-18). Design-only: the picker marks lines already on the service "Already added". |')
w('| "Maintenance Reminders Demo.dc.html", "4-work-order (old WO chrome).dc.html" | **EXCLUDE (superseded)** | Older board states; the work-order board is Chunk 2. |')
w('| Design drive (DESIGN-DRIVE-FINDINGS.md, final; spec-comparison.md) | **ADD (design-only details) + DIVERGE** | 3a: 45 Chunk 1 items; 28 cases and NEW-25 now carry what the tester sees (tooltips, hover cards, messages, empty states); designer notes, the reading-card (i)s of S10/S11 (Chunk 2) and the proposal-board hover are excluded with reasons. 3b: rows 1–5, 7–10, 12–23 are Chunk 1 and all are in DIVERGE (D4, D6, D7, D8, D9, D13, D19, D24 were already there; D34–D53 added). Dead links: 35 "Create work order" links point at a missing Chunk 2#v5 (design note). Spec states no artboard draws: the cases keep the spec text as their only source. |')
w('')
w('## 2. Quote check')
w('')
w(f"- **Old cases against the 5 Oct spec:** {len(oldrows)} quotes: {cnt.get('OK',0)} verbatim, {cnt.get('MISMATCH',0)} no longer verbatim, {cnt.get('ANCHOR-REMOVED',0)} cite removed anchors (S3-R12 in C146325, S7-N1 in C146339, S7-N3 in C146345).")
w('- Defects that pre-date the spec change: the spec\'s quotation marks around "Every" and "At" were dropped (C146318, C146320, C146322, C146341); "unenrols" for the spec\'s "unenrolls" (C146336, C146338). Fixed in the updates.')
CR = json.load(open(SP + 'check_result.json'))
nqc = sum(len(x['quotes']) for x in P['updates'] + P['new']); nqd = 2 * len(P['diverge'])
assert CR['nq'] == nqc + nqd and not CR['fails'] and not CR['lint']
w(f'- **Proposals:** {CR["nq"]} quotes ({nqc} in cases, {nqd} in DIVERGE pairs) checked by script against the cleaned sources (spec anchors with `**` and backslashes removed, "..." elisions allowed; Plan 1 / Plan 2 / main page text; the design board\'s visible and attribute text). **{CR["nq"]} of {CR["nq"]} verbatim, {len(CR["fails"])} failures.** All {len(P["updates"]) + len(P["new"])} titles are 80 characters or fewer (longest {max(len(x["title"]) for x in P["updates"] + P["new"])}). A lint over every precondition, step and result found no story ids, Jira keys, "flag", "absorb", "Effective", "expiry month", "DVI", "API" or "Plan" references. Every script is saved in `chunk1-scripts/` (run `python3 build.py --write`, then `python3 mkmd.py`; `casecheck.py` and `anchors.py` run from `build/maintenance-reminder-v2/`).')
w('- Every one of the 270 current anchors is cited by at least one proposed case (table below).')
w('')
w('## 3. Anchor coverage — every current anchor')
w('')
w('Verdict: CONFIRM = text unchanged since 29 Sep; UPDATE = text changed; ADD = new anchor. Cases: the proposed cases that quote it (Cxxxxxx = update of that case, NEW-n = n-th new case).')
w('')
w('| Anchor | Verdict | Proposed cases | Cited before by |')
w('|---|---|---|---|')
for a in new:
    v = 'ADD' if a not in old else ('UPDATE' if old[a] != new[a] else 'CONFIRM')
    before = ', '.join(f'C{x}' for x in sorted(oldcite.get(a, []))) or '—'
    w(f"| {a} | {v} | {', '.join(cite.get(a, [])) or '**none**'} | {before} |")
w('')
w('**Removed anchors:** S3-R12 (rename/delete of a compliance type; C146325 rewritten), S7-N1 (asset with no customer cannot be enrolled; C146339 rewritten), S7-N3 (services falling due after enrolment send normally; C146345 rewritten).')
w('')
w('## 4. Updates (81) — one line each')
w('')
w('Full replacement content (title, preconditions, steps, results, source, quotes) is in the JSON. "Flag" = the stale feature-flag precondition and the Source restamp, which apply to every case.')
w('')
w('| Case | New title | Why |')
w('|---|---|---|')
for u in P['updates']:
    why = u['why'].replace(FLAGWHY, '').strip() or 'Flag only (no requirement change).'
    w(f"| {link(u['case_id'])} | {u['title']} | {why} |")
w('')
w('## 5. New cases (25)')
w('')
w('| # | Story | Title | Covers |')
w('|---|---|---|---|')
for i, n in enumerate(p_new.N, 1):
    w(f"| NEW-{i} | {n['story']} | {n['title']} | {n['why']} |")
w('')
w(f"## 6. DIVERGE ({len(P['diverge'])}) — sources disagree; never picked, the spec governs the case wording")
w('')
w('| # | Topic | Source A (verbatim) | Source B (verbatim) | Affected |')
w('|---|---|---|---|---|')
for i, d in enumerate(P['diverge'], 1):
    aff = ', '.join(str(x) if isinstance(x, str) else f'C{x}' for x in d['affected_cases'])
    w(f"| D{i} | {d['topic']} | {d['source_a'][0]}: \"{d['source_a'][1]}\" | {d['source_b'][0]}: \"{d['source_b'][1]}\" | {aff} |")
w('')
w(f"## 7. EXCLUDE ({len(P['exclude'])})")
w('')
for e in P['exclude']:
    w(f"- **{e['item']}** — {e['reason']}")
w('')
w('## 8. Labels where the sources differ (the design labels below are now confirmed by the design drive; the case wording follows the spec and asks the tester to record the build\'s wording)')
w('')
for s in [
 'Settings entry: "Maintenance" — spec and the design sidebar agree (drive: SettingsSidebar active=maintenance); tech plan "Maintenance schedules" (D2). Preconditions now name "Maintenance" and tell the tester to record the label if the build shows the tech plan\'s.',
 'Success message after the first Save of a schedule: the tech plan says "a success toast" with no words (C146311).',
 'Enrolment modal title: "Enroll in a schedule" (design, confirmed by the drive) vs "Enroll in schedule" (tech plan); spec only says static (C146340 asserts static and shows the design title for the tester to compare).',
 'Blank-date hint: "Blank counts from today" (tech plan) vs "Left blank, counting starts today." (design).',
 'Empty settings list: "No schedules yet" / "Create the first schedule" (design, confirmed by the drive; C146310 now shows them) vs "No maintenance schedules yet" (tech plan); the spec gives no words ("one thing to press"). List button "New Schedule" (design) vs "New schedule" (spec).',
 'Worklist: "Due status" (spec) vs "Status" (design); "Due in 3 months" (spec) vs "Due in three months" (design); "nothing is due in the next three months" (spec, tech plan) vs "Nothing is due." (design).',
 'No-email note wording (tech plan vs design, spec gives none); send dialog title ("Sending Maintenance reminder" vs "Send email"); toast after a send ("Reminder sent." vs "Reminder sent to Dave Brabay").',
 'Record form: "+ Add record" (spec) vs "Add history record" (design); "No record" (spec) vs "Certificate unknown" / "no certificate on file" (design); "This unit is not on a maintenance schedule" (spec) vs "Not on a maintenance schedule" (design).',
 'Work-order status word "Complete" (spec) vs "Completed" (design): the badge must show the app\'s own word.',
 '"This can no longer be undone", "Unable to load …" and the location-switch prompt come from the tech plan only (no design, no spec words).',
 'The meter hover text of S11-R27 and "View work orders" exist only in the spec (the design shows other text).',
 'The Feature flags page label (NEW-2 calls it "the organization\'s Feature flags page", Settings > Feature flags; to be confirmed on the build).',
]:
    w('- ' + s)
w('')
w('## 9. Testability notes and questions')
w('')
for s in [
 '**Reading histories are seeded by hand** (S18-R19 route): one throwaway schedule "ZZAUTOTEST Reading seed" with services "ZZ Seed 1…n" (Every 12 months); per reading, a new work order with the mileage typed in, then Mark complete On a work order with the past Reset date; then Remove from schedule. Worked values: C146352/NEW-7 100,000 (120 days ago) and 104,000 (60 days ago) give one pair, 60 days, Low; C146357/C146364 100,000 (200 days ago) and 130,000 (20 days ago) give about 167 a day, Medium, PM-A (15,000, last service 200 days ago) overdue about 110 days, PM-B (60,000) due about 160 days ahead; C146385 ten ladders (readings 30 days apart, +3,000 each) hit every cell of the locked table; C146386 adds yesterday, 14 months, all older than 24 months, a mileage/engine-hours split and a 3-day pair that the seven-day guard discards (N = 2, not 3). Units whose past invoiced work orders already carry the same history may be used instead.',
 '**Audit (S21): no screen in v1 (S21-N3).** C146376–C146381 stay manual (coordinator decision): each checks what a tester can see, and the plain results say the audit part "cannot be checked by hand in v1 — no screen shows the audit".',
 '**Email:** the send cases tell the tester to give the contact an email address they can open, so the reminder lands in their own inbox.',
 '**Day-level calendar dates are not shown** (a calendar date reads its month and "Calendar", S11-R13), so C146382 now checks months chosen so the clamp and the days/months drift change the month. A Reset date cannot be in the future, so the old 31 Jan 2028 step became 31 Jan 2024.',
 '**Rest after completion (S13-R43, new)** made the old tile-boundary seeding impossible (a date typed at enrolment rests the row). C146359, C146387 and C146388 now seed with blank dates and day intervals.',
 '**Questions for the PO (not cases):** field length limits (Plan 1: names 120, certificate number 64, shop name 160 characters; no source says what the form does at the limit); Plan 2 TD-123 implies a service-contents hover on the asset tab that the spec does not describe; the spec does not say what happens to the legacy surfaces in today\'s app (asset "Add Schedule", Reports > Maintenance, the front-of-app banner); the design\'s service-row "Duplicate".',
 '**Chunk 2 boundary:** rounding of estimates, "640 a week", "today" as the header location\'s day and the reading dialog are Chunk 2 rules not copied on the Chunk 1 page; left to the Chunk 2 reviewer.',
]:
    w('- ' + s)
w('')
w('## 10. Reading coverage')
w('')
w('| Source file | Size | Read | Status |')
w('|---|---|---|---|')
rows = [
 ('sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md (current spec)', '66,403 B / 816 lines', 'lines 1–816 (Read tool); all 270 anchors also extracted by script and read in full', '100% read'),
 ('sources/CONFLUENCE-886931488-Chunk1-MR-2026-09-29.md (previous spec)', '57,218 B / 779 lines', 'every anchor and every non-anchor line diffed by script against the current copy; all 49 changed anchors read old and new', '100% compared'),
 ('sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md (main page)', '48,531 B / 237 lines', 'fetched and read in full', '100% read'),
 ('sources/CONFLUENCE-892305428-Review-Decisions-Chunk-one-2026-10-06.md', '37,262 B / 110 lines', 'fetched, saved, read in full', '100% read'),
 ('sources/CONFLUENCE-891944985-Review-Decisions-Chunk-three-2026-10-06.md', '8,438 B / 73 lines', 'fetched, saved, read in full', '100% read'),
 ('sources/CONFLUENCE-841678852-Review-Decisions-Open-Questions-2026-10-06.md', '100,547 B / 265 lines', 'bytes 1–100,547 in four slices', '100% read'),
 ('sources/CONFLUENCE-891519016-Run-log-Chunk-one-2026-10-06.md', '78,435 B / 11 lines (one 78,027-char JSON line)', 'three slices', '100% read'),
 ('sources/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md', '680,361 B / 5,363 lines', '1–340, 340–666, 667–975, 976–1075, 1076–1163, 1164–1507, 1508–1704, 1705–1889, 1890–2088, 2089–2263, 2264–2416, 2417–2539, 2540–2708, 2709–2979, 2980–3148, 3149–3216, 3217–3598, 3599–3757, 3758–3853, 3854–4053, 4054–4264, 4265–4394, 4395–5031, 5032–5363; lines 1067 and 1070 (over 1,900 chars) checked past the cap with cut', '100% read (notes: chunk1-techplan-reading-notes.md)'),
 ('sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md', '451,369 B / 3,240 lines', 'sections touching Chunk 1 surfaces read in full: 198–406, 585–623, 2074–2342, plus every one of the 134 lines matching asset tab / worklist / contact card / S9- / S13- / S14- / S21-', 'Chunk 1 parts 100% read; the rest is Chunk 2 (work order, invoicing, email) and was not in my scope'),
 ('design board "Chunk 1.dc.html", 6 Oct (sources/design-MR_V2_2-2026-10-06/)', '1,659,474 B; 5,292 visible-text lines + 8 attribute strings', 'text lines 1–5,292 in three passes; title/placeholder/aria-label/alt/value attributes extracted and read (6 strings not in the text, e.g. "Days or months. at always takes a month.")', '100% of visible and attribute text read'),
 ('design board "Chunk 1.dc.html", 29 Sep (sources/design/)', '1,382,549 B; 4,522 visible-text lines (1,091 distinct) + 7 attribute strings', 'every distinct line read; added/removed diff (197 / 128 lines) read', '100% of distinct text read'),
 ('design "Canned lines per location - proposal.dc.html"', '348,116 B; 1,486 text lines', 'every distinct line and attribute read', '100% read'),
 ('design "Maintenance Reminders Demo.dc.html"', '389,449 B; 1,472 text lines', 'every distinct line not already in the Chunk 1 board read', '100% read (superseded)'),
 ('design "4-work-order (old WO chrome).dc.html"', '362,566 B; 1,448 text lines', 'every distinct line not in the Chunk 1/Chunk 2 boards read', '100% read (Chunk 2, superseded)'),
 ('design SettingsSidebar.dc.html', '15,063 B', 'text extracted and read (sidebar item "Maintenance")', '100% read'),
 ('_tools/inv1.txt, inv1b.txt, inv1c.txt', '95,405 / 72,004 / 61,187 B', 'every segment (1,078 / 1,088 / 1,104 distinct) compared by script with the board text; the 51 / 61 / 77 segments not in the current board each read', '100% read'),
 ('_tools/audit.json, "Chunk 1.dc.html" part', '22,395 B (whole file)', 'every key and value of the Chunk 1 part printed and read', '100% read'),
 ('source-update-2026-10-06/NEW-SCREENSHOTS-READ-2026-10-06.md', '3,721 B / 21 lines', 'read in full', '100% read'),
 ('source-update-2026-10-06/DESIGN-PACKAGE-READING-NOTES.md (other worker)', '359,793 B / 1,277 lines', 'lines 1–1,277 read (in five passes as the file grew: 1–200, 200–492, 493–639, 640–799, 800–1,277)', '100% read; Chunk 1 findings folded in (sections 1, 6)'),
 ('source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md (final)', '129,428 B / 646 lines', 'read in full', '100% read; every Chunk 1 item of 3a, 3b, the dead links and the not-drawn list folded in'),
 ('source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/spec-comparison.md', '134 lines', 'read in full (identical to the findings file\'s section 3)', '100% read'),
 ('DESIGN-DRIVE-2026-10-06/Chunk 1-interactions.jsonl, Chunk 1-pages.txt, Maintenance Reminders Demo-interactions.jsonl and -pages.txt', '5,729,806 B / 78,770 B (Chunk 1)', 'every exposed text, native tooltip and label extracted by `drive_corpus.py` (244 distinct texts) and used by the quote check', '100% of exposed text used; every design label in the proposals is verified against it or the board text'),
 ('design-text/Demo-board-text-2026-10-06.txt', 'Demo board visible text', 'used by the quote check for the superseded Demo wordings in DIVERGE', '100% used for its quotes'),
 ('source-update-2026-10-06/AUTHORIZED-SKIPS-2026-10-06.md', '933 B', 'read in full (QA lead skip list for fonts, icons, DS code, designer scripts, backups)', '100% read'),
 ('snapshots-2026-10-06/chunk1-cases-before.json (81 cases)', '265,663 B', 'parsed by script; every case\'s title, preconditions, steps, results, source and quotes read', '100% read'),
 ('mr_lib.py and v2_s1.py … v2_s14_s21_data.py (house format)', 'mr_lib 3,819 B', 'mr_lib read in full; v2_s1.py read for the case style', 'mr_lib 100%; v2 scripts: format only'),
 ('sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md (Chunk 2 spec)', 'anchors only', 'S16-N6, S11-R2/R4/R5/R19/R20 and S10-R10/N6 read for the quotes and the seeding arithmetic', 'Chunk 2 scope beyond these anchors not read here'),
]
for r in rows: w('| ' + ' | '.join(r) + ' |')
w('')
w('Not read (and why): the Chunk 2 spec page (897679389) beyond the anchors quoted (S16-N6 in NEW-18, S11-R4 in C146386) and those read for the seeding arithmetic — Chunk 2 scope, reviewed by the Chunk 2 worker; Plan 2 sections that touch only the work order, invoicing and the email (Chunk 2); fonts, icons, design-system code, designer build scripts and board backups (QA lead\'s authorized skips, 6 Oct). Screenshots were read by the design-package worker, whose notes I read in full.')
w('')
w('## OUTSTANDING — what I need from you')
w('')
w('1. Apply the proposals with the coordinator\'s renderer (no TestRail write was made here).')
w(f"2. Send the {len(P['diverge'])} DIVERGE items to the PO (labels first: Settings entry, Due status, tile name, empty states, record form, Mark complete line). D53 is a design-package note for the designer, not a PO question.")
w('3. Nothing else outstanding from me: the design drive is folded in. Every case stays on HOLD until a Maintenance Reminders QA build exists.')
open(ROOT + 'source-update-2026-10-06/CHUNK1-FINDINGS.md', 'w').write('\n'.join(L) + '\n')
print('written', len(L), 'lines')
