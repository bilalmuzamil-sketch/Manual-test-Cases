# Are any of the three held candidates ready to be filed? — the four gates, run before the button

**Asked by the QA lead, 21 September 2026.** Three candidates came out of the 129-check re-run and
were held unfiled under Rule 113. Each was put through the same pre-flight that killed the two
candidates in `run415-execution/close-out-2026-09-21/TICKET-DECISION-2026-09-21.md`:

| Gate | What it requires |
|---|---|
| **Rule 62-c** | it still reproduces on the build **as it stands today** |
| **Rule 106** | the case's **Expected** · the **source as it reads today** · the **build observed** — reconciled three ways |
| **Rule 112** | the **owning story** is live in **Ready for QA** or **Testing QA**, read live |
| **Rule 97** | Jira and the repo searched — nothing already covers it |

Build marker for every measurement below: **`v26.36.8-d146c39`** (sv9160, read off the served page
in the same browser session that took the readings). Source: PRD page **576978945 v17** (v1.5 in the
body), last edited 2026-09-08, fetched this pass to
`source-verify-2026-09-21/spec-576978945-2026-09-21.txt` — **one gated read for the whole pass**
(Rule 81), every case checked against that single live read.

**Result: ONE of the three is ready. Two are not, and one of those two would have been a false
defect against a product that is behaving correctly.**

---

## 1 · C53476 — the "All" tab counts past the documented limit → **READY, once he names the owning story**

[C53476](https://shopview.testrail.io/index.php?/cases/view/53476) · run 415 test 2868064 ·
[run](https://shopview.testrail.io/index.php?/runs/view/415)

**Source, verbatim, as it reads today** — PRD 576978945 v17, §5.2 (line 71 of the fetched text):

> *"Counts are capped at 20. No count in the modal reads higher than 20 — not a tab, not a group
> header, not the Show all N link. A query matching 34 work orders shows Work Orders (20) and Show
> all 20. Twenty is both what search returns per entity type and what it reports."*

**Case Expected** — asserts exactly that, in the same words. ⇒ **case agrees with source.**

**Build observed** (`/tmp/gs/verify53476.mjs`, screens `v53476-ZZ.png`, `v53476-ZZAUTOTEST.png`):

| Query | All tab | Read out to a screen reader | Per-entity tabs |
|---|---|---|---|
| `ZZ` | **All (111)** | *"111 results found across 8 categories"* | all correctly capped — Work orders (20) · Customers (20) · Assets (20) · Parts (20) · Vendors (11) · Part sales (9) · Purchase orders (6) · Vendor invoices (5) |
| `ZZAUTOTEST` | **All (61)** | *"61 results found across 8 categories"* | Work orders (20) · Customers (14) · Assets (9) · Parts (4) · Vendors (3) · Part sales (3) · Purchase orders (4) · Vendor invoices (4) |

**The fault is precisely scoped: the per-entity cap works; the All tab does not carry it.** The All
figure is the arithmetic sum of the already-capped per-entity counts — 20+20+20+20+11+9+6+5 = 111,
and 20+14+9+4+3+3+4+4 = 61.

**Precision about the second column:** the *"N results found across 8 categories"* line is a
visually-hidden element (`position:absolute; clip:rect(0,0,0,0)`) — it is **not on screen**, it is
what a screen reader announces. It carries the same uncapped number. **The visible fault is the All
tab alone**; the announcement is named in the ticket as a second place the same number appears, not
as a second defect.

**⇒ Case agrees with source, build differs ⇒ real defect, ask to file.** (Rule 106 outcome 2.)

**The developer's likely answer, pre-answered:** *"All is a total, so of course it sums."* The spec
does not leave that open — it names the tab explicitly (*"not a tab"*) and its own worked example
prints a capped figure. §5.6 line 142's *"in the All view results are not capped per group"* is
about how many **rows** a phone scrolls through, not about what a **count** reads, and it is in the
Mobile section; this was measured on the desktop modal §5.2 governs.

**Instrument** — playbook traps applied: the All tab was clicked explicitly before each read (trap 1);
rows counted unfiltered (trap 3); three identical reads required with the counts present (trap 4).
Row rendering is correct (8 groups × 5 rows = 40 for `ZZ`), so this is a counting fault only.

**Nothing in Jira covers it.** Searched `text ~ "cap"`, `~ "20"`, and every Story Defect under all
ten epic stories. The nearest neighbour is **SV-10159** (*"Show all N" link missing from group
headers*, In Progress) — a different fault, and it is why the `Show all N` column above is empty.

### 🔴 The one thing he must decide: **which story owns it**

Rule 112 permits a Story Defect only against a story in **Ready for QA** or **Testing QA**.

| Story | Status (read live 21 Sep) | Fit |
|---|---|---|
| **SV-9169** — FE — Scope tab strip with **live counts**, grouped results | **OBSOLETE / Done** | the natural owner — **barred by Rule 112** |
| **SV-9174** — FE — Integration: wire the modal to /api/search … | **TESTING QA** | its own description names ***"Spec: … §8 Functional requirements"***, and §8 carries *"show result counts on tabs and group headers, capped at 20"* — **recommended** |
| **SV-9162** — BE — GET /api/search … grouped and ranked | **Ready for QA** | permitted, but the counts are rendered by the front end |

No successor story for the tab strip exists — the whole epic was listed and checked.

---

## 2 · C55716 — the recency tie-break → **NOT READY: I cannot prove the precondition**

[C55716](https://shopview.testrail.io/index.php?/cases/view/55716) · run 415 test 3051908

**Source, verbatim** — §6.1, line 177: *"The score is clamped to a sane range; ties are broken by
recency (most recently updated wins)."* The case's Expected matches it.

**It reproduces** (`/tmp/gs/verify55716.mjs`, build `v26.36.8-d146c39`) and the confounders were
held equal this time — which is more than the withdrawn SV-10277 got:

- both fixtures return **zero work orders**, so the Customer signals *≥1 open WO (+0.20)* and
  *open-WO count (+0.15)* are equal at nothing, and neither row shows an open-count badge;
- **both records were opened** before the rounds, so *viewed in last 7 days (+0.10)* is equal;
- identical address and identical match shape, so match quality is equal;
- the index demonstrably picks up a write to this exact record — a rename showed in the panel in
  **15 s** (positive control, `fix55716d.log`);
- three reads after each write, 15 s apart; **the order never moved.**

**What kills it:** the precondition *"one was updated more recently than the other"* **cannot be
established**. `POST /api/customers/change` returns 200, but **no customer payload on this branch
carries any last-updated field** — not the list, not `/api/customers/view/{id}` (every key was
listed; there is no `updated_at`, `modified_at` or equivalent). And §6.1 itself says of this entity:
*"There is no created-date signal and no migration to add one — the company table carries no
creation date."*

So *"the tie-break is not applied"* and *"a customer has no stored update time for a tie-break to
read"* produce **identical observations**, and I cannot tell them apart. Rule 104's seventh proof —
*what would make this my fault?* — is unanswered. Filing it invites the same one-day reversal
SV-10277 got, in the same area, from the same reviewer, **three days ago**.

**What would make it ready:** re-run the tie-break on an entity that (a) has no update-recency term
of its own in §6.1 and (b) exposes an observable last-updated time. Nothing on this branch met both.
The honest alternative is a product-owner question: **does the tie-break apply to Customers at all,
given the company table carries no dates?** — which is a §6.1-versus-§6.1 conflict, i.e. Rule 58 /
Rule 96 territory, not a ticket.

---

## 3 · C44861 — the missing count badge → **NOT READY: this would have been a FALSE defect**

[C44861](https://shopview.testrail.io/index.php?/cases/view/44861) · run 415 test 2723931

**Case Expected, two sentences:**
1. *"After closing, the header search field still shows the last query 'Fibridge' as plain text."*
2. *"A small count badge (for example '1') is shown beside the persisted query."*

**Source as it reads today** — PRD 576978945 v17 §5.2, line 74, in full:

> *"Persisting search. When the modal closes (either by Esc or by navigating to a result), the most
> recent query string is preserved in the header search field as plain text. Reopening the modal
> restores the query, the scope tab, and the result list, and pre-selects the query text so that
> typing replaces it."*

and §8, line 192: *"persist the last query in client state and rehydrate and pre-select it on
reopen"*. **Neither mentions a badge.** The whole fetched page was searched for one; the only count
badges it defines are the Customer row's open-WO badge (§4) and the part stock badge (§5.3).

**Where sentence 2 actually came from:** `build/global-search/design-notes.md` §9, a **Figma capture
dated 2026-07-16** — *"the entered term PERSISTS in the search field, shown with a small count badge
('1') beside it"*. The same design note also has the dropdown **staying open** with a **clear (×)
button**, both of which the PRD has since replaced with *"the modal closes … reopening restores"*.

**PRD v1.5 was last edited 2026-09-08; the design capture is 2026-07-16.** Latest wins (Rule 32), so
the governing requirement is the plain-text sentence — **and the build does exactly that.**

**⇒ Rule 106 outcome 4: the case disagrees with the source and the build matches the SOURCE. This is
a false defect and the product is right.** No ticket, on any story — and the Rule 112 gate would
have stopped it anyway, since **SV-9172 is QA Complete**.

**What it is instead:** a source divergence between the PRD and the July design, which under Rule 57
is *"a finding to raise, never a side to pick silently"*. **Rule 114 bars me from editing the
Expected**, so it is reported and left, and the wording question goes to him with C55736/C55737.

---

## What was written where

- Run 415 comments for all three tests carry this reconciliation (Rule 113's prepared comment, minus
  a ticket number for the one that is ready).
- Annotated picture for the ticket: `rerun-2026-09-21/TICKET-53476-all-tab-count.png`.
- Screens: `rerun-2026-09-21/v53476-modal-2x.png`, `v53476-ZZ.png`, `v53476-ZZAUTOTEST.png`, `v55716-rows-before.png`,
  `v55716-rows-bothviewed.png`, `v55716-roundA.png`, `v55716-roundB.png`.
- Probes: `/tmp/gs/verify53476.mjs`, `/tmp/gs/verify55716.mjs`, `/tmp/gs/verify55716b.mjs`,
  `/tmp/gs/tsprobe.mjs` — copied beside the evidence.
