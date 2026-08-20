# Filters — formatting reflow (2026-08-20)

Interim `<p>/<br>` render-fix pass over Filters cases (TestRail group 4110, `created_by=3` only).
Method: TestRail UI Edit → add `.` to Preconditions → Save (reflows all three fields' RENDER).
Detection + verification is by the RENDERED view page (the API stored source cannot tell a broken
render from a clean one). Only genuinely-broken renders are fixed; already-clean cases are recorded
and skipped. Resume anchor = `DONE.jsonl` (skip C-ids already present).

- Candidate population (ours, created_by=3): **124**
- Foreign cases excluded (created_by!=3): 5 — NOT touched (Standing Rule 38).
- Broken/fixed vs already-clean: see DONE.jsonl per case.
