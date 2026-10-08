# Part Lifecycle — source check, 8 Oct 2026 (tech plan shared by the QA lead)

| Source | What we built the 62 cases on (30 Sep 2026) | What is current (8 Oct 2026) |
|---|---|---|
| PRD, Confluence 829227015 | "In review — 2026-09-09"; 207 anchors we assigned | **"Ready for dev - 2026-10-07"** (tech plan cites v22). Page last modified about 13:25 UTC on 8 Oct 2026, after the tech plan. **288 requirement IDs** (S1-R1 … S13-E1). Saved: `sources/CONFLUENCE-829227015-PartLifecycle-v22-2026-10-08.md` |
| Tech plan | none supplied | **First copy we hold**, dated 2026-10-07, written against PRD v22. Read 100% (1,130 lines, 135,715 bytes, lines 1–1130). Saved: `sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md` |
| Design, artifact Vz6rprcWyP16tYxzM1kdeE | 11 boards driven | The tech plan says **46 boards on pages 1–7** (create, correct, retire, bulk, tracking, daily, library). Not re-read yet |
| Jira | epic only; story tickets "TBD" | Epic SV-10647 is "Design In Progress"; **13 stories SV-10814 … SV-10826** (Open, updated 8 Oct); **9 verification tasks SV-11038 … SV-11046** (Board Backlog) |
| Build | none | still none (tech plan status: "Not started") |

**Live TestRail (snapshot `snapshots-2026-10-08/live-cases.json`):** 62 cases in 14 sections under 20439, all created
and last edited by us; the only change after 30 Sep is our own title sweep on 7 Oct.

**Verdict:** the suite is behind on PRD, design and Jira, so it needs a full update (Rule 122). That update has
not started and is waiting for the QA lead's go-ahead (Rules 11, 81).

**Testable behaviour the tech plan adds or pins down** (all must be checked against the PRD's own words before it is used, Rule 57):
- Exact messages:
  - "Select 200 parts or fewer."
  - "Select at least one part."
  - "A note cannot be longer than 255 characters."
  - per-part reasons "Part not found." / "Part is already in that state." / "A core follows its part. Activate or deactivate the part instead."
  - "{part number} is inactive. Activate it from the Inactive tab to use it."
  - "Part number {number} already belongs to another part in the Part Library."
  - "Part number can't be longer than 50 characters while it's on an open part request."
  - "This Part Library entry is in use and cannot be deleted."
  - "A part from the Part Library must have Vendor as its source."
  - "No inactive parts at this location."
  - "Part activated." / "Part deactivated."
  - "These parts are inactive and were not added: A, B."
- Hover text "Clear selection" on the bulk bar's X. This also appears on the **work-order lines bulk bar** (a regression check on an existing screen).
- "Not Tracked" in the export, cycle count and global search.
- Effects of an untracked or inactive part:
  - Critical Reorder leaves out untracked and inactive parts.
  - The Supply filter shows untracked parts only under "All".
  - Inventory Value for a past date counts each part as it was then.
  - The printed count sheet leaves untracked parts out.
- A rename carries to open purchase-order lines, part requests, canned jobs, vendor returns and return requests. Completed work keeps the old number. A rename through the public API shows "| Changed through: Public API" in Part History.
- CSV import never moves or renumbers a part, and a blank Manufacturer cell keeps the existing manufacturer.
- Part History search covers every entry. Entries for other locations show "Changed at {location}".
- "Library Part" detail-page title, "Edit Library Part", and "Are you sure you want to delete this library part?".

**Open with Product per the tech plan (not yet answered — PO questions, never assumed):**
- **Q18:** does "save an untracked part" need the Delete permission for every edit, or only for create-untracked and tracking changes?
- **Q19:** partial-failure toast for one part, "1 part updated, {m} could not be changed."

**FYI, not ours:** the developers plan 11 automated TestRail cases and to deprecate C89, C91 and C20455 (cases we did not create; Rule 38).
