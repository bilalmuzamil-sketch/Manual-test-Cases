"""The final exhaustive check. Every ticket, no sampling (Standing Rule 50).

  A. all 22 rewritten tickets re-read live and re-verified, and the description compared
     RAW -- including localId -- not only under the declared strip;
  B. the shape checked structurally: the five parts, in order, and nothing else;
  C. the 5 closed tickets proven byte-identical to their pre-edit snapshot, INCLUDING
     `updated` and `updated_by` -- which is what proves we did not write to them;
  D. every Source section re-checked to contain the live spec version we verified.
"""
import json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
sys.path.insert(0, f"{ROOT}/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, HERE)
import jiralib
from rewrite import build, verify, flatten, canon, ORDER, PRE, SNAP

POP = json.load(open(f"{SNAP}/population.json"))
CLOSED = [k for k in POP["population"] if k not in ORDER]

EXPECT_HEADINGS = ["Description", "Steps to reproduce", "Current behaviour",
                   "Expected behaviour", "Source"]


def shape(adf):
    """Structural check: exactly the five headings in order, a rule before Source,
    an Environment paragraph and one ordered list under Steps, and no other section."""
    heads, issues = [], []
    for n in adf["content"]:
        if n["type"] == "heading":
            heads.append("".join(c.get("text", "") for c in n.get("content") or []))
    if heads != EXPECT_HEADINGS:
        issues.append(f"headings are {heads}, expected {EXPECT_HEADINGS}")
    types = [n["type"] for n in adf["content"]]
    si = next((i for i, n in enumerate(adf["content"])
               if n["type"] == "heading" and "Source" in json.dumps(n)), None)
    if si is None or adf["content"][si - 1]["type"] != "rule":
        issues.append("no line break (rule) immediately before Source")
    if types.count("rule") != 1:
        issues.append(f"{types.count('rule')} rules, expected exactly 1")
    if types.count("orderedList") != 1:
        issues.append(f"{types.count('orderedList')} ordered lists, expected exactly 1")
    hi = types.index("heading")
    st = next(i for i, n in enumerate(adf["content"])
              if n["type"] == "heading" and "Steps to reproduce" in json.dumps(n))
    if adf["content"][st + 1]["type"] != "paragraph" or \
            "Environment: " not in json.dumps(adf["content"][st + 1]):
        issues.append("no Environment line immediately before the steps")
    if adf["content"][st + 2]["type"] != "orderedList":
        issues.append("the numbered steps do not follow the Environment line")
    # Banned leftovers from the old seven-section format. Checked against the HEADING
    # texts only -- an earlier version of this check scanned the whole document and
    # flagged three tickets for the words "test data" appearing inside their own steps,
    # which is Standing Rule 50 wording we deliberately want there. The checker was
    # wrong, not the tickets.
    lowheads = [h.lower() for h in heads]
    for banned in ["why this matters", "technical details for developers",
                   "things checked and ruled out", "exact test data used",
                   "branch / environment", "type of issue", "images",
                   "severity", "impact", "test data", "technical notes",
                   "how often", "where this came from", "technical detail",
                   "how to see it", "what you see", "what should happen",
                   "what happens now", "actual result", "current result",
                   "expected result"]:
        for h in lowheads:
            if banned in h:
                issues.append(f"old-format heading survived: {h!r}")
    return issues


if __name__ == "__main__":
    report = {"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
              "rewritten": {}, "closed_untouched": {}, "totals": {}}
    bad = 0

    print("A/B/D  the 22 rewritten tickets")
    for i, key in enumerate(ORDER, 1):
        doc = build(key)
        v = verify(key, doc)
        live = json.load(open(f"{SNAP}/post-edit/{key}.json"))
        raw_same = (json.dumps(live["fields"]["description"], sort_keys=True,
                               separators=(",", ":"))
                    == json.dumps(doc, sort_keys=True, separators=(",", ":")))
        sh = shape(live["fields"]["description"])
        srctxt = json.dumps(live["fields"]["description"])
        ver_ok = ("version 19" in srctxt) if key in (
            "SV-8845", "SV-8846", "SV-8871", "SV-8912") else ("version 25" in srctxt)
        ok = v["ok"] and raw_same and not sh and ver_ok
        if not ok:
            bad += 1
        report["rewritten"][key] = {
            "verified": v["ok"], "description_exact_raw_incl_localId": raw_same,
            "fields_compared": v["fields_compared"], "fields_moved": v["moved"],
            "shape_issues": sh, "cites_live_spec_version": ver_ok,
            "named_field_checks": v["named"], "pass": ok}
        print(f"{i:3}/22 {key}  {'PASS' if ok else '**FAIL**'}  "
              f"fields={v['fields_compared']} moved={len(v['moved'])} "
              f"raw_exact={raw_same} shape_issues={len(sh)} spec_version={ver_ok}")
        for s in sh:
            print("      shape:", s)
        time.sleep(0.15)

    print("\nC  the 5 closed tickets -- proven untouched, INCLUDING updated/updated_by")
    for key in CLOSED:
        code, live = jiralib.get(f"/rest/api/3/issue/{key}?expand=renderedFields",
                                 f"/tmp/_cl_{key}.json")
        pre = json.load(open(f"{PRE}/{key}.json"))
        fpre, fnow = flatten(pre["fields"]), flatten(live["fields"])
        moved = [{"field": p, "before": fpre.get(p, "<<absent>>"),
                  "after": fnow.get(p, "<<absent>>")}
                 for p in sorted(set(fpre) | set(fnow))
                 if fpre.get(p, "<<absent>>") != fnow.get(p, "<<absent>>")
                 and not p.startswith("lastViewed")]
        ok = not moved
        if not ok:
            bad += 1
        report["closed_untouched"][key] = {
            "http": code, "fields_compared": len(set(fpre) | set(fnow)),
            "moved": moved, "updated": live["fields"].get("updated"),
            "status": (live["fields"].get("status") or {}).get("name"), "pass": ok}
        print(f"     {key}  {'UNTOUCHED' if ok else '**MOVED**'}  "
              f"{len(set(fpre)|set(fnow))} fields, {len(moved)} moved, "
              f"updated={live['fields'].get('updated')}")
        for m in moved[:6]:
            print("        ", m)
        time.sleep(0.15)

    report["totals"] = {
        "population": len(POP["population"]), "rewritten": len(ORDER),
        "closed_skipped": len(CLOSED),
        "rewritten_all_pass": all(v["pass"] for v in report["rewritten"].values()),
        "closed_all_untouched": all(v["pass"] for v in report["closed_untouched"].values()),
        "failures": bad}
    json.dump(report, open(f"{SNAP}/final-audit.json", "w"), indent=1)
    print(f"\npopulation {len(POP['population'])} = rewritten {len(ORDER)} + "
          f"closed {len(CLOSED)};  failures {bad}")
