"""C682436 released on PRD v68 S1-N1d (Chris Ward answer 16, 19 Oct 2026; QA lead go-ahead 19 Oct 2026)."""
import json, re, html
B = json.load(open("../C682436-before.json"))
PRD = open("../../prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md").read()
Q = re.search(r"- \*\*S1-N1d:\*\* (.*)", PRD).group(1).strip()
SETUP = re.search(r'<p><strong><a href="[^"]+">Setup file \(for Claude sessions; a tester does not need it\)</a></strong></p>', B["custom_preconds"]).group(0)
e = html.escape
TITLE = "Design- No technicians yet and Nothing here yet in both views"
PRE = SETUP + "<p></p><p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{x}</li>" for x in [
 'You are signed in with the "Admin" role, in a browser window at least 1024 px wide.',
 'Location {Location-B} has work orders but no technicians.<br>For example: ZZAUTOTEST Location No Techs.',
 'Location {Location-C} has no technicians and no work orders.<br>For example: ZZAUTOTEST Location Empty.',
 'You can change location to {Location-B} and {Location-C}.',
 'User {User-B} can open Work Orders at {Location-B}, and their role does not have the permission "Settings → App".<br>For example: ZZAUTOTEST C682436 Viewer, with a custom role that has only Work orders View.',
 'If any record above is missing, mark this test Blocked: "setup not done".']) + "</ul>"
STEPS = ["Change location to {Location-B}.", 'Open "Work Orders" &gt; "All" and click "Tech View".', 'Click "Board View".',
 'Click "Add Technician".', "Change location to {Location-C}.", 'Open "Work Orders" &gt; "All" and click "Board View".',
 'Click "Tech View".', "Sign out and sign in as {User-B}.", "Change location to {Location-B}.",
 'Open "Work Orders" &gt; "All" and click "Board View".']
RES = ["Step 1: the top bar shows {Location-B}.",
 'Step 2: Tech View shows only the "Unassigned" group. Below it are a person icon, "No technicians yet", the text "Add technicians to assign work orders. Until then, every work order stays in Unassigned." and an "Add Technician" button.',
 'Step 3: Board View shows only the "Unassigned" column, followed by the same icon, "No technicians yet", the same text and the "Add Technician" button.',
 'Step 4: the Staff page in Settings opens (the page where staff are added).',
 "Step 5: the top bar shows {Location-C}.",
 'Step 6: Board View reads "Nothing here yet", then "Add technicians and create your first work order to track work by tech.", with a "Create Work Order" button and an "Add Technician" button.',
 'Step 7: Tech View shows the same: "Nothing here yet", the same text, "Create Work Order" and "Add Technician".',
 "Step 8: you are signed in as {User-B}.", "Step 9: the top bar shows {Location-B}.",
 'Step 10: Board View shows the "Unassigned" column and "No technicians yet" with its text, and there is no "Add Technician" button.']
DESIGN = B["custom_expected"].split("<p><strong>References from Design</strong></p>")[1]
DESIGN = DESIGN.replace("the source of this case's expected results.", "where the design draws these states; the expected results come from the PRD.")
# drop the duplicated first-run-titles quote
dup = re.findall(r"<li><strong>Design — Work Orders.dc.html, first-run titles:</strong>.*?</li>", DESIGN)
if len(dup) == 2 and dup[0] == dup[1]: DESIGN = DESIGN.replace(dup[0], "", 1)
DESIGN = DESIGN.replace("<p>AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO</p>", "<p>AUTOMATION: READY</p>")
EXP = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{r}</li>" for r in RES) + "</ul>"
 "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
 "<p>From: PRD \"Work Orders — Board View &amp; Tech View Display Options\", Confluence 845185030, version 68 (19 Oct 2026, Chris Ward), read 19 Oct 2026 · Epic SV-10043 · story SV-10044 · Chris Ward's answer 16 on the WO Board design-differences sheet (19 Oct 2026)</p>"
 f"<ul><li><strong>S1-N1d:</strong> &ldquo;{e(Q, quote=False)}&rdquo;</li></ul><p>Not yet checked against a build.</p><p></p>"
 "<p><strong>References from Design</strong></p>" + DESIGN)
NEW = {"title": TITLE, "custom_preconds": PRE, "custom_steps": "<ol>" + "".join(f"<li>{s}</li>" for s in STEPS) + "</ol>", "custom_expected": EXP, "refs": "SV-10043, SV-10044"}
assert len(STEPS) == len(RES) == 10 and len(TITLE) <= 80 and "HOLD" not in EXP and EXP.count("AUTOMATION:") == 1 and EXP.rstrip().endswith("<p>AUTOMATION: READY</p>")
assert Q in html.unescape(EXP)
json.dump(NEW, open("C682436-new.json", "w"), indent=1, ensure_ascii=False)
print(html.unescape(re.sub(r"<[^>]+>", "\n", EXP)).replace("\n\n", "\n")[-900:])
