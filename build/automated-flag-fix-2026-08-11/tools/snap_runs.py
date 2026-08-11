import tr, json, sys, hashlib
tag = sys.argv[1]
snap = {}
for rid in (352, 359):
    st, run = tr.req(f'get_run/{rid}')
    tests = tr.getall(f'get_tests/{rid}', 'tests')
    res   = tr.getall(f'get_results_for_run/{rid}', 'results')
    snap[str(rid)] = dict(
        run={k: run.get(k) for k in ('id','name','include_all','is_completed','passed_count','failed_count',
                                     'blocked_count','retest_count','untested_count','updated_on')},
        test_count=len(tests),
        case_ids=sorted(t['case_id'] for t in tests),
        test_ids=sorted(t['id'] for t in tests),
        result_count=len(res),
        results={str(r['id']): {k: r.get(k) for k in
                 ('id','test_id','status_id','comment','version','elapsed','defects','created_by',
                  'created_on','assignedto_id','custom_step_results','attachment_ids','case_refs','case_title')}
                 for r in res},
    )
    print(f"run {rid}: include_all={snap[str(rid)]['run']['include_all']} tests={len(tests)} results={len(res)}")
p = f'../snapshots/RUNS-{tag}.json'
json.dump(snap, open(p,'w'), indent=1, sort_keys=True)
print('sha256', hashlib.sha256(open(p,'rb').read()).hexdigest()[:16], '->', p)
