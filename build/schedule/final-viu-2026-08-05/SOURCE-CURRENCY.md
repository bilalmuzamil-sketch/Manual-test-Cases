# Schedule — SOURCE CURRENCY, 5 August 2026 (final VIU pass)

Standing Rule 31 pre-flight. Every source established BEFORE any observation or write.
Verdicts: **CURRENT** / **STALE** / **PARTIAL** (a PARTIAL source names its exact shortfall).

## The block

| # | Source | Identifier | Version / last-updated | Checked (UTC) | Verdict |
|---|---|---|---|---|---|
| 1 | Specification | Confluence page **713031682** "Schedule" | **Confluence version 23**, last edited **2026-07-30T10:40:32Z** by Branko Cicovic | 2026-08-05 13:2x | **CURRENT** |
| 2 | Epic + child stories | **SV-8685** | 26 direct children; 15 stories all `Ready for QA`; SV-8812 `Done` | 2026-08-05 13:2x | **CURRENT** |
| 3 | Story defects (subtasks) | subtasks of SV-8686…SV-8700 | **22**, newest SV-8877 (Mudassir Qamar, 5 Aug) | 2026-08-05 13:2x | **CURRENT** |
| 4 | Our own defect tickets | SV-8848 … SV-8857 | **all 10 still `Open`**, priority Low, parent SV-8685 | 2026-08-05 13:2x | **CURRENT** |
| 5 | Designs | — | **NONE EXISTS.** Schedule is a spec-only project (user confirmed 2026-07-21). No Figma file, no Rule-35 fetch queue | 2026-08-05 | **N/A — not a shortfall** |
| 6 | Engineering tech plan | ingested `build/schedule/tech-plan-2026-07-29/` | unchanged since 29 July | 2026-08-05 | **CURRENT** |
| 7 | PO answers | `build/schedule/branko-answers-2026-07-31/` | unchanged; **2 questions never sent** (see below) | 2026-08-05 | **PARTIAL** |
| 8 | Build | `https://sv8685.qa.shopview.com` | **v3.5-be42149** | start / mid / end — see FINDINGS.md | **CURRENT, but NOT DECLARED FINAL** |

## 1 — the specification: CURRENT, and proven by content, not by a number

`GET /wiki/rest/api/content/713031682?expand=version,body.storage` → HTTP 200.

- **Confluence version: 23.** Last edited **2026-07-30T10:40:32.155Z** by **Branko Cicovic**, edit
  comment empty.
- **The in-body "Version" field reads `1.0`.** This is the **Rule 31(a) trap, confirmed live again** —
  the document's own version field has never moved while the real page version has reached 23. It is
  how this spec once drifted five versions unnoticed. **Go by the Confluence number.**

**The decisive proof of currency is the DATE, not the number:** the page has not been edited since
**30 July**, and our mirror `build/schedule/requirements.md` was ingested and annotated *after* that
(it carries `[v22 …]` and `[v23 …]` change markers in the body). **Nothing has changed under us.**

**Content diff, run anyway rather than trusting the date** (live body 58,584 chars → 5,337 normalised
words; mirror 9,156 words — the mirror is a superset because it carries our anchors and QA notes):

- **33 runs of 6+ words** appeared as "present live, absent from the mirror".
- **All 33 were resolved as boundary artefacts, individually, not waved away.** Each one straddles a
  point where our mirror *inserts* an annotation between two live blocks, so the n-gram spans a join
  that only exists in the live copy. Worked examples:
  - live `…counts toward capacity (see §4.12) | §4.12 Capacity Visualization…` — mirror has
    `…see §4.12` **`*[v19 new]* QA note — open with Branko…`** in between.
  - live `…at a glance (no per-day rescaling). Amber spill…` — mirror has **`*[v19 — changed]*`**
    in between.
  - live `…not a security boundary. §14.4 Technician grid rows…` — mirror has the same sentence, then
    a **QA note** block, then §14.4.
  - live `15 technicians × 7 days × several shifts` — mirror has the same sentence; the only
    difference is the multiplication sign, a character-level artefact of normalisation.
- **Genuine new or changed requirement text found: NONE. Zero requirements changed, so there is no
  Rule-43 verdict row to write** — the per-requirement verdict table is empty *because the diff is
  empty*, which is stated here explicitly rather than left as silence.

## 2, 3, 4 — the epic: CURRENT, and four of our own recorded facts re-confirmed as corrected

Verified **two independent ways**, per Rule 37 Tier 1:

| Query | Result |
|---|---|
| `parent = SV-8685` | **26** issues, `isLast: true` (no paging remainder) |
| `"Epic Link" = SV-8685` | **26** issues, `isLast: true` |
| Key sets compared **both directions** | **equal** — `way1 − way2 = ∅`, `way2 − way1 = ∅` |

**The corrected facts established earlier today are re-confirmed, all four:**

1. The epic has **26 direct children, NOT 28.** Our older record was wrong.
2. The **12 tickets we once filed away as "epic-level Bugs" are `Story Defect` SUBTASKS of the
   stories**, not epic children — which is exactly why the child count was overstated.
3. The **SV-8826–8841 range is 16 tickets, of which 4 are not Schedule at all** — confirmed here by
   their absence from both queries: **SV-8828, SV-8832, SV-8836, SV-8838** do not appear as Schedule
   story defects (2 are Ahtasham Amjad's Filters defects on SV-8795, 2 are Ryan Fyfe's unparented Bugs).
4. **Story defects number 22, not 12.**

**The 26 children:** 15 stories **SV-8686…SV-8700, every one `Ready for QA`** · **SV-8812** `Done`
(the QA-environment task — the ticket for the very branch we are testing on) · **our 10 defect
tickets SV-8848…SV-8857, every one still `Open`.**

**The 22 story defects** — 12 from Mudassir Qamar (4 Aug), 3 more from Mudassir (5 Aug: SV-8873,
SV-8874, SV-8877), 7 from Ayesha Khan (4 Aug). Four are `Ready to Fix` (accepted): SV-8826, SV-8831,
SV-8840, SV-8841, plus SV-8863, SV-8868, SV-8873. The rest are `Open`.

**SV-8877 is new since our last check** (Mudassir, 5 Aug — "Conflict list does not show which
technician or day each conflict belongs to").

### Our ten tickets — every one read live, every one still Open

| Ticket | Status | What it reports |
|---|---|---|
| SV-8848 | **Open** | every time on the Schedule shows six hours later than scheduled |
| SV-8849 | **Open** | a multi-day series shift cannot be opened from Week view |
| SV-8850 | **Open** | "+N more" on a crowded day opens an empty box |
| SV-8851 | **Open** | Tech Hours option in View Options changes nothing |
| SV-8852 | **Open** | shift window warns of a clash but offers no way to fix it |
| SV-8853 | **Open** | Escape and Enter do not work on the confirmation windows |
| SV-8854 | **Open** | a user barred from work orders can still read the work-order detail |
| SV-8855 | **Open** | the spread window has no start date |
| SV-8856 | **Open** | dragging sideways in Day view jumps a whole hour |
| SV-8857 | **Open** | sidebar filters have no "Clear all" |

**None is fixed.** The only movement on any of them since filing is a label (`FS-Schedule`) added by
Mudassir Qamar. So the 19 product-is-wrong verdicts are expected to still reproduce — **expected is
not observed**, and each is re-driven live in FINDINGS.md.

## 5 — designs: not a shortfall

Schedule has **no design source at all** and never has. It is a **spec-only project**, confirmed by
the user on 2026-07-21. There is **no Figma file, no node set, and no Rule-35 fetch queue** — so
"designs" is **N/A**, not PARTIAL. Recording it as a gap would be inventing one.

## 7 — PO answers: PARTIAL, and the shortfall is ours to own

Branko's 31 July answers are ingested and unchanged. The shortfall:

**The shop-closures question has NEVER BEEN SENT.** It was drafted on **22 July** and sits in
`build/schedule/PO-Questions-Branko-Schedule-2026-07-27.md`. Two cases wait on it —
**SCH-SPREAD-07 = C29983** and **SCH-EDGE-05 = C30089**. Their HOLD markers therefore say the
question **has not been sent**, rather than implying Branko is sitting on it. That distinction is
the honest one and it is a Rule 36/48 outstanding item against us, not against him.

Two further items are settled and must **not** be re-asked: Branko's rulings on the vehicle
identifier and on money in the shift modal, which **contradict** Mudassir's SV-8835 and SV-8829.
Per Rule 33 **the rulings STAND**; neither side was changed.

## 8 — the build: CURRENT, and NOT FINAL

`<meta name="app-version" content="v3.5-be42149" />`, `last-modified: Wed, 05 Aug 2026 08:09:19 GMT`,
`etag: "70e496609e155994b93f515db32d0289"`. Read at **start**, **midpoint** and **end** of the pass —
the exact values and timestamps are in FINDINGS.md.

**The branch has NOT been declared final.** Every verdict in this pass is therefore **PROVISIONAL**
under Standing Rule 49, the re-check queue stays **OPEN**, and no part of this pass may be described
as settled truth. What it is: the first fully-observed Schedule pass against this build.

## Access note

The QA-branch session worked on **raw cookies alone**. `POST /api/quick-login` was **deliberately
never called** — it rotates the shared `sv_sso_session` and two other workers are live on other
branches with that same session. Rotating it would have signed them out mid-run.
