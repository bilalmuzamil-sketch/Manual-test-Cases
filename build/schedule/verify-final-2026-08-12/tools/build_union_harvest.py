#!/usr/bin/env python3
"""build_union_harvest.py — assemble EVERY raw-text-node string captured from
build v3.5-65d6500 across the two committed passes that ran on it.

Sources, all committed to the repository, all from the SAME build marker
(v3.5-65d6500, last-mod Tue 11 Aug 2026 09:33:33 GMT, etag 3250d285..., sha256
9348ca09...):

  build/schedule/build-viu-2026-08-11/evidence/vocab-by-surface.json   34 surfaces
  build/schedule/build-viu-2026-08-12/evidence/harvest.json             9 surfaces
  build/schedule/build-viu-2026-08-12/evidence/*.json                   the dialogs
  build/schedule/drag-retry-2026-08-12/evidence/*.json                  picker/spread/modal

A trailing NUL in a captured string records the CSS text-transform painted over
the stored value.  We keep the STORED string (what a diff must compare against)
and record the transform separately.

VISIBLE strings and ACCESSIBLE-ONLY strings are kept in separate buckets: a label
found only in an aria-label or a data-test-id must never be certified as correct,
because no manual tester can see it.
"""
import json, glob, os, sys

ROOT = "/home/user/Manual-test-Cases/build/schedule"
OUT = os.path.join(ROOT, "verify-final-2026-08-12/evidence/union-harvest.json")

visible = set()
accessible = set()
surfaces = {}


def strip_transform(s):
    return s.split(chr(0))[0] if isinstance(s, str) else s


def add_visible(vals, tag):
    """Accept both shapes the two passes wrote.

    The 11 August harvest stored plain strings with a NUL-suffixed transform.
    The 12 August dialog probes stored {'raw': ..., 'transform': ...} records.
    An earlier version of this tool took only the string shape and therefore
    reported the five dialog labels as NOT-FOUND - an absence manufactured by
    our own tooling, which is precisely the failure mode this pass exists to
    avoid.  Both shapes are read now.
    """
    n = 0
    for v in vals:
        s = None
        if isinstance(v, str):
            s = strip_transform(v)
        elif isinstance(v, dict):
            for k in ("raw", "text", "label", "name"):
                if isinstance(v.get(k), str):
                    s = strip_transform(v[k])
                    break
        if s and s.strip():
            visible.add(s.strip())
            n += 1
    if n:
        surfaces[tag] = surfaces.get(tag, 0) + n


def add_accessible(vals):
    for v in vals:
        if isinstance(v, str) and v.strip():
            accessible.add(strip_transform(v).strip())


# 1 - the 34-surface harvest of 11 August
vb = json.load(open(f"{ROOT}/build-viu-2026-08-11/evidence/vocab-by-surface.json"))
for surface, vals in vb.items():
    add_visible(vals, "11aug/" + surface)

# 2 - the 9-surface harvest of 12 August
h = json.load(open(f"{ROOT}/build-viu-2026-08-12/evidence/harvest.json"))
add_visible(h.get("text", []), "12aug/harvest")
add_accessible(h.get("arias", []))
add_accessible(h.get("testids", []))
add_accessible(h.get("placeholders", []))


# 3 - every other evidence JSON from the two 12 August passes.  These hold the
#     dialogs, the scope picker, the spread step and the shift modal.  We walk
#     them generically and take any list-of-strings under a text-ish key.
TEXT_KEYS = {"text", "texts", "nodes", "raw", "strings", "labels", "items",
             "menu", "menu_items", "visible", "textnodes", "controls",
             "options", "rows", "found", "hits", "chips", "buttons"}
ARIA_KEYS = {"arias", "aria", "testids", "test_ids", "placeholders", "ids"}


def walk(o, tag, depth=0):
    if depth > 6:
        return
    if isinstance(o, dict):
        for k, v in o.items():
            kl = str(k).lower()
            if kl in TEXT_KEYS and isinstance(v, list):
                add_visible(v, tag)
            elif kl in ARIA_KEYS and isinstance(v, list):
                add_accessible(v)
            else:
                walk(v, tag, depth + 1)
    elif isinstance(o, list):
        for v in o:
            walk(v, tag, depth + 1)


SKIP_FILES = {"harvest.json", "vocab-by-surface.json", "label-diff.json",
              "census.json", "exec-log.json", "diff.json", "percase-labels.json",
              "sweep.json"}
for d in ("build-viu-2026-08-12", "drag-retry-2026-08-12"):
    for f in sorted(glob.glob(f"{ROOT}/{d}/evidence/*.json")):
        base = os.path.basename(f)
        if base in SKIP_FILES or base.startswith("board-"):
            continue
        try:
            walk(json.load(open(f)), f"{d}/{base}")
        except Exception as e:  # a malformed evidence file must not be silent
            print("SKIP", f, e, file=sys.stderr)

json.dump({
    "build": "v3.5-65d6500",
    "visible_count": len(visible),
    "accessible_count": len(accessible),
    "surface_contributions": surfaces,
    "visible": sorted(visible),
    "accessible": sorted(accessible),
}, open(OUT, "w"), indent=1)

print("surfaces contributing:", len(surfaces))
print("distinct VISIBLE strings:", len(visible))
print("distinct ACCESSIBLE-only strings:", len(accessible - visible))
