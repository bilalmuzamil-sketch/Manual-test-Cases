#!/usr/bin/env python3
"""EXECUTOR — Filters TestRail push for the Branko Parts/Reports apply pass, 2026-07-31.

USER-AUTHORIZED 2026-07-31. Executes EXACTLY what
testrail-sync-manifest-2026-07-31.md authorizes:
  2 add_section + 8 add_case + 2 update_case (refs-only) + 1 move_cases_to_section.
The run-352 sync is a SEPARATE script (exec_run352.py) so the run write can be
verified independently.

0 delete_case. 0 result writes. Scope: project 1 / suite 1 / group 4110 only.

Every op: HTTP 200 asserted, then a re-GET verified field-by-field against the
local body. Pre-write snapshots of the 2 update targets are taken first.
Idempotent-ish: if a section/case already exists it is detected and reused rather
than duplicated, so a killed run can be resumed (Standing Rule 29).
"""
import json, os, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
FILTERS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(FILTERS, "fixes-2026-07-31"))
import tr  # noqa: E402

GROUP = 4110
SUITE = 1
PROJECT = 1
TYPE_FUNCTIONAL = 6
PRIO = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

SNAP = os.path.join(HERE, "pre-push-snapshot")
os.makedirs(SNAP, exist_ok=True)

ADDS = [
    ("Parts Page Filters", ["FLT-PARTS-01", "FLT-PARTS-09", "FLT-PARTS-11",
                            "FLT-PARTS-12", "FLT-PARTS-13"]),
    ("Reports Page Filters", ["FLT-RPTS-01", "FLT-RPTS-21", "FLT-RPTS-22"]),
]
UPDATES = [("FLT-RPTS-23", 38882), ("FLT-PERS-05", 38880)]
MOVE = 38882  # -> the new "Reports Page Filters" section

oplog = []


def local_cases():
    out = {}
    for f in sorted(glob.glob(os.path.join(FILTERS, "cases", "cases-*.json"))):
        for c in json.load(open(f)):
            out[c["id"]] = c
    return out


def body(c):
    return {
        "title": c["title"],
        "type_id": TYPE_FUNCTIONAL if c.get("type", "Functional") == "Functional" else TYPE_FUNCTIONAL,
        "priority_id": PRIO[c["priority"]],
        "refs": c["spec_ref"],
        "custom_preconds": "\n".join(c["preconditions"]),
        "custom_steps": "\n".join(c["steps"]),
        "custom_expected": "\n".join(c["expected"]),
        "custom_atmstatus": 3,
        "custom_automation_type": 0,
    }


def verify(cid, want, section_id=None):
    st, live = tr.get_case(cid)
    assert st == 200, (cid, st, live)
    bad = []
    for k, v in want.items():
        if live.get(k) != v:
            bad.append((k, repr(live.get(k))[:200], repr(v)[:200]))
    if section_id is not None and live.get("section_id") != section_id:
        bad.append(("section_id", live.get("section_id"), section_id))
    return ("MATCH" if not bad else "MISMATCH"), bad


def main():
    loc = local_cases()

    # ---------- 0. pre-write snapshots of the 2 update targets ----------
    for iid, cid in UPDATES:
        st, live = tr.get_case(cid)
        assert st == 200, (cid, st, live)
        json.dump(live, open(os.path.join(SNAP, f"C{cid}.json"), "w"), indent=1)
        print(f"snapshot C{cid} ({iid}) section={live['section_id']}")

    # ---------- 1. add_section x2 ----------
    secs = tr.paged(f"get_sections/{PROJECT}&suite_id={SUITE}", "sections")
    existing = {s["name"]: s["id"] for s in secs if s.get("parent_id") == GROUP}
    sec_ids = {}
    for name, _ in ADDS:
        if name in existing:
            sec_ids[name] = existing[name]
            print(f"add_section SKIP (already exists): {name} = {existing[name]}")
            oplog.append({"op": "add_section", "name": name, "section_id": existing[name],
                          "http": "skipped-already-exists", "verify": "MATCH"})
            continue
        st, d = tr.call(f"add_section/{PROJECT}",
                        {"suite_id": SUITE, "parent_id": GROUP, "name": name})
        assert st == 200, (name, st, d)
        sid = d["id"]
        sec_ids[name] = sid
        st2, chk = tr.call(f"get_section/{sid}")
        ok = st2 == 200 and chk["name"] == name and chk["parent_id"] == GROUP
        print(f"add_section {name} -> {sid} HTTP {st} verify {'MATCH' if ok else 'MISMATCH'}")
        oplog.append({"op": "add_section", "name": name, "section_id": sid,
                      "http": st, "verify": "MATCH" if ok else "MISMATCH"})
        assert ok

    # ---------- 2. add_case x8 ----------
    new_cids = {}
    for name, ids in ADDS:
        sid = sec_ids[name]
        st, d = tr.call(f"get_cases/{PROJECT}&suite_id={SUITE}&section_id={sid}")
        assert st == 200, (st, d)
        present = {c["title"]: c["id"] for c in (d["cases"] if isinstance(d, dict) else d)}
        for iid in ids:
            c = loc[iid]
            w = body(c)
            if c["title"] in present:
                cid = present[c["title"]]
                new_cids[iid] = cid
                v, bad = verify(cid, w, sid)
                print(f"add_case SKIP (already present): {iid} = C{cid} verify {v}")
                oplog.append({"op": "add_case", "internal_id": iid, "section_id": sid,
                              "case_id": cid, "http": "skipped-already-present",
                              "verify": v, "mismatch": bad})
                continue
            st, d2 = tr.call(f"add_case/{sid}", w)
            assert st == 200, (iid, st, d2)
            cid = d2["id"]
            new_cids[iid] = cid
            v, bad = verify(cid, w, sid)
            print(f"add_case {iid} -> C{cid} HTTP {st} verify {v}"
                  + (f" {bad}" if bad else ""))
            oplog.append({"op": "add_case", "internal_id": iid, "section_id": sid,
                          "case_id": cid, "http": st, "verify": v, "mismatch": bad})
            assert v == "MATCH", (iid, bad)

    # ---------- 3. update_case x2 (refs-only) ----------
    for iid, cid in UPDATES:
        c = loc[iid]
        pre = json.load(open(os.path.join(SNAP, f"C{cid}.json")))
        st, d = tr.call(f"update_case/{cid}", {"refs": c["spec_ref"]})
        assert st == 200, (cid, st, d)
        v, bad = verify(cid, {
            "refs": c["spec_ref"],
            # tester-facing fields MUST be unchanged from the pre-write snapshot
            "title": pre["title"],
            "custom_preconds": pre["custom_preconds"],
            "custom_steps": pre["custom_steps"],
            "custom_expected": pre["custom_expected"],
            "type_id": pre["type_id"],
            "priority_id": pre["priority_id"],
        })
        print(f"update_case {iid} C{cid} HTTP {st} verify {v}" + (f" {bad}" if bad else ""))
        oplog.append({"op": "update_case", "internal_id": iid, "case_id": cid,
                      "fields": ["refs"], "http": st, "verify": v, "mismatch": bad})
        assert v == "MATCH", (iid, bad)

    # ---------- 4. move_cases_to_section x1 ----------
    target = sec_ids["Reports Page Filters"]
    st, live = tr.get_case(MOVE)
    if live["section_id"] == target:
        print(f"move SKIP: C{MOVE} already in {target}")
        oplog.append({"op": "move_cases_to_section", "case_id": MOVE,
                      "section_id": target, "http": "skipped-already-there",
                      "verify": "MATCH"})
    else:
        st, d = tr.call(f"move_cases_to_section/{target}",
                        {"suite_id": SUITE, "case_ids": [MOVE]})
        assert st == 200, (st, d)
        st2, chk = tr.get_case(MOVE)
        ok = st2 == 200 and chk["section_id"] == target
        print(f"move_cases_to_section C{MOVE} {live['section_id']} -> {target} "
              f"HTTP {st} verify {'MATCH' if ok else 'MISMATCH'}")
        oplog.append({"op": "move_cases_to_section", "case_id": MOVE,
                      "from_section": live["section_id"], "section_id": target,
                      "http": st, "verify": "MATCH" if ok else "MISMATCH"})
        assert ok

    json.dump({"sections": sec_ids, "new_cids": new_cids},
              open(os.path.join(HERE, "new-cids.json"), "w"), indent=1)
    json.dump(oplog, open(os.path.join(HERE, "oplog.json"), "w"), indent=1)
    print("\nsections:", sec_ids)
    print("new C-ids:", new_cids)
    print("ops:", len(oplog),
          "| mismatches:", sum(1 for o in oplog if o["verify"] != "MATCH"))


if __name__ == "__main__":
    main()
