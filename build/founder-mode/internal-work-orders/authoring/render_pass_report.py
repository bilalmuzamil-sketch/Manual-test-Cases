#!/usr/bin/env python3
"""Round 4 (13 Nov 2026): writes po-answers-2026-11-12/PASS-REPORT.md (Rule 134: every part of every case) and
po-answers-2026-11-12/write/plan.json (what the write scripts do).
- Round 4 verdicts compare each case now (proposals.json, built by build.py from PRD v1.3 and design 1794510020-d4ec) with the round 3
  draft (write/proposals-round3-v1.1-draft.json, from commit 857ba1c7b). Round 3 was never written to TestRail.
- plan.json compares each case now with the body live in TestRail (write/proposals-before-v1.1.json, PRD v1.0 text; the write scripts
  lock on it), so the updates carry round 3 and round 4 together.
The round 3 report and plan are kept as PASS-REPORT-round3-v1.1.md and write/plan-round3-v1.1.json.   python3 render_pass_report.py"""
import sys, os, json, csv, re, glob, importlib
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); sys.path.insert(0, D)
import iwo_lib as L
_O = [f"cases_s{i}" for i in range(1, 14)] + ["cases_s12p", "cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design", "cases_tp"]
_M = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _O if x in _M] + [x for x in _M if x not in _O]: importlib.import_module(m)
import cases_zz_v11 as V, cases_zzz_v13 as Z
A = f"{P}/po-answers-2026-11-12"; W = f"{A}/write"
NOW = json.load(open(f"{D}/proposals.json")); LIVE = json.load(open(f"{W}/proposals-before-v1.1.json"))
R3 = json.load(open(f"{W}/proposals-round3-v1.1-draft.json")); AFF = json.load(open(f"{A}/AFFECTED-CASES-v1.3.json"))
FR = json.load(open(f"{A}/full-read/fix-list.json")); CHK = json.load(open(f"{W}/check-v13-text.json"))
MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
SECS = json.load(open(f"{P}/sections.json"))["sections"]
DELETE = {"D-87": "1112404", "D-89": "1112406", "D-91": "1112408", "S2-90": "1112004", "S8-26": "1112153"}   # the QA lead's go-ahead (12 and 13 Nov)
DEL_WHY = {"D-87": "design-version case retired in round 3: PRD v1.1 settled the difference (QA lead: \"Yes, delete the 3\", 12 Nov 2026)",
           "D-89": "design-version case retired in round 3: PRD v1.1 settled the difference (QA lead, 12 Nov 2026)",
           "D-91": "design-version case retired in round 3: PRD v1.1 settled the difference (QA lead, 12 Nov 2026)",
           "S2-90": V.PROPOSED_DELETE["S2-90"] + " QA lead: \"Delete both (Recommended)\", 13 Nov 2026.",
           "S8-26": V.PROPOSED_DELETE["S8-26"] + " QA lead: \"Delete both (Recommended)\", 13 Nov 2026."}
STAMP = [('version 1.1 (12 Nov 2026, Milos Vasic)', 'version 1.3 (12 Nov 2026, Milos Vasic)'),
         ('version 1794507512-2fc4 (its boards byte-identical to version 1794484794-2031, read and rendered 12 Nov 2026)',
          'version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026)')]
link = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"


def parts(f):
    e = f["custom_expected"]
    res, rest = e.split("<p><strong>Exact quotes", 1)
    q, rest = (rest.split("<p></p><p><strong>References from Design", 1) + [""])[:2] if "References from Design" in rest else (rest, "")
    m = re.search(r"<p>(AUTOMATION: [^<]*)</p>", e)
    return {"title": f["title"], "preconditions": f["custom_preconds"], "steps": f["custom_steps"], "results": res,
            "quotes": re.sub(r"<p>AUTOMATION: [^<]*</p>.*$", "", q, flags=re.S), "design": re.sub(r"<p>AUTOMATION: [^<]*</p>.*$", "", rest, flags=re.S),
            "marker": m.group(1) if m else "", "refs": f["refs"]}


def stamp(s):
    for a, b in STAMP: s = s.replace(a, b)
    return s


named = set(FR["change"]) | set(FR["runnability"])
for k, v in AFF.items():
    if isinstance(v, list) and not k.startswith("quotes_not"): named |= set(v)
named |= {x["key"] for x in AFF["quotes_not_in_v13"]}
for k, v in AFF["plain_text_(steps/results)_still_describing_v1.1_behaviour"].items():
    if isinstance(v, list): named |= set(v)
named |= {"D-03", "D-04", "D-38", "D-39", "D-40", "D-41", "D-42", "D-43", "D-60", "D-61"}      # DESIGN-CHANGE-v1.3 §5
named |= {"S1-01", "S1-10", "S1-10b", "S1-11", "S1-12", "S1-13", "S1-87", "S3-07", "S3-08", "S3-09", "S3-10", "S3-11", "S3-12", "S3-13", "S3-14",
          "S3-15", "S3-16", "S3-17", "S3-49", "S3-50", "S3-55", "S10-10", "DATA-01", "DATA-02", "DATA-03", "S3-39", "S3-40", "S3-41", "S3-42",
          "S3-46", "S3-45", "S3-47", "S3-48", "S7-29"}
named &= set(NOW)

rows, stamp_ok, moved_to_rewrite = [], [], []
plan = {"update": [], "move": [], "create": [], "delete": [], "proposed_delete": [], "run_add": [], "folder_note": {
    "section_id": 136701, "description": "Test cases are current as of 11/13/2026. Before you start testing, check whether the PRD, design or any "
    "other source has changed since then; if it has, update the test cases first."}}
logs = {k: list(v) for k, v in Z.V13_CHANGES.items()}
for c in L.CASES:
    k = c["key"]; now = NOW[k]; m = MAP.get(k)
    noman = now["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")
    if k in DELETE: continue
    if k in Z.RETIRE_V13:
        plan["proposed_delete"].append({"key": k, "case_id": m["case_id"] if m else "", "why": Z.RETIRE_V13[k]}); continue
    if not m:
        if not noman:
            plan["create"].append(k)
            if not now["held"]: plan["run_add"].append(k)
        continue
    # round 4 verdict against the round 3 draft
    b, n = parts(R3[k]["fields"]), parts(now["fields"])
    stamp_only = all(stamp(b[p]) == n[p] for p in n)
    quoted = {x if isinstance(x, str) else x[0] for x in c["q"]}
    if stamp_only and k not in logs and k not in named and k not in CHK["removed_text"] and k not in CHK["quote_misses"]:
        stamp_ok.append(k)
    else:
        if k not in named and k not in logs: moved_to_rewrite.append(k)
        verdict = {}
        for p in n:
            if b[p] == n[p]: verdict[p] = "CONFIRMED"
            elif stamp(b[p]) == n[p]: verdict[p] = "STAMP"
            else: verdict[p] = "CHANGED"
        rows.append((k, m["case_id"], c["title"], verdict, logs.get(k, []), R3[k]["sec"], now["sec"]))
    # what goes to TestRail: against the live body
    lb, ln = parts(LIVE[k]["fields"]), n
    changed = [p for p in ln if lb[p] != ln[p]]
    if changed:
        plan["update"].append({"key": k, "case_id": m["case_id"], "fields": sorted({"title": "title", "preconditions": "custom_preconds", "steps": "custom_steps",
                               "results": "custom_expected", "quotes": "custom_expected", "design": "custom_expected", "marker": "custom_expected", "refs": "refs"}[p] for p in changed)})
    if LIVE[k]["sec"] != now["sec"]: plan["move"].append({"key": k, "case_id": m["case_id"], "from": LIVE[k]["sec"], "to": now["sec"]})
    if LIVE[k]["held"] and not now["held"]: plan["run_add"].append(k)
for k, cid in DELETE.items():
    if MAP.get(k, {}).get("case_id", cid) != cid: raise SystemExit(f"{k}: C-id {cid} does not match the id map")
    plan["delete"].append({"key": k, "case_id": cid, "title": LIVE[k]["title"], "why": DEL_WHY[k]})
released4 = [k for k in MAP if k in R3 and k in NOW and R3[k]["held"] and not NOW[k]["held"] and k not in DELETE]
json.dump(plan, open(f"{W}/plan.json", "w"), indent=1, ensure_ascii=False)

new4 = [k for k in plan["create"] if k not in R3]
R = ["# Internal Work Orders — pass report, PRD v1.3 and design 1794561577-f903 (boards as 1794510020-d4ec) (round 4, 13 Nov 2026)", "",
     "Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed by the case worker. The QA lead chose the **named set** "
     "for v1.3 and **deletion of S2-90 and S8-26** (13 Nov 2026), on top of D-87, D-89 and D-91 (12 Nov 2026). Sources: PRD v1.3 "
     "(`sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md`; changes in `PRD-CHANGES-v1.1-to-v1.3.md`), the design change "
     "(`design-2026-11-12/DESIGN-CHANGE-v1.3-2026-11-12.md`, 15 boards redrawn) and the full read (`full-read/fix-list.json`: S1-71 and 51 runnability fixes).", "",
     "Round 3 (PRD v1.1) was never written to TestRail, so the updates in `write/plan.json` carry rounds 3 and 4 together; the round 3 report is "
     "kept as `PASS-REPORT-round3-v1.1.md`.", "",
     "## Counts", "",
     f"- **Rewritten in round 4 (Rule 134), cases already in TestRail:** {len(rows)} ({len(named & {r[0] for r in rows})} in the named set: "
     f"the v1.3 changes, the redrawn boards, S1-71 and the 51; {len(moved_to_rewrite)} more moved here because the comparison found a change "
     f"beyond the stamp: {', '.join(moved_to_rewrite) or 'none'}).",
     f"- **Stamp only** (From line v1.1 → v1.3 and the design version; every other part CONFIRMED against the round 3 draft): {len(stamp_ok)}. "
     f"`check_v13_text.py` proves for every case that each PRD quote is word for word in v1.3 ({CHK['quotes_checked']} quotes, {len(CHK['quote_misses'])} misses) "
     f"and that its tester text names nothing v1.3 removed ({len(CHK['removed_text'])} cases; S3-48 skipped as retired).",
     f"- **New in round 4:** {len(new4)} ({', '.join(new4) or 'none'}). Still to create from round 3: {', '.join(k for k in plan['create'] if k in R3)}.",
     f"- **Deleted with the QA lead's go-ahead:** {len(plan['delete'])} ({', '.join(d['key'] + ' C' + d['case_id'] for d in plan['delete'])}).",
     (f"- **Proposed for deletion (needs the QA lead, Rule 139):** {', '.join(d['key'] + ' C' + d['case_id'] for d in plan['proposed_delete'])}."
      if plan["proposed_delete"] else "- **Proposed for deletion:** none. S3-48 was first retired, then rewritten: its source (Jira SV-11976 item 5) "
      "still applies under v1.3 through the original work order window."),
     f"- **Released from a hold in round 4:** {', '.join(released4) or 'none'}. Run 559 gets: {', '.join(plan['run_add'])} (held cases never).",
     f"- **Updates to send:** {len(plan['update'])} cases; moves: {len(plan['move'])}; folder note on section 136701: \"{plan['folder_note']['description']}\"", "",
     "## How each case was read", "",
     "- Every part of every case is rebuilt by `build.py` from PRD v1.3 and design 1794510020-d4ec and checked by its gates (quotes word for word "
     "in v1.3, message rows word for word, design words in the v3 boards, baselines visible, one action per step, preconditions relevant and fresh) "
     "and by `tester_readiness_check.py`.",
     "- The rewritten cases were read by the case worker against the v1.3 sentence or the redrawn board; the 52 full-read cases against their verdict "
     "(`full-read/verdict-1..6.json`). The stamp-only cases were read in full in the full read (12 Nov) and are proved unchanged since by the "
     "part-by-part comparison below and by `check_v13_text.py`.", "",
     "## Rewritten cases — every part", "",
     "Parts compared with the round 3 draft: Title · Preconditions · Steps · Results · Quotes and From lines · References from Design · AUTOMATION line · Refs · Folder. "
     "\"=\" CONFIRMED, \"stamp\" only the v1.3 From line or design version, \"CHANGED\" rewritten.", "",
     "| Case | C-id | Title | Title | Pre | Steps | Results | Quotes | Design | Marker | Refs | Folder | What changed |",
     "|---|---|---|---|---|---|---|---|---|---|---|---|---|"]


HINTS = "listed by the v1.3 scan for the words \"QuickBooks mark\"; read: the mark it names is the one v1.3 keeps (S1-R13, S1-R15, S1-R16, S5-R1), not the removed second hint line; nothing beyond the stamp"
NAMED_NOTE = {**{k: HINTS for k in ("S1-45", "S1-56", "S1-73", "S5-01", "D-06", "D-17", "D-18")},
              "S2-09": "full-read item with no fix: already held on the Maintenance Reminders release (verdict-*.json); nothing beyond the stamp",
              "S12-02": "listed for UFS-31 (v1.1 row 29 renumbered); read: the row it quotes is word for word in v1.3; nothing beyond the stamp",
              "D-86": "listed for S1-R2; read: the part of S1-R2 it quotes is word for word in v1.3 and the board did not change; nothing beyond the stamp"}


def auto(v, k=""):
    w = [NAMED_NOTE[k]] if k in NAMED_NOTE else []
    if v["quotes"] == "CHANGED": w.append("quotes re-copied from v1.3 (a quoted sentence changed or was added); results read against it")
    if v["design"] == "CHANGED": w.append("References from Design: the redrawn board's v3 title and picture (-v13), or the register note")
    if v["refs"] == "CHANGED": w.append("refs follow the quoted stories")
    return w


short = lambda v: {"CONFIRMED": "=", "CHANGED": "CHANGED"}.get(v, "stamp")
for k, cid, t, v, lg, s0, s1 in rows:
    R.append(f"| {k} | {link(cid)} | {t} | {short(v['title'])} | {short(v['preconditions'])} | {short(v['steps'])} | {short(v['results'])} | "
             f"{short(v['quotes'])} | {short(v['design'])} | {short(v['marker'])} | {short(v['refs'])} | "
             f"{'moved ' + s0 + ' → ' + s1 if s0 != s1 else '='} | {'; '.join(lg + auto(v, k)).replace('|', '/')} |")
R += ["", "## New cases", ""]
for k in plan["create"]:
    c = next(x for x in L.CASES if x["key"] == k)
    R.append(f"- **{k}** ({SECS[NOW[k]['sec']]['name']}{', held' if NOW[k]['held'] else ''}): {c['title']}. "
             f"Quotes {', '.join(x if isinstance(x, str) else x[0] for x in c['q'])}. {'Round 4.' if k not in R3 else 'Round 3, rebuilt on v1.3.'}")
R += ["", "What v1.3 adds is tested by rewriting the cases that tested the old Close, not by new keys: one press with no window (S3-02, S3-49, "
      "S3-53, S3-54 and every Close step), the posting date and summary on the Finance tab (S3-07…S3-10, S3-44…S3-46, D-38…D-43, D-60), the two "
      "remaining windows (S3-15 missing original, S3-11 cost move), S3-E5's refusal only while a window is open (S3-47). D-93 is new: a runnable design case for the cost move window's lead sentence and item line, written from board 7e (IWO-D57, check (c)).", "",
      "## Deleted, retired, proposed", ""]
for d in plan["delete"]: R.append(f"- **Delete** {d['key']} {link(d['case_id'])} \"{d['title']}\": {d['why']}")
for d in plan["proposed_delete"]: R.append(f"- **Proposed** {d['key']} {link(d['case_id'])}: {d['why']}.")
R += ["", "The confirmation windows of S1-21, S1-22, S2-32b, S2-44, S2-59, S4-02 and S12-40 did not change; none of these cases opens or relies on "
      "the Close confirmation (checked step by step).", "",
      "## Stamp-only cases (From line v1.1 → v1.3; design version where shown; every other part CONFIRMED)", "",
      ", ".join(f"{k} (C{MAP[k]['case_id']})" for k in stamp_ok), ""]
open(f"{A}/PASS-REPORT.md", "w").write("\n".join(R) + "\n")
print("rewritten", len(rows), "| named", len(named), "| stamp only", len(stamp_ok), "| moved to rewrite", moved_to_rewrite, "| create", plan["create"],
      "| update", len(plan["update"]), "| move", [(x["key"], x["from"], x["to"]) for x in plan["move"]], "| run add", plan["run_add"],
      "| delete", [d["key"] for d in plan["delete"]], "| proposed", [d["key"] for d in plan["proposed_delete"]], "| released4", released4)
