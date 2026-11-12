# Re-point the 13 "existing data stays the same" cases to staging — DRY RUN (nothing written)

Section 133628 "Run on Staging After the Feature Is Deployed" (suite 1). Read live from TestRail on **12 Nov 2026**.
**No TestRail write has been made.** No result posted, run 557 untouched.

## What the live case bodies actually say (Rule 112)

The cases **name no production record at all**: no CM1-4411, no "aqeel transport 56", no "Delete Test", no "Truck Hill 1"
or "Trucks Hill 2", no production address and no fixed as-of date. They are written generically ("customer A", "credit
memo A", "location A / B", "date A"). So under Rule 111 **there is no identifier to correct**. The only production-bound
wording is **timing**: "before the release was installed", "After the release is installed", "On release day", "saved /
taken / noted before the release". That is Tier A below. The staging records and the snapshot folder can only be
**added** (Tier B).

## Two tiers — Tier B needs an explicit yes (Rule 63)

| Tier | What | Rule position |
|---|---|---|
| **A — timing phrases only** | 58 phrase replacements across the 13 cases (7 titles, preconditions, steps and our own Expected wording): "before the release was installed" → "before the feature was deployed on staging", "After the release is installed" → "After the feature is deployed on staging", "On release day" → "After the staging deploy" (titles), and similar | Inside Rules 111/113: environment/timing wording only, outside every quoted source sentence and the AUTOMATION line |
| **B — one ADDED precondition per case** | Names the staging records and links the staging snapshot folder (and the production snapshot kept for the after-release check). For C1062590: CM2-4541 (12 Nov) before 14 Nov, CM2-4540 (14 Nov) from 14 Nov. For C715582: Mobile Truck & Trailer Repair Island Lake / 123 Cannabis Forestlawn. For C715480/583/619/620: Staging Heavy Duty - 9919 / Staging Lethbridge - 4310 | 🔴 **Conflicts with Rule 111's "the identifier ONLY, and nothing else"**: there is no identifier in these cases to replace, so this is new text. The coordinator's order asks for it; Rule 63 says surface the conflict first. **Write Tier A alone unless the QA lead says yes to B.** Alternative to B: keep the cases generic and hand testers the staging values through the run (`../staging-before-feature-captured-2026-11-12/README.md`) |

## Left unchanged on purpose

- **Every sentence under "Exact quotes from the source"** (Rule 113), including the PRD's own "release" wording.
- **The AUTOMATION line** ("AUTOMATION: HOLD - needs records and screenshots captured before the release is installed
  on the test site"): Rule 111 excludes the marker; its wording is already environment-neutral ("the test site").
- **"release" meaning the change itself, not where or when to run:** "as PRD section 2 lists for this release", "Why:
  the release changes the shared filter parts", "from this release a credit dated exactly on the as-of date is
  Current", "bookmarks made before the release keep working" (the tech plan's reason; still true on staging).
- **C715471 "(16 invoices across 13 customer accounts in production)"**: a PRD fact about production data, not a
  where-to-run instruction. On staging the number of overpaid invoices is different. Flagged; not changed.

## Checks before any write (Rules 71, 41)

- **Rule 71:** all 13 have `custom_atmstatus=1` = "Not Automated" (decode: playbook §J, `1 Not Automated · 2 Cannot be
  automated · 3 Automated`); all `created_by=3` (ours). None is protected.
- **Rule 41 at write time:** re-read the PRD's current version (the cases quote **v11, read 10 Nov 2026**); if it has
  moved, stop and report. Per case, log "re-verified whole against PRD v<N> and runnable against staging
  v<marker>", every field checked, and prove every untouched field byte-identical to `repoint-13-before-images/`.
  Write `update_case` with only `title`, `custom_preconds`, `custom_steps`, `custom_expected`; read back and compare at
  content level (playbook §O4); log operation · C-id · HTTP status · verification result.
- **Observation, not verified:** C715475's title carries **SV-12539**. On staging, Inventory Value's PDF for Staging Heavy
  Duty - 9919 already fails **before** the feature (500, "too large"). If SV-12539 is about that PDF, staging's failure is
  not caused by the feature. Check the ticket before C715475 is run.

## Per case — every change, before → after

## C715471 — https://shopview.testrail.io/index.php?/cases/view/715471

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333474 (Unix).

- **Title:** "On release day an untouched A/R report shows the same rows and amounts" → "After the staging deploy an untouched A/R report shows the same rows and amounts" (80 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…as-of date before the release…" → "…as-of date before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging this was done on 12 Nov 2026, before the feature was deployed on staging, for as of 12 Nov 2026 : the screenshots, prints and every row . Choose 12 Nov 2026 as the as-of date. The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (4 in our own wording, plus every quoted source sentence and the AUTOMATION line): "r, and, as PRD section 2 lists for this release, a credit memo or deposit dat"; "ee changes PRD section 2 lists for this release: Date and Due Date are plain"; "ee changes PRD section 2 lists for this release: Date and Due Date are plain"; "ferent A/R Summary Totals row after the release; the PRD names this as a chan"

## C715472 — https://shopview.testrail.io/index.php?/cases/view/715472

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333475 (Unix).

- **Title:** "On release day an untouched A/P report shows the same rows and amounts" → "After the staging deploy an untouched A/P report shows the same rows and amounts" (80 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…as-of date before the release…" → "…as-of date before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Steps:** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging this was done on 12 Nov 2026, before the feature was deployed on staging, for as of 12 Nov 2026 : the screenshots and every row . Choose 12 Nov 2026 as the as-of date. The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (3 in our own wording, plus every quoted source sentence and the AUTOMATION line): "r, and, as PRD section 2 lists for this release, a vendor credit dated exactl"; "ee changes PRD section 2 lists for this release: Date and Due Date are plain"; "wo changes PRD section 2 lists for this release: Date and Due Date are plain"

## C715475 — https://shopview.testrail.io/index.php?/cases/view/715475

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794426239 (Unix).

- **Title:** "SV-12539 - Inventory Value link, PDF and CSV work as before the release" → "SV-12539 - Inventory Value link, PDF and CSV work as before the staging deploy" (78 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…as-of date before the release…" → "…as-of date before the feature was deployed on staging…"
- **Steps:** "…saved before the release…" → "…saved before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging the saved files and links are in files and links . With only Staging Heavy Duty - 9919 ticked, the PDF already failed before the feature was deployed on staging ("This report is too large to export. Narrow the date range or filters, then try again."), so compare the files saved with only DVI Test ticked, and open the link saved with it. Set the as-of date to 12 Nov 2026. The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715617 — https://shopview.testrail.io/index.php?/cases/view/715617

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333478 (Unix).

- **Title:** "Sales By Customer link, PDF and CSV work as before the release" → "Sales By Customer link, PDF and CSV work as before the staging deploy" (69 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…as-of date before the release…" → "…as-of date before the feature was deployed on staging…"
- **Steps:** "…saved before the release…" → "…saved before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging the saved files and link are in files and links : Staging Heavy Duty - 9919 ticked, date range "This month" (November 2026). Set the same date range. The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715618 — https://shopview.testrail.io/index.php?/cases/view/715618

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333479 (Unix).

- **Title:** "Work In Progress link, PDF and CSV work as before the release" → "Work In Progress link, PDF and CSV work as before the staging deploy" (68 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…as-of date before the release…" → "…as-of date before the feature was deployed on staging…"
- **Steps:** "…saved before the release…" → "…saved before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging the saved files and link are in files and links : Staging Heavy Duty - 9919 ticked, as of 12 Nov 2026. Set the as-of date to 12 Nov 2026. The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715476 — https://shopview.testrail.io/index.php?/cases/view/715476

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333480 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Expected (our wording only):** "…as before the release…" → "…as before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging the message noted before the feature was deployed on staging is in export failure . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715480 — https://shopview.testrail.io/index.php?/cases/view/715480

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333482 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Expected (our wording only):** "…taken before the release…" → "…taken before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging your current location is Staging Heavy Duty - 9919 and location B is Staging Lethbridge - 4310 ; the screenshot is in location switcher . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715582 — https://shopview.testrail.io/index.php?/cases/view/715582

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333483 (Unix).

- **Title:** "A drill-down link saved before the release still opens on its customer" → "A drill-down link saved before the staging deploy still opens on its customer" (77 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Steps:** "…saved before the release…" → "…saved before the feature was deployed on staging…"
- **Steps:** "…saved before the release…" → "…saved before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging customer A is Mobile Truck & Trailer Repair Island Lake and vendor A is 123 Cannabis Forestlawn ; the saved addresses are in drill-down links . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (1 in our own wording, plus every quoted source sentence and the AUTOMATION line): "l read it, so bookmarks made before the release keep working"

## C715583 — https://shopview.testrail.io/index.php?/cases/view/715583

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333484 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Expected (our wording only):** "…noted before the release…" → "…noted before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging location A is Staging Heavy Duty - 9919 and location B is Staging Lethbridge - 4310 ; what was noted is in location filter memory . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715619 — https://shopview.testrail.io/index.php?/cases/view/715619

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333486 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Expected (our wording only):** "…noted before the release…" → "…noted before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging location A is Staging Heavy Duty - 9919 and location B is Staging Lethbridge - 4310 ; what was noted is in location filter memory . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715620 — https://shopview.testrail.io/index.php?/cases/view/715620

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333487 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Expected (our wording only):** "…noted before the release…" → "…noted before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging location A is Staging Heavy Duty - 9919 and location B is Staging Lethbridge - 4310 ; what was noted is in location filter memory . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (0 in our own wording, plus every quoted source sentence and the AUTOMATION line): none

## C715584 — https://shopview.testrail.io/index.php?/cases/view/715584

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333488 (Unix).

- **Title:** "Sales By Customer's filter menus behave as before the release" → "Sales By Customer's filter menus behave as before the staging deploy" (68 characters)
- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Expected (our wording only):** "…noted before the release…" → "…noted before the feature was deployed on staging…"
- **Expected (our wording only):** "…as before the release…" → "…as before the feature was deployed on staging…"
- **Expected (our wording only):** "…as before the release…" → "…as before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging what was noted is in Sales By Customer filter menus . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (1 in our own wording, plus every quoted source sentence and the AUTOMATION line): "Why: the release changes the shared filter par"

## C1062590 — https://shopview.testrail.io/index.php?/cases/view/1062590

Automation status: `custom_atmstatus=1` (= "Not Automated"), created_by 3, section 133628, last updated 1794333489 (Unix).

- **Preconditions:** "…before the release was installed…" → "…before the feature was deployed on staging…"
- **Preconditions:** "…After the release is installed…" → "…After the feature is deployed on staging…"
- **Preconditions:** "…dated a day before the release…" → "…dated before the feature was deployed on staging…"
- **Expected (our wording only):** "…as before the release…" → "…as before the feature was deployed on staging…"
- **Tier B — added precondition (needs a yes):** "On staging the customer is ZZAUTOTEST SV11315 Staging CM . Before 14 Nov 2026 use credit memo CM2-4541 ($3.00) with date A = 12 Nov 2026 . From 14 Nov 2026 you may also use CM2-4540 ($5.00) with date A = 14 Nov 2026 (the date picker offers no day after today). Both were in "1-30 days past due" before the feature was deployed on staging: credit memo . The production snapshot of 10 Nov 2026 ( production before the release ) is kept for the short check on production after the release."
- **Left unchanged on purpose** (1 in our own wording, plus every quoted source sentence and the AUTOMATION line): "ture was deployed on staging: from this release a credit dated exactly on the"

