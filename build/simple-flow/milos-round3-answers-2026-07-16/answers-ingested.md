# Simple Flow — Milos Round-3 Answers — Ingested 2026-07-16

**Source:** Google Sheets doc `1u9OzztRZc4GRpBYwVOYbm84c6FP8t1OO` (gid 45705215),
exported 2026-07-16 as `milos-round3-answers-raw.xlsx` (full workbook, single tab
"Decisions we need from you") + `milos-round3-answers-raw.csv` (same tab).

**Which deliverable this answers:** the sheet is a verbatim copy of
`build/simple-flow/SimpleFlow_PO-Decisions-for-Milos_2026-07-14.md` / `.xlsx`
(the FINAL Round-3 form — the 2-question "spec disagrees with itself / spec
leaves it open" sheet that superseded the earlier 6-question
`PO-Questions-Round3.xlsx` draft), with Milos's decisions filled into the
"Your decision" column. (Only cosmetic wording differs: "brand-new shop" was
edited to "New Organization/New account" in the sheet.)

**Scope note:** the sheet contains ONLY these 2 questions — no answers on the
earlier awaiting-Milos set (SF-SET-08, SF-COMP-06, SF-REV-11, SF-UX-04,
SF-QB-02: all 5 were deliberately DROPPED from this sheet and routed to
dev/self-resolution per the internal section of the 2026-07-14 PO-Decisions
doc) and no bug-confirm rulings (`SimpleFlow_Bugs-for-Milos-Confirm.xlsx`
items remain unanswered).

**This doc is ingestion + mapping ONLY. No case JSON, deliverable, or TestRail
change has been made yet.**

---

## 1. Full answer set — VERBATIM

Tab: **"Decisions we need from you"** (columns: # / The situation / What the
written spec currently says / What the app actually does today / Why it needs
your decision / The options / Your decision).

### Q1 (row "1.0") — Where the "no supplier yet" (vendor-missing) group sits in the receive list

- **The situation:** "When someone receives a delivery of parts, some of the
  parts don't yet have a supplier assigned. The app gathers all of those \"no
  supplier yet\" parts into their own group. The question is simply where that
  group should sit in the list."
- **What the written spec currently says:** "The written spec gives TWO
  different answers in two different places. One place says the \"no supplier
  yet\" group should sit at the BOTTOM of the list. Another place says the very
  same group should LEAD - sit at the TOP. Both sentences are in the spec
  today, so the spec disagrees with itself."
- **What the app actually does today:** "On the newer bulk-receiving screen,
  the \"no supplier yet\" group currently appears at the TOP of the list (it
  leads)."
- **The options:** A) At the top (it leads) - this matches what the app does
  today. B) At the bottom of the list. C) Mixed in with all the other parts.
- **Milos's decision (VERBATIM, sic):**
  > **"On the bulk it will be on top on the Receive on the botton"**

### Q2 (row "2.0") — New-org starting default for "require a review before completion"

- **The situation:** "A New Organization/New account opens the app for the
  very first time, having changed no settings yet. The app has an on/off
  setting for \"a job must be reviewed before it can be finished and billed.\"
  The question is only about New Organization/New accounts - existing shops
  keep whatever they use today."
- **What the written spec currently says:** "The spec leaves this open on
  purpose. It says the starting value should be decided \"per type of shop,\"
  and it lists this exact point under its own \"Open Questions\" as still
  undecided - including specifically what a New Organization/New account
  should start with."
- **The options:** A) Start turned ON for every new shop. B) Start turned OFF
  for every new shop. C) Start ON for larger/established shops and OFF for
  small new ones.
- **Milos's decision (VERBATIM):**
  > **"Stays ON "**

No other comments, notes, or tabs exist in the sheet.

---

## 2. Interpretation of the answers

### Q1 — a per-surface SPLIT ruling (not a plain A/B/C)

Read as: *"On the Bulk [Receive page] it will be on top; on the Receive
[Accept Delivery screen], on the bottom."*

- **Bulk Receive page (newer bulk-receiving surface, Story 8):** vendor-missing
  group at the **TOP (leads)** — matches observed build behavior (VIU
  2026-07-14, `screenshots/grind-2026-07-14/OBSERVE-bulkreceive-groups.png`,
  seeded PO S-15845).
- **Receive / Accept Delivery screen (`/accept-delivery/{orderId}`, legacy
  single-delivery surface):** vendor-missing group at the **BOTTOM**.

This RESOLVES the spec self-contradiction by assigning each clause a surface:
S12-R3 ("group LEADS") → Bulk Receive; S12-R1 ("own group AT THE BOTTOM") →
the Receive/Accept-Delivery screen. The spec document itself still carries
both sentences unscoped — flag for a spec-text cleanup (both S12-R1 and
S12-R3 should gain their surface qualifier).

**Assumption flagged:** "the Receive" is read as the Accept-Delivery receive
screen (the only other receive surface in the build). If Milos meant something
else, confirm before rewording cases.

### Q2 — Option A

"Stays ON" = **A) Start turned ON for every new shop.** Existing orgs keep
today's behaviour (backfilled), per the question's own framing.

---

## 3. Per-answer case mapping

| # | Question | Milos's answer | Affected case(s) | TestRail | What changes | Needs live VIU before status flip? |
|---|----------|----------------|------------------|----------|--------------|------------------------------------|
| Q1 | Vendor-missing group placement on receive lists | Split: Bulk Receive = TOP; Receive (Accept Delivery) = BOTTOM | SF-RCV-05 | [C29373](https://shopview.testrail.io/index.php?/cases/view/29373) | **Wording change**: title + step 3 + expected #3 currently say the group "LEADS (appears at the top)" everywhere (that wording came from Round-1 Q11's blanket "top" recommendation — now superseded). Rewrite per-surface: TOP on the Bulk Receive page, BOTTOM on the Receive/Accept-Delivery screen. Then status flip VIU-observed-awaiting-Milos → VIU-Verified ONLY after both surfaces are live-observed. | **YES (partial).** Bulk-Receive leg already live-observed TOP (matches ruling). The Receive/Accept-Delivery-screen ordering has NEVER been live-observed → must seed a vendor-missing delivery and observe the group position on `/accept-delivery/{orderId}`. If it is NOT at the bottom there → build deviation → dev bug (do not fail silently). |
| Q1 | (same) | (same) | SF-RCV-07 | [C29375](https://shopview.testrail.io/index.php?/cases/view/29375) | **Wording change**: expected #2 "The vendor-missing group leads (appears first)" and the title's "leads with the vendor-missing group" need the same per-surface split (this case is scoped to Accept Delivery → its expected becomes BOTTOM on that surface; the observed TOP evidence in its notes is from the Bulk Receive surface, i.e. the other leg). Status flip only after live observation per surface. | **YES.** Same as SF-RCV-05: the Accept-Delivery-screen ordering (the leg this case asserts) is unobserved; only the Bulk-surface TOP was observed. Also re-verify the '+N' vendor indicator on the correct surface while there. |
| Q2 | New-org Require-Review default | A — "Stays ON" (ON for every new org; existing orgs backfilled/unchanged) | SF-REV-15 | [C29400](https://shopview.testrail.io/index.php?/cases/view/29400) | **Wording change**: expected #1 firms up from "shows its default state" to "defaults to ON on a brand-new org"; title's "agreed cohort rule" → "ON for new orgs" (no cohort split — Milos picked A, not C). Expected #2 (existing orgs backfilled, behaviour unchanged) stands. **Status does NOT become VIU-Verified from the answer**: the new-org default is not observable on the long-lived shared sv7301 org (its toggle value reflects prior test toggling). Proposed status: VIU-observed-awaiting-Milos → **Blocked-Env (needs a brand-new org to observe the ON default)**. | **YES (blocked).** Per Standing Rules 12/13 the ruling sets the EXPECTED value but the live new-org default has never been observed. Needs a freshly-provisioned org; if the live new-org default is then observed ≠ ON → separate dev bug (exactly as pre-planned in the PO-Decisions internal mapping). |

**Pure rulings vs needs-live-VIU:** ALL THREE affected cases need live
verification before any status flip — none may be marked VIU-Verified from
the answers alone. Q2 is a pure product ruling in content (it sets the
expected value), but its verification remains environment-blocked.

**Not affected / no change:** SF-SET-08 (dev bug T5 route), SF-COMP-06 &
SF-QB-02 (retired scenario, Round-1 Q5), SF-REV-11 (self-resolvable →
VIU-Verified per the 2026-07-14 re-validation — independent of this sheet),
SF-UX-04 (spec-defined, awaiting build) — none were asked in this sheet.

---

## 4. Contradiction / consistency flags (last-update-wins)

1. **Q1 vs Round-1 Q11 (CONTRADICTION — Round-3 wins):** Round-1 Q11's
   resolution was a blanket "top / leads" and SF-RCV-05 was rewritten
   bottom→top on that basis (`milos-answers-mapping.md` Q11). Round-3 now
   splits it: TOP only on the Bulk Receive page; BOTTOM on the
   Receive/Accept-Delivery screen. Per the Simple Flow last-update-wins rule,
   the Round-3 split ruling is authoritative and SF-RCV-05/07 must be
   re-reworded accordingly.
2. **Q1 vs spec text:** spec S12-R1 (bottom) vs S12-R3 (leads) both survive
   unscoped in the `_3` (V2.5) spec. Milos's ruling reconciles them by
   surface; the spec document still self-contradicts as written → flag for
   spec-text cleanup (add the surface qualifiers).
3. **Q2 vs Round-1 Q1 (CONSISTENT):** Round-1 Q1 said Require-Review "ON for
   all orgs"; Round-3 "Stays ON" confirms it for the new-org preset
   specifically. No conflict.

---

## 5. Proposed next actions (NOT yet executed — need user go-ahead + fresh TestRail authorization)

1. Live VIU: seed a vendor-missing delivery and observe the group ordering on
   the Receive/Accept-Delivery screen (Q1 bottom leg); re-capture the Bulk
   Receive TOP evidence in the same run.
2. Rewrite SF-RCV-05 / SF-RCV-07 (case JSON + TestRail `update_case`) to the
   per-surface wording; flip to VIU-Verified only if both surfaces observed as
   ruled; else log a dev deviation for the mismatching surface.
3. Rewrite SF-REV-15 expected to "default ON for new orgs"; set status
   Blocked-Env (brand-new org needed); pursue a fresh-org provision to close it.
4. Regenerate the Blockers Tracker / Results workbook / import after the
   edits; update PROJECT-STATE.md tallies (awaiting-Milos 8 → 5, or fewer as
   SF-REV-11's self-resolution is also applied).
5. Flag the S12-R1/S12-R3 surface-qualifier spec cleanup + confirm the
   "the Receive = Accept Delivery screen" reading with Milos/QA lead.
