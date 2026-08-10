import json,re,sys
sc=json.load(open('scope-cases.json'))
MARKER_RE=re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$',re.M)
MARKUP=re.compile(r'<(?:ol|li|ul|p|hr|br|strong|em|div|span|table|tr|td)\b|&nbsp;|&lt;|&gt;',re.I)
rows=[]
for rep,cases in sc.items():
    for c in cases:
        pre=c.get('custom_preconds') or ''; st=c.get('custom_steps') or ''; ex=c.get('custom_expected') or ''
        mk=[f for f in ('preconds','steps','expected') if MARKUP.search({'preconds':pre,'steps':st,'expected':ex}[f])]
        provs=[l for l in ex.splitlines() if l.strip().startswith('This is the expected behaviour')]
        marks=MARKER_RE.findall(ex)
        last_is_marker = bool(ex.rstrip()) and ex.rstrip().splitlines()[-1].startswith('AUTOMATION:')
        rows.append(dict(rep=rep,cid=c['id'],title=c['title'],markup=mk,nprov=len(provs),nmark=len(marks),marker_last=last_is_marker,
                         refs=c.get('refs') or '', marker=marks[0] if marks else None))
json.dump(rows,open('census-pre.json','w'),indent=1)
from collections import Counter
print('cases', len(rows))
print('with markup:', sum(1 for r in rows if r['markup']))
for r in rows:
    if r['markup']: print('  MARKUP', r['rep'], 'C%d'%r['cid'], r['markup'])
print('nprov distribution', Counter(r['nprov'] for r in rows))
print('nmark distribution', Counter(r['nmark'] for r in rows))
print('marker not last:', [(r['rep'],r['cid']) for r in rows if not r['marker_last']])
print('markers', Counter((r['marker'] or 'NONE').split(' (')[0] for r in rows))
