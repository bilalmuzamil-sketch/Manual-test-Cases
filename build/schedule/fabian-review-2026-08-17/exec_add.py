#!/usr/bin/env python3
"""Push the 19 new Fabian-review cases via add_case, Rule-50 byte-verified.
Sends custom_preconds+custom_steps+custom_expected+refs+title; custom_atmstatus=1 (never 3).
Re-GETs each created case and byte-compares every sent field; asserts atmstatus==1.
Writes per-op oplog; updates the local JSON with testrail_case_id."""
import sys, json, os, datetime, time
sys.path.insert(0, '/tmp/testrail')
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr
from testrail_add_case import add_case_payload

HERE = os.path.dirname(__file__)
JSON = os.path.normpath(os.path.join(HERE, '..', 'cases', 'cases-J-fabian-review-2026-08-17.json'))
OPLOG = os.path.join(HERE, 'oplog-add.jsonl')
cases = json.load(open(JSON))

def log(rec):
    with open(OPLOG, 'a') as f:
        f.write(json.dumps(rec) + '\n'); f.flush()

TEXT = {'title':'title','refs':'refs','preconditions':'custom_preconds',
        'steps':'custom_steps','expected':'custom_expected'}

def run(start, end):
    for c in cases[start:end]:
        if c.get('testrail_case_id'):
            print(f"SKIP {c['id']} already C{c['testrail_case_id']}"); continue
        payload = add_case_payload(
            title=c['title'], refs=c['refs'],
            preconds=c['preconditions'], steps=c['steps'], expected=c['expected'])
        sid = c['section_id']
        t0 = datetime.datetime.utcnow().isoformat()+'Z'
        log({'op':'add_case','iid':c['id'],'section':sid,'intent':t0})
        st, body = tr.api(f"add_case/{sid}", "POST", payload)
        if st not in (200,201) or not isinstance(body, dict) or 'id' not in body:
            log({'op':'add_case','iid':c['id'],'http':st,'result':'FAILED','body':str(body)[:300]})
            raise SystemExit(f"ADD FAILED {c['id']} HTTP {st}: {str(body)[:300]}")
        cid = body['id']
        # Rule 50: re-GET and byte-compare each sent field
        st2, live = tr.get_case(cid)
        if st2 != 200: raise SystemExit(f"re-GET C{cid} HTTP {st2}")
        bad = []
        for src, fld in TEXT.items():
            want = c[src]
            got = live.get(fld)
            if fld == 'refs':
                norm = lambda s: ",".join(p.strip() for p in (s or '').split(","))
                if norm(want) != norm(got): bad.append(f"{fld}: want={want!r} got={got!r}")
            else:
                if want != got: bad.append(f"{fld}: MISMATCH len want={len(want)} got={len(got or '')}")
        if live.get('custom_atmstatus') != 1:
            bad.append(f"custom_atmstatus={live.get('custom_atmstatus')} (must be 1)")
        if bad:
            log({'op':'verify','iid':c['id'],'cid':cid,'result':'BYTE-MISMATCH','bad':bad})
            raise SystemExit(f"BYTE VERIFY FAILED {c['id']} C{cid}:\n" + "\n".join(bad))
        c['testrail_case_id'] = cid
        log({'op':'add_case','iid':c['id'],'cid':cid,'http':st,'atmstatus':1,
             'verify':'MATCH 5 fields','ts':datetime.datetime.utcnow().isoformat()+'Z'})
        print(f"OK {c['id']} -> C{cid}  (5 fields byte-match, atmstatus=1)")
        # persist id back to JSON after each write (resumability)
        json.dump(cases, open(JSON,'w'), indent=1, ensure_ascii=False)
        time.sleep(0.3)

if __name__ == '__main__':
    a = int(sys.argv[1]) if len(sys.argv)>1 else 0
    b = int(sys.argv[2]) if len(sys.argv)>2 else len(cases)
    run(a, b)
    print(f"DONE batch [{a}:{b}]")
