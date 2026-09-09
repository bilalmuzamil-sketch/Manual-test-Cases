# SV-9143 (Story 4 – Asset Section) — VIN / Serial breaks onto its own line instead of sitting inline — defect

**Epic:** https://shopview.atlassian.net/browse/SV-8218 (Invoice UI Refresh)
**Owning story (parent of the Story Defect):** SV-9143 (Story 4 – Asset Section), status TESTING QA
**Env:** app.staging.shopview.com, build **v26.35.9-58789c5** (index.html last-modified Tue 08 Sep 2026 16:59:36 GMT, etag `fa8e1648b38e393ed72401e72624313a` — read live at file time).
**Test data:** WO **S2-17466** (id `bd929cc0-eef9-4276-b200-bcf1d57b57dd`), Estimate **EST-S2-17466**, asset **1992 BLUEBIRD Bb Conventional**, VIN/Serial **GXSKH3FMA9DN0NPLF**, Unit 53, Plate UDE-8747, Mileage 108,405, Eng Hrs 6,294.

## Reported summary (user)
"The VIN/Serial appears after a line break if the Work Order → Finance invoice is downloaded in PDF."

## Expected behaviour (the document, Rule 57 — design owns appearance for Story 4)
Per the Story 4 **Design Document** (linked from the spec, S4), the asset section is a single horizontal row holding all six fields in order — **Asset · Unit · Plate · Mileage · Eng Hrs · VIN / Serial** — with VIN / Serial flowing **inline immediately after Eng Hrs**. The design's asset band is `\.asset-band .fields { display:flex; flex-wrap:wrap; gap:4px 26px; flex:1; }` with all six as equal sibling fields; VIN / Serial is the last field on the same row. Rendering the design for a comparably long asset name ("2008 Sterling Truck Acterra") keeps VIN / Serial inline on that one row (ex1).
Spec S4-R1/S4-R2 require the labels "Asset" and "VIN / Serial" and the four optional fields; the single-row placement is the design's.

## Actual behaviour (build — live-observed)
VIN / SERIAL is rendered on **its own line below** the five-field row, leaving the space to the right of ENG HRS empty. Observed on **both** surfaces of the shared invoice document:
- **Downloaded PDF** (the reported surface) — EST-S2-17466.pdf, page 1 asset band (ex2).
- **On-screen** Work Order → Finance document, before any download (ex3) — so the wrap is in the shared document layout, not a PDF-export-only quirk.

## Bite-proof note (divergence from the reported framing)
The report frames this as PDF-only ("if downloaded in PDF"). Live check shows the **same row break on-screen too** — the on-screen Finance preview and the PDF share the document layout. The ticket states both surfaces so a developer is not surprised to reproduce it on screen.

## Exhibits
- `ev/ex1-expected-design.png` — EXPECTED (Story 4 design): six fields on one row, VIN / Serial inline after Eng Hrs.
- `ev/ex2-actual-pdf.png` — ACTUAL (PDF download): VIN / SERIAL on its own line; empty space beside ENG HRS.
- `ev/ex3-actual-onscreen.png` — ACTUAL (on-screen Finance document): same row break, before download.
- `ev/source-pdf-page1.png`, `ev/source-design-band.png` — un-annotated sources.

## Duplicate check
No existing defect covers the VIN/Serial line break. Nearby asset-band items are different: SV-9600 (last-8 bolding), SV-9680 (Mileage/Eng Hrs 0 shown), SV-9794 ("Unknown" printed), SV-9812 (separate VIN+Serial field — OBSOLETE). None is this wrap.

## Filed
Story Defect on SV-9143 (parent = SV-9143), priority Medium, human voice, PO-runnable reproduction on the staging document + fastest-way deep link + 3 annotated exhibits + technical detail last.

## Mobile checks (requested 2026-09-09) — build v26.35.9-58789c5
Checked at an iPhone-sized viewport (390×844, touch).
- **Mobile web Finance view:** the invoice document renders correctly and readably on mobile — masthead, addresses, order chips and Work Summary are all fine. The asset section shows the **same VIN / Serial line break** (VIN / Serial on its own line, empty space beside Eng Hrs). Exhibit `ev/ex4-mobile-web.png`. No mobile-specific layout breakage found (the large "IBS Location ID not configured" toast that overlays content is a pre-existing env/config banner, also present on desktop, not part of the invoice).
- **PDF downloaded on mobile:** `EST-S2-17466.pdf` downloaded from the mobile session is the **same 8-page A4 document** as the desktop download — identical asset-band coordinates (VIN below Eng Hrs), same content. Server-generated and device-independent; md5 differs only by the embedded generation id. So the PDF is correct on mobile, carrying the same VIN / Serial defect.

**Conclusion:** the VIN / Serial row break is present on desktop web, mobile web, and the downloaded PDF (desktop and mobile) — it is the shared invoice document layout. No additional mobile-only defect.

## On-screen exhibit corrected
The first on-screen crop was poor; replaced with `ev/ex3-actual-onscreen-v2.png` (clean crop of the real app view) and `ev/ex4-mobile-web.png`.

## Inline images — resolved via real Jira attachments (2026-09-09)
Jira's external-media fetch (raw.githubusercontent) rendered intermittently ("Preview unavailable" on some images even with width/height/localId set, and even as a single combined image). Fixed by uploading the 4 annotated PNGs as **real Jira attachments** (ids 60475–60478, sizes byte-verified) and setting the description via **REST v2 wiki markup** (`!file.png|width=900!`). Verified: 4 mediaSingle/media ADF nodes + 4 `<img src=.../attachment/content/...>` in rendered HTML — Jira-hosted, renders reliably. Method needed a browser login (no API token available); details + the login2 interstitial fix folded into APP-ACTIONS-PLAYBOOK.md §V.7.
