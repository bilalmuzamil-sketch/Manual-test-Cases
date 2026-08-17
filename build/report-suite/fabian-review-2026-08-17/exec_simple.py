import sys,json,datetime
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
sys.path.insert(0,'/tmp'); import tr
payloads=json.load(open('/tmp/simple_payloads.json'))  # list of [cid,payload]
LOG='build/report-suite/fabian-review-2026-08-17/oplog-simple.txt'
f=open(LOG,'a')
def L(s): f.write(s+'\n'); f.flush(); print(s)
L(f"# SIMPLE Labor-Delta batch start {R.now()} | {len(payloads)} cases")
L(f"SOURCE RE-READ: specs fetched 2026-08-17 (SBC v20/SBR v22/WIP v21); epic SV-8582 verified 2026-08-17; verdict unchanged")
done=[]
for cid,payload in payloads:
    snap=R.get_live(cid)  # fresh pre-write snapshot
    R.update_and_verify(cid,payload,L,snap)
    done.append(cid)
L(f"# DONE {len(done)} cases: {done}")
f.close()
