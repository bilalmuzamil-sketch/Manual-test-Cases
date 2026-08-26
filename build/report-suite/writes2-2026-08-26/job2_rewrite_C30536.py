#!/usr/bin/env python3
"""JOB 2 - C30536 (Inventory Value, "First visit defaults to today and the active location").

Rule 71 gate FIRST: if the case is Automated (custom_atmstatus = 3) this script writes
nothing and stops. Observed value: 1 (Not Automated), so the write proceeds.

Rule 41 whole-case re-read, re-derived from the LIVE Inventory Value specification
version 10 (Confluence page 720142338, lastmod 2026-08-13, body fetched 2026-08-26):

  S1-R3, verbatim: "On the user's first visit (no saved settings - Story 8), the report
                    defaults to an "as of" date of today and the user's currently active
                    location."
  S7-R2, verbatim: "On a first visit (no saved selection - Story 8), it defaults to the
                    user's currently active location."
  S5-R1, verbatim: "The toolbar has a single "as of" date control - one calendar day, not
                    a range. It defaults to today ..."
  S5-R7, verbatim: "A date range is not offered on this report. Stock valuation is a
                    point-in-time position, not an amount accumulated over a period ...
                    (Chris, 2026-08-13; replaces the nine-preset range plus custom
                    start/end specced on 2026-08-04)."

RE-DERIVATION RESULT: the case's two expectations, and its tester note citing S5-R1/S5-R7,
match live v10 word for word. The prior pass's stale flag fired on the word "range" inside
the tester note that EXPLAINS the range was removed - a false positive, not a stale
expectation. The version pin (10) is already the live version. The only thing genuinely
out of date is the date on which the specification was last read, so that is what is
re-stamped. No expectation is reworded, because none changed.

Pre-write safety check added 2026-08-26 (see APP-ACTIONS-PLAYBOOK.md #J): C30536 renders
its fields in <div class="markdown fr-view"> containers, i.e. TestRail emits the stored
value RAW, so the <p> wrapper the API adds is invisible and this write is safe.
"""
import json, hashlib, sys
import tr

LOG = []


def say(*a):
    line = ' '.join(str(x) for x in a)
    print(line)
    LOG.append(line)


def sha(v):
    return hashlib.sha256((v or '').encode()).hexdigest()[:16]


def normalise(v):
    """TestRail's observed save-side normalisation (proved by the Job 4 experiment)."""
    v = v.replace('—', '&mdash;')
    if not v.lstrip().startswith('<'):
        v = '<p>' + v + '</p>'
    if not v.endswith('\n'):
        v += '\n'
    return v


CID = 30536
s, before = tr.call(f'get_case/{CID}')
say(f'C{CID} | {before["title"]} | get_case HTTP {s}')
atm = before.get('custom_atmstatus')
say(f'RULE 71 GATE: custom_atmstatus = {atm}')
if atm == 3:
    say('STOP - this case is flagged Automated. No write made; held for the QA lead (Rule 71).')
    open('logs/job2-C30536.log', 'w').write('\n'.join(LOG) + '\n')
    sys.exit(0)
say('  -> not Automated, the write may proceed.')
json.dump(before, open(f'logs/C{CID}-before.json', 'w'), indent=1)

old = ('and the Inventory Value report specification version 10 (S1-R3, S7-R2), '
       'read on 17 August 2026.')
new = ('and the Inventory Value report specification version 10 (S1-R3 and S7-R2, with '
       'S5-R1 and S5-R7 for the single "as of" date control), re-read on 26 August 2026 '
       'and still the live version.')
exp = before['custom_expected']
if exp.count(old) != 1:
    say(f'FATAL: provenance anchor found {exp.count(old)} times, expected 1'); sys.exit(1)
exp = exp.replace(old, new)
say('  edit: Rule 54 provenance read-date re-stamped to 26 August 2026 (version stays 10 - '
    '10 IS the live version); S5-R1/S5-R7 named alongside the anchors the note already cites')
say('  NO expectation reworded: every assertion matches live v10 verbatim (see header)')

payload = {'custom_expected': exp}
say(f'  custom_expected: before sha={sha(before["custom_expected"])} '
    f'len={len(before["custom_expected"])} -> sending sha={sha(exp)} len={len(exp)}')
say('  fields OMITTED (preserved, per the Job 4 finding): custom_preconds, custom_steps')

s, r = tr.call(f'update_case/{CID}', payload)
say(f'  update_case HTTP {s}')
if s != 200:
    say(f'  FATAL {r!r}'); sys.exit(1)

s, after = tr.call(f'get_case/{CID}')
say(f'  re-GET HTTP {s}')
json.dump(after, open(f'logs/C{CID}-after.json', 'w'), indent=1)
ok = True
for f in ('custom_preconds', 'custom_steps', 'custom_expected'):
    want = normalise(payload[f]) if f in payload else before.get(f)
    good = after.get(f) == want
    ok &= good
    say(f'  VERIFY {f}: {"PASS" if good else "FAIL"} '
        f'({"changed" if f in payload else "omitted, preserved"}) '
        f'| want sha={sha(want)} got sha={sha(after.get(f))}')
    if not good:
        say(f'     WANT repr={want!r}')
        say(f'     GOT  repr={after.get(f)!r}')
say(f'  VERIFY custom_atmstatus unchanged: '
    f'{"PASS" if after.get("custom_atmstatus") == atm else "FAIL"} (= {after.get("custom_atmstatus")})')
ok &= after.get('custom_atmstatus') == atm
say(f'  VERIFY title unchanged: {"PASS" if after["title"] == before["title"] else "FAIL"}')
ok &= after['title'] == before['title']
mk = lambda c: [l for l in (c.get('custom_expected') or '').replace('</p>', '').split('\n')
                if 'AUTOMATION:' in l]
say(f'  VERIFY AUTOMATION marker unchanged: {"PASS" if mk(before) == mk(after) else "FAIL"} '
    f'| {mk(after)!r}')
ok &= mk(before) == mk(after)
say(f'  C{CID} OVERALL: {"PASS" if ok else "FAIL"}')
open('logs/job2-C30536.log', 'w').write('\n'.join(LOG) + '\n')
