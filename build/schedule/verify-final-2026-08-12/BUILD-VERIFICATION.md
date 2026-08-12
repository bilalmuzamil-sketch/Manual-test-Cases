# Schedule — build verification, 2026-08-12 (final pass)

## 1 · The build, read at both ends of this pass

| | Pass start | Pass end |
|---|---|---|
| `<meta name="app-version">` | **`v3.5-65d6500`** | **`v3.5-65d6500`** — re-read at pass end, `cmp` byte-identical |
| `last-modified` | Tue, 11 Aug 2026 09:33:33 GMT | same |
| `etag` | `"3250d285ffcf50626363a578fe273071"` | same |
| `index.html` sha256 | `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` | same |

**THE BUILD DID NOT MOVE UNDER THIS PASS**, and it has not moved since **11 August 09:33 GMT** —
byte-identical by sha256 across every read taken over the last two days. That single fact is what
makes this pass possible at all: **the 11 August label work and the 12 August dialog work were both
done against the build that is shipping tomorrow**, so their findings are current, not historical.

Engineering is still deploying as fixes land, so this is a statement about today, not a guarantee
about tomorrow morning.

## 2 · Session and access

- Admin session (`PHPSESSID` / `sv_sso_session` / `cf_clearance`) held in `/tmp` at mode `600`,
  **never written into the repository**, never into an evidence file, and not quoted here even in
  part — this repository is public and a token prefix is still token material.
- Verified on the **api** host: `GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions`
  → **HTTP 200**. The app host answers 200 on any path and can never confirm a session.
- **`quick-login` and `switch-user` were NOT called at any point.** They rotate the shared token and
  would have signed out the sibling workers live on Report Suite and Filters.

## 3 · Location

**`Staging Heavy Duty - 9919`** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`, America/Edmonton) — the
location every harvested surface was read under, and the location the 11 and 12 August harvests were
taken under, so the union harvest in §4 is internally consistent.

## 4 · What this pass had to work with

The two committed passes that ran on **this same build marker** left machine-readable harvests:

| Source | Surfaces | Committed at |
|---|---|---|
| 11 August label pass | 34 | `build-viu-2026-08-11/evidence/vocab-by-surface.json` |
| 12 August dialog + drag passes | 24 | `build-viu-2026-08-12/evidence/`, `drag-retry-2026-08-12/evidence/` |

Unioned by `tools/build_union_harvest.py` into
`evidence/union-harvest.json` — **58 contributing surfaces, 1,774 distinct VISIBLE strings**, with
accessible-only strings (aria-labels, test-ids) kept in a **separate bucket** so a label found only in
a string no tester can see is never certified as correct.

## 5 · The honest N-of-176, before and after this pass

| Build the case's verdict rests on | Before | **After** |
|---|---|---|
| **`v3.5-65d6500` — the build shipping tomorrow** | 22 | **76** |
| `v3.5-7ec992f` | 82 | 56 |
| `v3.5-d122eef` — **a build that no longer exists** | 70 | 42 |
| No build line at all, and saying so in their own text | 2 | 2 |
| **Total** | **176** | **176** |

**76 of 176 now rest on the build that ships. 100 do not, and every one of them says so in its own
text.** No case was given a build line it did not earn.

## 6 · Suite hygiene — all 176 read live after the writes

| Check | Result |
|---|---|
| Raw HTML markup shown to the tester | **0 of 176** |
| Exactly one automation marker per case | **176 of 176** |
| Exactly one provenance line per case | **176 of 176** |
| More than one build stamp on a case | **0** |
| Stranded version fragments (the `…on 8/12/2026.5-af3a6e1…` defect) | **0** |

**MARKERS: `READY` 147 · `READY - EXPECT FAIL` 0 · `HOLD` 29 = 176.**
**THE ARITHMETIC GATE PASSES BOTH WAYS: 147 + 0 = 147, and 176 − 29 = 147.**
Both figures read back **from the live cases**, not computed from our notes.

**⚠️ 147 IS A COUNT OF WHAT IS AUTOMATABLE. IT IS NOT A COVERAGE CLAIM AND MUST NOT BE QUOTED AS ONE.**

## 7 · Run 357 — proven untouched, by content

`update_run` was never called. Verified by content, never by `updated_on`:

| | Before | After |
|---|---|---|
| `include_all` | `false` | `false` |
| tests | 176 | 176 |
| results | 529 | 529 |

- test-id sets **equal in both directions**
- case-id sets **equal in both directions**
- **all 529 prior results present BY ID**, 0 missing, 0 new
- **0 graded-field changes**; **0** `case_title` / `case_refs` echo changes
