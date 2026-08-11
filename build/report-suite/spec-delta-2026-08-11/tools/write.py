#!/usr/bin/env python3
"""Rule-50 writer for the spec-delta pass.

Every payload carries ALL THREE text fields, because TestRail re-renders any text
field omitted from the payload into <p>-wrapped HTML with CRLF line endings.

The Expected Results field is treated as BODY + "\n\n---\n" + PROVENANCE + "\n\n"
+ MARKER. A caller replaces the BODY and may replace the MARKER; the PROVENANCE
line -- specifically Rule 54 sentence 2, "Last checked against build ... on ..." --
is NOT this pass's to touch: no build was observed, so re-dating it would assert a
build fact nobody checked (Rule 12). sentence 2 is carried through byte-exact and
verified byte-exact afterwards.
"""
import json, os, re, sys, datetime
sys.path.insert(0, "/tmp/testrail")
import tr

SEP = "\n\n---\n"
LOG = []

def split_expected(e):
    i = e.find(SEP)
    if i < 0:
        raise RuntimeError("no provenance separator found")
    body, tail = e[:i], e[i+len(SEP):]
    m = re.search(r"\n\nAUTOMATION: .*$", tail, re.S)
    if not m:
        raise RuntimeError("no AUTOMATION marker found")
    prov = tail[:m.start()]
    marker = tail[m.start():].lstrip("\n")
    return body, prov, marker

def build_expected(body, prov, marker):
    return body + SEP + prov + "\n\n" + marker

def prov_s1_replace(oldprov, new_s1):
    """Replace ONLY the first provenance sentence-block line(s) up to the build
    line, keeping the build line -- Rule 54 sentence 2 -- byte-exact. Anything
    from 'Last checked against build' onward is carried through untouched."""
    m = re.search(r"\nLast checked against build .*$", oldprov, re.S)
    if not m:
        return new_s1          # case genuinely has no build line
    return new_s1 + m.group(0)


def edit(cid, *, title=None, preconds=None, steps=None, body=None,
         prov=None, prov_s1=None, marker=None, refs=None, label="", note=""):
    """Whole-case read (Rule 41), then one verified write."""
    st, c = tr.get_case(cid)
    assert st == 200, c
    ob, oprov, omark = split_expected(c["custom_expected"] or "")
    if prov_s1 is not None:
        if prov is not None:
            raise RuntimeError("pass prov OR prov_s1, not both")
        prov = prov_s1_replace(oprov, prov_s1)
    payload = {
        "custom_preconds": preconds if preconds is not None else (c.get("custom_preconds") or ""),
        "custom_steps":    steps    if steps    is not None else (c.get("custom_steps") or ""),
        "custom_expected": build_expected(
            body if body is not None else ob,
            prov if prov is not None else oprov,
            marker if marker is not None else omark),
    }
    if title is not None: payload["title"] = title
    if refs  is not None: payload["refs"]  = refs
    st, line, before, after = tr.update_case_verified(cid, payload, label or f"C{cid}")
    # explicit proof that Rule-54 sentence 2 was preserved
    s2_before = re.search(r"Last checked against build [^\n]*", before.get("custom_expected") or "")
    s2_after  = re.search(r"Last checked against build [^\n]*", after.get("custom_expected") or "")
    b2 = s2_before.group(0) if s2_before else None
    a2 = s2_after.group(0) if s2_after else None
    if b2 != a2:
        raise RuntimeError(f"C{cid}: Rule-54 sentence 2 CHANGED\n  before={b2!r}\n  after={a2!r}")
    rec = {"cid": cid, "http": st, "verify": line, "atmstatus": after.get("custom_atmstatus"),
           "title_after": after.get("title"), "build_line": a2, "note": note,
           "fields": [k for k in payload], "when": datetime.datetime.utcnow().isoformat()+"Z"}
    LOG.append(rec)
    print(f"  OK C{cid} atm={rec['atmstatus']} | {line} | build-line preserved")
    return rec

def dump(path):
    json.dump(LOG, open(path, "w"), indent=1)
    print(f"\nwrote {path} ({len(LOG)} ops)")
