"""Part B - the four proven gaps. 4 add_case, each re-GET and byte-verified."""
import sys, json
sys.path.insert(0, '/tmp/testrail')
import tr

BASE = dict(template_id=1, type_id=6, priority_id=2,
            custom_atmstatus=1, custom_automation_type=0)

NEW = []

# ---------- ROW 3b : S10-R2 last-write-wins ----------
NEW.append(dict(
    internal="FLT-PERS-07", section_id=4121,
    title="When two devices set different filters, the last one saved wins",
    refs="SV-8795 (S10-R2 (where two devices write different state, last write wins); S10-R1) [spec v19 2026-08-06]",
    preconds=(
        "1. You are signed in to the ShopView App as the same person on TWO separate browsers at the "
        "same time (for example one normal window and one private window, or two different "
        "computers). Call them Browser A and Browser B.\n"
        "2. Both are on the Work Orders page.\n"
        "3. Work orders exist in at least two different statuses, and for at least two different "
        "customers."),
    steps=(
        "1. In Browser A, set the Status filter to Approved. Wait a few seconds.\n"
        "2. In Browser B, set the Status filter to Estimate instead, and clear Approved. Wait a few "
        "seconds.\n"
        "3. In Browser A, reload the Work Orders page.\n"
        "4. Look at the chips and the table in Browser A.\n"
        "5. Now in Browser A set a Customer filter as well. Wait a few seconds.\n"
        "6. In Browser B, reload the Work Orders page and look at the chips and the table."),
    expected=(
        "1. After the reload in step 3, Browser A shows the filter that was saved MOST RECENTLY - the "
        "Estimate choice made in Browser B - not the Approved choice it had set itself. The newer "
        "save wins.\n"
        "2. The table in Browser A matches those newer filters.\n"
        "3. After the reload in step 6, Browser B likewise shows the newest saved state, including "
        "the Customer filter that Browser A added in step 5.\n"
        "4. Nothing is merged and nothing is duplicated: whichever browser saved last is the one "
        "whose filters both browsers end up with.\n"
        "5. No error message appears in either browser at any point.\n\n"
        "Note for the tester: the two browsers do not update each other while you watch. You have to "
        "reload the page to see the saved filters come back. That is expected.\n\n"
        "---\n"
        "This is the expected behaviour as per epic SV-8785, the owning story SV-8795, and the "
        "Filters specification at Confluence version 19 (published 6 August 2026) (S10-R2). This "
        "test has not yet been checked against any build.\n\n"
        "AUTOMATION: READY\n"),
))

# ---------- ROW 4 : S13-R19 the six named toolbars ----------
NEW.append(dict(
    internal="FLT-PSRCH-14", section_id=5410,
    title="On a phone, pages with two or more icon buttons collapse them into one menu",
    refs="SV-8798 (S13-R19 (2+ icon-only toolbar actions collapse into one more kebab on mobile; names Inventory; Purchase Orders; Timesheet Activities; both Technician Efficiency; Sales Tax Collected)) [spec v19 2026-08-06]",
    preconds=(
        "1. You are signed in to the ShopView App on a mobile phone (or a browser window narrowed to "
        "phone size).\n"
        "2. You can reach the Parts area and the Reports area.\n"
        "3. You know what the same pages look like on a desktop screen, so you can tell which small "
        "icon buttons each one has."),
    steps=(
        "1. Open Parts then Inventory. Look at the row of buttons at the top right of the table.\n"
        "2. Open Parts then Purchase Orders. Look at the same row of buttons.\n"
        "3. Open Reports then the Timesheet Activities report. Look at the same row of buttons.\n"
        "4. Open the Technician Efficiency report, look at the button row on its Invoiced tab, then "
        "open its Completed tab and look again.\n"
        "5. Open the Sales Tax report, choose the Collected tab, and look at the button row.\n"
        "6. On each of those pages, tap the 'more' button (usually three dots) and look at what is "
        "inside it.\n"
        "7. For comparison, open a page that has only ONE small icon button in its toolbar and look "
        "at its button row."),
    expected=(
        "1. On each of the pages in steps 1 to 5, the small icon-only buttons are NOT all shown "
        "side by side. They are gathered into a single 'more' button.\n"
        "2. Tapping that 'more' button opens a short menu listing those actions, and each one still "
        "works from there.\n"
        "3. Both view tabs of the Technician Efficiency report behave the same way as each other.\n"
        "4. Nothing is lost: every action that is available on a desktop screen can still be reached "
        "on the phone, either directly or from inside the 'more' menu.\n"
        "5. On the comparison page in step 7, which has only one small icon button, that button is "
        "still shown on its own - a single icon action is not put into a 'more' menu.\n"
        "6. This rule applies to any page carrying two or more small icon buttons, so if you find "
        "another page like that, it should behave the same way. Write down any page that does not.\n\n"
        "---\n"
        "This is the expected behaviour as per epic SV-8785, the owning story SV-8798, and the "
        "Filters specification at Confluence version 19 (published 6 August 2026) (S13-R19). This "
        "test has not yet been checked against any build.\n\n"
        "AUTOMATION: READY\n"),
))

# ---------- ROW 9 : R3 Q5 parity - collapse, shareable link, phone ----------
NEW.append(dict(
    internal="FLT-PARTS-14", section_id=5411,
    title="Parts and Reports filters collapse, share and work on a phone as Work Orders do",
    refs="SV-8785 [epic] (Branko answers 2026-07-31 Round-3 Q5=A - collapse; shareable URL and mobile all match Work Orders; spec v19 §4 Key Decisions - context-specific filter sets on Parts and Reports) [spec v19 2026-08-06]",
    preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. You can also open the same pages on a mobile phone (or a browser window narrowed to "
        "phone size).\n"
        "3. You are on a Parts page that has a filter bar (for example Inventory), and you can also "
        "reach a report that has a filter bar.\n"
        "4. Sample data is present in the Parts area and in the Reports area."),
    steps=(
        "1. On the Parts page, set one filter so the list is narrowed.\n"
        "2. Find the control that collapses the filter bar and use it. Then expand it again.\n"
        "3. Leave the page and come back, and look at whether the bar is collapsed or expanded.\n"
        "4. With a filter set, copy the page's web address, then open it in a fresh browser window.\n"
        "5. Open the same Parts page on a phone and look at how the filter buttons are laid out and "
        "how a filter is applied.\n"
        "6. Repeat steps 1 to 5 on a report that has a filter bar."),
    expected=(
        "1. The filter bar on the Parts page and on the report can be collapsed and expanded, and "
        "the table takes the freed space when it is collapsed - exactly as on the Work Orders page.\n"
        "2. While the bar is collapsed the filters keep working, and the collapsed control shows "
        "that filters are active - exactly as on the Work Orders page.\n"
        "3. Whether you left the bar collapsed or expanded is remembered when you come back to that "
        "page.\n"
        "4. The web address carries the filters you set, and opening that address in a fresh window "
        "loads the page with the same filters already applied and the list already narrowed - "
        "exactly as on the Work Orders page.\n"
        "5. On the phone the filter buttons sit in a row you can scroll sideways, there is no "
        "collapse control, and your choices are applied when you tap the apply button rather than "
        "as you tap each one - exactly as on the Work Orders page.\n"
        "6. Anything that behaves differently from the Work Orders page on any of these points is "
        "worth writing down, with the page name.\n\n"
        "Note for the tester: only some Parts views and only some reports have the new filter bar so "
        "far. If the page you open has no filter bar, mark this test BLOCKED - do not mark it "
        "failed.\n\n"
        "---\n"
        "This is the expected behaviour as per epic SV-8785 and Branko's answer of 31 July 2026 "
        "(Round 3, question 5, option A), recorded in this file: "
        "build/filters/branko-answers-2026-07-31/answers-ingested.md "
        "(https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/build/filters/"
        "branko-answers-2026-07-31/answers-ingested.md). He said that collapsing, the shareable web "
        "address and the phone layout all match the Work Orders page. The Filters specification at "
        "Confluence version 19 has no numbered requirement for this, so there is no requirement "
        "number to quote. This test has not yet been checked against any build.\n\n"
        "AUTOMATION: HOLD - the new filter bar has reached only some Parts views and one report tab, "
        "so most of this cannot be run yet\n"),
))

# ---------- ROW 11 : mobile Imported exclusivity ----------
NEW.append(dict(
    internal="FLT-MOB-11", section_id=4123,
    title="On a phone, picking Imported works alone and disables the other filters",
    refs="SV-8797 (S2-R7 (Imported cannot be combined with anything else; the other filter chips are disabled while it is active and re-enabled when it is deselected); S2-N4; S12-R6 (mobile applies on the Apply filters button)) [spec v19 2026-08-06]",
    preconds=(
        "1. You are signed in to the ShopView App on a mobile phone (or a browser window narrowed to "
        "phone size).\n"
        "2. Imported work orders exist, plus some normal work orders.\n"
        "3. You are on the Work Orders page, All tab, with no filters applied."),
    steps=(
        "1. Tap 'All Filters' to open the filter sheet.\n"
        "2. Expand the Status row and tick Imported.\n"
        "3. Look at the other filter rows in the sheet (Customer, Lead Technician, Service Advisor, "
        "Asset on Site) and try to use one of them.\n"
        "4. Try to tick another status as well as Imported.\n"
        "5. Tap the apply button and look at the list.\n"
        "6. Reopen the sheet, untick Imported, and look at the other filter rows again.\n"
        "7. Tap the apply button and look at the list."),
    expected=(
        "1. While Imported is ticked, the other filters cannot be used - they are greyed out or "
        "otherwise blocked, in the same way as on a desktop screen.\n"
        "2. Imported cannot be combined with another status: it works on its own.\n"
        "3. After you apply, the list shows imported work orders only.\n"
        "4. After unticking Imported, the other filters can be used again.\n"
        "5. After applying again, the normal list comes back.\n"
        "6. The blocking happens as you tap inside the sheet - you do not have to apply first to "
        "see the other filters become unusable.\n\n"
        "---\n"
        "This is the expected behaviour as per epic SV-8785, the owning story SV-8797, and the "
        "Filters specification at Confluence version 19 (published 6 August 2026) (S2-R7, S2-N4, "
        "S12-R6). The specification states this rule without limiting it to one screen size, so it "
        "applies on a phone as well as on a desktop. This test has not yet been checked against any "
        "build.\n\n"
        "AUTOMATION: READY\n"),
))

if __name__ == "__main__":
    log = []
    for n in NEW:
        assert len(n["title"]) <= 80, (n["internal"], len(n["title"]))
        for e in n["refs"].split(","):
            assert len(e) <= 248, (n["internal"], len(e))
        for k in ("preconds", "steps", "expected"):
            assert "<" not in n[k]
        payload = dict(BASE)
        payload.update(title=n["title"], refs=n["refs"],
                       custom_preconds=n["preconds"], custom_steps=n["steps"],
                       custom_expected=n["expected"])
        st, resp = tr.api(f"add_case/{n['section_id']}", "POST", payload)
        if st != 200:
            raise RuntimeError(f"add_case FAILED {n['internal']} HTTP {st}: {resp}")
        cid = resp["id"]
        # Rule 50: re-GET and byte-compare every intended field
        st2, after = tr.get_case(cid)
        bad = []
        for k, want in payload.items():
            got = after.get(k)
            if k == "refs":
                want, got = tr.norm_refs(want), tr.norm_refs(got)
            if got != want:
                bad.append(f"{k}\n want={want!r}\n got ={got!r}")
        if after.get("section_id") != n["section_id"]:
            bad.append(f"section_id want={n['section_id']} got={after.get('section_id')}")
        if bad:
            raise RuntimeError("VERIFY FAILED C%d\n%s" % (cid, "\n".join(bad)))
        json.dump(after, open(f"/tmp/testrail/snapshots/C{cid}.new.json", "w"), indent=1, sort_keys=True)
        line = (f"add_case C{cid} ({n['internal']}) section {n['section_id']}: HTTP {st}, "
                f"{len(payload)+1} fields re-GET and byte-compared, 0 mismatch")
        print("OK", line)
        log.append({"op": "add_case", "internal": n["internal"], "cid": cid,
                    "section_id": n["section_id"], "http": st, "verify": line})
    json.dump(log, open("/tmp/vgap/logB.json", "w"), indent=1)
    print("PART B DONE:", len(log), "ops")
