# For Vlad — Schedule, 2026-08-11

## Automation flags: nothing changed, and nothing needed changing

**`custom_atmstatus` is `1` on all 174 Schedule cases — not one is flagged Automated.**

That matches the state left after today's earlier correction, which reset the 31 wrongly-flagged
Schedule cases to `1`. **Measured live, not carried forward from that note.**

| | |
|---|---:|
| Cases in scope | **174** |
| `custom_atmstatus = 1` | **174** |
| `custom_atmstatus = 3` (Automated) | **0** |
| **Flags changed by this pass** | **NONE** |
| Cases found Automated that Vlad had set | **NONE** |

**So: none.** No `custom_atmstatus` value was read as Automated, and this pass wrote nothing to any
case, so no flag moved.

## Automation markers — the machine-findable string

**174 of 174 carry exactly one marker**, last line of Expected Results, blank line before. 0 missing,
0 doubled.

| Marker | Cases |
|---|---:|
| `AUTOMATION: READY` | **146** |
| `AUTOMATION: HOLD - …` | **28** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | **0** |

**Ready to automate = 146.** The gate passes both ways: **146 + 0 = 146**, and **174 − 28 = 146**.

**Why there are zero EXPECT-FAIL markers, since that is the number you would expect to be non-zero:**
several cases are known to fail — the six Panel collapse cases among them — but an EXPECT-FAIL marker
must name a ticket, and **the ticket-creation hold means those tickets do not exist yet**. Rather than
invent a reference, those cases carry plain `READY` plus a tester note telling the runner to record
what they actually find. **That is deliberate and correct under Rule 61 — it is an instruction, not a
prediction — and it was left alone.**

## The 28 HOLDs, grouped — what each is actually waiting on

| Waiting on | Cases |
|---|---:|
| **A second sign-in as a non-administrator** (view-only, edit-without-delete, no-Schedule-permission, no-staff-record, per-permission-level) | **13** |
| **A drag our tooling cannot complete** — `not re-checked against the current build - it needs a drag that could not be completed` | **7** |
| **A product-owner answer that has never been sent** | **3** |
| Feature absent from the build (Dashboard section · Priority field · appointment on WO creation) | **3** |
| Shifts noted before a release already deployed | **1** |
| Shop-closure setting absent from the build | **1** |

**The single highest-value unblock for you: the 7 drag cases.** They were held when a previous pass
found the **click-to-arm alternative had been removed** between `v3.5-be42149` and `v3.5-7ec992f`
(filed as SV-8957). **If click-to-arm is back on the current build, all 7 become drivable — and that
check was not possible this pass** because the session died before the Schedule page loaded once.
It is the first thing worth checking when a session lands.

## Cases whose labels are still unconfirmed against the build

**All 174.** No label was compared this pass. The check-list is built and ready —
`evidence/labels.json` (195 mentions, 85 distinct strings, 82 cases), partitioned against spec v27 in
`evidence/partition.json` — so the comparison is mechanical once there is a session.

**Two of those strings are known to be inconsistent inside our own suite** and will affect any
automation keyed on them: `Filter & Display` vs `Filter and Display`, and `VIN` vs `VIN Number`.
Details in `CLASSIFICATION.md` §1.

---

## Attempt 2 — 2026-08-11

**Nothing for Vlad this pass.**

`custom_atmstatus` was censused live across all 174 cases: **`1` on all 174 — none is Automated.**
So there is nothing he has set, and nothing of his was touched or changed. **None.**

No case was written to at all this pass (0 `update_case`), and all 174 are proven byte-identical to
the pass-start snapshot including `updated_on`/`updated_by`.
