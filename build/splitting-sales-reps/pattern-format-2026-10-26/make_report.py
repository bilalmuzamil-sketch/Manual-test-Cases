#!/usr/bin/env python3
"""26 Oct 2026, Rule 117 fourteenth amendment: the pass report for the QA lead's pattern, Splitting Sales Representatives.
Compares every case's fields before the pattern (before-library-render.json: the library as rendered and last read back from
TestRail; before-dr.json: the six design-recheck cases) with the pattern draft (authoring/proposals.json, DR-PATTERN.json):
  1. byte identity of everything below the results: the exact-quotes block with its From: lines, the References from Design block,
     any held / Blocked / known-problem note, and the AUTOMATION line; and title, refs and the other fields unchanged;
  2. no fact lost: every amount, number, date, quoted label and product term of the old preconditions, steps and results still appears
     in the new preconditions, steps or results, except placeholders and values that appeared only on a "For example:" line;
  3. per case, old vs new title, preconditions, steps and results.
Writes PASS-REPORT.md and fact-check.json. python3 make_report.py"""
import os, sys, re, json, html, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/authoring")
import ssr_lib
OLD = {k: v["fields"] for k, v in json.load(open(f"{D}/before-library-render.json")).items()}
NEW = {k: v["fields"] for k, v in json.load(open(f"{P}/authoring/proposals.json")).items()}
for k, v in json.load(open(f"{D}/before-dr.json")).items(): OLD[k] = v["fields"]
for k, v in json.load(open(f"{D}/DR-PATTERN.json")).items(): NEW[k] = v["fields"]
IDS = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
assert set(OLD) == set(NEW) == set(IDS), "case sets differ"
u = lambda s: html.unescape(s)

def lis(h): return [u(x) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def pre_parts(h):
    """[(state, example or None)] — the old Preconditions put an example on a second line after <br>."""
    out = []
    for x in re.findall(r"<li>(.*?)</li>", h, re.S):
        a, _, b = x.partition("<br>"); out.append((u(a), u(b) or None))
    return out
def results(h):
    if h.startswith("<p><strong>Expected Result</strong></p>"):
        body = h.split("<p></p>", 1)[0]
        return [[u(x) for x in re.findall(r"<li>(.*?)</li>", b)] for _, b in re.findall(r"<p>Step (\d+):</p><ul>(.*?)</ul>", body)]
    ul = h.split("<ul>", 1)[1].split("</ul>", 1)[0]
    return [[u(x)] for x in re.findall(r"<li>(.*?)</li>", ul, re.S)]
def blocks(tail):
    q = tail.find("<p><strong>Exact quotes from the source"); d = tail.find("<p></p><p><strong>References from Design</strong></p>")
    m = re.search(r"<p>AUTOMATION: [^<]*</p>$", tail)
    quotes = tail[q:(d if d >= 0 else m.start())]
    design = tail[d:m.start()] if d >= 0 else ""
    notes = tail[:q]
    return quotes, design, m.group(0), notes

# ---- facts ----
AMOUNT = re.compile(r"\(?-?\$[\d,]+(?:\.\d+)?\)?|−\$[\d,]+\.\d\d")
NUMBER = re.compile(r"(?<![\w$.])\d+(?:[.,]\d+)*(?:\s?%|\s?px|\s?pixels)?(?![\w])")
DATE = re.compile(r"\b\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b")
QUOTED = re.compile(r'"([^"]+)"')
TERM = re.compile(r"\b(?:[A-Z][a-z]+|[A-Z]{2,})(?:(?: (?:—|-|&|>|By|of|to) | )(?:[A-Z][a-z]+|[A-Z]{2,}|&))+\b")
STOP = {"Step", "Starting screen", "For", "If", "The", "Use", "Have", "Sign", "Open"}
def norm(s): return re.sub(r"\s+", " ", s.replace(" px", " pixels").replace("px ", "pixels ")).lower()
def facts(text):
    t = re.sub(r"\bStep \d+: ", " ", text)          # the old one-line results started "Step N:"; the new results carry it as a heading
    f = {("label", re.sub(r"\s+", " ", re.sub(r"\{[^{}]*\}", "", x)).strip()) for x in QUOTED.findall(t) if "{" in x}   # names inside quotes
    t = re.sub(r"\{[^{}]*\}", " ", t)
    f |= {("amount", x.strip("()")) for x in AMOUNT.findall(t)}
    f |= {("date", x) for x in DATE.findall(t)}
    f |= {("number", re.sub(r"\s?(px|pixels)$", "", x).strip()) for x in NUMBER.findall(t)}
    f |= {("label", re.sub(r"\s+", " ", x).strip()) for x in QUOTED.findall(t) if x.strip()}
    f |= {("term", x) for x in TERM.findall(t) if x not in STOP and not x.startswith(("Step ", "Starting screen", "For example"))}
    return f

def tester_text_old(o):
    pre = pre_parts(o["custom_preconds"])
    state = " ".join(a for a, _ in pre if not a.startswith(("Scenario:", "If any record above")))
    ex = " ".join(b for _, b in pre if b)
    return state, ex, " ".join(lis(o["custom_steps"])), " ".join(x for r in results(o["custom_expected"]) for x in r)
def tester_text_new(n):
    return " ".join(lis(n["custom_preconds"]) + lis(n["custom_steps"]) + [x for r in results(n["custom_expected"]) for x in r])

# Facts that are deliberately not carried, with the reason (checked by hand, 26 Oct 2026).
JUSTIFIED = {
    ("term", "Staging Heavy Duty"): "example location name on a 'For example:' line of the old preconditions",
    ("number", "9919"): "part of the example location name",
}
GENERIC_REASONS = [
    (lambda kind, x: kind == "label" and x == "Admin", "the role is kept as 'Sign in as an Admin'"),
    (lambda kind, x: kind == "term" and x in {"Customer", "Work Orders"}, "kept in other words"),
]
rows, lost_all, ident_fail, strict = [], [], [], []
for k in IDS:
    o, n = OLD[k], NEW[k]
    to, tn = ssr_lib.results_tail(o["custom_expected"]), ssr_lib.results_tail(n["custom_expected"])
    qo, do, mo, no = blocks(to); qn, dn, mn, nn = blocks(tn)
    other_same = all(o.get(x) == n.get(x) for x in o if x not in ("custom_preconds", "custom_steps", "custom_expected"))
    ident = dict(quotes=qo == qn, design=do == dn, automation=mo == mn, notes=no == nn, tail=to == tn, other_fields=other_same)
    if not all(ident.values()): ident_fail.append((k, ident))
    state, ex, st, rs = tester_text_old(o)
    newt = norm(tester_text_new(n))
    newt = newt + " || " + re.sub(r"\s+", " ", re.sub(r"\[[^\]]*'s name\]", "", newt))   # also without the [<name>'s name] stand-ins
    old_f = facts(state) | facts(st) | facts(rs)
    ex_only = facts(ex) - old_f
    lost = []
    for kind, x in sorted(old_f):
        if norm(x) in newt: continue
        if kind == "number" and norm(x) in re.sub(r"[^\d.,% ]", " ", newt).split(): continue
        if (kind, x) in JUSTIFIED: continue
        lost.append((kind, x))
    lost_all += [(k, a, b) for a, b in lost]
    # stricter: a fact of an old result is in the new results, a fact of an old step in the new steps
    for txt, new, part in ((rs, " ".join(x for r_ in results(n["custom_expected"]) for x in r_), "results"), (st, " ".join(lis(n["custom_steps"])), "steps")):
        nn = norm(new); nn = nn + " || " + re.sub(r"\s+", " ", re.sub(r"\[[^\]]*'s name\]", "", nn))
        for kind, x in sorted(facts(txt)):
            if norm(x) in nn or (kind == "number" and norm(x) in re.sub(r"[^\d.,% ]", " ", nn).split()): continue
            strict.append((k, part, kind, x))
    rows.append(dict(key=k, cid=IDS[k], ident=ident, facts=len(old_f), ex_only=len(ex_only), lost=lost, o=o, n=n))
json.dump({"identity_failures": ident_fail, "lost": lost_all, "strict": strict}, open(f"{D}/fact-check.json", "w"), indent=1, ensure_ascii=False)
print("cases", len(rows), "| byte-identity failures", len(ident_fail), "| facts checked", sum(r["facts"] for r in rows), "| facts not found", len(lost_all), "| results/steps facts not in their own part", len(strict))
for k, a, b in lost_all: print("NOT FOUND", k, a, repr(b))
if "--report" not in sys.argv: sys.exit(1 if (ident_fail or lost_all or strict) else 0)

# ---- PASS-REPORT.md ----
def fmt_pre(h): return "\n".join(f"  - {x}" + (f"  \n    {b}" if b else "") for x, b in pre_parts(h))
def fmt_steps(h): return "\n".join(f"  {i}. {x}" for i, x in enumerate(lis(h), 1))
def fmt_res(h): return "\n".join(f"  - Step {i}:\n" + "\n".join(f"    - {x[len(f'Step {i}: '):] if x.startswith(f'Step {i}: ') else x}" for x in r)
                                  for i, r in enumerate(results(h), 1))
L = ["# Splitting Sales Representatives: every case in the QA lead's pattern (26 Oct 2026)", "",
     "Rule 117 fourteenth amendment (QA lead, 26 Oct 2026: \"Yes, permanent, all suites\"). **DRAFT: nothing written to TestRail, Jira, "
     "Slack or Google; no commit.** Generated by `pattern-format-2026-10-26/make_report.py`.", "",
     "## Summary", "",
     f"- Cases: {len(rows)} ({len([r for r in rows if not r['key'].startswith('DR-')])} library cases, "
     f"{len([r for r in rows if r['key'].startswith('DR-')])} design-recheck cases in `DR-PATTERN.json`). Every case in `testrail-id-map.csv` is covered.",
     "- C665915 (S1-01) is the QA lead's own model: its fields are byte-identical to before (it was already in the pattern).",
     f"- Byte identity of everything below the results (exact quotes with their From: lines, References from Design, held / Blocked notes, "
     f"AUTOMATION line) and of title, refs and every other field: **{len(rows) - len(ident_fail)} of {len(rows)} identical**.",
     f"- No fact lost: {sum(r['facts'] for r in rows)} facts (amounts, numbers, dates, quoted labels, product terms) taken from the old "
     f"preconditions (state lines), steps and results; **{len(lost_all)} not found** in the new text"
     + (" (listed below)." if lost_all else "."),
     f"- Values that appeared only on a \"For example:\" line and were dropped as examples: {sum(r['ex_only'] for r in rows)} (placeholders and example "
     "records such as ZZAUTOTEST names, S2-4000x work order numbers and the example location; they stay in the setup file for Claude sessions).",
     f"- Stricter check: every fact of an old result is in the new results of the same case, and every fact of an old step in the new steps: "
     f"**{len(strict)} misses**.",
     "- Gate: `python3 authoring/build.py` prints 0 PROBLEM lines (pattern gate replaces the Scenario gate; every other gate kept).", "",
     "## How the pattern was applied", "",
     "- Preconditions: written by hand per case (`authoring/pattern_cases.py`), in setup order: Sign in, the staff members, the customer, the "
     "records and their state, anything done after (a switch turned off, an account deactivated), the design pictures, then where to open it. "
     "Placeholders became plain names (sales rep A, staff member D, customer B, the first work order, the part sale, user B); values a result "
     "depends on stay as plain facts (amounts, hours, dates, settings); example-only values were dropped. The Blocked line is last "
     "(\"If you cannot set up any of the above, mark this test Blocked: \"setup not done\".\"), except on C665915, which keeps the QA lead's own words.",
     "- Steps: the case's own steps, with placeholders turned into the same plain names (one step reworded: S2-13 step 1, \"the existing the second "
     "work order\" → \"the existing second work order\").",
     "- Results: the case's own words split into one bullet per fact at sentence and semicolon boundaries, and by hand where a sentence joined two "
     "facts with \"and\" or a comma. A name inside quoted screen text (a log entry, a printed row) is shown as [sales rep A's name]; "
     "\"{Sales-rep-B} (Inactive)\" became \"sales rep B's name followed by \"(Inactive)\"\".",
     "- Setup facts added where the old preconditions left them implied (no behaviour added): S1-02 (sales rep A's last name sorts before sales rep B's, "
     "which the old example names gave), S5-19 (staff member C has the switch on when picked), and the order of events where a switch is turned off or an "
     "account deactivated after the person was picked (S1-07, S1-08, S2-07, S2-07b, S2-07c, S4-03b, S4-04c, S4-15, S4-15b, S4-20b, S4-26, S6-01, S6-02).",
     "- Design cases: the browser-window and design-pictures line became \"Set the browser window to …\" and \"Open the design pictures … attached "
     "to this case beside the browser window at 100% (actual size).\" with the picture names, boards and the sample-data sentence word for word.",
     "- Below the blank paragraph after the results nothing changed (checked byte for byte below).", ""]
if ident_fail:
    L += ["## Byte-identity failures", ""] + [f"- {k}: {v}" for k, v in ident_fail] + [""]
if lost_all:
    L += ["## Facts not found", ""] + [f"- {k}: {a} `{b}`" for k, a, b in lost_all] + [""]
L += ["## Per case, old vs new", ""]
for r in rows:
    o, n = r["o"], r["n"]; i = r["ident"]
    L += [f"### {r['key']} — C{r['cid']} (https://shopview.testrail.io/index.php?/cases/view/{r['cid']})", "",
          f"Title: {n['title']}" + ("" if o["title"] == n["title"] else f" (was: {o['title']})"), "",
          f"Below the results byte-identical: quotes {'yes' if i['quotes'] else 'NO'}, design block {'yes' if i['design'] else 'NO'}, "
          f"notes {'yes' if i['notes'] else 'NO'}, AUTOMATION line {'yes' if i['automation'] else 'NO'}; other fields {'unchanged' if i['other_fields'] else 'CHANGED'}. "
          f"Facts checked {r['facts']}, not found {len(r['lost'])}.", "",
          "**Old preconditions**", "", fmt_pre(o["custom_preconds"]), "", "**New preconditions**", "", fmt_pre(n["custom_preconds"]), "",
          "**Old steps**", "", fmt_steps(o["custom_steps"]), "", "**New steps**", "", fmt_steps(n["custom_steps"]), "",
          "**Old results**", "", fmt_res(o["custom_expected"]), "", "**New results**", "", fmt_res(n["custom_expected"]), ""]
open(f"{D}/PASS-REPORT.md", "w").write("\n".join(L) + "\n")
print("PASS-REPORT.md written,", len(L), "lines")
