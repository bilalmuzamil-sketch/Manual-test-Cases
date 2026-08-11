#!/usr/bin/env python3
"""Insert a Standing-Rule-54 READ-DATE after EVERY cited source in a Filters
case's provenance block.

Design constraints, all load-bearing:

* SENTENCE 2 IS NEVER TOUCHED. Every insertion happens strictly before the
  "Last checked against build ..." sentence. None is added where absent (11 of
  the 114 have none), none is altered, none is removed. This pass observed no
  build.

* ONLY SOURCE CITATIONS ARE STAMPED. A NEGATIVE mention — the specification named
  only to say it does NOT cover the point — is deliberately skipped, because a
  read-date there would assert the specification supports an expectation it
  explicitly does not. Two negative forms exist in this suite:
    - "... version 19 (published 6 August 2026) has no numbered requirement for
      this ..."  (C38876, C38904-38908, C38910, C38911)
    - "... version 19 says instead that the Status chip is hidden on this tab ..."
      — a Rule-56 divergence sentence, where the source followed is Branko's
      answer and the specification is named to record the difference
      (C29559, C29609, C29610, C29612)
    - "... version 19 has no numbered requirement for this ..." (C43562)
  The mechanical test: the words immediately following the citation. See
  classify.py's NEG_AFTER.

* OUR OWN READING RECORDS ARE NOT SOURCES. C38909 points at
  build/handover-ingest-2026-08-10/FILTERS-RECONCILIATION.md as "our reading of
  it is recorded in this file". That is our note about a source, not the source,
  so it takes no read-date. The engineering handover it describes ALREADY carries
  an honest earlier date ("read on 10 August 2026") and is left exactly as is.

* IDEMPOTENT. A citation already followed by ", read on" is left alone, so the
  17 cases that already carry a specification read-date keep the one they have,
  and a re-run cannot double-stamp.

* A path-plus-link citation is stamped AFTER THE CLOSING PARENTHESIS of the link,
  never in the middle of "path.md (https://...md)", so the link stays intact and
  the date is not stranded between the two halves of one citation.

* GRAMMATICAL. Where the insertion point is followed by a space (the sentence runs
  straight on with "and ..." / "which ..."), a closing comma is added so the date
  reads as a parenthetical instead of colliding with the next clause.

* NOTHING ELSE CHANGES. No rewording, no reflow, no separator change, no
  automation-marker change, no title/precondition/step change, no refs write.
"""
import re

READ = "read on 11 August 2026"
S2 = "Last checked against build"

# (label, regex) in the order they may appear. Each is stamped at most once.
PATTERNS = [
    ("epic", r"epic SV-8785"),
    ("story", r"(?:the owning story |its story |story )SV-\d+"),
    ("design", r"the Reports filters design|the designs"),
    # the anchored specification citation, optionally carrying its (S1-R2, ...) list
    ("spec", r"Filters specification at Confluence version 19"
             r"(?: \(published 6 August 2026\))?(?: \([^)]*\))?"),
    # file sources: match the WHOLE "path.md (url)" where the link is present
    ("answers-0804", r"build/filters/branko-answers-2026-08-04/answers-ingested\.md"
                     r"(?: \(https://[^)]*\))?"),
    ("answers-0717", r"build/filters/branko-answers-2026-07-17/answers-ingested\.md"
                     r"(?: \(https://[^)]*\))?"),
    ("answers-0731", r"build/filters/branko-answers-2026-07-31/answers-ingested\.md"
                     r"(?: \(https://[^)]*\))?"),
    ("techplan", r"(?:https://github\.com/\S*?|build/filters/tech-plan-2026-07-29/)"
                 r"TechPlan-AppWide-Filter-Redesign\.md(?: \(https://[^)]*\))?"),
]

# Words immediately after a citation that make it a NEGATIVE mention, not a source.
NEG_AFTER = [r"^ has no\b", r"^ says instead\b", r"^ does not\b", r"^ is silent\b",
             r"^ says nothing\b", r"^ contains no\b", r"^ asked only\b"]

# A reading-record pointer, never a source.
NOT_A_SOURCE = ["FILTERS-RECONCILIATION.md"]


def split_sentence2(block):
    i = block.find(S2)
    return (block, "") if i < 0 else (block[:i], block[i:])


def _stamp_one(text, rx):
    """Stamp after the first stampable match of rx. Returns (text, matched_or_None)."""
    for m in re.finditer(rx, text):
        end = m.end()
        after = text[end:]
        if after.startswith(", read on"):
            return text, None                       # already dated — idempotent
        if any(re.search(n, after) for n in NEG_AFTER):
            continue                                # negative mention — skip it
        if any(s in m.group(0) for s in NOT_A_SOURCE):
            continue
        tail_comma = "," if after[:1] == " " else ""
        return text[:end] + f", {READ}{tail_comma}" + text[end:], m.group(0)
    return text, None


def stamp(block):
    head, tail = split_sentence2(block)
    ops = []
    for label, rx in PATTERNS:
        head, m = _stamp_one(head, rx)
        if m:
            ops.append(label)
    return head + tail, ops
