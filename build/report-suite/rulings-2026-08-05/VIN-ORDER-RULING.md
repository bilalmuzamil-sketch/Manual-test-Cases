# The vehicle-number order — what every source actually says, and the decision taken

**Report Suite · epic [SV-8582](https://shopview.atlassian.net/browse/SV-8582) · PO Chris Ward · written 2026-08-05**

**RESEARCH ONLY. NOTHING WAS WRITTEN ANYWHERE.** No TestRail write, no Jira write, no case edit,
and **`CLAUDE.md` was not touched**. Every read below was a read-only `get`.

---

## THE DECISION — recorded, not proposed

The QA lead ruled on 2026-08-05, verbatim:

> **"COnsider the latest piece of information as the authentic one and do mention in the expected
> behavior after a line break about where the PO asked for this behavior and where it differes and we
> have taken the last information as the prevailing one."**

**So the decision is taken, and it is this:**

1. **Chris Ward's newest word prevails.** On **Work In Progress** the asset is identified by its **unit
   number first**, with the vehicle number underneath — his answer of 2026-08-05.
2. **Each affected case must say so in its expected result**, after a line break: which source the
   behaviour comes from, **where a source says something different**, and that the latest word is the
   one we have followed.

**This document exists to make that decision defensible if it is ever challenged.** Section 1 quotes
every source; section 2 dates them; section 3 answers the one question the ruling leaves open; sections
4–6 give the affected cases, the surfaces and the risk. **Two problems with the currently staged
wording were found while checking the sources, and they are in section 7 — they need fixing before the
staged edits are executed.**

**The single most useful finding, in one line:** *his newest answer does not contradict any
specification — it restores the Work In Progress specification's own text, which has said "unit number
first" since the day it was written and was never changed.*

---

## 1 · WHAT EVERY SOURCE ACTUALLY SAYS — verbatim

### 1.1 · The Work In Progress description — fetched LIVE today

**Confluence page 703660034, "WIP (Work In Progress) Report", version 6, last changed
2026-07-29T06:33:58Z by Chris Ward.** Fetched live 2026-08-05 (HTTP 200, 47,260 bytes of page body).

**It says the UNIT NUMBER LEADS. Five places, verbatim:**

> **§ overview:** "Each row shows the work order number, status, customer, **asset (unit number over
> vehicle identification number)**, advisor, how long the job has been open, an earned/remaining money
> breakdown, an optional labor-hours delta, and a pinned Total (earned + remaining)."

> **§ terminology:** "**Asset** → The vehicle or unit the job is for, identified by its unit number and
> its vehicle identification number."

> **S4-R7:** "The Asset column is a two-line cell: **the unit number on the first line in bold**, and
> the vehicle identification number on the second line in a smaller, muted style."

> **S4-R8:** "When a work order has no unit number, the Asset cell's first line shows **"(no unit #)"**;
> when it has no vehicle identification number, the second line shows **"— no VIN —"**."

> **S4-R9:** "**The Asset column sorts by unit number.**"

> **S7-R4:** "The toolbar has an Asset filter, a searchable type-ahead multi-select listing the assets
> present in the loaded jobs. **Each option shows the unit number and the vehicle identification
> number**, and the user's typed text matches against **EITHER** the unit number **OR** the vehicle
> identification number."

**Also recorded, because it matters in section 7:** the Work In Progress description **never uses the
word "plate"** — verified by a live search of the whole page body: **0 hits**. Its missing-value rule is
**placeholders**, not a fallback chain.

**Version history, read live** (`/rest/api/rest/api/content/703660034/version`, HTTP 200) — every version
authored by Chris Ward:

| Version | Saved | His own change note |
|---|---|---|
| 6 | 2026-07-29T06:33:58Z | *(none)* |
| 5 | 2026-07-21T07:13:22Z | "Milan review resolution: full-body republish from updated local spec" |
| 4 | 2026-07-20T02:00:17Z | "WIP #2: default date range = All Time; simplified summary tooltips; removed export-only Lead Tech column" |
| 3 | 2026-07-20T00:40:29Z | "Replace original WIP spec with the rebuilt Work In Progress (earned-vs-remaining) spec — code-verified, canonical layout" |
| 2 | 2026-07-17T03:30:05Z | "Header cleanup + Status: Under construction (Milan review: no WIP changes)" |
| 1 | 2026-07-12T16:11:03Z | *(none)* |

**No version of this page has ever said the vehicle number leads.** Our own spec diff of 2026-07-31
already recorded the same finding, verbatim: *"NOT changed in WIP — and this is the important one: the
asset-identifier text is UNTOUCHED"*
(`build/report-suite/spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md`, line 255).

**And the timing, which is the crux:** version 6 was saved at **06:33Z on 2026-07-29**, and our own
diff notes that *"all six edits were saved at 06:32–06:45Z on 2026-07-29, i.e. BEFORE his same-day
answer"*. **So his 29 July cross-project ruling arrived AFTER he had finished editing, and the Work In
Progress page was never revisited to carry it.**

### 1.2 · The Sales By Customer description — fetched LIVE today

**Confluence page 577634305, version 13, last changed 2026-07-31T13:02:21Z.** Fetched live 2026-08-05
(HTTP 200).

**It says the VEHICLE NUMBER LEADS — and this is where his 29 July ruling WAS written down:**

> **§ overview:** "…**Each asset row is labeled by the vehicle's VIN, falling back to Unit number, then
> plate.**"

> **§ key decision:** "**Assets are identified by VIN.** The asset label is the vehicle's VIN, falling
> back to Unit number, then plate — the identifier a shop uses to track a vehicle across its fleet —
> rather than a year/make/model description."

> **S8-R7 (asset label — primary):** "The asset label is the vehicle's VIN."
> **S8-R8 (first fallback):** "When the vehicle has no VIN, the label is the vehicle's Unit number."
> **S8-R9 (second fallback):** "When the vehicle has no VIN and no Unit number, the label is the
> vehicle's plate."
> **S8-R10 (nothing on file):** "When the vehicle has no VIN, Unit number, or plate, the label reads
> "Unknown Asset.""

> **§ change log:** "Assets identified by VIN (VIN → Unit # → plate → "Unknown Asset")…"

**This is decisive for section 3: the cross-project rule is not merely a chat message. For Sales By
Customer it is ratified specification text, and nothing has contradicted it.**

### 1.3 · The other four descriptions — all SILENT, verified live

Each fetched live 2026-08-05, HTTP 200, and searched for `VIN`, `Unit #`, `unit number`, `plate`,
`serial`:

| Description | Page | Version | Last changed | Identifier hits | Verdict |
|---|---|---|---|---|---|
| Sales By Representative | 585629698 | **15** | 2026-07-29T06:38:33Z | **0** | **SILENT** — says nothing about an asset identifier |
| Parts Velocity | 620888066 | **4** | 2026-07-29T06:41:59Z | **0** | **SILENT** |
| Technician Utilization | 641400833 | **5** | 2026-07-29T06:45:11Z | **0** | **SILENT** |
| Inventory Value | 720142338 | **3** | 2026-07-29T06:32:54Z | **0** | **SILENT** |

**Plainly: four of the six reports do not show an asset at all** — they are about representatives,
parts, technicians and stock. There is nothing in them for any identifier rule to govern.

### 1.4 · Epic SV-8582 and its child stories — SILENT, verified exhaustively

**Standing Rule 37 Tier 1 currency check, done two independent ways and reconciled:**

| Query | Children returned |
|---|---|
| `parent = SV-8582` | **102** |
| `"Epic Link" = SV-8582` | **102** |

**The two key sets are equal in BOTH directions** (`A−B` empty, `B−A` empty), with no paging remainder.

- **Composition:** **97 Story + 5 Bug.** The **story set is unchanged** from our ingest.
- **Statuses as at 2026-08-05:** Open **80** · In Progress **11** · OBSOLETE **7** · Ready to Fix **3** ·
  Done **1**. *(Our 2026-08-05 ingest recorded 10 in In Progress; it now reads 11. A status move only —
  no requirement text changed, so no case is affected. Recorded because a number that moved should be
  seen to have moved.)*

**Then the identifier question, searched exhaustively rather than sampled:**

- **All 102 descriptions** were fetched and searched for `VIN`, `unit number`, `Unit #`, `identifier`,
  `plate`, `serial`. **Not one of the 97 stories mentions an asset identifier.** The only two hits are
  our own bug tickets: [SV-8821](https://shopview.atlassian.net/browse/SV-8821) (a VIN appears purely as
  test data — *"the 2020 Ford Transit with VIN/Serial 86J8FAC1VALJ43SJY"*) and
  [SV-8823](https://shopview.atlassian.net/browse/SV-8823) (matched only on the word "tem**plate**").
- **All comments on all 102 children** were fetched. **There are 2 comments in the entire epic, and
  neither mentions the identifier.**
- Three JQL text searches — `text ~ "VIN"`, `text ~ "unit number"`, `text ~ "identifier"` — returned
  **1, 2 and 0** issues respectively, all of them the same two bug tickets.

**Verdict: the epic is SILENT. It neither supports nor contradicts either order.**

**Honesty (Standing Rule 37):** this was a **Tier 1** check plus a **targeted exhaustive text search of
every child's description and every comment**. It was **not** a full Tier 2 re-read — attachments and
inline images were not opened, and no full re-read is claimed. For this particular question that is
adequate, because the search covered every description and every comment in the epic; but if an
identifier decision were hiding in a screenshot, this pass would not have seen it.

### 1.5 · The engineering tech plan — SAYS UNIT NUMBER FIRST for Work In Progress

**`build/report-suite/tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md`, as supplied
2026-07-29. Line 532, verbatim:**

> "**Two-line Asset cell** (`#body-cell-asset`: **unit# bold / VIN** `text-caption text-grey-7`;
> fallbacks `"(no unit #)"` / `"— no VIN —"`)…"

**It agrees with the Work In Progress description exactly**, including the placeholders — and it
contains no plate fallback either.

**On Sales By Customer the tech plan does not state an order.** Line 689, verbatim:

> "**Asset drill-down (lazy, per customer):** … labels built from `invoice_vehicle_details` **text**
> fields (`year/make/model/unit/licence_plate/vin` — already denormalized…)"

It lists the available fields and says nothing about which one wins. **SILENT on the order.**

**Standing Rule 30 applies:** engineering intent **informs** but never overrules product truth. Here it
does not need to — it agrees with the product source.

### 1.6 · The walkthrough video — said SERIAL NUMBER, a third answer

**`build/report-suite/chris-answers-2026-07-28/loom-kickoff-transcript.md`, Chris Ward speaking,
timestamps his:**

> **29:54** "Using unit number as an identifier is not best in class. The industry is split. One thing
> that always remains the same, the holy grail as we like to call it for unit identification, is the
> serial number, or in some cases the bin number."

> **30:26** "One thing that always remains the same is the serial number. So that is the identifier you
> will identify. I always want to use, and if you see it, please flag it for anybody, because it's so
> important."

> **30:35** "So, just flagging it here now, ah, I need to change this on my local to, to actual serial
> number. I'm gonna also leave myself a note here."

> **30:46** "Change identifier for assets to thin serial. I'm fairly certain I've got that written into
> the spec, because I haven't touched my local in a while, but just in case I didn't, it's good to know."

**The video is the OLDEST of the three positions and is superseded twice over.** It is quoted because it
explains why the cases were ever changed at all, and because his closing line — *"I'm fairly certain I've
got that written into the spec … but just in case I didn't"* — is him telling us in advance that his
memory of his own document might not match it. **It did not.**

### 1.7 · His 29 July answer — verbatim, with the question it answered

**`build/report-suite/chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`**, relayed by the QA
lead 2026-07-29.

**His answer:**

> **"A is the correct answer"**

**His cross-project instruction:**

> **"Not just for these specs though -- really good to keep this in mind for all actions moving
> forward."**

**His terminology caution, same message:**

> "we just have to be careful with using the acronym VIN … it stands for VEHICLE identification number.
> So for a generator for example, it gets confusing when we say VIN rather than serial #. 90% of people
> will understand saying VIN though."

**⚠️ AND THE OPTIONS HE WAS CHOOSING BETWEEN — this is the most important sentence in this document.**
Our own record of that exchange states them:

> "options were **A = WIP also switches to VIN, then Unit #, then plate** / **B = WIP keeps the serial
> number**"

**Option B described the alternative as "the SERIAL number". That was not what the build or the
description did.** Both said **unit number first, vehicle number underneath**. So on 29 July he was
offered a straight choice between the vehicle-number chain and *the video's serial-number idea* — and
the option that actually matched his own written description **was not on the list**.

**That materially changes how the "reversal" should be read.** It is far more likely that he chose the
better of two options, neither of which described his document, than that he has changed his mind twice
in eight days. **Today he was shown the real thing and endorsed it.**

### 1.8 · His 2026-08-05 answer — verbatim, with the question it answered

**Source:** `chris-answers-2026-08-05/source/Chris-Ward-ANSWERED_Report-Suite_Questions-and-Decisions_2026-08-05.xlsx`,
sha256 `6da732152589a31b842adf6e1a16549c3fce0dd0ca0c4da0e5792aac924993cd` · tab **"The product vs your
write-up"** · **item 2.0**.

**The question he read** — note that this time the option described the build accurately, and told him it
conflicted with his own earlier instruction:

> "On 3 and 4 August the machine's cell showed the unit number first, in bold, with the vehicle number
> underneath it in smaller grey text - for example 6548 on the top line and 1FDSE3EL1EDB20609 underneath.
> Sorting on that column also used the unit number.
>
> So the product is following the written line above, not your ruling.
>
> One thing worth knowing before you decide, because it is your own point back to you: you told us "we
> just have to be careful with using the acronym VIN ... it stands for VEHICLE identification number. So
> for a generator for example, it gets confusing when we say VIN rather than serial #." That is already
> happening in the real data. The field labelled as the vehicle number is holding serial-number-style
> values for things that are not vehicles - live examples we read include BULK PARTS1, 12-06696 and
> P631627 - sitting alongside genuine 17-character vehicle numbers like 1FDSE3EL1EDB20609."

**His answer, verbatim:**

```
B) this is visually appealing, and already built. This looks right.
```

**Option B, as he read it:** *"we record that your ruling does not reach this one report."* **The
narrowing to one report is therefore in the option's own words, not our inference.**

---

## 2 · SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last updated | Date checked | Verdict |
|---|---|---|---|---|
| **Chris's answers** | Google Sheets `1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY`; local copy sha256 `6da7321525…` | 15 of 24 answered, returned 2026-08-05 | 2026-08-05 | **CURRENT** — the newest authoritative product source |
| **His 29 July answer** | `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md` | relayed 2026-07-29 | 2026-08-05 | **CURRENT but SUPERSEDED for Work In Progress** by the 2026-08-05 answer |
| **Work In Progress description** | Confluence 703660034 | **version 6**, 2026-07-29T06:33:58Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT — and it AGREES with the decision.** Version history read live: no version ever said otherwise |
| **Sales By Customer description** | Confluence 577634305 | **version 13**, 2026-07-31T13:02:21Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT** — carries the vehicle-number chain as ratified text (S8-R7…R10) |
| **Sales By Representative description** | Confluence 585629698 | **version 15**, 2026-07-29T06:38:33Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT — SILENT** on any identifier (0 hits) |
| **Parts Velocity description** | Confluence 620888066 | **version 4**, 2026-07-29T06:41:59Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT — SILENT** (0 hits) |
| **Technician Utilization description** | Confluence 641400833 | **version 5**, 2026-07-29T06:45:11Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT — SILENT** (0 hits) |
| **Inventory Value description** | Confluence 720142338 | **version 3**, 2026-07-29T06:32:54Z | 2026-08-05, **fetched live, HTTP 200** | **CURRENT — SILENT** (0 hits) |
| **Epic SV-8582** | Jira epic, hierarchy level 1 | **102 children** (97 Story + 5 Bug); verified two ways, sets equal both directions | 2026-08-05, **read live** | **CURRENT — SILENT.** All 102 descriptions + all comments searched; 0 stories mention an identifier |
| **Engineering tech plan** | `tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md` | as supplied 2026-07-29; no newer version offered | 2026-08-05 | **CURRENT — AGREES** with the decision for Work In Progress; SILENT on Sales By Customer |
| **Walkthrough video** | `chris-answers-2026-07-28/loom-kickoff-transcript.md`, P24 29:54–30:46 | 2026-07-28 | 2026-08-05 | **SUPERSEDED TWICE** — said "serial number"; overtaken 29 July and again 5 August |
| **Our 469 cases** | TestRail project 1 / suite 1 / group 4281 | live | 2026-08-05, read-only `get_sections` + `get_cases` | **CURRENT** — 474 live, minus 5 foreign = 469 ours |
| **Designs** | none exist for this project | n/a | 2026-08-05 | **ABSENT** — spec-only project; no Rule-35 fetch queue applies |
| **The build** | `sv8582.qa.shopview.com`, `v3.4.1-3d03023` as last observed 2026-08-04 | **not re-read this pass** | — | **NOT OBSERVED THIS PASS** — no application opened. The Rule-49 queue `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN**, so every verdict on this project remains provisional |

**Nothing was unreachable.** All six descriptions, the page version history, the epic, all 102 child
descriptions, all comments, and all 469 cases were read successfully today. The only source not
consulted is **the running application**, and that is stated rather than papered over.

---

## 3 · DOES THE CROSS-PROJECT RULE SURVIVE? — the question the ruling leaves open

The QA lead's reading, verbatim: *"latest-wins settles Work In Progress, and the cross-project rule
stands everywhere it has not been contradicted."*

### **The evidence supports him — and makes it stronger than a judgement call.** Four reasons.

**1 · His newest answer is expressly about one report, in the option's own words.** The option he ticked
reads *"we record that your ruling does not reach **this one report**."* He did not write a new general
rule; he endorsed a specific screen — *"this is visually appealing, and already built."* **A repeal would
have to be general, and this is not.**

**2 · The newest answer contradicts NO specification. It restores one.** This is the finding that
matters most. The Work In Progress description has said *"the unit number on the first line in bold"*
(S4-R7) and *"sorts by unit number"* (S4-R9) **in every version since the page was written**, and version
6 was saved **before** his 29 July ruling and never revisited. **So what changed on 29 July was not the
document — it was our four test cases, which we moved away from the document on the strength of a chat
message. Today's answer moves them back.** Nothing is being overturned; a gap is being closed.

**3 · For Sales By Customer the rule is ratified specification text, not a chat message.** SBC version 13
carries **S8-R7 / S8-R8 / S8-R9 / S8-R10** and a named key decision — *"Assets are identified by VIN"* —
plus a change-log row. **A per-report answer about a different report cannot repeal another report's
written requirement.** To lose the vehicle-number chain on Sales By Customer, Chris would have to edit
Sales By Customer.

**4 · On the other four reports there is nothing to repeal.** Sales By Representative, Parts Velocity,
Technician Utilization and Inventory Value are **silent — 0 hits each, verified live** — because none of
them shows an asset. **Zero of our cases on those four reports asserts an identifier order** (searched all
469; see section 4).

### The honest caveat, stated plainly

**His 29 July words were general — *"really good to keep this in mind for all actions moving forward"* —
and that sentence is now recorded in `CLAUDE.md` as a rule affecting every future project.** A
per-report exception is therefore a fair thing to be challenged on, and there is one uncomfortable fact
to hold alongside it: **section 1.7 shows the 29 July ruling was given against an option set that
mis-described the alternative as "the serial number"**. A durable cross-project rule resting on an answer
to a mis-described question is worth a second look **on its own merits** — separately from Work In
Progress, and by Chris rather than by us.

**That is not an argument for changing it today.** It is an argument for knowing why it is there.

### RECOMMENDATION — for the QA lead to fold in; `CLAUDE.md` NOT touched

**Narrow the durable rule, do not repeal it.** Suggested wording, his to accept or rewrite:

> The asset-identifier chain **VIN → Unit # → plate** remains the standard everywhere, per Chris Ward
> 2026-07-29. **EXCEPTION — the Work In Progress report:** Chris ruled 2026-08-05 that its two-line Asset
> cell keeps the **unit number first** with the vehicle number underneath. That is not a drift from the
> standard but a return to the Work In Progress description's own text (page 703660034 v6, S4-R7 / S4-R9 /
> S7-R4), which has always said so and which his 29 July instruction was never written into. Sales By
> Customer keeps the chain, and it is ratified specification text there (page 577634305 v13, S8-R7…R10).
> The other four reports show no asset, so the rule does not reach them.

**A second, smaller recommendation:** record the *"unit number over vehicle number"* two-line layout as
**Work In Progress-specific**, not as a competing general standard — otherwise the next project will read
the exception as a precedent.

---

## 4 · EVERY AFFECTED CASE, ACROSS ALL SIX REPORTS

### How the population was searched (Standing Rule 50 — exhaustive, no sampling)

- Pulled **live from TestRail, read-only**, 2026-08-05: `get_sections` + `get_cases`, filtered to the
  **96 sections** under group **4281 "Reports Suite"**.
- **474 cases live. Minus 5** authored by Vladimir Tomovic (C38919–C38923 — hands off, Standing Rule 38)
  = **469 ours.**
- Searched the **title, preconditions, steps and every expected result of all 469** with a
  case-insensitive regex: `VIN | Unit # | unit number | vehicle number | licence/license plate | plate |
  serial | identifier`. **14 cases matched.** Every one is verdicted below — including the four that
  matched only on an unrelated meaning of "identifier", so the reader can see nothing was quietly dropped.
- **38 cases mention an asset at all**, and they fall in only two reports: **Sales By Customer 25** and
  **Work In Progress 13**. **Sales By Representative, Parts Velocity, Technician Utilization and
  Inventory Value: zero.** That is the mechanical confirmation of section 3's fourth reason.

### 4.1 · Work In Progress — the four staged cases (all FROZEN today)

| Case | What it says TODAY, verbatim | Under the decision taken (unit number first) | If the durable rule had won instead |
|---|---|---|---|
| **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | "1. The Asset cell identifies the asset by its VIN." / "2. When the asset has no VIN, the cell shows its Unit # instead…" | **REWRITE** — unit number bold on line 1, vehicle number underneath (spec S4-R7) | stands as written; a developer ticket against the build |
| **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | "4. The Asset column sorts by the identifier it shows - the VIN, falling back to Unit #, then plate." | **REWRITE** — sorts by unit number (spec S4-R9) | stands as written; developer ticket |
| **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | "2. Each option identifies the asset by its VIN, falling back to Unit #, then plate…" | **REWRITE** — each option shows **both**, and typed text matches **either** (spec S7-R4) | stands as written; developer ticket |
| **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | "4. Note: the on-screen Asset cell now identifies the asset by its VIN (falling back to Unit #, then plate); whether the export header text changes from "Unit" is confirmed in the build - record what it shows, do not file a bug either way." | **REWRITE** — the export header "Unit" already matches the screen, so no header change is expected | the hedge stays |

### 4.2 · Work In Progress — a FIFTH case nobody had listed, and it is LIVE

**WIP-VIS-07** = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) — *"In dark mode
every table; strip; link and coloring stays legible"* — **is live today, is not frozen, and its step 2
reads:**

> "2. Read the summary strip, the WO # link, the Inv. Hrs colors, and **the two-line asset cell (bold
> unit over muted VIN)**."

**Quoted side by side with the case it contradicts** (Standing Rule 45(e)):

| **WIP-VIS-07** = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525), step 2 | **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470), expected 1 |
|---|---|
| "the two-line asset cell (**bold unit over muted VIN**)" | "The Asset cell identifies the asset by its **VIN**." |

**These cannot both be true, and they have both been live in the same suite since 29 July.** It is a
cross-case contradiction of exactly the kind Standing Rule 28's consistency sweep exists to catch, and
the 29 July pass — which changed four cases — did not reach this one.

**Under the decision taken it needs NO change: it was right all along**, and it agrees with the
description, the tech plan and the build. **It is listed here because someone will eventually ask how
long the suite disagreed with itself, and the honest answer is seven days.**

### 4.3 · Sales By Customer — the vehicle-number chain STANDS

| Case | What it says, verbatim | Verdict |
|---|---|---|
| **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) — FROZEN | "1. Asset (a) is identified by its VIN." / "2. Asset (b) (no VIN) is identified by its Unit # instead." / "3. Asset (c) (no VIN or Unit #) is identified by its plate instead." | **NO CHANGE.** It matches Sales By Customer version 13 S8-R7 / S8-R8 / S8-R9 word for word. **This is the case that must NOT be touched**, and section 3 is the answer to anyone who asks why it differs from Work In Progress |
| **SBC-LBL-04** = [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) — live | precondition: "assets whose labels come out identical (same year/make/model and same **identifier** situation)" | **NO CHANGE** — the identifier is only seeding context; the case is about the (#1)/(#2) suffixes |

**One over-hedge found while checking (Standing Rule 41), recommended not executed.** SBC-LBL-01's line 4
reads *"For asset (d) … note what the label shows - what stands in when all three are missing is confirmed
in the build (the older rule showed "Unknown Asset")"* — but **Sales By Customer version 13 S8-R10 now
pins it**: *"When the vehicle has no VIN, Unit number, or plate, the label reads "Unknown Asset.""* **The
hedge is no longer needed and could be made definite.** Not staged; it is outside what was asked.

### 4.4 · The four cases that matched only on an unrelated meaning of "identifier"

Listed so the sweep is auditable and nothing looks skipped. In all four, "identifier columns" means
**Date / Invoice / Customer / Status** — nothing to do with an asset:

| Case | Its own words | Verdict |
|---|---|---|
| **SBR-ROW-02** = [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | "the desktop Totals row merges the four leading **identifier** columns" | **NOT AFFECTED** |
| **SBR-TOT-02** = [C30238](https://shopview.testrail.io/index.php?/cases/view/30238) | "spanning the four leading identifier columns (**Date, Invoice, Customer, Status**)" | **NOT AFFECTED** |
| **SBR-SORT-01** = [C30241](https://shopview.testrail.io/index.php?/cases/view/30241) | "The identifier columns (Date, Invoice, Customer, Status) do not respond to header clicks." | **NOT AFFECTED** |
| **SBC-LBL-04** = [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | as above | **NOT AFFECTED** |

### 4.5 · The four cases that name a VIN COLUMN, not an identifier order

Work In Progress has a separate, switchable column literally headed **VIN**. Its name and position are
untouched by either option:

| Case | Its own words | Verdict |
|---|---|---|
| **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) — FROZEN | "1. The columns appear in this order: WO #, Status, Customer, Asset, **VIN**, Location, Advisor, …" | **NO CHANGE** — a column-order claim, matching spec S4-R1 |
| **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) — FROZEN | "2. Every other column (**VIN**, Location, …) is available in the column-selection control and off by default." | **NO CHANGE on the identifier.** (This case is separately blocked by the location-column question — see `LOCATION-CONTRADICTION.md`) |
| **WIP-PERS-02** = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) — live | "…the fixed left-to-right order (WO #, Status, Customer, Asset, **VIN**, Location, …)" | **NO CHANGE** |
| **WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) — FROZEN | "1. Location is offered in the column-selection control, **between VIN and Advisor**…" | **NO CHANGE on the identifier.** (Also separately blocked by the location question) |

### The count

| | Count |
|---|---|
| Our cases searched | **469** (474 live under group 4281, minus 5 foreign) |
| Matched the identifier search | **14** |
| **Change under the decision taken** | **4** — all Work In Progress, all frozen, all already staged |
| **Right as they stand and must NOT be changed** | **1** — WIP-VIS-07 = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525), live, and it contradicts the four |
| **Sales By Customer keeps the vehicle-number chain** | **1** — SBC-LBL-01 = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) |
| Not affected (unrelated "identifier", or the VIN column) | **8** |
| Cases on the other four reports asserting an identifier order | **0** |

**Under the alternative — had the durable rule won everywhere — the four Work In Progress cases would
stand as written, WIP-VIS-07 = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) would
need rewriting instead, and a developer ticket would be needed against a build that matches its own
description. Five cases move either way; the direction is what differs.**

---

## 5 · SURFACE MATRIX (Standing Rule 40)

One verdict per surface. "Not applicable" is allowed; silence is not.

### 5.1 · Work In Progress

| Surface | Verdict under the decision taken | Case |
|---|---|---|
| **On screen — the Asset cell** | **REWRITE** — unit number bold on line 1, vehicle number muted underneath | **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) |
| **On screen — dark mode rendering** | **NO CHANGE — already correct** | **WIP-VIS-07** = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) |
| **Sorting** | **REWRITE** — sorts by unit number | **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) |
| **The asset filter** | **REWRITE** — options show both; typed text matches either | **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) |
| **CSV download** | **REWRITE** — the header "Unit" already matches the screen, so the "will it change?" hedge goes | **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) |
| **PDF download** | **REWRITE — same case covers both files** ("In BOTH the PDF and the CSV, the same two columns are headed "Unit" and "Branch"") | **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) |
| **Print** | **NOT APPLICABLE** — Print is retired from the product, and Chris confirmed that in item 9.0 of tab 2: *"Love this flag. Intentionally dropped :). Great call-out!"* | — |
| **The separate VIN column** | **NO CHANGE** — name and position untouched | **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) · **WIP-PERS-02** = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) |
| **Column order / persistence** | **NO CHANGE** | **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) · **WIP-PERS-02** = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) |
| **API / response payload** | **NO CHANGE** — searched all 469; **no API case of ours asserts a display identifier** | — |
| **Mobile / responsive** | **NOT APPLICABLE** — no mobile case of ours asserts the asset cell's layout | — |
| **Email / scheduled delivery** | **NOT APPLICABLE** — no such feature in this suite | — |

### 5.2 · Sales By Customer

| Surface | Verdict | Case |
|---|---|---|
| **On screen — the asset row label** | **NO CHANGE** — the vehicle-number chain stands, matching version 13 S8-R7…R9 | **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) |
| **Duplicate-label suffixes** | **NO CHANGE** | **SBC-LBL-04** = [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) |
| **CSV download (Expanded View)** | **NO CHANGE — and a GAP, honestly stated.** The case asserts the **Asset column exists** and its blank-cell rules, but **never what the Asset cell contains**: "3. An asset row leaves Customer blank, fills Asset, and leaves Invoice # and Date blank." **So no download case would catch the identifier being wrong in the file.** | **SBC-EXP-03** = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) |
| **PDF download (Expanded View)** | **NO CHANGE — same gap.** "1. The Expanded View PDF's body table has the same columns, in the same order and with the same labels, as the Expanded View CSV…" — it inherits the CSV's silence | **SBC-EXP-11** = [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) |
| **Summary downloads** | **NOT APPLICABLE** — the Summary files have no Asset column: "no Asset, Invoice # or Date columns" | **SBC-EXP-16** = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) |
| **Print** | **NOT APPLICABLE** — retired | — |
| **API** | **NO CHANGE** — "1. Customer summary rows load WITHOUT the asset/invoice detail" asserts fetch behaviour, not label text | **SBC-API-01** = [C30190](https://shopview.testrail.io/index.php?/cases/view/30190) |
| **Mobile** | **NOT APPLICABLE** — no mobile case asserts the asset label | — |

**The download gap is a genuine coverage observation, not a change either option requires.** It is
recorded rather than fixed: **the identifier order is asserted on screen on both reports, and in the
downloads on neither.** If Chris ever reverses direction again, the files would not tell us.

### 5.3 · The other four reports

| Report | Surface | Verdict |
|---|---|---|
| Sales By Representative | all | **NOT APPLICABLE** — no asset shown; description silent (0 hits); 0 cases assert an identifier order |
| Parts Velocity | all | **NOT APPLICABLE** — same |
| Technician Utilization | all | **NOT APPLICABLE** — same |
| Inventory Value | all | **NOT APPLICABLE** — same |

---

## 6 · WHAT HAPPENS IF WE GET IT WRONG — each way, in plain words

### If we say the vehicle number leads, and the unit number is actually correct

**A tester fails a build that is right.** They open Work In Progress, see `6548` in bold with
`1FDSE3EL1EDB20609` underneath, and the test tells them the vehicle number should lead. They mark it
failed and raise a defect. **A developer then spends time on a screen that matches its own written
description, its tech plan and the product owner's newest word** — and the false report costs more than
the test does, because it also teaches the team to distrust the suite.

**This is not hypothetical. It is the state the suite has been in since 29 July**, which is why the four
cases were frozen with a "DO NOT AUTOMATE YET" line — the freeze is the only thing that has prevented it
so far.

### If we say the unit number leads, and the vehicle number is actually correct

**We miss a real fault, quietly.** Every shop that identifies its fleet by vehicle number would be
looking at the wrong identifier on their busiest report, sorting and filtering by the wrong field, and
**every one of our four tests would pass**. Nothing would flag it.

**Which is worse?** The second, ordinarily — a missed fault ships, a false alarm only wastes a day. **But
here the risk is heavily one-sided in the other direction**, because the evidence for the unit number is
not one message: it is the description (never changed), the tech plan (independently), the build (observed
2026-08-03 and 2026-08-04), his newest answer, **and** a live case of our own that has said so all along.
**Four independent sources agree; the only source that ever said otherwise was a chat message answering a
question whose alternative was mis-described.**

### And the risk on the durable rule specifically

**If the cross-project rule were repealed on the strength of a one-report answer**, then Sales By
Customer's ratified requirement (version 13, S8-R7…R10) would be contradicted by a decision that never
mentioned it, **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) would be
rewritten away from its own specification, and every future project would inherit an identifier standard
that no document supports. **That is the more expensive mistake of the two, and it is the one the
narrowing recommendation in section 3 avoids.**

---

## 7 · ⚠️ TWO PROBLEMS IN THE CURRENTLY STAGED WORDING — found while checking the sources

**These are not objections to the decision. They are defects in the words staged to implement it**, and
both would put a tester at odds with a correct build. Standing Rule 41 says a case opened for any reason
gets re-read whole; that re-read produced these.

### 7.1 · Three staged rewrites invent a "then plate" fallback that NO Work In Progress source supports

The staged texts in `chris-answers-2026-08-05/testrail-sync-manifest.md` keep the *shape* of the old
vehicle-number sentence and simply swap the order — carrying the word **plate** across with it:

| Staged operation | The staged AFTER text, verbatim | What the Work In Progress description actually says |
|---|---|---|
| **op 23** — **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | "2. When the asset has no Unit #, the cell shows its VIN instead; **when it has neither, it shows its plate instead.**" | **S4-R8:** "When a work order has no unit number, the Asset cell's first line shows **"(no unit #)"**; when it has no vehicle identification number, the second line shows **"— no VIN —"**." — **placeholders, not a fallback; and no plate** |
| **op 24** — **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | "4. The Asset column sorts by the identifier it shows - the Unit #, falling back to the VIN, **then plate**." | **S4-R9:** "**The Asset column sorts by unit number.**" — no fallback chain at all |
| **op 25** — **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | "2. Each option identifies the asset by its Unit #, **falling back to the VIN, then plate**…" | **S7-R4:** "Each option shows **the unit number AND the vehicle identification number**, and the user's typed text matches against **EITHER** … **OR** …" — both are shown, and either matches; it is not a fallback |

**Proof that "plate" is unsourced for this report:** the live page body of Confluence 703660034 version 6
was searched for `plate` — **0 hits**. The tech plan's Work In Progress section names the placeholders
`"(no unit #)"` / `"— no VIN —"` and no plate either.

**The consequence if executed as staged:** a tester seeding an asset with no unit number would see
**`(no unit #)`** on the first line — exactly what the description promises — and the case would tell
them to expect the vehicle number. **They would mark a correct build failed.** It is the same failure
mode the freeze was protecting against, re-introduced in the fix.

**This also breaches Standing Rule 42:** *"the Unit #, falling back to the VIN, then plate"* is a closed
enumeration, and it is pinned to nothing.

**Recommended correction** (three operations, wording only — **not applied here**): state the Work In
Progress model in its own terms — a **two-line cell** showing both values, with **`(no unit #)`** and
**`— no VIN —`** as the placeholders when one is missing; sorting **by unit number**; the filter showing
**both** and matching **either**. **Drop "plate" for this report entirely** unless Chris says otherwise.

### 7.2 · The staged provenance line already satisfies the QA lead's ruling — confirmed, with one gap

His ruling asks each case to say *"where the PO asked for this behavior and where it differs and we have
taken the last information as the prevailing one."* **The staged wording does exactly that.** From
operation 23, verbatim:

> "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the
> Work In Progress report specification version 6 (S4-R7, S4-R8, S4-R10) says something different, the
> behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that
> decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true"

**It names the source, names the specification and the exact requirements it differs from, says the later
decision prevails, and links his file** — Standing Rule 54's shape, and his ruling's shape, both met.
**No change needed.**

**The one gap:** on these four cases the specification does **not** in fact say something different — it
says the same thing. The sentence is written as a difference where there is agreement. **A more accurate
line would say the decision and the description now agree, and that it is our earlier position which
followed the superseded 29 July instruction.** That is a wording nicety, not a defect, and it is the QA
lead's call whether it is worth an edit.

---

## OUTSTANDING — what I need from you

| What is needed | Who owes it | What it blocks | Since |
|---|---|---|---|
| **A line on the durable rule in `CLAUDE.md`** — accept the narrowing wording in section 3, or rewrite it | **the QA lead** | Nothing operationally: the four Work In Progress cases are staged and the decision is taken. But **while `CLAUDE.md` says the chain applies everywhere, our own suite visibly disagrees with it on one report**, and the next reader cannot tell an exception from a mistake | 2026-08-05 |
| **Go-ahead to correct the three staged texts** (section 7.1) before the 46-operation push runs | **the QA lead** | If the push runs as staged, **three tests would fail a correct build** on the missing-value branch — the same trap the freeze was preventing | 2026-08-05 |
| **A decision on WIP-VIS-07** = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) | **the QA lead** | Nothing — it is correct as it stands. **But it is live, it was not in the staged set, and it contradicted four of our own cases for seven days.** Worth noting in the record rather than passing over | 2026-08-05 |
| **The SBC-LBL-01 over-hedge** (section 4.3) | **the QA lead** | Nothing. A small improvement now that version 13 S8-R10 pins *"Unknown Asset"* | 2026-08-05 |
| **A live build check, if wanted** | **the QA lead** (fresh sign-in) | **No application was opened in this pass.** The unit-number-first behaviour rests on observations of 2026-08-03/04 plus four documents, not on a fresh look | not requested |
| **The QA branch declared final** | **Engineering**, via the QA lead | Every verdict on all 469 tests stays **provisional**; the Rule-49 queue `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** | 2026-08-03 |

**Nothing was unreadable this pass.** All six descriptions, the Work In Progress version history, epic
SV-8582 with all 102 children's descriptions and comments, the tech plan, the video transcript and all
469 cases were read successfully. The only source not consulted is the running application, and that is
said plainly rather than filled in with inference.
