# SOURCE ACCURACY — Schedule, 2026-08-10

**Scope: all 168 Schedule cases. No sampling.**
Live under group 4254 there are **168** cases and **every one is ours** — **ours 168 / live total
168**. There are **no foreign cases** on this project.

**This file answers one question per case: is the tester being sent to the right requirement?**

---

## 0 · The environment, stated up front

| | |
|---|---|
| **Signed-in session** | 🔴 **None, and none was sought.** `quick-login` and `switch-user` were **not** called. |
| **Build** | **Not read, deliberately.** Nothing was observed on the application. |

**So nothing here claims to have been seen on the running build.** No build stamp was refreshed on
any case: every case still names the build it was genuinely last checked against (`v3.5-7ec992f` or
`v3.5-d122eef`). A fresh date would be a claim we cannot support (Rule 12).

**The steps-and-labels half of a VIU therefore stays unchecked for this project.** That is the
honest limit of this pass.

## 0.1 · The source, verified live from Confluence `version.number`

| Page | **Live version** | Last edited | Our cases cited |
|---|---:|---|---|
| Schedule, page 713031682 | **27** | 2026-08-07T15:01:20Z | **v23 on 168 of 168** |

⚠️ The page **body** still reads *"Version: 1.0"* and has for its whole life. That is the Rule-31(a)
trap, confirmed again. Every number in this pass is the Confluence `version.number`.

---

## 1 · THE HEADLINE

**Position now: 168 of 168 cite a verified-correct source.** Was **0 of 168**.

| Found at the start | Cases |
|---|---:|
| **Provenance line cited a spec version that is no longer live** | **168 — every single one** |
| Cited the live version already | **0** |
| **`refs` naming a spec version that is no longer live** | **2** (only 2 name one at all) |
| **Cited a requirement anchor that does not exist in the live spec** | **0** |
| **Cited a requirement whose text CHANGED under the bump** | **3** |
| **Provenance crediting the spec for something the spec does not say** | **3** |
| `refs` missing a Jira ticket (Rule 20) | **0** |
| Cases carrying raw `<ol>`/`<li>` markup shown literally to the tester | **20** ⚠️ |

**The good news first: not one of the 168 points at a section that does not exist.** Every `§`
reference was located in the live body.

**Four versions of drift on every single case** is the headline, and the mechanism was known: v17–v26
carry ten consecutive **empty** version comments, so nothing announced itself.

---

## 2 · Why the re-stamp is safe — and the three places it was not

**v23, v24, v25, v26 and v27 were all fetched and diffed section by section**, not by eye. The
Schedule specification addresses requirements by numbered **section** (`§4.5`), not by `S#-R#`
anchors, so the diff was built over its 41 sections.

| Step | Sections | Added | Removed | **Text changed** |
|---|---:|---|---|---|
| v23 → 24 | 40 → 40 | none | none | **`§6`** |
| v24 → 25 | 40 → 40 | none | none | **`§4.9`** |
| v25 → 26 | 40 → 40 | none | none | **`§4.12`** |
| v26 → 27 | 40 → **41** | **`§5.3`** | none | `§3.1`, `§6`, `§11` |

**A byte count that looks alarming and is not.** The stored page went **58,541 → 43,064 bytes**
between v26 and v27, a 15 KB drop. The **readable text went up**, 32,439 → 34,057. The drop is
markup and macros, not content. Checked rather than assumed.

**47 cases cite one of the changed sections and every one was read by hand.** Of those:

- **`§11` (9 cases) and `§3.1` (15 cases) — nominal.** v27 only added a cross-reference `(§5.3)` to
  `§11` and one new sentence to `§3.1`. No existing requirement moved. Verified by checking whether
  any of those cases asserts the changed text; none does.
- **`§4.12` (7 cases) — one real narrowing**, §3 below.
- **`§4.9` (9 cases) — one real change**, §4 below.
- **`§6` (7 cases) — one requirement DELETED**, §5 below, and it is the sharpest finding of the pass.

**How each write was proven safe before it was sent:** every span the substitution could match was
masked out of **both** the before and after text, and the masked remainders had to be
**byte-identical** — nothing outside the version token could move, and the checker fails closed.

---

## 3 · `§4.12` narrowed in v26 — one case followed it

```
v25  Hover tooltip: a per-technician breakdown (assigned vs that tech's capacity) …
v26  Hover tooltip: a per-assigned technician breakdown (assigned vs that tech's capacity) …
```

[C30033](https://shopview.testrail.io/index.php?/cases/view/30033) asserted *"a per-technician
breakdown"* — readable as *every* technician. Point 1 now reads *"a breakdown for each assigned
technician"* and says in plain words that v26 narrowed it.

**Its title still says "per-technician breakdown".** I left the title alone rather than make a
second judgement call; flagging it here instead.

---

## 4 · `§4.9` changed in v25 — and it retires half of a divergence note

```
v24  Scope summary and the scheduled line(s) with labor/total figures.
v25  Scope summary and the scheduled line(s) with labor/status figures.
```

[C30011](https://shopview.testrail.io/index.php?/cases/view/30011) expects *"No labor figures and no
total dollar amount"*, and its provenance said the case *"follows a later product owner decision …
rather than that specification's wording."*

**Half of that is now out of date.** By deleting *"total"*, Branko brought the specification into
agreement with the case on money — so the divergence on the money point **no longer exists**. The
specification still asks for a **labor** figure, which the case still does not expect, so a
divergence remains on that one point.

The note now says exactly that: which version changed, when, what the two now agree on, and the one
point on which the PO's decision of 22 July still prevails. **The note was narrowed, not deleted** —
Rule 56 cuts both ways, and there is still something genuinely divergent here.

---

## 5 · 🔴 `§6` LOST A REQUIREMENT IN v24 — and a case is still testing it

This is the most important finding of the pass.

```
v23  Search | Filters grid blocks by matching against customer name, WO number, unit number,
     technician name, and line name. Non-matching blocks fade; matching blocks highlight.
v24  Search | Filters grid blocks by matching against customer name, WO number, unit number,
     technician name, and line name.
```

**The sentence "Non-matching blocks fade; matching blocks highlight" was deleted on 6 August and is
not in the live specification.**

[C30041](https://shopview.testrail.io/index.php?/cases/view/30041) is titled *"Toolbar search
highlights matching blocks and fades non-matching ones"*. **Points 1, 3 and 4 rested entirely on the
deleted sentence.** Point 2 (the five fields matched) is untouched and still in v27.

**It carries `AUTOMATION: READY - EXPECT FAIL (SV-8874)`** — a defect raised because the build
removes non-matching blocks instead of fading them. The live specification now describes the search
only as **filtering** the blocks, which is what the build does.

**I did not rewrite the expectation to match the build.** That is precisely the trap Rule 57 names,
and the direction of the repair is a product decision, not mine. What the case now says is the
checkable document fact: the wording comes from v23, v24 removed it, point 2 is unaffected, and
**the product owner needs to confirm which wording stands**.

**This is the one item on this project I would put in front of Branko first.** If the deletion was
deliberate, then SV-8874 may be a defect against a requirement that no longer exists.

---

## 6 · The three provenance lines that credited the specification for something it does not say

In each case the `refs` field named the real basis honestly while the **tester-facing line named
only the specification** — the false-authority failure Rule 54 exists to prevent.

| Case | What the line claimed | What is actually true |
|---|---|---|
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | *"as per … the Schedule specification version 23 (§4.5)"* for **daylight-saving** behaviour | **The words *daylight*, *clock change*, *DST*, *time zone* and *timezone* appear ZERO times in the live specification** — counted, not assumed. `§4.5` is about spreading work across days. The basis is the engineering tech plan (`D2 NFR-005`), which its own `refs` already said. |
| [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | *"… (§7)"* for **how Undo works underneath** | `§7` requires the toast and its Undo. It says nothing about the action being saved immediately or Undo being a reversing action — ***revers*, *optimis* and *refresh* appear 0 times.** Tech plan `D10`. |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | *"… (§14)"* for **HTTP 403 refusals** | `§14` sets the three permission levels. It does not describe what the server returns when a request is refused. Tech plan `§4 NFR-003`. |

All three lines now **name the engineering technical plan with its link**, and say which part rests
on it. Nine other Schedule cases already named the tech plan correctly and were left alone.

---

## 7 · The divergence notes that are correct and were left exactly alone

Nine Schedule cases carry a divergence sentence. **Eight are right and untouched.** The shop-closures
group deserves stating explicitly, because it is the one the brief asked me to re-check:

**The contradiction is REAL and STILL OPEN.** `§4.5` says *"Shop closures and public holidays are
**not skipped** in V1"*; `§12` says closures *"**block** the spread step from placing shifts on those
days"*. **Both sentences are byte-identical in v23 and in v27** — nothing between v24 and v27 touched
either. So [C29983](https://shopview.testrail.io/index.php?/cases/view/29983),
[C29984](https://shopview.testrail.io/index.php?/cases/view/29984) and
[C30089](https://shopview.testrail.io/index.php?/cases/view/30089) are **correct as written** and
were left alone. **Neither v26 nor v27 settled it.**

Their notes say a product owner decision *"is still awaited"* — and it genuinely is. The honest part:
**the question has never been sent, and the blocker is us, not Branko.**

**No manufactured conflicts were found on this project.** Rule 56's honesty half had nothing to bite
on beyond the narrowing in §4.

---

## 8 · A brand-new section nobody has a case for

**v27 added `§5.3 Panel collapse`** — a whole new feature: an icon button that collapses the left
work order panel, its tooltip wording (*"Hide panel"* / *"Show panel"*), what survives the collapse,
auto-collapse below 960px, and that it is session-scoped rather than saved.

**No case cites `§5.3`.** That is a **coverage gap, not a source defect**, and authoring is barred by
the standing hold, so **nothing was authored**. It is recorded here and in §11 so it does not go
quiet.

---

## 9 · WHAT WAS WRITTEN — and the proof it did no damage

**174 `update_case` over 168 distinct cases. Every one HTTP 200, 30 fields compared each,
0 mismatches, 0 collateral changes.** All three text fields sent explicitly on every payload.

**0 `add_case` · 0 `delete_case` · 0 section operations · 0 run writes · 0 results logged · nothing
created anywhere**, per the standing hold.

Payload shape was asserted **before** sending on every write: exactly one provenance line, exactly
one marker, marker last, `refs` entries under 248 characters, the build sentence unmoved (the tool
**refuses** the write if it moves), and the raw-markup count **unchanged**.

### Post-write census of all 168 — every case, every check

| Check | Result |
|---|---|
| Provenance version equals the live Confluence version | **168 of 168** |
| `refs` naming a stale spec version | **0** |
| Anchor cited that does not exist in the live spec | **0** |
| `refs` missing a Jira ticket | **0** |
| Exactly one provenance line · one marker · marker last | **168 of 168** |
| Cases citing no spec section at all | **2 — both name their real source** (the epic's story, and the tech plan) |

### Run 357 — Ayesha's — PROVEN UNTOUCHED BY CONTENT

`include_all` still **false** · **168 tests** · **458 results** · test-id **and** case_id sets equal
in **both** directions · **all 458 prior results present BY ID** · **0 graded-field changes** ·
**0 new results** · counters unchanged (25 passed / 0 failed / 1 blocked / 142 untested).

**One thing moved and it is worth recording precisely, because it looked like damage and is not.**
`case_refs` changed on **208 records across 65 cases** — and **most of those 65 are cases whose
`refs` we did not edit.** Chased down rather than waved away:

```
result 404983, case C29954
  before: 'SV-8687 (§3.1, §5.1 (drill-down filters))'    <- comma-SPACE
  after : 'SV-8687 (§3.1,§5.1 (drill-down filters))'     <- bare comma
```

**The case's own `refs` is byte-identical before and after** — it was *already* in the bare-comma
form. The run result held an **older copy**, frozen when the result was logged, from before TestRail's
declared refs normalisation was applied to that case. **Touching the case made the stored echo catch
up with the case's own current value.** Independently confirmed: **166 of 168 Schedule cases have
`refs` byte-identical to the pre-write snapshot**, and the 2 that differ are the 2 we intended.
**No graded field moved on any of the 458.**

*(A new fact about the `case_refs` echo worth adding to the playbook's §J — flagged, not written,
since the playbook is not mine to edit unattended.)*

---

## 10 · ⚠️ REPORTED, NOT REPAIRED

**20 cases show raw `<ol>` / `<li>` markup to the tester**, in all three fields:
C29927, C29929, C29933, C29934, C29935, C29937, C29939, C29940, C29941, C29943, C29944, C29945,
C29946, C29947, C29950, C29951, C29952, C29953, C29954, C29978. **This project renders that markup
literally.**
**Why not repaired:** it is tester-facing formatting, not sourcing, and it is a separate 20-write
repair that changes what the tester reads. **It also contradicts the 5 August audit**, which proved
*zero* raw markup across all three active projects — so **this arose after 5 August**; all 20 were
last written on 6 August.

---

## 11 · Per-case table

**`CASES-Schedule.csv`** beside this file — 168 rows, one per case: C-id · TestRail link · title ·
**the source it cited before** · **the source it cites now** · the sections it now cites ·
**whether the anchor was quote-verified against the live body** · whether it changed this pass ·
what changed · whether it carries raw markup · its automation marker.

Per-operation log: **`oplog-schedule-2026-08-10.json`** — 174 rows: operation · C-id · HTTP status ·
verification result · note. Tools under `tools/`.

---

## 12 · OUTSTANDING — what I need from you

1. **🔴 Branko must confirm `§6`** (§5 above) — he deleted *"Non-matching blocks fade; matching
   blocks highlight"* on 6 August. If that was deliberate, **SV-8874 may be a defect against a
   requirement that no longer exists**, and C30041 needs rewriting to whatever now stands.
2. **The shop-closures question has still never been sent** (§7). `§4.5` and `§12` have contradicted
   each other since v23 and neither v26 nor v27 fixed it. Three cases are held on it and **the
   blocker is us.** The question is drafted and ready.
3. **A ruling on the 20 raw-markup cases** (§10) — repair them or leave them.
4. **`§5.3 Panel collapse` is new in v27 and has no case** (§8). Authoring it needs your go-ahead,
   which the creation hold currently bars.
5. **A sign-in for the `sv8685` branch**, whenever it is next worth spending. Without it the
   steps-and-labels half of the VIU stays unchecked.
