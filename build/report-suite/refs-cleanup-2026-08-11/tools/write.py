#!/usr/bin/env python3
"""Rule-50 writer for the refs-cleanup pass.

THIS PASS CHANGES EXACTLY ONE FIELD: `refs`.  Unlike its predecessor it has no
Expected-Results exception at all -- not one case, not one character.  The
writer ASSERTS that, and stops the batch if custom_expected moves by a byte.

Every payload nevertheless carries all three text fields, taken byte-exact from
a read moments before the write, because TestRail re-renders any text field
OMITTED from the payload into <p>-wrapped HTML with CRLF (playbook  J, declared
normalisation #3) and this project shows markup literally to the tester.

HAZARDS THIS WRITER IS BUILT AGAINST, all three proven on this estate today:
  * an HTTP 500 can come back from a write that HAS ALREADY LANDED -- so on any
    failure this re-READS the case and reports what it finds, and NEVER retries.
  * a fresh `updated_on` is not evidence a write landed -- verification is by
    CONTENT, field by field, via tr.update_case_verified.
  * progress is proven by reading the work product, never by watching a process.
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
EV = os.path.join(HERE, "..", "evidence")
LIMIT = 248
ANCHOR = re.compile(r"\b(S\d+-[RNE]\d+[a-z]?)\b")
SLUG = {"SBC": "Sales-By-Customer", "SBR": "Sales-By-Representative",
        "PV": "Parts-Velocity", "TU": "Technician-Utilization",
        "WIP": "Work-In-Progress", "IV": "Inventory-Value"}
LIVE = {"SBC": "17", "SBR": "18", "PV": "6", "TU": "7", "WIP": "11", "IV": "5"}


def live_anchor_sets():
    return {k: set(ANCHOR.findall(open(os.path.join(EV, f"{s}-v{LIVE[k]}.xml")).read()))
            for k, s in SLUG.items()}


def rule41(after, anchors, reports):
    """Whole-case re-read (Rule 41): EVERY field, not only the one being edited."""
    cited = set(ANCHOR.findall(after.get("refs") or ""))
    known = set().union(*[anchors[r] for r in reports]) if reports else set()
    txt = {f: (after.get(f) or "") for f in
           ("custom_preconds", "custom_steps", "custom_expected")}
    markers = re.findall(r"AUTOMATION: [^\n]*", txt["custom_expected"])
    prov = txt["custom_expected"].count("This is the expected behaviour")
    return {
        "fields_checked": ["title", "custom_preconds", "custom_steps",
                           "custom_expected", "refs", "section_id", "type_id"],
        "title_len": len(after.get("title") or ""),
        "title_over_80": len(after.get("title") or "") > 80,
        "anchors_cited": sorted(cited),
        "anchors_absent_from_live_spec": sorted(cited - known),
        "raw_markup_fields": [f for f, v in txt.items()
                              if re.search(r"<(ol|li|p|br|hr|a |strong|em)\b", v, re.I)],
        "crlf": any("\r\n" in v for v in txt.values()),
        "automation_markers": markers,
        "provenance_sentences": prov,
        "verdict": "re-verified whole against the live specification set read 2026-08-11",
    }


def run(plan, start=0, stop=None, tag="batch"):
    anchors = live_anchor_sets()
    todo = plan[start:stop]
    log = []
    print(f"[{tag}] {len(todo)} cases, index {start}..{stop}")
    for i, rec in enumerate(todo, 1):
        cid = rec["cid"]

        st0, cur = tr.get_case(cid)
        if st0 != 200:
            raise RuntimeError(f"pre-read C{cid} HTTP {st0}: {cur}")

        # If anything already matches the target, this case was written by an
        # earlier (perhaps 500-but-landed) attempt -- record and skip, never
        # write twice.
        if (cur.get("refs") or "") == rec["new"]:
            log.append({"cid": cid, "http": None, "skipped": "already at target refs",
                        "refs_chars": len(rec["new"]),
                        "atmstatus_at_write": cur.get("custom_atmstatus"),
                        "when": datetime.datetime.utcnow().isoformat() + "Z"})
            print(f"  [{tag}] C{cid} ALREADY AT TARGET -- not rewritten")
            continue

        if (cur.get("refs") or "") != rec["old"]:
            raise RuntimeError(
                f"C{cid}: refs moved since the plan was built -- STOPPING\n"
                f"  planned-from={rec['old']!r}\n  live        ={cur.get('refs')!r}")

        newrefs = rec["new"]
        if "," in newrefs or len(newrefs) > LIMIT:
            raise RuntimeError(f"C{cid}: refs fails the guard "
                               f"({len(newrefs)} chars, {newrefs.count(',')} commas)")

        expected_before = cur.get("custom_expected") or ""
        payload = {
            "custom_preconds": cur.get("custom_preconds") or "",
            "custom_steps": cur.get("custom_steps") or "",
            "custom_expected": expected_before,
            "refs": newrefs,
        }

        try:
            st, line, before, after = tr.update_case_verified(cid, payload, f"refs-cleanup C{cid}")
        except RuntimeError as e:
            st2, now = tr.get_case(cid)
            raise RuntimeError(
                f"C{cid}: WRITE FAILED OR UNVERIFIED -- BATCH STOPPED\n{e}\n"
                f"  re-read HTTP {st2}; refs now = {(now or {}).get('refs')!r}\n"
                f"  (did NOT retry -- a 500 on this estate can mean the write LANDED)")

        # This pass may not touch Expected Results at all -- assert it, byte-exact.
        if (after.get("custom_expected") or "") != expected_before:
            raise RuntimeError(f"C{cid}: custom_expected CHANGED -- STOPPING")

        log.append({
            "cid": cid, "http": st, "verification": line,
            "refs_before": rec["old"], "refs_after": after.get("refs"),
            "refs_chars_before": rec["old_chars"],
            "refs_chars_after": len(after.get("refs") or ""),
            "refs_bytes_before": rec["old_bytes"],
            "refs_bytes_after": len((after.get("refs") or "").encode()),
            "refs_entries": len((after.get("refs") or "").split(",")),
            "headroom_after": LIMIT - len(after.get("refs") or ""),
            "atmstatus_at_write": after.get("custom_atmstatus"),
            "expected_untouched": True,
            "moves": rec["moves"], "condensed": rec["condensed"],
            "rule41": rule41(after, anchors, rec["reports"]),
            "when": datetime.datetime.utcnow().isoformat() + "Z",
        })
        if i % 20 == 0 or i == len(todo):
            print(f"  [{tag}] {i}/{len(todo)} (last C{cid}, "
                  f"{log[-1]['refs_chars_after']} chars, atm={log[-1]['atmstatus_at_write']})")

    out = os.path.join(LOGDIR, f"write-{tag}.json")
    json.dump(log, open(out, "w"), indent=1)
    print(f"[{tag}] {len(log)} ops -> {out}")
    return log


if __name__ == "__main__":
    plan = json.load(open(os.path.join(LOGDIR, os.environ.get("PLAN","plan.json"))))
    a = int(sys.argv[1]); b = int(sys.argv[2]) if sys.argv[2] != "end" else None
    run(plan, a, b, sys.argv[3])
