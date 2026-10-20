# SV-10645 — Min/Max changes not recorded (20 Oct 2026)

**Live read (Rule 103), 20 Oct ~10:30 UTC:** Ready for Production. Mudassir Qamar passed it at 04:33 CDT (comment 79085, part 84-2005 on sv10645): Edit Part history entry, no entry on an unchanged save, import 4/15, blank Min kept, explicit 0, Min 20/Max 5 warning, Min 20/blank Max warning.
**Branch:** https://sv10645.qa.shopview.com still up, build v26.40.19-e435950 (index.html last-modified Mon 19 Oct 2026 09:00:07 GMT).
**Spec source:** Chris Ward 77986 (rules 1–4), Parth 77954 (findings).

Not covered by Mudassir's run, raised with the QA lead before testing:
(a) Min above Max: the rest of the row still imports (Chris rule 3 "import the rest of the row");
(b) blank Max with a valid Min: Max kept, Min changes;
(c) import with unchanged Min/Max: no history entry ("Only when the value actually changes");
(d) a non-number in a Min/Max cell (Parth: used to save 0).

**QA lead's ruling (20 Oct): "No, skip it."** — not tested by us; no comment posted. Mudassir's sign-off stands.
