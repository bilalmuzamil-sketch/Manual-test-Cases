import sys,re,json
sys.path.insert(0,'/tmp/qa11685/w'); from parse import parse
def shape(j):
    return {'title':bool(j['title']),'sub':bool(j['sub']),'scope':bool(j['scope']),
            'labor':[('DESC' if l[1] else '-', 'H' if l[2] else '-', 'R' if l[3] else '-', 'A' if l[4] else '-') for l in j['labor']],
            'parts':len([o for o in j['other'] if o[0]=='Parts']),'total':bool(j['total'])}
for v in ['S0','S1','S2','S3']:
  for dec in [1,0]:
    print(f'=== {v} includeDeclined={dec}')
    for env in ['prod','branch']:
        jobs=parse(f'var-{env}/modern-{v}-decl{dec}.html')
        print(' ',env.ljust(6),' | '.join(f"{j['no'] or 'D'}:{''.join(''.join(x) for x in shape(j)['labor'])}{'' if j['labor'] else 'noLabor'} p{shape(j)['parts']}" for j in jobs))
        for j in jobs:
            for l in j['labor']:
                if l[1]: print('     desc text:',repr(l[1][:60]),'| title:',repr(j['title'][:60]), '| same' if l[1].strip()==j['title'].strip() else '| DIFFERENT')
