#!/usr/bin/env python3
"""JOB 4 - settle empirically whether TestRail update_case PRESERVES or RE-RENDERS
text fields that are OMITTED from the payload, and whether sending all four fields
byte-identical alters a multi-block body.

Runs on ONE throwaway case (title prefixed ZZAUTOTEST, custom_atmstatus = 1) in
section 237 ("Temporarily"), which is DELETED at the end. No real case is touched.
"""
import json, hashlib, sys
import tr

SECTION = 237
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')
LOG = []


def h(v):
    return hashlib.sha256((v or '').encode()).hexdigest()[:16]


def say(*a):
    line = ' '.join(str(x) for x in a)
    print(line)
    LOG.append(line)


PRECONDS = (
    "ZZAUTOTEST-PRE-B1\n"
    "1. First precondition line.\n"
    "2. Second precondition line.\n"
    "\n"
    "ZZAUTOTEST-PRE-B2 paragraph with *star* and <b>angle</b> characters.\n"
    "\n"
    "- bullet one\n"
    "- bullet two"
)
STEPS = (
    "ZZAUTOTEST-STEP-B1\n"
    "1. Do the first thing.\n"
    "2. Do the second thing.\n"
    "\n"
    "ZZAUTOTEST-STEP-B2 trailing paragraph.\n"
)
EXPECTED = (
    "ZZAUTOTEST-EXP-B1\n"
    "1. First expectation.\n"
    "2. Second expectation.\n"
    "\n"
    "---\n"
    "ZZAUTOTEST-EXP-PROVENANCE sentence one. Sentence two.\n"
    "\n"
    "AUTOMATION: READY\n"
)

payload = {
    'title': 'ZZAUTOTEST field-preservation probe (delete me)',
    'custom_preconds': PRECONDS,
    'custom_steps': STEPS,
    'custom_expected': EXPECTED,
    'custom_atmstatus': 1,
    'custom_automation_type': 0,
}

s, created = tr.call(f'add_case/{SECTION}', payload)
if s != 200:
    say('FATAL add_case', s, created)
    sys.exit(1)
cid = created['id']
say(f'CREATED throwaway case C{cid} in section {SECTION}, atmstatus={created.get("custom_atmstatus")}')

s, base = tr.call(f'get_case/{cid}')
say('BASELINE (as stored by TestRail after add_case):')
baseline = {}
for f in FIELDS:
    baseline[f] = base.get(f)
    say(f'  {f}: sha={h(base.get(f))} len={len(base.get(f) or "")} repr={base.get(f)!r}')
say(f'  sent-vs-stored identical for all three: '
    f'{base.get("custom_preconds")==PRECONDS and base.get("custom_steps")==STEPS and base.get("custom_expected")==EXPECTED}')

# ---- EXPERIMENT (a): update ONLY the title, OMIT all three text fields ----
say('')
say('=== EXPERIMENT (a): update_case sending ONLY {"title": ...} - all three text fields OMITTED ===')
s, r = tr.call(f'update_case/{cid}', {'title': 'ZZAUTOTEST field-preservation probe - title changed A'})
say('  update_case HTTP', s)
s, aft = tr.call(f'get_case/{cid}')
say('  re-GET HTTP', s, '| title now:', repr(aft.get('title')))
res_a = {}
for f in FIELDS:
    same = aft.get(f) == baseline[f]
    res_a[f] = same
    say(f'  {f}: {"PRESERVED (byte-identical)" if same else "ALTERED"} '
        f'| before sha={h(baseline[f])} after sha={h(aft.get(f))}')
    if not same:
        say(f'     BEFORE repr={baseline[f]!r}')
        say(f'     AFTER  repr={aft.get(f)!r}')
say('  VERDICT (a):', 'OMITTED FIELDS ARE PRESERVED' if all(res_a.values()) else 'OMITTED FIELDS ARE LOST/RE-RENDERED')

# ---- EXPERIMENT (b): send all four fields byte-identical ----
say('')
say('=== EXPERIMENT (b): update_case sending ALL FOUR fields, text byte-identical to the re-GET ===')
send = {'title': 'ZZAUTOTEST field-preservation probe - title changed B'}
for f in FIELDS:
    send[f] = aft.get(f)
s, r = tr.call(f'update_case/{cid}', send)
say('  update_case HTTP', s)
s, aft2 = tr.call(f'get_case/{cid}')
say('  re-GET HTTP', s, '| title now:', repr(aft2.get('title')))
res_b = {}
for f in FIELDS:
    same = aft2.get(f) == send[f]
    res_b[f] = same
    say(f'  {f}: {"PRESERVED (byte-identical)" if same else "ALTERED"} '
        f'| sent sha={h(send[f])} after sha={h(aft2.get(f))}')
    if not same:
        say(f'     SENT  repr={send[f]!r}')
        say(f'     AFTER repr={aft2.get(f)!r}')
say('  VERDICT (b):', 'SENDING ALL FOUR IS LOSSLESS' if all(res_b.values()) else 'SENDING ALL FOUR RESTRUCTURED THE BODY')

# ---- CLEANUP ----
say('')
s, r = tr.call(f'delete_case/{cid}')
say('DELETE throwaway C%s HTTP %s' % (cid, s))
s, chk = tr.call(f'get_case/{cid}')
say('confirm-gone re-GET HTTP', s, '(400/404 = deleted)')

open('logs/job4-field-preservation.log', 'w').write('\n'.join(LOG) + '\n')
json.dump({'case_id': cid, 'omitted_preserved': res_a, 'allfour_lossless': res_b},
          open('logs/job4-result.json', 'w'), indent=1)
