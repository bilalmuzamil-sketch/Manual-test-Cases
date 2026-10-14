#!/usr/bin/env python3
"""Classify every row of the 14 Oct 2026 design text inventory (Rule 124 gate (b): zero unclassified).

    python3 -I classify.py <inventory.json> <supplementary.json> <images.json> <package dir> <out stem>

Inputs: the design_text_inventory.py output (board + library + sweep/flow texts), the supplementary pass (texts the tool's
word filter drops), and the hand transcription of every image. Writes <stem>.json / <stem>.md with one row per text:
class (DATA / COVERED / OUT-OF-SCOPE / SPEC-CONFLICT / CASE-NEEDED, or NOT-ON-SCREEN for code tokens the extractors
picked up), the reason, and the C-ids (all 258 case snapshots, any author) where COVERED.
Expected behaviour comes from the spec (Confluence 845185030 page v48, captured 2026-10-14); the design never sets it.
Rows no rule decides are printed as UNCLASSIFIED and the script exits 1 — the curated table below is then extended by
the reader, never guessed.
"""
import json, re, sys, pathlib, collections
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import caseindex as ci

inv, supp, imgs, pkg, stem = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), json.load(open(sys.argv[3])), pathlib.Path(sys.argv[4]), sys.argv[5]

# ------------------------------------------------------------------------------------------------ DATA vocabulary
BOARDS = ["Work Orders.dc.html", "Work Orders -no page-fix-.dc.html", "Work Orders Details.dc.html"]
vocab = set()
for b in BOARDS:
    src = (pkg / b).read_text(encoding="utf-8").splitlines()
    take = False
    for line in src:
        if re.match(r"\s*const (WORK_ORDERS|DEMO_LINES|DEMO_LINES_DEFAULT|LINE_POOL|TECHS) = ", line):
            take = True
        if take:
            for m in re.finditer(r'"([^"\\]{2,})"', line):
                vocab.add(m.group(1).replace("’", "'"))
            if re.match(r"^\];?\s*$|^\};?\s*$", line):
                take = False
ap = (pkg / "wo-details/Add Part.html").read_text(encoding="utf-8")
for m in re.finditer(r"\{ code:'([^']+)', desc:'([^']+)', stock:'([^']+)'.*?cat:'([^']+)'(.*?)\}\s*,?\s*$", ap, re.M):
    vocab.update([m.group(1), m.group(2), m.group(3), m.group(4)]); vocab.update(re.findall(r"name:'([^']+)'", m.group(5)))
BUNDLE = pkg / "_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bundle.js"
for line in BUNDLE.read_text(encoding="utf-8").splitlines()[3427:3434]:
    vocab.update(re.findall(r'"([^"]{2,})"', line))
vocab.update(["Aaron Keating", "James Smith", "Floyd Miles", "Brenda Martinez", "Cameron Williamson", "Esther Howard", "Ralph Edwards",
              "Jenny Wilson", "Theresa Webb", "Kristin Watson", "Truck Shop", "Trailer Shop", "Mobile Service", "Welding"])
STATUS = {"Approved", "Estimate", "In progress", "In Progress", "Invoiced", "Paid", "Declined", "Imported", "Review", "Complete", "Ready for Review"}
TOKEN = re.compile(r"^(?:\d+…|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2},|\d{4}|\d+\.\d+|/|hrs|parts?|BM|TW|JW|KW|EH|RE|AK|\d+|[A-Z][a-z]{2} \d{1,2}(?:, \d{4})?…?|\$[\d,.]+…|S\d-\d+|[A-Z]{2,4}-\d+|\$?[\d,]+(?:\.\d+)?%?|−?\$[\d,]+\.\d\d|[A-Z][a-z]{2} \d{1,2}, \d{4}|\d+:\d\d|\d+(?:\.\d)? / \d+(?:\.\d)? hrs|[A-Z]{2}|\d+ (?:EA|L)|[-—·]|\d+ parts?|[A-HJ-NPR-Z0-9]{17})$")


def is_data(t):
    t2 = t.replace("’", "'")
    if t2 in vocab or t2 in STATUS:
        return True
    rest = t2
    for v in sorted(vocab | STATUS, key=len, reverse=True):
        if len(v) > 3 and v in rest:
            rest = rest.replace(v, " ")
    toks = [x for x in re.split(r"\s+·\s+|\s{2,}|\s+(?=S\d-)|\s", rest) if x.strip()]
    return bool(toks) and all(TOKEN.match(x) for x in toks) or (not toks and rest != t2)


# ------------------------------------------------------------------------------------------------ curated rulings
SPEC = "PRD (Confluence 845185030, page v48, 12 Oct 2026)"
K = {}  # exact text -> (class, reason, [C-ids])


def k(texts, cls, reason, cids=()):
    for t in texts if isinstance(texts, (list, tuple)) else [texts]:
        K[t.replace("’", "'")] = (cls, reason, list(cids))


# --- NEW in this export: the List preview panel ("Work Order Peek", Work Orders Details.dc.html)
PEEK = ("NEW 14 Oct: List row-click preview panel. " + SPEC + " §3 Goals: \"List remains the default and is unchanged from production; the only "
        "addition to the Work Orders page is the display switcher.\" The panel changes List → PO question PQ-14-1 (TRIAGE file)")
k(["Work Order Peek", "Work order preview", "Close preview", "Close (Esc)", "Loading work order", "Open Work Order", "Opening", "wide", "narrow",
   ], "SPEC-CONFLICT", PEEK, [96932, 96946, 368200, 368201, 368214])
k(["Opening {…}"], "SPEC-CONFLICT", PEEK + " (toast after 'Open Work Order')", [96932, 96946, 368200, 368201, 368214])
k(["Service - PM-A inspection", "Full PM-A per fleet schedule. Check DEF system, brakes, lights.", "Repair - Brake chamber, rear axle",
   "Pushrod stroke over limit on axle 2. Replace chamber and adjust slack.", "Diagnostic - Check engine light", "Pull codes, verify complaint on road test.",
   "Repair - Coolant leak at water pump", "Weeping at pump weep hole. Pressure test cooling system.", "Repair - Marker lamps, driver side",
   "Repair - Alternator not charging", "Output at 12.4V running. Test belt tension and alternator."], "DATA",
  "NEW 14 Oct: LINE_POOL — demo line titles/stories the preview shows for work orders without hand-written lines")
k(["tbody tr", 'button, a, input, select, label, [role="menuitem"]'], "NOT-ON-SCREEN", "CSS selector in the peek click handler (code), not displayed")
# --- toolbar / display switcher / density (known divergences — PROJECT-STATE list, register W-questions)
k(["Table", "By Lead Tech", "Board"], "SPEC-CONFLICT", "KNOWN (PROJECT-STATE divergence 3 / W-1): switcher tooltips 'Table / By Lead Tech / Board' vs spec S1-R1 'List, Tech View, and Board View'. Still in this export", [96909])
k(["Details"], "OUT-OF-SCOPE", "Hidden 'Details' display (showDetailsView false; tech plan: untracked design delta, 'the PRD wins'). The new Details board removes it (defaultView 'details' maps to List)")
k(["Row height", "Small", "Medium", "Large", "Card size", "Compact", "Detailed", "Card detail", "Number, customer, status", "Adds hours, progress, totals", "detailed", "medium", "large", "small"],
  "SPEC-CONFLICT", "KNOWN (PROJECT-STATE divergence 1, register): 'Row height Small/Medium/Large' and 'Card size Compact/Detailed' vs spec 'Compact, Regular (default), or Comfortable'. Still in this export", [96955, 96987, 96992])
k(["Columns"], "COVERED", "Columns picker (S5); Board View has no Fields to display picker — KNOWN divergence 2 (UX-12)", [96927, 96975, 96979])
k(["Always shown"], "OUT-OF-SCOPE", "Columns dropdown section for always-on columns — the Work Orders screen passes hideLocked (bundle L11938), so no board shows it")
k(["Find a column", "No columns match", "Show all", "Reset to default"], "CASE-NEEDED",
  "Columns menu search/no-match/Show all/Reset — design-only, no spec wording. 8 Oct cases C368160 and C368164 are NOT in today's 258 snapshots (deleted or moved?) — lead session to confirm; developer handoff 8 Oct: not in this release (Blocked, not Failed)")
k(["Collapse all", "Expand all"], "CASE-NEEDED", "Tech View 'Collapse all / Expand all' — design-only (spec S2-R5 per group). 8 Oct case C368162 is NOT in today's snapshots — lead session to confirm; developer handoff: not in this release")
k(["Collapse", "Expand"], "COVERED", "Per-group collapse/expand control tooltip (S2-R5)", [96928, 228762, 368125])
# --- empty states
k(["No work orders match these filters", "Try removing a filter to widen your results.", "Clear all filters"], "CASE-NEEDED",
  "Spec CHANGED (v43, 8 Oct): S1-N1a now reads exactly as the design (“No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button) — the old W-13 conflict is resolved for filters. No case in today's 258 snapshots asserts it (C96918, which asserted the old text, is no longer in the set)")
k(["No results for “{…}”", "No results for \"{…}\"", "Check the spelling, or search by work order number, customer, unit or VIN.", "Try a different search term or remove a filter."],
  "SPEC-CONFLICT", "Search-only empty state: design 'No results for “…”' + 'Check the spelling, or search by work order number, customer, unit or VIN.' vs spec S1-N1b “No work orders match the search \"{search}\".” and no button — narrows KNOWN W-13 (spec v43). 'Try a different search term or remove a filter.' (search + filters) vs S1-N1a")
k(["No work orders assigned", "Drag a work order here to assign it"], "SPEC-CONFLICT", "KNOWN (PROJECT-STATE divergence 5): empty group label vs spec S2-R15 “No work orders”. Still in this export", [96931, 96950])
k(["Nothing here yet", "No work orders yet", "Add technicians and create your first work order to track work by tech.", "Create a work order and assign a technician to see it here.",
   "Opening Add Technician", "Opening New Work Order", "nothing", "off"], "OUT-OF-SCOPE",
  "Review-frame first-run states (emptyState prop, designer review only): a location with no work orders at all. Spec has no requirement for it; the no-technicians half is covered (C368130). Not a release screen")
k(["No technicians yet", "Add technicians to assign work orders. Until then, every work order stays in Unassigned.", "Add Technician"], "COVERED", "Organization with no technicians (spec 'Design updates required': an organization with no technicians, in both new views)", [368130])
# --- reassign / menus / toasts
k(["Reassign Lead Tech", "Assign Tech"], "SPEC-CONFLICT", "KNOWN (register notes, label difference): design 'Reassign Lead Tech' / 'Assign Tech' vs spec 'Reassign lead technician'. Cases follow the spec", [96956, 96957])
k(["Unassign"], "COVERED", "Remove-lead action in the card/row menu (S4)", [96961])
k(["Search technicians"], "COVERED", "Reassign dialog search", [96956, 368163])
k(["No technicians match “{…}”", "No technicians match “"], "COVERED", "Reassign dialog no-match (8 Oct NEW-F-02 → C368163)", [368163])
k(["{…} open", " open", "open", "0 open", "1 open", "2 open", "3 open", "4 open"], "SPEC-CONFLICT", "KNOWN (register: \"'N open' counts every status\"): the design counts every work order in the technician's column vs S4-R15 “The dialog’s N open count includes Approved, In Progress, Ready for Review, and Complete work orders.” Cases assert the spec. Still in this export", [96974, 97032])
k(["Cancel", "Close"], "COVERED", "Reassign dialog Cancel / X (S4-R14)", [96956])
k(["lead technician set to", " lead technician set to ", "assigned to", " assigned to ", "moved to Unassigned", " moved to Unassigned", "{…} assigned to {…}", "{…} lead technician set to {…}", "{…} moved to Unassigned"],
  "SPEC-CONFLICT", "KNOWN (register): drag/assign toast '<number> assigned to / lead technician set to / moved to Unassigned' vs spec S4-R5 “Lead technician updated” / “Lead technician removed”", [96957])
k(["Undo", "Assignment undone", "Dismiss"], "OUT-OF-SCOPE", "Undo on the reassignment message — ruled out by the PO (Chris Ward 29 Sep; 8 Oct triage). 'Dismiss' = the toast close X")
k(["Up to {…} pinned columns — unpin one first", "pinned columns — unpin one first", "Up to {…} pinned columns", "Up to 5 pinned columns — unpin one first", "Up to 5 pinned columns"],
  "SPEC-CONFLICT", "KNOWN (register): pin limit 5 in the design vs spec three pinned technicians (S2-R11 “Allow up to three pinned technician groups in Tech View.”)", [96939, 96949])
k(["Pin column", "Unpin column", "pinned", "unpinned", "{…} pinned", "{…} unpinned"], "COVERED", "Pin / unpin control and its message (optional observation in C96947)", [96947, 204100, 96952])
k(["Drag to reorder technicians", "Drag to reorder pinned columns", "Drag to scroll"], "COVERED", "Drag-handle tooltips (S9); minimap 'Drag to scroll' = open PO question W-5", [97004])
k(["Invoiced · can't be reassigned", "Paid · can't be reassigned"], "SPEC-CONFLICT", "KNOWN (8 Oct record notes, 'lock tooltips'): design lock text vs S4-N6 “The disabled Reassign lead technician action on an Invoiced or Paid work order shows this tooltip: “The lead technician can’t be changed once a work order is Invoiced or Paid.”” Cases assert the spec. Still in this export", [96964, 97009])
k(["Declined · can't be reassigned"], "SPEC-CONFLICT", "KNOWN (register 'Declined locked in the design'): spec S4-N2 “Declined and Complete work orders can be moved freely, as today.” Still in this export", [97009])
k(["Imported · review before assigning"], "SPEC-CONFLICT",
  "Spec CHANGED (v48, 12 Oct): S1-R13a “Imported work orders open in List only.” and the S1-R13a context note “Board View and Tech View never show them”. The design still shows the Imported work order S1-360 in Tech View/Board View with this lock text — design lags spec (supersedes W-3, now answered in the spec)", [154648])
k(["You don't have permission to assign technicians"], "COVERED", "No-permission refusal while dragging (Story 9: dragging needs Work Orders create and edit)", [96967, 368147])
k(["page for “", "” — not built in this prototype", "{…} page for “{…}” — not built in this prototype"], "OUT-OF-SCOPE", "Global search 'Show all' placeholder toast — another feature (Global Search)")
# --- page chrome / filters
k(["Work Orders"], "COVERED", "'Work Orders' filter-view tab (S1-R3) — also the header navigation item", [96913])
k(["Schedule", "Customers", "Parts", "Reports", "Heavy Duty", "User menu", "Primary", "AK", "K", "Search customers, work orders, parts...", "Search customers, work orders, parts...⌘K", "New Work Order"],
  "OUT-OF-SCOPE", "Page chrome (header navigation, location, user menu, global search) — not this feature")
k(["All", "Estimates", "Completed"], "COVERED", "Filter-view tabs work in every display (S1-R3)", [96913])
k(["Search", "Status", "Assigned to me", "Asset on site"], "COVERED", "Existing toolbar filters applied in every display (S1-R3, S1-R11, S1-R13)", [96911, 96914])
k(["Technician", "Lead Technician"], "COVERED", "Technician filter chip (Tech View option list) — existing filter applied in every display", [96914])
k(["Department"], "OUT-OF-SCOPE", "Department filter — ruled out by the PO (Chris Ward 29 Sep, Sasha Grosman 24 Sep)")

# --- computed in the board script but bound to no template (verified: no {{ wo.crewLabel / crewTip / waitLabel / linesLabel / countLabel }} binding in any board)
k(["Lead technician · crew:", "· crew:", "Lead: {…} · crew: {…}", "Lead", "Lead:", "Assisting", "match", "matches", "lines", "{…} match", "{…} matches", "{…} lines",
   "Waiting on {…}", "Waiting on "], "NOT-ON-SCREEN", "Computed in the board script but no board template binds it (crewLabel/crewTip/countLabel/linesLabel/waitLabel unbound) — not displayed by this export")
k(["part", "parts", " part", " parts", "hrs", " hrs"], "DATA", "Fragment of a rendered record value ('2 parts' Waiting On Parts cell, '0.0 / 1.5 hrs' card hours)")
k(["Customer", "Asset", "Progress", "Lines", "Unit #", "Number", "On Site", "Waiting On Parts", "Service Advisor", "Clocked In", "Assigned Tech", "Created on", "Total price", "VIN/Serial #", "Lead Technician"],
  "COVERED", "Column heading — Tech View offers the same columns as List (S2-R4); headings are List's", [96927, 96979])
k(["Priority"], "OUT-OF-SCOPE", "Title of the position-number column header ('#' / list-ordered icon). Position numbers are open PO question W-5 (engineering leaves them out) — not asserted")
k(["wide", "narrow", "Escape", "detailed", "medium", "large", "small", "off", "nothing", "ok", "err", "esther", "ralph", "jenny", "theresa", "kristin", "cameron", "brenda",
   "unassigned", "string", "x", "adv", "waiting", "unit", "asset", "progress", "clocked", "techs", "created", "total", "settings", "auth", "plus", "lock", "check", "ban",
   "H:MM", "est", "picked", "toast", "k", "px", "wo", "group", "canvas"], "NOT-ON-SCREEN",
  "Code value (prop option, state key, column key, icon name, technician id, key name) picked up by the supplementary pass — not displayed")
k(["Search customers, work orders,...", "⌘ K", "Re", "Search customers, work order...", "Search customers, work or..."], "OUT-OF-SCOPE", "Page chrome (global search box, truncated header nav) in a screenshot — not this feature")
k(["Waiting on 2 parts"], "OUT-OF-SCOPE", "Older board in screenshots/01-compact.png: a 'Waiting on N parts' chip on a card. The current boards bind no such text; spec §2 Out of Scope: \"'Waiting on parts' is deliberately not shown on cards.\"")
k(["assignment is locked"], "OUT-OF-SCOPE", "Superseded lock tooltip in a 15 Sep upload crop; the current boards say '<Status> · can't be reassigned'")
k(["1 match"], "OUT-OF-SCOPE", "Superseded 31 Aug Tech View header ('1 match'); the current boards show the count with a clipboard icon (S2-R12, C96924)")
k(["Work Order", "Advisor", "Created", "Created On", "Total", "EH", "RE", "s1-455"], "OUT-OF-SCOPE", "Superseded 31 Aug Tech View column set / initials in an upload screenshot — the current boards use List's columns")
k(["НЛМК"], "DATA", "Logo on a stock photo's hard hat (avatar photo)")
k(["SV-7330"], "OUT-OF-SCOPE", "Unrelated ticket number behind the minimap crop (designer screenshot)")
k(["Howard", "oment", "mmercial", "3", "5", "6"], "DATA", "Cropped record text in a designer crop")

k(["No results for “", "No results for"], "SPEC-CONFLICT", "Search-only empty-state heading fragment — see 'No results for “{…}”' (S1-N1b; W-13 answered by the spec, design lags)")
k(["Clear search", "Type to search"], "COVERED", "Existing toolbar search box (clear X / placeholder) used in every display (S1-R3, S1-R11)", [96911, 96914])
k(["Search customer", "Account settings", "Servi"], "OUT-OF-SCOPE", "Page chrome / truncated header text / a filter variant not on the Work Orders toolbar")
k(["in stock", "ready to order", "awaiting authorization"], "COVERED", "Hover text of List's optional Parts / Auth cells (8 Oct triage F-25); Tech View offers List's columns", [96927])
k(["Roles & Permissions...", "Shopview"], "OUT-OF-SCOPE", "Browser bookmark bar in a 31 Aug designer screenshot — not product UI")
k(["Up to", "pinned columns"], "SPEC-CONFLICT", "Fragment of the pin-limit message 'Up to 5 pinned columns — unpin one first' — KNOWN pin limit 5 vs three (S2-R11)", [96939, 96949])
k(["work order", "work orders", "{…} work order", "{…} work orders"], "COVERED", "Group/column count hover text ('4 work orders') — repeats the count, covered by the count cases", [96924])
k(["Waiting on"], "NOT-ON-SCREEN", "waitLabel fragment — computed but bound to no template in this export")
k(["No work orders match", "Work order details"], "OUT-OF-SCOPE", "Old hidden 'Details' display (Work Orders.dc.html L259–290): empty list text / iframe title — display not offered (showDetailsView false) and removed in the Details board")
k(["Edit profile", "Log out", "Theme", "Light", "Dark", "Shop"], "OUT-OF-SCOPE", "User menu in the page header (page chrome). Dark theme = open PO question W-15")
k(["assigned to me"], "COVERED", "'Assigned to me' filter text (S1-R13)", [96911, 96914])
k(["Invoiced Date", "Days open"], "COVERED", "List Columns menu options (existing List columns); Tech View offers List's columns — omission from the design's Tech View menu is KNOWN (W-2)", [96927])
k(["Clear all", "Clear selection"], "COVERED", "Existing filter chip / Status dropdown clear controls — the existing filters work the same in every display", [96914])
k(["Opening"], "OUT-OF-SCOPE", "Bare fragment of the global-search and first-run placeholder toasts ('Opening ' + title); the preview's 'Opening S1-…' is classified on its own row")
k(["Card detail", "Number, customer, status", "Adds hours, progress, totals"], "OUT-OF-SCOPE", "Superseded card-size menu in an older screenshot (02-compact.png) — not in any current file; the current menu ('Card size' Compact/Detailed) is KNOWN divergence 1")
k(["BEFORE — forked wo-details/colors_and_type.css", "AFTER — shared _ds tokens + components.css", "AFTER — light", "AFTER — dark (data-theme=\"dark\")"], "OUT-OF-SCOPE", "Designer before/after labels on comparison screenshots of the work order page")
RX = [
    (r"^S\d-\d+ · [A-Z][^·]+$", ("COVERED", "Reassign dialog subtitle 'work order number · customer' (cited in C368163's source line)", [368163])),
    (r"^S\d-\d+ (assigned to|lead technician set to) .+$|^S\d-\d+ moved to Unassigned$", ("SPEC-CONFLICT", "KNOWN (register): drag/assign toast vs S4-R5 “Lead technician updated” / “Lead technician removed”", [96957])),
    (r"^.+ (pinned|unpinned)$", ("COVERED", "Pin / unpin message (optional observation in C96947)", [96947])),
    (r"^Opening S\d-\d+$", ("SPEC-CONFLICT", PEEK + " (toast after 'Open Work Order')", [96932, 96946, 368200, 368201, 368214])),
    (r"^No technicians match “.*”$", ("COVERED", "Reassign dialog no-match", [368163])),
    (r"^No results for “.*”( in .+)?$", ("SPEC-CONFLICT", "Search-only empty state 'No results for “…”' vs S1-N1b “No work orders match the search \"{search}\".” (W-13 answered by the spec on 8 Oct; design lags)", [])),
    (r"^(All|Assets|Customers|Parts|Part Sales|Part sales|Purchase Orders|Purchase orders|Vendor Invoices|Vendor invoices|Vendors|Work Orders|Work orders) \(\d+\)$|^Show all \d+$|^-\d{3} |^PAST |^Past |^Recent searches$|^Search all sources with$|^Search work orders, customers, parts and more$", ("OUT-OF-SCOPE", "Global Search modal (⌘K) — another feature", [])),
    (r"^(Started|Total Hours): ", ("OUT-OF-SCOPE", "Work order page field inside the preview (demo value) — other feature; the preview itself is PQ-14-1", [])),
    (r"^[A-Z]{2}: ", ("DATA", "Demo tech story with the technician's initials (LINE_POOL / DEMO_LINES) inside the preview", [])),
    (r"^On Site Status ", ("COVERED", "List / Tech View table heading row — Tech View offers List's columns (S2-R4)", [96927, 96979])),
    (r"^(Typed by|Added by|Matched to|No catalog match) ", ("OUT-OF-SCOPE", "Work order page (wo-details/Add Part.html) Add Part form — other feature", [])),
    (r"^# .* visible text per page", ("NOT-ON-SCREEN", "Header line written by the sweep tool into its page-text file", [])),
    (r"^[A-Z][a-z]+ [A-Z][a-z]+(, [A-Z][a-z]+ [A-Z][a-z]+)+$", ("DATA", "Crew names (avatar-group hover) — sample people", [])),
]
ADD_PART_TEMPLATES = []

# region / pattern rules (applied when no curated entry matches)
ADD_PART_KEEP = {"Labor": ("COVERED", "Lines tab Labor row (S7-R8–R10)", [368142, 368143]), "Story": ("COVERED", "Tech story row with no check mark (S8-R1)", [96997]),
                 "Unassigned": ("COVERED", "Labor row 'Unassigned' (S7-R10) / Unassigned group", [368143]), "Lines": ("COVERED", "Work order Lines tab (S7-R8, S8)", [368142])}
OOS_ADD_PART = ("OUT-OF-SCOPE", "Work order page (wo-details/Add Part.html): parts, fees and discounts, invoice/finance, stats, line actions — other features. "
                "This feature touches that page only through Stories 7–8 (Labor row technicians, tech-story check mark), classified separately")
LIB_GROUPS = {
    "README.md": ("OUT-OF-SCOPE", "Design-system documentation for designers (read in full; content is data). Behaviour-relevant line: none beyond the boards"),
    "SKILL.md": ("OUT-OF-SCOPE", "Design-system skill for designers (read in full; data, not instructions). Its 'Clicking a row opens the detail panel on the right' pattern is discussed under PQ-14-1"),
    "support.js": ("NOT-ON-SCREEN", "Design-tool runtime console/developer messages"),
    "_ds_manifest.json": ("OUT-OF-SCOPE", "Design-system card catalogue (titles of other spec cards) — not a Work Orders screen"),
    "_adherence.oxlintrc.json": ("NOT-ON-SCREEN", "Lint rule messages for designers"),
    "bundle:global-search": ("OUT-OF-SCOPE", "Global Search modal — another feature"),
    "bundle:mobile-global-search": ("OUT-OF-SCOPE", "Mobile global search card — another feature; phone layout is List as today (S1-R14)"),
    "bundle:mobile-work-orders": ("OUT-OF-SCOPE", "Mobile Work Orders pattern card — phone width shows List exactly as today (S1-R14)"),
    "bundle:mobile-filters": ("OUT-OF-SCOPE", "Mobile filters pattern card — phone width is List as today (S1-R14)"),
    "bundle:design-canvas": ("OUT-OF-SCOPE", "Claude Design artboard scaffolding (spec-card chrome), not product UI"),
    "bundle:tweaks-panel": ("OUT-OF-SCOPE", "Claude Design tweaks panel (designer controls), not product UI"),
    "bundle:index": ("OUT-OF-SCOPE", "SV.GAPS / SV.missing() design-system gap list for designers"),
    "bundle:lucide-icons": ("OUT-OF-SCOPE", "Icon group names in the icon catalogue card"),
    "bundle:ai-agent-icon": ("OUT-OF-SCOPE", "AI agent icon component (brand cards)"),
    "bundle:badge": ("OUT-OF-SCOPE", "Badge component demo text"),
    "bundle:filter-bar": ("OUT-OF-SCOPE", "Filter-bar demo data (vendors, people) on the design-system card — not the Work Orders toolbar data"),
    "bundle:filter-dropdown": ("OUT-OF-SCOPE", "Filter dropdown variants not used on the Work Orders toolbar (date ranges, customer search)"),
    "bundle:filter-chip": ("OUT-OF-SCOPE", "Filter-chip demo text"),
    "bundle:sv-components": ("OUT-OF-SCOPE", "Generic component demo/developer text not shown by the Work Orders boards"),
    "bundle:columns-dropdown": ("OUT-OF-SCOPE", "Columns dropdown text no board was seen showing"),
    "bundle:work-orders": ("OUT-OF-SCOPE", "Work Orders product layer text no board was seen showing (demo rows, user menu)"),
    "lucide-icons.js": ("OUT-OF-SCOPE", "Icon group names"),
}
BOARD_GROUPS = ("bundle:work-orders", "bundle:columns-dropdown", "bundle:filter-dropdown", "bundle:filter-chip", "bundle:sv-components", "bundle:filter-bar")
SECT = [(11, 'ai-agent-icon'), (232, 'badge'), (347, 'columns-dropdown'), (661, 'sv-components'), (1768, 'tokens'), (2007, 'design-canvas'), (3425, 'filter-bar'),
        (5027, 'filter-chip'), (5199, 'filter-dropdown'), (5817, 'global-search'), (7133, 'index'), (7286, 'lucide-icons'), (7455, 'mobile-filters'),
        (7573, 'mobile-global-search'), (8118, 'mobile-work-orders'), (9134, 'theme-toggle'), (9203, 'tweaks-panel'), (9899, 'work-orders')]


def group(where):
    f, _, l = where.rpartition(":")
    if "_ds_bundle" in f:
        s = "?"
        for a, n in SECT:
            if l.isdigit() and int(l) >= a:
                s = n
        return "bundle:" + s
    return f.split("/")[-1]


CODEISH = re.compile(r"(\(this|\(event|' \+|\+ '|\" \+|\+ \"|esc\(|money\(|Math\.|=>|\.join\(|\[data-|:scope|#[a-zA-Z]+[ .]|^\.|\bclassName\b|\bpd-|\bap-|\bwo-|\bcfd-|\bfl-|^\(?(linked|rate|p|cost) \?|translate3d|foreignObject|viewBox|height=\"|type=\"|value=\")")
EXTRA = {}  # reader extensions filled after reviewing UNCLASSIFIED rows
try:
    EXTRA = json.load(open(pathlib.Path(__file__).parent / "extra_rulings.json"))
except FileNotFoundError:
    pass


SUPPLEMENTARY_ROW = False
ON_BOARD = False


def classify(t, where, in_case):
    key = t.replace("\u2019", "'")
    g = group(where)
    is_lib = g.startswith("bundle:") or g in LIB_GROUPS
    for rx, (c, r, ids) in RX:
        if re.search(rx, t):
            return c, r, ids
    if any(re.fullmatch(tp, t) for tp in ADD_PART_TEMPLATES) or "Add Part" in where:
        if key in ADD_PART_KEEP:
            return ADD_PART_KEEP[key]
        if CODEISH.search(t):
            return "NOT-ON-SCREEN", "Code fragment / selector picked up by the extractor — not displayed", []
        return OOS_ADD_PART + ([],)
    if key in K:
        c, r, ids = K[key]; return c, r, ids or (ci.find(t, 5) if c == "COVERED" else [])
    if key in EXTRA:
        c, r, ids = EXTRA[key]; return c, r, ids or (ci.find(t, 5) if c == "COVERED" else [])
    if CODEISH.search(t) or re.match(r"^s (header|scroll|native)", t) or (SUPPLEMENTARY_ROW and re.fullmatch(r"[a-z][a-z0-9]*", t)):
        return "NOT-ON-SCREEN", "Code fragment / selector / comment / identifier picked up by the extractor — not displayed", []
    if g in LIB_GROUPS and (not ON_BOARD or g not in BOARD_GROUPS):
        c, r = LIB_GROUPS[g]; return c, r, []
    if re.match(r"^DATA", t) or is_data(t):
        return "DATA", "Prototype sample record value (customer, asset, unit, number, person, status, date, amount, hours) or a row/card made only of them", []
    if not is_lib:
        ids = ci.find(t, 5) if (" " in t.strip() or len(t) >= 8) else []
        if in_case or ids:
            return "COVERED", "Text already appears in a case", ids
    return None, None, []


for r in inv["rows"]:
    if "Add Part.html" in r["where"] and len(r["text"]) >= 8:
        ADD_PART_TEMPLATES.append(re.escape(r["text"]).replace(re.escape("{…}"), ".*"))
rows = []
for r in inv["rows"]:
    rows.append({"text": r["text"], "where": r["where"], "source": "inventory" + (" (library)" if r["library"] else ""), "on_a_board": r["on_a_board"], "in_a_case": r["in_a_case"], "pre": r["class"]})
for r in supp:
    rows.append({"text": r["text"], "where": r["where"], "source": "supplementary", "on_a_board": True, "in_a_case": False, "pre": ""})
for im in imgs:
    tag = " [Add Part.html]" if im["kind"] == "work order page" else ""
    for t in im["texts"]:
        rows.append({"text": t, "where": f"image:{im['file']}{tag}", "source": "image", "on_a_board": True, "in_a_case": False, "pre": "AUTO", "img_reason": ""})

out, un = [], []
for r in rows:
    if r["pre"].startswith("DATA"):
        c, why, ids = "DATA", "Date, amount, VIN or time (pre-marked by the tool)", []
    elif r["source"] == "image":
        c, why, ids = classify(r["text"], r["where"], False)
        if c == "NOT-ON-SCREEN":
            c, why, ids = "OUT-OF-SCOPE", "Value shown in a designer screenshot's Claude Design prop bar / comparison label — not product UI", []
        if c is None and "17.26.41" in r["where"]:
            c, why, ids = "OUT-OF-SCOPE", "Browser / macOS / bookmark chrome around a designer screenshot (31 Aug) — not product UI", []
        if c is None and "14.29.45" in r["where"]:
            c, why, ids = "OUT-OF-SCOPE", "Claude Design prop bar (designer review controls) in a screenshot — not product UI", []
    else:
        SUPPLEMENTARY_ROW = r["source"] == "supplementary"
        ON_BOARD = bool(r["on_a_board"]) and "library" in r["source"] and group(r["where"]) not in ("README.md", "SKILL.md", "support.js", "_ds_manifest.json", "_adherence.oxlintrc.json")
        c, why, ids = classify(r["text"], r["where"], r["in_a_case"])
        SUPPLEMENTARY_ROW = False; ON_BOARD = False
    r.update({"class": c, "reason": why, "cids": ids})
    (un if c is None else out).append(r)

PFX = "build/wo-board-tech-view/sources/design-2026-10-14-upload/"
def short(w):
    return w.replace(PFX, "").replace("_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/", "_ds/…/")
reasons = sorted({r["reason"] for r in out + un if r["reason"]})
rid = {x: i for i, x in enumerate(reasons)}
json.dump({"reasons": reasons, "columns": ["text", "where", "source", "class", "reason_id", "cids"],
           "rows": [[r["text"], short(r["where"]), r["source"], r["class"], rid.get(r["reason"]), r["cids"]] for r in out + un]},
          open(stem + ".json", "w"), ensure_ascii=False, separators=(",", ":"))
cnt = collections.Counter(r["class"] for r in out)
bysrc = collections.Counter((r["source"].split(" ")[0], r["class"]) for r in out)
with open(stem + ".md", "w") as o:
    o.write("# Design text inventory — classified (14 Oct 2026 export)\n\n")
    o.write(f"Rows: {len(rows)} · classified {len(out)} · **unclassified {len(un)}**. Every row is in `{pathlib.Path(stem).name}.json` "
            "(text, file:line, source, class, reason, C-ids). Sources: inventory = design_text_inventory.py (board files, library, sweep and flow "
            "texts); supplementary = texts the tool's word filter drops; image = hand transcription of every image.\n\n| Class | Rows |\n|---|---|\n")
    for k2, v in sorted(cnt.items()):
        o.write(f"| {k2} | {v} |\n")
    o.write("\n| Source | Class | Rows |\n|---|---|---|\n")
    for (s2, c2), v in sorted(bysrc.items()):
        o.write(f"| {s2} | {c2} | {v} |\n")
    for sect in ["SPEC-CONFLICT", "CASE-NEEDED", "COVERED"]:
        rs = [r for r in out if r["class"] == sect]
        o.write(f"\n## {sect} ({len(rs)}) — every row\n\n| # | Text | Where | Source | Reason | Cases |\n|---|---|---|---|---|---|\n")
        for i, r in enumerate(rs):
            o.write(f"| {i} | {r['text'][:110].replace('|', '/')} | {short(r['where'])[:70]} | {r['source']} | {r['reason'][:240].replace('|', '/')} | "
                    f"{', '.join(ci.link(x) for x in r['cids'][:5])} |\n")
    for sect in ["OUT-OF-SCOPE", "DATA", "NOT-ON-SCREEN"]:
        rs = [r for r in out if r["class"] == sect]
        grp = collections.defaultdict(list)
        for r in rs:
            grp[r["reason"]].append(r)
        o.write(f"\n## {sect} ({len(rs)}) — grouped by reason (every row in the JSON)\n\n| Reason | Rows | Examples |\n|---|---|---|\n")
        for reason, lst in sorted(grp.items(), key=lambda x: -len(x[1])):
            ex = "; ".join(x["text"][:50].replace("|", "/") for x in lst[:6])
            o.write(f"| {reason[:260].replace('|', '/')} | {len(lst)} | {ex} |\n")
print(dict(cnt), "unclassified", len(un))
un.sort(key=lambda r: r["where"])
for r in un:
    print("UNCLASSIFIED |", r["text"][:120], "|", r["where"][-70:], "|", r["source"])
sys.exit(1 if un else 0)
