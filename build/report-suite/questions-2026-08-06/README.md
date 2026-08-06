# Chris Ward question sheet — Report Suite — 2026-08-06

**Authorised by the QA lead, verbatim:** *"If there are more questions for Chris make sheet for him."*

**STATUS: READY TO SEND — not sent. Nothing written to TestRail or Jira.**

| File | What it is |
|---|---|
| `Questions-for-Chris-Ward_Report-Suite_2026-08-06.xlsx` | **the version to send.** 4 tabs; the 4th is QA-only and must not be forwarded |
| `Questions-for-Chris-Ward_Report-Suite_2026-08-06.md` | plain-language twin |
| `gen_chris_sheet.py` | generator; mirrors the 2026-08-04 and 2026-08-05 peers 1:1 (Rule 16) |

**13 items:** 1 confirmation releasing 7 held tests · 5 decisions · 7 wording edits needing only a tick.

## Source currency (Rules 31 + 59) — fetched live, and re-read immediately before writing

All six report descriptions read over `GET /wiki/rest/api/content/<id>?expand=version,body.storage`,
**HTTP 200 on all six**, 2026-08-06. The **Confluence version number** was used, never the version
written inside the document body (Rule 31's trap).

| Report | Page | Version | Last edited | Verdict |
|---|---|---|---|---|
| Sales By Customer | 577634305 | **15** | 2026-08-05T17:53:06Z | CURRENT |
| Sales By Representative | 585629698 | **17** | 2026-08-05T17:53:08Z | CURRENT |
| Parts Velocity | 620888066 | **5** | 2026-08-05T13:21:40Z | CURRENT |
| Technician Utilization | 641400833 | **6** | 2026-08-05T13:33:10Z | CURRENT |
| Work In Progress | 703660034 | **9** | 2026-08-05T17:54:07Z | CURRENT |
| Inventory Value | 720142338 | **4** | 2026-08-05T13:33:13Z | CURRENT |

**TestRail** — read-only (`get_sections`, `get_cases`): 481 cases live under group 4281, **476 ours**,
5 Vladimir Tomovic's (hands off, Rule 38). All 476 searched in full. **No sampling** (Rule 50).

**The build is NOT a source we could use today.** `GET /api/auth/me/fe-permissions` on
`sv8582api.qa.shopview.com` → **HTTP 401 `sso_required`**. `quick-login` and `switch-user` were
**deliberately not called** — both rotate the shared session and would sign concurrent workers out.
**The branch has also redeployed:** `index.html` on `sv8582.qa.shopview.com` now reads
**`v3.5-f77875c`** (last-modified Thu 06 Aug 2026 10:43:37 GMT), where the pass this sheet cites ran
on `v3.5-16cf83f`. So every build observation quoted to Chris is worded as *"when we last looked"*.
All Report Suite verdicts remain **PROVISIONAL**; Rule-49 queues are OPEN.

**Epic SV-8582** was not re-read and no claim on the sheet rests on it. **Designs: ABSENT** (spec-only project).

## Three stale numbers in our own records, corrected before anything reached Chris

1. **The held Location count is SEVEN.** Counted live: C30467, C30551, C30554, C30588, C38912,
   C38917, C43551. The brief for this task said 8; `build/OUTSTANDING-ITEMS-REGISTER.md` C2 says 12;
   an earlier draft said 16. All three are stale — the 2026-08-06 pass released the others.
2. **SIX of the six descriptions still state the Location model both ways, not four.** HARD (the text
   denies the user can toggle it): **PV v5** near S4-R1 *"is not user-toggleable"* · **WIP v9 S7-R13**
   *"the user does not toggle it in the column selector"* · **IV v4 S7-R6** *"not one of the columns
   offered in the column-selection control"*. MILDER (visibility follows the SELECTION, not ACCESS):
   **SBC v15** overview line · **SBR v17 S21-R7** · **TU v6**, two lines. **SBC's live contradiction is
   NOT at S13-R4**, which the register names.
3. **Three of the six DO document the export cap** — SBC v15, SBR v17, IV v4 — and it is absent from
   **PV v5, TU v6, WIP v9** (zero matches for `10,000` / `10k` / *"too large to export"* in any of the
   three). `full-viu-2026-08-06/FINDINGS.md` and `FILED.md` both say *"none of the six specifications
   mentions the cap"*; **that is wrong**. Those files were not edited — they belong to another pass.

## Deliberately left OFF the sheet

| Item | Why |
|---|---|
| **Q2 — the totals line when nothing matches** | **Its premise is false.** SBC v15 answers it **twice**: *"the export still downloads, containing the column headers and a totals row of zeros"* and *"the report shows the empty state (Story 17) and the totals row shows zeros"* (near S18-R10/R11, read live). So the build showing no totals line is a **DEFECT against his own document**, not a decision — and Rule 7 forbids putting a bug in front of a PO. **`NO-SOURCE-DEFECTS.md` item 2 is wrong to say no requirement covers it**, and SBC-EXP-11 ([C30173](https://shopview.testrail.io/index.php?/cases/view/30173)) still asserts the zeros row and reads `AUTOMATION: READY`. **This wants a ticket.** |
| The en-dash vs em-dash in the SBC PDF date heading | A sourced defect (S15-R11) needing a one-word QA-lead ruling — fold into SV-8937, file separately, or drop. Not a PO question. |
| Location column not sortable | Already filed as SV-8963. |
| Work In Progress export server error | Already covered by SV-8907. |
| The ~10,000-row refusal itself | **Deliberate and in the epic** (SV-8591). Only the documentation half is asked. |
| Today / Yesterday date presets | **He answered on 5 August** and our case already follows it. Checking our own newer sources first is what kept it off. |

## Outstanding — what is needed

1. **Send the workbook** (the `.xlsx`; do not forward tab 4).
2. **A ticket for the missing totals line** — a defect, not a question. Needs your go-ahead.
3. **A one-word ruling on the en/em dash** — fold into SV-8937, file separately, or drop.
4. **Fresh `cf_clearance` for `.qa.shopview.com`** before any build claim is re-measured — read
   playbook §A's traps first; a 401 is usually an expired clearance, not a dead sign-in.
5. **Nothing here is authorised to be applied.** No case was edited; the 7 held cases stay held until
   Chris answers.


---

## ⚠️ 2026-08-06 — THE FRIENDLY VERSION IS THE ONE TO SEND

`Questions-for-Chris-Ward_Report-Suite_Friendly-Version_2026-08-06.xlsx` (+ `.md`) is the forward-as-is version for Chris Ward: same substance, a short warm
opening note, ordered by what to do first, shorter sentences. Generator
`gen_chris_friendly.py`.
The earlier pair in this folder is **superseded and bannered** — kept as the record, not for sending.
