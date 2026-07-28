# Report Suite — Kickoff-Video Deltas & Clarifications (2026-07-28)

**Source video:** Chris Ward kickoff — https://www.loom.com/share/dd2b5837aebf485ca10c704d460e2769
(verbatim transcript: `loom-kickoff-transcript.md`).
**Attendees:** Chris Ward (PO), Parth Fadadu (dev), Nebojsa Glavinic (QA), Viktoria Videnovic (QA), Stefan Mitrovic (dev/eng), Chris Amani.
**Ingested:** 2026-07-28. **This is ingest + analysis + documentation ONLY** — NO TestRail writes, NO case edits.

**Golden context (Chris's own framing):**
- The **written spec is the source of truth**, but Chris admits the specs "were fired out super, super fast because we're behind, so the spec's going to have some issues." Many points below Chris says he'll "double-check against the spec" — treat those as PENDING-SPEC (spec wins, needs confirmation).
- This **video = visual reference** only. A condensed ~3-minute "PRD Companion" click-through is coming.
- **IGNORE the visual defects** shown in his local build (padding, alignment, breakage, oversized/odd elements) — Chris repeatedly calls these Claude Code artifacts, NOT requirements. Do not author cases to them.

**Report short-codes:** TU = Technician Utilization · WIP = Work In Progress · SBC = Sales By Customer · SBR = Sales By Representative · PV = Parts Velocity · IV = Inventory Value · ALL = whole suite.

**Classification tags:** FIRM DELTA · PENDING-SPEC · OPEN DECISION · CROSS-SQUAD · VISUAL-REFERENCE · CONFIRMATION.

---

## Summary table 1 — count of points by classification tag

| Classification tag | Count |
| --- | --- |
| FIRM DELTA | 7 |
| PENDING-SPEC | 3 |
| OPEN DECISION | 6 |
| CROSS-SQUAD | 1 |
| VISUAL-REFERENCE | 2 |
| CONFIRMATION | 21 |
| **TOTAL points** | **40** |

## Summary table 2 — per-report roll-up (report-specific FIRM DELTA / PENDING-SPEC / OPEN DECISION)

Counts only the items that land on ONE specific report. Suite-wide (ALL) items are counted separately in the last row so they are not double-counted per report.

| Report | FIRM DELTA | PENDING-SPEC | OPEN DECISION | Which points |
| --- | --- | --- | --- | --- |
| SBC Sales By Customer | 3 | 0 | 1 | FIRM P21, P24, P25 · OPEN P12 |
| SBR Sales By Representative | 1 | 0 | 1 | FIRM P5 · OPEN P6 |
| PV Parts Velocity | 1 | 1 | 2 | FIRM P2 · PENDING P32 · OPEN P30, P31 |
| TU Technician Utilization | 1 | 0 | 1 | FIRM P3 (move nav down) · OPEN P18 |
| WIP Work In Progress | 0 | 0 | 1 | OPEN P12 (asset dropdown) · (snapshot-label P32 touches WIP too) |
| IV Inventory Value | 1 | 0 | 0 | FIRM P2 |
| **ALL / suite-wide** | 2 | 2 | 1 | FIRM P3 (order relax) + P10 · PENDING P9, P33 · OPEN P4 · **CROSS-SQUAD P19** |

## CROSS-SQUAD item — persistence clash with the FILTERS squad (affects the Filters project too)

- **P19 — "Settings saved per-user-per-computer (local)" clashes with the Filters squad's account-level + shareable-link work.** In the video Stefan Mitrovic flags that the Report Suite spec saves each report's filters/columns/sort **per-user-per-computer (local/per-browser)**, while the **Filters feature squad (Branko + Miloš)** is building the SAME kind of remembered-view logic at the **account level (cross-device) plus shareable links that override the saved/default view.** Decision in the call: **do NOT build the cross-device/shareable-link version inside Report Suite now — leave the Report Suite persistence as-is (local), then sync with the Filters squad and delegate the cross-device work to them once it lands on staging.** Chris will sync with "NealOceanBronco" and report back in the Slack channel and may re-spec / leave that part ambiguous.
- **Impact on the Filters project (build/filters):** this is the account-level saved-view + shareable-link cross-device work already tracked on the Filters squad. When Report Suite reports gain per-user filter/column/sort persistence, that behaviour should come FROM the Filters squad's mechanism, not a duplicate Report-Suite implementation. Flag in the Filters project memory so the two don't collide.

---

## Full point list (40)

### Nav / location / suite-wide

**P1 — All six reports live in the existing Reports section.**
- (a) "all six of them are gonna live in the reports section." (b) ALL. (c) CONFIRMATION. (d) No-op — matches our NAV cases.

**P2 — New "Parts" nav subsection for Parts Velocity + Inventory Value; ignore "Part Sales".**
- (a) A new "Parts" section must be created in the nav to hold Parts Velocity and Inventory Value; "Part sales, just ignore that one" (Part Sales is a different existing item, out of scope). (b) PV, IV. (c) FIRM DELTA. (d) Likely EDIT the PV-NAV (PV-NAV-01..03) and IV-NAV (IV-NAV-01..06) placement cases to place them under a new "Parts" nav subsection; confirm our nav cases name the "Parts" grouping. No case for "Part Sales".

**P3 — Nav placement is "additive, not interruptive"; new performance reports go BELOW existing; Technician Utilization is currently in a bad spot and must move down; order among the six does not matter.**
- (a) Don't disturb the muscle-memory position of existing items (e.g. "Sales"); new reports go toward the bottom. TU "is actually in a really bad spot right now… move these down below what's already there." Order among the six is not important. (b) ALL (TU specifically). (c) FIRM DELTA (TU must move down; additive-not-interruptive rule). (d) EDIT TU-NAV placement cases to require "below existing nav items / toward the bottom"; RELAX any case that fixes a specific left-nav order among the six (order is order-agnostic).

**P4 — Nav items may later be collapsed into dropdowns (more reports coming).**
- (a) "we're probably going to minimize these as drop-downs, because there will be more reports." (b) ALL (nav). (c) OPEN DECISION (future, not this squad). (d) No-op now; note as forward-looking.

**P5 — Label must be "Sales by Representative", NOT "Sales by Associate".**
- (a) The nav label reads "Sales by Associate" in Chris's local — that is WRONG; the correct name is "Sales by Representative." He only shortened it to "Associate" because of nav padding. (b) SBR. (c) FIRM DELTA. (d) VERIFY SBR-NAV label cases use "Sales By Representative" (our cases already use this name → likely CONFIRM/no-op, but confirm no case expects "Associate").

**P6 — Nav padding/truncation problem for the word "Representative"; solution TBD.**
- (a) "Representative" squishes into the nav padding; needs solving this squad — maybe push the padding out; the spec has "a good solution" but Chris isn't sure it's the right one. (b) SBR. (c) OPEN DECISION (solution not yet chosen). (d) No-op; VIU-confirm the final label rendering / padding fix live.

**P9 — "All Time" date filter appears to be CUT (pagination/cost; backend limited to ~365 days).**
- (a) An "All Time" option is visible in Chris's local but he believes he cut it from the spec (Milan's flag; hard to paginate; expensive to store). Stefan confirms the backend can't pull "since the beginning" — it's limited to ~one year, so All Time ≈ last 365 days anyway. Chris: "refer to the spec as the source of truth… I'll double-check." (b) ALL. (c) PENDING-SPEC. (d) VERIFY no report offers "All Time"; our cases were authored with a 366-day-capped Custom range and NO "All Time" → likely CONFIRM. Note the ~365-day backend cap as a VIU/data caveat.

**P10 — Per-report Location filter (user's permitted locations) + an "All locations" option must be on EVERY report (currently a miss) + a location label/identifier is needed.**
- (a) Each report has a Location toggle limited to the locations the user has permission to access, with an "All locations" choice. Chris: "not having this is probably the biggest miss every single one of our reports has… in theory we should have this on every single report." Plus: when viewing All locations, users need a way to tell which row belongs to which shop → "we should probably add that in there" (a location label/identifier). (b) ALL. (c) FIRM DELTA. (d) ENSURE every report's LOC cases cover: (i) the permitted-locations multi-select, (ii) an "All locations" selection, and (iii) a per-row/section location label/identifier when All locations is active. May need case ADDS on reports missing the location-identifier aspect (SBC-LOC, SBR-LOC, PV-FILT/Location, TU-LOC, WIP-FLT/Location, IV-LOC).

**P11 — Date-range calendar should match the native ShopView calendar.**
- (a) "this calendar really should be the same as native, everything we're familiar with." (b) ALL. (c) VISUAL-REFERENCE. (d) No-op; VIU-confirm the date picker matches native look/behaviour.

**P13 — Download PDF and Download CSV reflect exactly the ON-SCREEN filtered data (whole suite).**
- (a) Across the entire suite, PDF/CSV export exactly what is shown after filtering; to export everything, the user clears filters. "very much intentional." (b) ALL. (c) CONFIRMATION. (d) No-op; matches our EXP cases — VIU-confirm.

**P20 — Exports carry the user's selected LOGO.**
- (a) "these exports are all supposed to follow the same logic: if there is a logo the user selected, it should be here." (b) ALL (esp PDF exports). (c) CONFIRMATION. (d) VIU-confirm the selected logo appears on exports; likely no-op.

**P33 — Location filter VISIBILITY is gated by custom roles/permissions (no permitted location → filter hidden).**
- (a) Chris: if a user has only one permitted location (e.g. "QA testing") the location filter is GONE; if they have several (e.g. QA testing + QB location) the filter shows. He defined this in the spec's custom-roles/permissions section but "will double-check." Stefan asks that whether a one-location user can see other locations be defined in role/permission and "written down so we're all aligned." (b) ALL. (c) PENDING-SPEC. (d) CONFIRM the LOC/PERM cases capture "location filter hidden when the user has ≤1 permitted location; shown when ≥2." Ties to Q2 / OQ-5 permission-model reconciliation.

**P37 — Spec is the source of truth but has known issues (written fast).**
- (a) "we fired these specs out super fast because we're behind, so the spec's going to have some issues." Flag anything weird in the spec back to Chris. (b) ALL. (c) CONFIRMATION (process). (d) No-op; keep a running discrepancy list, raise spec issues.

**P38 — This video = visual reference; a condensed ~3-min "PRD Companion" click-through is coming.**
- (a) Use this kickoff video for visual reference; Chris will film a short "PRD Companion" click-through. (b) ALL. (c) CONFIRMATION (process; pending artifact). (d) No-op; obtain the PRD Companion when filmed for the visual-conformance VIU pass.

**P39 — Changelog must be kept up to date on every spec change.**
- (a) Any spec change (by Chris or the team) must update the changelog. (b) ALL. (c) CONFIRMATION (process). (d) No-op; check the spec changelog at each reconciliation pass.

**P40 — IGNORE the visual defects shown in the local build (Claude Code artifacts, not requirements).**
- (a) Repeatedly: padding messed up, misaligned columns, oversized elements, "broken" export buttons, regressions — all Claude Code visual artifacts in Chris's local, NOT requirements. (b) ALL. (c) CONFIRMATION (process / VIU). (d) No-op; do NOT author or flag cases against these local visual defects.

### Work In Progress (WIP)

**P7 — Snapshots (WIP + PV) are nightly off-peak captures per location's timezone, for retroactive/historical data.**
- (a) Both WIP and PV take a nightly "picture" at off-peak time in each location's timezone so users can later look back at a specific past date. (b) WIP, PV. (c) CONFIRMATION (matches WIP S11 / PV snapshot stories). (d) No-op; VIU-confirm the snapshot backend.

**P8 — No snapshots / no historical data exist until the feature reaches production.**
- (a) "until this hits production, there are no snapshots… they're not going to see anything." (b) WIP, PV (and IV as-of). (c) CONFIRMATION (VIU limitation). (d) No-op to cases, but record as a VIU caveat: retroactive/historical snapshot behaviour cannot be verified pre-prod; test the capture mechanism + "no data yet" empty states only.

**P12 — Asset dropdown: Chris's "stays-open" multi-pick style vs native single-close style; may match native + add a toggle.**
- (a) Chris built the Asset dropdown to stay open (pick several without it closing each time) because native reports annoyingly close on each pick; Stefan suggests matching native and adding a toggle for uniformity; Chris is "definitely flexible" and leans to matching best-in-class native + toggle. (b) SBC (asset filter), WIP (asset filter) — any report with an asset dropdown. (c) OPEN DECISION. (d) No-op pending decision; VIU-confirm the final asset-dropdown behaviour; do not fail cases on stay-open vs close-on-pick until decided.

**P14 — "Labor Delta" color rules: green with "+" (positive), black no sign (exactly 0.0), red with "−" (negative) = clocked/tech hours vs invoiced hours; appears in several reports.**
- (a) New suite-wide visual cue Chris calls "labor delta": positive → green +, break-even 0.0 → black (no sign), negative → red −. Nebojsa clarifies and Chris confirms it is **actual clocked/tech hours vs invoiced hours** (like shelf/tech efficiency: clocked vs invoiced), NOT estimate hours. (b) WIP, SBC, SBR (wherever the colored Inv-Hrs delta appears). (c) CONFIRMATION (with formula clarification). (d) VIU-confirm the color/sign rendering AND the formula direction (clocked/tech hours vs invoiced hours) in the WIP/SBC/SBR calc cases; correct any case that has the delta basis wrong (e.g. vs estimate).

**P15 — WIP is deliberately complex: many tooltips, pinned top + bottom rows, one oversized headline number.**
- (a) WIP introduces non-standard shop terminology → many tooltips (verbiage may be simplified later); rows pinned top and bottom; the single most-important figure is intentionally rendered larger than the rest. (b) WIP. (c) VISUAL-REFERENCE (with a CONFIRMATION of pinned-rows behaviour). (d) No-op; VIU-confirm the oversized headline figure + pinned top/bottom rows + tooltip presence; matches our WIP-SUM/WIP-VIS cases.

### Technician Utilization (TU)

**P16 — TU has an expanded view + collapsed/uncollapsed hyperlinks into Timesheet Activities (redirects current page; Back restores your position).**
- (a) Rows expand; collapsed row hyperlink → that date range in Timesheet Activities; uncollapsed (per-day) hyperlink → that specific date range in that person's Timesheet Activities; it redirects the current page, and is supposed to be built so pressing Back returns you exactly where you were. (b) TU. (c) CONFIRMATION. (d) VIU-confirm; matches TU-LINK / TU-EXP cases (verify collapsed-vs-uncollapsed link targets + Back-restores-position).

**P17 — TU "Est. Lost Labor" calculator = location's default labor rate × internal hours.**
- (a) New calculator: location default labour rate multiplied by internal hours — a quick "this is how much you're losing by not having people clock onto jobs" figure (a highly sought Fabian ask). (b) TU. (c) CONFIRMATION. (d) Confirm the TU-ELL (Est. Lost Labor) cases use formula = location default labor rate × internal hours.

**P18 — TU has NO column selector (Chris vetoed it; "not married to it").**
- (a) Chris vetoed a column selector on TU because it has few data points; "still kind of in that same mindset… not married to it… we'll maybe follow the spec… I'll take a quick look." (b) TU. (c) OPEN DECISION (leaning no; spec-defer). (d) No-op; our TU authoring deliberately has no column-selector cases — confirm against the spec; if Chris later adds one, add cases then.

### Sales By Customer (SBC)

**P21 — ADD a compressed/expanded download view to Sales By Customer (Parth's suggestion, Chris agreed live).**
- (a) SBC currently only offers the nested/expanded export; Parth asked why no compressed download; Chris agreed to add a compressed download option (like the other reports' Summary/Expanded). (b) SBC. (c) FIRM DELTA. (d) Likely ADD an SBC-EXP case for the compressed (summary) download view alongside the expanded one. Also update the spec (Chris to do).

**P22 — SBC "Parts and Service" (Product Type) filter chooses Part Sales, Work Order Sales, or Both.**
- (a) New-looking filter on SBC controls whether the report shows part sales, work-order sales, or both. (b) SBC. (c) CONFIRMATION. (d) Confirm SBC-TYPE cases cover part-sales / WO-sales / both; VIU-confirm the on-screen label ("Parts and Service").

**P23 — SBC has a column selector + nested (Customer→Asset→Invoice) collapse + hyperlinks to the underlying part sales / work orders.**
- (a) Column selector; fully nested collapse tree; rows hyperlink to actual part sales or work orders (part sales labelled slightly differently). (b) SBC. (c) CONFIRMATION. (d) No-op; matches SBC-COL / SBC-TREE / SBC-LINK cases; VIU-confirm.

**P24 — Asset identifier changes from UNIT NUMBER to SERIAL NUMBER (bin number = interchangeable term).**
- (a) Using unit number as the asset identifier is "not best in class" (users lack unit numbers or duplicate assets under several unit numbers). The reliable "holy grail" identifier is the **serial number (or bin number — interchangeable)**. Chris: "I need to change this on my local to actual serial number… fairly certain I've got that in the spec… I'll double-check." Applies wherever an asset identifier is shown; flag it anywhere it appears. (b) SBC (asset-label derivation), and any report that shows an asset identifier. (c) FIRM DELTA (product intent firm; Chris still to update local + verify spec). (d) EDIT the SBC-LBL asset-label / identifier derivation cases (currently unit → plate → VIN-suffix → Unknown) to use serial number (bin) as the asset identifier; scan other reports for unit-number references.

**P25 — REMOVE the Print button from Sales By Customer (being cut from the spec).**
- (a) SBC (Chris's first-built report, April) still shows a Print button — "this should not exist. I'm going to make sure that's cut out of the spec." (b) SBC. (c) FIRM DELTA (spec-cut pending Chris). (d) Likely RETIRE the SBC Print-export case (SBC-EXP Print). Confirm the spec cut before editing.

**P34 — Sales By Customer IGNORES refunds/credits (it reports what was sold at the time).**
- (a) SBC answers "what did we sell to this customer at what time" — refunds/credits after the fact do NOT change it. (b) SBC. (c) CONFIRMATION (product rule). (d) VERIFY the SBC-CALC cases do NOT net out refunds/credits; add an explicit "refunds/credits ignored" expectation if missing.

### Sales By Representative (SBR)

**P26 — SBR entry points: "Sales Rep" toggle on Edit Staff Member (not role-exclusive) + Sales Rep dropdown on work orders + unassigned (no-rep) WOs toggled OFF by default.**
- (a) A staff member appears in the report via a "Sales Rep" toggle on Edit Staff Member — intentionally NOT tied to their role (a CEO could double as a sales rep and still be tracked). Sales reps are also assigned via a Sales Rep dropdown on work orders. Unassigned work orders (no sales rep) exist and are **toggled off by default**. (b) SBR. (c) CONFIRMATION. (d) VIU-confirm; matches SBR-ASGN / SBR-WO / SBR-UNAS (Show Unassigned toggle off by default). Confirm the toggle is not role-gated.

**P27 — SBR is an edge-case report; has column selector, product type filter, payment-status filter, labor delta + labor margin.**
- (a) ~95% of the industry doesn't use sales reps (mainly Foothills Group); the report answers "what has my salesperson done in a period." Includes column selector, product type, acceptable payment statuses (Fabian ask), labor delta and labor margin. (b) SBR. (c) CONFIRMATION. (d) No-op; matches SBR-COL / SBR-TYPE / SBR-STAT / SBR-CALC.

### Parts Velocity (PV)

**P28 — PV covers BOTH inventory parts and special-order catalog parts; many columns (some off by default); industry-standard verbiage (e.g. "turns per year") with tooltips; sort/filter by Bin, Vendor, Category.**
- (a) PV shows inventory parts and special-order catalog parts; lots of columns, intentionally some off by default (user can toggle); columns use best-in-class industry verbiage (turns per year, etc.) with explanatory tooltips; sortable/filterable by bin, vendor, category (plus normal sort). (b) PV. (c) CONFIRMATION. (d) No-op; matches PV-ROW / PV-COL / PV-FILT; VIU-confirm default-off columns + tooltip strings.

**P29 — PV has its own local search box (NOT the global search).**
- (a) Global search is broken / owned by another team, so PV uses its own local search input. (b) PV. (c) CONFIRMATION (clarification). (d) VIU-confirm PV uses a local search, not global; the search box look is rough (visual defect → ignore per P40).

**P30 — PV slow-load / pagination is a live concern (Milan's suggestions are in the spec; pagination is forced; infinite-scroll/load to be revisited).**
- (a) Large shops (e.g. 17,000 parts) make PV slow; Milan added suggestions in the spec and thought it was about as good as it gets; Stefan notes pagination is enforced on every page (users are "forced to scroll"); Chris wants to revisit pagination / infinite-scroll / load. (b) PV. (c) OPEN DECISION (eng, to revisit). (d) No-op to functional cases; note as a VIU performance caveat; the exact pagination/scroll behaviour may change.

**P31 — PV "Catalog" naming is confusing (it means special-order parts never stocked) and may be RENAMED / truncated.**
- (a) Nebojsa flags that "catalog" is ambiguous (any ordered/received/invoiced part gets a catalog item), whereas here it means special-order parts that were never put into inventory. Chris agrees: "maybe we do rename it… we'll have to truncate that down for a column." (b) PV. (c) OPEN DECISION (rename not yet decided). (d) No-op now; if renamed, EDIT the PV "Catalogue" row/column label cases later; VIU-confirm the final column label.

**P32 — The "snapshot taken X days ago" label will likely be REMOVED (snapshots are taken daily).**
- (a) Chris's local shows a "taken ~12 days ago" snapshot label; he's bothered because snapshots are taken every day, so the label should go away. "I'll double-check the spec… pretty sure I trumped it and got rid of that." (b) PV (also any snapshot-bearing report — WIP; IV "As of" is a separate as-of indicator, keep it). (c) PENDING-SPEC. (d) Likely RETIRE/EDIT any PV (or WIP) case expecting a "snapshot taken N days ago" label; do NOT touch the IV "As of <date>" indicator (different, keep). Confirm against the spec.

**P35 — PV tracks Units Returned, Units Sold, and Demand (# of separate transactions), with reversal netting.**
- (a) Unlike SBC, PV DOES track returns/credits: Units Returned increments whenever a return is checked; Units Sold increments on each invoice; a sold-then-returned pair nets out. **Demand = number of separate transactions (work orders or part sales) a part appears on** — 100 of a part on one WO counts as 1; one of a part across 100 WOs counts as 100. (b) PV. (c) CONFIRMATION (with calc clarification). (d) Confirm PV-CALC cases: Units Returned trigger (return checked), Units Sold trigger (invoiced), reversal/netting, and Demand = distinct-transaction count. VIU-confirm with seeded return/reversal data.

### Inventory Value (IV)

**P36 — Inventory Value is a basic report (carrying cost / sell price / margins / markup at a point in time); NO compressed view.**
- (a) IV shows, at a chosen time (e.g. this month), how much you're carrying in cost, sell price, current margins and markup; a Cody McCarthy ask that pushed the release a couple of days. "There's really no reason to have a Compressed view — it wouldn't make sense." (b) IV. (c) CONFIRMATION. (d) Confirm IV has no compressed/expanded export split (single view); matches our IV authoring; VIU-confirm.

---

## Notes for the reconciliation pass (per PROJECT-STATE §0 RULING 2)

- These deltas are captured for the eventual **SPEC-RELEVANCE-RECONCILIATION** pass (fold in Chris's Q1/Q2/Q3 answers + this video + the forthcoming condensed click-through across all 515 cases), THEN build-accurate wording + live VIU on the QA branch. **No cases edited now.**
- Spec is source of truth: every PENDING-SPEC item (P9, P32, P33) and the spec-verify half of the FIRM items (P24, P25) must be confirmed against the current Confluence spec before any edit (Rule 23).
- Every case touched at reconciliation still needs its Rule-20 traceability (ticket SV-8582 child story + spec anchor) and Rule-9 build-accurate wording, and any deviation must be VIU-observed live with evidence (Rules 10/12/13), not inferred from this video.
- The CROSS-SQUAD persistence item (P19) must be mirrored into the Filters project memory so the two squads don't duplicate the account-level saved-view + shareable-link work.
