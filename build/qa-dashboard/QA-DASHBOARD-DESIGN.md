# ShopView QA Team — Jira Dashboard Blueprint

**Site:** https://shopview.atlassian.net · **Project:** SV (ShopView)
**Prepared:** 2026-07-09 · **Owner:** Bilal Muzamil
**Purpose:** One dashboard for management showing QA workload, per-tester activity,
throughput (daily / weekly / monthly), and quality signals.

Everything below was verified against the live SV project on 2026-07-09:
the workflow statuses, the **QA Assignee** custom field, and every JQL query
pattern were executed and returned results. Counts on that day: 15 tickets in
"Ready for QA", 36 tickets in the two TESTING statuses.

---

## 1. Facts about our Jira this design is built on (verified live)

- **Workflow statuses seen in SV:** Open · In Progress · Code Review · Blocked ·
  Ready to Fix · Merged to Staging · Ready for QA · **TESTING QA** ·
  **TESTING STAGE** · REJECTED FROM TESTING · Ready for Production · Done · OBSOLETE.
- **The ticket assignee stays with the DEVELOPER even while QA is testing.**
  (Verified: tickets in TESTING statuses are assigned to Milomir, Parth, etc.)
  So per-QA reporting must NOT use the normal Assignee field.
- **We have a dedicated `QA Assignee` custom field** (multi-user picker,
  `customfield_10385`) and it is actively used. This is the correct dimension for
  all "per QA member" widgets. Related QA fields that also exist: `QA Severity`,
  `QA Test Plan`, `QA Branch`, `Regression Version`.
- **QA team members found in the QA Assignee field (last 60 days):**
  Bilal Muzamil, Ayesha Khan, Mudassir Qamar, Viktoria Videnovic,
  Nebojsa Glavinic, Ahtasham Amjad.
  *(Adjust this list in every filter if the team changes.)*
- **History-based JQL works on our instance** (`status CHANGED TO … AFTER …`),
  which is what powers the daily/weekly/monthly completed widgets.

### Status meanings assumed (confirm once, adjust JQL if different)
| Status | Meaning assumed |
|---|---|
| Ready for QA | Ticket waiting in the QA queue (nobody testing it yet) |
| TESTING QA | QA member actively testing on the QA environment |
| TESTING STAGE | QA member actively verifying on Staging |
| REJECTED FROM TESTING | QA failed the ticket, back to dev |
| Ready for Production / Done | Passed QA (QA is finished with it) |

---

## 2. The four widgets you asked for — exact recipes

> **First create the saved filters in §4, then add gadgets pointing at them.**
> Every gadget below is a standard Jira Cloud dashboard gadget (no paid apps).

### Widget 1 — Total tickets pending for the whole QA team
- **Filter:** `F1 – QA Queue (pending)`
- **Gadget:** *Filter Counter* (if available in the gadget list) — big single
  number. Fallback: *Issue Statistics* on F1 grouped by Status (shows the count).
- Optional second number: `F2 – Pending staging verification` (tickets that
  passed QA-env testing and now wait for the staging check).

### Widget 2 — Tickets in progress by each QA member
- **Filter:** `F3 – In testing now`
- **Gadget:** *Two Dimensional Filter Statistics* — X-axis **QA Assignee**,
  Y-axis **Status** (shows who is testing what, split by TESTING QA vs
  TESTING STAGE).
- ⚠️ **If "QA Assignee" does not appear in the gadget's field dropdown** (Jira
  Cloud sometimes cannot group by a *multi*-user picker), use **Plan B**: one
  *Filter Counter* / *Filter Results* gadget per QA member using the per-member
  filters `F3a…F3f` (§4). Six small counters in a row read just as well.

### Widget 3 — QA-completed tickets by each QA member
- **Filter:** `F4 – QA completed (all time / this month)`
- **Gadget:** same Two-Dimensional / per-member counter approach as Widget 2.
- "QA complete" is defined as: **the ticket left the TESTING statuses into
  Ready for Production / Done** (i.e. QA passed it). Rejected tickets are
  counted separately in Widget 6 — do not mix them.

### Widget 4 — Completed per QA: daily vs weekly vs monthly
Native Jira gadgets cannot put three time-buckets in one chart, so use a
**row of three identical gadgets** (this is the standard pattern):
- **Gadget A:** *Issue Statistics* on `F5 – QA completed TODAY`, grouped by QA
  Assignee (or per-member counters, Plan B).
- **Gadget B:** same on `F6 – QA completed THIS WEEK`.
- **Gadget C:** same on `F7 – QA completed THIS MONTH`.
Management reads it left-to-right: today → week → month.
For a *trend line* over time, add the *Created vs Resolved* gadget (§3, item 8).

---

## 3. What ELSE to put on it (management-grade additions)

These are the metrics managers usually ask for next; all are buildable with the
filters in §4 today, except where marked:

1. **QA queue aging** — *Average Age* gadget on F1. Shows if the pending queue
   is getting stale. Add `F8 – Stuck in queue > 3 days` as a red-flag list.
2. **Rejected / bounced tickets this week** (`F9`) — how many tickets QA sent
   back to dev. This is the QA team's "defects caught" headline number.
3. **First-time pass rate** — passed (F6) vs rejected (F9) side by side; the
   ratio tells management how healthy dev hand-offs are.
4. **Bugs raised by each QA** (`F10`) — *Issue Statistics* grouped by
   **Reporter** (reporter grouping is natively supported). Shows each tester's
   find-rate, not just their ticket throughput.
5. **Open bugs by priority / QA Severity** (`F11`) — pie chart. Management
   always wants "how many criticals are open".
6. **Blocked tickets** (`F12`) — list gadget; blockers are what management can
   actually unblock for you.
7. **Unassigned QA work** (`F13`) — pending tickets with an empty QA Assignee;
   catches tickets nobody has picked up.
8. **Created vs Resolved trend** — *Created vs. Resolved Chart* gadget on the
   bug filter (F11 base). The classic "are we drowning or draining" chart.
9. **Workload balance** — the Widget 2 gadget already shows this; call it out
   verbally in reviews (one tester with 12 in-test tickets vs another with 2).
10. **Escaped defects (production bugs)** — needs a convention first: label
    production-reported bugs (e.g. `prod-escape`) or use an "Environment"
    field. Once labeled: `labels = prod-escape AND created >= startOfMonth()`.
    This is THE quality metric management ultimately cares about.
11. **Time-in-QA cycle time** — average days from "Ready for QA" to "Done".
    Not possible with native gadgets; needs a Marketplace app (eazyBI, Time in
    Status) or a periodic export. Park it as phase 2.
12. **Regression version coverage** — we already stamp `Regression Version`;
    a pie on that field shows how much of the current regression is swept.

---

## 4. Saved filters — copy-paste JQL

> Create via **Filters → View all filters → Create filter**, paste the JQL,
> **Save as** the name shown, then **share each filter** with the org/project
> (a dashboard shared with management shows *their* permissions — unshared
> filters render as errors for them).

QA team list used below (edit in one place when the team changes):

```
"QA Assignee" in ("Bilal Muzamil", "Ayesha Khan", "Mudassir Qamar", "Viktoria Videnovic", "Nebojsa Glavinic", "Ahtasham Amjad")
```

| # | Filter name | JQL |
|---|---|---|
| F1 | QA Queue (pending) | `project = SV AND status = "Ready for QA" ORDER BY created ASC` |
| F2 | Pending staging verification | `project = SV AND status = "Merged to Staging" ORDER BY updated ASC` |
| F3 | In testing now | `project = SV AND status in ("TESTING QA", "TESTING STAGE")` |
| F4 | QA completed this month | `project = SV AND "QA Assignee" is not EMPTY AND status CHANGED FROM ("TESTING QA", "TESTING STAGE") TO ("Ready for Production", "Done") AFTER startOfMonth()` |
| F5 | QA completed TODAY | same as F4 with `AFTER startOfDay()` |
| F6 | QA completed THIS WEEK | same as F4 with `AFTER startOfWeek()` |
| F7 | QA completed THIS MONTH | alias of F4 |
| F8 | Stuck in queue > 3 days | `project = SV AND status = "Ready for QA" AND NOT status CHANGED AFTER -3d` |
| F9 | Rejected from testing this week | `project = SV AND status CHANGED TO "REJECTED FROM TESTING" AFTER startOfWeek()` |
| F10 | Bugs raised by QA this month | `project = SV AND issuetype in (Bug, "Story Defect") AND reporter in ("Bilal Muzamil", "Ayesha Khan", "Mudassir Qamar", "Viktoria Videnovic", "Nebojsa Glavinic", "Ahtasham Amjad") AND created >= startOfMonth()` |
| F11 | Open bugs by priority | `project = SV AND issuetype in (Bug, "Story Defect") AND statusCategory != Done ORDER BY priority DESC` |
| F12 | Blocked | `project = SV AND status = Blocked` |
| F13 | Pending with no QA assignee | `project = SV AND status = "Ready for QA" AND "QA Assignee" is EMPTY` |

### Per-member variants (Plan B, and for personal views)
For each QA member `X`, three filters (used by the counter-row layout):

```
F3x – In testing – X:      project = SV AND status in ("TESTING QA", "TESTING STAGE") AND "QA Assignee" = "X"
F6x – Done this week – X:  project = SV AND "QA Assignee" = "X" AND status CHANGED FROM ("TESTING QA", "TESTING STAGE") TO ("Ready for Production", "Done") AFTER startOfWeek()
F7x – Done this month – X: same with AFTER startOfMonth()
```

*(Jira autocompletes the display names to account IDs when you type them in
the filter editor — accept the suggestion.)*

**Alternative "who actually clicked the button" variant:** if the QA Assignee
field is ever left empty, you can attribute completions by who performed the
transition instead: `status CHANGED TO ("Ready for Production", "Done") BY "X"
AFTER startOfWeek()`. Slightly stricter, works without the custom field.

---

## 5. Dashboard layout (top to bottom)

**Name:** `QA Team Dashboard` · Share: your management group + QA team.

| Row | Left column | Right column |
|---|---|---|
| 1 — Headline | Filter Counter: **F1 pending** · Counter: **F2 staging-pending** | Counter: **F12 blocked** · Counter: **F13 no QA assignee** |
| 2 — Who's doing what | Two-Dimensional: **F3** (QA Assignee × Status) | Two-Dimensional: **F4** completed this month per QA |
| 3 — Throughput | Issue Statistics: **F5 today** · **F6 week** · **F7 month** (three gadgets side by side) | Created vs Resolved chart (bugs) |
| 4 — Quality | Pie: **F11** open bugs by priority (or QA Severity) | Issue Statistics: **F10** bugs raised per QA (group by Reporter) |
| 5 — Risk / hygiene | Filter Results: **F8** stuck > 3 days | Filter Results: **F9** rejected this week · Average Age on **F1** |

## 6. Build steps (10 minutes)

1. Create the 13 shared filters in §4 (plus per-member variants only if Plan B
   is needed).
2. **Dashboards → Create dashboard** → name `QA Team Dashboard` → share it.
3. **Add gadget** → add each gadget from §5, point it at its filter, set the
   grouping field, save.
4. Test the Two-Dimensional gadget with **QA Assignee** first — if the field
   is missing from its dropdown, switch rows 2–3 to the per-member counter
   layout (Plan B).
5. Set each chart gadget's refresh to 15 min; drag gadgets to match §5.
6. Walk the team through one rule: **every ticket you pick up must have you in
   QA Assignee** — the whole dashboard keys off that field (F13 catches misses).

## 7. Known limitations / phase 2

- Multi-user grouping caveat (§2 Widget 2) — Plan B covers it.
- Daily/weekly/monthly are three snapshots, not one trend line; a real
  per-tester trend needs eazyBI / Time in Status (paid apps) or a scheduled
  export.
- Time-in-QA cycle time and escaped-defect tracking need the phase-2 items in
  §3 (items 10–11).
- F4/F5/F6 count a ticket for its QA Assignee even if someone else clicked the
  final transition; use the `BY "X"` variant if that ever matters.
