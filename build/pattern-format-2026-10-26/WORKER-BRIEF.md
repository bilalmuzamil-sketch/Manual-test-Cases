# Worker brief: reformat every case to the QA lead's pattern (26 Oct 2026, Rule 117 fourteenth amendment)

QA lead, 26 Oct 2026: he gave his own pattern for a test case and chose **"Yes, permanent, all suites"**. Read first, in full:
`build/rules/RULES-61-96.md` — "117 — FOURTEENTH AMENDMENT" (just above Rule 118), and `build/LESSONS-REGISTER.md` (L-06 to L-10).
His other words the same day: *"The preconditions should be something like the easiest to understand for a layman or a manual QA tester
to setup and they must make sense and relate to the steps and expected results below."* / *"One tells what to do and other tells what
to expect."* / *"you must keep a space after the expected results end."* / *"DOnt say "ask your QA lead" JUst mention what is needed"*.

You are given ONE suite (named in your prompt). You DRAFT only: edit that suite's authoring files and run its gates. No writes to
TestRail, Jira, Slack or Google; no commits. Work only inside that suite's folder. Save often (a container restart can happen).

## The model case (already in TestRail, already built in the Splitting Sales Representatives library as the "pattern" layout:
`build/splitting-sales-reps/authoring/trial_layout.py` and `ssr_lib.render`)

```
Title: Sales Representative field appears below Service Advisor when unassigned
Preconditions
- Sign in as an Admin at the test location.
- Use a customer with no Sales Representative assigned.
- Have an open, uninvoiced work order for that customer, with no Sales Representative assigned, one approved labor line and one part.
- Use a desktop browser at least 1024 pixels wide.
Steps
1. Open the work order and look at its details card without hovering over the Sales Representative field.
Expected Result
Step 1:
- The fields appear in this order: Lead Technician → Service Advisor → Sales Representative.
- Sales Representative appears directly below Service Advisor, with its label on the first line and Unassigned on the second.
- Its text style, size, weight and left alignment match the other two fields.
- No border, dropdown arrow or button appears around or beside the field.
(blank line)
[exact quotes with From: lines] [References from Design] [AUTOMATION line]
```

## What to do for EVERY case of your suite

1. **Title:** plain words describing what the tester will see, ≤ 80 characters, no semicolons; design cases keep "Design: ".
2. **Preconditions:** short plain bullets telling the tester what to set up, in setup order ("Sign in as …", "Use a …", "Have a …",
   "Use a desktop browser …"). Only what the steps and results need, each related to them; never the result being tested. Remove the
   "Scenario:" line, every {placeholder}, every "For example:" line, any objective, the setup-file link, who-to-ask and generic lines.
   Where two records of the same kind are needed, name them plainly ("customer A" and "customer B", "the first work order") and use
   the same names in steps and results. Keep every fact a tester needs to set up the case (amounts, dates, term names, settings,
   roles, which location): a value the result depends on (for example "an invoice of $100.00 dated Oct 5, 2026") stays as a plain
   fact, not as an example. Keep the Blocked line last: "If you cannot set up any of the above, mark this test Blocked: "setup not done"."
3. **Steps:** numbered, plain, the build's own labels; a step may say what to look at. Keep every action the case needs; do not add
   or drop behaviour.
4. **Expected Result:** heading "Expected Result", then for each step "Step N:" followed by bullets — one observable fact per bullet,
   in plain words, carrying exactly the meaning of the current result (split sentences into bullets; never add, drop or soften a fact).
   Then one blank paragraph (`<p></p>`).
5. **Below the blank line, unchanged byte for byte:** the exact quotes block with its From: lines, the References from Design block,
   any EXPECT FAIL text or held/design-difference note, and the AUTOMATION line last.
6. Implement it in the library's render (a per-case pattern layout, like the Splitting Sales Representatives `pattern=True`), replace
   the Scenario gate with a pattern gate in `build.py`: preconditions are plain bullets only, no "{", no "For example", no "Scenario:",
   Blocked line last; expected starts "Expected Result", has a "Step N:" heading per step followed by a bullet list, then `<p></p>`,
   then the quotes block; quotes, From lines, design block and AUTOMATION line identical to before. Keep every other gate.
7. Regenerate the setup file (it may keep placeholders and examples for Claude sessions) and outputs.

## Output (in your suite's folder, `pattern-format-2026-10-26/`)

`PASS-REPORT.md`: per case, old vs new title / preconditions / steps / results (script-generated), and a script check that the quotes
block, design block and AUTOMATION line are byte-identical to before for every case, and that no fact was lost (every amount, date,
label in quotes and term name of the old preconditions/steps/results still appears in the new ones, except placeholders and
"For example" values that were only examples). Final message: cases reformatted, gate output (0 PROBLEM lines), the byte-identity and
no-fact-lost results, 3 sample cases old vs new, and any case you could not reformat without losing meaning (list it; do not force it).
