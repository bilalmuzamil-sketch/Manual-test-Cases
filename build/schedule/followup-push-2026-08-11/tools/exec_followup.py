#!/usr/bin/env python3
"""EXECUTOR — the authorised Schedule follow-up push of 2026-08-11.

TWO ops, and nothing else:
  I1  1 x update_case  C29944  -- REMOVE the unsourced multi-status assertion
                                  (expected item 3) and renumber. Removal, never
                                  substitution (Rules 25/42/57/58).
  I2  1 x update_case  C38866  -- re-point the Rule-54 provenance line from the
                                  epic to the OWNING STORIES (per-story precision,
                                  Rule 20), so it matches the case's own `refs`.
                                  Sentence 2 (the build stamp) untouched.

NO add_case. NO delete_case. NO section write. NO run write. NO result write.
NO Jira call of any kind (the creation hold at Rule 62's tail is active).

VERIFICATION (Standing Rule 50, via tr.update_case_verified):
  * every target snapshotted BEFORE the write, committed to disk
  * every payload carries ALL THREE text fields, even the unchanged ones
    (playbook §J DECLARED NORMALISATION -- TestRail re-renders any OMITTED text
    field into <p>-wrapped CRLF, and this project shows markup to the tester)
  * re-GET after every write, EVERY field compared, every unintended field proven
    byte-identical to the pre-write snapshot; ON ANY MISMATCH the batch STOPS
  * surgery is done by EXACT-STRING replacement with pre-assertions on the literal
    and its occurrence count -- never by rebuilding the field from a template
    (the C30341 lesson: a byte-check proves FIDELITY, not CORRECTNESS)
  * `custom_atmstatus` captured AT WRITE TIME (Rule 65), not from any earlier file
"""
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, "/tmp/testrail")
import tr                                                        # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = "/tmp/fu-push"
EXPECT_SHA = "4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b"
LOG = []


def now():
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def say(s):
    print(s, flush=True)
    LOG.append(s)


# ------------------------------------------------------------------ Rule 59
def source_recheck(label):
    """Re-read the spec at write time. Compare the BODY CHECKSUM, not the version
    number -- the in-body 'Version' field on this page reads 1.0 and lies."""
    sys.path.insert(0, os.path.join(REPO, "build", "schedule",
                                    "coverage-gaps-2026-08-11", "tools"))
    import date_requirements as dr
    url = ("https://shopview.atlassian.net/wiki/rest/api/content/713031682"
           "?expand=version,body.storage")
    tmp = f"{OUT}/spec-{label}.json"
    code = subprocess.run(["curl", "-s", "-o", tmp, "-w", "%{http_code}",
                           "-H", f"Cookie: {dr.cookie_header()}",
                           "-H", "Accept: application/json", url],
                          capture_output=True, text=True).stdout.strip()
    if code != "200":
        raise SystemExit(f"spec re-read HTTP {code} -- STOPPING (Rule 31: never work "
                         f"off a possibly-stale copy)")
    d = json.load(open(tmp))
    xml = d["body"]["storage"]["value"]
    sha = hashlib.sha256(xml.encode()).hexdigest()
    say(f"[{now()}] SOURCE RE-READ ({label}): page 713031682 HTTP 200, version "
        f"{d['version']['number']}, when {d['version']['when']}, {len(xml)} chars, "
        f"sha256 {sha}")
    if d["version"]["number"] != 27 or sha != EXPECT_SHA:
        raise SystemExit("SPEC MOVED -- STOPPING; re-derivation required (Rule 59).")
    say("  verdict: UNCHANGED -- v27, body sha256 identical to the mirror.")
    return d["version"]["number"], sha


# ------------------------------------------------------------------ payload I1
C29944_DROP = ("3. Choosing more than one status shows the work orders of all the "
               "chosen statuses together.\n")
C29944_OLD4 = ("4. The card left-border colours of the remaining cards are consistent "
               "with that status.")
C29944_NEW3 = ("3. The card left-border colours of the remaining cards are consistent "
               "with that status.")

# ------------------------------------------------------------------ payload I2
C38866_OLD_S1 = ("This is the expected behaviour as per epic SV-8685, read on 11 August "
                 "2026, and the Schedule specification version 27 (§11), read on "
                 "11 August 2026.")
C38866_NEW_S1 = ("This is the expected behaviour as per story SV-8700 (dark theme), read "
                 "on 11 August 2026, story SV-8698 (overtime and conflict cues are not "
                 "colour-only), read on 11 August 2026, and the Schedule specification "
                 "version 27 (§11), read on 11 August 2026.")
C38866_S2 = "Last checked against build v3.5-7ec992f on 8/6/2026."


def assert_once(text, literal, cid, what):
    n = text.count(literal)
    if n != 1:
        raise SystemExit(f"C{cid}: {what} appears {n} times -- STOP, do not guess")


def invariants(cid, exp):
    """Post-write census: exactly one provenance line, one marker, zero raw markup."""
    prov = len(re.findall(r"This is the expected behaviour as per", exp))
    mark = len(re.findall(r"^AUTOMATION: ", exp, re.M))
    markup = re.findall(r"</?(?:p|ol|ul|li|br|div|span|strong|em)\b[^>]*>", exp)
    crlf = "\r\n" in exp
    say(f"  C{cid} invariants: provenance lines={prov} marker lines={mark} "
        f"raw-markup hits={len(markup)} CRLF={crlf}")
    if prov != 1 or mark != 1 or markup or crlf:
        raise SystemExit(f"C{cid}: INVARIANT FAILURE -- STOP")


def main():
    say(f"[{now()}] === FOLLOW-UP EXECUTOR START ===")
    source_recheck("write-start")

    pre_all = {c["id"]: c for c in json.load(open(f"{OUT}/PRE-schedule-cases.json"))}
    say(f"[{now()}] pre-write suite snapshot on disk: {len(pre_all)} live Schedule cases")

    targets = [29944, 38866]
    atm = {}
    for cid in targets:
        st, body = tr.get_case(cid)
        if st != 200:
            raise SystemExit(f"pre-snapshot C{cid} HTTP {st}")
        json.dump(body, open(f"{OUT}/PRE-C{cid}.json", "w"), indent=1, sort_keys=True)
        atm[cid] = body.get("custom_atmstatus")
        if body != pre_all[cid]:
            diff = sorted(k for k in set(body) | set(pre_all[cid])
                          if body.get(k) != pre_all[cid].get(k))
            say(f"  !! C{cid} MOVED since the suite snapshot, fields {diff} -- using the "
                f"fresh read as the pre-write baseline")
    say(f"[{now()}] custom_atmstatus AT WRITE TIME (Rule 65): "
        + ", ".join(f"C{c}={atm[c]}" for c in targets))
    json.dump(atm, open(f"{OUT}/atmstatus-at-write-time.json", "w"), indent=1)

    ops = []

    # ================================================== ITEM 1
    say(f"\n[{now()}] --- ITEM 1: C29944, remove the unsourced multi-status assertion ---")
    before = json.load(open(f"{OUT}/PRE-C29944.json"))
    exp = before["custom_expected"]
    assert_once(exp, C29944_DROP, 29944, "the assertion to remove")
    assert_once(exp, C29944_OLD4, 29944, "the item to renumber")
    if "2. Choose one status under Status." not in before["custom_steps"]:
        raise SystemExit("C29944: steps no longer say 'Choose one status' -- STOP, the "
                         "premise of the repair has changed")
    new_exp = exp.replace(C29944_DROP, "").replace(C29944_OLD4, C29944_NEW3)
    # nothing else may move: prove the delta is exactly the removal + the renumber
    if len(exp) - len(new_exp) != len(C29944_DROP):
        raise SystemExit("C29944: delta is not exactly the removed line -- STOP")
    payload = {"custom_preconds": before["custom_preconds"],
               "custom_steps": before["custom_steps"],
               "custom_expected": new_exp}
    st, line, b, a = tr.update_case_verified(29944, payload, "I1 update_case")
    say(f"  C29944: item 3 REMOVED, item 4 -> 3 | HTTP {st} | {line}")
    invariants(29944, a["custom_expected"])
    ops.append({"op": "update_case", "cid": 29944, "http": st, "verify": line,
                "atmstatus_at_write": atm[29944],
                "fields_written": sorted(payload)})

    # ================================================== ITEM 2
    say(f"\n[{now()}] --- ITEM 2: C38866, provenance -> the owning stories ---")
    before = json.load(open(f"{OUT}/PRE-C38866.json"))
    exp = before["custom_expected"]
    assert_once(exp, C38866_OLD_S1, 38866, "the provenance sentence 1 to replace")
    assert_once(exp, C38866_S2, 38866, "provenance sentence 2 (must survive verbatim)")
    new_exp = exp.replace(C38866_OLD_S1, C38866_NEW_S1)
    if C38866_S2 not in new_exp:
        raise SystemExit("C38866: sentence 2 lost -- STOP")
    if C38866_OLD_S1 in new_exp or "epic SV-8685" in new_exp:
        raise SystemExit("C38866: old epic-level sentence survived -- STOP")
    # assertions must be byte-identical: compare everything before the '---' separator
    if exp.split("\n---\n")[0] != new_exp.split("\n---\n")[0]:
        raise SystemExit("C38866: an assertion changed -- STOP")
    payload = {"custom_preconds": before["custom_preconds"],
               "custom_steps": before["custom_steps"],
               "custom_expected": new_exp}
    st, line, b, a = tr.update_case_verified(38866, payload, "I2 update_case")
    say(f"  C38866: provenance re-pointed to SV-8700 + SV-8698 | HTTP {st} | {line}")
    invariants(38866, a["custom_expected"])
    ops.append({"op": "update_case", "cid": 38866, "http": st, "verify": line,
                "atmstatus_at_write": atm[38866],
                "fields_written": sorted(payload)})

    source_recheck("write-end")
    json.dump(ops, open(f"{OUT}/ops.json", "w"), indent=1)
    open(f"{OUT}/exec-log.txt", "w").write("\n".join(LOG) + "\n")
    say(f"\n[{now()}] === EXECUTOR DONE: {len(ops)} ops, all HTTP 200, 0 mismatches ===")


if __name__ == "__main__":
    main()
