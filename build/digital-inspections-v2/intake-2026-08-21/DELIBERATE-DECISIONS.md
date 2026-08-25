# Deliberate-Decisions Register — Digital Inspections V2 (Rule 46)

Six fields per entry. No C-IDs. HIGH RISK = a concession if raised publicly, not that we are wrong.

### D1 — QA branch exists but is WITHHELD; suite is source-verified only (Rule 85)
1. Every case carries the deferred "Not available on Build to test Yet" marker; none is build-verified.
2. "There is a QA environment, but you asked us not to touch it, so we wrote the tests from the spec and will confirm them on the build when you clear it."
3. QA lead instruction ("dont touch the QA branch at the moment"); sv8181.qa.shopview.com exists. Rule 85.
4. All 43 cases. 5. QA lead — clear the branch, then a build-verify sync lifts the markers. 6. **LOW**.

### D2 — Project name mismatch: assigned as "Simple Flow V2", is Digital Inspections V2
1. The header said "Simple Flow V2" but the PRD, epic SV-8181, branch sv8181 and design are all Digital Inspections V2; authored as Digital Inspections V2.
2. "Your message title said Simple Flow V2 but everything in it is Digital Inspections V2, so we built the Digital Inspections V2 tests."
3. Confluence 768507905, epic SV-8181. Rule 2. 4. Whole project. 5. QA lead — confirm the name. 6. **LOW** (all four identifiers agree).

### D3 — S12-R4 drum/disc contradiction HELD (Rule 58)
1. DINV-AUTH-02 authors S12-R4 ("Brake and Axle starting point creates a drum or disc check") to the spec text but flags it HELD: it contradicts the Key Decision that Drum/Disc is a fill-time choice on every axle.
2. "One line in the template-builder spec disagrees with a decision elsewhere in the same spec about brake type; we wrote the test to the spec but need you to confirm which is right."
3. Spec S12-R4 vs Key Decisions; spec Open item 11 already flags it. Rule 58 (ambiguous source held, never resolved from the build). 4. DINV-AUTH-02. 5. **Milos Vasic** (PO-DI-1). 6. **MEDIUM** — a real spec-internal contradiction the spec itself lists as open.

### D4 — Historical-inspection release cut-off affects S5 counts (Open item 1)
1. S5 "needs a work order" counts depend on whether historical completed-with-findings inspections read as needing action on release; the spec recommends a post-release cut-off but it is unconfirmed.
2. "How many old inspections show as needing a work order on day one depends on a decision you still owe; we tested the rule as written."
3. Spec Open item 1; S5-R12/Open question. 4. DINV-HIST-02/04. 5. **Milos Vasic** (PO-DI-2). 6. **MEDIUM**.

### D5 — Authored from spec v18 AC; screenshots/design not OCR'd; tech plan missing
1. Cases are authored from the spec's R/N/E requirements + the design bundle text; the design PNGs were not transcribed (Rule 88). No engineering tech plan exists (Tech Design "TBD").
2. "We built from the written spec; the picture files back it up but we didn't transcribe them, and there's no separate engineering plan yet."
3. Rule 88; Rule 30. 4. Whole suite. 5. QA lead/dev — supply a tech plan; a build-verify pass reads the live screens. 6. **LOW-MEDIUM**.
