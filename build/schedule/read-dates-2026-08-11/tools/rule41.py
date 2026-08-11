#!/usr/bin/env python3
"""Standing Rule 41 whole-case re-read: EVERY field of EVERY case checked
against the CURRENT specification (Confluence v27), not just the field this
pass edits. Findings are RECORDED, never silently fixed.
"""
import json, re, sys

SPEC_HEADINGS = set("""1 1.1 1.2 2 3 3.1 3.2 4 4.1 4.2 4.3 4.4 4.5 4.6 4.7 4.8 4.9 4.10
4.11 4.12 4.13 5 5.1 5.2 5.3 6 7 8 8.1 8.2 9 10 11 12 13 14 14.1 14.2 14.3 14.4 15""".split())

BARRED = ["as per the build tested on", "VIU", "feature flag", "feature-flag"]
MARKERS = ("AUTOMATION: READY - EXPECT FAIL", "AUTOMATION: READY", "AUTOMATION: HOLD")


def check(cid, c, sections):
    f = []
    title = c.get("title") or ""
    exp = c.get("custom_expected") or ""
    pre = c.get("custom_preconds") or ""
    steps = c.get("custom_steps") or ""
    refs = c.get("refs") or ""
    sec = sections.get(c["section_id"], {}).get("name", "")
    alltext = f"{title}\n{pre}\n{steps}\n{exp}"

    # 1. spec anchors cited anywhere in the case must exist in v27
    for a in set(re.findall(r"§(\d{1,2}(?:\.\d{1,2})?)", alltext + " " + refs)):
        if a not in SPEC_HEADINGS:
            f.append(f"cites §{a}, which is not a heading in spec v27")

    # 2. the spec version named must be 27
    for v in set(re.findall(r"specification version (\d+)", exp)):
        if v != "27":
            f.append(f"provenance names spec version {v}, live is 27")

    # 3. exactly one provenance line, exactly one marker, marker LAST
    n_prov = exp.count("This is the expected behaviour as per")
    if n_prov != 1:
        f.append(f"{n_prov} provenance sentence-1 lines (must be exactly 1)")
    n_mark = sum(exp.count(m) for m in ("AUTOMATION: READY", "AUTOMATION: HOLD"))
    # 'READY - EXPECT FAIL' contains 'READY', so count marker LINES instead
    mlines = [l for l in exp.split("\n") if l.strip().startswith("AUTOMATION:")]
    if len(mlines) != 1:
        f.append(f"{len(mlines)} AUTOMATION marker lines (must be exactly 1)")
    else:
        if not mlines[0].strip().startswith(MARKERS):
            f.append(f"marker not one of the three forms: {mlines[0].strip()[:60]!r}")
        after = exp.split(mlines[0], 1)[1]
        if after.strip():
            f.append(f"text after the marker: {after.strip()[:60]!r}")

    # 4. raw markup shown to the tester
    if re.search(r"</?(?:p|ol|ul|li|br|div|span|strong|em)\b", alltext, re.I):
        f.append("raw HTML markup in tester-facing text")

    # 5. barred phrases
    for b in BARRED:
        if b == "VIU":
            if re.search(r"\bVIU\b", alltext):
                f.append("barred word 'VIU' in tester-facing text")
        elif b.lower() in alltext.lower():
            f.append(f"barred phrase {b!r}")

    # 6. Rule 20: refs must carry BOTH a ticket key and a spec anchor
    if not re.search(r"SV-\d+", refs):
        f.append(f"refs carries no Jira key: {refs!r}")
    if not re.search(r"§|S\d+-R\d+|section", refs):
        f.append(f"refs carries no spec anchor: {refs!r}")

    # 7. Rule 4: API content only in an API-titled section
    api = re.search(r"\b(HTTP|POST|GET|PATCH|DELETE|PUT|20[01]|40[0-9]|/api/)\b", alltext)
    if api and "API" not in sec:
        f.append(f"API content ({api.group(0)}) but section is {sec!r}")

    # 8. Rule 54 sentence 2 must never say the build defines the expectation
    if re.search(r"expected behaviour as per the build|verified by the build", exp, re.I):
        f.append("provenance credits the build for the expectation")

    # 9. title length (house rule: <= 80 chars)
    if len(title) > 80:
        f.append(f"title {len(title)} chars (> 80)")

    # 10. every case must carry the --- separator before the provenance block
    if "\n---\n" not in exp:
        f.append("no '---' separator before the provenance block")

    return f
