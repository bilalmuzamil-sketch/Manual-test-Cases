#!/usr/bin/env python3
"""Pre-push safety snapshot: GET every case in the manifest + run R359 counts."""
import json, os, subprocess, sys, time

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
OUT = "build/report-suite/testrail-pre-push-snapshot-2026-07-28"
os.makedirs(OUT, exist_ok=True)

def api_get(endpoint):
    for attempt in range(5):
        out = subprocess.run(["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
                              "-H", "Content-Type: application/json",
                              "-w", "\n%{http_code}", BASE + endpoint],
                             capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429",) or code.startswith("5") or code == "000":
            time.sleep(2 ** attempt); continue
        return code, body
    return "000", ""

ops = json.load(open("/tmp/rs-push/ops.json"))
idmap = ops["idmap"]
all_ids = ops["updates"] + ops["deletes"]
fail = []
for i, iid in enumerate(all_ids):
    cid = idmap[iid].lstrip("C")
    code, body = api_get(f"get_case/{cid}")
    if code != "200":
        fail.append((iid, cid, code)); print("FAIL", iid, cid, code); continue
    d = json.loads(body)
    with open(os.path.join(OUT, f"C{cid}_{iid}.json"), "w") as fh:
        fh.write(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
    if (i + 1) % 20 == 0:
        print(f"  {i+1}/{len(all_ids)} snapshotted", flush=True)
    time.sleep(0.15)
print("snapshotted:", len(all_ids) - len(fail), "failed:", fail)

code, body = api_get("get_run/359")
if code == "200":
    run = json.loads(body)
    with open(os.path.join(OUT, "run-R359-pre-push.json"), "w") as fh:
        fh.write(json.dumps(run, indent=2, ensure_ascii=False) + "\n")
    total = sum(run.get(k, 0) or 0 for k in
                ("passed_count", "blocked_count", "untested_count", "retest_count",
                 "failed_count", "custom_status1_count", "custom_status2_count",
                 "custom_status3_count", "custom_status4_count", "custom_status5_count",
                 "custom_status6_count", "custom_status7_count"))
    print("R359 name:", run.get("name"))
    print("R359 pre-push test count:", total,
          "| passed", run.get("passed_count"), "| failed", run.get("failed_count"),
          "| blocked", run.get("blocked_count"), "| untested", run.get("untested_count"),
          "| retest", run.get("retest_count"))
else:
    print("R359 GET failed:", code)
if fail:
    sys.exit("SNAPSHOT INCOMPLETE — do not proceed")
