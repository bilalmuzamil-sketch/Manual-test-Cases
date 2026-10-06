import re,json,sys
def clean(t):
    t=t.replace('**','').replace('\\-','-').replace('\\<','<').replace('\\>','>').replace('\\[','[').replace('\\]',']').replace('\\_','_').replace('\\*','*')
    t=t.replace('->','→')
    return re.sub(r'\s+',' ',t).strip()
def parse(path):
    out={}
    for line in open(path,encoding='utf-8'):
        m=re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+):\s*\*\*\s*(.*)$',line) or re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+)\*\*:?\s*(.*)$',line) or re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+):\*\*\s*(.*)$',line)
        if m: out[m.group(1)]=clean(m.group(2))
    return out
if __name__=='__main__':
    o=parse('sources/CONFLUENCE-886931488-Chunk1-MR-2026-09-29.md'); n=parse('sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md')
    json.dump({'old':o,'new':n},open('source-update-2026-10-06/anchors-old-new.json','w'),indent=1)
    added=[a for a in n if a not in o]; removed=[a for a in o if a not in n]
    same=[a for a in n if a in o and n[a]==o[a]]; chg=[a for a in n if a in o and n[a]!=o[a]]
    print('old',len(o),'new',len(n),'added',len(added),'removed',len(removed),'same',len(same),'changed',len(chg))
    print('ADDED',added); print('REMOVED',removed)
    import difflib
    for a in chg:
        print('\n=== CHANGED',a); print('OLD:',o[a]); print('NEW:',n[a])
