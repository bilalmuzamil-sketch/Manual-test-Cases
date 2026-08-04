# RECLASSIFIED — 9 cases mislabelled EXTERNAL-DEPENDENCY, 2026-08-04

> **⚠️ THIS IS A CORRECTED LIST ONLY. THE MASTER LEDGER STILL NEEDS THIS MERGED.**
>
> **`build/report-suite/viu-2026-08-03/batch-sbc-sbr/verdicts.csv` and its `VERDICTS.md` were NOT
> touched by this pass** — another pass owns those files. Nothing in TestRail was touched either. This
> document is the corrected verdict list; **somebody with ownership of the batch files and the master
> tally must merge it**, and that authorisation is an outstanding item.

---

## Why these nine were mislabelled

The Sales By Customer / Sales By Representative batch recorded nine cases as **EXTERNAL-DEPENDENCY**.
That label means *"something outside this build and outside our control prevents the check"* — the
legitimate examples on this project are QuickBooks not being connected to the organisation, or a
physical payment terminal not existing.

**That is not what stopped these nine.** What stopped them is
**`POST /api/invoices/create` returning HTTP 500 — a defect inside this same QA branch.**

The distinction matters because the two labels say completely different things to the reader:

| Label | What it tells the QA lead |
|---|---|
| EXTERNAL-DEPENDENCY | "Nobody here can fix this; we need a third party or hardware." Nothing to chase. |
| **BLOCKED-BY-DEFECT** | "There is a bug, it has an owner and a ticket, and these cases become runnable the moment it is fixed." Something to chase. |

Labelling a defect as an external dependency quietly writes off nine cases that are in fact one bug fix
away from being testable. It also hides the true cost of the invoice defect, which is the strongest
argument for prioritising it.

## The new label

**`BLOCKED-BY-DEFECT — invoices/create HTTP 500`**

Naming the blocking defect in the label itself is deliberate: it means the ledger, the tally and any
report generated from it all carry the reason, so no reader has to go looking for it.

*(Once the ticket is filed, the label should carry its key — `BLOCKED-BY-DEFECT — SV-xxxxx` — which is
another reason the Jira filing needs to happen before this is merged.)*

---

## The nine cases, precisely

| # | Internal ID | TestRail | Link | Was | **Now** | Blocking defect |
|---|---|---|---|---|---|---|
| 1 | **SBR-API-06** | C30321 | [open](https://shopview.testrail.io/index.php?/cases/view/30321) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 2 | **SBR-DEACT-02** | C30253 | [open](https://shopview.testrail.io/index.php?/cases/view/30253) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 3 | **SBR-DEACT-03** | C30254 | [open](https://shopview.testrail.io/index.php?/cases/view/30254) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 4 | **SBR-DEACT-04** | C30255 | [open](https://shopview.testrail.io/index.php?/cases/view/30255) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 5 | **SBR-DEACT-05** | C30256 | [open](https://shopview.testrail.io/index.php?/cases/view/30256) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 6 | **SBR-DEACT-06** | C30257 | [open](https://shopview.testrail.io/index.php?/cases/view/30257) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 7 | **SBR-DEACT-07** | C30258 | [open](https://shopview.testrail.io/index.php?/cases/view/30258) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 8 | **SBR-DEACT-08** | C30259 | [open](https://shopview.testrail.io/index.php?/cases/view/30259) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |
| 9 | **SBR-DEACT-09** | C30260 | [open](https://shopview.testrail.io/index.php?/cases/view/30260) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** | `invoices/create` 500 |

All nine sit in the **`SBR — Staff Deactivation`** area except **SBR-API-06**, which is in
**`SBR — API`** and is the server-side pre-check behind the same dialog.

### The blocking chain, per the batch's own recorded evidence

1. The deactivation dialog only opens for a sales representative **who is a staff record** *and* **holds
   customer assignments**.
2. The only representative carrying report credit on this organisation — `Parth Fadadu` — **is not a
   staff record at all**; he does not appear in `GET /api/staff` (68 records, both workplaces checked),
   so he has no active-status toggle to switch off.
3. Representatives that *can* be created hold **no invoices**, so deactivating them shows no assignments
   and no dialog — which is a different, already-covered case.
4. Giving one of them an invoice requires **creating an invoice**, and
   `POST /api/invoices/create` → **HTTP 500** (request ids `24dbd181-…`, `a7ab157a-…`, `8d0e2a06-…`,
   `818265ba-…`, `b7bf4a22-…`).

So the chain terminates in a defect in this branch, not in an external dependency. **Fix the 500 and all
nine become runnable.**

### One of the nine carries an honesty correction already made by the batch

**SBR-DEACT-07 (C30258)** was first credited as a **pass**, on the strength of switching the
`is_sales_rep` flag off through `POST /api/staff/{staff_id}/change` with no pre-check firing. The batch
then corrected itself: that is not what the case describes — the case is about the **staff-administration
deactivation screen's** no-dialog paths, which were not driven. It was moved to EXTERNAL-DEPENDENCY
rather than left as a claimed pass. **That correction was right; only the label it moved to was wrong**,
and this document fixes the label, not the judgement.

---

## Corrected overall totals

| Verdict | Was | **Now** | Change |
|---|---:|---:|---|
| VIU-Observed-PASS | 326 | **326** | — |
| DEVIATION | 107 | **107** | — |
| NOT-BUILT | 13 | **13** | — |
| EXTERNAL-DEPENDENCY | 29 | **20** | **−9** |
| **BLOCKED-BY-DEFECT** *(new)* | 0 | **9** | **+9** |
| **TOTAL** | **475** | **475** | — |

**Verified both ways:** 326 + 107 + 13 + 20 + 9 = **475**, and the previous 326 + 107 + 13 + 29 = **475**.
The population is unchanged and no case moved into or out of any other verdict.

Per-batch, after the correction:

| Batch | Cases | PASS | DEVIATION | NOT-BUILT | EXTERNAL-DEP | BLOCKED-BY-DEFECT |
|---|---:|---:|---:|---:|---:|---:|
| `batch-pv-tu` (PV + TU) | 131 | 95 | 32 | 0 | 4 | 0 |
| `batch-wip-iv` (WIP + IV) | 149 | 92 | 40 | 1 | 16 | 0 |
| `batch-sbc-sbr` (SBC + SBR) | 195 | 139 | 35 | 12 | **0** | **9** |
| **Total** | **475** | **326** | **107** | **13** | **20** | **9** |

**Note that `batch-sbc-sbr`'s EXTERNAL-DEPENDENCY count goes to zero** — all nine of its
external-dependency rows were this same misclassification. The 20 that remain are all in the other two
batches and were checked against the definition:

- **`batch-pv-tu` — 4.** One needs a QuickBooks-connected company plus a human in QuickBooks (genuinely
  external). Three need a location with **no** default labour rate, which could not be created
  *reversibly* on a shared organisation because `POST /api/workplaces/delete` returns HTTP 500 for every
  id. **That third group is arguably also blocked-by-defect** and is flagged below rather than silently
  left.
- **`batch-wip-iv` — 16.** Twelve are the nightly-snapshot cases with no read route (see
  `NIGHTLY-SNAPSHOT-EXPLAINED.md`); the rest are genuine data-shape impossibilities on this
  organisation (a part cannot exist without a category; the 10,000-row cap is unreachable; history is
  only two days deep).

## ⚠️ Three more that MAY belong under the new label — flagged, not moved

**TU-ELL-04 = [C30407](https://shopview.testrail.io/index.php?/cases/view/30407)** ·
**TU-ELL-05 = [C30408](https://shopview.testrail.io/index.php?/cases/view/30408)** ·
**PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925)** — of these, the two
TU cases need a location with no default labour rate, and the batch's own note records that the reason
one could not be created is that **`POST /api/workplaces/delete` returns HTTP 500 for every id**, so a
third location could not be made *reversibly* on a shared org. By the same reasoning applied to the nine,
that is a defect blocking a check, not an external dependency.

**They are NOT moved here.** Two reasons, both honest: I was asked to identify **nine**, and moving them
would mean reinterpreting another pass's deliberate judgement — the batch may have weighed
"reversibility on a shared org" as a self-imposed constraint rather than a blocker, which is a defensible
call. **Flagged for the QA lead's ruling.** (PV-PREC-02 is a genuine QuickBooks dependency and should
stay as it is.)

---

## What must happen to merge this

1. **File the invoice-create ticket** (`TICKET-4-invoice-create-500.md`) so the label can carry its key.
2. **Authorise the ledger edit**, and say which worker makes it — `batch-sbc-sbr/verdicts.csv` and
   `VERDICTS.md` are owned by another pass and were deliberately left alone.
3. **Rule on the three flagged above.**
4. Regenerate any deliverable that quotes the old **326 / 107 / 13 / 29** split.

Until step 2 happens, **two different totals exist in the repo** — the batch files say 29
EXTERNAL-DEPENDENCY, this document says 20 + 9. That is stated plainly so nobody quotes the wrong one by
accident.
