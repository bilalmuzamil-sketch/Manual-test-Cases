#!/usr/bin/env python3
"""Two edits to a Report Suite case's provenance block, made in ONE write:

  JOB 1 — a Standing-Rule-54 READ-DATE after EVERY cited source.
  JOB 2 — correct a STALE specification version pin to the live version for
          THAT citation's own report.

Adapted from build/filters/read-dates-2026-08-11/tools/stamp.py (Rule 27). The
constraints below are all load-bearing and several are specific to this project.

* SENTENCE 2 IS NEVER TOUCHED. Every edit happens strictly before the build
  sentence. This project has TWO shapes of sentence 2 — "Last checked against
  build ... on ..." (471 cases) and "This has not yet been checked against a
  build." (5 cases) — and BOTH are treated as the boundary. None is added,
  altered, re-dated or removed. This pass observed no build.

* SIX SPECIFICATIONS, SIX INDEPENDENT VERSIONS. Each citation is re-pinned to
  the live version of THE REPORT IT NAMES, not the report the case sits under.
  Cases exist that cite three specifications at once (C43550), so a per-case
  version would be wrong.

* A HISTORICAL VERSION IN PROSE IS NOT A PIN, AND IS LEFT ALONE. Several cases
  deliberately discuss an earlier revision — "Version 9 of that specification
  contradicted itself...", "version 10 of that specification uses the number
  S9-R11 for two different requirements". Those are statements about the past
  and re-pinning them would falsify the case's own reasoning. Only the citation
  form "<Report> report specification version N" is re-pinned; the prose form
  "Version N of that specification" cannot match it (different word order).

* A NEGATIVE MENTION TAKES NO READ-DATE. Where a specification is named only to
  record that it does NOT cover the point, stamping it would assert the
  specification supports an expectation it explicitly does not. It is still
  RE-PINNED, but only because the anchors it names were proven byte-identical
  between the pinned and the live version, so the negative claim still holds.

* A RULE-56 DIVERGENCE SENTENCE IS A CITATION, NOT A NEGATIVE. "...where the
  wording of that specification differs, the behaviour above follows Chris
  Ward's later decision" NAMES the specification as a real source and discloses
  a divergence from it. Both sources are dated.

* NO VERSION IS INVENTED. Two cases cite a specification with no version number
  at all. They get a read-date; they do NOT get a version they never carried,
  because that would assert a pin nobody established. Reported instead.

* IDEMPOTENT. A citation already followed by ", read on" is left alone, so the
  two cases stamped earlier today keep the date they have and a re-run cannot
  double-stamp.

* NOTHING ELSE CHANGES. No rewording, no reflow, no separator change, no
  automation-marker change, no title/precondition/step change, no refs write.
"""
import re

READ = "read on 11 August 2026"

# The two shapes of Rule 54 sentence 2 in this project. Everything from the
# EARLIEST of these onward is untouchable.
S2_MARKERS = ("Last checked against build",
              "This has not yet been checked against a build")

# report name as it appears in a citation -> live Confluence version, read live
# 2026-08-11 (see SOURCE-CURRENCY.md; the in-body "Version" field does not exist
# on any of these six pages, so the API integer is the only marker)
LIVE = {
    "Sales By Customer":       17,
    "Sales By Representative": 18,
    "Parts Velocity":          6,
    "Technician Utilization":  7,
    "Work In Progress":        11,
    "Inventory Value":         5,
}

# A specification citation: the report name, the words "report specification",
# an OPTIONAL "version N", and an OPTIONAL trailing anchor list in parentheses.
SPEC = re.compile(
    r"(?P<name>" + "|".join(re.escape(n) for n in LIVE) + r")"
    r" report specification"
    r"(?P<ver> version (?P<n>\d+))?"
    r"(?P<anch> \((?P<inner>[^)]*)\))?")

# Words immediately after a citation that make it a NEGATIVE mention rather than
# a source. Checked against the text that FOLLOWS the whole citation.
NEG_AFTER = [r"^ is silent\b", r"^ has no\b", r"^ does not cover\b",
             r"^ says nothing\b", r"^ contains no\b", r"^ is not\b",
             r"^ said nothing\b"]

OTHER = [
    ("epic", re.compile(r"epic SV-8582")),
    ("story", re.compile(r"\bstory SV-\d+")),
    ("answers", re.compile(r"https://docs\.google\.com/spreadsheets/\S*?(?=[.,;)]?(?:\s|$))")),
    ("techplan", re.compile(r"the engineering technical plan")),
]


def split_sentence2(block):
    """Return (head, tail) where tail begins at the earliest sentence-2 marker."""
    idx = [block.find(m) for m in S2_MARKERS]
    idx = [i for i in idx if i >= 0]
    if not idx:
        return block, ""
    i = min(idx)
    return block[:i], block[i:]


def _already(after):
    return after.startswith(", read on") or after.startswith(", " + READ)


def _tail_comma(after):
    """A closing comma keeps the date parenthetical instead of colliding with the
    clause that runs on after it."""
    return "," if after[:1] in (" ",) else ""


def stamp(block):
    """Return (new_block, ops) where ops records exactly what was done."""
    head, tail = split_sentence2(block)
    ops = []

    # --- JOB 2 + JOB 1 on specification citations, right to left so that
    # earlier match offsets stay valid as the string grows.
    for m in reversed(list(SPEC.finditer(head))):
        end = m.end()
        after = head[end:]
        name = m.group("name")
        live = LIVE[name]
        negative = any(re.search(p, after) for p in NEG_AFTER)

        # JOB 1 — the read-date, unless already present or the mention is negative
        if not _already(after) and not negative:
            head = head[:end] + f", {READ}{_tail_comma(after)}" + head[end:]
            ops.append(f"read-date:spec:{name}")
        elif negative:
            ops.append(f"read-date-SKIPPED-negative-mention:{name}")

        # JOB 2 — the version pin, on the SAME citation
        if m.group("ver"):
            cur = int(m.group("n"))
            if cur != live:
                s, e = m.start("ver"), m.end("ver")
                head = head[:s] + f" version {live}" + head[e:]
                ops.append(f"repin:{name}:{cur}->{live}")
        else:
            ops.append(f"no-version-pin-present:{name}")

    # --- JOB 1 on every other kind of source
    for label, rx in OTHER:
        for m in rx.finditer(head):
            end = m.end()
            after = head[end:]
            if _already(after):
                ops.append(f"already-dated:{label}")
                break
            head = head[:end] + f", {READ}{_tail_comma(after)}" + head[end:]
            ops.append(f"read-date:{label}")
            break   # one date per source kind per case

    return head + tail, ops
