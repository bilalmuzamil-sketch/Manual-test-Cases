# Report Suite — FINDINGS, final pass 2026-08-05

**Build observed:** `v3.5-16cf83f` · last-modified Wed, 05 Aug 2026 06:40:32 GMT ·
etag `177c59546701e7810b894492dabc1423` · `index.html` sha256 `67932a75b5a3a11d…` —
**byte-identical at 13:20:39Z and 13:55:25Z**, so nothing redeployed under this pass.

**⚠️ The branch is still NOT declared final. Every verdict here is PROVISIONAL** (Rule 49) and is queued
in `RECHECK-QUEUE.md`.

---

## 1 · WHAT THIS PASS DID, AND WHAT IT DID NOT DO — read this first

**Honesty before content (Rules 12 / 17 / 50).** The pass was re-scoped mid-flight when the QA lead found
that we had been treating build behaviour as expected behaviour. That correction took priority over the
live sweep, and it is the right priority: a case whose expected result describes the build **cannot fail**,
so verifying it against the build would have proved nothing.

| Asked for | Status |
|---|---|
| The expected-behaviour audit of all 473 | **DONE** — `../expected-behaviour-audit-2026-08-05.md` |
| Repair every build-derived expectation | **DONE** — 42 cases repaired, all byte-verified |
| Markers on all 473 | **DONE** — 473 of 473 |
| Source currency for all six specs + the epic | **DONE** — two specs had moved, both diffed |
| Live VIU of **all** 473 cases with per-case evidence | **NOT DONE.** Substantial live evidence was captured (§3) and it settles a number of contested points, but **it is not a per-case observation of all 473.** The 2026-08-04 verdicts stand as PROVISIONAL and two builds old. **I am not presenting this pass as a complete VIU.** |
| Seed the missing-logo state | **DELIBERATELY NOT DONE** — see §5. The reason is not "blocked"; it is that the organisation is shared with two other live workers, and the requirement has since been settled in writing anyway. |

---

## 2 · SOURCE CURRENCY — the headline is that the specs moved under us

Full detail in `SOURCE-CURRENCY.md`. In one table:

| Spec | Baseline | Live | Verdict |
|---|---|---|---|
| Sales By Customer | v13 | **v14** (saved **13:07:07Z today**) | STALE → diffed, **9 semantic changes + 1 new anchor** |
| Parts Velocity | v4 | **v5** (saved **13:21:40Z today**) | STALE → diffed, **1 real change** (S1-R4 permission model) |
| Sales By Representative · Technician Utilization · Work In Progress · Inventory Value | v15 · v5 · v6 · v3 | unchanged | CURRENT |

**Chris Ward was editing the specifications while this pass ran** — Parts Velocity v5 was saved one minute
before I fetched it. He is applying our own QA review workbook, and four of the things our cases and
questions were waiting on are now written down: the access-gate Location rule, the load-failure logo rule,
the nine-preset date picker, and the removal of Print.

**Epic SV-8582:** 105 children, verified two ways with equal key sets. Our record said 102; the difference
is **the three tickets we filed ourselves yesterday**. One story-defect subtask (SV-8780, Ready to Fix).
**SV-8819 is now `Done` — a fix shipped**, and **SV-8821 is `OBSOLETE`**.

---

## 3 · LIVE EVIDENCE CAPTURED THIS PASS on `v3.5-16cf83f`

All captured over the live API with the supplied cookies. `quick-login` was **never called** — two other
workers share that session.

### 3.1 · The session is alive — which it was not for the last two passes

`GET /api/auth/me/fe-permissions` → **HTTP 200**, full permission array.
`GET /api/organizations/settings` → **HTTP 200**. All six reports respond:
`sales-by-customer`, `sales-by-representative`, `parts-velocity`, `technician-utilization`,
`inventory-value` → **200**; `work-in-progress` → 400 without its required parameters.

### 3.2 · The organisation has TWO locations — so our test user is a multi-location user

`GET /api/staff/my-workplaces` → **2**: `Staging Heavy Duty - 9919` (`b3c8c820…`) and
`Staging Lethbridge - 4310` (`f8a8b802…`). This matters: under SBC **v14** S4-R12 this user should see the
Location column **whatever they have selected**.

### 3.3 · THE LOCATION COLUMN — the build follows the IN-SCOPE model, not SBC v14's access model

Captured from real downloaded files, Sales By Customer, Summary CSV, `range=this_year`:

| Locations selected | Column header row, verbatim from the file | Location column? |
|---|---|---|
| **Both** | `Customer,Location,"Inv. Hrs","Labor Invoiced",…` | **YES** |
| **One** (Heavy Duty) | `Customer,"Inv. Hrs","Labor Invoiced",…` | **NO** |

**What this establishes.** The build shows the column according to **how many locations are selected**. Our
user has access to two, so **SBC v14 S4-R12** — *"the column is shown by default … regardless of how many
locations are currently selected"* — is **not met**, while **PV S2-R12, SBR S21-R7, TU S9-R9, WIP S7-R13
and IV S7-R6 are all met**.

**And this is exactly why those cases are on HOLD rather than flipped either way.** Sales By Customer's own
document contradicts itself (S4-R12 versus S13-R4's closed list of nine), so there is no single documented
answer to test against. **We do not resolve that by looking at the build — that is the whole lesson of
this pass.** It is Q1 and Q2 to Chris.

### 3.4 · Two brand-new v14 requirements are ALREADY correctly built

| Requirement (live SBC v14) | What the file shows | Verdict |
|---|---|---|
| **S20-R19a** *(new in v14)*: "In the Summary download, which has no Date column, the Location column instead appears **immediately after the Customer name**" | Summary CSV: `Customer,Location,"Inv. Hrs",…` | **MEETS IT** |
| **S20-R19**: the Location column "immediately after the Date column" | Expanded CSV: `Customer,Asset,"Invoice #",Date,Location,"Inv. Hrs",…` | **MEETS IT** |

### 3.5 · Export naming, encoding and metadata lines — all meet the spec

| Requirement | Evidence, verbatim | Verdict |
|---|---|---|
| **S14-R14** Summary CSV named `sales-by-customer-summary-{range}.csv`, This Year → `this_year` | `content-disposition: attachment; filename=sales-by-customer-summary-this_year.csv` | **MEETS IT** |
| **S14-R14** Expanded CSV | `filename=sales-by-customer-expanded-this_year.csv` | **MEETS IT** |
| UTF-8 BOM at the head of the CSV | first bytes `EF BB BF` | **MEETS IT** |
| **S4-R13** a `"Locations:"` line, "All locations" when every accessible location is selected | line 2 = `"Locations: All locations"` with both selected; `"Locations: Staging Heavy Duty - 9919"` with one | **MEETS IT** |
| **S14-R13 / SBR S14-R20 pattern** — the line sits as a leading metadata line above the column-header row | lines 1–2 are `"Date Range: …"` and `"Locations: …"`; the header row is line 3 | **MEETS IT** |

### 3.6 · SV-8823 STILL REPRODUCES — money and percentages arrive as text

**Requirement (SBC S14, and the basis of C30162):** money plain, `Margin %` plain.
**What the live file contains:** `$224.92`, `$23.62`, `90.5%` — with the currency symbol and the percent
sign baked in.

**So SV-8823 (`Ready to Fix`) still reproduces on `v3.5-16cf83f`.** The four cases citing it keep
**READY - EXPECT FAIL (SV-8823)**, and their "Known issue" note is still true.

### 3.7 · The PDF logo IS embedded, not fetched over the network — S15-R15 met

**Requirement S15-R15:** "The organization logo is embedded in the PDF, not loaded from a network address,
so it renders offline."
**Evidence:** the 209,920-byte Summary PDF contains exactly **one image object** (`/Subtype /Image`, one
`DCTDecode` stream) and **zero `http://` or `https://` references anywhere in the file**.
**Verdict: MEETS IT** — and this is a genuinely useful check, because a network-loaded logo would have
shown a URL.

### 3.8 · The date range accepted by the server still includes Today and Yesterday

Probed every value: `this_year`, `last_year`, `this_quarter`, `last_quarter`, `this_month`, `last_month`,
`this_week`, `last_week`, **`today`**, **`yesterday`** → all **HTTP 200**. `custom` → 400 "Start and end
dates are required for a custom range." `last_12_months` → **400 "Selected date range is invalid."**

**Against SBC v14 S2-R2** — nine presets, **"Last 12 Months"** first, **"There is no Today, no Yesterday"** —
this is a **deviation on two counts**: the new first preset is **not accepted by the server**, and the two
removed presets **still are**. **This is a NEW finding and it has no ticket.** It is reported, not filed,
because the requirement is **six hours old** and the picker is a screen control I have not driven — see
§6 and the outstanding list.

---

## 4 · WHAT WAS REPAIRED — 42 cases, all sourced to a document

Per-operation detail in `testrail-execution-log.md`. Every write byte-verified: **30 fields compared per
case, 0 mismatch, 0 collateral change**.

| Repair | Cases | Documented basis |
|---|---|---|
| Removed the Location column-selector boilerplate; restored each report's own rule | **13** | PV S3-R10 · TU S10-R4 · WIP S4-R3/S7-R13 · IV S7-R6 · SBR S21-R7/S20-R1/S20-R3 |
| Deleted the invented "on-screen scope indicator" sentence — removed, **not** replaced | **6** | **0 mentions in all six specs** |
| Removed "for now" hedges about the reports permission | **25** | PV **v5** S1-R4 |
| Stopped deferring a detail to the build ("confirmed in the build") | within the 25 above | SBC S14-R14 / S15-R10 · SBR S14-R20 · SBC S2-R4 |
| C30156 — replaced "that is correct" with the honest spec-contradiction statement | 1 | S4-R12 vs S13-R4 |
| C30538 — removed "that is what you should see" | 1 | IV S1-R8 |
| C30470 — removed "and is already built" | 1 | WIP S4-R7 |
| C30362 / C30384 / C30391 — removed "accepted behavior", "shipped wording", "enforces nothing" | 3 | PV S5-R1/R2/R3 · S6-R9/S6-N1 · v5 S1-R4 |

**Provenance:** Sales By Customer moved to **version 14** and Parts Velocity to **version 5** on every case
that cites them. **The build clause was deliberately NOT re-stamped.** I did not re-observe these cases on
`v3.5-16cf83f`, and writing "tested on 8/5/2026" would be a false claim (Rule 12). Every case therefore
still names `8/4/2026 (build v3.4.1-3d03023)` — **two builds old, and that is a queued item, not a fix.**

**One case deliberately left alone: C30265 (SBR-COL-01).** My brief asked me to correct it. **It is
correct** — it follows Sales By Representative's own S21-R7 + S20-R1 + S20-R3. Changing it to the Sales By
Customer model would have imported one report's specification into another, which is the same class of
error this pass exists to undo.

---

## 5 · THE LOGO CASE — deliberately not seeded, and why that is the right call

**The ask:** remove the organisation logo, observe the fallback, restore it.

**Not done, on two grounds:**

1. **The organisation is shared with two other live workers.** `d55bc308-e61a-438d-b5f1-c7a73c89d49f` is
   the same organisation the Filters and Schedule workers are using right now. Removing its logo would
   change what they observe mid-run, on a branch they cannot see me on. Rule 6 makes the environment
   disposable; it does not make it private. **This is a concurrency judgement, not a seeding excuse** — and
   it is exactly the kind of thing Rule 26 was written about.
2. **The requirement no longer needs the build to settle it.** SBC **v14 S15-R17**, written today, says it
   outright: "(2) the bundled ShopView logo **only when an uploaded logo is set but fails to load**; (3) **no
   logo when none is uploaded**", with **S15-R18** for the full-width text column. Our four logo cases
   already expect exactly that. **The expectation is now documented, so seeding would only have produced a
   pass/fail verdict — not the expectation.**

**What I did instead, non-destructively:** proved from the live PDF that the logo is **embedded and not
network-loaded** (§3.7), which is the one logo requirement that can be checked without touching org state.

**Consequence, stated plainly:** ticket **B5** stays unfiled, and **C43553 keeps `AUTOMATION: HOLD`** with
the reason "needs one live check of a logo that fails to load". It needs a window when no other worker is
on this organisation.

---

## 6 · NEW FINDINGS WITH NO TICKET — reported, not filed

Both are reported rather than filed because filing needs evidence I do not have from this pass, and Rule 12
forbids filing on inference.

| # | Finding | Requirement | Why not filed |
|---|---|---|---|
| 1 | The server rejects `last_12_months` and still accepts `today` / `yesterday` | SBC **v14 S2-R2** (nine presets, "Last 12 Months" first, no Today or Yesterday) | The requirement is **six hours old**; the picker is a screen control I did not drive; and an API-only difference must be asked about first (Rule 51). Written to `API-ASK.md`. |
| 2 | Inventory Value shows no numbered page controls (per C30538's earlier note) | IV **S1-R8** ("the user moves through pages with the reports suite's standard pagination control") | **I did not observe this myself this pass.** It rests on a prior pass's note. Filing a defect on someone else's unverified observation is precisely what got SV-8821 closed as not-reproducible. Needs one live screen check. |

---

## 7 · WHAT THE 473 MARKERS SAY

| Marker | Count | What it means |
|---|---|---|
| `AUTOMATION: READY` | **423** | the case is automatable. **It does not claim the case currently passes.** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | **17** | the product is wrong and the ticket is open: SV-8818 ×10, SV-8823 ×4, SV-8820 ×4 (one case cites two) |
| `AUTOMATION: HOLD` | **33** | 16 waiting on Chris about the Location column · 7 waiting on another answer · 8 not built yet · 1 needs a logo-load check · 1 the two spreadsheet downloads do not exist |
| **Total** | **473** | |

**ARITHMETIC GATE: READY + READY-EXPECT-FAIL = 423 + 17 = 440.** That is the ready-to-automate figure and
it is derived by the single written formula in `../READINESS-2026-08-05.md`:
**473 cases − 23 waiting on the product owner − 1 that cannot be set up here − 8 not built yet − 1 needing
a logo-load check = 440.** The gate **PASSES**.

**Honesty about `READY`:** it asserts *automatable*, which is a property of the case and is build-independent.
It does **not** assert that the case passes on `v3.5-16cf83f`. **The pass/fail verdicts remain the
2026-08-04 ones and they are PROVISIONAL against a build two versions old.** Anyone reading 440 as
"440 cases pass" would be misreading it, so it is spelled out here and in the readiness file.

**The two competing marker styles are gone.** Before this pass: 4 cases carried an `AUTOMATION:` marker and
16 carried the older `DO NOT AUTOMATE YET:` block, while **453 carried nothing at all**. Now **473 carry
exactly one `AUTOMATION:` marker**, at the very end of Expected Results, after the provenance line, blank
line before and a line break after — one grep-able literal, which is the whole point of it.
