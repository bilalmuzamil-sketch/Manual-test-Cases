# Build verification — Schedule, 2026-08-11

## 🔴 THE HEADLINE, STATED FIRST BECAUSE IT IS THE NUMBER NEEDED FOR THURSDAY

**0 of the 174 Schedule cases were build-verified in this pass. 174 remain unverified.**

**The session died 14 minutes in, before the Schedule page could be loaded once.** Not one control,
label, navigation path or piece of test data was observed. Nothing was inferred to pad that number
(Rule 12), and **nothing was written to TestRail** — every write this pass would have owed a Rule-54
build stamp for an observation that was never made.

**This is a blocked pass, not a completed one, and it must not be described as anything else.**

| | |
|---|---:|
| Cases in scope | **174** |
| **Build-verified against the running build** | **0** |
| **Not verified** | **174** |
| TestRail writes | **0** (all 174 proven byte-identical, `updated_on` included) |
| Jira writes | **0** |

---

## 1 · The build DID move, and no case rests on the build now running

| | |
|---|---|
| **Build now running** | **`v3.5-65d6500`** |
| `index.html` last-modified | **Tue 11 Aug 2026 09:33:33 GMT** |
| etag | `3250d285ffcf50626363a578fe273071` |
| sha256 of `index.html` | `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` |
| Read at | **11:05:35Z** and **11:32:32Z** — **`index.html` byte-identical both times** (same sha256), so **the build did NOT move under this pass** |
| **Times the marker moved during the pass** | **0** |

**The brief's expected marker was `v3.5-af3a6e1`. It is not that.** The build moved, exactly as the
brief warned it might.

**Where the 174 verdicts actually come from — none of them from the build running now:**

| Build the verdict rests on | Cases | Still the running build? |
|---|---:|---|
| `v3.5-7ec992f` (6 Aug) | **90** | no |
| `v3.5-d122eef` (5 Aug) | **78** | no — **this build no longer exists** |
| `v3.5-af3a6e1` (11 Aug) | **6** | no — superseded this morning |
| **`v3.5-65d6500` (running)** | **0** | — |

Under Rule 60 this is the ordinary consequence of a branch that is never declared final: it
invalidates **layer 1** (labels and navigation) and **layer 2** (the pass/fail verdict). It
invalidates **no expectation**, because expectations come from documents (Rule 57).

---

## 2 · Why nothing was observed — the session, diagnosed not assumed

The sign-in was **alive at 11:05Z** and **dead by 11:19Z**. It was working: `fe-permissions` 200,
`/api/staff` 200, `POST /api/token` 200 returning a 7,199-character token, `/api/staff/my-workplaces`
200. The browser booted and loaded the app once.

**Then all three QA branches began refusing together.** The playbook's three-part dead-shared-token
signature (§A) was checked in full rather than assumed:

1. **All three branches 401 on the byte-identical shared `sv_sso_session`** — `sv8685api` (Schedule),
   `sv8785api` (Filters), `sv8582api` (Report Suite). Only the shared token can do that; one branch
   alone would be trap 4.
2. **The refusal is the application's own JSON, from nginx** — `HTTP 401`,
   `content-type: application/json`, `server: nginx/1.30.4`, body
   `{"error":"sso_required","sso_redirect_url":"…"}`. It **reached the application**, so this is **not**
   `cf_clearance` — a Cloudflare problem returns an HTML challenge. **Asking for a fresh
   `cf_clearance` will not fix it.**
3. **Nothing returns 409**, so it is not a per-branch `PHPSESSID` mismatch.

**Polled 8 times over ~2 minutes and again later: 401 every time.** `quick-login` was **not** called —
it is barred by the brief and is itself SSO-gated.

**⇒ The one thing needed is a fresh `sv_sso_session`.** Ask for **that value by name**.

### One trap hit and cleared on the way — worth recording

The cookie file was first written with a leading `Cookie: ` prefix (correct for `curl -H @file`,
**wrong** as a raw header value — it produces `Cookie: Cookie: …`). That made `curl` succeed while
Python 409'd on the same request, which looks exactly like an intermittent session. **The proven
file format carries no prefix**; corrected, and both clients then agreed. This sits alongside the
`paste -sd` hazard already in §A: **the cookie header has more than one way to be silently malformed.**

---

## 3 · What WAS established — all of it document-side or TestRail-side

The application was unreachable; TestRail and the ingested spec were not. Everything below is
evidence that does not depend on a running build, and it is the input the eventual build pass needs.

### 3.1 Suite hygiene — measured live, not carried forward

| Check | Result |
|---|---|
| Cases under group 4254 | **174**, and **every one is ours** (`created_by = 3`) — ours 174 / live 174 |
| **Raw markup** shown to the tester | **0 of 174** — searched all four text fields of every case for `<ol> <li> <ul> <p> <br> <div> <span> <table> <tr> <td> <th> <strong> <em> <b> <i> <h1-6>` |
| Automation markers | **174 of 174, exactly one each** — 0 missing, 0 doubled |
| Rule-54 provenance lines | **174 of 174, exactly one each** |
| Build stamps | **174 of 174** present, exactly one each |
| **`custom_atmstatus`** | **`1` on all 174 — none is flagged Automated.** See `FOR-VLAD.md` |
| Marker split | **READY 146 · HOLD 28 = 174**. Gate: 174 − 28 = **146**, and 146 + 0 EXPECT-FAIL = **146**. ✅ |

### 3.2 The label check-list — the expensive half, done offline

Every UI string the 174 cases assert was extracted and tagged by **field**, because the field decides
the class of any mismatch. **195 mentions · 85 distinct strings · across 82 of the 174 cases**
(92 cases assert no quoted string at all). Tooling: `tools/extract_labels.py`, output
`evidence/labels.json` and `evidence/distinct_labels.txt`.

Each of the 85 was then tested against **live spec v27** (`tools/spec_partition.py`):

| Partition | Strings | What it means for the build pass |
|---|---:|---|
| **Spec has it, byte-for-byte** | **49** | Our text matches the document exactly. |
| **Spec has it, our capitalisation differs** | **9** | The fastest rows to check first — see `CLASSIFICATION.md` §2. |
| **Absent from the spec entirely** | **27** | No document mentions these at all. |

**🔴 AND THE PARTITION TURNS OUT NOT TO CHANGE WHO DECIDES — a finding in its own right.** Spec v27
was searched for any requirement that **argues for** a label's wording rather than merely naming it
to identify it (`deliberately`, `rather than`, `the label is`, `must read`, `reads exactly`,
`wording`). **Six passages matched and NONE defends a string.** So **every label mention in the
specification is a LOCATOR, there are ZERO class-B labels in this suite, and the BUILD decides all
85** — no label dispute here is settleable from documents. The class test is the sibling Filters
pass's (`build/filters/build-verify-2026-08-11/CLASSIFICATION.md`), and applying it **corrected an
earlier conclusion of this pass**: nine strings first written up as class-B defects are class A/C,
which flips their likely answer from *"our cases are wrong"* to *"our cases may already be right."*

**Honesty about that 27:** it is not 27 clean labels. **6 are test-data names** (`Vuchester Retail`,
`Andrew Wade`, `zzzxq999`, `ZZAUTOTEST Rush`, `ZZAUTOTEST note`, `ZZAUTOTEST stand-up`) which need an
**existence** check, not a label check; and **about 6 are artefacts of the harvester** catching an
apostrophe inside ordinary prose (`- it names the technician`, `shifts and events are visible (not
just the user`). **Roughly 14 are genuine build-decided labels.** The list is not padded.

### 3.3 The C29596-shaped trap — hunted, and it cannot occur here

The brief warned about a case following a spec **example** that contradicts the spec's own **rule**.
**Schedule specification v27 contains no examples at all**: searched for `e.g.`, `for example`,
`such as`, `eg`, `i.e.`, `sample`, `illustrat`, `as an example` across all 345 extracted blocks —
**0 hits**. **That trap shape is structurally impossible in this suite.**

### 3.4 The spec still states one thing two ways — unchanged in v27

**§4.10** *"Create via left-click on empty grid space, which opens a menu with 'Create event' and
'New work order'."* and **§7** *"Left-click on empty grid space opens a menu with: Create event, New
work order."* — against **§14.1** *"…shift and event creation (including via **right-click** context
menu and day-view click-to-create)…"*.

**Left-click twice, right-click once, in the same document.** Reported, not resolved — it is Branko's
to settle (Rules 55/57), and it is already a known open item.

---

## 4 · The six Panel collapse cases — one correction to the brief

The brief states build-verification "has never been done on any of them". **That is true of 168 of
the 174 and not of these six.** C43582–C43587 each carry
**`Last checked against build v3.5-af3a6e1 on 8/11/2026`** and their notes describe an actual
observation made at authoring — *"the Schedule toolbar had no panel button at all — the button
furthest to the left above the grid was Today"*.

**Their state is exactly as the brief describes it and was left untouched:**

| | |
|---|---|
| Marker | plain **`AUTOMATION: READY`** on all six ✅ |
| Tester note | *"Run this test as written and mark it on what you actually find… Mark it failed if that is still what you see. If the button is there and behaves as described, mark it passed."* ✅ |
| Rule-54 sentence 1 | names documents only — epic SV-8685, story SV-8686, spec v27 §5.3/§6/§3.1 ✅ |

**It is an instruction, not a prediction, and it was not turned back into one.**

**⚠️ OWED: the re-confirmation the brief asked for cannot be given.** The control's continued absence
was to be re-checked on the running build, and the session died first. **`v3.5-af3a6e1` is no longer
the build**, so the six cases now rest on a superseded observation. **They are safe** — the note tells
the tester to record what they actually find, which is correct on any build — but the re-check is
outstanding.

---

## 5 · Run 357 — proven untouched BY CONTENT, never by timestamp

Ayesha's run. Snapshotted before anything, re-read at the end:

| Check | Result |
|---|---|
| Tests | **174 → 174** |
| Result records | **458 → 458** |
| Every prior result present **BY ID** | **458 of 458, 0 missing** |
| Prior results with **any** field changed | **0** |
| New results created during the session | **0** |
| `case_id` sets equal **both directions** | **yes** (a−b = 0, b−a = 0) |
| `test_id` sets equal **both directions** | **yes** |
| `include_all` | still **false** |
| Counters | 25 passed · 0 failed · 1 blocked · 148 untested — **all unchanged** |

**And all 174 cases proven byte-identical**, `updated_on` and `updated_by` included: 0 fields changed
on any case. Newest `updated_on` across the suite is **10:19:11 UTC**, before the 11:05Z start.

---

## 6 · Per-case table

**Every row reads NO in the verified column, and that is the honest state of this pass.** The build
column records the build each case's verdict genuinely rests on.

| # | Case | Section | Build-verified this pass | Build its verdict rests on | Marker | UI strings it asserts |
|---:|---|---|---|---|---|---:|
| 1 | [C29925](https://shopview.testrail.io/index.php?/cases/view/29925) | Navigation and Layout | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 2 | [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | Navigation and Layout | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 3 | [C29928](https://shopview.testrail.io/index.php?/cases/view/29928) | Navigation and Layout | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 4 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | Navigation and Layout | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 5 | [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | Navigation and Layout | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 6 | [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) | Navigation and Layout | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 7 | [C29932](https://shopview.testrail.io/index.php?/cases/view/29932) | Sidebar - Mini Calendar | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 8 | [C29933](https://shopview.testrail.io/index.php?/cases/view/29933) | Sidebar - Mini Calendar | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 9 | [C29934](https://shopview.testrail.io/index.php?/cases/view/29934) | Sidebar - Mini Calendar | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 10 | [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | Sidebar - Mini Calendar | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 11 | [C29936](https://shopview.testrail.io/index.php?/cases/view/29936) | Sidebar - Work Order List and Search | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 12 | [C29937](https://shopview.testrail.io/index.php?/cases/view/29937) | Sidebar - Work Order List and Search | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 13 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | Sidebar - Work Order List and Search | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 3 |
| 14 | [C29940](https://shopview.testrail.io/index.php?/cases/view/29940) | Sidebar - Work Order List and Search | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 15 | [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | Sidebar - Work Order List and Search | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 16 | [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) | Sidebar - Work Order Filters | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 17 | [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | Sidebar - Work Order Filters | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 18 | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | Sidebar - Work Order Filters | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 19 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | Sidebar - Work Order Filters | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 20 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | Sidebar - Work Order Filters | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 21 | [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) | Sidebar - Work Order Filters | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 22 | [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 23 | [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 24 | [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 25 | [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 26 | [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 27 | [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | Sidebar - Line Drill-Down | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 28 | [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 29 | [C29956](https://shopview.testrail.io/index.php?/cases/view/29956) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 30 | [C29957](https://shopview.testrail.io/index.php?/cases/view/29957) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 31 | [C29958](https://shopview.testrail.io/index.php?/cases/view/29958) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 32 | [C29959](https://shopview.testrail.io/index.php?/cases/view/29959) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 33 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | Drag-and-Drop Scheduling | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 34 | [C29961](https://shopview.testrail.io/index.php?/cases/view/29961) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 35 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | Drag-and-Drop Scheduling | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 36 | [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) | Scope Picker | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 37 | [C29964](https://shopview.testrail.io/index.php?/cases/view/29964) | Scope Picker | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 38 | [C29965](https://shopview.testrail.io/index.php?/cases/view/29965) | Scope Picker | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 39 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | Scope Picker | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 3 |
| 40 | [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 41 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 42 | [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 43 | [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 44 | [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 45 | [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 46 | [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | Shift Start Times and Unassigned Shifts | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 47 | [C29978](https://shopview.testrail.io/index.php?/cases/view/29978) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 48 | [C29979](https://shopview.testrail.io/index.php?/cases/view/29979) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 6 |
| 49 | [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 50 | [C29981](https://shopview.testrail.io/index.php?/cases/view/29981) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 51 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 0 |
| 52 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 1 |
| 53 | [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 0 |
| 54 | [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 0 |
| 55 | [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 56 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | Linked Series and Banners | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 57 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | Linked Series and Banners | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 58 | [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | Linked Series and Banners | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 59 | [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | Linked Series and Banners | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 60 | [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | Shift Block Anatomy | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 61 | [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | Shift Block Anatomy | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 3 |
| 62 | [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | Shift Block Anatomy | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 63 | [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | Overlap and Lane Stacking | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 64 | [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | Overlap and Lane Stacking | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 65 | [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | Overlap and Lane Stacking | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 66 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | Overlap and Lane Stacking | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 67 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | Day View Timeline | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 68 | [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | Day View Timeline | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 69 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | Day View Timeline | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 0 |
| 70 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | Day View Timeline | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 71 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | Day View Timeline | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 72 | [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | Shift Detail Modal | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 73 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | Shift Detail Modal | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 74 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | Shift Detail Modal | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 75 | [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | Shift Detail Modal | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 76 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | Shift Detail Modal | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 77 | [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | Shift Detail Modal | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 1 |
| 78 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | Shift Detail Modal | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 79 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | Shift Detail Modal | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 80 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | Events | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 81 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | Events | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 82 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | Events | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 83 | [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | Events | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 0 |
| 84 | [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | Events | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 85 | [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | Events | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 86 | [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 87 | [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 88 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 89 | [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 90 | [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 91 | [C30029](https://shopview.testrail.io/index.php?/cases/view/30029) | Conflict Detection | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 92 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | Capacity Bars | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 93 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | Capacity Bars | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 94 | [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | Capacity Bars | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 1 |
| 95 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | Capacity Bars | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 2 |
| 96 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | Hover Tooltips | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 7 |
| 97 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | Hover Tooltips | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 98 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | Hover Tooltips | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 99 | [C30037](https://shopview.testrail.io/index.php?/cases/view/30037) | Hover Tooltips | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 100 | [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | Hover Tooltips | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 101 | [C30039](https://shopview.testrail.io/index.php?/cases/view/30039) | Grid Toolbar | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 102 | [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | Grid Toolbar | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 103 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | Grid Toolbar | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 104 | [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 3 |
| 105 | [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 106 | [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 2 |
| 107 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 108 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 109 | [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 110 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 111 | [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | Filter and Display and View Options | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 112 | [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | Reassignment and Context Menu | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 113 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | Reassignment and Context Menu | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 4 |
| 114 | [C30057](https://shopview.testrail.io/index.php?/cases/view/30057) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 115 | [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 116 | [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 117 | [C30060](https://shopview.testrail.io/index.php?/cases/view/30060) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 118 | [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 3 |
| 119 | [C30062](https://shopview.testrail.io/index.php?/cases/view/30062) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 120 | [C30064](https://shopview.testrail.io/index.php?/cases/view/30064) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 121 | [C30065](https://shopview.testrail.io/index.php?/cases/view/30065) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 122 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | Keyboard Interactions | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 123 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | Keyboard Interactions | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 124 | [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | Keyboard Interactions | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 125 | [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | Color System | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 126 | [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | Color System | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 127 | [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | Color System | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 128 | [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 1 |
| 129 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 2 |
| 130 | [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 131 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 1 |
| 132 | [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 133 | [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 134 | [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 135 | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 136 | [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 3 |
| 137 | [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 138 | [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 1 |
| 139 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 140 | [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 141 | [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 142 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 143 | [C30090](https://shopview.testrail.io/index.php?/cases/view/30090) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 144 | [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 145 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | Events | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 146 | [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | Working Hours Settings | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 147 | [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | Working Hours Settings | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 148 | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | Working Hours Settings | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 149 | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | Working Hours Settings | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 150 | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | Working Hours Settings | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 151 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | Reassignment and Context Menu | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 152 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | Multi-Day Spread Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | READY | 0 |
| 153 | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | Deletion, Series Scopes and Undo | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 154 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 155 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | Edge Cases and Responsiveness | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 156 | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Cross-Module and Rewrite Regression | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 157 | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Cross-Module and Rewrite Regression | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 158 | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | Cross-Module and Rewrite Regression | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 159 | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | Cross-Module and Rewrite Regression | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 160 | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Cross-Module and Rewrite Regression | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 161 | [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API — Schedule | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 162 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | API — Schedule | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 1 |
| 163 | [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API — Schedule | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 0 |
| 164 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | API — Schedule | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 165 | [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Permissions | **NO** | `v3.5-7ec992f` (8/6/2026) | HOLD | 1 |
| 166 | [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | Navigation and Layout | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 0 |
| 167 | [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Drag-and-Drop Scheduling | **NO** | `v3.5-d122eef` (8/5/2026) | HOLD | 1 |
| 168 | [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | Reassignment and Context Menu | **NO** | `v3.5-7ec992f` (8/6/2026) | READY | 2 |
| 169 | [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Grid Toolbar | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
| 170 | [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Grid Toolbar | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
| 171 | [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | Grid Toolbar | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
| 172 | [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | Edge Cases and Responsiveness | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
| 173 | [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Grid Toolbar | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
| 174 | [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Grid Toolbar | **NO** | `v3.5-af3a6e1` (8/11/2026) | READY | 0 |
