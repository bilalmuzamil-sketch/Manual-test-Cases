# Schedule — build verification, 2026-08-12

## 1 · The build, read three times

| | Start | Mid-run | End |
|---|---|---|---|
| `<meta name="app-version">` | **`v3.5-65d6500`** | `v3.5-65d6500` | `v3.5-65d6500` |
| `last-modified` | Tue, 11 Aug 2026 09:33:33 GMT | same | same |
| `etag` | `"3250d285ffcf50626363a578fe273071"` | same | same |
| `index.html` sha256 | `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` | same | same |

**THE BUILD DID NOT MOVE UNDER THIS PASS** — byte-identical by sha256 at all three reads, so nothing
observed today needs re-checking for a mid-run redeploy. It is **the same build the 11 August pass
worked on**, which is why that pass's 37 confirmed label sets carry forward rather than being re-run.

Engineering is still deploying — *"they keep on pushing new builds as they fix a reported issue"* —
so this is a fact about today, not a guarantee about tomorrow morning.

## 2 · Location and hours — confirmed before any observation

- **Location `Staging Heavy Duty - 9919`** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`, America/Edmonton),
  read from the on-screen selector in **every** probe screenshot, not assumed from a setting.
- **`admin@shopview.com` hours: Mon–Fri 07:00–19:00, Sat and Sun not working** — carried forward from
  11 August, and **corroborated today** by the conflict pills, which read
  *"Starts before business hours (7:00 AM)"* and *"Extends past business hours (7:00 PM)"*.
- **`admin@shopview.com` was NOT edited.** A staff-record edit invalidates the session instantly and
  has already cost this workspace one session. The Edit Staff Member dialog was opened on
  **MQ Test Tech**, read, and closed without saving.

## 3 · The honest N-of-176

| | Cases |
|---|---|
| **Observed on `v3.5-65d6500` and re-stamped to it** | **14** |
| Carrying a verdict from `v3.5-7ec992f` | 82 |
| Carrying a verdict from `v3.5-d122eef` — **a build that no longer exists** | 78 |
| Carrying **no build line at all**, and saying so in their own text | 2 (C43588, C43589) |
| **Total** | **176** |

**14 of 176 were checked against the build now running. 162 were not.** That is the whole claim, and
it is not dressed up: this pass was chartered on the five unread dialogs, the harness that blocked
them, and the two case groups whose markers were wrong — not on a fresh live run of all 176.

**Under Standing Rule 60 that split is the ordinary consequence of a branch nobody declares final,
not an alarm.** Only three things go stale when the build moves — the on-screen labels, the pass/fail
verdict, and the `HOLD` half of the automation markers. The expectations come from the specification,
the epic and the PO's answers (Rule 57), and a redeploy cannot touch those.

## 4 · Suite hygiene — all 176 read live after the writes

| Check | Result |
|---|---|
| Raw HTML markup shown to the tester | **0 of 176** |
| Exactly one automation marker per case | **176 of 176** |
| Exactly one provenance line per case | **176 of 176** |
| More than one build stamp on a case | **0** |
| Titles over 80 characters | **0** |

**MARKERS: `READY` 141 · `READY - EXPECT FAIL` 1 · `HOLD` 34 = 176.**
**THE ARITHMETIC GATE PASSES BOTH WAYS: 141 + 1 = 142, and 176 − 34 = 142.**
Both figures were read back **from the live cases**, not computed from our notes.

**⚠️ 142 IS A COUNT OF WHAT IS AUTOMATABLE. IT IS NOT A COVERAGE CLAIM AND MUST NOT BE QUOTED AS ONE**
— only 14 of the 176 rest on the build now running.

## 5 · What moved on the run

**Run 357 was never written to. `update_run` was not called.** Proven by content, not by `updated_on`:

| | Before | After |
|---|---|---|
| `include_all` | `false` | `false` |
| tests | 176 | 176 |
| results | 529 | 529 |

- test-id sets **equal in both directions**
- case-id sets **equal in both directions**
- **all 529 prior results present BY ID**, 0 missing
- **0 non-echo field changes**; **0** `case_title`/`case_refs` echo changes; **0** new results

## 6 · Session and access

- A fresh `sv_sso_session` was supplied for this session, alongside `PHPSESSID` and `cf_clearance` —
  all three held in `/tmp` at mode 600, **never written into the repository**, never into an evidence
  file, and **not quoted here even in part**: this repository is public, and a token prefix is still
  token material.
- Session tested on the **api** host (`GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions`
  → **HTTP 200**). The app host answers 200 on any path and can never confirm a session.
- **`quick-login` and `switch-user` were NOT called** at any point — they rotate the shared token and
  would have signed out the two sibling workers running on Filters and Reports.
