# DELIBERATE-DECISIONS REGISTER — Report Suite, 478 cases · 2026-08-04

**Standing Rule 46.** Every deliberate non-authoring, every case that follows a PO ruling over spec
text, every HELD item and every accepted imperfection, written down **before anyone asks** — with
the plain one-sentence answer a non-technical reader can paste straight into a channel.

**Six fields per entry. Read the RISK column honestly: HIGH does not mean we are wrong, it means if
this is raised publicly we have a concession to make, not just an explanation.**

**Risk profile: HIGH 4 · MEDIUM 9 · LOW 14 (27 entries).**

**Honesty clause observed:** nothing discovered late has been back-dated into this register as
though it were a decision. The four HIGH entries are all things this audit found on 2026-08-04, and
they are dated and described as findings, not choices.

---

## Category 1 — Requirements not authored because the spec contradicts itself

### D1 · The Location column: our IV and WIP cases follow the BUILD, their own specs say the opposite — RISK: **HIGH**

**Decision (plain):** On four Inventory Value cases and three Work In Progress cases we wrote that
you switch the Location column on yourself. The written specification for both reports says it
appears on its own. We have not changed them yet.

**Plain one-sentence answer:** *"We found it — seven of our cases describe the older behaviour the
build still has, while the specification was changed on 29 July to say the column appears by itself;
we have written the fix and are waiting for the QA lead to approve it."*

**Evidence:** IV spec v3 `S7-R6` (Confluence 720142338, 2026-07-29): *"Its visibility follows the
location scope automatically and it is not one of the columns offered in the column-selection
control."* WIP spec v6 `S4-R3` (703660034, 2026-07-29): *"The Location column is not offered in the
column selector; its visibility is automatic."* The WIP diff shows `Location` removed from the
selector list on that date.

**Affected cases:** IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
IV-PERS-02 = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) ·
IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) ·
WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) ·
WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) ·
WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)

**Who can close it:** the QA lead (it reverses a previous authorised pass's choice), then a TestRail
push he authorises.

**Why the risk is HIGH:** as written these cases **cannot fail a build that breaks the current
spec**, and one of them says so in its own text: *"That is what the build does today."* An outsider
reading it sees a test aligned to the bug. Vladimir Tomovic's foreign case
[C38920](https://shopview.testrail.io/index.php?/cases/view/38920) already asserts the automatic
model, so the disagreement is visible from outside our work.

---

### D2 · The date-preset list: three reports assert eleven presets, the build offers nine — RISK: **MEDIUM**

**Decision (plain):** The shared date picker offers nine choices in the build. Three specs say
eleven, including "Today", "Yesterday" and "Custom". We kept the specs' lists and recorded the build
as behind.

**Plain one-sentence answer:** *"The date picker is missing three choices the specification asks
for, so those tests correctly fail; we are not going to quietly shrink the tests to match the
build."*

**Evidence:** SBC v13 `S2-R2`, PV v4 `S2-R2`, IV v3 `S5-R1` — each closes its own list in the
spec's own words. Observed live on `v3.4.1-0ed4433`: nine presets, an inline calendar, no Today /
Yesterday / Custom.

**Affected cases:** SBC-DATE-01 = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) ·
PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) ·
IV-DATE-01 = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) ·
SBR-DATE-01 = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) ·
WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501)

**Who can close it:** Chris Ward — either the picker gains the presets or he removes them from five
specs.

**Risk MEDIUM:** the 2026-08-03 VIU pass recommended *"Trim the case to the nine observed presets"*
on SBC-DATE-01 but not on its four siblings. **That recommendation is not adopted** — it would align
a case to the build against the current spec (Rule 33), and doing it on one report only would leave
the suite inconsistent.

---

### D3 · SBR's preset list omits "Last Week" where SBC's includes it — RISK: **LOW**

**Plain one-sentence answer:** *"Two specifications for the same shared control list different
choices; we have flagged it and followed each spec for its own report."*
**Evidence:** SBR v15 `S2-R2` vs SBC v13 `S2-R2`. Stated openly in SBR-DATE-01's own note.
**Affected:** SBR-DATE-01 = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201).
**Who can close it:** Chris Ward. **Risk LOW** — it is disclosed, not hidden.

---

## Category 2 — Cases that follow a PO ruling over the spec text

### D4 · The Location filter is HIDDEN for a one-location user; four specs still say it is shown — RISK: **MEDIUM**

**Plain one-sentence answer:** *"The product owner told us on 31 July that a user with one location
should not see the location filter at all; four specification notes still say the opposite and he
owes us that edit."*
**Evidence:** Chris Ward answer 2026-07-31 Q1 = A, verbatim *"classic spec drift"*. Overridden spec
notes: IV `S7-N1`, PV `S2-E4`, SBR `S21-N1`, TU `S9-N1`.
**Affected:** IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) ·
PV-FILT-13 = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) ·
SBR-LOC-04 = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) ·
TU-LOC-05 = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) ·
SBC-LOC-01 = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) ·
WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503)
**Who can close it:** Chris Ward's spec edit. **Risk MEDIUM** — the build shows the filter, so all
six read as failures until either the build or the ruling moves.

### D5 · One reports permission gates all six; three specs still name a per-area permission — RISK: **MEDIUM**

**Plain one-sentence answer:** *"For now a single 'can see reports' setting opens all six reports;
the specifications still describe separate per-report permissions and those sentences are out of
date."*
**Evidence:** Chris Ward Q2 = A *"Collapse all report access into a single Reports permission"* +
the QA lead's 2026-08-03 ruling verbatim *"Yes all the reports will be gated by ONE permission FOR
NOW"*. Proven live: an 8-atom role with only `reportsPageAccess` got 200 everywhere; a Foreman got
403 everywhere; the whole permission catalogue holds exactly one report atom.
**Affected:** the 14 permission cases including SBC-PERM-01 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098),
SBC-PERM-05 = [C39447](https://shopview.testrail.io/index.php?/cases/view/39447),
PV-PERM-01/02/03 = C30325 / C30326 / C30327, PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391),
IV-PERM-01/02 = C30603 / C30604, WIP-PERM-01/02 = C30526 / C30527,
SBR-PERM-01/02 = C30198 / C30199, SBC-API-06 = [C43546](https://shopview.testrail.io/index.php?/cases/view/43546).
**Who can close it:** Chris Ward's spec edits.
**Risk MEDIUM. "FOR NOW" is load-bearing** — a per-report permission added on purpose later is a
planned change, not a regression, and every affected case says so in plain words.

### D6 · SBR-PERM-01's internal note still describes the old per-report model — RISK: **LOW**

**Plain one-sentence answer:** *"An internal note on one case is out of date; no tester sees it and
the test itself is right."*
**Evidence:** SBR-PERM-01's note reads *"Unlike SBC (dedicated per-report permission), SBR is gated
at the Performance-group level"* — contradicted by D5. **Notes are not pushed to TestRail**, so no
tester reads it. **Affected:** SBR-PERM-01 = [C30198](https://shopview.testrail.io/index.php?/cases/view/30198).
**Who can close it:** us, on the next authorised touch. **Risk LOW.**

### D7 · The asset identifier is VIN → Unit # → plate; two specs and the build disagree — RISK: **MEDIUM**

**Plain one-sentence answer:** *"The product owner ruled on 29 July that vehicles are identified by
VIN first; the screen still leads with the unit number, so those tests correctly fail."*
**Evidence:** Chris Ward 2026-07-29 *"A is the correct answer"*, plus his standing note *"really
good to keep this in mind for all actions moving forward"*. Observed live: the WIP asset cell renders
`<span class="wip-asset__unit">6548</span>` then `<span class="wip-asset__vin">1FDSE…</span>` —
unit-number-first.
**Affected:** SBC-LBL-01 = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) ·
WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) ·
WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) ·
WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) ·
WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516)
**Who can close it:** a build change, or Chris reversing the ruling. **Risk MEDIUM.**

### D8 · One over-cap export message everywhere; the SBC and SBR specs still carry the old wording — RISK: **LOW**

**Plain one-sentence answer:** *"All six reports now use the same 'too large to export' message; two
specifications still show the retired wording and the product owner owes that edit."*
**Evidence:** Chris Ward 2026-07-31 Q2 = A *"great catch"*. SBR `S14-E2` and §7 still read *"This
export is too large to generate…"*.
**Affected:** SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) ·
SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) ·
PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) ·
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) ·
WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) ·
IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593)
**Who can close it:** Chris Ward. **Risk LOW** — the provenance is recorded in each case's `refs`,
so nobody diffing a case against its spec will read it as our error.

### D9 · "Sales Rep" becomes "Sales Representative" everywhere; the build and spec still use the short form — RISK: **LOW**

**Plain one-sentence answer:** *"The product owner ruled the full word 'Sales Representative' is used
everywhere; the screen still says 'Sales rep' in places, so those tests correctly fail and the tests
tell the tester exactly that."*
**Evidence:** Chris Ward 2026-07-31 Q5 = A *"Rep is too much slang, let's do representative
everywhere"*. Observed live: the work-order panel label reads **"Sales rep"** while the customer card
reads **"Sales Representative"**.
**Affected:** the 15 SBR cases carrying the Q5 tester note, including SBR-WO-01 = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310)
and SBR-ASGN-01..06 = C30292–C30297. **Who can close it:** a build change. **Risk LOW** — every
affected case carries the plain instruction *"mark this test Failed and report it as the pending
rename — do not change the test."*

### D10 · The Esc key does not close the deactivate dialog, against SBR `S13-R8` — RISK: **LOW**

**Plain one-sentence answer:** *"The product owner confirmed pop-ups in this app do not close with
the Escape key, so we follow his answer rather than the specification sentence."*
**Evidence:** Chris Ward 2026-07-28 Q1 = B. Overridden: SBR `S13-R8` *"Esc dismisses"*.
**Affected:** SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) ·
SBR-DEACT-05 = [C30256](https://shopview.testrail.io/index.php?/cases/view/30256).
**Who can close it:** Chris Ward's spec edit. **Risk LOW.**

---

## Category 3 — Requirements deliberately not authored

### D11 · The inert back-end permission atom gets no case — RISK: **LOW**

**Plain one-sentence answer:** *"A permission that exists but does nothing has no behaviour a tester
can check, so we only test the half that is visible — that it is hidden from the screen."*
**Evidence:** Chris Ward, verbatim: *"if it's already built, we just hide the new permissions from FE
(they can exist and not do anything for now -- no wasted time)."*
**Affected:** SBC-PERM-05 = [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) covers
the visible half; the inert half is deliberately uncovered.
**Who can close it:** nobody needs to. **Risk LOW.**

### D12 · No case asserts the Asset dropdown's stay-open-versus-close-per-pick behaviour — RISK: **LOW**

**Plain one-sentence answer:** *"Two people discussed changing how that dropdown behaves but nothing
was decided, so we did not invent a rule for it."*
**Evidence:** kickoff video P12 15:49–16:04 (Stefan: *"I would also add maybe a toggle or
something"*; Chris 16:54: *"let's please do this. Happy to update the spec with that, too"*) —
never ratified. Recorded in WIP-FLT-03's note. **Who can close it:** Chris Ward. **Risk LOW.**

### D13 · Two surface-split candidates identified and NOT authored — RISK: **MEDIUM**

**Plain one-sentence answer:** *"We found two small gaps — one export's row order is never checked in
the PDF and another's is never checked in the CSV — and we are waiting for approval before adding
them."*
**Evidence:** PV `S3-R3` says *"the same order appears on screen and in the exports"*, but
PV-EXP-04 = [C30378](https://shopview.testrail.io/index.php?/cases/view/30378) downloads only the
CSV. SBR-TREE-09's own note says the order *"applies in the Expanded View PDF per-rep tables and the
Expanded CSV"*, but SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)
asserts only the rep order. Full working in `CONTRADICTIONS.md`.
**Who can close it:** the QA lead authorising an extension of those two cases (Rule 6 — a candidate
gap is never authored on our own initiative). **Risk MEDIUM** — it is a real, if small, uncovered
assertion, and it is the same defect class as the July 31 export miss.

### D14 · The Declined work-order status has no case because the status does not exist — RISK: **LOW**

**Plain one-sentence answer:** *"The specification mentions a 'Declined' status; the build has no such
status, so there is nothing to test."*
**Evidence:** `GET /api/work-orders/statuses` returns exactly `estimate, approved, in_progress,
ready_for_review, complete` and the closed set. Recorded in WIP-SCOPE-02's observation.
**Affected:** WIP-SCOPE-02 = [C30457](https://shopview.testrail.io/index.php?/cases/view/30457).
**Who can close it:** Chris Ward. **Risk LOW.**

---

## Category 4 — Open, awaiting a PO or dev

### D15 · The IV totals-row label: spec says "Total", build says "Totals" — RISK: **LOW**
**Plain one-sentence answer:** *"The specification and the screen disagree by one letter; we have
asked the product owner which is right."* **Evidence:** IV `S4-R1` vs `S10-R6`, and the build shows
"Totals". **Affected:** IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556).
**Who can close it:** Chris Ward. **Risk LOW.**

### D16 · "Rep is active?" was not covered by the rename ruling — RISK: **LOW**
**Plain one-sentence answer:** *"One column heading still uses the short word and the product owner
did not mention it, so we left it and asked."* **Evidence:** Q5 named every other string; queued as
`DELTAS.md` A2. **Affected:** SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) ·
SBR-ASGN-04 = [C30295](https://shopview.testrail.io/index.php?/cases/view/30295). **Risk LOW.**

### D17 · TU Story 10 has no Jira story ticket — RISK: **MEDIUM**
**Plain one-sentence answer:** *"A whole new section of one specification has no ticket in Jira, so
two of our tests are pointed at the nearest ticket instead of their own."*
**Evidence:** TU story tickets stop at SV-8656 (Story 9); Story 10 (Column Selection and
Persistence, added 2026-07-29) has none. **Affected:** TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) ·
TU-LOC-06 = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915).
**Who can close it:** whoever owns the epic — we need the ticket key. **Risk MEDIUM** — it is a real
traceability shortfall under Standing Rule 20, and it is the only one in 478 cases.

### D18 · Epic SV-8582 has 6 reopened stories and has not been re-read — RISK: **MEDIUM**
**Plain one-sentence answer:** *"Six tickets in the project were reopened on 31 July and we have not
re-read them, so there may be changes we have not seen."*
**Evidence:** recorded in the CHANGE-LEDGER's source-currency block. A Tier-2 full epic re-read is
expensive and user-gated (Standing Rule 37). **Who can close it:** the QA lead authorising the
re-read. **Risk MEDIUM.**

---

## Category 5 — Things that cannot be settled without a live build (or a better one)

### D19 · Everything in this suite is PROVISIONAL against a non-final branch — RISK: **HIGH**
**Plain one-sentence answer:** *"Engineering told us the test branch is not finished, so every result
we have is provisional and every one of the 478 tests is queued to be checked again."*
**Evidence:** QA lead relaying engineering, 2026-08-03, verbatim: *"they have also told they this QA
Branch is also not final they are still working on it."* Build marker `v3.4.1-0ed4433`.
**Affected:** all 478, queued in `../viu-2026-08-03/RECHECK-QUEUE.md` (**OPEN**, now covering
478/478). **Who can close it:** engineering declaring the branch final.
**Risk HIGH** — no Report Suite deliverable may be called VIU-complete while this queue is open, and
that includes this audit.

### D20 · Only 86 of 475 cases had every assertion driven end to end — RISK: **HIGH**
**Plain one-sentence answer:** *"We have seen part of most tests working on the real build, but only
86 have been run all the way through, so 'passed' here means 'nothing was seen to be wrong', not
'fully verified'."* **Evidence:** the CHANGE-LEDGER's own totals and its own sentence *"I did not
drive every step of any single case end to end."* **Affected:** the whole suite; reconciled in
`VERDICT-LEDGER.md`. **Who can close it:** a full VIU pass on the settled build.
**Risk HIGH — this is the concession, not the explanation.**

### D21 · Five behaviours cannot be produced on this organisation at all — RISK: **LOW**
**Plain one-sentence answer:** *"Five things cannot be set up on our test company — a part without a
category, a location without a labour rate, an export big enough to hit the size limit, a negative
invoice, and an inactive sales representative holding sales — so those tests stay unrun with the
reason recorded."*
**Evidence:** parts require `category_id` (0 of 5,657 rows blank); both locations resolve to a rate;
the widest scope is 9,275 rows against a 10,000 cap; no credit or reversal exists; the only
credited rep is not a staff record.
**Affected:** the 20 EXTERNAL-DEPENDENCY cases in `VERDICT-LEDGER.md`.
**Who can close it:** a dev-seeded organisation, or QuickBooks being connected. **Risk LOW** — each is
fully characterised, never left as a bare "not verified".

### D22 · 56 of 478 cases cannot be run by a non-technical tester — RISK: **MEDIUM**
**Plain one-sentence answer:** *"Fifty-six of the tests need a developer tool — the browser's network
panel, a screen reader or a ruler — so a non-technical tester can run 422 of the 478 unaided."*
**Evidence:** 30 need the network panel (all in API-titled sections, so Standing Rule 4 is
satisfied), 25 need a screen reader / accessibility inspector / PDF inspector, 1 needs QuickBooks.
Named individually in `per-case-verdicts.csv` column `layman_runnable`.
**Who can close it:** nobody — accessibility and API requirements inherently need tools; the honest
action is to route those 56 to a technical tester. **Risk MEDIUM.**

---

## Category 6 — Foreign-case overlaps (Standing Rule 38)

### D23 · Five of Vladimir Tomovic's cases sit in our group and we have not touched them — RISK: **LOW**
**Plain one-sentence answer:** *"Five tests in the same folder were written by someone else; we never
edit anyone else's tests, so they are reported separately and excluded from our counts."*
**Evidence:** `created_by = 1` on C38919–C38923, resolved via `get_user/1`.
**Note worth raising:** four of the five are about the Location column being **scope-governed**, and
[C38920](https://shopview.testrail.io/index.php?/cases/view/38920) states the automatic model —
**agreeing with the specs and against our IV and WIP cases** (entry D1). That is an outside signal
confirming our own finding. **Who can close it:** the QA lead and Vladimir, together.
**Risk LOW** — but it means D1 is visible from outside our work.

---

## Category 7 — Known imperfections accepted or scheduled

### D24 · Three VIU verdicts recorded PASS against their own contradicting evidence — RISK: **HIGH**
**Plain one-sentence answer:** *"Three tests were marked as passing even though the note written
underneath them describes the build doing something different; we caught it and recommend changing
them to failures."*
**Evidence:** SBR-EXP-06 = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) (a
range token in a file name the case says is "exactly" fixed) · SBR-VIS-03 = [C30307](https://shopview.testrail.io/index.php?/cases/view/30307)
(three of five accessible names differ) · SBC-EXP-09 = [C30167](https://shopview.testrail.io/index.php?/cases/view/30167)
(PDF header date range off by one day). All three quoted in full in `VERDICT-LEDGER.md`.
**Who can close it:** the QA lead re-verdicting them (ledger becomes 324 PASS / 112 DEVIATION).
**Risk HIGH — three false passes is exactly the kind of thing a hostile reviewer looks for, and it
was ours to catch.**

### D25 · Two VIU observations are inferences, not observations — RISK: **MEDIUM**
**Plain one-sentence answer:** *"On two dark-mode tests the evidence written down is a deduction from
how the app is built, not something anyone actually looked at; that is not good enough and both are
queued to be looked at properly."*
**Evidence:** IV-VIS-05 = [C30600](https://shopview.testrail.io/index.php?/cases/view/30600) —
*"The application ships a dark mode and this report is built from the same standard table
components"*; WIP-VIS-07 = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) —
*"built from the standard Quasar table and badge components used throughout it"*. Standing Rule 12
requires observation. **Who can close it:** a five-minute look at both reports in dark mode.
**Risk MEDIUM.**

### D26 · Twenty-five cases carry repairable wording; five are the same stray cosmetic sentence — RISK: **LOW**
**Plain one-sentence answer:** *"Twenty-five tests need a wording tidy-up — none of them is wrong
about the product — and five of them repeat the same throwaway sentence about a filter's width that
should live in one place."*
**Evidence:** the FIX-WORDING list in `AUDIT.md`. The repeated sentence is IV-LOC-06 exp 6,
PV-FILT-14 exp 6, SBC-LOC-04 exp 7, SBR-LOC-05 exp 8, TU-LOC-06 exp 8.
**Who can close it:** the QA lead approving the edit list. **Risk LOW.**

### D27 · Three pixel-measurement cases were never given the repair their siblings got — RISK: **LOW**
**Plain one-sentence answer:** *"Three tests still ask a manual tester to measure pixel values, which
we already stopped doing on the equivalent test for another report; the same fix should be applied."*
**Evidence:** PV-VIS-02 = [C30386](https://shopview.testrail.io/index.php?/cases/view/30386) was
repaired on 2026-07-28 to a by-eye check naming design and engineering as the owner of the figures.
SBC-VIS-01 = [C30185](https://shopview.testrail.io/index.php?/cases/view/30185), SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305),
SBC-TREE-01 = [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) and SBC-TREE-13 = [C30133](https://shopview.testrail.io/index.php?/cases/view/30133)
were not. **Who can close it:** the QA lead approving the edit. **Risk LOW.**

---

## Category sweep — all seven walked

Every one of Rule 46's seven categories produced at least one entry, which is itself worth knowing:
a suite this size with an empty category would mean the category was not looked at.

| Category | Entries |
|---|---|
| 1 · spec contradicts itself | D1, D2, D3 |
| 2 · case follows a PO ruling over spec text | D4, D5, D6, D7, D8, D9, D10 |
| 3 · deliberately not authored | D11, D12, D13, D14 |
| 4 · open, awaiting a PO or dev | D15, D16, D17, D18 |
| 5 · cannot be settled without a live build | D19, D20, D21, D22 |
| 6 · foreign-case overlaps | D23 |
| 7 · known imperfections accepted or scheduled | D24, D25, D26, D27 |
