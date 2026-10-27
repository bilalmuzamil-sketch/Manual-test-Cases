#!/usr/bin/env python3
"""Tool health check (27 Oct 2026, QA lead: "See if your checking tools are in good shape or anything is broken").
Runs every checking tool the Splitting Sales Representatives, A/R and A/P and Credit terms suites rely on, read-only (no TestRail
write, no commit), and proves each one BOTH ways: it passes on today's cases AND it fails on a planted fault. A tool that only ever
says "pass" is broken in the way that bites (L-13). python3 tool_health_check.py   (exit 1 if anything is broken)"""
import subprocess, sys, os, json, shutil, tempfile, re

B = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); T = f"{B}/testing-tools"
SUITES = {"splitting-sales-reps": {"build": "authoring/build.py", "also": ["pattern-format-2026-10-26/DR-PATTERN.json"],
                                   "ident": f"{B}/tester-readthrough-2026-10-26/splitting-sales-reps/check_byte_identity.py",
                                   "dry": [["authoring", "apply5.py"], ["pattern-format-2026-10-26", "apply_dr_pattern.py"]]},
          "ar-ap-report-sorting": {"build": "authoring/build.py", "also": [],
                                   "ident": f"{B}/tester-readthrough-2026-10-26/ar-ap-report-sorting/check_tail_identity.py",
                                   "dry": [["authoring", "apply_design.py"]]},
          "credit-terms": {"build": "authoring/build.py", "also": [],
                           "ident": f"{B}/tester-readthrough-2026-10-26/credit-terms/verify_and_report.py",
                           "dry": [["authoring", "update_changed.py"], ["authoring", "create.py"]]}}
rows = []


def run(cmd, cwd=None, timeout=900):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        return 99, "TIMEOUT"


def rec(name, ok, detail):
    rows.append((name, ok, detail.strip().replace("\n", " | ")[:220])); print(("OK   " if ok else "BROKEN ") + name + " — " + rows[-1][2])


# 1. secret scanner proves itself both ways
rc, out = run([sys.executable, f"{T}/scan_secrets.py", "--selftest"]); rec("scan_secrets.py --selftest", rc == 0, out[-200:])

# 2. TestRail read access (read only)
rc, out = run([sys.executable, "-c", f"import sys; sys.path.insert(0, '{B}/dashboards/currency-2026-10-14/apply'); from trlib import api; "
               "c = api('get_case/665915'); print(c['id'], c['title'][:40])"])
rec("TestRail read (get_case C665915)", rc == 0 and "665915" in out, out[-160:])

for s, cfg in SUITES.items():
    P = f"{B}/{s}"
    # 3. the suite's own build gates
    rc, out = run([sys.executable, cfg["build"]], cwd=P)
    # a build.py either prints "PROBLEM lines: N" or (Splitting Sales Representatives) prints "PROBLEM ..." lines only when it fails;
    # both exit non-zero on a problem
    m = re.search(r"PROBLEM lines: (\d+)", out); plines = [l for l in out.splitlines() if l.startswith("PROBLEM ") and "PROBLEM lines" not in l]
    rec(f"{s}: build.py", rc == 0 and not plines and (not m or m.group(1) == "0"), (m.group(0) if m else f"exit {rc}, {len(plines)} PROBLEM lines"))
    # 4. readiness check on today's cases
    cmd = [sys.executable, f"{T}/tester_readiness_check.py", P, "--sample", "0"] + [y for x in cfg["also"] for y in ("--also", x)]
    rc, out = run(cmd); rec(f"{s}: tester_readiness_check (today's cases)", rc == 0, out.splitlines()[0] if out else "no output")
    # 5. quotes/design/AUTOMATION identity against the TestRail read-backs
    if os.path.exists(cfg["ident"]):
        rc, out = run([sys.executable, cfg["ident"]], cwd=P); rec(f"{s}: identity check ({os.path.basename(cfg['ident'])})", rc == 0, out[-200:])
    else:
        rec(f"{s}: identity check", False, f"missing {cfg['ident']}")
    # 6. dry runs of every write script (no --apply): must run and must show nothing pending
    for d, f in cfg["dry"]:
        rc, out = run([sys.executable, f], cwd=f"{P}/{d}")
        pending = re.search(r"to update \[(.+)\]|update ([1-9]\d*) add|missing \[(.+)\]", out)
        rec(f"{s}: {f} dry run", rc == 0 and not pending, out.splitlines()[-1] if out.strip() else "no output")

# 6b. each identity check proves it FAILS when a read-back quote differs (one byte changed in one committed read-back, restored at once)
import csv as _csv
for s, cfg in SUITES.items():
    if not os.path.exists(cfg["ident"]): continue
    P = f"{B}/{s}"; cid = next(iter(_csv.DictReader(open(f"{P}/testrail-id-map.csv"))))["case_id"]; f = f"{P}/applied/C{cid}-after.json"
    orig = open(f, "rb").read()
    try:
        a = json.loads(orig); e = a["custom_expected"]; i = e.find("&ldquo;") if "&ldquo;" in e else e.find("Exact quotes")
        a["custom_expected"] = e[:i + 8] + "X" + e[i + 8:]; open(f, "w").write(json.dumps(a, indent=1, ensure_ascii=False))
        rc, out = run([sys.executable, cfg["ident"]], cwd=P)
    finally:
        open(f, "wb").write(orig)
    rec(f"{s}: identity check catches a changed quote", rc != 0 or "MISMATCH" in out or "PROBLEM" in out, out[-160:])
    rc2, out2 = run(["git", "diff", "--quiet", "--", f], cwd=B); rec(f"{s}: read-back restored after the test", rc2 == 0, f)

# 6c. the setup file and outputs regenerate byte-identically (a drifted generator would silently change what testers read)
for s, gens in {"splitting-sales-reps": ["authoring/render_setup.py"], "ar-ap-report-sorting": ["authoring/render_setup.py", "authoring/render_outputs.py"],
                "credit-terms": ["authoring/render_setup.py", "authoring/render_outputs.py"]}.items():
    for g in gens:
        if not os.path.exists(f"{B}/{s}/{g}"): rec(f"{s}: {g}", False, "missing"); continue
        rc, out = run([sys.executable, g], cwd=f"{B}/{s}"); rec(f"{s}: {g} runs", rc == 0, out.splitlines()[-1] if out.strip() else "ok")

# 7. readiness check proves it FAILS on each planted fault (one throwaway copy, never the real files)
FAULTS = {"Blocked line": ("custom_preconds", '<ul><li>If you cannot set up any of the above, mark this test Blocked: "setup not done".</li></ul>'),
          "not manual": ("custom_steps", "<ol><li>Send the request by a means other than the page.</li></ol>"),
          "vague look": ("custom_expected", "<p>Step 1:</p><ul><li>The table looks native.</li></ul>"),
          "Make sure for a record this test makes": ("custom_preconds", "<ul><li>Make sure invoice A was created today.</li></ul>"),
          "case id in tester text": ("custom_steps", "<ol><li>Repeat what C723901 did.</li></ol>"),
          "who to ask": ("custom_preconds", "<ul><li>Ask your QA lead for the login.</li></ul>")}
src = json.load(open(f"{B}/credit-terms/authoring/proposals.json")); k0 = sorted(src)[0]
for name, (field, bad) in FAULTS.items():
    tmp = tempfile.mkdtemp(); os.makedirs(f"{tmp}/authoring")
    case = json.loads(json.dumps(src[k0])); case["fields"][field] = bad + (case["fields"][field] or "")
    json.dump({k0: case}, open(f"{tmp}/authoring/proposals.json", "w"))
    rc, out = run([sys.executable, f"{T}/tester_readiness_check.py", tmp, "--sample", "0"])
    rec(f"readiness check catches planted '{name}'", rc == 1 and f": {name}:" in out, [l for l in out.splitlines() if l.startswith("PROBLEM")][:1].__str__())
    shutil.rmtree(tmp)
# 8. the write guard refuses (require() exits the caller)
tmp = tempfile.mkdtemp(); os.makedirs(f"{tmp}/authoring")
case = json.loads(json.dumps(src[k0])); case["fields"]["custom_preconds"] += FAULTS["Blocked line"][1]
json.dump({k0: case}, open(f"{tmp}/authoring/proposals.json", "w"))
rc, out = run([sys.executable, "-c", f"import sys; sys.path.insert(0, '{T}'); import tester_readiness_check as t; t.require('{tmp}'); print('WROTE')"])
rec("write guard require() refuses a bad case", rc != 0 and "REFUSED" in out and "WROTE" not in out, out[-160:]); shutil.rmtree(tmp)
# 9. every write script still carries the guard
for s, cfg in SUITES.items():
    for d, f in cfg["dry"]:
        txt = open(f"{B}/{s}/{d}/{f}").read()
        i_guard, i_apply = txt.find("_TRC.require("), txt.find('"--apply" not in sys.argv')
        rec(f"{s}: {f} has the Rule 138 guard after its --apply check", 0 <= i_apply < i_guard, "guard present" if i_guard >= 0 else "guard MISSING")

# 10. running every tool above changed no committed file (a check must never rewrite a record)
rc, out = run(["git", "status", "--porcelain", "--", "."], cwd=B)
changed = [l for l in out.splitlines() if l.strip() and "tool_health_check.py" not in l]
rec("no committed file changed by running the tools", not changed, "; ".join(changed[:6]) or "tree unchanged")

bad = [r for r in rows if not r[1]]
print(f"\n{len(rows)} checks | OK {len(rows) - len(bad)} | BROKEN {len(bad)}")
for r in bad: print("  BROKEN:", r[0], "—", r[2])
sys.exit(1 if bad else 0)
