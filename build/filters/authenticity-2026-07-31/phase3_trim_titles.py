#!/usr/bin/env python3
"""PHASE 3 of the Filters closing-authenticity pass (2026-07-31) — TITLE TRIMS.

User standing instruction (2026-07-27): TestRail case titles must display in full
on the case page — keep to <= ~80 characters; the detail belongs in
Steps / Expected / Preconditions, never in a long title.

37 active titles were over 80 characters (the 2026-07-31 audit counted 39 before
that pass's own edits and retirements; re-derived live here). Each is trimmed
below WITHOUT losing distinguishing detail: every phrase removed from a title was
first confirmed to be present in that case's Steps or Expected results, so the
case remains fully self-describing for a manual tester. No behaviour, no
expectation, and no other field is changed by this phase.

LOCAL ONLY — the TestRail write is the Phase 5 authorized push.
"""
import sys, os, csv, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import active, patch

LIMIT = 80

# internal id -> new title  (all <= 80 chars; detail verified present in steps/expected)
NEW = {
    "FLT-TAB-02":   "Estimates tab: Status chip greyed out and pre-filled; other four still work",
    "FLT-TAB-03":   "Completed tab: Status chip greyed out and pre-filled; other four still work",
    "FLT-PERS-02":  "Filters are remembered permanently, even after closing the browser",
    "FLT-COLL-04":  "Collapsed funnel button shows a blue indicator only when filters are active",
    "FLT-MOB-03":   "Mobile: tapping Apply filters applies the statuses and updates the count",
    "FLT-MOB-02":   "Mobile: All Filters opens a sheet of expandable rows with Apply filters",
    "FLT-API-02":   "A combined multi-filter request returns only work orders matching all filters",
    "FLT-MOB-01":   "Mobile: chips sit in a scrollable row below the tabs, starting All Filters",
    "FLT-EMPTY-01": "A filter combination with no matches shows a no-results empty state",
    "FLT-MOB-04":   "Mobile: tapping one chip opens its own sheet with an 'Apply filter' button",
    "FLT-URL-02":   "Opening a shared or bookmarked link loads the page with those filters on",
    "FLT-STAT-01":  "Status chip opens a checkbox list of all nine statuses plus Clear selection",
    "FLT-CUST-09":  "A customer with no work orders is still listed; picking them shows no rows",
    "FLT-ASSET-01": "Asset on site chip opens a dropdown with Yes and No plus Clear selection",
    "FLT-EMPTY-02": "The filtered empty state offers a way to clear the filters",
    "FLT-CUST-03":  "Selected customers show as removable tags and as ticks in the list",
    "FLT-TECH-01":  "Lead Technician chip opens a dropdown with a search field and a list",
    "FLT-TAB-04":   "My Work Orders tab shows all five filters and they narrow that list",
    "FLT-MOB-06":   "Mobile Lead Technician and Service Advisor filters offer their search lists",
    "FLT-CUST-01":  "Customer chip opens a dropdown with a search field and a customer list",
    "FLT-PERS-01":  "Leaving the page and coming back restores the filters and the bar state",
    "FLT-COLL-03":  "The filter bar's collapsed or expanded state is remembered on return",
    "FLT-COLL-02":  "Expanding the filter bar brings it back with active filters still shown",
    "FLT-CHIP-05":  "'Clear selection' in one dropdown clears only that filter",
    "FLT-CHIP-03":  "'Clear filters' shows right of the chips only when a filter is active",
    "FLT-MOB-05":   "Mobile Customer filter has search, multi-select and removable tags",
    "FLT-CHIP-02":  "A chip with several values shows the first ones and shortens the rest",
    "FLT-CHIP-06":  "Different filters combine: only work orders matching every one remain",
    "FLT-BAR-02":   "Five filter chips appear in a fixed order with an icon, name and arrow",
    "FLT-API-03":   "A request with a deleted or unknown filter value gives no server error",
    "FLT-ADV-01":   "Service Advisor chip opens a dropdown with a search field and a list",
    "FLT-PERS-04":  "A remembered filter value that no longer exists is silently dropped",
    "FLT-COLL-01":  "The toolbar funnel button collapses the bar and the table takes the space",
    "FLT-CHIP-04":  "'Clear filters' removes every active filter and resets all chips",
    "FLT-API-05":   "A filter combination matching nothing returns an empty list, not an error",
    "FLT-STAT-04":  "Clear selection in the Status dropdown unticks every status",
    "FLT-CHIP-01":  "A chip with a selected value turns blue and shows the value",
}


def main():
    cases = {c["id"]: c for _, c in active()}
    idmap = {r["internal_id"]: r["testrail_case_id"] for r in
             csv.DictReader(open("/home/user/Manual-test-Cases/build/filters/testrail-id-map.csv"))}
    over = sorted([i for i, c in cases.items() if len(c["title"]) > LIMIT],
                  key=lambda i: -len(cases[i]["title"]))
    print("titles over %d chars, re-derived live: %d" % (LIMIT, len(over)))
    assert set(over) == set(NEW), ("list drift", set(over) ^ set(NEW))

    rows = []
    for i in over:
        old, new = cases[i]["title"], NEW[i]
        assert len(new) <= LIMIT, (i, len(new))
        rows.append((i, idmap[i], len(old), len(new), old, new))
        print("%-14s %-8s %3d -> %2d" % (i, idmap[i], len(old), len(new)))
        print("    BEFORE: %s" % old)
        print("    AFTER : %s" % new)

    # no duplicate titles anywhere in the active suite afterwards
    final = [NEW.get(i, c["title"]) for i, c in cases.items()]
    dup = [t for t, n in collections.Counter(final).items() if n > 1]
    assert not dup, ("duplicate titles", dup)
    # every title still non-trivial
    assert all(len(t) >= 30 for t in NEW.values())

    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "title-trims.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["internal_id", "testrail_case_id", "len_before", "len_after",
                    "title_before", "title_after"])
        w.writerows(rows)

    print("patched:", patch({i: {"title": NEW[i]} for i in NEW}))
    after = [len(c["title"]) for _, c in active()]
    print("titles over %d after: %d | longest now: %d" % (LIMIT, sum(1 for x in after if x > LIMIT), max(after)))


if __name__ == "__main__":
    main()
