# Deliberate-Decisions Register — Invoice UI Refresh (Rule 46)

Six fields per entry: (1) decision · (2) plain one-sentence answer · (3) evidence · (4) affected cases ·
(5) who can close · (6) RISK. HIGH RISK = a concession to make if raised publicly, not that we are wrong.
No C-IDs yet (nothing pushed).

### D1 — No QA build exists; the whole suite is source-verified only
1. Every case is authored from the documents and carries `AUTOMATION: Not available on Build to test Yet - Last checked 8/21/2026`; none is build-verified.
2. "The feature has not been built yet, so we wrote the tests from the spec and design and will confirm them against the build when it exists."
3. Tech plan Status "Not started"; epic names only the git branch `project/invoice-ui-refresh`; no QA env supplied. Rule 85.
4. All 87 cases.
5. QA lead / dev — when a QA build is stood up, a build-verify sync (skill 03) lifts the markers.
6. **LOW** — expected and honest for a not-yet-built feature; the standard Rule-85 posture.

### D2 — Credit Invoice Balance authored to S11-R6a (open balance), NOT the stale terminology line
1. Story 11 cases assert Balance = the credit's open balance (positive; $0.00 once consumed/voided), following S11-R6/S11-R6a and the status table — NOT the spec's own Terminology (§6) line that still says a fixed "$0.00 in every status".
2. "The spec has two places describing the credit's Balance and they disagree; we followed the newer, specific, engineering-confirmed rule and flagged the older line for cleanup."
3. Spec v38: S11-R6a + status table (change log 2026-08-12, "option (b) chosen", preserves SV-7754) vs §6 Terminology "Balance … fixed '$0.00' row in every status". Rule 32 latest/most-specific wins.
4. INV-CRED-06 (and the Balance column of INV-CRED-03).
5. **Chris Ward** — confirm the terminology line is stale and should be corrected (documentation cleanup).
6. **MEDIUM** — a real spec-internal contradiction; our reading is well-grounded but the PO should ratify it and fix the stale line. Raised as PO question PO-1.

### D3 — Design-doc "Branko owns visual" vs spec "no separate designer"
1. Where the Design Document's POC chrome says "Final visual design is owned by Branko (UI/UX)", we followed the spec: no separate designer on this build; spec owns content/wording, the Design Document owns appearance; conflict → Chris Ward.
2. "One line in the design prototype is out of date about who owns the visuals; the spec settles it, so we ignored the prototype line."
3. Spec Visual design status + change log 2026-08-11 (Story 12; "Chris and Claude are the designers of record").
4. None directly (meta-level); affects how S12 appearance rules are sourced (Design Document as appearance authority).
5. Chris Ward — optional cleanup of the prototype subtitle.
6. **LOW** — resolved by the spec's own split; noted so no one re-derives it.

### D4 — Authored to spec v38; tech plan is behind (v36) and the Aug-13 edit is un-narrated
1. All cases are authored from the live spec v38; the tech plan's v36 requirement extraction was used only as corroboration (Rule 30 — informs, never overrules). The change log narrates edits only through 2026-08-12 although the page metadata shows a v38 edit dated 2026-08-13.
2. "We built the tests from the current spec, not the older version the developers planned against, and we noted one recent spec edit the change log doesn't describe."
3. Confluence metadata version 38 (edited 2026-08-13) vs tech plan "build against v36" (2026-08-12); change log last entry 2026-08-12.
4. Whole suite (version pin in every provenance line).
5. Chris Ward — confirm nothing material changed in the un-logged Aug-13 edit (or point us at it). PO question PO-2.
6. **MEDIUM** — if the Aug-13 edit changed a rule, a case may need re-derivation; low likelihood (change log looks complete to 08-12) but unconfirmed.

### D5 — Visual Standard (S12) cases authored to exact hex/px from the Design Document
1. S12 cases assert the closed palette, accent, weights, px sizes and ink floor verbatim from the spec/Design Document, as automatable checks — marked source-verified-only until a build exists.
2. "We wrote the appearance rules as exact, checkable values so they can be verified precisely once the documents are built."
3. Spec S12-R1..R9, S12-N1 (CEO pass 2026-08-12) + the Design Document.
4. INV-VIS-01..09.
5. QA lead — confirm this depth of visual checking is wanted (some shops treat pixel rules as build-time only).
6. **LOW-MEDIUM** — thorough, but a few (exact px/weight) may be better as a single dev checklist item than separate manual cases; kept KEEP because Story 12 exists precisely to make them verifiable.

### D6 — Authorizer split into its own on-screen area; no API section
1. The Authorizer entry (S3-R5..R9) and the parts-sale Authorizer (S13-R6) are authored as work-order/parts-sale UI cases in their own area, separate from the document-content Authorizer field (S3-R3). No "API" section was created (Rule 4).
2. "Selecting the authorizer happens in the app screen, so those tests are grouped separately from the printed-document tests."
3. S3-R5 "the only entry point"; Vue/Quasar WO UI per tech plan; Rule 4 (no endpoint/verb/status content).
4. INV-AUTH-01..05, INV-PART-06.
5. QA lead / TestRail target owner — confirm the section split fits the target layout.
6. **LOW**.
