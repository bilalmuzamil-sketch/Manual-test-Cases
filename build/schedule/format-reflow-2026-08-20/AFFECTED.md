# Schedule — formatting reflow (2026-08-20)

Interim `<p>/<br>` render-fix pass over Schedule cases (TestRail group 4254, `created_by=3` only),
plus the 3 known raw-markup cases C43554, C43806, C43807 (already inside the group subtree).
Method: TestRail UI Edit → add `.` to Preconditions → Save (reflows all three fields' RENDER).
Detection + verification by the RENDERED view page. Only genuinely-broken renders are fixed.
Resume anchor = `DONE.jsonl` (skip C-ids already present).

- Candidate population (ours, created_by=3, incl. the 3 known raw-markup cases): **195**
- Foreign cases excluded (created_by!=3): 0.
- Broken/fixed vs already-clean: see DONE.jsonl per case.
