# GROUP D — VERDICT BY OBSERVATION: the premise is DISPROVEN. LEAVE THE 96 CASES ALONE.

**Date:** 2026-08-26 · **Method:** direct observation of the served TestRail case-view page
(Rule 12 — observed, not inferred) · **Writes made to any of the 96 cases: NONE.**

---

## 1 · The question this settles

Two earlier workers contradicted each other:

- **Worker A:** `get_case_fields` reports `custom_preconds` / `custom_steps` /
  `custom_expected` all have `format: markdown`. A markdown field does not render stored
  HTML, it shows it. Therefore the 50 `raw-list-markup` cases (and the 46
  `no-blank-line-before-marker` cases that overlap them — **96 rows in total**) show
  `<ol>` and `<li>` as literal text to a tester and must be rewritten.
- **Worker B:** the HTML is TestRail's own editor markup and renders correctly; rewriting
  would damage working cases.

**Worker B is right.** Worker A's reasoning was sound but its premise — that the configured
field format decides the rendering — is false.

## 2 · What was actually done

Playwright could not be used: **this container resets chromium's outbound TCP for every
external host**, with and without the agent proxy (`https://example.com/` fails identically),
while `curl`/Python reach TestRail fine. So the live browser session was replaced with a
method that observes the same thing:

1. Logged in to the TestRail **UI** (not the API) as `bilal.muzamil@shopview.com`, keeping
   the `tr_session` cookie.
2. Downloaded the **case VIEW page** — `index.php?/cases/view/<id>`, the page a tester reads,
   **not** the edit page — for **C30124, C30143, C30151** (three of the Group D cases named in
   `RESULTS.csv`), plus **C30287** and **C30518** for contrast.
3. Rendered the exact field markup those pages served, in chromium, and screenshotted it.

**Evidence in the repo:**

| Artefact | Path |
|---|---|
| Screenshot of all five cases as served | `build/report-suite/format-check-2026-08-21/evidence-2026-08-26/groupD-render.png` |
| The served markup itself, re-rendered | `build/report-suite/format-check-2026-08-21/evidence-2026-08-26/groupD-render.html` |
| Machine reading of every view page | `build/report-suite/writes2-2026-08-26/logs/job3-viewpage-observation.json` |
| The fetch/observe script | `build/report-suite/writes2-2026-08-26/job3_view_page.py` |
| The blocked Playwright attempt, kept for the record | `build/report-suite/writes2-2026-08-26/job3_ui_look.mjs` |

## 3 · The mechanism — why the field format is not the answer

TestRail emits each text field into **one of two containers**, and the container decides
everything:

| Container in the served page | What TestRail does with the stored value |
|---|---|
| `<div class="markdown fr-view">` | Emits it **RAW** — stored HTML renders as HTML |
| `<div class="markdown">` | Runs it through the **markdown renderer**, which **ESCAPES** every HTML tag, so a stored tag is printed to the tester as literal text |

Which container a case gets is a **per-case property that the API does not expose** — it is not
in `get_case`, and it is not derived from the value's content (a value byte-identical in form
renders raw on one case and escaped on another). It can only be read off the served page.

## 4 · Per-case observation — what a tester actually sees

| Case | Container | Do the steps render as a proper numbered list? | Does the tester literally see `<ol>` / `<li>` text? |
|---|---|---|---|
| **C30124** [open](https://shopview.testrail.io/index.php?/cases/view/30124) | `markdown fr-view` | **YES** — Preconditions, Steps and Expected all render as clean numbered lists ("1. Click the chevron on an asset row." / "2. Read the invoice detail rows that appear.") | **NO** — no tag text anywhere on the page |
| **C30143** [open](https://shopview.testrail.io/index.php?/cases/view/30143) | `markdown fr-view` | **YES** — proper numbered lists in all three fields | **NO** |
| **C30151** [open](https://shopview.testrail.io/index.php?/cases/view/30151) | `markdown fr-view` | **YES** — including the six-item Expected list, all correctly numbered | **NO** |
| C30287 (contrast — HTML body) [open](https://shopview.testrail.io/index.php?/cases/view/30287) | `markdown fr-view` | **YES** | **NO** |
| C30518 (contrast — plain-text body) [open](https://shopview.testrail.io/index.php?/cases/view/30518) | `markdown` | Partly — see §6 | **YES** — a literal `<p>` and `</p>` are visible |

The `&lt;ol&gt;` / `&lt;li&gt;` entities that a naive whole-page text search finds on C30124 and
friends are **inside the page's embedded JSON editor payload**
(`&quot;custom_preconds&quot;:&quot;&lt;ol&gt;&lt;li&gt;…`), which is never displayed. They are not
in the visible field blocks. That is the trap Worker A's static check fell into.

## 5 · VERDICT

> **The premise is disproven. The `<ol>`/`<li>` markup in those cases is TestRail's own editor
> markup, served raw into an `fr-view` container, and it renders as a proper numbered list. A
> tester does NOT see the tags.**
>
> **NO REWRITE IS NEEDED. The 96 cases must be LEFT ALONE.** Rewriting them would replace
> working, correctly-rendering bodies with plain text — and, per §6, an API write is exactly
> what breaks a case's rendering. It would have converted a non-problem into 96 real ones.

The two Group D findings must therefore be **retired, not fixed**:

- **`raw-list-markup` (50 cases)** — **NOT A DEFECT.** Retire the check, or teach it to read the
  container from the view page instead of the field's configured format.
- **`no-blank-line-before-marker` (46 cases)** — **NOT A TESTER-VISIBLE DEFECT.** The marker sits
  inside the `<p>` block; the rendered page shows it on its own line (visible in the screenshot
  for all of C30124, C30143, C30151, C30287). It remains machine-findable. Convention only, and
  not worth a write given §6.

## 6 · The finding that came out of this — and why it makes "leave them alone" urgent

While observing, the opposite defect was proven: **`add_case` / `update_case` ALWAYS wrap a value
that does not already begin with a block-level tag in `<p>…</p>`.** On an `fr-view` case that
wrapper is invisible. On a `markdown`-container case it is **escaped and shown to the tester as
literal `<p>` text**.

**72 Report Suite cases are in exactly that state right now** — 71 written by the
2026-08-26 write pass and 1 (C30518) by the 2026-08-26 Job 1 rewrite. Causation is proven
against the pre-write snapshot taken the same morning: **all 72 contained no HTML tag before
those writes.** Full write-up and the C-id list:
**`build/APP-ACTIONS-PLAYBOOK.md` §J** and
`build/report-suite/writes2-2026-08-26/logs/job4-damaged-cids.txt`.

**This is the reason the 96-case rewrite must not go ahead**: the proposed repair path is the
very operation that causes the damage.

## OUTSTANDING — what I need from you

1. **Confirm the 96 cases are closed as "no action".** They are currently untouched.
2. **Decide what to do about the 72 damaged cases** (§6). They cannot be repaired through the
   API — any API write re-adds the wrapper. They need the TestRail web editor.
3. **Should `build/testing-tools/check_tester_readiness.py` be corrected** so it stops reporting
   `raw-list-markup` as a defect and instead flags the real one?
