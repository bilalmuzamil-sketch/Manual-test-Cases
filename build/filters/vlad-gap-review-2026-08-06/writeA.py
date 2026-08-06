"""Part A - row 1 corrections. 5 update_case, Rule-50 verified."""
import sys, json
sys.path.insert(0, '/tmp/testrail')
import tr

PROV_HOLD = (
    "This is the expected behaviour as per epic SV-8785, the owning story SV-8794, and Branko's "
    "answer of 17 July 2026 (Round 1, question 4, option B), recorded in this file: "
    "build/filters/branko-answers-2026-07-17/answers-ingested.md "
    "(https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/build/filters/"
    "branko-answers-2026-07-17/answers-ingested.md). "
    "Note: the Filters specification at Confluence version 19 says instead that the Status chip is "
    "hidden on this tab (S9-R2 and S9-R3). That sentence has not been edited since 14 May 2026, "
    "which is two and a half months before Branko's answer, so the answer is the later decision and "
    "this test follows the answer. Branko has been asked to correct the specification."
)
MARK_HOLD = ("AUTOMATION: HOLD - waiting on Branko to confirm whether the Status chip is hidden or "
             "shown greyed out on the Estimates and Completed tabs, and to correct the specification")

P = {}

# ---------------- C29609 FLT-TAB-02 ----------------
P[29609] = dict(
    title="Estimates tab: Status chip is greyed out and pre-filled; other four work",
    refs='SV-8794 (S9-R2; S2-N1; Branko Round-1 Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = chip shown greyed-out/pre-filled; the PRD text saying "hidden" is unchanged since v4 2026-05-14) [spec v19 2026-08-06]',
    custom_preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Estimate work orders exist for at least two different customers.\n"
        "3. You are on the Work Orders page."),
    custom_steps=(
        "1. Click the Estimates tab.\n"
        "2. Look at the filter bar and at the Status chip.\n"
        "3. Try to click the Status chip and change it.\n"
        "4. Open the Customer filter and select one customer.\n"
        "5. Look at the table."),
    custom_expected=(
        "1. The Status chip is shown, but greyed out and already filled in with this tab's own status "
        "(Estimate), because the tab already narrows the list to Estimate.\n"
        "2. The Status chip cannot be clicked or changed on this tab.\n"
        "3. Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable.\n"
        "4. After step 4 the table shows only that customer's ESTIMATE work orders - the customer "
        "filter narrows the pre-filtered Estimates list.\n\n"
        "---\n" + PROV_HOLD + "\n\n" + MARK_HOLD + "\n"),
)

# ---------------- C29610 FLT-TAB-03 ----------------
P[29610] = dict(
    title="Completed tab: Status chip is greyed out and pre-filled; other four work",
    refs='SV-8794 (S9-R3; S2-N2; Branko Round-1 Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = chip shown greyed-out/pre-filled; the PRD text saying "hidden" is unchanged since v4 2026-05-14) [spec v19 2026-08-06]',
    custom_preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Complete work orders exist for at least two different customers.\n"
        "3. You are on the Work Orders page."),
    custom_steps=(
        "1. Click the Completed tab.\n"
        "2. Look at the filter bar and at the Status chip.\n"
        "3. Try to click the Status chip and change it.\n"
        "4. Open the Customer filter and select one customer.\n"
        "5. Look at the table."),
    custom_expected=(
        "1. The Status chip is shown, but greyed out and already filled in with this tab's own status "
        "(Complete), because the tab already narrows the list to Complete.\n"
        "2. The Status chip cannot be clicked or changed on this tab.\n"
        "3. Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable.\n"
        "4. After step 4 the table shows only that customer's COMPLETE work orders.\n\n"
        "---\n" + PROV_HOLD + "\n\n" + MARK_HOLD + "\n"),
)

# ---------------- C29559 FLT-BAR-03 ----------------
P[29559] = dict(
    refs='SV-8786 (S1-N1; S9-R2; Branko Round-1 Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = Status chip shown greyed-out/pre-filled on this tab) [spec v19 2026-08-06]',
    custom_preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Estimate work orders exist.\n"
        "3. You are on the Work Orders page."),
    custom_steps=(
        "1. Click the Estimates tab.\n"
        "2. Look at the filter bar.\n"
        "3. Look at each chip in turn."),
    custom_expected=(
        "1. The filter bar is still shown on this tab - it does not disappear.\n"
        "2. The Customer, Lead Technician, Service Advisor and Asset on Site chips are all shown and "
        "usable.\n"
        "3. The Status chip is shown but greyed out and already filled in with this tab's own status, "
        "and cannot be clicked or changed.\n\n"
        "---\n" + PROV_HOLD + "\n\n" + MARK_HOLD + "\n"),
)

# ---------------- C29612 FLT-TAB-05 ----------------
P[29612] = dict(
    refs='SV-8794 (S9-R5 (selections retained across tabs and reappear on the All tab); S9-R2; Branko Round-1 Q4=B 2026-07-17 = Status chip shown greyed-out/pre-filled) [spec v19 2026-08-06]',
    custom_preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. You are on the Work Orders page on the All tab.\n"
        "3. Work orders exist in the Approved status and Estimate work orders exist too."),
    custom_steps=(
        "1. On the All tab, open the Status filter and tick Approved.\n"
        "2. Open the Customer filter and select one customer.\n"
        "3. Click the Estimates tab and look at the filter bar and the table.\n"
        "4. Click back to the All tab.\n"
        "5. Look at the Status chip and the Customer chip."),
    custom_expected=(
        "1. On the Estimates tab your Status choice is not applied and cannot be changed - the Status "
        "chip is greyed out and already filled in with that tab's own status. The Customer selection "
        "is still shown and still narrows the list.\n"
        "2. Back on the All tab the Status chip is usable again and shows the SAME selection "
        "(Approved) still applied - your choice was kept, not thrown away.\n"
        "3. The Customer selection is unchanged throughout.\n\n"
        "---\n" + PROV_HOLD + "\n\n" + MARK_HOLD + "\n"),
)

# ---------------- C29558 FLT-BAR-02 ----------------
# Ahtasham Amjad rewrote this case at 11:27:20Z today to assert the leading type-icon
# (spec v19 S1-R3). His assertion is KEPT verbatim in meaning. What this write does:
#   (a) converts all three fields from raw HTML to plain text so the tester does not see markup;
#   (b) removes the contested Status-chip claim from precondition 3 (row 1);
#   (c) restores the Rule-54 provenance line and the automation marker, which his edit dropped;
#   (d) adds the Rule-61 symptom + three outcomes for SV-8986.
P[29558] = dict(
    refs='SV-8786 (S1-R2 (five chips in a fixed order); S1-R3 (each chip shows a leading type-icon, the filter name and a chevron - new in Confluence v19)) [spec v19 2026-08-06]',
    custom_preconds=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. You are on the Work Orders page with the filter bar visible.\n"
        "3. You are on the All tab (the Estimates and Completed tabs treat the Status chip "
        "differently - that is covered by its own tests, so do not compare the chips there)."),
    custom_steps=(
        "1. Read the filter chips in the filter bar from left to right.\n"
        "2. Look at what each chip shows."),
    custom_expected=(
        "1. Exactly five filter chips appear, in this order: Status, Customer, Lead Technician, "
        "Service Advisor, Asset on Site.\n"
        "2. Each chip shows a leading picture icon, then the filter name, then a down arrow "
        "(chevron) showing that it opens a dropdown.\n"
        "3. The leading icon suits each filter (for example a status glyph for Status, a person for "
        "Customer, a wrench for Lead Technician, a headset for Service Advisor, a box for Asset on "
        "Site).\n\n"
        "What you should see today: the chips show the filter name and the down arrow only, with no "
        "leading picture icon before the name. This is a known problem and it is already reported - "
        "see https://shopview.atlassian.net/browse/SV-8986. (Reported by a colleague from the build; "
        "not observed by us.)\n"
        "- If you see exactly that, mark this test FAILED and do not raise anything new.\n"
        "- If it fails in a DIFFERENT way from what is described above, that is a NEW problem - "
        "please report it.\n"
        "- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this "
        "note removed.\n\n"
        "---\n"
        "This is the expected behaviour as per epic SV-8785, the owning story SV-8786, and the "
        "Filters specification at Confluence version 19 (published 6 August 2026) (S1-R2, S1-R3). "
        "Note: version 18 of the same specification asked only for the filter name and the chevron; "
        "version 19 added the leading picture icon to match the design, and this test follows the "
        "newer wording.\n\n"
        "AUTOMATION: READY - EXPECT FAIL (SV-8986)\n"),
)

if __name__ == "__main__":
    log = []
    for cid in (29609, 29610, 29559, 29612, 29558):
        pl = P[cid]
        for k in ("custom_preconds", "custom_steps", "custom_expected"):
            assert k in pl, (cid, k)  # Rule 50: all three text fields on every payload
        if "title" in pl:
            assert len(pl["title"]) <= 80, (cid, len(pl["title"]))
        for e in pl["refs"].split(","):
            assert len(e) <= 248, (cid, len(e))
        st, line, before, after = tr.update_case_verified(cid, pl)
        print("OK", line)
        log.append({"op": "update_case", "cid": cid, "http": st, "verify": line})
    json.dump(log, open("/tmp/vgap/logA.json", "w"), indent=1)
    print("PART A DONE:", len(log), "ops")
