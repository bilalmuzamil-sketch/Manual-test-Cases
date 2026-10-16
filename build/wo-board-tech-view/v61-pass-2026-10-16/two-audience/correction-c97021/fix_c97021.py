#!/usr/bin/env python3
"""QA lead, 16 Oct 2026: "keep everything below the expected results the same" and "you must NOT hard code anything there rather use
for example (ZZtest) but first give the steps to follow. Just correct one case". C97021 only: tester text uses {placeholders} with the
creation steps first and "(for example …)" values; below Expected results the case keeps its usual Source paragraph, divergence
paragraph, Exact quotes (refreshed to PRD v61) and the AUTOMATION line. --apply writes it (edit lock on this pass's after-copy)."""
import json, re, sys, html, base64, urllib.request
V = "build/wo-board-tech-view/v61-pass-2026-10-16"; H = f"{V}/two-audience/correction-c97021"
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
A = json.load(open(f"{V}/anchor-quotes-current.json")); PRD = ws(open(f"{V}/CONFLUENCE-845185030-v61-2026-10-16.md").read())
OLD = json.load(open(f"{V}/two-audience/existing-quotes.json"))["97021"]["quotes"]
DOC = "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
pre = [
 'You are signed in with the "Admin" role at {Location-A} (for example Staging Heavy Duty - 9919).',
 'Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} (for example ZZAUTOTEST '
 'C97021 Ana) and {Technician-B} (for example ZZAUTOTEST C97021 Ben).',
 'Customer {Customer-A} (for example ZZAUTOTEST C97021 Keyboard) has four Approved work orders: {Work-order-1} and {Work-order-2} '
 '(for example S10043-17701 and S10043-17702) led by {Technician-A}, {Work-order-3} (for example S10043-17703) led by {Technician-B}, '
 'and {Work-order-4} (for example S10043-17704) with no lead technician.',
 '{Technician-A} and {Technician-B} are pinned in your Board View, and no other technician is pinned.',
 'Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" '
 'off, in a browser window at least 1024 px wide.',
 'If any record above is missing, mark this test Blocked: "setup not done".']
HOWTO = re.compile(r'New Staff Member|New Customer|Create Work Order|Save & Close|"Save"|quick-login|click the pin|type "grease"|Lead Technician" dropdown')
steps = ['Click once in the "Search" box.',
         "Press Tab until something on the board shows a focus ring.",
         "Press the Right arrow key.",
         "Press the Down arrow key.",
         "Press Tab.",
         "Press Tab again.",
         'Click "Tech View" in the display switcher.',
         'Click once in the "Search" box.',
         "Press Tab until something in the table shows a focus ring.",
         "Press the Down arrow key."]
res = ['Step 1: the cursor is in the "Search" box and nothing on the board has a focus ring.',
       'Step 2: the focus ring lands on a card, the first one on the board ({Work-order-4}\'s card in "Unassigned"). No column header gets the focus ring on the way.',
       "Step 3: focus moves one column to the right, into {Technician-A}'s column.",
       "Step 4: focus moves down to the next item in the same column, a card of {Technician-A}.",
       'Step 5: focus moves to the focused card\'s own "More actions" (…) button, not to another card.',
       "Step 6: focus leaves the board; no other card or column header gets the focus ring.",
       'Step 7: Tech View shows the "Unassigned" group first, then {Technician-A}\'s and {Technician-B}\'s groups.',
       'Step 8: the cursor is in the "Search" box and nothing in the table has a focus ring.',
       "Step 9: the focus ring lands on a work order row, the first one ({Work-order-4}'s row in \"Unassigned\"), not on a group header.",
       "Step 10: focus moves to the next item below, {Technician-A}'s group header."]
source = ('Epic SV-10043; story SV-10054 (Story 11, Keyboard access and focus); PRD "Work Orders — Board View & Tech View Display Options", '
          "Confluence 845185030, version 61 (16 Oct 2026, Chris Ward), S11-R1, S11-R3, S2-R17, S2-R2 and the Story 11 user story, read 16 Oct 2026. "
          "Product owner answers: Chris Ward, WO Board and Tech View question sheet (https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU), "
          "answer 28, read 15 Oct 2026. Source-verified 16 October 2026. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the "
          "expected results changed on 16 Oct 2026; the changed results have not yet been checked against a build.")
divergence = ("Chris Ward's answer 28 (15 Oct 2026) and PRD version 54 said Tab reaches every row, card and header in on-screen order. PRD versions "
              "55, 60 and 61 (15 and 16 Oct 2026, Chris Ward rulings on Slavcho Mitrov's questions and the QA triage of SV-11395, SV-11397, "
              "SV-11422 and SV-11421) changed this: each view is one Tab stop that lands on a work order, and the arrow keys move between cards, "
              "rows, headers and columns. This case follows version 61, the latest.")
story = [q for l, q in OLD if l == "Story 11 user story"]
quotes = [["S11-R1", A["S11-R1"]], ["S11-R3", A["S11-R3"]], ["S2-R17", A["S2-R17"]], ["S2-R2", A["S2-R2"]], ["Story 11 user story", story[0]]]
marker = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
# checks
P = []
for l, q in quotes:
    if ws(q) not in PRD: P.append(f"quote {l} not verbatim in PRD v61")
ph = re.compile(r"\{([^{}]+)\}"); defined = set(ph.findall(" ".join(pre)))
for x in set(ph.findall(" ".join(steps + res))):
    if x not in defined: P.append(f"{{{x}}} not defined in the preconditions")
if re.search(r'"ZZAUTOTEST[^"]*"', " ".join(pre + steps + res)): P.append("hard-coded ZZAUTOTEST value in tester text")
if HOWTO.search(" ".join(pre)): P.append("set-up instructions in the tester preconditions: " + HOWTO.search(" ".join(pre)).group(0))
for i, r in enumerate(res, 1):
    if not r.startswith(f"Step {i}: "): P.append(f"result {i} not 'Step {i}:'")
if len(res) != len(steps): P.append("one result per step")
print("problems:", P or "none"); 
if P: sys.exit(1)
e = lambda s: html.escape(s, quote=False)
ul = lambda xs, t="ul": f"<{t}>" + "".join(f"<li>{e(x)}</li>" for x in xs) + f"</{t}>"
fields = {
 "custom_preconds": f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                    "<p><strong>Preconditions</strong></p>" + ul(pre),
 "custom_steps": ul(steps, "ol"),
 "custom_expected": ("<p><strong>Expected results</strong></p>" + ul(res)
                     + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p><p>{e(divergence)}</p>"
                     + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
                     + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in quotes) + "</ul>"
                     + f"<p>{e(marker)}</p>")}
json.dump(fields, open(f"{H}/C97021-fields.json", "w"), indent=1, ensure_ascii=False)
if "--apply" in sys.argv:
    C = json.load(open("/tmp/testrail/creds.json")); AU = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
    def api(ep, d=None):
        r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(d).encode() if d is not None else None,
                                   headers={"Authorization": "Basic " + AU, "Content-Type": "application/json"})
        x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
    after = json.load(open(f"{H}/C97021-after.json")); st, live = api("get_case/97021")
    if live["updated_on"] != after["updated_on"]: sys.exit("REFUSED: C97021 changed since this pass wrote it")
    json.dump(live, open(f"{H}/C97021-before-2.json", "w"), indent=1)
    st, _ = api("update_case/97021", fields); st2, a = api("get_case/97021"); json.dump(a, open(f"{H}/C97021-after.json", "w"), indent=1)
    un = [x for x in a if x not in fields and x not in ("updated_on", "updated_by", "version") and a.get(x) != live.get(x)]
    r = {"op": "update_case", "case": "C97021", "http": st, "fields_ok": all(a[f] == v for f, v in fields.items()), "untouched_changed": un,
         "marker_last": a["custom_expected"].rstrip().endswith(f"<p>{marker}</p>")}
    open(f"{H}/apply-log.jsonl", "a").write(json.dumps(r) + "\n"); print(r)
