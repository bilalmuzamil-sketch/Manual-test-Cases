# JOB 1 — Restoration of the 19 damaged cases · 2026-08-28

**QA lead approved the repair of all 19 on 2026-08-28, explicitly including C29955.**

**19 of 19 repaired. 19 of 19 verified clean on the rendered case page. Nothing came back wrong, so the run never had to stop.**

This was a **RESTORATION, not a rewrite.** No wording, no expectation, no typo and no assertion was changed on any of the 19. The proof is mechanical and is recorded per case in `/tmp/rspin/repair/PAYLOADS.json` → `checks.payload_words_eq_current`: for all 17 flattened cases the **visible words of the restored body are identical, in order, to the visible words of the damaged body** — only the line breaks came back.

---

## 1 · Where the original text came from

`get_history_for_case` (Rule 87) was paged in full for each case and the `custom_expected` change chain walked in date order.

- **The 17 flattened cases.** One edit per case, all on **2026-08-20**, all by TestRail user 3 (us), replaced a plain-text body whose items were separated by newlines with a single `<p>…</p>` block in which the items were joined by spaces. The `old_value` of that edit is the pre-damage text **verbatim** and is what was restored.
- **The 2 escaped-tag cases.** The damage happened on the write itself: we sent several top-level `<p>` blocks and the TestRail sanitiser kept the first and **HTML-escaped every later one into it**, so the tester read a literal `<p>…</p>`. The pre-damage text is the value we sent on that edit, which history records in full. It was restored as one block with the paragraph breaks kept as `<br>` — the single-top-level-block shape is the only one this API round-trips unchanged.

**History established the original text on all 19. No case had to be reconstructed by inference, and none had to be stopped and listed.**

---

## 2 · The one thing deliberately NOT reverted

**C29955** — after our 2026-08-20 damage, on **2026-08-27 TestRail user 7 (Ahtasham Amjad, a foreign editor)** changed its automation marker from `AUTOMATION: READY` to `AUTOMATION: AUTOMATED`. Restoring the pre-damage text verbatim would have silently undone a foreign editor's change, which **Rule 38 forbids**. The restored body therefore keeps his current marker and restores only the line structure. It is the **only post-damage content change anywhere in the 19** — every other post-damage edit was entity-encoding with a zero word-level diff.

> Two notes for the QA lead: `AUTOMATION: AUTOMATED` is **not one of the three canonical marker literals** of Rule 61 (`READY` / `READY - EXPECT FAIL (SV-xxxx)` / `HOLD - <reason>`), and it was written by someone outside our lane. It is reported, not edited.

---

## 3 · Per-case result

| C-id | Project | Class | Rendered lines before → after | Automated? | Frozen fields unchanged | Rendered-page verdict |
|---|---|---|---|---|---|---|
| [C26427](https://shopview.testrail.io/index.php?/cases/view/26427) | Custom Roles | Escaped | 2 → **2** | **YES — `Automation status = Automated`** | yes (13 of 13) | clean |
| [C26489](https://shopview.testrail.io/index.php?/cases/view/26489) | Custom Roles | Escaped | 3 → **3** | **YES — `Automation status = Automated`** | yes (13 of 13) | clean |
| [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) | Schedule | Flattened | 1 → **8** | no | yes (13 of 13) | clean |
| [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | Schedule | Flattened | 1 → **5** | no | yes (13 of 13) | clean |
| [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | Schedule | Flattened | 1 → **8** | **YES — `Automation status = Automated`** | yes (13 of 13) | clean |
| [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) | Schedule | Flattened | 1 → **8** | no | yes (13 of 13) | clean |
| [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | Schedule | Flattened | 1 → **7** | no | yes (13 of 13) | clean |
| [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | Schedule | Flattened | 1 → **7** | no | yes (13 of 13) | clean |
| [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | Schedule | Flattened | 1 → **7** | no | yes (13 of 13) | clean |
| [C30057](https://shopview.testrail.io/index.php?/cases/view/30057) | Schedule | Flattened | 1 → **6** | no | yes (13 of 13) | clean |
| [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | Schedule | Flattened | 1 → **8** | no | yes (13 of 13) | clean |
| [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | Schedule | Flattened | 1 → **5** | no | yes (13 of 13) | clean |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | Schedule | Flattened | 1 → **7** | no | yes (13 of 13) | clean |

**19 rows.**

---

## 4 · What was verified after every single write

The write sent **only `custom_expected`**. Immediately after each one, before the next case was touched, the case was re-read **both ways**:

1. **`get_case`** — the stored body matches what was sent, line for line.
2. **The rendered case page**, fetched with a real logged-in session — because `get_case` does not expose the container class that decides whether stored HTML renders or is shown as literal text.

On the rendered page each case was checked for: the Expected Result container still being `markdown fr-view`; **every restored line present, in the right order**; zero literal `&lt;p&gt;` / `&lt;br&gt;` / `&lt;li&gt;` style tags visible in **any** of the three body fields; zero visible HTML entities; the AUTOMATION marker present exactly once and **last**; the provenance line still present; and **all 13 omitted fields byte-identical** (`title`, `custom_preconds`, `custom_steps`, `refs`, `custom_atmstatus`, `custom_automation_type`, `section_id`, `priority_id`, `type_id`, `estimate`, `milestone_id`, `template_id`, `suite_id`).

**All 19 Expected Result containers were confirmed `markdown fr-view` BEFORE any write**, which is what made the API route safe here; no case needed the browser route. Per-case evidence: `REPAIRED.jsonl`.

### Rule 41 — the whole case, not the field

A separate pass re-read all three body fields of all 19 cases on the rendered page afterwards: **every case has a non-empty Preconditions, Steps and Expected Result, all three in `fr-view`, no literal tags, no visible entities, exactly one AUTOMATION marker where the case has one and it is last.** Zero cases with problems. Evidence: `WHOLE-CASE-VERIFY.json`.

---

## 5 · A correction to the damage sweep

The sweep reported *"C29955 … is the only Automated case in the damaged set. The other 18 damaged cases are all `custom_automation_type = 0`."* **That used the wrong field.** TestRail's **Automation status** field is `custom_atmstatus`, whose option `3` is literally *Automated*; `custom_automation_type` is a different field (*Automation Type*: None / E2E / Functional / Unit).

Read from the correct field, **three** of the 19 are flagged Automated: **C26427**, **C26489** and **C29955**. All three are in the register for Vlad under Rule 65. The QA lead's approval covered all 19 by name, so all three were in scope; the sweep's sentence was simply wrong and is corrected here.

---

## OUTSTANDING — what I need from you

1. **C29955's marker now reads `AUTOMATION: AUTOMATED`**, written by Ahtasham Amjad on 2026-08-27. It is not one of the three canonical literals. Do you want it left exactly as he set it, or normalised — and if normalised, to which literal?
2. **C26427 and C26489 are also flagged Automated** and were repaired under your approval of the 19. Vlad has a register row for each. Confirm nothing more is needed.
