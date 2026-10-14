#!/usr/bin/env python3
"""Dashboard reference tidy (14 Oct 2026, QA lead's "OK"): for every case in group 12166 whose live updated_by is 3,
except the 25 written earlier today, re-stamp the PRD version/read date (v48, read 14 Oct 2026), re-point design-board
references to the re-shared canvas (design-2026-10-14b), re-copy stale quotes from v48 (C88609 S5-R9), add the S6-R3a /
S7-R2a quote where the audit says the case is now governed by it, and fix the wrong "the dashboard remembers your
choices" setup line. Nothing a tester checks changes: titles, steps, expected observations, markers and automation
fields are untouched (proven by --diff and by the apply read-back).
  python3 build_tidy.py            build proposals-tidy.json + diff-tidy.txt (text diff of every changed field)
Only raw-HTML substring edits are made; each edit must apply exactly once, or the case is reported and not proposed."""
import json, re, html, sys
H = "build/dashboards/currency-2026-10-14/apply-tidy"
PRDF = "build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-v48-2026-10-14c.md"
scope = json.load(open(f"{H}/scope.json"))
BS = json.load(open(f"{H}/board-status.json"))
RESHOT = {b for b, v in BS.items() if v["img"]}          # boards whose screenshot was re-shot on 14 Oct 2026
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
ANCH = {}
for line in open(PRDF):
    m = re.match(r"^\s*\\?[-*]\s+\*\*(S\d+-[A-Z]+\d+[a-z]?)(?: \([^)]*\))?:\*\*\s*(.*)$", line.rstrip("\n"))
    if m: ANCH[m.group(1)] = ws(m.group(2))
PRDW = ws(open(PRDF).read())
TP = ws(open("build/dashboards/sources/Dashboard-v1-Technical-Implementation-Plan.md").read())
def li(code, text): return f"<li><strong>{code}:</strong> &ldquo;{html.escape(text, quote=False)}&rdquo;</li>"

CANVAS = "claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge"
BOARD = re.compile(r"\b\d\d_[A-Za-z0-9-]+_[A-Za-z]+\b")
def canvas_note(boards, first=True):
    """Plain provenance for the boards a Source sentence cites, from the re-shared canvas (read 14 Oct 2026).
    A second mention in the same paragraph omits the link and read date (already given once)."""
    new = [b for b in boards if b in RESHOT]; old = [b for b in boards if b not in RESHOT]
    head = f"{CANVAS}, as re-shared and read 14 Oct 2026; " if first else ""
    if new and not old:
        return head + ("a screenshot of the SV-490 build re-shot on 14 Oct 2026" if len(new) == 1 else "screenshots of the SV-490 build re-shot on 14 Oct 2026")
    if old and not new:
        return head + ("a screenshot of the SV-8311 build captured 2026-09-28, unchanged" if len(old) == 1 else "screenshots of the SV-8311 build captured 2026-09-28, unchanged")
    if not boards:   # named by row range only (report pages 10 to 13): those screenshots are unchanged
        return head + "screenshots of the SV-8311 build captured 2026-09-28, unchanged"
    n = " and ".join([", ".join(new[:-1]), new[-1]] if len(new) > 1 else new)
    return head + f"{n} re-shot from the SV-490 build on 14 Oct 2026, the {'other' if len(old) == 1 else 'others'} captured from the SV-8311 build on 2026-09-28"

# Case-specific edits (raw HTML, old -> new), applied to the Source paragraph BEFORE the generic canvas note.
SPECIFIC = {
 88603: [('Design canvas board 15_Empty_Design (row 15, approved 7 Oct 2026). Board 15_Empty_Now shows today\'s build reading "n/a".',
          'Design canvas board 15_Empty_After (row 15): the three ratio tiles read a grey "-".')],
 88636: [('02_Last12_After ("Parts 7% · Labor 93%"), 15_Empty_Design ("0 Invoices")', '02_Last12_After ("Parts 39% · Labor 61%"), 15_Empty_After ("0 Invoices")')],
 88640: [('Design canvas row 15 (15_Empty_Design, approved 2026-10-07, to build) shows the grey "-".',
          'Design canvas row 15 (board 15_Empty_After) shows the grey "-".')],
 88646: [('Design canvas row 15 (15_Empty_Design, approved 2026-10-07, to build): ratio tiles read a grey "-"; 15_Empty_Now shows today\'s build reading "n/a". Boards used for labels only.',
          'Design canvas row 15 (board 15_Empty_After): ratio tiles read a grey "-". Boards used for labels only.')],
 351711: [('Design canvas board 15_Empty_Design (row 15).', 'Design canvas board 15_Empty_After (row 15).')],
 351713: [('Design canvas board 15_Empty_Design note:', 'Design canvas board 15_Empty_After note:')],
 88621: [('board 05_Billing_After (an axis capped at 200% with one line running off the top), used for on-screen labels only.',
          'board 05_Billing_After, used for on-screen labels only (its re-shot data stays below 200%, so it no longer shows the capped axis; the cap comes from the PRD alone).')],
 351728: [("board 03_Range_After (calendar header 'Oct 1, 2025 — Sep 28, 2026' and 'Range: 363 days' on Sep 28, 2026)",
           "board 03_Range_After (calendar header 'Oct 1, 2026 — Oct 14, 2026' and 'Range: 14 days', This Month on Oct 14, 2026)")],
 # quotes and codes now governing the case (audit 3a/3b)
 88609: [("Story 5.", "Story 5 (S5-R9 was reworded in version 45 on 14 Oct 2026 to cover zero customers; quoted as it now reads).")],
 88612: [("Story 6.", "Story 6, including S6-R3a (added in version 45 on 14 Oct 2026).")],
 88650: [("story SV-9579 (S7);", "story SV-9579 (S7), story SV-9578 (S6);"),
         ("S7 (S7-E1).", "S7 (S7-E1), S6 (S6-R3a, added in version 45 on 14 Oct 2026).")],
 204097: [("Epic SV-490; story SV-9581 (Story 9, Chart Behavior);", "Epic SV-490; story SV-9581 (Story 9, Chart Behavior), with SV-9578 (Story 6);"),
          ("Story 9. Ruling 2026-09-24", "Story 9, and Story 6 (S6-R3a, added in version 45 on 14 Oct 2026). Ruling 2026-09-24")],
 351704: [("Epic SV-490; story SV-9575 (Story 3, Measure Formulas and Report Parity);", "Epic SV-490; story SV-9575 (Story 3, Measure Formulas and Report Parity), with SV-9579 (Story 7);"),
          ("read 14 Oct 2026, Story 3.", "read 14 Oct 2026, Story 3, and Story 7 (S7-R2a, added in version 45 on 14 Oct 2026) for the calendar's one-day range.")],
}
QUOTE_EDITS = {   # (old raw li or anchor li, new raw) on custom_expected
 88609: [("REPLACE", "S5-R9")],
 88612: [("AFTER", "S6-R3", "S6-R3a")],
 88650: [("APPEND", "S6-R3a")],
 204097: [("APPEND", "S6-R3a")],
 351704: [("APPEND", "S7-R2a")],
}
REMEMBER = [("(the dashboard remembers your choices in this browser)", "(date ranges are not remembered: every visit opens on the defaults)"),
            ("(the dashboard remembers your choices)", "(date ranges are not remembered: every visit opens on the defaults)")]
PRD_STAMPS = [("Dashboard v1 PRD, Confluence 788430850 v42, read 7 Oct 2026", "Dashboard v1 PRD, Confluence 788430850 v48, read 14 Oct 2026"),
              ("Dashboard v1 PRD Confluence 788430850 v42 (read 7 Oct 2026)", "Dashboard v1 PRD Confluence 788430850 v48 (read 14 Oct 2026)")]
SRC_RE = re.compile(r"(<p><strong>Source &mdash; where this behaviour comes from</strong><br>)(.*?)(</p>)", re.S)
LI_RE = re.compile(r"<li><strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;</li>", re.S)

def once(s, old, new, k, probs, what):
    n = s.count(old)
    if n != 1: probs.append(f"C{k}: {what}: expected 1 occurrence, found {n}: {old[:70]}"); return s
    return s.replace(old, new)

props, probs, diff = [], [], []
def txt(h):
    h = re.sub(r"<li>", "\n- ", h or ""); h = re.sub(r"</p>|<br>", "\n", h); h = re.sub(r"<[^>]+>", "", h)
    return [l for l in html.unescape(h).split("\n") if l.strip()]
import difflib
for k in scope:
    c = json.load(open(f"{H}/snap-start/C{k}.json")); E, P = c["custom_expected"], c["custom_preconds"]
    m = SRC_RE.findall(E)
    if len(m) != 1: probs.append(f"C{k}: Source paragraph count {len(m)}"); continue
    src = m[0][1]; new = src; changes = []
    hit = [o for o, n in PRD_STAMPS if new.count(o) == 1]
    if len(hit) != 1: probs.append(f"C{k}: PRD stamp pattern not found once"); continue
    new = new.replace(hit[0], dict(PRD_STAMPS)[hit[0]]); changes.append("PRD v42 -> v48, read 14 Oct 2026")
    for o, n in SPECIFIC.get(k, []):
        new = once(new, o, n, k, probs, "specific"); changes.append("specific: " + n[:60])
    # generic canvas note: every "Design canvas" mention gets the re-shared/read date and the per-board capture
    parts = re.split(r"(Design canvas)", new); out = parts[0]
    for i in range(1, len(parts), 2):
        seg = parts[i + 1]
        seg = re.sub(r"^ \(claude\.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge, (?:screenshots of the SV-8311 build )?captured 2026-09-28\)", "", seg)
        boards = []
        for b in BOARD.findall(seg.split("Design canvas")[0]):
            if b not in boards: boards.append(b)
        for b in boards:
            if b not in BS: probs.append(f"C{k}: cites board {b} which is not in the re-shared canvas")
        out += f"Design canvas ({canvas_note(boards, i == 1)})" + seg
    new = out; changes.append("canvas re-shared/read 14 Oct 2026 + per-board capture")
    if any(x in new for x in ("15_Empty_Design", "15_Empty_Now", "before-empty", "v42", "7 Oct 2026, Story")): probs.append(f"C{k}: stale reference left in Source")
    E2 = E.replace(m[0][0] + src + m[0][2], m[0][0] + new + m[0][2], 1)
    # quotes: strict re-copy check against v48 for every coded quote; then the edits
    for code, q in LI_RE.findall(E2):
        qq = ws(html.unescape(q))
        if code in ANCH and qq != ANCH[code] and qq not in PRDW and not (k in QUOTE_EDITS and any(code in e for e in QUOTE_EDITS[k])):
            probs.append(f"C{k}: quote {code} not verbatim in v48")
        elif code.lower().startswith("tech plan") and qq not in TP: probs.append(f"C{k}: tech-plan quote {code} not verbatim")
        elif code not in ANCH and not code.lower().startswith("tech plan") and qq not in PRDW: probs.append(f"C{k}: quote {code} not in v48")
    for e in QUOTE_EDITS.get(k, []):
        if e[0] == "REPLACE":
            olds = [x for x in re.findall(r"<li><strong>" + re.escape(e[1]) + r":</strong>.*?</li>", E2, re.S)]
            if len(olds) != 1: probs.append(f"C{k}: {e[1]} li count {len(olds)}"); continue
            E2 = E2.replace(olds[0], li(e[1], ANCH[e[1]])); changes.append(f"quote {e[1]} re-copied from v48")
        elif e[0] == "AFTER":
            olds = re.findall(r"<li><strong>" + re.escape(e[1]) + r":</strong>.*?</li>", E2, re.S)
            if len(olds) != 1: probs.append(f"C{k}: {e[1]} li count {len(olds)}"); continue
            E2 = E2.replace(olds[0], olds[0] + li(e[2], ANCH[e[2]])); changes.append(f"quote {e[2]} added")
        elif e[0] == "APPEND":
            lists = re.findall(r"(Exact quotes from the source \(for reproducibility\)</strong></p><ul>.*?)(</ul>)", E2, re.S)
            if len(lists) != 1: probs.append(f"C{k}: quote list count {len(lists)}"); continue
            E2 = E2.replace(lists[0][0] + lists[0][1], lists[0][0] + li(e[1], ANCH[e[1]]) + lists[0][1]); changes.append(f"quote {e[1]} added")
    P2 = P
    for o, n in REMEMBER:
        if o in P2: P2 = once(P2, o, n, k, probs, "remember"); changes.append("setup: date ranges are not remembered")
    if "remembers your choice" in P2 or "remembers your choice" in E2: probs.append(f"C{k}: remembers-your-choices line left")
    # nothing outside the Source paragraph, the quote list and the remember parenthetical may differ
    tail_old, tail_new = E[E.index("Exact quotes"):].split("</ul>", 1)[1], E2[E2.index("Exact quotes"):].split("</ul>", 1)[1]
    if tail_old != tail_new: probs.append(f"C{k}: text after the quote list changed (stamp/marker)")
    if E[:E.index("<p><strong>Source")] != E2[:E2.index("<p><strong>Source")]: probs.append(f"C{k}: expected results before Source changed")
    pay = {}
    if E2 != E: pay["custom_expected"] = E2
    if P2 != P: pay["custom_preconds"] = P2
    props.append({"case_id": k, "atm": c["custom_atmstatus"], "title": c["title"], "payload": pay, "changes": changes})
    for f, old, nw in (("custom_preconds", P, P2), ("custom_expected", E, E2)):
        if old != nw:
            diff.append(f"######## C{k} {f}")
            diff += [l for l in difflib.unified_diff(txt(old), txt(nw), lineterm="", n=0) if not l.startswith(("---", "+++", "@@"))]
json.dump(props, open(f"{H}/proposals-tidy.json", "w"), indent=1, ensure_ascii=False)
open(f"{H}/diff-tidy.txt", "w").write("\n".join(diff) + "\n")
print(len(props), "proposals ·", sum(1 for p in props if p["payload"]), "with changes ·", len(probs), "problems")
for p in probs: print("PROBLEM", p)
if probs: sys.exit(1)
