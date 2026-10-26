"""26 Oct 2026 — rows for the QA lead's Google Sheet: Automated tests changed after being automated, and WHY.
Reasons derived from history-why.json (TestRail history), prd-versions.json (Confluence version list with Chris Ward's change notes),
tickets-live.json (statuses read 26 Oct) and the project's dated commits/PROJECT-STATE entries for each edit batch."""
import json, re
T = json.load(open('tickets-live.json')); RUN = {int(k): v for k, v in json.load(open('run498-tests.json')).items()}
V = {v[0]: v for v in json.load(open('prd-versions.json'))}
L23 = open('../AUTOMATED-TESTS-CHANGED-2026-10-23.md').read()
def tk(k): return f"ticket {k} (https://shopview.atlassian.net/browse/{k}, {T[k][0]} today)"
def prd(n, what=None):
    d = V[n][1][:10]; y, m, dd = d.split('-'); mon = {'10': 'Oct'}[m]
    return f"PRD version {n}, changed {int(dd)} {mon} {y} by Chris Ward (\"{what or V[n][3]}\")"
v51 = prd(51, 'Staging review (Sasha): S7-R7 and other rules'); v52 = prd(52); v53 = prd(53); v54 = prd(54, "Chris's answers 12 to 31 on our question sheet")
v61 = prd(61, 'answers on SV-11395, SV-11397, SV-11421, SV-11422'); v64 = prd(64); v66 = prd(66); v68 = prd(68)
v71 = prd(71); v73 = prd(73); v74 = prd(74); v47 = prd(47); v49 = prd(49, "Chris's answer 1 of 14 Oct on approved lines (S4-R28)")
known = f"{tk('SV-11524')} and {tk('SV-11522')}: a \"Known problem\" note and the expect-fail marker were added 19 Oct (the ticket wording was taken back out 23 Oct because it was not on production)"
known1 = f"{tk('SV-11524')}: a \"Known problem\" note and the expect-fail marker were added 19 Oct (taken back out 23 Oct, not on production)"
WHY = {
 96911: f"PRD changed: {v52}. The test was rewritten to it the same evening, step by step with general names.",
 96929: f"PRD changed: {v53} and {v54} (applied 16 Oct). Then {tk('SV-11312')}: the product owner's comment on it (the order as built is correct; PRD rules S2-R6 and S9-R14, read at version 64 of 16 Oct) changed the expected order and the title (19 Oct). Then {v68} (assign wording).",
 96936: f"No ticket and no PRD change. QA lead decision 19 Oct 2026: the second technician in the example became Aaron Baker, because Ralph Edwards could not be picked on the work order page (the 100-name list problem, {tk('SV-11429')}). Set-up and steps were simplified the same day; the expected behaviour did not change.",
 96945: f"PRD changed: {v61}, which followed the developer {tk('SV-11395')}, {tk('SV-11397')}, {tk('SV-11421')} and {tk('SV-11422')}. On 19 Oct step 5 was reworded (click outside the menu) with the QA lead's go-ahead; the expected behaviour did not change.",
 96978: f"PRD changed: {v54} (applied 16 Oct). On 22 Oct Ahtasham Amjad renamed \"Fields to display\" to \"Column Selection\", following {tk('SV-11580')} and {v71}; the source line now cites {v73}.",
 96981: f"{tk('SV-11580')} and {v71}: on 22 Oct Ahtasham Amjad renamed \"Fields to display\" to \"Column Selection\"; the source line cites {v73}. On 23 Oct the set-up wording was brought to {v74}.",
 96988: f"PRD changed: {v71}. The density checks became Tech View only (Board View has no density control in this release).",
 96989: f"PRD changed: {v71}, delivered by {tk('SV-11580')}; the Card size control that replaces it later is {tk('SV-11581')}. The test became Tech View only and its title changed.",
 96992: f"PRD changed: {v71}, delivered by {tk('SV-11580')}; Card size later is {tk('SV-11581')}. The test became Tech View only and its title changed.",
 96993: f"PRD changed: {v51} and {v52} (14 Oct). On 23 Oct the steps' wording was brought to {v74}; no expected result changed then.",
 96994: f"PRD changed: {v51} and {v52} (14 Oct). On 23 Oct the steps' wording was brought to {v74}; no expected result changed then.",
 96995: f"PRD changed: {v51} and {v52} (14 Oct). On 23 Oct the steps' wording was brought to {v74}; no expected result changed then.",
 96996: f"PRD changed: {v51} and {v52} (14 Oct). On 23 Oct the steps' wording was brought to {v74}; no expected result changed then.",
 97011: f"PRD changed: {v54} (applied 16 Oct). The test was rewritten step by step with general names.",
 154649: f"{tk('SV-11580')} and {v71}/{v73}: on 22 Oct Ahtasham Amjad renamed \"Fields to display\" to \"Column Selection\" and took Board View's density control out of the list.",
 368145: f"PRD changed: {v54} (applied 16 Oct), then {v68} (assign wording, 19 Oct).",
 368167: f"QA lead decisions 19 Oct 2026: set-up and steps simplified, and step 2 reworded so it works whether or not the payment window opens. The source quote was then brought to {v68} (adds Unassign and Undo).",
 368168: f"Source line only: the PRD quotes were re-checked against {v68}. The expected behaviour did not change.",
 368173: f"{tk('SV-11429')}: a \"Known problem\" note was added 20 Oct, and the test was rewritten step by step with general names.",
 368181: f"QA lead decision 12 Oct 2026 (a problem that production has too is not a regression): the test was rewritten so it passes when production also shows no count. {tk('SV-11110')} was named in it and taken out the same day.",
 368214: f"PRD changed: {v54} and {v61} (16 Oct). Then QA lead decision 19 Oct 2026: the Status filter is offered on the All tab only (as on production), so the test uses the All tab.",
 614719: f"{tk('SV-11422')}: Chris Ward's comment of 19 Oct on it led to steps 8 to 13 being added on 20 Oct (PRD rule S11-R1 re-read at {v68}, unchanged). Then QA lead decision 23 Oct 2026: step 9 expects all three work orders, as the set-up builds. Vladimir Tomovic also edited the set-up on 19 and 20 Oct.",
 682419: f"{tk('SV-11466')} and {prd(64)}: the expected result was written to the new scroll bar size on 19 Oct, the day the test was made.",
 682420: "Title only: \"Design-\" was added to the name on 19 Oct, as for the other design tests. Nothing in the test changed.",
 682421: f"{tk('SV-11422')}: Chris Ward's comment of 19 Oct on it set what the test expects (written 20 Oct). The title carried \"SV-11422 -\" for a few hours on 20 Oct and it was taken off when the test passed.",
 96967: f"PRD changed: {v68} (permission note while dragging). Then the test failed and {tk('SV-11546')} was created for it; its title got \"SV-11546 -\" on 20 Oct.",
 96969: f"PRD changed: {v68} (lead-change message wording). Also: {known}. On 23 Oct the set-up wording was brought to {v74}.",
 96973: f"PRD changed: {v52} (applied 15 Oct, QA lead: follow the requirements), then {v68} (one-click assign, S4-R13). Also: {known}.",
 97007: f"PRD changed: {v54} (applied 16 Oct), then {v68}. Also: {known}.",
 97008: f"PRD changed: {v68} (message names the work order and has Undo). Also: {known1}. On 23 Oct the set-up wording was brought to {v74}.",
 368133: f"{tk('SV-11126')} and {v47}, then {v49} (14 Oct), then {v66} and {v68} (message wording, 19 Oct). Also: {known1}.",
 368135: f"QA lead decision 12 Oct 2026: clicking outside the clear-shifts question is not a cancel; the test was rewritten so it passes without the decision. Then {v68} (19 Oct). Also: {known}.",
 368136: f"PRD changed: {v68} (Board View Unassign and message wording). Also: {known1}.",
 368140: f"PRD changed: {v68} (\"Assign lead technician\" on a work order with no lead; message with Undo). Also: {known}.",
 368144: f"PRD changed: {v54} (applied 16 Oct), then {v66} and {v68} (Unassigned left the dialog; message \"moved to Unassigned\" with Undo). Also: {known1}.",
 368147: f"PRD changed: {v68} (19 Oct). Then the test failed and {tk('SV-11546')} was created for it; its title got \"SV-11546 -\" on 20 Oct.",
 236979: "Changed by Vladimir Tomovic, his own test (set-up and steps, 23 Oct 2026). He recorded no reason in it; we do not change his tests.",
}
rows = []
for m in re.finditer(r'^\| (\d+) \| \[C(\d+)\]\([^)]*\) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|', L23, re.M):
    n, cid, title, auto, last, what, where = m.groups(); cid = int(cid)
    rows.append([cid, title, auto, last, what])
rows.append([236979, 'Owner cannot drag an Invoiced work order to another technician on Board View', '06 Oct 2026', '23 Oct 2026', 'set-up, steps'])
from sys import path; path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as t
out = [["#", "Test case", "Title (today)", "Where it is", "Automated on", "Last changed", "What changed", "Why it changed (ticket, PRD change or decision)"]]
for i, (cid, title, auto, last, what) in enumerate(rows, 1):
    s, c = t.get(f'get_case/{cid}'); title = c['title']
    where = f'=HYPERLINK("https://shopview.testrail.io/index.php?/tests/view/{RUN[cid]}","Run 498, test {RUN[cid]}")' if cid in RUN else ("Fast-follow folder, not in a run" if c['section_id'] == 87347 else "Not in run 498")
    assert cid in WHY, cid
    w = WHY[cid]; w = w[0].upper() + w[1:]
    out.append([i, f'=HYPERLINK("https://shopview.testrail.io/index.php?/cases/view/{cid}","C{cid}")', title, where, auto, last, what, w])
json.dump(out, open('sheet-rows.json', 'w'), ensure_ascii=False)
print(len(out) - 1, 'rows'); print(json.dumps(out[:3], ensure_ascii=False)[:1500])
