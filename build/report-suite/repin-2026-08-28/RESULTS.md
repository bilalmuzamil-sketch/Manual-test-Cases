# Report Suite — the outstanding re-pins and the held cases — 2026-08-28

**14 cases re-pinned. Every one verified on its RENDERED page immediately after its own write.
Zero damaged. No `add_case`, no `delete_case`, no run write, no Automated case touched.**

The 2026-08-26 pass approved 256 Group C re-pins and landed 163. This pass took the **93 that were
left** (54 held + 39 Automated), classified every one of them before writing anything, and wrote
only what could be proved safe case by case.

---

## Phase 1 — classify before writing (`CLASSIFICATION.csv`, 93 rows, read-only)

TestRail serves each text field in one of two containers, and **`get_case` does not expose which**:

* **`markdown fr-view`** — the stored value is emitted raw, so stored HTML renders;
* **`markdown`** — the stored value goes through the markdown renderer, which **escapes** tags, so
  the `<p>` wrapper `update_case` always adds becomes literal text on the tester's screen.

That flag is what turned a bulk API write into 72 damaged cases on 2026-08-26. So every one of the
93 had its **rendered view page** fetched and its container recorded, along with `custom_atmstatus`,
the current pin, the intended pin, and the top-level block count of its Expected Result.

| Split | Count |
|---|---|
| **`markdown fr-view`** (an API write is invisible) | **44** |
| **`markdown`** (an API write is visible damage) | **49** |
| — of the 49, Automated as well | 35 |
| **Automated (`custom_atmstatus = 3`)**, any container | **39** |
| Not Automated | 54 |
| Expected Result is a single top-level block | 71 |
| Expected Result is multi-block (4 / 3 / 5 blocks) | 22 |
| Cases already showing a literal tag or a visible entity to a tester | **0** |

**53 % of the remaining set would have been damaged by a blind API write.** None was written.

## Phase 2 — write only what is provably safe

Five gates, all re-proved live immediately before each write: renders `fr-view` · not Automated ·
single top-level block · content confirmed current by hand against the live requirement text ·
the reverse transform reconstructs the stored value **byte-for-byte**.

**Only `custom_expected` was sent.** Omitted fields are preserved byte-identically; sending a field
is what re-renders it.

**14 written** — C30348 · C30365 · C30366 · C30382 · C30455 · C30501 · C30502 · C30528 · C30530 ·
C30531 · C30533 · C38918 · C38924 · C43551.

After **each single write** the case was re-read twice — through the API and through the rendered
view page — and had to pass all of: container still `markdown fr-view` · zero literal tags · zero
visible entities · AUTOMATION marker present exactly once and still last · provenance line present ·
the new version cited · `custom_atmstatus` unchanged · every unsent field byte-identical. The run
was set to abort on the first failure. **14 of 14 clean, `FAILED.jsonl` never created.**

## Phase 3 — the 25 held "impacted" cases, assessed by hand

Read against the live requirement text, not the classifier. Full evidence in
`HELD-25-ASSESSMENT.md`.

| Verdict | Count |
|---|---|
| Pin-only correction (content current) | **22** — 14 written, 8 blocked by storage shape |
| Genuine content change needed | **2** — C30345, C30459, prepared and stopped at the button |
| Pin-only but the version is named twice | **1** — C30381, stopped at the button |
| Needs a PO decision | **0** |

## What is still outstanding, and why

| Bucket | Count | File |
|---|---|---|
| Approved re-pins that must go through the **UI editor**, never the API | **40** | `NEEDS-UI-ROUTE.md` |
| — because the container escapes | 14 | |
| — because the body is multi-block | 22 | |
| — held on content or judgement | 4 | |
| **Automated, untouched** (Rule 71) | **39** | `AUTOMATED-HELD.md` |

39 + 40 + 14 written = **93. Nothing is unaccounted for.**

## Files

| File | What it is |
|---|---|
| `CLASSIFICATION.csv` | the Phase-1 evidence, one row per case |
| `REPINNED.jsonl` | one record per write, with its verification result (resumable) |
| `HELD-25-ASSESSMENT.md` | the per-case judgement on the 25, with the live spec quotes |
| `NEEDS-UI-ROUTE.md` | the 40 still needing a re-pin, with the pin each needs |
| `AUTOMATED-HELD.md` | the 39 Automated cases, for the QA lead's per-case decision |
| `classify.py` · `dossier.py` · `repin_write.py` · `gen_docs.py` | the scripts, all re-runnable |

## OUTSTANDING — what I need from you

1. **Approve the UI editor route for the 40 re-pins in `NEEDS-UI-ROUTE.md`.** The route is already
   proven (71 cases repaired with it on 2026-08-28) and a UI save also flips the field to the
   rendering container, so a case fixed that way stops being fragile.
2. **The 39 Automated cases in `AUTOMATED-HELD.md`** — per-case or blanket go-ahead (Rule 71), and
   Vlad told for any we change (Rule 65). Separately, **C30518** is still carrying visible render
   damage and still needs its own go-ahead.
3. **C30345 and C30459** — approve the two content corrections written out in the assessment.
4. **C30381** — approve the two-place version + date correction.
5. **The 9 "no anchor" cases** (C30235, C30236, C30526, C43547, C43592, C43593, C43594, C43821,
   C43839) are still un-re-pinned on purpose: they cite no requirement anchor, so nothing proves
   their content is current, and stamping them with a version nobody read them against is the exact
   fault this work exists to fix. Want me to read them against the live spec by topic?
6. **WIP v28 S4-R9 gained a rule with no test case** (rows with no unit number sort last). The
   Rule-62 creation hold is recorded as active — has it lifted?
