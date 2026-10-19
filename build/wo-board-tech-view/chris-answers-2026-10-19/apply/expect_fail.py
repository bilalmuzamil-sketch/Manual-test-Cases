"""QA lead, 19 Oct 2026: "2. Yes with ticket link it is blocked on" (mark the cases that depend on SV-11522/SV-11524 as EXPECT FAIL)
and "3. Update" (C368167's PRD §4 quote to v68). Builds, checks and (--apply) writes; edit lock against the post-correction copies."""
import sys, json, re, html
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PRD = open("../../prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md").read()
L22 = '<a href="https://shopview.atlassian.net/browse/SV-11522">SV-11522</a>'; L24 = '<a href="https://shopview.atlassian.net/browse/SV-11524">SV-11524</a>'
SYM = {"label": 'the More actions menu on a work order with no lead says "Reassign lead technician"',
       "dialog": 'the lead technician dialog lists "Unassigned" at the top, and choosing a technician needs a click on a "Reassign" button',
       "toast": 'the message after a lead change reads "Lead technician updated" (or "Lead technician removed") and has no Undo button'}
CASES = {96956: ["label", "dialog", "toast"], 96957: ["toast"], 96969: ["dialog"], 154889: ["toast"], 368133: ["toast"], 368135: ["dialog"],
         368136: ["toast"], 368140: ["label", "dialog", "toast"], 581891: ["dialog", "toast"], 581892: ["toast"], 581893: ["toast"],
         97002: ["toast"], 97008: ["toast"], 97009: ["toast"], 97028: ["toast"], 96963: ["toast"], 590130: ["toast"], 368144: ["toast"],
         96973: ["dialog"], 97007: ["dialog"]}
def note(parts):
    tk = f"{L22} and {L24}" if ("label" in parts or "dialog" in parts) else L24
    sym = "; ".join(SYM[p] for p in parts)
    return (f"<p><strong>Known problem</strong> ({tk}, open; seen on staging by the designer on 19 Oct 2026): {html.escape(sym, quote=False)}. "
            "(1) If you see exactly that, mark this test Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. "
            "(3) If it behaves as the expected results say, the change has shipped: mark it Passed and tell the QA lead.</p>")
new = {}; probs = []
for i, parts in CASES.items():
    a = json.load(open(f"applied/C{i}-after.json")); e = a["custom_expected"]
    if e.count("AUTOMATION: READY") != 1 or "EXPECT FAIL" in e: probs.append(f"C{i} marker"); continue
    cut = min([x for x in (e.find("<hr"), e.find("<p><strong>Exact quote"), e.find("<p>Source")) if x > 0] or [-1])
    if cut < 0: probs.append(f"C{i} no place for the note"); continue
    e2 = e[:cut] + note(parts) + e[cut:]
    e2 = e2.replace("AUTOMATION: READY", "AUTOMATION: READY - EXPECT FAIL (SV-11524)")
    new[i] = {"custom_expected": e2}
# C368167
b = {x["id"]: x for x in json.load(open("../../prd-v68-2026-10-19/wo-cases-2026-10-19-evening.json"))}[368167]; e = b["custom_expected"]
OLDQ = "board drag, Reassign dialog, and the work order detail page"; NEWQ = "board drag, the lead technician dialog, Unassign, Undo, and the work order detail page"
OLDS = "PRD Confluence 845185030 (edited 7 Oct 2026)"; NEWS = "PRD Confluence 845185030, version 68 (19 Oct 2026, Chris Ward), read 19 Oct 2026,"
assert e.count(OLDQ) == 1 and e.count(OLDS) == 1
e2 = e.replace(OLDQ, NEWQ).replace(OLDS, NEWS)
q = re.search(r"&ldquo;(Lead technician cannot be changed once.*?)&rdquo;", e2).group(1)
if html.unescape(q) not in PRD.replace("**", ""): probs.append("C368167 quote not in v68")
new[368167] = {"custom_expected": e2}
print(len(new), "cases; problems:", probs)
json.dump(new, open("expect-fail-and-c368167.json", "w"), indent=1, ensure_ascii=False)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
n = lambda x: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x or ""))).strip(); log = []
for i, body in new.items():
    ref = json.load(open(f"applied/C{i}-after.json")) if i != 368167 else b
    cur = api(f"get_case/{i}")
    if cur["updated_on"] != ref["updated_on"]: log.append(dict(case=i, op="SKIPPED: changed since")); continue
    json.dump(cur, open(f"applied/C{i}-before-ef.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{i}", body); st = LAST["status"]; bk = api(f"get_case/{i}")
    json.dump(bk, open(f"applied/C{i}-after-ef.json", "w"), indent=1, ensure_ascii=False)
    other = [x for x in cur if x not in ("custom_expected", "updated_on", "updated_by", "version") and cur[x] != bk.get(x)]
    log.append(dict(case=i, op="update_case", http=st, ok=n(bk["custom_expected"]) == n(body["custom_expected"]), other=other, automated=cur.get("custom_atmstatus") == 3))
json.dump(log, open("applied/apply-log-ef.json", "w"), indent=1)
print([l for l in log if l["op"] != "update_case" or not (l["http"] == 200 and l["ok"] and not l["other"])], "automated:", [l["case"] for l in log if l.get("automated")])
