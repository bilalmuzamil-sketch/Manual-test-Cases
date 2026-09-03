#!/usr/bin/env python3
"""THE ONE PLACE THE SANCTIONED AUTOMATION-MARKER FORMS ARE DECLARED — and the audit that
proves that declaration has not gone stale against the documents that sanction them.

    from automation_markers import MARKERS, DEFERRED_MARKER, classify, assert_current
    assert_current()                      # loud failure if this file no longer matches canon
    hit = classify('AUTOMATION: HOLD - the panel is not in the build')

THE FAILURE CLASS THIS FILE EXISTS TO KILL
------------------------------------------
A check that hard-codes the set of valid values **passes by ignoring anything new**, and
flags correct work as invalid. It has already cost real work here three times:

  * A gate coded with THREE automation-marker literals flagged FOUR valid Invoice cases
    (C44937/C44938/C44939/C44942), because Rule 69 sanctions a FOURTH form. Recorded at
    `build/skills/00-COMMON-CORE.md:2378`.
  * A payload builder coded from Rule 38's headline without its amendment rejected all 30
    of the named manual QA tester's cases.
  * `INTEGRITY.md`'s hard-coded rule range would have certified completeness while ignoring
    Rules 98 and 99 (fixed 2026-09-02, commit 1698aa6b).

Before this file, `verify_suite.py` carried the marker tuple as a literal in the script. The
2026-08-31 staging-only HOLD survived that tuple **only by luck** — it happens to begin with
the `AUTOMATION: HOLD` prefix that was already there. The next sanctioned form will not be
so lucky.

WHY A DECLARED LIST *PLUS* AN AUDIT, RATHER THAN PARSING CANON AT RUNTIME
------------------------------------------------------------------------
Parsing the accept-list straight out of the documents was the first design and it is WRONG,
for a reason that is easy to verify and impossible to argue with: the canonical documents
deliberately quote INVALID markers as counter-examples. `build/skills/00-COMMON-CORE.md`
contains the literal `AUTOMATION: Ready` — the mis-cased string that "made a case invisible
to the arithmetic gate", which is precisely what check 5 of `verify_suite.py` exists to
reject. A tool that built its accept-list by scraping backticks would START ACCEPTING THE
EXACT BUG IT IS THERE TO CATCH. The docs also carry prose shorthand (`AUTOMATION: READY/HOLD`)
and truncated citations (`AUTOMATION: READY -`) that are not forms at all.

So the two jobs are split, and each is given to the thing that can actually do it:

  DECLARATION (below)  — what a case is allowed to carry. Hand-maintained, byte-exact, ONE
                         copy in the repo, imported by every tool. Reviewable.
  AUDIT (`audit()`)    — proves that declaration still agrees with the documents, in BOTH
                         directions, every run. It never edits the accept-list; it fails.

The mandated failure mode is therefore satisfied: a newly sanctioned marker is either picked
up (if it is a form of an existing prefix, e.g. a new HOLD reason) or the tool STOPS AND SAYS
ITS LIST IS STALE. It can never silently flag a valid case. This deliberately mirrors the
no-loss assertion in `build/rules/INTEGRITY.md` — derive, diff both ways, refuse to proceed
on a corpus you cannot vouch for — so the two cannot drift apart.

CANON. The sanctioning statements, in precedence order:
  * rule 61 and its 2026-09-02 backfill amendment, which says in terms: "when a check
    implements this rule, it must encode all five forms." (In `build/rules/RULES-*.md` — the
    file is GLOBBED, never named: it is renamed on every rule addition.)
  * `CLAUDE.md` §5, the AUTOMATION MARKER bullet.
  * `build/skills/00-COMMON-CORE.md` §5.0-b, the staging-only customer-portal HOLD.

🛑 IF THE QA LEAD SANCTIONS A NEW FORM: add it to `SANCTIONED` below and nowhere else, and
run `python3 build/testing-tools/automation_markers.py` to prove the audit closes. Marker
literals are FIXED, MACHINE-FINDABLE strings (rule 61): never reworded, abbreviated,
re-punctuated, re-cased or "tidied" in one file in isolation.
"""
import glob
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Captured at import against the real repo root, so an error message names this file correctly
# even when a test points CANON_FILES/REPO somewhere else.
_SELF = os.path.relpath(os.path.abspath(__file__), REPO)

# The files that SANCTION a marker. The audit reads these; it never reads a note, a project
# state file or a remembered figure (same discipline as "count from the system of record").
#
# 🛑 THE RULE FILE IS DISCOVERED, NEVER NAMED. Historically that file was RENAMED on every rule
# addition (RULES-61-93 -> -94 -> -95 -> -96 -> -97 -> -98 -> -99), so any hard-coded entry broke
# the day a rule landed. The rename convention was RETIRED 2026-09-03 and the file is now
# permanently 'build/rules/RULES-61-ONWARD.md' (see build/rules/INTEGRITY.md), but the glob STAYS:
# it costs nothing, it survives the next reorganisation whatever it is, and it is what the sibling
# sweep does for the same reason (check_rule_amendments.py, "DISCOVERED, NEVER LISTED").
def _canon_files():
    rules = sorted(os.path.relpath(p, REPO) for p in
                   glob.glob(os.path.join(REPO, 'build/rules/RULES-*.md')))
    if not rules:
        raise StaleMarkerList(
            'no build/rules/RULES-*.md found under %s, so rule 61 cannot be read and the '
            'sanctioned-marker list cannot be proven current. Run from the repo.' % REPO)
    return ('CLAUDE.md',) + tuple(rules) + ('build/skills/00-COMMON-CORE.md',)


# Overridable by tests; None means "discover on each use".
CANON_FILES = None


def canon_files():
    """The canon file list actually used: an explicit CANON_FILES override, else discovery."""
    return tuple(CANON_FILES) if CANON_FILES else _canon_files()


# ---------------------------------------------------------------------------------------
# THE DECLARATION. Five sanctioned forms (rule 61's backfill amendment, 2026-09-02).
#
#   prefix     what a case's marker line must START with, byte-exact and CASE-SENSITIVE.
#              This is also the key the arithmetic gate counts under, so the four distinct
#              prefixes must stay exactly as they are.
#   canonical  the full form as written in canon, used by the audit's reverse direction.
#   why        the authority, so nobody "simplifies" a form away without reading it.
#
# Form 5 is a FORM OF `AUTOMATION: HOLD`, not a sixth prefix. Rule 61 is explicit about why:
# the arithmetic gate is READY + EXPECT-FAIL = total - HOLD, and a new non-HOLD literal would
# silently break it. It therefore shares the HOLD prefix and needs no separate accept entry.
# ---------------------------------------------------------------------------------------
SANCTIONED = (
    ('AUTOMATION: READY - EXPECT FAIL',
     'AUTOMATION: READY - EXPECT FAIL (SV-xxxx)',
     'rule 61 - needs a LIVE ticket; carries the symptom and all three outcomes'),
    ('AUTOMATION: READY',
     'AUTOMATION: READY',
     'rule 61 - the default; build-independent'),
    ('AUTOMATION: HOLD',
     'AUTOMATION: HOLD - <short plain reason>',
     'rule 61 - only a genuinely unobtainable thing; a tool flag never justifies HOLD'),
    ('AUTOMATION: HOLD',
     'AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch',
     'rule 61 form (5) / 00-COMMON-CORE.md 5.0-b - staging-only, QA lead 2026-08-31, wording final 2026-09-02'),
    ('AUTOMATION: Not available on Build',
     'AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>',
     'rule 69 - the FOURTH permitted string; excluded from any ready-to-automate figure'),
)

# Accept-prefixes, de-duplicated but ORDER-PRESERVED (longest-specific first) so that
# 'AUTOMATION: READY - EXPECT FAIL' is matched before the shorter 'AUTOMATION: READY'.
MARKERS = tuple(dict.fromkeys(p for p, _c, _w in SANCTIONED))

# The Rule-69 NOT-BUILT marker, named separately because the arithmetic gate subtracts it.
DEFERRED_MARKER = 'AUTOMATION: Not available on Build'

# Literals that CANON CONTAINS BUT DOES NOT SANCTION. Each is suppressed BY NAME with its
# reason, so that a genuinely new form still stands out as unknown and trips the audit.
# 🛑 Adding an entry here makes the audit quieter. Only ever add a string that canon quotes
# as a NON-marker; never add one to silence a form the QA lead actually sanctioned.
KNOWN_NON_MARKERS = {
    'AUTOMATION: Ready':
        'the mis-cased counter-example: this is the bug check 5 exists to catch '
        '("`AUTOMATION: Ready` made a case invisible to the arithmetic gate"). '
        'It must stay REJECTED.',
    'AUTOMATION: READY/HOLD':
        'prose shorthand for "READY or HOLD" in running text, not a marker literal.',
}

_SPAN = re.compile(r'`([^`\n]*AUTOMATION:[^`\n]*)`')


class StaleMarkerList(RuntimeError):
    """The declaration above no longer agrees with the documents that sanction it."""


def classify(line):
    """Return the sanctioned prefix this marker line carries, or None.

    Matching is byte-exact and case-sensitive: the line either IS a prefix, or begins with
    that prefix followed by a space. `AUTOMATION: Ready` and `AUTOMATION:READY` are None.
    """
    line = (line or '').strip()
    for prefix in MARKERS:
        if line == prefix or line.startswith(prefix + ' '):
            return prefix
    return None


def _canon_literals():
    """Every backticked `AUTOMATION: ...` literal in canon, with where it was found.

    Backticks are how canon writes a marker it means literally; running prose that merely
    mentions the marker is not quoted that way. A missing canon file is itself a loud
    failure -- an audit that cannot read its source has not passed, it has not run.
    """
    found = {}
    for rel in canon_files():
        path = os.path.join(REPO, rel)
        try:
            text = open(path, encoding='utf-8').read()
        except OSError as exc:
            raise StaleMarkerList(
                'cannot read the canonical file %s (%s). The sanctioned-marker list cannot '
                'be proven current, so this run would be asserting a list it never checked. '
                'Run from the repo, or fix CANON_FILES in %s.' % (rel, exc, _SELF)) from None
        for m in _SPAN.finditer(text):
            lit = m.group(1).strip()
            if lit.split('AUTOMATION:', 1)[1].strip():      # skip bare `AUTOMATION:`
                found.setdefault(lit, set()).add(rel)
    return found


def audit():
    """Diff the declaration against canon BOTH WAYS. Returns (unknown, vanished).

    unknown  -- literals canon quotes that no sanctioned prefix accepts. A new form the QA
                lead sanctioned lands here, which is what forces this file to be updated
                instead of a valid case being flagged.
    vanished -- declared canonical forms that no longer appear anywhere in canon, i.e. a form
                was renamed or withdrawn and this file still accepts the old spelling.
    """
    literals = _canon_literals()
    fulls = [c for _p, c, _w in SANCTIONED]

    unknown = {}
    for lit, where in literals.items():
        if classify(lit):
            continue
        if lit in KNOWN_NON_MARKERS:
            continue
        # A truncated citation of a real form ("AUTOMATION: READY -") is a fragment, not a
        # new form: canon quotes the head of a longer literal mid-sentence.
        if any(f.startswith(lit) for f in fulls):
            continue
        unknown[lit] = sorted(where)

    joined = {rel: open(os.path.join(REPO, rel), encoding='utf-8').read()
              for rel in canon_files()}
    vanished = [c for c in fulls if not any(c in t for t in joined.values())]
    return unknown, vanished


def assert_current():
    """Prove the declaration is current, or raise loudly. Never silently flags a valid case.

    Call this BEFORE doing any work, so a stale list stops the run instead of producing a
    verdict nobody should trust.
    """
    unknown, vanished = audit()
    if not unknown and not vanished:
        return len(SANCTIONED)
    msg = ['THE SANCTIONED AUTOMATION-MARKER LIST IN %s IS STALE.' % _SELF,
           'Refusing to judge markers against a list that does not match canon -- that is how',
           'a gate coded with three literals flagged four correct cases (Rule 61 backfill).']
    for lit, where in sorted(unknown.items()):
        msg.append('  UNKNOWN literal in canon, accepted by no prefix: %r' % lit)
        msg.append('    quoted in: %s' % ', '.join(where))
        msg.append('    -> if the QA lead sanctioned this, add it to SANCTIONED. If canon quotes')
        msg.append('       it as a NON-marker, add it to KNOWN_NON_MARKERS with the reason.')
    for c in vanished:
        msg.append('  DECLARED form no longer found anywhere in canon: %r' % c)
        msg.append('    -> it was renamed or withdrawn; this file still accepts the old spelling.')
    msg.append('Canon: %s' % ', '.join(canon_files()))
    raise StaleMarkerList('\n'.join(msg))


def main():
    unknown, vanished = audit()
    print('SANCTIONED AUTOMATION MARKERS — declared in %s' % _SELF)
    for prefix, canonical, why in SANCTIONED:
        print('  %-34s %s' % (prefix, canonical))
        print('  %-34s   (%s)' % ('', why))
    print('\naccept-prefixes (%d): %s' % (len(MARKERS), ', '.join(repr(m) for m in MARKERS)))
    print('deferred marker      : %r' % DEFERRED_MARKER)
    print('\nAUDIT vs canon (%s)' % ', '.join(canon_files()))
    print('  canon literals examined : %d' % len(_canon_literals()))
    print('  unknown (canon -> here) : %s'
          % ('NONE' if not unknown else ', '.join(repr(k) for k in sorted(unknown))))
    print('  vanished (here -> canon): %s'
          % ('NONE' if not vanished else ', '.join(repr(k) for k in vanished)))
    for lit, why in sorted(KNOWN_NON_MARKERS.items()):
        print('  suppressed non-marker   : %-26r %s' % (lit, why.split('.')[0]))
    if unknown or vanished:
        print('\nMARKER LIST: STALE — see above')
        return 1
    print('\nMARKER LIST: CURRENT')
    return 0


if __name__ == '__main__':
    sys.exit(main())
