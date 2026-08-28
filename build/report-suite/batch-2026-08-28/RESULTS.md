# Report Suite — the approved batch of 2026-08-28 (second pass)

**Authority:** the QA lead approved this batch on 2026-08-28 — the three prepared content fixes
(C30345, C30381, C30459), a formatting repair on C43547, **pin-only** restamps on the 39 Automated
cases *"if that does not break automation"*, a read-by-topic of the 9 anchorless cases, and the
C30287 typo. **No `add_case`, no `delete_case`, no run write, no Jira ticket** — the Rule-62
creation hold is still recorded as active.

Every write was verified on the **RENDERED** page immediately after its own write, and the run was
set to stop dead on the first case that came back wrong. **One did**, and the run stopped: see §3.

---

## 1 · 🔴 THE NEW TRAP THIS PASS DISCOVERED — read this before any future API write

The recorded rule was: *`markdown fr-view` renders stored HTML, so an API write is safe; a bare
`markdown` container escapes it, so an API write is visible damage.* **That rule is INCOMPLETE, and
the gap cost one damaged case today (C30277, repaired within four minutes).**

**A `markdown fr-view` container renders a BARE-TEXT body's `\n` newlines as line breaks.** Many
Report Suite cases are stored exactly that way — plain text, no tags, newline-separated. The moment
`update_case` is called on such a field TestRail **adds its own `<p>…</p>` wrapper**, and once the
body is inside that wrapper **the newlines stop breaking lines**: the whole Expected Result — items
1–5, the provenance line and the AUTOMATION marker — collapses into a single run-on paragraph on the
tester's screen. Nothing in `get_case` warns you, and the container class does not change.

**THE GATE, in full — an API write is only safe when ALL of these hold:**

1. the field renders in **`markdown fr-view`**; **and**
2. the stored value **already begins with a block element** (`<p>`, `<ol>`, `<ul>`, `<div>`, `<h1-6>`,
   `<blockquote>`, `<pre>`, `<table>`) so no wrapper is added; **and**
3. it is a **single top-level block** (the sanitiser silently nests the rest); **and**
4. `custom_atmstatus` has been re-read live (Rules 65/71); **and**
5. the reverse transform reconstructs the stored value byte-for-byte, modulo the two storage
   normalisations TestRail performs on save and neither of which a tester can see —
   **a trailing newline is appended**, and **`—` / `→` are re-encoded as `&mdash;` / `&rarr;`**.

Gate 2 is new and is now enforced in `api_edit.py`. **A bare-text body must go through the UI
editor** — or, where that is not acceptable, be re-encoded to `<p>…<br>…</p>`, which is a change to
the stored markup even though the tester sees no difference.

## 2 · What was written

| Case | Report | Route | What changed | Verified |
|---|---|---|---|---|
| **C30345** | PV | API | item 3's parenthetical corrected to the **PDF-only** scoping of live **S3-R8**, pin **10 → 11**, spec read-date → 28 Aug 2026, re-check sentence added | rendered page re-read — clean |
| **C30381** | PV | API | the specification version corrected in **both** places it is named (the tester note and the provenance line) **10 → 11**, and **both** publication dates 17 → **20 August 2026**; content confirmed current against live **S6-R7 / S6-R8 / S3-R9** | rendered page re-read — clean |
| **C30459** | WIP | **UI editor** | item 3 corrected to *"Both an 'as of' date change and a location change reload the report's rows."* (live **S2-R6**; **S7-R8** says no date range is offered at all), pin **22 → 28**, re-check sentence added | rendered page re-read — clean |
| **C30277** | SBR | API, then a **repair** | **AUTOMATED.** pin-only **22 → 24** + spec read-date. **Came back flattened, and was repaired** — see §3 | rendered page re-read after the repair; **identical to the pre-write rendering apart from the pin**, proved line by line |

Links: <https://shopview.testrail.io/index.php?/cases/view/30345> ·
<https://shopview.testrail.io/index.php?/cases/view/30381> ·
<https://shopview.testrail.io/index.php?/cases/view/30459> ·
<https://shopview.testrail.io/index.php?/cases/view/30277>

**C30459's UI save had the documented side effect:** the stored markup of **all three** fields was
re-encoded from plain markdown to `<ol><li>…` HTML, and all three containers flipped from the
escaping bare `markdown` to `markdown fr-view`. **The words a tester reads did not change** — that
was verified field by field against the pre-write rendering — and the case is no longer fragile.

## 3 · The one case that came back wrong, and what was done about it

**C30277 (Automated, SBR).** Its Expected Result was stored as bare text with newlines. The pin-only
API write added the `<p>` wrapper described in §1 and the rendered Expected Result **collapsed into a
single paragraph** — items 1–5, the provenance line and the AUTOMATION marker all on one line.

* **The run stopped immediately**, as instructed; the remaining three planned writes were never sent.
* The case was **repaired in the same minute** by re-sending the original body with its newlines
  converted to `<br>` and the pin applied: `<p>…<br>…</p>`.
* **Proof of the repair:** the rendered Expected Result was compared line by line against the
  rendered text captured **before** the write. It is **identical apart from the pin** (`version 22 …
  read on 17 August 2026` → `version 24 … read on 28 August 2026`). Evidence:
  `evidence/c30277-repair.json`, `evidence/job3-verify.json`,
  `evidence/snapshot-automated-39-before.json`.
* `custom_atmstatus` is **still 3**; title, `refs`, section, priority, type, estimate, milestone,
  template and `custom_automation_type` are all unchanged; preconditions and steps were never sent
  and are byte-identical.
* **Rule 65: Vlad must be told.** The register entry says explicitly that the stored markup of
  `custom_expected` was re-encoded (`\n` → `<br>`, `<p>` wrapper) as part of the repair, that no word
  changed, and that the rendering is identical.

## 4 · Why the other 38 Automated cases were NOT written — the split

The approval was **"pin-only … provenance version/date only — no change to title, preconditions,
steps or any expectation wording"**, conditional on **"if that does not break automation"**.

All 39 were re-read live this pass (`evidence/snapshot-automated-39-before.json`): **all 39 are still
`custom_atmstatus = 3`**, 4 render `markdown fr-view` and 35 render the escaping bare `markdown`.

| Route available | Cases | Why it is NOT covered by "pin-only" |
|---|---|---|
| **API** | C30451, C30460, C30506 | Their Expected Result is **bare text**, so the API adds a `<p>` wrapper and flattens it (§1). Repairing that flattening means re-encoding the stored markup — the same change C30277 needed. That is a change to the stored expectation body, not "the version/date only" |
| **UI editor** | the 35 escaping-container cases | Proved live on C30459 today: **a UI save re-encodes the stored markup of ALL THREE fields**, including **preconditions and steps**. The approval explicitly excludes changing preconditions and steps |

**So there is no route that re-pins an Automated case here while changing nothing but the version and
date.** Every available route rewrites stored markup that an automated check may be reading. Rather
than guess, **38 of the 39 are held** and are listed in `AUTOMATED-PIN-ONLY-SPLIT.md`.

**Done: 1 (C30277, and only because it was already written and had to be made right).
Held: 38.**

## 5 · Files

| File | What it is |
|---|---|
| `dossier2.py` | read-only live dossier — atm status, **rendered** container per field, block count, cited versions, full bodies |
| `anchor.py` | prints the LIVE definition of a requirement anchor from the specs already fetched on 2026-08-26 (no re-fetch) |
| `api_edit.py` | the API write path, with the five gates of §1 and a rendered-page verification after every single write |
| `ui_edit.mjs` | the TestRail web-editor write path — surgical DOM-Range edits, navigation poll, no-cache fresh navigation per case |
| `verify_case.py` | post-write verification against the pre-write snapshot |
| `view_probe.mjs` | read-only: what a tester actually sees, line by line, plus a screenshot |
| `evidence/` | every plan, every result record, and the pre-write snapshot of all 39 Automated cases |

## OUTSTANDING — what I need from you

1. **The 38 held Automated cases (§4).** Every route rewrites stored markup. **Ask Vlad whether his
   automation reads the case body through the API** — if it does not, the UI route clears all 35 in
   one run and the three bare-text ones can go the C30277 way. If it does, they stay pinned at the
   old version until he says otherwise.
2. **C30460 carries a non-canonical AUTOMATION marker** — `AUTOMATION: Not available on Build to test
   Yet - Last checked 8/17/2026`, where Rule 61 allows only `READY` / `READY - EXPECT FAIL (SV-xxxx)`
   / `HOLD - <reason>`. Pre-existing, not touched. Correct it in a later pass?
3. **WIP v28 §7 gained two empty-state messages that no case covers** (SV-9452, 2026-08-24): *"No
   snapshot is available for this date."* and *"No jobs match this filter on this date…"*. C30460
   covers only the first message. **Rule 62's creation hold is recorded as active — has it lifted?**
