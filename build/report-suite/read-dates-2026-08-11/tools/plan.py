#!/usr/bin/env python3
"""Build the write plan and DRY-RUN it. Read-only: no TestRail write happens here.

Also runs the pre-send shape gates on every proposed body, because a payload that
fails a gate must never reach the wire (Rule 50 — the batch stops, it does not
"retry blindly").
"""
import collections
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import stamp as S  # noqa: E402

SNAP = os.path.join(HERE, "..", "snapshots")
OUT = "/tmp/rs_readdate_plan.json"
START = "This is the expected behaviour"

MARKUP = re.compile(r"</?(?:p|ol|ul|li|br|div|span|strong|em|b|i|table|tr|td)\b[^>]*>",
                    re.I)
BARRED = ["as per the build tested on", "expected behaviour as per the build",
          "VIU"]


def shape(text):
    """The structural facts a write must not disturb."""
    marks = re.findall(r"^AUTOMATION: .*$", text, re.M)
    tail = ""
    if marks:
        i = text.rindex(marks[-1]) + len(marks[-1])
        tail = text[i:].strip()
    return {"provenance_openings": text.count(START),
            "markers": len(marks),
            "marker_text": marks[-1] if marks else None,
            "text_after_marker": tail,
            "blank_line_before_marker":
                bool(marks) and text[:text.rindex(marks[-1])].endswith("\n\n"),
            "separator": "\n---\n" in text,
            "markup": bool(MARKUP.search(text))}


def gates(cid, pre, new_exp):
    """Gates come in two kinds, and keeping them apart is the point.

    ABSOLUTE — conditions that must hold on anything we send, full stop.

    NON-REGRESSION — structural facts compared BEFORE vs AFTER. A fault that
    already existed in the stored case is NOT a reason to refuse the write: it
    was not caused by this pass, this pass is not chartered to fix it (inventing
    an automation marker would be an automation judgement, and under Rule 61 an
    EXPECT-FAIL marker now needs live backing), and refusing would silently drop
    the case from a sweep that is supposed to cover all 476. Such faults are
    RECORDED as findings and reported. What is forbidden is MAKING one worse.
    """
    f = []
    old, new = shape(pre["custom_expected"]), shape(new_exp)

    # --- ABSOLUTE
    if new["provenance_openings"] != 1:
        f.append(f"provenance opening appears {new['provenance_openings']} times")
    for b in BARRED:
        if b in new_exp:
            f.append(f"barred phrase {b!r}")
    # --- NON-REGRESSION
    for key in ("markers", "blank_line_before_marker", "separator", "markup",
                "marker_text", "text_after_marker"):
        if old[key] != new[key]:
            f.append(f"REGRESSION {key}: {old[key]!r} -> {new[key]!r}")
    # sentence 2 must be byte-identical to what it was
    _, t_old = S.split_sentence2(pre["custom_expected"][pre["custom_expected"].index(START):])
    _, t_new = S.split_sentence2(new_exp[new_exp.index(START):])
    if t_old != t_new:
        f.append("SENTENCE 2 CHANGED — forbidden")
    # the case's own tester-facing body (everything before the provenance) intact
    if new_exp[:new_exp.index(START)] != pre["custom_expected"][:pre["custom_expected"].index(START)]:
        f.append("body before the provenance line changed — forbidden")
    return f


if __name__ == "__main__":
    cases = json.load(open(f"{SNAP}/cases-PRE.json"))
    ours = {k: v for k, v in cases.items() if v.get("created_by") == 3}
    plan, noop, fails = {}, [], {}
    opcount = collections.Counter()

    for cid, c in sorted(ours.items(), key=lambda x: int(x[0])):
        exp = c["custom_expected"]
        i = exp.index(START)
        body, block = exp[:i], exp[i:]
        new_block, ops = S.stamp(block)
        for o in ops:
            opcount[o.split(":")[0]] += 1
        new_exp = body + new_block
        if new_exp == exp:
            noop.append(cid)
            continue
        f = gates(cid, c, new_exp)
        if f:
            fails[cid] = f
            continue
        plan[cid] = {"body": body, "new_block": new_block, "ops": ops,
                     "old_block": block}

    print(f"ours                 : {len(ours)}")
    print(f"planned writes       : {len(plan)}")
    print(f"no-op (already right): {len(noop)} {noop}")
    print(f"GATE FAILURES        : {len(fails)}")
    for k, v in fails.items():
        print(f"   C{k}: {v}")

    # Pre-existing defects, RECORDED not fixed and not used to block a write.
    pre_defects = collections.defaultdict(list)
    for cid, c in sorted(ours.items(), key=lambda x: int(x[0])):
        s = shape(c["custom_expected"])
        if s["markers"] == 0:
            pre_defects["no automation marker"].append(cid)
        if s["markers"] > 1:
            pre_defects["more than one automation marker"].append(cid)
        if not s["separator"]:
            pre_defects["no --- separator before the provenance line"].append(cid)
        if s["markup"]:
            pre_defects["raw markup in expected results"].append(cid)
        if s["provenance_openings"] != 1:
            pre_defects["provenance opening not exactly once"].append(cid)
        if not any(m in c["custom_expected"] for m in S.S2_MARKERS):
            pre_defects["no sentence 2 of any shape"].append(cid)
    print("\nPRE-EXISTING defects found in the stored cases (recorded, NOT fixed):")
    for k, v in sorted(pre_defects.items()):
        print(f"   {len(v):>4}  {k}: {['C'+x for x in v] if len(v) <= 12 else '(listed in FINDINGS)'}")
    json.dump({k: v for k, v in pre_defects.items()},
              open("/tmp/rs_pre_defects.json", "w"), indent=1)
    print("\nop census:", dict(opcount))

    detail = collections.Counter()
    for p in plan.values():
        for o in p["ops"]:
            detail[o] += 1
    print("\nop detail:")
    for k, v in sorted(detail.items()):
        print(f"   {v:>4}  {k}")

    json.dump(plan, open(OUT, "w"), indent=1)
    print(f"\nwrote {OUT}")
