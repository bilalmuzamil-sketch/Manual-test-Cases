# Simple Mode — Round 3: A Few Quick Questions for You

Thanks so much, Milos! **Just pick one option per row — there are no
wrong answers, we just need your preference.** Each item below tells a
quick little story of something happening in the shop, then asks what
you'd like the app to do.

---

## 1.

**Picture this**
A mechanic just finished fixing a customer's car, so the repair job is done. Right away, the shop can send the customer their bill - even though nobody has double-checked the mechanic's work yet.

**What happens today**
The bill can go out straight away, before anyone reviews or approves the finished job.

**What we need you to decide**
Should the system make someone review and approve the job first, before the customer's bill can be sent?

**Your options**
- A) The job must be reviewed and approved before the bill can go out.
- B) It's fine to send the bill without a review.
- C) Let each shop choose for itself.

**Your answer:** ______________________________________________

---

## 2.

**Picture this**
A brand-new shop opens the app for the very first time and starts writing up repair jobs, with nothing changed yet.

**What happens today**
There is a step for "someone must review a job before it's finished," and we need to decide how it should start out for a brand-new shop.

**What we need you to decide**
When a brand-new shop first starts, should that "must review before finishing" step start turned ON or start turned OFF?

**Your options**
- A) Start turned ON.
- B) Start turned OFF.

**Your answer:** ______________________________________________

---

## 3.

**Picture this**
Someone is part-way through a repair job that isn't finished, and they click to close it or cancel it.

**What happens today**
Nothing warns them - it just closes, even if the job isn't done and there is unsaved work.

**What we need you to decide**
What should happen when someone closes or cancels a repair job that isn't finished?

**Your options**
- A) Show a pop-up message asking them to confirm before leaving.
- B) Only warn them when there is unfinished or unsaved work.
- C) No pop-up needed - just let it close.

**Your answer:** ______________________________________________

---

## 4.

**Picture this**
A parts person is receiving a delivery of parts. A few of the parts don't have a supplier chosen yet, so they're bunched together in their own group.

**What happens today**
That "no supplier yet" group shows up at the bottom of the list on the newer receiving screen.

**What we need you to decide**
Where should the "no supplier yet" group appear in the receiving list?

**Your options**
- A) At the top of the list.
- B) At the bottom of the list.
- C) Mixed in with all the other parts.

**Your answer:** ______________________________________________

---

## 5.

**Picture this**
A mechanic is wrapping up a repair job, but one of the parts on it still shows a price of $0.

**What happens today**
The system lets them finish the job even with that $0 part price.

**What we need you to decide**
Should the system let them finish the job with a $0 part price, or stop them until a real price is entered?

**Your options**
- A) Let them finish even at $0.
- B) Stop them until a price is entered.

**Your answer:** ______________________________________________

---

## 6.

**Picture this**
Someone is adding a part to a repair job, but no supplier has been chosen for that part yet.

**What happens today**
Anyone who can work on the job is able to add a part like this.

**What we need you to decide**
Who should be allowed to add a part that has no supplier yet?

**Your options**
- A) Only people who are allowed to see prices and money figures.
- B) Anyone who can edit the repair job.

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
