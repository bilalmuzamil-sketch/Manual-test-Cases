# SV-8594 – SV-8599 (`[B1]`–`[B6]`) — the reopening, and whether scope changed

> **The QA lead's question:** *does the reopening mean the scope changed?*
> **Short answer: NO.** It was an **erroneous bulk close, reversed by the same person two days
> later**. Nothing about what the six reports must do changed. Detail and evidence below.

---

## 1 · The plain-English version (Rule 7)

On **27 July** a developer closed six tickets as **OBSOLETE / Done** in one sweep, 4 seconds apart.
On **29 July** the **same developer** put all six back to **Open** and cleared the "Done" stamp, again
in one sweep, seconds apart. **Nobody edited a single word of what those tickets ask for** — not on
the 27th, not on the 29th, not ever. So the work they describe is exactly the work they always
described; only their status label moved, and it moved wrong and then moved back.

**What this means for us:** no test case needs to change because of the reopening. The six tickets are
the live build tickets for the six reports, and we have been treating them that way since 31 July.

---

## 2 · The evidence — verbatim changelog, all six

From the Jira changelog in the 2026-07-31 snapshot (untruncated: `total == len(histories)` on every
issue). Actor is **parth fadadu** for every single transition, on both dates.

| Ticket | 2026-07-27 (the close) | 2026-07-29 (the reversal) |
| --- | --- | --- |
| SV-8594 `[B1]` WIP | `00:07:17` status `Open → OBSOLETE`; resolution `None → Done` | `06:20:54` `OBSOLETE → Blocked`, resolution `Done → None` → `06:20:57` `→ Board Backlog` → `06:21:00` `→ Open` |
| SV-8595 `[B2]` TU | `00:07:21` `Open → OBSOLETE`; `None → Done` | `06:21:03` `OBSOLETE → Board Backlog`, `Done → None` → `06:21:09` `→ Open` |
| SV-8596 `[B3]` PV | `00:07:25` `Open → OBSOLETE`; `None → Done` | `06:21:14` `OBSOLETE → Board Backlog`, `Done → None` → `06:21:17` `→ Open` |
| SV-8597 `[B4]` IV | `00:07:29` `Open → OBSOLETE`; `None → Done` | `06:21:32` `OBSOLETE → Board Backlog`, `Done → None` → `06:21:36` `→ Open` |
| SV-8598 `[B5]` SBC | `00:07:32` `Open → OBSOLETE`; `None → Done` | `06:21:44` `OBSOLETE → Board Backlog`, `Done → None` → `06:21:49` `→ Open` |
| SV-8599 `[B6]` SBR | `00:07:36` `Open → OBSOLETE`; `None → Done` | `06:20:42` `OBSOLETE → Board Backlog`, `Done → None` → `06:20:45` `→ Open` |

**Four facts follow, and each one independently argues against a scope change:**

1. **Same actor both ways.** A scope decision reversed by its own author within 48 hours is a
   correction, not a re-plan.
2. **19 seconds for all six closes; ~67 seconds for all six reopens.** Both sweeps are mechanical
   bulk edits. Nobody re-scoped six high-complexity build tickets in 19 seconds.
3. **The transitions are pure status/resolution.** `status` and `resolution` are the *only* fields
   that moved. There is **no `description` entry in any of the six changelogs** — verified
   programmatically across all 98 issues: the **only** description edit anywhere in the tree is the
   epic's own, on 2026-07-26.
4. **The route back is workflow plumbing, not judgement** — `OBSOLETE → Blocked/Board Backlog → Open`
   is someone stepping through the allowed transitions to undo a terminal state.

**The most likely explanation** (offered as inference, and labelled as such per Rule 12): the six
`[B1]`–`[B6]` build tickets were closed **by confusion with the six genuinely obsolete placeholders
SV-8583–SV-8588**, which are still OBSOLETE today and are titled almost identically — *"Work In
Progress (WIP) Report"* vs *"[Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot
cron"*. Two 6-ticket sets, one per report, near-identical titles. I cannot prove intent without the
developer's confirmation, and I am not asserting it as fact.

---

## 3 · A correction to the task's framing — which we had already made ourselves

The task brief stated the tree holds *"90 Open / 6 OBSOLETE"* **and** that SV-8594–8599 were reopened
— which reads as though the 6 OBSOLETE ones are SV-8594–8599. **They are not.** As of the snapshot:

| Set | Keys | Status | What they are |
| --- | --- | --- | --- |
| Original placeholders | **SV-8583 – SV-8588** | **OBSOLETE** (6) | First-cut one-per-report stubs, 194–289 chars, superseded |
| Engineering build stories | **SV-8594 – SV-8599** | **Open** (reopened) | `[B1]`–`[B6]`, 1724–2288 chars, **the live implementation tickets** |

So **the 6 OBSOLETE tickets are the placeholders, and the reopened `[B1]`–`[B6]` are Open** — which is
the correct and desirable end state. Both statements in the brief were individually true; together
they read as one contradiction.

**In fairness: we had already caught this.** `build/OUTSTANDING-ITEMS-REGISTER.md` records it verbatim
from the 2026-07-31 Tier-1 check — *"(Correction to the earlier brief: the six that MOVED are the
`[Bn]` stories, not the six now-OBSOLETE originals SV-8583–8588.)"* — along with the confirmation that
**zero cases cite the 6 OBSOLETE originals**, so no coverage rides on them. My pass re-derived the same
result independently; I am not claiming it as a new discovery.

---

## 4 · The other correction — "have never been read" is not accurate

The brief gives the reopening as *"the specific reason this re-read was authorised"*, on the basis
that these six *"have never been read"*. Checking our own records first (Rule 39/44 — the conflict is
often our older note versus a newer one we already hold), that is **not** the case:

1. **Their descriptions were read on 2026-07-27** and written out in full, per ticket, to
   `build/report-suite/epic-sv8582/requirements-SV-8594.md` … `-SV-8599.md`. I diffed those files
   against the snapshot: **the content matches**, which is expected given no description was ever
   edited.
2. **They were reconciled against our cases on 2026-07-31**, *after* the reopening, in
   `build/report-suite/epic-sv8582/RECONCILIATION.md`, which carries an explicit correction block:

   > *"**⚠️ CORRECTED 2026-07-31 — the "OBSOLETE / historical detail only" premise below is STALE.**
   > … So B1–B6 are the **live engineering implementation tickets** for the six reports and their
   > technical detail is **current engineering truth, not history**."*

   and a per-story verdict table, e.g. for SV-8595:

   > *"| **SV-8595** B2 (TU) | no-default-rate → em-dash/partial; sort resets on reload and is never
   > remembered; cent-reconcile vs Timesheet Activities | TU-ELL-03/04/05 = C30406/C30407/C30408;
   > TU-SORT-03 = C30411; TU-LINK-03/04/05 = C30430/C30431/C30432 | **COVERED — exact match** |"*

**What was genuinely at risk, and is the legitimate reason to re-read:** on **27 July**, while the six
were stamped OBSOLETE, our reconciliation treated their content as *"historical detail only
(superseded)"*. Had that reading survived, we would have discounted the live build truth for all six
reports. It did not survive — it was caught and corrected on 31 July. **The danger was real; it was
already closed before this task started.**

I have re-derived the verdicts independently rather than trusting that table (Rule 43: matrices are
re-derived, never patched). **My independent pass agrees with it**, and adds detail the July pass did
not have — see `NEW-OR-CHANGED-REQUIREMENTS.md` §7.

---

## 5 · Does the reopening imply a changed build plan?

**No — and there is a positive signal in the reopening itself.** Read alongside the one ticket that is
**In Progress**, the status picture is a plan being *executed*, not revised:

- **SV-8589 (PR-1)** — `In Progress`. The precision fix that *"ships as its own PR, ahead of the
  suite"* and **blocks B3 (PV)**. Phase 0 is underway.
- **SV-8590–8593 (A2–A5)** — Open. The foundation that *"Blocks: all six reports"*.
- **SV-8594–8599 (B1–B6)** — Open, restored. Each declares its dependencies: B1/B2 on `A2, A5`;
  B3 on `PR-1, A2, A5`; B4 on `A2, A3, A5`; B5/B6 on `A2, A4, A5`.

That is a coherent, unchanged dependency chain: **PR-1 → A2/A3 → A4/A5 → B1…B6**, exactly as the tech
plan describes. If scope had genuinely been cut, the six would have *stayed* OBSOLETE and the
foundation stories would have moved too. Neither happened.

**The one thing I cannot rule out**, honestly: a scope change agreed in a channel other than Jira —
a chat, a call, or a spec edit — would leave no trace in these changelogs. What I can say is that
**nothing in Jira, and nothing in the six ticket bodies, shows a scope change**, and the live specs
were separately read on 2026-08-03 (`spec-watch-verification-2026-08-03/`) without one surfacing.

---

## 6 · What the six actually require, and whether it differs from what we test

Independently re-derived. Full per-assertion rows with both texts quoted are in
`NEW-OR-CHANGED-REQUIREMENTS.md` §7; this is the summary.

| Ticket | Headline requirements | Differs from what we test? |
| --- | --- | --- |
| **SV-8594** `[B1]` WIP | Client-side tabs/filters (not server-paged); `Labor Earned = Σ min(clocked, quoted)`; date anchor `work_order.start_date`; 4 tabs; 7-figure strip; nightly cross-tenant cron, idempotent per (workplace, WO, date); **no snapshot reader this version** | **No.** All 8 assertions covered, including the *negative* (WIP-TAB-05 = [C30455](https://shopview.testrail.io/index.php?/cases/view/30455): *"No screen in the report reads or displays the nightly snapshot history"*) |
| **SV-8595** `[B2]` TU | Est. Lost Labor = Σ per location (default rate × internal hours); no default rate → em-dash; split rated/unrated → partial; **sort resets A–Z, never remembered**; cent-reconcile vs Timesheet Activities | **No.** Strongest coverage in the suite — TU-ELL-01/03/04/05 decompose the ticket's `partial/"—"` shorthand into three distinguishable observable states |
| **SV-8596** `[B3]` PV | 20 columns / 14 default; Units Sold net over invoicing origins; Demand = in-window event count; cores excluded; **permission = existing Inventory Reports→View, no new atom**; two-tone theme | **No.** PV-COL-01 = [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) enumerates all 20; PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) enumerates the 14 + the 6 hidden |
| **SV-8597** `[B4]` IV | Positive-bins-only qty; sell = fixed / cost / matrix-markup; as-of resolution 3 branches; **retention ≤13mo daily → monthly**; Margin + Total Sell off by default; `ROLE_REPORT_VIEW` | **No.** IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) matches the default-off rule word for word; IV-API-05/06 cover prune **and** its read-side effect |
| **SV-8598** `[B5]` SBC | **Dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`**; GROUP BY `company_id`; Subtotal incl. shop supplies; **Margin excludes** them; Parts Sales bucket = no vehicle; two-level 10k cap | **Yes, on the permission — deliberately.** Chris Ward ruled the built atom is **hidden and left inert**, and the live spec (read 2026-08-03) now agrees with our case. Rule 32/33: the newer PO ruling wins over the older engineering ticket. Documented in the case notes, not silently. |
| **SV-8599** `[B6]` SBR | Immutable rep snapshot; Unassigned pinned; (Inactive) still credited; payment 5→3 with the deposit nuance; assignments export keeps the legacy convention; **Esc-to-dismiss conflict** | **One open decision.** SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) asserts Escape does *not* dismiss (Golden Rule #9); spec S13-R8 wants Esc. **Engineering itself declines to decide** — *"surface as decision"*. Needs **Chris Ward**. |

---

## 7 · Verdict

| Question | Answer |
| --- | --- |
| Did the reopening change scope? | **No.** Status-only reversal of an erroneous bulk close by the same developer, 48 hours apart. No description was ever edited. |
| Does it imply a changed build plan? | **No.** The PR-1 → A2/A3 → A4/A5 → B1…B6 dependency chain is intact and Phase 0 is In Progress. |
| Do the six require anything we do not test? | **No new requirement.** One deliberate divergence (SBC permission, resolved by a newer PO ruling in our favour) and one genuinely open product decision (SBR Esc). |
| Any case changes needed *because of the reopening*? | **None.** |
| Was the earlier "obsolete → ignore" risk real? | **Yes — and already closed** on 2026-07-31, before this task. |
| Confidence | **High.** The only limit is a 4-day window (2026-07-31 → 2026-08-04) in which a status could have moved again. SV-8780 post-dates the snapshot and is unread, but the QA lead ruled *"Ignore this ticket."* (2026-08-03), so it is **out of scope by decision**, not an open risk. |

**The one thing to do about this: nothing.** No case changes, no escalation, no ticket to read. The
question is answered — the scope did not change. The only residual is the 4-day window, which a single
Jira credential would close in minutes (see `OUTSTANDING.md`).
