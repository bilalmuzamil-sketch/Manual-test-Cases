"""needs_map.py — 10 Nov 2026. Read the 380 aging-report cases (sources/cases.json) and tag what each one needs before it can run:
roles, seeded records, exports, dark mode, narrow windows, network blocking, a second location, Ctrl-click, keyboard. Writes needs-map.json
and prints counts per need and per section, so set-up work can be batched before execution starts. Read only."""
import json, re, html, os
from collections import Counter, defaultdict
HERE = os.path.dirname(os.path.abspath(__file__)); d = json.load(open(os.path.join(HERE, 'sources/cases.json')))
T = lambda v: re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', v or ''))).strip()
NEEDS = {
 'role: no Reports page access': r'without Reports|Time Clock (role|User)|no Reports (page )?access',
 'role: no AP/AR data': r'View and Manage AP/AR',
 'role: no Customers view': r'without Customers|Customers → View',
 'role: no document permissions': r'Invoicing (&|and) [Pp]ayments|Part [Ss]ales → View|Vendor (and|Order) (order )?[Mm]anagement',
 'second location / Switch location': r'Switch location|another location|second location|location the (admin|user) is not',
 'PDF export': r'PDF', 'CSV export': r'CSV',
 'dark mode': r'[Dd]ark', 'narrow window / px width': r'\b\d{3,4} ?px\b',
 'network blocking (errors)': r'[Nn]etwork request blocking|[Bb]lock(ed)? (the )?request|Something went wrong',
 'names sort set (#1 Diesel, Émile…)': r'#1 Diesel|Émile|Øster|@Home Towing|A-1 Towing',
 'same-date / evening invoices': r'same (date|day)|evening|after (about )?6',
 'credit/deposit dated today or yesterday': r'(credit memo|deposit|vendor credit)[^.]{0,60}(today|yesterday|as-of)',
 'vendor return credit': r'vendor return',
 'bill due in the future (negative past due)': r'-10\b|not yet due|due in \d+ days',
 'customer phone / credit term': r'Credit [Tt]erm|Phone',
 '100+ documents (windows)': r'100 documents|more than 100|101',
 'long document number': r'longer than 20|long document number|…',
 'Ctrl-click / new tab': r'Ctrl|new tab|middle-click',
 'keyboard / screen reader': r'Tab key|keyboard|screen reader|Enter\b|aria',
 'As of date change': r'As of',
 'large data / PDF over 2,000 lines': r'2,000|too large for PDF',
 'production after release': r'[Pp]roduction',
}
out = {}; per = Counter(); persec = defaultdict(Counter)
for c in d['cases']:
    txt = ' '.join(T(c.get(k)) for k in ('title', 'custom_preconds', 'custom_steps', 'custom_expected'))
    pre = ' '.join(T(c.get(k)) for k in ('title', 'custom_preconds', 'custom_steps'))
    tags = [n for n, rx in NEEDS.items() if re.search(rx, pre)]
    out[c['id']] = {'title': c['title'], 'section': d['sections'][str(c['section_id'])], 'needs': tags}
    for t in tags: per[t] += 1; persec[d['sections'][str(c['section_id'])]][t] += 1
json.dump(out, open(os.path.join(HERE, 'needs-map.json'), 'w'), indent=1, ensure_ascii=False)
print('needs across 380 tests (from title + set-up + steps):'); [print(f'  {v:4} {k}') for k, v in per.most_common()]
print('no special need:', sum(1 for v in out.values() if not v['needs']))
