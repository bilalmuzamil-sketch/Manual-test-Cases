#!/usr/bin/env python3
"""Apply the Branko Parts/Reports/page-search APPLY-PLAN to the Filters case bodies.

USER-AUTHORIZED 2026-07-31 (including the 9 FLT-SRCH retirements).
Source of record: branko-answers-2026-07-31/answers-ingested.md (verbatim answers),
DELTAS.md (analysis), APPLY-PLAN.md (this executable list).
Spec baseline: v1.6 - Confluence page 572030978 version 12, updated 2026-07-28
(local copy build/filters/spec-current-2026-07-31/Filters-spec-current.md).

LOCAL ONLY - this script makes NO TestRail calls.
Every touched body was backed up first to backup/pre-edit-bodies/<ID>.json.

Idempotent: re-running asserts the post-state instead of double-applying.
"""
import json, glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FILTERS = os.path.dirname(HERE)
CASES = os.path.join(FILTERS, "cases")

# --------------------------------------------------------------------------
# The shared text blocks (APPLY-PLAN §1). Written once, used by several cases,
# so the Stage-2b cross-case consistency sweep can prove they read identically.
# --------------------------------------------------------------------------
BLOCK_P_PARTS = ("Any signed-in user with access to the Parts pages. The filter "
                 "buttons and their choices are the same for every user - a "
                 "person's role does not change them.")
BLOCK_P_RPTS = ("Any signed-in user with access to the Reports pages. The filter "
                "buttons and their choices are the same for every user - a "
                "person's role does not change them.")

# NOTE: refs / spec_ref strings are deliberately COMMA-FREE. TestRail normalizes
# the `refs` field as a comma-separated reference list and strips the space after
# each comma, which produced 6 false re-GET MISMATCHes on the 2026-07-31 push.
BLOCK_R_PARTS = ('Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Parts '
                 'Filters; §4 Key Decisions -> "Context-specific filter sets on '
                 'Parts and Reports" + "Multi-select where it makes sense"); '
                 'Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885')
BLOCK_R_RPTS = ('Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Reports '
                'Filters; §4 Key Decisions -> "Context-specific filter sets on '
                'Parts and Reports" + "New date-range filter type" + "Multi-select '
                'where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; '
                'Figma 11903-10573')

BLOCK_N = ("RESOLVED 2026-07-31 - Branko's answers (Parts/Reports sheet) + live spec "
           "v1.6 (Confluence page 572030978 version 12, 2026-07-28): the PRD update "
           "landed; Parts/Reports filters are confirmed in scope with full "
           "Work-Orders parity. Still NOT live-verified (no QA branch) - viu_status "
           "stays VIU-Pending.")

# Tester-facing line for the data-driven option lists (Q3).
BLOCK_T = ("The choices inside each filter come from your own shop's data (for "
           "example your real vendors or categories), so there is no fixed list to "
           "compare against - check that the choices you see match the data in your "
           "shop.")

RETIRE_STATUS = ("Retired — page-search palette confirmed Global-Search-owned by "
                 "Branko 2026-07-31 (Q6=A); coverage lives in the Global Search "
                 "project's 86-case suite")

RETIRE_NOTE = (
    "RETIRED 2026-07-31 (user-authorized). The QA-lead ruling was conditional - "
    "verbatim: \"If those searches are also part of filters then lets keep if filters "
    "project has nothing to do with them and they are not mentioned in the specs then "
    "we can leave them to be tested with global search.\" The condition RESOLVES TO "
    "LEAVE THEM TO GLOBAL SEARCH on three independent pieces of evidence: "
    "(a) Branko's answer to Q6 of the Parts/Reports sheet - verbatim \"A - Test it "
    "under Global Search, not here. This release only removes global search's "
    "page-filtering behaviour (Story 14). 'Ask a question' is not in this PRD's "
    "scope.\"; (b) spec v1.6 (Confluence page 572030978 version 12, 2026-07-28) "
    "contains NO command-palette requirement - Story 13 is the IN-TOOLBAR page search "
    "input (S13-R12: \"Results replace the table contents in place. There is no "
    "separate results view or results page\") and §4 Key Decisions assigns cross-page "
    "lookup elsewhere (\"Cross-page and cross-module lookup is the job of the global "
    "header search\"); (c) the Filters Figma file contains NO command-palette board at "
    "all - the palette lives on a separate 'Global search' page of the same file "
    "(design-2026-07-31/DESIGN-NOTES.md §2 + §5.7 - this corrects our own 2026-07-27 "
    "mislabelling of node 11829-8908). "
    "C-ID CONFIRMED BLANK before retiring, so there was NO delete_case and nothing to "
    "remove from TestRail - LOCAL-ONLY retirement, body kept for the record. Coverage "
    "lives in the Global Search project's 86-case suite (that project is POSTPONED per "
    "the user ruling 2026-07-27, so the coverage is parked, not running). Pre-edit body "
    "preserved in build/filters/branko-answers-2026-07-31/backup/pre-edit-bodies/. "
    "EXCLUDED from active deliverables + tally. "
    "NOT to be confused with the FLT-PSRCH-* cases (Filters' own Story 13 in-toolbar "
    "search box, 29 ratified requirements in v1.6) - those are IN scope and were left "
    "untouched by this pass."
)
RETIRE_NOTE_09 = (
    " Retires on its own merits too: it was a scope DECISION dressed up as a test case "
    "(the 2026-07-31 Rule-28 audit scored it NONSENSE) and the decision has now been "
    "made, so there is nothing left for a tester to do."
)

SRCH_IDS = [f"FLT-SRCH-0{i}" for i in range(1, 10)]


def load():
    files = {}
    for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
        files[f] = json.load(open(f))
    return files


def find(files, cid):
    for f, cases in files.items():
        for c in cases:
            if c["id"] == cid:
                return f, c
    raise KeyError(cid)


def repl(lst, idx, new_items, must_start):
    """Replace lst[idx] (whose text must start with must_start) with new_items."""
    assert lst[idx].startswith(must_start), (idx, lst[idx][:90])
    return lst[:idx] + list(new_items) + lst[idx + 1:]


def main():
    files = load()
    log = []

    # ---------------- A1 · FLT-PARTS-01 ----------------
    _, c = find(files, "FLT-PARTS-01")
    c["permissions_required"] = BLOCK_P_PARTS
    c["expected"] = repl(c["expected"], 10, [
        "11. Every filter button shown above is a working filter on that page - none of them is display-only.",
        "12. " + BLOCK_T,
        "13. Still to check on the live build: what the funnel icon and the column/layout icon do (the written description does not cover the toolbar icons).",
    ], "11. Behaviour to confirm")
    # Vendors hedge (expected 8) is deliberately UNCHANGED - Q2=A speaks about chips
    # shown in the DESIGN and there is no Vendors design; that question is still open.
    assert "the developers have not been given a design for the Vendors page" in c["expected"][7]
    c["spec_ref"] = BLOCK_R_PARTS
    stale = " | Design-only (chip + column presence). Which filters actually apply and their option lists are pending Branko's PRD."
    assert c["notes"].endswith(stale)
    c["notes"] = c["notes"][:-len(stale)] + " | " + BLOCK_N
    log.append("A1 FLT-PARTS-01")

    # ---------------- A2 · FLT-PARTS-09 ----------------
    _, c = find(files, "FLT-PARTS-09")
    c["permissions_required"] = BLOCK_P_PARTS
    assert len(c["steps"]) == 2
    c["steps"] = c["steps"] + [
        "3. Tick Core, then also tick Non Core, and watch the list below.",
        "4. Use Clear selection.",
    ]
    c["expected"] = repl(c["expected"], 2, [
        "3. You can tick both Core and Non Core at the same time - this filter allows more than one choice.",
        "4. As soon as you tick a choice the list below narrows to matching parts straight away, with no Apply button to press; Clear selection puts the list back.",
    ], "3. Behaviour to confirm")
    c["spec_ref"] = BLOCK_R_PARTS
    c["notes"] = ("The Core / Non Core menu contents came from the design; the selection "
                  "and apply behaviour is now settled by Branko's Q3 + Q5 answers and "
                  "spec v1.6 §4 Key Decisions (\"Multi-select where it makes sense: all "
                  "Parts and Reports filters are multi-select except the date-range "
                  "filter\"), so steps 3-4 now drive what expected 3-4 assert. " + BLOCK_N)
    log.append("A2 FLT-PARTS-09")

    # ---------------- A3 · FLT-PARTS-11 ----------------
    _, c = find(files, "FLT-PARTS-11")
    c["permissions_required"] = BLOCK_P_PARTS
    c["expected"] = repl(c["expected"], 2, [
        "3. The list narrows as soon as you pick the value - there is no Apply or Search button to press. Every filter button on every Parts page works this way.",
    ], "3. Behaviour to confirm")
    c["spec_ref"] = BLOCK_R_PARTS
    c["notes"] = ("BEHAVIOUR case - the design does not pin how Parts filters apply; the "
                  "behaviour is settled by Branko's Q2=A (\"every chip shown filters that "
                  "page\") + Q5=A (full Work-Orders parity) and spec v1.6 §2 Parts "
                  "Filters. Tech plan 2026-07-29 (engineering intent - confirm live at "
                  "the wording/behaviour pass): rollout rule - every Parts page gets all "
                  "three together: the chip design, shareable links, and per-user "
                  "remembered filters, with NO change to what is filterable; date columns "
                  "use the date-range chip (see FLT-RPTS-23) and each view keeps its own "
                  "state (see FLT-PERS-05). " + BLOCK_N)
    log.append("A3 FLT-PARTS-11")

    # ---------------- A4 · FLT-PARTS-12 ----------------
    _, c = find(files, "FLT-PARTS-12")
    c["permissions_required"] = BLOCK_P_PARTS
    c["expected"] = repl(c["expected"], 0, [
        "1. More than one value can be chosen inside the filter, and the button shows what you picked.",
    ], "1. More than one value can be chosen inside a filter (to be checked live")
    c["expected"] = repl(c["expected"], 2, [
        "3. A Clear filters button appears in the filter bar while any filter is set, and using it clears them all at once - exactly as it works on the Work Orders page.",
    ], "3. Behaviour to confirm")
    c["spec_ref"] = BLOCK_R_PARTS
    c["notes"] = ("BEHAVIOUR case - parity with the Work Orders filter behaviour is now "
                  "RATIFIED by Branko's Q5=A (\"multi-select, clearing, collapse, "
                  "persistence, shareable URL and mobile all match Work Orders\") + spec "
                  "v1.6 §2 Parts Filters (\"Active-chip appearance, 'Clear filters', "
                  "'Clear selection', collapse/expand, per-view persistence, URL state, "
                  "and mobile behavior all match the Work Orders definitions\"). "
                  "ANTI-DUPLICATION: per-view scoping (filters do not carry between Parts "
                  "views) is covered by FLT-PERS-05 = C38880 - do not duplicate it here "
                  "(Rule 28). Tech plan 2026-07-29 (engineering intent - confirm live at "
                  "the wording/behaviour pass): rollout rule - every Parts page gets all "
                  "three together: the chip design, shareable links, and per-user "
                  "remembered filters, with NO change to what is filterable. " + BLOCK_N)
    log.append("A4 FLT-PARTS-12")

    # ---------------- A5 · FLT-RPTS-01 ----------------
    _, c = find(files, "FLT-RPTS-01")
    c["permissions_required"] = BLOCK_P_RPTS
    c["expected"] = repl(c["expected"], 21, [
        "22. Every filter button shown above is a working filter on that report - none of them is display-only.",
        "23. " + BLOCK_T,
        "24. Still to check on the live build: the real columns of the Sales Tax report and of the six A/R and A/P aging reports. The design uses sample placeholder tables for those, and the written description does not list their columns.",
    ], "22. Behaviour to confirm")
    c["spec_ref"] = BLOCK_R_RPTS
    # Keep the whole MG15 merge-survivor paragraph (it holds the demoted column
    # lists - nothing may be lost); correct only the two now-stale attributions.
    old_ph = ("The Sales Tax and both aging families use SAMPLE PLACEHOLDER bodies in "
              "the design, so their real columns are unknown until Branko's PRD.")
    new_ph = ("The Sales Tax and both aging families use SAMPLE PLACEHOLDER bodies in "
              "the design and spec v1.6 does not list their columns either, so their "
              "real columns stay unknown until the live build (carried as expected 24).")
    assert old_ph in c["notes"]
    c["notes"] = c["notes"].replace(old_ph, new_ph)
    stale = " | Design-only (chip + column presence). Apply behaviour and option lists pending Branko's PRD."
    assert c["notes"].endswith(stale)
    c["notes"] = c["notes"][:-len(stale)] + " | " + BLOCK_N
    log.append("A5 FLT-RPTS-01")

    # ---------------- A6 · FLT-RPTS-21 ----------------
    _, c = find(files, "FLT-RPTS-21")
    c["permissions_required"] = BLOCK_P_RPTS
    c["expected"] = repl(c["expected"], 1, [
        "2. The report narrows as soon as you pick the value - there is no Apply or Run button to press. Every filter button on every report works this way.",
    ], "2. Behaviour to confirm")
    c["spec_ref"] = BLOCK_R_RPTS
    keep = ("WORDING REPAIR 2026-07-31 (Rule-28 audit FIX-WORDING, user-authorized): the "
            "steps only looked at the buttons while expected 1 asserted filtered results "
            "— added a choose-a-value step (mirrors FLT-PARTS-11 step 2) and fixed the "
            "grammar 'go to the any (for example Sales) report'.")
    assert c["notes"].startswith(keep)
    c["notes"] = (keep + " | BEHAVIOUR case - the design does not pin how Reports filters "
                  "apply; the behaviour is settled by Branko's Q2=A + Q5=A and spec v1.6 "
                  "§2 Reports Filters. Tech plan 2026-07-29 (engineering intent - confirm "
                  "live at the wording/behaviour pass): rollout rule - every report page "
                  "gets the chip design + shareable links + per-user remembered filters "
                  "with NO change to what is filterable; nearly every report leads with "
                  "the date-range chip (see FLT-RPTS-23); sub-report tabs keep separate "
                  "state per tab (see FLT-PERS-05). " + BLOCK_N)
    log.append("A6 FLT-RPTS-21")

    # ---------------- A7 · FLT-RPTS-22 ----------------
    _, c = find(files, "FLT-RPTS-22")
    c["permissions_required"] = BLOCK_P_RPTS
    c["steps"] = [
        "1. Open the Reports area and go to a report that uses them - for example A/R Aging Detail (Location, Transaction Type) or Notes (Mention).",
        "2. Look at the filter buttons shown above the report table.",
        "3. Open each of those filter buttons in turn, tick two choices where possible, and watch the report.",
    ]
    c["expected"] = [
        "1. Each of these filter buttons - Location, Transaction Type, Invoice Status, Type, User and Mention - opens a list of choices, lets you tick more than one, and narrows the report straight away with no Apply button.",
        "2. " + BLOCK_T,
        "3. Write down the choices you actually see behind each of these six buttons. They have not been written down anywhere yet, so your list becomes the record.",
    ]
    c["spec_ref"] = (BLOCK_R_RPTS + "; Branko answers 2026-07-31 Q4 (pointer to the "
                     "design/PRD - the six new filter types are NOT enumerated in v1.6; "
                     "see DELTAS.md flag F1)")
    c["notes"] = ("BEHAVIOUR case - the Reports pages introduce filter types that are not "
                  "on the Work Orders page. The MECHANICS are settled by Branko's Q3 "
                  "(\"There is no specific list of choices\") + Q5=A parity + spec v1.6 §4 "
                  "(\"Multi-select where it makes sense\"), NOT by his Q4 answer, which is "
                  "a pointer (\"Filter behavior and types are fully displayed in the "
                  "design. The links are in the PRD.\") and does not match our own live "
                  "design read. OPEN: the option list for each of the six new filter types "
                  "is not in spec v1.6 and not visible on any rendered design board (12 "
                  "boards still un-rendered, Rule-35 queue); question NEW-Q2 asks Branko "
                  "for the specific board. Capture the real lists live at VIU - expected 3 "
                  "makes that the tester's job. Tech plan 2026-07-29 (engineering intent - "
                  "confirm live at the wording/behaviour pass): rollout rule - every report "
                  "page gets the chip design + shareable links + per-user remembered "
                  "filters with NO change to what is filterable. " + BLOCK_N)
    log.append("A7 FLT-RPTS-22")

    # ---------------- A8 · FLT-RPTS-23 (C38882) ----------------
    _, c = find(files, "FLT-RPTS-23")
    c["permissions_required"] = BLOCK_P_RPTS
    c["spec_ref"] = ('Filters (Epic key TBD) (spec v1.6 §4 Key Decisions -> "New '
                     'date-range filter type"; §2 Feature Overview -> Reports Filters: '
                     'start/end picker with no presets and no default range; applies '
                     'immediately when the second date is picked; range=custom&from=&to= '
                     'in the URL); Branko answers 2026-07-31 Q5 (date-range is a single '
                     'range - not multi-select); tech plan 2026-07-29 D19')
    c["notes"] += (" CONFIRMED 2026-07-31 from two sources that agree: Branko's answer "
                   "(\"Date-range is a single range, not multi-select\") and spec v1.6 §4 "
                   "Key Decisions. The spec export is no longer awaited. No tester-facing "
                   "wording changed - expected 4 already asserted the single-range "
                   "behaviour. Exact panel labels still to capture live.")
    log.append("A8 FLT-RPTS-23")

    # ---------------- A9 · FLT-PERS-05 (C38880) ----------------
    _, c = find(files, "FLT-PERS-05")
    c["spec_ref"] = ('Filters (Epic key TBD) (spec v1.6 S10-R4; §4 Key Decisions -> '
                     '"Parts and Reports selections are scoped to their view/tab and '
                     'persist there"); Branko answers 2026-07-31 Q5 exception 1 (filters '
                     "do not carry across Parts views or Report tabs); tech plan "
                     "2026-07-29 D20")
    c["notes"] += (" TRACEABILITY UPGRADE 2026-07-31: the expectation is no longer sourced "
                   "from an engineering decision ID alone - Branko's Q5 exception 1 "
                   "(\"filters don't carry across Parts views or Report tabs; each view "
                   "keeps its own set\") and spec v1.6 S10-R4 + §4 Key Decisions now say "
                   "the same thing, so PO and spec agree (Rule 32(i) - duplication raises "
                   "confidence). No behaviour change. This case is the SINGLE home of "
                   "per-view/per-tab scoping - FLT-PARTS-12 deliberately does not "
                   "duplicate it.")
    log.append("A9 FLT-PERS-05")

    # ---------------- RETIRE the 9 FLT-SRCH ----------------
    import csv
    idmap = {r["internal_id"]: (r["testrail_case_id"] or "").strip()
             for r in csv.DictReader(open(os.path.join(FILTERS, "testrail-id-map.csv")))}
    for sid in SRCH_IDS:
        _, c = find(files, sid)
        # HARD GUARD: never retire anything that is live in TestRail.
        assert idmap.get(sid, "") == "", f"{sid} HAS a C-id ({idmap.get(sid)}) - ABORT"
        assert not str(c.get("viu_status", "")).startswith("Retired"), sid
        c["viu_status"] = RETIRE_STATUS
        note = RETIRE_NOTE + (RETIRE_NOTE_09 if sid == "FLT-SRCH-09" else "")
        c["notes"] = note + " | " + (c.get("notes") or "")
        log.append("RETIRE " + sid)

    # ---------------- NEW-1 · FLT-PARTS-13 ----------------
    pf = os.path.join(CASES, "cases-E-parts-filters.json")
    existing = {c["id"] for c in files[pf]}
    assert "FLT-PARTS-13" not in existing
    files[pf].append({
        "id": "FLT-PARTS-13",
        "area": "Parts Page Filters",
        "title": "Every filter a page had before is still available in the new filter bar",
        "priority": "High",
        "type": "Functional",
        "permissions_required": BLOCK_P_PARTS,
        "preconditions": [
            "1. You are signed in to the ShopView App on a desktop browser.",
            "2. You have a written list of the filters each Parts page and each report offers today, before the new filter bar (take screenshots of the old screens first, or ask the developers for the list).",
            "3. Sample data is present in the Parts area and in the Reports area.",
        ],
        "steps": [
            "1. Take your before-list for one page.",
            "2. Open the same page with the new filter bar.",
            "3. Compare the filter buttons you now see against your before-list.",
            "4. Open each button and compare the choices inside it against the choices the old filter offered.",
            "5. Repeat steps 1 to 4 for the other Parts pages and for each report.",
        ],
        "expected": [
            "1. Every filter the page offered before is still offered - nothing has been taken away.",
            "2. Every choice each of those filters offered before is still available inside the new button.",
            "3. If any filter or choice is missing, write down exactly which page, which filter and which choice - that is a bug worth reporting.",
        ],
        "design_ref": "n/a - scope/parity ruling, no design board (the design shows the new chips, not what the old screens offered)",
        "spec_ref": ('Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Parts '
                     'Filters / Reports Filters); Branko answers 2026-07-31 Q3 verbatim '
                     '("We should support all the filters we have right now in the app as '
                     'well as all choices per filter"); tech plan 2026-07-29 rollout rule '
                     '(NO change to what is filterable)'),
        "viu_status": "VIU-Pending",
        "notes": ("NEW 2026-07-31 (user-authorized) - authored from Branko's Q3 answer, "
                  "verbatim: \"We should support all the filters we have right now in the "
                  "app as well as all choices per filter. There is no specific list of "
                  "choices.\" Sentence 1 is a SCOPE/PARITY ruling that NO other case in "
                  "the suite asserted: every existing Parts/Reports case checks that the "
                  "DESIGNED chips are present and work, none checks the inverse - that no "
                  "filter a shop relies on TODAY was dropped in the redesign. That is the "
                  "single most likely real-world regression of an app-wide filter-bar "
                  "replacement. Corroborated by the tech plan 2026-07-29 rollout rule "
                  "(\"NO change to what is filterable\"), so two sources agree (Rule "
                  "32(i)). Rule-28 discipline: deliberately ONE case covering BOTH Parts "
                  "and Reports, not one per page - per-page explosion is the exact pattern "
                  "the 2026-07-31 audit cut 27 cases for. Filed in the Parts Page Filters "
                  "section; step 5 extends the same walk to every report. The one risk is "
                  "precondition 2 (the before-list), so it is written as an explicit "
                  "achievable tester action rather than an unreachable state. Not "
                  "live-verified (no QA branch) - viu_status VIU-Pending. Spec baseline "
                  "v1.6 (Confluence page 572030978 version 12, 2026-07-28)."),
        "api_related": False,
    })
    log.append("NEW-1 FLT-PARTS-13")

    # ---------------- write back ----------------
    for f, cases in files.items():
        json.dump(cases, open(f, "w"), indent=1, ensure_ascii=False)
        open(f, "a").write("\n")

    print("APPLIED %d items:" % len(log))
    for l in log:
        print("  -", l)


if __name__ == "__main__":
    main()
