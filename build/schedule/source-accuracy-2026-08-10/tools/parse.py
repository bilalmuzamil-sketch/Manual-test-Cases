import json, re
from cases import ours, prov
FLT_VER = re.compile(r'Filters specification at Confluence version (\d+)')
FLT_VER2= re.compile(r'Filters specification version (\d+)')
SCH_VER = re.compile(r'Schedule specification version (\d+)')
ANCH_S  = re.compile(r'S\d+[A-Za-z]?-[A-Z]+\d+[a-z]?')
ANCH_SEC= re.compile(r'§\s*(\d+(?:\.\d+)*)')
REFS_V  = re.compile(r'spec v(\d+)')

def parse(root):
    out=[]
    for c in ours(root):
        h,t = prov(c)
        line = h[0] if h else ''
        refs = c.get('refs') or ''
        rec = {
            'cid': c['id'], 'title': c['title'], 'section_id': c['section_id'],
            'prov_line': line, 'refs': refs,
            'prov_ver': None, 'refs_ver': sorted(set(REFS_V.findall(refs))),
            'anchors_prov_S': sorted(set(ANCH_S.findall(line))),
            'anchors_prov_sec': sorted(set(ANCH_SEC.findall(line))),
            'anchors_refs_S': sorted(set(ANCH_S.findall(refs))),
            'anchors_refs_sec': sorted(set(ANCH_SEC.findall(refs))),
            'expected_full': t,
        }
        m = FLT_VER.search(line) or FLT_VER2.search(line) or SCH_VER.search(line)
        if m: rec['prov_ver']=m.group(1)
        out.append(rec)
    return out
if __name__=='__main__':
    import collections
    for root,name in ((4110,'Filters'),(4254,'Schedule')):
        P=parse(root)
        json.dump(P, open(f'parsed-{name}.json','w'), indent=1)
        print('=',name,len(P))
        print('  prov version:', dict(collections.Counter(r['prov_ver'] for r in P)))
        print('  refs version:', dict(collections.Counter(tuple(r['refs_ver']) for r in P)))
        na=[r['cid'] for r in P if not (r['anchors_prov_S'] or r['anchors_prov_sec'])]
        print('  cases with NO anchor in provenance line:', len(na), na[:15])
