#!/usr/bin/env python3
"""Insert a Standing-Rule-54 READ-DATE after EVERY cited source in a Schedule
case's provenance block.

Design constraints, all of them load-bearing:

* SENTENCE 2 IS NEVER TOUCHED. Every insertion happens strictly before the
  "Last checked against build ..." sentence. None is added where absent, and
  none is altered.

* ONLY SOURCE CITATIONS ARE STAMPED, never a mention of a document that is not
  supplying the expectation. Two classes are deliberately skipped:
    - a NEGATIVE mention ("No numbered requirement in the Schedule
      specification version 27 covers this point" on C38867-38871/38875;
      "The Schedule specification version 27 does not say which view the page
      opens on" on C43554). There the specification is NOT the source; the tech
      plan or the story is. Stamping it would assert the specification supports
      an expectation it does not.
    - a NARRATIVE mention in a Rule-56 divergence sentence. C30041 names story
      SV-8686 and already dates it its own way ("has not been touched since the
      story was created on 27 July 2026"); a read-date there would be about a
      different thing entirely.
  The mechanical test that separates them: EVERY genuine specification citation
  in this suite carries a section anchor in parentheses, and every negative
  mention carries none. Verified across all 174 before this rule was adopted.

* IDEMPOTENT. A citation already followed by ", read on" is left alone, so a
  re-run cannot double-stamp, and the 26 cases that already carry a
  specification read-date keep exactly the one they have.

* GRAMMATICAL. Where the insertion point is followed by a space (the sentence
  continues with "and ..." / "with ..."), a closing comma is added so the date
  reads as a parenthetical rather than colliding with the next clause.

* NOTHING ELSE CHANGES. No rewording, no reflow, no separator change, no
  automation-marker change, no title/precondition/step change.
"""
import re

READ = "read on 11 August 2026"

# Everything from this sentence onward is off limits (Rule 54 sentence 2).
S2 = "Last checked against build"


def _split(block):
    """Return (stampable_head, untouched_tail). The tail begins at sentence 2."""
    i = block.find(S2)
    if i < 0:
        return block, ""
    return block[:i], block[i:]


def _ins(text, pattern):
    """Insert ', read on ...' immediately after the FIRST match of `pattern`,
    unless that position already carries a read-date. Returns (text, matched)."""
    m = re.search(pattern, text)
    if not m:
        return text, None
    end = m.end()
    if text[end:].startswith(", read on"):
        return text, None
    # A closing comma is needed only where the sentence continues straight on
    # with no punctuation of its own.
    tail_comma = "," if text[end:end + 1] == " " else ""
    return text[:end] + f", {READ}{tail_comma}" + text[end:], m.group(0)


def stamp(block):
    head, tail = _split(block)
    ops = []

    # 1. The epic. Always the first source named, always in sentence 1.
    head, m = _ins(head, r"epic SV-8685")
    if m:
        ops.append("epic SV-8685")

    # 2. A story, but ONLY where it is named inside the "as per" source list.
    for pat in (r"the acceptance criterion of its story SV-\d+",
                r"its story SV-\d+"):
        m0 = re.search(pat, head)
        if m0 and "." not in head[:m0.start()]:  # still inside sentence 1
            head, m = _ins(head, pat)
            if m:
                ops.append(m)
            break

    # 3. The specification — the ANCHORED citation form only. See the note above
    #    on why an unanchored mention is never stamped.
    head, m = _ins(head, r"the Schedule specification version 27 \([^)]*\)")
    if m:
        ops.append("the Schedule specification version 27")

    # 4/5. File-based sources: the engineering tech plan and Branko's answers.
    #      Both are cited with an explicit link, so the read-date follows ".md".
    for key, lab in (
        (r"tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite\.md",
         "the engineering technical plan"),
        (r"branko-answers-2026-07-31/answers-ingested\.md",
         "Branko's answers"),
    ):
        head, m = _ins(head, key)
        if m:
            ops.append(lab)

    return head + tail, ops
