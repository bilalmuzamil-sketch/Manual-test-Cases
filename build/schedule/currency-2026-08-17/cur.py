# -*- coding: utf-8 -*-
"""Whole-suite v27->v30 currency transform for Schedule (group 4254).
Surgical provenance edit (NOT full rebuild) to preserve authored nuance:
  - specification version 27 -> 30
  - read on 11 August 2026 -> read on 17 August 2026 (provenance tail only)
  - insert owning story after the epic read-date (from refs), if not already named
  - drop sentence 2 "Last checked against build ... ."  (build deferred)
  - strip any build-observation paragraph from the body (preserved separately)
  - marker -> Rule-69 "Not available on Build to test Yet - Last checked 8/17/2026"
Content-stale cases carry an explicit body/title/refs override (CONTENT dict).
"""
import re

MARKER = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"

# build-observation lead-ins (comprehensive, verified against the live suite)
OBS = re.compile(
    r'(What you should see today|What you will find on the build|On the build as it stands'
    r'|As the build stands|In this build|On this build|Mark this test BLOCKED'
    r'|reported to the QA lead|reported separately|has been checked on the build'
    r'|If it (passes|fails)|If you see exactly that)', re.I)

EPIC_ANCHOR = "as per epic SV-8685, read on 17 August 2026, "


def parse_stories(refs):
    """Owning story keys from refs: first SV-key(s) before the '(' of each ';'-segment,
    excluding the epic SV-8685."""
    out = []
    for seg in (refs or "").split(";"):
        before = seg.split("(")[0]
        for k in re.findall(r"SV-\d+", before):
            if k != "SV-8685" and k not in out:
                out.append(k)
    return out


def story_clause(stories):
    if not stories:
        return ""
    if len(stories) == 1:
        return "and story %s " % stories[0]
    return "and stories %s " % " and ".join(stories)


def split_body_tail(exp):
    """Return (body, sep, tail) where sep is the exact '---' separator used, or (exp,None,None)."""
    m = re.search(r"\n+---\n+", exp)
    if not m:
        return exp, None, None
    return exp[:m.start()], m.group(0), exp[m.end():]


def strip_buildobs(body):
    """Remove a trailing build-observation paragraph from body; return (clean_body, stripped_or_None)."""
    m = OBS.search(body)
    if not m:
        return body, None
    stripped = body[m.start():]
    clean = body[:m.start()].rstrip("\n ")
    return clean, stripped


def transform_provenance(prov, stories):
    p = prov
    p = p.replace("specification version 27", "specification version 30")
    p = p.replace("read on 11 August 2026", "read on 17 August 2026")
    # drop sentence 2 (build marker line contains '.' inside vX.Y, so strip to end-of-line)
    p = re.sub(r"\s*Last checked against build[^\n]*", "", p)
    # insert owning story after the epic read-date, if not already naming a story
    if stories and EPIC_ANCHOR in p and not re.search(r"\bstor(y|ies) SV-\d+", p):
        p = p.replace(EPIC_ANCHOR, EPIC_ANCHOR + story_clause(stories), 1)
    return p.rstrip("\n ")


def build_expected(live_exp, refs, body_override=None):
    body, sep, tail = split_body_tail(live_exp)
    if tail is None:
        raise ValueError("no --- separator in expected")
    # body
    if body_override is not None:
        new_body = body_override.rstrip("\n ")
        stripped = None
    else:
        new_body, stripped = strip_buildobs(body)
    # provenance = tail up to the AUTOMATION marker
    prov = re.split(r"\n\nAUTOMATION", tail)[0].rstrip("\n ")
    new_prov = transform_provenance(prov, parse_stories(refs))
    new_exp = new_body + sep + new_prov + "\n\n" + MARKER + "\n"
    return new_exp, stripped
