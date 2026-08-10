# The three handed-off reports — status as at 2026-08-10

> ## ⚠️ SUPERSEDED IN PART — read `EXPECT-FAIL-AUDIT-2026-08-10.md` alongside this file
>
> **The QA lead ruled on 2026-08-10 that the branch is FINAL FOR THESE THREE REPORTS ONLY:**
> *"they have released just those reports which I mentioned… so the branch is final for those reports
> only, the remaining reports are yet to be handed off to the QA."*
>
> **So findings on Work In Progress, Technician Utilization and Sales By Customer are DEFINITIVE, not
> provisional.** A deviation on these three is a **real defect in a finished feature**, not an
> observation against an unfinished one. Sales By Representative, Parts Velocity and Inventory Value
> are unchanged — still not handed off, still provisional.
>
> **The honest limit on the word "final":** it means **handed off / feature-complete**, not "the code
> will never change again". The branch can still redeploy — not least to fix the defects being
> reported — so **a redeploy still invalidates the on-screen labels and the pass/fail verdict**
> (Standing Rule 60, layers 1–2). What finality removes is a *different* doubt: whether a missing
> control is an unfinished feature or a defect. On these three, it is a defect.
>
> **Also superseded here:** §3's statement that the 28 other closed tickets have not been re-checked,
> and the marker census. The expect-fail audit began on 2026-08-10 — see that file for live counts.

**Scope:** Work In Progress · Technician Utilization · Sales By Customer — the only three reports
development has handed off. **225 cases, all ours** (Sales By Customer 87 · Technician Utilization 60
· Work In Progress 78), counted live from TestRail with no sampling.

**Build:** `v3.5-4795eee` · last-modified Fri 07 Aug 2026 13:10:42 GMT · etag
`a80113cf3856c5fedf63be893e8b41c7`. **Read three times — pass start, mid-pass and end. The body was
byte-identical every time, so the build moved ZERO times during this pass.**

**Sources, verified live this pass:** Sales By Customer **Confluence v16** · Technician Utilization
**v7** · Work In Progress **v10**, taken from each page's `metadata.version`, never the in-body
"Version" text (Rule 31(a)). Chris Ward's answers of **2026-08-10** were applied.

---

## 1 · The number the QA lead asked for

| Report | Cases | Verdicted against `v3.5-4795eee` this pass | Still carrying an older build's verdict | Held, and on what |
|---|---:|---:|---:|---:|
| Sales By Customer | **87** | **4** | 73 | 10 |
| Technician Utilization | **60** | **7** | 47 | 6 |
| Work In Progress | **78** | **6** | 65 | 7 |
| **TOTAL** | **225** | **17** | **185** | **23** |

**Say this plainly: 17 of 225 were checked against the build that is running now. 185 were not.**
This pass was a focused live check, not a per-case sweep of all 225, and it does not claim to be one.
Before this pass the figure was **0 of 225** — every Technician Utilization verdict dated from 5
August and nothing at all had been seen on `v3.5-4795eee`.

### Marker census — read it correctly

| | Before | After | Why it moved |
|---|---:|---:|---|
| `AUTOMATION: READY` | 150 | **149** | C38916 moved to expect-fail — it was marked ready while asserting something the build fails |
| `AUTOMATION: READY - EXPECT FAIL` | 52 | **53** | as above |
| `AUTOMATION: HOLD` | 23 | **23** | three hold *reasons* were corrected; none came off hold |
| **Total** | 225 | **225** | |

**A `READY` marker means the case CAN be automated. It does not mean the case passes, and it does not
mean the case has been verified against this build.** The verification position is the table above.

---

## 2 · What changed in TestRail

**5 cases written, `update_case` only. Every write re-read and byte-compared: 30 fields each,
0 mismatches, 0 collateral changes.** No `add_case`, no `delete_case`, no section operations, no run
writes, no results logged.

| Case | C-id | What was wrong | What it says now |
|---|---|---|---|
| SBC-LOC-04 | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Title and first line asserted the **superseded scope model** | Rewritten to the ratified access model |
| TU-LOC-06 | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | Provenance named spec **v6** and a 6 Aug build | Re-stamped to **v7** / `v3.5-4795eee`; item 3 now confirmed observable |
| WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | Listed Location among the **off-by-default** columns | Location is on by default for a multi-location user |
| WIP-FLT-09 | [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | **Asserted the build's behaviour as the requirement**, had broken numbering ("3. 4."), and was marked `READY` | Rewritten to spec v10, numbering repaired, marker → expect-fail |
| WIP-PERS-05 | [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | Held on a question the product owner has now answered | Hold reason corrected; the case cannot pass and says so |

**Three of these were staged by the previous pass to come off hold as `AUTOMATION: READY`. That would
have been wrong** — the live check shows the build fails all three, so under Rule 57 they keep the
documented expectation and are failures, not passes.

### Why they are still `HOLD` and not `READY - EXPECT FAIL`

An expect-fail marker names a ticket. **Rule 62 forbids creating one without the QA lead's
permission**, and I have not created one. The two cases that already point at an existing ticket
(SV-8954) carry `READY - EXPECT FAIL`; the other three carry an honest `HOLD` saying the defect is
written up and waiting. **All three become `READY - EXPECT FAIL` the moment a ticket is authorised** —
that is one small edit each.

---

## 3 · What I found on the build

Full write-up: `THREE-REPORTS-LOCATION-FINDING-2026-08-10.md` and `DEFECTS-FOR-PERMISSION.md`.

**The Location column is wrong on all three handed-off reports.** The specs and Chris's answer both
say it is gated on *what locations a person can reach* and can be switched on and off. The build gates
it on *how many locations are ticked* — narrow to one and it vanishes — and never offers it in the
column-selection control at all, so it cannot be switched.

**Three closed tickets still reproduce.** Of the 33 tickets behind the 52 expect-fail cases, **31 are
`OBSOLETE / Done`** and only SV-8818 and SV-8823 remain `Ready to Fix`. Three of the closed ones I
reproduced today:

| Ticket | Closed as | Reproduced today |
|---|---|---|
| **SV-8954** Location column disappears on a single location | OBSOLETE / Done | **Yes**, and on all three reports, not just Technician Utilization |
| **SV-8943** Technician Utilization opens on All locations | OBSOLETE / Done | **Yes** |
| **SV-8967** Work In Progress WO number is plain text | OBSOLETE / Done | **Yes** — the build's own test id reads `text_wip_wo` |

A closed ticket is a decision about whether to fix; it is not a change to the specification (Rule 57).
**My recommendation: reopen SV-8954 and widen it to all three reports.**

⚠️ **The other 28 closed tickets have NOT been re-checked**, and 50 expect-fail cases still point at
them. If those defects were fixed, those cases now pass and their markers are misleading in the other
direction. **That is the single largest piece of unfinished work on these three reports.**

---

## 4 · The spec delta, with a verdict per changed requirement (Rule 43)

Our baselines were one version behind on all three. The 2026-08-06 change-log rows cite our own QA
review workbook.

| Report | Changed requirement | Verdict |
|---|---|---|
| SBC v15→**16** | Location-column wording re-aligned to the access model (no new requirement) | **Covered** — C38912 rewritten to it this pass |
| TU v6→**7** | Location-column wording re-aligned to the access model | **Covered** — C38915 re-stamped this pass |
| TU v6→**7** | **NEW S7-R14** — export capped at 10,000 rows with the verbatim *"This report is too large to export. Narrow the date range or filters, then try again."* | **Covered** by TU-EXP-09 [C38887](https://shopview.testrail.io/index.php?/cases/view/38887), which quotes the message verbatim and correctly |
| WIP v9→**10** | Location-column wording re-aligned to the access model | **Covered** — C30467 and C38916 rewritten this pass |
| WIP v9→**10** | **NEW S9-R11** — the same 10,000-row export cap and message | **Covered** by WIP-EXP-08 [C38918](https://shopview.testrail.io/index.php?/cases/view/38918), same verbatim message |

**No changed requirement in any of the three is left without a verdict.** Note for the record that
Sales By Customer words its own cap message differently — *"This export is too large to generate…"*
(S14-R16 / S15-R25) — where TU and WIP say *"This report is too large to export…"*. Both are quoted
correctly in their own cases; the inconsistency is in the documents, not in our cases.

---

## 5 · The 23 held cases

**None came off hold this pass, and one hold was re-confirmed as genuinely correct.**

- **10 held on missing test data.** I checked the three Technician Utilization ones
  ([C30407](https://shopview.testrail.io/index.php?/cases/view/30407) ·
  [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) ·
  [C30413](https://shopview.testrail.io/index.php?/cases/view/30413)), which need a location with **no**
  default labor rate. **Every one of the five locations does have one** — QB Location $135, 4th Loc
  $135, 3rd Loc $200, Staging Heavy Duty *CP RAIL FLEET RATE* $145, Staging Lethbridge *Leth Door
  Rate* $159.95. **The hold is legitimate as written.** Producing the state needs a sixth location
  created with no labor type, which is a bigger change to a shared environment than I was willing to
  make unasked.
- **3 held on a second sign-in** ([C30398](https://shopview.testrail.io/index.php?/cases/view/30398) ·
  [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) ·
  [C43558](https://shopview.testrail.io/index.php?/cases/view/43558)) — outstanding since 5 August
  across five sessions. **`quick-login` and `switch-user` are both off limits on this branch**, so a
  second sign-in has to be supplied. It also gates about 20 further observations.
- **4 backend-only** (WIP nightly snapshot, C30528/C30530/C30531/C30533) — correct by design; WIP v10
  S11-R7 says no screen reads the snapshot. They can only ever be checked at the API layer, which
  needs permission under Rule 51 and is not requested.
- **2 genuinely awkward** (C30141, C30184) · **4 Location-related**, covered in §2.

---

## 6 · A wrong reading I caught before it became a false defect

`/api/labour-types` first appeared to show **four of the five locations with no default labor rate** —
which would have released three held cases and looked like a finding. Switching the active workplace
and re-reading proved the endpoint is **scoped to the active workplace**: every location has a rate,
and the first reading was an artefact of where I happened to be standing. **Recorded because the
control is the point, not the result.**

---

## 7 · OUTSTANDING — what I need from you

1. **Permission to file the defects** in `DEFECTS-FOR-PERMISSION.md`, and a decision on **reopening
   SV-8954** and widening it to all three reports. Until a ticket exists, three corrected cases sit on
   `HOLD` that should read `READY - EXPECT FAIL`.
2. **A second, non-administrator sign-in.** Outstanding since 5 August. It clears 3 held cases and
   about 20 more observations, and it is the single biggest lever on these three reports.
3. **Authorisation for a full per-case sweep of the remaining 208** against `v3.5-4795eee` — including
   re-checking the **28 closed tickets** behind 50 expect-fail cases. This is the largest remaining
   risk: a fixed defect leaves a case marked expect-fail, and a tester is told to ignore a real pass.
4. **Chris to reconcile the cap message wording** across the six specifications, or confirm the
   difference is deliberate.
5. **Is this branch final?** The Rule-49 queue stays open and **all 225 verdicts remain PROVISIONAL**
   until you tell us either way.
