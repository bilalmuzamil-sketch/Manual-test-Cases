# V1 Regression run — 22 September 2026

**Ordered by the QA lead, 22 Sep, in this order:**
1. **Global Search V2 – V1 Regression Suite** (section 6769) — **64 checks**
2. **Global Search V2 – V1 Regression (derived from V1 automated tests)** (section 8056) — **1 check**

Together **65 checks**, all authored by us (`created_by = 3`); none of Vladimir's, none flagged
Automated — so Rules 38 and 71 do not bite here.

## Scope (Rule 110) — REPLACEMENT

These are the two folders he had me EXCLUDE yesterday, and his own words then were: *"if we are
excluding the folders mentioned in the screenshot above we would stick to the written requirements."*
Including them is therefore the other half of that sentence: **the shipped V1 product is the
standard**, not the V2 requirements document. Every case in these folders says so in its own
provenance — *"THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION … the shipped V1
product IS the specification"* — and several add *"do not pass the test just because the newer
specification no longer asks for it."* That is how they are being judged. **If he meant the other
yardstick, say so and the verdicts change; nothing else does.**

## Last done (Rule 80)

| Last result | Checks | Build then |
|---|---|---|
| 15 September 2026 | 53 | `v26.36.4-7869ff2` |
| 17 September 2026 | 10 | `v26.36.7-29ca209` |
| 22 September 2026 | 2 | `v26.36.8-d146c39` (the two comment corrections, not re-runs) |

**Standing at the start: 58 Passed · 7 Failed · 0 Blocked · 0 Untested.** The build has moved since
(`v26.36.8-d146c39`), so this is a full re-run of all 65 — not a delta (Rule 101).

Seven already failing, each with its report: C45153 and C53601 → SV-10001 · C53605 → SV-10055 ·
C55660 → SV-10060 · C55673 → SV-10061 · C55685 → SV-10025 · C45160 → deliberate non-goal, no ticket.

## Standing holds that do not lift

No Jira issue without his per-ticket word (62/113 — a failure is recorded with the reason and listed
for him) · the Expected is never edited (114) · secrets stay in `/tmp` (82).

## Batches

| # | What | Checks | State |
|---|---|---|---|
| 1 | Findability by field — type a value, read the group | 28 | running |
| 2 | Number forms — the work order number in its five shapes, and number fragments | 3 | to do |
| 3 | Panel behaviour — keyboard, ordering, opening a record, states | 13 | to do |
| 4 | Permissions, location scoping and organisation isolation | 13 | to do |
| 5 | Freshness — a new record findable within 30 seconds | 2 | to do |
| 6 | The remaining singletons | 6 | to do |

---

## 🔴 Instrument error caught before it became eight false failures (22 Sep)

The first pass over batch 1 reported **eight new failures** against a suite that was 58/65 green on
17 September. Before any of them was recorded, two checks were run — and both of them mattered.

**1. Are the seeded records still there?** `seed.py --check` on the V1-regression universe:
**11 of 11 records present, 0 field gaps, every declared field matched.** The customer still carries
`(419) 555-0143`, `Dock 7B`, `Fernvale`, `Ohio`, `44872-9931` and its website; the asset still
carries unit `ZZT-4471`, VIN `1FUJGLDR9KLZZ4471` and plate `OHZZT471`; both parts and the vendor are
intact. **So nothing could be blamed on a stale fixture.**

**2. Was I reading the right thing?** No. **The All view lists only FIVE rows per group.** Queries
like `Fernvale` and `Ohio` match dozens of records, so the seeded customer sits well below the fifth
row and my reader recorded *"missing"*. The case step *"Read the Customers group"* means the group as
a tester can actually see it — which is the **scope tab**, where up to twenty rows are listed.

A second flaw in the same pass: the expectations were **too loose**. *"Brake Chamber"* matched two
unrelated stock parts named `30/30 STANDARD PIGGY BACK KIT, BRAKE CHAMBER`, so a probe could pass on
the wrong record. Every expectation now names the seeded record in full
(`ZZAUTOTEST Brake Chamber Kestrel`, `ZZAUTOTEST Kestrel Parts Supply`, …).

**Both fixed in `reglib.mjs`, and the whole batch re-run — not only the failures (Rule 101).**
Nothing from the first pass is reported. This is the same class of mistake as the five caught on
21 September: *the instrument, not the product.*

---

## Batch 1 — findability by field: **24 of 28 pass** (build `v26.36.8-d146c39`, 22 Sep)

Read on the screen through the scope tab. Every earlier "new failure" disappeared once the reader
was corrected: the licence plate, the unit number, the VIN in full, the vendor's email, the vendor's
phone in both forms, the part number with and without its dashes, and the state — **all found.**

Four fail, and three of them are the ones already reported:

| Check | What happens | Standing |
|---|---|---|
| C53601 | the catalogue-only part is not findable by either its description word or its number — the Parts tab reads 0 | already reported (SV-10001) |
| C53605 | typing the year and make together returns no vehicle — the Assets tab reads 0 | already reported (SV-10055) |
| C55660 | a fragment from the middle of a word finds nothing (`ernva` → 0) or the wrong records (`idgepor` → 2, neither the seeded one) | already reported (SV-10060) |
| **C53582** | **new — see below** | **not a product fault** |

### C53582 — the city and the state: the field works, our own test data crowded the record out

The check types the customer's **city** (`Fernvale`) and its **state** (`Ohio`) and expects the
seeded customer back. It does not come back. **But the field is plainly searchable:** the search
returns **twenty customers and every single one of them shows Fernvale in its address line.** The
list stops at twenty, and at least twenty other Fernvale customers now outrank the seeded one.

**Why it passed on 15 September and does not now:** the ranking and toggle fixtures seeded since
then — `ZZTALLYQ`, `ZZOPENCOUNT`, `ZZPINRIVAL`, `Per Tab Asset Holdings` and the rest — all carry
**Fernvale, Ohio** addresses. **We crowded out our own fixture.** The record is still reachable the
moment the query is narrowed (`Bridgeport Hauling` returns it immediately), which is exactly what
the requirement says to do when a list is capped.

**So it is not a capability loss and it is not a defect** — under the old product a search returned
only three customers of a type, so the seeded record would not have been among them either. **It is
our test that has stopped discriminating.** Recorded Failed against the case as written, with this
reason, and no report raised. Fixing it means giving the check a city unique to its own customer —
a change to the steps, which needs his word (Rule 6), and the Expected is never touched (Rule 114).

---

## Batch 2 — number forms, keyboard and panel behaviour: **14 of 15 pass**

| Check | Result |
|---|---|
| C53579 | **Passed** — all five shapes of the job number find the same job (`S-17670`, `S17670`, `S916017670`, `S9160-17670`, `9160-17670`) |
| C55659 | **Passed** — a fragment of any number finds its record: the job by its last five digits, the part by `4412`, the vehicle by `4471` |
| C55672 | **Passed** — the bare number with no letter and no shop number returns the job |
| C55661 | **Passed** — every record type that has matches has a group on the combined view |
| C55686 | **Passed** — the record that genuinely contains the word is top of its group, and Enter opens it |
| **C55673** | **Passed — this one was failing and is now fixed.** Enter alone opens the top result with no arrow key first. Its report **SV-10061 is already OBSOLETE** |
| C55680 | **Passed** — arrowing moves through rows and never lands on a group heading |
| C55675 | **Passed** — *"No results found / No results for "ZZNOSUCHRECORD9999""* |
| **C55679** | **Failed** — only the message is shown; the recent list does not come back. **This is the V1 behaviour that has gone, and the case itself says so and says not to raise it until the product owner rules.** No report raised |
| C45161 | **Passed** — one character runs no search; two characters do |
| C45155 | **Passed** — the group and its tab read *Assets*, never *Vehicles* |
| C45156 | **Passed** — the shortcut opens it with the field ready to type |
| C55683 | **Passed** — the header box shows the shortcut |
| C55682 | **Passed** — all 33 rows carry an icon, one icon per kind, eight different icons across eight kinds |

### 🔴 Two more instrument faults caught here, both of which would have been false failures

1. **"One character already shows results."** It does not. **The tab strip is on screen the whole
   time, even before anything is typed** — what tells you a search has run is whether the tabs carry
   **counts**. Counting tab *elements* therefore says "a search ran" when nothing ran. Measured
   properly: empty box → 9 tabs, no counts, recent list; `B` → identical; `Br` → counts appear
   (`All (142)`) and 37 rows render. **The product is right.**
2. **"Some rows carry no icon / only one icon across all kinds."** Wrong both ways. Every row has
   one, and the class is `lucide-icon` on all of them — **the shape is in the drawing itself**, not
   the class. Reading the drawing shows **eight distinct icons for eight kinds**, consistent within
   each kind. **The product is right.**

**Running total of instrument faults caught on this run before anything was written down: ten.**

---

## Batch 4 — permissions: **7 of 7 pass**, and the technician's access was restored exactly

Route: impersonate a real technician, edit the Technician role one area at a time, read the panel on
the screen as her, restore and **read the role back**. Baseline captured before any edit and
committed first: `ORIGINAL-technician-role.json`.

| Check | Result |
|---|---|
| C45142 | **Passed** — strip every work-order permission and the Work orders group and its count both disappear. (All the siblings must go together: `woPickParts`, `workOrderLinesCreateAndEdit`, `woTechViewMode` and `scheduleView` each re-grant it on their own) |
| C45144 | **Passed** — no parts access, the Parts tab carries no count at all; grant Catalog & Inventory and it reads 4 |
| C45145 | **Passed** — no vendor access, no Vendors count; grant Vendor & Order Management and Vendors reads 3 (and Purchase orders 4, Vendor invoices 4 come with it) |
| C45146 | **Passed** — remove Customers access and **both** Customers and Assets go, exactly as the check requires |
| C45147 | **Passed** — a time-clock-only user gets nothing of any kind |
| C45148 | **Passed** — types the role was never granted show nothing |
| **C45143** | **Passed** — once the role is built the way the product actually allows. See below |

**RESTORE VERIFIED:** the role ends with exactly the six permissions it started with —
`customersView, scheduleView, woPickParts, woTechViewMode, workOrderLinesCreateAndEdit,
workOrdersView` — read back from the product, not assumed.

### 🔴 C45143 — the eleventh instrument fault, and one HE had already ruled on

Granting the part-sales permission showed **nothing** — not Part sales, not anything. Reproduced on
two separate days with the permission read back as granted. It looked solid.

**The discriminating run settled it in four phases, with an administrator control first:**

| What the role held | Part sales |
|---|---|
| administrator (control) | **3** |
| technician + part-sales permission, financial switch **off** | **nothing** |
| technician + part-sales permission, financial switch **ON** | **3** |
| part-sales permission + financial switch, nothing else | **3**, and Parts and Vendors both empty |

**The gate is the *See Financial Data* switch, not the permission** — and that is deliberate.
**[SV-10278](https://shopview.atlassian.net/browse/SV-10278) was withdrawn by the QA lead on
20 September for exactly this**, in his own words:

> *"Part Sales depends on See Financial Data. The roles and permissions screen states it directly:
> when Part Sales is switched on without See Financial Data, the application asks 'Part Sales
> requires See Financial Data. Enable it to grant this permission?'"*

**So my failure came from a role the product refuses to create.** Writing the permission straight
to the role bypassed the guard the roles screen puts in front of a person — and skill 18 is explicit
that a state a tester cannot actually reach must never be used to judge the product.

**Re-measured with the role as the product allows it** — the part-sales permission plus the switch
it insists on, nothing else: the user sees **Part sales (3)** and **neither Parts nor Vendors**,
which is precisely what the check asks for. **Passed.**

The role was restored and read back identical to baseline after both runs.

---

## Batch 5 — opening records, freshness, widths: **6 of 8 pass**

| Check | Result |
|---|---|
| C53588 | **Passed** — the jobs list comes back ordered and populated (a strict newest-first order is explicitly **not** what this check wants) |
| C53589 | **Passed** — typing straight through a search in flight loses nothing: the box ends reading `Bridgeport Hauling` and the results match the full text |
| C55674 | **Passed** — search is reachable and finds the customer at **desktop (1600px), tablet (900px) and phone (400px)** |
| C53586 | **Passed** — a customer created seconds earlier is returned inside the 30-second window |
| C45153 | **Passed** — clicking a row opens the right record every time: the customer row opens that customer's jobs, the vehicle row opens that vehicle's jobs under its owner, the supplier row opens the supplier |
| C45154 | **Passed** — selecting the record already open does not navigate again |
| C55685 | **Failed** — a correctly spelled name returns 12 customers and **11 of them do not contain the word typed**. Unchanged, and already reported as **SV-10025** (Ready to Fix) |
| C45157 | under investigation — see below |

### C45157 — one record twice, or two records with the same name?

The seeded customer's name appears **twice** in the Customers list. That is only a fault if it is
**one** record listed twice. Two things say it is not: the stored seed state shows the customer's
identity **changed** between 17 and 22 September, and in this same batch the vehicle row opened
under owner `e049c07d…` while the seeded customer is now `72dbfa1d…` — **two different companies
carrying the same name**, left behind by a reseed. Being confirmed by counting the records that
carry that name and comparing with the rows shown.

---

# FINAL — all 65 measured on build `v26.36.8-d146c39`, 22 September 2026

**55 Passed · 7 Failed · 3 Blocked · 0 Untested.** Standing before this run: 58 Passed · 7 Failed.
Written into run 415, which now reads **171 passed · 14 failed · 18 blocked · 0 untested** across
all 203 tests.

## Every failure, and why none of them is a new report

| Check | What happens | Standing |
|---|---|---|
| C53601 | a catalogue-only part is not findable by its description word or its number | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |
| C53605 | the year and make typed together return no vehicle | [SV-10055](https://shopview.atlassian.net/browse/SV-10055) |
| C55660 | a fragment from the middle of a word finds nothing, or the wrong records | [SV-10060](https://shopview.atlassian.net/browse/SV-10060) |
| C55685 | a correct spelling returns 12 customers, 11 unrelated | [SV-10025](https://shopview.atlassian.net/browse/SV-10025) |
| C45160 | choosing a result records no usage event | **deliberate non-goal** — withdrawn 21 Sep, no report due |
| C55679 | the recent list does not come back after a fruitless search | **a real V1 loss**; the case itself says to wait for the PO ruling |
| C53582 | typing the town or state does not return the seeded customer | **ours** — later fixtures all carry the same town and outrank it; the field is searchable, every row returned is in that town |

**⇒ ZERO new defects to raise from these 65 checks.**

## One recovered since 17 September

**C55673** — Enter now opens the top result with no arrow key first. Its report
[SV-10061](https://shopview.atlassian.net/browse/SV-10061) is already OBSOLETE.

## The three blocked, and the one thing that finishes them

**C45151 · C45152 · C55684** — branch scoping. **Five routes tried and the branch never moves for
this sign-in:** the switch behind the screen (reports success, nothing moves) · the branch picker on
screen · a full page reload after the change · three readings there-and-back-and-there ·
**signing in as Jennifer Phillips, whose own branch IS the second one** — the app still shows the
first. **To finish: one staff account genuinely tied to the second branch, or a sign-in whose branch
moves.** Not a fault in search, and it blocks nothing else.

**Contrary evidence worth keeping:** earlier in the session the branch did sit on the second one,
and the same word returned **2 jobs instead of 20** — which is the scoping working.

## 🔴 THIRTEEN instrument faults caught on this run before anything was written down

| # | I nearly reported | It was |
|---|---|---|
| 1–8 | eight findability checks "broken" | the All view lists only **five** rows per group; the record sat below it. Reading the scope tab, all eight pass |
| 9 | expectations matching the wrong record | *"Brake Chamber"* also matches two unrelated stock parts |
| 10 | *"one character already runs a search"* | the tab strip is on screen before you type; what says a search ran is the **counts** |
| 11 | *"rows carry no icon / only one icon"* | every icon shares the class `lucide-icon`; the shape is in the drawing. **Eight icons, eight kinds** |
| 12 | *"a part-sales role sees nothing"* | I built a role **the product refuses to create**. [SV-10278](https://shopview.atlassian.net/browse/SV-10278) was withdrawn 20 Sep for exactly this |
| 13 | *"the same customer is listed twice"* | two **different** customers whose names start with the same words |

**And one false statement about the product that was written and is recorded rather than quietly
fixed:** a run of mine wrote *"the product refuses to create a work order — a server error every
time."* **Untrue.** The create returned 201 twice; my code failed to read the new job's id, which
the reply carries as `work_order_id`. Read correctly, **C53587 passes** — a job created minutes
earlier is found in about 8 seconds.

## State left on the branch

Three throwaway jobs (`S-17714`, `S-17715`, `S-17716`) could not be removed — the delete call
answers 400 and the job-list endpoint returns nothing to find them by. The Technician role was
restored and **read back identical** after every permission run. The branch is back on
**Staging Heavy Duty - 9919**.
