# DEFERRED BUILD-VERIFICATION RUN — Invoice UI Refresh (SV-8218)

**A local list, NOT a TestRail run object** (skill 03 §7.4). These are cases whose **feature was not
found in the build** on the date shown. Each is a **finished case in a defined state**, not a blocker:
it keeps its documented expectation (Rule 57), carries
`AUTOMATION: Not available on Build to test Yet - Last checked 8/31/2026`, carries the §7.3
tester-facing re-check line, and is **excluded from the ready-to-automate count**.

**Re-check trigger: THE FEATURE SHIPPING — not a redeploy alone** (skill 03 §7.4, Rule 49).

**Build checked against:** `v26.35.5-8c3cc21` (QA branch **sv8218**) · **checked:** 31 August 2026

| Case | Title | Waiting on | Story | Evidence of absence |
|---|---|---|---|---|
| [C44937](https://shopview.testrail.io/index.php?/cases/view/44937) | Declined Work shows in its own section with names and descriptions only | the `"Show declined work"` setting | **SV-9145** (In Progress) | Absent from the Invoice Details dialog, read with a **positive control firing in the same read** — `Labor rate`, `Labor hours`, `Labor price`, `Summarize labor total`, `Summarize parts total`, `Part number`, `Part description` all FOUND. |
| [C44938](https://shopview.testrail.io/index.php?/cases/view/44938) | Declined lines show no prices, no line numbers, and no status pill | same | **SV-9145** | same read |
| [C44939](https://shopview.testrail.io/index.php?/cases/view/44939) | Declined Work section hidden when nothing declined or option off | same | **SV-9145** | same read |
| [C44942](https://shopview.testrail.io/index.php?/cases/view/44942) | Percent column shows only when the setting is on | the `"Show % on Estimates and Invoices"` setting | **SV-9146** (In Progress) | Absent from the same dialog; a source read found no backend field either — a cleaner not-built than declined work, which does have a backend path. |
| ~~[C44987](https://shopview.testrail.io/index.php?/cases/view/44987)~~ | ~~Batch and imported invoices are out of scope~~ | — | **SV-9193** | **🔴 WITHDRAWN 2026-09-01 — THIS ROW WAS WRONG. The import IS built.** See the correction below. |
| ~~[C45185](https://shopview.testrail.io/index.php?/cases/view/45185)~~ | ~~A snapshot created before the redesign renders in the new layout with blanks~~ | — | document history | **🔴 WITHDRAWN 2026-09-01 — WRONG MECHANISM. The snapshot feature is built; the case is testable and it FAILS.** See below. |

## ⚠️ A note on the strength of each row

**🔴 C44987 WAS REMOVED FROM THIS LIST ON 2026-09-01 — THE FEATURE IS BUILT.**
The row rested on four **guessed** route shapes all answering 404, and the row's own caveat said so
(*"a guessed route and a wrong id 404 identically"*). Reading the product's own front-end bundle
instead of guessing found the real routes immediately:

| What | Where |
|---|---|
| List imported work orders | `GET /api/work-orders-imported` — **200** (it was simply empty) |
| One imported work order | `GET /api/work-orders-imported/{id}` — **200** |
| Ingest them | `POST /api/imports/work-order-historical` (multipart, field name `file`) |
| The screen | route `/imported-work-orders/:id`, component `ImportedWorkOrderLeftSection` |
| The CSV contract | the product ships its own template inline in `InvoicesDataImport` — 24 columns, 10 required |

**An imported work order was then seeded and exists on the branch**: `ZZAUTOTEST-IMP-001`
(`c457a7fa-a42d-4994-bc85-0dff770f2314`), status `imported`, $105.00, customer Una Truck Center.
The CSV headers came from the product's own shipped template, so this is a contract-based write,
not a guessed one (skill 03 §8.2-w).

**The lesson, recorded:** *four 404s from guessed routes are not evidence of absence.* The bundle is
the authority on which routes the product calls, it is one fetch away, and it should be consulted
**before** any "not built" verdict. Folded into the playbook.

**C44987 now needs re-verification against its actual assertion** (that a batch/imported invoice
keeps the current template rather than the redesigned one) — it is back on the to-do list, not
deferred. Note the imported work order carries **no invoice document route** of its own
(`/api/invoices/preview` rejects its id; `/api/work-orders-imported/{id}/pdf` is 404), which is
itself the thing that case needs to establish.

---

**🔴 C45185 WAS ALSO REMOVED ON 2026-09-01 — I WAS TESTING THE WRONG THING.**
The row rested on the `historyEvent` **query parameter** being a no-op (one sha across five values).
It is a no-op because **it is not the snapshot mechanism at all.** The real one, read off the
front-end bundle:

> `POST /api/work-orders/invoices/snapshot {entity_event_id, work_order_id, type:"html"|"pdf"}`,
> where `entity_event_id` is a work-order history event carrying `snapshotAvailable: true`
> (`GET /api/work-orders/{id}/history`).

That also **withdraws the `historyEvent` defect candidate** — a parameter that is not the feature is
not a defect.

**The case is testable and it FAILS:** snapshots captured **today** render (200); **every snapshot
already on the branch returns HTTP 500** — 20 of 20 calls. Proven on one work order
(**S8218-17113**: today 200, its own 18/13/10 August events all 500), so it is the snapshot's age,
not the record or the document type. Written up in
`remaining-6-2026-09-01/RESULTS.md` with the defect candidate at
`DEFECT-CANDIDATE-snapshot-500.md` (**not filed — hold active**).

---

**Three of the six rows in this file were wrong, and all three failed the same way: a GUESSED ROUTE
NAME returning 404, or a guessed parameter doing nothing.** C44987 (imported import), C44987's batch
half (`invoices/batch-pdf`) and C45185 (the snapshot route). **Fetch the product's front-end bundle
and grep it for the real route before writing "not built."** The four rows that remain below were
established with a firing positive control, not with guessed routes, and they stand.

---

**C44937–C44939 and C44942 are strong**: a probe that demonstrably fires found the sibling settings
and not these. **C44987 is weaker on its own** — four guessed 404 routes prove little by themselves
(a guessed route and a wrong id 404 identically), so that row rests mainly on the explicit SV-9193
deferral and the absent navigation. **If invoice import turns out to exist, Rule 14 applies: seed the
record, do not report NOT-VERIFIED for a missing data state.**

## Not on this list, and why

- **C44951 · C44952 · C45175** — the feature exists; it is the **customer portal**, which is not on a
  QA branch. They carry the staging-only HOLD instead (core §5.0-b).
- **C44913 · C44916** — the feature exists; the **source is ambiguous** about how a tester obtains an
  Approval Code. Rule 58: held case + PO question (`questions-2026-08-31/PO-QUESTIONS-IBS.md`).
- **C44947** — was wrongly parked as staging-only. It reads the payment **method name** on the invoice
  Payments rows (S8-R2), which renders on a shop-app document. **Testable on the branch**; the HOLD has
  been lifted and it is back on the to-do list.
