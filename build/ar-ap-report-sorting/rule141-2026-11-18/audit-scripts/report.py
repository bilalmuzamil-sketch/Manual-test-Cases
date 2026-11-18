import json, re
from collections import Counter, defaultdict
A = json.load(open("audit.json")); C = json.load(open("cases.json")); RUNS = json.load(open("runs.json"))
SUITES = ["ar-ap-report-sorting", "tiered-pricing", "founder-mode/bill-to", "founder-mode/internal-work-orders", "splitting-sales-reps",
          "technician-toggle", "founder-mode/what-why", "founder-mode/part-lifecycle", "credit-terms"]
NAME = {"ar-ap-report-sorting": "A/R and A/P Report Sorting", "tiered-pricing": "Tiered Pricing", "founder-mode/bill-to": "Bill To",
        "founder-mode/internal-work-orders": "Internal Work Orders", "splitting-sales-reps": "Splitting Sales Representatives",
        "technician-toggle": "Technician Toggle", "founder-mode/what-why": "What/Why", "founder-mode/part-lifecycle": "Part Lifecycle",
        "credit-terms": "Credit terms"}
TZ = " Name the time zone the dates are judged in (app setting and browser) and add a control document saved at midday local time."
def fix(o):
    f = set(o["fails"]); r = " ".join(o["ref"])
    if o["kind"] == "XV":
        if "picture" in r or "today's ct" in r:
            s = "A Today picture is not a same-conditions reference: add a step that opens the same screen on production (old version) in the same sitting, same location, same Admin, same app and browser time zones; screenshot both (or replace \"as today\" with the source's explicit value)."
        elif re.search(r"before (?:the|this) release|noted|written|screenshot|saved", r):
            s = "Before-release record does not name the conditions: name one location, the same Admin, app time-zone setting and browser time zone (and the as-of date) for both sides; open production (old version) in the same sitting where it still runs it, else require the record to show those settings; screenshot both."
        else:
            s = "Implicit \"as today/as before\": add a step that opens the reference side (production, old version) in the same sitting with the same location, Admin, app and browser time zones" + (" and as-of date" if "1-asof" in f else "") + "; screenshot both (or replace with the source's explicit value)."
        if "2-timezone" in f or "2-control" in f: s += TZ
        return s
    if "2-timezone" in f and "2-control" in f: return TZ.strip()
    if "2-control" in f: return "Time zone is named; add a control document saved at midday local time whose day cannot move."
    if "2-timezone" in f: return "Name the time zone the dates are judged in (app setting and browser)."
    return ""
L = []
w = L.append
w("# Rule 141 audit of our suites — 18 Nov 2026 (read-only)\n")
w("QA lead approval, 18 Nov 2026 (\"Ok\"): audit every comparison case in our suites, READ-ONLY, and list what needs changing. Nothing was written to TestRail, Jira or any build.py. Rule 141 and lesson L-22 (SV-12853).\n")
w("## Task 1 status: C715471 / C715472 not rewritten (stopped as instructed)\n")
w("- Before rewriting, the PRD was re-checked (Rule 59): Confluence 947650561 \"A/R and A/P Report Sorting, Export and Location Filter\" was **last modified 16 Nov 2026** (Chris Ward); the suite quotes **version 13 (13 Nov 2026)**, last re-checked 14 Nov 2026. The page has moved since our version, so, as the brief says, Task 1 stopped: no library change, no TestRail write, no run change. The version number of the 16 Nov edit was not read (the search tool returns the date only; the page body was not pulled).")
w("- Both cases stay in run 557 untouched. Their audit rows are below (REL-01, REL-02 under A/R and A/P).\n")
w("## Decision needed from the QA lead\n")
w("1. **A/R and A/P PRD moved on 16 Nov 2026.** Recommended: let me diff the 16 Nov PRD against version 13 first (Rule 134 named-set check of what it changes), then rewrite C715471/C715472 to Rule 141 on the new version in the same pass. Alternative: rewrite them on version 13 now and re-stamp later (faster, but the quotes may already be out of date).")
w("2. **The 442 cases this audit lists.** Recommended: fix the 284 comparison cases first (they can produce a false finding like SV-12853), and for Tiered Pricing's \"Must not change: today's pricing\" folder prefer option (A), explicit values from the source, over (B), a production step, because (A) needs no production login and cannot be misread. The 171 date-result cases need one precondition and one control record each, best done suite by suite with the generic gate below switched on at the same time.")
w("3. **The generic gate (Rule 141 point 6).** Recommended: build `rule141_gate.py` and plug it into all nine build.py files as listed at the end, with each suite's exemptions taken from this audit.\n")
w("## How the cases were read\n")
w("- Every case in each suite's `authoring/proposals.json` (our library, as rendered for TestRail) was read by script: title, preconditions, steps and the plain expected results (the quotes, design references and AUTOMATION line below them were excluded, because PRD quotes say \"as today\" without being a comparison). 3,493 cases in 9 suites, 100% read by the script. Run membership read live from TestRail on 18 Nov 2026 (get_tests, read-only).")
w("- The library can be behind the live TestRail text where cases were edited outside the library (A/R and A/P: 11-12 Nov; What/Why noted in its PROJECT-STATE). Each fix must be re-checked against the live case before any write.")
w("- **Classes** (script, then spot-read by hand for each trigger group):")
w("  - **Comparison (XV)**: the case judges the build against a reference side: \"as today\", \"as before\", \"as in production\", a \"Today picture\", \"today's <screen/behaviour>\", \"still looks/works as\", or values captured before the release. Rule 141 points 1-2 tested.")
w("  - **Legacy data**: mentions \"before the release\" only because its data was made before the release (or the case runs on production with such data), and the expected values are written out. Not a comparison; points 1 pass. Would still trip a naive point-6 gate (see the gate plan).")
w("  - **Must-not-change, explicit values**: in a must-not-change / release-day folder, no reference side, explicit expected values. Point 1 passes (one side only).")
w("  - **In one sitting**: \"unchanged\", \"before the change\", staging named as the place to test: both sides are seen in one session by one user, so conditions are identical by construction. Point 1 passes.")
w("  - **Date result**: an expected result judges a date or day value (a dated value such as \"Nov 4, 2026\", \"today's date\", yesterday/tomorrow, Past Due N, a document's aging bucket, a Date/Due Date/posting date that reads a day). Rule 141 point 2 tested (time zone named; a midday control record).")
w("- **Point tests** (each must be stated in the case): 1-location (same location for both sides), 1-user (same Admin), 1-timezone (app time-zone setting and browser time zone, same on both sides), 1-asof (same as-of date or date range, where the case has one), 1-ref-opened (a step opens the reference side in the same sitting), 1-screenshots (both sides screenshotted), 2-timezone (date results name their time zone), 2-control (a control record saved at midday, or another day-proof control).")
w("- Limits, stated honestly: the classes come from wording patterns, then hand spot-checks of every trigger group; a handful of borderline cases may sit in the wrong class (listed under \"Borderline\" where found). No case was judged on the build; this is a wording audit of the cases only.\n")
w("## Counts per suite\n")
w("| Suite | Cases | Comparison (XV) | of which fail point 1 | Legacy data (pass) | Must-not-change, explicit (pass) | One sitting (pass) | Date results | of which fail point 2 | Cases to change | Run |")
w("|---|---|---|---|---|---|---|---|---|---|---|")
tot = Counter()
for s in SUITES:
    S = [o for o in A if o["suite"] == s]; n = sum(1 for c in C.values() if c["suite"] == s)
    xv = [o for o in S if o["kind"] == "XV"]; x1 = [o for o in xv if any(f.startswith("1") for f in o["fails"])]
    d = [o for o in S if o["date"]]; d2 = [o for o in d if any(f.startswith("2") for f in o["fails"])]
    ch = [o for o in S if o["fails"]]
    run = RUNS[s]; rn = f"{run['run']}" + ("" if run["name"] else " (no longer exists)")
    row = [n, len(xv), len(x1), sum(o["kind"] == "LEGACY" for o in S), sum(o["kind"] == "SEC" for o in S), sum(o["kind"] == "IS" for o in S), len(d), len(d2), len(ch)]
    for i, v in enumerate(row): tot[i] += v
    w(f"| {NAME[s]} | " + " | ".join(map(str, row)) + f" | {rn} |")
w("| **Total** | " + " | ".join(f"**{tot[i]}**" for i in range(9)) + " | |\n")
# Tiered Pricing INV folder
tp = [o for o in A if o["suite"] == "tiered-pricing" and o["sec"] == "INV"]
tpn = sum(1 for c in C.values() if c["suite"] == "tiered-pricing" and c["sec"] == "INV")
k = Counter(o["kind"] for o in tp)
inrun = sum(1 for o in tp if o["fails"] and o["member"].startswith("in run"))
w("## Tiered Pricing — folder \"Must not change: today's pricing\" (counted separately)\n")
w(f"- {tpn} cases in the folder (library section INV). {len(tp)} hit an audit class: {k.get('XV',0)} comparisons, {k.get('LEGACY',0)} legacy data, {k.get('SEC',0)} must-not-change with explicit values, {k.get('IS',0)} one sitting; {tpn-len(tp)} match no class.")
w(f"- {sum(1 for o in tp if o['fails'])} of the {tpn} fail Rule 141 and need changing; {inrun} of the flagged cases are in run 560.")
pics = sum(1 for o in tp if o["kind"] == "XV" and any("picture" in r for r in o["ref"]))
w(f"- The common pattern: the case says the screen \"works the same way\" / \"as today\" and points at an attached **Today picture** (a design capture of production, conditions unknown) instead of opening production in the same sitting ({pics} of the folder's comparisons use a Today picture). The suite chose staging and says \"production is not needed\"; under Rule 141 point 1 that is only valid where the expected value is written out. Two ways to fix the whole folder (decision below): (A) write the explicit value from the PRD/V1 source into each result and drop \"as today\"; (B) keep the comparison and add a production step in the same sitting with the four named conditions and two screenshots.\n")
w("## Cases to change, per suite\n")
w("Columns: key, C-id and link, run membership (in run / held), the points that fail, the proposed fix in one line.\n")
for s in SUITES:
    S = [o for o in A if o["suite"] == s and o["fails"]]
    if not S: continue
    w(f"### {NAME[s]} ({len(S)} cases)\n")
    w("| Key | Case | Run | Fails | Proposed fix |")
    w("|---|---|---|---|---|")
    order = {"XV": 0, "LEGACY": 1, "SEC": 2, "IS": 3, None: 4}
    for o in sorted(S, key=lambda o: (order[o["kind"]], o["key"])):
        cid = o["cid"]; link = f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})" if cid else "not in TestRail"
        kind = {"XV": "comparison", "LEGACY": "legacy data", "SEC": "must not change", "IS": "one sitting", None: "date result"}[o["kind"]]
        w(f"| {o['key']} | {link} {o['title'].replace('|','/')} ({kind}) | {o['member']} | {', '.join(o['fails'])} | {fix(o)} |")
    w("")
open("/home/user/Manual-test-Cases/build/RULE-141-AUDIT-2026-11-18.md", "w").write("\n".join(L) + "\n")
print("rows", sum(1 for o in A if o["fails"]))
for s in SUITES:
    S=[o for o in A if o["suite"]==s and o["fails"]]; print(s, len(S), Counter(o["member"].split(" (")[0] for o in S))
G = r'''
## Borderline cases seen while spot-reading (for the reader, not counted twice)

- Technician Toggle release-day cases (S6-xx) run on production with staff members made "shortly before the release reached production": classed as legacy data (explicit values), not comparisons. API cases that say "accepted, as today" are comparisons by wording only; the cheapest fix there is the explicit value from the source.
- Credit terms DATA-21/22 and S4-xx "customer from before the release": legacy data, explicit values (pass point 1); their date results are listed only where a dated value is judged.
- A/R and A/P REL-03 (evening PDF date) and REL-11 (link saved before the release): REL-03 is a date case (point 2); REL-11 is legacy data.
- "Today picture" cases (Tiered Pricing, Credit terms, Part Lifecycle design cases): the picture is a design capture of production taken under unknown conditions, so it cannot stand in for the reference side; design-look cases that compare with a design picture of the NEW screen are not comparisons and are not listed.

## Proposed generic build.py gate (Rule 141 point 6) — plan only, no build.py changed

**One shared module, `build/testing-tools/rule141_gate.py`**, so every suite runs the same check:

- `check(cases, exempt) -> list[str]` where `cases` is `{key: fields}` in the TestRail shape every suite already renders for `proposals.json` (`title`, `custom_preconds`, `custom_steps`, `custom_expected`), and `exempt` is the suite's own `{key: "legacy data: …" | "one sitting: …" | "explicit values: …"}` with a reason each.
- It reads only the tester's words (title, preconditions, steps, expected results above "Exact quotes from the source" / "References from Design" / "AUTOMATION:"), so a PRD quote saying "as today" never trips it.
- **Trigger (point 6):** production, "before the release" / "before this release", "today's" (not "today's date"), "unchanged", an old or previous build/version, "as today", "as before", "Today picture".
- **Point 1, on a triggered case that is not exempt** — PROBLEM unless the preconditions say: the same named location for both sides; the same Admin user; the app time-zone setting and the browser time zone, the same on both sides; the same as-of date or date range (only where the case has one); and the steps hold one step that opens the reference side in the same sitting (production, old version) and one screenshot step per side. A before-release record is accepted only if its precondition names the same four settings.
- **Point 2, on any case whose expected result judges a date or day** (dated value, today's date, yesterday/tomorrow, Past Due N, an aging bucket, a Date / Due Date / posting date that reads a day) — PROBLEM unless the case names the time zone the date is judged in and has a control record saved at midday local time.
- **Point 4:** PROBLEM on a title that states a verdict ("different from production", "same as production", "broken", "wrong").
- **Exemptions stay honest:** an exemption without a reason, or for a case that no longer triggers, is itself a PROBLEM (no stale exemption survives).
- **Same check before writes:** `tester_readiness_check.py` calls the same module, so a write script refuses a case that fails it (Rule 138).

**Where it plugs in** (one call, `probs += R141.check(<rendered fields>, R141_EXEMPT)`, placed where the rendered fields exist and before the PROBLEM lines are printed):

| Suite | build.py | Plug-in point |
|---|---|---|
| A/R and A/P Report Sorting | `build/ar-ap-report-sorting/authoring/build.py` | before line 209 `for p in probs: print("PROBLEM", p)`, on `{c["key"]: L.render(c) for c in L.CASES}` |
| Tiered Pricing | `build/tiered-pricing/authoring/build.py` | after `out` is built (line 294-306), before line 325 print loop, on `{k: v["fields"] for k, v in out.items()}` |
| Bill To | `build/founder-mode/bill-to/authoring/build.py` | after line 99 (out written), before line 100 print loop |
| Internal Work Orders | `build/founder-mode/internal-work-orders/authoring/build.py` | after line 190 (out written), before line 191 print loop |
| Splitting Sales Representatives | `build/splitting-sales-reps/authoring/build.py` | move line 125 (`out = …`) above line 124's print loop, then call the gate between them |
| Technician Toggle | `build/technician-toggle/authoring/build.py` | after line 86 (out written), before line 87 print loop |
| What/Why | `build/founder-mode/what-why/authoring/build.py` | `out` is built at line 209, after the print loop at 208: build `out` first, call the gate, then print |
| Part Lifecycle | `build/founder-mode/part-lifecycle/authoring/build.py` | same as What/Why: `out` at line 204, print loop at 203 |
| Credit terms | `build/credit-terms/authoring/build.py` | same: `out` at line 249, print loop at 248 |

Each suite also gets its own `R141_EXEMPT` dict (in its library), seeded from this audit's "legacy data", "must not change, explicit values" and "one sitting" classes, each with its reason.
'''
open("/home/user/Manual-test-Cases/build/RULE-141-AUDIT-2026-11-18.md", "a").write(G)
