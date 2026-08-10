# Schedule — ORPHANS: Direction 2, case → requirement — 2026-08-10

**This is the direction that finds cases whose anchor no longer exists, or whose anchor never
supported the assertion in the first place.** All 168 cases were read live from TestRail.

| | Count |
|---|---|
| Cases examined | **168 of 168** |
| **Cases citing a § that no longer exists in v27** | **0** |
| Cases with no § anchor at all | **2** — both deliberate, both declared on the case |
| **Cases whose provenance line names a source that does not support the assertion** | **5** |
| **Cases stamped with a stale specification version** | **168** |

---

## 1 · Stale anchors: zero, and that is a real result

**No case in the suite points at a section that has vanished.** All 33 requirement-bearing sections
of v27 have at least one case anchored to them except **§5.3**, which is the gap in `GAPS.md` G1.

The 8 sections with no case anchored to them, checked individually rather than assumed:

| § | Why no case is owed |
|---|---|
| §1, §1.1 | Overview and Problem statement — narrative |
| §2 | User personas — a persona table |
| §5, §8 | **parent headings with no content of their own**; their content lives in §5.1/§5.2/§5.3 and §8.1/§8.2 |
| §13 | Success metrics — business metrics, not product behaviour |
| §15 | Future considerations — explicitly out of V1 |
| **§5.3** | **the gap. New in v27. See `GAPS.md` G1.** |

---

## 2 · Five cases whose provenance line names a source that does not support the assertion

**This is the sharper form of orphaning, and it is the one this pass found.** A stale anchor is
obvious. A case that cites a section which *exists* but *does not say the thing* looks perfectly
healthy — and Rule 54's honesty clause is explicit that **a provenance line asserting a source that
does not actually support the expectation is worse than none, because it manufactures false
authority.**

**How they were found:** every case whose `refs` field flags a non-spec basis (`tech-plan`,
`derived`, `acceptance criterion`) was compared against what its **provenance line** actually names.
**15 cases carry such a flag. 10 name the real source in their provenance. 5 do not.**

**The refs are honest in all five. It is the tester-facing provenance sentence that over-claims.**

| Case | Its `refs`, verbatim | Its provenance line names | The problem |
|---|---|---|---|
| **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** *"A multi-week series keeps the same local start time across the clock change"* | `SV-8691 (§4.5 + tech-plan D2 NFR-005 DST)` | *"the Schedule specification version 23 (§4.5)"* — **and nothing else** | **the sharpest of the five.** `daylight`, `Daylight` and `clock change` appear **0 times in all 27 versions of the specification**. §4.5 is about multi-day spread and says nothing about clock changes. The whole expectation rests on the tech plan, and the case does not say so. |
| **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)** *"Schedule actions save immediately - Undo reverses them, closing does not cancel"* | `SV-8688 (§7 toast/undo + tech-plan D10)` | *"the Schedule specification version 23 (§7)"* | §7 describes toasts and Undo; **it does not say actions save immediately or that closing a modal does not cancel.** That half is tech-plan D10. |
| **SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872)** *"API - Schedule reads need View; writes need Edit; deletes need Delete (403)"* | `SV-8685 [epic] (§14 + tech-plan §4 NFR-003 permissions)` | *"the Schedule specification version 23 (§14)"* | §14 describes three permission **tiers**; it says nothing about HTTP verbs or a 403. That mapping is the tech plan's. |
| **SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** *"Sidebar search with no matching work orders shows an empty list"* | `SV-8687 (§3.1 (derived - search behavior with no matches))` | *"the Schedule specification version 23 (§3.1)"* | §3.1 says the search *"filters the card list in real time"*. **It says nothing about the empty result.** The refs admit the derivation; the provenance does not. |
| **SCH-DEL-06 = [C30062](https://shopview.testrail.io/index.php?/cases/view/30062)** *"Deleting a standalone (non-series) shift does not ask for a series scope"* | `SV-8692 (§7 (derived - scope prompt is for series shifts))` | *"the Schedule specification version 23 (§7)"* | §7 says a shift **belonging to a series** asks for scope. That a **standalone** shift does not is a sound inference, but it is an inference, and the case reads as though the spec states it. |

**The ten that get it right, for contrast** — C38863, C38867, C38868, C38869, C38870, C38871,
C38873, C38874, C38875 and C43554 all name the engineering technical plan (with its link), the
acceptance criterion, or the later PO decision in the provenance line itself. **So the house style
is correct and these five are the exceptions, not the norm.** That matters: it means the fix is five
sentences, not a policy change.

**Severity, honestly.** The two `derived` cases (C29941, C30062) are mild — the derivation is sound
and the refs disclose it. **C38865, C38864 and C38872 are the ones worth fixing**, because a reader
following the provenance to §4.5 or §7 or §14 will not find the requirement there and will
reasonably conclude the case invented it.

**Proposed:** five provenance-line corrections, `PROPOSED-CHANGES.md` **P3**. **Not executed.**

---

## 3 · The 2 cases with no § anchor — both correct

| Case | Its `refs`, verbatim | Why this is right |
|---|---|---|
| **SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** *"API - A shift from another location returns 404, not another shop's data"* | `SV-8685 [epic - cross-cutting,no single-story owner] (tech-plan NFR-001 location scoping)` | anchors to the **engineering tech plan**, a standard project input under Rule 30. The specification does not state location scoping; the tech plan does. Its provenance line says so. |
| **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** *"Schedule opens on Day view the first time you open it from the navigation"* | `SV-8863 (SV-8686 acceptance criterion - grid displays with day view as default)` | anchors to a **story acceptance criterion** because the specification is silent on the default view. Established 2026-08-05 by a pass that deliberately refused to invent a § anchor (Rule 12). Its provenance line says so. |

**Rule 20 traceability is intact across all 168: 166 spec-anchored, 2 anchored to a named non-spec
source declared on the case.**

---

## 4 · All 168 cases are stamped with a stale specification version

**Every case's provenance line reads *"the Schedule specification version 23"*. Live is
version 27.** Not one case names 24, 25, 26 or 27.

**Why this is a finding and not a formatting nit.** Rule 54 requires the provenance line to be
re-stamped whenever we re-check against the spec, and states that **a stale stamp is itself a
finding**. The stamp is the only thing on the case that tells a reader — a reviewer, an automation
engineer, a future pass — which version of the requirement the expectation was measured against.
At v23 it points a reader at a body that predates §5.3 entirely.

**And it is the mechanism behind G1.** The gap in `GAPS.md` exists because nobody re-read the spec
between v23 and today; the stamp is where that would have been visible.

**Proposed:** a single re-stamp pass over all 168, `PROPOSED-CHANGES.md` **P2**. **Not executed** —
it is 168 TestRail writes and needs the go-ahead (Rule 6).

**Honest caveat on what the re-stamp may and may not say.** Rule 54 state 2 requires the build and
the date it was tested. The 168 cases currently name two builds — **90 at `v3.5-7ec992f`** and
**78 at `v3.5-d122eef`** — from the live passes of 5 and 6 August. **No build was observed in this
pass**, so a re-stamp may correct the **specification version** and must **leave each case's build
marker exactly as it is**. Claiming a fresh build check we did not make would be the precise failure
Rule 12 exists to prevent.

---

## 5 · The 27 cases no assertion named — checked, not dismissed

The matcher names one best case per assertion, so a case that is a strong second everywhere is never
named. **27 of the 168 were never the top match for any assertion.** That is not a list of useless
cases, and each was looked at rather than waved through. They fall into four groups:

| Group | Cases | Why they are named by no assertion |
|---|---|---|
| **Regression cases** (spec-silent by design) | C38867, C38869, C38870, C38871 | they assert that the **rewrite did not break existing data** — pre-existing shifts survive, an appointment reaches the board, a multi-location tech's shift stays put, WO priority drives the sidebar. The specification describes the destination, not the migration. All four name the tech plan in their provenance, correctly. |
| **API cases** | C38872, C38873, C38875 | the spec has no API section; these rest on §14 plus the tech plan |
| **Second-best matches** | C29943, C29944, C29945, C29950, C29967, C29970, C29972, C29974, C29978, C30020, C30062, C30068, C29929, C30614, C38855, C43554 | a sibling case simply scored higher on the same assertion. e.g. §5.1's filter groups are covered by C29942 and the three per-filter cases sit behind it |
| **Beyond the spec** | C38863, C38864, C38865, C29941, C30086's siblings | caps, DST, empty state — see §2 above |

**None of them is a candidate for retirement on this evidence, and none is proposed for one.**
`delete_case` is irreversible and nothing here has earned it.
