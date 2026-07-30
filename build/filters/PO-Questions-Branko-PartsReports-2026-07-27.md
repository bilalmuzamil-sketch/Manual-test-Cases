# Filters (Parts, Reports & page search) — Questions for Branko — 2026-07-27

Plain-language product questions only (no bugs, no test jargon).
Please pick an option (or write your own answer) for each.

## Question 1 — A written description for the Parts and Reports filters

**What happens now:** We now have the design pictures for the new filter buttons on the Parts pages and on the Reports pages, so we know which buttons appear on each page. What we do NOT have is a written description that says how they should behave - what each button does, what choices are inside it, and what the page should look like after you pick something.

**The question:** Can you share a written description (the same kind we have for the Work Orders page) for the Parts filters and the Reports filters, so we can test them properly?

**Options:**

- A) Yes - a write-up exists or will be provided.
- B) No write-up yet - test only what the pictures show for now, and treat all behaviour as 'to be confirmed later'.

**Your answer:** ____________________

## Question 2 — Which filter buttons actually filter each page

**What happens now:** The pictures show a row of filter buttons at the top of each Parts page and each Reports page (for example on Inventory: Bin Location, Category, Supply, Vendor). The pictures do not tell us whether every button really narrows the list, or whether some are just shown for now.

**The question:** On each Parts page and each Reports page, should every filter button shown in the design actually filter the list or the report when used?

**Options:**

- A) Yes - every button shown filters that page.
- B) Some are not active yet (please tell us which ones).

**Your answer:** ____________________

## Question 3 — The full list of choices inside each filter

**What happens now:** When you click a filter button it should open a list of choices (for example the Status button, or the Vendor button). The pictures only show the buttons, not the full list of choices behind each one.

**The question:** Can you give us the full list of choices for each filter on the Parts and Reports pages (for example all the statuses, all the vendor options, the date options)?

**Options:**

- A) Yes - here is the list / it will be provided.
- B) The choices come from the shop's own data (for example the list of real vendors), so there is no fixed list.

**Your answer:** ____________________

## Question 4 — How the new kinds of filter work

**What happens now:** The Parts and Reports pages show some filter buttons we do not have on the Work Orders page - for example Location, Transaction Type, Invoice Status, Type, User, Mention, and a Core / Non Core filter. We do not know how each of these is meant to work.

**The question:** For each of these new filter buttons, what choices should it offer and how should it narrow the page - can you pick more than one choice, and does the page update right away?

**Options:**

- A) Yes - here is how each one works / it will be described in the write-up.
- B) Something else (please explain).

**Your answer:** ____________________

## Question 5 — Do the Parts and Reports filters work the same way as Work Orders

**What happens now:** On the Work Orders page the filters let you pick more than one choice, clear a single filter or clear them all, collapse the filter bar, remember your choices when you come back, share a link that keeps your filters, and work on a phone. We do not know if the Parts and Reports filters behave the same way.

**The question:** Should the Parts and Reports filters behave exactly like the Work Orders filters for these things (multiple choices, clearing, collapsing, remembering, shareable link, phone)?

**Options:**

- A) Yes - they should behave the same as the Work Orders filters.
- B) No - there are differences (please tell us which).

**Your answer:** ____________________

## Question 6 — The pop-up search box ("Search or ask a question")

**What happens now:** The designs also include a pop-up search box that opens from the top bar (or with a keyboard shortcut) and searches across work orders, customers, assets, parts, vendors and part sales. It shows the words "Search or ask a question". This same search box is also part of a separate piece of work called Global Search.

**The question:** Is this pop-up search box part of THIS filters release (so we test it here), or is it owned by the separate Global Search work? And does the "ask a question" part (an AI answer) go live now, or later?

**Options:**

- A) Test it as part of Global Search (not here) - and 'ask a question' is for later.
- B) It is part of this filters release - please confirm what 'ask a question' should do now.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 7 — Do the filter choices depend on the person's role

**What happens now:** For the Work Orders page you already confirmed the filter lists are the same for everyone (they do not change by a person's role). We do not know if the same is true on the Parts and Reports pages.

**The question:** On the Parts and Reports pages, should the filter buttons and their choices be the same for every user, or should some be hidden or limited depending on the person's role?

**Options:**

- A) Same for everyone - the person's role does not change the filters.
- B) Some filters or choices depend on the role (please tell us which).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are blank until a permitted push (`build/filters/testrail-id-map.csv`, Standing Rule 8).

| Q# | Affected internal case IDs | Design refs | Resolves to |
|---|---|---|---|
| 1 | FLT-PARTS-01..12, FLT-RPTS-01..22 | design-notes.md §B.5 (9 Parts screens) + §B.6 (23 Reports screens) give the chips + columns, but NO behaviour spec exists (requirements.md Stories 1-12 are Work Orders only). All 34 Parts/Reports cases authored design-only, viu_status VIU-Pending. | A -> ingest the PRD, run SPEC-RELEVANCE-RECONCILIATION + build-accurate wording, then VIU. B -> keep the design-level cases as-is; behaviour stays flagged 'to be confirmed' until the write-up lands. |
| 2 | FLT-PARTS-11, FLT-RPTS-21 | Behaviour cases assert the list/report narrows when a filter is chosen; the design does not pin which chips actually apply. Flagged pending PRD. | A -> tighten the behaviour expected per page. B -> mark the inactive chips and adjust the affected per-page cases. |
| 3 | FLT-PARTS-09, FLT-PARTS-11, FLT-PARTS-12, FLT-RPTS-21, FLT-RPTS-22 | Option lists behind each chip are not in the design. Part Type is the only pinned list (Core / Non Core / Clear selection, §B.5 #9). | A -> add option-list checks per filter. B -> data-driven lists: verify against seeded shop data at VIU, no fixed expected list. |
| 4 | FLT-PARTS-09, FLT-RPTS-12, FLT-RPTS-13, FLT-RPTS-15, FLT-RPTS-16, FLT-RPTS-17, FLT-RPTS-20, FLT-RPTS-22 | New filter types vs the WO page: Location, Transaction Type (A/R + A/P Aging Detail/Collection/Unpaid), Invoice Status (Sales Tax), Type + User (QB Unexported), Mention (Notes), Core/Non Core (Returns). | A -> author per-type option + apply checks once described. B -> per Branko's explanation. |
| 5 | FLT-PARTS-12, FLT-RPTS-21, and parity with FLT-* WO cases C29557-C29635 | Parity of multi-select / Clear filters / collapse / persistence / URL / mobile with the Work Orders filters is assumed but not pinned by the Parts/Reports designs. | A -> reuse the WO behaviour cases per Parts/Reports page. B -> author difference-specific cases for the exceptions. |
| 6 | FLT-SRCH-01..09 | Page-search / Command-K component (design-2026-07-27 screenshots, Figma 11829-8908). OVERLAPS the Global Search project (86 cases already authored there). FLT-SRCH-09 is a scope-decision case. OQ-3 (AI 'ask a question' scope) still open. | A -> retire/keep FLT-SRCH-01..09 in favour of Global Search's suite (avoid duplicate testing). B -> keep here and de-scope from Global Search; confirm AI behaviour. |


> **QA-INTERNAL NOTE — USER RULING 2026-07-31 (Q6 = the search/ownership question).** Verbatim: *"OK do not delete those cases unless Branko confirms that they are related to Global search only."* All nine cases FLT-SRCH-01..09 (new, no C-IDs yet — none is in TestRail) **STAY in the Filters suite** and must NOT be deleted or moved until Branko explicitly confirms Global-Search-only ownership; **his answer to this Q6 decides move-vs-keep.** The 2026-07-31 Ruthless Usefulness Audit recommends CUTting all nine (duplicated by the Global Search project's 86-case suite) and scored FLT-SRCH-09 NONSENSE as well — those remain RECOMMENDATIONS ONLY and are re-tabled once he answers. (FLT-SRCH-09 was briefly retired locally on 2026-07-31 under a partial authorization; the retirement was REVERTED the same day on this ruling and the case is active again.) Nothing in the PO-facing wording above changed.

| 7 | permissions_required flag on all FLT-PARTS-* / FLT-RPTS-* | OQ-4 was resolved for the Work Orders page (filter lists role-independent). Not confirmed for Parts/Reports; every new case carries a role-difference 'to confirm' flag in permissions_required. | A -> no per-role cases needed. B -> add role-scoped cases per affected filter. |
