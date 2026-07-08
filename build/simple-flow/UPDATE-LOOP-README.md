# Simple Flow — TestRail Unblock → Update Loop

This is the iterative process for getting all Simple Flow cases into TestRail now
and then keeping them current as each blocker clears. Three artifacts drive it:

| Artifact | Purpose |
|---|---|
| `testrail-import/simple-flow-v1-testrail-import.csv` (+ `.xlsx`) | **Upload file** — all 159 cases, current best state. Upload this FIRST. |
| `build/simple-flow/SimpleFlow_Blockers_Tracker.xlsx` (+ `.md`) | **Source of truth** — every case's state, what it's blocked on, who unblocks it. |
| `build/simple-flow/gen_update.py` | **Update generator** — emits a TestRail-ready file for ONLY the cases whose blocker just cleared. |

## The loop

1. **You upload Deliverable 1** (`simple-flow-v1-testrail-import.csv`) into
   TestRail (project 1 / suite 1 "Master"). Import mode = *create*. TestRail then
   assigns a Case ID (`C#####`) to each case.

2. **Establish the ID map (one time).** So future updates match in place (no
   duplicates), we need each SF id paired with its new TestRail Case ID. Either:
   - **(a)** You export the cases from TestRail (CSV/Excel export includes ID +
     Title) and hand it back, OR
   - **(b)** You authorize me to pull the case list **read-only** via the TestRail
     API (`get_cases` for project 1 / suite 1) — I will NOT write to TestRail.

   Save the pairing as `build/simple-flow/testrail-id-map.csv` with columns:
   ```
   sf_id,testrail_case_id
   SF-SET-01,12345
   SF-SET-02,12346
   ...
   ```
   (`testrail_case_id` may be `12345` or `C12345`; both work.) Matching by SF id
   requires that SF ids are recoverable from the imported cases — the simplest way
   is to keep the Title unchanged (Titles are unique) or add the SF id to the
   References/a custom field on import. Until the map exists, updates fall back to
   **Title matching** (see the warning below).

3. **A blocker clears.** Examples:
   - Milos answers Open Question #7 → SF-REV-10's expected is now decidable.
   - Dev deploys Story 8 (Bulk Receive) → the 10 `SF-BULK-*` cases + `SF-PERM-03`
     + `SF-VAL-09` can be VIU-verified.
   - You send fresh sv7301 cookies + a 2nd role account → QA-pending cases can be
     driven.

4. **I fold the answer in.** I flip the affected cases' `viu_status` / `expected`
   in `build/simple-flow/cases/*.json`, then regenerate the Blockers Tracker
   (`python3 build/simple-flow/gen_blockers.py`).

5. **I generate the incremental update file** for just those cases:
   ```bash
   python3 build/simple-flow/gen_update.py SF-BULK-01 SF-BULK-02 ... SF-PERM-03
   # or:  python3 build/simple-flow/gen_update.py --file cleared-ids.txt
   ```
   Output → `testrail-import/simple-flow-UPDATE.xml` (**XML is now the default**;
   add `--format csv` for `simple-flow-UPDATE.csv`). The XML follows TestRail's
   suite/section/case schema and, when the Case-ID map is present, carries a
   `<id>C#####</id>` per case so the import targets the existing case in place.

6. **You import the UPDATE file** into TestRail with mode = *update existing*. For
   XML the `<id>` per case targets the existing case; for CSV, match on the **ID**
   column. Only those cases change; nothing is duplicated.

7. **Repeat** from step 3 as each blocker clears. Each round you also get a
   refreshed Blockers Tracker so the remaining work is always visible.

## gen_update.py — reference

```
python3 gen_update.py SF-BULK-01 SF-BULK-02        # ids on the command line
python3 gen_update.py --file ids.txt                # one SF id per line (# comments ok)
python3 gen_update.py --all-ready                   # every currently-READY case
python3 gen_update.py SF-REV-10 --format csv        # emit ID-matched CSV instead of XML
python3 gen_update.py SF-REV-10 --out /path/out.xml # custom output path
python3 gen_update.py SF-REV-10 --map /path/map.csv # custom id-map path
```

- **Default format = TestRail suite XML** (`simple-flow-UPDATE.xml`). Sections
  nest per TestRail's XML import schema; each case has title + custom
  preconds/steps/expected, and — when the Case-ID map is present — a
  `<id>C#####</id>` so the import **updates the existing case in place**.
- **CSV available** (`--format csv`) — emits an ID-matched CSV whose first column
  is `ID` (the TestRail Case ID); map it to **ID** on import and pick
  *update existing*.
- **The Case-ID map is required to update EXISTING cases** (either format). Save
  it as `build/simple-flow/testrail-id-map.csv` (`sf_id,testrail_case_id`). We
  pull it **read-only** via the TestRail API (with your permission) or you export
  it from TestRail after the initial import (step 2).
- **No id map present?** The script still runs but emits **Title-keyed** output
  (no `<id>`/`ID` column) and prints a WARNING. Title matching risks creating
  duplicates, so establishing the id map (step 2) is strongly preferred.
- Content rules match the upload file exactly: **no VIU wording, no feature-flag
  phrase**, leaf section names, References = Jira story id(s) + spec-rule ref. The
  script re-reads the current case JSONs, so whatever you regenerate reflects the
  latest flipped expected results.

## Guardrails

- This task and these scripts **never write to TestRail.** Any TestRail write
  (create/update/delete) requires your explicit permission per standing rules.
- Secrets (cookies/tokens) live in `/tmp` only — never committed.
