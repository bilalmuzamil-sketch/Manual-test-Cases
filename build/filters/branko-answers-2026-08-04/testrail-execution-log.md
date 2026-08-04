# Filters — TestRail EXECUTION LOG — Branko's answers of 2026-08-04

> ## STATUS: **EXECUTED 2026-08-04.** 12 × `update_case`. **0** add · **0** delete · **0** section
> · **0 run writes**. Every operation **HTTP 200** and **byte-verified MATCH**.
> Authorised by the QA lead, whose ruling also created the new citation requirement this pass
> implements (§1).

## 1. THE RULING THIS PASS IMPLEMENTS (Standing Rule 48 — quote it, do not paraphrase it)

The QA lead, **2026-08-04**, verbatim:

> **"If Branko said this in his new file then yes, but below the expected behavior give the file
> link and mention that this is coming from Branko's responses here. Anyting that you do if that
> has the reference from the file only - follow the same practice."**

Two instructions, both applied: **(a)** the 10 staged edits are authorised; **(b)** where a case's
expectation rests on **Branko's answer file** rather than on the specification text, the
tester-facing provenance line **names that file and gives its link**, and says plainly that the
position comes from his responses. **The second half is general** — it is now written into
**Standing Rule 54** in `CLAUDE.md` so it applies to every project, not just this pass.

**The link in tester-facing text is a DELIBERATE, QA-LEAD-AUTHORISED EXCEPTION** to the
no-jargon/no-anchor guidance of Rules 7/20 — recorded here and in the rule so a later pass does not
strip it as a violation.

## 2. PRE-FLIGHT (Standing Rule 31) — every source established LIVE before the work

| # | Source | Identifier | Version / value | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | **Branko's answers** | Drive `1fkjdt9hoYSGv2MToXUFJ_4tTMzP7a7X2` | 9 of 9 answered, ingested `answers-ingested.md` | 2026-08-04 | **CURRENT** — the newest authoritative product source (Rule 32) |
| 2 | **Filters spec (PRD)** | Confluence page **572030978** | **version 14**, `createdAt` **2026-07-31T13:10:34.788Z**, body version token **1.6**, **73 403 bytes** — re-fetched LIVE this pass (HTTP 200) | 2026-08-04 | **CURRENT** — no new version since 2026-07-31 |
| 3 | **Filters epic** | **SV-8785** | unchanged since the morning's Tier-1 check | 2026-08-04 | **CURRENT** — Rule-37 Tier-1 only; no movement, so no Tier-2 re-read needed |
| 4 | **Filters designs** | Figma `DR4gEODShYgJqkozs3mF5q` | 85/85 boards; Rule-35 queue **CLOSED** | 2026-08-04 | **CURRENT** — and **used**: node `11903:10461` re-read as PIXELS this pass (§5) |
| 5 | **Engineering tech plan** | `tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | decision **D15** | 2026-08-04 | **CURRENT** — it is the model Branko's Q1 adopts |
| 6 | **TestRail group 4110** | 110 cases, **all `created_by: 3`** | no foreign case (Rule 38) | 2026-08-04 | **CURRENT** |
| 7 | **TestRail run 352** | 110 tests · **396 result records** (1 Passed · 79 Untested · 316 status-less) | `include_all: false` | 2026-08-04 | **CURRENT** — and the task brief's **395 / all-untested** figure is **WRONG**; verified, not trusted |
| 8 | **Filters QA branch** | `sv8785.qa.shopview.com` | — | — | **DELIBERATELY NOT CONSULTED** (§7) |

**Spec anchors re-read VERBATIM from the live v1.6 body**, because three of them decide a case's
honesty variant:

* **S2-R6** — *"The table filters in real time as the user makes selections (no confirm/apply button needed)"*
* **S12-R2** — *"The filter chips behave identically to desktop: tapping a chip opens its dropdown, selections update the chip appearance, "Clear filters" appears when active"*
* **S12-R3** — *"Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"*
* **§2 Parts Filters** — *"A filter bar appears below the page header on each view of the Parts area (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices, **Vendors**)"*

**Two counts measured in the live body, and both matter:** *"Apply filters"* appears **0 times** and
*"All Filters"* appears **0 times** — so the mobile combined sheet genuinely is **not in the
specification**, which is why those cases keep their design provenance and get his ruling on top
rather than a claim of plain spec agreement. **No requirement covers a default or last-used tab**
either (swept for *default tab*, *Estimates tab*, *last-used*, *remembered*, *first visit*).

## 3. THE OPERATIONS — one row per write (Rule 50: "200 OK" alone is non-compliant)

| # | Operation | Case | Fields written | HTTP | Byte-level verification | Variant |
|---|---|---|---|---|---|---|
| 1 | `update_case` | **FLT-MOB-01** · [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 2 | `update_case` | **FLT-MOB-02** · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 3 | `update_case` | **FLT-MOB-03** · [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 4 | `update_case` | **FLT-MOB-04** · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | `custom_expected`, `custom_preconds`, `custom_steps`, `refs`, `title` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `plain` |
| 5 | `update_case` | **FLT-MOB-05** · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 6 | `update_case` | **FLT-MOB-06** · [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 7 | `update_case` | **FLT-MOB-07** · [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 8 | `update_case` | **FLT-MOB-08** · [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `design_po_ruled` |
| 9 | `update_case` | **FLT-TAB-06** · [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `po_ruling_no_anchor` |
| 10 | `update_case` | **FLT-PARTS-01** · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `po_prose_only` |
| 11 | `update_case` | **FLT-PARTS-13** · [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `po_prose_only` |
| 12 | `update_case` | **FLT-RPTS-22** · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | `custom_expected`, `refs` | **200** | **MATCH** — 28 fields compared; `refs` under the declared normalisation | `po_prose_only` |

**What "MATCH — 28 fields compared" means, per operation:** the case was re-GET **immediately before
the write** and proven byte-identical to the pre-write snapshot (nobody had moved it); the write was
sent with **only** the intended fields; the case was re-GET **after** and compared **field by
field** — every intended field byte-equal to the intended value, **every field not intended to
change proven byte-identical**, and every field outside the snapshot proven unmoved. `refs` is
compared under the **declared normalisation** `','.join(p.strip() for p in s.split(','))`
(TestRail splits on commas, trims, rejoins). **Every new `refs` value is a single comma-free entry
of ≤ 241 characters**, inside the 248-character pattern limit.

## 4. RULE 41 — every case re-verified WHOLE, not only the edited field

All **12** were re-read end-to-end against **live Filters spec v1.6 (Confluence version 14)** before
saving: **title · preconditions · every step · every expected result · refs · section · type ·
notes**. Recorded per case: *"re-verified whole against Filters spec v1.6 (Confluence version 14)"*.

Checked mechanically across all 12: every `S#-R#` anchor in `refs` **exists in the live spec body**
(0 stale anchors) · **0 titles over 80 characters** (longest 79) · **0** occurrences of *VIU* or any
feature-flag word in tester-facing text · **0** closed-list enumerations lacking a version-pinned
anchor (Rule 42).

**The re-read produced two findings the pass was not chartered to produce, and both are recorded
rather than quietly fixed:**

1. **FLT-PARTS-01 · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) — the staged
   plan had MISSED its own headline edit.** The plan's §3 requires the false *"the developers have
   not been given a design for the Vendors page filters yet"* note to be removed, and the first
   build of this pass's plan did not carry it — it would have re-stamped the provenance and left the
   hedge in place. Caught by the whole-case re-read, added as operation 10, and it is the entire
   point of Group C.
2. **FLT-PERS-01 · [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) — the
   provenance stamper was NOT idempotent on one case.** A manual TestRail edit had converted that
   case to HTML, turning the `---` separator into `<hr />` and wrapping the sentence in `<p>`. The
   stripper could not see that block, so **a future full re-stamp would have APPENDED A SECOND
   provenance line**. `strip_provenance()` is now hardened to recognise the HTML forms. **No write
   was made to C29613** — its wording is word-identical and correct, and Branko's answers do not
   touch it, so re-writing it would have been an unauthorised markup-only edit. **Staged for a
   future authorised pass.**

## 5. THE VENDORS DESIGN — we checked it, as he asked, and he is right

His answer, verbatim (his spelling): **"Disign for vendors exists in figma. Check it"**

Read as **pixels** this pass, not as a text layer:
`design-2026-07-31/frames/Parts-Explorations-20.4.2026__Vendors__11903-10461.png` shows page title
**Vendors**, the **Vendors** item highlighted in the left nav **below a separate "Vendor Invoices"
item**, a **New Vendor** button, columns Name / Telephone / Email / Address 1 / Address 2 / City /
State/Province / Zip-Postal Code, and **exactly two filter chips: `Vendor` and `State/Province`** —
item for item what the case already asserted.

**So the engineering reading recorded in the case's own notes — that node 11903:10461 is Vendor
Invoices rather than Vendors, and that Vendors filters would not be built until a design was
delivered — is WRONG.** Three sources now agree against it: the PRD §2 (which lists Vendors), the
design board, and the PO. That note is annotated in the local case source rather than deleted.

**HONEST CONSEQUENCE, and it belongs to the QA lead, not to the case:** with the hedge gone, this
case will **legitimately FAIL if the build has not shipped the Vendors filter bar**. That is the
correct outcome — under Rule 45 the hedge was a **false all-clear** that would have let a genuinely
missing filter bar pass — but the first live run may produce a real failure here.

## 6. RUN 352 — PROVEN UNTOUCHED (Rules 34 / 47 / 50)

**No run write was needed and none was made:** the plan contains **0 `add_case`**, and
`update_case` never touches a run's selection.

| | Before | After | Verification |
|---|---|---|---|
| Tests | **110** | **110** | `case_id` sets **EQUAL both directions** (0 missing / 0 added); **`test` id** sets equal both ways too |
| **Result records** | **396** | **396** | **EVERY prior result present BY ID** — 0 lost, 0 new (never by count alone) |
| Status counts | 1 Passed · 109 Untested | 1 Passed · 109 Untested | unchanged |
| `include_all` | false | false | unchanged |

**The standing danger, restated because it did not fire this time:** `update_run` **REPLACES** the
selection, so a partial `case_ids` list would **DELETE the omitted tests AND their results**. Run
352 holds a tester's **PASSED** result, so a careless partial write would destroy someone else's
work. If an `add_case` ever enters a Filters plan: snapshot `get_tests` + `get_results_for_run`
first, send the **FULL UNION**, verify every prior result by id afterwards.

## 7. WHAT WAS NOT DONE, AND WHY

| Item | Why not |
|---|---|
| **The Filters QA branch `sv8785.qa.shopview.com`** | **NOT TOUCHED — not one request, no login, no page load.** **(1) THE RULING:** the QA lead has reserved Filters VIU permission until Report Suite is complete. **(2) WHEN/WHY:** given 2026-08-04, to keep one live estate and one worker's attention on the automation deadline. **(3) WHAT IT BLOCKS:** all 110 cases stay unverified against a build; specifically **Branko's Q1 mobile behaviour** and **Q3's Vendors filter bar** cannot be confirmed. **(4) WHY IT WAS REASONABLE:** Report Suite has a live automation dependency today and Filters does not. **(5) WHAT WOULD UNBLOCK IT:** his word, once Report Suite is closed. |
| **A build date in any provenance line** | All 110 cases remain in Rule-54 **state 1** (epic + specification, **no build**). A build marker is stamped only when a build has actually been observed. |
| **C29613's markup normalisation** | Word-identical and correct; not touched by Branko's answers. Writing it would be an unauthorised markup-only edit. **STAGED.** |
| **The 6 sibling `po_prose_only` cases still dated 2026-07-31** | Their basis did not move this week, so their date and their (uncited) 2026-07-31 answer source are still accurate. They are **candidates for a 2026-07-31 file citation** on a future authorised pass — reported, not written. |

## 8. HOW TO REPRODUCE

```bash
python3 build/filters/branko-answers-2026-08-04/tools/build_plan_branko.py      # refuses if any
                                                                               # non-target case
                                                                               # would change
python3 build/filters/branko-answers-2026-08-04/tools/exec_push_branko.py filters --dry-run
python3 build/filters/branko-answers-2026-08-04/tools/exec_push_branko.py filters
python3 build/filters/branko-answers-2026-08-04/tools/sync_local_branko.py
python3 build/filters/gen_import.py     # NOTE: blanks the id-map C-ids + drops its refs
                                        # column on every run — re-merge afterwards
```

Per-operation machine log: `exec-log.jsonl`. Plan with every pre-write snapshot: `plan.json`.
Pre-write live snapshot of all 110: `snapshots/pre-write-live-cases-4110-2026-08-04-branko.json`.
