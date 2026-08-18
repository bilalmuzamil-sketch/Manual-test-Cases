"""WIP full v21->v22 re-stamp transform (2026-08-18, full-restamp pass).

Pure functions only. `restamp(cid, exp, refs, spec_ref)` returns
(new_exp, new_refs, new_spec_ref, notes). Deterministic, idempotent-safe on v22.

Rules applied:
  - refs / spec_ref: "WIP spec v21 <date>" -> "WIP spec v22 2026-08-18".
  - expected provenance pin: "specification version 21 (" -> "specification version 22 (";
    C43838 special "specification version 21 does not" -> "... version 22 does not".
  - spec read-on date bumped to "18 August 2026" (v22 published 2026-08-18; v22 read live
    2026-08-18 in the SPEC-DIFF pass). Epic read-on date UNCHANGED (epic not re-read this pass).
  - FormB "both read on <date>" restructured so epic keeps its old date and the spec gets 18 Aug.
  - C30479: body version citation "specification (version 21, S4-R21)" -> v22 (S4-R21 byte-identical
    v21->v22, so a pure version-citation move; keeps the case internally consistent).
  - C30530: content reconcile to v22 S11-R3 -- "for a given work order" -> "for a given work order
    and tab" (quoted verbatim from v22 S11-R3). Marker/HOLD unchanged (genuine observability HOLD).
"""
import re

V22_REFS_DATE = "spec v22 2026-08-18"
SPEC_READON = "18 August 2026"


def _bump_refs(s):
    if s is None:
        return None
    # matches "WIP spec v21 <date>" and bare "spec v21 <date>" (both -> spec v22 2026-08-18)
    return re.sub(r"spec v21 \d{4}-\d{2}-\d{2}", V22_REFS_DATE, s)


def restamp(cid, exp, refs, spec_ref):
    notes = []
    new_refs = _bump_refs(refs)
    new_spec_ref = _bump_refs(spec_ref)
    new_exp = exp

    if cid == 43838:
        new_exp = new_exp.replace("specification version 21 does not",
                                  "specification version 22 does not")
        new_exp = new_exp.replace("(read on 17 August 2026)", "(read on %s)" % SPEC_READON)
        notes.append("C43838 shell 'does not name' phrasing + parenthetical read-on")
    else:
        # 1) provenance pin
        new_exp = new_exp.replace("specification version 21 (",
                                  "specification version 22 (")
        # 2) FormB restructure (split shared 'both read on' date; epic keeps old date)
        new_exp = re.sub(
            r"epic SV-8582 and the Work In Progress report specification version 22 "
            r"(\([^)]*\)), both read on (\d+ [A-Za-z]+ 2026)",
            r"epic SV-8582, read on \2, and the Work In Progress report specification "
            r"version 22 \1, read on " + SPEC_READON,
            new_exp)
        # 3) FormA spec read-on bump
        new_exp = re.sub(
            r"(specification version 22 \([^)]*\), read on )\d+ [A-Za-z]+ 2026",
            r"\g<1>" + SPEC_READON,
            new_exp)

    if cid == 30479:
        new_exp = new_exp.replace("specification (version 21, S4-R21)",
                                  "specification (version 22, S4-R21)")
        notes.append("C30479 body version-citation v21->v22 (S4-R21 byte-identical)")

    if cid == 30530:
        old = ("so the two can never diverge for a given work order on the capture date.")
        new = ("so the two can never diverge for a given work order and tab on the capture date.")
        assert old in new_exp, "C30530 item-1 anchor not found"
        new_exp = new_exp.replace(old, new)
        notes.append("C30530 CONTENT reword item 1 per v22 S11-R3 (add 'and tab')")

    return new_exp, new_refs, new_spec_ref, notes


def body_of(exp):
    """Everything before the provenance block (the last '\\n---\\n' region).

    The provenance block begins at the '---' that precedes the
    'This is the expected behaviour' sentence. We locate that sentence and take
    the text up to the '---' immediately before it.
    """
    idx = exp.find("This is the expected behaviour")
    if idx == -1:
        return exp  # no provenance; whole thing is body
    sep = exp.rfind("\n---", 0, idx)
    if sep == -1:
        return exp[:idx]
    return exp[:sep]
