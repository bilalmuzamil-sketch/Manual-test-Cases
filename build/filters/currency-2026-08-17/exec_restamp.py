#!/usr/bin/env python3
"""Byte-verified v19->v21 re-stamp of the 55 untouched Filters cases.
Sends all 3 text fields + refs + title (COMMON-CORE 2.1). tr.update_case_verified re-GETs and
byte-compares every field; raises on any mismatch (STOP the batch, Rule 50). Foreign guard:
refuses any case whose created_by != 3. Per-op oplog, resumable."""
import sys, os, json, datetime, time
sys.path.insert(0, '/tmp/testrail'); sys.path.insert(0, os.path.dirname(__file__))
import tr, restamp
HERE = os.path.dirname(__file__); OPLOG = os.path.join(HERE, 'oplog-restamp.jsonl')
ORDER = list(restamp.UNTOUCHED)
def log(r): open(OPLOG, 'a').write(json.dumps(r) + '\n')
def done_set():
    d = set()
    if os.path.exists(OPLOG):
        for ln in open(OPLOG):
            r = json.loads(ln)
            if r.get('op') == 'update_case' and r.get('verify'): d.add(r['cid'])
    return d
def run(a, b):
    done = done_set()
    for cid in ORDER[a:b]:
        if cid in done: print("SKIP C%d (verified)" % cid); continue
        payload, mt, om, nm, c = restamp.build_payload(cid)
        # foreign guard on live read
        st0, before = tr.get_case(cid)
        if before.get('created_by') != 3:
            raise SystemExit("REFUSE C%d created_by=%s FOREIGN" % (cid, before.get('created_by')))
        log({'op': 'update_case', 'cid': cid, 'mt': mt, 'intent': datetime.datetime.utcnow().isoformat() + 'Z'})
        st, line, bef, aft = tr.update_case_verified(cid, payload)
        log({'op': 'update_case', 'cid': cid, 'http': st, 'verify': line,
             'ts': datetime.datetime.utcnow().isoformat() + 'Z'})
        print("OK C%d [%s]: %s" % (cid, mt, line))
        time.sleep(0.25)
if __name__ == '__main__':
    a = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    b = int(sys.argv[2]) if len(sys.argv) > 2 else len(ORDER)
    print("total to restamp:", len(ORDER))
    run(a, b); print("DONE batch [%d:%d]" % (a, b))
