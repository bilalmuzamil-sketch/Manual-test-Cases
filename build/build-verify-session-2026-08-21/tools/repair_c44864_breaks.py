#!/usr/bin/env python3
"""REPAIR MY OWN COLLATERAL DAMAGE on C44864.

The authorised title write came back with custom_preconds / custom_steps /
custom_expected wrapped in <p>...</p> with BARE newlines and no <br> -- the
collapse pattern that renders as one unreadable run-on paragraph for the tester
(skill 14, APP-ACTIONS-PLAYBOOK J "bare-\\n-inside-<p>" recipe).

The documented repair: rewrite THE BREAKS ONLY, never the wording. This is
restoration under core 2.3 ("restore from the snapshot if needed"), not a scope
expansion -- the case must not be left worse than it was found.
"""
import json, base64, urllib.request, urllib.error, re, sys, datetime

CID=44864
C=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B=C['host']+'/index.php?/api/v2/'
def call(path,payload=None):
    r=urllib.request.Request(B+path, data=json.dumps(payload).encode() if payload is not None else None)
    r.add_header('Authorization','Basic '+A); r.add_header('Content-Type','application/json')
    try:
        with urllib.request.urlopen(r,timeout=60) as x: return x.status, json.loads(x.read().decode())
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:400]

pre=json.load(open('build/build-verify-session-2026-08-21/snapshots/PRE-WRITE-C44864.json'))
s,live=call(f'get_case/{CID}')
assert s==200

def strip_tags(t): return re.sub(r'<[^>]+>','',t or '')
def norm_words(t): return ' '.join(strip_tags(t).split())

def add_breaks(t):
    """insert <br> before each newline that has no <br> already; wording untouched"""
    if not t: return t
    if '<br' in t.lower(): return t
    return t.replace('\n','<br>\n')

payload={}
for f in ('custom_preconds','custom_steps','custom_expected'):
    payload[f]=add_breaks(live.get(f) or '')
payload['title']=live['title']
payload['refs']=live.get('refs') or ''

print("===== DRY RUN — repair payload (core 2.4) =====")
for k,v in payload.items():
    print(f"  {k} ({len(v)}): {v[:200]!r}")
# the wording must be IDENTICAL to the ORIGINAL pre-write snapshot, tags aside
for f in ('custom_preconds','custom_steps','custom_expected'):
    a,b=norm_words(pre[f]), norm_words(payload[f])
    assert a==b, f"WORDING CHANGED in {f}\n ORIG: {a[:200]}\n NEW : {b[:200]}"
    assert '\n' not in re.sub(r'<br>\n','',payload[f]) or '<br>' in payload[f]
print("  [PASS] wording identical to the ORIGINAL pre-write snapshot in all three fields (tags aside)")
assert '<' not in payload['title']
assert 'Last checked 8/21/2026' in payload['custom_expected']
print("  [PASS] title untouched, marker date still 8/21/2026")

ts=datetime.datetime.now(datetime.timezone.utc).isoformat()
print(f"\n===== SENDING repair update_case/{CID} at {ts} =====")
st,_=call(f'update_case/{CID}', payload)
print("HTTP",st)
if st!=200: sys.exit(1)

st2,after=call(f'get_case/{CID}')
def collapses(t):
    t=t or ''
    return '\n' in t.strip() and '<p' in t.lower() and '<br' not in t.lower()
checks=[
 ("title unchanged",            after['title']==live['title']),
 ("refs unchanged",             (after.get('refs') or '')==(live.get('refs') or '')),
 ("preconds wording preserved", norm_words(after.get('custom_preconds'))==norm_words(pre['custom_preconds'])),
 ("steps wording preserved",    norm_words(after.get('custom_steps'))==norm_words(pre['custom_steps'])),
 ("expected wording preserved", norm_words(after.get('custom_expected'))==norm_words(pre['custom_expected'])),
 ("preconds no longer collapses", not collapses(after.get('custom_preconds'))),
 ("steps no longer collapses",    not collapses(after.get('custom_steps'))),
 ("expected no longer collapses", not collapses(after.get('custom_expected'))),
 ("exactly ONE provenance block", (after.get('custom_expected') or '').count('This is the expected behaviour as per')==1),
 ("exactly ONE AUTOMATION marker",(after.get('custom_expected') or '').count('AUTOMATION:')==1),
 ("marker date still 8/21/2026", 'Last checked 8/21/2026' in (after.get('custom_expected') or '')),
 ("atmstatus unchanged",         after.get('custom_atmstatus')==pre.get('custom_atmstatus')),
 ("section unchanged",           after.get('section_id')==pre.get('section_id')),
]
print("\n===== POST-REPAIR VERIFICATION =====")
ok=True
for n_,r_ in checks:
    print(f"  [{'PASS' if r_ else 'FAIL'}] {n_}")
    ok=ok and r_
print("\nRESULT:","REPAIR VERIFIED" if ok else "*** STILL WRONG — stop and report ***")
json.dump(after,open('build/build-verify-session-2026-08-21/snapshots/POST-REPAIR-C44864.json','w'),indent=1)
print("\nfinal stored values:")
for f in ('custom_preconds','custom_steps'):
    print(f"  {f}: {(after.get(f) or '')[:180]!r}")
sys.exit(0 if ok else 1)
