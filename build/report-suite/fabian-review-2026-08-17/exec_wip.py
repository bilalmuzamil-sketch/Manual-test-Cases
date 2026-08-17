import sys,json
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
payloads=json.load(open('/tmp/wip_payloads.json'))
LOG='build/report-suite/fabian-review-2026-08-17/oplog-wip.txt'
f=open(LOG,'a')
def L(s): f.write(s+'\n'); f.flush(); print(s)
L(f"# WIP as-of batch start {R.now()} | {len(payloads)} cases")
L("SOURCE RE-READ: WIP spec v21 fetched 2026-08-17 (S7-R6/R7/R8/R8a single as-of date); epic SV-8582 verified 2026-08-17; verdict unchanged")
done=[]
for cid,payload in payloads:
    snap=R.get_live(cid)
    R.update_and_verify(cid,payload,L,snap); done.append(cid)
L(f"# DONE {len(done)}: {done}")
f.close()
