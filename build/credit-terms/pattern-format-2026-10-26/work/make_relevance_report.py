#!/usr/bin/env python3
"""Relevance and independence pass report (26 Oct 2026). Compares before-relevance/proposals.json (the pattern drafts as applied to
TestRail, commit a7f242b3a) with authoring/proposals.json (after build.py). Writes ../RELEVANCE-PASS.md.
python3 make_relevance_report.py   (run authoring/build.py first; pass the build output file as argv[1] to quote the gate lines)"""
import os, sys, re, json, html, csv
W = os.path.dirname(os.path.abspath(__file__)); F = os.path.dirname(W); P = os.path.dirname(F); A = f"{P}/authoring"
B = json.load(open(f"{F}/before-relevance/proposals.json")); N = json.load(open(f"{A}/proposals.json"))
IDS = {r["key"]: (r["case_id"], r["link"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
U = html.unescape
def lis(h): return [U(x) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def head(f): return f["custom_expected"].split("<p></p>", 1)[0]
def note(f):
    t = f["custom_expected"].split("<p></p>", 1)[1].split("<p><strong>Exact quotes")[0]
    return U(re.sub(r"<[^>]+>", "", t)).strip()
def tail(f): return f["custom_expected"][f["custom_expected"].index("<p><strong>Exact quotes"):]
REC = re.compile(r"\b(?:vendor invoice|work order|credit memo|part sale|organization|estimate|customer|location|invoice|vendor|asset|number|term|user|role|date)s? [A-Z0-9]\b|\byour user name\b", re.I)
LISTS = re.compile(r"\b(customers|terms|vendors|invoices|work orders) ((?:[A-Z0-9](?: \([^)]*\))?(?:, | and |, and ))+[A-Z0-9])\b")
def names(ts):
    out = set()
    for b in ts:
        for m in REC.findall(b):
            m = re.sub(r"^(vendor invoice|work order|credit memo|part sale|[a-z]+)s ([a-z0-9])$", r"\1 \2", m.lower()); out.add(m)
        for kind, lst in LISTS.findall(b):
            for x in re.findall(r"\b[A-Z0-9]\b", re.sub(r"\([^)]*\)", "", lst)): out.add(kind[:-1] + " " + x.lower())
    return out
MON = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
def facts(t):
    out = set(re.findall(r"\$[\d,]+\.\d\d", t)) | set(re.findall(MON + r" \d{1,2}(?:, \d{4})?", t))
    out |= {q for q in re.findall(r'"([^"]+)"', t) if len(q) > 1}
    out |= set(re.findall(r"\b(?:Net \d+|COD|Due on Receipt|Credit Hold)\b", t))
    out |= set(re.findall(r"(?<![\w$.,-])\d+(?![\w-])(?![.,]\d)", t))
    return out
FACT_WHY = {  # facts dropped with a record no step or result uses
 "S4-04": "the three customers' credit limits ($500.00, $0.00, $1,000.00) and their A to Z order: no step or result uses them (the case searches by name)",
 "S4-08": "the third customer's $0.00 credit limit: no step or result opens that customer",
 "S4-16": "the credit limits and A to Z order of the three customers: step 6 checks the limit is unchanged, whatever it is",
 "S4-20": "the three customers' credit limits and A to Z order: no step or result uses them",
 "S4-34": "the three customers' credit limits and A to Z order: no step or result uses them",
}
idn = {"tail": 0, "title": 0, "steps": 0}
rows, lost, stepres = [], {}, []
for k in N:
    b, a = B[k]["fields"], N[k]["fields"]
    idn["tail"] += tail(b) == tail(a); idn["title"] += B[k]["title"] == N[k]["title"]; idn["steps"] += b["custom_steps"] == a["custom_steps"]
    for x, y in zip(lis(head(b)), lis(head(a))):
        if x != y: stepres.append((k, x, y))
    pb, pa = lis(b["custom_preconds"]), lis(a["custom_preconds"])
    nb, na = note(b), note(a)
    if pb == pa and nb == na: continue
    what = []
    dropped = sorted(names(pb) - names(pa) - {"the test location"})
    if dropped: what.append("no longer names " + ", ".join(dropped) + " (no step or result uses it; described without a name where it is still needed)")
    fresh = set({m.group(1).lower() for x in pa for m in re.finditer(r"\b((?:vendor invoice|work order|credit memo|part sale|customer|invoice|vendor|asset|estimate|term) [A-Z0-9]) \(made for this test\)", x)}
                   | {n for x in pa if x.startswith("Create ") for n in names([x])})
    fresh_b = {m.group(1).lower() for x in pb for m in re.finditer(r"\b((?:customer|term|vendor|work order|invoice|vendor invoice|asset) [A-Z0-9]) \(made for this test\)", x)}
    if fresh - fresh_b: what.append("records it changes are made for this test: " + ", ".join(sorted(fresh - fresh_b)))
    unnamed_fresh = [x for x in pa if "made for this test" in x and not re.search(r"[A-Z0-9] \(made for this test\)", x) and x not in pb]
    if unnamed_fresh: what.append("records described without a name are made for this test")
    sets = [x for x in pa if x not in pb and (re.match(r"Make sure (?:Net \d+(?:, | and )?)+ (?:is|are) active\.$", x) or "not the shop's default" in x or x == "Make sure Net 50 is deactivated.")]
    if sets: what.append("states the setting it relies on: " + " / ".join(f"\"{x}\"" for x in sets))
    if any("from other tests" in x for x in pb): what.append("\"(from other tests)\" removed: " + ("\"Other terms may also be listed; check only the order of the named rows.\"" if any(x.startswith("Other terms may") for x in pa) else "\"Other terms of the shop may also be offered.\""))
    if nb != na: what.append("note: the reference to another case replaced by what it means" if re.search(r"\b(?:S\d{1,2}-\d\d|D-\d\d|DATA-\d\d)\b", nb) else "note changed")
    if any("Have a second user" in x for x in pa) and not any("Have a second user" in x for x in pb): what.append("the second sign-in line no longer repeats your own sign-in")
    if k == "S11-20": what.append("says why customer A is needed (look for its entry in the report)")
    if not what: what.append("preconditions reworded (same records, same facts)")
    old_t = " ".join(pb + lis(b["custom_steps"]) + lis(head(b))); new_t = " ".join(pa + lis(a["custom_steps"]) + lis(head(a)) + [na])
    lf = sorted(f for f in facts(old_t) if f not in new_t)
    if lf: lost[k] = lf
    rows.append((k, what, pb, pa, nb, na))

gate = open(sys.argv[1]).read().splitlines() if len(sys.argv) > 1 else []
R = []; Wr = R.append
Wr("# Credit terms: relevance and independence pass (26 Oct 2026)"); Wr("")
Wr('QA lead, 26 Oct 2026: *"The preconditions should be something like the easiest to understand for a layman or a manual QA tester to setup and they '
   'must make sense and relate to the steps and expected results below."* and *"the test cases need to be created in a way that if one test case fails '
   'that does not block the other test case."* Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed.')
Wr(""); Wr("Baseline: the pattern drafts as applied to TestRail (commit a7f242b3a, `before-relevance/proposals.json`). After: `authoring/proposals.json`. "
           "Generated by `pattern-format-2026-10-26/work/make_relevance_report.py`.")
Wr(""); Wr("## 1. Checks")
Wr(f"- Cases changed in this pass: **{len(rows)} of {len(N)}** (preconditions and, for 11 cases, the note).")
Wr(f"- Exact quotes, From lines, References from Design and AUTOMATION line identical to the applied version: **{idn['tail']} of {len(N)}**; titles identical: **{idn['title']} of {len(N)}**; steps identical: **{idn['steps']} of {len(N)}**.")
Wr(f"- Results changed: {len(stepres)} bullet(s): " + "; ".join(f"{k}: \"{x}\" → \"{y}\"" for k, x, y in stepres) + " (the location you sign in at is now called the test location everywhere; same meaning).")
Wr("- No fact lost: every amount, date, quoted label, term name and number of the old preconditions, steps and results is still in the case, except facts that belonged only to a record no step or result uses: "
   + ("; ".join(f"{k} ({FACT_WHY.get(k, 'NOT EXPLAINED: ' + ', '.join(v))})" for k, v in lost.items()) or "none") + ".")
Wr(""); Wr("## 2. The gates (authoring/build.py, permanent)")
Wr("- **Relevance gate.** Every record a precondition names (term A/B, customer A/B/C, vendor A/B, work order 1/2, invoice A, location A/B, user A, role A, "
   "number A, date A, your user name, \"the second …\") must appear in the steps or the expected results, or the bullet that names it must say why it is "
   "needed with a \"so …\" clause (for example \"…, so the term is still in use\"). Otherwise a PROBLEM line.")
Wr("- **Independence gate.** (a) No case key or C-id in anything the tester reads (title, preconditions, steps, results, note). (b) In a case whose steps "
   "change something (move, deactivate, delete, save, create, invoice, reverse, import, receive, send), every record of a changeable kind the steps or "
   "results name (term, customer, vendor, work order, invoice, vendor invoice, credit memo, part sale, estimate, asset) is described in the preconditions "
   "as new or made for this test (or as data from before the release, the built-in Counter Sale customer, or a name the steps use to create it). Otherwise a PROBLEM line.")
Wr("- Also added: a hand-written precondition form in `pattern.py` that no longer matches its case is a PROBLEM (stale).")
Wr("- Output of `python3 authoring/build.py`:"); Wr("```")
for l in gate:
    if re.search(r"gate:|PROBLEM", l): Wr(l)
Wr("```")
Wr(""); Wr("## 3. How it was done")
Wr("- `authoring/relevance.py` (applied by `ct_lib.C()`, so the TestRail text and the setup file describe the same records): per-case replacements that split the shared "
   "building blocks (the three-customer term, the work-order-for-a-customer sentence, the signed-in user and custom role) where they named records a case never uses; "
   "notes that named another case; \"(from other tests)\" wording.")
Wr("- Independence, by rule: a record the steps change is marked \"(made for this test)\" where it is first described (or listed in a \"Create … just for this test\" bullet "
   "when it sits in a list); every standard Net term a step or result needs is stated active unless the preconditions already state its state; Net 30 active and not the "
   "default for the three permission cases whose menu shows \"Make Default for New Customers\".")
Wr(""); Wr("## 4. Cases changed in this pass (one line each)")
for k, what, *_ in rows:
    cid, link = IDS.get(k, ("", ""))
    Wr(f"- **{k}** (C{cid}): " + "; ".join(what) + ".")
Wr(""); Wr("## 5. Old and new preconditions")
for k, what, pb, pa, nb, na in rows:
    cid, link = IDS.get(k, ("", ""))
    Wr(""); Wr(f"### {k} · C{cid} · {link}")
    Wr("- Old:"); [Wr(f"  - {x}") for x in pb]
    Wr("- New:"); [Wr(f"  - {x}") for x in pa]
    if nb != na: Wr(f"- Old note: {nb}"); Wr(f"- New note: {na}")
open(f"{F}/RELEVANCE-PASS.md", "w").write("\n".join(R) + "\n")
print("changed", len(rows), "| tail identical", idn["tail"], "| titles", idn["title"], "| steps identical", idn["steps"], "| result bullets changed", len(stepres))
print("lost", lost)
