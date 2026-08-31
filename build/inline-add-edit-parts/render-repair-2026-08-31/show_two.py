import json
d = json.load(open('build/inline-add-edit-parts/render-repair-2026-08-31/intended-blocks.json'))
for cid in ('45005', '45026'):
    r = d.get(cid)
    print('---', cid, r['iid'] if r else 'MISSING', '---')
    if r:
        print(r['fields']['custom_expected']['text'])
        print()
