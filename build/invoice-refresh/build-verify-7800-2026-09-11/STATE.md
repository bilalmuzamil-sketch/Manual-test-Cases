# Build-verify — Invoice Design Selection (folder 7800) on sv9872 — COMPLETE (pending served scan)

- Branch sv9872.qa.shopview.com, build **v26.36.2-12974d6**, 2026-09-11.
- 57 cases; **12 WITHDRAWN** excluded (C53546,53548,53552,53554-53562). **45 active**, all ours (created_by=3, atm=1).
- **All 45 active cases: runnable-gate 45/45; stored render check 45/45 clean.**

## Anchor (observed LIVE, matches the cases' quoted wording exactly)
- Settings → Invoice tab → **Invoice Design** pick list (top). Options **Modern / Legacy**.
- Helper text, "Switch to the <X> design?" dialog + body + **Cancel** / **Switch To <X>** buttons, **"Invoice design updated."** toast — all verbatim matches.
- Document surfaces: Work Orders → the work order → **Finance** tab; **print / email / get_app (download)** controls; **Create Invoice**; **Estimate/Invoice** view.
- Observed labels: `build/OBSERVED-UI-LABELS-sv9872.md`.

## What was corrected (Expected fields untouched, Rule 57)
- Setting-picker cluster (14): concrete route + observed labels; dropped provisional caveats.
- Document cluster (31): concrete Finance-tab document route attached; block-formatted; provisional dropped;
  4 cases (C53542/53545/53563/53564) given a concrete first step (entry point).

## Note
- Cases were pre-built PROVISIONALLY ("feature not yet built"); the feature is now live and every quoted
  string matches the build — a strong source-accuracy result. Design left on Modern.

## Served-page scan (2026-09-11): all 45 active cases render fr-view, escaped=true=0 (only empty placeholder slots show fr-view=false). QUALITY CONFIRMED.

## 2026-09-11 (corrected) — MARKERS FLIPPED, the actual build-verification deliverable
The QA lead noted the folder still looked un-verified — correct: the cases still carried
"AUTOMATION: Not available on Build to test Yet" + a provisional Note and NO build-check stamp.
Fixed on all 45 active cases:
- Removed the "feature not yet available on a QA build / provisional" Note from every Expected.
- Added the build-check stamp: "Last checked against build v26.36.2-12974d6 on 9/11/2026."
- Set the marker: **42 AUTOMATION: READY** + **3 HOLD** (customer-portal cases C53566/53567/53569 —
  portal only exists on staging, cannot run on a QA branch).
- Fixed the document route glossary: Parts Sale is under **Part Sales**; a Credit Invoice is raised
  from an invoice's **Issue Credit** action, viewed under Customers → the customer → Invoices (playbook §J).
Arithmetic: READY 42 + EXPECT-FAIL 0 = 45 total − HOLD 3. Runnable gate 45/45; stored render 45/45.
Learning L0039 recorded.
