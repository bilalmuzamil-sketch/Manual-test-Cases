# Report Suite — the UI-route re-pins — 2026-08-28

**28 cases re-pinned through the TestRail UI editor. Every one verified on its RENDERED page
immediately after its own write. Zero failures — `UI-FAILED.jsonl` was never created.**
No `add_case`, no `delete_case`, no run write. **No Automated case was touched.**

Evidence: `UI-REPINNED.jsonl` (one record per case, resumable) · `ui-write-plan.json` ·
`ui_repin_batch.mjs` · `UI-BATCH-STATUS.txt`.

---

## 1 · What was written

| Report | Pin | Cases |
|---|---|---|
| Sales By Representative | 22 → **24** | C30195 C30206 C30208 C30213 C30226 C30229 C30230 C30231 C30233 C30237 C30238 C38894 C38913 |
| Parts Velocity | 10 → **11** | C30325 C30368 C30369 C30370 C30371 |
| Work In Progress | 22 → **28** | C30475 C30476 C30477 C30478 C30479 C30480 C30485 C38916 C43836 |
| Work In Progress | 24 → **28** | C30464 |

**28 total** — 20 classified `multi-block-cleared`, 8 the hand-assessed `impacted-hold` cases that
`HELD-25-ASSESSMENT.md` §4 cleared as pin-only.

## 2 · The method, and the one deliberate difference from the repair script

The harness is the proven one (`damage-2026-08-26/ui_repair_batch.mjs`) and keeps both of its
hard-won fixes: the **navigation poll** after Save instead of a fixed wait, and **no-cache headers
with a fresh navigation per case** because the edit form's one-shot token rotates.

**The edit itself is surgical, not a re-paste.** The repair script cleared each field and re-pasted
the whole body, because the body was damaged. Here the body is correct and only the cited version
changes, so the script places a DOM **Range over the version number itself** inside the editor and
types the new number over that selection. Nothing else in the field is ever selected, deleted or
re-typed, so no other character can move. A clear-and-re-paste would have flattened the `<ol><li>`
bodies into plain numbered lines — a visible change and a breach of "every other character stays
as it is".

## 3 · Verification, per case, on the rendered page

Container class of all three fields · zero literal tags · zero visible HTML entities · **the
rendered wording byte-identical to the same case's rendered wording before the write, except the
version token** · the new version cited and the old one gone · AUTOMATION marker present exactly
once and still last · provenance line present · `custom_atmstatus`, title, `refs`, `section_id`,
`priority_id`, `type_id`, `estimate`, `milestone_id`, `template_id` and `custom_automation_type`
all unchanged. The run was set to **stop dead on the first failure**. 28 of 28 clean.

**Numbered-list side effect (seen on C30518 on 2026-08-26): did NOT occur on any of the 28.**
The editor loads the *rendered* HTML, so a body already stored as `<ol><li>` came back as
`<ol><li>`. Recorded per case in `UI-REPINNED.jsonl` (`numbered_list_side_effect`, empty on all 28).

**Bonus, as expected:** 5 cases whose Expected Result was served by the escaping `markdown`
container — **C30369, C30370, C30371, C30485, C38916** — now render in `markdown fr-view`. They
are no longer fragile. All 28 cases now render all three fields in `markdown fr-view`.

## 4 · 12 of the 40 were NOT written — the "4 held" count in `NEEDS-UI-ROUTE.md` is an undercount

`NEEDS-UI-ROUTE.md` reports the split as 14 escaping + 22 multi-block + 4 judgement. Its
"Why the API is barred" column shows only the **mechanical** reason, which **masks a judgement hold
on 8 further cases** that are recorded elsewhere in this same directory:

| Case | Why it is held | Recorded in |
|---|---|---|
| C30345 | Content change needed — its item 3 says the **exports** right-align numerics; live PV v11 S3-R8 says only the **PDF** does | `HELD-25-ASSESSMENT.md` §2 |
| C30381 | Pin-only but the version is named **twice**, and the tester note's date is stale too | `HELD-25-ASSESSMENT.md` §3 |
| **C30459** | **Content change needed** — its item 3 sends a tester to a **date range** that WIP no longer has (live S7-R8) | `HELD-25-ASSESSMENT.md` §2 · `RESULTS.md` outstanding item 3 |
| C30235 C30236 C30526 C43547 C43592 C43593 C43594 C43821 C43839 | **No requirement anchor**, so nothing proves the content is current; `RESULTS.md` outstanding item 5 says these are un-re-pinned **on purpose** and asks whether to read them against the live spec by topic | `RESULTS.md` item 5 |

Re-pinning C30459 would stamp a version onto a case whose wording is **known** to contradict that
version. Re-pinning the nine anchorless cases would stamp them with a version nobody has read them
against — the exact fault this work exists to fix. Both were therefore left at the button.

**28 written + 12 held = 40. Nothing is unaccounted for.**

## 5 · One observation, not acted on

`CLASSIFICATION.csv` records **C43836**'s Expected Result as an escaping `markdown` container; live
at write time it was already `markdown fr-view` (it is one of the 71 cases repaired through the UI
earlier the same day). The classification snapshot is stale on that one row. Nothing was changed
for it beyond the pin.

## OUTSTANDING — what I need from you

1. **C30459 — approve the content correction?** Item 3 becomes *"Both an 'as of' date change and a
   location change reload the report's rows."* plus the pin 22 → 28. Prepared, not written.
2. **C30345 — approve the content correction?** Item 3's parenthetical becomes PDF-only. Prepared,
   not written.
3. **C30381 — approve the two-place version + date correction?** Both mentions to version 11, and
   the tester note's date to 20 August 2026.
4. **The 9 anchorless cases** (C30235, C30236, C30526, C43547, C43592, C43593, C43594, C43821,
   C43839) — may I read them against the live specification **by topic** and then re-pin the ones
   that prove current? Nothing else will clear them.
5. **The 39 Automated cases in `AUTOMATED-HELD.md`** are still untouched and still need your
   per-case or blanket go-ahead (Rule 71), with Vlad told for any we change (Rule 65).
