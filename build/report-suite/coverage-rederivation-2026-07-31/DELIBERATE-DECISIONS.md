# Report Suite — DELIBERATE DECISIONS register

**Purpose.** Every conscious decision in the Report Suite suite that somebody could
challenge — with the plain one-sentence answer a non-technical reader can paste into a
channel, the evidence behind it, the affected cases with their TestRail links, who can
close it, and an honest risk rating.

**REFRESHED 2026-08-03** (twice — see G9 for the second pass). Scope = **Report Suite only** (ours: **475 active cases**; live
folder total **480** — the other 5 are Vladimir Tomovic's, §F). Case links:
`https://shopview.testrail.io/index.php?/cases/view/<id>`.

**What this refresh changed** (raised by `VERIFICATION-2026-08-03.md` finding **V-9**, which
found this register a day out of date):

| Was | Now |
|---|---|
| headline **"474 active cases"** / live total 479 | **475** / live total **480** — counted live 2026-08-03 |
| **C39447** (SBC-PERM-05, authored 2026-08-03) absent | added to **B4** |
| **B4:** *"the mitigation (the dev ticket) is **not yet filed** — that is a real gap"* | **WRONG, in our favour: [SV-8780](https://shopview.atlassian.net/browse/SV-8780) IS filed** — verified live 2026-08-03. Corrected in **B4**, with the QA lead's *"Ignore this ticket."* ruling recorded per Standing Rule 48 |
| **D5** open (*"PV/IV permission cases still name the inventory-reports permission"*) | **CLOSED** — zero of the 475 name a per-area report permission any more; swept live 2026-08-03 |
| no entry for the **held permission contradiction** (C30325 vs C30327/C30391) | **E4** — and it is **RESOLVED**, not held |
| nothing about today's Rule-42 / layman-runnability / Rule-4 fixes | **G6 · G7 · G8**, and **D8** for the one we deliberately did NOT touch |

**Read the risk column honestly.** HIGH does not mean we are wrong; it means *if this is
raised publicly we have a concession to make, not just an explanation*.

| | Count |
|---|---|
| A — not authored because the spec contradicts itself | **2** |
| B — cases that follow a PO ruling over the spec text | **8** |
| C — requirements deliberately not authored for other reasons | **7** |
| D — open, awaiting Chris, dev or the QA lead | **8** (D5 now closed) |
| E — cannot be settled without a live build | **4** |
| F — foreign-case overlaps (Vladimir Tomovic) | **5** |
| G — known imperfections accepted or scheduled | **9** |
| **Risk profile** | **HIGH 3 · MEDIUM 7 · LOW 32** |

---

## A. Requirements we deliberately did NOT resolve BECAUSE THE SPEC CONTRADICTS ITSELF

We did not silently pick a side (Standing Rule 15). In both cases below we followed the
**newer** text (Rule 32), said so on the case, and put the question to Chris Ward.

### A1 — Sales By Representative: the export column list vs the export Location rule
**Risk: LOW** · **Closes: Chris Ward** (Q1 of `PO-Questions-Chris-ReportSuite-2026-07-31`)

**Plain answer:** *"His own Sales By Representative description says two different things
about the same download — a newer line says the location column is in all four downloads,
an older line lists the columns without it. We followed the newer line and asked him to
confirm; we did not quietly choose."*

**Evidence — SBR spec v15, 2026-07-29, both texts verbatim:**
- **`S14-R20`** (added 2026-07-29): *"Whenever the Location column is shown on screen
  (S21-R7), it is **included in all four exports in the same position it occupies on
  screen** — Summary and Expanded, PDF and CSV…"*
- **`S14-R15`** (Summary CSV, unchanged since the 2026-07-11 "Exports hardened" round):
  *"The headers, in order, are exactly: Sales Representative, # Invoices, # Customers,
  Hrs Worked, Hrs Invoiced, Inv. Hrs, …"* — **no Location column**, and **`S14-R16`**
  (Expanded CSV) is the same shape.

**What we did:** followed `S14-R20`, user-authorized 2026-07-31, and made each header list
**scope-conditional** so both statements can be true.
**Cases:** SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) ·
SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) ·
SBR-EXP-03 = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) ·
SBR-EXP-04 = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) ·
SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913)

**Why LOW:** the newer text wins by rule, the fix is pushed and verified, and the finding
was independently corroborated (`contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md`)
and by Vladimir's C38923 (§F1).

### A2 — "The same logo treatment" — three reports, three different rules
**Risk: MEDIUM** · **Closes: Chris Ward** (Q4 of the 2026-07-31 sheet)

**Plain answer:** *"He told us all six reports now use the same logo treatment, but the
three written descriptions describe three different rules — so we left each report's check
following its own description and asked him which single rule is right."*

**Evidence:**
- Chris Ward, group message **2026-07-29**, verbatim: *"Each report now ensures the same
  'logo' treatment."*
- **SBC spec v12** `S15-R17`: *"The logo is chosen in this order: (1) the organization's
  uploaded logo; (2) the bundled ShopView logo when none is uploaded; (3) no logo."* plus
  `S15-R18`: *"When no logo is available, the logo column is not rendered and the text
  column fills the full width."*
- **TU spec v5** (2026-07-29 changelog): the PDF uses the **bundled default** logo.
- **PV spec v4:** no logo requirement anywhere.

**Cases (each currently follows its own report's description):**
SBC-EXP-10 = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) ·
TU-EXP-06 = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) ·
TU-EXP-07 = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) ·
PV-EXP-05 = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) ·
PV-EXP-06 = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380)

**Why MEDIUM:** three of our cases cannot all be right about a behaviour the PO believes is
already uniform. Nothing is wrong *per its own spec*, but we will have to change something
once he answers.

**Honest note:** **no requirement was left UNCOVERED because of a spec contradiction.** In
both A1 and A2 the requirement is covered — the open part is which of two written
statements the build should match.

---

## B. Cases that deliberately FOLLOW A PO RULING RATHER THAN THE SPEC TEXT

All eight follow **Chris Ward** (Report Suite PO — tier (a), top of the Rule-33 precedence
order) where his ruling is **newer** than the spec page (Rule 32). Every one is recorded on
the case itself.

| # | Ruling | Date + verbatim | Spec text it overrides | Cases | Risk |
|---|---|---|---|---|---|
| **B1** | One suite-wide over-cap message: *"This report is too large to export. Narrow the date range or filters, then try again."* | **2026-07-31**, answering Q2: *"**A - great catch**"* | SBC `S14-R16`/`S15-R25` say *"This export is too large to **generate**. … then try again."*; SBR `S14-E2` says *"…and try again."* | SBC-EXP-14 [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) · SBR-EXP-15 [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) · IV-EXP-07 [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) · PV-EXP-11 [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) · TU-EXP-09 [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) · WIP-EXP-10 [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | LOW |
| **B2** | The location dropdown is **hidden** for a one-location user | **2026-07-31**, answering Q1: *"**A -- classic spec drift**"* | SBR `S21-N1`, TU `S9-N1`, IV `S7-N1`, PV `S2-E4` all still say the user *"still sees the filter"* | SBR-LOC-04 [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · TU-LOC-05 [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · IV-LOC-04 [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · PV-FILT-13 [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | LOW |
| **B3** | The 10,000-row export cap is **suite-wide** | **2026-07-31**, answering Q3: *"**A - this was not well thought out by me (the specs were written at different times)**"* | PV, TU and WIP spec pages carry **no cap line at all** | PV-EXP-11 [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) · TU-EXP-09 [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) · WIP-EXP-10 [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | LOW |
| **B4** | **No dedicated per-report permission** — every report opens on ordinary reports access | **2026-07-31**, answering Q4: *"**A - the intention is to not hide these from normal reports access. These were specced before CRP was built :)**"* (2nd time — also 2026-07-28); **reinforced by the QA lead 2026-08-03: *"Yes all the reports will be gated by ONE permission FOR NOW"*** | The **shipped build** gates SBC on a dedicated `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` atom, and the engineering tech plan §B5.3 builds it that way | SBC-PERM-01 [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) · SBC-PERM-02 [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) · SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) · **SBC-PERM-05 [C39447](https://shopview.testrail.io/index.php?/cases/view/39447)** (authored 2026-08-03 — the permission must not even be offered in the role editor) | **HIGH** |
| **B5** | The full word **"Representative"** everywhere — no "Rep" | **2026-07-31**, answering Q5: *"**slang, let's do representative everywhere**"* | SBR `S19-R7` (customer card) and Story 15 (assignments export name, file name, CSV header) still say *"Sales Rep"* | SBR-WO-01 [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) · SBR-WO-02 [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) · SBR-WO-06 [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) · SBR-ASGN-01 [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) · SBR-ASGN-02 [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | LOW |
| **B6** | Assets identified **VIN → Unit # → plate**, on WIP too | **2026-07-29**, verbatim: *"A is the correct answer"* + *"Not just for these specs though -- really good to keep this in mind for all actions moving forward"* | WIP spec **v6** §4, `S4-R7`, `S4-R8`, `S4-R9`, `S7-R4` are **still unit-number-first** — he believed he had made this edit and had not | WIP-COL-05 [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · WIP-FLT-03 [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · WIP-SORT-03 [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · WIP-EXP-07 [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | MEDIUM |
| **B7** | **Both** Parts Velocity and Inventory Value live under the new **Parts** nav group | **PRD companion video 2026-07-30**, 00:35–01:18: *"Parts Velocity and Inventory Value will live under here"* | PV `S1-R1` still calls Parts Velocity the Parts group's *"first (and, in this release, only) report"* | PV-NAV-01 [C30323](https://shopview.testrail.io/index.php?/cases/view/30323) | LOW |
| **B8** | The Location column **is** in all four SBR exports | **spec-vs-spec**, `S14-R20` added **2026-07-29** (newer than the header lists it contradicts) — see §A1 | SBR `S14-R15`/`S14-R16` header lists | the five §A1 cases | LOW |

### B4 is the one to be honest about — **HIGH**
**Plain answer:** *"Four of our Sales By Customer permission checks are deliberately ahead of
the build. Chris ruled twice that these reports must open on ordinary reports access, and the
QA lead confirmed it again on 3 August — but the build currently ships a special permission
just for that one report, so those four checks will fail on purpose until engineering changes
it. That is intended, the defect is written up, and the QA lead has told us to leave it
alone for now."*

**CORRECTED 2026-08-03 — the old wording here was wrong, in our favour.** This entry used to
say *"The mitigation (the dev ticket) is not yet filed — that is a real gap, not an
explanation."* **It is filed.** Verified live on 2026-08-03 via the Jira API, not inferred:

| Field | Live value |
|---|---|
| Key | **[SV-8780](https://shopview.atlassian.net/browse/SV-8780)** |
| Summary | *"SBC report gated by its own permission"* |
| Type | Story Defect (sub-task) |
| Parent | **SV-8598** — *"[Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission"* (In Progress) |
| Status | **Ready to Fix** |
| Created / Updated | 2026-07-30 / **2026-08-02** |
| Reporter | Bilal Muzamil · Assignee: none · Resolution: none |
| Labels | `report-suite`, `spec-conformance` |

Its description already quotes the overridden spec text verbatim: *"The report is gated by a
dedicated Sales By Customer report View permission — it is not tied to a generic 'all
reports' permission."* (SBC spec Story 1 `S1-R2`, v12, 29 Jul.)

**Who closes it: NOBODY, for now — by the QA lead's own ruling (Standing Rule 48, all five
fields):**

| Field | |
|---|---|
| **Which ruling, verbatim** | *"Ignore this ticket."* |
| **When, and what it answered** | **2026-08-03**, when we raised SV-8780 and asked what to do about the build-vs-ruling mismatch it records |
| **What it blocks** | Nothing in the suite — the four B4 cases are authored, pushed and correct against the ruling. What it blocks is the **dev follow-through**: until someone works SV-8780, a tester on today's build sees four deliberate failures on SBC-PERM-01 [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) · SBC-PERM-02 [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) · SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) · SBC-PERM-05 [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) |
| **Why the ruling was reasonable** | The ticket is already filed and sitting at **Ready to Fix** with the PO's answer attached — there is nothing QA can add by chasing it, and the cases correctly assert the ruled behaviour either way. Nothing has changed since that would justify revisiting it. |
| **What would unblock it** | Engineering picking up SV-8780 (owner: dev, against SV-8598). Nothing is needed from QA. |

**Why still HIGH:** a tester running today's build sees four failures and will reasonably
report them as our error. The exposure is real; what is *not* real any more is the "no ticket
exists" gap.

---

## C. Requirements deliberately NOT authored — other reasons

Full verbatim text and reasoning in `COVERAGE-REDERIVATION.md` §5. **7 of 895 requirements**
have no case, every one on purpose.

| # | Requirement | Plain answer | Reason | Risk |
|---|---|---|---|---|
| C1 | SBC **`S10-N1`** — *"When the table has no customer rows, the sort controls on the headers are still present but produce no visible change."* | *"We do not test 'click this and nothing happens' — it cannot fail in a way that tells you anything."* | Cut by the **user-authorized Ruthless Usefulness Audit of 2026-07-28** as a no-op assertion (retired case SBC-SORT-07). | LOW |
| C2 | SBR **`S11-N1`** — *"With only one rep row visible, the sort affordances are present but produce no observable change."* | same as C1 | Same audit, same reason (retired SBR-SORT-06). | LOW |
| C3 | SBR **`S14-R14`** — the font-size tier shifts *"one step smaller … clamped at the 8px floor"* for long negative values | *"A manual tester cannot measure an 8-pixel font step inside a PDF, so we do not pretend to."* | Same audit — *"px font-tier edge minutiae, not manually testable"* (retired SBR-EXP-09). | MEDIUM |
| C4 | PV **`S4-N1`** — a saved view whose *"stored schema version does not match the current one"* is ignored | *"A tester cannot hand-write a mismatched saved-settings version; the part they CAN reach is tested."* | Same audit. The reachable half (an invalid saved *value* falls back to its default) **is** covered by PV-COL-05 = [C30355](https://shopview.testrail.io/index.php?/cases/view/30355). | LOW |
| C5 | SBC **`S20-N1`** — *"No applicable user-visible negative cases."* | *"The description itself says there is nothing to test here."* | Its own verbatim text. | LOW |
| C6 | PV **`S3-R1`** — *"one row per part, showing the columns currently enabled in the column picker (see Story 4). Calculation … is defined in Story 5."* | *"This line just points at two other sections, and both of those are tested."* | Pointer/restatement; substance covered by PV-ROW-01 [C30341](https://shopview.testrail.io/index.php?/cases/view/30341), PV-ROW-02 [C30342](https://shopview.testrail.io/index.php?/cases/view/30342), PV-COL-02 [C30352](https://shopview.testrail.io/index.php?/cases/view/30352), PV-COL-03 [C30353](https://shopview.testrail.io/index.php?/cases/view/30353). | LOW |
| C7 | PV **`S7-R7`** — *"These rules are the normative visual spec for this report as built … this spec is the source of truth for this report."* | *"That sentence is about the document, not about the product — there is nothing on screen to check."* | Meta-statement. **Inconsistency we admit:** SBR's identical twin `S18-R7.6` *is* anchored on SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305). Harmless, noted, not tidied without authorization. | LOW |

**C3 is the one worth flagging — MEDIUM.** It is a real requirement in a current spec with
no case, and the reason is a QA judgement (not manually measurable) rather than a PO ruling.
If Chris wants 100% requirement-to-case parity, C3 is the entry he is most likely to
challenge. **Who closes it:** the QA lead (re-authorize the case) or Chris.

---

## D. Open, awaiting an answer from Chris or dev

All five are on the written, ready-to-send sheet
`PO-Questions-Chris-ReportSuite-2026-07-31.md`/`.xlsx` unless noted.

| # | What is open | What is hedged meanwhile | Unblocked by | Risk |
|---|---|---|---|---|
| D1 | Which of the two contradicting SBR export statements is right (§A1) | Nothing — cases follow the newer text and are pushed | Chris (sheet Q1) | LOW |
| D2 | Will the **seven** outstanding description corrections land? Deadline **2026-08-04**, *partly* met (the changelog arrived 2026-07-29; items 1b/4/6/8/9/10/11 did not) | Nothing — cases follow his answers | Chris (sheet Q2) | MEDIUM |
| D3 | **Where** the Location column sits inside the two shorter **Summary** downloads — those files have no Date/Status column for it to match, and **no description says** | 5 cases say *"with the identifying columns ahead of the money columns (confirm its exact position in the build)"* — hedged, not invented | Chris (sheet Q3) **or** one live look | LOW |
| D4 | Which single **logo** rule applies to all six (§A2) | Each report follows its own description | Chris (sheet Q4) | MEDIUM |
| ~~D5~~ | ~~Does *"normal reports access"* mean **one** reports permission, or do the existing per-area ones (the inventory-reports permission named by PV `S1-R4` and IV `S1-R4`) still apply?~~ | **CLOSED 2026-08-03.** Answered twice — Chris Ward **Q2=A** (*"Collapse all report access into a single Reports permission"*) and the QA lead **2026-08-03**, verbatim: *"Yes all the reports will be gated by ONE permission FOR NOW"*. All the cases were reworded to the single ordinary reports access; a live sweep of all **475** on 2026-08-03 found **0** cases still naming *"Inventory Reports → View"*, *"the inventory-reports permission"* or *"the Sales By Customer report View permission"*. IV-PERM-01 [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) reworded 2026-08-03; PV-PERM-03 [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) + PV-API-04 [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) rescoped 2026-08-03 (§E4). **"FOR NOW" is deliberate** — the model may expand, so each case carries the plain line that a per-report permission added later is a test update, not a bug. | — | closed |
| D6 | **Not on this sheet, deliberately:** the SBR Escape-key question (spec `S13-R8` wants Esc to close the deactivate dialog; the app's Golden Rule #9 forbids it) | SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) asserts Esc does **not** close it | Chris — it is **Q1 of the 2026-07-27 sheet, open 4 days** | MEDIUM |
| D7 | The **TU Story 10** (Column Selection) requirements have **no Jira story** | TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) and TU-LOC-06 = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) cite **epic SV-8582** and say so explicitly in their references | Chris / dev (create the story) | LOW |

| D8 | **PV-VIS-02 = [C30386](https://shopview.testrail.io/index.php?/cases/view/30386) asks a manual tester to measure paddings in pixels with browser devtools** — *"(use browser devtools to measure paddings)"*, then asserts *"internal padding 32px top, 2rem right, 24px bottom, 2rem left"* and *"a 1px top border"*. Found 2026-08-03 by the named-entity sweep, **not** by the verifier (V-7 looked only for contrast ratios) | **Nothing changed — deliberately left alone.** It is outside the six findings the QA lead authorised on 2026-08-03, and a case-body edit needs authorisation (Standing Rule 6). The exact fix is ready and is one `update_case`: restate it as *"the toolbar and the table share the same spacing as the rest of the suite — nothing looks cramped or misaligned"*, and record the px/rem figures as the design-token property they are, exactly as **G7** did for the three contrast cases | **The QA lead** — one go-ahead | MEDIUM |

*(D6, D7 and D8 are counted in the register total as part of "open awaiting Chris, dev or the QA lead".)*

---

## E. Cannot be settled without a live build

**There is no Report Suite QA branch or environment.** Consequence, stated plainly: **all
475 cases are `VIU-Pending` and not one has ever been run against the real build.** Every
on-screen label we assert is *"the description says so"*, not *"the build shows it"*
(Standing Rules 12/22).

| # | Question | Plain answer | Evidence | Risk |
|---|---|---|---|---|
| E1 | **Is `Location` listed in the WIP Column Selection menu?** | *"Our check says it is not offered there, because the current description says so three separate times. Another author's automated case toggles it on and says 'as shipped'. Both can be honest — if the build still offers it, that is a build-conformance finding, not a mistake in either case. One live look settles it."* | **WIP spec v6 (2026-07-29)** `S4-R3`: *"The Location column is not offered in the column selector"*; `S7-R13`: *"the user does not toggle it in the column selector"*; §3 Key Decision: *"automatic, not a manual toggle"*. Corroborated by WIP-COL-01 [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) + WIP-COL-02 [C30467](https://shopview.testrail.io/index.php?/cases/view/30467). Counter-evidence: Vladimir's [C38922](https://shopview.testrail.io/index.php?/cases/view/38922) step 3. Our case: **WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** — unchanged (Rules 32/33). | MEDIUM |
| E2 | The exact position of the Location column inside the two Summary downloads (= D3) | *"Nobody has written it down; we hedged rather than guessed."* | SBC `S4-R13` states inclusion with **no** position; SBR `S14-R20` says *"the same position it occupies on screen"* but those files have no on-screen counterpart column. | LOW |
| E3 | **Every label and layout detail marked "confirm in the build"** across the suite | *"Where a description does not pin a word or a position, we say 'confirm in the build' instead of inventing it — and that is why the live environment matters."* | Rule 9 (build-accurate wording, never invented) + Rule 22. Includes the exact wording of the TU Column Selection accessible name (`S8-R16` states only that one exists). | **HIGH** |

### E4 — the one internal contradiction we had, and it is now RESOLVED (was never in this register)
**Risk: LOW** · **Closed: 2026-08-03**

`VERIFICATION-2026-08-03.md` §6 found the suite's **only** unresolved self-contradiction and
noted, correctly, that this register did not mention it. It is recorded here now — together
with the fact that it has since been fixed, so nobody re-opens it.

**What the contradiction was.** Three cases all cited PV `S1-R4` and could not all be true:

> **PV-PERM-01 = [C30325](https://shopview.testrail.io/index.php?/cases/view/30325)**: *"for
> now ONE ordinary reports access opens all six of these new reports; **none of them has a
> permission of its own**."*
>
> **PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327)**
> precondition: *"That user's role does NOT have the **Inventory Reports → View**
> permission."*
>
> **PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391)**: *"Both
> loading and exporting are gated by the same **Inventory Reports → View** permission."*

C30327's premise state **cannot be produced** under one permission, so it was not merely
inconsistent — it was un-runnable.

**How it was resolved.** Both cases were **rescoped** on 2026-08-03 under the QA lead's
ruling (*"Yes all the reports will be gated by ONE permission FOR NOW"*) plus Chris Ward's
Q2=A. Verified live 2026-08-03: **0 of the 475** cases name a per-area report permission, and
all three now assert the single ordinary reports access. Each carries the plain forward line —
*"If a separate per-report permission is ever added on purpose in a later release, this test
will be updated first"* — so the "FOR NOW" is visible to the tester rather than implied.

**Why this belongs in the register even though it is closed:** it was a real contradiction
that shipped in a pushed suite, and Rule 46 says the register records what we decided, **not
what we wish we had decided**.

### E3 is the biggest honest exposure — **HIGH**
**Plain answer:** *"The whole suite is written from the descriptions and has never been run
against the build. It is thorough and traceable, but until we get the QA environment nobody
can claim it matches the real screens."*
**Who closes it:** the QA lead / engineering — the QA branch URL, confirmation the reports
are switched on, and fresh login cookies. Outstanding since **2026-07-22**.

---

## F. Foreign-case overlaps — Vladimir Tomovic's C38919–C38923

**Standing position (Standing Rule 38): HANDS-OFF, absolutely.** We do not edit, retitle,
re-reference, move, retire or add them to any run — not even to fix an obvious duplicate.
All five were created 2026-07-30 by TestRail user id 1. **They sit in no run.** Counting
convention: **"ours 475 / live total 480"** (re-counted live 2026-08-03). Re-verified after the
2026-08-03 verifier-fix push: all five are byte-identical to the pre-write snapshot, including
`updated_on` and `updated_by` — still **2026-07-30 17:41 by user id 1**, never touched by us.

**Reading limit, stated not hedged:** four of the five carry **no expected results** (the
fifth has only a parsing fragment), so the pass criterion lives in his automation code.
Overlap is judged on subject + conditions + steps. Full record:
`build/qa-team-responses-2026-07-31/Note-to-Vladimir-automation-overlap.md` (marked **NOT
SENT** — the QA lead ruled 2026-07-31 not to message him).

| His case | Which side is right | Evidence | Our cases | Risk |
|---|---|---|---|---|
| **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** — SBR CSV exports carry the Location column | **HE WAS RIGHT. WE WERE WRONG against our own spec.** | He authored 2026-07-30, inside the **v15** window, matching `S14-R20`. Our two cases cited only the older `S14-R15`/`S14-R16`/`S14-R18` header lists. **His single disagreement surfaced the same on-screen/export split on three further reports** (PV `S6-R11`, TU `S7-R13`, IV `S10-R15`). | SBR-EXP-10 [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) + SBR-EXP-11 [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) — **now fixed** (2026-07-31, authorized) | **HIGH** |
| **[C38922](https://shopview.testrail.io/index.php?/cases/view/38922)** — WIP CSV, column semantics *"exactly as shipped"* | **UNRESOLVED — needs one live look** (§E1). Both readings can be honest: his points at today's build, ours at the v6 target. | WIP v6 `S4-R3`/`S7-R13`/§3 vs his step 3 toggling Location on | WIP-FLT-09 [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) (unchanged); also overlaps WIP-EXP-02 [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) + WIP-EXP-07 [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | MEDIUM |
| **[C38921](https://shopview.testrail.io/index.php?/cases/view/38921)** — the `As of` metadata line inside the CSV **and its position** above the header row | **He has coverage we do not.** Not a disagreement — a genuine addition. | We deliberately left the metadata line's position open. | none of ours asserts the position | LOW |
| **[C38920](https://shopview.testrail.io/index.php?/cases/view/38920)** — PV Location column | **Equivalent; ours is complete.** Every condition his steps set up is already asserted. | hidden at a single location · *"Multiple"* on the merged special-order row · per-location names on inventory rows | PV-FILT-14 [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | LOW |
| **[C38919](https://shopview.testrail.io/index.php?/cases/view/38919)** — TU column toggle + persistence + export mirroring | **Equivalent; a sensible automated regression shape, not new coverage.** | bundles what our two cases cover into one end-to-end path | TU-COL-01 [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) + TU-EXP-04 [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | LOW |

### F1 (C38923) is a concession, and we state it as one — **HIGH**
**Plain answer:** *"Another author's case contradicted two of ours, and he was right — his
case matched the current description and ours cited older lines. It is fixed, and it made us
add a permanent check that looks for the same mistake everywhere else."*
**What changed because of it:** the same-requirement-different-surface sweep
(`sweep_surface.py`), now run over all 895 requirements — **the Location column was the only
instance left**; and Standing Rules 40/41/44. **Do not defend this one; credit it.**

---

## G. Known imperfections — accepted or scheduled

| # | Item | Plain answer | Status | Risk |
|---|---|---|---|---|
| G1 | **7 of 895 requirements have no case** | *"Seven are deliberate, each with a written reason — four cut by an authorized quality audit as untestable-by-hand, three because the sentence is not about the product."* | Accepted; §C | LOW |
| G2 | **The six older coverage matrices were built against older spec versions** | *"They were, which is exactly why we re-derived coverage from the current descriptions from scratch. The old files now carry a banner pointing at the new result."* | Fixed 2026-07-31; the matrices carry a SUPERSEDED banner | LOW |
| G3 | **15 of our own cases contradicted each other** until 2026-07-31 | *"Fifteen cases listed their columns as a fixed set and would have failed on a correct build in any two-location company. Our consistency sweep caught it and all fifteen were fixed before anything was pushed."* | Fixed; `RULE28-AUDIT.md` §2b. **Re-run 2026-08-03** over everything the verifier-fix pass touched — 31 same-anchor clusters, 20 candidate pairs raised, **all 20 simultaneously true, 0 contradictions introduced**; four of them are pairs the pass actively *reconciled* (`verifier-fixes-2026-08-03/CONTRADICTION-SWEEP-2026-08-03.txt`) | MEDIUM |
| G4 | **The `Location` column position differs per report** (after Date / after Status / leftmost / between Vendor and Qty on Hand / between VIN and Advisor) | *"That is not an inconsistency in our tests — each report's own description specifies a different position, and each case follows its own."* | Accepted, verified per report | LOW |
| G5 | **The vague predecessors of the Location cases still exist** — six cases still say *"a location label or marking is shown (exactly how is confirmed in the build)"* | *"Six older cases say the same thing less precisely. They are not wrong and they cannot fail wrongly, but they are redundant now — a merge we have recommended and not executed, because that needs authorization."* | Recommendation only; `RULE28-AUDIT.md` §1. SBC-LOC-03 [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) · SBR-LOC-03 [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) · PV-FILT-10 [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) · TU-LOC-01 [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) · IV-LOC-01 [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) · WIP-FLT-06 [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | LOW |

| G6 | **28 cases still spell out a closed list** (*"offers exactly three options"*, *"the headers, in order, are exactly …"*, *"the toast reads exactly …"*) rather than being reworded scope-conditionally | *"For these twenty-eight, the closed list IS the requirement — the description itself says 'exactly these and no others', so rewording them would make the test weaker than the thing it checks. Instead each one now names the exact requirement and the spec version it was checked against, so the moment that requirement changes the case is flagged for re-checking. That is what went wrong in July: a closed list with no link to the requirement that later changed."* | **Done 2026-08-03** (Rule 42(b)) — all 28 pinned, each `refs` states in words that the closed list is the requirement. Full list + the verbatim spec line that closes each one: `verifier-fixes-2026-08-03/testrail-execution-log.md` §V-10. The complementary treatment (a) was applied on 2026-07-31 to the seven cases whose spec DOES make the list conditional (C30161, C30285, C30286, C30352, C30401, C30551, C38856) | LOW |
| G7 | **Three cases used to ask a non-technical tester to measure a contrast ratio** — PV-VIS-03 [C30387](https://shopview.testrail.io/index.php?/cases/view/30387) · SBR-VIS-05 [C30309](https://shopview.testrail.io/index.php?/cases/view/30309) · TU-VIS-02 [C30448](https://shopview.testrail.io/index.php?/cases/view/30448) | *"They named a ratio but no tool and no method, so a manual tester could not actually run them. They now ask what a person can honestly answer — 'can you read this easily in both light and dark mode?' — and the exact ratio is written down as the design figure it is, checked with a contrast tool by design and engineering. Nothing was deleted."* | **Fixed 2026-08-03.** Honest consequence: **nobody manually verifies the numeric ratio.** Until design/engineering measure it, the 3:1 and 4.5:1 figures are asserted by the design token, not by a test | MEDIUM |
| G8 | **Two UI-section cases used to require reading the browser network tab** — TU-DAY-02 [C30419](https://shopview.testrail.io/index.php?/cases/view/30419) · TU-TECH-02 [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | *"They sat in ordinary screen-behaviour folders but told the tester to open developer tools, which breaks our own rule that back-end checks live in an API folder. They now describe what you can see on screen. Nothing is lost: the back-end half of both was already covered by two cases in the 'Technician Utilization — API' folder."* | **Fixed 2026-08-03.** The back-end halves, quoted side by side in the execution log: TU-API-01 [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) (*"The initial report payload does NOT ship the day rows"*) and [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) exp 3 (*"The technician filter causes NO server request"*) | LOW |
| G9 | **The Sales By Customer description we held was one version behind** — live Confluence 577634305 is **v13 (2026-07-31)**, our authoring mirror was **v12 (2026-07-29)** | *"Our copy of the Sales By Customer write-up was one version old. It has since been captured fresh and the difference turned out to be tiny — three sentences, all about the permission, all of which our checks already follow. Nothing else on that page changed."* | **CLOSED 2026-08-03 — and measured, not assumed.** The live v13 was captured (`spec-watch-verification-2026-08-03/live-capture-2026-08-03/`) and both full bodies structurally diffed: **222 requirement anchors in each, 0 added, 0 removed**, and the only substantive text changes are **`S1-R2`**, **`S1-N1`** and the removed Story-1 Prerequisite — **all the permission gate**, all already covered by C30098 / C30099 / C39447. *(`S14-R14` and `S15-R6` also appear to differ but only by markdown escaping of an underscore — `this_month` vs `this\_month` — a capture artifact, which independently CONFIRMS the parallel worker's "exactly 3 changes".)* **All 30 SBC anchors this suite pins are byte-identical in v13**, so the seven SBC pins were upgraded to *"SBC spec v13 2026-07-31"* on 2026-08-03. The same diff was run on SBR and PV against their live captures: 0 anchors added or removed and every pinned anchor differs only by whitespace/emphasis artifacts (similarity 0.992–0.999) — **SBR v15 / PV v4 pins stand**. **Honest residue:** TU v5 / WIP v6 / IV v3 are **version-matched to live but not text-diffed** (no live capture of those three exists yet) | LOW |

**Already discharged — do not raise these as open:**
- **Case titles too long for the TestRail page:** **0 of 475** exceed 80 characters (longest
  exactly 80), re-measured 2026-08-03. An earlier register row claiming 288 was **stale** and
  has been corrected.
- **Requirement coverage completeness:** **888 of 895** covered, **0 open gaps**, **0 stale
  or invented references** on any active case (`COVERAGE-REDERIVATION.md`).
- **Run 359 sync:** all **475** of our cases are in the run; verified **475/475** tests and
  **539/539** result records unchanged by both the 2026-07-31 push and the 2026-08-03
  verifier-fix push.
- **Missing traceability:** **0 of 475** — every case carries a Jira ticket **and** a spec
  anchor, and every anchor resolves in its own report's description
  (`VERIFICATION-2026-08-03.md` §2).
- **The export "Locations:" line with no governing anchor:** the six cases the verifier
  flagged (V-3) were pinned on 2026-08-03. **Nothing is left unlinked**, so the July failure
  mode — a requirement changing without the cases that depend on it being re-checked — cannot
  recur silently on that surface.

---

## The three answers to have ready

1. *"Is the suite complete against the current specs?"* → **Yes, and it is measured: 888 of
   895 requirements covered, no open gaps, and the seven with no case each have a written
   reason.** (`COVERAGE-REDERIVATION.md`)
2. *"Do your cases contradict each other?"* → **Fifteen did, we found them ourselves with a
   consistency sweep, and all fifteen were fixed before anything was pushed. One more — a
   permission case whose starting condition could not exist — was found by our own
   independent verification on 3 August and rescoped the same day. Zero remain, re-swept
   after every change.** (`RULE28-AUDIT.md` §2b · `VERIFICATION-2026-08-03.md` §6 ·
   `verifier-fixes-2026-08-03/CONTRADICTION-SWEEP-2026-08-03.txt`)
3. *"Has any of it actually been run?"* → **No — there is no QA environment yet. Every case
   is written from the descriptions and marked as not-yet-verified. That is the honest
   limit, and the environment is the top thing we are waiting on.**
