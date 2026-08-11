# Schedule labels-final — per-operation execution log, 2026-08-11

**12 × `update_case`. Nothing else.**
`0 add_case · 0 delete_case · 0 section write · 0 run write · 0 result write · 0 Jira call`

Executor: `tools/exec_labels.py` · payloads: `tools/payloads.py` · machine log:
`snapshots/oplog.json` · per-case before/after: `snapshots/PRE-C*.json` / `POST-C*.json`

---

## Rule 59 — the source re-read, at write start

```
[2026-08-11T17:50:09Z] SOURCE RE-READ (write-start): Confluence 713031682 HTTP 200,
  version 27, when 2026-08-07T15:01:20.801Z, 43064 chars,
  sha256 4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b
  verdict: UNCHANGED — v27, body sha256 identical to the committed mirror. Safe to write.
```

Compared by **body checksum, not version number** — the page's in-body *"Version"* field reads `1.0`
and lies. The executor exits before touching anything if either the version or the checksum moves.

## The pre-write baseline

```
[2026-08-11T17:50:54Z] pre-write Schedule snapshot: 176 of 176 id-map cases read live and on disk
[2026-08-11T17:51:06Z] re-snapshotted 12 targets from live at write time
[2026-08-11T17:51:06Z] 12 payloads built; every exact-string anchor matched live
```

**The targets were re-snapshotted from live IMMEDIATELY before writing**, and every edit is an
**exact-string replacement with a hard pre-assertion on the literal and its occurrence count**. That
is what protects this pass from a sibling's concurrent edit: a changed anchor raises `AnchorMissing`
and **the batch never starts** — never a silent no-op, never a blind overwrite.

## The 12 operations

| # | Case | Link | HTTP | Fields compared | Intended | Mismatches | Fields changed |
|---|---|---|---|---|---|---|---|
| 01 | **C30042** | [view](https://shopview.testrail.io/index.php?/cases/view/30042) | **200** | 30 | 4 | **0** | title, custom_steps, custom_expected |
| 02 | **C30046** | [view](https://shopview.testrail.io/index.php?/cases/view/30046) | **200** | 30 | 4 | **0** | title, custom_steps, custom_expected |
| 03 | **C30047** | [view](https://shopview.testrail.io/index.php?/cases/view/30047) | **200** | 30 | 3 | **0** | custom_steps |
| 04 | **C30050** | [view](https://shopview.testrail.io/index.php?/cases/view/30050) | **200** | 30 | 3 | **0** | custom_steps |
| 05 | **C30051** | [view](https://shopview.testrail.io/index.php?/cases/view/30051) | **200** | 30 | 4 | **0** | title, custom_steps, custom_expected |
| 06 | **C29930** | [view](https://shopview.testrail.io/index.php?/cases/view/29930) | **200** | 30 | 3 | **0** | custom_expected |
| 07 | **C30043** | [view](https://shopview.testrail.io/index.php?/cases/view/30043) | **200** | 30 | 3 | **0** | custom_steps |
| 08 | **C30044** | [view](https://shopview.testrail.io/index.php?/cases/view/30044) | **200** | 30 | 3 | **0** | custom_steps |
| 09 | **C30045** | [view](https://shopview.testrail.io/index.php?/cases/view/30045) | **200** | 30 | 3 | **0** | custom_steps |
| 10 | **C30082** | [view](https://shopview.testrail.io/index.php?/cases/view/30082) | **200** | 30 | 3 | **0** | custom_steps |
| 11 | **C30025** | [view](https://shopview.testrail.io/index.php?/cases/view/30025) | **200** | 30 | 3 | **0** | custom_expected |
| 12 | **C30015** | [view](https://shopview.testrail.io/index.php?/cases/view/30015) | **200** | 30 | 3 | **0** | custom_expected |

**Every payload carried all three text fields**, including the unchanged ones — playbook §J declared
normalisation #3: TestRail re-renders any text field you *omit* into `<p>`-wrapped HTML with CRLF, and
this project shows markup literally to the tester.

**Every write was re-GET and compared field by field** against the intended payload, with every field
the pass did not intend to change proven byte-identical to its pre-write snapshot. `tr.update_case_verified`
**raises on any mismatch and there is no handler**, so the batch would have stopped.

## The post-write census — because a byte-check proves FIDELITY, not CORRECTNESS

Run on every case after its write (the C30341 lesson: a faithful write of a *wrong* payload passes a
byte comparison). Each case was checked for **exactly one provenance line**, **exactly one automation
marker**, **zero raw markup** (`<p>`, `<li>`, `<ol>`, `<br`, `&nbsp;`), **no CRLF**, and a **title
≤ 80 characters**. **All 12 passed; the longest resulting title is 79 characters.**

## The untouched-proof — BY CONTENT, never by `updated_on`

```
[2026-08-11T17:52:32Z] untouched-proof BY CONTENT: 164 non-target cases compared
  across 9 fields — 0 differences
```

**Scoped deliberately to the 176 Schedule cases from the committed id-map, not the whole 4,091-case
project.** Siblings are writing to Filters and Report Suite right now; a project-wide diff would
report *their* legitimate work as drift and bury ours.

Fields compared per case: `title`, `custom_preconds`, `custom_steps`, `custom_expected`, `refs`,
`section_id`, `type_id`, `priority_id`, `template_id`.

## Independent post-hoc verification

Re-run after the batch, from a **fresh** `get_case` on each of the 12, rebuilding the intended
payloads from the committed write-time snapshots: **336 fields compared, 0 mismatches.**

**One honest note on the way there.** A first, ad-hoc check reported **6 apparent failures**. They
were **errors in the check, not in the writes**: it counted occurrences across title + steps +
expected concatenated, so the three cases whose *titles* now legitimately contain the new label
counted one extra each, and C30025 already contained the phrase *"shop business hours"* in item 3.
**The check was wrong; the writes were right** — and it is recorded here rather than quietly
re-run, because a verification that cries wolf is itself a defect worth knowing about.

## Run 357 — untouched, and proven so

Read-only, after the batch: `include_all=false`, **174 tests**, **529 result records**,
**89 Passed / 6 Failed / 2 Blocked / 77 Untested**. **Identical to `build/RECOVERY-2026-08-11/STATE.md`.**
**No run call of any kind was made** — not `update_run`, not `add_result`.
