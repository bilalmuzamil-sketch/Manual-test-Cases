# Deliberate-Decisions Register — Simple Flow V2 (Rule 46)

Six fields per entry. No C-IDs yet. HIGH RISK = a concession if raised publicly, not that we are wrong.

### D1 — No QA build; whole suite source-verified only (Rule 85)
1. Every case carries `AUTOMATION: Not available on Build to test Yet - Last checked 8/21/2026`; none is build-verified.
2. "The feature is not on a testable environment yet, so the tests are written from the spec/designs and will be confirmed against the build when one exists."
3. QA env "Not yet available" (user); epic Open; stories Open. Rule 85.
4. All 61 cases.
5. QA lead / dev — a build-verify sync (skill 03) lifts the markers.
6. **LOW** — expected posture for a not-yet-built feature.

### D2 — Authored from spec v21 AC + permission map + design bundle; screenshots not OCR'd
1. Cases are authored from the spec v21 acceptance criteria, SV-8183, and the Work Order PRD/matrices text; the ~150 design screenshots were treated as design confirmation, not bulk-read (Rule 88).
2. "We built the tests from the written spec and design notes; the screenshots back them up but we did not transcribe 150 images."
3. Spec v21; SV-8183; Work Order PRD; matrices. Rule 88 (never bulk-read).
4. Whole suite; visual-only pixel details (not in the AC) are deferred to build-verify.
5. QA lead — confirm this depth is right; a build-verify pass will read the live screens.
6. **LOW-MEDIUM** — the AC is detailed and self-sufficient; any screenshot-only detail is caught at build-verify.

### D3 — Story 10 (Bulk delete lines) authored as one out-of-scope boundary case
1. SV-9256 is explicitly a follow-up; we authored a single negative (SFV2-BULK-08) asserting the bulk bar carries no delete, rather than a delete suite.
2. "Bulk delete isn't in this release, so we only test that it's correctly absent."
3. Spec Story 10 header ("Follow-up, not in this release"); epic out-of-scope.
4. SFV2-BULK-08.
5. Milos Vasic — confirm bulk delete stays out of V2.
6. **LOW**.

### D4 — No standalone engineering tech plan (Rule 30)
1. No separate tech plan was supplied; the change log says a tech-plan review was folded into the spec on 2026-08-20. Authored from the spec; reminded.
2. "There's no separate engineering plan; we used the spec, which the team says already absorbed that review."
3. Spec change log 2026-08-20; Rule 30 (remind, informs-not-overrules).
4. Whole suite (edge cases a tech plan surfaces may be missed).
5. QA lead / dev — supply a tech plan if one exists.
6. **MEDIUM** — a tech plan can reveal state-machine/API edge cases the spec glosses; non-blocking.

### D5 — SV-8726 / SV-8734 / SV-8540 / bugs folded into story coverage
1. Extra epic children were mapped onto the numbered stories rather than authored separately: SV-8726 (PO 'Total Price'->'Total Cost') noted on the PO-pages cases; SV-8734 (bulk approve/decline) = Story 8; SV-8540 (Receive-all) = Story 13 bulk receive; 4 bugs (3 Done, 1 Ready-to-Fix) = correct behaviour under the stories.
2. "A few extra Jira items repeat things the numbered stories already cover; we tested them there instead of twice."
3. Epic child list vs spec story table; SV-8495 is Ready-to-Fix (its correct behaviour is Story 5).
4. SFV2-PO-01 (SV-8726), SFV2-BULK-05/06 (SV-8734), SFV2-RCV-01 (SV-8540).
5. Milos Vasic — confirm SV-8726's exact PO column rename wording ("Total Cost") is in scope here.
6. **MEDIUM** — SV-8726 is a concrete label change I have not seen a separate spec line for; flagged as PO question PO-SF-1.

### D6 — Permissions authored from SV-8183 though the ticket is "Blocked"
1. Story 21 and every `permissions_required` field use SV-8183's atom map and per-role matrix, even though SV-8183's Jira status is "Blocked".
2. "We used the permission map the spec points at; note its Jira ticket is marked Blocked, so the mapping could still change."
3. SV-8183 (live read 2026-08-21, status Blocked); spec Story 21 references it as authoritative.
4. SFV2-PERM-01..04 and the permissions line on every case.
5. Milos Vasic / Sasha Grosman (SV-8183 assignee) — confirm the map is final. PO question PO-SF-2.
6. **MEDIUM** — a Blocked source may move; the mapping is the current authoritative statement and is disclosed.
