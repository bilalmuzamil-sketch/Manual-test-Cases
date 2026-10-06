# -*- coding: utf-8 -*-
"""Writes CHUNK2-FINDINGS.md from chunk2-proposals.json + verify_out.json + the live snapshot."""
import json, re, html, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from anchors import anchors, clean
ROOT = "/home/user/Manual-test-Cases/build/maintenance-reminder-v2"
OUTD = ROOT + "/source-update-2026-10-06"
P = json.load(open(OUTD + "/chunk2-proposals.json"))
V = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "verify_out.json")))
SPEC = anchors(ROOT + "/sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md")
SNAP = json.load(open(ROOT + "/snapshots-2026-10-06/chunk2-cases-before.json"))
TR = "https://shopview.testrail.io/index.php?/cases/view/"
def quotes_of(e):
    tail = e.split("Exact quotes")[1]
    return [(html.unescape(a), html.unescape(q)) for a, q in re.findall(r"<strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;", tail, re.S)]
# anchors that grew since a case quoted them in full
grew, changed = {}, {}
for c in SNAP:
    for a, q in quotes_of(c["custom_expected"]):
        if a not in SPEC: continue
        parts = [clean(p) for p in re.split(r"\.\.\.|…", q) if clean(p)]
        if all(p.rstrip(".") in SPEC[a] for p in parts):
            if len(parts) == 1 and len(clean(SPEC[a])) > len(parts[0].rstrip(".")) + 3 and SPEC[a].startswith(parts[0].rstrip(".")[:40]):
                grew.setdefault(a, set()).add(c["id"])
        else:
            changed.setdefault(a, set()).add(c["id"])
before = {}
for c in SNAP:
    for a, _ in quotes_of(c["custom_expected"]):
        before.setdefault(a, set()).add(c["id"])
upd_ids = {u["case_id"] for u in P["updates"]}
L = []
w = L.append
w("# Chunk 2 — Maintenance Reminders — source update review (6 Oct 2026)")
w("")
w("Scope: the 86 live Chunk 2 cases (TestRail folder 26635; stories S10, S11, S12, S16, S17, S18, S19, S22) against the sources as edited on "
  "5 October 2026. **Proposals only: nothing was written to TestRail and nothing was committed.** Machine-readable proposals, with full replacement "
  "HTML for every case: `chunk2-proposals.json` (same folder).")
w("")
w(f"**Counts:** {len(P['updates'])} updates · {len(P['new'])} new · {len(P['retire'])} retire · {len(P['diverge'])} diverge (PO questions) · "
  f"{len(P['exclude'])} exclude · {len(P['systemic_corrections'])} systemic corrections · {len(P['blockers'])} blockers · "
  f"{len(P['chunk1_notes'])} notes for the Chunk 1 reviewer.")
w("")
w("Every proposed case: three-part Expected (plain results · Source line naming documents only · verbatim quotes with anchors), click-by-click "
  "preconditions with ZZAUTOTEST example values, product labels only from the spec or the design boards (marked 'in the design' where design-only), "
  "title ≤ 80 characters, no requirement ids in titles, preconditions, steps or plain results, and the HOLD marker copied exactly from `mr2_lib.py`.")
w("")
w("## 1. Per-source verdict")
w("")
w("| Source (version read) | Verdict | What it changes |")
w("|---|---|---|")
rows = [
 ("Chunk 2 MR spec, Confluence 897679389, as edited 5 Oct 2026 19:58 (saved `sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md`)",
  "UPDATE + ADD + DIVERGE",
  f"{len(changed)} anchors rewritten under existing quotes ({sum(len(v) for v in changed.values())} quotes in {len(set().union(*changed.values()))} cases fail); {len(grew)} anchors gained sentences that their cases do not "
  "test; 9 anchors cited by no case. → 24 whole-case updates, 14 spec-sourced new cases, S10-R1 held (D1)."),
 ("Main page 'Maintenance Reminders V1', Confluence 833290250, as edited 5 Oct 2026 (saved `sources/CONFLUENCE-833290250-…-2026-10-06.md`)",
  "UPDATE + DIVERGE", "'No feature flag' (5 Oct) makes the flag precondition in all 86 cases stale (SC1) and contradicts the mandated HOLD marker (SC2). "
  "'Audit recorded, no screen in v1' makes three cases' audit steps unrunnable (C204106, C204154, C204179 updated). Its Reusable components row for "
  "the reading dialog conflicts with S16-R12 (D1). Says the chunk page wins where they differ."),
 ("Plan 2 — The work order and the customer — Technical Implementation Plan (3,240 lines, revision 3 of 5 Oct)", "CONFIRM + ADD + DIVERGE + EXCLUDE",
  "Confirms nearly every Chunk 2 rule. ADD: N15 (no card or step on part sales / imported work orders), N16 (every invoicing path shows the step "
  "once), N4 support, NFR-114 partial split in C204151, D2 reading date in N6. DIVERGE: D3, D5, D6, D9, D10, D11, D12, D13. EXCLUDE: engineering-only "
  "NFRs. Labels it alone gives are listed as unconfirmed (blocker B4)."),
 ("Plan 1 — Track, act, clear — Technical Implementation Plan (5,363 lines; every section touching Chunk 2)", "CONFIRM + BLOCKER",
  "Confirms S10/S11/S12/S18 mechanics. Testability note B5 (no back-dated readings) → blocker B1. §7: historical load runs on QA after each deploy "
  "(used as the route in C204126 and N6)."),
 ("Design MR_V2_2, Chunk 2 board (current, 6 Oct export)", "CONFIRM labels + DIVERGE",
  "Source of the window, toast, step and email labels used in the cases (frames W2a, W2c–W2e, W2r, W2k, W13–W13c, W14, I1–I7, R1–R1Z). DIVERGE: "
  "D2, D4, D6, D7, D8, D14, D15."),
 ("Design, Chunk 2 board (2 Oct copy, `chunk-2/Chunk-2-design.dc.html`)", "Superseded", "Diffed against the current board: new frames W2r, W2k, "
  "W13c, I1d, W14 rows, R1N, R1Z and the 'Payment' step in the flow strip are all reflected in the proposals."),
 ("Design MR_V2_2, Chunk 1 board (shared components)", "CONFIRM labels + DIVERGE", "Reading window (Enter mileage, CURRENT/NEW, Save the reading, "
  "In the shop), Mark complete modal ('Its readings are recorded: …'), Send email window (Send to, Preferred contact, Optional emails, No email, "
  "Add email, Email for …, Include your email to BCC, Hello,), toast 'Reminder sent to Dave Brabay', Last sent. D7 (modal subtitle)."),
 ("Design: Canned lines per location — proposal board", "CONFIRM", "Its copy-work model matches S16-N6 and S16-R21 to S16-R24; no Chunk 2 behaviour "
  "beyond the spec."),
 ("Design: Maintenance Reminders Demo board", "EXCLUDE (stale)", "Older than the spec (confirmation step before sending, company-name greeting, "
  "several units per email). Passed to Chunk 1 notes."),
 ("Design: Flow Map, 4-work-order (old chrome), index board", "EXCLUDE (history)", "Programme-era / chrome reference; nothing current to test."),
 ("Design package `_tools/audit.json` (Chunk 2 part) and `_tools/card.txt`", "Superseded", "The designer's word audit of an earlier pass ('Create "
  "lines', 'Lines can be created only on work orders at Calgary South' — wording the 5 Oct spec and Plan 2 removed); card.txt is the hover-card "
  "markup (JOB DESCRIPTION / PARTS ON IT / INSPECTION FORM), consistent with S16-R7."),
 ("Design handoff markdown (00-overview … 07-consent, HANDOFF, README, PRD v12) via DESIGN-PACKAGE-READING-NOTES.md §B", "Superseded",
  "Dated 16–25 Sep; every conflict is older than the spec (spec wins). Nothing new to test."),
 ("Uploads markdown (12 files)", "Superseded", "Design briefs and prompts from before the 5 Oct spec; no Chunk 2 change."),
 ("Screenshots (NEW-SCREENSHOTS-READ-2026-10-06.md; DESIGN-PACKAGE-READING-NOTES.md §A)", "Older than the spec",
  "Spec wins; differences noted (e.g. 'Enroll in maintenance schedule', '+ Add', 'Already addressed', money on rows)."),
 ("Older review pages 841678852, 891519016, 891944985, 892305428 (Sep 2026)", "History only", "Superseded by the chunk page. OQ-4 (date a reading "
  "was observed) supports blocker B1."),
 ("Design drive (DESIGN-DRIVE-2026-10-06)", "Pending", "Findings file IN PROGRESS with no Chunk 2 findings yet; its Chunk 2 hidden-tooltip "
  "inventory (31 texts) matches the board text used. Still to be folded in (blocker B5)."),
]
for r in rows: w("| " + " | ".join(x.replace("|", "/") for x in r) + " |")
w("")
w("## 2. Anchor coverage (all 191 anchors on the 5 Oct Chunk 2 page)")
w("")
w("Status: **OK** quote still verbatim and the case still tests the whole anchor · **CHANGED** a case quote no longer matches · **GREW** the anchor "
  "gained sentences after the case quoted it in full · **UNCITED** no case cited it · **HELD** parked as a PO question. 'After' lists the cases "
  "that cite it once the proposals land (N1–N16 are the new cases).")
w("")
w("| Anchor | Status | Cited before | Cited after proposals |")
w("|---|---|---|---|")
for a in SPEC:
    st = []
    if a in changed: st.append("CHANGED")
    if a in grew: st.append("GREW")
    if a not in before: st.append("UNCITED")
    if a == "S10-R1": st.append("HELD (D1)")
    if not st: st = ["OK"]
    b = ", ".join(f"C{i}" for i in sorted(before.get(a, [])))
    af = ", ".join(V["coverage"][a]) or "— (held, D1)"
    w(f"| {a} | {' + '.join(st)} | {b or '—'} | {af} |")
w("")
w(f"**Anchors cited by a case but gone from the page: {len(V['live_gone'])}** (none). **Uncited before: {len(V['uncited_before'])}** "
  f"({', '.join(V['uncited_before'])}). **Uncited after: {len(V['uncited_after'])}** ({', '.join(V['uncited_after'])} — held as DIVERGE D1, on "
  "purpose).")
w("")
w("## 3. Updates (whole-case rewrites)")
w("")
w("| Case | New title | Why |")
w("|---|---|---|")
for u in P["updates"]:
    w(f"| [C{u['case_id']}]({TR}{u['case_id']}) | {u['title']} | {u['reason'].replace('|','/')} |")
w("")
w("## 4. New cases")
w("")
w("| Key | Section | Title | Why |")
w("|---|---|---|---|")
for n in P["new"]:
    w(f"| {n['key']} | {n['section']} | {n['title']} | {n['reason'].replace('|','/')} |")
w("")
w("## 5. Retire")
w("")
w("None. No Chunk 2 behaviour was removed outright on 5 Oct. The reversed S18-E3 text in C204170 is replaced through its update (and new cases "
  "N13/N14), not by retiring the case.")
w("")
w("## 6. DIVERGE — PO / engineering questions (both sides quoted; no side picked)")
w("")
for d in P["diverge"]:
    w(f"**{d['id']} · {d['topic']}** — affects {', '.join(d['affected_cases'])}")
    w(f"- A: {d['side_a']['source']}: “{d['side_a']['quote']}”")
    w(f"- B: {d['side_b']['source']}: “{d['side_b']['quote']}”")
    w(f"- Question: {d['po_question']}")
    w(f"- In the cases: {d['case_handling']}")
    w("")
w("## 7. EXCLUDE")
w("")
w("| Item | Anchors | Why |")
w("|---|---|---|")
for e in P["exclude"]:
    w(f"| {e['item']} | {', '.join(e['anchors'])} | {e['reason']} |")
w("")
w("## 8. Systemic corrections and blockers")
w("")
s1, s2, s3 = P["systemic_corrections"]
w(f"- **SC1 — stale feature-flag precondition.** {s1['why']} Found in **{s1['cases_total']} of 86** cases "
  f"({'; '.join(f'“{k}” ×{v}' for k, v in s1['variant_counts'].items())}). {len(s1['already_fixed_by_updates'])} are fixed by the updates above; "
  f"**{len(s1['cases_to_edit'])} need the sentence removed and nothing else**: " + ", ".join(f"C{i}" for i in s1["cases_to_edit"]) + ".")
w(f"- **SC2 — the HOLD marker names the flag.** {s2['why']}")
w("- **SC3 — requirement ids in tester text** (not already fixed by an update): " +
  "; ".join(f"C{r['case_id']}: “{r['lines'][0][:120]}”" for r in s3["cases_to_edit"]) + ".")
for b in P["blockers"]:
    extra = ""
    if b["id"] == "B1":
        extra = (" Cases: " + ", ".join(f"C{i}" for i in b["cases"]) + ". Softer dependency (need a unit already in a given state): "
                 + ", ".join(f"C{i}" for i in b["softer_dependency"]["cases"]) + ". " + b["also"] + " Routes found: " + " / ".join(b["routes_found"]))
    if b["id"] == "B4":
        extra = " Items: " + "; ".join(b["items"]) + ". " + b["handling"]
    w(f"- **{b['id']} — {b['what']}.** {b.get('evidence','')}{extra} {('Ask: ' + b['ask']) if b.get('ask') else ''}")
w("")
w("## 9. Quote check (script: scratchpad `c2/verify.py`, run 6 Oct 2026)")
w("")
w(f"- **Proposals:** {V['nq']} quotes parsed from the HTML that would be written; **{V['ok']} of {V['nq']} verbatim** in the cleaned source "
  f"(Chunk 2 page anchor, Plan 2 text or main page text); every title ≤ 80 characters; marker exact, once, last; no requirement ids or flag text in "
  f"tester-facing text. **Failures: {len(V['fails'])}.**")
w(f"- **Live cases as they stand:** {V['live_total']} quotes in 86 cases; **{V['live_ok']} still verbatim, {len(V['live_changed'])} CHANGED, "
  f"{len(V['live_gone'])} cite a vanished anchor.** CHANGED: " + ", ".join(f"C{c} {a}" for c, a in V["live_changed"]) +
  ". Every CHANGED quote is replaced by an update.")
w("- Cleaning used for comparison: markdown marks (`**`, backticks, backslashes) removed, `->` read as `→`, whitespace collapsed; quotes split on "
  "'…' are checked part by part. Quotes keep the source's own words; only the markdown formatting marks are not reproduced.")
w("")
w("## 10. Notes for the Chunk 1 reviewer (not proposed here)")
w("")
for n in P["chunk1_notes"]: w(f"- {n}")
w("")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "findings_part1.md"), "w").write("\n".join(L) + "\n")
print("ok", len(L))
