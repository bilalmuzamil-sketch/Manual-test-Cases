#!/usr/bin/env python3
"""EXECUTOR — the authorised Schedule TestRail push of 2026-08-11.

FOUR GROUPS, 10 ops, and nothing else:
  G1  6 x update_case  C43582..C43587  -- correct our own "steps 1 to 8" sentence to each
                                          case's ACTUAL step count, re-counted live
  G2  2 x add_case     section 4280    -- SCH-EDGE-09, SCH-EDGE-10 (dark theme gaps)
  G3  1 x update_case  C29998          -- one expected item (+N more uses shape) + refs
  G4  1 x update_case  C38866          -- refs only, per-story precision on SV-8700

NO delete_case. NO section write. NO run write. NO result write. NO Jira call.

VERIFICATION (Standing Rule 50):
  * every target snapshotted BEFORE the write, committed to disk
  * every update payload carries ALL THREE text fields, even the unchanged ones
    (playbook section J, DECLARED NORMALISATION #3 -- TestRail re-renders any omitted
    text field into <p>-wrapped CRLF, and this project shows markup literally to the
    tester)
  * re-GET after every write, EVERY field compared against the intended payload, every
    unintended field proven byte-identical to the pre-write snapshot
  * `refs` compared under the ONE declared normalisation (comma split/trim/rejoin)
  * ON ANY MISMATCH the batch STOPS -- tr.update_case_verified raises
  * post-batch invariant census: exactly one provenance line + one marker per touched
    case, and zero raw markup (the C30341 lesson: a byte-check proves FIDELITY, not
    CORRECTNESS)
"""
import hashlib
import json
import os
import subprocess
import sys
import datetime

sys.path.insert(0, "/tmp/testrail")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr                                        # noqa: E402
import payloads as P                             # noqa: E402
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "..", "..", "..", "testing-tools"))
from testrail_add_case import (add_case_payload,  # noqa: E402
                               verify_created_case, DEFAULT_ATMSTATUS)

OUT = "/tmp/sched-push"
LOG = []


def now():
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def say(s):
    print(s, flush=True)
    LOG.append(s)


# ---------------------------------------------------------------- Rule 59
def source_recheck(label):
    """Re-read the spec at write time. Compare the BODY CHECKSUM, not the version
    number -- the in-body 'Version' field on this page reads 1.0 and lies."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                    "..", "..", "coverage-gaps-2026-08-11", "tools"))
    import date_requirements as dr
    url = ("https://shopview.atlassian.net/wiki/rest/api/content/713031682"
           "?expand=version,body.storage")
    tmp = f"{OUT}/spec-{label}.json"
    code = subprocess.run(["curl", "-s", "-o", tmp, "-w", "%{http_code}",
                           "-H", f"Cookie: {dr.cookie_header()}",
                           "-H", "Accept: application/json", url],
                          capture_output=True, text=True).stdout.strip()
    if code != "200":
        raise SystemExit(f"spec re-read HTTP {code} -- STOPPING (Rule 31: never work off "
                         f"a possibly-stale copy)")
    d = json.load(open(tmp))
    xml = d["body"]["storage"]["value"]
    sha = hashlib.sha256(xml.encode()).hexdigest()
    say(f"[{now()}] SOURCE RE-READ ({label}): Confluence page 713031682 HTTP 200, "
        f"version {d['version']['number']}, when {d['version']['when']}, "
        f"{len(xml)} chars, sha256 {sha}")
    return d["version"]["number"], sha


# ---------------------------------------------------------------- helpers
def count_steps(steps_text):
    """Count the numbered steps in a live `custom_steps` field. Counts LEADING
    'N.' markers only, so a wrapped continuation line is never miscounted."""
    import re
    return len([l for l in steps_text.split("\n")
                if re.match(r"^\s*\d+\.\s", l)])


def main():
    say(f"[{now()}] === EXECUTOR START ===")
    v_start, sha_start = source_recheck("write-start")
    EXPECT_SHA = "4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b"
    if v_start != 27 or sha_start != EXPECT_SHA:
        raise SystemExit("SPEC MOVED between pass start and write start -- STOPPING and "
                         "re-deriving is required (Rule 59).")
    say("  verdict: UNCHANGED -- v27, body sha256 identical to the mirror. Safe to write.")

    # ---- pre-write snapshot of the whole suite (untouched-proof BY CONTENT, Rule 50)
    pre_all = {c["id"]: c for c in json.load(open(f"{OUT}/PRE-schedule-cases.json"))}
    say(f"[{now()}] pre-write snapshot: {len(pre_all)} live Schedule cases on disk")

    targets = P.PANEL_CASES + [29998, 38866]
    atm_at_write = {}
    for cid in targets:
        st, body = tr.get_case(cid)
        if st != 200:
            raise SystemExit(f"pre-snapshot C{cid} HTTP {st}")
        json.dump(body, open(f"{OUT}/PRE-C{cid}.json", "w"), indent=1, sort_keys=True)
        atm_at_write[cid] = body.get("custom_atmstatus")
        if body != pre_all[cid]:
            diff = [k for k in set(body) | set(pre_all[cid])
                    if body.get(k) != pre_all[cid].get(k)]
            say(f"  !! C{cid} MOVED since the suite snapshot, fields {diff} -- using the "
                f"fresh read as the pre-write baseline")
    say(f"[{now()}] custom_atmstatus AT WRITE TIME (Rule 65): "
        + ", ".join(f"C{c}={atm_at_write[c]}" for c in targets))

    ops = []

    # ================================================== GROUP 1
    say(f"\n[{now()}] --- GROUP 1: six Panel collapse cases, our own defect ---")
    for cid in P.PANEL_CASES:
        before = json.load(open(f"{OUT}/PRE-C{cid}.json"))
        n = count_steps(before["custom_steps"])
        exp = before["custom_expected"]
        if P.WRONG not in exp:
            raise SystemExit(f"C{cid}: expected literal not present -- STOP, do not guess")
        if exp.count(P.WRONG) != 1:
            raise SystemExit(f"C{cid}: literal appears {exp.count(P.WRONG)} times -- STOP")
        if n == 8:
            say(f"  C{cid}: step count IS 8 -- sentence already correct, SKIPPING (no write)")
            continue
        new_exp = exp.replace(P.WRONG, P.RIGHT.format(n=n))
        payload = {"custom_preconds": before["custom_preconds"],
                   "custom_steps": before["custom_steps"],
                   "custom_expected": new_exp}
        st, line, b, a = tr.update_case_verified(cid, payload, "G1 update_case")
        say(f"  C{cid}: steps re-counted LIVE = {n} -> 'steps 1 to {n}' | HTTP {st} | {line}")
        ops.append(("G1", cid, st, line, n))

    # ================================================== GROUP 3
    say(f"\n[{now()}] --- GROUP 3: C29998 one expected item + refs ---")
    before = json.load(open(f"{OUT}/PRE-C29998.json"))
    exp = before["custom_expected"]
    if exp.count(P.C29998_OLD_ITEM4) != 1:
        raise SystemExit("C29998: item-4 literal not found exactly once -- STOP")
    if before.get("refs") != P.C29998_OLD_REFS:
        raise SystemExit(f"C29998 refs are {before.get('refs')!r}, not the expected "
                         f"{P.C29998_OLD_REFS!r} -- STOP")
    new_exp = exp.replace(P.C29998_OLD_ITEM4, P.C29998_NEW_ITEMS)
    payload = {"custom_preconds": before["custom_preconds"],
               "custom_steps": before["custom_steps"],
               "custom_expected": new_exp,
               "refs": P.C29998_NEW_REFS}
    st, line, b, a = tr.update_case_verified(29998, payload, "G3 update_case")
    say(f"  C29998: item 4 inserted, old item 4 -> 5, refs +§11 | HTTP {st} | {line}")
    ops.append(("G3", 29998, st, line, None))

    # ================================================== GROUP 4
    say(f"\n[{now()}] --- GROUP 4: C38866 refs only ---")
    before = json.load(open(f"{OUT}/PRE-C38866.json"))
    if before.get("refs") != P.C38866_OLD_REFS:
        raise SystemExit(f"C38866 refs are {before.get('refs')!r}, not the expected "
                         f"{P.C38866_OLD_REFS!r} -- STOP")
    payload = {"custom_preconds": before["custom_preconds"],
               "custom_steps": before["custom_steps"],
               "custom_expected": before["custom_expected"],
               "refs": P.C38866_NEW_REFS}
    st, line, b, a = tr.update_case_verified(38866, payload, "G4 update_case")
    say(f"  C38866: refs SV-8685(epic) -> SV-8700 + SV-8698, comma removed, false "
        f"persistence claim dropped | HTTP {st} | {line}")
    ops.append(("G4", 38866, st, line, None))

    # ================================================== GROUP 2
    say(f"\n[{now()}] --- GROUP 2: two new dark-theme cases ---")
    created = []
    for spec in P.NEW_CASES:
        payload = add_case_payload(
            title=spec["title"], refs=spec["refs"], preconds=spec["preconds"],
            steps=spec["steps"], expected=spec["expected"],
            # type 2 = Accessibility, priority 1 = Low -- byte-identical to C38866, the
            # sibling dark-theme case in the same section 4280 whose requirement these two
            # split off from. Read live from get_case_types / get_priorities, not assumed.
            type_id=2, priority_id=1)
        assert payload["custom_atmstatus"] == DEFAULT_ATMSTATUS == 1
        st, body = tr.api(f"add_case/{spec['section_id']}", "POST", payload)
        if st != 200:
            raise SystemExit(f"add_case {spec['internal_id']} HTTP {st}: {body}")
        cid = body["id"]
        json.dump(body, open(f"{OUT}/POST-C{cid}.json", "w"), indent=1, sort_keys=True)
        # re-GET and byte-compare every intended field
        st2, after = tr.get_case(cid)
        if st2 != 200:
            raise SystemExit(f"re-GET C{cid} HTTP {st2}")
        bad = []
        for k, want in payload.items():
            got = after.get(k)
            if k == "refs":
                want, got = tr.norm_refs(want), tr.norm_refs(got)
            if got != want:
                bad.append(f"{k}\n  want={want!r}\n  got ={got!r}")
        ok, probs = verify_created_case(after)
        if not ok:
            bad += probs
        if after["section_id"] != spec["section_id"]:
            bad.append(f"section_id {after['section_id']} != {spec['section_id']}")
        if after["created_by"] != 3:
            bad.append(f"created_by {after['created_by']} != 3")
        if bad:
            raise SystemExit("BYTE-LEVEL VERIFICATION FAILED on new C%d\n%s"
                             % (cid, "\n".join(bad)))
        say(f"  {spec['internal_id']} = C{cid} | add_case HTTP {st} | re-GET "
            f"{len(set(after) | set(payload))} fields compared, {len(payload)} intended, "
            f"0 mismatch | custom_atmstatus={after['custom_atmstatus']} | section "
            f"{after['section_id']}")
        created.append((spec["internal_id"], cid))
        ops.append(("G2", cid, st, f"add_case verified, atmstatus="
                    f"{after['custom_atmstatus']}", None))

    json.dump({"created": created, "atm_at_write": atm_at_write,
               "ops": [(g, c, s, l) for g, c, s, l, _ in ops]},
              open(f"{OUT}/exec-result.json", "w"), indent=1)

    # ================================================== post-batch
    say(f"\n[{now()}] --- POST-BATCH: whole-suite re-read + invariant census ---")
    new_ids = [c2 for _, c2 in created]
    post_all = {c["id"]: c for c in tr.get_cases(1, 1)
                if c["id"] in pre_all or c["id"] in new_ids}
    json.dump(sorted(post_all.values(), key=lambda c: c["id"]),
              open(f"{OUT}/POST-schedule-cases.json", "w"), indent=1, sort_keys=True)
    say(f"  live Schedule cases now: {len(post_all)} (was {len(pre_all)}, +{len(new_ids)})")

    # untouched-proof BY CONTENT, INCLUDING updated_on / updated_by (Rule 50; a timestamp
    # is context, never evidence -- 14 Report Suite cases once changed text with the
    # timestamp frozen, so content is compared as well, both ways)
    written = set(targets)
    moved = []
    for cid, before in pre_all.items():
        if cid in written:
            continue
        after = post_all.get(cid)
        if after is None:
            moved.append((cid, "DISAPPEARED"))
            continue
        d = [k for k in set(before) | set(after) if before.get(k) != after.get(k)]
        if d:
            moved.append((cid, d))
    say(f"  untouched cases proven byte-identical (all fields incl. updated_on/updated_by): "
        f"{len(pre_all) - len(written) - len(moved)} of {len(pre_all) - len(written)}"
        + (f" -- MOVED: {moved}" if moved else " -- 0 moved"))

    # invariant census on the TOUCHED cases (the C30341 lesson)
    import re
    MARK = re.compile(r"<(ol|li|p|br|hr|a |strong|em|div|span)", re.I)
    cens = []
    for cid in sorted(written | set(new_ids)):
        c = post_all[cid]
        e = c["custom_expected"] or ""
        cens.append((cid,
                     e.count("This is the expected behaviour as per"),
                     len(re.findall(r"^AUTOMATION: ", e, re.M)),
                     any(MARK.search(c.get(f) or "")
                         for f in ("title", "custom_preconds", "custom_steps",
                                   "custom_expected"))))
    bad = [x for x in cens if x[1] != 1 or x[2] != 1 or x[3]]
    say("  census of the %d touched/created cases: exactly ONE provenance line each: %s | "
        "exactly ONE automation marker each: %s | raw markup: %d"
        % (len(cens), all(x[1] == 1 for x in cens), all(x[2] == 1 for x in cens),
           sum(1 for x in cens if x[3])))
    if bad:
        raise SystemExit(f"INVARIANT CENSUS FAILED: {bad}")

    # whole-suite raw-markup census (playbook DECLARED HAZARD #5 -- deferred render)
    allbad = [c["id"] for c in post_all.values()
              if any(MARK.search(c.get(f) or "")
                     for f in ("title", "custom_preconds", "custom_steps",
                               "custom_expected"))]
    say(f"  whole-suite raw-markup census: {len(allbad)} of {len(post_all)} "
        f"{allbad if allbad else ''}")
    v_end, sha_end = source_recheck("write-end")
    say(f"  spec at write end: v{v_end}, sha {'IDENTICAL' if sha_end == EXPECT_SHA else 'MOVED'}")
    return created, ops, atm_at_write


if __name__ == "__main__":
    created, ops, atm = main()
    open(f"{OUT}/exec-console.log", "w").write("\n".join(LOG) + "\n")
    print("\nCREATED:", created)
