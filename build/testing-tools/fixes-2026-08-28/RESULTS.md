# Two tooling bugs fixed — 2026-08-28

Both tools re-run after the change. **`check_add_case_payloads.py` now exits 0. `verify.py` no
longer invents requirements — and a THIRD bug of the same family was found while doing Job 4 and is
fixed here too, because it had already produced a wrong instruction.**

---

## 1 · `source-verify-2026-08-26/tools/verify.py` — (a) change-log MENTIONS scored as requirements

`anchor_texts()` keeps **every** occurrence of an anchor string, deliberately — a requirement is
often cross-referenced before it is defined, and a `setdefault` there once produced a false
all-clear. But a spec's own **change log** mentions anchors too, and those mentions have no
`ANCHOR: …` definition anywhere on the page. The tool scored them as live requirements, so it
**invented requirements that do not exist** and reported them **NOT COVERED**, sending an authoring
pass hunting for cases to write against a change-log line.

**Fix:** a real `definition()` (non-`None`) is now required before an anchor is scored at all. The
verdict loop, the `added` list and the `cites` map all run off the defined set; the excluded strings
are still reported, in a new `mentions_only_not_scored` field, so nothing is hidden.

**21 phantom requirements removed across the estate:**

| Report | Anchor strings live | **Defined (scored)** | Mentions-only, now excluded |
|---|---|---|---|
| WIP | 148 | **146** | `S7-R7a` · `S9-E2` — **the two named in the instruction** |
| PV | 78 | **75** | `S4-R2` · `S4-R6` · `S5-R7` |
| SBC | 243 | **228** | 15, incl. `S8-R7`–`S8-R14b`, `S14-R4`–`S14-R6`, `S15-R4`, `S15-R5`, `S16-R6` |
| TU | 124 | **123** | `S2-R8a` |
| IV · SBR | 115 · 232 | 115 · 232 | none |

## 2 · `verify.py` — (b) 🔴 A STORY NUMBER WITH A LETTER IN IT WAS INVISIBLE

Found while executing Job 4, and it had **already caused a wrong instruction**. The pattern was

```python
ANCHOR = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b")
```

`\d+` on the story side **cannot match `S4a-R2`**. So the whole of live WIP **Story 4a** and
**Story 5a** were invisible to every count, verdict and coverage list this project has produced —
and the tool reported **S4a-R2 as gone from live v28** when it is present, unchanged, and reads
word-for-word what C43821 asserts. On the strength of that report, C43821 was queued to be re-cited
away from a correct citation onto three indirect ones. **It was not; the citation was kept.**

**Fix:** `r"\bS\d+[a-z]?-(?:R|E|N|Q)\d+[a-z]?\b"`. **Nine anchors become visible, all in WIP:**
`S4a-R1` · `S4a-R2` · `S4a-R3` · `S4a-N1` · `S4a-N2` · `S5a-R1` · `S5a-R2` · `S5a-R3` · `S5a-R4`.
No other report is affected.

### Net effect on the verdict counts

| Report | NOT COVERED before → after | Why |
|---|---|---|
| **TU** | 1 → **0** | its only gap was a phantom |
| **SBC** | 21 → **16** | 5 phantoms |
| **PV** | 6 → 6 | phantoms were already counted covered |
| **WIP** | 33 → **39** | 2 phantoms removed, but **9 real Story 4a/5a requirements became visible** and most are uncited |
| IV · SBR | 2 → 2 · 19 → 19 | unaffected |

**⚠️ These counts are computed against `data/live-cases.json`, a case snapshot taken 2026-08-26.
Today's `refs` backfill is NOT reflected in them** — re-snapshot the cases before quoting a coverage
figure.

## 3 · `build/testing-tools/check_add_case_payloads.py` — FAIL on a self-test fixture

The guard failed on `build/testing-tools/snapshot_case_bodies.py:335`, which creates nothing at all:
it is a **self-test fixture** — a fake case dict, shaped like a TestRail API **response**, fed to
`snapshot_record()` to prove the field mapping.

**Fixed as a general rule, not an allow-list entry.** An `add_case` payload is what we **send**, so
it can never contain a field the server **assigns**. A dict literal carrying `id`, `created_by`,
`created_on`, `updated_by` or `updated_on` is a case **read back** from TestRail — a fixture,
snapshot or response — and is reported in its own bucket instead of failing the run. The window is
three lines, wide enough for the multi-line dicts these fixtures are written as and narrow enough
that an unrelated `id:` elsewhere in the file cannot excuse a real payload. **No detection power is
lost:** sending any of those keys to `add_case` is meaningless, so no real hazard can hide behind
one.

Three of today's scripts were also registered in `KNOWN_VERIFIERS` on the principle already recorded
there — each compares against `3` in order to **hold or report** an Automated case (Rules 65/71),
never to call one correctly created.

### Re-run

```
NOTE — 1 hit(s) sit in a dict that also carries a server-assigned field … not an add_case payload:
  build/testing-tools/snapshot_case_bodies.py:335
WARN — 19 verifier(s) …
NOTE — 23 hit(s) in already-executed scripts …
PASS — 0 new add_case payloads send custom_atmstatus: 3 (1396 file(s) scanned).
exit 0
```

## OUTSTANDING — what I need from you

1. **Nine live WIP requirements have never been assessed for coverage** (`S4a-R1/R2/R3/N1/N2`,
   `S5a-R1/R2/R3/R4`). They were invisible to every pass this project has run. **Their coverage is
   not claimed here** — it needs a pass of its own.
2. Worth deciding whether `verify.py` should re-read the cases live rather than from the
   2026-08-26 `live-cases.json` snapshot, so a coverage figure is never quoted stale.
