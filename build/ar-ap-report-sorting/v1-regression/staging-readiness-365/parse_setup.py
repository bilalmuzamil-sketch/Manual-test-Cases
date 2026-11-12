#!/usr/bin/env python3
"""Turns each case's own Setup list (TestRail, run 557) into seedable records - the case text is the source (Rule 112).
Input: a JSON of the cases ({cid: {pre, ...}}) fetched read-only from TestRail. Output: manifest-r365.json (parties in
the same schema as ../live-run-2026-11-11/tools/manifest.json, plus 'serves') and parse-report.json (every Setup line
and what it became; anything not understood is listed, never guessed).
    python3 parse_setup.py <cases365.json>"""
import json, re, sys, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
cases = json.load(open(sys.argv[1]))
def money(s): return float(s.replace(',', ''))
def when(l, field):
    m = re.search(r"[Tt]ype (today's date|the date (\d+) days? before today|yesterday's date) in " + field, l) or \
        re.search(field + r" (\d+) days? before today", l)
    if not m:
        if re.search(r"Leave " + field + r" as today", l): return 0
        return None
    g = m.group(1)
    if g.startswith("today"): return 0
    if g.startswith("yesterday"): return 1
    return int(m.group(2) if m.lastindex and m.lastindex >= 2 and m.group(2) else re.search(r'(\d+)', g).group(1))
def loc(l):
    if re.search(r'[Ww]hile switched to location B|at location B[:,]|location B\)', l): return 'B'
    if re.search(r'[Ww]hile switched to location C|at location C[:,]', l): return 'C'
    return 'A'
parties, report, extra = {}, {}, collections.defaultdict(list)
def P(cid, kind, X): return parties.setdefault(f'{cid}{kind[0].upper()}{X}', {'key': f'{cid}{kind[0].upper()}{X}', 'kind': kind, 'X': X, 'docs': [], 'serves': [f'C{cid}']})
for cid, c in cases.items():
    parts = re.split(r'\n\s*Setup\s*\n', c['pre'], maxsplit=1)
    if len(parts) < 2: continue
    rep = report.setdefault(cid, {'ok': [], 'not_seeded': [], 'unparsed': []})
    lines = [l.strip() for l in parts[1].split('\n') if l.strip()]
    last_party = {}; n = collections.Counter()
    for l in lines:
        head = l.split(':', 1)[0]
        m = re.match(r'^Make (customer|vendor) ([A-Z0-9]+):', l)
        if m:
            kind, X = m.groups(); p = P(cid, kind, X)
            nm = re.search(r'Type the Name (.+?), (?:type a Phone|pick Credit|then)', l)
            p['name'] = nm.group(1).split(' (more than')[0].split(' (a name')[0].strip() if nm else None
            t = re.search(r'Credit Terms "([^"]+)"', l); p['term'] = t.group(1) if t else None
            p['phone'] = not re.search(r'leave Phone empty', l)
            last_party[kind] = p; rep['ok'].append(head); continue
        m = re.match(r'^Make customers (\d+) to (\d+):', l)
        if m:
            base = P(cid, 'customer', '1')
            for i in range(int(m.group(1)), int(m.group(2)) + 1):
                q = P(cid, 'customer', str(i)); q.update({k: base.get(k) for k in ('term', 'phone')}); q['name'] = None
                q['docs'] = [dict(d, k=d['k']) for d in base['docs']]
            rep['ok'].append(head); continue
        m = re.match(r'^Make (\d+) more (invoices|bills) for (customer|vendor) ([A-Z0-9]+):', l) or re.match(r'^Make (bills) (\d+) to (\d+):', l)
        if m:
            if m.group(1) == 'bills':
                p = last_party['vendor']; cnt = int(m.group(3)) - int(m.group(2)) + 1
            else:
                cnt = int(m.group(1)); p = P(cid, m.group(3), m.group(4))
            a = re.search(r'Cost ([\d.,]+)', l); amt = money(a.group(1)) if a else 10.0
            ago = when(l, 'Invoice Date')
            for i in range(cnt):
                p['docs'].append({'k': f'many{i+1}', 'type': 'invoice' if p['kind'] == 'customer' else 'bill', 'amount': amt if a else 10.0 + i, 'ago': ago, 'at': 'A'})
            rep['ok'].append(head); continue
        m = re.match(r'^Make vendor credit ([A-Z0-9]+): Make vendor credit [A-Z0-9]+ for vendor ([A-Z0-9]+) without a vendor return', l)
        if m:
            p = P(cid, 'vendor', m.group(2))
            p['docs'].append({'k': 'vcdirect' + m.group(1), 'type': 'vendor_credit_direct', 'amount': 23.45, 'ago': 0, 'at': 'A',
                              'label': f'vendor credit {m.group(1)}', 'note': 'entered directly; the API dates it at the moment it is made'})
            rep['ok'].append(head); continue
        m = re.match(r'^Make (?:(?:work order |part sale )?invoice|document|bill|credit memo|deposit|vendor credit|a bill)\b([^:]*):', l)
        if m:
            label = head[5:]
            body = l.split(':', 1)[1]
            pm = re.search(r"(?:for|on|On|Pick|pick|with) (customer|vendor) ([A-Z0-9]+)(?:'s page| in Vendor|\b)", l)
            ref = re.match(r'\s*(?:While switched to location [A-Z] \(see the Locations to use item\): )?Same way as ([a-z ]+ [A-Z0-9]+)', body)
            refdoc = [d for q in parties.values() if q['serves'] == [f'C{cid}'] for d in q['docs'] if ref and d.get('label', '').split(' for ')[0] == ref.group(1)]
            if refdoc and refdoc[0]['type'] in ('bill', 'vendor_credit', 'credit_memo', 'invoice'):
                body = {'bill': 'New PO', 'vendor_credit': 'Returns', 'credit_memo': 'Issue Credit', 'invoice': 'New Work Order'}[refdoc[0]['type']] + ' ' + body
            if 'New PO' in body or 'Same way as bill' in body or label.startswith('bill') or label.startswith('a bill'):
                typ = 'bill'
            elif 'Returns' in body or 'Same way as vendor credit' in body: typ = 'vendor_credit'
            elif 'Issue Credit' in body or 'Same way as credit memo' in body: typ = 'credit_memo'
            elif 'Add Deposit' in body: typ = 'deposit'
            elif 'Part Sales' in body or label.startswith('part sale'): typ = 'part_sale_invoice'
            else: typ = 'invoice'
            kind = 'vendor' if typ in ('bill', 'vendor_credit') else 'customer'
            p = P(cid, pm.group(1), pm.group(2)) if pm else last_party.get(kind)
            if p is None: rep['unparsed'].append(l[:200]); continue
            n[label] += 1; k = re.sub(r'\W+', '', label)[:20] or f'd{len(p["docs"])}'
            d = {'k': k, 'at': loc(l), 'label': label}
            if typ == 'invoice':
                a = re.search(r'type ([\d.,]+) in Fixed Line Total|Fixed Line Total ([\d.,]+)', l)
                d.update(type='invoice', amount=money(a.group(1) or a.group(2)) if a else None, ago=when(l, 'Invoice Date'))
            elif typ == 'part_sale_invoice':
                a = re.search(r'type ([\d.,]+) in the Sell Price', l)
                d.update(type='part_sale_invoice', amount=money(a.group(1)) if a else None, ago=when(l, 'Invoice Date'))
            elif typ == 'bill':
                a = re.search(r'1 in Quantity and ([\d.,]+) in Cost|Cost ([\d.,]+)', l)
                d.update(type='bill', amount=money(a.group(1) or a.group(2)) if a else None, ago=when(l, 'Invoice Date'))
            elif typ == 'vendor_credit':
                a = re.search(r'([\d.,]+) in Price Per Unit|Price Per Unit ([\d.,]+)', l)
                d.update(type='vendor_credit', amount=money(a.group(1) or a.group(2)) if a else None, ago=when(l, 'Credit Date'))
            elif typ == 'credit_memo':
                a = re.search(r'type ([\d.,]+) in Amount|Amount ([\d.,]+)', l)
                d.update(type='credit_memo', amount=money(a.group(1) or a.group(2)) if a else None, ago=when(l, 'Credit Date'))
            elif typ == 'deposit':
                dep = re.search(r'type ([\d.,]+) in Deposit Amount', l); line = re.search(r'type ([\d.,]+) in Fixed Line Total', l)
                rest = re.search(r'the rest, ([\d.,]+), stays as an unused deposit dated (today|the date (\d+) days before today)', l)
                d.update(type='free_deposit', amount=money(rest.group(1)) if rest else None,
                         ago=0 if rest and rest.group(2) == 'today' else (int(rest.group(3)) if rest and rest.group(3) else when(l, 'Invoice Date')),
                         note=f'Setup makes it as a work-order deposit of {dep and dep.group(1)} less a {line and line.group(1)} invoice; seeded as the resulting unused deposit')
            if d.get('ago') is None and re.search(r'[Tt]ype date A in (Invoice|Credit) Date', l) and re.search(r'from the 1st to the 9th of a month', parts[0]):
                d['ago_rule'] = 'day5_of_month'; d['ago'] = 'rule'
            if d.get('amount') is None or d.get('ago') is None:
                rep['unparsed'].append(l[:240]); continue
            p['docs'].append(d); rep['ok'].append(head); continue
        m = re.match(r'^Pay \$([\d.,]+) of (invoice|bill) ([A-Z0-9]+)(?: at location ([A-Z]))?:', l)
        if m:
            p = last_party['customer' if m.group(2) == 'invoice' else 'vendor']
            target = [d for d in p['docs'] if d.get('label') in (f'{m.group(2)} {m.group(3)}', f'{m.group(2)} {m.group(3)} for {p["kind"]} {p["X"]}')]
            if not target: rep['unparsed'].append(l[:200]); continue
            p['docs'].append({'k': 'pay' + target[0]['k'], 'type': 'payment' if p['kind'] == 'customer' else 'vpayment', 'on': target[0]['k'],
                              'amount': money(m.group(1)), 'ago': 0, 'at': m.group(4) or 'A', 'label': head[4:]})
            rep['ok'].append(head); continue
        if re.match(r'^(Locations to use|Date A|Sign in|Make the role|Make location C|Make a work order at location B)', l):
            rep['not_seeded'].append(head); extra[head.split(':')[0]].append(cid); continue
        rep['unparsed'].append(l[:240])
# one record per literal name: the same name made by several cases' Setup lists (e.g. the long-name customer, 23
# cases) is ONE customer or vendor holding the union of their documents - 23 identically named customers would make
# 'which one is ours' unanswerable (Rule 110 identity). Identical documents (type, amount, age, location) are kept once.
byname = {}
for key in list(parties):
    p = parties[key]
    if not p.get('name'): continue
    first = byname.setdefault((p['kind'], p['name']), p)
    if first is p: continue
    sig = {(d['type'], d['amount'], d['ago'], d['at']) for d in first['docs']}
    for d in p['docs']:
        if (d['type'], d['amount'], d['ago'], d['at']) not in sig or d['k'].startswith('many'):
            first['docs'].append(dict(d, k=f"{d['k']}_{key}")); sig.add((d['type'], d['amount'], d['ago'], d['at']))
    first['serves'] = sorted(set(first['serves']) | set(p['serves']))
    del parties[key]
# names for parties the case leaves to the tester ("a new Name"): A < B < C order kept, tagged, one universe word
for p in parties.values():
    if not p.get('name'):
        p['name'] = f"ZZAUTOTEST R365 {p['key'][:-len(p['X'])-1]} {'Cust' if p['kind']=='customer' else 'Vend'} {p['X'].zfill(2) if p['X'].isdigit() else p['X']}"
cust = [p for p in parties.values() if p['kind'] == 'customer']; vend = [p for p in parties.values() if p['kind'] == 'vendor']
json.dump({'_why': 'Records the Setup lists of the run-557 tests ask for, parsed from the case text (parse_setup.py). ago = days before the anchor at the record\'s own location; term from the Setup (Net 30). Names: the case\'s own literal name where it gives one, otherwise ZZAUTOTEST R365 <case> <Cust|Vend> <letter>.',
           'customers': cust, 'vendors': vend}, open(os.path.join(HERE, 'manifest-r365.json'), 'w'), indent=1, ensure_ascii=False)
json.dump({'per_case': report, 'not_seeded_kinds': {k: sorted(set(v)) for k, v in extra.items()}}, open(os.path.join(HERE, 'parse-report.json'), 'w'), indent=1, ensure_ascii=False)
unp = {c: r['unparsed'] for c, r in report.items() if r['unparsed']}
print(f'setup cases {len(report)} | parties {len(cust)} customers, {len(vend)} vendors | docs {sum(len(p["docs"]) for p in parties.values())} | cases with unparsed lines {len(unp)}')
print(collections.Counter(d['type'] for p in parties.values() for d in p['docs']))
print({k: len(set(v)) for k, v in extra.items()})
for c, u in list(unp.items())[:12]: print(c, u)
