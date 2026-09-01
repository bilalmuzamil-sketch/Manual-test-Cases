# DEFECT CANDIDATE — every pre-existing document snapshot returns HTTP 500

**NOT FILED.** The Jira creation hold is active (Rule 62); this is prepared text only.

**Project:** Invoice UI Refresh (SV-8218) · **Branch:** sv8218 · **Build:** `v26.35.5-8c3cc21`
**Found:** 1 September 2026 · **Case it affects:**
[C45185](https://shopview.testrail.io/index.php?/cases/view/45185)
**Suggested severity:** Medium (Rule 53 — never High)

---

## What happens

Opening a **document snapshot** from a work order's history fails with a server error for every
snapshot that already existed on the branch. A snapshot taken **today** opens fine.

`POST /api/work-orders/invoices/snapshot {entity_event_id, work_order_id, type: "html"|"pdf"}`

| Snapshot | Result |
|---|---|
| Created today (4 calls: 2 work orders × html/pdf) | **200**, a correct document |
| Already on the branch (20 calls: 8 events × html/pdf, 4 more retried) | **500** on every one |

## Why this is the snapshot's age and nothing else

The confound worth ruling out is work-order type — the first failures were all service work orders
and the first success was a part sale. **It is not that.** On **one single service work order,
S8218-17113**, the same route, session and document type give:

| Event on S8218-17113 | Date | html | pdf |
|---|---|---|---|
| Invoice created | **2026-09-01** (today) | **200** (349,006 bytes) | **200** (193,497 bytes) |
| Invoice downloaded | 2026-08-18 | **500** | **500** |
| Reviewed | 2026-08-13 | **500** | **500** |
| Estimate downloaded | 2026-08-10 | **500** | **500** |

Same record, same endpoint, same minute. The only variable is **when the snapshot was captured**.

Independently, seven pre-existing snapshot events across three other work orders (S2-16696,
S2-16926, S2-16541; dates 2026-08-05 to 2026-08-24) return **500** on both types — 14 further calls,
no exceptions.

## Why it matters

Document history is how a shop proves what a customer was actually sent. Every snapshot captured
before this branch's redesign is currently unopenable, so the entire pre-existing history is
unreadable while any snapshot taken from now on works. The likely cause is the renderer reading
newly-required fields out of an older stored payload, but the error body carries only a generic
message and a request id — **the server log for those request ids will name it in one line.**

## Steps to reproduce

1. Open any work order that was invoiced before this branch was built — for example **S8218-17113**.
2. Open its **History**.
3. Open the document snapshot on an entry dated before this branch (e.g. *Invoice downloaded*,
   18 August 2026).
4. **Expected:** the document opens. **Actual:** a server error.
5. On the same work order, open the snapshot on today's *Invoice created* entry — it opens correctly.

Request ids captured for the failures include `9bafb009-4cd9-4235`, `13f6b485-f0db-467d`,
`37dff0b6-5b88-4b85`, `78668e83-8354-4545-a95b-4b499cea8dcc`.

## What it does NOT show

Nothing here says the redesign is wrong. A snapshot that does render goes through the **new** layout
correctly, which is what the specification asks for — see the C45185 write-up. The fault is confined
to snapshots captured earlier.

## Evidence

`remaining-6-2026-09-01/evidence/c45185-snapshot-results.json` (every call, code and byte count) ·
`remaining-6-2026-09-01/evidence/c45185-working-snapshot.txt` (a snapshot that does render).
