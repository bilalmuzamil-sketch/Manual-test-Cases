# Report Suite — MECHANICAL format check (tester rendering) — 2026-08-26

Run date **2026-08-26** (folder keeps the 2026-08-21 refresh name given in the order).
Tool: `build/testing-tools/check_tester_readiness.py` (unchanged) driven over the whole
group by `build/testing-tools/run_format_check_group.py`. **READ-ONLY — `get_sections` /
`get_cases` / `get_case` only. NO TestRail write was made (Rule 6).**

## 1 · Scope actually checked — with the paging proof

| Quantity | Value |
|---|---|
| Sections in the estate, **fully paged** (`get_sections` limit 250, offset walked) | **684** |
| Sections under group **4281 "Reports Suite"** (parent walked to the root) | **96** |
| Cases in the estate, **fully paged** (`get_cases` limit 250, offset walked) | **4,556** |
| Cases under group 4281 | **524** |
| **OURS (`created_by = 3`) — SCORED** | **509 / 509 (100%, no sampling, Rule 50)** |
| Foreign (Rule 38 — excluded, untouched) | **15** |

**Paging matters:** an unpaged `get_sections` returns 250 rows and the group's deeper
sections are silently missing. 684 > 250 and 4,556 > 250, so both calls were paged.

509 ours matches the CLAUDE.md §3 figure of **509** exactly.
Foreign C-ids excluded: C38919, C38920, C38921, C38922, C38923, C43567, C43568, C43569,
C43570, C43571, C43572, C43573, C43980, C43981, C44505.

## 2 · Verdict

**PASSED 443 · FAILED 66** (a case fails if it trips any one check).

| # | Failure type | Cases | Would a tester see something wrong? |
|---|---|---|---|
| 2 | `raw-list-markup` — raw `<ol>/<li>/<p>/<hr>` stored in a **markdown** field | **50** | ~~YES — the tags are shown literally~~ → **NO. FALSE POSITIVE, disproven by observation 2026-08-26 — the tags render as a proper list. See `GROUP-D-VERDICT.md`. LEAVE THESE ALONE.** |
| 3 | `no-blank-line-before-marker` — AUTOMATION marker not separated | **46** | No (machine-findability / convention) — and **not worth a write**: an API write is what damages a case's rendering (`APP-ACTIONS-PLAYBOOK.md` §J) |
| 3 | `no-automation-marker` — no AUTOMATION line at all | **13** | No (blocks the automation arithmetic gate) |
| 5 | `title-too-long` (>80 chars) | **3** | Minor — truncation on the case page |
| 3 | `marker-not-last` | **2** | No |
| 7 | `jargon:http_status` | **1** | Yes — jargon in tester-facing text |

**45 of the 46** `no-blank-line-before-marker` cases are the SAME cases as the raw-markup
50 — the marker sits inside a `<p>` tag, so one repair fixes both.

### ~~Why the raw markup really does render badly~~ — **SUPERSEDED 2026-08-26, THIS WAS WRONG**

> **🔴 CORRECTION — 2026-08-26. The claim below is DISPROVEN BY OBSERVATION. Do not act on it.**
> The case-view pages for C30124, C30143 and C30151 were logged into and read this day: all
> three render as **proper numbered lists** and **no tag text is visible to a tester**. The
> field's configured `format: markdown` does NOT decide the rendering — the container TestRail
> emits does: `<div class="markdown fr-view">` prints the stored value RAW (HTML renders),
> `<div class="markdown">` escapes it. These cases are `fr-view`. The `&lt;ol&gt;` entities a
> whole-page text search finds are in the page's hidden JSON editor payload, not in the visible
> field blocks — that is the trap this paragraph fell into.
> **The `raw-list-markup` count of 50 and the `no-blank-line-before-marker` count of 46 are NOT
> tester-visible defects, and the 96 cases must be LEFT ALONE.** Full evidence, screenshot and
> verdict: **`GROUP-D-VERDICT.md`** in this folder. The superseded text is kept below, dated and
> marked, per the never-silently-rewrite rule.

*(Superseded text, 2026-08-26 — retained for the record, NOT current guidance:)*
`get_case_fields` reports `custom_preconds`, `custom_steps` and `custom_expected` all have
**`format: markdown`**. A markdown field does not render stored HTML — it shows it. Example
(C30124, steps field, stored verbatim):

    <ol><li>Click the chevron on an asset row.</li><li>Read the invoice detail rows…</li></ol>

The tester reads the angle-bracket tags as text. This is the same defect already recorded
for Filters in the tool's own header. **Not visually re-confirmed in the TestRail UI this
pass** (no UI session was opened) — the field-format evidence is the basis for the call.

## 3 · The failing cases, by type (capped at 25 C-ids listed; totals stated)

Link form: `https://shopview.testrail.io/index.php?/cases/view/<id>` (Rule 8; every row of
RESULTS.csv carries the full link).

- **raw-list-markup** — **50 case(s)** — C30124, C30143, C30151, C30154, C30155, C30157, C30160, C30162, C30172, C30195, C30206, C30208, C30213, C30218, C30226, C30229, C30230, C30231, C30233, C30234, C30237, C30238, C30241, C30265, C30277 … (+25 more — the full list is in RESULTS.csv)
- **no-blank-line-before-marker** — **46 case(s)** — C30124, C30143, C30151, C30154, C30155, C30157, C30160, C30172, C30195, C30206, C30208, C30213, C30218, C30226, C30229, C30230, C30231, C30233, C30234, C30237, C30238, C30241, C30265, C30325, C30368 … (+21 more — the full list is in RESULTS.csv)
- **no-automation-marker** — **13 case(s)** — C30221, C30346, C30353, C30428, C30430, C30432, C30433, C30460, C30462, C30508, C30518, C30535, C30563
- **title-too-long** — **3 case(s)** — C30226, C30230, C30470 (81, 82 and 87 characters)
- **marker-not-last** — **2 case(s)** — C30162, C30287
- **jargon:http_status** — **1 case(s)** — C43546

Most affected sections: SBR — Inv. Hrs & Calculations (6), WIP — Earned & Remaining (6),
SBR — Exports (4), TU — Deep Links (4).

## 4 · FIX PLAN — PREPARED ONLY, STOPPED AT THE BUTTON (Rule 6 / Rule 62)

**No write has been made and none will be without the QA lead's explicit go-ahead.**

| Group | Cases | Repair path | Risk |
|---|---|---|---|
| A · raw HTML in markdown fields | 50 | 🔴 **CANCELLED 2026-08-26 — DO NOT EXECUTE.** The defect does not exist (`GROUP-D-VERDICT.md`), and this repair path is itself what damages a case: an API write always adds a `<p>` wrapper (`APP-ACTIONS-PLAYBOOK.md` §J). ~~API `update_case`: convert `<ol><li>x</li></ol>` → numbered plain lines, `<p>`/`<hr>` → blank lines, `<br>` → newline…~~ | Would have broken 50 working cases |
| B · marker spacing (the 1 case not in A) | 1 | API: insert the blank line before the marker | Low |
| C · missing AUTOMATION marker | 13 | **NOT a formatting fix** — needs a judgement call READY / EXPECT-FAIL / HOLD per case. Author decision, then one API write each | Medium — changes the automation arithmetic gate |
| D · titles > 80 chars | 3 | API title shorten, meaning preserved; titles are tester-facing so the QA lead should approve the wording | Low |
| E · HTTP-status jargon (C43546) | 1 | API: replace the status code with plain words | Low |

The UI "." trick (`build/APP-ACTIONS-PLAYBOOK.md` §J) is **not needed here** — it addresses
a different symptom (a field TestRail refuses to store as blank). Group A is a straight API
body rewrite. **Rule 71/65 gate: before executing, re-read each target's `custom_automation_type`
— any case TestRail flags as Automated is held and Vlad is told.**

## 5 · HONESTY — what this run is NOT (Rule 84, Rule 12)

This is the **MECHANICAL SUBSET ONLY**. It does **not** cover:

- **Check 6** — the C-id appearing in every deliverable (a property of the deliverable).
- **Check 8** — preconditions reachable and steps executable in order (**human cold read**).
- **Check 9** — a plain "what needs to be done" on every non-passed row (**human cold read**).
- Plain-language wording quality beyond the jargon regexes (Rules 7/9).

**A clean run is "the mechanical subset passed", NEVER "the tester-readiness gate passed".**
443 mechanically-clean cases have **not** been proved tester-ready.

## OUTSTANDING — what I need from you

1. **Go-ahead to execute fix groups A, B, D, E** (54 `update_case` writes, 0 add, 0 delete,
   0 run writes). Nothing is written until you say so.
2. **A decision on group C** — the 13 markerless cases need READY / EXPECT-FAIL / HOLD
   assigned; that is a judgement call, not a format repair.
3. **Whether to book the human cold read** (checks 6, 8, 9) for the 443 mechanically-clean
   cases — without it, "tester-ready" cannot be claimed.
4. **The 15 foreign cases inside group 4281** remain hands-off and unresolved (Rule 38).
