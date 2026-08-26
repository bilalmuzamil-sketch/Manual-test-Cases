# TestRail render damage 2026-08-26 — scope, cause, and a PROVEN repair

**Date:** 2026-08-26 · **Method:** live API re-GET of every case + served case-view pages +
screenshots of the rendered page (Rule 12 — observed, never inferred).
**Writes made:** two throwaway cases created and deleted; **one real case repaired (C30197)**.
Nothing else was touched.

---

## 1 · Scope — exactly 72 cases

| Fact | Value |
|---|---|
| Cases damaged | **72** (71 from the 12:27–12:43 bulk pass + C30518 from the 13:29 pass) |
| Automated (`custom_atmstatus = 3`) | **1** — **C30518** |
| Damaged in `custom_expected` only | 68 |
| Damaged in `preconds` + `steps` + `expected` | 4 — C30482, C30525, C43828, C43830 |
| Pre-existing (not our fault) | **0** |
| Full list | `AFFECTED-CASES.md` (C-id + link + fields + title) |

Pre-damage source of truth: `build/report-suite/source-verify-2026-08-26/data/live-cases.json`,
captured **11:53**, before the first write. All 72 are present in it.

## 2 · What a tester actually reads — three before/after excerpts

**C30197** (`custom_expected`) — https://shopview.testrail.io/index.php?/cases/view/30197

```
BEFORE (11:53 snapshot, stored):
  '1. The full "Sales By Representative" label renders without crowding...\n2. The label is not
   shortened to fit — the fix is the entry\'s horizontal padding, not the name.\n\n---\n...'

AFTER  (live, stored):
  '<p>1. The full "Sales By Representative" label renders without crowding...\n2. The label is not
   shortened to fit &mdash; the fix is the entry\'s horizontal padding, not the name.\n\n---\n...</p>\n'
```

Byte deltas: leading `<p>` added; trailing `</p>\n` added; every non-ASCII character
entity-encoded (`—` becomes `&mdash;`). 465 -> 634 bytes. **The tester's page prints `<p>` on the
first line and `</p>` on the last** — screenshot `build/report-suite/damage-2026-08-26/evidence/C30197-DAMAGED-before.png` (pre-repair).

**C30518** (`custom_expected`, **AUTOMATED**) — https://shopview.testrail.io/index.php?/cases/view/30518
Same shape: 891 -> 1091 bytes, `<p>` ... `</p>\n` wrapper, `&mdash;` / `&rsquo;` entities.
Literal tags visible to a tester: `<p>`, `</p>`.

**C43828** (`preconds` + `steps` + `expected`) — https://shopview.testrail.io/index.php?/cases/view/43828
Worst class: the wrapper **plus** every newline replaced by a literal `<br>` (written by
`build/report-suite/writes-2026-08-26/htmlfmt.py::block()`), so the tester reads
`<p>`, `<br>`, `</p>` inline through the whole field. Three fields, not one.

## 3 · Root cause — the earlier diagnosis was only half right

Two facts, both proven on a throwaway case this pass:

1. **`update_case` (and `add_case`) ALWAYS re-render the field you send.** Sending pure plain text
   with no tags anywhere came back stored as `<p>...</p>\n` with `&mdash;` entities. There is **no
   payload that makes the API store an unwrapped value** — see section 4.
2. **The wrapper is only *visible* on cases whose case-view page uses the escaping container.**
   TestRail serves each text field in either `<div class="markdown fr-view">` (renders stored HTML)
   or `<div class="markdown">` (markdown-escapes it, so tags print as text). The scan of the 185
   written cases splits **113 `fr-view` / 72 `markdown`** — and that split is **exactly** the
   damaged set.

The correlation is perfect and explains everything: of the 185, **every case that already held real
HTML in the 11:53 snapshot renders `fr-view` (113 + 6); every case that was plain text is now
escaped (72)**. The container is a **per-case rich-text flag that `get_case` does not expose**; a
plain-text case had it OFF, and the API write forced HTML into it.

So the "always send all four fields" rule was not the cause — **sending the field at all was.**
Omitting a field preserves it byte-identically (job 4); sending it re-renders it.

## 4 · Repair strategies tested — the API cannot do it, the UI can

Throwaway case **C45166** (`ZZAUTOTEST`, section 237, `custom_atmstatus: 1`), damage reproduced with
the exact `htmlfmt.block()` output, then each strategy tried and the re-GET byte-compared.
**Created and DELETED — deletion confirmed (`delete_case` HTTP 200, re-GET HTTP 400).**
A second throwaway **C45167** was used for the UI test and is also deleted (re-GET HTTP 400).

| # | Strategy | Result |
|---|---|---|
| a | Send the ORIGINAL pre-damage plain text from the snapshot | **FAILS** — stored back as `<p>...</p>\n` |
| b | HTML-unescape the live value once, send that | **FAILS** — wrapper re-added |
| c | Strip `<p>`/`</p>`, `<br>` to `\n`, unescape, send | **FAILS** — wrapper re-added |
| d | Send as a single top-level block, no tags, `\n` only | **FAILS** — wrapper re-added |
| e | Send with CRLF line endings | **FAILS** — wrapper re-added |
| **f** | **Re-type the field in the TestRail UI editor and Save** | **WORKS** — see section 5 |

Strategy (c) was also run against the real case C30197 over the API: HTTP 200, the `<br>` damage was
removed, **but `<p>` remained and the view page still printed it**. Direct proof on a real case that
no API payload repairs this.

Evidence: `probe.py`, `probe.log`, `probe-result.json`, `repair_one.py`, `scope.py`, `scope.json`.

## 5 · PROVEN on one real case — C30197

C30197 (`custom_atmstatus = 1`, **not Automated**), the least risky affected case, was repaired
through the TestRail UI editor driven by Playwright.

| Check | Before | After |
|---|---|---|
| View container, all 3 fields | `markdown` (escaping) | **`markdown fr-view`** (renders) |
| Literal tags on the tester's page | `<p>` and `</p>` | **none** |
| Stored value | `<p>...&mdash;...</p>\n` (one blob) | `<p>...<br>...</p><p>...</p><p>AUTOMATION: READY</p>` |

Screenshot of the repaired page: `build/report-suite/damage-2026-08-26/evidence/C30197-REPAIRED-after.png`. Every line — the two numbered
expectations, the `---` rule, the two-sentence provenance line, the re-check sentence and the
`AUTOMATION: READY` marker — renders correctly and in order.

**Honest caveat:** a UI repair is a re-type, so it is *not* byte-identical to the 11:53 snapshot —
the wrapper is now legitimate rich-text markup rather than escaped text, and the two apostrophes in
C30197 were typed as a curly apostrophe where the snapshot held a straight one. The **words, order
and provenance are identical**; the difference is punctuation glyphs and markup. A batch repair
should paste the snapshot text verbatim rather than retype it, to avoid even that.

## 6 · Playwright — the earlier "TCP is reset for every host" report is WRONG as stated

Reproduced, then explained:

- `chromium.launch({ proxy: { server: $HTTPS_PROXY } })` gives **`net::ERR_CONNECTION_RESET`** on
  every navigation, `https://example.com/` included. Same error with no proxy option at all, with
  `--proxy-server=...`, and with `chromium_headless_shell`. `curl` through the same proxy returns 200.
- **Cause, already documented in this repo:** `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` section 1 —
  *"Chromium CANNOT TLS through the egress proxy directly ... build a FRESH local MITM bridge per run."*
- With `build/atlassian-login/bridge.mjs` running (it writes `/tmp/atlassian/bridge-port.txt`) and
  chromium pointed at that local port, **Playwright works**: TestRail login HTTP 200, case pages
  loaded, screenshots taken, an edit saved. That is how the earlier reflow passes and the 11:50
  Atlassian login succeeded.
- Note for reuse: `import { chromium } from 'playwright'` fails outside `/opt/node22`; import
  `/opt/node22/lib/node_modules/playwright/index.mjs` (or the CJS default export) instead.

So Playwright is **available**, it is not a blocker, and it is the only tool that can repair these
cases. TLS verification was never disabled and `HTTPS_PROXY` was never unset.

## 7 · The rule this changes

`build/APP-ACTIONS-PLAYBOOK.md` should carry: **never send a text field to `update_case` unless you
are deliberately changing it** — the API re-renders whatever it receives, and on a case whose
rich-text flag is off that re-render is visible damage. Bulk text edits on such cases must go
through the UI editor.

## OUTSTANDING — what I need from you

1. **Approval to repair the remaining 71 cases** via the proven UI route (batch, pasting the 11:53
   snapshot text verbatim). Rule 6 — no further TestRail writes without your go-ahead.
2. **C30518 is Automated.** Rules 65/71 — it needs Vlad's separate go-ahead before it is touched,
   even inside an approved batch.
3. Confirmation that the intended 2026-08-26 content changes (spec version re-stamps, the
   "Re-checked against the live specification on 26 August 2026" sentence) should be **kept** during
   the repair — this pass assumed yes, and kept them on C30197.
