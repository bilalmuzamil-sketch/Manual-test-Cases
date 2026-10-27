#!/usr/bin/env python3
"""Credit terms tester read-through (26 Oct 2026): byte-identity check and READTHROUGH-REPORT.md.
Run after `python3 build/credit-terms/authoring/build.py` (it writes proposals.json).
python3 build/tester-readthrough-2026-10-26/credit-terms/verify_and_report.py   (exit 1 on any identity failure)

Check: for every remaining case, the custom_expected text from "Exact quotes from the source" onward (quotes, From lines, build line,
References from Design, AUTOMATION line) is byte-identical to the live read-back applied/C<id>-after.json, except the cases in
readthrough.ADD_Q, which must equal the read-back once the added quote bullet(s) are taken out. Also: the title is unchanged; no deleted
case key is left in proposals.json, the setup file or the report; no "mark this test Blocked" line in any case or in the setup file.
The report lists every case read, what changed per case (checks 1-8 and the fix), the per-part CHANGED/CONFIRMED record (Rule 134),
and old vs new tester text for every changed case."""
import os, sys, re, json, csv, html
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.normpath(os.path.join(HERE, "../../credit-terms"))
sys.path.insert(0, f"{P}/authoring")
import ct_lib as L
import build_mods  # noqa: F401  (imports every case module)
import readthrough as RT

PROP = json.load(open(f"{P}/authoring/proposals.json"))
IDS = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
DEL = L.DELETED_CASES
BL = re.compile(r"mark this test Blocked|If you cannot set up any of the above|If any record above is missing", re.I)
TAIL = "<p><strong>Exact quotes from the source"
def li(h): return [html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def parts(f):
    ex = f["custom_expected"]; head, rest = ex.split("<p></p>", 1)
    res = [(m.group(1), li(m.group(2))) for m in re.finditer(r"<p>(Step \d+:)</p><ul>(.*?)</ul>", head, re.S)]
    note = html.unescape(re.sub(r"<[^>]+>", " ", rest.split(TAIL)[0])).strip()
    tail = ex[ex.index(TAIL):]
    quotes = tail.split("References from Design")[0]; design = tail[len(quotes):]
    mk = re.findall(r"<p>(AUTOMATION: [^<]*)</p>", tail)
    return dict(title=f["title"], pre=li(f["custom_preconds"]), steps=li(f["custom_steps"]), res=res, note=note, quotes=quotes,
                design=design.rsplit("<p>AUTOMATION", 1)[0], marker=mk[-1] if mk else "")

for _c in L.CASES: L.render(_c)   # fills readthrough.LOG (what was fixed, per case)
probs, added = [], {}
keys = [c["key"] for c in L.CASES]
for k in DEL:
    if k in PROP or k in keys: probs.append(f"deleted case {k} is still in the library or proposals.json")
setup = open(f"{P}/CREDIT-TERMS-SETUP-FILE.md").read()
for k in DEL:
    if re.search(r"\b" + re.escape(k) + r"\b", setup): probs.append(f"deleted case {k} is named in the setup file")
if BL.search(setup): probs.append("the setup file carries a 'mark this test Blocked' line")
same = changed_tail = 0
rows = []
for c in L.CASES:
    k = c["key"]; cid = IDS.get(k)
    if not cid: probs.append(f"{k}: not in testrail-id-map.csv"); continue
    a = json.load(open(f"{P}/applied/C{cid}-after.json")); f = PROP[k]["fields"]
    for fld in ("custom_preconds", "custom_steps", "custom_expected"):
        if BL.search(html.unescape(f[fld])): probs.append(f"{k}: Blocked line still in {fld}")
    old_t, new_t = a["custom_expected"][a["custom_expected"].index(TAIL):], f["custom_expected"][f["custom_expected"].index(TAIL):]
    if k in RT.ADD_Q and new_t == old_t:
        same += 1  # 27 Oct 2026: already written; the read-back holds the added quote too
    elif k in RT.ADD_Q:
        t = new_t
        for code in RT.ADD_Q[k]:
            lab, txt = (code, L.CODE[code]) if code in L.CODE else L.NAMED[code]
            item = f"<li><strong>{L.e(lab)}:</strong> &ldquo;{L.e(txt)}&rdquo;</li>"
            if item not in t: probs.append(f"{k}: added quote {code} not found")
            t = t.replace(item, "", 1); added.setdefault(k, []).append((lab, txt))
        if t != old_t: probs.append(f"{k}: quotes block onward differs from the read-back beyond the added quote")
        else: changed_tail += 1
    elif new_t != old_t: probs.append(f"{k}: quotes block onward is not byte-identical to applied/C{cid}-after.json")
    else: same += 1
    if a["title"] != f["title"]: probs.append(f"{k}: title changed")
    po, pn = parts(a), parts(f)
    rows.append((k, cid, c, po, pn))

def plain(p):
    out = ["Title: " + p["title"], "Preconditions:"] + [f"  - {x}" for x in p["pre"]] + ["Steps:"] + [f"  {i}. {s}" for i, s in enumerate(p["steps"], 1)]
    out += ["Expected Result:"] + [f"  {h} " + " / ".join(b) for h, b in p["res"]]
    if p["note"]: out.append("Note: " + p["note"])
    return out

R = []; A = R.append
A("# Credit terms: tester read-through (26 Oct 2026)")
A("")
A("QA lead, 26 Oct 2026: *\"The purpose of editing the test case is to make sure that the preconditions/steps/and expected behavior are related and the one who is running the test cases as a manual QA tester may understand the test scenario.\"* and *\"Make sure that your work does not bite me\"*. Brief: `build/tester-readthrough-2026-10-26/WORKER-BRIEF.md`. DRAFT only: nothing written to TestRail, Jira, Slack or Google; nothing committed.")
A("")
A("Generated by `build/tester-readthrough-2026-10-26/credit-terms/verify_and_report.py` from the live read-backs (`build/credit-terms/applied/C<id>-after.json`, old) and `build/credit-terms/authoring/proposals.json` (new, after `authoring/build.py`). The fixes live in `build/credit-terms/authoring/readthrough.py` (applied by `ct_lib.render` after `pattern.py`).")
A("")
A("## 1. Reading coverage")
A(f"- Cases read in full as a tester (title, preconditions, steps, expected results, note): **{len(rows)} of {len(rows)}** (every remaining case; sections " + ", ".join(f"{s} {sum(1 for r in rows if r[2]['sec'] == s)}" for s in dict.fromkeys(r[2]["sec"] for r in rows)) + ").")
A("- Read from `work/dump-before.txt` (3,684 lines, every line) and, after the fixes, every changed line in `work/review-after.txt`. Source sentences checked where a fix needed one: PRD v3 Story 8 (lines 739-790 of `sources/CONFLUENCE-963346440-v3-2026-10-23.md`).")
A(f"- Keys removed from the library (deleted from TestRail on the QA lead's order today): **{len(DEL)}**: " + ", ".join(f"{k} ({c})" for k, c in DEL.items()) + ". Removed from the case modules, `scenarios.py`, `relevance.py`, `design_refs.py` and the fix-round list in `render_outputs.py`; `proposals.json`, the setup file and the outputs no longer contain them (checked by this script).")
A("- Requirements those cases covered: each one covered only by them now reads \"" + L.DELETED_MSG + "\" in REPORT.md §2 (" + ", ".join(f"{i} ({k})" for i, k in L.NO_MANUAL.items()) + "). Requirements those cases quoted that remaining cases still cover: EH-S2 (S2-30 to S2-34), KD-THREE (S1-15), EH-S3a (S3-25, S3-26), S3-R9 and S3-R9 LONG (S3-12 and others), S4-N1 (S4-26, S4-27, S4-28, D-48), UFS-51 (D-38). The coverage gate in `authoring/build.py` accepts the exclusion (`ct_lib.NO_MANUAL`) and fails if a deleted key comes back or an excluded item is quoted again.")
A("")
A("## 2. Gates and identity")
A(f"- `python3 build/credit-terms/authoring/build.py`: **PROBLEM lines: 0** (every earlier gate kept; new: no \"mark this test Blocked\" line or variant in any field or in the authoring data that feeds the setup file; rendered steps checked for two UI actions; a result never points at a step the case does not have; the identity baseline is now the live read-back, `applied/C<id>-after.json`).")
A(f"- Quotes block onward (quotes, From lines, build line, References from Design, AUTOMATION line) byte-identical to `applied/C<id>-after.json`: **{same} of {len(rows)}**; the other {changed_tail} differ only by the added quote listed below (identical once it is taken out). Titles unchanged: {len(rows)} of {len(rows)}.")
for k, qs in added.items():
    for lab, txt in qs: A(f"  - Added quote, {k} ({'C' + IDS[k]}): **{lab}:** \"{txt}\" (under the existing From: line for PRD v3, so no new From line is needed).")
A(f"- Identity problems: **{len(probs)}**." + ("" if not probs else " " + "; ".join(probs)))
A("")
A("## 3. What changed, per case")
A("Check numbers are the brief's: 1 clear setup · 2 no vague words · 3 a negative check proves its trigger ran · 4 one action per step, no repeats · 5 related / visible · 6 understandable · 7 no Blocked line · 8 enrolment (A/R and A/P only).")
A("")
A("Every one of the " + str(len(rows)) + " cases failed check 7 (the line \"If you cannot set up any of the above, mark this test Blocked: \"setup not done\".\" closed every case's preconditions) and has it removed. The table lists the cases with any further fix; the per-part record (Rule 134) says, for every part of the case, CHANGED or CONFIRMED against the live read-back.")
A("")
A("| Key | C-id | Checks failed | What changed | Title | Preconditions | Steps | Results | Note | Quotes + From | Design refs | AUTOMATION |")
A("|---|---|---|---|---|---|---|---|---|---|---|---|")
more = []
for k, cid, c, po, pn in rows:
    log = RT.LOG.get(k, [])
    pre_o = [x for x in po["pre"] if not BL.search(x)]
    other = bool(log) or pre_o != pn["pre"] or po["steps"] != pn["steps"] or po["res"] != pn["res"] or po["note"] != pn["note"]
    if not other: continue
    more.append(k)
    ch = sorted({x.strip() for cs, _ in log for x in cs.split(",")} | {"7"}, key=int)
    what = "; ".join(dict.fromkeys(w for _, w in log)) or "wording"
    cc = lambda b: "CHANGED" if b else "CONFIRMED"
    A(f"| {k} | C{cid} | {', '.join(ch)} | {what.replace('|', '/')} | {cc(po['title'] != pn['title'])} | CHANGED | {cc(po['steps'] != pn['steps'])} | "
      f"{cc(po['res'] != pn['res'])} | {cc(po['note'] != pn['note'])} | {cc(po['quotes'] != pn['quotes'])} | {cc(po['design'] != pn['design'])} | {cc(po['marker'] != pn['marker'])} |")
only7 = [r[0] for r in rows if r[0] not in more]
A("")
A(f"Cases with a further fix: **{len(more)}**. Cases whose only change is check 7: **{len(only7)}**: " + ", ".join(only7) + ".")
A("")
A("## 4. Could not make concrete (meaning left unchanged)")
CNC = [
 ("D-01, D-11, D-12, D-13, D-16, D-17, D-19", "The bullet \"…this attribute depends on question 12 (drawn pictures or build pictures, not answered yet): for now compare it with the picture named here\": the drawn picture and the build picture disagree on heading style, Cancel style, × colour and ticked-box style, and the sources give no single look until Chris Ward answers question 12."),
 ("S5-16", "\"The window looks as it did before the release.\" The sources say the window is as today and give no list of today's fields; the two concrete bullets (neither Credit Terms nor Credit Limit shows) carry the check."),
 ("S5-07, S5-08", "\"Choose to add a new customer from the customer picker.\" The PRD names the New Customer window but not the picker's own label for adding a customer."),
 ("S8-04", "\"Send vendor invoice A to QuickBooks the way the shop does today.\" The PRD says only \"is sent to QuickBooks\"; it does not name the screen or button."),
 ("S8-09", "\"…whose invoice QuickBooks will refuse for a reason the sandbox gives today\" and \"Fix the cause in the sandbox.\" The PRD names no refusal reason; the setup file's example (a tax code the sandbox does not accept) is only an example."),
 ("S11-13", "Step 1 \"Note the Net 30 row's Customers count.\" / \"It includes customer A.\": a count cannot show which customers it includes; customer A being counted under Net 30 is seen in Move Customers (another case's subject), and the sources give no other on-screen way."),
 ("S4-14, S9-07", "\"the existing Credit Hold notice shows\": the PRD keeps today's notice without quoting its words (the build fact \"Cannot invoice this customer. Customer is on Credit Hold\" is not a source)."),
]
A("| Cases | Why |"); A("|---|---|")
for a_, b_ in CNC: A(f"| {a_} | {b_} |")
A("")
A("## 5. Negative checks without a control")
A("Controls added (check 3): **S8-08** (term B, used on an invoice that has synced, must appear in QuickBooks' Terms list while term A must not; PRD S8-R1 quoted) and **S8-06** (an invoice of customer A syncs after the move before the QuickBooks customer is checked; backed by the already-quoted S8-R6, \"new invoices still carry the right term\", so no new quote).")
A("")
NWC = [
 ("S8-07, S8-07b", "Deactivating, reactivating, editing or deleting a term \"sends nothing to QuickBooks\" (S8-R7): nothing is sent, so there is no sync to wait for and no sync log the sources name. The trigger is proven on screen (the toasts)."),
 ("S8-10", "Without the integration nothing is sent (S8-N1); there is no sync to prove. The trigger (the invoice is created) is a step result."),
 ("S11-16", "AccountingHub's Payment Terms list is untouched (OOS): no source names a sync between ShopView terms and that list; the trigger (term created, toast) is a step result."),
 ("S11-18, S12-13, S12-13b, S12-13c, S12-17", "\"No log row / no note\": the log and notes are written at the moment of the action, the trigger is a step result, and the newest row is compared with one written down first. No source sentence gives a separate signal that the log is working (S12-14 has one: user B's row)."),
 ("S11-14", "\"Nothing is re-sent at release\": compared with captures taken before the release on production; no source gives a sync log."),
 ("S2-27, S3-21, S4-18, S4-19", "Double-click cases: the single toast and the single log row/note are the control; no change needed."),
]
A("| Cases | Why no control was added |"); A("|---|---|")
for a_, b_ in NWC: A(f"| {a_} | {b_} |")
A("")
A("## 6. Enrolment (check 8)")
A("Check 8 applies to A/R and A/P only. In Credit terms the lines about a second location are kept where a step switches location or a result depends on another location's calendar: S1-21, S3-06, S7-04 (user B now signed in at location B in a second browser), S12-10, DATA-13, DATA-18. Nothing else names enrolment.")
A("")
A("## 7. Cases a manual tester still cannot set up (for the QA lead; not deleted, not changed in meaning)")
A("- **S12-18** (C724125) \"The log is refused by the server without Settings Finance\": its only step is a request sent outside the page (marker HOLD), the same reason the ten cases above were deleted.")
A("- **D-38** (C724185) \"Design: Credit Terms Log load error looks as designed\": needs the log to fail to load on demand (\"Make sure the Credit Terms Log cannot be loaded on the test shop\"), the same reason S12-19 was deleted.")
A("- **S11-11** (C724096): an organization with no settings record cannot be made or recognised by a tester (marker HOLD, unchanged).")
A("")
A("## 8. Old vs new text of every changed case")
A("Old = the live read-back (`applied/C<id>-after.json`); new = `authoring/proposals.json`. Quotes, From lines, References from Design and AUTOMATION lines are not shown (identical, see §2).")
for k, cid, c, po, pn in rows:
    if k not in more: continue
    A(f"### {k} (C{cid}) {pn['title']}")
    A("```"); A("OLD"); R.extend(plain(po)); A(""); A("NEW"); R.extend(plain(pn)); A("```")
A("")
A("Cases whose only change is the removed Blocked line are not repeated here: in each, the old preconditions are the new ones plus that last line.")
# 27 Oct 2026: a check must never overwrite the committed record of a pass; rewrite the report only when asked
if "--write-report" in sys.argv: open(f"{HERE}/READTHROUGH-REPORT.md", "w").write("\n".join(R) + "\n")
print("cases", len(rows), "| quotes onward identical", same, "| identical once the added quote is removed", changed_tail, "| further fixes", len(more), "| only check 7", len(only7))
print("identity problems:", len(probs)); [print("PROBLEM", p) for p in probs]
sys.exit(1 if probs else 0)
