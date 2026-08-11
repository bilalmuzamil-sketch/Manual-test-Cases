# TestRail execution log — label-layer corrections, 2026-08-11

**Authorisation:** `update_case` on existing cases only. **The QA lead's creation hold is in force**
(*"DO not create tickets keep the hold"*): **0 `add_case` · 0 `delete_case` · 0 section operations ·
0 run writes · 0 results logged · 0 Jira issues created.**

**Build at write time** `v3.5-4795eee` · etag `a80113cf3856c5fedf63be893e8b41c7` · `index.html`
sha256 `a4ea53ed…13e8f`.
**Sources read at pass start 02:16:31Z and RE-READ at write start 02:26Z (Standing Rule 59) —
byte-identical, verdict unchanged.**

## Result

**9 `update_case` operations · every one HTTP 200 · 30 fields byte-compared on each · 0 mismatches ·
0 collateral changes.** Every payload carried **all three text fields explicitly**
(`custom_preconds`, `custom_steps`, `custom_expected`), because TestRail re-renders any text field
omitted from the payload.

## Before the batch was sent

Each substitution was proven safe **before** any network call:

1. **No-op guard** — a substitution that changed nothing aborts the batch.
2. **Mask check** — undoing every substitution on the new text had to reproduce the pre-write text
   **byte for byte**, so nothing outside the intended token could move. The tool fails closed.
3. **Markup guard** — the payload was refused if it contained any of
   `<ol <li <ul <p> <br <div <span <table`.

## Per operation

| # | Case | Field | Substitution | HTTP | Fields compared | Verify |
|---:|---|---|---|:---:|---:|---|
| 1 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | Steps | `choose "Download (CSV)".` ×1 → `choose a CSV download - "Download Summary (CSV)" or "Download Expanded View (CSV)".` | 200 | 30 | **MATCH** |
| 2 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | Steps | `Choose "Download (PDF)".` ×1 → `Choose a PDF download - "Download Summary (PDF)" or "Download Expanded View (PDF)".` | 200 | 30 | **MATCH** |
| 3 | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | Steps | `Choose "Download (CSV)" and open the file.` ×1 → `Choose a CSV download - "Download Summary (CSV)" or "Download Expanded View (CSV)" - and open the file.` | 200 | 30 | **MATCH** |
| 4 | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | Steps | `Choose "Download (PDF)" and open the file.` ×1 → `Choose a PDF download - "Download Summary (PDF)" or "Download Expanded View (PDF)" - and open the file.` | 200 | 30 | **MATCH** |
| 5 | [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | Steps | `Trigger "Download (CSV)" and "Download (PDF)" and observe where the file content comes from.` ×1 → `Trigger a CSV download ("Download Summary (CSV)" or "Download Expanded View (CSV)") and a PDF download ("Download Summary (PDF)" or "Download Expanded View (PDF)"), and observe where the file content comes from.` | 200 | 30 | **MATCH** |
| 6 | [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) | Steps | `Choose "Download (CSV)" and check the filename.` ×1 → `Choose "Download Summary (CSV)" and check the filename.` | 200 | 30 | **MATCH** |
| 7 | [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Expected Results | `"Approved - partially completed"` ×1 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 8 | [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Expected Results | `"Approved - partially completed"` ×2 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 9 | [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Expected Results | `"Approved - not started"` ×1 → `"Approved - Not Started"` | 200 | 30 | **MATCH** |
| 10 | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Preconditions | `"Approved - partially completed"` ×1 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 11 | [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | Preconditions | `"Approved - partially completed"` ×1 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 12 | [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | Preconditions | `"Approved - not started"` ×1 → `"Approved - Not Started"` | 200 | 30 | **MATCH** |
| 13 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Steps | `"Approved - partially completed"` ×1 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 14 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Steps | `"Approved - not started"` ×1 → `"Approved - Not Started"` | 200 | 30 | **MATCH** |
| 15 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Expected Results | `"Approved - partially completed"` ×1 → `"Approved - Partially Completed"` | 200 | 30 | **MATCH** |
| 16 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Expected Results | `"Approved - not started"` ×1 → `"Approved - Not Started"` | 200 | 30 | **MATCH** |

**16 substitutions across 9 cases.** Each case is one `update_case` operation; C30490 carried
substitutions in two fields in the same write.

## Proofs after the batch

| Proof | Method | Result |
|---|---|---|
| Intended fields | re-GET, byte-compared against the payload | **9 / 9 MATCH** |
| Collateral damage on the touched cases | every other field byte-compared against the pre-write snapshot | **0 fields moved** other than the intended field(s) and TestRail's own `updated_on` |
| The other **216** of our 225 | re-pulled and compared field by field **including `updated_on` and `updated_by`** | **30 fields each · 0 differences** |
| Foreign cases (Rule 38) | C38919 · C38922 · C43572 — never named in any payload | **untouched** |
| Raw markup | census of all 225 across title, preconditions, steps and expected | **0 before · 0 after** |
| Case count | live vs pass-start snapshot | **225 = 225, set-equal both directions** |

### Run 359 (Nebojsa / Viktoria) and run 352 (Ahtasham) — proven untouched BY CONTENT

| | Run 359 | Run 352 |
|---|---|---|
| `include_all` | false → **false** | false → **false** |
| Tests | 476 → **476**, test-id sets equal both ways | 114 → **114**, test-id sets equal both ways |
| `case_id` sets | **equal in both directions** — 0 missing, 0 new | **equal in both directions** — 0 missing, 0 new |
| Result records | 535 → **535**, all present **BY ID** | 473 → **473**, all present **BY ID** |
| Result records with **any** field changed | **0** | **0** |
| New results during the write window | **0** | **0** |

**Nothing was written to either run.** The comparison is by content, record by record — not by
count, and not by timestamp.

## Deliberately NOT written

| Case | Why |
|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | asserts the tab **labels**, in Title Case, against WIP `S1-R2`'s lower case. Changing it moves an **expectation** and flips a verdict — the QA lead's call. **Escalated.** |
| [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) · [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) · [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) · [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | class **B** — a numbered requirement pins the wording and the build differs. Real deviations; the cases keep the specification's wording (Rule 57). |
| [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | its `EXPECT FAIL (SV-8881)` note is now stale — the wording defect is fixed and the remaining fault is the menu **order**. That is a **verdict**, not a label. **Reported, not changed.** |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | correct as written — Story 16 was retired, the build has no Print item, so the previous pass's "missing Print" deviation **does not exist**. |
| The other **68** flagged cases | never mismatches — trailing punctuation inside the quote marks, seeded data, worked examples, format placeholders, toasts, empty states, tooltips and export/PDF content the default page cannot show. |

## Markup census — three times, and why zero is never durable

`0 of 225` at **pass start (02:19Z)**, **immediately after the batch (02:28Z)** and again at
**02:34Z**. TestRail re-renders stored text into HTML on its own schedule, sometimes hours after a
write and **without moving `updated_on`** (playbook §J hazard #5), so a clean census is a
measurement at a moment, not a guarantee. It is recorded here with its timestamps for that reason.
Every payload in this batch was additionally refused-if-markup before being sent.
