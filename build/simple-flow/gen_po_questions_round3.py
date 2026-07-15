#!/usr/bin/env python3
"""Generate the ROUND-3 PO question sheet for Milos (Simple Flow PO).

Outputs (regenerable — run from the repo root):
  - build/simple-flow/PO-Questions-Round3.xlsx
  - build/simple-flow/PO-Questions-Round3.md

Sheets / sections:
  - "Questions for PO"    : reader-facing, VERY SIMPLE layman language ONLY.
                            NO case IDs, SF-/BUG codes, API/HTTP terms, or jargon.
                            Columns: # | Topic | What happens now | The question |
                            Options | Your answer (blank).
  - "QA Internal Mapping" : QA-only. Per question, the gated MILOS-ANSWER case IDs
                            with TestRail Case ID C##### + clickable link (standing
                            rule 8; source testrail-id-map.csv), spec refs, and what
                            each answer option resolves to. Includes a ledger of all
                            15 gated MILOS-ANSWER cases and the SF-QB-09 dev-confirm
                            item (flagged for developers, NOT Milos).

Rounds 1 & 2 were answered by Milos (see milos-answers-mapping.md and
milos-round2-mapping.md). These 6 are the remaining genuine PRODUCT DECISIONS still
open after Round 2 + the RE-VIU BATCH 7/8 pass (PROJECT-STATE §5.F). Bugs/defects
are NOT included here (standing rule 7) — they go in SimpleFlow_Bug-Drafts.*.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

XLSX_OUT = "build/simple-flow/PO-Questions-Round3.xlsx"
MD_OUT = "build/simple-flow/PO-Questions-Round3.md"

TR_LINK = "https://shopview.testrail.io/index.php?/cases/view/{}"

HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(bold=True, size=14, color="1F4E79")
LINK_FONT = Font(color="0563C1", underline="single")
WRAP = Alignment(wrap_text=True, vertical="top")
WRAP_CENTER = Alignment(wrap_text=True, vertical="top", horizontal="center")
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

# ---------------------------------------------------------------------------
# Reader-facing content (layman ONLY — no IDs, no codes, no tech terms)
# ---------------------------------------------------------------------------
questions = [
    {
        "picture": ("A mechanic just finished fixing a customer's car, so the repair "
                    "job is done. Right away, the shop can send the customer their "
                    "bill - even though nobody has double-checked the mechanic's work "
                    "yet."),
        "today": ("The bill can go out straight away, before anyone reviews or "
                  "approves the finished job."),
        "decide": ("Should the system make someone review and approve the job first, "
                   "before the customer's bill can be sent?"),
        "opts": ("A) The job must be reviewed and approved before the bill can go out.\n"
                 "B) It's fine to send the bill without a review.\n"
                 "C) Let each shop choose for itself."),
    },
    {
        "picture": ("A brand-new shop opens the app for the very first time and starts "
                    "writing up repair jobs, with nothing changed yet."),
        "today": ("There is a step for \"someone must review a job before it's "
                  "finished,\" and we need to decide how it should start out for a "
                  "brand-new shop."),
        "decide": ("When a brand-new shop first starts, should that \"must review "
                   "before finishing\" step start turned ON or start turned OFF?"),
        "opts": ("A) Start turned ON.\n"
                 "B) Start turned OFF."),
    },
    {
        "picture": ("Someone is part-way through a repair job that isn't finished, and "
                    "they click to close it or cancel it."),
        "today": ("Nothing warns them - it just closes, even if the job isn't done "
                  "and there is unsaved work."),
        "decide": ("What should happen when someone closes or cancels a repair job "
                   "that isn't finished?"),
        "opts": ("A) Show a pop-up message asking them to confirm before leaving.\n"
                 "B) Only warn them when there is unfinished or unsaved work.\n"
                 "C) No pop-up needed - just let it close."),
    },
    {
        "picture": ("A parts person is receiving a delivery of parts. A few of the "
                    "parts don't have a supplier chosen yet, so they're bunched "
                    "together in their own group."),
        "today": ("That \"no supplier yet\" group shows up at the bottom of the list "
                  "on the newer receiving screen."),
        "decide": ("Where should the \"no supplier yet\" group appear in the receiving "
                   "list?"),
        "opts": ("A) At the top of the list.\n"
                 "B) At the bottom of the list.\n"
                 "C) Mixed in with all the other parts."),
    },
    {
        "picture": ("A mechanic is wrapping up a repair job, but one of the parts on "
                    "it still shows a price of $0."),
        "today": ("The system lets them finish the job even with that $0 part price."),
        "decide": ("Should the system let them finish the job with a $0 part price, or "
                   "stop them until a real price is entered?"),
        "opts": ("A) Let them finish even at $0.\n"
                 "B) Stop them until a price is entered."),
    },
    {
        "picture": ("Someone is adding a part to a repair job, but no supplier has "
                    "been chosen for that part yet."),
        "today": ("Anyone who can work on the job is able to add a part like this."),
        "decide": ("Who should be allowed to add a part that has no supplier yet?"),
        "opts": ("A) Only people who are allowed to see prices and money figures.\n"
                 "B) Anyone who can edit the repair job."),
    },
]

# ---------------------------------------------------------------------------
# QA-internal mapping (rule 8: TestRail C##### + clickable link per case).
# Each entry: (q_no, [(sf_id, testrail_id), ...], refs, resolves_to)
# ---------------------------------------------------------------------------
internal_map = [
    (1,
     [("SF-REV-08", 29393), ("SF-REV-11", 29396), ("SF-REV-10", 29395)],
     "requirements.md Story 16 R5/R8 (distinct Reviewed state; invoicing blocked "
     "until reviewed). Re-ask of Round-1 Q8 (\"not sure what this means?\", "
     "milos-answers-mapping.md). SF-REV-10 = related review-dialog case.",
     "A -> SF-REV-08 expected keeps a distinct Reviewed holding state and SF-REV-11 "
     "expected keeps \"invoicing blocked until reviewed\" (both currently gated on "
     "this ruling). B -> rewrite both: sign-off completes directly and invoicing is "
     "NOT gated on review. NOTE: SF-REV-10 (review-note) already RESOLVED in Round-2 "
     "Q1 (note descoped, VIN-only) — listed for completeness, not re-asked."),
    (2,
     [("SF-REV-15", 29400)],
     "requirements.md Story 16 R Open (Require-Review default). Round-1 Q1 answer "
     "was \"ON for all orgs\"; this re-confirms the NEW-ORG out-of-box default "
     "specifically (and whether the live default matches).",
     "A -> SF-REV-15 expected = default ON for new orgs (if live default != ON that "
     "becomes a separate bug to verify). B -> SF-REV-15 expected = default OFF for "
     "new orgs."),
    (3,
     [("SF-UX-04", 29404)],
     "requirements.md Story 15 R4 (close-confirmation modal). Round-1 Q10 gave the "
     "Close/Cancel behavior but the design is still \"to be added\"; this confirms "
     "final wording + button behavior.",
     "A -> SF-UX-04 expected = Close closes only the modal and keeps entered data "
     "(stays on the WO); Cancel closes the modal and returns to the previous screen; "
     "nothing discarded. B -> capture Milos's alternate wording/behavior and rewrite "
     "SF-UX-04 accordingly."),
    (4,
     [("SF-RCV-05", 29373), ("SF-RCV-07", 29375)],
     "requirements.md Story 12 R1/R3 (vendor-missing group ordering). Round-1 Q11 "
     "recommended top/leads; RE-VIU BATCH 7 OBS-2: the Bulk Receive page renders the "
     "vendor-missing group LAST — should it also lead? Wording-only.",
     "A -> SF-RCV-05 expected #3 changed from \"at the bottom\" to \"leads (top)\" "
     "on every receive screen (incl. Bulk Receive); SF-RCV-07 already says \"leads "
     "(top)\" — confirmed, no change. B -> SF-RCV-05 stays \"at the bottom\" on the "
     "newer (Bulk Receive) screen; only the legacy Accept-Delivery screen leads."),
    (5,
     [("SF-VPART-01", 29331), ("SF-VPART-02", 29332), ("SF-VAL-09", 29423),
      ("SF-QB-06", 29431)],
     "PROJECT-STATE §5.F.2: design screenshot \"$0.00 sell price, no action needed "
     "to continue\" vs spec S5-R1 \"sell mandatory at save\". (Milos R2 Q4 already "
     "ruled sell NOT enforced on the vendorless part-request form; THIS is the "
     "remaining completion/receive-surface $0-sell tension.) Not one of the 15 gated "
     "MILOS cases — these are the genuinely-affected cases.",
     "A -> $0 sell allowed at completion; SF-VAL-09 / SF-QB-06 / SF-VPART-01/02 "
     "expecteds align to \"$0 sell permitted, note shown\" (consistent with R2 Q4). "
     "B -> sell mandatory before finish/save; add a completion-time sell-required "
     "gate to the affected expecteds."),
    (6,
     [("SF-VPART-02", 29332), ("SF-PERM-09", 29413)],
     "PROJECT-STATE §5.F.3 / milos-round2-mapping.md Q4 follow-up: the See-Financial-"
     "Data gate on vendorless part-add was premised on a mandatory sell price (now "
     "overturned by R2 Q4). Whether a permission gate still applies is open. Not one "
     "of the 15 gated MILOS cases — these are the affected cases.",
     "A -> keep the See-Financial-Data negative on SF-PERM-09 and SF-VPART-02 "
     "(permission still gates vendorless part-add). B -> drop the See-Financial-Data "
     "gate from both — any WO-edit role can add a vendorless part."),
]

# The full 15 gated MILOS-ANSWER cases (blockers tracker). The 8 below are gated
# cases already RESOLVED in Round 1/2 (or moved to a bug) and are NOT re-asked in
# Round 3 — listed for the complete ledger. (The other 7 appear under Q1-Q4 above:
# SF-REV-08, SF-REV-11, SF-REV-10, SF-REV-15, SF-UX-04, SF-RCV-05, SF-RCV-07.)
resolved_ledger = [
    ("SF-SET-03", 29277, "Story 1 R2 (Create POs toggle)",
     "RESOLVED Round-1 Q5 — Create-POs toggle descoped (POs always on). Not re-asked."),
    ("SF-SET-08", 29282, "Story 1 / §4 first-use defaults",
     "MOVED TO A BUG — wrong first-use defaults (see SimpleFlow_Bug-Drafts, bug T5). "
     "Not a PO question."),
    ("SF-SET-13", 29287, "Story 1 (Save dirty-state)",
     "RESOLVED Round-1 Q6 — Save-always-enabled accepted (nice-to-have). Not re-asked."),
    ("SF-COMP-06", 29295, "Story 2 (Create POs OFF completion)",
     "RETIRED Round-1 Q5 — Create-POs-OFF scenario no longer exists. Not re-asked."),
    ("SF-COMP-07", 29296, "Story 2 / §5 invariant 1 (inventory decrement)",
     "CONFIRMED Round-2 Q3 — in-stock parts decrement + Part History on completion. "
     "VIU-Pending on a live decrement drive; not a PO question."),
    ("SF-TECH-08", 29330, "Story 17 vs S15-R2 (tech-story placement)",
     "RESOLVED Round-2 Q2 — Story 17 authoritative (inline + gate modal; complete one "
     "or many at once). Not re-asked."),
    ("SF-QB-01", 29426, "§5 invariant 1 (inventory decrement / Part History)",
     "CONFIRMED Round-2 Q3 — same as SF-COMP-07. VIU-Pending on a live drive; not a "
     "PO question."),
    ("SF-QB-02", 29427, "§4/§5 (Create POs OFF QuickBooks integrity)",
     "RETIRED Round-1 Q5 — Create-POs-OFF scenario no longer exists. Not re-asked."),
]

# Dev-confirm item — QA-internal tab ONLY, flagged for developers (NOT Milos).
# SF-QB-09 is the one Open-Question case not yet imported to TestRail (no C-ID).
dev_item = (
    "SF-QB-09", None,
    "requirements.md §5 (shared order/status logic must not affect Part Sales).",
    "FOR DEVELOPERS, NOT MILOS. Open dev-confirm: verify the Part Sales flow is "
    "unaffected by the shared order/status logic Simple Flow introduces. Product "
    "decision not required — a code/behavior confirmation from the dev team. "
    "(Not yet imported to TestRail — no Case ID; the sole Open-Question case.)")

# ---------------------------------------------------------------------------
# XLSX
# ---------------------------------------------------------------------------
wb = Workbook()

ws = wb.active
ws.title = "Questions for PO"
ws.column_dimensions["A"].width = 5
for col, w in zip("BCDEF", [50, 42, 44, 52, 28]):
    ws.column_dimensions[col].width = w

ws["A1"] = "Simple Mode - Round 3: A Few Quick Questions for You"
ws["A1"].font = TITLE_FONT
ws.merge_cells("A1:F1")
intro = ("Thanks so much, Milos - just pick one option per row; there are no wrong "
         "answers, we just need your preference. Each row tells a quick little "
         "story of something happening in the shop, then asks what you'd like the "
         "app to do.")
ws["A2"] = intro
ws["A2"].alignment = WRAP
ws.merge_cells("A2:F2")
ws.row_dimensions[2].height = 45

headers = ["#", "Picture this", "What happens today",
           "What we need you to decide", "Your options", "Your answer"]
HDR_ROW = 4
for c, h in enumerate(headers, start=1):
    cell = ws.cell(row=HDR_ROW, column=c, value=h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = WRAP_CENTER
    cell.border = BORDER
ws.freeze_panes = "A5"

for i, item in enumerate(questions, start=1):
    row = HDR_ROW + i
    vals = [i, item["picture"], item["today"], item["decide"], item["opts"], ""]
    for c, v in enumerate(vals, start=1):
        cell = ws.cell(row=row, column=c, value=v)
        cell.alignment = WRAP_CENTER if c == 1 else WRAP
        cell.border = BORDER
    ws.row_dimensions[row].height = 150

# --- QA Internal Mapping sheet ---
wi = wb.create_sheet("QA Internal Mapping")
wi["A1"] = ("INTERNAL - for QA only. Do NOT share this tab (or any IDs/codes on it) "
            "with the PO.")
wi["A1"].font = Font(bold=True, color="C00000", size=12)
wi.merge_cells("A1:F1")

ihead = ["Q#", "Case (internal ID)", "TestRail Case ID", "TestRail link",
         "Refs", "What each answer option resolves to"]
iwid = [5, 16, 15, 46, 50, 66]
IH_ROW = 3
for c, (h, w) in enumerate(zip(ihead, iwid), start=1):
    cell = wi.cell(row=IH_ROW, column=c, value=h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = WRAP_CENTER
    cell.border = BORDER
    wi.column_dimensions[chr(64 + c)].width = w
wi.freeze_panes = "A4"

r = IH_ROW + 1
for qno, cases, refs, resolves in internal_map:
    first = r
    for sf_id, tr_id in cases:
        url = TR_LINK.format(tr_id)
        rowvals = [qno, sf_id, f"C{tr_id}", url, refs, resolves]
        for c, v in enumerate(rowvals, start=1):
            cell = wi.cell(row=r, column=c, value=v)
            cell.alignment = WRAP_CENTER if c in (1, 2, 3) else WRAP
            cell.border = BORDER
        link_cell = wi.cell(row=r, column=4)
        link_cell.hyperlink = url
        link_cell.font = LINK_FONT
        wi.row_dimensions[r].height = 130
        r += 1
    last = r - 1
    if last > first:
        for col in (1, 5, 6):
            wi.merge_cells(start_row=first, start_column=col,
                           end_row=last, end_column=col)

# --- Ledger: the remaining gated MILOS-ANSWER cases (resolved / not re-asked) ---
r += 1
ledger_title = wi.cell(row=r, column=1, value=(
    "Gated MILOS-ANSWER cases already resolved in Round 1/2 (or moved to a bug) - "
    "NOT re-asked in Round 3. Together with the 7 cases under Q1-Q4 above "
    "(SF-REV-08, SF-REV-11, SF-REV-10, SF-REV-15, SF-UX-04, SF-RCV-05, SF-RCV-07) "
    "these complete the 15 gated MILOS-ANSWER cases from the blockers tracker."))
ledger_title.font = Font(bold=True, color="1F4E79")
ledger_title.alignment = WRAP
wi.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
wi.row_dimensions[r].height = 45
r += 1
for c, h in enumerate(["", "Case (internal ID)", "TestRail Case ID", "TestRail link",
                       "Refs", "Status / resolution"], start=1):
    cell = wi.cell(row=r, column=c, value=h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = WRAP_CENTER
    cell.border = BORDER
r += 1
for sf_id, tr_id, refs, status in resolved_ledger:
    url = TR_LINK.format(tr_id)
    rowvals = ["", sf_id, f"C{tr_id}", url, refs, status]
    for c, v in enumerate(rowvals, start=1):
        cell = wi.cell(row=r, column=c, value=v)
        cell.alignment = WRAP_CENTER if c in (2, 3) else WRAP
        cell.border = BORDER
    lc = wi.cell(row=r, column=4)
    lc.hyperlink = url
    lc.font = LINK_FONT
    wi.row_dimensions[r].height = 60
    r += 1

# --- Dev-confirm item (developers, NOT Milos) ---
r += 1
dev_title = wi.cell(row=r, column=1, value=(
    "Dev-confirm item - FOR DEVELOPERS, NOT MILOS (no product decision needed):"))
dev_title.font = Font(bold=True, color="C00000")
wi.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
r += 1
sf_id, tr_id, refs, status = dev_item
tr_disp = f"C{tr_id}" if tr_id else "(not in TestRail)"
url = TR_LINK.format(tr_id) if tr_id else ""
rowvals = ["DEV", sf_id, tr_disp, url or "n/a", refs, status]
for c, v in enumerate(rowvals, start=1):
    cell = wi.cell(row=r, column=c, value=v)
    cell.alignment = WRAP_CENTER if c in (1, 2, 3) else WRAP
    cell.border = BORDER
if url:
    dc = wi.cell(row=r, column=4)
    dc.hyperlink = url
    dc.font = LINK_FONT
wi.row_dimensions[r].height = 60
r += 1

note_row = r + 1
wi.cell(row=note_row, column=1, value=(
    "Notes: Round-3 questions raised after Milos Round-2 answers + RE-VIU BATCH 7/8 "
    "(PROJECT-STATE.md §5.F). TestRail IDs sourced from testrail-id-map.csv "
    "(standing rule 8). Rounds 1 & 2 were answered by Milos - see "
    "milos-answers-mapping.md and milos-round2-mapping.md. Bugs/defects stay OUT of "
    "the PO-facing tab (standing rule 7) and are delivered separately in "
    "SimpleFlow_Bug-Drafts.xlsx; these 6 items are genuine product decisions.")
    ).alignment = WRAP
wi.merge_cells(start_row=note_row, start_column=1, end_row=note_row, end_column=6)
wi.row_dimensions[note_row].height = 75

wb.save(XLSX_OUT)

# ---------------------------------------------------------------------------
# Markdown mirror
# ---------------------------------------------------------------------------
md = []
md.append("# Simple Mode — Round 3: A Few Quick Questions for You")
md.append("")
md.append("Thanks so much, Milos! **Just pick one option per row — there are no")
md.append("wrong answers, we just need your preference.** Each item below tells a")
md.append("quick little story of something happening in the shop, then asks what")
md.append("you'd like the app to do.")
md.append("")
md.append("---")
for i, item in enumerate(questions, start=1):
    md.append("")
    md.append(f"## {i}.")
    md.append("")
    md.append("**Picture this**")
    md.append(item["picture"])
    md.append("")
    md.append("**What happens today**")
    md.append(item["today"])
    md.append("")
    md.append("**What we need you to decide**")
    md.append(item["decide"])
    md.append("")
    md.append("**Your options**")
    for line in item["opts"].split("\n"):
        md.append(f"- {line}")
    md.append("")
    md.append("**Your answer:** ______________________________________________")
    md.append("")
    md.append("---")
md.append("")
md.append("## Thank you!")
md.append("")
md.append("That's everything for this round. Your answers will help us finish this")
md.append("feature the way you want it. Feel free to add any notes alongside your")
md.append("choices.")
md.append("")
md.append("---")
md.append("---")
md.append("")
md.append("## Internal — QA-only mapping (NOT for the PO)")
md.append("")
md.append("This section links each plain-English question above to its gated")
md.append("MILOS-ANSWER cases, TestRail cases, refs and what each answer resolves to.")
md.append("**Do not include this section (or any IDs/codes in it) in the PO-facing")
md.append("copy or the \"Questions for PO\" tab.**")
md.append("")
for qno, cases, refs, resolves in internal_map:
    md.append(f"### Q{qno}")
    md.append("")
    md.append("- **TestRail cases:**")
    for sf_id, tr_id in cases:
        url = TR_LINK.format(tr_id)
        md.append(f"  - {sf_id} — [C{tr_id}]({url})")
    md.append(f"- **Refs:** {refs}")
    md.append(f"- **Resolves to:** {resolves}")
    md.append("")
md.append("### Gated MILOS-ANSWER cases already resolved in Round 1/2 (or moved to a bug) — NOT re-asked")
md.append("")
md.append("Together with the 7 cases under Q1–Q4 above (SF-REV-08, SF-REV-11,")
md.append("SF-REV-10, SF-REV-15, SF-UX-04, SF-RCV-05, SF-RCV-07) these complete the")
md.append("15 gated MILOS-ANSWER cases from the blockers tracker.")
md.append("")
for sf_id, tr_id, refs, status in resolved_ledger:
    url = TR_LINK.format(tr_id)
    md.append(f"- {sf_id} — [C{tr_id}]({url}) — *{refs}* — {status}")
md.append("")
md.append("### Dev-confirm item — FOR DEVELOPERS, NOT MILOS")
md.append("")
sf_id, tr_id, refs, status = dev_item
if tr_id:
    md.append(f"- {sf_id} — [C{tr_id}]({TR_LINK.format(tr_id)}) — *{refs}* — {status}")
else:
    md.append(f"- {sf_id} — (not yet in TestRail) — *{refs}* — {status}")
md.append("")
md.append("**Notes:** Round-3 questions raised after Milos Round-2 answers + RE-VIU")
md.append("BATCH 7/8 (`PROJECT-STATE.md` §5.F). TestRail IDs sourced from")
md.append("`testrail-id-map.csv` (standing rule 8). Rounds 1 & 2 were answered by")
md.append("Milos — see `milos-answers-mapping.md` and `milos-round2-mapping.md`.")
md.append("Bugs/defects stay OUT of the PO-facing content (standing rule 7) and are")
md.append("delivered separately in `SimpleFlow_Bug-Drafts.xlsx`; these 6 items are")
md.append("genuine product decisions.")
md.append("")

with open(MD_OUT, "w") as f:
    f.write("\n".join(md))

print(f"Wrote {XLSX_OUT} and {MD_OUT} with {len(questions)} round-3 PO questions.")
