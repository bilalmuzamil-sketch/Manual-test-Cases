# Chris Ward — Fees & Discounts V1_3 answers (INGESTED 2026-07-20)

**Source:** Google Sheet `1gW_Mdy-m9Gv75N0xbwjaWJwLlKf_kMWv`
(exported `chris-answers-raw.xlsx` + `.csv` in this folder; HTTP 200, publicly
readable — no auth wall).
**Matches:** `build/fees-discounts/PO-Questions-Chris-V1_3_2026-07-17.xlsx/.md`
(the V1_3 sheet produced 2026-07-20, sourced from spec-diff §H a/b). Single tab
**"Questions for PO"**; the reader-facing header + both questions are byte-identical
to what we sent — Chris filled the two "Your answer" boxes. **No newer/other content**
(no Round-2 re-answers, no extra tabs). PO = **Chris Ward** (F&D only).

Scope of this task: **INGESTION + CONSEQUENCE MAPPING ONLY** — no case edits, no
TestRail writes.

---

## 1. Verbatim answers

### Q1 — Where exactly should the tax-area note appear?
> **The question:** Exactly where should this tax-area note appear?
> **Options:** A) Only the Processing-Fee window. B) Every window that has a Taxable
> choice — including the ordinary window where fee templates are created and edited.
> C) Somewhere else — please describe.

**Chris's answer (verbatim):**
> **B) Every window that has a Taxable choice — both the Add/Edit Fee & Discount
> window (Work Order and Part Sale) and the admin window where fee templates are
> created and edited. It shows for every kind the window supports (Fee, Discount, and
> Processing Fee in the template window). There is no separate "Processing-Fee window"
> — Processing Fee is just a kind inside those same windows.**

### Q2 — Who would ever notice the note being hidden? (Is the admin-window-only observability expected?)
> **The question:** Is that expected?
> **Options:** A) Yes — the rule mainly matters in the admin window. B) No — there is
> another place where a person who cannot see money amounts would still see fees;
> please describe it.

**Chris's answer (verbatim):**
> **A) Yes — it mainly matters in the admin fee-template window. On a Work Order/Part
> Sale only users who can see money amounts can open the fee window at all, so hiding
> the note there has no visible effect. The admin template window opens on the separate
> "Manage Finance Settings" permission, so a user with that but without "See Financial
> Data" sees the Taxable toggle but not the note — the one place the rule is
> observable.**

---

## 2. Consequence map (per answer)

References read: `PROJECT-STATE.md`, `requirements.md` §16.1 / §17.1 (V1_3),
`spec-v3-2026-07-17/spec-diff-v3-2026-07-17.md` §H a/b, the case source
(`cases/group-A-wo-parts.json`, `cases/group-B-customer-admin-finance.json`),
`testrail-id-map.csv`.

Two cases carry §5-R15 today:
- **FD-WO-016 (C29441)** — WO Add/Edit fee-or-discount dialog note; **VIU-Deviation**
  (note absent in the build; VIU was as admin WITH See Financial Data on 2026-07-13).
- **FD-PROC-004 (C28522)** — Processing Fee dialog note + Taxable default;
  **Blocked-NotBuilt** (Story-8 builder UI absent on qb).

### Q1 = B → resolves spec-diff §H(a) (latest-wins) — note appears below EVERY Taxable control
Chris takes the **literal "Below every Taxable control"** reading (requirements.md
§16.1 opening line). He extends it beyond the two enumerated locations: the note must
appear in **every window with a Taxable choice**:
1. **WO Add/Edit Fee & Discount dialog** — already covered by **FD-WO-016**. Scope
   for this case **stands unchanged**; the Deviation call is unchanged.
2. **Part Sale Add/Edit Fee & Discount dialog** — **NOT currently covered by any
   §5-R15 case.** Chris named it explicitly. → candidate NEW case (Part Sale area) OR
   fold a §5-R15 assertion into an existing Part-Sale fee-dialog case.
3. **Admin fee-template create/edit dialog** (the ordinary Fee/Discount template
   dialog, S7-R12f) — **NOT currently covered.** FD-TMPL-003/004/006 test template
   create/edit but do NOT assert the §5-R15 note. → candidate NEW case (Template admin
   area, "option B" from the QA Internal Mapping tab) OR fold the note assertion into
   FD-TMPL-003/004/006.
   - Chris clarifies **there is no separate "Processing-Fee window"** — **Processing
     Fee is a *kind* (Type) inside the admin template window.** So FD-PROC-004's premise
     (a distinct Processing-Fee dialog) is really "the admin template window with
     Type = Processing Fee." FD-PROC-004 stays valid as the Processing-Fee-*kind*
     coverage; its scope stands. The note shows for **every kind** the template window
     supports (Fee, Discount, Processing Fee).

**Spec reconciliation (latest-wins, Chris 2026-07-20):** the §5-R15 body's two-location
enumeration (S2-R26 Add/Edit + S8-R11 Processing Fee) is **INCOMPLETE**. The correct
reading is the change-log's **"the template dialog"** *plus* the WO/Part-Sale Add/Edit
dialogs — i.e. "below every Taxable control" is literal. requirements.md §16.1 /
§17.1 and spec-diff §H(a) should be annotated as **clarified by Chris 2026-07-20**.

### Q2 = A → confirms spec-diff §H(b), adds the exact negative-test recipe
Chris confirms the SFD gate is only independently observable in the **admin
fee-template window**, AND supplies the mechanism we did not have before:
- The admin template window opens on the **"Manage Finance Settings"** permission (our
  cases call this **Settings → Finance**), which is **separate** from **"See Financial
  Data"**.
- Therefore the ONE observable negative is: **a user WITH Manage Finance Settings
  (Settings → Finance) but WITHOUT See Financial Data** opening the admin template
  dialog → sees the **Taxable toggle but NOT the note**.
- On the WO/Part-Sale side the gate is invisible (those dialogs already require See
  Financial Data to open — Stories 1/2/11), so hiding the note there is a no-op. The
  current folding of the SFD-negative into FD-WO-016 expected-4 (which points the
  no-note check to the admin dialog) is **correct**; it should be **refined** to name
  the exact role setup above (Manage Finance Settings + no See Financial Data) and to
  say "admin fee-template dialog" rather than "admin Processing Fee dialog".

No contradiction with Q1 or with prior answers/spec; Q2 refines the negative-test
observation point that Q1's expanded surface list depends on.

---

## 3. Proposed actions — classified

### (a) Pure bookkeeping (done in this task; no authorization needed)
- Save the raw export + this ingested doc.
- Annotate requirements.md §16.1/§17.1 and spec-diff §H a/b as **answered by Chris
  2026-07-20 (latest-wins)**: note appears below **every** Taxable control (WO Add/Edit
  + Part Sale Add/Edit + admin template dialog, every kind); SFD-gate observable only
  at the admin template dialog via a **Manage Finance Settings without See Financial
  Data** user. *(This task annotates the ingested-answers doc + state docs; the
  requirements.md/spec-diff prose edits are left for the authorized apply pass so no
  spec text is silently changed mid-flight — flagged below.)*
- Update PROJECT-STATE §0 (Chris V1_3 questions **ANSWERED** — remove "SEND" item;
  add the apply/VIU follow-ups) and CLAUDE.md F&D STATUS.

### (b) Needs a TestRail `update_case` / `add_case` pass (fresh one-day authorization)
None executed here (task = ingestion only). When authorized:
- **FD-WO-016 (C29441)** — *notes/expected refinement only* (cosmetic): point the
  SFD-negative to the **admin fee-template dialog** and name the **Manage Finance
  Settings + no See Financial Data** user. **No status change** (Deviation stands).
- **FD-PROC-004 (C28522)** — *notes refinement only*: record Chris's "Processing Fee
  is a kind inside the template window, not a separate window" clarification + the
  Manage-Finance-Settings negative recipe. **No status change** (Blocked-NotBuilt).
- **NEW coverage (the substantive Q1=B consequence):**
  - **Admin Fee/Discount template dialog §5-R15 note** (S7-R12f) — new case in the
    Template-admin area (e.g. FD-TMPL-018) OR fold into FD-TMPL-003/004/006. This is
    the concrete "option B" delta from the QA Internal Mapping tab.
  - **Part Sale Add/Edit dialog §5-R15 note** — new case (Part Sale area) OR fold into
    an existing Part-Sale fee-dialog case.
  - Per Rules 12/13 any NEW case opens as **Pending / Blocked** (surface not yet
    observed) — not Verified/Deviation — until the live VIU below is done.

### (c) Needs LIVE VIU before any status call (Rules 12/13) — NOT yet observed
- The **admin Fee/Discount template dialog** note (present/absent below its Taxable
  control) — never observed there; the 2026-07-13 VIU only covered the whole-WO dialog.
- The **SFD-negative** at the admin template dialog with a **Manage Finance Settings
  (Settings → Finance) but no See Financial Data** user — seed such a user/role on qb,
  open the dialog, observe Taxable toggle present + note absent-for-no-SFD / present-for-SFD.
- The **Part Sale Add/Edit dialog** note.
- (Processing-Fee-kind note stays Blocked-NotBuilt until the Story-8 builder ships.)

---

## 4. Contradictions / latest-wins summary
- **spec-diff §H(a) RESOLVED:** the plain admin template dialog's Taxable control
  (S7-R12f) **does** get the note. Chris's Q1=B overrides the §5-R15 body's incomplete
  two-location enumeration — "Below every Taxable control" is literal (also incl. Part
  Sale). No conflict with any earlier Chris answer.
- **spec-diff §H(b) CONFIRMED + extended:** admin template dialog is the sole
  observable gate surface; the exact negative user = **Manage Finance Settings without
  See Financial Data**. No conflict.
- No contradiction with the V1_3 spec, Round-1, or Round-2 answers.

---

## 5. Status after ingestion
- Chris V1_3 questions (Q1/Q2): **ANSWERED** — the "SEND the V1_3 sheet" item is now
  CLOSED (superseded by "answered").
- Tally **UNCHANGED 135/15/12/20/1 = 183** (no case edits in this task).
- **Open follow-ups created by these answers:** (1) authorized apply pass to add the
  two new surfaces (admin template dialog + Part Sale dialog) and refine FD-WO-016 /
  FD-PROC-004 notes; (2) live VIU of the admin-template-dialog note + the
  Manage-Finance-Settings-no-SFD negative + the Part Sale dialog note; (3) apply the
  §H a/b resolution into requirements.md/spec-diff prose during that pass.
