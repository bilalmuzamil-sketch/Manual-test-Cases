# D5 — NEW FINDING, held, ready to file on his word

Found on 2026-09-10 while acting on his ruling that the requirement's "Cancelled" line status means
**Declined** (register item 7). It is not the same fault as SV-9917, and it is not in either suite's
scope — it turned up because that ruling made me try to set a line to Declined for the first time.

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` |
| `parent` | **to confirm** — the Edit Line window belongs to work-order lines, not to either of the two suites under test. Nearest owning story to be proved before filing (Rule 62 A7: the parent is proved, never guessed). |
| `priority` | `Medium` |
| Blocks | C45104 — https://shopview.testrail.io/index.php?/cases/view/45104 — run 419 https://shopview.testrail.io/index.php?/runs/view/419 |

**Summary:** A work order line cannot be set to Declined — Save & Close silently does nothing

## The problem
A job line can be given one of four states. Setting it to **Declined** does not work: the choice is
accepted on screen and then thrown away when you save, with no message of any kind.

## Current behaviour
- Clicking a job line opens the **Edit Line** window. Its **Status** list offers exactly four
  choices: *Authorization required*, *Declined*, *Authorized*, *Complete*.
- Choosing **Declined** does change the box to read Declined.
- Pressing **Save & Close** does nothing: the window stays open, no message appears anywhere, and the
  line is still *Authorized* afterwards.

## Expected behaviour
- Choosing Declined and pressing Save & Close should close the window and leave the line Declined.
- If the change cannot be made, the user should be told why.

## Where this was seen
Staging, https://app.staging.shopview.com, build `v26.36.2-617d8d1`, signed in as Admin ShopView,
10 September 2026, work order S2-32819.

## Steps to reproduce
1. Click **Work Orders** in the top menu.
2. Click a work order that has at least one job line.
3. Click the **Lines** tab.
4. Click on the job line itself — the **Edit Line** window opens.
5. Click the **Status** box and choose **Declined**. The box now reads Declined.
6. Click **Save & Close**.
7. The window stays open. Close it with the **X** and look at the line — it is still **Authorized**.

## The control that proves it is not the button
In the same window, in the same sitting, changing **Tech Time** to `3.75` and pressing the same
**Save & Close** closes the window and the new value is saved and reads back correctly. So the button
works; it is the Declined change specifically that is dropped.

## Evidence
`build/printer-friendly-wo/staging-2026-09-10/evidence/BIG28-2-aftersave.png` — the window open, Status
reading Declined, Save & Close enabled, no message. Annotated version to be produced before filing.
Machine record: `evidence/BIG29.json` (control saved, check did not).
