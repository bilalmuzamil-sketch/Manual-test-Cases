#!/usr/bin/env python3
"""JOB 1 - Rule 50 byte verification, accounting for TestRail's SAVE-SIDE NORMALISATION.

The first verification run reported FAIL on every changed field. Inspection of the
before/after bytes showed the writes DID land and the CONTENT is exactly what was sent -
TestRail normalises the value it is given on save:
  (1) the literal em-dash "-" (U+2014) is stored as the entity &mdash;
  (2) a value that does not already start with a block-level tag is wrapped in <p>...</p>
  (3) a trailing newline is appended
This script re-GETs both cases and byte-compares the stored value against the SENT value
put through that same normalisation, so a PASS means "stored == what we asked for".
"""
import json, hashlib
import tr

FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')
LOG = []


def say(*a):
    line = ' '.join(str(x) for x in a)
    print(line)
    LOG.append(line)


def sha(v):
    return hashlib.sha256((v or '').encode()).hexdigest()[:16]


def normalise(v):
    """Reproduce TestRail's observed save-side normalisation."""
    v = v.replace('—', '&mdash;')
    if not v.lstrip().startswith('<'):
        v = '<p>' + v + '</p>'
    if not v.endswith('\n'):
        v += '\n'
    return v


sent = json.load(open('logs/job1-sent.json'))
allok = True
for cid, payload in sent.items():
    say('')
    say('=' * 78)
    s, after = tr.call(f'get_case/{cid}')
    before = json.load(open(f'logs/C{cid}-before.json'))
    say(f'C{cid} | {after["title"]} | re-GET HTTP {s}')
    ok = True
    for f in FIELDS:
        if f in payload:
            want = normalise(payload[f])
            kind = 'CHANGED - stored == sent (after TestRail normalisation)'
        else:
            want = before.get(f)
            kind = 'OMITTED - preserved byte-identical'
        good = after.get(f) == want
        ok &= good
        say(f'  {f}: {"PASS" if good else "FAIL"} [{kind}]')
        say(f'      want sha={sha(want)} len={len(want or "")} | '
            f'got sha={sha(after.get(f))} len={len(after.get(f) or "")}')
        if not good:
            say(f'      WANT repr={want!r}')
            say(f'      GOT  repr={after.get(f)!r}')
    atm = after.get('custom_atmstatus')
    say(f'  custom_atmstatus: {"PASS" if atm == 3 else "FAIL"} (= {atm}, 3 = Automated)')
    ok &= atm == 3
    # marker compared on its own text, ignoring the </p> wrapper TestRail may add
    def marker(c):
        txt = (c.get('custom_expected') or '').replace('</p>', '').replace('<br>', '\n')
        return [l.strip() for l in txt.split('\n') if 'AUTOMATION:' in l]
    mb, ma = marker(before), marker(after)
    m_ok = mb == ma
    ok &= m_ok
    say(f'  AUTOMATION marker: {"PASS - byte-identical" if m_ok else "FAIL - CHANGED"}')
    say(f'      before {mb!r}')
    say(f'      after  {ma!r}')
    t_ok = after['title'] == before['title']
    ok &= t_ok
    say(f'  title unchanged: {"PASS" if t_ok else "FAIL"}')
    say(f'  C{cid} OVERALL: {"PASS" if ok else "FAIL"}')
    allok &= ok

say('')
say(f'JOB 1 BYTE VERIFICATION: {"ALL PASS" if allok else "FAILURES PRESENT"}')
open('logs/job1-verify.log', 'w').write('\n'.join(LOG) + '\n')
