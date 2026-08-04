# Schedule — PO-RULING DEFENCE REGISTER

**Why this file exists.** QA lead's ruling, verbatim 2026-08-04:
*"For now keep what Branko said, but if we are questioned we should have a reference to
present in our defense."*

So: Branko's rulings **stand** as the cases' position (Rule 32 latest authoritative
product source wins; Rule 33 the PO outranks spec prose), and every one of them is
**provable here without a scramble**.

**Scope:** the 165 active Schedule cases, all live in TestRail group 4254.
**Sources current as of 2026-08-04** — see `SOURCE-CURRENCY.md`. Spec = Confluence page
**713031682**, **Confluence version 23**, updated 2026-07-30 (byte-length verified
identical to our mirror). Epic = **SV-8685** (16 children; SV-8812 is new).

## Headline counts

| Category | Cases | Risk if challenged |
|---|---|---|
| **A — PO ruling overrides live spec text** | **5** | LOW ×4 · MEDIUM ×1 |
| **B — the spec states the point BOTH ways and there is NO ruling** | **3** | **HIGH ×2** · MEDIUM ×1 |
| **C — spec covers the area; the specific limits are engineering's** | **2** | MEDIUM ×2 |
| **D — no Schedule-spec requirement at all** | **5** | MEDIUM ×4 · LOW ×1 |
| **Total carrying a non-plain provenance line** | **15 of 165** | |

**Ruling wording NOT established: 0** for groups A. **Group B has no ruling at all and
says so** — that is the point of it.

---

## A — PO RULING OVERRIDES THE LIVE SPEC TEXT (5 cases)

### A-i · The money ruling (3 cases)

**Branko's ruling, VERBATIM (2026-07-22, Q3 of the Branko ↔ Milan Q&A):**

> **"We do not show total $ anywhere in the schedule. We can hide other items that fall
> under that permission."**

**Source of record:** `build/schedule/spec-v1-2026-07-22/spec-diff-v1-2026-07-22.md` §2,
row **Q3** (the Q&A → case-impact resolution table). Mirrored into the case bodies'
`notes` (e.g. `build/schedule/cases/cases-F-permissions-edge.json` line 368) and executed
in `spec-v1-2026-07-22/testrail-execution-log-2026-07-22.md` op 1.

**What the spec says — VERBATIM, spec v23 §4.9 (Shift detail modal), the bullet list of
what the panel shows:**

> **"Scope summary and the scheduled line(s) with labor/total figures."**

**That is a direct contradiction**, and it is still present in the newest version of the
page (v23, 2026-07-30 — the version Branko edited himself the same week he answered).

**Why the ruling wins:** it is the newer authoritative product source (Rule 32) and the PO
outranks spec prose (Rule 33). It is also corroborated by the **Claude design prototype**
(`Schedule.dc.html`, ruled authoritative by Branko's Q0), whose modal shows line
number / title / hours / status pill only.

**Who can close it:** **Branko**, by deleting *"with labor/total figures"* from §4.9.
**This ask has NOT been put to him** — it was recorded as a doc-hygiene flag, never sent.

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A1 | **SCH-MODAL-04** · [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) — *The modal lists the scheduled line(s) with no money fields* | *"No labor figures and no total dollar amount appear anywhere in the modal."* | LOW — the ruling is verbatim, explicit and design-corroborated |
| A2 | **SCH-PERM-12** · [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) — *With Work Orders: View OFF, work order details on shifts are hidden* | *"Work-order-derived details (customer, the scheduled line list, and any money-bearing fields) are hidden or masked…"* | LOW — the permission half is spec-backed (§14.2); only the money clause rests on the ruling |
| A3 | **SCH-API-03** · [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) — *API - No pricing fields in Schedule responses…* | *"No Schedule response contains any pricing/money field for ANY caller - the schedule never returns labor, totals, or dollar amounts."* | MEDIUM — extends "not shown on screen" to "never returned by the API", which the ruling does not literally say; the tech plan (D6/NFR-002) does |

**PASTE-READY ANSWER (A-i):**
> The written spec still says the shift pop-up lists the work order lines "with
> labor/total figures", but Branko decided on 22 July 2026, in writing, that "we do not
> show total $ anywhere in the schedule". The design he approved shows the same thing —
> line number, title, hours and a status pill, no money. So the tests expect no money in
> the schedule. His decision is newer than that sentence in the document, and the newest
> product decision wins. The sentence still needs deleting from the spec, and that is an
> ask for him.

### A-ii · The tooltip VIN ruling (2 cases)

**Branko's ruling, VERBATIM (2026-07-31, Q6, answer A):**

> **"A. Vin is always visible on hover regardless of the toggle"**

**Source of record:** `build/schedule/branko-answers-2026-07-31/answers-ingested.md` §Q6.
Also quoted in `build/schedule/requirements.md` line 611.

**The spec contradicts ITSELF, and the ruling settles it — both passages VERBATIM, v23:**

- **§4.13 (Shift tooltip) — supports us:** *"Shift tooltip: customer name (plus the
  conflict icon if conflicted); unit, vehicle, and VIN; date and time range; …"* — an
  unconditional list.
- **§9 (View options table, VIN row) — contradicts us:** *"Shows the VIN number as an
  additional line on shift blocks (day and week views) **and in hover tooltips**. The VIN
  is always visible in the shift detail modal regardless of this toggle."* — this row puts
  the **tooltip** under the toggle and exempts only the **modal**.

**Why the ruling wins:** Rules 32/33 — and note it **ratifies a reading we had already
reached on 2026-07-22 from the design**, so the PO is confirming us rather than changing
us.

**Who can close it:** **Branko**, by fixing the §9 VIN row. Recorded as a doc-hygiene flag
in both case bodies; **the ask has NOT been sent.**

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A4 | **SCH-TIP-01** · [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | *"the tooltip shows the VIN whenever the unit has one, regardless of the 'VIN Number' toggle"* | LOW |
| A5 | **SCH-VIEW-04** · [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | *"The 'VIN Number' toggle affects the block only - the tooltip and the modal always show the VIN when the unit has one."* | LOW |

**PASTE-READY ANSWER (A-ii):**
> The spec says two different things about the VIN in the hover note: section 4.13 lists it
> without any condition, while the view-options table ties it to the "VIN Number" switch.
> We asked Branko and on 31 July he answered "Vin is always visible on hover regardless of
> the toggle". Our tests already worked that way, so his answer confirms them. The
> view-options table still needs correcting, and that is an ask for him.

---

## B — THE SPEC STATES IT BOTH WAYS AND THERE IS **NO** RULING (3 cases)

**⚠️ This is the group with the real exposure. There is no PO decision to quote.**

**The spec contradicts itself in the SAME version (v23) — both passages VERBATIM:**

- **§4.5 (Multi-day spread) — what our cases follow:** *"Uses the technician's own working
  hours. Automatically skips weekends when business hours are not set for them. **Shop
  closures and public holidays are not skipped in V1.**."*
- **§12 — the opposite:** *"Shop closures (holidays, inventory days) are defined at the
  shop level and **block the spread step from placing shifts on those days**."*

**Branko ruling: NONE.** This is our open question **NQ-1**
(`build/schedule/branko-answers-2026-07-31/answers-ingested.md`, "STILL OUTSTANDING" #2).
It sits on the **`PO-Questions-Branko-Schedule-TechPlan_2026-07-30`** sheet as Q1, which
the ingest record states **appears unsent and unanswered**.

Per **Rule 15** we do not pick a side silently: the provenance line on all three cases
says the spec describes the point two ways and a product decision is awaited. Our cases
follow the **explicitly V1-scoped** sentence, which is the better reading of a
first-release spec — but it is a reading, not a ruling.

**Who can close it:** **Branko**, answering NQ-1. **The sheet needs sending.**

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| B1 | **SCH-EDGE-05** · [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) — *Shop closures do NOT block spread in V1* | *"A shift CAN be placed on the shop closure day (only weekend days with no business hours are skipped)."* | **HIGH** — the entire case inverts if he rules the other way |
| B2 | **SCH-SPREAD-07** · [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | *"Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days."* | **HIGH** — one expected result would flip |
| B3 | **SCH-SPREAD-08** · [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | *"in V1 the only skip reason is a weekend day with no working hours set"* | MEDIUM — a qualifier, not the case's core |

**Note on the engineering tech plan:** it **agrees with §12** (closures block the spread),
which is the other side of the argument. So on this point the spec's own §4.5 is the *only*
support for our position — which is exactly why the risk is HIGH and why the answer
matters.

**PASTE-READY ANSWER:**
> The spec says two opposite things about shop closure days: the spread section says
> closures are **not** skipped in the first release, and section 12 says closures **do**
> block the spread. Nobody has decided yet. Our tests follow the sentence that is
> explicitly about the first release, and they say on their face that a decision is still
> awaited. We have this question ready for Branko and it needs sending. If he rules that
> closures block the spread, these three tests change.

---

## C — SPEC COVERS THE AREA; THE SPECIFIC LIMITS ARE ENGINEERING'S (2 cases)

The spec's §4.5 describes the spread but sets **no length or count cap** anywhere (a
full-text scan for "8 week", "120" and "cap" finds only the 3-lane display cap, the
technician-roster "no cap" statements, and a §15 *future*-considerations "long-job cap").
The **8-week confirmation** and the **120-shift hard limit** come from the engineering tech
plan **D8**.

**Who can close it:** **Branko** confirming the caps are product-intended, or engineering
confirming the numbers are final. **Not asked.**

| # | Case | Basis | Risk |
|---|---|---|---|
| C1 | **SCH-SPREAD-11** · [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | *"a warning … asks you to confirm"* past 8 weeks; *"more than 120 daily shifts is refused outright"* — tech plan D8 | MEDIUM — engineering intent, never ratified by the PO (Rule 30) |
| C2 | **SCH-API-02** · [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | the same caps as HTTP **409** / **422** — tech plan D8 error cases | MEDIUM — the exact status codes are engineering's alone |

**PASTE-READY ANSWER:**
> The spec describes spreading a job over several days but never gives a maximum length.
> The "confirm past 8 weeks" and "never more than 120 shifts" limits in these two tests
> come from the engineering plan, and the tests say so. They are sensible limits, but no
> product decision has confirmed them.

---

## D — NO SCHEDULE-SPEC REQUIREMENT AT ALL (5 cases)

These five derive **entirely** from the engineering tech plan. Their provenance line says
so in words rather than citing a requirement that does not exist (Rule 12).

| # | Case | Basis | Risk |
|---|---|---|---|
| D1 | **SCH-REG-01** · [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) — pre-rewrite shifts survive the release | tech plan §3 **FR-015** data migration | MEDIUM |
| D2 | **SCH-REG-02** · [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) — Dashboard shows one row per work order | tech plan §4 **FR-016** | MEDIUM — asserts a *changed* Dashboard behaviour no product doc states |
| D3 | **SCH-REG-03** · [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) — WO created with an appointment appears on the board | tech plan §4 AppointmentScheduler | LOW — hard to argue against |
| D4 | **SCH-REG-04** · [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) — multi-location tech's shift shows only on the WO's location | tech plan §3 WO-primary location resolution | MEDIUM — asserts a deliberate behaviour *change*; the case carries a plain tester note saying so |
| D5 | **SCH-API-04** · [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) — foreign-location shift returns 404 | tech plan **NFR-001** location scoping | MEDIUM |

**Who can close it:** **engineering** for the mechanics; **Branko** for D2 and D4, which
change what a user sees. **Not asked.**

**PASTE-READY ANSWER:**
> Five tests cover things the Schedule spec does not mention at all — what happens to
> existing shifts when the rewrite ships, how the Dashboard counts a spread job, and how
> locations are scoped. They all come from the engineering plan, and each test says that on
> its face. Two of them describe a change a user would notice, so they are worth confirming
> with Branko.

---

## What is NOT a real conflict (checked, and reported honestly)

The QA lead named five Schedule items. **Four of them turned out not to be live
conflicts** — because spec versions **v19–v23** folded Branko's answers in, or the cases
were already deleted:

1. **"No right-click context menu" — NOT a conflict.** Branko's Q4 (verbatim: *"C. there
   is no right click, only left click. when clicked it opens dropdown menu with two
   options (Create event, New work order) as mentioned in prd."*) is **matched by the
   spec**: v23 §4.10 and §7 both describe a **left-click** menu with exactly *"Create
   event, New work order"*. **SCH-REAS-03
   ([C30054](https://shopview.testrail.io/index.php?/cases/view/30054))** agrees with the
   spec outright and carries the **plain** provenance line.
2. **"Modal Reassign descoped" — NOT a conflict.** **Confluence v23 (2026-07-30) DELETED**
   *"and Reassign to another technician"* from the §4.9 Actions list, which now reads only
   *"Actions: Delete (series-aware, §7)"*. So **SCH-MODAL-08
   ([C30015](https://shopview.testrail.io/index.php?/cases/view/30015))** is
   **spec-backed**; its own refs already say *"Reassign removed in Confluence v23"*. The
   stale artefact is the **Jira story SV-8695 text**, not our case.
3. **"Week Export descoped" — NO CASE EXISTS.** Both Week Export cases are **already gone
   from TestRail**: C38853 and C38854 were verified absent from the live suite on
   2026-08-04. Nothing to defend.
4. **The labour/total figures on the modal — THIS ONE IS REAL** and is group **A-i** above.
5. **"Shop closures" — real, but NOT a PO-ruling case.** It is a **spec self-contradiction
   with no ruling at all** (group **B**), so the defence is different: we cannot quote
   Branko, because he has never answered. Filed accordingly rather than dressed up as a
   ruling.

**Also worth recording as resolved:** the **events-count-toward-capacity** hold (D1) and
the **modal Reassign** hold (D4) were both **lifted** by Branko on 2026-07-31, and the
cases already reflect the answers — verified live this pass: **SCH-EVT-08
([C30615](https://shopview.testrail.io/index.php?/cases/view/30615))** reads *"the event's
hours are counted alongside shift hours"*, matching v23 §4.12 verbatim. **No Schedule case
is still HELD pending Branko on those two points.**

## OUTSTANDING — what is needed to close this register

| Item | Who | Blocks | Since |
|---|---|---|---|
| **Send** the `PO-Questions-Branko-Schedule-TechPlan_2026-07-30` sheet trimmed to **NQ-1..NQ-5** — NQ-1 is the shop-closure question | Branko | **3 cases, 2 of them HIGH risk** (group B) | sheet prepared 2026-07-30, **appears never sent** |
| Delete *"with labor/total figures"* from spec §4.9 | Branko | Nothing testable; the document contradicts his own 2026-07-22 ruling | flagged 2026-07-22, **never asked** |
| Fix the §9 View-options VIN row so it stops tying the tooltip to the toggle | Branko | Nothing testable; contradicts his own 2026-07-31 answer | flagged 2026-07-22, re-flagged 2026-07-31, **never asked** |
| Confirm the 8-week / 120-shift spread caps are product-intended | Branko / engineering | 2 cases (group C) | **never asked** |
| Confirm the two user-visible tech-plan behaviours: Dashboard one-row, multi-location scoping | Branko | 2 cases (D2, D4) | **never asked** |
