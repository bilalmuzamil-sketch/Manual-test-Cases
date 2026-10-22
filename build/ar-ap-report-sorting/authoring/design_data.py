"""The design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), saved 22 Oct 2026 in
design-2026-10-22/: 7 pages, 7 boards, 45 figures (43 screenshot files, 1440 x 900 app screens). Read in full and every picture viewed
(design-2026-10-22/TRANSCRIPTS.md). This module holds the design's own words (board titles, figure headings, alt texts, captions) and the
design-vs-PRD differences (Rule 130), so every case can carry a "References from Design" block (Rule 117 tenth amendment).
The design gives the LOOK and the on-screen labels; expected behaviour still comes from PRD v5 (Rules 57, 113, 126)."""
import os, re, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
DDIR = f"{P}/design-2026-10-22"
URL = "https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4"
READ = "read 22 Oct 2026"

# the canvas pages and the boards on them (canvas.json), with each board's own heading (the <h2> on the board)
BOARD = {
 "Main.dc.html": (1, "1 Opening order and header sorting", "1. Opening order and header sorting"),
 "Export.dc.html": (2, "2 Export", "2. Export"),
 "Grouped.dc.html": (3, "3 Collapse all and pinned group rows", "3. Collapse all, Expand all and pinned group rows"),
 "Location.dc.html": (4, "4 Location filter and Location column", "4. Location filter and Location column"),
 "Links.dc.html": (5, "5 Document links and Switch location", "5. Document links and Switch location (SV-5706)"),
 "Layout.dc.html": (6, "6 Descriptions and pinned column", "6. Report descriptions and the pinned headline column"),
 "Filters.dc.html": (7, "7 Filters and call list", "7. Filters and call list"),
}
# the image files, numbered as in TRANSCRIPTS.md (I01-I43)
IMG = dict(I01="6e4079bae88b00f4712ecc994635a4aa", I02="3acf0df8fcfa2948021f62095f926d6c", I03="679a5315b863910f9a0d03364ff7a5c5",
           I04="a04f6b706bbb31950fca23e4aab33a3b", I05="e3b542552c193320f79a6f8514a1da17", I06="6f8ca9ff78bccb7b18d367cfdb1fa3d6",
           I07="beffc660001ecc0176a971155e91ab7c", I08="f6fd76893ad1106bbd9c8fad668897e0", I09="d9cc690d5a7176e1abe4e20292bb6086",
           I10="0151c70944995b986fbe7d6955ab2e7d", I11="c62e842f4af1997bf8aab6484b9ce09b", I12="99736a960ab6402cfa5648bd7be1c7b8",
           I13="732fca85ededdfeb71f3a02a7b83e1e2", I14="e9a44087208a2aab63c7ab1eee8075af", I15="b70058e0aab7e76fb8231374b575f004",
           I16="cd382497faa5379a44d5f3209d48ba40", I17="393f80742eaa3a523cb604d4701ce126", I18="9724612328cc59e23db160d0613632d1",
           I19="2ae1e64940926ce9fe29cf5e9ca98cfe", I20="60c1832e0aaabe4c970bc30217f33794", I21="ad2199b35ebbebb8279dc5ea54cffc68",
           I22="1fe4d7a14658eb5854edfc6ae2094aee", I23="f680e580daca2f02b3ec44636a565cd1", I24="116db310201455260f4c394cf3d97970",
           I25="ad3fe45aa436605e35fa18576f637f46", I26="215b27cfb7f082f59c1b41502dce057e", I27="94bacc1c6d8cd87cdb7f4db29330d2f9",
           I28="cdefada155ba18ecdf4b550c2e4cc34f", I29="fb3fc52aea72af56a190a9f14071a6ed", I30="96a5b92dec383627ffa7ed31072dc53a",
           I31="5ff17d7a3fac58f730fff41a05659077", I32="db471ddada75f37c8265282b3ae3e3f0", I33="b3179c211540c66402a703f82a481f84",
           I34="ac3ddc335e2d8796b5675663418899d2", I35="105bf47813e9c350989185cf27f90950", I36="e15cddb093bbdcadbc7736034b730d06",
           I37="f8abb021e733450a62c390de77a38759", I38="2cbc468d2963453e3abbe2ba42c15138", I39="4e40e4c1c64bb8f2f16d699555908c42",
           I40="749cad0a5c7bad446f41e140a7b4f86a", I41="8535dfa4709a96269b098d3c671557f9", I42="54a9dfe95b8c0dbfeed0912d566271b0",
           I43="8fa208aa4abb85d10b2f67b3958a28ba")
IID = {v: k for k, v in IMG.items()}
# which report each screenshot shows (from viewing it; I27 is the Work Orders list)
SHOWS = dict(I01="ARS", I02="APD", I03="ARS", I04="ARS", I05="APD", I06="ARS", I07="APS", I08="ARS", I09="ARS", I10="APS", I11="APD",
             I12="ARC", I13="ARC", I14="ARC", I15="ARC", I16="APU", I17="APD", I18="APD", I19="ARC", I20="ARC", I21="ARC", I22="ARC",
             I23="APD", I24="APD", I25="APU", I26="ARD", I27=None, I28="ARD", I29="ARD", I30="ARD", I31="ARD", I32="ARD", I33="ARD",
             I34="ARD", I35="ARD", I36="ARS", I37="ARC", I38="ARS", I39="ARS", I40="APS", I41="ARS", I42="ARC", I43="APU")

def _codes(caption):
    """Requirement codes a caption cites, ranges expanded ("S4-R1 to S4-R5")."""
    out = set()
    for a, b in re.findall(r"(S\d+-R\d+)\s+to\s+(S\d+-R\d+)", caption):
        s, x = a.split("-R"); y = b.split("-R")[1]
        out |= {f"{s}-R{i}" for i in range(int(x), int(y) + 1)}
    out |= set(re.findall(r"S\d+-[RNE]\d+[a-z]?", caption))
    return out

FIGS = []
for i, f in enumerate(json.load(open(f"{DDIR}/DESIGN-FIGURES-2026-10-22.json")), 1):
    h = f["image"].split("/")[1][:-4]
    cap = f["caption"].replace("&quot;", '"')
    FIGS.append(dict(n=i, board=f["board"], page=BOARD[f["board"]][0], badge=f["badge"], heading=f["heading"], img=h, iid=IID[h],
                     alt=f["alt"], caption=cap, codes=_codes(cap), after=f["badge"] != "Production (before)"))
FIG_BY_IID = {}
for f in FIGS: FIG_BY_IID.setdefault(f["iid"], f)

def fig(iid, board=None):
    """The figure for a screenshot (on the given board when it is used twice)."""
    for f in FIGS:
        if f["iid"] == iid and (board is None or f["board"] == board): return f
    raise KeyError(iid)

def _slug(t):
    import re as _re
    return _re.sub(r"[^a-z0-9]+", "-", t.lower().replace("’", "").replace("'", "")).strip("-")
# 22 Oct 2026: the pictures are uploaded to each TestRail case under a readable name (one name per screenshot, from the first figure
# that uses it); PIC_FILE maps that name back to the saved screenshot for the upload.
PIC_NAME, PIC_FILE = {}, {}
for _f in FIGS:
    if _f["img"] in PIC_NAME: continue
    _n = f"ar-ap-p{_f['page']}-{_slug(_f['heading'])}.png"
    while _n in PIC_FILE: _n = _n[:-4] + "-2.png"
    PIC_NAME[_f["img"]] = _n; PIC_FILE[_n] = f"{DDIR}/images/{_f['img']}.png"
def pic(f):
    return PIC_NAME[f["img"]]

# ---- design-vs-PRD differences (Rule 130); every one closed by a question for Chris Ward (drafted 22 Oct 2026, new rows 11-15 of his
# sheet, added 22 Oct 2026) or by a ruling already in the PRD. "held": the design-version case that waits on the answer.
DIFFS = [
 dict(id="DD-01", codes=["S7-R3", "S7-R4", "S7-R5"], named=["UFS-3", "UFS-4"], reps=["ARD", "ARC"], figs=["I29"], q=11, held="D-76",
      prd='buttons "Switch location" and "Cancel" (S7-R3), title "Switch location?"',
      design='buttons "Cancel" (left, grey) then "Switch Location" (right, blue, capital L), and a close "×" at the top right of the dialog; caption: "Switch Location opens it there."',
      kind="label letter case, button order and an extra control (L-02, L-04)"),
 dict(id="DD-02", codes=["S5-R13"], named=[], reps=["APS", "APD", "APU"], figs=["I40"], q=12, held="D-77",
      prd='Vendor "exactly as Inventory Value\'s Vendor filter (truck icon, "Search vendors")" (S5-R13)',
      design='the Vendor menu\'s search box reads "Search vendor" (singular); alt text: "Search vendor, All vendors and the helper line"',
      kind="placeholder wording (L-04)"),
 dict(id="DD-03", codes=["S5-R6a"], named=[], reps=None, figs=["I35"], q=13, held="D-78",
      prd='with no location ticked, "the native empty state (S8-R5) with "Clear all filters", no totals and no Location column" (S5-R6a)',
      design='"Location: No locations" with a Totals row reading $0.00 and $0.00 under the headings, above the empty state',
      kind="an extra row in an empty state"),
 dict(id="DD-04", codes=["S1-R6"], named=[], reps=["ARC", "APU"], figs=["I15"], q=14, held="D-79",
      prd='"inside each group, rows open oldest date first, ties by document number (S2-R4)" (S1-R6)',
      design='in the CMLZ Truck Repair - Talladega group five invoices dated Aug 27, 2026 read S3-14690, S3-14693, S3-15660, S3-14691, S3-14692 (not number order)',
      kind="row order"),
 dict(id="DD-05", codes=["S7-R7"], named=[], reps=None, figs=["I28", "I03", "I16"], q=15, held="D-80",
      prd='"the same blue as Work In Progress, semi-bold, no underline" (S7-R7)',
      design='document numbers and customer and vendor names are blue at the same (regular) weight as the plain text beside them',
      kind="text weight"),
 dict(id="DD-06", codes=["S2-R1"], named=["OOS-3", "WC-9"], reps=["ARD", "ARC"], figs=["I14", "I28", "I12", "I26"], q=4, held="D-81",
      prd='A/R Detail and A/R Collection headings written "Transaction type", "Customer full name", "Due date", "Past due", "Open balance" (S2-R1)',
      design='the after pictures read "Transaction Type", "Customer Full Name", "Due Date", "Past Due", "Open Balance"; today\'s production pictures already read the same, with "Location Full Name"',
      kind="heading letter case (L-04); already question 4 (sent 22 Oct 2026)"),
]
# differences closed by a ruling already in our sources (not asked; skill 07 section 6)
RULED = [
 dict(id="DR-01", codes=["S8-R4"], figs=["I14", "I15", "I16", "I23", "I25", "I32", "I03", "I28", "I30"],
      design="the Totals row sits on a light-grey band in some pictures (A/R Collection expanded, A/P Detail, A/P Unpaid Invoices, A/R Detail I32) and on the page colour in others (Summaries, I28, the same A/R Detail screen in I30)",
      ruling='PRD S8-R4: "The Totals row uses the native totals row style of the newer reports." The cases compare with Sales By Customer\'s Totals row; the pictures are not the reference for this one attribute.'),
 dict(id="DR-02", codes=["S5-R2"], figs=["I34"],
      design='with one location unticked and the menu still open, the ticked location is listed second ("Staging Heavy Duty - 9919" unticked above "Staging Lethbridge - 4310" ticked)',
      ruling='No conflict: PRD S5-R2 "the locations with the ticked ones first" is checked when the menu is opened again (S5-02, S5-03 close and reopen it); the picture shows the menu still open, where nothing moves. Native as on Sales By Customer.'),
 dict(id="DR-03", codes=["S5-R6", "S5-R13"], figs=["I34", "I37", "I42"],
      design='with one name ticked the chip keeps its prefix: "Location: Staging Lethbri...", "Customer: 10 Trucking", "Customer: Andrews\' Truck ..."',
      ruling='No conflict: PRD S5-R6 / S5-R13 say the chip shows "the name" and the chips are "exactly as on Sales By Customer"; the design shows how (prefix kept, shortened with "..."). Cases now say what the picture shows.'),
 dict(id="DR-04", codes=["S5-R13"], figs=["I41"],
      design='the Customer menu with two ticked shows the ticked names as tags in the search box, a clear "×", and "2 selected" on the "All customers" row',
      ruling='No conflict: PRD S5-R13 "Customer exactly as Sales By Customer\'s Customer filter"; the PRD lists the menu\'s main rows, the design shows the native extras. The design case checks them.'),
 dict(id="DR-05", codes=["S2-R6"], figs=["I16", "I25", "I43"],
      design='a vendor credit\'s Due Date and Past Due cells show an em dash "—"',
      ruling='No conflict: PRD S2-R6 calls them "A blank value"; the dash is how the screen draws an empty cell. Cases say "no date and no number (a dash)".'),
]
# PRD screens and messages the design draws no picture of (Rule 130 item 5: DESIGN-SILENT, nothing to write; the PRD stands alone)
SILENT = [
 ("S3-R10", "the Success message \"Data exported successfully.\" and the Empty export warning"),
 ("S3-N2", "the CSV-too-large message"), ("UFS-8", "the failed-export message \"We couldn't export this report. Please try again.\""),
 ("S8-R5", "the loading progress bar"), ("S8-R6", "the load-error state \"Something went wrong loading this report. Please try again.\""),
 ("S4-R1", "the \"Collapse all\" / \"Expand all\" tooltip (the pictures show the chevron only)"),
 ("S5-R2", "the \"Search locations\" box (more than 8 locations)"), ("S5-R6", "\"Location: N locations\""),
 ("S5-R13", "\"Vendor: N vendors\""), ("S5-R15", "\"Past due: 4 ranges\" and one range ticked"),
 ("S7-R3", "the part sale version of the dialog (\"This part sale is in {location}...\")"),
 ("S7-R7", "a link with keyboard focus (underline)"), ("S8-R1", "the descriptions of the five other reports (only A/R Collection's is pictured)"),
 ("S8-R3", "a window narrower than 1440 px, and 1536 px"), ("OOS-9", "the phone and tablet layout"),
 ("S3-R4", "the PDF and CSV files themselves (no export file is pictured)"), ("S3-R1", "the \"Export report\" label of the ⋯ button"),
 ("S1-R8", "paging controls (no picture shows the end of a page; the Totals row stays at the bottom while rows scroll under it)"),
]

# what each production ("before") picture shows of today's behaviour, by the PRD lines that change or keep it (they are today's look, never a
# design target: Rule 115, the named target only). Attached to the cases quoting those lines, as "today's look, for comparison".
BEFORE = {1: ["WC-3", "OOS-7"], 2: ["S3-R1", "OOS-7"], 6: ["WC-7", "S5-R1"], 7: ["WC-4", "WC-7", "S9-R1"], 15: ["S4-R1", "S4-R5"],
          16: ["S4-R6"], 20: ["S8-R1", "S8-R3"], 21: ["S8-R3"], 29: ["S7-R1", "S7-N1"], 30: ["S7-R1", "WC-6"],
          34: ["WC-9", "S6-R1", "S5-R1"], 41: ["WC-1", "S1-R1"], 42: ["WC-2", "S1-R5"]}
for f in FIGS:
    if not f["after"]: f["codes"] = set(BEFORE.get(f["n"], []))

def before_for(codes, reports=None):
    cs = set(codes)
    hits = [f for f in FIGS if not f["after"] and f["codes"] & cs]
    hits.sort(key=lambda f: (0 if reports and SHOWS.get(f["iid"]) in reports else 1, f["n"]))
    return hits[:1]

PAGE_TEXT = {n: f'page {n} "{BOARD[b][1][2:]}" (board {b})' for b, (n, *_r) in BOARD.items()}

def relevant(codes, reports=None, limit=3):
    """After-pictures whose caption cites one of these codes, the ones showing the case's own report first."""
    cs = set(codes)
    hits = [f for f in FIGS if f["after"] and f["codes"] & cs]
    seen, out = set(), []
    hits.sort(key=lambda f: (0 if reports and SHOWS.get(f["iid"]) in reports else 1, -len(f["codes"] & cs), f["n"]))
    for f in hits:
        if f["iid"] in seen: continue
        seen.add(f["iid"]); out.append(f)
    return out[:limit]

def diffs_for(codes, reports=None):
    cs = set(codes)
    return [d for d in DIFFS if cs & (set(d["codes"]) | set(d["named"]))
            and (d["reps"] is None or not reports or set(d["reps"]) & set(reports))]

def ruled_for(codes):
    return [d for d in RULED if set(codes) & set(d["codes"])]

def silent_for(codes):
    return [(c, w) for c, w in SILENT if c in set(codes)]
