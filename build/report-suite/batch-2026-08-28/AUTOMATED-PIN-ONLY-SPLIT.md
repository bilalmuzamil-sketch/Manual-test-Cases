# The 39 Automated Report Suite cases — pin-only split — 2026-08-28

**Rule 71** holds any case TestRail flags Automated (`custom_atmstatus = 3`). The QA lead approved,
on 2026-08-28, **pin-only** restamps on these 39 — *"provenance version/date only — no change to
title, preconditions, steps or any expectation wording"* — conditional on **"if that does not break
automation"**, with **any case needing a content change NOT approved**.

**All 39 were re-read live this pass. All 39 are still `custom_atmstatus = 3`.** The pre-write
snapshot of every one of them, bodies included, is `evidence/snapshot-automated-39-before.json`.

## The outcome: 1 done, 38 held

**There is no route that re-pins these cases while changing only the version and date.** Both
available routes rewrite stored markup that an automated check may be reading:

* **The API** adds its own `<p>…</p>` wrapper to a field stored as bare text, and inside that wrapper
  the newlines stop rendering as line breaks — the whole Expected Result runs together into one
  paragraph on the tester's screen. **Proved live on C30277 today, and repaired.**
* **The TestRail web editor** re-saves **every** field on the form, so preconditions and steps get
  re-stored as HTML lists — which the approval explicitly excludes.

So only **C30277** was re-pinned, and only because it had already been written when the flattening
was spotted and had to be made right. **The remaining 38 are held**, listed below with the pin each
still needs.

**What would release them:** an answer from Vlad to one question — **does any automation read a case's
Preconditions, Steps or Expected Results as raw text through the TestRail API?** If not, all 38 clear
in a single run. The ask is filed in
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` under the 2026-08-28
second-pass heading.

## The 38 still held

| C-id | Report | Pin now → needs | Expected Result renders in | Stored as | Why no route is "pin-only" | Link |
|---|---|---|---|---|---|---|
| C30217 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30217> |
| C30221 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30221> |
| C30247 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30247> |
| C30255 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30255> |
| C30256 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30256> |
| C30262 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30262> |
| C30271 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30271> |
| C30272 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30272> |
| C30274 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30274> |
| C30275 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30275> |
| C30276 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30276> |
| C30293 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30293> |
| C30314 | SBR | 22 → **24** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30314> |
| C30322 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30322> |
| C30326 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30326> |
| C30328 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30328> |
| C30333 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30333> |
| C30338 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30338> |
| C30346 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30346> |
| C30351 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30351> |
| C30352 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30352> |
| C30353 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30353> |
| C30354 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30354> |
| C30375 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30375> |
| C30377 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30377> |
| C30390 | PV | 10 → **11** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30390> |
| C30451 | WIP | 22 → **28** | `markdown fr-view` | bare text | the API would flatten its line breaks (the C30277 fault); repairing that re-stores the body as HTML | <https://shopview.testrail.io/index.php?/cases/view/30451> |
| C30452 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30452> |
| C30460 | WIP | 21 → **28** | `markdown fr-view` | bare text | the API would flatten its line breaks (the C30277 fault); repairing that re-stores the body as HTML | <https://shopview.testrail.io/index.php?/cases/view/30460> |
| C30462 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30462> |
| C30498 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30498> |
| C30506 | WIP | 22 → **28** | `markdown fr-view` | bare text | the API would flatten its line breaks (the C30277 fault); repairing that re-stores the body as HTML | <https://shopview.testrail.io/index.php?/cases/view/30506> |
| C30507 | WIP | 22 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30507> |
| C30508 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30508> |
| C30510 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30510> |
| C30511 | WIP | 22 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30511> |
| C30515 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30515> |
| C30527 | WIP | 21 → **28** | `markdown` | bare text | the escaping container forces the web editor, and a web-editor save also re-stores Preconditions and Steps | <https://shopview.testrail.io/index.php?/cases/view/30527> |

**38 cases held. 1 written (C30277). 38 + 1 = 39 — nothing is unaccounted for.**

## Also found while reading these, and NOT acted on

* **C30460 carries a non-canonical AUTOMATION marker** — `AUTOMATION: Not available on Build to test
  Yet - Last checked 8/17/2026`. Rule 61 allows exactly one of `AUTOMATION: READY`,
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD - <reason>`. Pre-existing; not
  touched, because it is an Automated case and this is not a pin.
* **WIP v28 §7 now carries THREE empty-state messages, and only one of them has a test case.** The
  2026-08-24 correction (SV-9452) split the single empty-state row into the standard *"Empty bays,
  endless possibilities. Get Going!"*, *"No snapshot is available for this date."* (S7-R8a) and
  *"No jobs match this filter on this date…"*. C30460 covers only the first. The other two need
  cases — and **Rule 62's creation hold is recorded as active**, so nothing was created.

## OUTSTANDING — what I need from you

1. **Vlad's answer to the raw-text question above** — it releases all 38 at once, or names the ones
   to leave alone.
2. **C30460's non-canonical AUTOMATION marker** — correct it in a later pass?
3. **The two uncovered WIP empty-state messages** — has the Rule-62 creation hold lifted?
