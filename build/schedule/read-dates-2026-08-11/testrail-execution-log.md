# Schedule — read-dates pass, TestRail execution log (2026-08-11)

**174 × `update_case`. 0 `add_case`. 0 `delete_case`. 0 section writes. 0 run writes. 0 results
logged. 0 Jira calls of any kind** (Rules 6 / 62 and the active creation hold at Rule 62's tail).

## The write shape, and why

Every payload carried **`title` + all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`), because **TestRail re-renders any text field omitted from the payload** through
its HTML pipeline — it wraps the field in `<p>` and converts `\n` to `\r\n` (playbook §J declared
normalisation). **`refs` was deliberately NOT sent**: this pass does not change it, it is not a
rich-text field, and omitting it removes the comma-normalisation question entirely. **The canary
proved it survives** — C29925 came back with `refs` byte-identical to its pre-write snapshot.

## Rule 50 verification, per operation

Each write was **re-GET and byte-compared field by field**: the field we sent against the exact bytes
we sent, and **every other field against the pre-write snapshot**. `updated_on` / `updated_by` are
the only fields excluded, as fields the server legitimately moves on any write. **30 fields compared
on every one of the 174. 0 mismatches. 0 collateral changes.** The writer exits non-zero and stops
the batch on the first mismatch; it never did.

## Rule 41 — the whole-case re-read

Every one of the 174 cases was **re-read end to end against the current specification (Confluence
**v27**, read 2026-08-11 13:09:33Z)** before any write, not just the field this pass edits. Fields
checked per case: **title · preconditions · every step · every expected result · refs · section ·
type · the automation marker · and every section anchor cited anywhere in the case.** The per-op
`rule41` field in `evidence/testrail-execution-log.json` carries that line for each case.

**Result: clean.** Every anchor cited exists as a heading in v27; every provenance line names version
27; exactly one provenance line and one automation marker per case with the marker last; 0 raw
markup; 0 barred phrases; 0 API content outside an API-titled section; 0 titles over 80 characters;
the `---` separator present on all 174. The two things the checker flagged were **its own false
positives** and are written up in `FINDINGS.md`.

## Rule 59 — sources re-read immediately before the writes began

| | |
|---|---|
| Sources read at pass start | **13:09:33Z** (spec) · **13:12:29Z** (epic) · **13:12:44Z** (stories) · **13:14Z** (the two repo files) |
| **Re-read at write start** | **13:24:17Z** spec · **13:24:35Z** epic |
| **Verdict of the second read** | **UNCHANGED** — Confluence still **v27** (`version.when` 2026-08-07T15:01:20.801Z, 43,064 chars, identical); epic **SV-8685** still **24** children. No read-date this pass stamps rests on a source that moved while it was being written. |

## Run 357 — proven undamaged by content

| | Before | After |
|---|---|---|
| `include_all` | **false** | **false** |
| Tests | **174** | **174** |
| Result records | **458** | **458** |
| Counters | 25 passed / 1 blocked / 148 untested | **identical** |

**`case_id` sets equal in BOTH directions · test-id sets equal in BOTH directions · all 458 prior
results present BY ID (0 missing) · 0 new results during the write window · 0 graded-field changes ·
and 0 non-graded changes either.** Not even the declared `case_refs` read-time echo moved — because
`refs` was never written. Snapshots: `snapshots/run357-{PRE,POST}*.json`.

> **Recorded as a change since our last record, not glossed:** the 2026-08-10 pass recorded run 357
> at **429** results and **0 passed / 0 failed / 0 blocked / 168 untested**. It now holds **458**
> results and **25 passed / 1 blocked**, and it has **174** tests rather than 168. **Ayesha Khan has
> been grading it, and the 6 panel-collapse cases were synced into it on 11 August.** Nothing here is
> ours; it is noted so the next reader does not read the difference as damage.

## Foreign cases

**0.** All 174 cases read `created_by = 3` (Bilal Muzamil) before and after. There is no foreign case
in group 4254 to leave untouched, and none was touched.

## Per-operation table

| # | Op | Case | Link | HTTP | Fields compared | Byte-verification | `custom_atmstatus` at write | Sources stamped |
|---|---|---|---|---|---|---|---|---|
| 1 | `update_case` | C29925 | [view](https://shopview.testrail.io/index.php?/cases/view/29925) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 2 | `update_case` | C29927 | [view](https://shopview.testrail.io/index.php?/cases/view/29927) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 3 | `update_case` | C29928 | [view](https://shopview.testrail.io/index.php?/cases/view/29928) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 4 | `update_case` | C29929 | [view](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 5 | `update_case` | C29930 | [view](https://shopview.testrail.io/index.php?/cases/view/29930) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 6 | `update_case` | C29931 | [view](https://shopview.testrail.io/index.php?/cases/view/29931) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 7 | `update_case` | C29932 | [view](https://shopview.testrail.io/index.php?/cases/view/29932) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 8 | `update_case` | C29933 | [view](https://shopview.testrail.io/index.php?/cases/view/29933) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 9 | `update_case` | C29934 | [view](https://shopview.testrail.io/index.php?/cases/view/29934) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 10 | `update_case` | C29935 | [view](https://shopview.testrail.io/index.php?/cases/view/29935) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 11 | `update_case` | C29936 | [view](https://shopview.testrail.io/index.php?/cases/view/29936) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 12 | `update_case` | C29937 | [view](https://shopview.testrail.io/index.php?/cases/view/29937) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 13 | `update_case` | C29939 | [view](https://shopview.testrail.io/index.php?/cases/view/29939) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 14 | `update_case` | C29940 | [view](https://shopview.testrail.io/index.php?/cases/view/29940) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 15 | `update_case` | C29941 | [view](https://shopview.testrail.io/index.php?/cases/view/29941) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 16 | `update_case` | C29942 | [view](https://shopview.testrail.io/index.php?/cases/view/29942) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 17 | `update_case` | C29943 | [view](https://shopview.testrail.io/index.php?/cases/view/29943) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 18 | `update_case` | C29944 | [view](https://shopview.testrail.io/index.php?/cases/view/29944) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 19 | `update_case` | C29945 | [view](https://shopview.testrail.io/index.php?/cases/view/29945) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 20 | `update_case` | C29946 | [view](https://shopview.testrail.io/index.php?/cases/view/29946) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 21 | `update_case` | C29947 | [view](https://shopview.testrail.io/index.php?/cases/view/29947) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 22 | `update_case` | C29948 | [view](https://shopview.testrail.io/index.php?/cases/view/29948) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 23 | `update_case` | C29950 | [view](https://shopview.testrail.io/index.php?/cases/view/29950) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 24 | `update_case` | C29951 | [view](https://shopview.testrail.io/index.php?/cases/view/29951) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 25 | `update_case` | C29952 | [view](https://shopview.testrail.io/index.php?/cases/view/29952) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 26 | `update_case` | C29953 | [view](https://shopview.testrail.io/index.php?/cases/view/29953) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 27 | `update_case` | C29954 | [view](https://shopview.testrail.io/index.php?/cases/view/29954) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 28 | `update_case` | C29955 | [view](https://shopview.testrail.io/index.php?/cases/view/29955) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 29 | `update_case` | C29956 | [view](https://shopview.testrail.io/index.php?/cases/view/29956) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 30 | `update_case` | C29957 | [view](https://shopview.testrail.io/index.php?/cases/view/29957) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 31 | `update_case` | C29958 | [view](https://shopview.testrail.io/index.php?/cases/view/29958) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 32 | `update_case` | C29959 | [view](https://shopview.testrail.io/index.php?/cases/view/29959) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 33 | `update_case` | C29960 | [view](https://shopview.testrail.io/index.php?/cases/view/29960) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 34 | `update_case` | C29961 | [view](https://shopview.testrail.io/index.php?/cases/view/29961) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 35 | `update_case` | C29962 | [view](https://shopview.testrail.io/index.php?/cases/view/29962) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 36 | `update_case` | C29963 | [view](https://shopview.testrail.io/index.php?/cases/view/29963) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 37 | `update_case` | C29964 | [view](https://shopview.testrail.io/index.php?/cases/view/29964) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 38 | `update_case` | C29965 | [view](https://shopview.testrail.io/index.php?/cases/view/29965) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 39 | `update_case` | C29967 | [view](https://shopview.testrail.io/index.php?/cases/view/29967) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 40 | `update_case` | C29969 | [view](https://shopview.testrail.io/index.php?/cases/view/29969) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 41 | `update_case` | C29970 | [view](https://shopview.testrail.io/index.php?/cases/view/29970) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 42 | `update_case` | C29971 | [view](https://shopview.testrail.io/index.php?/cases/view/29971) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 43 | `update_case` | C29972 | [view](https://shopview.testrail.io/index.php?/cases/view/29972) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 44 | `update_case` | C29973 | [view](https://shopview.testrail.io/index.php?/cases/view/29973) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 45 | `update_case` | C29974 | [view](https://shopview.testrail.io/index.php?/cases/view/29974) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 46 | `update_case` | C29975 | [view](https://shopview.testrail.io/index.php?/cases/view/29975) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 47 | `update_case` | C29978 | [view](https://shopview.testrail.io/index.php?/cases/view/29978) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 48 | `update_case` | C29979 | [view](https://shopview.testrail.io/index.php?/cases/view/29979) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 49 | `update_case` | C29980 | [view](https://shopview.testrail.io/index.php?/cases/view/29980) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 50 | `update_case` | C29981 | [view](https://shopview.testrail.io/index.php?/cases/view/29981) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 51 | `update_case` | C29982 | [view](https://shopview.testrail.io/index.php?/cases/view/29982) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 52 | `update_case` | C29983 | [view](https://shopview.testrail.io/index.php?/cases/view/29983) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 53 | `update_case` | C29984 | [view](https://shopview.testrail.io/index.php?/cases/view/29984) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 54 | `update_case` | C29985 | [view](https://shopview.testrail.io/index.php?/cases/view/29985) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 55 | `update_case` | C29986 | [view](https://shopview.testrail.io/index.php?/cases/view/29986) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 56 | `update_case` | C29987 | [view](https://shopview.testrail.io/index.php?/cases/view/29987) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 57 | `update_case` | C29988 | [view](https://shopview.testrail.io/index.php?/cases/view/29988) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 58 | `update_case` | C29989 | [view](https://shopview.testrail.io/index.php?/cases/view/29989) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 59 | `update_case` | C29990 | [view](https://shopview.testrail.io/index.php?/cases/view/29990) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 60 | `update_case` | C29991 | [view](https://shopview.testrail.io/index.php?/cases/view/29991) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 61 | `update_case` | C29992 | [view](https://shopview.testrail.io/index.php?/cases/view/29992) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 62 | `update_case` | C29995 | [view](https://shopview.testrail.io/index.php?/cases/view/29995) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 63 | `update_case` | C29996 | [view](https://shopview.testrail.io/index.php?/cases/view/29996) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 64 | `update_case` | C29997 | [view](https://shopview.testrail.io/index.php?/cases/view/29997) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 65 | `update_case` | C29998 | [view](https://shopview.testrail.io/index.php?/cases/view/29998) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 66 | `update_case` | C29999 | [view](https://shopview.testrail.io/index.php?/cases/view/29999) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 67 | `update_case` | C30001 | [view](https://shopview.testrail.io/index.php?/cases/view/30001) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 68 | `update_case` | C30003 | [view](https://shopview.testrail.io/index.php?/cases/view/30003) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 69 | `update_case` | C30004 | [view](https://shopview.testrail.io/index.php?/cases/view/30004) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 70 | `update_case` | C30005 | [view](https://shopview.testrail.io/index.php?/cases/view/30005) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 71 | `update_case` | C30006 | [view](https://shopview.testrail.io/index.php?/cases/view/30006) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 72 | `update_case` | C30008 | [view](https://shopview.testrail.io/index.php?/cases/view/30008) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 73 | `update_case` | C30009 | [view](https://shopview.testrail.io/index.php?/cases/view/30009) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 74 | `update_case` | C30010 | [view](https://shopview.testrail.io/index.php?/cases/view/30010) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 75 | `update_case` | C30011 | [view](https://shopview.testrail.io/index.php?/cases/view/30011) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 76 | `update_case` | C30012 | [view](https://shopview.testrail.io/index.php?/cases/view/30012) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 77 | `update_case` | C30013 | [view](https://shopview.testrail.io/index.php?/cases/view/30013) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 78 | `update_case` | C30014 | [view](https://shopview.testrail.io/index.php?/cases/view/30014) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 79 | `update_case` | C30015 | [view](https://shopview.testrail.io/index.php?/cases/view/30015) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 80 | `update_case` | C30016 | [view](https://shopview.testrail.io/index.php?/cases/view/30016) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 81 | `update_case` | C30017 | [view](https://shopview.testrail.io/index.php?/cases/view/30017) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 82 | `update_case` | C30018 | [view](https://shopview.testrail.io/index.php?/cases/view/30018) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 83 | `update_case` | C30020 | [view](https://shopview.testrail.io/index.php?/cases/view/30020) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 84 | `update_case` | C30021 | [view](https://shopview.testrail.io/index.php?/cases/view/30021) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 85 | `update_case` | C30022 | [view](https://shopview.testrail.io/index.php?/cases/view/30022) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 86 | `update_case` | C30023 | [view](https://shopview.testrail.io/index.php?/cases/view/30023) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 87 | `update_case` | C30024 | [view](https://shopview.testrail.io/index.php?/cases/view/30024) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 88 | `update_case` | C30025 | [view](https://shopview.testrail.io/index.php?/cases/view/30025) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 89 | `update_case` | C30027 | [view](https://shopview.testrail.io/index.php?/cases/view/30027) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 90 | `update_case` | C30028 | [view](https://shopview.testrail.io/index.php?/cases/view/30028) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 91 | `update_case` | C30029 | [view](https://shopview.testrail.io/index.php?/cases/view/30029) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 92 | `update_case` | C30030 | [view](https://shopview.testrail.io/index.php?/cases/view/30030) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 93 | `update_case` | C30031 | [view](https://shopview.testrail.io/index.php?/cases/view/30031) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 94 | `update_case` | C30032 | [view](https://shopview.testrail.io/index.php?/cases/view/30032) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 95 | `update_case` | C30033 | [view](https://shopview.testrail.io/index.php?/cases/view/30033) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 96 | `update_case` | C30034 | [view](https://shopview.testrail.io/index.php?/cases/view/30034) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 97 | `update_case` | C30035 | [view](https://shopview.testrail.io/index.php?/cases/view/30035) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 98 | `update_case` | C30036 | [view](https://shopview.testrail.io/index.php?/cases/view/30036) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 99 | `update_case` | C30037 | [view](https://shopview.testrail.io/index.php?/cases/view/30037) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 100 | `update_case` | C30038 | [view](https://shopview.testrail.io/index.php?/cases/view/30038) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 101 | `update_case` | C30039 | [view](https://shopview.testrail.io/index.php?/cases/view/30039) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 102 | `update_case` | C30040 | [view](https://shopview.testrail.io/index.php?/cases/view/30040) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 103 | `update_case` | C30041 | [view](https://shopview.testrail.io/index.php?/cases/view/30041) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 104 | `update_case` | C30042 | [view](https://shopview.testrail.io/index.php?/cases/view/30042) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 105 | `update_case` | C30043 | [view](https://shopview.testrail.io/index.php?/cases/view/30043) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 106 | `update_case` | C30044 | [view](https://shopview.testrail.io/index.php?/cases/view/30044) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 107 | `update_case` | C30045 | [view](https://shopview.testrail.io/index.php?/cases/view/30045) | 200 | 30 | **MATCH** | 1 | epic SV-8685, Branko's answers |
| 108 | `update_case` | C30046 | [view](https://shopview.testrail.io/index.php?/cases/view/30046) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 109 | `update_case` | C30047 | [view](https://shopview.testrail.io/index.php?/cases/view/30047) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 110 | `update_case` | C30050 | [view](https://shopview.testrail.io/index.php?/cases/view/30050) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 111 | `update_case` | C30051 | [view](https://shopview.testrail.io/index.php?/cases/view/30051) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 112 | `update_case` | C30052 | [view](https://shopview.testrail.io/index.php?/cases/view/30052) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 113 | `update_case` | C30054 | [view](https://shopview.testrail.io/index.php?/cases/view/30054) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 114 | `update_case` | C30057 | [view](https://shopview.testrail.io/index.php?/cases/view/30057) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 115 | `update_case` | C30058 | [view](https://shopview.testrail.io/index.php?/cases/view/30058) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 116 | `update_case` | C30059 | [view](https://shopview.testrail.io/index.php?/cases/view/30059) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 117 | `update_case` | C30060 | [view](https://shopview.testrail.io/index.php?/cases/view/30060) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 118 | `update_case` | C30061 | [view](https://shopview.testrail.io/index.php?/cases/view/30061) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 119 | `update_case` | C30062 | [view](https://shopview.testrail.io/index.php?/cases/view/30062) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 120 | `update_case` | C30064 | [view](https://shopview.testrail.io/index.php?/cases/view/30064) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 121 | `update_case` | C30065 | [view](https://shopview.testrail.io/index.php?/cases/view/30065) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 122 | `update_case` | C30066 | [view](https://shopview.testrail.io/index.php?/cases/view/30066) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 123 | `update_case` | C30068 | [view](https://shopview.testrail.io/index.php?/cases/view/30068) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 124 | `update_case` | C30070 | [view](https://shopview.testrail.io/index.php?/cases/view/30070) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 125 | `update_case` | C30071 | [view](https://shopview.testrail.io/index.php?/cases/view/30071) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 126 | `update_case` | C30072 | [view](https://shopview.testrail.io/index.php?/cases/view/30072) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 127 | `update_case` | C30073 | [view](https://shopview.testrail.io/index.php?/cases/view/30073) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 128 | `update_case` | C30074 | [view](https://shopview.testrail.io/index.php?/cases/view/30074) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 129 | `update_case` | C30075 | [view](https://shopview.testrail.io/index.php?/cases/view/30075) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 130 | `update_case` | C30076 | [view](https://shopview.testrail.io/index.php?/cases/view/30076) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 131 | `update_case` | C30077 | [view](https://shopview.testrail.io/index.php?/cases/view/30077) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 132 | `update_case` | C30078 | [view](https://shopview.testrail.io/index.php?/cases/view/30078) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 133 | `update_case` | C30079 | [view](https://shopview.testrail.io/index.php?/cases/view/30079) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 134 | `update_case` | C30080 | [view](https://shopview.testrail.io/index.php?/cases/view/30080) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 135 | `update_case` | C30081 | [view](https://shopview.testrail.io/index.php?/cases/view/30081) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 136 | `update_case` | C30082 | [view](https://shopview.testrail.io/index.php?/cases/view/30082) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 137 | `update_case` | C30083 | [view](https://shopview.testrail.io/index.php?/cases/view/30083) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 138 | `update_case` | C30084 | [view](https://shopview.testrail.io/index.php?/cases/view/30084) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 139 | `update_case` | C30086 | [view](https://shopview.testrail.io/index.php?/cases/view/30086) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 140 | `update_case` | C30087 | [view](https://shopview.testrail.io/index.php?/cases/view/30087) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 141 | `update_case` | C30088 | [view](https://shopview.testrail.io/index.php?/cases/view/30088) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 142 | `update_case` | C30089 | [view](https://shopview.testrail.io/index.php?/cases/view/30089) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 143 | `update_case` | C30090 | [view](https://shopview.testrail.io/index.php?/cases/view/30090) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 144 | `update_case` | C30614 | [view](https://shopview.testrail.io/index.php?/cases/view/30614) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 145 | `update_case` | C30615 | [view](https://shopview.testrail.io/index.php?/cases/view/30615) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 146 | `update_case` | C38847 | [view](https://shopview.testrail.io/index.php?/cases/view/38847) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 147 | `update_case` | C38848 | [view](https://shopview.testrail.io/index.php?/cases/view/38848) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 148 | `update_case` | C38849 | [view](https://shopview.testrail.io/index.php?/cases/view/38849) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 149 | `update_case` | C38850 | [view](https://shopview.testrail.io/index.php?/cases/view/38850) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 150 | `update_case` | C38851 | [view](https://shopview.testrail.io/index.php?/cases/view/38851) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 151 | `update_case` | C38855 | [view](https://shopview.testrail.io/index.php?/cases/view/38855) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 152 | `update_case` | C38863 | [view](https://shopview.testrail.io/index.php?/cases/view/38863) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, the engineering technical plan |
| 153 | `update_case` | C38864 | [view](https://shopview.testrail.io/index.php?/cases/view/38864) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, the engineering technical plan |
| 154 | `update_case` | C38865 | [view](https://shopview.testrail.io/index.php?/cases/view/38865) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 155 | `update_case` | C38866 | [view](https://shopview.testrail.io/index.php?/cases/view/38866) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 156 | `update_case` | C38867 | [view](https://shopview.testrail.io/index.php?/cases/view/38867) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 157 | `update_case` | C38868 | [view](https://shopview.testrail.io/index.php?/cases/view/38868) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 158 | `update_case` | C38869 | [view](https://shopview.testrail.io/index.php?/cases/view/38869) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 159 | `update_case` | C38870 | [view](https://shopview.testrail.io/index.php?/cases/view/38870) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 160 | `update_case` | C38871 | [view](https://shopview.testrail.io/index.php?/cases/view/38871) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 161 | `update_case` | C38872 | [view](https://shopview.testrail.io/index.php?/cases/view/38872) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, the engineering technical plan |
| 162 | `update_case` | C38873 | [view](https://shopview.testrail.io/index.php?/cases/view/38873) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, the engineering technical plan |
| 163 | `update_case` | C38874 | [view](https://shopview.testrail.io/index.php?/cases/view/38874) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27, Branko's answers |
| 164 | `update_case` | C38875 | [view](https://shopview.testrail.io/index.php?/cases/view/38875) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the engineering technical plan |
| 165 | `update_case` | C38926 | [view](https://shopview.testrail.io/index.php?/cases/view/38926) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 166 | `update_case` | C43554 | [view](https://shopview.testrail.io/index.php?/cases/view/43554) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the acceptance criterion of its story SV-8686 |
| 167 | `update_case` | C43555 | [view](https://shopview.testrail.io/index.php?/cases/view/43555) | 200 | 30 | **MATCH** | 1 | epic SV-8685, the Schedule specification version 27 |
| 168 | `update_case` | C43556 | [view](https://shopview.testrail.io/index.php?/cases/view/43556) | 200 | 30 | **MATCH** | 1 | epic SV-8685 |
| 169 | `update_case` | C43582 | [view](https://shopview.testrail.io/index.php?/cases/view/43582) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |
| 170 | `update_case` | C43583 | [view](https://shopview.testrail.io/index.php?/cases/view/43583) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |
| 171 | `update_case` | C43584 | [view](https://shopview.testrail.io/index.php?/cases/view/43584) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |
| 172 | `update_case` | C43585 | [view](https://shopview.testrail.io/index.php?/cases/view/43585) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |
| 173 | `update_case` | C43586 | [view](https://shopview.testrail.io/index.php?/cases/view/43586) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |
| 174 | `update_case` | C43587 | [view](https://shopview.testrail.io/index.php?/cases/view/43587) | 200 | 30 | **MATCH** | 1 | epic SV-8685, its story SV-8686 |