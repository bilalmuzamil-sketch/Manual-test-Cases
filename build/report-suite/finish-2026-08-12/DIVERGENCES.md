# DIVERGENCES — where a step or precondition our sources require does not hold on the build

**Report Suite · build `v3.7-4626299` · 12 August 2026 · for the QA lead**

**Nothing here has been rewritten to match the build.** Where a source describes something the build
does not have, the case keeps what the source says and the difference is written down here — because
silently "correcting" it would erase the signal that the **build** is the thing that is wrong.

**This file is deliberately not empty-by-omission:** if a section says "nothing found", that means it
was looked for. "Nothing diverged" and "nobody checked" are different statements.

---

## 1 · CONFIRMED INDEPENDENTLY — Sales By Customer's Product Type filter is still the old single-select

**Re-verified by me on `v3.7-4626299` before writing anything**, not taken on trust from the previous
pass's folder. The check was built so it could fail: the control was located by its exact test-id,
the panel was opened, and the open state was **proven** (page test-ids grew 70 → 73, one menu surface
appeared, three option rows were read). Had the control not opened, the probe would have reported it.

**What the specification asks for** — Sales By Customer specification **S3-R1 / S3-R2**, changed
**10 August** under [SV-9074](https://shopview.atlassian.net/browse/SV-9074):

> *"A 'Product Type' filter is visible in the report toolbar. It is a **multi-select**, matching the
> behavior of the Customer and Location filters."*
> *"The dropdown pins two action rows at the top — **'All products'** and **'Clear all'** — above two
> toggle options: **'Parts'** and **'Services.'**"*

**What the build offers**, measured:

| test-id | rendered label | is it a toggle? | aria-selected |
|---|---|---|---|
| `option_sbc_product_type_all` | `Parts & Service` | **no** | true |
| `option_sbc_product_type_parts` | `Parts only` | **no** | false |
| `option_sbc_product_type_service` | `Service only` | **no** | false |

**Three mutually exclusive options. Zero toggles. No "All products" row. No "Clear all" row.**

**SV-9074 is `In Progress`** — read live today. *(The previous pass recorded it as `Ready to Fix`; it
has moved on. Either way the status is traceability only, never evidence about the build — I measured
the build.)*

### What I did, and why it differs from the change that was prepared

The previous pass prepared `AUTOMATION: HOLD` for both cases. **I applied `AUTOMATION: READY - EXPECT
FAIL (SV-9074)` instead**, and the reasoning matters:

- **A tester CAN start both cases.** The filter is present and opens. Step 1 of each says *read the
  action rows and the toggle options* — that step runs, and it immediately shows the fault.
- **A HOLD would disarm them.** The tester marks BLOCKED, and a two-day-old requirement gap on a
  **report handed off as final**, the day before release, goes unreported by the manual run.
- **There is a live open ticket to point at**, which is exactly the condition an EXPECT FAIL marker
  requires. It also keeps the case armed: **if SV-9074 ships, the case passes and the tester tells
  us** — which a HOLD can never do.

Both cases now carry the symptom in plain words and the three outcomes (see the marker convention),
so the tester is not stranded at the steps that genuinely cannot be performed.

| Case | Marker now | Steps that still cannot be performed |
|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | `READY - EXPECT FAIL (SV-9074)` | 2–4 as written ("leave Parts unselected", "All products") |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | `READY - EXPECT FAIL (SV-9074)` | 2–5 (there is no "Clear all" to choose) |

**Neither case's steps were rewritten.** They are correct against the specification.

**⚠️ [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) carries TestRail's own
`custom_atmstatus = 3` (Automated).** It is in the "for Vlad" section of this pass.

**What I need from you:** confirm SV-9074 is simply not in this release, and that a tester failing
these two tomorrow with the symptom above is the outcome you want.

---

## 2 · CONFIRMED INDEPENDENTLY, AND SHARPER THAN RECORDED — the Location column is offered in **no** column selector on Sales By Representative

**Measured in BOTH location states, so the answer cannot be an artefact of whatever the filter
happened to be set to.** The column selector was opened in each state and returned 7 rows each time —
it demonstrably opened, so "Location is not in it" is a measurement, not a failure to look.

**This account reaches SIX locations** — `QB Location`, `3rd`, `L'Espace Tralala Yoga`,
`Staging Heavy Duty - 9919`, `(New Location) Melissa Heiney, Counselling Therapy`,
`Staging Lethbridge - 4310`. *(The previous pass said five; it is six.)* That satisfies the
multi-location access condition the specification names, so the test is genuinely possible.

| | Location column in the table | Location offered in the column selector |
|---|---|---|
| one location selected (`Staging Heavy Duty - 9919`) | **absent** | **no** — selector lists only Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin % |
| all locations selected | **present**, immediately after `Status` | **no** — same 7 rows |

**What the specification asks for** — Sales By Representative specification **S21-R7 / S21-R8**:
the column is offered **in the column selector** to any user with access to more than one location,
shown by default, and **can be toggled on or off**; the gate is **what the user can reach**, not what
they have currently chosen.

**So two distinct things are wrong**, and only the first was previously recorded:
1. the column is gated on what is **selected** rather than what is **reachable** — it vanishes when
   you narrow to one location;
2. **it is not in the column selector at all**, so it cannot be toggled.

### What I did — and here too I did not apply the prepared hold

[C38913](https://shopview.testrail.io/index.php?/cases/view/38913) keeps **`AUTOMATION: READY`**.
Steps 1–7 and 9 are all runnable; only **step 8** ("switch Location off in the column selector") is
not, because there is nothing to switch. A hold would have disarmed a case that can be run and that
produces a real result at step 7.

Instead it gained a plain, verdict-free runnability note naming exactly what the column selector does
contain, telling the tester to **mark step 8 blocked and record the rest normally**. It deliberately
does **not** tell the tester what to conclude about steps 1–7 — that is the tester's call, and
[SV-8954](https://shopview.atlassian.net/browse/SV-8954) is **OBSOLETE**, so there is no live ticket
to hang an EXPECT FAIL marker on.

**Its two siblings behave differently and I left them alone**, but you should know why they differ:
[C38912](https://shopview.testrail.io/index.php?/cases/view/38912) and
[C43551](https://shopview.testrail.io/index.php?/cases/view/43551) carry a HOLD whose stated reason is
*"…needs the QA lead's permission before a ticket exists to point at"* — a **filing** reason, not a
runnability one. **C43551 genuinely is unrunnable** (its whole subject is toggling Location in the
selector). **C38912 may not be**, and if it is runnable its hold is disarming it. Flagged, not changed.

**What I need from you:** should SV-8954 be reopened and widened — it describes Technician Utilization
only, and this is at least Sales By Representative as well — and do you want C38912's hold reviewed?

---

## 3 · Not a divergence — checked and cleared

Recorded so none of these is re-investigated tomorrow morning.

- **The Work In Progress tab labels.** The four tabs ship as `Approved - partially completed` and
  render to the tester as **`Approved - Partially Completed`**, which is what our cases say. **Our
  cases are right.** Refinement on the earlier note: the `text-transform` is **not** on the tab
  element — that computes `none` — it is on a **child**, which is why the tab element's own computed
  style is misleading and why `innerText` is the only reliable reading.
- **The Work In Progress work-order number is a link on this build** — every row carries
  `link_wip_wo_<id>`. Recorded because [SV-8967](https://shopview.atlassian.net/browse/SV-8967) says
  it is plain text and 3 cases point at that ticket. **This is an observation, not a verdict** — the
  pass/fail call is the tester's, and the ticket is OBSOLETE so the marker question is open (§4).
- **The `⋯` download menu on Work In Progress opens and offers exactly two items** — `Download (PDF)`
  and `Download (CSV)` (`action_wip_export_pdf`, `action_wip_export_csv`).

---

## 4 · STILL OPEN FROM THE PREVIOUS PASS — the 57 bulk-closed tickets, and it now has a second instance

Unchanged and still needing your decision: **57 defect tickets were set to OBSOLETE in a two-minute
sweep on 9 August**, and **75 of our 480 cases** carry `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`
pointing at them. I have **not** touched any of those 75 markers — a ticket's status is not evidence
about the build.

**I re-read three of those tickets live today** and the picture is unchanged: **SV-9074 is `In
Progress`** (live, and its gap reproduces), **SV-8954 is `OBSOLETE`** and its gap **still reproduces
and is wider than the ticket says**, **SV-8907 is `OBSOLETE`** and was genuinely fixed.

**The second instance this pass adds:** the marker convention says an EXPECT FAIL marker needs live
backing, and **a closed ticket does not back one**. On that reading, **most of those 75 markers have
no live backing today** and should arguably come off so the tester simply discovers the result. That
is a change to 75 cases on the eve of release and **I have not made it** — it is your call, and it is
the single largest open question on this suite.
