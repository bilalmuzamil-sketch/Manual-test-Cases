#!/usr/bin/env python3
"""Proves every build.py gate and the tester-readiness check FAIL on a planted fault (lesson L-19), and that running them changes no
file. python3 gate_selftest.py   (exit 1 if any gate lets its planted fault through)"""
import subprocess, os, sys, hashlib, json, shutil, tempfile, glob
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
EXPECT = {"blocked": "Blocked line", "placeholder": "old-layout", "forexample": "old-layout", "twoactions": "two UI actions",
          "readstep": "only reads", "results": "result groups", "quote": "not verbatim", "vague": "vague look", "keyref": "case key",
          "relevance": "relevance:", "independence": "independence:", "coverage": "S1-E1", "lost": "S1-05", "notmanual": "manual tester cannot make",
          "title": "title", "jargon": "technical term in tester text: request"}
def snap(): return {f: hashlib.md5(open(f, "rb").read()).hexdigest() for f in glob.glob(f"{P}/**/*", recursive=True) if os.path.isfile(f) and "__pycache__" not in f and "/full-pass-2026-10-27/design/" not in f}  # design/: the Phase D worker writes there
before = snap(); bad = 0
for name, want in EXPECT.items():
    r = subprocess.run([sys.executable, f"{D}/build.py"], capture_output=True, text=True, env=dict(os.environ, PL_PLANT=name), cwd=D)
    ok = r.returncode == 1 and any(want in l for l in r.stdout.splitlines() if l.startswith("PROBLEM"))
    bad += not ok; print(("OK   " if ok else "MISS ") + f"{name}: exit {r.returncode}, expected a PROBLEM line with {want!r}")
# the readiness check on a copy of proposals.json with the Blocked line planted
tmp = tempfile.mkdtemp(); os.makedirs(f"{tmp}/authoring")
prop = json.load(open(f"{D}/proposals.json")); k = sorted(prop)[0]
prop[k]["fields"]["custom_preconds"] += '<ul><li>If you cannot set up any of the above, mark this test Blocked: "setup not done".</li></ul>'
json.dump(prop, open(f"{tmp}/authoring/proposals.json", "w"))
r = subprocess.run([sys.executable, f"{P}/../../testing-tools/tester_readiness_check.py", tmp, "--sample", "0"], capture_output=True, text=True)
ok = r.returncode == 1; bad += not ok; print(("OK   " if ok else "MISS ") + f"tester_readiness_check on a planted Blocked line: exit {r.returncode}")
shutil.rmtree(tmp)
changed = [f for f, h in snap().items() if before.get(f) != h] + [f for f in before if not os.path.exists(f)]
if changed: bad += 1; print("MISS running the gates changed files:", changed[:5])
else: print("OK   running the planted gates changed no file")
print("gate self-test problems:", bad); sys.exit(1 if bad else 0)
