# Report Suite — FINDINGS of the read-date + version-pin pass, 2026-08-11

Everything here was **found while doing the sweep** and is **recorded rather than silently fixed or
silently left** (Rule 41). Nothing in §2–§9 was acted on: each is either outside this pass's charter
or belongs to the QA lead.

---

## 1 · The sweep itself, in numbers that gate both ways

| | |
|---|---|
| Our cases under group 4281 | **476** (live total **488**; the other **12** are Vladimir Tomovic's — Rule 38) |
| Written | **476 of 476** — every one HTTP 200, 30 fields compared each, **0 mismatches, 0 collateral changes** |
| Already fully compliant before the pass | **0.** Two cases (C30452, C30434) carried read-dates, but **both on the specification and the story with the epic left undated**, so neither met the per-source requirement |
| Read-dates inserted | **1,000** across 476 cases |
| Cases carrying at least one read-date afterwards | **476 of 476** — 2 dates on 431, 3 on 43, 4 on 1, 5 on 1 |
| Stale version pins corrected | **378** |
| Citations still naming a superseded version | **0** |
| Sentence 2 altered | **0** |
| Raw markup | **0 of 476**, measured across all three tester-facing fields after the writes |
| Run 359 | **undamaged** — 476 tests, all 535 results present by id, 0 graded-field changes, 0 echo changes |

**All six specifications were proven current by CONTENT as well as by version number**, and the
previously-pinned body of each was fetched and diffed against the live one so the move is evidenced
by text changing, not by an integer incrementing. Details in `SOURCE-CURRENCY.md`.

**Rule 59 was satisfied**: sources read at pass start **18:27:54Z** and re-read at write start
**18:39:41Z** — all six unchanged. Chris Ward edited all six of these specifications mid-pass on
5 August, one of them a minute before it was fetched, so this is not a theoretical check.

---

## 2 · 🔴 `refs` CARRIES ITS OWN VERSION PINS, AND THEY ARE WORSE — 350 OF 476 ARE STALE

This pass corrected the version pin in the **tester-facing provenance line**, which is what the
brief's Job 2 targeted and what its figures (SBC 86 · SBR 76 · PV 70 · WIP 77 · IV 68 = 377)
describe. **`refs` carries a second, independent version pin, and it was left untouched.**

Measured live after the writes:

| | |
|---|---|
| Cases whose `refs` names a specification version | **440** |
| …of which **STALE** | **350** |
| …current | 90 |
| Cases whose `refs` names no version at all | **36** |

| Report | Live version | `refs` says | Cases |
|---|---|---|---|
| Sales By Customer | 17 | 16 | 78 |
| Sales By Representative | 18 | 15 (and one at 17) | 75 |
| Work In Progress | 11 | 10 (and one at 6) | 72 |
| Parts Velocity | 6 | 4 | 61 |
| Inventory Value | 5 | 3 | 64 |

**Note that `refs` is further behind than the provenance line was** — Sales By Representative's
`refs` sits at **15** while its provenance sat at 17, and Inventory Value's at **3** against a
provenance of 4. So the two pins on the same case disagreed with each other *and* with live.

**Why it was not fixed here, stated plainly as a judgement:** the brief scoped Job 2 to the 377
figure, which is unambiguously the provenance line; it described a `refs` write as conditional
(*"if written"*); and `refs` on this suite is genuinely risky to touch — **the longest comma-entry
measures 246 characters against TestRail's 248-character limit**, so a version number growing from
one digit to two on a long entry could cross it, and ten cases already contain commas that TestRail
will re-split. Widening an unattended pass onto 350 cases for that gain was not the right call.

**But it matters, and it should not wait.** Rule 42's whole mechanism is that a version-pinned
anchor in `refs` is what connects a closed list to the requirement that invalidates it — a stale pin
there defeats the mechanism just as completely as one in the provenance line. **This needs its own
authorised pass**, and it is the single largest outstanding item this sweep produced.

---

## 3 · One negative mention was deliberately left undated

Stamping a read-date onto a source named **only to record that it does not cover the point** would
assert that the specification supports an expectation it explicitly does not.

**[C38856](https://shopview.testrail.io/index.php?/cases/view/38856)** — its provenance says the
expectation comes from Chris Ward's decision, and then: *"the Sales By Customer report specification
version 17 (S14-R1, S14-R2, S14-R4, S15-R1, S15-R2, S15-R4, S15-R5, S4-R13) **is silent on this
point**, so his answers are the only basis for it."* That citation got **no read-date**. Its other
two sources — the epic and Chris's answers sheet — are dated normally.

**It was still re-pinned, and the re-pin was verified first:** re-pinning to 17 asserts that **v17**
is silent, so all eight anchors named were checked and proven **byte-identical between v16 and v17**.
The negative claim therefore still holds. Without that check the re-pin would have been an unverified
assertion.

**This is the third project in a row to find the pattern** — 7 cases on Schedule, 13 on Filters, 1
here. The mechanical test in all three is the same: read the words that immediately follow the
citation. Any future automated stamper must handle it.

**A related shape that is NOT a negative mention, and was dated normally:** 10 cases carry a Rule-56
divergence sentence — *"where the wording of that specification differs, the behaviour above follows
Chris Ward's later decision"* — which **names the specification as a real source** and discloses a
divergence from it. Both sources are cited, so both are dated. Conflating the two would have left ten
legitimate citations undated.

---

## 4 · Two cases carry no automation marker and no build line at all

**[C30169](https://shopview.testrail.io/index.php?/cases/view/30169)** (Sales By Customer, *"Expanded
CSV body: column set and order…"*) and
**[C30288](https://shopview.testrail.io/index.php?/cases/view/30288)** (Sales By Representative,
*"The Unassigned row appears in both CSV downloads…"*).

Both end at the provenance line with **no `AUTOMATION:` marker**, **no sentence 2 of either shape**,
and **no `---` separator**. All three faults **predate this pass** — they are in the pre-write
snapshot.

They are also **the only two cases in the suite whose specification citation carries no version
number at all**: *"the Sales By Customer report specification (S14-R5 Expanded contents; S4-R13
Locations line)"*.

**They were still written** — both received read-dates, so Job 1 covers all 476 — and **nothing was
invented**: no marker was added, because choosing between `READY`, `READY - EXPECT FAIL` and `HOLD`
is an automation judgement (and under Rule 61 an expect-fail marker now needs live backing); no
version was inserted, because a pin nobody established is not a pin.

Their cited anchors were checked and all exist in the live specifications, so the missing version is
a Rule-42 gap rather than a broken reference.

**These two are the reason the pass's gates were split into ABSOLUTE and NON-REGRESSION.** A gate
that simply demanded "exactly one marker" would have refused to write them and silently reduced a
476-case sweep to 474 — which is how a pass comes to report completeness it does not have.

---

## 5 · The local case source was stale on more than this pass wrote

Local was re-synced **from live before** any deliverable was regenerated. Besides the 476
expected-result fields this pass had just written, local differed from live on:

| Field | Cases |
|---|---|
| `refs` | **243** |
| steps | 8 — C30172, C30173, C30194, C30436, C30490, C38912, C30169, C30288 |
| titles | 7 — C30102, C30169, C30288, C30434, C38912, C38915, C38916 |
| preconditions | 5 — C30467, C30488, C30489, C43551, C30169 |

**None of those was caused by this pass** — title, preconditions and steps were sent back
byte-identical from the pre-write snapshot on every payload, and `refs` was never sent at all. They
are the residue of earlier live passes whose text local never received.

**The sibling Filters pass's warning is confirmed here: the four counts reconcile perfectly over
stale content.** Before the re-sync, live/local/id-map/import all read 476 and all set-equalled both
ways, while 243 bodies were wrong. **Counts cannot detect this; only a field-by-field comparison
can.**

---

## 6 · A prior Report Suite pass had planned the same re-pins and never executed them

`build/report-suite/source-accuracy-remaining-2026-08-11/RESUME.md` describes a pass over 251 cases
(Sales By Representative 112 · Parts Velocity 71 · Inventory Value 68) with *"Plan built and dry-run
clean: 234 writes, 0 errors"* — but its working files sat in `/tmp/rs5`, which is ephemeral, and
**the stale pins were still live when this pass began**, so the plan was demonstrably never run.

Recorded because the brief stated no other worker is on Report Suite, and the evidence agrees — but
a reader of that RESUME could reasonably think the work was done. **It was not; it has been now**,
for all six reports rather than three. Its independently-reached list of 16 held cases is carried
forward in `STALE-ANCHORS.md` §3.

---

## 7 · Corrections to figures we ourselves hold

**(a) The "251 never build-verified" figure is right in substance, wrong as usually phrased.** The
brief described 251 cases as *"never checked against any build"*. **Live, all 251 carry a build
line** — mostly `v3.5-16cf83f` / `v3.5-7168d14`, dated 8/6/2026. Our own record's wording is the
accurate one: those 251 are *"source-accurate, never build-verified"* **against the build now
running**. The literal reading is true of exactly **5** cases, which say so in their own text.

**(b) The epic child count has moved again.** Our notes record SV-8582 dropping to **104** children
on 6 August when SV-8821 and SV-8822 were closed and unparented. It reads **105** today, verified two
ways with equal key sets. A Tier-1 currency check only — no full re-read was done or authorised
(Rule 37).

**(c) The in-body "Version" trap does not exist on these six pages.** Rule 31 trap (a) warns that a
page's in-body version field lies. All six storage bodies were searched: **there is no in-body
version field at all**, so the Confluence API integer is the only marker there is. Recorded so a
future pass does not hunt for a field that isn't there and conclude the fetch failed.

---

## 8 · A defect in this pass's own first tooling, found and corrected before it mattered

The first version of `spec_compare.py` mapped each requirement anchor to **only its first
occurrence** in the document. Anchors in these specs are frequently **cross-referenced before they
are defined**, so the first occurrence is often a passing mention. That draft reported **Sales By
Representative as "0 anchors changed"** between v17 and v18 — while its Location-column rule had in
fact been **rewritten wholesale**.

**That is a false all-clear, which is worse than a blind spot**, and it is the exact failure Rule
45(e) exists to prevent. Corrected to compare **every** occurrence, which raised the true totals from
6 to 7 changed anchors on Sales By Customer, 0 to 2 on Sales By Representative, 1 to 3 on Parts
Velocity and 0 to 2 on Inventory Value. Recorded rather than quietly fixed, because the correction
is the useful part.

---

## 9 · Smaller observations, all recorded and none acted on

**(a) `case_refs` did not move on run 359.** Playbook §J normalisation #2c predicts it *can* catch up
when a case is next written; **476 cases were rewritten and it moved on 0 of 535 records**, as did
`case_title`. The Filters pass saw the same on the same day (0 of 473). **The catch-up is
conditional, not automatic** — keep excluding both fields from the untouched-run comparison and
verify on the graded fields. **Not edited into the playbook from this worker**; flagged for whoever
owns §J.

**(b) One pre-existing grammar defect, left alone.** C38856 reads *"…&sd=true. the Sales By Customer
report specification…"* — a lower-case sentence start after a full stop. It predates this pass and
is a wording fix, not a provenance one.

**(c) The raw-markup census is 0 — as of the moment it was taken, and of no other moment.** Measured
across all three tester-facing fields of all 476 after the writes. TestRail re-renders tester text
into HTML **hours after** a write **without moving `updated_on` or `updated_by`** (playbook §J hazard
#5), so this figure is a measurement and never a durable state. **Expect it to regress once a tester
next works through these cases in the UI.**

**(d) The Rule-41 whole-case re-read was otherwise clean**: 0 anchors absent from the live specs,
exactly one provenance opening on all 476, exactly one automation marker on 474 (the two exceptions
in §4), 0 barred *"as per the build"* phrasings, 0 uses of the word "VIU", 0 API content outside an
API section, 28 API cases all correctly placed.

**(e) The Report Suite cites no design and no Figma frame** — zero occurrences across all 476
provenance blocks. Rule 57 makes both authoritative where they exist; this project has been spec-only
from the start, so there is no design currency to establish and no Rule-35 queue open. Recorded as
N/A rather than omitted.

---

## OUTSTANDING — what I need from you

1. **An authorised pass over the `refs` version pins — 350 of 476 are stale** (§2), and Sales By
   Representative's sit at version 15 against a live 18. Rule 42's mechanism depends on that pin, so
   this is the largest gap the sweep found. It needs its own pass because ten `refs` entries contain
   commas TestRail will re-split and the longest comma-entry is 246 characters against a 248 limit.
2. **A Rule-43 requirement→case re-derivation for all six reports** (`STALE-ANCHORS.md`). The pins
   are now correct, which is what makes that work meaningful. Three items inside it are sharp enough
   to name separately:
   **(a)** [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) asserts *"three options
   with Parts & Service default"* for a Product Type control that Sales By Customer v17 redesigned
   into a **multi-select with two toggles** — and it is flagged Automated;
   **(b)** Parts Velocity v6 added **`S6-R12`**, a 10,000-row export cap with a verbatim message, and
   **no case cites it**;
   **(c)** Work In Progress v11 added a **line-state bucketing** Key Decision that governs the
   report's central figures, and its reach extends past the three cases citing `S9-E1` by name.
3. **A one-word wording fix to [C30518](https://shopview.testrail.io/index.php?/cases/view/30518)**,
   which now pins Work In Progress v11 while its own caution still says *"version 10"*. The caution
   is still true; it just names a version the case no longer cites.
4. **A decision on the two malformed cases** —
   [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) and
   [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) carry no automation marker, no
   build line and no version pin (§4). Adding a marker is an automation judgement and was not ours to
   make unattended.
5. **Nothing else.** All six specifications, the epic, both cited stories, Chris Ward's answers sheet
   and the engineering technical plan were read live today; the sweep is complete at **476 of 476**;
   run 359 is proven undamaged; and no Jira issue was created, in keeping with the standing hold.
