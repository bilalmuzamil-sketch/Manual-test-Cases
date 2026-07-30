# Filters — Questions for Branko (from the engineering plan) — 2026-07-30

Plain-language product questions only (no bugs, no test jargon). These came up because the engineering build plan for the filter redesign describes a few things differently from the product write-up and the design pictures.
Please pick an option (or write your own answer) for each.

## Question 1 — Opening someone else's filtered link

**What happens now:** A teammate can send a link that opens the Work Orders page with certain filters already picked. Engineering is building it so the link is a TEMPORARY view: it never replaces the filters you saved for yourself, and a small "back to my saved filters" option brings your own filters back. One sentence in the written description says the opposite (the link's filters would become your saved ones).

**The question:** When I open someone's filtered link, should it show their view temporarily and leave my saved filters untouched, or replace my saved filters?

**Options:**

- A) Show their view temporarily and leave MY saved filters untouched (what engineering is building - and what you reportedly agreed in the page comments).
- B) Replace my saved filters with the link's filters.

**Your answer:** ____________________

## Question 2 — The "Imported" status works alone

**What happens now:** Imported work orders live in a separate list behind the scenes. Engineering is building the Imported choice so it works ALONE: when you pick Imported, the other filter buttons (Customer, Lead Technician, Service Advisor, Asset on site) grey out and cannot be combined with it. The written description lists Imported as a normal status like any other.

**The question:** Should picking "Imported" work alone and grey out the other filters?

**Options:**

- A) Yes - Imported works alone (what engineering is building; combining it is not technically possible today).
- B) No - I expected it to combine like the other statuses (this would need extra engineering work).

**Your answer:** ____________________

## Question 3 — Mobile: single filter windows - instant or with an Apply button

**What happens now:** On a phone, tapping one filter button opens a small window from the bottom. The design pictures show an "Apply filter" button in that window; the engineering plan makes single-filter windows apply INSTANTLY as you tick (no button) - only the combined "All Filters" window keeps an "Apply filters" button.

**The question:** In the single-filter window on a phone, should choices apply instantly as you tick, or only after tapping an "Apply filter" button?

**Options:**

- A) Instantly as you tick, no Apply button (the engineering plan's way).
- B) Only after tapping an "Apply filter" button (as the design pictures show).

**Your answer:** ____________________

## Question 4 — Which tab opens first

**What happens now:** Engineering decided that the very FIRST time someone opens the redesigned Work Orders page, the ESTIMATES tab is selected (even though "All" is the first tab in the row). After that, the page always reopens on the tab you used last. This was decided for speed reasons and is not written in the product description.

**The question:** Is Estimates the right tab to open first for a brand-new visit?

**Options:**

- A) Yes - Estimates first is fine.
- B) No - it should open on All (please note: engineering chose Estimates to keep the heaviest list off the landing page; picking B needs a talk with them).

**Your answer:** ____________________

## Question 5 — The Parts "Vendors" page filters

**What happens now:** The written description lists a Vendors view among the Parts pages that get filters, but engineering could not find a design picture for it and will not build its filters until a design exists. They have requested the design.

**The question:** Please confirm the Vendors page IS meant to get filters, and have the design added - or tell us it is out of scope.

**Options:**

- A) Vendors gets filters - design coming.
- B) Vendors is out of scope for now.

**Your answer:** ____________________

## Question 6 — The updated requirements page (a request, not a choice)

**What happens now:** The engineering plan tells us the requirements page for the filters has newer content than the copy we have. The newer version also covers the Parts page filters, the Reports page filters, a new date-range filter, the new in-page search box, and a change to how the top search bar works. Our copy is the original version.

**The question:** The requirements page has newer content than what we have - please export/share the latest version (the same way as before), so we can bring all the tests in line with it. This also covers the updated write-up we asked for on July 17 - it looks like it already exists.

**Options:**

- A) Shared - here is the latest version (sent along with these answers).
- B) It will follow shortly (please say when).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are from the project's `testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | FLT-URL-02 (C29618); FLT-URL-05 (new, no C-ID yet); FLT-PSRCH-04 (new, no C-ID yet) | Source: tech-plan-2026-07-29/Questions-for-Branko-dev.md Q2 = TECH-PLAN-DELTAS conflict C1 (tech plan G7: shared-link view is runtime-only, never persisted, with a 'back to my saved filters' affordance; spec sentence says link state persists). Plan cites Branko's page-comment agreement - unconfirmed. | A -> FLT-URL-02 gains the runtime-only + revert affordance expected; author FLT-URL-05/FLT-PSRCH-04 as staged. B -> keep the persisting-link expected; engineering must change the build. Verify LIVE at VIU either way. |
| 2 | FLT-STAT-03 (C29562); FLT-STAT-07 (new, no C-ID yet) | Source: Questions-for-Branko-dev.md Q3 = conflict C2 (tech plan G1: 'Imported' is EXCLUSIVE - selecting it disables the other four chips; spec lists Imported as a normal status value). | A -> FLT-STAT-03 gains the exclusivity expected + FLT-STAT-07 (greyed-out chips) goes in. B -> cases keep combinable-Imported and engineering needs extra work. Verify LIVE at VIU. |
| 3 | FLT-MOB-04 (C29624) | Source: Questions-for-Branko-dev.md Q4 = conflict C4 (tech plan D15: single-filter bottom sheets apply in real time, no Apply button; the design pictures show 'Apply filter' in the single-filter sheet). | A -> reword FLT-MOB-04 to instant-apply, no button. B -> case stands as designed (Apply button). Verify LIVE at VIU. |
| 4 | FLT-TAB-06 (new, no C-ID yet) | Source: Questions-for-Branko-dev.md Q5 = conflict C5 (tech plan D10: first-visit default tab = Estimates for load reasons; not in the spec). | A -> author FLT-TAB-06 with Estimates-first + last-tab-remembered. B -> All-first; engineering discussion needed before the case is authored. |
| 5 | FLT-PARTS-08 (new, no C-ID yet) | Source: Questions-for-Branko-dev.md Q6 = conflict C7 (spec lists a Parts Vendors view for filters; no design exists; engineering will not build until a design lands - they requested it). | A -> keep/author the Vendors filter case(s) once the design arrives. B -> mark Vendors filters out of scope; no case. |
| 6 | whole suite (122 authored; 79 in TestRail C29557-C29635 + 43 pending add_case) | Source: Questions-for-Branko-dev.md Q7 = conflict C9 (spec drift: the Confluence Filters page is at v1.3 - Parts/Reports filters, date-range filter, in-page Search box ~23 requirements, top-nav search change; our ingested copy is v1.0). Also settles C6/C8 (page-search ownership -> FLT-SRCH-01..09 transfer/retire; query-per-tab). | On receipt of the v1.3 export -> run SPEC-RELEVANCE-RECONCILIATION + build-accurate wording over the whole suite (Rule 11 ask first), then the authorized push. Until then the 43 new Parts/Reports/page-search cases stay design-only VIU-Pending. |

### Already resolved — NOT asked here (for QA reference)

- **Status chip on Estimates/Completed tabs (source Q1 / delta C3)** — RESOLVED by user ruling 2026-07-30: the tech plan's "hidden" and Branko's earlier "greyed-out/disabled" describe the SAME behavior. FLT-TAB-02 (C29609) and FLT-TAB-03 (C29610) stand as pushed — no case change, no TestRail write.

Verify the C-ids for Q1/Q2/Q3 rows against `build/filters/testrail-id-map.csv` before quoting them onward.
