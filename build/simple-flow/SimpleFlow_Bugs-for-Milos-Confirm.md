# Simple Mode — A Few Things for You to Confirm

Thanks so much, Milos! Below are a few things we spotted. **For each one,
just tell us if it's a problem we should fix, or if it's actually fine and
how it should work — pick one option per row.** There are no wrong answers,
we just need your call.

---

## 1.

**Picture this**
A mechanic finishes a repair job. Right now, that same mechanic is also allowed to be the person who double-checks and approves their own work - nobody else has to look it over. Picture one person doing the repair AND signing off that it's all correct.

**What happens today**
The person who did the work can approve their own work. No second person is needed to review it.

**Our question for you**
Is this a problem we should fix, or is this how it should work?

**Your options**
- A) This is a problem - please fix it.
- B) This is fine - it's how it should work.
- C) Let each shop choose whether a different person must approve.

**Your answer:** ______________________________________________

---

## 2.

**Picture this**
The screen correctly hides the "finish" and "approve" buttons from people who aren't supposed to have them. But the system behind the screen doesn't fully block those actions - so a very technical person could still find a way around the screen to do them.

**What happens today**
The buttons are hidden from the right people on screen, but the block isn't fully enforced behind the scenes.

**Our question for you**
Is this a problem we should fix, or is this how it should work?

**Your options**
- A) This is a problem - please fix it.
- B) This is fine - it's how it should work.
- C) Fine for now, but fix it later.

**Your answer:** ______________________________________________

---

## 3.

**Picture this**
When finishing a repair job, the screen asks for details like the mileage, the vehicle's ID number, or the engine hours. But the system behind the screen doesn't truly require them - so a very technical person could skip those details by going around the screen.

**What happens today**
The screen asks for those details, but they aren't truly required behind the scenes and could be skipped.

**Our question for you**
Is this a problem we should fix, or is this how it should work?

**Your options**
- A) This is a problem - please fix it.
- B) This is fine - it's how it should work.
- C) Fine for now, but fix it later.

**Your answer:** ______________________________________________

---

## 4.

**Picture this**
There are two ways to receive parts that have arrived from a supplier. The newer way works fine. The older way shows an error message when a parts person tries to use it for parts that came from a repair job.

**What happens today**
The newer receiving screen works. The older receiving screen shows an error for these parts, so people should use the newer one.

**Our question for you**
Is this a problem we should fix, or is this how it should work?

**Your options**
- A) This is a problem - please fix it.
- B) This is fine - it's how it should work.
- C) Fine to just retire the old screen and keep the new one.

**Your answer:** ______________________________________________

---

## 5.

**Picture this**
When a brand-new shop opens the app for the very first time, some of the starting switches are set the wrong way by default - for example, jobs auto-approve on their own, and a supplier's bill isn't required when it should be.

**What happens today**
A brand-new shop starts with those switches set the opposite way from what was agreed (auto-approve on, supplier's bill not required).

**Our question for you**
Is this a problem we should fix, or is this how it should work?

**Your options**
- A) This is a problem - please fix it.
- B) This is fine - it's how it should work.

**Your answer:** ______________________________________________

---

## Thank you!

That's everything. Your answers tell us which of these to fix and which are
fine as they are. Feel free to add any notes next to your choices.

---
---

## Internal — QA-only mapping (NOT for the PO / Milos)

Links each plain-English item above to its internal bug code + Jira ticket,
affected cases (with TestRail links), refs, current status and what each
answer triggers. **Do not include this section (or any IDs/codes in it) in
the PO-facing copy or the "For Milos to confirm" tab.**

### Item 1 — BUG-5 (TICKET 1, High)

- **Affected cases:**
  - SF-PERM-08 — [C29412](https://shopview.testrail.io/index.php?/cases/view/29412)
  - SF-PERM-04 — [C29408](https://shopview.testrail.io/index.php?/cases/view/29408)
  - SF-PERM-07 — [C29411](https://shopview.testrail.io/index.php?/cases/view/29411)
  - SF-REV-09 — [C29394](https://shopview.testrail.io/index.php?/cases/view/29394)
- **Refs:** SV-8183 reviewer!=completer rule (the one net-new Simple-Flow permission). requirements.md Story 16.
- **Current status:** NOT filed (Atlassian MCP unavailable at run time). Reproduced live: admin sent WO S2-15752 to review then same admin confirmed it. Evidence viu-evidence/REV-admin-completer-markreviewed.png.
- **What each answer triggers:** A (problem) -> file TICKET 1 (High); SF-PERM-08 stays Failed/Deviation and the reviewer!=completer negative is enforced. B (fine) -> mark SF-PERM-08 + related expected/pass (self-review allowed by design); drop the ticket. C -> make it a per-shop setting (new requirement + spec/story update).

### Item 2 — BUG-6 + BUG-7 (TICKET 2, Medium)

- **Affected cases:**
  - SF-PERM-06 — [C29410](https://shopview.testrail.io/index.php?/cases/view/29410)
  - SF-PERM-02 — [C29406](https://shopview.testrail.io/index.php?/cases/view/29406)
  - SF-PERM-07 — [C29411](https://shopview.testrail.io/index.php?/cases/view/29411)
  - SF-REV-09 — [C29394](https://shopview.testrail.io/index.php?/cases/view/29394)
- **Refs:** SV-8183 backend-enforcement claim vs SV-7864 atom-collapse. Milos Round-2 Q5 already ruled UI gating = v1 pass; this tracks the backend gap.
- **Current status:** NOT filed. UI gating passes; backend allows the action (201) via API for a role without the permission (e.g. Technician). Recorded 'UI pass / API fail'.
- **What each answer triggers:** A (problem) -> file TICKET 2 (Medium) to add backend enforcement; keep cases 'UI pass / API fail'. B (fine) -> accept UI-only gating as intended (atom-collapse per SV-7864); mark cases pass on UI, drop ticket. C -> file but defer (backlog).

### Item 3 — BUG-8 (TICKET 3, Medium)

- **Affected cases:**
  - SF-VAL-01 — [C29415](https://shopview.testrail.io/index.php?/cases/view/29415)
  - SF-VAL-02 — [C29416](https://shopview.testrail.io/index.php?/cases/view/29416)
  - SF-VAL-03 — [C29417](https://shopview.testrail.io/index.php?/cases/view/29417)
  - SF-COMP-05 — [C29294](https://shopview.testrail.io/index.php?/cases/view/29294)
  - SF-COMP-16 — [C29305](https://shopview.testrail.io/index.php?/cases/view/29305)
  - SF-REV-03 — [C29388](https://shopview.testrail.io/index.php?/cases/view/29388)
- **Refs:** SV-8183 backend-enforcement claim; requirements.md §4 required-vehicle-field gates (mileage / VIN / engine hours). Related SV-7864 atom-collapse.
- **Current status:** NOT filed. Wizard blocks completion until fields are filled (viu-evidence/VIU2-02-mileage-gate.png) but backend completes without them (simple-complete returned 201 with mileage empty).
- **What each answer triggers:** A (problem) -> file TICKET 3 (Medium) to enforce required fields backend-side; cases stay Deviation until fixed. B (fine) -> UI-only enforcement accepted; mark SF-VAL-01/02/03 + related expected/pass on UI. C -> file but defer.

### Item 4 — BUG-11 (TICKET 4, Low)

- **Affected cases:**
  - SF-COMP-13 — [C29302](https://shopview.testrail.io/index.php?/cases/view/29302)
  - SF-COMP-19 — [C29308](https://shopview.testrail.io/index.php?/cases/view/29308)
  - SF-VAL-05 — [C29419](https://shopview.testrail.io/index.php?/cases/view/29419)
  - SF-VAL-06 — [C29420](https://shopview.testrail.io/index.php?/cases/view/29420)
  - SF-PNFIX-02 — [C29364](https://shopview.testrail.io/index.php?/cases/view/29364)
  - SF-PNFIX-03 — [C29365](https://shopview.testrail.io/index.php?/cases/view/29365)
  - SF-PNFIX-04 — [C29366](https://shopview.testrail.io/index.php?/cases/view/29366)
  - SF-PNFIX-05 — [C29367](https://shopview.testrail.io/index.php?/cases/view/29367)
  - SF-PNFIX-06 — [C29368](https://shopview.testrail.io/index.php?/cases/view/29368)
  - SF-RCV-08 — [C29376](https://shopview.testrail.io/index.php?/cases/view/29376)
  - SF-VPART-07 — [C29337](https://shopview.testrail.io/index.php?/cases/view/29337)
  - SF-REV-04 — [C29389](https://shopview.testrail.io/index.php?/cases/view/29389)
  - SF-REV-14 — [C29399](https://shopview.testrail.io/index.php?/cases/view/29399)
  - SF-CORE-03 — [C29315](https://shopview.testrail.io/index.php?/cases/view/29315)
  - SF-CORE-04 — [C29316](https://shopview.testrail.io/index.php?/cases/view/29316)
  - SF-CORE-05 — [C29317](https://shopview.testrail.io/index.php?/cases/view/29317)
  - SF-CORE-07 — [C29319](https://shopview.testrail.io/index.php?/cases/view/29319)
- **Refs:** SV-7301 Story 10 (receive creates/links part) / Story 8 (Bulk Receive = the working path). Downgraded to Low 2026-07-09: the 500 is confined to the LEGACY single-PO Accept-Delivery path; Bulk Receive works (200).
- **Current status:** NOT filed. Legacy Accept-Delivery receive of a WO-PO returns HTTP 500; new Bulk Receive receives the same WO PO fine. Evidence R7-01/R7-04/R7-06 in viu-evidence/. Affected cases now largely testable via Bulk Receive.
- **What each answer triggers:** A (problem) -> file TICKET 4 (Low) to fix the legacy Accept-Delivery 500. B (fine) -> accept legacy path as-is (use Bulk Receive); mark cases pass via Bulk Receive path. C -> retire the legacy single-PO Accept-Delivery surface (product/scope decision) and standardize on Bulk Receive.

### Item 5 — GAP-B (TICKET 5, Medium)

- **Affected cases:**
  - SF-SET-08 — [C29282](https://shopview.testrail.io/index.php?/cases/view/29282)
- **Refs:** SV-7301 §4 / Story 1 first-use defaults (confirmed Milos Q3: Auto-approve Lines OFF, Create Purchase Orders ON, Vendor Invoice REQUIRED).
- **Current status:** NOT filed. First-use build ships Auto-approve Lines ON and Vendor Invoice Optional (autoApproveLines:true, requireVendorInvoiceNumber:false) - opposite of the confirmed defaults.
- **What each answer triggers:** A (problem) -> file TICKET 5 (Medium) to correct the first-use defaults; SF-SET-08 stays Deviation until fixed. B (fine) -> Milos re-confirms the shipped defaults are acceptable; update SF-SET-08 expected to match live and pass.

**Notes:** The 5 items are the reconciled Simple Flow bug drafts
(`jira-bug-drafts.md`, 2026-07-09 post-Milos-Round-2). This is the
PO-DECISION view so Milos can confirm expected-vs-bug; it does NOT replace
the QA/dev-facing `SimpleFlow_Bug-Drafts.xlsx`. TestRail IDs sourced from
`testrail-id-map.csv` (standing rule 8). Bugs stay OUT of the PO-facing tab
(standing rule 7). None of the 5 are filed in Jira yet (Atlassian MCP was
unavailable at run time).
