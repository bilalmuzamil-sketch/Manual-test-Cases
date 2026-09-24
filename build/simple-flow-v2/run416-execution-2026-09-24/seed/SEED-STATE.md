# Seeded state — Trucks Hill 2, 2026-09-24

Built so the checks that had nothing to look at can now be run. Everything is on the throwaway
production test shop; nothing here belongs to a real customer.

## The shop's settings while the seeded checks run
| Setting | State |
|---|---|
| Require Ordering Parts | **on** |
| Require Picking Inventory Parts | **on** |
| Require Receiving Parts Before Completion | on (as found) |
| Require Approval for New Lines | **on** |

All four are put back to how the shop was found (ordering off, picking off, receiving on, approval off)
once the re-run is finished.

## The work order carrying the seeded parts
**S2-908** — https://app.shopview.com/workorders/068f9856-9d28-4500-a3dd-dd6d7aafb15a/lines
Its parts list is the **Parts** tab, at `/workorders/{id}/part-requests`.

| Part state reached | How it was produced |
|---|---|
| **Quoted** | a part on a line that is not yet approved |
| **Auth To Order** | the same part once its line is approved — it then offers *Order* |
| **In Stock** | an inventory part with stock added to an approved line — it offers *Pick* |
| **Awaiting** | pressing *Order* on an Auth To Order part — it then offers *Receive* |
| **Received** | pressing *Pick* on an In Stock part moves it straight to Received, and its core follows it |

Three inventory parts were added from stock: **1237944 / A158**, **1238214 / A428**, **1238010 / A224**.
A158 arrived with a core part of its own, which is what the core checks need.

## What still has no example, and why
- **Picked** — pressing *Pick* does not produce a state called Picked; the part goes straight to
  **Received**. That is itself worth reporting; it is recorded against the part-states check.
- **Returned** — *Return* is offered in a part's three-dot menu, but pressing it changed nothing and
  raised no dialog. Being chased.
- **Requested** — no route to it was found from the work order screen.
- **Received later** — needs the *Receive later* permission, which is the second half of this seeding.
