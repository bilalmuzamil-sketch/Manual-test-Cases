"""2 Nov 2026 — rows for the QA lead: every Automated WO Board / Tech View test whose text today differs from the day it was
marked Automated (auto_net.json, read live from TestRail history after the 2 Nov update pass), with WHY.
Reasons: the 26 Oct sheet's rows (automated-changed-why-2026-10-26/sheet-rows.json) + the 2 Nov edit log
(update-pass-2026-11-02/edits-parked/summary.json, edits-markers/) + ticket statuses read live 2 Nov."""
import json, re, datetime as dt
B = '../update-pass-2026-11-02/'
net = json.load(open(B + 'auto_net.json'))
RUN = {int(k): v[0] for k, v in json.load(open('run498-tests-live.json')).items()}  # get_tests/498, read live 2 Nov
old = {re.search(r'C(\d+)"\)', r[1]).group(1): r for r in json.load(open('../automated-changed-why-2026-10-26/sheet-rows.json'))[1:]}
S = json.load(open('tickets-live-1102.json'))  # every key in the reasons, status read live 2 Nov
fix = lambda t: re.sub(r'browse/(SV-\d+), ([^)]*?) today\)', lambda m: f'browse/{m.group(1)}, {S[m.group(1)]} today)', t)
tk = lambda k: f"ticket {k} (https://shopview.atlassian.net/browse/{k}, {S[k]} today)"
d = lambda t: dt.datetime.utcfromtimestamp(t).strftime('%d %b %Y')
base = (f"2 Nov 2026: {tk('SV-11524')} is on production and the test passed there, so its \"Known problem\" note was removed, "
        "the expect-fail marker became READY, the production check date was added and a line says it was re-read against PRD version 82 "
        "(the expected behaviour itself is unchanged).")
extra = {
 96969: " The set-up's old QA-site line was replaced.", 96973: " The set-up's old QA-site line was replaced.",
 368140: " The set-up's old QA-site line was replaced.",
 368136: " The set-up's old QA-site line and an out-of-date \"What you should see today\" paragraph were removed.",
 97008: " The set-up's old QA-site line was replaced, and step 5 now drops the card below Delta Co so the later move is a real reorder.",
 368144: " Step 8 now says how to clear the lead on the work order page (Unassigned is the first entry of the list).",
 97007: "", 368133: "", 368135: "",
}
today = {368145: "2 Nov 2026: it had passed on production on 22 Oct, so the \"not available on build\" marker became READY and the production check date was added (expected result field only; the expected behaviour itself is unchanged)."}
for k, v in extra.items(): today[k] = base + v
new = {
 96953: f"26 Oct 2026: {tk('SV-11720')} passed on its QA site, so the ticket number was taken off the title. 28 Oct 2026: {tk('SV-11835')} (minimap back, sideways scroll bar removed, PRD version 80) changed the set-up and the expected result.",
 707079: f"26 Oct 2026: {tk('SV-11627')} passed on its QA site, so the ticket number was taken off the title.",
}
rows = [["#", "Test case", "Title (today)", "Where it is", "Automated on", "Last changed", "What changed", "Why it changed (ticket, PRD change or decision)"]]
order = sorted(net, key=lambda e: (e['id'] not in today, -e['last_change']))
for i, e in enumerate(order, 1):
    cid = e['id']; fields = sorted({c['field'] for c in e['changes_after']}, key=['title', 'set-up', 'steps', 'expected result'].index)
    who = sorted({c['who'] for c in e['changes_after']})
    if cid in today:
        why = (old[str(cid)][7] + ' Then ' + today[cid]) if str(cid) in old else today[cid]
    elif str(cid) in old: why = old[str(cid)][7]
    elif cid in new: why = new[cid]
    elif e['by'] == 1:
        parts = sorted({(d(c['when']), c['who']) for c in e['changes_after']})
        why = "Changed by " + "; ".join(f"{w} on {t}" for t, w in parts) + " (set-up" + (", title" if 'title' in fields else "") + "). It is Vladimir Tomovic's own test; no reason is recorded in it, and we do not change his tests."
    else: raise SystemExit(f'no reason for C{cid}')
    t = RUN.get(cid)
    where = f'=HYPERLINK("https://shopview.testrail.io/index.php?/tests/view/{t}","Run 498, test {t}")' if t else "Not in run 498 (Vladimir Tomovic's test)"
    why = fix(why)
    if re.search(r'title got "SV-\d+ -"', why) and not re.match(r'SV-\d+ ', e['title']): why += f" The ticket number came off the title again when the test passed (last change {d(e['last_change'])})."
    rows.append([i, f'=HYPERLINK("https://shopview.testrail.io/index.php?/cases/view/{cid}","C{cid}")', e['title'], where,
                 "'" + d(e['automated_on']), "'" + d(e['last_change']), ", ".join(fields), why])
json.dump(rows, open('sheet-rows.json', 'w'), indent=0, ensure_ascii=False)
md = ["# Automated tests changed after they were automated — Work Orders Board View & Tech View (2 Nov 2026)", "",
      f"{len(rows)-1} Automated tests have different text today than on the day they were marked Automated (read live from TestRail's change history after the 2 Nov update pass). Rows 1–{len(today)} were changed on 2 Nov 2026.", "",
      "| # | Test case | Title | Where | Automated on | Last changed | What changed | Why |", "|---|---|---|---|---|---|---|---|"]
for r in rows[1:]:
    c = re.search(r'C\d+', r[1]).group(0); w = re.search(r'tests/view/(\d+)","([^"]+)', r[3])
    md.append(f"| {r[0]} | [{c}](https://shopview.testrail.io/index.php?/cases/view/{c[1:]}) | {r[2]} | " + (f"[{w.group(2)}](https://shopview.testrail.io/index.php?/tests/view/{w.group(1)})" if w else r[3]) + f" | {r[4][1:]} | {r[5][1:]} | {r[6]} | {r[7].replace('|','/')} |")
open('../AUTOMATED-TESTS-CHANGED-2026-11-02.md', 'w').write("\n".join(md) + "\n")
print(len(rows) - 1, 'rows;', len(today), 'changed 2 Nov:', [f'C{e["id"]}' for e in order[:len(today)]])
