#!/usr/bin/env python3
"""WIP design-review Aug-20b pass: rework C43838 (tab->widget glow) + add NEW-2 (label wrap).
<br> interim form (hazard #6). Wrap-aware byte verify (Rule 50). tr_client (creds /tmp)."""
import sys, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as tr

ART = "https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e"

def br(items): return "<br>".join(items)

def norm_refs(s): return ",".join(p.strip() for p in s.split(","))

def unwrap(stored):
    if stored is None: return ""
    if stored.startswith("<p>") and stored.endswith("</p>\n"): return stored[3:-5]
    if stored.startswith("<p>") and stored.endswith("</p>"): return stored[3:-4]
    return stored

# ---------- payloads ----------
C43838_expected = br([
 "1. Selecting a line-state tab puts a faded amber glow BEHIND the summary figure(s) that make up that tab's bucket - not on the tab itself.",
 "2. The mapping is: the \"Approved - Partially Completed\" tab glows both open-work-order figures (Completed Work on Open Work Orders and Remaining Work on Open Work Orders); the \"Approved - Not Started\" tab glows Work Orders Not Started; the \"Completed\" tab glows Work Orders Ready to Invoice; the \"Estimates\" tab glows Estimates.",
 "3. Only the selected tab's figure(s) glow at any one time; switching tabs moves the glow to the new tab's figure(s).",
 "4. Confirm live against the design/build: the design review describes only a faded \"amber\" glow - confirm the exact colour/shade and the exact glow style (outline, underline or shadow) live before pinning them; do not invent a hex value.",
]) + "<br><br>---<br>" + (
 "This is the expected behaviour as per epic SV-8582 and the Work In Progress report design review of 13 August 2026 (" + ART + "); the Work In Progress report specification does not name this visual treatment, so it is design-review-sourced and marked for live confirmation above."
) + "<br>" + (
 "This case previously asserted the amber glow appeared on the active TAB element itself; the 13 August 2026 design review places the glow behind the composing summary widgets instead (as above) and says nothing about a tab-element glow, and we have taken the latest design review as prevailing."
) + "<br><br>AUTOMATION: HOLD - needs one live build check"

C43838 = dict(
 cid=43838,
 title="Selecting a bucket tab glows its composing summary widgets (amber)",
 preconds=br([
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The Work In Progress report is open, showing the summary strip and the four line-state tabs, with money in every bucket.",
 ]),
 steps=br([
  "1. Note the summary strip figures and which tab is active on arrival.",
  "2. Click the \"Approved - Not Started\" tab and look at the summary figures.",
  "3. Click each of the other tabs in turn (\"Approved - Partially Completed\", \"Completed\", \"Estimates\") and look at the summary figures each time.",
 ]),
 expected=C43838_expected,
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - selecting a bucket tab puts a faded amber glow behind the composing summary widget(s); epic SV-8582)",
)

NEW2_expected = br([
 "1. A summary-figure label or a table column header that is too long to fit on one line wraps onto a second row.",
 "2. The full label text stays readable - it is never cut off mid-word, and it never shows an ellipsis or \"...\" in place of the rest of the label.",
 "3. Confirm live against the design/build: confirm the long label renders as two rows (wrapped), not truncated, on the build.",
]) + "<br><br>---<br>" + (
 "This is the expected behaviour as per epic SV-8582 and the Work In Progress report design review of 13 August 2026 (" + ART + "); the Work In Progress report specification does not name this layout behaviour, so it is design-review-sourced and marked for live confirmation above."
) + "<br><br>AUTOMATION: HOLD - needs one live build check"

NEW2 = dict(
 section=4361,
 title="Long summary-figure and column labels wrap to a second row, no truncation",
 preconds=br([
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The Work In Progress report is open, showing the summary strip and the results table.",
 ]),
 steps=br([
  "1. Look at the summary-figure labels in the strip (for example \"Completed Work on Open Work Orders\").",
  "2. Look at the table column headers.",
  "3. If needed, narrow the browser window so a long label cannot fit on one line.",
 ]),
 expected=NEW2_expected,
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - long summary-figure and column labels wrap to a second row without mid-word truncation; epic SV-8582)",
)

log = []

def verify_case(cid, sent):
    s2, g = tr.get_case(cid)
    if s2 != 200: raise RuntimeError("re-GET C%s HTTP %s" % (cid, s2))
    checks = {}
    checks["title"] = (g.get("title") == sent["title"])
    checks["preconds"] = (unwrap(g.get("custom_preconds") or "") == sent["custom_preconds"])
    checks["steps"] = (unwrap(g.get("custom_steps") or "") == sent["custom_steps"])
    checks["expected"] = (unwrap(g.get("custom_expected") or "") == sent["custom_expected"])
    checks["refs"] = (g.get("refs") == norm_refs(sent["refs"]))
    exp = g.get("custom_expected") or ""
    checks["one_marker"] = exp.count("AUTOMATION:") == 1
    checks["one_prov"] = exp.count("This is the expected behaviour") == 1
    checks["no_ol_li"] = ("<ol" not in exp and "<li" not in exp)
    checks["atm"] = g.get("custom_atmstatus")
    checks["auto"] = g.get("custom_automation_type")
    checks["tpl"] = g.get("template_id")
    checks["type"] = g.get("type_id")
    checks["section"] = g.get("section_id")
    allok = all(v for k, v in checks.items() if k in ("title","preconds","steps","expected","refs","one_marker","one_prov","no_ol_li"))
    return allok, checks, g

# ---- TASK 1: rework C43838 ----
c = C43838
body = {"title": c["title"], "custom_preconds": c["preconds"], "custom_steps": c["steps"],
        "custom_expected": c["expected"], "refs": c["refs"]}
sent = body
st, d = tr.post("update_case/%d" % c["cid"], body)
entry = {"op": "update_case", "cid": c["cid"], "http": st}
if st != 200:
    entry["result"] = "HTTP_FAIL"; entry["body"] = str(d)[:400]; log.append(entry)
    print(json.dumps(entry)); print("STOP"); json.dump(log, open("exec-aug20b-log.json","w"), indent=2); sys.exit(1)
time.sleep(0.4)
ok, checks, g = verify_case(c["cid"], sent)
entry["result"] = "PASS" if ok else "VERIFY_FAIL"; entry["checks"] = checks
log.append(entry); print("C%d %s %s" % (c["cid"], entry["result"], json.dumps(checks)))
if not ok:
    print("SENT expected:", repr(sent["custom_expected"])[:500])
    print("STORED expected:", repr(g.get("custom_expected"))[:600])
    json.dump(log, open("exec-aug20b-log.json","w"), indent=2); sys.exit(1)

# ---- TASK 3: add NEW-2 ----
n = NEW2
body2 = {"title": n["title"], "custom_preconds": n["preconds"], "custom_steps": n["steps"],
         "custom_expected": n["expected"], "refs": n["refs"],
         "template_id": 1, "type_id": 1, "custom_atmstatus": 1, "custom_automation_type": 0}
st, d = tr.post("add_case/%d" % n["section"], body2)
entry = {"op": "add_case", "section": n["section"], "http": st}
if st != 200:
    entry["result"] = "HTTP_FAIL"; entry["body"] = str(d)[:400]; log.append(entry)
    print(json.dumps(entry)); print("STOP"); json.dump(log, open("exec-aug20b-log.json","w"), indent=2); sys.exit(1)
new_cid = d["id"]
entry["cid"] = new_cid
time.sleep(0.4)
sent2 = {"title": n["title"], "custom_preconds": n["preconds"], "custom_steps": n["steps"],
         "custom_expected": n["expected"], "refs": n["refs"]}
ok, checks, g = verify_case(new_cid, sent2)
entry["result"] = "PASS" if ok else "VERIFY_FAIL"; entry["checks"] = checks
log.append(entry); print("NEW-2 = C%d %s %s" % (new_cid, entry["result"], json.dumps(checks)))
if not ok:
    print("SENT expected:", repr(sent2["custom_expected"])[:500])
    print("STORED expected:", repr(g.get("custom_expected"))[:600])
json.dump(log, open("exec-aug20b-log.json","w"), indent=2)
print("NEW_CID=%d" % new_cid)
