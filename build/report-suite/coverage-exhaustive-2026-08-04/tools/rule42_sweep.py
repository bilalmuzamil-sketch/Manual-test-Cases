#!/usr/bin/env python3
"""RULE-42 SWEEP — every CLOSED ENUMERATION in the 478 cases, and its governing sources.

Rule 42: an expected result that CLOSES a list ("exactly", "only these", "no other",
"the complete list", "in order are") is a time bomb — it fails a correct build the moment
the spec adds an item. Every such case must (a) cite its governing requirement AND the
spec version in refs, or (b) be written scope-conditionally.

This sweep is EXHAUSTIVE over all 478 cases (Rule 50) and, per case, records:
  - the closing phrase and the enumeration text (verbatim)
  - whether the enumeration is a TRUE closed list or an incidental use of the keyword
    ("sum exactly to that row total", "restored exactly as set" -- adverbial, not a list)
  - whether refs carries a VERSION PIN (a Confluence version and/or a dated spec)
  - whether refs carries a CLOSING ANCHOR (an Sn-Rn id) for the list
  - whether the case is written SCOPE-CONDITIONALLY ("when more than one location ...")
  - the governing SOURCE DOCUMENTS named in refs (spec / video / PO answer / tech plan /
    QA-lead ruling / live build) so source-vs-source conflict can be adjudicated

OUTPUT ../data/rule42-rows.json
"""
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))

# the closing phrases Rule 42 names, plus the ones our suite actually uses
CLOSERS = [
    (r"\bin (?:this )?exact order\b", "in this exact order"),
    (r"\b(?:are|is|read|reads)\s+exactly\b", "are/read exactly"),
    (r"\bexactly these\b", "exactly these"),
    (r"\bexactly\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b", "exactly N"),
    (r"\bin order,? are\b|\bin order are\b|\b, in order:", "in order are"),
    (r"\bonly these\b", "only these"),
    (r"\bno other\b", "no other"),
    (r"\bthe complete list\b", "the complete list"),
    (r"\bnothing else\b", "nothing else"),
    (r"\bonly the following\b", "only the following"),
    (r"\bexactly\b", "exactly (bare)"),
]
# ---------------------------------------------------------------------------------------
# WHAT COUNTS AS A CLOSED ENUMERATION (refined after reading all 137 keyword contexts)
#
# A Rule-42 closed enumeration is one of:
#   (a) an explicit closing phrase over a SET  -- "in this exact order", "in order are",
#       "exactly these", "only these", "no other", "nothing else", "the complete list"
#   (b) "exactly N <UI-SET NOUN>"              -- items / options / columns / toggles /
#       entries / actions / choices / downloads / headers / tabs / toasts
#   (c) "reads/are exactly" followed by a QUOTED STRING -- a verbatim label assertion,
#       which is just as brittle as a list (it fails the moment the copy changes)
#
# It is NOT a closed enumeration when "exactly" is ADVERBIAL -- a precise quantity or an
# equality in a precondition, step or calculation:
#   "access to exactly one location" · "an asset with exactly one invoice" · "select
#   exactly two customers" · "dated exactly ON the start date" · "reads exactly 2.50" ·
#   "gone down by exactly 2.50" · "sums exactly to that row total" · "restored exactly as
#   set" · "drop by exactly that invoice's amounts"
# Pinning a spec version into the refs of those adds noise, not traceability.
# ---------------------------------------------------------------------------------------
SET_NOUN = (r"items?|options?|columns?|toggles?|entries|entry|actions?|choices?|downloads?|"
            r"headers?|tabs?|toasts?|values in|menu items?|presets?|statuses|filters?")
ADVERBIAL = re.compile(
    r"exactly\s+(?:to|that|as|the same|once|matches|match|equal|equals|reproduc\w+|"
    r"mirror\w*|by\b|what\b|where\b|how\b|when\b|it\b|its\b|this\b|those\b|the hand|"
    r"on\b|the filtered|the customers|the \d|\d)"
    r"|sum(?:s|med)?\s+exactly|drop\s+by\s+exactly|restored\s+exactly|"
    r"reads?\s+exactly\s+the\s+same|belongs?\s+to\s+exactly|down\s+by\s+exactly"
    # "exactly one/two/.../N <data noun>" -- a seeded quantity, not a list
    r"|exactly\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+"
    r"(?!(?:" + SET_NOUN + r"))\w+", re.I)
# (b) and (c): a keyword hit is a TRUE closer only if one of these also matches
TRUE_CLOSER = re.compile(
    r"in (?:this )?exact order|in order,? are|,?\s*in order:|exactly these|only these|"
    r"no other|nothing else|the complete list|only the following|"
    r"exactly\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:" + SET_NOUN + r")|"
    # "reads/are exactly" + a quoted verbatim string
    r"(?:reads?|are|is|lists?|offers?|holds?|shows?)\s+exactly[:,]?\s*[\"“']", re.I)
# "... exactly: A, B, C, D" -- a colon-introduced comma list of three or more items is a
# closed enumeration even without quote marks (e.g. "The labels read exactly: Labor
# Invoiced, Labor Margin, ...").
COLON_LIST = re.compile(
    r"(?:reads?|are|is|lists?|offers?|holds?|shows?|,)\s*(?:exactly)?\s*:?\s*"
    r"(?:[^,;:\n]{2,42},){2,}", re.I)

VERSION_PIN = re.compile(
    r"\bv\d+\b|\bversion\s*\d+|\bv-\d{4}-\d{2}-\d{2}\b|\b20\d\d-\d\d-\d\d\b", re.I)
CLOSING_ANCHOR = re.compile(r"\bS\d+-[RNE]\d+[a-z]?(?:\.\d+)?\b")
SCOPE_COND = re.compile(
    r"\bwhen (?:more than one|a single|only one|shown|the .{0,20}is (?:on|off))\b|"
    r"\bwith (?:a single|more than one|only one)\b|\bif .{0,40}\bin scope\b|"
    r"\bwhile\b.{0,40}\bstate\b", re.I)

SOURCES = [
    (r"\bspec v\d+|\bspec\b.{0,20}\bv\d+|Confluence \d+", "SPEC (version-pinned)"),
    (r"specs?/[a-z0-9-]+\.md", "SPEC (local file path, NO version)"),
    (r"\bPRD video\b|\bwalkthrough video\b|\bvideo\b", "PRD/walkthrough VIDEO"),
    (r"Chris Ward|\bChris\b", "PO answer — Chris Ward"),
    (r"tech.?plan", "engineering TECH PLAN"),
    (r"QA lead|QA-lead", "QA lead ruling"),
    (r"observed live|live[- ]observed|as shipped|as built|in the build|build v3\.", "LIVE BUILD observation"),
    (r"\bSV-\d+", "JIRA ticket"),
]


def main():
    ca = json.load(open(os.path.join(DATA, "case-anchors.json")))
    rows = []
    for c in ca.values():
        blob = "\n".join(filter(None, [c["title"], c["preconds"], c["steps"], c["expected"]]))
        hits = []
        for pat, name in CLOSERS:
            for m in re.finditer(pat, blob, re.I):
                seg = blob[max(0, m.start() - 90):m.start() + 240].replace("\n", " | ")
                window = blob[m.start():m.start() + 90]
                closes = bool(TRUE_CLOSER.search(window)) or (
                    "exactly" in window.lower() and bool(COLON_LIST.search(window)))
                adverbial = bool(ADVERBIAL.search(window)) or not closes
                hits.append({"closer": name, "context": seg, "adverbial": adverbial,
                             "closing_window": window.replace("\n", " | ")})
        if not hits:
            continue
        # de-duplicate on the (closer, first 70 chars of context)
        seen, uniq = set(), []
        for h in hits:
            k = (h["closer"], h["context"][:70])
            if k not in seen:
                seen.add(k)
                uniq.append(h)
        true_lists = [h for h in uniq if not h["adverbial"]]
        refs = c["refs"] or ""
        srcs = sorted({name for pat, name in SOURCES if re.search(pat, refs, re.I)})
        rows.append({
            "internal_id": c["internal_id"], "c_id": c["c_id"], "prefix": c["prefix"],
            "title": c["title"], "section": c["section"], "refs": refs,
            "anchors": c["anchors"],
            "closers": sorted({h["closer"] for h in uniq}),
            "hits": uniq,
            "true_closed_list": bool(true_lists),
            "adverbial_only": not true_lists,
            "has_version_pin": bool(VERSION_PIN.search(refs)),
            "has_closing_anchor": bool(CLOSING_ANCHOR.search(refs)),
            "scope_conditional": bool(SCOPE_COND.search(blob)),
            "source_documents": srcs,
            "source_count": len(srcs),
        })
    rows.sort(key=lambda r: (r["prefix"], r["internal_id"]))
    json.dump(rows, open(os.path.join(DATA, "rule42-rows.json"), "w"),
              indent=1, ensure_ascii=False)

    tl = [r for r in rows if r["true_closed_list"]]
    print("cases with a Rule-42 keyword    :", len(rows))
    print("  of which TRUE closed lists    :", len(tl))
    print("  adverbial keyword only        :", len(rows) - len(tl))
    print("TRUE closed lists by report     :", dict(sorted(Counter(r["prefix"] for r in tl).items())))
    print("  version-pinned refs           :", sum(1 for r in tl if r["has_version_pin"]))
    print("  NOT version-pinned            :", sum(1 for r in tl if not r["has_version_pin"]))
    print("  closing Sn-Rn anchor present  :", sum(1 for r in tl if r["has_closing_anchor"]))
    print("  no closing anchor             :", sum(1 for r in tl if not r["has_closing_anchor"]))
    print("  scope-conditional wording     :", sum(1 for r in tl if r["scope_conditional"]))
    print("  >1 governing source document  :", sum(1 for r in tl if r["source_count"] > 1))
    print("source-document histogram       :")
    cc = Counter()
    for r in tl:
        for s in r["source_documents"]:
            cc[s] += 1
    for k, v in cc.most_common():
        print(f"    {v:4}  {k}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
