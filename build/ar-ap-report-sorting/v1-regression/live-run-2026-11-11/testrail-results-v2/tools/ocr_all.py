import json,glob,os,sys
from rapidocr_onnxruntime import RapidOCR
E='/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/evidence/'
out=sys.argv[1]; cache=json.load(open(out)) if os.path.exists(out) else {}
o=RapidOCR()
for f in sorted(glob.glob(E+'V1R-*.png')):
    n=os.path.basename(f)
    if n in cache: continue
    r,_=o(f)
    cache[n]=[[int(min(p[0] for p in b)),int(min(p[1] for p in b)),int(max(p[0] for p in b)),int(max(p[1] for p in b)),t] for b,t,s in (r or [])]
    json.dump(cache,open(out,'w'))
print('done',len(cache))
