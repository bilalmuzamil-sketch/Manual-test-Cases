#!/usr/bin/env python3
"""Build the write plan for the SV-9041 ingest — EXACT string surgery on the
committed pre-write snapshot, with every edit asserted.

Three cases are touched and no others. Every edit is expressed as an
(old -> new) literal replacement that MUST match exactly once, so a silent
near-miss is impossible: if the anchor text is not found byte-for-byte the
build fails here, before any TestRail call.

WHAT IS DELIBERATELY NOT TOUCHED (Rule 54): each case's sentence 2 — the
"Last checked against build ... on ..." line, or its honest "has not yet been
checked against any build" — is preserved byte-for-byte. This pass observed no
build and may not date one.

WHAT IS DELIBERATELY NOT TOUCHED (Rule 33): C43562's citation of Branko's
31 July answer stays in full. SV-9041 is added ALONGSIDE it and the divergence
between them is disclosed; the ruling is not dropped.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
PRE = json.load(open(f"{SNAP}/cases-PRE.json"))

# ---------------------------------------------------------------- C29601
# Substantively UNCHANGED: the Work Orders page offers five filters, so
# SV-9041's condition is satisfied and the assertion still holds. What is added
# is (a) the plain conditional a tester needs so a single-filter page is not
# read as a failure, and (b) SV-9041 in the provenance, because this case cites
# S1-R4 — the exact requirement the ticket qualifies.
# NO Rule-56 divergence sentence: on this page the sources AGREE, and inventing
# a divergence where none bites is itself a defect (Rule 56 honesty half).
C29601_NOTE_OLD = """3. The filter icon shows a pressed/active look while the bar is collapsed.

---"""
C29601_NOTE_NEW = """3. The filter icon shows a pressed/active look while the bar is collapsed.

Note for the tester: the Work Orders page offers five filters (Status, Customer, Lead Technician, Service Advisor and Asset on Site), so the collapse control is present on this page. On a page that offers only one filter there is no collapse control and the filter bar is always shown - that is correct, not a fault.

---"""

C29601_PROV_OLD = ("This is the expected behaviour as per epic SV-8785, read on 11 August 2026, "
                   "and the Filters specification at Confluence version 19 (published 6 August 2026) "
                   "(S1-R4, S1-R5), read on 11 August 2026.")
C29601_PROV_NEW = ("This is the expected behaviour as per epic SV-8785, read on 11 August 2026, "
                   "the Filters specification at Confluence version 19 (published 6 August 2026) "
                   "(S1-R4, S1-R5), read on 11 August 2026, and the epic's ticket SV-9041 "
                   "\"Expand/collapse filter toggle visibility\" (written 7 August 2026), read on "
                   "11 August 2026, which adds that the collapse control is only shown when the "
                   "page has more than one filter.")

# ---------------------------------------------------------------- C43562
# The one case GENUINELY CONTRADICTED. It spans Parts and Reports, whose filter
# bars carry different numbers of filters per page, and it asserts collapse
# "exactly as on the Work Orders page" with no condition. A tester on a
# single-filter Parts view would fail a correct build.
C43562_STEP_OLD = "2. Find the control that collapses the filter bar and use it. Then expand it again."
C43562_STEP_NEW = ("2. Look for the control that collapses the filter bar. If the page offers more "
                   "than one filter, use it and then expand it again. If the page offers only one "
                   "filter, write down that there is no such control.")

C43562_E1_OLD = ("1. The filter bar on the Parts page and on the report can be collapsed and "
                 "expanded, and the table takes the freed space when it is collapsed - exactly as "
                 "on the Work Orders page.\n"
                 "2. While the bar is collapsed the filters keep working, and the collapsed control "
                 "shows that filters are active - exactly as on the Work Orders page.\n"
                 "3. Whether you left the bar collapsed or expanded is remembered when you come "
                 "back to that page.")
C43562_E1_NEW = ("1. On a page whose filter bar offers more than one filter, the filter bar can be "
                 "collapsed and expanded, and the table takes the freed space when it is collapsed "
                 "- exactly as on the Work Orders page. On a page that offers only one filter there "
                 "is no collapse control at all and the filter bar is always shown - that is "
                 "correct, not a fault, so do not mark this test failed for that.\n"
                 "2. Where the collapse control exists, while the bar is collapsed the filters keep "
                 "working, and the collapsed control shows that filters are active - exactly as on "
                 "the Work Orders page.\n"
                 "3. Where the collapse control exists, whether you left the bar collapsed or "
                 "expanded is remembered when you come back to that page.")

C43562_PROV_OLD = ("He said that collapsing, the shareable web address and the phone layout all "
                   "match the Work Orders page. The Filters specification at Confluence version 19 "
                   "has no numbered requirement for this, so there is no requirement number to "
                   "quote.")
C43562_PROV_NEW = ("He said that collapsing, the shareable web address and the phone layout all "
                   "match the Work Orders page. The condition on the collapse control comes from "
                   "the epic's ticket SV-9041 \"Expand/collapse filter toggle visibility\" (written "
                   "7 August 2026), read on 11 August 2026, which says that the control is only "
                   "shown when there is more than one filter on the page, and that otherwise it is "
                   "not shown and the filter bar is always visible. That ticket is newer than the "
                   "other two sources and it differs from both of them: Branko's answer of 31 July "
                   "2026 said that collapsing matches the Work Orders page without stating any "
                   "condition, and the Filters specification says at S1-R4 - wording unchanged "
                   "since 13 May 2026 - that the page toolbar contains a collapse toggle, also "
                   "without stating any condition. We are taking the newest information as "
                   "prevailing. Whether this condition should be written into the specification, "
                   "and whether it is meant to apply to the Parts and Reports pages as well as to "
                   "Work Orders, is an open question with Branko. The Filters specification at "
                   "Confluence version 19 has no numbered requirement for the Parts and Reports "
                   "filter bars themselves, so there is no requirement number to quote for those.")

# ---------------------------------------------------------------- C38882
# Date correction ONLY. Proven by fetching the date-filter description from all
# 19 Confluence versions: the wording first appears at v18 (2026-08-04T18:19:21Z
# — the afternoon of 4 August) and is carried forward unchanged into v19, whose
# own only change is S1-R3's leading type-icon. The case welded v19's NUMBER to
# v18's DATE and v18's CHANGE.
C38882_OLD = ("It follows the NEWER wording of the Filters specification at Confluence version 19, "
              "read on 11 August 2026, published on the afternoon of 4 August 2026, which changed "
              "the date filter description in the Feature Overview and in the Key Decisions "
              "section: the date button now offers standard ready-made periods and starts with the "
              "current default range already filled in. An earlier revision of the same "
              "specification said the opposite, and this test follows the newer one.")
C38882_NEW = ("It follows the NEWER wording of the Filters specification, which changed the date "
              "filter description in the Feature Overview and in the Key Decisions section: the "
              "date button now offers standard ready-made periods and starts with the current "
              "default range already filled in. That wording was introduced in Confluence version "
              "18, published on the afternoon of 4 August 2026, and the specification has carried "
              "it forward unchanged into Confluence version 19, read on 11 August 2026. An earlier "
              "revision of the same specification said the opposite, and this test follows the "
              "newer one.")

EDITS = {
    "29601": {
        "why": "cites S1-R4, the requirement SV-9041 qualifies; plain conditional added for the "
               "tester and SV-9041 added to the provenance. Assertion unchanged.",
        "expected": [(C29601_NOTE_OLD, C29601_NOTE_NEW),
                     (C29601_PROV_OLD, C29601_PROV_NEW)],
    },
    "43562": {
        "why": "GENUINELY CONTRADICTED — spans Parts and Reports, asserted collapse unconditionally. "
               "Expected results 1-3 made scope-conditional, step 2 made followable on a "
               "single-filter page, SV-9041 cited, Rule-56 divergence disclosed, Branko's ruling "
               "kept in full.",
        "steps": [(C43562_STEP_OLD, C43562_STEP_NEW)],
        "expected": [(C43562_E1_OLD, C43562_E1_NEW),
                     (C43562_PROV_OLD, C43562_PROV_NEW)],
    },
    "38882": {
        "why": "wrong publication date for the revision that changed the date-filter description; "
               "corrected to version 18 (proven by an all-19-version diff). Nothing else touched.",
        "expected": [(C38882_OLD, C38882_NEW)],
    },
}

FIELDS = {"steps": "custom_steps", "expected": "custom_expected",
          "preconds": "custom_preconds"}


def build():
    plan = {}
    for cid, spec in EDITS.items():
        pre = PRE[cid]
        newvals, ops = {}, []
        for short, field in FIELDS.items():
            text = pre[field]
            for old, new in spec.get(short, []):
                n = text.count(old)
                assert n == 1, (f"C{cid} {field}: anchor matched {n} times, expected 1\n"
                                f"ANCHOR>>>{old}<<<")
                assert new not in text, f"C{cid} {field}: replacement ALREADY present (not idempotent-safe)"
                text = text.replace(old, new)
                ops.append(f"{field}: {len(old)} chars -> {len(new)} chars")
            newvals[field] = text

        # Rule 54 guard: sentence 2 must survive byte-for-byte.
        for probe in ("Last checked against build", "has not yet been checked against any build"):
            assert pre["custom_expected"].count(probe) == newvals["custom_expected"].count(probe), \
                f"C{cid}: sentence-2 probe {probe!r} count changed"
        # Sentence 2 sits INSIDE the provenance paragraph, not on its own line, so
        # the check is on the SENTENCE. (Caught by this guard failing on C29601.)
        import re as _re
        for m in _re.finditer(r"Last checked against build [^.]*\.", pre["custom_expected"]):
            assert m.group(0) in newvals["custom_expected"], \
                f"C{cid}: build sentence not preserved verbatim: {m.group(0)!r}"

        # Structure guards.
        assert newvals["custom_expected"].count("AUTOMATION:") == 1, f"C{cid}: marker count"
        assert newvals["custom_expected"].count("This is the expected behaviour as per") == 1, \
            f"C{cid}: provenance opening count"
        assert newvals["custom_expected"].rstrip().endswith(
            pre["custom_expected"].rstrip().split("\n")[-1].rstrip()), f"C{cid}: marker must stay last"
        for bad in ("<p>", "<li>", "<ol>", "\r\n", "&nbsp;", "VIU"):
            assert bad not in newvals["custom_expected"], f"C{cid}: barred token {bad!r}"
            assert bad not in newvals["custom_steps"], f"C{cid}: barred token {bad!r} in steps"

        plan[cid] = {"title": pre["title"],
                     "why": spec["why"],
                     "ops": ops,
                     "custom_preconds": newvals["custom_preconds"],
                     "custom_steps": newvals["custom_steps"],
                     "custom_expected": newvals["custom_expected"],
                     "refs_unchanged": pre.get("refs"),
                     "atmstatus_pre": pre.get("custom_atmstatus")}
        print(f"C{cid}  {pre['title'][:62]}")
        for o in ops:
            print(f"     {o}")
        print(f"     atmstatus(pre)={pre.get('custom_atmstatus')}  refs left untouched")

    json.dump(plan, open("/tmp/sv9041_plan.json", "w"), indent=1)
    print(f"\nplan written for {len(plan)} cases -> /tmp/sv9041_plan.json")
    return plan


if __name__ == "__main__":
    build()
