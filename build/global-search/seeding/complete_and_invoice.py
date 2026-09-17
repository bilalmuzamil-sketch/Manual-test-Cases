#!/usr/bin/env python3
"""Drives two seeded work orders all the way to COMPLETE and INVOICED, so C44838 can see all seven
status badge colours on one search term.

WHY IT IS A SEPARATE SCRIPT: reaching Complete is not a status write, it is a seven-call chain, and
every call in it has a precondition the previous one creates. The chain, with the trap at each step
(playbook §E and the Report Suite pass that first proved it):

  1. a LINE                POST /api/work-orders/{wo}/lines/create-from-canned-line
                           🔴 the canned line must have total_parts == 0, or the line can never
                              complete: "Line can`t be completed with unfulfilled part requests."
  2. MILEAGE               POST /api/work-orders/change-mileage {work_order_id, mileage}
                           🔴 mileage MUST BE A STRING. A number returns 500. Without it the line
                              refuses: "Line can not be completed without a Work Order mileage."
  3. a TECH STORY          POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}
                           🔴 /lines/change returns 500 - this is the route that works. Without a
                              story the line refuses to complete.
  4. COMPLETE THE LINE     POST /api/work-orders/lines/change-status {line_id, status:'complete', workOrderId}
                           🔴 status is a WALK, not a jump: authorization_required -> authorized ->
                              complete. Jumping answers 400 naming the transition.
  5. COMPLETE THE WO       POST /api/work-orders/change-status {id, status:'complete'}
                           🔴 the field is `id`, NOT work_order_id.
  6. INVOICE IT            POST /api/invoices/create {work_order_id}
                           🔴 ONLY works if the work order carries a CONTACT PERSON. Without one it
                              returns 500 and looks like a broken endpoint. Ours carry one because
                              the manifest injects customer_id (the CONTACT) at creation.

🔴 AND THE ONE-WAY DOOR: a Complete or Invoiced work order CANNOT BE DELETED, and on some branches
cannot change status again. Only ever walk a work order we are content to keep. This script uses the
spare `estimate` ones and never touches a work order another case depends on.

Run:  python3 complete_and_invoice.py [--confirm]
"""
import json, os, sys, runpy, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV, IDS_FILE = _seed['call'], _seed['ENV_LABEL'], _seed['IDS_FILE']
CONFIRM = '--confirm' in sys.argv
STATE = f'{HERE}/completed-invoiced-gsv2-{ENV}.json'

def status_of(wo):
    r = call(f'/api/work-orders/view/{wo}')
    w = ((r['json'] or {}).get('data') or {}).get('work_order') or {}
    raw = w.get('status')
    return (None if raw is None else str(raw).strip().lower().replace(' ', '_')), w.get('number')

def zero_part_line():
    r = call('/api/work-orders/canned-lines')
    free = [x for x in (r['json'] or {}).get('data', {}).get('collection') or []
            if not x.get('total_parts')]
    if not free: sys.exit('no canned line without parts')
    return free[0]['id']

def drive(wo, want):
    """want = 'complete' or 'invoiced'. Returns (reached_status, trail)."""
    trail = []
    def post(label, path, body):
        r = call(path, 'POST', body)
        trail.append((label, r['status']))
        if r['status'] not in (200, 201):
            trail.append(('BODY', str(r.get('raw') or r.get('error'))[:150]))
        return r['status'] in (200, 201), r

    st, num = status_of(wo)
    if st in ('complete', 'invoiced', 'paid'):
        return st, [('already', st)]

    ok, r = post('line', f'/api/work-orders/{wo}/lines/create-from-canned-line',
                 {'canned_line_id': zero_part_line(), 'status': 'authorized'})
    if not ok: return status_of(wo)[0], trail
    line = ((r['json'] or {}).get('data') or {}).get('line_id')
    trail.append(('line_id', line[:8] if line else None))

    post('mileage', '/api/work-orders/change-mileage',
         {'work_order_id': wo, 'mileage': '184320'})          # 🔴 STRING
    post('story', '/api/work-orders/lines/change-story',
         {'line_id': line, 'tech_story': 'ZZAUTOTEST seeded completion', 'work_order_id': wo})
    post('line->authorized', '/api/work-orders/lines/change-status',
         {'line_id': line, 'status': 'authorized', 'workOrderId': wo})
    post('line->complete', '/api/work-orders/lines/change-status',
         {'line_id': line, 'status': 'complete', 'workOrderId': wo})
    # the work order must walk too
    for s in ('approved', 'in_progress', 'ready_for_review', 'complete'):
        post(f'wo->{s}', '/api/work-orders/change-status', {'id': wo, 'status': s})
    if want == 'invoiced':
        today = datetime.date.today().isoformat()
        post('invoice', '/api/invoices/create',
             {'work_order_id': wo, 'issue_date': today, 'due_date': today})
    return status_of(wo)[0], trail

def main():
    ids = json.load(open(f'{HERE}/{IDS_FILE}'))
    # FAST PATH: the previous run recorded which two work orders it drove. Verify those two LIVE
    # rather than reading all eighteen statuses to rediscover them - 2 calls instead of 18, and it
    # is not a shortcut on rigour because the state file is never believed: each id is checked
    # against the environment, and anything that does not confirm falls through to the full scan.
    try:
        prev = json.load(open(STATE))
    except Exception:
        prev = {}
    if prev:
        confirmed = {}
        for want in ('complete', 'invoiced'):
            rec = prev.get(want) or {}
            if not rec.get('id'): continue
            st, num = status_of(rec['id'])
            if st in (('complete',) if want == 'complete' else ('invoiced', 'paid')):
                confirmed[want] = (rec['id'], num, st)
        if len(confirmed) == 2:
            for k, (i, num, st) in confirmed.items(): print(f'  {num}: already {st}')
            print('  both statuses already present - nothing to do (verified live, 2 calls)')
            return
    # 🔴 ASK WHETHER THE WORK IS ALREADY DONE BEFORE ASKING WHETHER YOU CAN DO IT. The first version
    # counted spare `estimate` work orders first, so on the SECOND reseed - when the two it had
    # already driven were sitting there Complete and Invoiced exactly as intended - it found one
    # spare and reported a red "need two spare estimate work orders". A reseed that is working
    # perfectly must not print an alarm; a reader who learns to ignore one red line will ignore the
    # real one.
    have = {}
    for i in ids.get('work_orders_fib_main') or []:
        st, num = status_of(i)
        if st in ('complete', 'invoiced', 'paid'):
            have.setdefault('invoiced' if st in ('invoiced', 'paid') else 'complete', (i, num, st))
    if 'complete' in have and 'invoiced' in have:
        for k, (i, num, st) in have.items(): print(f'  {num}: already {st}')
        print('  both statuses already present - nothing to do')
        json.dump({k: {'id': i, 'number': n, 'status': st} for k, (i, n, st) in have.items()},
                  open(STATE, 'w'), indent=1)
        spare = []
    else:
        spare = [(i, n) for i in (ids.get('work_orders_fib_main') or [])
                 for st, n in [status_of(i)] if st == 'estimate']
        print(f'spare estimate work orders: {[n for _, n in spare]}')
        need = 2 - len(have)
        if len(spare) < need:
            print(f'🔴 need {need} spare estimate work order(s); found {len(spare)}'); return

    try: done = json.load(open(STATE))
    except Exception: done = {}
    plan = [(w, spare[k]) for k, w in enumerate(x for x in ('complete', 'invoiced') if x not in have)]
    for want, (wo, num) in plan:
        cur, _ = status_of(wo)
        if cur == want or (want == 'invoiced' and cur in ('invoiced', 'paid')):
            print(f'  {num}: already {cur}'); done[want] = {'id': wo, 'number': num, 'status': cur}
            continue
        if not CONFIRM:
            print(f'  {num}: {cur} -> would drive to {want}'); continue
        reached, trail = drive(wo, want)
        mark = '✅' if reached == want or (want == 'invoiced' and reached in ('invoiced', 'paid')) else '🔴'
        print(f'  {num}: {cur} -> {want}: {mark} landed on {reached}')
        for t in trail: print(f'        {t}')
        done[want] = {'id': wo, 'number': num, 'status': reached}
    if CONFIRM: json.dump(done, open(STATE, 'w'), indent=1); print(f'\nstate: {STATE}')

    print('\n=== READ BACK from the search index, never from what we POSTed ===')
    d = (call('/api/search?q=Fib')['json'] or {}).get('data', {}) or {}
    from collections import Counter
    for g in d.get('groups') or []:
        if g['type'] == 'work_orders':
            c = Counter(i['fields']['status'] for i in g['items'])
            print('  statuses visible in the "Fib" work-order rows:', dict(c))

main()
