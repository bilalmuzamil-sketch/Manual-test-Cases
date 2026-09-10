# D5 — ⛔ WITHDRAWN 2026-09-10. NOT A DEFECT. NEVER FILED.

**Why it was withdrawn.** The QA lead looked at the screen and pointed out the message I had missed.
When a line still holds staged parts the product refuses the status change and says exactly why, in a
toast at the bottom right:

> **"Can`t change status while there are staged parts. Please move parts to another line or return
> them. Please try to resolve this."**

So the behaviour is correct and self-explaining. To decline a line you first cancel its part requests
and return or move any part already picked from stock — which is what the message tells you to do.

**How I got it wrong.** I wrote *"no message of any kind appears"* having read the page for messages
**once, seven seconds after the click** — by which time the toast had faded. I had a positive control
proving the SAVE BUTTON worked, and none at all proving my MESSAGE READER worked. A negative claim
about a message needs a control on the thing reading the message. Re-run with a watcher polling from
the moment of the click, the same reader caught the toast immediately (`evidence/BIG30.json`).

**Kept, not deleted,** so the mistake stays on the record (Rule 94: a failed candidate is a record).

---

*The original draft follows, unchanged, for the record only. Do not file it.*

# D5 — NEW FINDING, held, ready to file on his word
Written to the QA lead's section order of 2026-09-10 (skill 06). Found while acting on his ruling
that the requirement's "Cancelled" line status means **Declined**.

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` · `priority` `Medium` |
| `parent` | **TO BE PROVED, NOT GUESSED (A7).** The Edit Line window belongs to work-order lines and sits outside both suites under test. |
| Blocks | C45104 — https://shopview.testrail.io/index.php?/cases/view/45104 — run 419 https://shopview.testrail.io/index.php?/runs/view/419 |

**Summary:** A work order line cannot be set to Declined — Save & Close silently does nothing

## 1. Environment
| | |
|---|---|
| Site | Staging |
| Build | `v26.36.2-617d8d1` |
| Signed in as | Admin ShopView |
| Date | 10 September 2026 |
| Work order | S2-32819 — https://app.staging.shopview.com/workorders/9e1934ae-a2f7-41f1-baae-0ee5690e9a96/lines |

## 2. The problem
A job line can be given one of four states. Setting it to **Declined** does not work: the choice is
accepted on screen and then thrown away when you save, with no message of any kind.

## 3. Steps to reproduce
1. Click **Work Orders** in the top menu.
2. Click a work order that has at least one job line.
3. Click the **Lines** tab.
4. Click on the job line itself — the **Edit Line** window opens.
5. Click the **Status** box and choose **Declined**. The box now reads Declined.
6. Click **Save & Close**.
7. The window stays open. Close it with the **X** and look at the line — it is still **Authorized**.

## 4. Screenshots
`BIG28-2-aftersave.png` — the Edit Line window open, Status reading Declined, Save & Close enabled and
blue, no message anywhere. **Annotated version to be produced before filing.**

## 5. Current behaviour
- The **Status** list offers exactly four choices: Authorization required, Declined, Authorized, Complete.
- Choosing **Declined** does change the box to read Declined.
- **Save & Close** does nothing: the window stays open, no message appears, the line is still Authorized.

## 6. Expected behaviour
- Choosing Declined and pressing Save & Close should close the window and leave the line Declined.
- If the change cannot be made, the user should be told why.

## 7. Sources
The four line states are read off the screen itself (the Status list in the Edit Line window). No
written requirement covers setting a line to Declined; the finding is that a state the product offers
cannot be reached. **Before filing, search the specification for a statement about line states and
quote it if one exists** — otherwise say plainly that the source is the product's own list.

## 8. Test cases
Test run 419 — https://shopview.testrail.io/index.php?/runs/view/419
- C45104 — https://shopview.testrail.io/index.php?/cases/view/45104 — blocked by this

## The control that proves it is not the probe
In the same window, same sitting: changing **Tech Time** to `3.75` and pressing the same
**Save & Close** closes the window and the value saves and reads back correctly. So the button works;
the Declined change specifically is dropped. Machine record: `evidence/BIG29.json`.
