import json,glob,os,sys
sys.path.insert(0,'.')
from adf import to_text
os.makedirs('../ticket-text', exist_ok=True)
for p in sorted(glob.glob('../snapshots/SV-*.json')):
    k = os.path.basename(p)[:-5]
    d = json.load(open(p))
    t = to_text(d['fields'].get('description') or {})
    open(f'../ticket-text/{k}.txt','w').write(f"# {k} — {d['fields']['summary']}\n# parent: {(d['fields'].get('parent') or {}).get('key')}\n\n"+t)
print('done', len(glob.glob('../ticket-text/*.txt')))
