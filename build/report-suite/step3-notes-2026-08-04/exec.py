"""Execute the Step-3 remainder. Rule 50: every write re-GET and byte-compared, every
field the pass did not intend to change proven byte-identical. Rule 41: whole-case re-read."""
import json, os, sys
sys.path.insert(0, "/tmp/testrail"); import tr
D = os.path.dirname(os.path.abspath(__file__))
plan = json.load(open(f"{D}/data/plan.json"))
SPECV = {"Sales By Customer":13,"Sales By Representative":15,"Parts Velocity":4,
         "Technician Utilization":5,"Work In Progress":6,"Inventory Value":3}
log = []
for i, p in enumerate(plan, 1):
    cid = p["cid"]
    st0, before = tr.get_case(cid)
    assert st0 == 200, (cid, st0)
    json.dump(before, open(f"{D}/data/C{cid}.before.json","w"), indent=1, sort_keys=True)
    # --- Rule 41: whole-case re-read, EVERY field, before writing ---
    rr = []
    rr.append(f"title {len(before['title'])} chars" + (" OVER 80" if len(before['title'])>80 else " ok"))
    rr.append("refs present" if (before.get("refs") or "").strip() else "refs MISSING")
    exp = before["custom_expected"] or ""
    rr.append("provenance present" if "expected behaviour as per" in exp else "provenance MISSING")
    sv = [f"{k} v{v}" for k,v in SPECV.items() if f"{k} report specification version {v}" in exp]
    rr.append("spec version matches the map: " + (sv[0] if sv else "NO MATCH"))
    rr.append(f"preconds {len(before.get('custom_preconds') or '')} chars, steps {len(before.get('custom_steps') or '')} chars")
    rr.append("section_id %s, type_id %s" % (before["section_id"], before.get("type_id")))
    # sanity: the local 'before' we planned against must equal live NOW
    same = before["custom_expected"] == p["before"]
    rr.append("planned-against text == live text: " + ("YES" if same else "NO — REPLANNED"))
    if not same:
        raise RuntimeError(f"C{cid}: live text moved since the plan was built — refusing to write")
    payload = {"custom_expected": p["after"]}
    st, verify, b2, after = tr.update_case_verified(cid, payload, label="update_case")
    json.dump(after, open(f"{D}/data/C{cid}.after.json","w"), indent=1, sort_keys=True)
    # explicit: every field except the intended one byte-identical
    coll = [k for k in set(before)|set(after)
            if k not in ("custom_expected","updated_on","updated_by") and before.get(k)!=after.get(k)]
    assert not coll, f"C{cid}: COLLATERAL CHANGE in {coll}"
    assert after["custom_expected"] == p["after"], f"C{cid}: expected text not byte-equal"
    log.append({"op":i,"cid":cid,"kind":"update_case","note_kind":p["note_kind"],"http":st,
                "verify":verify,"collateral_fields_changed":len(coll),
                "rule41_whole_case_reread":rr,
                "fields_intended":["custom_expected"]})
    print(f"op {i}: C{cid} [{p['note_kind']}] HTTP {st} | {verify} | collateral {len(coll)} | "
          f"re-read: {'; '.join(rr[:4])}")
json.dump(log, open(f"{D}/data/op-log.json","w"), indent=1)
print(f"\n{len(log)} update_case, all HTTP 200, all byte-verified, 0 collateral changes")
