# Sales By Representative — one question for Chris Ward — 2026-07-31

Plain-language product question only (no bugs, no test jargon).
Please pick an option (or write your own answer).

## Question 1 — Does the Location show as its own column in the Sales By Representative downloads?

**What happens now:** You told us that every downloaded report carries a "Locations:" line
naming the location or locations the report was run for, and that each report shows a Location
column on the screen. For the Sales By Representative report we are clear on both of those. What
we are not clear on is the downloaded spreadsheet files (the CSV downloads) for that report —
whether the Location is also meant to appear there as its own column alongside the other
columns, or whether the "Locations:" line at the top of the file is all that is expected.

**The question:** In the Sales By Representative spreadsheet downloads, should Location appear as
its own column in the file as well, or should only the "Locations:" line at the top show it?

**Options:**

- A) Location appears as its own column in the spreadsheet download as well.
- B) Only the "Locations:" line at the top; the columns stay exactly as they are today.

**Your answer:** ____________________

**One note on why we are asking:** our tests list the exact columns of those download files, in
order, and check them one by one. So we need to know whether to add Location to that list, or
leave the list as it is. Either answer is easy for us to apply — we just should not guess it.

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail links: `https://shopview.testrail.io/index.php?/cases/view/<id>` (Standing Rule 8).

| Q# | Affected cases (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SBR-EXP-10 (C30285) + SBR-EXP-11 (C30286) — both enumerate the CSV headers with the word "exactly" and neither list contains a Location column. Context: SBR-LOC-05 (C38913) asserts the Location column **on screen** only; SBR-EXP-02 (C30277) asserts the `Locations:` **metadata line** in every file; SBR-COL-04 (C30268) covers selector-vs-export and is a different concern. | SBR spec v15; Chris Ward's answers 2026-07-31; engineering tech plan. Trigger: **C38923** (Vladimir Tomovic's automated case, created 2026-07-30) asserts the Location column reaches the SBR Summary and Expanded CSVs — which directly contradicts our verbatim header lists. Full comparison: `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md` §4. | **A** → add a conditional Location entry to the verbatim header lists in C30285 + C30286 (authorized `update_case` required, Rule 6), and consider a positive assertion for Location in the export. **B** → C30285 + C30286 stand as written, and C38923's assertion is wrong — that goes back to Vladimir (see `Note-to-Vladimir-automation-overlap.md`). |

**Nothing has been changed.** No TestRail write has been made and none may be made on C30285 /
C30286 without the QA lead's authorization plus either this answer or a live-build observation
(Rules 6 / 12). Logged on the outstanding register.
