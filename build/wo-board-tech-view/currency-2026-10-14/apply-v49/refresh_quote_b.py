#!/usr/bin/env python3
"""Second batch (coordinator follow-up, 14 Oct 2026): quote refresh for C581891 (S4-R28) and C97010 (S4-N5), same method as refresh_quote.py.
Original docstring: Quote refresh (Rule 113: the quote changes when the source changes) for C368133 and C96965, PRD v48 -> v49, 14 Oct 2026.
Only custom_expected changes, and inside it only: (1) the S4-R28 quote, replaced by the v49 text copied by code from the saved PRD;
(2) the Source line's PRD version and S4-R28 note, and its sentence that called the one-line question open (answered in v49).
The build-verification stamp, the marker and every other byte stay as they are. Edit lock: the live case must equal
snapshots-after-answers on EVERY field, re-read immediately before the write.
  python3 refresh_quote.py            dry run: prints the planned text changes
  python3 refresh_quote.py --apply    writes, re-reads, verifies, logs to applied/apply-log.jsonl"""
import json, sys, os, html, difflib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from trlib import api, LAST
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"
SNAP = "build/wo-board-tech-view/currency-2026-10-14/snapshots-after-answers"
ANCH = json.load(open(f"{H}/anchor-quotes-current.json"))
OLD_R28 = ("The shift-clearing prompt (S4-R11, S4-R26) shows only when the outgoing lead has a work-order-level shift on this work order that "
           "has not ended. A work-order-level shift is one that covers every current line of the work order, which is what the Schedule's "
           "Entire work order drop creates. A shift on only some lines does not show the prompt.")
NEW_R28 = ANCH["S4-R28"]
OLD_N5 = "Nothing can be dropped onto an inactive technician's column/group (S2-N2, S3-N2)."
NEW_N5 = ANCH["S4-N5"]
assert NEW_R28 != OLD_R28 and "every approved line" in NEW_R28 and NEW_N5 != OLD_N5 and "not enrolled" in NEW_N5
def esc(t): return html.escape(t, quote=False)
PAIRS = {
 581891: [(esc(OLD_R28), esc(NEW_R28)),
          ("version 48 (12 Oct 2026, Chris Ward), the context note under S4-R8",
           "version 49 (14 Oct 2026, Chris Ward), the context note under S4-R8"),
          ("S4-R5 and S4-R28, read 14 Oct 2026.",
           "S4-R5 and S4-R28 (reworded in version 49 on 14 Oct 2026 from Chris Ward's answer 1 of 14 Oct 2026; {Technician-A} has no shift on this work order, so the question still does not open), read 14 Oct 2026.")],
 97010: [(esc(OLD_N5), esc(NEW_N5)),
         ('PRD Confluence 845185030, edited 7 Oct 2026 (status line "PRD v33"), S9-N2, S4-N5, S4-N3, S4-N8, read 8 Oct 2026.',
          'PRD Confluence 845185030, version 49 (14 Oct 2026, Chris Ward), S9-N2, S4-N5 (widened in version 49 from Chris Ward\'s answer 2 of 14 Oct 2026 to also name a technician not enrolled at this location; this case checks the inactive technician only, so what the tester sees is unchanged), S4-N3, S4-N8, read 14 Oct 2026.')],
}
def plan(cid, exp):
    new = exp
    for a, b in PAIRS[cid]:
        n = new.count(a)
        if n != 1: raise SystemExit(f"C{cid}: expected exactly one occurrence, found {n}: {a[:90]}")
        new = new.replace(a, b)
    return new
WHY = {581891: "S4-R28 quote refreshed to PRD v49 (copied from the saved v49 text); Source line moved to v49. Re-verified whole against PRD v49: "
                "{Technician-A} has no shift on the work order, so no question opens under either wording; the S4-R8 context note and table row "
                "are verbatim in v49; steps, preconditions and results unchanged. Build stamp and marker kept. Not re-run on a build.",
         97010: "S4-N5 quote refreshed to the widened v49 wording; Source line moved to v49. Re-verified whole against PRD v49: the case drops "
                "onto a deactivated technician only, so the widened rule (adds a technician not enrolled at this location) changes nothing a "
                "tester sees; S9-N2, S4-N3, S4-N8 verbatim in v49; steps and results unchanged. Old 8 Oct layout kept (not in this task's scope). "
                "Build stamp of 10/8/2026 and marker kept. Not re-run on a build."}
os.makedirs(f"{H}/applied", exist_ok=True)
log = open(f"{H}/applied/apply-log.jsonl", "a")
DONE = {json.loads(l)["case"] for l in open(f"{H}/applied/apply-log.jsonl") if '"op": "update_case"' in l and '"fields_written": {"custom_expected": true}' in l}
for cid in (581891, 97010):
    if f"C{cid}" in DONE: print(f"C{cid} already written; skipped"); continue
    snap = json.load(open(f"{SNAP}/C{cid}.json"))
    live = api(f"get_case/{cid}"); st0 = LAST["status"]
    diff = sorted(k for k in set(live) | set(snap) if live.get(k) != snap.get(k))
    if live["created_by"] != 3 or diff:
        rec = {"op": "refused_edit_lock", "case": f"C{cid}", "http": st0, "why": f"live differs from snapshots-after-answers in {diff}"}
        print(rec); log.write(json.dumps(rec) + "\n") if "--apply" in sys.argv else None; continue
    new_exp = plan(cid, live["custom_expected"])
    # Rule 41 whole-case re-read: every other quoted code in this case must still be verbatim in v49
    import re
    others = re.findall(r"<strong>(S\d+-[A-Z]+\d+[a-z]?):</strong> &ldquo;(.*?)&rdquo;</li>", new_exp)
    stale = [c for c, t in others if c in ANCH and html.unescape(t) != ANCH[c]]
    if stale: raise SystemExit(f"C{cid}: other quotes not verbatim in v49: {stale}")
    if "--apply" not in sys.argv:
        print(f"== C{cid} dry run; all other quotes verbatim in v49: {[c for c, _ in others]}")
        for l in difflib.unified_diff(live["custom_expected"].replace("</li>", "</li>\n").replace("</p>", "</p>\n").splitlines(),
                                      new_exp.replace("</li>", "</li>\n").replace("</p>", "</p>\n").splitlines(), lineterm="", n=0):
            print(l[:700])
        continue
    json.dump(live, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1)
    api(f"update_case/{cid}", {"custom_expected": new_exp}); st = LAST["status"]
    a = api(f"get_case/{cid}")
    json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1)
    untouched = [k for k in live if k not in ("custom_expected", "updated_on", "updated_by", "version") and a.get(k) != live.get(k)]
    ok = a["custom_expected"] == new_exp and not untouched and a["updated_by"] == 3
    rec = {"op": "update_case", "case": f"C{cid}", "http": st, "fields_written": {"custom_expected": a["custom_expected"] == new_exp},
           "untouched_changed": untouched, "atmstatus_before": live["custom_atmstatus"], "atmstatus_after": a["custom_atmstatus"],
           "automation_type_before": live["custom_automation_type"], "automation_type_after": a["custom_automation_type"],
           "stamp_kept": live["custom_expected"].split("<p>Last checked")[1].split("</p>")[0] == a["custom_expected"].split("<p>Last checked")[1].split("</p>")[0],
           "marker_kept": a["custom_expected"].endswith("<p>AUTOMATION: READY</p>"), "ok": ok,
           "why": WHY[cid]}
    print(rec); log.write(json.dumps(rec) + "\n"); log.flush()
    if not ok: raise SystemExit("STOP: write did not verify")
