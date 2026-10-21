# SV-10696 — overlap confirmation (21 Oct 2026) — STOPPED, nothing posted

Stopped on the QA lead's instruction: Mudassir Qamar already passed it (comment 79173, 05:06 −0500); ticket is
Ready for Production. Branch sv10696 build v26.40.20-6d4e430. Tech Justin Lin, department Shop Time (Shop hand).

Edit path, all four must-pass scenarios, each run on its own date (JSON beside this file):
- S1 (Oct 4, Cancel then Confirm): pop-up "1 entry will be permanently deleted", B 9:30–10:30 Deleted; Cancel left
  A 1–2 PM and B unchanged; Confirm left only A 9:00–11:00.
- S2 (Oct 5): "1 entry will be shortened", B → 8:00–9:00; result matched.
- S3 (Oct 6): "1 entry will be shortened", C → 11:00–12:00; result matched.
- S4 (Oct 7): "2 entries will be permanently deleted", B and C Deleted; result matched.
Same notes as Mudassir: shorten-only cases also get a top line; the top line has no full stop; the edited entry's own
row shows a blank WO/Dept (SV-10693). New and Clock Out were not run (stopped).
Test data left on sv10696 (per-ticket branch, no cleanup): Justin Lin entries Oct 1, 2, 4–8.
