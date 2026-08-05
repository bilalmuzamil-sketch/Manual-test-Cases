# SPEC-DIFF — Chris Ward's three new requirement items, 2026-08-05

Standing Rule 43: **every added or changed requirement gets its OWN verdict row.** No narrative
summary. Both totals are reconciled at the end.

Method: every numbered requirement (`Sn-Rn`, `Sn-Rna`, `Sn-Nn`, `Sn-En`) extracted from the live
storage body of each version and compared **by anchor**, then the non-anchored prose blocks compared
separately. Tool: `tools/reqdiff.py`. Historical versions fetched from Confluence
(`?status=historical&version=N`), so the comparison is live-against-live, not against our mirror.

---

# 1 · WHAT CHRIS SAID, AND WHAT ACTUALLY LANDED IN THE PAGES

His three items, and the honest answer to the brief's question — **did the NUMBERED requirement
change, or only the prose?**

| His item | Report | Numbered requirement changed? | Verdict |
|---|---|---|---|
| **1.** "WIP filters apply to ALL open jobs, not just loaded rows (WIP S7-R1/R2 + Asset filter)" | WIP | **YES — S7-R1, S7-R2 changed in v8; S7-R4 changed in v9** | clean |
| **2.** "WO # is a link only with Work Order permission (WIP S4-R5)" | WIP | **YES — S4-R5 rewritten in v8, both halves explicit** | clean |
| **3.** "Suite-wide link-permission rule (same principle) (SBC + SBR)" | SBC | **YES — a new numbered requirement S9-R1a was ADDED in v15** | see §3 — it now contradicts S9-N2 |
| | SBR | **NO — ZERO numbered requirements changed. The rule landed in the §2 narrative ONLY** | see §4 — S12-R1 and S12-R3 still read unconditionally |

**So the brief's caution was justified, and on one of the three it fired.** For **Sales By
Representative** Chris described a rule he did not write into any numbered requirement — exactly the
pattern that left SBC S13-R4, SBR S21-R7, PV S3-R10, WIP S7-R13 and IV S7-R6 contradicting his earlier
Location decision. **He did it correctly for SBC** (added `S9-R1a`) and **correctly for WIP** (rewrote
`S4-R5`), which makes the SBR omission look like an oversight rather than a decision.

**Two of the six specifications are self-contradictory on this rule as a direct result** (§3, §4), and
under Rules 15 and 57 **this pass does not pick a winner on either.**

---

# 2 · THE DELTA COUNT, RECONCILED

| Page | Version step | Anchors ADDED | Anchors CHANGED | Anchors REMOVED | Non-anchored prose blocks changed |
|---|---|---|---|---|---|
| Sales By Customer | 14 → 15 | **1** (`S9-R1a`) | 0 | 0 | 1 (the new requirement's own bullet) + 1 change-log entry |
| Sales By Representative | 16 → 17 | 0 | 0 | 0 | **1** (§2 expanded rows) + 1 change-log entry |
| Parts Velocity | — | not touched in this wave | | | |
| Technician Utilization | — | not touched in this wave | | | |
| Work In Progress | 7 → 8 | 0 | **3** (`S4-R5`, `S7-R1`, `S7-R2`) | 0 | 1 change-log entry |
| Work In Progress | 8 → 9 | 0 | **1** (`S7-R4`) | 0 | 1 change-log entry (reworded) |
| Inventory Value | — | not touched in this wave | | | |

**TOTAL REQUIREMENT-LEVEL DELTAS = 6** — 1 added anchor + 4 changed anchors + 1 changed narrative
block that carries a requirement. Change-log entries are **not** requirements and are excluded from the
count; they are quoted as corroboration.

**VERDICT ROWS BELOW = 6.** The two totals reconcile.

Anchor totals as a cross-check: SBC 193 → **194**; SBR 182 → **182**; WIP 114 → **114** → **114**.

---

# 3 · VERDICT ROW 1 — SBC `S9-R1a` (ADDED in v15)

**The requirement, verbatim from live SBC v15:**

> **S9-R1a:** "The invoice number is rendered as a link only when the user has permission to open the
> target it links to (the work order or parts sale); a user without that permission sees the invoice
> number as plain text."

**Change log, verbatim:** *"Applied the suite-wide link-permission rule (2026-08-05): an invoice number
is rendered as a link only when the user has permission to open its target (work order or parts sale);
otherwise it is shown as plain text."*

### The positive half — already covered

**SBC-LINK-01 = [C30138](https://shopview.testrail.io/index.php?/cases/view/30138)**, expected results
verbatim:

> "1. Each invoice number on a detail row is a clickable link that opens in the SAME browser tab (no new
> tab). 2. A service invoice opens the associated work order's Finance tab. 3. A parts invoice opens the
> associated part sale's Part Requests tab."

Side by side with **S9-R1** *"Each invoice number on a detail row is a clickable link"*, **S9-R2a** and
**S9-R2b** — the case is that requirement almost verbatim. **COVERED, no change needed.**

### The negative half — NOT covered anywhere, and the page now contradicts itself

**⚠️ S9-N2 was NOT updated and it says the opposite. Verbatim from the same live v15 page:**

> **S9-N2:** "If the user lacks permission to open the destination invoice, the destination page shows
> the application's standard access-denied state; the user can press back to return to the report."

**S9-R1a says that user has no link to activate. S9-N2 describes that user activating a link and
landing on an access-denied page.** Both are in the same document, at the same version. **Only one can
describe the build.**

And we already have a case asserting **S9-N2** as settled behaviour —
**SBC-PERM-04 = [C30100](https://shopview.testrail.io/index.php?/cases/view/30100)**, expected verbatim:

> "1. The destination page shows the application's standard access-denied state. 2. Pressing back
> returns you to the Sales By Customer report."

**VERDICT: NEW CASE AUTHORED + EXISTING CASE FLAGGED.**
- **New: SBC-LINK-05** — asserts only the common ground (a user without permission cannot reach the
  invoice's contents from the report), states the open question in plain words, `AUTOMATION: HOLD`.
- **C30100 is NOT flipped** — flipping it to "there is no link" would pick a winner inside a
  self-contradictory document, which Rules 15 and 57 forbid. It gains a plain open-question note and
  its marker moves to `HOLD`.
- **Question to Chris:** which of S9-R1a and S9-N2 is right.

---

# 4 · VERDICT ROW 2 — SBR §2 expanded rows (CHANGED narrative, NO anchor)

**The new text, verbatim from live SBR v17 §2:**

> "…the invoice's date and number (a clickable link to the underlying work order or parts sale in the
> same tab, **rendered as a link only when the user has permission to open that target, otherwise plain
> text**); the customer name (**clickable and styled as plain text when the user has permission to open
> the customer, otherwise non-interactive plain text**)…"

**The text it replaced, verbatim from v16:**

> "…the invoice's date and number (a clickable link to the underlying work order or parts sale in the
> same tab); the customer name (also clickable, styled as plain text)…"

**Change log, verbatim:** *"Applied the suite-wide link-permission rule (2026-08-05): on expanded rows
the invoice/work-order link and the customer link are rendered as links only when the user has
permission to open the target; otherwise they are shown as plain text."*

### ⚠️ The numbered requirements were left as they were, and they read unconditionally

| Anchor | Verbatim, live v17 — **byte-unchanged from v16** |
|---|---|
| **S12-R1** | "Each invoice number on a detail row is a clickable link." |
| **S12-R3** | "Each customer name on a detail row is a clickable link that navigates the current tab to the customer's record." |

**So SBR states it both ways** — narrative conditional, numbered requirements unconditional. **There is
no anchor a negative case can cite**, only "§2 expanded rows".

### The positive half — already covered

**SBR-LINK-01 = [C30247](https://shopview.testrail.io/index.php?/cases/view/30247)**, expected verbatim:

> "1. Each invoice number is a clickable link. 2. Activating it navigates the CURRENT tab to the
> underlying invoice (work order or parts sale) — never a new tab. 3. The customer name is likewise a
> clickable link that navigates the current tab to the customer's record."

That is **S12-R1 + S12-R2 + S12-R3** almost verbatim. **COVERED.**

### A second problem this rule creates on SBR, and it is a testability problem

**S12-R5, verbatim:** *"Customer-name link: **inherits the cell's body text color (never theme-blue),
no underline at rest**…"* — so a **permitted** customer name is styled **exactly like plain text**. The
new narrative says an **unpermitted** one is *"non-interactive plain text"*.

**The two states are therefore visually identical.** A tester cannot tell them apart by looking; the
only observable difference is whether clicking navigates. Any case for the SBR customer link's negative
half must instruct the tester to **click**, not to look — and that is written into the new case.

**VERDICT: NEW CASE AUTHORED — SBR-LINK-06**, covering the invoice link and the customer link as
separate assertions, citing §2, stating the open question, `AUTOMATION: HOLD`.
**Question to Chris:** should S12-R1 and S12-R3 carry the same qualifier he added to SBC as S9-R1a.

---

# 5 · VERDICT ROW 3 — WIP `S4-R5` (CHANGED in v8)

| | Verbatim |
|---|---|
| **v7** | "WO # is shown as a link that opens the work order in the same browser tab; the user returns via the browser's back navigation." |
| **v9, live** | "WO # is shown as a link that opens the work order in the same browser tab (the user returns via the browser's back navigation) **only when the user has permission to access Work Orders. A user without Work Order permission sees the WO # as plain text, not a link**." |

**This one is clean** — a numbered requirement, both halves explicit, and nothing else in the WIP page
contradicts it (`S4-N*`, `S7-N1` and `S10-*` were all read; the only related anchor is **S10-R6** *"The
WO # link is keyboard-focusable with a visible focus indicator and opens the work order on
activation"*, which describes the link **when it is present** and does not assert that it always is).

### The positive half — already covered, and already scope-conditional

**WIP-COL-03 = [C30468](https://shopview.testrail.io/index.php?/cases/view/30468)**, expected verbatim:

> "1. **For a person who has permission to open work orders,** the WO # is shown as a link. 2. Clicking
> it opens that work order in the SAME browser tab (not a new tab). 3. The browser's back navigation
> returns you to the report."

The previous pass tightened item 1 to exactly this wording under v9 S4-R5. **COVERED, no change
needed.**

### The negative half — NOT covered anywhere

No case in the suite asserts that the WO # is plain text for a user without Work Order permission.

**VERDICT: NEW CASE AUTHORED — WIP-COL-09.** The requirement is unambiguous, so the case asserts it
directly. `AUTOMATION: HOLD` only because the sign-in it needs does not exist on this estate.

---

# 6 · VERDICT ROW 4 — WIP `S7-R1` (CHANGED in v8)

| | Verbatim |
|---|---|
| **v7** | "The toolbar has an Advisor filter, a multi-select listing the advisors present **in the loaded jobs**. Selecting one or more advisors narrows the visible jobs to those advisors, on screen only (no reload)." |
| **v9, live** | "The toolbar has an Advisor filter, a multi-select listing the advisors present **across all open jobs in the current scope (the report loads the complete set of open jobs in one request)**. Selecting one or more advisors narrows the visible jobs to those advisors, on screen only (no reload)." |

**Our case says the OLD thing, in the old words.** **WIP-FLT-01 =
[C30498](https://shopview.testrail.io/index.php?/cases/view/30498)**, expected item 1 verbatim:

> "1. The Advisor filter is a multi-select listing the advisors present **in the loaded jobs**."

**VERDICT: CASE EXTENDED — C30498**, item 1 rewritten to the new scope wording, plus a plain
instruction to pick an advisor whose jobs sit far down the list and confirm the result is complete.
**Live-verified this pass: the advisor option list is EXACTLY the union across all 392 rows of all four
tabs — 15 = 15, set-equal both directions** (`FINDINGS.md` §2).

---

# 7 · VERDICT ROW 5 — WIP `S7-R2` (CHANGED in v8)

| | Verbatim |
|---|---|
| **v7** | "…a searchable type-ahead multi-select listing the customers present **in the loaded jobs**…" |
| **v9, live** | "…a searchable type-ahead multi-select listing the customers present **across all open jobs in the current scope (the report loads the complete set of open jobs in one request)**…" |

**WIP-FLT-02 = [C30499](https://shopview.testrail.io/index.php?/cases/view/30499)**, expected item 2
verbatim:

> "2. Typing narrows the option list (type-ahead); the options are the customers present **in the loaded
> jobs**."

**VERDICT: CASE EXTENDED — C30499.** **Live-verified: the customer option list is EXACTLY the union
across all 392 rows — 215 = 215, set-equal both directions.**

---

# 8 · VERDICT ROW 6 — WIP `S7-R4` (CHANGED in v9)

| | Verbatim |
|---|---|
| **v8** | "…listing the assets present **in the loaded jobs**. Each option shows the unit number and the vehicle identification number, and the user's typed text matches against EITHER the unit number OR the vehicle identification number…" |
| **v9, live** | "…listing the assets present **across all open jobs in the current scope**. Each option shows the unit number and the vehicle identification number, and the user's typed text matches against EITHER the unit number OR the vehicle identification number…" |

**WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500)** does not assert the
scope at all — its expected results cover the label, the option contents and the matching:

> "2. Each option shows both the asset's Unit # and its VIN. 3. Text you type matches against either the
> Unit # or the VIN — a match on either one brings the asset up."

So the **new scope assertion has no coverage**, and the **existing matching assertion is now
verifiably broken on the build**.

**VERDICT: CASE EXTENDED — C30500**, with the scope assertion added and a known-issue note naming the
defect filed from this pass. **Live-verified: the asset option list holds exactly ONE entry per unit
number, so six assets that sit on open jobs are absent from it and their VINs match nothing** —
`FINDINGS.md` §3, ticket in `FILED.md`.

---

# 9 · WHAT THIS DIFF DELIBERATELY DID **NOT** DO

| Not done | Why |
|---|---|
| Author anything for **Technician Utilization**'s Total Hours link | TU was **not touched in this wave** and its spec is **silent** on permission for the Timesheet Activities target. Rule 58: hold and ask. It is a question to Chris, recorded in `DELIBERATE-DECISIONS.md` entry 3. |
| Author anything for **Parts Velocity** or **Inventory Value** | **Neither report has any navigable element.** Every requirement in both pages was read; PV's only "link"-shaped hits are the navigation entry and the export menu, IV's are none. Proven N/A in `LINK-SURFACE-MATRIX.md`, not assumed. |
| Re-open the **Location column** question | Out of scope for this pass and correctly held on 12 cases. **Verified untouched by this wave:** SBC S13-R4, SBC S4-R12, SBR S21-R7, SBR S20-R1/R2, PV S3-R10, WIP S4-R3, WIP S7-R13 and IV S7-R6 are all byte-unchanged across these version steps. |
| Flip **C30100** to the new rule | The document contradicts itself; picking a side is barred (Rules 15/57). |
