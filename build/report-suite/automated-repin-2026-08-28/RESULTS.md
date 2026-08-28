# Report Suite — the 38 held Automated cases re-pinned — 2026-08-28

**38 of 38 re-pinned. Every one verified on its RENDERED page after its own write. Zero left damaged.
No `add_case`, no `delete_case`, no run write. Two cases came back wrong mid-run, both runs were
STOPPED on the spot, both cases were repaired and re-verified before anything else was written.**

**Authority:** the QA lead relayed Vlad's answer on 2026-08-28 — he checked the already-updated
Automated case **C30287** and reported the update *"has not changed the formatting and it still looks
good on that case"*, which was passed to this pass as clearance for the specification-version pin
restamps. Rule 65 register rows are in
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` under the 2026-08-28
heading.

---

## 1 · The set — 38, not 39

`repin-2026-08-28/AUTOMATED-HELD.md` lists **39**. Re-read live at the start of this pass,
**C30277 already cites the live version 24** (it was re-pinned and repaired in the 2026-08-26/28
damage work), so it needed nothing. **38 cases needed the pin.** All 38 were confirmed
`custom_atmstatus = 3` immediately before their own write, and all 38 are still `3` after it.

| Report | Cases | Pin |
|---|---|---|
| Sales By Representative | 13 | 22 → **24** |
| Parts Velocity | 13 | 10 → **11** |
| Work In Progress | 12 | 21 or 22 → **28** |

## 2 · No case needed a CONTENT change — and that was checked, not assumed

`source-verify-2026-08-26/tools/verify.py` compares each cited requirement anchor's **definition**
text in the held baseline against the **live** specification body. **31 of the 38 cite only anchors
whose definition text is unchanged.** The other **7 cite an anchor whose text did change**, so each
of those was read by hand, whole, against the live requirement:

| C-id | Changed anchor | What moved in the spec | Verdict |
|---|---|---|---|
| C30351 · C30353 | PV S4-R4 | canonical column list: *Unit Cost, Sell Price* → *Avg Cost, Avg Sell* | the case **already says Avg Cost / Avg Sell** — current |
| C30377 | PV S4-R4 | as above | the case asserts canonical ORDER only, names no cost column — current |
| C30460 | WIP S2-N1 | trigger reworded *current date range* → *selected "as of" date* | the case's steps **already say "as of" date** — current |
| C30507 | WIP S8-R7 | remembered *date range* → *"as of" date* | the case asserts column ORDER only, not the date control — current |
| C30508 | WIP S8-R7 | as above | the case **already says "as of" date** — current |
| C30511 | WIP S9-R3 | downloads honour *date range* → *"as of" date* | the case **already says "as of" date** — current |

**Nothing was held for a content change. No assertion, precondition or step wording was altered on
any of the 38 — only the cited specification version.**

## 3 · Route per case, and the trap that stopped the run twice

| Route | Cases | What it changes |
|---|---|---|
| **TestRail web editor**, surgical DOM-Range edit over the version number (`ui_repin_automated.mjs`) | **36** | the version number only |
| **API**, `custom_expected` only (`api_repin_automated.py` + repair form) | **2** — C30451, C30506 | the version number **+ the dated re-check sentence**, exactly as the 14 API re-pins of 2026-08-26 |

### 🔴 STOP #1 — C30451, API route

C30451's Expected Result was stored as **bare text with newline characters**, and the field's
container has `white-space: pre-wrap`, so those newlines were the tester's line breaks. `update_case`
wrapped the value in `<p>…</p>`, and **inside a `<p>` the newlines stopped acting as line breaks** —
the whole case ran together into one paragraph. The post-write gate caught it, **the run stopped on
that case**, and the body was re-stored with the same words using `<br>` line breaks. Verified in a
real browser afterwards: line for line identical to before, apart from the version. This is the same
trap recorded for C30277 in the register.

**The 14 cases API-re-pinned on 2026-08-26 were audited for this and are all clean** — every one was
already `<p>…<br>…</p>`, so no wrapper was ever added to them.

### 🔴 STOP #2 — C30460, web-editor route

C30460 was also stored as bare text — in **all three** fields. The web editor loaded it, normalised
it, and the Save re-stored **Preconditions, Steps and Expected Result** as `<p>` blocks with `\r\n`
inside, flattening all three. The script's rendered-innerText comparison caught it, **the whole run
stopped**, and all three fields were restored from `get_history_for_case` (Rule 87 — it holds the
full old value) with `<br>` line breaks and the version bumped. Verified in a real browser.

C30506, the last case in the queue, was found to be bare text too and was therefore taken through the
**API `<br>` form** rather than the editor. Clean first time.

## 4 · Final rendered sweep — all 38

`FINAL-SWEEP.json`, produced by re-reading every one of the 38 case pages in a real browser after the
last write: **38 clean, 0 problems.** Each case checked for three text containers present,
`custom_atmstatus` still `3`, the live version cited, the old version gone, no literal HTML tag
visible, no HTML entity visible, no flattened line breaks, and the `AUTOMATION:` marker present
exactly once and last.

## 5 · ⚠️ WHAT VLAD STILL NEEDS TO KNOW — the raw storage shape changed on all 38

**The rendered page is unchanged on all 38 apart from the version number. The RAW value returned by
`get_case` is not.** `STORAGE-SHAPE-CHANGES.json` records it per case, derived from
`get_history_for_case`:

* **38 of 38** — `custom_expected` moved from **plain text with `\n`** to **HTML** (`<p>`/`<br>`, or
  `<ol><li>` where the editor recognised the manual numbering).
* **18 of 38** also moved `custom_preconds` and/or `custom_steps` the same way, because **a
  web-editor Save re-saves every field on the form**, not only the one that was edited.

**This is exactly the question the register raised for Vlad on 2026-08-28 and it has not been answered
yet:** he confirmed the *formatting still looks good*, which is about the rendered page. He has not
said whether any automation reads Preconditions / Steps / Expected Result **as raw text through the
API** and splits it on newlines. **If it does, those checks need updating for these 38 cases.** They
were re-pinned on the clearance as relayed; this consequence is flagged rather than assumed harmless.

## 6 · Files

* `ui-plan.json` · `api-plan.json` — the plan, per case, with the old and live version
* `ui_repin_automated.mjs` — the web-editor route (the proven `ui_repin_batch.mjs` with the Rule-71
  gate inverted: `custom_atmstatus` must be `3`, and must still be `3` after the write)
* `api_repin_automated.py` — the API route, same five gates as `repin_write.py`
* `UI-REPINNED.jsonl` · `API-REPINNED.jsonl` · `UI-FAILED.jsonl` · `API-FAILED.jsonl` — per-case audit
  log: operation, C-id, HTTP status, verification result (Rule 50)
* `FINAL-SWEEP.json` — the post-run rendered sweep of all 38
* `STORAGE-SHAPE-CHANGES.json` — the raw-shape change per case, for Vlad

## OUTSTANDING — what I need from you

1. **Vlad:** does any automation read a case's Preconditions, Steps or Expected Result **as raw text
   through the TestRail API**? All 38 now return HTML there instead of newline-separated plain text.
2. Whether the same `<br>` normalisation should be applied deliberately to the remaining plain-text
   Report Suite cases, so this trap cannot fire again.
