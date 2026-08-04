import sys, json, os
sys.path.insert(0,'/tmp/report-suite-viu/rc')
import sess
EV = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'evidence')
def save(name, obj):
    p=os.path.join(EV,name); os.makedirs(os.path.dirname(p),exist_ok=True)
    if isinstance(obj,(bytes,bytearray)): open(p,'wb').write(obj)
    else: open(p,'w').write(obj if isinstance(obj,str) else json.dumps(obj,indent=1))
    return p
def rep(slug,q): return sess.get(f'/api/reporting/reports/{slug}?{q}')
def exp(slug,q,raw=True): return sess.get(f'/api/reporting/reports/{slug}/export?{q}',raw=raw)
