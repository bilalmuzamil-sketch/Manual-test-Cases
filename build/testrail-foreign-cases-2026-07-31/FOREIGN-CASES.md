# Foreign TestRail cases — who made them, and do they duplicate ours?

**Date:** 2026-07-31 · **Method:** READ-ONLY TestRail API (`get_*` only) · **Writes made: ZERO**
(no case, section or run was created, updated, deleted or moved — and none may be).

**Scope swept:** the three active groups in TestRail project 1 / suite 1 —
**Report Suite** (section 4281), **Filters** (4110), **Schedule** (4254) — plus the tester runs
**352 / 357 / 359** (and 324 / 325 for completeness).

**Reusable checker:** `foreign_overlap_check.py` in this folder (see §6).

---

## SOURCE-CURRENCY (Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| TestRail live cases | project 1 / suite 1 (4114 cases, 625 sections) | live read | 2026-07-31 | **CURRENT** |
| TestRail users | `get_user/{id}` 1–9 | live read | 2026-07-31 | **CURRENT** |
| TestRail runs | 352, 357, 359, 324, 325 | live read | 2026-07-31 | **CURRENT** |
| Our case bodies for comparison | pulled live from TestRail (not from local JSON) | live read | 2026-07-31 | **CURRENT** |
| Report Suite specs / epic SV-8582 | not re-read this pass | — | — | **not needed** — this pass compares case-to-case, it does not judge either side against a spec |

---

## 1. Who is who (the TestRail user map)

`get_users` is admin-only for our account (`Access Denied. You are not a TestRail administrator`),
so ids are resolved one at a time with **`get_user/{id}`**, which works for a Lead account.

| id | Name | Email |
|---|---|---|
| **1** | **Vladimir Tomovic** | vladimir.tomovic@shopview.com |
| 2 | Nebojsa Glavinic | nebojsa.glavinic@shopview.com |
| **3** | **Bilal Muzamil — this is US** (the account we push with) | bilal.muzamil@shopview.com |
| 4 | Viktoria Videnovic | viktoria.videnovic@shopview.com |
| 5 | Ayesha Khan | ayesha.khan@shopview.com |
| 6 | Mudassir Qamar | mudassir.qamar@shopview.com |
| 7 | Ahtasham Amjad | ahtasham.amjad@shopview.com |
| 8 | Chris Amani | chris@shopview.com |
| 9 | Sasha Grossman | product@shopview.com |

Ids 10+ do not exist. **User 1 = Vladimir Tomovic matches the screenshot exactly** (Created and
Updated both read "Vladimir Tomovic" on C38923's People & Dates panel).

---

## 2. TASK 1 — authorship of the 5 foreign Report Suite cases

All five: **created by Vladimir Tomovic 2026-07-30 15:54 UTC** and **last updated by Vladimir
Tomovic 2026-07-30 17:41 UTC** (identical timestamps across all five — one authoring pass, one
edit pass).

| Case | Title | Section path | refs | Automation status | Automation Type | Type | Priority | Template | Title len | Has expected results? |
|---|---|---|---|---|---|---|---|---|---|---|
| **C38919** | TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it | Reports Suite › Technician Utilization › TU — Visual & Accessibility | **None** | Automated (3) | **(unset)** | Other (7) | High (3) | 2 (Steps) | 91 | only a mangled fragment on step 1 |
| **C38920** | PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row | Reports Suite › Parts Velocity Report › PV — Row Model | **None** | Automated (3) | **(unset)** | Other (7) | Medium (2) | 2 (Steps) | 101 | **NO** |
| **C38921** | IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column | Reports Suite › Inventory Value › IV — Exports | **None** | Automated (3) | **(unset)** | Other (7) | High (3) | 2 (Steps) | 119 | **NO** |
| **C38922** | WIP CSV export gains the Locations line while its column semantics stay exactly as shipped | Reports Suite › Work In Progress › WIP — Exports | **None** | Automated (3) | **(unset)** | Other (7) | High (3) | 2 (Steps) | 90 | **NO** |
| **C38923** | SBR Summary and Expanded CSV exports carry the Location column at its designated slot | Reports Suite › Sales By Representative Report › SBR — Exports | **None** | Automated (3) | **(unset)** | Other (7) | High (3) | 2 (Steps) | 85 | **NO** |

Field-label decode (from `get_case_fields`): **Automation status** `1 Not Automated · 2 Cannot be
automated · 3 Automated · 4 Pending`; **Automation Type** `0 None · 1 Ranorex`.

### The structural tells — his cases vs ours, in the same group

| Tell | OUR 474 Report Suite cases | Vlad's 5 |
|---|---|---|
| `refs` (References) populated | **474 / 474** | **0 / 5** (all null) |
| `template_id` | **1** (Test Case — Text) for all 474 | **2** (Test Case — Steps) for all 5 |
| `custom_automation_type` | **0 (None)** for all 474 | **null / unset** for all 5 |
| `custom_atmstatus` | Not Automated 458, Automated 16 | **Automated** for all 5 |
| `type_id` | 6 / 5 / 1 / 2 | **7 (Other)** for all 5 |
| Titles over 80 characters | **0 / 474** | **4 / 5** (85–119 chars) |
| Expected results present | every case | **1 of 5, and that one is a parsing artefact** |

**The most reliable single tell is `created_by`.** After that: `refs = None` (we never ship a case
without a Rule-20 reference) and `template_id = 2` (we author text-template cases, id 1).
**`custom_atmstatus` is NOT a safe tell** — it is 3 ("Automated") on his cases *and* on 16 of ours,
so it separates nothing on its own. Correcting that assumption is part of this pass.

---

## 3. TASK 1 (wider sweep) — is anything else not ours?

| Group | Section id | Live total | **Ours** (user 3) | **Foreign** | Foreign creator |
|---|---|---|---|---|---|
| **Report Suite** | 4281 | **479** | **474** | **5** | Vladimir Tomovic (5) |
| **Filters** | 4110 | **110** | **110** | **0** | — |
| **Schedule** | 4254 | **164** | **164** | **0** | — |

**Filters and Schedule are 100% ours — no foreign cases have been silently counted or ignored
there.** Our published counts (474 / 110 / 164) were all correct; only Report Suite's *live* total
differs from our count, and it differs by exactly Vlad's 5. Going forward the honest phrasing is
**"ours 474 / live total 479"**.

Project-wide context (whole suite, all projects, informational only): **2339 cases created by us,
1775 created by Vladimir Tomovic** — he is a long-standing author across the older suites, not a
newcomer. That is why creator-id, not novelty, is the detection signal.

### Are any foreign cases in the tester runs?

| Run | Name | `include_all` | Tests | Foreign cases present |
|---|---|---|---|---|
| 352 | Filters - Ahtasham (Awaiting QA- ENV) | false | 110 | **NONE** |
| 357 | Schedule - Ayesha (VIU Pending) | false | 164 | **NONE** |
| 359 | Reports Suite - Nebojsa/Viktoria (VIU Pending) | false | **474** | **NONE** |
| 325 | Simple Flow - Ayesha Khan | false | 152 | NONE |
| 324 | Fees and Discount - Ahtasham | false | 178 | NONE |

**No foreign case is in any run.** Run 359 holds exactly our 474 — so the run count and our case
count agree, and Vlad's 5 sit outside every manual run. Nothing needs syncing, and per policy we
would not add someone else's cases to a run anyway.

---

## 4. TASK 2 — per-case overlap verdicts (the real question)

**Confirmed by the user 2026-07-31: Vlad's cases are all automation coverage.** So the question is
not "what are these" but **"can we reliably tell when one of them duplicates one of our manual
tests?"** Below is the verdict per case, decided by reading the actual assertion — preconditions,
steps and expected results — not the title.

**One thing shapes every verdict below and must be said plainly:** four of the five carry **no
expected results at all**, and the fifth's only "expected" is a parsing artefact (his step
"Open TU via the Reporting **>** Performance nav entry" was split at the `>` into step text
`Open TU via the Reporting` + expected `Performance nav entry`). So **the pass criterion of his
cases is not in TestRail — it lives in the automation code.** Overlap is therefore judged on
**subject + conditions + steps**, which is a genuine limit, not a hedge.

**Timing worth noting:** our six multi-location cases (C38912–C38917) were created **2026-07-30
15:25**; his five were created **15:54** — 29 minutes later, same day, same feature area.

### Verdict counts

| Verdict | Count | Cases |
|---|---|---|
| **DUPLICATE** | **2** | C38920, C38922 |
| **AUTOMATED EQUIVALENT** | **1** | C38919 |
| **NEW COVERAGE** | **2** | C38921, C38923 |

---

### C38920 — **DUPLICATE** of **PV-FILT-14 = C38914**

*"PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row"*
· [C38920](https://shopview.testrail.io/index.php?/cases/view/38920) vs
**PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)**
*"The Location column shows only with more than one location, leftmost before Type"*

Every assertion his steps set up is already asserted by ours — same behaviour, same conditions,
same feature, and ours additionally states the pass criterion.

| His step (C38920) | Our expected result (C38914) |
|---|---|
| "Open PV at the default single-location scope" | 5. "With a single location in scope the Location column is hidden." |
| "Turn on All Locations and wait for the server refetch" | 1. "With more than one location in scope a Location column is shown as the LEFTMOST column, before Type." |
| "Set Type = Special Order and search the merged part number" | 3. "The merged Special Order row shows \"Multiple\", because it is summed across the selected locations." |
| "Set Type = Inventory and search the seeded inventory part number" | 2. "Each inventory row shows its own location's name (an inventory row is one part at one location)." |
| "Open the Column Selection menu" | 4. "Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you." |

His precondition *"The SAME vendor special-order part sold on invoiced WOs at BOTH workplaces, so
PV merges them into one special-order row"* is also the assertion of **PV-ROW-02 =
[C30342](https://shopview.testrail.io/index.php?/cases/view/30342)** — "The special-order part
appears as a SINGLE row … Its movement and profitability values are the SUM of the per-location
values." **Nothing in C38920 is unasserted by us.**

---

### C38922 — **DUPLICATE** of **WIP-EXP-02 = C30511** + **WIP-EXP-07 = C30516**

*"WIP CSV export gains the Locations line while its column semantics stay exactly as shipped"*
· [C38922](https://shopview.testrail.io/index.php?/cases/view/38922)

Both halves of his title are already asserted, verbatim, by two of our cases:

| His assertion | Our case | Our exact wording |
|---|---|---|
| "gains the **Locations line**" | **WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511)** expected 4 | *"Each download (PDF and CSV) carries a \"Locations:\" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build)."* |
| "its **column semantics stay exactly as shipped**" | **WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516)** expected 2–3 | *"In BOTH the PDF and the CSV, the same two columns are headed \"Unit\" and \"Branch\". This on-screen-vs-export label difference is the EXPECTED, documented v1 behavior."* |
| his step 3 "Toggle Location ON in the Column Selection menu and download again" | **WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** expected 4 | *"Location is NOT offered in the column-selection control — its visibility follows the location scope automatically."* |

⚠️ **His step 3 and our C38916 expected-4 point in opposite directions** — he steps *"Toggle
Location ON in the Column Selection menu"*, ours says Location is **not offered** in that control.
One of them is wrong about the build. **We are not resolving this and not editing anything** —
it is exactly the sort of thing to put to Vlad, and it may equally mean his automation is written
against a different build state than our spec-read. Flagged, nothing changed.

Verdict **DUPLICATE** because his two stated assertions are already ours; the divergent step is a
question, not new coverage.

---

### C38919 — **AUTOMATED EQUIVALENT** of **TU-COL-01 = C38859** + **TU-EXP-04 = C30437**

*"TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it"*
· [C38919](https://shopview.testrail.io/index.php?/cases/view/38919)

Same behaviour, different treatment: he **bundles two of our manual cases into one end-to-end
automated path** (toggle → reload → download → re-toggle). Each of his three claims already has an
owner on our side:

| His claim | Our case | Our exact wording |
|---|---|---|
| "column selector **hides Est. Lost Labor**" | **TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859)** expected 5–6 | *"Turning a toggle off hides that column (header and cells) immediately, with no reload … Est. Lost Labor can now be hidden like any other column (it used to be always on)."* |
| "**persists across reload**" | **TU-COL-01 = C38859** expected 7 | *"Your column choice is remembered in this browser and is still applied when you come back."* |
| "**the export mirrors it**" | **TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437)** expected 5 | *"Every download also mirrors the columns currently shown on screen — a column hidden in the Column Selection control is absent from the files, and a re-shown column comes back."* |

**No new assertion** — it is our C38859 + C30437 walked as one journey. Classified AUTOMATED
EQUIVALENT rather than DUPLICATE precisely because it is a bundle, not a 1:1 restatement, which is
a perfectly reasonable shape for an automated regression path.

---

### C38921 — **NEW COVERAGE** (with one half overlapping **IV-EXP-02 = C30588**)

*"IV CSV export carries the As of and Locations metadata lines above the header, plus a
scope-conditional Location column"* · [C38921](https://shopview.testrail.io/index.php?/cases/view/38921)

| His claim | Do we assert it? |
|---|---|
| a **"Locations:" metadata line** in the CSV | **YES — overlap.** **IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** expected 4: *"Each download (PDF and CSV) carries a \"Locations:\" line naming the location(s) the report was scoped to."* |
| an **"As of" metadata line in the CSV, above the header** | **NO — new.** Our only as-of assertion is **IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)** expected 1, and it is about the **PDF header** only: *"The PDF header shows the report name \"Inventory Value\", the organization name, the selected period, and an \"as of\" line."* Nothing of ours says the **CSV** carries an as-of line, let alone above the header row. |
| both metadata lines sit **above the header row** | **NO — new.** Ours explicitly leaves position open: *"(exact position in the file is confirmed in the build)"*. |
| a **scope-conditional Location column inside the CSV** | **NO — not directly.** **IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917)** asserts the Location column **on screen** ("inserted between Vendor and Qty on Hand", hidden at a single location); C30588 expected 1 only says downloads *"include only the columns currently shown"*, from which the CSV behaviour is **inferred, never asserted**. |

**Genuinely useful new coverage** — it pins two things we deliberately left unpinned.

---

### C38923 — **NEW COVERAGE**, and it exposes a gap on our side

*"SBR Summary and Expanded CSV exports carry the Location column at its designated slot"*
· [C38923](https://shopview.testrail.io/index.php?/cases/view/38923)

No case of ours asserts the Location column reaching the SBR CSV files. Worse, **our two SBR CSV
cases enumerate the headers verbatim and the list contains no Location column:**

| Our case | Our exact wording | Consequence |
|---|---|---|
| **SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** expected 2 | *"The headers, in order, are exactly: Sales Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal."* | **No Location.** With more than one location in scope, a tester following ours would mark it Failed. |
| **SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** expected 2 | *"The headers, in order, are exactly: Sales Representative, Date, Invoice #, Customer, Status, Hrs Worked, …, Subtotal."* | Same. |
| **SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913)** expected 1 | *"a Location column is shown, positioned immediately after the Status column and before Inv. Hrs."* | Asserts it **on screen only** — never in the export. |
| **SBR-COL-04 = [C30268](https://shopview.testrail.io/index.php?/cases/view/30268)** | *"All four downloads include ALL metric columns regardless of the on-screen column selector state."* | A different concern (selector vs export), and Location is not selector-driven. |
| **SBR-EXP-02 = [C30277](https://shopview.testrail.io/index.php?/cases/view/30277)** expected 5 | *"Every file (all four downloads, PDF and CSV) carries a \"Locations:\" line."* | The metadata **line**, not a per-row **column**. |

**So C38923 is new coverage AND a flag on our suite:** either our verbatim header lists need a
conditional Location entry, or the Location column genuinely does not reach the SBR CSVs and his
case is wrong. **Recorded, not acted on** — the fix (if any) is to OUR cases, needs authorization,
and needs the live build or Chris's ruling to decide. Added to the outstanding register.

---

## 5. What the overlap MEANS — presented, not decided

For the two DUPLICATEs (C38920, C38922) and the one bundle (C38919), three futures are possible
and **all three are a QA-lead + Vladimir Tomovic conversation, not our call:**

- **(a) Both stay — acceptable duplication.** Our manual case is the tester-facing, spec-referenced,
  expected-results-carrying record; his automation is the fast regression net over the same
  behaviour. Overlap between a manual suite and an automated suite is normal and often desirable.
- **(b) The manual case is retired in favour of the automation.** Only sensible once the automation
  is trusted, running in CI, and reporting somewhere the QA lead sees — and it costs us the
  spec-traceable record (his cases have **no `refs`**, so retiring ours would delete the only
  Rule-20 link for that behaviour).
- **(c) His automation is redundant** and the effort is better spent on the areas nobody covers.

**We recommend nothing unilateral and we changed nothing.** The evidence above is what the
conversation needs.

**Who to ask:** **Vladimir Tomovic** (vladimir.tomovic@shopview.com) — he created and last updated
all five. Three concrete things worth asking him:
1. Are the 5 the start of a wider automated pass over Report Suite, so we can expect more?
2. **C38922 step 3** toggles Location in the Column Selection menu; our C38916 says Location is not
   offered there. Which does the build actually do?
3. **C38923** asserts a Location column inside the SBR Summary/Expanded CSVs. If that is real, our
   C30285/C30286 verbatim header lists are wrong and we will fix ours (with authorization).

**Standing policy, unchanged:** we do not edit, delete, move, or add his cases to runs. We report
"**ours 474 / live total 479**" so the numbers are honest without claiming his work as ours.

---

## 6. TASK 3 — the reusable checker

`build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` — **read-only, `get_*` only,
no POST code path exists in the file.**

```bash
source /tmp/tr-creds.env
python3 foreign_overlap_check.py --group 4281                      # Report Suite
python3 foreign_overlap_check.py --group 4110 --group 4254          # Filters + Schedule
python3 foreign_overlap_check.py --group 4281 --top 8 --csv out.csv # more candidates + CSV
python3 foreign_overlap_check.py --group 4281 --refresh             # bypass the /tmp cache
```

What it prints per group: live total / ours / foreign, the foreign creators by name, **our
structural baseline** (refs populated, template, automation status/type, titles over 80), and for
each foreign case its **best-matching of-ours cases** with a similarity score computed on the
**normalised assertion text** (title + preconditions + steps + expected + separated steps), plus the
tells and a `has_expected` flag. Group ids: **Report Suite 4281 · Filters 4110 · Schedule 4254**.

**Scoring:** `0.5 × containment + 0.2 × Jaccard + 0.3 × difflib ratio`, on stop-worded tokens.
Containment is over the *smaller* token set on purpose, so a short foreign case wholly contained in
a long case of ours still scores high — that is the duplicate shape we care about.

**Honest limits (stated in the script's own output too):**
- Similarity **suggests candidates; a human confirms the verdict.** In this very pass the true
  duplicate C38920→C38914 scored only **0.264** — the absolute numbers are low because his cases
  have no expected results to match against. **Rank matters, the value does not:** in 4 of 5 cases
  the correct counterpart was in the top 2, but C38922's real counterparts (C30511 / C30516) ranked
  **4th and outside the top 6**. Read the top handful, do not trust position 1.
- A foreign case with `has_expected=NO` **cannot be compared on its pass criterion at all**, only on
  its subject. Say so rather than guessing.
- Cases outside the named group are not scanned; retired/deleted cases never appear.
- The tool never writes. Identify → exclude from our counts → raise with the author.

---

## OUTSTANDING — what I need from you

1. **A decision on whether to talk to Vladimir Tomovic** about the 5 automated cases — specifically
   the two questions where his cases and ours disagree about the build (**C38922** vs our
   **C38916** on the Location toggle; **C38923** vs our **C30285/C30286** header lists). Until one
   of those is settled, one side is wrong and a tester will hit it.
2. **A go-ahead (or a "not yet")** on correcting **SBR-EXP-10 = C30285** and **SBR-EXP-11 = C30286**
   if the Location column really does reach the SBR CSVs. Nothing has been changed; this needs your
   authorization (Rule 6) and ideally the live build or Chris Ward's ruling.
3. Nothing else outstanding from this pass — Filters and Schedule are clean, no foreign case is in
   any run, and the hands-off policy is now written into CLAUDE.md and the playbook.
