# LINK-SURFACE MATRIX — every link and drill-down in all six reports × every surface

Standing Rule 40. Chris Ward did not give us three test cases; he gave us **one rule that applies
wherever a report offers a way out of itself**: *a link renders only when the user can open its target.*
So the first job is to **enumerate every link in the suite**, and the second is to give **every surface
its own verdict** — including the ones where the answer is "not applicable", **with the reason**, because
the July export gap happened precisely because a surface was never given a verdict at all.

Rule 45(e) is applied throughout: **no "already covered" verdict appears without BOTH TEXTS QUOTED.**

---

# 1 · THE COMPLETE LINK INVENTORY

Derived by extracting **every numbered requirement from all six live specifications** (194 + 182 + 51 +
100 + 114 + 94 = **735 anchors**) and searching each for `link`, `clickable`, `hyperlink`, `navigate`,
`opens`, `drill`, `expand`, `tab`, `href`, `target=`, then repeating the sweep over every non-anchored
prose block. Tool: `tools/reqdiff.py` + the sweep in `FINDINGS.md` §1.

**There are exactly SEVEN navigable elements in the suite, on FOUR of the six reports.**

| # | Report | Element | Target | Permission that governs opening the target | Anchor |
|---|---|---|---|---|---|
| **L1** | Sales By Customer | **Invoice #** on an invoice detail row — *service* invoice | the work order's **Finance** tab | Work Orders access | S9-R1, S9-R2a, **S9-R1a** |
| **L2** | Sales By Customer | **Invoice #** on an invoice detail row — *parts* invoice | the part sale's **Part Requests** tab | Part Sales access | S9-R1, S9-R2b, **S9-R1a** |
| **L3** | Sales By Representative | **Invoice #** on a detail row | the work order **or** the parts sale | Work Orders / Part Sales access | S12-R1, S12-R2, **§2 narrative** |
| **L4** | Sales By Representative | **Customer name** on a detail row | the customer's record | Customers access | S12-R3, **§2 narrative** |
| **L5** | Technician Utilization | **Total Hours** in a technician row | the **Timesheet Activities** report | **spec silent** | S6-R1, S6-R2 |
| **L6** | Technician Utilization | **Total Hours** in an expanded day row | Timesheet Activities for that one day | **spec silent** | S6-R5 |
| **L7** | Work In Progress | **WO #** | the work order | Work Orders access | **S4-R5**, S10-R6 |

### Two elements the specifications deliberately declare NOT links — recorded so nobody "fixes" them

| Element | Verbatim requirement | Covered by |
|---|---|---|
| SBC **customer name** on a summary row | **S9-R5:** "The customer name on each summary row is plain text, not a link." | SBC-LINK-03 = [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) item 1: *"The customer name on the summary row is plain text, not a link."* — **verbatim match, COVERED** |
| TU **Summary row** Total Hours | **S6-N1:** "The Summary row's Total Hours value is not a link." | TU-LINK group; asserted in the TU deep-link cases |

### Two reports have NO navigable element at all — proven, not assumed

| Report | Anchors read | Every `link`/`navigate`/`opens` hit | Verdict |
|---|---|---|---|
| **Parts Velocity** | 51 | S1-R1 (the *navigation entry*), S2-R3 (the date picker *opens*), S3-R10 (Location column text), S6-R1 (the export *menu opens*) | **N/A — no row-level link exists.** The link-permission rule has nothing to attach to. |
| **Inventory Value** | 94 | S1-R1 (the navigation entry), S1-R2 ("when the user *opens* the report") | **N/A — no row-level link exists.** |

**This is why Chris's own message scoped item 3 to "SBC + SBR" and item 2 to WIP: those, plus TU, are
the only reports with anywhere to go.** The N/A verdict for PV and IV is therefore not a gap in his
rule — but it had to be established by reading all 145 of their requirements, not by assuming.

---

# 2 · THE POSITIVE HALF versus THE NEGATIVE HALF — the actual finding

| # | POSITIVE — link present and works | NEGATIVE — renders as plain text, no dead link |
|---|---|---|
| L1 | **COVERED** — C30138 (quoted in `SPEC-DIFF.md` §3) | **NOT COVERED → authored this pass as SBC-LINK-05** |
| L2 | **COVERED** — C30138 item 3 | **NOT COVERED → authored this pass as SBC-LINK-05** |
| L3 | **COVERED** — C30247 items 1–2 | **NOT COVERED → authored this pass as SBR-LINK-06** |
| L4 | **COVERED** — C30247 item 3 | **NOT COVERED → authored this pass as SBR-LINK-06** |
| L5 | **COVERED** — C30428 / C30429 | **NOT COVERED and deliberately NOT authored** — the TU specification says nothing about permission for this target (Rule 58: hold and ask) |
| L6 | **COVERED** — C30433 | **NOT COVERED, same reason as L5** |
| L7 | **COVERED** — C30468 (already scope-conditional) | **NOT COVERED → authored this pass as WIP-COL-09** |

**So the previous worker's report was right, and it is confirmed here from the case text rather than
taken on trust: across all seven links and all four reports, NOTHING tested that a link becomes plain
text when the user cannot open its target.** Seven positive halves, zero negative halves.

**The one case that came closest was pointing the wrong way.**
**C30100** *"Opening an invoice you lack permission for shows access-denied; back works"* tests the
**old** behaviour — that the user **clicks through** and lands on an access-denied page. Under SBC v15
S9-R1a there is nothing for that user to click. That case is now the single most misleading case in the
suite on this subject, and `SPEC-DIFF.md` §3 explains why it is **flagged rather than flipped**.

---

# 3 · THE RULE × EVERY SURFACE (Rule 40's checklist, walked in full)

Each surface gets one verdict. **"N/A" always carries its reason.**

| Surface | Verdict | Evidence / reason |
|---|---|---|
| **On screen (the report table)** | **APPLIES — this is the rule's home surface.** Positive covered on all 7 links; negative now authored for L1–L4 and L7, held for L5–L6. | §2 above |
| **PDF export** | **N/A — a report PDF contains no hyperlink of any kind.** Not assumed: the live Sales By Customer summary PDF (**268,586 bytes**, downloaded this pass) contains **`/URI` × 0, `/Link` × 0, `/Annots` × 0, `http` × 0**. A rule about when something is a link cannot apply to a surface with no links. | `evidence/` + `FINDINGS.md` §5 |
| **CSV export** | **N/A — a CSV is plain text by format.** Evidenced rather than assumed: the live SBC *expanded* CSV carries an `"Invoice #"` column holding bare values (`S-16244`, `S-16245`) with no markup. The invoice number is **always** plain text in a CSV, for every user, so the permission rule makes no observable difference. | `FINDINGS.md` §5 |
| **Print view** | **N/A — no print view exists.** The word "print" appears **0 times in all six specifications** (735 anchors + all prose swept). SBC's Print option was **removed** in an earlier version. | this pass's sweep |
| **API payload** | **APPLIES, and the answer is that the API is NOT the gate.** Observed live: the SBC invoice drill-down returns `work_order_id`, `work_order_type`, `invoice_id`; the SBR drill-down returns those plus `customer_id`; WIP rows return `work_order_id` — **unconditionally**. So **the link/plain-text decision is made in the browser, not by the server.** Under **Rule 24** that is *not* a defect: an identifier sitting in a payload is not an action. It does mean the negative half **cannot** be verified from the API — only on screen. | `FINDINGS.md` §6 |
| **Mobile / responsive** | **APPLIES — and SBC states it explicitly.** **S21-R6:** *"The invoice number link opens the invoice in the same tab on touch, the same as on desktop."* Because the rule governs whether the element **is** a link, it governs the touch surface too. The new cases say the check holds on a phone as well; SBR, TU and WIP have no link-specific mobile requirement, so nothing is asserted for them beyond the desktop rule. | live spec text |
| **Column selector** | **N/A — no link column can be hidden or shown.** WIP **S4-R2** lists WO # among the columns visible on a first visit and **S4-R3** enumerates the toggleable ones — WO # is not among them. SBC **S13-R4** lists exactly nine toggleable columns and the invoice number (a detail-row value) is not one. So the selector cannot interact with the rule. | live spec text |
| **Scheduled / emailed delivery** | **N/A — the feature does not exist.** "schedule", "email" and "e-mail" appear **0 times in all six specifications**. | this pass's sweep |
| **Empty / error state** | **N/A for the rule itself** — with no rows there is no link to render. Adjacent behaviour is already covered: SBR **S12-N1/N2** (a target deleted or unavailable **at click time** → the standard not-found state) is C30251, and that is a **different scenario** from lacking permission, so it is **not** touched by this pass. | C30251 quoted in §4 |

---

# 4 · WHAT WAS DELIBERATELY LEFT ALONE, WITH THE TEXTS SIDE BY SIDE

| Case | Its expected result, verbatim | Why untouched |
|---|---|---|
| **C30251** *An unavailable link destination shows the standard not-found state* | "1. The tab navigates to the application's standard not-found/access-denied state. 2. Pressing back still returns to the report." | Its anchors are **S12-N1/N2**, verbatim *"If the target invoice is **deleted/reversed/unavailable at click time**…"* — a **deleted target**, not a permission gate. Chris changed nothing here. Editing it would import a rule its own source does not carry. |
| **C30140** *Customer name is plain text; the invoice link never turns visited-purple* | "1. The customer name on the summary row is plain text, not a link." | This is **S9-R5**, unchanged, and it is about the **summary row** — a different element from the detail-row invoice number that S9-R1a governs. |
| **C30250** *Invoice links use theme-primary; customer links use the body color* | "2. Customer-name link: inherits the cell's body text color (never theme-blue), no underline at rest…" | **S12-R4/R5**, unchanged. It *does* matter to the new rule — it is why a permitted and an unpermitted SBR customer name look identical — and that consequence is written into the **new** case instead of altering this one. |
| **C30428 / C30429 / C30433** (TU Total Hours links) | "The Total Hours link opens Timesheet Activities in the same tab" | TU's specification is **silent** on permission for that target. Rule 58: hold and ask, do not resolve it from the build. |
