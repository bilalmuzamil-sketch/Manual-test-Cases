# READY TO FILE — ONE Story Defect: Declined work orders are still editable

**STATUS: HELD. NOT FILED.** The QA lead's instruction, 2026-09-10: *"No story defects until I ask you
to file them but you have to keep them ready to be filed when I ask you."* This file is that ticket,
complete, so filing it is a single action when he says go.

His second instruction, same message: *"One story defect but do mention that against which source this
story defect was created and then put the story defect link in the test run case and mention to track
it and set the status of the test case accordingly, make sure that it does not bite me."*

---

## The ticket

| Field | Value |
|---|---|
| `issuetype` | **Story Defect** |
| `parent` | **SV-9316** — Story 1, *Add Part Button on Work Order Lines* (the owning story; an Epic parent is rejected) |
| `priority` | **Medium** |
| link | **`relates to` SV-9316** |
| Product Area | not set — the field does not exist on this issue type |

**Summary:** Declined work orders are not treated as locked — Add Part and Edit are shown and both save

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, a work order whose status is **Declined** behaves
as though it were still open for work. This is not one symptom but three, and they share one cause:
Declined is not included in the set of statuses that lock a work order.

**1 — The controls are displayed.** On a Declined work order the "+ Add Part" button is shown in each
line's Parts section, and the per-part Edit control is present on the part rows and comes to full
opacity on hover.

**2 — Adding a part succeeds.** With an inline add row open and filled, moving the work order to
Declined and then saving still saves the part. The part is added to the line and the confirmation
"Part added" is shown.

**3 — Editing a part succeeds.** With an inline edit row open and a value changed, moving the work
order to Declined and then saving still applies the change. The row closes as though the edit had
gone through normally, because it has.

In cases 2 and 3 the specification requires the save to **fail**, with the alert *"This work order can
no longer be edited. Refresh to see the latest."* and the entered data left in the row. Neither
happens: the whole page was searched for both *"no longer be edited"* and *"refresh to see the
latest"* and neither string is present.

**Steps to reproduce**
1. Open **Work Orders** and open a work order whose status is **Declined** (used: **S9315-15897**).
2. Open its **Lines** tab and look at a line's Parts section — the "+ Add Part" button is there.
3. Hover a part row — the Edit control is there and becomes fully visible.
4. Click **+ Add Part**, fill the row, and save — the part is added.
5. On a work order that is editable, open a part's Edit row, change the quantity, have the work order
   moved to Declined, then press Save — the change is saved.

**What should happen:** neither control is displayed, and no save is accepted, when the work order
status is Complete, Invoiced, Paid, **Declined** or Imported.

**Why this is the build and not the tests:** the same checks on the other guarded statuses are correct
on this build. Complete (S9315-15856), Invoiced (S2-15828) and Paid (S9315-15894) each show **zero**
Add Part buttons and **zero** Edit controls with their Parts sections rendered on screen, and an
editable Approved work order correctly shows 3 and 5. **Only Declined is wrong** — which is why this
is filed as one defect rather than three.

---

## THE SOURCE THIS WAS RAISED AGAINST (required by the QA lead, 2026-09-10)

Every ticket must say what document it is measured against. This one:

| | |
|---|---|
| **Specification** | *Inline Add and Edit Parts on Work Order Lines*, **version 16**, Confluence page **782761986** |
| **Requirement references** | **S1-N1** and **S1-N2** (the Add Part button and the Edit control are not displayed on Complete, Invoiced, Paid, **Declined** or Imported) · **S2-E3** (a save on a work order that can no longer be edited must fail with that alert and keep the data) · **S3-E2** and **S4-E3** (the same rule for the Tech View edit and the Full View add) |
| **Epic** | **SV-9315** |
| **Stories covered** | **SV-9316** Story 1 (the controls) · **SV-9317** Story 2 and **SV-9319** Story 4 (the add saving) · **SV-9318** Story 3 (the edit saving) |
| **Source read on** | 9 September 2026 |
| **Build observed** | v26.36.0-f43b2fd, sv9315 QA branch, 10 September 2026 |

The ticket is parented to **SV-9316** because the missing status guard is Story 1's rule; the other
three stories inherit it.

---

## THE FIVE TEST CASES, AND EXACTLY WHAT EACH ONE GETS WHEN THE TICKET IS FILED

The QA lead's instruction is that each case must carry the ticket link, tell the tester to track it,
and be set to the right status — *"make sure that it does not bite me."* So the moment the ticket
exists, each of these five gets a result written with the **ticket link first**, then the tracking
sentence, then the Staging sentence, then the plain explanation:

| Case | Status to set | What it saw |
|---|---|---|
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) | **Failed** | the Add Part button is shown on a Declined work order |
| [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | **Failed** | the Edit control is shown on a Declined work order |
| [C45061](https://shopview.testrail.io/index.php?/cases/view/45061) | **Failed** | a Full View add still saves on a Declined work order |
| [C45035](https://shopview.testrail.io/index.php?/cases/view/45035) | **Failed** | a Tech View edit still saves on a Declined work order |
| [C45001](https://shopview.testrail.io/index.php?/cases/view/45001) | **already Failed** | a saved part is never locked — related, gets the link if the ticket covers it |

**The comment each one opens with**, once the key exists:

> `<TICKET-KEY>` — https://shopview.atlassian.net/browse/`<TICKET-KEY>` — Track the progress on this ticket.
>
> This test case has been tested in QA branch but it needs to be tested on the Staging environment too by Viktoria.
>
> …then the plain explanation of what was seen.

**Nothing above is written to TestRail until the ticket exists**, so no case can point at a ticket
that is not there. That is the "does not bite me" part: the link and the status land together, in one
pass, after the ticket has a real key.

---

## Evidence

`evidence/21-c44993.json` · `evidence/23-statusmatrix.json` · `evidence/25-declined.json` ·
`evidence/105-noneditable.json`. Annotated screenshot: `defect-shots/candidate1-declined-add-part.png`.
Screens for the two save cases: `evidence/105-c45061-2-after-save.png`,
`evidence/105-c45035-2-after-save.png`.
