# SOURCE ACCURACY — Filters, 2026-08-10

**Scope: all 114 Filters cases that are ours. No sampling.**
Live under group 4110 there are **119** cases — **ours 114 / live total 119**. The other **5**
(C43576, C43577, C43578, C43579, C43580) are **Ahtasham's** and were **not touched** (Rule 38);
they are proven byte-identical below.

**This file answers one question per case: is the tester being sent to the right requirement?**

---

## 0 · The environment, stated up front

| | |
|---|---|
| **Signed-in session** | 🔴 **None, and none was sought.** `quick-login` and `switch-user` were **not** called. |
| **Build** | **Not read, deliberately.** Nothing was observed on the application. |

**So nothing here claims to have been seen on the running build.** No build stamp was refreshed on
any case: every case still names the build it was genuinely last checked against
(`v3.4.2-d00239b`, 8/5/2026). A fresh date would be a claim we cannot support (Rule 12).

**The steps-and-labels half of a VIU therefore stays unchecked for this project.** That is the
honest limit of this pass and it is not being papered over.

## 0.1 · The source, verified live from Confluence `version.number`

| Page | **Live version** | Last edited | Our cases cited |
|---|---:|---|---|
| Filters, page 572030978 | **19** | 2026-08-06T11:48:47Z | **v18 on 102 of 114** |

⚠️ The page **body** still reads *"Version: 1.6"*. That is the Rule-31(a) trap. The number used
throughout this pass is the Confluence `version.number`, never the one typed inside the document.

---

## 1 · THE HEADLINE

**Position now: 114 of 114 cite a verified-correct source.** Was 10 of 114.

| Found at the start | Cases |
|---|---:|
| **Provenance line cited a spec version that is no longer live** | **102** |
| Cited the live version already | 10 |
| Provenance line names no spec version at all | 2 |
| **`refs` naming a spec version that is no longer live** | **104** |
| **Cited a requirement anchor that does not exist in the live spec** | **0** |
| **Quoted the build's label where the spec pins a different one** | **2** |
| **Provenance crediting the spec for something the spec does not say** | **2** |
| `refs` missing a Jira ticket (Rule 20) | **0** |
| Cases carrying raw `<ol>`/`<li>` markup shown literally to the tester | **17** ⚠️ |

**The good news first, because it is the part that could have been much worse: not one of the 114
points at a requirement that does not exist.** Every anchor cited was located in the live body.

**The bad news is the version pin.** 102 provenance lines and 104 `refs` sent a tester to a version
of the document that is no longer the live one.

---

## 2 · Why the re-stamp is safe to make mechanically — and the proof

A version bump is only nominal if the requirement text did not move. So **v18 was fetched as well as
v19** and the two were diffed **definition by definition**, not by eye:

| | v18 | v19 |
|---|---:|---:|
| Requirement definitions | 132 | 132 |
| Added | — | **none** |
| Removed | — | **none** |
| **Text changed** | — | **exactly one: `S1-R3`** |

```
v18  S1-R3: Each chip displays the filter name and a chevron icon indicating it opens a dropdown
v19  S1-R3: Each chip displays a leading type-icon identifying the filter, the filter name, and a
            chevron icon indicating it opens a dropdown
```

The whole prose diff between the two versions is **that one line**. Nothing else in the document
moved.

**A correction to the brief I was given:** it described `S1-R3` as *"a new `S1-R3`"*. It is not new —
the anchor existed in v18 and its **text changed**. That distinction is what decided which cases
needed a hand read.

**The 2 cases citing `S1-R3` were held out of the mechanical batch and read by hand.** Both already
cited v19 and both already carry the correct v19 wording — **C29558** even discloses the v18→v19
change in its own provenance line, which is exactly the shape Rule 56 asks for. Neither needed a
change.

**How each write was proven safe before it was sent:** every span the substitution could match was
masked out of **both** the before and the after text, and the masked remainders had to be
**byte-identical** — so nothing outside the version token could move, and the checker fails closed.
It did fail closed once, on the first attempt, because my mask pattern only matched the old form of
the token; the tool was fixed rather than the check relaxed.

---

## 3 · The two cases that quoted the build where the specification pins the label

`S11-R7` does not merely name this control — it **argues** for the name:

> *"While viewing filter state that arrived from a URL, a **"Back to my view"** action is available.
> … **The label is deliberately "my view" rather than "my filters"**, since the action affects both
> filters and search"*

Two cases called it **"Back To My Saved Filters"** — the build's wording, and the exact phrasing the
requirement rejects, together with the reason it rejects it. That phrase appeared **nowhere else in
the 114**.

| Case | Was | Now |
|---|---|---|
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | `'Back To My Saved Filters'` ×2 | `'Back to my view'`, plus a plain note that the specification names it and why |
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | `'Back To My Saved Filters'` ×3 **and in the title** | `'Back to my view'`; title changed to match its own body |

Both keep a tester-facing line saying that if the button on screen reads something else, write down
what it says and carry on — **the wording alone is not a fail**. This follows Rule 57: the build
supplies labels, but here **the label itself is what the document pins**, so the document wins.

---

## 4 · The two provenance lines that credited the specification for something it does not say

`refs` on both cases named the real basis honestly. The **tester-facing line named only the
specification**, which is the false-authority failure Rule 54 exists to prevent.

| Case | What the line claimed | What is actually true |
|---|---|---|
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | *"as per … the Filters specification … (S10-R2)"* | Its own `refs` says *"no numbered v18 requirement covers the one-off migration"*. `S10-R2` describes the account-based storage model; **it says nothing about carrying over filters saved before the redesign.** That comes from the engineering tech plan. |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | *"as per … (S10-R2, S10-R3)"* | Those two do support persistence and per-user isolation. They do **not** describe a saving service, its requests or its success responses — points 1, 2 and 4 of the case. That comes from the tech plan. |

Both lines now **name the engineering technical plan with its link**, and say which part rests on it.

**Checked and deliberately left alone —** three more cases whose `refs` mention a non-specification
source where the specification **does** carry the assertion, so no repair was warranted:
[C38878](https://shopview.testrail.io/index.php?/cases/view/38878) (`S6-R2` covers it outright),
[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) (`S10-R1/R2/R3` cover it, and the
`refs` already says Branko's answer is *"now matched by the PRD"* — a correctly-retired divergence),
and [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) (`S12-R2`, `S7-R1`, `S8-R1`
cover it).

---

## 5 · Divergence notes: one exists, and it is correct

Only **one** Filters case carries a divergence sentence —
[C29558](https://shopview.testrail.io/index.php?/cases/view/29558) — and it names the earlier source,
says what it said, and says we follow the newer wording. **It is exactly right and was left alone.**

**No manufactured conflicts were found on this project.** Rule 56's honesty half — that a divergence
note where nothing diverges is itself a defect — has nothing to bite on here.

---

## 6 · The unresolved contradiction that was deliberately left stated

[C38909](https://shopview.testrail.io/index.php?/cases/view/38909) item 16 records that the
engineering handover says **six** reports were migrated by a given build, while only **one**
(Timesheet Activities) was seen with a filter bar. **No document settles it**, so per instruction it
is **left stated**, unchanged, with its instruction to the tester to mark the case BLOCKED rather
than failed. It is not resolved from memory.

---

## 7 · WHAT WAS WRITTEN — and the proof it did no damage

**108 `update_case` over 108 distinct cases. Every one HTTP 200, 30 fields compared each,
0 mismatches, 0 collateral changes.** All three text fields sent explicitly on every payload.

**0 `add_case` · 0 `delete_case` · 0 section operations · 0 run writes · 0 results logged · nothing
created anywhere**, per the standing hold.

Payload shape was asserted **before** sending on every write: at most one provenance line, at most
one marker, marker last, `refs` entries under 248 characters, the build sentence unmoved (the tool
**refuses** the write if it moves), and the raw-markup count **unchanged** — this pass neither adds
nor removes markup.

### Post-write census of all 114 — every case, every check

| Check | Result |
|---|---|
| Provenance version equals the live Confluence version | **112 of 112 that name one** |
| `refs` naming a stale spec version | **0** |
| Anchor cited that does not exist in the live spec | **0** |
| `refs` missing a Jira ticket | **0** |
| Exactly one provenance line · one marker · marker last | **111 of 114** (the 3 exceptions are §8) |
| Cases citing no spec anchor at all | **10 — every one names its real source** (Branko's answers, the designs, or the epic) |

### Run 352 — Ahtasham's — PROVEN UNTOUCHED BY CONTENT

`include_all` still **false** · **114 tests** · **473 results** · test-id **and** case_id sets equal
in **both** directions · **all 473 prior results present BY ID** · **0 graded-field changes** ·
**0 new results** · counters unchanged (65 passed / 7 failed / 0 blocked / 42 untested).

The **only** field that moved on any result is **`case_refs`, on 443 records across 74 cases — and
every one of those 74 is in our refs-edit set, with none outside it.** That is the declared
read-time echo of the case's own `refs`, and it moved because we edited `refs`.

**Also proven byte-identical, including `updated_on`/`updated_by`:** the **15 cases we did not
write** — which includes **all 5 of Ahtasham's foreign cases** (C43576–C43580).

---

## 8 · ⚠️ REPORTED, NOT REPAIRED — three things that need your say-so

These are real and I did not act on them, for the reasons given.

**(a) 17 cases show raw `<ol>` / `<li>` markup to the tester**, in all three fields
(preconditions, steps and expected results):
C29561, C29562, C29563, C29564, C29565, C29583, C29584, C29585, C29586, C29587, C29588, C29621,
C29622, C29629, C38877, C38882, C43563 — plus **C29560**, whose whole expected result is wrapped in
`<p>`/`<br>` with `&nbsp;`. **This project renders that markup literally.**
**Why not repaired:** it is tester-facing formatting, not sourcing, and it is a separate repair
(18 writes) that changes what the tester reads. **It also contradicts the 5 August audit**, which
proved *zero* raw markup across all three active projects — so **this arose after 5 August**, and
the affected cases were last written on 5–6 August.

**(b) 2 cases have no provenance line at all** —
[C29600](https://shopview.testrail.io/index.php?/cases/view/29600) and
[C29621](https://shopview.testrail.io/index.php?/cases/view/29621). C29600 also has no automation
marker and a one-line, un-numbered expected result. **Both were last edited by someone else**
(C29600 by Vladimir Tomovic on 8 August, C29621 by Ahtasham on 6 August).
**Why not repaired:** restoring text another author removed two days ago is not a call I should make
alone. Their `refs` do name a source, so the information exists — it is the tester-facing line that
is missing. **One word from you and it is a two-minute fix.**

**(c) One automation marker states something that is no longer true.**
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) reads
`AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up - the behaviour this
case asserts is not documented anywhere yet`. **It is documented.** `S10-R4` says, and said in v18
too: *"each Parts view and each Report tab keeps its own separate filter set … and each of those
sets persists independently"* — which is exactly what the case asserts.
**Why not repaired:** clearing a HOLD is a readiness claim, and the ready-to-automate arithmetic is
yours. The false sentence is the defect; whether the case then goes READY is your ruling.

**Also noted, not acted on:** **5 of our cases were last edited by other people** — C38877, C29600,
C29614 (Vladimir Tomovic) and C29621, C29623 (Ahtasham). Not foreign cases, so Rule 38 does not
strictly apply, but worth your eyes.

---

## 9 · Per-case table

**`CASES-Filters.csv`** beside this file — 114 rows, one per case: C-id · TestRail link · title ·
**the source it cited before** · **the source it cites now** · the requirements it now cites ·
**whether the anchor was quote-verified against the live body** · whether it changed this pass ·
what changed · whether it carries raw markup · its automation marker.

Per-operation log: **`oplog-filters-2026-08-10.json`** — 118 rows: operation · C-id · HTTP status ·
verification result · note. Tools under `tools/`.

---

## 10 · OUTSTANDING — what I need from you

1. **A ruling on the 17 raw-markup cases** (§8a) — repair them or leave them. They are unreadable as
   they stand.
2. **Go-ahead to restore the provenance line on C29600 and C29621** (§8b), or a decision to leave
   another author's edits alone.
3. **A ruling on C38880's hold reason** (§8c) — the sentence is false either way; whether the case
   becomes READY is your call.
4. **A sign-in for the `sv8785` branch**, whenever it is next worth spending. Without it the
   steps-and-labels half of the VIU stays unchecked, including the on-screen wording of
   *"Back to my view"* that §3 has just pinned to the specification.
5. **Branko still owes the Parts and Reports product write-up** — it gates C38880 and the nine
   design-sourced cases in §7.
