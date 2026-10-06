import re,html,sys
def text(p):
    s=open(p,encoding='utf-8').read()
    s=re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S|re.I)
    s=re.sub(r'<style\b[^>]*>.*?</style>','',s,flags=re.S|re.I)
    s=re.sub(r'<svg\b.*?</svg>','',s,flags=re.S|re.I)
    # mark artboard ids
    s=re.sub(r'<(div|section)[^>]*\bdata-dc-artboard[^>]*\bid="([^"]+)"[^>]*>',r'\n##AB \2\n',s)
    s=re.sub(r'<[^>]+>','\n',s)
    out=[]
    for l in s.split('\n'):
        l=html.unescape(l).strip()
        l=re.sub(r'\s+',' ',l)
        if l: out.append(l)
    return out
if __name__=='__main__':
    for p,o in zip(sys.argv[1::2],sys.argv[2::2]):
        t=text(p); open(o,'w').write('\n'.join(t)); print(p,len(t))
