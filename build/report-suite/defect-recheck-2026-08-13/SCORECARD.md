# SCORECARD — the prepared Report Suite defects vs the eight-item evidence bar

**Pass date: 2026-08-13.** Run cold as the first genuine exercise of
[`build/skills/06-DEFECT-PREP.md`](../../skills/06-DEFECT-PREP.md) (register H1's "the re-check is
OURS and needs no permission — preparing is not filing"). **READ-ONLY everywhere external:** TestRail
`get_*` only · Jira/Confluence reads only · zero application access. **Nothing was filed; the creation
hold stands.**

**The population: SIX write-ups, not five.** The register, `STATE.md` and skill `06` all say *"the
five prepared Report Suite defects"* — the file that holds them,
[`build/report-suite/full-viu-2026-08-06/DEFECTS-FOR-PERMISSION.md`](../full-viu-2026-08-06/DEFECTS-FOR-PERMISSION.md),
carries **D1–D5 plus "Defect 6"** (the WIP empty-export silent no-op, added later on 2026-08-10, after
the "five" was first counted). All six are scored; the stale "five" is corrected in skill `06`, the
register and `STATE.md` in this same pass.

---

## SOURCE-CURRENCY (Rule 31) — established before scoring

| Source | Cited in the pack | **Live today (read 2026-08-13)** | Verdict on the quotes |
|---|---|---|---|
| Sales By Customer spec (577634305) | v16 | **v20**, last edited 2026-08-12 | **Every quoted sentence survives VERBATIM into v20** (S4-R12 incl. *"regardless of how many locations are currently selected"*) |
| Technician Utilization spec (641400833) | v7 | **v9**, 2026-08-12 | **Survives verbatim** (S10-R4, S2-R1, S8-R15, S9-R2) |
| Work In Progress spec (703660034) | v10 | **v15**, 2026-08-12 | **Survives verbatim** (S4-R3, S4-R5, S1-R2, S9-R12 incl. *"Empty export"* / *"Export didn't yield any results"*) |
| SV-8954 / SV-8943 / SV-8967 / SV-8907 | closed OBSOLETE/Done | **Still OBSOLETE/Done, unchanged since 2026-08-09** | Nobody reopened or fixed them |
| Build | `v3.5-4795eee` (2026-08-10) | **NOT VERIFIED** — zero app access this pass, and the QA lead says Reports is being changed next week | All current-behaviour claims carry the 2026-08-10 build marker only |

**The requirement texts were diffed by their OWN words across versions (Rule 31 trap (c)), not by page
version** — the version numbers moved, the requirements did not. **So no defect was overtaken by a spec
change**, but **every pack entry cites a stale version number and owes a re-stamp** (v16→v20, v7→v9,
v10→v15, with the 2026-08-13 read date).

**Duplicate landscape moved since the pack was written.** A JQL sweep today
(`project = SV AND created >= "2026-08-10" AND (summary ~ "Location" OR "Work In Progress" OR
"Technician Utilization" OR "Sales By Customer" OR "export")`, 13 hits) found four new TU
location-related Story Defects by other authors (**SV-9060, SV-9064, SV-9066, SV-9067**, 2026-08-09),
**SV-9116** (cross-location data leak, 2026-08-11) and **SV-9178** (SBC export message wording,
2026-08-12). **On reading their summaries none covers D1–D6's exact claims** — but the pack recorded no
duplicate search at all, so this ruling-out is new work this pass, recorded here.

---

## THE EIGHT ITEMS, PER DEFECT

Legend: **PASS** · **OWED** (names exactly what is missing) · **FAILS** (should not be filed at all).
**Screenshot caveat (applies to every OWED-screenshot below): Reports is being changed next week — do
NOT send anyone to capture now; re-capture and annotate after the new build lands, on the new build's
marker.**

### D1 — Location column ignores the ratified access rule, on all three handed-off reports

| # | Item | Verdict |
|---|---|---|
| 1 | Expectation quoted, named source + version + date | **PASS** — SBC S4-R12 · TU S10-R4 · WIP S4-R3 quoted verbatim + Chris Ward's 2026-08-10 answer (Tab 1 item 1 = A); **verified today the quotes survive into v20/v9/v15**. OWED: re-stamp the cited versions + read date |
| 2 | Annotated screenshots | **OWED** — `tu-singleloc.png` (viewed) is a BARE capture: no arrow, box or caption. Re-capture after the new build lands, annotated |
| 3 | Exact named test data + ruled out | **PASS** — Admin ShopView (`admin@shopview.com`), org id, all five locations named, `3rd Loc` named; controls recorded (fresh profile; selector read while the column was visible; access confirmed two ways) |
| 4 | Build marker + environment + true role | **PASS** — `v3.5-4795eee` + last-modified + etag + date; role stated |
| 5 | Duplicate search with queries recorded | **OWED** — no JQL anywhere in the pack. Today's sweep found four new TU location defects (SV-9060/9064/9066/9067) — none covers this claim, but the ruling-out must sit in the pack |
| 6 | The reader shape + source block | **OWED** — the substance is all present but there is no paste-ready body: the source sits mid-entry, and the "Affected test cases" C-id list sits inside the entry and must move to `CASE-IMPACT.md` (C-ids must never appear in a ticket) |
| 7 | Written self-challenge | **OWED** — none exists anywhere in the pass folder (grep: zero hits for self-challenge / "strongest argument") |
| 8 | Not a Rule-24 pass + nonsense checks | **PASS** — not Rule-24 (the gate is also enforced server-side: the CSV silently drops a requested `location` column). Closed-ticket check handled honestly: framed as **reopen + broaden SV-8954** (still OBSOLETE today), not a new ticket |

**Verdict: the strongest of the six. HOLDS against current sources. Offerable as a reopen/broaden
recommendation once items 2, 5, 6 and 7 are discharged.** *(Register note: H2's dated reminder about
SV-8954 was due 2026-08-12 — this scorecard re-raises it.)*

### D2 — Technician Utilization draws the Location column second, spec says leftmost

| # | Verdict |
|---|---|
| 1 | **PASS** — TU S2-R1 + S8-R15 quoted; survive verbatim into v9. Re-stamp owed |
| 2 | **OWED** — `tu-all.csv` header independently re-read today and corroborates (`Technician,Location,…`); `tu-screen.png` is bare. Annotate on re-capture |
| 3 | **OWED** — the entry names no user/org/role of its own; it inherits D1's context implicitly. Each entry must stand alone |
| 4 | **PASS** via the pack header; the role should be restated in-entry |
| 5 | **OWED** — no JQL; SV-9064 (Total Hours link, multi-location) is a neighbour to rule out in writing |
| 6 | **OWED** — same shape gap as D1 |
| 7 | **OWED** — none |
| 8 | **PASS** — no existing ticket; not Rule-24; machine-readable CSV evidence |

**Verdict: HOLDS. A genuine, cleanly-evidenced spec-vs-build divergence with no existing ticket —
filable once the owed items are discharged.**

### D3 — Technician Utilization opens on "All locations", not the active location

| # | Verdict |
|---|---|
| 1 | **PASS** — TU S9-R2 quoted; survives verbatim into v9 |
| 2 | **OWED** — captured request (no `locations=` param) is good technical evidence; the screenshot is bare |
| 3 | **PASS** — fresh profile stated; switcher value named (Staging Heavy Duty - 9919) |
| 4 | **PASS** via header + control note |
| 5 | **OWED** — no JQL; SV-9060/SV-9066 are neighbours to rule out in writing |
| 6 | **OWED** — shape |
| 7 | **OWED** — none |
| 8 | **🔴 FAILS AS A NEW TICKET** — the finding is covered by **SV-8943, closed OBSOLETE, verified today still closed and unchanged**. Per item 8's first nonsense check, a closed ticket that still reproduces gets the **expect-fail treatment plus a reopen decision — never a new ticket**. The pack itself frames it that way |

**Verdict: NOT filable as a new ticket. Correct disposition: a reopen ask on SV-8943 (the QA lead's
decision), and the affected case (TU-DISP-01 = C30394) keeps/gets its expect-fail marker naming
SV-8943.**

### D4 — Work In Progress WO number is plain text for a user WITH Work Order permission

| # | Verdict |
|---|---|
| 1 | **PASS** — WIP S4-R5 quoted; survives verbatim into v15 |
| 2 | **🔴 FAILS AS CITED — the evidence file does not exist.** D4 §5 cites `evidence/three-reports-2026-08-10/wip-checks.png`; a `find` over the whole evidence tree returns nothing by that name. Only the quoted element markup (`text_wip_wo…`) stands. Re-capture after the new build lands, annotated |
| 3 | **PASS** — Admin ShopView, WO **S8582-16328**, tab named; three independent signals recorded |
| 4 | **PASS** |
| 5 | **OWED** — no JQL |
| 6 | **OWED** — shape; and the entry's own honest caveat (C43557's negative half *"may now pass for the wrong reason"*) belongs in `CASE-IMPACT.md` |
| 7 | **OWED** — none |
| 8 | **🔴 FAILS AS A NEW TICKET** — covered by **SV-8967, closed OBSOLETE, verified today still closed**. Same disposition as D3: reopen ask, not a new ticket |

**Verdict: NOT filable as a new ticket, and its cited screenshot is missing. Correct disposition:
reopen ask on SV-8967, with fresh annotated evidence captured on the new build first.**

### D5 — Work In Progress tab labels in Title Case vs the spec's sentence case

| # | Verdict |
|---|---|
| 1 | **PASS** — WIP S1-R2 quoted; survives verbatim into v15 (the spec still writes sentence case) |
| 2 | **🔴 FAILS** — no evidence of any kind is cited; no screenshot exists for it |
| 3 | **OWED** — no environment, role or data named in the entry |
| 4 | **OWED** — nothing in-entry beyond the pack header |
| 5 | **OWED** — no JQL |
| 6 | n/a — the pack itself recommends **no ticket** |
| 7 | **PARTIAL** — §4 "Honest assessment" is a de-facto self-challenge (*"often the specification's error rather than the build's"*) — but not in the written challenge-and-answer form the bar requires |
| 8 | **🔴 FAILS THE BAR AS A TICKET** — by its own assessment it is cosmetic and plausibly the document's error. Per skill `06`'s routing: *"if the answer decides whether it IS a defect, it is a question, not a ticket"* |

**Verdict: WITHDRAWN from the offered set as a ticket.** Route to `07-PO-QUESTIONS` (one row for Chris:
which casing is intended?) or record in `NOT-FILED.md`. **This is the "expect withdrawals" outcome the
re-check was told to expect, and it is correct, not a failure.**

### Defect 6 — WIP export with no rows does nothing at all, silently (the sixth, unacknowledged by the "five" count)

| # | Verdict |
|---|---|
| 1 | **PASS** — WIP S9-R12 + the §7 User Feedback table quoted verbatim; both survive into v15 |
| 2 | **OWED — and the evidence contradicts the named data**: `wip-empty-export.png` exists but is bare, and it shows the Location filter on **"All locations"** while the steps name **Staging Lethbridge - 4310**. Re-capture on the new build with the export menu open, matching the named data, annotated |
| 3 | **PASS** — exemplary: tab `Completed (0)`, location, date range, and the populated-tab contrast case all named |
| 4 | **PASS** — build + date; five negative controls recorded (0 export requests, empty `.q-notification` list, etc.) |
| 5 | **OWED** — no JQL; SV-9178 (SBC export message wording, 2026-08-12, another author) is a neighbour on a different report — rule out in writing |
| 6 | **PARTIAL PASS** — it has a ready-to-file stub; the "Affected case" C-id still needs moving out of the ticket text |
| 7 | **OWED** — none |
| 8 | **PASS** — correctly identified as the Rule-61 outcome-(2) case (a new failure exposed when SV-8907 was fixed; SV-8907 verified still closed); not Rule-24; not described by any closed ticket |

**Verdict: HOLDS — genuinely new, second strongest of the six. Filable once items 2, 5, 6 and 7 are
discharged.**

---

## SUMMARY

| Defect | Against current sources | Filable? |
|---|---|---|
| **D1** Location column vs access rule (3 reports) | **HOLDS** (quotes survive into v20/v9/v15) | **YES, as a reopen/broaden of SV-8954** — after items 2·5·6·7 |
| **D2** TU Location column position | **HOLDS** (v9) | **YES, as a new ticket** — after items 2·3·5·6·7 |
| **D3** TU opens on All locations | HOLDS (v9) | **NO — reopen ask on SV-8943, never a new ticket** |
| **D4** WIP WO# plain text | HOLDS (v15); **cited screenshot MISSING** | **NO — reopen ask on SV-8967**; fresh evidence first |
| **D5** WIP tab-label casing | HOLDS (v15) | **NO — WITHDRAWN as a ticket; route to a PO question** |
| **Defect 6** WIP silent empty export | **HOLDS** (v15) | **YES, as a new ticket** — after items 2·5·6·7 |

**Common debts across everything offerable:** a written self-challenge per finding (item 7 — zero exist)
· recorded JQL duplicate searches (item 5 — zero exist; today's sweep is a start, recorded above) ·
paste-ready bodies with the C-ids stripped into `CASE-IMPACT.md` (item 6) · **annotated** screenshots
re-captured **after next week's Reports build lands** (item 2) · a version re-stamp on every source
quote (v20/v9/v15 + read date).

**Nothing here was filed, edited in Jira, or written to TestRail. The creation hold stands.**

---

## HOW THE SKILL PERFORMED COLD (the S1 record skill `06` asked for)

Followed as written, using only what the file tells you:

1. **🔴 Cold-start defect — the skill owns the five-defect re-check but never says where the five
   live.** Its honesty note names them as "the open item this skill owns" with no path; the canonical
   example it gives (`defect-pack-2026-08-04/`) is a DIFFERENT, already-filed pack. Finding them took a
   repo-wide grep landing on `RULINGS-2026-08-10-CREATION-HOLD-AND-FINALITY.md`, which names
   `DEFECTS-FOR-PERMISSION.md`. **Fixed in the skill this pass.**
2. **🔴 Cold-start defect — the count is six, not five.** The same file carries "Defect 6", added
   2026-08-10 after the "five" was counted; skill `06`, `STATE.md` and register row H1 all said five.
   **Corrected this pass, superseded wording kept and dated.**
3. **What worked cold:** the eight items are all checkable as promised; core §17 supplied the Confluence
   page ids and the Jira/TestRail identifiers without guessing; the trigger phrase *"re-check the
   prepared defects against the bar"* exists; the API-reachability test and the closed-ticket nonsense
   check both produced decisive verdicts (D3/D4).
4. **Cost honesty (the S2 concern):** the full re-check of six defects — including live re-reads of
   three specs, six tickets and one JQL sweep — was affordable in one pass. The bar is workable.
