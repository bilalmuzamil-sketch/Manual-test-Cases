# RAW-MARKUP REGRESSION — cause, repair, and the three ruling items
**2026-08-10 · Filters (group 4110) + Schedule (group 4254) · no sign-in sought, nothing observed on
either build, no build stamp refreshed**

---

## 1 · THE CAUSE — and it is not our tools

**Full trace: `TRACE.md` beside this file.** In one paragraph:

TestRail **re-renders a case's three tester-facing fields into HTML hours after our write completes,
and does not move `updated_on` or `updated_by` when it does.** Proven by two committed **live**
snapshots of the same 110 Filters cases, 2.5 hours apart with **no write in between**: ten cases
differ in `custom_preconds`, `custom_steps` and `custom_expected` **and in no other field**, while
`updated_on` is byte-identical (`1785950271`) in both. Content moved; the timestamp did not.

**Ruled out, with evidence:**

| Suspected mechanism | Verdict |
|---|---|
| Our own writes omitting a text field (declared normalisation #3) | **Ruled out.** Every executor since 5 August was read and every one sends all three text fields. The signature is wrong for #3 too: this is `<ol>`/`<li>`/`<p>`/`<br />`/`<hr />`/`<a>` with plain `\n`, not #3's `<p>` wrap with CRLF. |
| Another author editing in the TestRail UI | **Ruled out for 36 of 37** — all read `updated_by = 3`. |
| A pass that converted to plain text and reintroduced it in the same write | **Ruled out.** Each pass repaired what it saw and its re-GET proved the repair; the damage appears in the *next* pass's snapshot. |
| Our local case source authoring markup | **Ruled out.** All 195 Schedule bodies under `build/schedule/cases/` contain zero markup. |

**The trigger is the run owners working cases in the TestRail UI.** Run 357 has been graded exactly
once ever — user 5, 10 Aug 21:17–21:31 UTC — and **19 of the 20 Schedule cases were graded inside
that 14-minute window**, out of only 26 graded in the whole 168-case suite.

**The consequence that outlasts these repairs: our verification is structurally blind to this.** At
re-GET time the text is still exactly what we sent, so every pass since 5 August truthfully reported
"0 raw markup" and every one was right at the moment it looked. **No tightening of the write path can
fix it.** The defence is a **markup census at the START of every pass**, and never treating a zero
count as durable. Recorded as **declared hazard #5** in `build/APP-ACTIONS-PLAYBOOK.md` §J.

**⚠️ Expect these to come back** when a tester next works through them. The repair is necessary — a
tester who sees `<li>` cannot run the case — but it is not permanent, and only a TestRail-side change
would make it so. That is a conversation with whoever administers TestRail.

---

## 2 · THE REPAIR — 40 cases, formatting only

**37 named** (17 Filters, 20 Schedule) **+ 3 the census found.**

**Filters (20):** [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) ·
[C29561](https://shopview.testrail.io/index.php?/cases/view/29561) ·
[C29562](https://shopview.testrail.io/index.php?/cases/view/29562) ·
[C29563](https://shopview.testrail.io/index.php?/cases/view/29563) ·
[C29564](https://shopview.testrail.io/index.php?/cases/view/29564) ·
[C29565](https://shopview.testrail.io/index.php?/cases/view/29565) ·
[C29583](https://shopview.testrail.io/index.php?/cases/view/29583) ·
[C29584](https://shopview.testrail.io/index.php?/cases/view/29584) ·
[C29585](https://shopview.testrail.io/index.php?/cases/view/29585) ·
[C29586](https://shopview.testrail.io/index.php?/cases/view/29586) ·
[C29587](https://shopview.testrail.io/index.php?/cases/view/29587) ·
[C29588](https://shopview.testrail.io/index.php?/cases/view/29588) ·
[C29616](https://shopview.testrail.io/index.php?/cases/view/29616) ·
[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) ·
[C29622](https://shopview.testrail.io/index.php?/cases/view/29622) ·
[C29629](https://shopview.testrail.io/index.php?/cases/view/29629) ·
[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) ·
[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) ·
[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) ·
[C43563](https://shopview.testrail.io/index.php?/cases/view/43563)

**Schedule (20):** [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) ·
[C29929](https://shopview.testrail.io/index.php?/cases/view/29929) ·
[C29933](https://shopview.testrail.io/index.php?/cases/view/29933) ·
[C29934](https://shopview.testrail.io/index.php?/cases/view/29934) ·
[C29935](https://shopview.testrail.io/index.php?/cases/view/29935) ·
[C29937](https://shopview.testrail.io/index.php?/cases/view/29937) ·
[C29939](https://shopview.testrail.io/index.php?/cases/view/29939) ·
[C29940](https://shopview.testrail.io/index.php?/cases/view/29940) ·
[C29941](https://shopview.testrail.io/index.php?/cases/view/29941) ·
[C29943](https://shopview.testrail.io/index.php?/cases/view/29943) ·
[C29944](https://shopview.testrail.io/index.php?/cases/view/29944) ·
[C29945](https://shopview.testrail.io/index.php?/cases/view/29945) ·
[C29946](https://shopview.testrail.io/index.php?/cases/view/29946) ·
[C29947](https://shopview.testrail.io/index.php?/cases/view/29947) ·
[C29950](https://shopview.testrail.io/index.php?/cases/view/29950) ·
[C29951](https://shopview.testrail.io/index.php?/cases/view/29951) ·
[C29952](https://shopview.testrail.io/index.php?/cases/view/29952) ·
[C29953](https://shopview.testrail.io/index.php?/cases/view/29953) ·
[C29954](https://shopview.testrail.io/index.php?/cases/view/29954) ·
[C29978](https://shopview.testrail.io/index.php?/cases/view/29978)

**The three beyond the 37**, all the same defect class (the tester is shown tags):
**C29560** — the one case damaged by the *other* mechanism, declared normalisation #3: its whole body
carried the `<p>` wrap with `\r\n`, its separator was `-------------` instead of `---`, and its
**automation marker was sharing a line with the provenance sentence**. Repaired by hand to the house
form; content words identical (32 / 22 / 86 across the three fields).
**C29616** and **C38904** — anchor tags around their links, where the visible text is the URL itself.

**Nothing but formatting changed.** Every field was checked by comparing the word sequence before and
after with list markers removed: **0 of 120 fields lost or gained a word, and 0 tags were left
unconverted.** Conversion rules: `<ol>`/`<li>` → numbered lines · `<p>` → blank-line separated blocks
· `<br />` → line break · `<hr />` → `---` · `<a href>` → its visible text · `&nbsp;` → space · the
house separator restored to exactly `\n\n---\n`, matching the 243 clean cases.

---

## 3 · THE THREE RULING ITEMS

### (a) C38880's HOLD reason was false — corrected, hold left in place
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) read
`AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up - the behaviour this case
asserts is not documented anywhere yet`. **It is documented.** `S10-R4`, quote-verified from the live
Confluence v19 body:

> *"Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions.
> Persistence and scope are separate concerns: **each Parts view and each Report tab keeps its own
> separate filter set** (see Key Decisions), **and each of those sets persists independently** on the
> terms in S10-R2"*

That is exactly what the case asserts. The reason now reads
`AUTOMATION: HOLD - held for the QA lead's ruling only - the behaviour IS documented (S10-R4 …), so
the earlier reason that no source described it was wrong`. **The HOLD itself was left standing** — it
is a readiness claim and the arithmetic is yours.

### (b) C29621 — provenance added, properly sourced
[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) now carries a provenance line, and
it is **honest about the split**, because the case asserts two things with two different sources:

* the **row and its horizontal scrolling** come from the specification — `S12-R1`, quote-verified live
  from v19: *"The filter chips are displayed in a horizontally scrollable row below the tab
  navigation"*;
* the **'All Filters' chip does not appear in the specification at all** — the only *"All Filters"*
  string in the whole v19 body is `S8-R1`'s phrase *"across all filters"*. It comes from the
  **engineering technical plan, decision D15**, quoted verbatim there: *"Mobile "All Filters" combined
  bottom sheet — **IN**, with an "Apply filters" button …"*, and the plan's own design-frame table
  lists the sheet at `11884:13689`.

So the line names the specification for the first half and **names the tech plan with its link** for
the second, per Rule 54's named-source-file form. **No build stamp was added** — nothing was observed.
Its malformed marker (a stray leading space, no clean blank line) was normalised in the same write.

### (c) C29600 — DELIBERATELY LEFT ALONE, and this is the finding
[C29600](https://shopview.testrail.io/index.php?/cases/view/29600) **still has no provenance line, on
purpose**, because it could not be sourced honestly — and the attempt turned up something worse.

Its `refs` reads `SV-8793 (§2 Feature Overview (multi-criteria); S8-R3 ('combination of active
filters')) [spec v19 2026-08-06]`. **`S8-R3` does not support this case.** Read whole, live:

> *"S8-R3: When the combination of active filters and any active search query produces **no matching
> records**, the table shows an **empty state** …"*

`S8-R3` is the **empty-state** requirement. C29600 asserts the **opposite** — that two filters
together show *"exactly the intersection of both filters in the table"*. The `refs` has taken the
fragment *"combination of active filters"* out of a sentence that is about finding nothing.

**And no numbered requirement in v19 states that two different filters combine as an intersection.**
The whole document was searched: the only AND statement is `S13-R10`, and that is **search versus
filters**, not filter versus filter. *"Multi-criteria"* appears exactly twice, both in unnumbered
prose — the Background and the Goals (*"Allow multi-criteria filtering in a single interaction"*).

Writing a provenance line here would have meant citing a requirement that says something else.
**A provenance line asserting a source that does not support the expectation is worse than none**
(Rule 54), so nothing was written. **The `refs` mis-citation is reported, not repaired** — repairing
it needs a correct anchor, and there is not one to give.

**What it needs:** either Branko confirms that filters combine as AND and the specification gains a
requirement for it, or the QA lead rules that the Goals sentence is basis enough and the case cites
that in words. **One sentence from either of them closes it.**

---

## 4 · COVERAGE GAP RECORDED, NOT AUTHORED

**Schedule `§5.3 Panel collapse`, new in Confluence v27, has no case.** It is a whole feature — an
icon button that collapses the left work-order sidebar. **Nothing was authored**: the standing hold is
*"Do not create anything until my next order"* and `add_case` is barred. Recorded here and already
recorded in `build/schedule/source-accuracy-2026-08-10/SOURCE-ACCURACY.md` §8.

No internal id was reserved and none should be invented before you rule — the 27 July-retired ids on
this project are marked never-reuse, and picking one now would only risk colliding with that list.

---

## 5 · WHAT WAS WRITTEN, AND THE PROOF IT DID NO DAMAGE

**41 `update_case` over 41 distinct cases. Every one HTTP 200, 30 fields compared each, 0 mismatches,
0 collateral changes.** All three text fields sent explicitly on every payload — the very defence at
issue here. Payload shape asserted **before** each send: no markup, at most one provenance line, at
most one automation marker, marker last.

**0 `add_case` · 0 `delete_case` · 0 section operations · 0 run writes · 0 results logged · nothing
created in any external system**, per the standing hold. No sign-in was sought for either branch;
`quick-login` and `switch-user` were **not** called. **No build stamp was refreshed on any case** —
nothing was observed, so a fresh date would be a claim we cannot support.

### Census of all 282 of our cases across both projects

| Check | Filters | Schedule |
|---|---:|---:|
| Cases that are ours / live total | 114 / 119 | 168 / 168 |
| Carrying `<ol>` or `<li>` | **0** | **0** |
| Carrying **any** HTML tag in the three tester-facing fields | **0** | **0** |
| More than one provenance line | 0 | 0 |
| More than one automation marker | 0 | 0 |
| Marker present but not the last line | 0 | 0 |

**0 of 282.**

### Runs 352 (Ahtasham's) and 357 (Ayesha's) — proven untouched BY CONTENT

| | run 352 | run 357 |
|---|---|---|
| `include_all` | false → **false** | false → **false** |
| tests | 114 → **114** | 168 → **168** |
| test-id and case_id sets equal **both directions** | **yes** | **yes** |
| result records | 473 → **473** | 458 → **458** |
| prior results present **BY ID** | **all 473** | **all 458** |
| graded fields changed on any result | **0** | **0** |
| derived fields (`case_title`, `case_refs`) moved | **none** | **none** |
| counters | 65 P / 7 F / 0 B / 42 U — unchanged | 25 P / 0 F / 1 B / 142 U — unchanged |

**The 246 cases we did not write are byte-identical, including `updated_on` and `updated_by`** — and
that includes **all five of Ahtasham's foreign cases** (C43576–C43580), untouched per Rule 38.

---

## 6 · OUTSTANDING — what I need from you

1. **A decision on the TestRail re-render itself (§1).** The 40 repairs will not hold. Somebody with
   TestRail admin needs to look at whether the case text format can be pinned to plain text; until
   then this recurs every time a tester works through a batch.
2. **C29600 (§3c)** — either Branko confirms that two filters combine as an intersection and the
   specification gains a requirement, or you rule that the Goals sentence is basis enough. Its `refs`
   currently cites the empty-state requirement, which says something else.
3. **A ruling on C38880's HOLD (§3a)** — the false sentence is gone; whether the case now goes READY
   is yours.
4. **`§5.3 Panel collapse` (§4)** — a Schedule feature with no case, and authoring is barred by the
   creation hold.
5. **A sign-in for `sv8785` and `sv8685`**, whenever it is worth spending. Nothing here was observed
   on either build, so the steps-and-labels half of the VIU stays unchecked on both projects.
