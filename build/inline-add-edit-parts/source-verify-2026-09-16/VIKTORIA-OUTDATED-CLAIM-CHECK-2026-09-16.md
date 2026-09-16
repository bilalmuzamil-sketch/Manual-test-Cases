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

---
## EXECUTION — full source verification applied 2026-09-16 (QA lead go-ahead)
Verified all 123 in-scope Inline cases against spec 782761986 (2026-09-10 revision). Vladimir's 11 foreign
cases untouched (Rule 38).

**CONTENT-CHANGED — 5 cases (4% of 123):**
- **C44993, C44994** — the 2026-09-10 revision removed **Declined and Imported** from S1-N1/S1-N2 (Imported
  is an invoice status; Declined is now a status where the feature applies). Expected corrected to
  hidden-on-Complete/Invoiced/Paid, shown-on-Declined. **These flipped from EXPECT-FAIL (story defect
  SV-9917) to normal PASS** — SV-9917's premise (control hidden on Declined) is no longer the documented
  expectation and should be reviewed for closure (flagged, not filed — Jira hold).
- **C45013, C45054** — the free-typed part status is shown on the build as **"Auth to order"** (Requested is
  the concept name); Expected aligned to the build label.
- **C45222** — S7-R2's "Not stocked" result-card state is now flagged **unreachable** (an inventory part
  always has a bin); Expected updated to say so.

**RE-STAMPED ONLY (content current, read-date → 16 Sep) — 114 cases:** 108 writable spec-derived + 6
Automated (C45005, C45026, C45223, C45224, C45227, C45237, re-stamped on QA-lead go-ahead — see FOR-VLAD-2026-09-16.md).

**LEFT UNTOUCHED — 4 manually-added cases** (product-knowledge source, unaffected): C45251, C45252, C45253, C45254.

All edited + sampled cases verified `fr-view` / marker last. **The exact rate the spec change REQUIRED a
change: 5 / 123 = 4%** — not 90%. WO Print (44 cases): 0% (spec unchanged since the check). Run R418 holds
the suite; membership unchanged.
