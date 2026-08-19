# FLAGGED DEFECTS — Report Suite build-verify 2026-08-18 (Jira creation ON HOLD — nothing filed)

**All evidence from the committed per-report `*-FINDINGS.md` artifacts** under
`build/report-suite/build-verify-2026-08-18/`. Build: **`v3.8-bd246fd`** (SBC on `v3.8-2bf8d14`).
**No ticket was created, reopened, closed or edited this pass** — the QA lead's Jira-creation hold is active
(Standing Rule 62 / register H1), and the hold persists through and beyond build verification (Rule 62 dated
note, 2026-08-17). When you lift it, tickets resume **one at a time** against the Rule-73 checklist and the
Rule-52 eight-item evidence bar. Every ticket named below was read live for status; none was touched.

**Count split (your decision column blank on every row):**
- **26 recommend REOPEN / REFILE** — 25 closed-OBSOLETE tickets that still reproduce on v3.8 + 1 NEW deviation with no ticket.
- **1 recommend CLOSE-as-fixed (actionable)** — SV-8823 (still OPEN, appears fixed) + a batch of already-closed fixes confirmed.
- **2 PO QUESTIONS for Chris Ward** — document-vs-document conflicts we will not resolve from the build (Rules 32/57/58). **UPDATE 2026-08-19 (2nd Chris message): Q1 (WIP tab-placement) and Q4 (WIP per-line aging) are BOTH RESOLVED by Chris — only Q2 and Q3 remain open.**
- *(Plus **12 cases across PV/IV kept `EXPECT-FAIL (SV-8818)`** — the PDF-export server error, ticket already OPEN; listed at the end, no action beyond confirming SV-8818 stays open.)*

---

## CLUSTER 1 — RECOMMEND REOPEN (closed OBSOLETE, still reproduces on v3.8)

| # | Report | Ticket (status) | What's wrong (plain) | Reproduces on v3.8? | Affected C-id(s) | Recommendation | Your decision |
|---|---|---|---|---|---|---|---|
| R1 | SBC / SBR | **SV-8964** (OBSOLETE) *(SBR cross-ref SV-8981)* | Expanded-View PDF prints on **A3 paper** (1190.55×841.89 pts) while the Summary PDF is correctly **A4**. | Yes (pdfinfo on both live downloads) | [C30166](https://shopview.testrail.io/index.php?/cases/view/30166), [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | Reopen (or one cross-report refile) — spec wants A4 landscape. | |
| R2 | SBC | **SV-8955** (OBSOLETE) | The chosen date range is **not written into the page link** (address bar stays at the plain report URL after Apply). | Yes | [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | Reopen or refile. | |
| R3 | SBR | **SV-8973** (OBSOLETE) | Empty-state message reads "No sales data found for the selected filters." — the exact wording the case calls the defect (spec wants different). | Yes | [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) | Reopen or refile. | |
| R4 | SBR | **SV-8975** (OBSOLETE) | Icon-button accessible names wrong: export = "Export report" (spec "Report actions"); column = "Column Selection" (spec "Show/Hide columns"). | Yes | [C30307](https://shopview.testrail.io/index.php?/cases/view/30307) | Reopen or refile. | |
| R5 | PV | **SV-8939** (OBSOLETE) | Location filter defaults to **"All locations"**, not the user's active location (spec S2-R9 / Chris Ward's decision). | Yes | [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | Reopen or refile. | |
| R6 | PV | **SV-8940** (OBSOLETE) | Long Description/Category/Vendor cells **not truncated** — no ellipsis, no hover tooltip (computed `text-overflow: clip`, no `title`). Spec S3-R7 wants ellipsis + tooltip. | Yes | [C30347](https://shopview.testrail.io/index.php?/cases/view/30347) | Reopen or refile. | |
| R7 | PV | **SV-8936** (OBSOLETE) | Export success toast is the generic "Data exported successfully." not the specified "Velocity report exported (CSV)/(PDF)" (S6-R9/N1). | Yes | [C30384](https://shopview.testrail.io/index.php?/cases/view/30384) | Reopen or refile. | |
| R8 | TU | **SV-8943** (OBSOLETE) | Report opens on **All locations** (not the user's active shop). Date-range half correct. | Yes | [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | Reopen. | |
| R9 | TU | **SV-8945** (OBSOLETE) | Both a header-sort and a technician-filter deselect fire a **server request**; spec wants both client-side only. | Yes | [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | Reopen. | |
| R10 | TU | **SV-8950** (OBSOLETE) | **Summary row still missing** from both the Summary PDF and the Expanded PDF (filename half is now fixed). | Yes (partial) | [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | Reopen — Summary-row-missing is real. | |
| R11 | TU | **SV-8951** (OBSOLETE) | **Two** spreadsheet files, and the Expanded CSV holds a **row per day**; neither CSV contains the Summary row. Spec wants one summary-level CSV. | Yes | [C30436](https://shopview.testrail.io/index.php?/cases/view/30436), [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) | Reopen. | |
| R12 | TU | **SV-8952** (OBSOLETE) | Success toast "Data exported successfully." (spec "Download started"); failure toast "Empty export…" (spec "Failed to download report"). | Yes | [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | Reopen. | |
| R13 | TU | **SV-8954** (OBSOLETE) *(WIP cross-ref C38916)* | For a multi-location user the **Location column is 2nd (after Technician), not leftmost**, and Location is **never offered in Column Selection**. | Yes | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | Reopen. | |
| R14 | TU | **SV-8947** (OBSOLETE) | Select-all control labelled **"All technicians"**, not the specified **"Select all"** (behaviour passes). | Yes (label only) | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | Reopen (label). | |
| R15 | TU | **SV-8953** (OBSOLETE) | Expand / expand-all controls: accessible name + keyboard toggle work, but **`aria-expanded` is not reported** (state not exposed to AT). | Yes | [C30418](https://shopview.testrail.io/index.php?/cases/view/30418), [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | Reopen. | |
| R16 | WIP | **SV-8967** (OBSOLETE) | WO # is plain text (no link); the whole table has 0 links even for a user WITH Work Orders access. | Yes | [C30468](https://shopview.testrail.io/index.php?/cases/view/30468), [C43557](https://shopview.testrail.io/index.php?/cases/view/43557), [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) | Reopen. | |
| R17 | WIP | **SV-8970** (OBSOLETE) | Header, data rows and Totals row all pale blue-grey `rgb(249,250,251)`, not white. | Yes (exactly) | [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | Reopen. | |
| R18 | WIP | **SV-8987** (OBSOLETE) | Days Open **and** Last Activity column headers left-aligned (expected right); Days Open data cell also left-aligned. Broader than the ticket named. | Yes (broader) | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | Reopen. | |
| R19 | WIP | **SV-8988** (OBSOLETE) | Estimates summary figure `rgb(54,65,82)` — identical to the others, **not toned down/muted** as spec wants. | Yes | [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | Reopen. | |
| R20 | WIP | **SV-8989** (OBSOLETE) | Labor Delta shows **two** decimals (`+3.00`), expected one (`+3.0`). Sign correct. | Yes | [C30481](https://shopview.testrail.io/index.php?/cases/view/30481) | Reopen. | |
| R21 | WIP | **SV-8969** (OBSOLETE) | Customer filter offers "Clear all" **before any selection** (expected only after ≥1 pick, labelled "Clear"). | Yes | [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | Reopen. | |
| R22 | WIP | **SV-8968** (OBSOLETE) | Changing a filter fires a **server request** (server-side recompute); expected on-screen narrowing with no request. Figures correct either way. | Yes | [C30505](https://shopview.testrail.io/index.php?/cases/view/30505), [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) *(held Automated)* | Reopen. | |
| R23 | IV | **SV-8926** (OBSOLETE) | Totals row's first cell reads **"Totals"**; spec S4-R1 asks for **"Total"**. | Yes | [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | Reopen (cosmetic) — QA lead's call. | |
| R24 | IV | **SV-8930** (OBSOLETE) | Empty-state message present ("No inventory value to show for this selection.") but wording ≠ spec's standard "Empty bays, endless possibilities. Get Going!". | Yes (different wording) | [C30539](https://shopview.testrail.io/index.php?/cases/view/30539) | Reopen — QA lead's call. | |
| R25 | IV | **SV-8931** (OBSOLETE) | First visit (fresh browser context) opens **All locations**, not the active location (S1-R3/S7-R2). | Yes | [C30536](https://shopview.testrail.io/index.php?/cases/view/30536), [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | Reopen — QA lead's call. | |
| R26 | TU | **NO TICKET (NEW)** | **TU-EXP-07:** exporting with all technicians cleared shows an "Empty export / Export didn't yield any results" error toast, not the spec's silent no-op (S7-N1). Differs from BOTH spec and the old SV-8948 symptom. | Yes (new deviation) | [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | **File new** (Rule-52/73 bar). | |

---

## CLUSTER 2 — RECOMMEND CLOSE-AS-FIXED

| # | Report | Ticket (status) | What's fixed on v3.8 | Affected C-id(s) | Recommendation | Your decision |
|---|---|---|---|---|---|---|
| C1 | SBR / IV | **SV-8823** (**OPEN — TESTING QA**) | CSV money now written as **plain numbers**, not "$…" text; IV column order also correct (Total Cost last). | [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) (SBR), [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) (IV) | **Close the money portion.** ⚠️ First verify the CSV **honours column-selection-in-export** (IV sub-claim NOT tested this pass; C30588 keeps an SV-8823 note). | |

**Already-closed fixes confirmed on v3.8 (informational — no action):** SBC — SV-8962 (search icon present),
SV-8956 (filenames include range), SV-8937 (PDF end-date), SV-8818 (all 4 exports 200 at size), SV-9074
(Product Type toggles). SBR — SV-9001, SV-8999 (Labor Delta real signed values), SV-8977 (Totals/Subtotal),
SV-8880/SV-8972 (Summary/Expanded CSV columns). PV — **SV-8935** (CSV Last Sale plain integer). TU —
**SV-8948** (export respects filter), **SV-8949** (downloads A→Z). WIP — **SV-8907** (CSV download 500 fixed).

---

## CLUSTER 3 — PO QUESTIONS FOR CHRIS WARD (document conflicts — NOT filed as defects)

> **UPDATE 2026-08-19 (1st message) — Q1 is RESOLVED by Chris Ward** (he tidied the live spec to the line-state model, new S3-R5/S3-R6). A pending-Chris item, **Q4 (WIP per-line aging)**, was added below.
> **UPDATE 2026-08-19 (2nd message) — Q4 is now RESOLVED too**: Chris ruled aging is per job and *"that's final"*; the shared Days Open value on a two-row job is CORRECT (not a bug); the stray per-line line is gone as of spec page v24. **A separate Quote Age column is future work — SV-9372 (Parth, not started) — nothing to test; do NOT file the shared Days Open value as a defect in the meantime.** So **only Q2 and Q3 remain open.** Source: `build/report-suite/chris-answers-2026-08-19/WIP-CHRIS-RULINGS-2026-08-19.md`.

| # | Report | The conflict (plain) | Affected C-id(s) | Recommendation | Your decision |
|---|---|---|---|---|---|
| Q1 | WIP | ~~**WIP spec self-contradiction:** v22 still carries BOTH placement models — **S2-R4** ("appears once, in one tab") vs the **§3 SV-9027 line-state Key Decision** ("appears in each matching tab").~~ **✅ RESOLVED by Chris Ward 2026-08-19** — he tidied the LIVE Confluence page so Story 3 and S2-R4 now describe the line-state model (new S3-R5, S3-R6). Our cases already follow line-state (his 2026-08-18 answer B); the divergence note can be retired. **Still owed: pull the live page (local baseline v22 is behind) — register RS-WIP-6.** | [C30456](https://shopview.testrail.io/index.php?/cases/view/30456), [C30458](https://shopview.testrail.io/index.php?/cases/view/30458), [C43979](https://shopview.testrail.io/index.php?/cases/view/43979) | ~~Ask Chris to reconcile S2-R4 / Story 3 to the line-state model.~~ Done — RS-WIP-5 cleared. | **✅ RESOLVED 2026-08-19** |
| Q2 | SBC / SBR | **Invoice number: link or plain text?** The build renders a plain-text span (`text_sbc/sbr_invoice_<id>`, no href), but the spec states BOTH (S9-N2 link-to-access-denied vs S9-R1a plain-text-no-link). | [C30100](https://shopview.testrail.io/index.php?/cases/view/30100), [C43558](https://shopview.testrail.io/index.php?/cases/view/43558), [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) (+ SBR-LINK cases) | Chase the PO for the intended behaviour. | |
| Q3 | PV | **Parts Velocity Location-column position** is contested: SV-8938 says "leftmost, before Type", but the spec says two different things (S3-R10 access-gated/toggleable vs S2-R12 scope-tied; the 20 picker columns don't list Location). Column sits 6th on screen + in CSV. | [C38914](https://shopview.testrail.io/index.php?/cases/view/38914), [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) *(held Automated)* | Get Chris Ward's answer on the intended position/toggle **before** reopening or refiling SV-8938. | |
| Q4 | WIP | ~~**WIP per-line aging (NEW pending-Chris, 2026-08-19).**~~ **✅ RESOLVED by Chris Ward's 2nd message 2026-08-19**, verbatim: *"Aging is per job, and that's final … both rows show the same number. That's correct behavior, not a bug … The spec's stray line about unapproved lines ageing from the line's creation date is gone as of page v24."* → aging is **per job, FINAL**; **do NOT file the shared Days Open value on a two-row job as a defect** (a separate Quote Age column is future work — **SV-9372**, Parth, not started; nothing to test now). WIP-COL-07 keeps whole-job Days Open (S4-R12) + "both rows same number, correct not a defect"; NO per-line aging. | [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) | ~~Chase Chris.~~ Done — RS-WIP-4 cleared; RS-WIP-7 opened for SV-9372 Quote Age (future, do not file the shared value). | **✅ RESOLVED 2026-08-19** |

---

## APPENDIX — cases KEPT `EXPECT-FAIL (SV-8818)` (PDF export server error; ticket already OPEN)

**SV-8818 is OPEN (TESTING QA) and reproduces live** — the PDF export returns HTTP 500/502 (or times out on a
large view) while the CSV works. These cases correctly keep their live-backed EXPECT-FAIL marker; **no action
beyond confirming SV-8818 stays open.**

| Report | Cases | Symptom on v3.8 |
|---|---|---|
| PV | C38885, C43547 | PDF export 500 on a medium view; over-cap views correctly refused with the standard message. |
| IV | C30587, C30590, C30591, C30593, C30595, C43548 | PDF export times out / 500 on the large IV view (5,703 rows); small filtered views work (HTTP 200). |
| SBR | C30290, C30320 | Over-cap Expanded-PDF / API row-cap — state not reachable at 88 invoices; base exports 200. Left EXPECT-FAIL. |
| TU | — | SV-8818 does **NOT** reproduce for TU (every TU PDF export returns 200); C38887 was moved to HOLD (over-cap unseedable). |

---

## OUTSTANDING — what I need from you
Nothing is filed. When the Jira-creation hold lifts: **reopen/refile the 26 defects (Cluster 1) one at a time
against the Rule-73 checklist**, **close the money portion of SV-8823 (Cluster 2) after verifying
column-selection-in-export**, and **forward Chris Ward the remaining PO questions (Cluster 3: Q2 and Q3 only —
Q1 and Q4 are both RESOLVED as of 2026-08-19)**. **Do NOT file the shared WIP Days Open value on a two-row
job as a defect** — aging is per job and final; the separate Quote Age column is future work (SV-9372, Parth,
not started). All logged in `build/OUTSTANDING-ITEMS-REGISTER.md`.
