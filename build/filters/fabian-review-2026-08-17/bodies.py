# -*- coding: utf-8 -*-
"""All case bodies for the Filters Fabian-review reconciliation (spec v21).
Expected behaviour is sourced from documents ONLY: spec v21 + epic SV-8785 stories + Figma
(earlier explorations, superseded where they disagree). Build deferred -> Rule-69 marker,
no build sentence in provenance."""
MARK = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"

def prov(anchors, stories=""):
    s = f" {stories}" if stories else ""
    return ("This is the expected behaviour as per epic SV-8785, read on 17 August 2026,"
            f"{s} and the Filters specification at Confluence version 21 (published 14 August 2026) "
            f"({anchors}), read on 17 August 2026.")

def exp(items, anchors, stories=""):
    return "\n".join(items) + "\n\n---\n" + prov(anchors, stories) + "\n\n" + MARK + "\n"

def J(*lines):
    return "\n".join(lines)

# Section ids under group 4110
SEC = dict(bar=4111, status=4112, cust=4113, tech=4114, adv=4115, asset=4116,
           chip=4117, coll=4118, empty=4119, tab=4120, pers=4121, url=4122,
           mob=4123, api=4124, psrch=5410, parts=5411, reports=5412, gsrch=6499)
