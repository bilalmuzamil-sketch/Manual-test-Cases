# Expect-fail marker audit — Filters and Schedule, 2026-08-11

**The ruling this pass applies, verbatim (QA lead, 2026-08-11):**

> "WHen there is nothing to back 'Expect fail' then not set that marker. And let the manual QA tester
> simply discover whether this test fails or passes and mark the test case accordingly in the tesrail"

An expect-fail marker with no live source behind it is a prediction dressed as a fact: it tells a tester —
and the automation — to ignore a failure that may no longer exist. Where nothing backs it, the marker comes
off, the case carries plain `AUTOMATION: READY`, and the tester discovers the outcome and records it.

---

## 1 · The headline

| | Filters | Schedule | Both |
|---|---:|---:|---:|
| Expect-fail markers found (re-derived live) | **15** | **21** | **36** |
| **BACKED — marker kept** | **7** | **0** | **7** |
| **NOT BACKED — marker removed** | **8** | **21** | **29** |

**Not one of Schedule's 21 expect-fail markers was backed.** Every ticket behind them has either been
closed or has been fixed and QA-verified. All 21 came off.

All seven survivors are on Filters, and they rest on just three tickets: [SV-8832](https://shopview.atlassian.net/browse/SV-8832) (4 cases), [SV-8875](https://shopview.atlassian.net/browse/SV-8875) (2), [SV-8912](https://shopview.atlassian.net/browse/SV-8912) (1).

---

## 2 · The finding that decided most of this pass

**The Jira status *name* and the Jira status *category* disagree, and the category is the misleading one.**

Twelve tickets sit at status **`QA Complete`**, whose `statusCategory` is **`indeterminate` / "In Progress"**.
Read off the category alone, those twelve look open — and every marker resting on them would have been kept.

Reading six of their changelogs live settles it. The workflow is:

```
Open -> Ready to Fix -> In Progress -> Code Review -> Ready for QA -> TESTING QA -> QA Complete
```

`QA Complete` is the **terminal** state: a developer wrote the fix, it shipped, and a QA tester verified it.
So those twelve defects are **fixed**, and the twelve markers resting on them were asserting a failure that
had already been repaired. Evidence: `tools/cl.py` output, `jira.json`.

**`Ready for QA` (3 tickets) also means the fix is already in the build** — written, code-reviewed and
deployed for QA to test. Those three were the ones most worth checking live, and all three are fixed.

---

## 3 · Per-marker table — all 36

Verdict rules applied: a ticket **open and still describing the failure** = backed; a ticket **closed,
obsolete, or describing a symptom that has changed** = not backed; **no ticket, or one naming something we
never established** = not backed.

| Case | Ticket | Ticket state (live) | Lifecycle | Symptom still matches? | Verdict | Action |
|---|---|---|---|---|---|---|
| [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | [SV-8883](https://shopview.atlassian.net/browse/SV-8883) | QA Complete | FIXED+QA-VERIFIED | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | [SV-8986](https://shopview.atlassian.net/browse/SV-8986) | OBSOLETE | CLOSED | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE | CLOSED | ⚠ YES, but ticket closed | **NOT BACKED** | marker removed |
| [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE | CLOSED | ⚠ YES, but ticket closed | **NOT BACKED** | marker removed |
| [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Open | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Ready for QA | FIX SHIPPED, awaiting QA | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Open | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Open | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | [SV-8875](https://shopview.atlassian.net/browse/SV-8875) | Ready to Fix | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | [SV-8875](https://shopview.atlassian.net/browse/SV-8875) | Ready to Fix | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Ready for QA | FIX SHIPPED, awaiting QA | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Open | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | Ready to Fix | NOT YET FIXED | YES — live | **BACKED** | **keep + repair note** |
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE | CLOSED | ⚠ YES, but ticket closed | **NOT BACKED** | marker removed |
| [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | [SV-8826](https://shopview.atlassian.net/browse/SV-8826) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | [SV-8873](https://shopview.atlassian.net/browse/SV-8873) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | [SV-8840](https://shopview.atlassian.net/browse/SV-8840) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | [SV-8924](https://shopview.atlassian.net/browse/SV-8924) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | [SV-8958](https://shopview.atlassian.net/browse/SV-8958) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | [SV-8837](https://shopview.atlassian.net/browse/SV-8837) | Ready for QA | FIX SHIPPED, awaiting QA | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | [SV-8833](https://shopview.atlassian.net/browse/SV-8833) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | [SV-8834](https://shopview.atlassian.net/browse/SV-8834) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | [SV-8893](https://shopview.atlassian.net/browse/SV-8893) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | [SV-8874](https://shopview.atlassian.net/browse/SV-8874) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | [SV-8941](https://shopview.atlassian.net/browse/SV-8941) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | [SV-8827](https://shopview.atlassian.net/browse/SV-8827) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | [SV-8942](https://shopview.atlassian.net/browse/SV-8942) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | [SV-8913](https://shopview.atlassian.net/browse/SV-8913) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | OBSOLETE | CLOSED | not re-checked | **NOT BACKED** | marker removed |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | [SV-8863](https://shopview.atlassian.net/browse/SV-8863) | QA Complete | FIXED+QA-VERIFIED | NO — live, fix confirmed | **NOT BACKED** | marker removed |
| [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | [SV-8867](https://shopview.atlassian.net/browse/SV-8867) | QA Complete | FIXED+QA-VERIFIED | not re-checked | **NOT BACKED** | marker removed |

---

## 4 · The live symptom checks

**Every one of the 10 markers that could plausibly have been kept was driven live**, because keeping a marker
is an active assertion. Six of the 26 closed/fixed ones were spot-checked as well. Build markers:
**Filters `v3.6-3de5dcb`** (last-mod Mon 10 Aug 2026 16:06:31 GMT, etag `1ea90bedf9277f8b700f19ed1dea7c72`)
and **Schedule `v3.5-af3a6e1`** (last-mod Mon 10 Aug 2026 21:59:27 GMT, etag `0708dbc8bc1fe805e835a2f86d05abfb`),
each read at session start and again immediately before the writes — **`index.html` byte-identical both times
on both branches**, so nothing redeployed under the pass. `quick-login` and `switch-user` were never called.

### 4.1 · Confirmed still failing — these keep their markers

**[SV-8832](https://shopview.atlassian.net/browse/SV-8832) — Open.** A `company_id` the system does not
recognise, carried in the address bar: the URL keeps it, and the request to the server **still carries**
`filters[0][value]=00000000-dead-…`. The Customer chip reads plain `person Customer` with no value name, and
the list comes back on an empty state. That is the ticket's symptom exactly. → **backed**, 4 cases.
*Scope limit, stated plainly:* I used an id that **never existed** rather than one **deleted during the
session**. The pass-through behaviour the ticket describes is the same and was observed directly, but the
delete-then-return path itself was not re-driven. Evidence `evidence/ev-8832.png`.

**[SV-8875](https://shopview.atlassian.net/browse/SV-8875) — Ready to Fix.** At 390 × 844, tapping one value
in a single chip's own sheet applied it **immediately** — the URL changed to `?status=estimate&tab=all`, a
`/api/work-orders` request fired, and the sheet closed. **No "Apply filters" button exists anywhere in that
sheet** (`Clear Selection` is the only action). The Customer sheet does have a `filter_search_company_id`
search box, but behaves the same way: one tap on *Iibay Landscaping* changed the URL and closed the sheet,
with no removable tags. → **backed**, 2 cases. Evidence `ev-8875-sheet.png`, `ev-29625-customer.png`.

**[SV-8912](https://shopview.atlassian.net/browse/SV-8912) — Ready to Fix.** At 390 × 844 there is no
`page_search_toggle` at all. Tapping the magnifier (`button_open_mobile_search`) opens
`select_global_search`. → **backed**, 1 case. Evidence `ev-8912-magnifier.png`.

### 4.2 · Confirmed fixed — the three where the fix had shipped and nobody had noticed

These are the valuable ones: the ticket was still open in the sense of "not closed", so status alone would
have kept the marker, and the marker would have told a tester to ignore a passing test.

**[SV-8845](https://shopview.atlassian.net/browse/SV-8845) — Ready for QA — FIXED.** The reported symptom was
that on a phone *every* filter link is ignored and `estimate` is sent instead, showing 30 Estimates whatever
you asked for. Now the links are honoured: `?status=declined` sends `declined` and lists **7** cards,
`?status=paid` sends `paid` and lists **30**. → marker removed from
[C29618](https://shopview.testrail.io/index.php?/cases/view/29618).

**[SV-8846](https://shopview.atlassian.net/browse/SV-8846) — Ready for QA — FIXED.** The reported symptom was
that a phone has no Clear Filters button at all. With a filter on, the page now carries **two**:
`clear_filters :: Clear Filters` and `empty_state_clear_filters_mobile :: Clear Filters`. → marker removed
from [C29628](https://shopview.testrail.io/index.php?/cases/view/29628). Evidence `ev-8845-8846.png`.

**[SV-8837](https://shopview.atlassian.net/browse/SV-8837) — Ready for QA — FIXED.** Day view now opens
scrolled to the working-day start: at 1100px the first hour visible past the frozen technician column is
**6 AM**, not midnight. → marker removed from
[C30001](https://shopview.testrail.io/index.php?/cases/view/30001).
*Worth recording, because it nearly produced a wrong verdict:* reading the DOM alone said "12 AM at x=242"
and looked like a reproduction. The hours from 12 AM to 5 AM are simply **hidden behind the sticky left-hand
column**. Only the screenshot settled it. Evidence `ev-8837-1100.png`.

### 4.3 · Spot-checks on the closed/fixed group

| Ticket | State | Observed live | Note |
|---|---|---|---|
| [SV-8863](https://shopview.atlassian.net/browse/SV-8863) | QA Complete | `Day` carries `aria-pressed="true"` on arrival | fix shipped |
| [SV-8883](https://shopview.atlassian.net/browse/SV-8883) | QA Complete | filter chip top `y=144`, tab row bottom `y=125` — the bar is on its own row **below** the tabs | fix shipped |
| [SV-8986](https://shopview.atlassian.net/browse/SV-8986) | OBSOLETE | chips now render leading type-icons — `person Customer`, `build Lead Technician`, `headset_mic Service Advisor`, `local_shipping Asset on Site` | fix shipped |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE | **still reproduces** — see below | closed anyway |

---

## 5 · 🔴 One closed ticket still reproduces — and the verdict is the same either way

**[SV-8847](https://shopview.atlassian.net/browse/SV-8847) is closed OBSOLETE / Done, and its symptom is still
present.** With only a page search active and no matches, the empty screen still offers
`empty_state_clear_filters :: Clear Filters` — which is exactly what the ticket said was unhelpful.
Three cases named it: [C29606](https://shopview.testrail.io/index.php?/cases/view/29606),
[C29607](https://shopview.testrail.io/index.php?/cases/view/29607),
[C38897](https://shopview.testrail.io/index.php?/cases/view/38897). Evidence `evidence/ev-8847.png`.

**The marker still comes off, and this is the case that shows why the ruling is right.** Those three cases
told the tester the fault *"was closed without a fix, so do not expect it to change"* — i.e. **do not report
it**. But the organisation has closed the ticket. So if it still fails, that is a live finding nobody is
tracking, and the only person positioned to surface it is the tester in front of the screen. Removing the
marker converts a suppressed failure into a reported one.

That is the general shape: **for a closed or fixed ticket the marker is wrong either way** — if the fault is
gone the marker was a lie, and if the fault remains the marker was suppressing a regression.

---

## 6 · The six Panel collapse cases — `HOLD` released

[C43582](https://shopview.testrail.io/index.php?/cases/view/43582) ·
[C43583](https://shopview.testrail.io/index.php?/cases/view/43583) ·
[C43584](https://shopview.testrail.io/index.php?/cases/view/43584) ·
[C43585](https://shopview.testrail.io/index.php?/cases/view/43585) ·
[C43586](https://shopview.testrail.io/index.php?/cases/view/43586) ·
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)

They carried `AUTOMATION: HOLD - the panel collapse control is not in the build`, which was wrong on both
counts. The control's **absence is perfectly observable**, so this is not a genuinely unobtainable thing and
never qualified as a `HOLD` under Rule 61; and there is no ticket, so it could not be an expect-fail either.

All six are now **plain `AUTOMATION: READY`**, and the predictive note — *"Until that button exists this test
cannot be run: mark it Blocked"* — is replaced by:

> Run this test as written and mark it on what you actually find. When it was last checked, on 11 August 2026,
> the Schedule toolbar had no panel button at all - the button furthest to the left above the grid was Today -
> so on that build steps 1 to 8 cannot be carried out and this test FAILS. Mark it failed if that is still
> what you see. If the button is there and behaves as described, mark it passed.

**The absence was re-confirmed live** on `v3.5-af3a6e1`: the leftmost control above the grid is `Today`
(`evidence/ev-8837-1100.png` shows the toolbar). **The sourcing is untouched** — spec v27 §5.3 is still quoted
and still correct. **A Blocked result hides a gap; a Failed result surfaces it**, which is the whole point.

**[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) keeps its open question** about whether
hiding the panel should survive a new sign-in (the PO's 7 August description says session-only, the design
implies otherwise). That is a Rule-56 divergence disclosure and it stays in the case text.

---

## 7 · The provenance read-date

A requirement landed today: the provenance line must record **the date the source was read**. Both specs were
re-read live from Confluence at **2026-08-11T06:48:51Z**:

| Spec | Live version | Last edited | Our cases cite | Verdict |
|---|---:|---|---|---|
| Schedule, page 713031682 | **27** | 2026-08-07T15:01:20Z | version 27 | **CURRENT** |
| Filters, page 572030978 | **19** | 2026-08-06T11:48:47Z | Confluence version 19 | **CURRENT** |

So `, read on 11 August 2026` was added to **41 of the 42** cases, attached **directly to the spec citation**
rather than to the end of the sentence — five cases name a PO answer or a divergence in the same line, and a
date at the end would have implied we re-read Branko's answers today, which we did not.

**The 42nd was deliberately left undated.** [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)
takes its expectation from **story SV-8686's acceptance criterion**, not from the specification, and story
SV-8686 was **not** re-read today. Back-filling a date there would be a fabricated observation.

This matches the recorded form of the amendment (CLAUDE.md, commit `653df943`): *"where a case cites more than
one source, each carries its own date"*, and *"where a pass re-reads the spec but not the epic, only the
spec's date moves."* On the 41 dated cases the **epic keeps no date** and, on the five cases that also cite a
PO answer or a divergence, **that answer keeps no date either** — neither was re-read today.

**⚠️ This is not the read-date sweep.** Only the 42 cases this pass touched are dated. The cross-project sweep
is registered as outstanding item **D1** and remains **NOT done**, so neither Filters nor Schedule may be
described as compliant with the amendment on the strength of this pass.

---

## 8 · Honest limits

1. **The 26 closed/fixed markers were not all live-checked.** Six were. For the other 20 the verdict rests on
   the ticket's live lifecycle state, which under the ruling is sufficient — a closed or QA-verified ticket
   backs nothing. But it means **this pass does not claim to know whether those 20 symptoms still occur**.
   That is now exactly the tester's job, which is the intended outcome.
2. **SV-8832 was proven with a never-existed id, not a deleted one** (§4.1).
3. **No case's expected behaviour was changed** — not one numbered expectation was touched on any of the 42.
   Only the predictive note, the marker and the read-date moved.
4. **The branches are not declared final**, so every verdict here stays PROVISIONAL (Rule 49).
5. **`AUTOMATION: READY` asserts *automatable*, not *currently passing*.** Removing 29 expect-fail markers
   does not claim 29 tests now pass; it means nobody is told the answer in advance.

---

## 9 · 🔴 Two pre-existing defects found, reported and NOT repaired

**(a) [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) carries no automation marker and no
provenance line at all.** It is the single reason the Filters arithmetic gate cannot close (see
`MARKER-COUNTS.md`). It predates this pass — the marker census found it missing before any write — and it was
also flagged in `build/filters/source-accuracy-2026-08-10/SOURCE-ACCURACY.md` §8b. **Not repaired:** it has
nothing to do with expect-fail markers, and restoring a provenance line is its own authorised pass.

**(b) [SV-8847](https://shopview.atlassian.net/browse/SV-8847) is closed while its fault persists** (§5).
Whether to reopen it is the QA lead's call. **No Jira field was read-modified: zero Jira writes this pass.**

---

## 10 · OUTSTANDING — what I need from you

1. **A ruling on [SV-8847](https://shopview.atlassian.net/browse/SV-8847)** — closed OBSOLETE, still
   reproducing. Reopen, or leave it for the tester to re-raise? Ticket state is yours.
2. **Go-ahead to repair [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)** — one write adds
   back a marker and a provenance line, and the Filters gate then closes at 94.
3. **Nothing else is blocked.** The 12 `QA Complete` fixes and the 3 `Ready for QA` fixes need no action from
   you; their cases are now plain READY and the testers will confirm them in the ordinary course.
