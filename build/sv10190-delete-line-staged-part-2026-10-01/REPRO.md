# SV-10190 — what is still broken, and how to reproduce it by hand

**Environment:** https://app.staging.shopview.com — build `v26.39.2-538dd8d`
**Location:** switch to **Staging Lethbridge - 4310** before you start (the test data is there)

Two work orders are already seeded and waiting, each with an authorized line whose vendor part is
**ordered but not yet received**. Nothing to set up — use one, the other is a spare.

| | Work order | Line | Part | Purchase order |
|---|---|---|---|---|
| Use this one | **S3-34508** | Rhays - Mount, balance, and install 4 supplied tires | `SV10190-REPRO-1` | **S-34508** |
| Spare | **S3-34509** | Mount, balance and install 2 new tires | `SV10190-REPRO-2` | **S-34509** |

---

## Steps

1. **Tab 1** — open **S3-34508** and go to its **Lines** tab. Leave this tab open and **do not reload
   it** for the rest of the steps.
2. **Tab 2** — open a second tab, go to **Parts → Purchase Orders**, open **S-34508**, click
   **Receive Order**, pick any vendor, type any invoice number, and click **Receive Parts (1)**.
   You should see *"Parts received"*.
3. **Go back to Tab 1.** Do not reload it. Click the **line number box** on the left of the line to
   open its menu.
4. Look at **Delete line** at the bottom of the menu.

## What you will see

**Delete line is red and clickable.** Hovering it shows no blocking message. Clicking it opens the
normal confirmation — *"Are you sure you want to delete this line? This cannot be undone."*

Only after you press **Delete** do you get a red warning:
*"Line can not be deleted with staged parts, please move parts to another line or return them."*

The line and its part are not harmed.

## What the ticket asks for

> **Delete line** is disabled, with the hover message *"Line can not be deleted with staged parts,
> please move parts to another line or return them"*

So the item should never have been clickable in the first place.

## Proof it is only the screen that is out of date

While Tab 1 still shows it as clickable, open a **third** tab on the same work order. There the same
line's **Delete line** is correctly greyed out with the hover message. Reload Tab 1 and it corrects
itself too.

---

## Where it does **not** happen

- After a page reload — correct.
- When the part is received **on the Lines page itself** (the part row's **Receive** button, which
  opens the *Receive parts* dialog without leaving the page) — correct, tested three times.

It only goes wrong when the receive happens **somewhere else**: another tab, the purchase order
page, or bulk receive.

---

## How often

| Method | Attempts | Delete line wrongly clickable |
|---|---|---|
| Received in another tab | 6 | **6** |
| Received on the Lines page itself | 3 | 0 |
| Page reloaded after the receive | 1 | 0 |

The original report measured 5 in 8. It reproduced every time here.
