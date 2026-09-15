#!/usr/bin/env python3
"""Refuse to let a defect claim reach a ticket until the INSTRUMENT has been proved.

Why this exists (2026-09-15). In one pass I put three wrong descriptions in front of engineering,
all from the same root cause: I reported a READING as a fact about the product without first proving
the reading was valid. Each was stable, repeatable and completely convincing.

  * "Enter opens a record further down the list"      -> my mouse pointer, left where it had clicked
  * "the highlight starts on the 8th row"             -> the same pointer
  * "checked twice, so not a one-off"                 -> one observation and one replay, because the
                                                         app remembers the query
  * "the recently viewed list does not come back"     -> it comes back on the next keystroke

`blocker_gate.py` already guards NEGATIVE claims ("X is impossible"). Nothing guarded POSITIVE
defect claims ("the product does X wrongly"), which is where all of these went.

USAGE

    python3 build/testing-tools/finding_gate.py --check <evidence.json>

The evidence file must carry an `instrument` block. Every field is a question that, unanswered,
has produced a wrong ticket in this repo:

    "instrument": {
      "pointer_parked_and_verified": true,     # L0117 - and VERIFIED, not just moved
      "selectors_not_pre_chosen": true,        # dumped every test id, did not count one prefix
      "positive_control": "…what proves the instrument can see the thing when it IS there",
      "independent_repeat": "…a repeat that VARIES the suspected cause, not the same input again",
      "state_recorded": "…pointer, viewport, prior queries, prior clicks - what the harness did",
      "what_would_make_this_my_fault": "…and how it was ruled out"
    }

It exits 1 and says which question is unanswered. That is the point: a claim that cannot answer
these is not ready to be a ticket, however certain it feels.
"""
import json, sys, os

REQUIRED = [
    ('pointer_parked_and_verified',
     'Was the mouse pointer parked away from what you measured, and VERIFIED there with '
     'document.elementFromPoint? A pointer left where it clicked keeps a row hovered and produces a '
     'stable fake finding (L0117).'),
    ('selectors_not_pre_chosen',
     'Did you dump every test id / element in the panel, rather than counting one prefix you chose '
     'in advance? Deciding what counts before looking is how a full panel reads as empty.'),
    ('positive_control',
     'What shows the instrument CAN see the thing when it is there? Without this, "absent" and '
     '"my reader is broken" are the same output (Rule 104).'),
    ('independent_repeat',
     'Did the repeat VARY the thing the app might be remembering - a different query, record, '
     'account, session? Re-running the same input is a replay, not a repeat (L0115).'),
    ('state_recorded',
     'What did the harness itself do to the page - pointer position, viewport, earlier clicks, '
     'earlier queries? Any of these can be the finding.'),
    ('what_would_make_this_my_fault',
     'Name the most likely way this is the harness rather than the product, and say how it was '
     'ruled out.'),
]


def check(path):
    if not os.path.exists(path):
        return ['evidence file does not exist: ' + path]
    try:
        ev = json.load(open(path))
    except Exception as e:
        return ['evidence file is not readable JSON: %s' % e]
    inst = ev.get('instrument')
    if not isinstance(inst, dict):
        return ['no "instrument" block in the evidence. Add one answering:\n' +
                '\n'.join('  - %s: %s' % (k, q) for k, q in REQUIRED)]
    problems = []
    for key, question in REQUIRED:
        v = inst.get(key)
        if v is True:
            continue
        if isinstance(v, str) and len(v.strip()) >= 15:
            continue
        if v in (None, '', False):
            problems.append('%s is unanswered.\n      %s' % (key, question))
        else:
            problems.append('%s is answered too thinly to mean anything (%r).\n      %s'
                            % (key, v, question))
    return problems


def main():
    args = [a for a in sys.argv[1:] if a != '--check']
    if not args:
        sys.exit(__doc__)
    bad = False
    for path in args:
        problems = check(path)
        if problems:
            bad = True
            print('REFUSED - %s is not ready to become a ticket:' % path)
            for p in problems:
                print('   * ' + p)
        else:
            print('OK - %s answers all six instrument questions' % path)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
