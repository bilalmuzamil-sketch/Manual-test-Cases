# SV-8614 "Print the report" — an Open ticket for a retired feature

> **The situation in one line:** the PO retired Print, the build has no Print, our tests correctly
> assert Print is absent — but **the Jira ticket asking for Print is still Open**, and two spec
> requirements still name it. **The paperwork disagrees with the product.**
> **Recommendation: close SV-8614, and ask Chris Ward to sweep two leftover spec lines.**
> **No test case changes.**

---

## 1 · The plain-English version (Rule 7)

Printing straight from the report was originally planned. **Chris Ward removed it** — you now get a
printable copy by downloading the PDF and printing that. **The feature is genuinely gone from the
build**, we checked on the QA branch, and **our tests already say it should be gone.**

What has not caught up is the paperwork: **the Jira ticket that asks for Print is still Open**, and
two lines of the spec still mention Print inside lists of exports. Nothing is broken and no test is
wrong — but anyone reading Jira would think a feature is missing, and could raise a bug for it.

---

## 2 · Is this the only Print ticket? Yes.

I checked all 97 children. **SV-8614 is the only Print ticket in the epic.** Every other report's
export story is PDF/CSV only, by title:

| Report | Export story | Mentions Print? |
| --- | --- | --- |
| SBC | SV-8613 *Story 15 — Download as PDF* · **SV-8614 *Story 16 — Print the report*** | **YES — SV-8614 only** |
| SBR | SV-8631 *Story 14 — PDF and CSV exports* | No |
| PV | SV-8646 *Story 6 — Exports (CSV & PDF)* | No |
| TU | SV-8654 *Story 7 — Export to PDF and CSV* | No |
| WIP | SV-8665 *Story 9 — Export to PDF and CSV* | No |
| IV | SV-8677 *Story 10 — Export to PDF and CSV* | No |

So this is a **single stale ticket**, not a systemic problem.

---

## 3 · The evidence, five sources, in date order

### 3.1 The ticket — SV-8614, still **Open** (snapshot 2026-07-31)

Full description, verbatim:

> *"Print directly from the toolbar without first saving a PDF.*
> *__Spec:__ <https://shopview.atlassian.net/wiki/spaces/.../pages/577634305/SBC+Sales+By+Customer+Report>*
> *Part of the Reporting Suite epic (SV-8582)."*

Its changelog contains **no status transition at all** — it has been Open since creation. It was **not**
included in the 2026-07-27 OBSOLETE sweep that (wrongly) hit SV-8594–8599, which is precisely why it
was left behind: the sweep closed the wrong six tickets and missed the one that should have been closed.

### 3.2 The PO's ruling — Chris Ward, 2026-07-29

From `chris-update-2026-07-29/chris-message-2026-07-29.md`, verbatim:

> *"The Print option is removed."*

listed alongside the replacement menu:

> *"Menu items: Download Summary (PDF), Download Expanded View (PDF), Download Summary (CSV),
> Download Expanded View (CSV)"*

### 3.3 The live spec — SBC **v13**, read live 2026-08-03: Story 16 is retired

`spec-current-2026-07-31/Sales-By-Customer-Report-current.md` line 653, verbatim:

> *"### Story 16: (removed — Print retired)*
> *__\*__ The Print action that previously occupied this story has been removed from this report. Users
> produce a printable copy with the "Download Summary (PDF)" or "Download Expanded View (PDF)" item
> (Story 15) and print from their PDF viewer. The story number is retained as a placeholder so the
> later story numbers (17, 18, 20, 21) and every "See Story 20" design reference remain stable."*

Confirmed by the spec's own change log, 2026-07-29 row:

> *"Assets identified by VIN …; **removed Print**; split exports into Summary and Expanded (CSV + PDF,
> four menu items) …"*

**The spec is unambiguous: Print is retired, deliberately, with a documented replacement path.**

### 3.4 The build — **live-observed 2026-08-03, no Print anywhere**

From `viu-2026-08-03/LABEL-DIFF.md`, on the QA branch `sv8582` (build `v3.4.1-0ed4433`):

> *"**MATCH, exactly, including the order.** Also answers the standing Print question: **no Print
> control exists on the build**"*

and `viu-2026-08-03/OUTSIDE-IN.md`:

> *"**no Print control exists anywhere on the build** — the build agrees with the retirement, the
> ticket and SBC S18-R7/R10 do not"*

**⚠️ Rule 49 caveat, stated rather than buried:** that observation was taken on a branch engineering
has declared **NOT FINAL**, so it is **PROVISIONAL**. It is already queued for re-confirmation as
`viu-2026-08-03/RECHECK-QUEUE.md` row **B9**:

> *"Four labels verbatim and in order; **no Print anywhere on the build** … Re-check no Print reappears
> (SV-8614 is still Open) — PENDING"*

That queue row exists *because* SV-8614 is still Open: while the ticket lives, a developer could
legitimately pick it up and build Print, and our cases would then fail a build that did what its
ticket asked. **Closing the ticket is what makes the retirement safe.**

### 3.5 Our cases — already correct, and already cleaned up

| Case | C-id | State |
| --- | --- | --- |
| **SBC-EXP-01** | [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | **Asserts Print's ABSENCE** — the load-bearing case |
| **SBC-EXP-13** | *(deleted)* | The old Print case — **retired and deleted 2026-07-28**, reason recorded: *"video P25 Print removed from Sales By Customer; delete_case authorized 2026-07-28"* |

**SBC-EXP-01 = C30159**, expected result verbatim:

> *"2. The menu items read, in order: "Download Summary (PDF)", "Download Expanded View (PDF)",
> "Download Summary (CSV)", "Download Expanded View (CSV)" — and there is **NO "Print" item anywhere
> in the menu**."*

Its notes already carry the full provenance chain (Chris's message, the spec anchors, the version pin).
**This is exactly the right shape:** a retired feature is tested by asserting it is *gone*, not by
deleting all mention of it.

---

## 4 · The residual spec references — two lines Chris still owes

The live v13 spec retired Story 16 **but did not sweep every mention of Print.** Two requirements
still list it, in `spec-current-2026-07-31/Sales-By-Customer-Report-current.md`:

> **S18-R7** (line 716): *"Exports (CSV, PDF, **Print**) are generated on the server and contain exactly
> the customers matching the active filters …"*

> **S18-R10** (line 719): *"If an export (CSV, PDF, or **Print**) is triggered while the active filters
> match no customers … the export still downloads, containing the column headers and a totals row of
> zeros, with no data rows and no warning."*

**Neither changes any tested behaviour** — both are about export scoping, which we cover, and the
parenthetical list of formats is incidental. But they are the reason a careful reader can still find
"Print" in a current spec version and reasonably conclude the feature exists. **Low-risk, worth one
sweep.**

**A third stale artefact, and this one is OURS:** our older spec mirror
`build/report-suite/specs/sbc-sales-by-customer.md` still carries **the full original Story 16**
(S16-R1 through S16-R6) and an S14-R1 that names *"Print"* as a menu item. That file predates the
retirement. Anyone reading it would think Print is a live requirement. **Recommend marking that mirror
superseded** and pointing at `spec-current-2026-07-31/` — a cheap change that removes a real
foot-gun. **My folder only, so I have not touched it; flagged for authorisation.**

---

## 5 · Verdict and recommendation

| Source | Says about Print | Date | Authority (Rule 33) |
| --- | --- | --- | --- |
| **The running build** | **Absent** — no control in any of the six overflow menus | live-observed 2026-08-03 *(provisional, non-final branch)* | Reality |
| **Chris Ward's message** | *"The Print option is removed."* | 2026-07-29 | **PO ruling — highest** |
| **Live SBC spec v13, Story 16** | *"(removed — Print retired)"* | 2026-07-31 | PO-owned spec |
| **Our cases** | Assert its **absence** (C30159); old case deleted | 2026-07-28 → 2026-08-03 | Follows the PO |
| **Jira SV-8614** | *"Print directly from the toolbar"* — **still Open** | never transitioned | ⛔ **STALE** |
| **Spec S18-R7 / S18-R10** | *"(CSV, PDF, Print)"* | in the current version | ⛔ **STALE prose** |
| **Our `specs/` mirror** | Full Story 16 intact | pre-2026-07-29 | ⛔ **STALE (ours)** |

**Five sources agree Print is gone. Three stale artefacts say otherwise. Every one of the three is
paperwork, and none of them is a test case.**

### What should happen

| # | Action | Owner | Why |
| --- | --- | --- | --- |
| 1 | **Close SV-8614** as *not planned / obsolete*, citing Chris's 2026-07-29 removal and SBC v13 Story 16 | **dev / whoever owns the board** (parth fadadu ran both prior sweeps) | An Open ticket is a standing instruction to build the thing. This is the one action that actually removes risk |
| 2 | **Sweep "Print" from S18-R7 and S18-R10** | **Chris Ward** | Two words; stops a reader concluding Print is live |
| 3 | **Mark `specs/sbc-sales-by-customer.md` superseded** | **QA lead's authorisation** (our file) | Our own stale mirror still specifies Print in full |
| 4 | **Keep RECHECK-QUEUE row B9 open** until 1 is done | us | While the ticket lives, Print could reappear; C30159 would then fail a build that did what its ticket asked |

**Explicitly NOT recommended:** any change to SBC-EXP-01 = C30159, and any resurrection of the deleted
SBC-EXP-13. Our position is correct and sourced (Rule 39 — retain it).

**Already registered, not a new discovery.** This is tracked as item **1.4** of
`viu-2026-08-03/DELIBERATE-DECISIONS.md` — *"Print was retired, our tests assume it is gone, and the
product agrees — the paperwork does not."* — risk **LOW**, owners already named as **Chris Ward (spec)
/ dev (close SV-8614)**. This document adds the epic-side confirmation the earlier note could not
make: **SV-8614 is the only Print ticket in all 97 children, and it has never been transitioned.**
