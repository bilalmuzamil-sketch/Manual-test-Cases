#!/usr/bin/env python3
"""Runnability fixes to the live Maintenance Reminders cases (QA lead go-ahead 2026-10-06: "Fix them").
Touches ONLY preconditions, steps and the plain 'Expected results' block. The Source line, the verbatim quotes and the
AUTOMATION marker are never changed (asserted). Run from the repo root.
  python3 fix_runnability.py <live.json>            dry run: prints every change
  python3 fix_runnability.py <live.json> --apply    write, snapshot before/after, read back"""
import sys, json, re, os, datetime as dt
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
HERE = "build/maintenance-reminder-v2/runnability-fix-2026-10-06"
L = json.load(open(sys.argv[1])); APPLY = "--apply" in sys.argv
RUN = dt.date(2026, 10, 6)
MON = {m: i for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}
DRE = re.compile(r"\b(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (20\d\d)\b")
def rel(m):
    d = dt.date(int(m.group(3)), MON[m.group(2)], int(m.group(1))); n = (RUN - d).days; ex = m.group(0)
    if n == 0: return f"today (e.g. {ex})"
    if n == 1: return f"yesterday (e.g. {ex})"
    return f"{n} days before today (e.g. {ex})" if n > 0 else f"{-n} days after today (e.g. {ex})"
OLD_SENT = ("Dates are for a run on 6 Oct 2026. On another day, move every date by the same number of days and seed and "
            "read on the same day, because an estimate and a reading's age both count days up to today.")
NEW_SENT = ("Count every date back from the day you run the case; the date in brackets is only the example for a run on "
            "6 Oct 2026. Seed and read on the same day, because an estimate and a reading's age both count days up to today.")
DATE_CASES = "204124 204125 204126 204127 204128 204131 204180 204181 204182 204183 204184 204185 204186 310720".split()
def relativise_pre(pre):
    pre = pre.replace(OLD_SENT, "@@SENT@@")
    pre = pre.replace("(for example 6 Oct 2021)", "@@FIVE@@")
    pre = DRE.sub(rel, pre)
    return pre.replace("@@SENT@@", NEW_SENT).replace("@@FIVE@@", "(for example 6 Oct 2021)")
SEED_NOTE = ("<li>If Mark complete does not record a seeded reading (the Mileage or Engine Hours card does not show that "
             "value and date afterwards), stop: mark this case Blocked and write \"seeding failed: Mark complete did not "
             "record the reading\" in the result comment. That is a separate problem with its own case, not a failure of "
             "this one.</li>")
NOTE = "it does not change pass or fail"
WORDING = 'write down the words you see; do not pass or fail on the wording'
# exact text edits: case -> list of (field, old, new); field in pre/steps/plain
E = {
 "146310": [("plain", "(record the build's wording)", f"({WORDING})")],
 "146316": [("plain", "(record the build's wording)", f"({WORDING})")],
 "146320": [("plain", "; record the build's wording.", f". Write down the words you see; do not pass or fail on the wording.")],
 "146363": [("plain", 'record the build\'s heading)', 'write down the heading you see; do not pass or fail on it)')],
 "146366": [("plain", "; record the build's wording.)", f"; {WORDING}.)")],
 "146374": [("plain", "(a design-only shortcut; record whether the build has it)",
             '(a design-only shortcut the description does not ask for: write down whether you see it; do not pass or fail on it)'),
            ("plain", "; record the build's wording)", f"; {WORDING})")],
 "204141": [("plain", "— record the wording you see)", "— write down the wording you see; do not pass or fail on the wording)")],
 "204124": [("pre", "@@CHECK@@", None)],
 "204150": [("pre", "For the last step: a test organization with no maintenance schedule, and one with a single workplace (location), if available.",
             "Steps 4 and 5 need two more test organizations you can sign in to: one whose Settings > Maintenance lists no "
             "schedule (a newly created test organization has none) and one with a single location. Ask the QA lead for "
             "these logins before you start. Without them, run steps 1 to 3, mark the case Blocked and write \"no "
             "organization without schedules / with one location\" in the result comment.")],
 "310709": [("pre", "Pick an existing unit, not created for this test, whose Work Orders tab shows at least two invoiced work orders with Mileage in the last 24 months, at least 7 days apart and increasing.",
             "Find an existing unit that was not created for this test: open Customers, open a customer with older work, "
             "open its Assets tab and pick a unit whose Work Orders tab shows at least two invoiced work orders from "
             "before the release, with Mileage filled in, invoiced in the last 24 months, at least 7 days apart and "
             "with the Mileage going up. If no unit in the organization qualifies, mark the case Blocked and write \"no "
             "unit with two invoiced work orders from before release\" in the result comment."),
            ("plain", "If the organization has imported history, its readings appear in the same way.",
             "Only where the organization has a unit with history brought in by a data import: its readings appear in "
             "the same way. Where there is no such unit, this line is not judged.")],
 "310715": [("plain", "(The tech plan puts Undo complete for this kind of row only on the asset's Maintenance tab: if it is missing on the card, use the asset tab and report the difference.)",
             "(If the card's menu has no Undo complete, the case fails at this step; to carry on with the next steps, use "
             "Undo complete from the asset's Maintenance tab.)")],
 "204102": [("plain", "if no screen shows that name, record this part as not checked by hand.",
             f'if no screen shows that name, write "author not shown" in the result comment; {NOTE}.')],
 "204126": [("plain", "so they cannot be entered by hand: record that part as not checked by hand.",
             f'so they cannot be entered by hand: write "future-dated readings not checked by hand" in the result comment; {NOTE}.')],
}
CHECK_OLD = ("If the organization holds a unit with imported history (from a data import) and work order readings, open it "
             "and check both kinds appear in its Measured from N visits; if none exists, record that part as not checked by hand.")
CHECK_NEW = ("Optional, only where the organization already has a unit with history brought in by a data import as well as "
             "work order readings: open it and check both kinds count in its Measured from N visits. If there is no such "
             f'unit, write "imported history not checked" in the result comment; {NOTE}.')
AUDIT_CASES = "146372 146376 146377 146378 146379 146380 146381 204106 204154 204179".split()
AUDIT_ADD = f' Pass or fail on what you can see, and write "audit not checked by hand" in the result comment.'
SEED_CASES = ("146352 146355 146357 146364 146385 146386 310727 204180 204125 204124 204126 204127 204181 204182 204183 "
              "204184 204185 204186 204128 204131 310720").split()
def split_exp(e):
    i = e.find("<p><strong>Source")
    assert i > 0, "no Source block"
    return e[:i], e[i:]
def edit(cid, c):
    pre, steps = c["pre"], c["steps"]; plain, tail = split_exp(c["exp"]); log = []
    def sub(field, old, new):
        nonlocal pre, steps, plain
        cur = {"pre": pre, "steps": steps, "plain": plain}[field]
        if old == "@@CHECK@@": old, new = CHECK_OLD, CHECK_NEW
        hit = cur.count(old); where = field
        if hit == 0 and field == "pre":  # some sentences sit in steps
            hit = steps.count(old); where = "steps" if hit else field
        assert hit == 1, f"C{cid}: '{old[:60]}' found {hit}x in {field}"
        if where == "pre": pre = pre.replace(old, new)
        elif where == "steps": steps = steps.replace(old, new)
        else: plain = plain.replace(old, new)
        log.append(f"{where}: {old[:70]}… -> {new[:70]}…")
    for f, o, n in E.get(cid, []): sub(f, o, n)
    if cid in AUDIT_CASES:
        n0 = plain
        plain = re.sub(r"(cannot be checked by hand(?: in v1)?[^.<]*\.)(?! Pass or fail)",
                       lambda m: m.group(1) + AUDIT_ADD, plain, count=1)
        plain = plain.replace("record this part as not checked by hand.",
                              f'write "audit not checked by hand" in the result comment; {NOTE}.')
        assert plain != n0, f"C{cid}: audit sentence not found"; log.append("plain: audit note made explicit")
    if cid in DATE_CASES:
        p0 = pre; pre = relativise_pre(pre); assert pre != p0, f"C{cid}: no date change"
        assert "Dates are for a run" not in pre; log.append(f"pre: {len(DRE.findall(p0))} fixed dates -> relative")
    if cid == "204180":
        steps = steps.replace("about 147 days after the last reading (6 Oct 2026), which falls at the very start of March 2027 (1 to 2 Mar)",
                              "about 147 days after the last reading, which is today, so PM-M falls due in the month that holds the day 147 days from today (for a run on 6 Oct 2026: the very start of March 2027, 1 to 2 Mar)")
        plain = plain.replace("PM-M is due in March (Mar 2027 for a run on 6 Oct 2026), from the mileage estimate.",
                              "PM-M is due in the month that holds the day about 147 days from today (Mar 2027 for a run on 6 Oct 2026), from the mileage estimate.")
        plain = plain.replace("and PM-M would fall due in April.", "and PM-M would fall due about 180 days from today instead (14,300 ÷ 79.5), a month later (April for a run on 6 Oct 2026).")
        assert "147 days from today" in steps and plain.count("days from today") == 2; log.append("steps+plain: due month made relative")
    if cid == "204185":
        o = "(due Oct 2027 for a run on 6 Oct 2026)"; assert plain.count(o) == 1
        plain = plain.replace(o, "(due one year from today, because PM-M was last done today: Oct 2027 for a run on 6 Oct 2026)")
        log.append("plain: calendar due made relative")
    if cid == "204186":
        o = ("551 = 345 days before today (e.g. 26 Oct 2025) (End 20 days after today (e.g. 26 Oct 2026), inside the month before expiry); "
             "552 = 365 days before today (e.g. 6 Oct 2025) (End today); 553 = 366 days before today (e.g. 5 Oct 2025) "
             "(End yesterday); 554 = 284 days before today (e.g. 26 Dec 2025) (End 81 days after today (e.g. 26 Dec 2026), more than a month away).")
        assert pre.count(o) == 1, "C204186 compliance line"
        pre = pre.replace(o, "551 = one year before the day 20 days from today (e.g. 26 Oct 2025), so End is 20 days from today "
            "(e.g. 26 Oct 2026), inside the month before expiry; 552 = one year ago today (e.g. 6 Oct 2025), so End is today; "
            "553 = one year ago yesterday (e.g. 5 Oct 2025), so End was yesterday; 554 = one year before the day 81 days from "
            "today (e.g. 26 Dec 2025), so End is 81 days from today (e.g. 26 Dec 2026), more than a month away.")
        for o2, n2 in (("= 50 days after the last reading (1 Oct 2026) = 20 Nov 2026. The calendar candidate is 6 Oct 2027.",
                        "= 50 days after the last reading (5 days ago) = 45 days from today (20 Nov 2026 for a run on 6 Oct 2026). The calendar candidate is one year from today (6 Oct 2027 for a run on 6 Oct 2026)."),):
            assert steps.count(o2) == 1, "C204186 steps"; steps = steps.replace(o2, n2)
        for o2, n2 in (("shows Nov 2026 from the mileage estimate", "shows the month 45 days from today (Nov 2026 for a run on 6 Oct 2026) from the mileage estimate"),
                       ("the calendar candidate (Oct 2027)", "the calendar candidate (the month one year from today: Oct 2027 for a run on 6 Oct 2026)"),
                       ("CVIP is due on 26 Oct 2026, its End date,", "CVIP is due on its End date, 20 days from today (26 Oct 2026 for a run on 6 Oct 2026),"),
                       ("(End 5 Oct 2026)", "(End yesterday)"),
                       ("CVIP shows its End date, 26 Dec 2026, with no due badge yet.", "CVIP shows its End date, 81 days from today (26 Dec 2026 for a run on 6 Oct 2026), with no due badge yet.")):
            assert plain.count(o2) == 1, f"C204186 plain: {o2}"; plain = plain.replace(o2, n2)
        log.append("pre+steps+plain: certificate and due dates made relative")
    if cid in SEED_CASES:
        assert pre.rstrip().endswith("</ol>"), f"C{cid}: preconditions not a list"
        pre = pre.rstrip()[:-5] + SEED_NOTE + "</ol>"; log.append("pre: seeding-failed note added")
    exp = plain + tail
    assert tail == split_exp(c["exp"])[1], "Source/quotes/marker changed"
    assert exp.count("AUTOMATION:") == 1
    return {"custom_preconds": pre, "custom_steps": steps, "custom_expected": exp}, log
targets = sorted(set(E) | set(AUDIT_CASES) | set(DATE_CASES) | set(SEED_CASES), key=int)
plans = {}
for cid in targets:
    payload, log = edit(cid, L[cid]); ch = {k: v for k, v in payload.items() if v != {"custom_preconds": L[cid]["pre"], "custom_steps": L[cid]["steps"], "custom_expected": L[cid]["exp"]}[k]}
    plans[cid] = ch; print(f"C{cid} ({L[cid]['chunk']}) {L[cid]['title'][:60]} :: " + " | ".join(log))
print(f"\n{len(plans)} cases to update")
if APPLY:
    os.makedirs(f"{HERE}/snapshots", exist_ok=True); res = []
    for cid, ch in plans.items():
        c = api(f"get_case/{cid}"); assert c.get("custom_atmstatus") != 3, f"C{cid} Automated - stop (Rule 71)"
        assert c["updated_by"] == 3, f"C{cid} edited by someone else since the fetch - stop"
        assert (c.get("custom_preconds") or "") == L[cid]["pre"] and (c.get("custom_expected") or "") == L[cid]["exp"], f"C{cid} changed since fetch"
        json.dump(c, open(f"{HERE}/snapshots/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", ch); a = api(f"get_case/{cid}")
        json.dump(a, open(f"{HERE}/snapshots/C{cid}-after.json", "w"), indent=1)
        ok = all((a.get(k) or "") == v for k, v in ch.items()); res.append({"case": f"C{cid}", "fields": sorted(ch), "verified": ok})
        print(f"[{'OK' if ok else 'MISMATCH'}] C{cid}")
    json.dump(res, open(f"{HERE}/apply-log.json", "w"), indent=1)
    print("verified", sum(r["verified"] for r in res), "of", len(res))
