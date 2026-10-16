"""Update WO-BOARD-SETUP-FILE.md for PRD v62 (answers 32-33) and the new case (QA lead, 16 Oct 2026: "3. Yes"). Run once."""
import json, re, os
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
F = f"{V}/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"; s = open(F).read(); orig = s
A = json.load(open(f"{V}/v61-pass-2026-10-16/anchor-quotes-current.json"))
P62 = open(f"{D}/CONFLUENCE-845185030-v62-2026-10-16.md").read()
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", P62, re.M).group(1).replace("**", "").strip()
esc = lambda t: t.replace(" #", " \\#")          # pandoc escapes a '#' that follows a space
nc = json.load(open(f"{D}/applied/new-case.json")); N = nc["new_case"]; n = f"C{N}"; probs = []
def rep(old, new, cnt=1):
    global s
    k = s.count(old)
    if k != cnt: probs.append(f"{k} x {old[:70]}"); return
    s = s.replace(old, new)
rep("(21 cases, 16 Oct 2026)", "(22 cases, 16 Oct 2026)")
rep("Chris Ward's answers 1 to 31", "Chris Ward's answers 1 to 33")
rep("version 61 (16 Oct 2026 15:17 UTC, Chris Ward)", "version 62 (16 Oct 2026 17:35 UTC, Chris Ward; S2-R23 and S11-R1 reworded after answers 32 and 33)")
rep("- Generated: 16 Oct 2026, for the 21 cases rewritten that day in the two-audience layout (a one-time trial ordered by the QA lead).",
    f"- Generated: 16 Oct 2026, for the 21 cases rewritten that day in the two-audience layout (a one-time trial ordered by the QA lead), and {n} added the same evening for PRD v62 S11-R1.")
for c in ("S2-R23", "S11-R1"):
    old, new = esc(A[c]), esc(code(c)); k = s.count(old)
    if k == 0: probs.append(f"{c}: v61 text not found")
    lines = s.split("\n")
    for i, l in enumerate(lines):
        if old in l: lines[i] = l.replace(old, new).replace("version 61 (16 Oct 2026)", "version 62 (16 Oct 2026)")
    s = "\n".join(lines); print(c, "quotes moved to v62:", k)
recipe = (f"#### SETUP-{n} — [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) First Tab skips a collapsed or empty Unassigned to the first technician\n\n"
          "**Satisfies these precondition lines, exactly as the case states them:**\n\n" + "\n".join(f"- {p}" for p in nc["pre"]) + "\n\n"
          "**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.\n\n"
          f'1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST {n}", Last Name "Ana" (shows as "ZZAUTOTEST {n} Ana").\n'
          f'2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST {n}", Last Name "Ben" (shows as "ZZAUTOTEST {n} Ben").\n'
          f'3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST {n} Keyboard A"; units "{n}-U1", "{n}-U2".\n'
          f'4.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST {n} Keyboard B"; unit "{n}-U3".\n'
          f'5.  **P-WO** (ACCOUNT-A): Unit "{n}-U1"; customer "ZZAUTOTEST {n} Keyboard A"; lead "ZZAUTOTEST {n} Ana".\n'
          f'6.  **P-WO** (ACCOUNT-A): Unit "{n}-U2"; customer "ZZAUTOTEST {n} Keyboard A"; lead "ZZAUTOTEST {n} Ben".\n'
          f'7.  **P-WO** (ACCOUNT-A): Unit "{n}-U3"; customer "ZZAUTOTEST {n} Keyboard B"; no lead.\n'
          f'8.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST {n} Ana", "ZZAUTOTEST {n} Ben".\n'
          f'9.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, Search "ZZAUTOTEST {n} Keyboard", every group expanded. Then reload the page and do not press Tab or click a row before handing over, so nothing has had keyboard focus.\n\n'
          f'**Check:** Every precondition line of the case is true on screen, read top to bottom. With Search "ZZAUTOTEST {n} Keyboard", Unassigned holds only the unit {n}-U3 work order; with Search "ZZAUTOTEST {n} Keyboard A", Unassigned is empty.\n\n'
          "**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):\n\n"
          f"- {{Location-A}} = the case location (Staging Heavy Duty - 9919 on staging)\n- {{Technician-A}} = ZZAUTOTEST {n} Ana\n- {{Technician-B}} = ZZAUTOTEST {n} Ben\n"
          f"- {{Customer-A}} = ZZAUTOTEST {n} Keyboard A\n- {{Customer-B}} = ZZAUTOTEST {n} Keyboard B\n- {{Search-A}} = ZZAUTOTEST {n} Keyboard\n"
          f"- {{Work-order-1}} = the work order for unit {n}-U1\n- {{Work-order-2}} = the work order for unit {n}-U2\n- {{Work-order-3}} = the work order for unit {n}-U3\n\n")
rep("## 5. Mapping table (execution order)", recipe + "## 5. Mapping table (execution order)")
def append_row(start, end, row):
    global s
    i, j = s.index(start), s.index(end); s = s[:i] + s[i:j].rstrip("\n") + "\n" + row + "\n\n" + s[j:]
append_row("## 5. Mapping table", "## 6. Dependencies",
           f"| [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) First Tab skips a collapsed or empty Unassigned to the first technician | ACCOUNT-A | SETUP-ADMIN, SETUP-{n} |")
q = {l: v for l, v in nc["quotes"]}
trace = (f"### [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) First Tab skips a collapsed or empty Unassigned to the first technician\n\n"
         "PRD v62 S11-R1 (Chris Ward's answer 33, 16 Oct 2026): with nothing focused yet, the first Tab lands on the first row or card in Unassigned, "
         "or on the first technician's first row or card when Unassigned is collapsed or empty.\n\n"
         f"- Steps 3, 7 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “{esc(q['S11-R1'])}”\n"
         f"- Steps 1, 4 — **S2-R2** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “{esc(q['S2-R2'])}”\n"
         f"- Steps 1, 4 — **S2-R17** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “{esc(q['S2-R17'])}”\n\n"
         "Steps with no source sentence (navigation and on-screen labels, taken from the build): 2, 5, 6.\n\nJira: SV-10054. Not yet checked against a build.\n\n")
rep("## 9. VIU status", trace + "## 9. VIU status")
append_row("## 9. VIU status", "## 10. Open questions",
           f"| [{n}](https://shopview.testrail.io/index.php?/cases/view/{N}) | UNVERIFIED: not yet run. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build |")
for l in s.split("\n"):
    if l.startswith("- Product owner: S2-R23 gives"):
        s = s.replace(l, "- ANSWERED (Chris Ward, answer 32, 16 Oct 2026; PRD v62 S2-R23): header avatar initials use the same --sv-grey-600 (\\#4B5565) as every other "
                         "avatar, at the design's smaller size. The cases' \"dark grey, a little darker than the design picture\" matches it.")
    if l.startswith("- Product owner: S11-R1 says Tab lands"):
        s = s.replace(l, "- ANSWERED (Chris Ward, answer 33, 16 Oct 2026; PRD v62 S11-R1): with nothing focused yet, the first Tab lands on the first row or card in "
                         f"Unassigned, or the first technician's first row or card when Unassigned is collapsed or empty. C97021 already follows the first part; {n} covers the collapsed and empty case.")
left = (s.count(esc(A["S2-R23"])), s.count(esc(A["S11-R1"])), s.count("- Product owner: S"))
print("problems:", probs, "| v61 texts left / open PO lines:", left)
if not probs and left == (0, 0, 0): open(F, "w").write(s); print("written", len(orig), "->", len(s))
