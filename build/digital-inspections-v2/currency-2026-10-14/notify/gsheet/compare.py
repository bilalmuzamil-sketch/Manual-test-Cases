import json,sys,re
exp=json.load(open(sys.argv[1].rsplit("/",1)[0]+"/expected.json")) if False else json.load(open("gsheet/expected.json"))
got=json.load(open(sys.argv[1])); tab=sys.argv[2]
vals=got.get("values",[])
bad=0; E=exp[tab]
for rn,row in E.items():
    g=vals[int(rn)-1] if int(rn)-1 < len(vals) else []
    for c,v in enumerate(row):
        gv=g[c] if c<len(g) else ""
        if v=="<FORMULA>": 
            if not re.fullmatch(r"\d+",gv): print("formula?",tab,rn,c,gv); bad+=1
            continue
        if v!=gv:
            bad+=1
            if bad<6: print("DIFF",tab,"row",rn,"col",c+1,"\n exp:",v[:200],"\n got:",gv[:200])
print(tab,"rows",len(E),"mismatches",bad)
