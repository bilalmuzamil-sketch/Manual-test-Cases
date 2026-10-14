import hashlib,os,sys
def tab(root):
    d={}
    for dp,dn,fn in os.walk(root):
        for f in fn:
            p=os.path.join(dp,f); r=os.path.relpath(p,root)
            d[r]=(os.path.getsize(p),hashlib.md5(open(p,'rb').read()).hexdigest())
    return d
n=tab(sys.argv[1]); o=tab(sys.argv[2])
for k in sorted(set(n)|set(o)):
    if k in n and k in o:
        st='SAME' if n[k][1]==o[k][1] else 'CHANGED'
    elif k in n: st='NEW'
    else: st='REMOVED'
    print(f"{st}\t{n.get(k,(0,''))[0]}\t{o.get(k,(0,''))[0]}\t{k}")
