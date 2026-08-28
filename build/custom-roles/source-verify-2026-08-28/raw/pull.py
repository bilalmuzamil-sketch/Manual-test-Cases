import json,urllib.request,base64,os,sys
auth=open('/tmp/tr.auth').read().strip()
B='https://shopview.testrail.io/index.php?/api/v2/'
hdr={'Content-Type':'application/json','Authorization':'Basic '+base64.b64encode(auth.encode()).decode()}
def get(p):
    r=urllib.request.Request(B+p,headers=hdr)
    return json.load(urllib.request.urlopen(r))
out=sys.argv[1]; kind=sys.argv[2]
off=0; all_=[]
while True:
    d=get('%s&limit=250&offset=%d'%(kind,off))
    chunk=d[ 'cases' if 'cases' in d else 'sections']
    all_+=chunk
    print('offset',off,'got',len(chunk),'size',d.get('size'),file=sys.stderr)
    if not d.get('_links',{}).get('next'): break
    off+=250
json.dump(all_,open(out,'w'))
print('TOTAL',len(all_),file=sys.stderr)
