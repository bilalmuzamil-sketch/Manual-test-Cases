# Rule-65 notice — two of Vladimir Tomovic's Automated cases corrected (2026-09-10)

Authorised by Vladimir Tomovic (per the QA lead) for THIS SESSION only; both Automated
(`custom_atmstatus = 3`, unchanged). Build-verified live on staging; corrections are step-wording
only (name the real build controls). Expected results unchanged. Rendered `fr-view`; runnable-gate 2/2.

## C43850 — https://shopview.testrail.io/index.php?/cases/view/43850
Report Location scope follows the signed-in user's enrollments (SV-8582). Step 2 reworded to name the
"Manage staff enrollments" dialog's real controls: **Select Workplace / Select Department / Enroll**.
Note: the enrollment dialog labels the entity **Workplace**; the Work In Progress report labels the same
entity **Location** — both confirmed on the build.

## C45275 — https://shopview.testrail.io/index.php?/cases/view/45275
Changing the customer clears the Authorizer; changing only the contact does not (SV-8218). Steps 2-4
reworded: the **Change Customer** control is the **swap ⇆ icon** at the top-right of the WO customer card
(hover tooltip "Change Customer"; NOT the "Change Asset" swap icon on the vehicle card); the dialog's
submit button is **Update Customer**; the Authorizer picker's clear row is **"No authorizer"**. All
confirmed live.

## Method note
Both use TestRail's separated-steps format; edits were made to `custom_steps_separated` content only,
expecteds preserved (C45275) / unchanged in substance (C43850 — TestRail normalised em-dash→entity and
appended newlines on the round-trip; no visible change). Before/after snapshots + screenshots:
`build/custom-roles/build-verify-vlad-2026-09-10/`.
