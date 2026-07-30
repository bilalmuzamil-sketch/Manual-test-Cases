# DEV TICKET — Sales By Customer report is gated by its own permission; the PO has ruled it must open on ordinary reports access

> **FILED IN JIRA: [SV-8780](https://shopview.atlassian.net/browse/SV-8780)** — Story Defect under
> **SV-8598**, epic **SV-8582**. Created 2026-07-30, verified by re-reading the issue back.
> See §"Filing record" at the bottom.

---

## Summary (one line)

Sales By Customer is gated by a dedicated `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` permission, but the
PO has ruled twice that every Report Suite report must open on the ordinary reports permission —
please drop the dedicated gate.

---

## Description

The product owner for the Report Suite, **Chris Ward**, has now stated **twice** that every report
in the suite should open for anyone who has the ordinary "can this person see reports" access, and
that **no report should need a permission of its own**.

The Sales By Customer report is the one exception in the design as it stands: it is given its own
separate permission. So the build (and the spec text it was built from) does not match the product
owner's decision.

This is **not a malfunction** — the report works, and engineering built exactly what the Sales By
Customer spec asked for at the time. The spec has simply been overtaken by a newer product ruling.
The ask is a change: gate Sales By Customer the same way the other five reports are gated.

There is a second, smaller piece of work attached to it: the Sales By Customer spec still says the
opposite of the ruling, so the spec text needs correcting too (that part is Chris's, not
engineering's).

---

## The requirement, quoted with its source and date

**1. The product owner's ruling — the newest authoritative source, so it wins.**

Asked on 2026-07-30: *"Which should it be — the normal reports permission for everything, or the
separate permission that is built today?"* (A = change it to ordinary reports access, engineering
adjusts the build · B = keep the separate permission that is built today.)

> **"A - the intention is to not hide these from normal reports access. These were specced before
> CRP was built :)"**
> — **Chris Ward, Product Owner, 2026-07-31** (answer to Q4 of the Report Suite tech-plan question
> sheet; source of record `build/report-suite/chris-answers-2026-07-31/answers-ingested.md`)

("CRP" = Custom Roles & Permissions. His point: the Sales By Customer spec was written before Custom
Roles existed, which is why it invented a permission of its own.)

He said materially the same thing on **2026-07-28**: *"these should be gated by normal reports
access."* The question was deliberately re-asked on 2026-07-30 with the engineering plan's own
citations in front of him, and he did not move.

**2. What the spec still says — the older source, now overruled.**

> **"S1-R2: The report is gated by a dedicated Sales By Customer report View permission — it is not
> tied to a generic 'all reports' permission."**
> — **Sales By Customer Report spec, live version 12, last updated 2026-07-29**, Story 1
> (Confluence page 577634305; local copy
> `build/report-suite/spec-current-2026-07-31/Sales-By-Customer-Report-current.md` line 125)

**3. What the engineering plan builds — the behaviour this ticket is about.**

> **"Dedicated view permission (SV-5319 model, must land in one commit or `be-permission-drift` CI
> fails): atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`, bundle decision (43rd bundle vs ride existing
> — product call), FEPermissionMappings, IntentionalAtomChanges, seeder CLIs, FE bundleCatalog.ts.
> Every SBC endpoint gates on the new atom via `#[IsGranted]`, NOT `ROLE_REPORT_VIEW`."**
> — **Engineering tech plan §B5.3 / story SV-8598**, as ingested 2026-07-27
> (`build/report-suite/epic-sv8582/requirements-SV-8598.md` line 20)

The plan itself flagged the bundle placement as *"a product-level decision to surface"* — i.e. it
expected the PO to make this call. **He has now made it.**

**4. Why the ruling outranks the spec text.** Standing Rule 32 — the most recent authoritative
product source wins. The ruling is dated **2026-07-31**; the spec sentence is dated **2026-07-29**.
Standing Rule 33 — a PO ruling is the top tier of authority. Both point the same way.

---

## Steps to reproduce

*(Written to be run once a Report Suite build is available — see "Evidence basis" below. Nothing
here has been observed on a running build yet.)*

1. Sign in to the ShopView App as a user whose role has the **ordinary reports access** (the
   standard "can this person see reports" setting) and **no** report-specific permission. Create a
   throwaway `ZZAUTOTEST` custom role for this if one does not exist, and restore it afterwards.
2. Open the **Reports** area from the main navigation.
3. Look through the **Performance** group in the left-side navigation for a **"Sales By Customer"**
   entry.
4. If it is not listed, copy the report's direct page address from a permitted session and paste it
   into the browser to try to open it directly.
5. Now compare against any one of the other five reports (Sales By Representative, Parts Velocity,
   Technician Utilization, Work In Progress, Inventory Value) with the same user — those should
   open on the same ordinary reports access.

---

## Expected

- **"Sales By Customer" is listed** in the Reports navigation for a user with ordinary reports
  access, and the report **opens and shows its data**.
- **Ordinary reports access alone is enough.** There is no separate Sales By Customer permission
  that has to be granted on top.
- Sales By Customer behaves like the other five reports in the suite — one consistent permission
  model across the whole Report Suite.
- A user **without** reports access still cannot see or open it (that part is unchanged).

## Actual

- Sales By Customer is gated on a **dedicated permission atom
  `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`**, applied to **every** Sales By Customer endpoint via
  `#[IsGranted]`, explicitly **not** `ROLE_REPORT_VIEW`.
- Therefore a user with ordinary reports access is expected **not** to see or open the report until
  an administrator additionally grants them that report-specific permission.
- The Report Suite ends up with a **mixed permission model**: five reports on ordinary reports
  permissions, one on a permission of its own.

---

## Evidence basis — read this before triaging

**This is SPEC-DERIVED AND PLAN-DERIVED, NOT LIVE-OBSERVED.** Stated plainly per Standing Rule 12:

- **No part of the behaviour above has been observed on a running build.** The Report Suite **QA
  branch / environment is not available to QA yet** (branch `project/reports-suite-bravo`; open
  question OQ-3 on the project).
- The "Actual" section is taken from the **engineering tech plan for story SV-8598 (§B5.3)** and
  from **SBC spec v12 `S1-R2`**, both quoted verbatim above. It is what the build is **specified and
  planned** to do, not something we watched happen.
- **The permission behaviour must still be confirmed live when the branch exists.** If, when it is
  checked live, Sales By Customer already opens on the ordinary reports permission, then this ticket
  is already satisfied and can be closed as such — please say so rather than treating our word as
  the observation.
- Nothing here is inferred from source code we have read.

**Standing Rule 24 check — deliberately performed before filing, and this is NOT a Rule 24 pass.**
Rule 24 says that when the **front end blocks** an action but the **back end / API still allows**
it, the test is a PASS and no defect is filed. That pattern does **not** apply here, in either
direction:

- This is not front-end-only gating. The plan states **every** Sales By Customer **endpoint** gates
  on the atom via `#[IsGranted]` — the back end enforces it too.
- The direction is the opposite of the Rule 24 pass case: the build is **more restrictive** than the
  product wants, not more permissive. It is not the Rule 24 inverse either (the front end is not
  exposing something it should hide).
- So what remains is a genuine **product-conformance mismatch** against the newest authoritative
  ruling — which is a legitimate change/defect to raise.

---

## Affected test cases

All three are authored to Chris's ruling, so **they will fail on purpose** against a build that
still enforces the dedicated permission. Each already carries a plain note telling the tester this
is a known pending build change and not to edit the case.

| Internal ID | TestRail ID | Link | Title | What it asserts |
|---|---|---|---|---|
| **SBC-PERM-01** | **C30098** | https://shopview.testrail.io/index.php?/cases/view/30098 | Ordinary reports access opens Sales By Customer — no separate permission | **This is the one that fails.** A user with ordinary reports access sees the entry and the report opens. |
| **SBC-NAV-01** | **C30096** | https://shopview.testrail.io/index.php?/cases/view/30096 | Sales By Customer listed under Performance, below existing links; titles correct | **Also fails**, because its precondition is a role with only ordinary reports access — the tester never reaches the navigation check. |
| **SBC-PERM-02** | **C30099** | https://shopview.testrail.io/index.php?/cases/view/30099 | Without reports access, Sales By Customer is not listed and cannot open | **Being precise: this one probably still passes.** A user with no reports access is blocked either way, so the two observable steps pass. Only its stated expectation that *"there is no separate Sales By Customer permission to remove"* is affected. |

Being accurate about that third case matters: the honest count is **two cases that fail on today's
planned build, and one whose wording (not its outcome) depends on this change.**

The tester-facing note carried on each case reads:

> *"Note for the tester: the product owner has ruled that every report in this suite opens with the
> ordinary reports access. If the build still demands a separate Sales By Customer permission, mark
> this test Failed and report it as the known pending change — do not change the test."*

---

## Severity suggestion

**Medium.**

Reasoning:

- **Not High:** nothing malfunctions, no data is wrong, no money is miscalculated, and nothing is
  exposed to someone who should not see it. If anything the build is *safer* than intended.
- **Not Low:** if it ships as-is, every organisation has to grant an extra permission, role by role,
  before anyone can see a report the PO intends to be visible on ordinary reports access — so real
  users will report "I can't see the new report". It also leaves the suite with an inconsistent
  permission model, which is the kind of thing that generates support tickets long after release.
- It is also **cheap to fix now and awkward to fix later**: once the atom ships it is in customers'
  role configurations, and removing it becomes a migration rather than a code change.

---

## Where it belongs

- **Epic: SV-8582** — "Reporting Suite — Technician Utilization, Sales By Customer, Sales By
  Representative, Inventory Velocity, Inventory Value, WIP". **Verified live in Jira** (project SV,
  type Epic, status Open) rather than assumed.
- **Story: SV-8598** — "[Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission"
  (status Open, parent SV-8582). **This is the precise home**: it is the story that builds the
  dedicated permission, and its own title names it.
- **Filed as a "Story Defect" subtask under SV-8598**, which is how this project types a defect
  against a story's acceptance (`Story Defect` is a subtask type in project SV; precedent: SV-8456).
- **Why not Custom Roles (SV-7388):** the change is to how the Report Suite's own report is gated,
  built by the Report Suite squad on branch `project/reports-suite-bravo`. Custom Roles would only
  own it if an atom were being **added** to the permission matrix; here one is being **removed**.
  A follow-up may be needed on the Custom Roles side to make sure the retired atom does not linger
  in the role matrix — noted, not assumed.
- **Related story:** SV-8600 ("SBC - Story 1 - Report access and navigation placement") is the story
  our three test cases are referenced to.

**Duplicate check:** searched project SV for existing Sales By Customer permission tickets before
filing — no existing ticket covers this. The nearest relative is **SV-8324** ("Return Permission
Dependencies in Build Do Not Fully Match the Custom Roles Specification", Done), which is the same
*class* of finding but a different subject.

---

## Also needed, from Chris (not engineering's part)

**SBC spec `S1-R2` still states the opposite of his own ruling** and should be corrected, otherwise
the next person to read the spec will rebuild the dedicated permission. Flagged to him separately.

## One open question, not blocking this ticket

The other five reports each cite a **different existing per-area reports permission** (Inventory
Reports → View for Parts Velocity and Inventory Value; the timesheet-reports permission for
Technician Utilization; the Work In Progress reports permission). Those are all ordinary reports
permissions, so Chris's stated intent is already met — but whether he wants them **collapsed into a
single Reports permission** was never asked and is not answered. Those cases have **not** been
changed. It is queued as question 5 on the open Chris sheet
(`build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-31.md`).

---

## Filing record

| | |
|---|---|
| **Issue** | **[SV-8780](https://shopview.atlassian.net/browse/SV-8780)** |
| Type | Story Defect (subtask) |
| Parent story | SV-8598 |
| Epic | SV-8582 |
| Project | SV |
| Created | 2026-07-30 |
| Reporter | Bilal Muzamil (QA) |
| Status on creation | Open |
| Verified | Yes — the issue was re-read back from Jira after creation (`GET /rest/api/3/issue/SV-8780`) and its summary, description, parent and epic confirmed |
| How it was filed | Atlassian REST v3 with the live browser-login session cookies from `/tmp` (per `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`); no secrets recorded in this repo |

---

## OUTSTANDING — what I need from you

| # | What I need | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Nothing to file** — SV-8780 is filed and verified. No action needed from you on the filing itself. | — | — | — |
| 2 | **A QA branch / environment for the Report Suite** (plus its feature-flag state) | Dev / you | Everything in this ticket is spec-derived. Until we can drive a build, we cannot confirm the dedicated permission actually behaves as the plan says, and the whole 474-case Report Suite suite stays VIU-Pending | 2026-07-22 |
| 3 | **Chris to correct SBC spec `S1-R2`** so it matches his own 2026-07-31 ruling | Chris Ward | Whoever reads the spec next will rebuild the dedicated permission | 2026-07-31 |
| 4 | **Chris's answer to question 5** on the 2026-07-31 sheet (should the five other reports' per-area reports permissions be collapsed into one?) | Chris Ward | 9 permission cases across Parts Velocity, Inventory Value and Sales By Customer stay as authored, hedged on the per-area qualifier | 2026-07-31 |

---

*Draft written 2026-07-30. Sources quoted verbatim from the live SBC spec v12, the SV-8598
engineering plan ingest, and Chris Ward's 2026-07-31 answer sheet. Test-case wording read live
(read-only) from TestRail. **No test case was edited and nothing was written to TestRail.***
