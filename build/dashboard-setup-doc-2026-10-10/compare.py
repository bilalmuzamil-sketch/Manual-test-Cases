# Word-for-word check: the Google Doc's text (as returned by Drive read_file_content, saved to readback/C<id>.txt)
# against the HTML we uploaded (docs/C<id>.html). Markdown/list punctuation is ignored; every word and number must match.
import re,html,sys,os,json
D=os.path.dirname(os.path.abspath(__file__))
def words(s): return re.findall(r"[A-Za-z0-9$%]+",s)
res={}
for a in sys.argv[1:]:
    i=int(a); f=f'{D}/readback/C{i}.txt'
    if not os.path.exists(f): res[i]='NO READBACK'; continue
    src=html.unescape(re.sub(r'<[^>]+>',' ',open(f'{D}/docs/C{i}.html').read()))
    got=open(f).read()
    got=re.sub(r'\]\((https?://[^)]+)\)',']',got)      # Markdown link target (the HTML href is not text)
    got=got.replace('<!-- end list -->','')                 # list-end markers added by the export
    got=re.sub(r'(?m)^\s*\d+\.\s+','',got)               # list numbers added by the export
    got=got.replace('\\>','>').replace('\\_','_').replace('\\[','[').replace('\\]',']').replace('\\-','-')
    a1,b1=words(src),words(got)
    if a1==b1: res[i]='MATCH'
    else:
        k=next((n for n,(x,y) in enumerate(zip(a1,b1)) if x!=y),min(len(a1),len(b1)))
        res[i]=f'DIFF at word {k}: file {" ".join(a1[k-5:k+8])} || doc {" ".join(b1[k-5:k+8])} (lens {len(a1)}/{len(b1)})'
    print(i,res[i])
json.dump(res,open(f'{D}/readback/compare-{os.getpid()}.json','w'))
