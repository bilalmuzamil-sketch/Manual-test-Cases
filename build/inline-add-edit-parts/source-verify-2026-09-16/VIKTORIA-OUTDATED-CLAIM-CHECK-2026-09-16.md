# Check of Viktoria's "≈90% outdated" claim — Inline (6597) + WO Print (6617) — 2026-09-16

**Claim (Viktoria, manual QA tester):** almost 90% of the WO Print and Inline Add/Edit Parts cases are
outdated because the specs were updated since the cases were last checked. **Read-only check; no cases
changed (QA lead instruction).**

## Sources pulled LIVE 2026-09-16 (Rule 100/108)
| Suite | Spec | Spec last modified (live) | Cases last checked | Moved AFTER the check? |
|---|---|---|---|---|
| **Inline Add/Edit Parts (6597)** | Confluence **782761986** | **Sep 11, 2026** (body edit **2026-09-10**, Milos Vasic) | 113 read 9 Sep (v16), 6 read 10 Sep, 4 manually-added | **YES** |
| **Printer Friendly WO (6617)** | Confluence **519176194** | **Sep 07, 2026** (newest change-log entry Apr 2026) | 38 read 9 Sep, 6 read 10 Sep | **NO** (spec is older than the check) |

## What the Sep-10 Inline edit actually was (change-log verbatim)
"Terminology and status corrections aligned to built behaviour. Whole file updated to the real status
names and part sources: **Requested renamed to 'Auth to order' throughout**; **catalog replaced with
inventory where the rule is inventory-specific** (§2, §5 Bin, S2-R3, S2-R4, S2-R17, S2-E1, S3-R7, S3-R9,
S4-R19, Story 7). Work-order status lists corrected — Declined added to Story 1 prereqs, Declined and
Imported removed from S1-N1/S1-N2; S1-R9 narrowed to Complete; S1-R6 points at SV-9878; S2-R5 scoped to
inventory parts; Story 7 no-bin condition covers only SOP/Catalog/Found; S7-R2 'Not stocked' unreachable;
§8 concurrent-edit row out of scope." → a **terminology/status wording correction aligned to the build**,
not a behaviour redesign. "Catalog" is still a valid part source (NOT globally renamed).

## Measured impact (live scan of case text + cited source anchors)
**WO Print 6617 — 44 in-scope cases (all created_by=3):**
- Spec did not move after the check ⇒ **0 cases affected (0%).** Claim is INCORRECT for WO Print.

**Inline 6597 — 123 in-scope cases (created_by=3; 11 Vladimir foreign excluded):**
- Old status word "Requested" present in: **2 cases (2%)**; new word "Auth to order" in 0 (none updated yet).
- Cases whose cited source anchor is a requirement the Sep-10 edit touched: **33 cases (27%)** — of which
  **22 are the Bin Allocation / Story 7 group**, the rest one-per-requirement (S1-R6/R9, S1-N1/N2, S2-R3/
  R4/R5/R17/E1, S3-R7/R9, S4-R19).
- Any mention of "catalog/Catalog" (upper bound, over-counts — catalog is still valid): 35 cases (28%).
- **Defensible content-affected figure for Inline: ~25–30% (≈33 cases), not 90%.**

**Combined (167 cases across both suites): ≈33 affected ≈ 20%.**

## Verdict
- **The 90% figure is a large overstatement of *content* impact.** WO Print: 0%. Inline: ~25–30%.
- **The kernel of truth:** the Inline spec WAS edited (Sep 10) after every Inline case was last checked
  (Sep 9), so by check-date **none of the 123 Inline cases has been re-verified against the very latest
  spec** — that is a "re-verification due" flag, not "the content is wrong." Read that loose way, ~100%
  of *Inline* cases are "unverified against today's spec"; that is likely where "90%" came from, and it
  does not apply to WO Print at all.
- The Sep-10 change was "aligned to built behaviour", so a tester on the build WOULD see the ~2 status-name
  mismatches and the Story-7 bin wording — real but small.

**Next step (NOT done — awaiting QA lead):** a full re-verify of Inline against the Sep-10 spec edit,
re-stamped and re-worded (status name, inventory-specific catalog→inventory, the corrected status lists,
Story 7 bin rule). WO Print needs nothing.
