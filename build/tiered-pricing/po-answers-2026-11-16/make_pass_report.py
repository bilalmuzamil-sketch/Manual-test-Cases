"""Writes po-answers-2026-11-16/PASS-REPORT.md from the before/after library copies, the write logs and the run 560 read-back.
Run from build/tiered-pricing after the writes: python3 po-answers-2026-11-16/make_pass_report.py"""
import json, re, csv, html
D = 'po-answers-2026-11-16'
B = json.load(open(f'{D}/v38/proposals-before.json')); A = json.load(open('authoring/proposals.json'))
I = json.load(open(f'{D}/IMPACT-CASES.json')); V = {c['key']: c for c in I['cases']}
M = {r['key']: r['case_id'] for r in csv.DictReader(open('testrail-id-map.csv'))}
DM = {r['key']: r['case_id'] for r in csv.DictReader(open(f'{D}/write/deleted/id-map-rows-deleted-2026-11-16.csv'))}
NEW = ["S2-79", "S3-46", "S3-47", "S4-42", "S4-43", "S4-44", "S8-13", "S9-39", "S19-24"]
before_run = {t['case_id'] for t in json.load(open(f'{D}/write/run560-tests-before-2026-11-16.json'))}
after = json.load(open(f'{D}/write/run560-tests-after-2026-11-16.json')); tid = {t['case_id']: t['id'] for t in after}
upd = [json.loads(l) for l in open(f'{D}/write/log-update.jsonl') if '"apply": true' in l and '"op": "update_case"' in l]
add = [json.loads(l) for l in open(f'{D}/write/log-add.jsonl') if '"apply": true' in l]
dele = [json.loads(l) for l in open(f'{D}/write/log-delete.jsonl') if '"apply": true' in l and '"op": "delete_case"' in l]
link = lambda c: f"[C{c}](https://shopview.testrail.io/index.php?/cases/view/{c})"
def exp_wo_marker(f): return re.sub(r'<p>AUTOMATION: [^<]*</p>$', '', f['custom_expected'])
def marker(f): return re.search(r'AUTOMATION: [^<]*', f['custom_expected']).group(0)
def parts(k):
    b, a = B[k], A[k]; fb, fa = b['fields'], a['fields']
    def cc(x, y): return 'CHANGED' if x != y else 'CONFIRMED'
    cid = int(M[k])
    return [cc(fb['title'], fa['title']), cc(fb['custom_preconds'], fa['custom_preconds']), cc(fb['custom_steps'], fa['custom_steps']),
            cc(exp_wo_marker(fb), exp_wo_marker(fa)), cc(json.dumps(b['sources']), json.dumps(a['sources'])), cc(fb['refs'], fa['refs']),
            cc(b['pictures'], a['pictures']) + (' (library only; TestRail pictures untouched)' if b['pictures'] != a['pictures'] else ''),
            cc(marker(fb), marker(fa)), cc(b['sec'], a['sec']), ('IN' if cid in tid else 'OUT') + (' (was in)' if cid in before_run else ' (was out)')]
H = ["Case", "C-id", "Q", "Verdict", "Title", "Preconditions", "Steps", "Expected results", "Sources behind the results (library, PRD v38)", "References",
     "Pictures", "AUTOMATION marker", "Folder", "Run 560"]
rows = []
for k in sorted([c['key'] for c in I['cases'] if c['verdict'] != 'DELETE'], key=lambda x: (V[x]['verdict'], x)):
    rows.append([k, link(M[k]), str(V[k]['question']), V[k]['verdict']] + parts(k))
L = []
w = L.append
w("# Tiered Pricing — PRD v38 and Matt Barge's answers: PASS REPORT (16 Nov 2026)\n")
w("QA lead's decisions, 16 Nov 2026 (verbatim choices): **\"Named set, write it (Recommended)\"** · **\"Wait for his canvas (Recommended)\"** (pictures left "
  "as they are) · **\"Add both to the sheet (Recommended)\"** (follow-ups F1/F2 become questions 32/33). Plan: `IMPACT.md`, `IMPACT-CASES.json`.\n")
w("## 1 · Sources (Rule 59 re-check at the start, 13:14 UTC)\n")
w("| Source | Read | Verdict |\n|---|---|---|")
w("| Tiered Pricing PRD 938213378 | page **v38**, created 2026-11-16T12:28:08Z by Matthew Barge, \"QA questions from Bilal (Nov 16)\" (metadata.version.number) | unchanged since the impact pass: go |")
w("| Reports PRD 968687617 | page **v21**, 2026-11-12T22:08:41Z | unchanged: go |")
w("| Matt Barge's answers 1-31 | `questions-2026-11-14/ANSWERS-2026-11-16.json` (word for word) | all applied |")
w("| Epic SV-11692 | JQL `parent = SV-11692 AND updated >= \"2026-11-14\"` (13:40Z): exactly the 10 stories edited 12:30Z, none later; `sources/jira/JIRA-SWEEP-SV-11692-2026-11-16.json`; `ticket_sweep.py` exits 0 (PRD v38 handled) | handled |")
w("| Design canvas | not re-read (QA lead: wait for Matt's canvas changes); pictures untouched | as held |\n")
w("## 2 · Library\n")
w("- `requirements.json`: the extractor reproduces all 279 numbered v37 rows exactly, then moves every Tiered Pricing row to page v38: **18 rows changed** "
  "(the 18 the v37→v38 diff names; old text kept as `text_v37`), **S19-R24 added**; Error Handling and Permissions rows unchanged (`v38/requirements_to_v38.py`).")
w("- Library PRD source = page v38 for every case. `build.py` re-proved every stored quote: exactly the 20 cases IMPACT named rested on a changed sentence; all in the named set.")
w("- `prove_unchanged.py`: **735 cases outside the named set are byte-identical** in every TestRail field and folder; the 9 no-write cases (4 quote-only, 5 checked) too (`v38/prove-unchanged.json`).")
w("- New source kind `QA(...)`: Matt Barge's written answer, word for word, used only where v38 does not word the point (S10-39: new work order \"new number, Approved\", paid one untouched; D-64 and the report movement cases: answer 31).")
w("- Edits kept as scripts: `v38/patches/`; the 25 deleted cases' source: `v38/deleted-library-cases.py` (with question, choice and Matt's words).")
w("- Questions: Q1-Q31 ANSWERED in `authoring/po_questions.py`; **Q32 (F1)** and **Q33 (F2)** added; Q33 holds S3-40; Q32 holds no case (`NO_CASE_YET`: the category-page check between the pick and Save is added when answered; S3-17/S3-18 check prices, which v38 and the answer settle).")
w("- Register: every PO-CANDIDATE row closed by its ruling (`DESIGN-DIVERGENCE-REGISTER.json`: 120 CLOSED, 13 NO-DIFFERENCE; deleted cases kept as `deleted_cases` with C-ids).")
w("- Gates: `build.py` **0 PROBLEM lines** (802 cases, 15 held); `tester_readiness_check.py` **0 hard problems**. Rule 138 reading: all 58 written cases read in full "
  "(49 changed + 9 new), every \"does not / never\" result in them checked for a visible control; fixed before writing: S2-35/S2-79/D-14 tier precondition wording, "
  "S3-18/S3-47 negative-only results, S10-39 (a step to open the new work order), S8-13 (\"choose\" item Q).\n")
w("## 3 · Writes (all logged: operation, C-id, HTTP status, read-back)\n")
w(f"| Operation | Count | HTTP | Read-back | Log / copies |\n|---|---|---|---|---|")
w(f"| update_case (edit-locked on the live text; 0 edited outside our library) | {len(upd)} | {sorted({r['http'] for r in upd})} | {sum(r['readback_ok'] for r in upd)}/{len(upd)} field by field | `write/log-update.jsonl`, `write/before/`, `write/after/` |")
mv = [r for r in upd if r.get('move_http')]
w(f"| move_cases_to_section (empty reply; section_id read back) | {len(mv)} | {sorted({r['move_http'] for r in mv})} | {sum(r['readback_ok'] for r in mv)}/{len(mv)} | S3-17, S3-18 → Story 3; S10-39 → Story 10; RPT-63 → reports; S3-40 → Waiting on Matt Barge's answers |")
ac = [r for r in add if r['op'] == 'add_case']; ap = [r for r in add if r['op'] == 'add_attachment_to_case']; ar = [r for r in add if r['op'] == 'readback_attachments']
w(f"| add_case | {len(ac)} | {sorted({r['http'] for r in ac})} | {sum(r['readback_ok'] for r in ac)}/{len(ac)} | `write/log-add.jsonl` |")
w(f"| add_attachment_to_case (new cases only) | {len(ap)} | {sorted({r['http'] for r in ap})} | {sum(r['ok'] for r in ar)}/{len(ar)} cases by name | existing cases' pictures untouched |")
w(f"| delete_case (POST {{}}) | {len(dele)} | {sorted({r['http'] for r in dele})} | {sum(r['confirm_get_case'] == 400 for r in dele)}/{len(dele)} get_case answers 400 | `write/log-delete.jsonl`, `write/deleted/` |")
w("| update_run 560 (union only; paged tests; S3-40 taken out: no result on its test) | 1 | 200 | 763 → **787**: +25 (16 released, 9 new), −1 (S3-40); every prior test kept | `write/log-run.jsonl`, `write/run560-tests-*-2026-11-16.json` |")
w("| add_results_for_cases (assignedto_id 6 only) | 25 | 200 | 787/787 assigned to user 6 | `write/log-run.jsonl` |")
w("| Folder note 138770 | 0 (already \"current as of 11/16/2026\", earlier text kept below) | — | read back | `write/log-folder.jsonl` |")
w("| End check `6_verify_all.py` | — | — | 802 live = 802 library, 0 field mismatches, run = every released case, no held case | `write/verify-all-2026-11-16.json` |\n")
w("## 4 · Per case, every part (Rule 134) — CHANGED / CONFIRMED against PRD v38 and the answers\n")
w("Verdicts: CHANGE (released, text changed), REWRITE (held → rewritten and released), RELEASE (held → released), REFS-ONLY (References gain S19-R24), "
  "LIBRARY-ONLY (only the stored PRD quote moved to v38; not written), CONFIRMED (checked against S19-R24; not written). Pictures: QA lead \"Wait for his canvas\" — "
  "S3-17 and S3-18 now also list board 10.6 in the library (Add Part steps); it is attached with the canvas refresh (`PICTURES-PENDING-2026-11-16.json`).\n")
w("| " + " | ".join(H) + " |\n|" + "---|" * len(H))
for r in rows: w("| " + " | ".join(r) + " |")
w("\n### New cases (9)\n")
w("| Case | C-id | Q | Title | Folder | Pictures | Run 560 |\n|---|---|---|---|---|---|---|")
QN = {"S2-79": 2, "S3-46": 6, "S3-47": 6, "S4-42": 14, "S19-24": 14, "S4-43": 15, "S4-44": 15, "S8-13": 21, "S9-39": 22}
for k in NEW: w(f"| {k} | {link(M[k])} | {QN[k]} | {A[k]['title']} | {A[k]['section_name']} | {', '.join(A[k]['pictures'])} | IN |")
w("\n### Deleted (25) — Rule 130, PO ruled the design's version out; full before-copies kept\n")
w("| Case | C-id | Q | Title | Before-copy |\n|---|---|---|---|---|")
for c in sorted([c for c in I['cases'] if c['verdict'] == 'DELETE'], key=lambda c: c['question']):
    w(f"| {c['key']} | C{c['case_id']} | {c['question']} | {c['title']} | `po-answers-2026-11-16/write/deleted/C{c['case_id']}-before.json` |")
w("\n## 5 · Run 560 — test links of every changed and new case in the run\n")
w("Run: https://shopview.testrail.io/index.php?/runs/view/560 — before **763**, after **787** tests, all assigned to user 6 (Mudassir).\n")
chg = [k for k in V if V[k]['verdict'] in ('CHANGE', 'REWRITE', 'RELEASE', 'REFS-ONLY')] + NEW
links = [f"https://shopview.testrail.io/index.php?/tests/view/{tid[int(M[k])]}" for k in sorted(chg) if int(M[k]) in tid]
w(f"{len(links)} tests (49 written cases minus S3-40, which is held and out of the run, plus 9 new):\n")
w("```\n" + "\n".join(links) + "\n```\n")
w("## 6 · Held on the new questions\n")
w("- **33** (F2): S3-40 " + link(M['S3-40']) + " \"Only a grid save asks Change All\" — `AUTOMATION: HOLD - waiting on the PO (question 33)`, in \"Waiting on Matt Barge's answers\", out of run 560.")
w("- **32** (F1): no case held; the category-page check between the pick and Save is added when answered.")
w("- Sheet rows drafted (not written): `questions-2026-11-16/F1-F2-rows.json` (rows 37-39, light green, dated heading row).\n")
w("## OUTSTANDING — what I need from you\n")
w("1. **Add questions 32 and 33 to Matt's sheet** (coordinator): rows in `questions-2026-11-16/F1-F2-rows.json`.")
w("2. **Waiting on the PO:** https://docs.google.com/spreadsheets/d/1qVTIPIWUarmDGg6AjD1q8BbitlynKdjy9VYBCpGuMeY — questions 32, 33 (once added); case held: S3-40 C1211562 (33).")
w("3. **Matt's canvas changes** (22 answers): then refresh the pictures in one pass (370 cases listed; plus board 10.6 on S3-17/S3-18).")
open(f'{D}/PASS-REPORT.md', 'w').write("\n".join(L) + "\n")
print("rows", len(rows), "links", len(links))
