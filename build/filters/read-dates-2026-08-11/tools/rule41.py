#!/usr/bin/env python3
"""Standing Rule 41 whole-case re-read: EVERY field of EVERY one of our 114 cases
checked against the CURRENT specification (Confluence v19, read live today), not
just the field this pass edits. Findings are RECORDED, never silently fixed.

Also carries the playbook-hazard-#5 RAW MARKUP CENSUS, taken at pass start and
before any write, because TestRail re-renders tester text into HTML hours after a
write without moving `updated_on` — so a census is only ever true of the moment it
was taken.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
EV = os.path.join(HERE, "..", "evidence")

BARRED = ["as per the build tested on", "feature flag", "feature-flag"]
MARKERS = ("AUTOMATION: READY - EXPECT FAIL", "AUTOMATION: READY", "AUTOMATION: HOLD")
MARKUP = re.compile(r"</?(?:p|ol|ul|li|br|div|span|strong|em|hr|a)\b[^>]*>", re.I)


def spec_anchors(path):
    t = open(path).read()
    return set(re.findall(r"\bS\d+-[RNEQ]\d+[a-z]?\b", t))


def check(cid, c, secname, anchors):
    f = []
    title = c.get("title") or ""
    exp = c.get("custom_expected") or ""
    pre = c.get("custom_preconds") or ""
    steps = c.get("custom_steps") or ""
    refs = c.get("refs") or ""
    alltext = f"{title}\n{pre}\n{steps}\n{exp}"

    # 1. every requirement anchor cited anywhere must exist in the live spec
    for a in sorted(set(re.findall(r"\bS\d+-[RNEQ]\d+[a-z]?\b", alltext + " " + refs))):
        if a not in anchors:
            f.append(f"cites {a}, which is not a requirement anchor in live spec v19")

    # 2. the spec version named in the provenance must be 19
    for v in set(re.findall(r"[Cc]onfluence version (\d+)", exp)):
        if v != "19":
            f.append(f"provenance names Confluence version {v}, live is 19")

    # 3. exactly one provenance line, exactly one marker, marker LAST
    n_prov = exp.count("This is the expected behaviour as per")
    if n_prov != 1:
        f.append(f"{n_prov} provenance sentence-1 openings (must be exactly 1)")
    mlines = [l for l in exp.split("\n") if l.strip().startswith("AUTOMATION:")]
    if len(mlines) != 1:
        f.append(f"{len(mlines)} AUTOMATION marker lines (must be exactly 1)")
    else:
        if not mlines[0].strip().startswith(MARKERS):
            f.append(f"marker not one of the three forms: {mlines[0].strip()[:60]!r}")
        after = exp.split(mlines[0], 1)[1]
        if after.strip():
            f.append(f"text after the marker: {after.strip()[:60]!r}")

    # 4. raw markup shown to the tester (hazard #5)
    for fld, txt in (("preconds", pre), ("steps", steps), ("expected", exp),
                     ("title", title)):
        m = MARKUP.findall(txt)
        if m:
            f.append(f"RAW MARKUP in {fld}: {sorted(set(x.lower() for x in m))[:6]}")

    # 5. barred phrases and the barred word VIU
    for b in BARRED:
        if b.lower() in alltext.lower():
            f.append(f"barred phrase {b!r}")
    if re.search(r"\bVIU\b", alltext):
        f.append("barred word 'VIU' in tester-facing text")

    # 6. Rule 20: refs must carry BOTH a Jira key and a spec anchor
    if not re.search(r"SV-\d+", refs):
        f.append(f"refs carries no Jira key: {refs[:80]!r}")
    if not re.search(r"§|S\d+-[RNEQ]\d+|section|spec", refs, re.I):
        f.append(f"refs carries no spec anchor: {refs[:80]!r}")
    # refs length limit: one comma-free entry must be <= 248 chars
    for part in refs.split(","):
        if len(part.strip()) > 248:
            f.append(f"refs entry {len(part.strip())} chars (> 248 → HTTP 400)")

    # 7. Rule 4: API content only in an API-titled section
    api = re.search(r"\b(HTTP|POST|PATCH|DELETE|PUT|20[01]|40[0-9]|/api/)\b", alltext)
    if api and "API" not in secname:
        f.append(f"API content ({api.group(0)!r}) but section is {secname!r}")

    # 8. Rule 54/57: the provenance must never credit the build for the expectation
    if re.search(r"expected behaviour as per the build|verified by the build", exp, re.I):
        f.append("provenance credits the build for the expectation")

    # 9. house rule: title <= 80 chars
    if len(title) > 80:
        f.append(f"title {len(title)} chars (> 80)")

    # 10. the '---' separator before the provenance block
    if "\n---\n" not in exp:
        f.append("no '---' separator before the provenance block")
    return f


if __name__ == "__main__":
    anchors = spec_anchors(f"{EV}/spec-v19-live-flattened-2026-08-11.txt")
    print(f"requirement anchors in live spec v19: {len(anchors)}")
    d = json.load(open(f"{SNAP}/cases-PRE.json"))
    secs = {s["id"]: s["name"] for s in json.load(open(f"{SNAP}/sections-4110.json"))}
    ours = {k: v for k, v in d.items() if v.get("created_by") == 3}
    out, clean = {}, 0
    for cid in sorted(ours, key=int):
        c = ours[cid]
        f = check(cid, c, secs.get(c["section_id"], ""), anchors)
        if f:
            out[cid] = f
        else:
            clean += 1
    print(f"cases re-read whole: {len(ours)}   clean: {clean}   with findings: {len(out)}")
    for cid, f in out.items():
        print(f"  C{cid}: " + " | ".join(f))
    json.dump(out, open(f"{EV}/rule41-findings-PRE.json", "w"), indent=1)

    # summary counts that the deliverables quote
    tot = {}
    for f in out.values():
        for x in f:
            k = x.split(":")[0].split(",")[0][:44]
            tot[k] = tot.get(k, 0) + 1
    print("\nfinding classes:")
    for k in sorted(tot, key=lambda x: -tot[x]):
        print(f"   {tot[k]:>3}  {k}")
