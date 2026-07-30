# Schedule — Branko's ANSWERS ingested (2026-07-31)

> **Source of record.** Verbatim ingest of the answered question sheet, mapped to our
> internal question / delta IDs. Nothing here is inferred — where Branko's answer is
> silent or ambiguous it is marked **NOT ANSWERED** or **AMBIGUOUS** and stays a
> question (Rule 32); we do not guess his intent.

## Provenance

| Field | Value |
|---|---|
| File received | `3220cbd1-POQuestionsBrankoSchedule20260727_1.xlsx` (user upload 2026-07-31) |
| Which of our sheets it is | **`PO-Questions-Branko-Schedule-2026-07-27.xlsx`** — the **2026-07-27** sheet, returned with the "Your answer" column filled in |
| Sheets in the file | **1** — `Questions for PO` (A1:F10). Read with `openpyxl`, all sheets, every non-blank row. |
| Questions on the sheet | **7** (rows 3–9), columns: `#`, `Topic`, `What happens now`, `The question`, `Options`, `Your answer` |
| Questions answered | **6 of 7** answered clearly · **1 of 7** (Q7) declined / redirected |
| Changes to the question text | **none** — the 7 questions are byte-identical in substance to our sent sheet; only `Your answer` was filled |
| Free-text notes elsewhere | **none** — no extra sheet, no extra rows, no comments column |
| PO | **Branko** (Branko Cicovic — Schedule PO; never mix: Schedule/Global Search/Filters = Branko, Fees & Discounts + Report Suite = Chris Ward, Simple Flow = Milos) |

**⚠️ Which sheet is which.** We have **two** outstanding Branko sheets for Schedule.
The one he answered is the OLDER of the two:

| Sheet | Questions | Status after this ingest |
|---|---|---|
| `PO-Questions-Branko-Schedule-2026-07-27.md/.xlsx` | Q1–Q7 | **ANSWERED** (6 answered + Q7 declined) — this file |
| `PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md/.xlsx` | Q1–Q7 there = **NQ-1..NQ-5** + re-asks of the 07-27 Q1 & Q2 | **STILL OUTSTANDING** — appears unsent/unanswered. **BUT** its Q6 and Q7 were re-asks of the 07-27 Q1/Q2, and those two are now answered here, so **only NQ-1..NQ-5 remain open on that sheet.** |

---

## The answers — verbatim

### Q1 → internal **D1** (events count toward capacity) · *also TechPlan-sheet Q6* · **HELD item**

- **Our question:** "When a technician has an event (like a 2-hour meeting), should those hours count against how busy that technician looks on the day, or not?"
- **Options offered:** A) Yes – event hours count · B) No – events do not count · C) Something else
- **Branko's verbatim answer:**

  > "A) §4.12 PRD is explicit: "Event time is included in the utilization total alongside shifts, so meetings and training consume capacity." A 2-hour meeting consumes 2 hours of capacity. Note the split in §4.11: events count toward capacity but are not conflict-checked. The design and the written plan already agree; this only needs confirming, not deciding."

- **Verdict: ANSWERED — option A**, unambiguous, and he cites the spec section verbatim.
- **Cross-check against the live spec (Phase 0):** his §4.12 quote is **word-for-word identical** to the live Confluence v23 body ("Event time is included in the utilization total alongside shifts, so meetings and training consume capacity even though they are not conflict-checked (see §4.11)."). Introduced in **Confluence v19, 2026-07-23** — which is why our v18-era baseline never had it. **The spec, the design, the engineering tech plan (its D5) and the PO now all agree.**
- **Consequence: the D1 HOLD LIFTS.** This **reverses** his earlier "currently No, will check". Rule 32 newest-wins → A stands.
- **Affected cases:** SCH-EVT-08 (C30615) · SCH-CAP-01 (C30030) · SCH-CAP-02 (C30031) · SCH-CAP-03 (C30032) · SCH-CAP-04 (C30033) · SCH-CONF-01 (C30023)

### Q2 → internal **D4** (shift-modal 'Reassign' button) · *also TechPlan-sheet Q7* · **HELD item**

- **Our question:** "For the first release, should the shift pop-up include a 'Reassign' button, or is dragging the shift the only way to move it to another technician?"
- **Options offered:** A) Keep the 'Reassign' button (plus dragging) · B) No button – dragging only
- **Branko's verbatim answer:**

  > "B - No button"

- **Verdict: ANSWERED — option B**, unambiguous.
- **Cross-check against the live spec (Phase 0):** **corroborated by the spec itself.** Confluence **v23 (2026-07-30, the newest edit to the page)** DELETED "and Reassign to another technician" from the §4.9 Actions list. §4.9 now reads only "Actions: Delete (series-aware, §7)". He evidently edited the PRD and answered the sheet in the same window.
- **Consequence: the D4 HOLD LIFTS.** Our cases were already written this way (SCH-MODAL-08 = "Delete only, no Reassign"; SCH-REAS-02 retired 2026-07-22 on the design's authority) — so this **confirms** them rather than changing them. The Jira story **SV-8695** text still lists a modal Reassign action and is now the stale artefact.
- **Affected cases:** SCH-MODAL-08 (C30015) · SCH-REAS-01 (C30052) · (SCH-REAS-02 — retired/deleted 2026-07-22, no C-id)

### Q3 → Week Export / printable week view (DESIGN-RECONCILIATION §5)

- **Our question:** "Is the printable weekly view part of the first release (so we should test it), or is it for later?"
- **Options offered:** A) Yes – in the first release · B) No – for later · C) Something else
- **Branko's verbatim answer:**

  > "No. There is nothing about this in the PRD, not in the future requirements."

- **Verdict: ANSWERED — effectively option B**, and stronger than B: not in V1 **and** not even in the future-considerations backlog. He does not use the letter "B", but "No." against a yes/no question, with the reason given, is unambiguous.
- **Cross-check against the live spec (Phase 0):** **independently corroborated.** A heading + full-text scan of Confluence v23 finds **no** export/print item — not in §6 Grid toolbar, not in §9 View options, not in §15 Future considerations. The engineering tech plan's §9 requirement table also has no export item.
- **Consequence: RETIRE-CANDIDATE** for the two Week Export cases authored 2026-07-27 as "scope pending Branko". **We will NOT delete anything without explicit user authorization** (Rule 6) — flagged and held.
- **Affected cases:** SCH-EXP-01 (C38853) · *(SCH-EXP-02 / C38854 was already merged away + deleted in the 2026-07-31 consolidation — only SCH-EXP-01 survives)*

### Q4 → internal **D5 / G2** (cell menu + 'New work order' shortcut)

- **Our question:** "For the first release, should clicking an empty spot on the schedule offer a 'New work order' shortcut, and what exactly should the menu items say?"
- **Options offered:** A) Yes – include 'New work order' (confirm exact wording) · B) No – deferred · C) Something else
- **Branko's verbatim answer:**

  > "C. there is no right click, only left click. when clicked it opens dropdown menu with two options (Create event, New work order) as mentioned in prd."

- **Verdict: ANSWERED — option C**, but note what C actually says: it **confirms the substance of A** (the shortcut IS in V1, and the two menu items are exactly "Create event" and "New work order") and **corrects our question's premise** (we said "right-click"; he says left-click only). He picked C because the question was mis-framed, not because he wants a third behaviour.
- **Cross-check against the live spec (Phase 0):** matches Confluence v22/v23 §4.10 ("Create via left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'..") and §7 ("Left-click on empty grid space opens a menu with: Create event, New work order.").
- **Consequence:** our cases were already corrected to left-click + those two items in the 2026-07-27 epic pass (SCH-REAS-03/04/05, SCH-EVT-01) and further repaired in the 2026-07-31 consolidation (SCH-PERM-02/04, SCH-EVT-03). So this is largely **NO-CHANGE / confirmation**, with the conflict-flag notes on SCH-REAS-06 now resolvable.
- **Affected cases:** SCH-EVT-01 (C30016) · SCH-REAS-03 (C30054) · SCH-REAS-06 (C38855) · SCH-PERM-02 (C30075) · SCH-PERM-04 (C30077) · SCH-EVT-03 (C30018)

### Q5 → default working day (DESIGN-RECONCILIATION §3 #10)

- **Our question:** "When no custom hours are set, what should the default working day be?"
- **Options offered:** A) 8 AM–5 PM (design pictures) · B) 7 AM–7 PM (written plan) · C) Something else
- **Branko's verbatim answer:**

  > "B) 7:00 AM to 7:00 PM. PRD §4.2 hierarchy: technician's custom hours → shop business hours → general default of 7 AM 7 PM. §4.8 repeats 7:00 AM as the auto-scroll fallback."

- **Verdict: ANSWERED — option B**, unambiguous, with the hierarchy restated.
- **Cross-check against the live spec (Phase 0):** §4.2 and §4.8 in Confluence v23 both still say 7 AM – 7 PM (unchanged since v8, "Change default hours to 7 AM - 7 PM"). The engineering tech plan also fixes the constant at 07:00–19:00. **Spec + plan + PO all agree; the design prototype's hardcoded 8–17 is the outlier.**
- **Consequence:** our cases were authored to 7 AM–7 PM, so this is **confirmation, not change**. Worth resolving any "prototype says 8–5" open-question notes.
- **Affected cases:** SCH-START-03 (C29971) · SCH-START-06 (C29974) · SCH-CONF-03 (C30025) · *(SCH-CONF-04 / C30026 was merged away + deleted in the 2026-07-31 consolidation)*

### Q6 → VIN in the hover tooltip (OQ-6(a); §4.13-vs-§9 inconsistency)

- **Our question:** "In the hover note, should the vehicle number ALWAYS be shown, or should it only appear when the 'show vehicle number' setting is turned on?"
- **Options offered:** A) Always show · B) Only when the toggle is on
- **Branko's verbatim answer:**

  > "A. Vin is always visible on hover regardless of the toggle"

- **Verdict: ANSWERED — option A**, unambiguous.
- **Consequence:** this is exactly how our cases already read — we resolved the §4.13-vs-§9 inconsistency in favour of §4.13 back on 2026-07-22 (tooltip always shows VIN; the "VIN Number" toggle gates the shift BLOCK only). **Confirmation, not change** — and it closes **OQ-6(a)**. The §9 prose remains loosely worded in the live v23 spec; that is a spec-text tidy-up for Branko, not a case change.
- **Affected cases:** SCH-TIP-01 (C30034) · SCH-VIEW-04 (C30045)

### Q7 → backend / API coverage (OQ-6(b)) — **NOT ANSWERED**

- **Our question:** "Do you want us to also test the behind-the-scenes saving and rules (and can you share a written description of them), or is testing what is on the screen enough for the first release?"
- **Options offered:** A) Yes – also test behind the scenes · B) No – screen-only is enough
- **Branko's verbatim answer:**

  > "I'm not sure if this question is for me Bilal."

- **Verdict: NOT ANSWERED — declined / redirected.** He neither picks an option nor states a preference. **We do NOT infer an answer** (Rule 32). He is right that it is not really a product question — it is a QA-scope question for engineering / the QA lead.
- **Consequence: STILL-AMBIGUOUS → re-route.** Move Q7 off the PO sheet and put it to engineering / the QA lead instead. Note that the practical premise has already shifted since the sheet was written: the engineering tech plan (ingested 2026-07-29) **is** the written backend description Q7 was asking for (17 endpoints + an error contract), and four lean API cases already exist in TestRail — SCH-API-01 (C38872), SCH-API-02 (C38873), SCH-API-03 (C38874), SCH-API-04 (C38875). So the answer is de-facto "A, and the description exists"; but that is **our** reading of the situation, **not Branko's ruling**, and it is recorded as such.
- **Affected cases:** cross-cutting — SCH-API-01..04 (C38872–C38875)

---

## Answer summary (one line each)

| Q# | Internal ID | Topic | Branko's answer | Ambiguity? |
|---|---|---|---|---|
| 1 | **D1** (HELD) | Do events consume technician capacity? | **A — yes, event hours count** (quotes §4.12; not conflict-checked per §4.11) | none |
| 2 | **D4** (HELD) | 'Reassign' button in the shift pop-up? | **B — no button; drag only** | none |
| 3 | Week Export | Printable week view in V1? | **No** — "nothing about this in the PRD, not in the future requirements" | none (he didn't type "B" but the answer is explicit) |
| 4 | D5 / G2 | 'New work order' shortcut + menu wording | **C** — left-click only (no right-click); menu = **Create event** + **New work order** | none — C corrects our premise, confirms the substance |
| 5 | Default hours | Default working day | **B — 7:00 AM to 7:00 PM** | none |
| 6 | OQ-6(a) | VIN in the hover note | **A — always visible on hover regardless of the toggle** | none |
| 7 | OQ-6(b) | Test the backend too? | **NOT ANSWERED** — "I'm not sure if this question is for me Bilal." | **YES — stays a question, re-route to engineering / QA lead** |

## What is now answered vs what is still outstanding

**NOW ANSWERED (this ingest):**
1. **D1** events → capacity = **A, yes**. HOLD LIFTS.
2. **D4** modal Reassign = **B, no button**. HOLD LIFTS.
3. Week Export = **not in V1, not even in the backlog**.
4. Cell menu = left-click, "Create event" + "New work order".
5. Default working day = 7 AM – 7 PM.
6. Tooltip VIN = always shown. **Closes OQ-6(a).**

**STILL OUTSTANDING:**
1. **Q7 / OQ-6(b)** — backend-testing scope. Declined by Branko; **re-route to engineering / the QA lead**, do not re-ask him.
2. **NQ-1 — shop closure days: does a multi-day job skip them?** *(TechPlan sheet Q1; SCH-EDGE-05 C30089, SCH-SPREAD-07 C29983, SCH-SPREAD-08 C29984, SCH-SPREAD-11 C38863, SCH-API-02 C38873)* — the live spec now sides with our cases ("not skipped in V1", still standing in v23), so this is lower-risk than it was, but the tech plan still contradicts the spec and only Branko can settle it.
3. **NQ-2 — does the conflict counter include double-bookings?** *(SCH-CONF-01 C30023, SCH-CONF-05 C30027)* — spec §4.11 lists "Double-booked" as a conflict type; the tech plan calls it a soft FE warning only. Still open.
4. **NQ-3 — where do the shop's working hours and closure days live?** *(SCH-HRS-02 C38847 and siblings)* — the live spec says **Edit Staff Member + Edit Location**; the tech plan says a separate **Schedule Settings** page in Administration. Spec favours our cases; still open.
5. **NQ-4 — split working day (two ranges)?** *(SCH-HRS-05 C38850, SCH-HRS-06 C38851)* — the live spec explicitly says "'Add hours' appends more to **support split shifts**"; the tech plan's data model allows one range per weekday. Spec favours our cases; still open.
6. **NQ-5 — may a technician change other technicians' shifts?** *(SCH-PERM-09 C30082 context; a new negative case only on answer A)* — spec §14 is **silent** on write-scoping (confirmed again on the live v23 body); the tech plan builds own-data scoping. Genuinely open.
7. **Live VIU (OQ-3)** — Schedule still has **no QA branch / environment**. Every case stays **VIU-Pending**; spec-, design- and PO-pinned ≠ VIU-Verified (Rule 12).

**Recommended next PO action:** send the **`PO-Questions-Branko-Schedule-TechPlan_2026-07-30`** sheet, trimmed to **NQ-1..NQ-5 only** (drop its Q6/Q7 — now answered here), and note in NQ-1/NQ-3/NQ-4 that the current PRD text already sides against the engineering plan, so those three are really "please confirm the PRD stands and the plan should change".
