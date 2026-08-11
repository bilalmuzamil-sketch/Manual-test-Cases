#!/usr/bin/env python3
"""Rule-50 writer for the refs version-pin pass.

EVERY payload carries all three text fields (custom_preconds, custom_steps,
custom_expected) alongside refs, taken byte-exact from a FRESH read of the case
taken moments before the write -- because TestRail re-renders any text field
omitted from the payload into <p>-wrapped HTML with CRLF, and this project shows
markup literally to the tester (playbook  J, declared normalisation #3).

WHAT THIS PASS MAY CHANGE:
  * refs -- the version pin, and a comma that TestRail would split into a
    phantom second reference.
  * custom_expected on EXACTLY ONE case, C30288, which is missing its automation
    marker and whose provenance names its specification without a version.

WHAT IT MUST NOT CHANGE, and asserts it did not:
  * Rule 54 sentence 2 -- the "Last checked against build ... on ..." line.
    No build was observed in this pass; the QA-branch session is expired
    estate-wide, so re-dating it would assert a build fact nobody checked
    (Rule 12). The writer REFUSES the write if that line moves.
  * every expectation, every step, every precondition, every title.

HTTP 500 HAZARD (seen on this estate today): a write can return 500 having
ALREADY LANDED. This writer NEVER retries blindly -- on a non-200 it re-READS
the case and reports what it finds, then stops the batch (Rule 50).
"""
import datetime
import json
import os
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
LOGDIR = os.path.join(HERE, "..", "logs")
LIMIT = 248
BUILD_LINE = re.compile(r"Last checked against build [^\n]*")

# The one case whose Expected Results this pass may touch, and exactly how.
C30288_PROV_FROM = ("and the Sales By Representative report specification "
                    "(S22-R2, S22-R4, S14-R19), read on 11 August 2026.")
C30288_PROV_TO = ("and the Sales By Representative report specification version 18 "
                  "(S22-R2, S22-R4, S14-R19), read on 11 August 2026.")
C30288_MARKER = "\n\nAUTOMATION: READY"


def rule41(before, after, live_anchors):
    """Whole-case re-read (Rule 41): every field, not only the one being edited."""
    checked = ["title", "custom_preconds", "custom_steps", "custom_expected",
               "refs", "section_id", "type_id"]
    cited = set(re.findall(r"\b(S\d+-[RNE]\d+[a-z]?)\b", after.get("refs") or ""))
    orphan = sorted(cited - live_anchors) if live_anchors else []
    raw = [f for f in ("custom_preconds", "custom_steps", "custom_expected")
           if re.search(r"<(ol|li|p|br|hr|a |strong|em)\b", after.get(f) or "", re.I)]
    return {
        "fields_checked": checked,
        "title_len": len(after.get("title") or ""),
        "title_over_80": len(after.get("title") or "") > 80,
        "anchors_cited": sorted(cited),
        "anchors_absent_from_live_spec": orphan,
        "raw_markup_fields": raw,
        "crlf": any("\r\n" in (after.get(f) or "") for f in
                    ("custom_preconds", "custom_steps", "custom_expected")),
        "marker": (mk.group(0) if (mk := re.search(
            r"AUTOMATION: [^\n]*", after.get("custom_expected") or "")) else None),
        "verdict": "re-verified whole against the live specification set read 2026-08-11",
    }


def run(plan, live_anchors, start=0, stop=None, tag="batch"):
    log = []
    todo = plan[start:stop]
    for i, rec in enumerate(todo, 1):
        cid = rec["cid"]
        st0, cur = tr.get_case(cid)
        if st0 != 200:
            raise RuntimeError(f"pre-read C{cid} HTTP {st0}: {cur}")

        # refs must match what we planned against; if another writer moved it, stop.
        if (cur.get("refs") or "") != rec["old"]:
            raise RuntimeError(
                f"C{cid}: refs changed since the plan was built -- STOPPING\n"
                f"  planned-from={rec['old']!r}\n  live        ={cur.get('refs')!r}")

        expected = cur.get("custom_expected") or ""
        if cid == 30288:
            if C30288_PROV_FROM not in expected:
                raise RuntimeError(f"C{cid}: provenance text not found as expected")
            if "AUTOMATION:" in expected:
                raise RuntimeError(f"C{cid}: already has a marker -- not re-adding")
            expected = expected.replace(C30288_PROV_FROM, C30288_PROV_TO) + C30288_MARKER

        newrefs = rec["new"]
        if "," in newrefs or len(newrefs) > LIMIT:
            raise RuntimeError(f"C{cid}: refs fails the guard ({len(newrefs)} chars, "
                               f"{newrefs.count(',')} commas)")

        payload = {
            "custom_preconds": cur.get("custom_preconds") or "",
            "custom_steps": cur.get("custom_steps") or "",
            "custom_expected": expected,
            "refs": newrefs,
        }

        try:
            st, line, before, after = tr.update_case_verified(cid, payload, f"refs-pin C{cid}")
        except RuntimeError as e:
            # NEVER retry blindly: read the case and report what actually landed.
            st2, now = tr.get_case(cid)
            raise RuntimeError(
                f"C{cid}: WRITE FAILED OR UNVERIFIED -- batch STOPPED\n{e}\n"
                f"  re-read HTTP {st2}; refs now = {(now or {}).get('refs')!r}\n"
                f"  (did NOT retry -- a 500 on this estate can mean the write LANDED)")

        b2 = BUILD_LINE.search(before.get("custom_expected") or "")
        a2 = BUILD_LINE.search(after.get("custom_expected") or "")
        if (b2.group(0) if b2 else None) != (a2.group(0) if a2 else None):
            raise RuntimeError(f"C{cid}: Rule-54 sentence 2 CHANGED -- STOPPING")

        rec_out = {
            "cid": cid, "http": st, "verification": line,
            "refs_chars": len(after.get("refs") or ""),
            "refs_bytes": len((after.get("refs") or "").encode()),
            "refs_entries": len((after.get("refs") or "").split(",")),
            "atmstatus_at_write": after.get("custom_atmstatus"),
            "build_line_preserved": (a2.group(0) if a2 else None),
            "moves": rec["moves"], "comma_repaired": rec["comma_repaired"],
            "condensed": rec["condensed"],
            "expected_touched": cid == 30288,
            "rule41": rule41(before, after, live_anchors.get(
                rec["moves"][0]["report"] if rec["moves"] else None, set())),
            "when": datetime.datetime.utcnow().isoformat() + "Z",
        }
        log.append(rec_out)
        if i % 25 == 0 or i == len(todo):
            print(f"  [{tag}] {i}/{len(todo)} done (last C{cid}, {rec_out['refs_chars']} chars, "
                  f"atm={rec_out['atmstatus_at_write']})")

    out = os.path.join(LOGDIR, f"write-{tag}.json")
    json.dump(log, open(out, "w"), indent=1)
    print(f"[{tag}] wrote {len(log)} ops -> {out}")
    return log


if __name__ == "__main__":
    plan = json.load(open(os.path.join(LOGDIR, "plan-final.json")))
    SLUG = {"SBC": "Sales-By-Customer", "SBR": "Sales-By-Representative",
            "PV": "Parts-Velocity", "TU": "Technician-Utilization",
            "WIP": "Work-In-Progress", "IV": "Inventory-Value"}
    LIVEV = {"SBC": 17, "SBR": 18, "PV": 6, "TU": 7, "WIP": 11, "IV": 5}
    ev = os.path.join(HERE, "..", "evidence")
    anchors = {}
    for k, s in SLUG.items():
        body = open(os.path.join(ev, f"{s}-v{LIVEV[k]}.xml")).read()
        anchors[k] = set(re.findall(r"\b(S\d+-[RNE]\d+[a-z]?)\b", body))
    a = int(sys.argv[1]); b = int(sys.argv[2]); tag = sys.argv[3]
    run(plan, anchors, a, b, tag)
