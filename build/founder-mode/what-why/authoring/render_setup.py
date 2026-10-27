#!/usr/bin/env python3
"""Writes ../WHAT-WHY-SETUP-FILE.md, the ONE setup file for Claude sessions (Rule 117 ninth amendment; it replaces the 37 per-case
Google Docs of 13 Oct, which no case links any more). A tester never needs it. It may hold examples, recipes and example names; it never
holds a credential, a cookie or session data. python3 render_setup.py"""
import os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wwlib as L, build_mods  # noqa: F401
MAP = L.id_map()
SHARED = """
## 1 · Accounts and places (slots)
| Slot | What it is | Notes |
|---|---|---|
| Admin at the test location | the build's Admin user | Every case except S3-07 and S3-18. The developers' QA notes say "Log in as admin unless a step says otherwise". |
| user B (no financial data) | a user whose role has Reports and Invoicing & payments - View on and See financial data off | S3-07. Make the role in Settings → Roles & Permissions. |
| user B (no invoices) | a user whose role has Reports on and Invoicing & payments - View off | S3-18, plus a second browser signed in as the Admin. |
| QuickBooks-connected location | a location whose QuickBooks Online connection is active, to a sandbox company you can sign in to | S3-03, S3-09, S3-14, S3-15, S3-17. On the QA build that is the QuickBooks host (the epic's developer comments name it; it runs the same code against the QA backend). The QA's 23 Oct pass used sandbox company "CA 3e09"; the US sandbox gave a tax-code error ("TAX or NON") and had to be reconnected and remapped. |

## 2 · Shared recipes (screens first; every value below is an example unless the case fixes it)
- **Require Tech Story.** Settings → Work Orders tab → LINE REQUIREMENTS → Require Tech Story → Save Settings (observed on another suite, 9 Sep 2026). Organisation-wide: cases that need it on (S3-01, S3-03, S3-06, S3-11, S3-19, S3-21) and off (the rest of Story 3) cannot run in parallel on one organisation. PRD v15 S3-R6a: shops created since June 2025 start with it off, older shops on.
- **A labor line with exact values.** Work order → Lines tab → New Line → type the title in the Title box (do not pick a canned line) → Description → Save & Close. Long values (5,000 digits, 3,000 é) are pasted: in Google Sheets =REPT("0123456789",500) or =REPT("é",3000), copy the cell, paste.
- **A tech story.** With Require Tech Story on, the completion gate asks for it. With it off, a tech story is typed on the line before completing it (screen label not confirmed by any source: the build verification session records it).
- **"Tech story missing."** PRD v15 S3-R6 / Product answer 6: save an existing line with no tech story once from Edit Line (open → Save & Close). A line saved from New Line keeps an empty tech story.
- **Invoice a work order.** Complete the line(s) → status Complete → Finance tab → Create Invoice → close the New Customer Payment window. On a QuickBooks-connected location the invoice syncs at once; failures land in Reports → QB Unexported.
- **Customer Invoice report.** Reports → Export Reports (Reports left menu, under Accounting) → "Export Report" dialog → Report Name: Customer Invoice → date range → Download. Column with the line text: ItemDescription (developers' notes). Open in Google Sheets (File → Import → Upload) so UTF-8 reads correctly (Excel can show "Ã©" for é in a CSV without a byte-order mark).
- **Invoices import.** Settings → Data Import → Invoices: Download template, fill one Labor row, upload. Messages (developers' notes): "All invoices have been imported successfully."; a wrong header: "Invalid file headers provided!" and "Failed to import all invoices."; a duplicate invoice number: "Some invoices have failed to import.". A file saved from Excel as "CSV UTF-8" is rejected as invalid headers (byte-order mark, pre-existing): save as plain CSV.
- **Find an imported invoice.** Work Orders → All tab → List view → Status → Imported (clears the other statuses; greyed out in other views: "Imported work orders open in List.") → search by invoice number or customer (partial text works). Only the current location's imports show (developer, SV-10133, 21 Oct).
- **Records from before the release.** On staging the four stories were merged on 23 Oct 2026; on the QA build they were deployed 8 Oct (redeployed 19 Oct). Work orders / invoices older than that are "from before this release". An invoice synced to QuickBooks before then still reads "What are you doing?: …;Why are you doing it?: …;Tech Story: …" there.
- **An old Invoices template.** Download one from an environment without this change (for example production until the release), or use a saved copy; column 16 reads "*Line Title - What are you doing", column 17 "Line Description - Why are you doing it".
- **ShopCoach.** Work order → Lines tab → ShopCoach Line Builder box → type the job → Build Lines. Needs an asset with year, make and model. SV-11850 (27 Oct): on staging Build Lines shows nothing for every input.

## 3 · Traps
- The design boards draw staging screens and the PRD's example values; never search the app for the boards' record names.
- CSV formula cells: a title that starts with =, +, - or @ opens as a formula in a spreadsheet (developer note, pre-existing); every title in these cases starts with a letter.
- The report cuts at 4,000 storage units (bytes): LEN in a spreadsheet counts characters, so a line of é shows 2,009 characters for 3,999 bytes.
"""

def main():
    out = ["# What/Why (Title and Description) — setup file for Claude sessions (a tester does not need it)", "",
           f"Built by `authoring/render_setup.py` from the case library ({len(L.CASES)} cases). Sources: {L.PRD_NAME}, {L.READ}; "
           f"Product's answers of 14 Oct 2026; tech plan of 23 Sep 2026; Jira epic {L.EPIC} read 27 Oct 2026; design canvas {L.DESIGN_URL} "
           "(27 Oct copy). No credential, cookie or session data is written here.", SHARED, "## 4 · One recipe per case", ""]
    for c in L.CASES:
        r = MAP.get(c["key"])
        out.append(f"### {c['key']} · " + (f"C{r['case_id']}" if r else "new case") + (f" (split from {c['part_of']})" if c["part_of"] else "") + f" · {c['title']}")
        out.append("State the tester sets up:")
        out += [f"- {p}" for p in c["pre"]]
        if c["inputs"]:
            ins = c["inputs"] if isinstance(c["inputs"], list) else [c["inputs"]]
            for i in ins:
                t = L.joined(*i)
                out.append(f"- Typed values: title {i[0][:40]!r}{'…' if len(i[0]) > 40 else ''}, description {i[1][:40]!r}{'…' if len(i[1]) > 40 else ''}, "
                           f"tech story {i[2][:40]!r}{'…' if len(i[2]) > 40 else ''} → line text by the PRD's rule: {len(t)} characters, {L.nbytes(t)} bytes"
                           + (f": {t!r}" if len(t) < 120 else "") + ".")
        out += [f"- {x}" for x in c["claude"]]
        out.append(f"Quotes: {', '.join(x if isinstance(x, str) else x[1] for x in c['q'])}. Marker: {c['marker']}.")
        out.append("")
    open(f"{L.P}/WHAT-WHY-SETUP-FILE.md", "w").write("\n".join(out))
    print("setup file:", len(L.CASES), "case recipes")

if __name__ == "__main__": main()
