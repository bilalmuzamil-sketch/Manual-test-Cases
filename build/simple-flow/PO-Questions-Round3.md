# Simple Mode — Round 3: A Few Quick Questions for You

Hi Milos! Thanks for your answers to the earlier rounds — they are all
actioned. While finishing our checks we found a few more spots where we
need your call on how it should work.

There are **no wrong answers**. For each item, pick an option (or write
your own) on the **"Your answer"** line. It should take just a few
minutes.

---

## 1. Should a work order have to be reviewed before it can be billed?

**What happens now**
When the "needs a review before it is finished" option is turned on, the person doing the review signs it off and the work order is finished right away. Today there is nothing that stops someone from creating the customer's bill (invoice) before that review sign-off has happened. (This is the same idea we asked about last time - it was not clear then, so here it is in plainer words.)

**The question**
When review is required, should the app stop anyone from billing the customer until the work order has actually been reviewed and signed off?

**Options**
- A) Yes - block billing until the review is done. No invoice can be created until someone has reviewed and signed off the work order.
- B) No - billing can happen any time; the review is just an extra step and does not hold up billing.

**Your answer:** ______________________________________________

---

## 2. For a brand-new company, should "require a review" start ON or OFF?

**What happens now**
There is a setting that makes every work order go through a review before it is finished. When a brand-new company (organization) starts using the app, we need to know what that setting should be set to out of the box, before anyone changes it.

**The question**
When a new company first starts using the app, should "require a review before finishing" already be turned ON, or start OFF so they can turn it on if they want it?

**Options**
- A) Start ON - new companies get review-required by default; they can turn it off if they don't want it.
- B) Start OFF - new companies get no review by default; they can turn it on if they want it.

**Your answer:** ______________________________________________

---

## 3. What should the "are you sure you want to close this?" pop-up say and do?

**What happens now**
When someone tries to close a window that they were filling in, a small pop-up can appear to check they meant to. The exact wording and the two buttons on that pop-up have not been designed yet, so we need to know how it should behave: which button just closes the little pop-up and keeps their work, and which one backs all the way out to the previous screen.

**The question**
How should the confirmation pop-up work - what should the two buttons say, and what should each one do?

**Options**
- A) One button = "stay here" (closes only the little pop-up and keeps everything they typed); the other = "leave" (backs out to the previous screen). Nothing they typed is ever thrown away just by using this pop-up.
- B) Something different - please describe the wording and what each button should do.

**Your answer:** ______________________________________________

---

## 4. Where should parts that are missing a supplier sit in the receiving list?

**What happens now**
On the screens where parts are received, parts that don't yet have a supplier (vendor) chosen are grouped together on their own, because someone has to pick a supplier for them before they can be received. On one receiving screen this "missing supplier" group already sits at the top; on the newer receiving screen it currently sits at the bottom. We want them to be consistent.

**The question**
Should the "missing supplier" group always sit at the TOP of the list (so people deal with it first) on every receiving screen?

**Options**
- A) Yes - always put the "missing supplier" group at the top on every receiving screen, so it's the first thing people see and act on.
- B) No - leave it at the bottom on the newer screen (only the older screen leads with it).

**Your answer:** ______________________________________________

---

## 5. Can a work order be finished with a $0.00 selling price on a part?

**What happens now**
When a part is added, it has a selling price (what the customer is charged for it). The newer design shows a work order being finished even when a part's selling price is still $0.00 - it shows a small note that says "$0.00 sell price, no action needed to continue" and lets the person finish. An earlier write-up said a selling price must be filled in before saving. We need to know which one is right.

**The question**
Should a work order be allowed to be finished when a part still has a $0.00 selling price, or must every part have a real selling price first?

**Options**
- A) Allow it - finishing with a $0.00 selling price is fine; just show the little note and let the person continue (as the newer design shows).
- B) Require a price - a part must have a real selling price before the work order can be finished (or before it can be saved).

**Your answer:** ______________________________________________

---

## 6. Should adding a part with no supplier need the "can see money figures" permission?

**What happens now**
Some staff have permission to see money figures (costs and selling prices) and some do not. A person can add a part that has no supplier yet. We used to assume this required the "can see money figures" permission because a selling price had to be typed in - but you've since told us a selling price is NOT required here, so that reason no longer holds. We need to know whether that permission should still be required to add a part with no supplier.

**The question**
Should adding a part that has no supplier yet still require the "can see money figures" permission, or should anyone who can edit the work order be able to add one?

**Options**
- A) Yes, still require it - only people who can see money figures can add a part with no supplier.
- B) No - anyone who can edit the work order can add a part with no supplier (money figures aren't involved anymore).

**Your answer:** ______________________________________________

---

## Thank you!

That's everything for this round. Your answers will help us finish this
feature the way you want it. Feel free to add any notes alongside your
choices.

---
---

## Internal — QA-only mapping (NOT for the PO)

This section links each plain-English question above to its gated
MILOS-ANSWER cases, TestRail cases, refs and what each answer resolves to.
**Do not include this section (or any IDs/codes in it) in the PO-facing
copy or the "Questions for PO" tab.**

### Q1

- **TestRail cases:**
  - SF-REV-08 — [C29393](https://shopview.testrail.io/index.php?/cases/view/29393)
  - SF-REV-11 — [C29396](https://shopview.testrail.io/index.php?/cases/view/29396)
  - SF-REV-10 — [C29395](https://shopview.testrail.io/index.php?/cases/view/29395)
- **Refs:** requirements.md Story 16 R5/R8 (distinct Reviewed state; invoicing blocked until reviewed). Re-ask of Round-1 Q8 ("not sure what this means?", milos-answers-mapping.md). SF-REV-10 = related review-dialog case.
- **Resolves to:** A -> SF-REV-08 expected keeps a distinct Reviewed holding state and SF-REV-11 expected keeps "invoicing blocked until reviewed" (both currently gated on this ruling). B -> rewrite both: sign-off completes directly and invoicing is NOT gated on review. NOTE: SF-REV-10 (review-note) already RESOLVED in Round-2 Q1 (note descoped, VIN-only) — listed for completeness, not re-asked.

### Q2

- **TestRail cases:**
  - SF-REV-15 — [C29400](https://shopview.testrail.io/index.php?/cases/view/29400)
- **Refs:** requirements.md Story 16 R Open (Require-Review default). Round-1 Q1 answer was "ON for all orgs"; this re-confirms the NEW-ORG out-of-box default specifically (and whether the live default matches).
- **Resolves to:** A -> SF-REV-15 expected = default ON for new orgs (if live default != ON that becomes a separate bug to verify). B -> SF-REV-15 expected = default OFF for new orgs.

### Q3

- **TestRail cases:**
  - SF-UX-04 — [C29404](https://shopview.testrail.io/index.php?/cases/view/29404)
- **Refs:** requirements.md Story 15 R4 (close-confirmation modal). Round-1 Q10 gave the Close/Cancel behavior but the design is still "to be added"; this confirms final wording + button behavior.
- **Resolves to:** A -> SF-UX-04 expected = Close closes only the modal and keeps entered data (stays on the WO); Cancel closes the modal and returns to the previous screen; nothing discarded. B -> capture Milos's alternate wording/behavior and rewrite SF-UX-04 accordingly.

### Q4

- **TestRail cases:**
  - SF-RCV-05 — [C29373](https://shopview.testrail.io/index.php?/cases/view/29373)
  - SF-RCV-07 — [C29375](https://shopview.testrail.io/index.php?/cases/view/29375)
- **Refs:** requirements.md Story 12 R1/R3 (vendor-missing group ordering). Round-1 Q11 recommended top/leads; RE-VIU BATCH 7 OBS-2: the Bulk Receive page renders the vendor-missing group LAST — should it also lead? Wording-only.
- **Resolves to:** A -> SF-RCV-05 expected #3 changed from "at the bottom" to "leads (top)" on every receive screen (incl. Bulk Receive); SF-RCV-07 already says "leads (top)" — confirmed, no change. B -> SF-RCV-05 stays "at the bottom" on the newer (Bulk Receive) screen; only the legacy Accept-Delivery screen leads.

### Q5

- **TestRail cases:**
  - SF-VPART-01 — [C29331](https://shopview.testrail.io/index.php?/cases/view/29331)
  - SF-VPART-02 — [C29332](https://shopview.testrail.io/index.php?/cases/view/29332)
  - SF-VAL-09 — [C29423](https://shopview.testrail.io/index.php?/cases/view/29423)
  - SF-QB-06 — [C29431](https://shopview.testrail.io/index.php?/cases/view/29431)
- **Refs:** PROJECT-STATE §5.F.2: design screenshot "$0.00 sell price, no action needed to continue" vs spec S5-R1 "sell mandatory at save". (Milos R2 Q4 already ruled sell NOT enforced on the vendorless part-request form; THIS is the remaining completion/receive-surface $0-sell tension.) Not one of the 15 gated MILOS cases — these are the genuinely-affected cases.
- **Resolves to:** A -> $0 sell allowed at completion; SF-VAL-09 / SF-QB-06 / SF-VPART-01/02 expecteds align to "$0 sell permitted, note shown" (consistent with R2 Q4). B -> sell mandatory before finish/save; add a completion-time sell-required gate to the affected expecteds.

### Q6

- **TestRail cases:**
  - SF-VPART-02 — [C29332](https://shopview.testrail.io/index.php?/cases/view/29332)
  - SF-PERM-09 — [C29413](https://shopview.testrail.io/index.php?/cases/view/29413)
- **Refs:** PROJECT-STATE §5.F.3 / milos-round2-mapping.md Q4 follow-up: the See-Financial-Data gate on vendorless part-add was premised on a mandatory sell price (now overturned by R2 Q4). Whether a permission gate still applies is open. Not one of the 15 gated MILOS cases — these are the affected cases.
- **Resolves to:** A -> keep the See-Financial-Data negative on SF-PERM-09 and SF-VPART-02 (permission still gates vendorless part-add). B -> drop the See-Financial-Data gate from both — any WO-edit role can add a vendorless part.

### Gated MILOS-ANSWER cases already resolved in Round 1/2 (or moved to a bug) — NOT re-asked

Together with the 7 cases under Q1–Q4 above (SF-REV-08, SF-REV-11,
SF-REV-10, SF-REV-15, SF-UX-04, SF-RCV-05, SF-RCV-07) these complete the
15 gated MILOS-ANSWER cases from the blockers tracker.

- SF-SET-03 — [C29277](https://shopview.testrail.io/index.php?/cases/view/29277) — *Story 1 R2 (Create POs toggle)* — RESOLVED Round-1 Q5 — Create-POs toggle descoped (POs always on). Not re-asked.
- SF-SET-08 — [C29282](https://shopview.testrail.io/index.php?/cases/view/29282) — *Story 1 / §4 first-use defaults* — MOVED TO A BUG — wrong first-use defaults (see SimpleFlow_Bug-Drafts, bug T5). Not a PO question.
- SF-SET-13 — [C29287](https://shopview.testrail.io/index.php?/cases/view/29287) — *Story 1 (Save dirty-state)* — RESOLVED Round-1 Q6 — Save-always-enabled accepted (nice-to-have). Not re-asked.
- SF-COMP-06 — [C29295](https://shopview.testrail.io/index.php?/cases/view/29295) — *Story 2 (Create POs OFF completion)* — RETIRED Round-1 Q5 — Create-POs-OFF scenario no longer exists. Not re-asked.
- SF-COMP-07 — [C29296](https://shopview.testrail.io/index.php?/cases/view/29296) — *Story 2 / §5 invariant 1 (inventory decrement)* — CONFIRMED Round-2 Q3 — in-stock parts decrement + Part History on completion. VIU-Pending on a live decrement drive; not a PO question.
- SF-TECH-08 — [C29330](https://shopview.testrail.io/index.php?/cases/view/29330) — *Story 17 vs S15-R2 (tech-story placement)* — RESOLVED Round-2 Q2 — Story 17 authoritative (inline + gate modal; complete one or many at once). Not re-asked.
- SF-QB-01 — [C29426](https://shopview.testrail.io/index.php?/cases/view/29426) — *§5 invariant 1 (inventory decrement / Part History)* — CONFIRMED Round-2 Q3 — same as SF-COMP-07. VIU-Pending on a live drive; not a PO question.
- SF-QB-02 — [C29427](https://shopview.testrail.io/index.php?/cases/view/29427) — *§4/§5 (Create POs OFF QuickBooks integrity)* — RETIRED Round-1 Q5 — Create-POs-OFF scenario no longer exists. Not re-asked.

### Dev-confirm item — FOR DEVELOPERS, NOT MILOS

- SF-QB-09 — (not yet in TestRail) — *requirements.md §5 (shared order/status logic must not affect Part Sales).* — FOR DEVELOPERS, NOT MILOS. Open dev-confirm: verify the Part Sales flow is unaffected by the shared order/status logic Simple Flow introduces. Product decision not required — a code/behavior confirmation from the dev team. (Not yet imported to TestRail — no Case ID; the sole Open-Question case.)

**Notes:** Round-3 questions raised after Milos Round-2 answers + RE-VIU
BATCH 7/8 (`PROJECT-STATE.md` §5.F). TestRail IDs sourced from
`testrail-id-map.csv` (standing rule 8). Rounds 1 & 2 were answered by
Milos — see `milos-answers-mapping.md` and `milos-round2-mapping.md`.
Bugs/defects stay OUT of the PO-facing content (standing rule 7) and are
delivered separately in `SimpleFlow_Bug-Drafts.xlsx`; these 6 items are
genuine product decisions.
