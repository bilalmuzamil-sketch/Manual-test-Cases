# Worker brief: Credit terms named-set update to PRD v5 and the engineering plan (28 Oct 2026)

QA lead, 28 Oct 2026: "Named set" (Rule 122 amendment). You update the case library only. **You do NOT write to TestRail, Jira,
Slack or any Google file, and you do NOT commit.** The coordinator reviews your work, runs the write scripts, reads back and commits.

## Read first, in full (Rule 119; state your reading coverage at the end)
1. `WORKER-BRIEF.md` (23 Oct): facts, rules, how the library works. It carries the token-discipline charter (Rule 95), which binds you.
   Read `PROJECT-STATE.md` too, for every later layer (scenario preconditions, the QA lead's pattern, the 26 Oct read-through).
2. `sources/CONFLUENCE-963346440-v5-2026-10-28.md`: Confluence 963346440 **version 5** (26 Oct 2026, Chris Ward). Read its Change Log
   rows for 2026-10-26 first, then every changed requirement in full.
   `sources/CONFLUENCE-963346440-v3-2026-10-23.md` is the version every case quotes today.
3. `sources/tech-plan-Credit-Terms-2026-10-28.md`: the engineering plan (26 Oct, approved 27 Oct), all 1,026 lines. It informs and never
   overrules the PRD (Rule 30). A code-vs-document conflict is a PO question, never a silent expectation (Rule 96).
4. The library under `authoring/`: `ct_lib.py`, `common.py`, `build.py` and every layer it applies (`pattern.py`, `relevance.py`,
   `readthrough.py`, `scenarios.py`, `build_mods.py`), plus the `cases_*.py` modules you touch. Also the rules in
   `/home/user/Manual-test-Cases/build/rules/RULES-61-96.md`: 113, 114, 117 (14th and 15th amendments), 130 and 134-138.

## What changed between v3 and v5 (verified 28 Oct by the coordinator)
- New code **S1-R17** (page-load target, under 1 second, "Used by" figures load when a row menu opens). Record it as "no manual case"
  in `authoring`'s no-manual list, with the reason: it needs the test organization's size and a timer.
- **S7-R9** adds: "A/P aging shows that stored due date, so after a recalculation it shows the same new due date as the vendor invoice."
- **S10-R7** adds the vendor Public API default (COD instead of "net_30"; vendors created before release keep their term).
- **S10-E3** adds: a contacts import updating an existing customer keeps the stored credit limit when the limit cell is blank or
  missing; S10-R8 still applies to a customer updated onto COD or Credit Hold.
- **Story 2, Error Handling** adds "Reactivate this term to edit it." (an edit sent on an inactive term) and "Someone else changed this
  credit term. Reload the page and try again." (a save refused because another user changed the term, S2-E2).
- Every other requirement line is word for word the same as v3.

## The named set (all of it; nothing outside it changes)
A. **7 cases whose PRD quote is no longer word for word in v5:** S10-12, S10-16, S2-30, S2-31, S2-32, S2-33, S2-34. Re-copy each quote
   from v5 and rewrite each case top to bottom (Rule 134) so its steps and results match.
B. **S10-08** ("An import update of an old COD customer clears its stored limit"): check it against v5 S10-E3 and S10-R8 and correct it if
   needed. **The cases citing S7-R9 (S7-02, S7-03, S8-01, S8-04, DATA-17, D-32, D-43), S10-R7 (S10-12, S10-16) and S10-E3 (S10-06,
   S10-10)** join the set only if v5's added sentence changes what they expect; list each one you add, with the reason.
C. **S2-36** is held on sheet question 3 (a term renamed by another user after the page loaded). v5's S2-E2 message settles it: release
   the case, rewritten to that message.
D. **New cases**, each runnable by hand, in the pattern, in the right story module:
   - A/P aging shows the recalculated due date after a vendor invoice's invoice date (and, separately, its vendor) is changed (S7-R9).
   - A contacts import update with a blank (and with a missing) credit limit cell keeps the customer's stored limit (S10-E3); and a
     customer moved onto COD or Credit Hold by the same import still gets $0 (S10-R8), unless an existing case already checks that.
   - "Reactivate this term to edit it." (two browser tabs: tab 1 opens Edit on an unused own term, tab 2 deactivates it, tab 1 saves).
   - "Someone else changed this credit term. Reload the page and try again." (two tabs edit the same unused own term; the second save is
     refused).
   - S10-R7's vendor default is Public API only: put it in the suite's API section if one exists (Rule 4), else record it as no manual case.
E. **Plan-versus-page differences.** The coordinator is adding them as sheet questions 13-17 to Chris Ward:
   - **Q13 (plan D32):** a ticked customer deleted during a move rejects the whole move. The page (S4-E1) says it is left alone.
   - **Q14 (D30):** names that differ only in accents count as the same name (the page says capitals and spaces).
   - **Q15 (D34):** creating a term whose name matches old imported text takes over those customers at once.
   - **Q16 (D29):** Edit Customer refuses a stale inactive term with "Pick an active credit term." (the page names it for New Customer).
   - **Q17 (D25):** a blank term sent on a customer save keeps the stored term.
   Any case whose expected result depends on one of them gets the held marker the library uses for a PO hold, naming the question number.
   Do not write new cases for these behaviours.
   Also list (do not change) the cases held on questions 1, 2 and 4-7. The plan suggests an answer for question 7 (a changed invoice date
   uses the customer's current term), but the question stays with Chris.

## Rules for each case you touch
- A case in the set quotes v5 and its "From:" line says version 5 (26 Oct 2026), read 28 Oct 2026. Every case not in the set keeps its
  live text exactly, including "version 3" and its read date. Add a per-case version switch to the library, as the What/Why library did
  on 28 Oct (`build/founder-mode/what-why/authoring/wwlib.py`, `NAMED_SET` / `on_v16`).
- Keep C-ids (update in place). Splits only under Rule 136. No case mentions another case. Data a case changes is created fresh for it.

## Gates before you finish
- `python3 authoring/build.py`: 0 PROBLEM lines.
- `python3 /home/user/Manual-test-Cases/build/testing-tools/tester_readiness_check.py /home/user/Manual-test-Cases/build/credit-terms --sample 5`:
  0 hard problems. Read the sample and every "does not / never" line in a case you touched.
- A script proving that:
  - every page quote in the cases you touched is word for word in v5;
  - every mapped case outside the set renders exactly like its latest read-back in `applied/`.
- Then run `python3 authoring/update_changed.py` and `python3 authoring/create.py`, both as dry runs (no --apply), and report their plans.

## Final message (under 300 words)
Report:
- the cases you changed (keys with C-ids);
- the new keys;
- the cases held on questions 13-17;
- the gate results and the dry-run plans;
- your reading coverage.
