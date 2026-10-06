"""Collect every text the design drive exposed by interaction (tooltips, hover cards, native titles)
for the Chunk 1 and Demo boards, plus page texts, into one corpus used by build.py to verify design quotes."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(HERE, '..', 'DESIGN-DRIVE-2026-10-06')
out = []
for b in ['Chunk 1', 'Maintenance Reminders Demo']:
    for l in open(os.path.join(D, f'{b}-interactions.jsonl'), encoding='utf-8'):
        d = json.loads(l)
        for t in d.get('exposed_text') or []:
            out.append(t if isinstance(t, str) else json.dumps(t, ensure_ascii=False))
        if d.get('native_title_tooltip'): out.append(d['native_title_tooltip'])
        if d.get('label'): out.append(d['label'])
    out.append(open(os.path.join(D, f'{b}-pages.txt'), encoding='utf-8').read())
seen = []; s = set()
for t in out:
    if t not in s: s.add(t); seen.append(t)
os.makedirs(os.path.join(HERE, 'work'), exist_ok=True)
open(os.path.join(HERE, 'work', 'drive_corpus.txt'), 'w').write('\n'.join(seen))
print(len(seen), 'distinct exposed texts')
