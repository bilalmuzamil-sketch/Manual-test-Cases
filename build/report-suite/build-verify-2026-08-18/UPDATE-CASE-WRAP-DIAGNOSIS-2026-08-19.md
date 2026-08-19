# DIAGNOSIS — `update_case` HTML-wraps the markdown text fields (2026-08-19)

**Question put:** a sweep worker found `update_case` now HTML-wrapping the markdown fields
(`custom_expected` / `custom_preconds` / `custom_steps`) — which this project renders literally to
testers — while Schedule batch-A/B/C writes minutes earlier byte-verified clean. Is this (i) a
TestRail-side change (all writes wrap regardless of method → real block, STOP) or (ii) a
method/payload difference between workers (→ give the exact working method)?

**Answer: (i) — TESTRAIL-SIDE. Every `update_case` write now renders the markdown fields to HTML and
STORES the HTML, regardless of content, field-count, or client. There is NO write method that stores
the house plain-text form while this condition is active. This is a real block.**

All diagnostics were run against **C30133 only** (the pre-approved safe target — it already needed a
formatting demark repair). 0 other case writes, 0 Jira, 0 staging, runs 359/357 untouched.

---

## 1. Field formats (`get_case_fields`, HTTP 200)
All three tester-facing text fields are **markdown**, type_id 3 (text), global config:

| field | id | label | format |
|---|---|---|---|
| `custom_preconds` | 1 | Preconditions | **markdown** |
| `custom_steps` | 2 | Steps | **markdown** |
| `custom_expected` | 3 | Expected Result | **markdown** |

No per-request/per-field rendering override exists — `format` is a global field config, not a
payload parameter.

## 2. Wrapped-vs-clean byte evidence (read-only)
| case | last written | `<p>` | `&mdash;` | state |
|---|---|---|---|---|
| **C30016** (Schedule batch-C) | 2026-08-19 08:30:28 UTC | no | no | **CLEAN** |
| **C30096** (SBC 08-18 pass) | 2026-08-18 19:57:14 UTC | no | no | **CLEAN** |
| **C30124** (earlier pass) | 2026-08-18 19:47:07 UTC | no | no | **CLEAN** |
| **C30133** (SBC sweep canary) | 2026-08-19 10:25:27 UTC | **yes** | **yes** | **WRAPPED** |

C30133 stored form (single-paragraph markdown render, internal `\n` preserved, NOT `<ol>/<li>`):
`'<p>1. Every row type &mdash; customer, asset, invoice, totals &mdash; renders the same columns …</p>\n'`

## 3. Controlled experiment on C30133 — EVERY variant wraps
Written via the Python `tr_client` (the **identical** helper/transport Schedule batch-C used clean):
`Content-Type: application/json`, JSON body, `POST index.php?/api/v2/update_case/30133`.

| variant | payload | update | stored result |
|---|---|---|---|
| **A** | all 3 fields (clean) + `refs` — **exact Schedule-C method** | 200 | **WRAPPED** (`<p>`+`&mdash;`) |
| **B** | single field, trivial `"plain test line"` | 200 | `"<p>plain test line</p>\n"` |
| **C** | single field, `"1. first\n2. second"` | 200 | **WRAPPED** |
| **D** | all 3 fields, hyphens (no em-dash) | 200 | **WRAPPED** all three |
| **E** | pre-wrapped `"<p>already wrapped</p>"` | 200 | `"<p>already wrapped</p>\n"` (idempotent, no double-wrap) |
| entities | `'a & b < c > d "e"'` | 200 | `'<p>a &amp; b &lt; c &gt; d "e"</p>\n'` |

Observations:
- **A is the crux.** The exact method (Python client, all three text fields sent explicitly) that
  byte-verified CLEAN on 64 Schedule batch-C cases at ~08:30 UTC now WRAPS at ~10:45 UTC. So this is
  **not** the send-all-three-vs-partial method difference of playbook §J normalisation #3.
- Even a **trivial single plain word** wraps → no content form avoids `<p>`.
- Sending **already-HTML** round-trips idempotently (E) — markdown render passes existing HTML
  through unchanged. This is the *only* verbatim round-trip, and it stores HTML (the raw-markup
  defect), so it is not a usable "clean" method.
- `&`, `<`, `>` are HTML-entity-escaped on write → confirms a **markdown → HTML render**, not a stray
  `<p>` wrapper.

## 4. It is render-on-WRITE (stored), not render-on-READ
Decisive: cases **not written today** (C30016, C30096, C30124) read back **clean** right now via the
same `get_case`. If the wrap were applied at read/serialization time, those would wrap too. They do
not. **⇒ the HTML is written into storage on `update_case`; `get_case` returns it faithfully.** This
matters: the corrupted value is the STORED value, which this project renders literally to the manual
tester.

## 5. Timing — a server-side change inside a 115-minute window today
| event | UTC |
|---|---|
| **Last known CLEAN write** — C30016, Schedule batch-C | **2026-08-19 08:30:28** |
| **First known WRAPPED write** — C30133, SBC sweep canary | **2026-08-19 10:25:27** |

The behaviour changed **between 08:30 and 10:25 UTC on 2026-08-19** (window 115 min). Same client,
same transport, same account, same project 1 / suite 1 — only the day's hour differs. Consistent with
a TestRail SaaS-side deploy/setting change (TestRail is hosted `shopview.testrail.io`; we do not
control its version).

## 6. Conclusion
**(i) TestRail-side block, confirmed.** `update_case` now renders the three markdown fields to HTML
and stores the HTML on every write; no payload shape, content, or field-count avoids it, and it is
not the omitted-field normalisation (#3). **Any pass that re-stamps or edits case text right now will
store the raw-markup defect this project shows literally to testers.**

### Guidance for the sweep + Filters (and every worker)
- **DO NOT run text-field `update_case` writes while this condition is active** — the SBC sweep's
  decision to HALT was correct (Rule 50).
- **This is a genuine hazard, not a method error** — do not "fix your payload" and retry; there is
  nothing to fix in the payload.
- **`refs`-only intent is still unsafe** — you must send the three text fields on every `update_case`
  (normalisation #3), and they will wrap. So even a refs/marker-only re-stamp corrupts the body.
- **Re-test cheaply before any future write batch:** write a throwaway string to C30133 (the standing
  canary) and re-GET; if it comes back without `<p>`, the block has lifted. When it lifts, run
  `build/markup-regression-2026-08-10/demark.py` + a census to repair any cases wrapped during the
  block (C30133 first).

## 7. C30133 final state
- Content **restored word-for-word** (all three fields + `refs`; `demark.words()` sequence identical
  to the intended clean payload — 0 words changed). Snapshot: `/tmp/c30133-diag/FINAL.json`.
- It is **stored `<p>`-wrapped** because every write wraps while the block is active — same state
  class the SBC sweep left it in. **Needs a formatting-only demark repair once `update_case` stores
  clean markdown again.** No further write can improve it now.
- `refs` intact: `SV-8605 (SBC spec v20 2026-08-17 Story 7 S7-R8; S7-R9; S7-R10; S7-R15; S7-R16)`.

**Scope of writes this diagnostic:** C30133 only (6 experiment writes + 1 restore). 0 other cases,
0 add/delete/section/run/result, 0 Jira, 0 staging.
