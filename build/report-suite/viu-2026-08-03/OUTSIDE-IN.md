# Report Suite — OUTSIDE-IN GAP HUNT (Standing Rule 45) · 2026-08-03

**Why this exists.** Rules 40–44 make us follow through on what *we* found. Rule 45 exists because on
2026-07-31 we had no way to notice that an **outsider** could see something we could not — and one
did: Vladimir Tomovic's automated case, carrying no references at all, exposed a Location-column gap
across five reports. All five checks below run, and **each states its result**. "Not applicable" is a
permitted answer; silence is not.

**What is new today:** for the first time a **running build exists**, so check (b) — the
automation-engineer lens — is genuinely available instead of being limited to reading the document.
That limitation was the single biggest reason an outsider working from the build could out-see us,
and it is now lifted for the surfaces I reached.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

Specs **SBC v13 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3**, all confirmed current 2026-08-03.
Epic **SV-8582 — PARTIAL** (not re-read). Designs **N/A**. Tech plan **PARTIAL**.
**Live build `v3.4.1-0ed4433` — PARTIAL, DECLARED NOT FINAL** → everything provisional,
`RECHECK-QUEUE.md` **OPEN**.

---

## (a) FOREIGN-COVERAGE DIFF — BOTH DIRECTIONS

**The population.** Five foreign cases, all authored by **Vladimir Tomovic** (TestRail user id 1;
we are id 3, Bilal Muzamil): **C38919–C38923**. **Ours 474 / live total 479** — stated both ways, as
Rule 38 requires. **Not one of them was touched.**

### Direction 1 — their assertions vs ours (the overlap direction)
Already classified on 2026-07-31 in `../../testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`:
2 DUPLICATE (C38920, C38922) · 1 AUTOMATED EQUIVALENT (C38919) · 2 NEW COVERAGE (C38921, C38923).

### Direction 2 — the reverse: their assertions with no counterpart in ours
**This is the direction that matters, and today it can be settled against the build rather than
argued.** Each row quotes both texts (Rule 45(e)) and gets one verdict **per assertion**.

| Their case | Their assertion | Our counterpart | Live build verdict |
|---|---|---|---|
| **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** | SBR Summary **and** Expanded CSV exports carry the **Location column at its designated slot** | **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) + **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286), now scope-conditional | **HE IS RIGHT, AND IT IS NOW PROVEN.** Summary CSV multi-location: `Representative,**Location**,Inv. Hrs,…`; Expanded: `Representative,Invoice #,Date,Customer,Invoice Status,**Location**,Hrs Worked,…`. Single-location: absent from both. **COVERED-BY** ours as rewritten. His case was the only thing standing between us and a tester failing a correct build. |
| **[C38921](https://shopview.testrail.io/index.php?/cases/view/38921)** | The IV CSV carries the **As of** *and* **Locations** metadata lines **above the header**, plus a scope-conditional Location column | IV-EXP group + **IV-LOC-01** = [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | **HE IS RIGHT ON ALL THREE.** Observed: line 1 `"As of: 2026-08-03"`, line 2 `"Locations: …"`, then the header; Location present at multi-location scope, absent at single. **Our cases say "exact position in the file is confirmed in the build" — i.e. they left it open where he pinned it.** → **CANDIDATE GAP on the ordering of the two metadata lines**, now answerable; feeds edit row 4 of the change ledger. |
| **[C38920](https://shopview.testrail.io/index.php?/cases/view/38920)** | The PV Location column is scope-governed — hidden at one location, **"Multiple" on a merged special-order row** | **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | Scope-governance **CONFIRMED live** (present multi, absent single, in screen and CSV). The **"Multiple"** cell value was **NOT observed** — it needs a part stocked at two locations that merges into one row. **CANDIDATE GAP → still open, and it is the one thing in this section I could not settle.** |
| **[C38922](https://shopview.testrail.io/index.php?/cases/view/38922)** | The WIP CSV gains the **Locations line** while its column semantics "stay exactly as shipped" | **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) + **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | **BOTH CONFIRMED.** `"Locations: …"` is line 1; the shipped semantics are `Unit` and `Branch`, which is exactly what C30516 predicted. **COVERED-BY.** |
| **[C38919](https://shopview.testrail.io/index.php?/cases/view/38919)** | The TU column selector hides **Est. Lost Labor**, the choice **persists across reload**, and the **export mirrors it** | TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) + the TU-EXP group | Selector contents **CONFIRMED** (the five toggles including Est. Lost Labor). **Persistence NOT observed** and **export-mirrors-selection NOT observed** for TU. **CANDIDATE GAP on the export-mirrors-hidden-column assertion** — and it is sharpened by a live finding of my own: on **WIP** the export does **not** mirror the screen for `Inv. Hrs`, because that column is not exportable at all. Worth checking whether TU has the same asymmetry. |

**Net:** of the five, **three are now confirmed against the build**, **two leave a genuine candidate
gap** (the PV "Multiple" cell; export-mirrors-hidden-column on TU). **He was right every time he
disagreed with us.** That is the second run in a row, and it is the strongest argument for keeping
this check.

---

## (b) THE AUTOMATION-ENGINEER LENS — *"what would I assert from the running build?"*

**Newly available.** Here is what I would assert having driven it, that no case of ours currently
says. Each is a coverage signal, not a complaint.

| # | What an automation engineer would assert from this build | Do we cover it? |
|---|---|---|
| 1 | The **export endpoint refuses an unknown column by name**: `columns=…,invoiced_hours` → `400 {"error":"Invalid column \"…\"."}`, and the accepted WIP set is exactly `wo_number, status, customer, asset, vin, location, advisor, days_open, last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total` | **NO.** And it matters, because **`Inv. Hrs` is offered on screen and rejected by the export** — a real asymmetry no case names. Feeds ledger rows 8 and 9 |
| 2 | The WIP export **requires** a `tab` parameter and rejects anything outside `ApprovedNotStarted \| ApprovedPartiallyCompleted \| Completed \| Estimates` (`400 Invalid tab`) | **NO** — our WIP export cases never mention that the download is per-tab at the contract level |
| 3 | The SBC/SBR/TU exports **require** `variant=summary\|expanded` (`400 "Invalid export variant. Allowed values: summary, expanded."`) | **NO** — implied by the four menu items, never asserted |
| 4 | `format` is validated with its own message: `400 "Invalid export format. Allowed values: csv, pdf."` | **NO** — a small, cheap negative case |
| 5 | **PV returns no `totals` object at all** — only `collection` + `pagination` — while SBC, SBR and IV all return `totals` | **NO.** Any PV totals-row expectation is unsupported by the payload. A genuine hole |
| 6 | **PV `Revenue` is not `Units Sold × Sell Price`** (`512 × $7.69 = $3,937.28` but Revenue = `$4,332.11`), consistent with Revenue being actual invoiced value | **PARTLY** — the PV-CALC cases should say which of the two it is, from the spec, before a tester treats the difference as an error |
| 7 | The **PDF path lacks the CSV path's over-size guard** — CSV `400` with a friendly message, PDF **`500`** | **NO** — and this is ledger row 19, the one I believe is a real defect |
| 8 | The data API's `range=custom` **rejects a span beyond a limit** (`from=2025-01-01` → `400`) | **PARTLY** — PV-FILT-04 and SBC-DATE-03 assert a 366-day cap in the UI; the server enforces something too, and no case asserts the server side |
| 9 | WIP money crosses the wire as **integer cents** (`14500` → `$145.00`) and renders with separators | **PARTLY** — WIP-CALC-01 covers the rendering, nothing covers the wire format |
| 10 | Every report call carries `pagination[page] / [rowsPerPage] / [sortBy] / [descending]`, **except TU and WIP, which are unpaginated** | **NO** — the API cases assume pagination is universal; on two reports it is not |

**Honest note:** this lens is now *build-informed* but still not exhaustive — I drove the report
surfaces, not the whole application, and I read CSVs but not PDF interiors.

---

## (c) THE HOSTILE-REVIEWER LENS — *"what would a reviewer claim is missing?"*

Run **before** delivery, not after the challenge. What I would attack if this suite were handed to me:

1. *"You have a build and 86 of 475 cases matched — what about the other 389?"* Fair. Answered
   honestly in the change ledger totals and in `SUMMARY-FOR-QA-LEAD.md`; **nothing is dressed up as
   verified.**
2. *"Your own suite contradicted itself about the WIP Location column and your audit rated all 110
   cases sensible."* **Correct, and it is the most damaging finding here.** C30467 said Location is
   not offered; C30466 and C30507 both listed it among the toggleable columns. Two of our cases could
   not both be true, our Rule-28 cross-case sweep missed it, and it took a build (and an outsider) to
   expose it. Recorded, not minimised.
3. *"You assert closed lists of export headers — did you check them?"* Yes, and **two of them were
   wrong** (SBR Summary and Expanded). Rule 42's scope-conditional wording is what kept them
   legible rather than simply broken.
4. *"You never opened a PDF."* True. No PDF text extractor exists in this container. PDF
   **generation** is evidenced by status and byte size; PDF **contents** are unverified and named as
   such in the surface matrix.
5. *"You claim the permission model is proven — on how many roles?"* Two impersonated end to end
   (Admin, Foreman) plus a **seeded minimal 8-atom role**, against a catalogue that contains exactly
   one report atom. The remaining roles' report behaviour is **derivable but not individually
   driven** — and I say so rather than claiming eleven.
6. *"Where is the mobile pass?"* Not run. Listed.
7. *"Six epic stories were reopened three days ago and nobody has read them."* **True, and I did not
   re-read the epic** — it is a Tier-2 job needing the QA lead's go-ahead (Rule 37). Flagged as
   outstanding.

---

## (d) EVERY EXTERNAL SIGNAL DIFFED, NOT MERELY ANSWERED

| Signal | Diffed against the suite? | Outcome |
|---|---|---|
| Vladimir Tomovic's 5 automated cases | **Yes**, both directions, above | 3 confirmed · 2 candidate gaps |
| The sibling worker's live spec verification (2026-08-03) | **Yes** — every "NOT DONE" item was carried into my verdicts as a build-vs-ruling question rather than a case error | it is why 13 deviations are logged as *keep our case* instead of *fix our case* |
| Chris Ward's rulings through 2026-08-01 | **Yes** | the one-permission model is **confirmed by the build**; the Location-filter ruling and the VIN chain are **not yet in the build** |
| Jira **SV-8614** "SBC – Story 16 – Print the report", still **Open** | **Yes** | **no Print control exists anywhere on the build** — the build agrees with the retirement, the ticket and SBC S18-R7/R10 do not |
| Stefan Mitrovic's "AI slop" claim | **Yes** — the Rule-28 tally is the standing answer | see `QUALITY-AUDIT.md` |

---

## (e) NO "COVERED" VERDICT WITHOUT BOTH TEXTS QUOTED — AND ONE ROW PER ASSERTION

Complied with. Every coverage verdict in `LABEL-DIFF.md` §B and in `SURFACE-MATRIX.md` quotes **our
text beside the build's text**. The multi-assertion requirements are split: the Location requirement
is verdicted as **1a the column** and **1b the metadata line**, per report; C38919's three assertions
get three verdicts; C38921's three get three. **No entry in this pass names case ids without quoting
text** — that is the specific failure mode (entry "N2" of the 2026-07-31 deltas) this clause exists
to prevent.

---

## WHAT THIS HUNT ADDS TO THE SUITE

**Candidate gaps carried forward** (none authored — Rule 6, the QA lead authorises):

1. `Inv. Hrs` is offered on the WIP screen but **rejected by the export** — no case says so.
2. **PV returns no `totals`** — any PV totals expectation is unsupported.
3. The **export parameter contract** (`format`, `variant`, `tab`, `columns`) has four distinct
   validation messages and **no negative case** anywhere.
4. **TU and WIP are unpaginated** while the other four are paginated — the API cases assume otherwise.
5. The **PDF path has no over-size guard** where the CSV path does.
6. The PV **"Multiple"** cell value (C38920's assertion) — still unobserved.
7. **Export-mirrors-hidden-column** on TU (C38919's third assertion) — still unobserved, and made
   more interesting by finding 1.
