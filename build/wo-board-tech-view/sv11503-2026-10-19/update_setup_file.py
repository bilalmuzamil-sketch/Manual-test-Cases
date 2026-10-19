"""Add C665914 (SV-11503, drag preview) to WO-BOARD-SETUP-FILE.md (QA lead, 19 Oct 2026). Run once."""
import json, os
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
F = f"{V}/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"; s = open(F).read(); orig = s
nc = json.load(open(f"{D}/applied/new-case.json")); N = nc["new_case"]; n = f"C{N}"; T = "A long customer name stays inside the drag preview in Board View and Tech View"
esc = lambda t: t.replace(" #", " \\#"); probs = []
def rep(old, new):
    global s
    if s.count(old) != 1: probs.append(f"{s.count(old)} x {old[:60]}"); return
    s = s.replace(old, new)
rep("(22 cases, 16 Oct 2026)", "(23 cases, 16 to 19 Oct 2026)")
rep("added the same evening for PRD v62 S11-R1.", f"added the same evening for PRD v62 S11-R1; C{N} added 19 Oct 2026 for SV-11503 (drag preview), PRD v64.")
recipe = (f"#### SETUP-{n} — [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) {T}\n\n"
          "**Satisfies these precondition lines, exactly as the case states them:**\n\n" + "\n".join(f"- {p}" for p in nc["pre"]) + "\n\n"
          "**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.\n\n"
          f'1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST {n}", Last Name "Ana" (shows as "ZZAUTOTEST {n} Ana").\n'
          f'2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST {n} Superlongunbrokencustomernamewithoutanyspacesforthedragpreview"; unit "{n}-U1".\n'
          f'3.  **P-WO** (ACCOUNT-A): Unit "{n}-U1"; customer "ZZAUTOTEST {n} Superlongunbrokencustomernamewithoutanyspacesforthedragpreview"; lead "ZZAUTOTEST {n} Ana".\n'
          f'4.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST {n} Superlong".\n\n'
          "**Check:** Every precondition line of the case is true on screen, read top to bottom. The card shows the customer name cut off with \"…\" "
          "(the card itself; the preview box is what the case tests).\n\n"
          "**Placeholder values** (the case names records by placeholder; give the tester the real work order number after setup):\n\n"
          f"- {{Location-A}} = the case location (Staging Heavy Duty - 9919 on staging)\n- {{Technician-A}} = ZZAUTOTEST {n} Ana\n"
          f"- {{Customer-A}} = ZZAUTOTEST {n} Superlongunbrokencustomernamewithoutanyspacesforthedragpreview\n- {{Work-order-1}} = the work order for unit {n}-U1\n\n"
          "Known examples already on staging (from SV-11503, not created by this file): S2-36633 and S2-35480.\n\n")
rep("## 5. Mapping table (execution order)", recipe + "## 5. Mapping table (execution order)")
def append_row(start, end, row):
    global s
    i, j = s.index(start), s.index(end); s = s[:i] + s[i:j].rstrip("\n") + "\n" + row + "\n\n" + s[j:]
append_row("## 5. Mapping table", "## 6. Dependencies", f"| [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) {T} | ACCOUNT-A | SETUP-ADMIN, SETUP-{n} |")
q = dict((l, v) for l, v in nc["quotes"])
trace = (f"### [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) {T}\n\n"
         "SV-11503 (19 Oct 2026). The PRD (v64) has no rule for the drag preview and the design draws none; the case applies the design's "
         "\"…\" cut-off of customer names on cards and rows to the preview, by the QA lead's decision of 19 Oct 2026.\n\n"
         f"- Steps 1, 5 — **S9-R1** (PRD Confluence 845185030 version 64 (16 Oct 2026)): “{esc(q['S9-R1'])}”\n"
         f"- Step 2 — **Design — Work Orders.dc.html, Board View card customer name** (export of 14 Oct 2026): `{q['Design — Work Orders.dc.html, Board View card customer name']}`\n"
         f"- Step 6 — **Design — Work Orders.dc.html, Tech View row customer name** (export of 14 Oct 2026): `{q['Design — Work Orders.dc.html, Tech View row customer name']}`\n"
         f"- Steps 3, 7 — **Tech plan, drag files row** (upload of 8 Oct 2026): “{q['Tech plan, drag files row']}”\n\n"
         "Steps with no source sentence (navigation and on-screen labels, taken from the build): 4.\n\nJira: SV-10052, SV-11503 (known problem). Not yet checked against a build.\n\n")
rep("## 9. VIU status", trace + "## 9. VIU status")
append_row("## 9. VIU status", "## 10. Open questions", f"| [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) | UNVERIFIED: not yet run. AUTOMATION: READY - EXPECT FAIL (SV-11503) |")
print("problems:", probs)
if not probs: open(F, "w").write(s); print("written", len(orig), "->", len(s))
