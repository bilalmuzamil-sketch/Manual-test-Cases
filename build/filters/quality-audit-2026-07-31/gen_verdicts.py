#!/usr/bin/env python3
"""Filters suite — Ruthless Usefulness Audit 2026-07-31 — generates per-case-verdicts.csv.

Source snapshot: build/filters/cases/*.json at git SHA 7eeb74548eae665f5ac5110512fddc0c8550db41
(working tree clean for build/filters at audit start). NO case files are modified;
NO TestRail writes (Standing Rule 6 — recommendation only).

Population: 137 authored cases (94 live in TestRail C29557-C29635 + C38868-C38882,
43 design-level pending with blank C-ids). 100% scored, no sampling (Rule 17).

Dimension 1 verdicts: KEEP / MERGE (member absorbed into a named survivor) /
WEAK-KEEP / CUT. Merge SURVIVORS are KEEP (they gain the members' checks);
merge MEMBERS are MERGE (canonical convention, mirrors the Report Suite
2026-07-28 audit generator).
Dimension 2 verdicts: SENSIBLE / FIX-WORDING / NONSENSE (cold read, 6 fail
conditions; every NONSENSE quotes the offending text).
Dimension 3: refs_ok (Rule-20 anchor present) + title_len (concise-title bar
<=80) columns; suite-wide ticket refs are 'Epic key TBD' (known project OQ —
backfill obligation, stated not invented).
Tier: T1 = core regression value (run every cycle); T2 = build-acceptance /
verify-once conformance (composition, labels, layout). Honest prioritisation
estimate, independent of the verdict.
"""
import json, glob, csv, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CASES_GLOB = os.path.join(HERE, '..', 'cases', '*.json')
IDMAP = os.path.join(HERE, '..', 'testrail-id-map.csv')
OUT = os.path.join(HERE, 'per-case-verdicts.csv')

# ------------------------------------------------------------- merge groups
# group -> (survivor, [members], what the survivor gains)
MERGES = {
 'MG1-CLEAR-SELECTION': ('FLT-CHIP-05',
   ['FLT-STAT-04', 'FLT-CUST-06', 'FLT-TECH-04', 'FLT-ADV-04', 'FLT-ASSET-04'],
   "the survivor gains a per-dropdown check table: repeat 'Clear selection' in each of the five dropdowns (Status, Customer, Lead Technician, Service Advisor, Asset on site) — each clears only its own filter, other active filters stay, the table recovers accordingly"),
 'MG2-CLICK-OUTSIDE': ('FLT-STAT-05',
   ['FLT-CUST-07', 'FLT-TECH-05', 'FLT-ADV-05', 'FLT-ASSET-05'],
   "the survivor gains: repeat the click-outside close in each of the other four dropdowns (Customer incl. tags still shown on reopen, Lead Technician, Service Advisor, Asset on site) — dropdown closes, selection stays applied, chip stays active"),
 'MG3-EMPTY-STATE': ('FLT-EMPTY-01',
   ['FLT-STAT-06', 'FLT-TECH-06', 'FLT-ADV-06', 'FLT-ASSET-06'],
   "the survivor gains: the empty state also appears when a SINGLE filter matches nothing — one leg each for a no-work-order status, an unassigned technician, an unassigned advisor and an unmatched Asset on site option (seed per Rule 14)"),
 'MG4-COLLAPSE-EXPAND': ('FLT-COLL-01',
   ['FLT-COLL-02'],
   "the survivor gains the expand half: clicking the funnel again brings the bar back below the tab row with the previously selected filters still shown active (blue) and the 'Clear filters' link still present"),
 'MG5-DROPDOWN-OPEN': ('FLT-CUST-01',
   ['FLT-TECH-01', 'FLT-ADV-01'],
   "the survivor gains: repeat on the Lead Technician chip (placeholder 'Search technician') and the Service Advisor chip (placeholder 'Search advisor') — same search field + scrollable list + 'Clear selection' layout"),
 'MG6-TYPEAHEAD': ('FLT-CUST-02',
   ['FLT-TECH-02', 'FLT-ADV-02'],
   "the survivor gains: repeat the type-to-narrow / delete-to-restore check in the Lead Technician and Service Advisor search fields"),
 'MG7-TAG-SELECT': ('FLT-CUST-03',
   ['FLT-CUST-04'],
   "the survivor gains the removal half: click the x on one selected customer's tag — that tag and its list checkmark go, the other selections stay, the table drops that customer's work orders"),
 'MG8-DEACTIVATED-STAFF': ('FLT-TECH-07',
   ['FLT-ADV-07'],
   "the survivor gains: repeat with a deactivated advisor on the Service Advisor filter — same active-staff-only rule (engineering: the dropdowns request active staff only)"),
 'MG10-ALLTAB-COMPOSITION': ('FLT-BAR-02',
   ['FLT-TAB-01'],
   "the survivor gains: precondition 'You are on the All tab' + a final check that each of the five chips opens its dropdown and is usable there"),
 'MG11-PREFILTERED-TABS': ('FLT-TAB-02',
   ['FLT-TAB-03'],
   "the survivor gains: repeat on the Completed tab — Status chip greyed out and pre-filled with that tab's status, other four chips usable, a customer selection narrows the pre-filtered Complete list"),
 'MG12-URL-REFLECT': ('FLT-URL-02',
   ['FLT-URL-01'],
   "the survivor gains the outbound direction: applying filters puts the filter state into the address bar, clearing all filters removes it again (capture the URL there for the share step)"),
 'MG13-MOBILE-SHEET-FILTERS': ('FLT-MOB-05',
   ['FLT-MOB-06', 'FLT-MOB-07'],
   "the survivor gains: expand the Lead Technician row ('Search technician' + list) and the Service Advisor row ('Search advisor' + list); expand Asset on site (Yes / No single-select + 'Clear selection'); applying any of them filters the list"),
 'MG14-PARTS-CHIP-MATRIX': ('FLT-PARTS-01',
   ['FLT-PARTS-02', 'FLT-PARTS-03', 'FLT-PARTS-04', 'FLT-PARTS-05', 'FLT-PARTS-06',
    'FLT-PARTS-07', 'FLT-PARTS-08', 'FLT-PARTS-10'],
   "the survivor becomes ONE Parts walk with a per-view checklist of the designed filter buttons: Inventory (Bin Location, Category, Supply, Vendor) - Part Sales (Status, Customer, Created by, Date) - Catalog (Manufacturer, Category) - Returns (Vendor, Category, Part Type) - Credits (Vendor, Date, Processed by) - Purchase Orders (Vendor, Status, Date, Ordered by) - Vendor Invoices (Vendor, Invoice date, Date received, Received by) - Vendors (Vendor, State/Province); plus one line: every Parts list page shows the shared Search and funnel toolbar icons"),
 'MG15-REPORTS-CHIP-MATRIX': ('FLT-RPTS-01',
   ['FLT-RPTS-02', 'FLT-RPTS-03', 'FLT-RPTS-04', 'FLT-RPTS-05', 'FLT-RPTS-06',
    'FLT-RPTS-07', 'FLT-RPTS-08', 'FLT-RPTS-09', 'FLT-RPTS-10', 'FLT-RPTS-11',
    'FLT-RPTS-12', 'FLT-RPTS-13', 'FLT-RPTS-14', 'FLT-RPTS-15', 'FLT-RPTS-16',
    'FLT-RPTS-17', 'FLT-RPTS-18', 'FLT-RPTS-19', 'FLT-RPTS-20'],
   "the survivor becomes ONE Reports walk with a per-report checklist of the designed filter buttons (21 reports/tabs, e.g. Timesheet Activities: Staff, Date, Status, Modified by - Payroll Timesheet: Employee, Date - Sales: Customer, Date - Technician Efficiency (both tabs): Customer, Technician, Date - Advisor Analysis - Shop Efficiency: Date only - Work in Progress - Sales Follow Up - Sales Tax (per tab) - A/R Aging x3 - A/P Aging x3 - Notes: Author, Date, Mention - Reminders: Date only - IBS Batch Transactions - QB Unexported: first chip changes per tab); the tab-bearing reports get an explicit switch-tab step; column lists stay as reference notes, not assertions"),
}

# ------------------------------------------------------------- cuts
CUTS = {
 'FLT-BAR-03': "Duplicate of FLT-TAB-02 (C29609): 'the remaining four chips stay visible/usable on Estimates' is already expected lines 1-2 there.",
 'FLT-COLL-03': "Duplicate of FLT-PERS-01 (C29613): bar collapsed/expanded state restored after leaving and returning is already expected lines 2-3 there.",
 'FLT-SRCH-01': "Duplicate across projects: the spotlight/Command-K component is covered by the Global Search project's authored suite (86 cases); engineering (tech plan headline 5) says it is the wrong component for the Filters programme — transfer/retire pending Branko Q6 (PO decides).",
 'FLT-SRCH-02': "Duplicate across projects (Global Search suite covers entity tabs); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-03': "Duplicate across projects (Global Search suite covers grouped results/highlighting); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-04': "Duplicate across projects (Global Search suite covers recent searches); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-05': "Duplicate across projects (Global Search suite covers persisting search); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-06': "Duplicate across projects (Global Search suite covers hover quick-actions); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-07': "Duplicate across projects (Global Search suite covers keyboard navigation); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-08': "Duplicate across projects (Global Search suite covers the results panel incl. Refresh); wrong component for Filters per engineering — pending Branko Q6.",
 'FLT-SRCH-09': "Not a test case — a QA/PO scope decision ('which project owns page search') dressed as a case; the decision already lives in the Branko question sheet (Q6), not in TestRail.",
}

# ------------------------------------------------------------- weak-keeps
WEAK = {
 'FLT-MOB-09': "Absence assertion (no collapse toggle on mobile) — spec'd (S12-R4) but a failure is cosmetic-severity; kept, flagged low-value.",
 'FLT-MOB-10': "Mobile repeat of the filtered empty state — the mobile surface can genuinely render differently, but the yield beyond FLT-EMPTY-01 is low; kept, flagged.",
 'FLT-API-05': "Empty-match-returns-200 is thin — largely implied by FLT-API-02 (combination request) + FLT-EMPTY-01 (page renders the state); kept for the explicit no-error backend contract, flagged low-value.",
}

# ------------------------------------------------------------- keep reasons
KEEP = {
 'FLT-BAR-01': "Entry contract — the filter bar renders below the tabs, expanded by default; failure = the feature is invisible to every user.",
 'FLT-BAR-02': "Chip composition contract (five chips, fixed order, icons, chevrons) + design-typo watch; survivor of MG10 (gains the All-tab usability check).",
 'FLT-STAT-01': "Option-list contract — all nine statuses in the stated order with 'Clear selection'; a missing/misordered status is a real reportable bug.",
 'FLT-STAT-02': "The headline real-time filtering contract (tick = table updates immediately, no apply button on desktop).",
 'FLT-STAT-03': "OR-within-a-filter semantics + the no-selection-limit product decision; broken = wrong results, a customer-facing data bug.",
 'FLT-STAT-07': "Imported exclusivity gate (separate data source) — combined-filter corruption risk; explicitly regression-flagged by engineering; pending Branko confirmation.",
 'FLT-STAT-05': "Click-outside closes the dropdown and keeps the selection applied — the shared popover dismiss contract; survivor of MG2 (gains the other four dropdowns as repeat checks).",
 'FLT-COLL-01': "The collapse/expand funnel toggle round trip incl. table reclaiming space; survivor of MG4 (gains the expand-restores-filters half).",
 'FLT-COLL-04': "Collapsed-with-active-filters indicator — prevents the 'invisible filtering' trap where a user cannot see why the list is short.",
 'FLT-COLL-05': "Active filters keep filtering while the bar is hidden — a real data-visibility bug if collapsing paused or dropped the filters.",
 'FLT-CUST-01': "The searchable multi-select dropdown's open state (search field, list, 'Clear selection'); survivor of MG5 (gains the Technician/Advisor twins as repeat checks).",
 'FLT-CUST-02': "Type-ahead narrowing of the shared people list; survivor of MG6 (gains the Technician/Advisor repeat checks).",
 'FLT-CUST-03': "Tag/checkmark multi-select contract incl. ellipsis and the no-limit decision; survivor of MG7 (gains the remove-one-tag half).",
 'FLT-CUST-05': "Customer-ACCOUNT filtering semantics (not the contact person, per engineering G3) — a wrong-field bug here misfilters every customer's list.",
 'FLT-CUST-08': "In-dropdown no-results message — correctly authored ONCE for the shared search list, not per filter.",
 'FLT-CUST-09': "Customers with no work orders must still be offered in the list (S3-E1) — a real selectable-options bug, plus the empty-result leg.",
 'FLT-TECH-03': "Lead-only matching — the one semantic that distinguishes this filter from 'any assigned technician'; a classic wrong-field bug.",
 'FLT-TECH-07': "Deactivated staff excluded from the filter list (activeOnly per engineering G5); survivor of MG8 (gains the Advisor twin).",
 'FLT-ADV-03': "Advisor-assignment filtering semantics on its own backing field; wrong-field bugs are per-filter distinct.",
 'FLT-ASSET-01': "Yes/No dropdown composition — dropdown-not-toggle was an explicit product decision (spec §4).",
 'FLT-ASSET-02': "On-site = Yes filtering against the real on-site data field (data source flagged OQ-6).",
 'FLT-ASSET-03': "Single-select replacement semantics — this chip alone replaces rather than accumulates selections.",
 'FLT-ASSET-07': "The brand-new 'No' backend path engineering explicitly flags for functional verification (tech plan G4/4-1.6) — regression-watch.",
 'FLT-CHIP-01': "Active-chip state contract — chip turns blue and displays the selected value; the at-a-glance feedback the whole bar is for.",
 'FLT-CHIP-02': "Multi-value chip label composition (list+ellipsis vs count — spec-vs-design flagged, to pin at VIU).",
 'FLT-CHIP-03': "'Clear filters' appears only when at least one filter is active — presence/absence both asserted in one case.",
 'FLT-CHIP-04': "One-click clear-all contract across every active filter.",
 'FLT-CHIP-05': "Per-dropdown 'Clear selection' clears ONLY its own filter; survivor of MG1 (gains the five per-chip twins as a check table).",
 'FLT-CHIP-06': "AND-across-filters combination semantics — the load-bearing multi-criteria contract of the whole feature.",
 'FLT-EMPTY-01': "The filtered empty state (message, no error, not a bare grid); survivor of MG3 (gains the single-filter empty legs).",
 'FLT-EMPTY-02': "The empty state's clear-filters escape action — a distinct interactive contract (S8-R4), not just display.",
 'FLT-TAB-02': "Pre-filtered tab contract — greyed pre-filled Status chip per Branko's 2026-07-17 ruling, other chips narrow on top; survivor of MG11 (gains the Completed twin).",
 'FLT-TAB-04': "My Work Orders scope contract — filters narrow the user-scoped list and never widen it to other users' work orders.",
 'FLT-TAB-05': "Selections survive tab switching incl. the hidden-Status round trip (retained in memory, restored on All).",
 'FLT-TAB-06': "Landing-tab default (Estimates) + last-used-tab memory; regression = wrong landing view for every user; pending Branko (engineering D10).",
 'FLT-PERS-01': "Round-trip restore of filters + bar state after leaving the page — the basic persistence contract.",
 'FLT-PERS-02': "Permanent per-account persistence (Branko ruling 2026-07-17) incl. the cross-device leg — account-level, not browser-level.",
 'FLT-PERS-03': "Per-user isolation of saved filters — one user's filters leaking to another is a real (privacy-adjacent) bug.",
 'FLT-PERS-04': "A vanished saved value is silently dropped, valid remainder still applies — resilience of the saved state.",
 'FLT-PERS-05': "Per-view/per-tab state scoping (engineering D20) — regression = filters bleeding across Parts views / report tabs.",
 'FLT-PERS-06': "Release-critical one-time migration — existing users must not lose pre-redesign saved filters/columns/sorting.",
 'FLT-URL-02': "Shared/bookmarked link opens with the filters applied — the shareable-state contract; survivor of MG12 (gains the URL-updates direction).",
 'FLT-URL-03': "A deleted value in a shared URL is ignored cleanly — distinct entry path from the saved-prefs case (FLT-PERS-04).",
 'FLT-URL-04': "Malformed filter URL loads unfiltered with no error (S11-N1) — hardening of a user-visible entry path.",
 'FLT-URL-05': "A link visit is view-only and never overwrites your saved filters (engineering G7) — losing saved state would be destructive; pending Branko spec ratification.",
 'FLT-MOB-01': "Mobile chip-row layout (All Filters first, horizontal scroll, edge affordance) — the mobile entry contract.",
 'FLT-MOB-02': "All Filters bottom-sheet composition (drag handle, title, accordion rows, sticky 'Apply filters').",
 'FLT-MOB-03': "Mobile batch-apply contract + applied-count in the sheet title — mobile's key behavioural difference from desktop.",
 'FLT-MOB-04': "Individual-chip sheet with 'Apply filter' — carries the flagged design-vs-tech-plan conflict (D15 real-time) to resolve at VIU.",
 'FLT-MOB-05': "Mobile sheet parity for the people/asset filters (search, tags, remove, apply); survivor of MG13 (gains the Technician/Advisor/Asset rows).",
 'FLT-MOB-08': "Mobile active chips + 'Clear filters' parity — the clear-all contract on the second surface.",
 'FLT-API-01': "The backend actually filters (parameters on the list request, filtered response) — not client-side hiding; the foundation of every filter case.",
 'FLT-API-02': "Combined request semantics at the backend (AND across filters, OR within one) — the server half of FLT-CHIP-06.",
 'FLT-API-03': "Deleted/unknown filter value never produces a 5xx — backend hardening for the stale-saved-state paths.",
 'FLT-API-04': "Malformed filter parameters handled gracefully (no 5xx/crash) — backend half of the malformed-URL requirement.",
 'FLT-API-06': "Saved-prefs service round-trip (PUT/GET) + per-user isolation — a cross-user leak here is a security bug (engineering 4-1.3 contract).",
 'FLT-PARTS-01': "Parts chip-composition contract; survivor of MG14 — ONE Parts walk with the per-view filter-button checklist (8 views + shared toolbar icons).",
 'FLT-PARTS-09': "Part Type menu contents (Core / Non Core + 'Clear selection') — the one Parts dropdown whose option list the design pins.",
 'FLT-PARTS-11': "The Parts filtering behaviour contract (choose value -> list narrows, value shown) — the load-bearing case for the whole Parts rollout; pending Branko's PRD.",
 'FLT-PARTS-12': "Parts multi-select + per-filter clear + clear-all parity with Work Orders — pending Branko's PRD.",
 'FLT-RPTS-01': "Reports chip-composition contract; survivor of MG15 — ONE Reports walk with the per-report filter-button checklist (21 reports/tabs).",
 'FLT-RPTS-21': "The Reports filtering behaviour contract — the load-bearing case for the whole Reports rollout; pending Branko's PRD.",
 'FLT-RPTS-22': "New filter types (Location, Transaction Type, Invoice Status, Type, User, Mention) open and filter — the net-new controls of the Reports rollout; pending Branko's PRD.",
 'FLT-RPTS-23': "The new date-range chip type's whole contract (no presets, no default, applies on the second date, one range at a time) — used by nearly every report.",
 'FLT-PSRCH-01': "The new page-search component's states + as-you-type behaviour (blur rules deliberately merged in at authoring).",
 'FLT-PSRCH-02': "Search + filters AND-combination and independent clearing — the core interaction contract of the toolbar search.",
 'FLT-PSRCH-03': "Search-text persistence incl. the no-match-restore rule (S10-N2) — easy to regress.",
 'FLT-PSRCH-04': "Search term in the shareable URL + malformed handling + the view-only rule — distinct subject from the filter URL cases.",
 'FLT-PSRCH-05': "Mobile inline search expansion + the D21 toolbar restructure (icon collapse into a 'more' menu) on named pages.",
 'FLT-PSRCH-06': "The Story-14 safety sweep: no list surface silently loses its text search (engineering risk 9).",
 'FLT-PSRCH-07': "The removal contract itself: the top navigation search must stop filtering page lists app-wide.",
}

# ------------------------------------------------------------- sense check
SENSE_OK = ("Cold-read PASS: preconditions reachable (seeding stated where needed), steps "
            "executable in order, expected follows, no contradiction, controls spec/design-"
            "traceable (unpinned behaviour explicitly hedged — the honest pattern), "
            "pass/fail observable.")
FIXW = {
 'FLT-BAR-02': "State the tab in the preconditions: the default landing tab is Estimates (per FLT-TAB-06) where the Status chip renders greyed/pre-filled, so 'five chips each with icon, name and arrow' only reads cleanly on the All tab — add 'You are on the All tab'.",
 'FLT-ASSET-02': "Expected 3 (the No direction) is broader than the steps drive (steps only choose Yes) and is FLT-ASSET-07's subject — drop expected 3.",
 'FLT-RPTS-04': "Expected claims the chips appear 'on both the Invoiced and Completed tabs' but no step switches tabs — add a step to open each tab.",
 'FLT-RPTS-09': "Expected list numbering repeats '2.' (the trailing design-placeholder note reuses the number) — renumber the expected list.",
 'FLT-RPTS-11': "Expected list numbering repeats '2.' — renumber the expected list.",
 'FLT-RPTS-12': "Expected list numbering runs 1, 2, 3, then '2.' again — renumber the expected list.",
 'FLT-RPTS-13': "Expected list numbering repeats '2.' — renumber the expected list.",
 'FLT-RPTS-14': "Expected list numbering repeats '2.' — renumber the expected list.",
 'FLT-RPTS-15': "Expected list numbering repeats '2.' — renumber the expected list.",
 'FLT-RPTS-16': "Expected list numbering repeats '2.' — renumber the expected list.",
 'FLT-RPTS-20': "Expected describes the chips on all three tabs but no step switches tabs — add 'switch between the Customers, Vendors and Journal Entries tabs'.",
 'FLT-RPTS-21': "Expected 1 says 'the report updates to show only the rows matching the chosen filter value' but the steps never choose a value (they only look at the buttons) — insert a select-a-value step (mirror FLT-PARTS-11 step 2) and fix the grammar 'go to the any (for example Sales) report'.",
}
NONSENSE = {
 'FLT-SRCH-09': ("NONSENSE (F6 not actionable / F1 not executable): step 1 reads 'Review where "
                 "the page search / Command-K component is owned for testing' and expected 1 reads "
                 "'The page-search component is agreed to belong to either the Filters test suite "
                 "or the Global Search test suite, not both' — a manual tester cannot execute an "
                 "ownership agreement; this is a QA/PO scope decision (Branko Q6), not a test. "
                 "Recommend CUT (decision tracked in the PO question sheet)."),
}

# ------------------------------------------------------------- tiers
T1 = {
 'FLT-STAT-02','FLT-STAT-03','FLT-STAT-07','FLT-CUST-05','FLT-TECH-03','FLT-ADV-03',
 'FLT-ASSET-02','FLT-ASSET-03','FLT-ASSET-07','FLT-CHIP-04','FLT-CHIP-05','FLT-CHIP-06',
 'FLT-EMPTY-01','FLT-EMPTY-02','FLT-TAB-02','FLT-TAB-04','FLT-TAB-05','FLT-TAB-06',
 'FLT-PERS-01','FLT-PERS-02','FLT-PERS-03','FLT-PERS-04','FLT-PERS-05','FLT-PERS-06',
 'FLT-URL-02','FLT-URL-03','FLT-URL-04','FLT-URL-05','FLT-COLL-05',
 'FLT-MOB-03','FLT-MOB-05','FLT-MOB-08',
 'FLT-API-01','FLT-API-02','FLT-API-03','FLT-API-04','FLT-API-05','FLT-API-06',
 'FLT-PSRCH-01','FLT-PSRCH-02','FLT-PSRCH-03','FLT-PSRCH-04','FLT-PSRCH-06','FLT-PSRCH-07',
 'FLT-PARTS-11','FLT-PARTS-12','FLT-RPTS-21','FLT-RPTS-22','FLT-RPTS-23',
}

def main():
    cases = []
    for f in sorted(glob.glob(CASES_GLOB)):
        fname = os.path.basename(f)
        for c in json.load(open(f)):
            c['_file'] = fname
            cases.append(c)
    assert len(cases) == 137, len(cases)

    idmap = {r['internal_id']: r['testrail_case_id'].strip()
             for r in csv.DictReader(open(IDMAP))}

    member2group = {}
    survivor2group = {}
    for g, (surv, members, gains) in MERGES.items():
        survivor2group[surv] = g
        for m in members:
            member2group[m] = g

    rows = []
    tally = {'KEEP': 0, 'MERGE': 0, 'WEAK-KEEP': 0, 'CUT': 0}
    sense_tally = {'SENSIBLE': 0, 'FIX-WORDING': 0, 'NONSENSE': 0}
    keep_but_nonsense = []
    long_titles = []
    missing_refs = []

    for c in cases:
        cid = c['id']
        tr = idmap.get(cid, '')
        link = ('https://shopview.testrail.io/index.php?/cases/view/' + tr.lstrip('C')) if tr else 'new, no C-ID yet'
        # dimension 1
        if cid in CUTS:
            verdict, reason, mg, ms = 'CUT', CUTS[cid], '', ''
        elif cid in WEAK:
            verdict, reason, mg, ms = 'WEAK-KEEP', WEAK[cid], '', ''
        elif cid in member2group:
            g = member2group[cid]
            surv = MERGES[g][0]
            verdict = 'MERGE'
            reason = ("Absorbed into %s (%s): same behaviour/component re-authored per entity — "
                      "runs in one sitting on the same screen; the survivor gains this case's checks."
                      % (surv, idmap.get(surv, 'no C-ID yet') or 'no C-ID yet'))
            mg, ms = g, surv
        elif cid in KEEP:
            verdict, reason = 'KEEP', KEEP[cid]
            mg = survivor2group.get(cid, '')
            ms = cid if mg else ''
        else:
            raise SystemExit('UNSCORED CASE: ' + cid)
        tally[verdict] += 1
        # dimension 2
        if cid in NONSENSE:
            sv, sr = 'NONSENSE', NONSENSE[cid]
        elif cid in FIXW:
            sv, sr = 'FIX-WORDING', FIXW[cid]
        else:
            sv, sr = 'SENSIBLE', SENSE_OK
        sense_tally[sv] += 1
        if verdict == 'KEEP' and sv == 'NONSENSE':
            keep_but_nonsense.append(cid)
        # dimension 3
        refs_ok = bool(c.get('spec_ref') or c.get('design_ref') or c.get('refs'))
        if not refs_ok:
            missing_refs.append(cid)
        tlen = len(c['title'])
        if tlen > 80:
            long_titles.append((cid, tlen))
        rows.append({
            'internal_id': cid, 'testrail_case_id': tr, 'testrail_link': link,
            'file': c['_file'], 'section': c.get('area', ''), 'title': c['title'],
            'verdict': verdict, 'reason': reason,
            'merge_group': mg, 'merge_survivor': ms,
            'tier': 'T1' if cid in T1 else 'T2',
            'sense_verdict': sv, 'sense_reason': sr,
            'refs_ok': 'yes' if refs_ok else 'MISSING-TRACEABILITY',
            'title_len': tlen,
        })

    with open(OUT, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    survivors = len(MERGES)
    members = sum(len(m) for _, m, _ in [v for v in MERGES.values()])
    recommended = tally['KEEP'] + tally['WEAK-KEEP']
    print('Scored:', len(rows), 'of 137 (100%, no sampling)')
    print('Dimension 1:', tally, '| merge groups:', survivors, '| members absorbed:', members)
    print('HEADLINE: 137 ->', recommended, 'recommended (KEEP %d incl. %d merge survivors + WEAK-KEEP %d)'
          % (tally['KEEP'], survivors, tally['WEAK-KEEP']))
    print('Dimension 2:', sense_tally)
    print('KEEP-but-NONSENSE (embarrassment check):', keep_but_nonsense or 'EMPTY — none')
    print('Dimension 3: missing-traceability =', len(missing_refs), missing_refs or '(none)')
    print('Dimension 3: titles > 80 chars =', len(long_titles))
    # consistency assertions
    assert sum(tally.values()) == 137 == sum(sense_tally.values())
    assert not keep_but_nonsense, 'KEEP-but-NONSENSE must be resolved: %s' % keep_but_nonsense
    for g, (surv, mems, _) in MERGES.items():
        srow = next(r for r in rows if r['internal_id'] == surv)
        assert srow['verdict'] == 'KEEP', (g, surv, srow['verdict'])
        for m in mems:
            mrow = next(r for r in rows if r['internal_id'] == m)
            assert mrow['verdict'] == 'MERGE' and mrow['merge_survivor'] == surv
    print('Consistency assertions: PASS')

if __name__ == '__main__':
    main()
