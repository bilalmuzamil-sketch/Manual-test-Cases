# SPOT-CHECK SAMPLE — Report Suite re-verify sweep + WIP reconciliation (2026-08-19)

**Purpose:** a single list the QA lead can open to **eyeball the rendering** of the cases touched in the
2026-08-19 Report Suite re-verify sweep + WIP v24 reconciliation. Every case below was written in the
**interim `<br>` format** (the TestRail `update_case` markdown-wrap regression forced literal `<br>`
line breaks — accepted by the QA lead, template C30133). **They should render like C30133** — numbered
items on their own lines, a `---` rule before the provenance line, and the `AUTOMATION:` marker on its
own line at the end. If any render as raw `<ol>`/`<li>` HTML, flag it.

**Docs-only:** no TestRail/staging/Jira writes producing this file. All C-ids link to TestRail.

> **Note on sourcing:** only the **WIP reconciliation** carried an explicit "recommended spot-checks"
> section (4 cases). For the six sweeps, the cases below are **nominated here** from each sweep's
> highlighted *newly-driven-live / deviation / EXPECT-FAIL / permission* cases — the ones most worth an
> eyeball. This is a representative render-check sample, **not** the full 166+13 written set.

---

## ⭐ REFERENCE — the clean example to compare against
| C-id | Link | What it is |
|---|---|---|
| **C30133** | https://shopview.testrail.io/index.php?/cases/view/30133 | **Reference-clean `<br>` template** (SBC) — every case below should render like this one. |

---

## Sales By Customer (SBC) — build `v3.8-da72171`
| C-id | Link | What it is |
|---|---|---|
| C30132 | https://shopview.testrail.io/index.php?/cases/view/30132 | Driven live (seeded) — reverse-invoice exclusion. |
| C30137 | https://shopview.testrail.io/index.php?/cases/view/30137 | Driven live (seeded) — duplicate customer-label `(#1)/(#2)`. |
| C30101 | https://shopview.testrail.io/index.php?/cases/view/30101 | Permission — location-access enforcement, verified via Parts-Manager impersonation. |
| C43550 | https://shopview.testrail.io/index.php?/cases/view/43550 | Driven live — Location is never a column-selector toggle. |
| C30100 | https://shopview.testrail.io/index.php?/cases/view/30100 | HOLD — invoice-number link-vs-plain-text PO question (Chris Ward). |
| C30131 | https://shopview.testrail.io/index.php?/cases/view/30131 | HOLD — build blocks a no-vehicle service WO (create returns 500). |

## Sales By Representative (SBR) — build `v3.8-b7d80dc`
| C-id | Link | What it is |
|---|---|---|
| C30290 | https://shopview.testrail.io/index.php?/cases/view/30290 | EXPECT-FAIL — over-cap Expanded-PDF / API row-cap (SV-8818; not reachable at 88 invoices). |
| C30320 | https://shopview.testrail.io/index.php?/cases/view/30320 | EXPECT-FAIL — over-cap export refused (paired with C30290). |
| C30202 | https://shopview.testrail.io/index.php?/cases/view/30202 | HOLD — calendar >366-day span not harness-drivable. |
| C43559 | https://shopview.testrail.io/index.php?/cases/view/43559 | Newly in write-scope this sweep. |

## Parts Velocity (PV) — build `v3.8-d0e135e`
| C-id | Link | What it is |
|---|---|---|
| C30327 | https://shopview.testrail.io/index.php?/cases/view/30327 | Permission — reports-access-alone opens PV + export (non-admin Technician, driven live). |
| C30331 | https://shopview.testrail.io/index.php?/cases/view/30331 | Driven live — custom range rejects >366 days (HTTP 400). |
| C30361 | https://shopview.testrail.io/index.php?/cases/view/30361 | Driven live — Units Returned counts returns + parts-sale credits. |
| C38885 | https://shopview.testrail.io/index.php?/cases/view/38885 | EXPECT-FAIL — large-view PDF 500 while CSV works (SV-8818, re-confirmed live). |
| C43547 | https://shopview.testrail.io/index.php?/cases/view/43547 | EXPECT-FAIL — over-cap export refused (SV-8818). |
| C30340 | https://shopview.testrail.io/index.php?/cases/view/30340 | HOLD — Location-filter-hidden needs a one-location user. |

## Technician Utilization (TU) — build `v3.8-d0e135e`
| C-id | Link | What it is |
|---|---|---|
| C30443 | https://shopview.testrail.io/index.php?/cases/view/30443 | READY — driven live this sweep. |
| C30444 | https://shopview.testrail.io/index.php?/cases/view/30444 | READY — driven live this sweep. |
| C30446 | https://shopview.testrail.io/index.php?/cases/view/30446 | Permission — Location filter positive confirmed live (negative needs one-location user). |
| C30407 | https://shopview.testrail.io/index.php?/cases/view/30407 | HOLD — em-dash ELL needs a rate-less location. |

## Work In Progress (WIP) — build `v3.8-d0e135e` (sweep + v24 reconciliation)
| C-id | Link | What it is |
|---|---|---|
| C30455 | https://shopview.testrail.io/index.php?/cases/view/30455 | **WIP-recon spot-check** — S11-R7 snapshot-read corrected + live-confirmed. |
| C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 | **WIP-recon spot-check** — grain + S3-R6; HOLD→READY. |
| C30472 | https://shopview.testrail.io/index.php?/cases/view/30472 | **WIP-recon spot-check** — aging per job (shared Days Open correct, not a bug). |
| C43979 | https://shopview.testrail.io/index.php?/cases/view/43979 | **WIP-recon spot-check** — line-state slices sum to WO total. |
| C30456 | https://shopview.testrail.io/index.php?/cases/view/30456 | Line-state placement re-anchored to S3-R5/S3-R6; divergence note retired. |
| C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 | HOLD/deviation — Location a default column but NOT in Column Selection. |
| C43551 | https://shopview.testrail.io/index.php?/cases/view/43551 | HOLD — same Location-not-toggleable deviation (paired). |

## Inventory Value (IV) — build `v3.8-d0e135e`
| C-id | Link | What it is |
|---|---|---|
| C30587 | https://shopview.testrail.io/index.php?/cases/view/30587 | EXPECT-FAIL — large-view PDF 500 while CSV works (SV-8818, re-stamped). |
| C43548 | https://shopview.testrail.io/index.php?/cases/view/43548 | EXPECT-FAIL — over-cap / large-view PDF refused (SV-8818). |
| C30547 | https://shopview.testrail.io/index.php?/cases/view/30547 | HOLD — no-category part not producible (parts require a category on this build). |
| C30577 | https://shopview.testrail.io/index.php?/cases/view/30577 | HOLD — one-location user (0 of 19 roster staff are single-workplace). |
| C30605 | https://shopview.testrail.io/index.php?/cases/view/30605 | HOLD — server-side nightly-capture rows not reachable from the app. |

---

**Count:** **33 C-ids** (1 reference + 32 nominees: SBC 6, SBR 4, PV 6, TU 4, WIP 7, IV 5) across the
6 reports + WIP reconciliation.
All are in the interim `<br>` format and should render like C30133.
