# For Vladimir Tomovic — every Automated case we changed, 1–2 September 2026

**One notice, replacing four.** Separate notes had accumulated for 2026-08-31, 2026-09-01 and
two passes on 2026-09-02; they are superseded by this list. Every case below carries TestRail’s own
**Automated** flag (`custom_atmstatus = 3`), so an automation script may be reading its wording —
which is why Rule 65 requires telling you.

**Authorisation (QA lead, 2026-09-02, verbatim):** *"yes this case needs to be updated, and all those
test case also need to be updated which are automated but yet they should be updated to make them
runnable and Build verified. This authorization is for these three suites for now. 1. Invoice refresh
2. Inline Add Part 3. Workorder Print"*

**The flag was re-read immediately before and after every write and is still 3 on all 12**; no section moved and no `refs` value changed.

| Case | Suite | Title | What changed | When |
|---|---|---|---|---|
| [C45005](https://shopview.testrail.io/index.php?/cases/view/45005) | Inline Add and Edit Parts | Saving adds the part at the top of the list with a Part added toast | route wording + the build-checked date (2026-09-01); then preconditions 2 and 3 given the role screen’s real wording (2026-09-02) | 09-01 & 09-02 |
| [C45026](https://shopview.testrail.io/index.php?/cases/view/45026) | Inline Add and Edit Parts | Saving an edit updates the part line in place and closes the row | route wording + the build-checked date (2026-09-01); then preconditions 2 and 3 given the role screen’s real wording (2026-09-02) | 09-01 & 09-02 |
| [C45223](https://shopview.testrail.io/index.php?/cases/view/45223) | Inline Add and Edit Parts | Selecting a part auto-allocates the full quantity to a single bin | preconditions 2 and 3 only — the two permission names that do not exist | 09-02 |
| [C45224](https://shopview.testrail.io/index.php?/cases/view/45224) | Inline Add and Edit Parts | Allocation is shown below the row as a Pulled from chip | preconditions 2 and 3 only — the two permission names that do not exist | 09-02 |
| [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) | Inline Add and Edit Parts | Choosing a bin from the picker moves the full quantity into it | preconditions 2 and 3 only — the two permission names that do not exist | 09-02 |
| [C45237](https://shopview.testrail.io/index.php?/cases/view/45237) | Inline Add and Edit Parts | Allocation is stored on save and not shown on the saved part row | preconditions 2 and 3 only — the two permission names that do not exist | 09-02 |
| [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) | Printer Friendly Work Orders | Printing logs a Work Order Printed event in audit history | ALL THREE FIELDS — the audit-history route added, the event label corrected, the marker lifted to READY | 09-02 |
| [C44919](https://shopview.testrail.io/index.php?/cases/view/44919) | Invoice UI Refresh | Authorizer is selected in the work order customer contact card | design reference added to the provenance line | 09-02 |
| [C44920](https://shopview.testrail.io/index.php?/cases/view/44920) | Invoice UI Refresh | Authorizer is optional and can be cleared with 'No authorizer' | design reference added to the provenance line | 09-02 |
| [C44921](https://shopview.testrail.io/index.php?/cases/view/44921) | Invoice UI Refresh | Authorizer's phone shows below the name when the contact has one | design reference added to the provenance line | 09-02 |
| [C44922](https://shopview.testrail.io/index.php?/cases/view/44922) | Invoice UI Refresh | Authorizer is locked once the work order is invoiced | design reference added to the provenance line | 09-02 |
| [C44985](https://shopview.testrail.io/index.php?/cases/view/44985) | Invoice UI Refresh | Parts sale receives the Authorizer treatment (net-new) | design reference added to the provenance line | 09-02 |

## Not touched: [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) — “Adding a part to a completed line reopens the line”

It is flagged Automated **and** it is inside an authorised suite, and it was still left exactly as it
is, because `created_by = 1` — it is yours. No authorisation reaches your cases. It is reported on five
of our automated checks and edited by none of them.

## 🛑 The one thing that matters most for automation

**If any script asserts on the audit-history event text `"Work order printed history"`, it is asserting
on a string that has never existed on the page.** Our 2026-09-01 pass recorded it that way and raised a
wording divergence on it. The build says **`Work order printed`**. The extra word came from reading a
whole table row with `tr.innerText`, which glued the Event cell’s clock-icon text (`history`) onto the
event name. The finding is withdrawn and C45123 now names the real label.

**The audit-history route, in the build’s own words:** the three-dots button at the top right of the
work order, between `SHOPCOACH ANALYSIS` and `New Line` → **`Audit Log`** → a window titled
**`Work Order Log`** with the columns `Event`, `User`, `Line`, `Details`, `Date`, `Time`.

## The two permission names that do not exist

Six Inline cases told a tester to look for `Work Order Line - Create and Edit` and
`Work Orders → Work Order View Mode`. **Neither string is on the screen.** The role screen has a
**`Work order lines`** section whose column is **`Create & Edit`**, and a **`Work orders`** section with a
**`View mode`** block offering **`Full View`** and **`Tech view`**. If a script drove either old string,
it was driving nothing.

## Evidence

Payloads, pre-write snapshots, per-case applied logs and the four post-write checks:
`build/automated-cases-2026-09-02/` and `build/invoice-ui-refresh/design-ref-write-automated/`.
All four checks clean on every case — precondition-label gate, runnability, stored-value render check,
and the served-page container scan.
