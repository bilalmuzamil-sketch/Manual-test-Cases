"""Rewrite every case so its SOURCE line LEADS WITH V1 (Rule 109c).

32 cases opened "This is the expected behaviour as per epic SV-9160 and the V1 behaviour
recorded in ...". Every fact was present, but the sentence opens with a V2 artefact, so a
reader sees the epic first. The QA lead caught it; the audit tool missed it because it only
looked for the PRD wording, not the epic.

Nothing is deleted. The opening is restructured and one sentence is added putting the epic in
its place: it is the project this work belongs to, not the source of the expectation.
"""
import json, base64, urllib.request, ssl, re, html, datetime

cr = json.load(open('/tmp/testrail/creds.json'))
HOST = cr['host'].rstrip('/')
A = base64.b64encode(f"{cr['user']}:{cr['login_password'] or cr['password']}".encode()).decode()
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
H = {'Authorization': 'Basic ' + A, 'Content-Type': 'application/json'}

def api(p, d=None):
    r = urllib.request.Request(f"{HOST}/index.php?/api/v2/{p}",
        data=json.dumps(d).encode() if d is not None else None, headers=H)
    raw = urllib.request.urlopen(r, context=ctx, timeout=60).read()
    return json.loads(raw) if raw.strip() else {}

BANNER = ('<strong>SOURCE - THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION.</strong><br>'
          'This is the expected behaviour as per <strong>the V1 product itself</strong>: the ShopView '
          'product repository at commit <strong>55767168</strong>, ')
RULE = ('<br>For this V1 regression suite the shipped V1 product IS the specification (Standing Rule 109). '
        '<strong>Epic SV-9160 is the project this work belongs to, not the source of this expectation</strong>, '
        'and anything quoted below from the V2 requirements is context only - never the authority for this case.')

OLD = ('This is the expected behaviour as per epic SV-9160 and the V1 behaviour recorded in the '
       'ShopView code baseline 55767168 (')

st = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()

cases = []
for sec in (6769, 8056):
    r = api(f"get_cases/1&suite_id=1&section_id={sec}")
    cases += r['cases'] if isinstance(r, dict) else r

changed, skipped, failed = [], [], []
for c in sorted(cases, key=lambda x: x['id']):
    exp = c.get('custom_expected') or ''
    if 'SOURCE - THIS CASE IS TESTED AGAINST V1' in st(exp):
        skipped.append(c['id']); continue
    body_probe = st(exp)[:60]
    if OLD in exp:
        new = exp.replace(OLD, BANNER, 1)
        # put the rule sentence right after the closing bracket of the code citation
        i = new.find(BANNER) + len(BANNER)
        j = new.find(')', i)
        new = new[:j+1] + RULE + new[j+1:] if j > 0 else new + RULE
    else:
        # no "as per" sentence at all - prepend the banner to the provenance block
        k = exp.find('<p>---<br>')
        if k < 0: failed.append((c['id'], 'no provenance block')); continue
        new = exp[:k] + '<p>---<br>' + BANNER.replace(
            'the ShopView product repository at commit <strong>55767168</strong>, ',
            'the ShopView product repository at commit <strong>55767168</strong>. ') + RULE + '<br>' + exp[k+len('<p>---<br>'):]
    api(f"update_case/{c['id']}", {'custom_expected': new})
    rb = api(f"get_case/{c['id']}")
    s = st(rb['custom_expected'])
    prov = s.split('---', 1)[1] if '---' in s else s
    i1, i2 = prov.find('55767168'), prov.find('epic SV-9160')
    ok = ('SOURCE - THIS CASE IS TESTED AGAINST V1' in prov
          and '55767168' in prov
          and (i2 == -1 or i1 < i2)
          and body_probe in s)          # the case's own expected text survived
    (changed if ok else failed).append(c['id'] if ok else (c['id'], 'verify failed'))
    print(('OK   ' if ok else 'FAIL ') + f"C{c['id']}  {rb['title'][:58]}")

ts = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
json.dump({'when_utc': ts, 'rewritten': changed, 'already_correct': skipped, 'failed': failed},
          open(f'source-wording-audit-{ts}.json', 'w'), indent=1)
print(f"\nrewritten {len(changed)} | already correct {len(skipped)} | FAILED {len(failed)} {failed}")
