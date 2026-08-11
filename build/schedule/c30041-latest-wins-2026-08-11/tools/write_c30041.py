#!/usr/bin/env python3
"""The ONE authorised write of this pass: `update_case` on C30041.

Standing Rule 50 — EXHAUSTIVE then EXACT. The write sends ALL THREE text fields
explicitly (TestRail RE-RENDERS any text field omitted from the payload through
its HTML pipeline), then re-GETs and byte-compares EVERY field: the intended ones
against the intended payload, and every other field against the pre-write
snapshot. On ANY mismatch the run STOPS and reports both byte sequences.

`refs` is verified under the DECLARED TestRail normalisation
`','.join(p.strip() for p in s.split(','))`. The payload deliberately contains no
comma in `refs`, so the normalisation is a no-op here.

No delete. No add. No section op. No run write. No result.
"""
import json
import os
import sys
import urllib.error
import urllib.request
import base64

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
SNAP = os.path.join(HERE, "..", "snapshots")

_c = json.load(open("/tmp/testrail/creds.json"))
HOST = _c["host"].rstrip("/")
_AUTH = base64.b64encode(
    f"{_c.get('email') or _c['user']}:{_c['password']}".encode()).decode()


def _req(endpoint, data=None):
    req = urllib.request.Request(
        f"{HOST}/index.php?/api/v2/{endpoint}",
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Basic {_AUTH}",
                 "Content-Type": "application/json"},
        method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


CASE = 30041

TITLE = "Toolbar search matches customer, work order, unit, technician and line names"

PRECONDS = """1. You are signed in on a desktop browser.
2. Several shifts exist on the visible range for different customers/orders/technicians.
3. You are on the Schedule page in week view."""

STEPS = """1. Type a customer name into the toolbar search, then look at the grid.
2. Clear the search, then search a work order number, a unit number, a technician name and a line name in turn, looking at the grid after each one."""

EXPECTED = """1. The toolbar search filters the blocks on the grid against what you typed.
2. All five of these are matched against, so searching any one of them finds the blocks it belongs to: customer name, work order number, unit number, technician name, and line name.
3. Note for the tester: the specification does not say what happens to the blocks that do NOT match - whether they stay on the grid faded out, or disappear until you clear the search. Do not pass or fail this test on that. Check only that searching each of the five things above finds the right blocks. What happens to the non-matching blocks is an open question with the product owner.
---
This is the expected behaviour as per epic SV-8685 and the Schedule specification version 27 (§6, Search), read on 11 August 2026, which describes the search as filtering the grid blocks by matching against customer name, WO number, unit number, technician name, and line name.
This case used to also expect matching blocks to highlight and non-matching blocks to fade. That sentence was in version 23 of the specification; version 24, published on 6 August 2026, deleted it, and it has not come back in versions 25, 26 or 27. Story SV-8686 does still ask for it, but that wording has not been touched since the story was created on 27 July 2026, so the specification's deletion is the newer decision and it is the one this case now follows.
Last checked against build v3.5-7ec992f on 8/6/2026; the wording above was corrected on 11 August 2026 from the documents only, with no build opened.

AUTOMATION: READY
"""

PAYLOAD = {"title": TITLE, "custom_preconds": PRECONDS,
           "custom_steps": STEPS, "custom_expected": EXPECTED,
           "refs": "SV-8686 (§6 (Search) - spec v27 2026-08-07)"}


def refs_norm(s):
    return ",".join(p.strip() for p in (s or "").split(","))


def main(dry):
    pre = json.load(open(os.path.join(SNAP, "C30041-PRE.json")))
    # guard: the live case must still be byte-identical to the snapshot we reasoned on
    code, live = _req(f"get_case/{CASE}")
    assert code == 200, (code, live)
    drift = [k for k in set(pre) | set(live) if pre.get(k) != live.get(k)]
    if drift:
        print("!! CASE DRIFTED SINCE SNAPSHOT — STOPPING:", drift)
        return 1
    print(f"pre-write guard: C{CASE} byte-identical to snapshot on all "
          f"{len(set(pre) | set(live))} fields")
    print(f"refs payload length {len(PAYLOAD['refs'])} (limit 248), "
          f"commas={PAYLOAD['refs'].count(',')}")
    print(f"title length {len(TITLE)} (house limit ~80)")
    if dry:
        print("\n--- DRY RUN, nothing written ---")
        for k, v in PAYLOAD.items():
            print(f"\n### {k}\n{v}")
        return 0

    code, post = _req(f"update_case/{CASE}", PAYLOAD)
    print(f"update_case/{CASE} -> HTTP {code}")
    if code != 200:
        print("!! STOPPING:", post)
        return 1
    json.dump(post, open(os.path.join(SNAP, "C30041-POST-writeresponse.json"), "w"), indent=1)

    code, back = _req(f"get_case/{CASE}")
    assert code == 200, (code, back)
    json.dump(back, open(os.path.join(SNAP, "C30041-POST.json"), "w"), indent=1)

    fields = sorted(set(pre) | set(back) | set(PAYLOAD))
    intended, collateral, ok = [], [], True
    for k in fields:
        got = back.get(k)
        if k in PAYLOAD:
            want = PAYLOAD[k]
            match = (refs_norm(got) == refs_norm(want)) if k == "refs" else (got == want)
            intended.append((k, match))
            if not match:
                ok = False
                print(f"\n!! MISMATCH on intended field {k!r}")
                print("   WANT:", repr(want))
                print("   GOT :", repr(got))
        elif k in ("updated_on", "updated_by"):
            continue  # the server stamps these on any write, by definition
        else:
            same = pre.get(k) == got
            collateral.append((k, same))
            if not same:
                ok = False
                print(f"\n!! COLLATERAL CHANGE on {k!r}")
                print("   PRE :", repr(pre.get(k)))
                print("   POST:", repr(got))

    print(f"\nfields compared: {len(fields)}  "
          f"(intended {len(intended)}, untouched-proven {len(collateral)}, "
          f"server-stamped 2)")
    print("intended fields byte-verified:",
          all(m for _, m in intended), dict(intended))
    print("untouched fields byte-identical:", all(m for _, m in collateral))
    print("\nVERIFICATION:", "PASS" if ok else "FAIL — STOP")
    json.dump({"http": code, "intended": intended, "collateral_ok": all(m for _, m in collateral),
               "fields_compared": len(fields), "verdict": "PASS" if ok else "FAIL"},
              open(os.path.join(EV, "write-verification.json"), "w"), indent=1)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(dry="--go" not in sys.argv))
