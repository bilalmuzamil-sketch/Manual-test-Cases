import re,json,sys
def clean(s):
    s=s.replace('**','').replace('\\','').replace('`','').replace('->','→')
    return re.sub(r'\s+',' ',s).strip()
def anchors(path):
    out={}
    for line in open(path,encoding='utf-8'):
        m=re.match(r'^\s*[-*] \*\*(S\d+-[RNE]\d+):\s*\*\*\s*(.*)$',line.rstrip('\n'))
        if m: out[m.group(1)]=clean(m.group(2))
    return out
if __name__=='__main__':
    a=anchors(sys.argv[1]); json.dump(a,open(sys.argv[2],'w'),indent=0,ensure_ascii=False); print(len(a))
