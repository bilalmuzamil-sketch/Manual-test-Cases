# POST-WRITE ASSERTION RE-AUDIT — WIP Chris Q1=A / Q2=B pass (§2.10 / Rule 50)

Re-audited from **LIVE TestRail** (not the oplog) AFTER the writes. Scope = only what this pass changed:
5 cases (4 updated + 1 new). Method: split `custom_expected` into body / provenance / marker and check
the BODY.

## Invariant census (read live 2026-08-18)
| Case | provenance lines | markers | separators | raw markup |
|---|---|---|---|---|
| C30456 | 1 | 1 | 1 | none |
| C30458 | 1 | 1 | 1 | none |
| C30464 | 1 | 1 | 1 | none |
| C30493 | 1 | 1 | 1 | none |
| C43979 | 1 | 1 | 1 | none |

Exactly one provenance line + one marker + one `---` each; no `<ol>/<li>/<p>/<br>/<hr>/<a>` markup.

## The four material checks, per case
1. **Quote-back to cited source (Rule 58 gate).** Every new assertion is a paraphrase/quote of the
   **live spec v21 §3 Key Decisions (SV-9027)**: *"A work order carrying lines in more than one state
   appears in each matching tab, showing only that tab's slice of its money; the status column still
   shows the work order's true status. The buckets are disjoint and always sum to the work order's total
   quoted value…"* + **Chris Ward's answer B**: *"we're treating WIP as a sum of lines, not work
   orders."* C30493 item 7 is spec **S5a-R2** verbatim. **All quotable. PASS.**
2. **Reachable by the case's own steps.** C30456 (look through all four tabs for each WO) · C30458 (count
   appearances across tabs) · C30464 (look for each Approved WO in each tab) · C43979 (seed a mixed
   line-state WO, look in every tab, read per-tab money, sum) · C30493 (hover each icon, compare wording).
   **Every asserted item is reachable. PASS.**
3. **Content belongs to this case.** All five are WIP; assertions concern WIP tab placement / summary
   strip only — no foreign report's columns/figures. **PASS.**
4. **Note paragraphs diffed.** C30493's old ambiguity note ("states this two ways… raised with the PO")
   is REMOVED and replaced by a **confirmation** citation (Rule 56 — Q1=A is agreement, not divergence;
   no false divergence sentence). C30458/C30464 old two-model ambiguity notes REMOVED; each now carries a
   **true** Rule-56 divergence sentence (older S2-R4/Story-3 status wording superseded by Chris's B). No
   waiver phrasing ("known and accepted", "on purpose for now") introduced. **PASS.**

## Marker handling per case (Rule 69)
- **C30493** — testable content UNCHANGED (item 7 byte-identical; only the note + provenance moved) →
  **metadata/note change → marker unchanged** (`Not available on Build to test Yet - Last checked
  8/17/2026`). Correct per the content-vs-metadata refinement.
- **C30456** — testable content changed (item 2 reworded to line-state) + build deferred → marker stays
  the deferred form it already carried. Correct.
- **C30458, C30464** — testable content changed + build deferred; their prior `AUTOMATION: HOLD` reason
  was the now-resolved ambiguity (NO ticket/blocker ref to preserve) → **QA-lead-authorised** switch to
  `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`. This is the one Rule-69 case
  where the deferred marker replaces a HOLD, and it was explicitly authorised (the HOLD carried no
  ticket). Recorded here as the authority for the overwrite.
- **C43979** — newly authored, build deferred → deferred marker. Correct.

**No `AUTOMATION: READY - EXPECT FAIL` or ticket-carrying HOLD was overwritten.**

## Verdict
**0 material defects. All five cases pass the four checks. The reworded cases mutually agree and agree
with the intended reword of the two held Automated cases (C30462, C30452).**
