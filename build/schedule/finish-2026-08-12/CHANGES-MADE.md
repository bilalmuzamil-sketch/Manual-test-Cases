# Changes made — Schedule finish pass, 2026-08-12

## In TestRail (3 cases)
All three are build-label corrections; no assertion was changed. Full detail and byte-verification in
`testrail-execution-log.md`.

- [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) — precondition: `'Filter and Display'` → **`'Filter & display'`**
- [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) — step and expected result: `the 'Filter' button` → **`the 'Filters' button`**
- [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) — step 1: `'this shift only'` → **`'This shift only'`**

## On the QA branch
- **Roles: restored.** A `ZZAUTOTEST probe` role was created, edited and deleted (verified gone; 12
  roles before, 12 after). The **Technician** role's permissions were changed and then **restored
  byte-identical — 10 fields compared, 0 mismatches.**
- **Data: not restored, per the QA lead's instruction** — except the one shift a probe deleted, which
  was recreated before that instruction arrived. It is field-identical to the record it replaces apart
  from its id: `INCIDENT-shift-delete-2026-08-12.md`.
- **View options: put back.** Capacity Planning and Events were flipped off and back on; Business Hours
  was turned on and back off. These are display toggles, but they persist per user and the manual
  testers share this estate.

## Not changed
- **No marker moved.** READY 143 · EXPECT-FAIL 4 · HOLD 29 — identical before and after.
- **No build line re-stamped.** Every case I walked already named `v3.5-65d6500`; the 100 that do not
  name it were not walked, and stamping them from a label harvest would assert a check I did not do.
- **No expected result edited.**
- **Nothing created in Jira** — the creation hold is active.
