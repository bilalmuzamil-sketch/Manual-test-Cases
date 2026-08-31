#!/usr/bin/env python3
"""Tranche 2 of the step walks. Evidence appended to walk-evidence.json.

C44955  "Find the disclaimer text on each" -- pure inspection across every captured document.
C45169  "POST /api/work-orders/{wo}/authorizer ... directly (bypass the UI)" while a non-voided
        invoice exists -- the case EXPECTS a rejection, so the safe direction is to POST against a
        PAID work order and observe the refusal. If the API accepts it, that is a finding.
C45170  "POST authorizer_id = contact (a) / (b)" -- a contact that does not approve work, and one
        belonging to another customer. Both expected to be rejected.

These are writes ONLY in the sense that they attempt one; the expected outcome is refusal. Seeding
on this disposable QA branch is pre-authorised (QA lead, 2026-08-31: "Always"). Every non-GET call
made is printed so an unintended write is visible immediately (core 7.5).
"""
import json, urllib.request, re, os, datetime

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
API = 'https://sv8218api.qa.shopview.com'
COOK = open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip()
PAID_WO = '06747f14-bf1e-4c03-8358-732e78b0167d'      # S2-15522, paid -> has a non-voided invoice
EST_WO = None
non_get = []


def call(path, method='GET', body=None):
    r = urllib.request.Request(API + path, method=method,
                               data=json.dumps(body).encode() if body is not None else None)
    r.add_header('Cookie', COOK)
    if body is not None:
        r.add_header('Content-Type', 'application/json')
    if method != 'GET':
        non_get.append(f'{method} {path}')
    try:
        with urllib.request.urlopen(r, timeout=90) as x:
            return x.status, x.read().decode('utf-8', 'replace')[:400]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')[:400]
    except Exception as e:
        return 0, str(e)[:200]


ev = json.load(open(f'{DIR}/walk-evidence.json'))

# ---- C44955: the disclaimer on every captured document ----
man = json.load(open(f'{DIR}/documents-manifest.json'))
found = {}
for d in man['documents']:
    p = f"{DIR}/documents/{d['text_file']}"
    if not os.path.exists(p):
        continue
    t = open(p, encoding='utf-8').read().lower()
    found[f"{d['kind']}/{d.get('wo_number') or d.get('credit_number')}"] = {
        'disclaimer_present': 'warranties on the parts' in t,
        'has_heading_above_it': bool(re.search(r'(disclaimer|terms and conditions)\s*\n', t)),
    }
allp = all(v['disclaimer_present'] for v in found.values())
ev['C44955'] = {'step': 'Find the disclaimer text on each',
                'documents_checked': len(found), 'per_document': found,
                'disclaimer_on_every_document': allp,
                'any_heading_above_the_disclaimer': any(v['has_heading_above_it'] for v in found.values())}
print(f"WALK C44955 disclaimer on each     : {len(found)} documents, present on all = {allp}")
for k, v in found.items():
    print(f"     {k:<34} disclaimer={v['disclaimer_present']}  heading_above={v['has_heading_above_it']}")

# ---- C45169: does the authorizer route exist, and does it refuse on an invoiced work order? ----
probe = {}
for shape in (f'/api/work-orders/{PAID_WO}/authorizer',
              f'/api/work-orders/{PAID_WO}/set-authorizer'):
    st, b = call(shape)                      # GET first: 405 tells us the verb without writing
    probe[shape] = {'GET': {'status': st, 'body': b[:160]}}
    print(f"PROBE GET  {shape.split('/api')[1]:<52} -> {st}  {b[:90]}")
ev['C45169_route_probe'] = probe

json.dump(ev, open(f'{DIR}/walk-evidence.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nNON-GET CALLS THIS RUN (expect 0): {len(non_get)}')
for c in non_get:
    print('   ', c)
