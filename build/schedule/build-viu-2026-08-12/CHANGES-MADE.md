# Schedule — changes made, 2026-08-12

**14 × `update_case`. Every one HTTP 200, 30 fields compared, 0 mismatches, 0 collateral changes.**
Zero `add_case` · zero `delete_case` · zero section writes · **zero run writes** · zero results ·
zero Jira calls of any kind. All three text fields on every payload.

Per-operation detail: `testrail-execution-log.md`. Machine log: `evidence/exec-log.json`.

---

## A · Label corrections — the five dialogs

### [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) — `Add hours` → `Add Hours`
Title, step 1 and expected line 1. **Also gained the navigation it never had:** the precondition now
says where the per-day hours editor actually is — *Settings > Locations > the pencil on a shop's row >
turn on 'Set business hours for this shop'*, or *Settings > Staff > the pencil on a technician's row >
turn on 'Set working hours for this technician'*. It previously said only *"you are in the per-day
working-hours editor"*, which is not a route a new tester can follow.

### [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) — `Set custom hours…` → `Set working hours for this technician`
Title, steps and expected. Navigation added to the precondition. New title is 78 characters.

### [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) — same toggle label
Preconditions and expected.

### [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) — `Reset To Template` → `Reset to template`, **and the step now says where it is**
> Open the role by clicking the pencil on its row, then click 'Reset to template' on the role's own
> screen … **Note: the three-dot menu on the roles list does NOT offer this — it only offers
> 'View Permissions'. The reset button is on the role's own screen.**

**This is the most consequential single change of the pass**: the old step sent the tester to a menu
that does not contain the control, on the case that resets every role before permission testing.

### [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) — label confirmed exact
No wording change to the assertion. Navigation added to the precondition; build stamp re-cut.

## B · [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) — the dead end is now explained

The expectation is **unchanged** — §7 and §11 both require a click-to-arm alternative, and
[SV-8957](https://shopview.atlassian.net/browse/SV-8957) being closed OBSOLETE does not amend the
specification (Rule 57). What was added is the Rule-61 symptom and its three outcomes:

> What you should see today: there is no click alternative anywhere. The work order card in the
> left-hand panel carries no button that arms it for placing — not when the page loads, not when you
> rest the mouse on the card, and not inside the card's line list. The only way to place a job on the
> grid is to drag it. This is a known problem and it is already reported — see
> https://shopview.atlassian.net/browse/SV-8957. **That ticket has been closed without the problem
> being fixed, so do not wait for a fix.**
> - If you see exactly that, mark this test FAILED and do not raise anything new.
> - If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
> - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.

Marker: `AUTOMATION: READY` → **`AUTOMATION: READY - EXPECT FAIL (SV-8957)`** — and it has the live
backing Rule 61 requires, because the absence was observed today, not assumed from the ticket.

## C · [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) — marker corrected to HOLD

Six cases marked `AUTOMATION: READY` for a feature with **no interface**. Now
**`AUTOMATION: HOLD - the panel button does not exist in this build`**, with the in-case note
re-dated and sharpened so the tester is not misled by the mini-calendar arrow:

> …the only thing on the page that hides anything is the small arrow that folds away the month
> calendar inside the panel, **which is a different control**…

Their expected results are otherwise untouched — the requirement stands.

## D · Build stamps re-cut on what was actually observed

[C30084](https://shopview.testrail.io/index.php?/cases/view/30084) (the `Time Clock` control read live
on the staff record) and [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) (`Day`
carries `aria-pressed="true"` on arrival, so the case passes).

**Rule 54 sentence 2 only — the SOURCE sentence was never touched on any case**, and no case we did
not observe was re-stamped.

---

## A defect in our own tooling, caught before it shipped

The re-stamp regex was `Last checked against build [^\n]*?\.` — **non-greedy to the first `.`, which
lands INSIDE the marker `v3.5-65d6500`**. It produced

```
Last checked against build v3.5-65d6500 on 8/12/2026.5-af3a6e1 on 8/11/2026.
```

Found by reading the built payloads before executing, not by the byte-check — **the byte-check would
have passed, because the write would have been faithful to the payload; the payload was wrong.**
Anchored on the trailing date instead: `Last checked against build \S+ on \d{1,2}/\d{1,2}/\d{4}\.`
All 176 cases were then read back live: **one build stamp each, none doubled.**

## Deliverables re-synced

- Local case bodies pulled **FROM LIVE** for all 14 changed cases — 23 fields moved, 33 already equal.
  The list-vs-string false-drift trap was avoided by comparing on the joined form.
- `testrail-id-map.csv`: **`gen_import.py` blanked all 176 C-ids on rerun, as it always does** —
  re-merged from the committed map, then **titles taken from LIVE**. 176 rows, **0 blanks, refs
  176/176**, header byte-identical, titles byte-equal to live.
  **Three stale titles were fixed in passing** — C30042, C30046, C30051 still carried the *pre*-11-August
  wording (`'Filter & Display'`, `'View Options'`, `Saturday and Sunday toggles`), because that pass
  pushed the case titles but never re-merged the map.
- Import regenerated: **176 rows, shredding guard 0**, header sha256 `a82ca60c36074512` — **identical
  to all five peer imports**.
- **Four counts: live 176 · local active 176 · id-map 176 · import 176, set-equal in both directions.**
