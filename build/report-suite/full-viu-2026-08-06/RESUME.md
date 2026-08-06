# RESUME — Report Suite VIU, as at 2026-08-06 end of the SECOND session

**Read in this order:** this file → `SOURCE-CURRENCY.md` → `SPEC-DIFF.md` → `FINDINGS-SESSION2.md` →
`RECHECK-QUEUE.md` → `REMAINING.txt`. The first session's handover is kept as `RESUME-session1.md`;
its tooling notes and its Sales-By-Customer groundwork are still good, but **its counts are superseded
by the ones below** and two of its claims are corrected (see §6).

---

## 1 · ⚠️ THE BUILD IN FORCE — AND IT MOVED MID-PASS

| Read at | app-version | index.html last-modified | etag |
|---|---|---|---|
| 2026-08-06 08:24:28Z | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT | `177c59546701e7810b894492dabc1423` |
| **2026-08-06 09:25:03Z** | **`v3.5-7168d14`** | **Thu, 06 Aug 2026 08:32:37 GMT** | `207df1aa07090fcf99e98e67f1d1d6d5` |

**The branch redeployed EIGHT MINUTES into the second session.** Read the marker at the start **and**
at the end of every pass — that is the only reason this was caught, and the 69 cases already stamped
with the older marker were corrected because of it.

**The branch is not declared final and will not be before release.** Every verdict is **PROVISIONAL**
and the Rule-49 queue in this folder is **OPEN** — which under Rule 60 is this project's normal steady
state, not a failure.

## 2 · Sources — all CURRENT, verified three times

SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4**. **None moved** at 08:24Z, 08:58Z
or 09:25Z. Epic **SV-8582 = 105 children**, verified two ways, key sets equal.

**Chris Ward's three channel updates are ingested and, for the first time, TESTED.** Two of the three
fail on the build: **SV-8967** (the WO # link) and **SV-8968** (the WIP filters). See `SPEC-DIFF.md`.

## 3 · THE NUMBERS — re-derive them, never copy them forward

| | Count |
|---|---|
| Live under group 4281 | **481** |
| **Ours** | **476** |
| Foreign (Vladimir Tomovic, C38919–C38923) | **5** — hands off, Rule 38 |
| Carrying a verdict on the build now running (`v3.5-7168d14`) | **69** |
| Verdicted today by the first session, on the superseded `v3.5-16cf83f` | **219** |
| **No 6 August verdict at all — THE REAL OUTSTANDING WORK** | **188** |

**69 + 219 + 188 = 476.** How to re-derive, from live:
`python3 tools/census.py` (markers, provenance, raw markup, untouched proof, run 359).

**Markers, live: 357 `READY` + 77 `READY - EXPECT FAIL` + 42 `HOLD` = 476, exactly one each.**
**Gate: 357 + 77 = 434 = 476 − 42. PASSES. Ready to automate = 434 of 476.**

## 4 · THE EXACT NEXT ACTION

**1. Sales By Representative. 109 cases. Never opened.** It is the whole of the gap and nothing blocks
it. `REMAINING.txt` **section A** lists them by section.

**2. The second test login — 17 permission cases, and the QA lead already authorised it**, verbatim:
*"You should unblock yourself."* It was not done. The method is Rules 5/14: `POST /api/switch-user` to
impersonate an existing non-admin holder, or `POST /api/iam/create` for a fresh staff. **The caution
that made it last, and then made it not happen: both `switch-user` and `quick-login` rotate the single
shared `sv_sso_session`, so they will sign out any sibling worker live on the Filters or Schedule
branch.** Do it when nobody else is live, and end by restoring a clean admin session.

**3. The remaining 42 Work In Progress cases** — `REMAINING.txt` section A, WIP rows.

**Do NOT start by re-driving section B.** Those 219 were verdicted today; a redeploy does not
invalidate an expectation, only a label or a verdict (Rule 60), and every EXPECT-FAIL among them
carries a Rule-61 block so the automated suite reports a fix or a changed failure by itself.

## 5 · What is already established and can be reused without re-deriving

**Sales By Customer** — finished. Report path `/reports/sales-by-customer`; data endpoint
`GET /api/reporting/reports/sales-by-customer?range=…&productType=all|parts|service&locations=…&pagination[…]`;
`…/customers?…&search=` for the type-ahead; `…/{customerId}/assets?…` and
`…/{customerId}/assets/{assetKey}/invoices?…` for the tree; export at `…/export?variant=summary|expanded&format=csv|pdf`.
- **Presets apply IMMEDIATELY** — no Apply button unless you are building a custom calendar range.
- **Sorting is server-side** (`pagination[sortBy]`, `pagination[descending]`) and the spec agrees
  (S10-R8), unlike Technician Utilization where the spec asked for on-screen.
- **The saved view is one browser key**, `report_view:sales-by-customer`, holding dateRange, locationIds,
  sortBy, descending, columns, productType, customerAll, customerIds. **Reading it settles five cases at
  once.**
- **Money is in cents in the API**; the screen renders dollars.
- **The Parts Sales bucket exists but only shows under `productType=parts`** — `is_parts_sales: true`,
  label literally `Parts Sales`.

**Work In Progress** — the date parameters are **different from the other five reports**: `from=`/`to=`
with full ISO instants, plus `tab=<Tab>`. `…/filters?from=&to=&locations=` returns the scope-wide
advisor, customer and asset lists. `tab_counts` gives all four tab counts in the data response.
Export: `…/work-in-progress/export?format=csv|pdf&tab=…&from=…&to=…` — and **every tab WITH rows
returns HTTP 500** (SV-8907); a tab with 0 rows returns a real file.

**Tooling that works** — `tools/writer.py` (rebuilds an expected-results field, sends all three text
fields, byte-verifies; **refuses on a raw-markup case, keep that guard**), `tools/unmarkup.py`
(HTML→plain numbered text, preserves the build line), `tools/census.py`, `tools/reqx.py` (pulls every
`Sn-Rn` anchor out of a live spec body), `/tmp/rs-viu/boot.mjs`, `/tmp/rs2/lib.mjs`, `/tmp/testrail/tr.py`,
`/tmp/conf_fetch.py`, `/tmp/jql.py`, `/tmp/rs3/jira/tu_tickets.py` (`create()` + `verify()`).

## 6 · TWO CORRECTIONS TO THE FIRST SESSION'S RECORD — read before quoting it

**(a) The export row cap IS documented in three of the six specifications.** `FINDINGS.md` and
`FILED.md` say none of them mentions it. **Wrong**: SBC v15 documents it twice (S14-R16, S15-R25), SBR
v17 once (S14-E2), IV v4 once including the exact message (S10-R12). Only PV, TU and WIP are silent.
Table and consequences in `SPEC-DIFF.md` §8; the narrowed question is Q6 in `QUESTIONS-FOR-CHRIS.md`.

**(b) Report Suite had NO live re-check queue until now.** The first session opened none, so its 219
verdicts were queued nowhere. `RECHECK-QUEUE.md` in this folder now covers both sessions.

## 7 · Write ledger

**This session:** TestRail **156 `update_case` over 82 distinct cases**, every one HTTP 200 +
byte-verified, 30 fields compared each, **0 mismatches, 0 collateral**; **0 add · 0 delete · 0 section ·
0 run writes · 0 results logged**. Jira **9 Story Defects created (SV-8962…SV-8970), 0 edited**, 11 field
checks each, **45 of 45 PASS**. Application **read-only — nothing seeded, nothing impersonated**.

**Cumulative for 6 August (both sessions):** **389 `update_case` over 302 distinct cases**; Jira **38
Story Defects created**, one authorised edit (SV-8937, first session).

## 8 · Outstanding

1. **A second test login** — 17 permission cases. Authorised; not done.
2. **Chris Ward: six questions** — `QUESTIONS-FOR-CHRIS.md`. Q5 (the Location column) unblocks **16**
   held cases and is probably a five-minute edit, because he has already decided and four requirements
   simply were not tidied up.
3. **432 of 476 cases name a stale spec version in `refs`** — IV v3, PV v4, SBC v13, SBR v15, TU v5,
   WIP v6. Rule 42 depends on that pin. Needs an authorised metadata sweep.
4. **Two tester-facing provenance lines carry a wrong spec version** — one PV case with none, one SBC
   case reading v9 against live v15. Two writes.
5. **Three factual improvements owed to already-filed tickets** — SV-8956's real cause, SV-8937's
   PDF-only mechanism and its scope. Deliberately not edited: the QA lead is retrofitting in one pass.
6. **The branch declared final** — it will not be, so the queue stays open by design.
