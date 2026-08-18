"""Execute the 3 demark + currency writes. Per-op oplog (INTENT before, OUTCOME after), byte-verify
field-by-field vs intended payload, prove untouched fields byte-identical to snapshot, STOP on any
mismatch (§2.2/2.3/2.9). refs compared under the declared comma-normalisation (§3.2)."""
import sys, json, datetime
sys.path.insert(0, '/tmp'); import tr
import build_payloads as B

def now(): return datetime.datetime.utcnow().isoformat() + 'Z'
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))

UNTOUCHED = ['title', 'section_id', 'type_id', 'custom_atmstatus', 'created_by', 'updated_by']
OPLOG = open('oplog.txt', 'a')
def log(m): OPLOG.write(m + '\n'); OPLOG.flush(); print(m)

def main():
    snap = {c['id']: c for c in json.load(open('snap_before.json'))}
    results = {}
    for cid in (30458, 30588, 30606):
        live = snap[cid]
        pay, meta = B.build(cid, live)
        assert all(meta['checks'].values()), (cid, meta['checks'])
        log(f"INTENT {now()} C{cid} update_case fields={sorted(pay.keys())} marker={meta['newmarker'][:45]!r}")
        st, body = tr.req(f'update_case/{cid}', pay)
        if st != 200:
            log(f"  FAIL HTTP {st} C{cid} {json.dumps(body)[:200]}"); OPLOG.close(); raise SystemExit(2)
        st2, l2 = tr.req(f'get_case/{cid}')
        if st2 != 200:
            log(f"  FAIL re-GET HTTP {st2} C{cid}"); OPLOG.close(); raise SystemExit(2)
        mism = []
        for k, v in pay.items():
            a = norm_refs(v) if k == 'refs' else v
            b = norm_refs(l2.get(k)) if k == 'refs' else l2.get(k)
            if a != b: mism.append((k, repr(a)[:160], repr(b)[:160]))
        for k in UNTOUCHED:
            if live.get(k) != l2.get(k): mism.append(('UNTOUCHED:' + k, repr(live.get(k)), repr(l2.get(k))))
        if mism:
            for k, a, b in mism: log(f"  MISMATCH {k}\n    intended={a}\n    live    ={b}")
            log(f"STOP mismatch C{cid} — batch halted (§2.3)"); OPLOG.close(); raise SystemExit(3)
        log(f"  OK {now()} C{cid} HTTP200 verified byte-identical fields={sorted(pay.keys())} "
            f"untouched-proven={UNTOUCHED}")
        results[cid] = {'http': 200, 'verified': True, 'marker': meta['newmarker']}
    json.dump(results, open('exec_results.json', 'w'), indent=1)
    log(f"DONE {now()} 3/3 written+verified")

if __name__ == '__main__':
    main()
