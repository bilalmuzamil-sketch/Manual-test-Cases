# Part Lifecycle — full update, 8 Oct 2026 (Rule 122 full pass)

**Trigger and approval.** The QA lead re-shared the tech plan on 8 Oct and gave the go-ahead "Full update, write when ready".
**Folder:** TestRail Founder Mode → Part Lifecycle, section [20439](https://shopview.testrail.io/index.php?/suites/view/1&group_id=20439).

## Sources (all read in full, Rule 119)
| Source | Version |
|---|---|
| PRD, Confluence 829227015 | **v26** ("Ready for dev"). Product's 13:17 UTC comment says "the page is now v26". Re-checked unchanged immediately before the writes (Rule 59). |
| PRD comments | 2 footer threads, 6 messages; 0 inline comments |
| Tech plan | 7 Oct 2026 (first copy we hold) |
| Jira | 13 stories (SV-10814 … SV-10826), the epic, bug SV-10380, and 9 verification tasks |
| Design canvas | 46 boards, 5 Before boards and 59 notes. Proof: `DESIGN-COVERAGE-2026-10-08.md` |

## What changed in the PRD since our 30 Sep cases ("In review" draft)
- 288 requirements:
  - 93 new;
  - 179 with changed wording;
  - 16 unchanged.
- 12 requirements removed: S2-R18, S5-E2 … S5-E9, S9-N4.

## What was written (every write read back and matched; log `applied/apply-log.jsonl`)
- **61 existing cases rewritten in full**, in the 8 Oct layout:
  - "Needs" line;
  - Preconditions;
  - Setup with placeholders and a final setup check;
  - Steps;
  - results starting "Step n:";
  - own ZZAUTOTEST data per case;
  - verbatim PRD v26 quotes.
- **198 new cases**: C425585 … C425782.
- **1 new section**: "Inventory Value net quantity (SV-10380)", id 54274, holding 9 cases. That bug ships with this epic.
- **Coverage:** 288 of 288 PRD v26 requirements are quoted by a case.
  - S9-R4 and S9-R7 describe screens ShopView does not have, so they are recorded as notes only.
- **Marker on every case:** `AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified`.
- **1 case proposed for retirement and NOT touched:** C154761. It tests a "Deactivate" footer control that v26 removed. Retiring it is the QA lead's decision.

New cases by section:

| Section | Story | New cases |
|---|---|---|
| 20468 | S1 | 8 |
| 20469 | S2 | 12 |
| 20470 | S3 | 2 |
| 20471 | S4 | 4 |
| 20472 | S5 | 13 |
| 20473 | S6 | 6 |
| 20474 | S7 | 15 |
| 20475 | S8 | 10 |
| 20476 | S9 | 36 |
| 20477 | S10 | 23 |
| 20478 | S11 | 12 |
| 20479 | S12 | 8 |
| 20480 | S13 | 40 |
| 54274 | SV-10380 | 9 |

## Cases a manual tester cannot fully run (QA lead to decide: keep manual or hand to automation)
| Case | What cannot be done by hand |
|---|---|
| C425602 | Bulk change server error |
| C425622 | Part request refusals: "missing category", "source not Vendor" |
| C425629 | Tracked part reaching the system with no bin |
| C425701 | Rename through the public API |
| C425723 | Part dialog server-error messages |
| C425755 | The public API refuses a duplicate number |
| C425776 | "Changed through: Public API" |

Each says plainly which part to record as "not checked by hand". Several other cases have a single line marked the same way (core rows, exact pixel colour and width, "by any route" refusals).

## Questions for Product — send AFTER build verification (Rule 66); the build verification session re-checks these first
1. **Stories behind the PRD.** SV-10814, 10817, 10818, 10819, 10820, 10821, 10822, 10823, 10824, 10825 and 10826 still carry pre-v26 wording or miss requirements:
   - canned-job warning per part;
   - S9-N3 "returns nothing";
   - "used by inventory parts";
   - rename refusal "answers to" (case/punctuation-blind);
   - role lists;
   - tooltip without the Inventory Value sentence;
   - missing S1-R5a/R5b/R9a, S5-R14, S5-E1, S6-R10, S7-R6c/R6d/N5b, S9-R18–R20, S11-R3a/R3b/R6a, S12-R12–R14, S13-R19b–d, N3a, N7–N9a.
   Should the stories be brought in line with PRD v26? The cases follow the PRD.
2. **Design boards behind the PRD:**
   - board 5.1 tooltip lacks the Inventory Value sentence;
   - board 6.5 shows the old per-part canned-job toast;
   - canvas note on 2.4 puts "| Changed at" at the location where the change was made;
   - canvas note on page 1 says *saving* any untracked part needs Delete;
   - board 2.6 narrows Staff/Date/Time columns.
   The cases follow the PRD.
3. **Column header.** The boards and the staging list (Before board 4.0) say "Total Quantity". The PRD and Product's answer (Q17) say "Total Qty". Which will the build show?
4. **Duplicate message, two matching parts.** When a location holds an active AND an inactive part with the matching number, which number does "{part number} already exists at this location." name? (S7-N5a.) C425679 expects the active part.
5. **"This also changes the description at {n} other locations."** Do inactive copies at other locations count, as they do for the part-number message? (S13-R12/R13 vs R17.)
6. **"Vendor is hidden where the screen that opens the dialog hides it"** (S13-R4a). Which screen is meant?
7. **Canned job with a typed vendor part matching an inactive part.** Does the warning name the typed number or the inactive part's number?
8. **Saving a Part Library entry that was deleted in another tab.** Which message shows: "Failed to save library part." or "Part Library entry not found…"?
9. **Bulk success toast.** Does "{n} parts updated." count a part's core?
10. **Supply filter.** Is the first option "All" (PRD S6-R10) or "All categories" (as in today's list)?
11. **Renaming a part to its own number with only punctuation changed** (e.g. FF-5507 → FF5507). Is it refused by the duplicate check matching the part itself? (S7-N5b with S13-N9a.)
12. **SV-10380:**
    - How can a bin go negative in normal use (needed to test the fix)?
    - Should past dates captured before the fix keep their positive-only figures?
    - Confirm that available-to-pick stays "5 Available" for bins +5 and −2.
13. **Dashboard.** Will the dashboard's Critical Reorder list and inventory figure still exist when Part Lifecycle ships, given the Dashboard v1 plan replaces the old dashboard?
14. **Rare data states.** How does an untracked part end up with no bin, or with no default bin (S5-R7, S5-R8)?
15. **Test setup facts (dev/QA):**
    - How is the new global search turned on for an organisation?
    - Does deleting an inventory part leave its Part Library entry behind?
    - Where does a tester see a part's core ("Core for …")?

Already answered by Product in v26, so NOT asked:
- the tech plan's Q18 (S8-N1a);
- Q19 (the singular toast);
- every one of the 17 planning questions.

## Display check and test runs
- **Display check:** 259 of 259 written cases are "RESULT OK" (`hs_repair_one.mjs`; logs `render*.log`).
- **Test runs (Rule 123):** no open run is named for Part Lifecycle. The only Founder Mode run is 495, "Part Sales + Notifications", created by Vladimir Tomovic; it is not ours to change. So there was no run to update.
  - If the QA lead wants a Part Lifecycle run, it should be created when a QA build exists.
