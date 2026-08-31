import json, sys
p = sys.argv[1] if len(sys.argv) > 1 else 'build/inline-add-edit-parts/render-repair-2026-08-31/scan-1.json'
d = json.load(open(p))
esc = [c for c in d if d[c]['anyEscaping']]
atm3 = [c for c in d if d[c]['atm'] == 3]
atmvals = {}
for c in d:
    atmvals[d[c]['atm']] = atmvals.get(d[c]['atm'], 0) + 1
print('total', len(d), 'escaping', len(esc), 'atm3', atm3, 'atm distribution', atmvals)
# literal-tag but fr-view (edge: fr-view container yet literal visible)
litfr = []
for c in d:
    for f, v in d[c]['fields'].items():
        if v.get('present') is not False and v.get('frview') and v.get('literal'):
            litfr.append((c, f))
print('fr-view-but-literal:', litfr)
# detail for the two automated
for cid in ('45005', '45026'):
    print('---', cid, 'atm', d[cid]['atm'], 'escaping', d[cid]['anyEscaping'], '---')
    for f, v in d[cid]['fields'].items():
        print('  ', f, v)
# repair target set = escaping UNION {45005,45026}
targets = sorted(set(esc) | {'45005', '45026'}, key=int)
print('REPAIR TARGETS', len(targets))
json.dump(targets, open('build/inline-add-edit-parts/render-repair-2026-08-31/targets.json', 'w'))
