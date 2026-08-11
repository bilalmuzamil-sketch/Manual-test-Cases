# Marker counts — before and after, with the arithmetic gate re-derived

Both populations were **re-derived live from TestRail**, not taken from any prior note.
"Ours" excludes foreign cases: group 4110 holds **119** cases, of which **114 are ours** and **5 are
Ahtasham Amjad's** (C43576–C43580, `created_by=7`, untouched — Rule 38). Group 4254 holds **174**, all ours.

## Filters — group 4110, 114 cases ours (live total 119)

| Marker | Before | After | Change |
|---|---:|---:|---:|
| `AUTOMATION: READY` | 78 | **86** | +8 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 15 | **7** | **−8** |
| `AUTOMATION: HOLD - <reason>` | 20 | 20 | 0 |
| **no marker at all** | 1 | 1 | 0 |
| **Total** | **114** | **114** | |

**Gate: READY 86 + EXPECT-FAIL 7 = 93. Total 114 − HOLD 20 = 94. The gate does NOT close, and it is off by
exactly one.**

That one is **[C29600](https://shopview.testrail.io/index.php?/cases/view/29600)**, which carries **no marker
and no provenance line**. It is a **pre-existing** defect — the before-census found it already missing, before
any write in this pass — and it is the sole discrepancy. Every case is accounted for:

```
86 READY + 7 EXPECT-FAIL + 20 HOLD + 1 unmarked = 114
```

The gate as normally stated (`READY + EXPECT-FAIL = total − HOLD`) cannot close while any case carries no
marker at all. **It will close at 94 the moment C29600 is repaired**, which needs one authorised write.

## Schedule — group 4254, 174 cases, all ours

| Marker | Before | After | Change |
|---|---:|---:|---:|
| `AUTOMATION: READY` | 119 | **146** | +27 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 21 | **0** | **−21** |
| `AUTOMATION: HOLD - <reason>` | 34 | **28** | **−6** |
| **Total** | **174** | **174** | |

**Gate: READY 146 + EXPECT-FAIL 0 = 146. Total 174 − HOLD 28 = 146. THE GATE PASSES**, both arithmetics read
back from the live cases rather than computed from notes.

The `HOLD` drop of 6 is the Panel collapse set (C43582–C43587) released to plain `READY`.

## Both projects

| | Before | After |
|---|---:|---:|
| Expect-fail markers | **36** | **7** |
| Removed | — | **29** |
| Kept (backed) | — | **7** |
| HOLDs released to READY | — | **6** |
| Cases written | — | **42** |

## Post-write hygiene census — every case, both projects

| Check | Filters (114) | Schedule (174) |
|---|---|---|
| Exactly one `AUTOMATION:` marker | 113 (+1 with none, pre-existing) | **174** |
| Marker is the last non-blank line | **all that have one** | **all** |
| Raw markup in any of the three tester-facing fields | **0** | **0** |
| HTML entities (`&nbsp;` etc.) in those fields | **0** | **0** |
| Exactly one provenance line | 113 (+C29600 has none, pre-existing) | **174** |

The markup census was run **before and after** and over **all three** tester-facing fields
(`custom_preconds`, `custom_steps`, `custom_expected`), because TestRail can re-render text into HTML hours
after a write without moving `updated_on`. **Of the 42 cases written, none gained markup.** Note that zero is
never durable on this project — it needs re-checking, not trusting.
