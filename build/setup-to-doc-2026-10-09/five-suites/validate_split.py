import json, re, sys, unicodedata
D = 'build/setup-to-doc-2026-10-09/five-suites'
src = {c['id']: c for c in json.load(open(f'{D}/eligible.json'))}
out = json.load(open(f'{D}/split.json'))
def n(s): return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip()
probs = []
if [o['id'] for o in out] != [c['id'] for c in json.load(open(f'{D}/eligible.json'))]: probs.append('ids/order differ from input')
for o in out:
    c = src.get(o['id']); orig = n(' '.join(c['items'])) if c else ''
    if not o.get('change'):
        if o.get('preconditions') or o.get('setup'): probs.append(f"C{o['id']}: change false but lists not empty")
        continue
    if not o.get('preconditions') or not o.get('setup'): probs.append(f"C{o['id']}: empty list")
    for s in o['setup']:
        if n(s) not in orig: probs.append(f"C{o['id']}: setup entry not verbatim: {s[:80]}")
    pre = ' '.join(o['preconditions'])
    if re.search(r'If not|->|→| > |quick-login|top menu|click ', pre, re.I): probs.append(f"C{o['id']}: how-to left in preconditions: {pre[:100]}")
    for tok in set(re.findall(r'"[^"]+"|“[^”]+”|\$?\d[\d,.]*', pre)):
        if tok.strip('"“”') not in orig: probs.append(f"C{o['id']}: value not in original: {tok}")
    # coverage: long words of the original appear in preconditions or setup
    allnew = n(pre + ' ' + ' '.join(o['setup'])).lower()
    miss = [w for w in set(re.findall(r'[A-Za-z][A-Za-z\-]{5,}', orig)) if w.lower() not in allnew]
    if len(miss) > 3: probs.append(f"C{o['id']}: words missing from both lists: {sorted(miss)[:8]}")
for p in probs: print('PROBLEM', p)
print('OK' if not probs else f'{len(probs)} problems', '· change true:', sum(1 for o in out if o.get('change')), '· false:', sum(1 for o in out if not o.get('change')))
