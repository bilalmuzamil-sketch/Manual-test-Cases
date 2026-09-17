#!/usr/bin/env python3
"""Spreads the seeded Fibridge work orders across the statuses the badge-colour and ranking cases
need, then reports what the branch actually accepted.

WHY THIS IS A SEPARATE STEP AND NOT A MANIFEST FIELD: status is not a property of creation. Every
work order is born `estimate` and has to be WALKED, one POST per step, and the branch refuses some
walks outright (a completed work order cannot change status again, and invoicing needs a completed
line, a mileage and a tech story). A manifest field would have to lie about that. This script asks
for each status, records the answer, and never claims a status it did not read back.

Statuses the search cares about (api/src/.../Status.php @ 21b4db9):
  estimate · in_progress · approved · declined · ready_for_review · complete · invoiced · paid
Of those, OPEN for ranking and for the customer's open-work-order chip is exactly three
(OpenWorkOrderStatuses::ALL): approved, in_progress, ready_for_review.

Run:  SEED_MANIFEST=seed-manifest-gs-v2.json python3 set_wo_statuses.py [--confirm]
"""
import json, os, sys, runpy, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, IDS_FILE = _seed['call'], _seed['IDS_FILE']

CONFIRM = '--confirm' in sys.argv
# --force re-walks even when the search already shows the full spread
FORCE = '--force' in sys.argv

# The target spread. Deliberately NOT one work order per status: C44838 reads badge COLOURS off a
# result list, so each status needs to be visibly present, while C44851 needs a believable bulk of
# open-and-recent work to rank above the branch's old paid ones.
PLAN = [('approved', 6), ('in_progress', 4), ('ready_for_review', 3), ('declined', 2),
        ('estimate', 3)]          # 18 main
PLAN_NOUNIT = [('approved', 2), ('estimate', 2)]   # 4 no-unit

def walk(wo_id, target):
    """Returns (reached, [(status, http)…]). Some targets need intermediate steps."""
    route = {'approved': ['approved'], 'in_progress': ['approved', 'in_progress'],
             'ready_for_review': ['approved', 'in_progress', 'ready_for_review'],
             'declined': ['declined'], 'estimate': []}[target]
    trail = []
    for st in route:
        r = call('/api/work-orders/change-status', 'POST', {'id': wo_id, 'status': st})
        trail.append((st, r['status']))
        if r['status'] not in (200, 201):
            trail.append(('BODY', str(r.get('raw') or r.get('error'))[:120]))
            return False, trail
    return True, trail

def read_status(wo_id):
    """🔴 THE READ AND THE WRITE DISAGREE ON CASE AND SPACING. change-status is POSTed
    'ready_for_review'; the view reads back 'Ready For Review'. Comparing them raw makes every
    walk look like it failed - and makes an ALREADY-CORRECT record look like it needs walking."""
    r = call(f'/api/work-orders/view/{wo_id}')
    d = (r['json'] or {}).get('data', {}) or {}
    raw = (d.get('work_order') or {}).get('status')
    if raw is None: return None
    v = str(raw).strip().lower().replace(' ', '_')
    # 🔴 THE LABEL AND THE VALUE ARE DIFFERENT WORDS. change-status is POSTed 'ready_for_review';
    # the view reads back the LABEL 'Review'. Comparing them raw makes a successful walk report as a
    # failure on every single run - three red marks per reseed for work orders that were correct.
    return {'review': 'ready_for_review'}.get(v, v)

def main():
    ids = json.load(open(f'{HERE}/{IDS_FILE}'))
    main_ids = ids.get('work_orders_fib_main') or []
    nounit_ids = ids.get('work_orders_fib_nounit') or []
    print(f'main={len(main_ids)}  nounit={len(nounit_ids)}   confirm={CONFIRM}')
    jobs = []
    i = 0
    for st, n in PLAN:
        for _ in range(n):
            if i < len(main_ids): jobs.append((main_ids[i], st)); i += 1
    i = 0
    for st, n in PLAN_NOUNIT:
        for _ in range(n):
            if i < len(nounit_ids): jobs.append((nounit_ids[i], st)); i += 1

    # FAST PATH, and a BETTER check than the 22 reads it replaces. The spread this step exists to
    # create is visible in ONE search - and the search is what the TESTER sees, whereas 22
    # work-order reads only prove what the database holds. If every status the plan asks for is
    # already showing, there is nothing to walk. 1 call instead of 22 on the happy path.
    # --force re-walks anyway.
    if not FORCE:
        want = {t for t, _ in PLAN} | {t for t, _ in PLAN_NOUNIT}
        r = call('/api/search?q=' + urllib.parse.quote('Fibridge Commercial'))
        g = next((x for x in ((r['json'] or {}).get('data') or {}).get('groups') or []
                  if x['type'] == 'work_orders'), None)
        live = {i['fields']['status'] for i in (g['items'] if g else [])}
        if want <= live:
            print('  every planned status is already showing in the search - nothing to walk')
            print('\n=== statuses visible to the tester (read back, never assumed) ===')
            for st in sorted(live): print(f'  {st}')
            return

    got = {}
    TERMINAL = {'complete', 'invoiced', 'paid'}
    for wo_id, target in jobs:
        before = read_status(wo_id)
        # 🔴 NEVER WALK A TERMINAL WORK ORDER BACK. Step 5 drives two work orders to Complete and
        # Invoiced, and those are one-way doors. This step assigns its plan POSITIONALLY, so on the
        # next reseed the same slots came round again and it tried to walk them back to estimate -
        # failing, loudly, every run, on work orders that were exactly right.
        if before in TERMINAL:
            got.setdefault(before, []).append(wo_id)
            print(f'  {wo_id[:8]} is {before} - terminal, left alone'); continue
        if before == target:
            got.setdefault(before, []).append(wo_id); print(f'  {wo_id[:8]} already {before}'); continue
        if not CONFIRM:
            print(f'  {wo_id[:8]} {before} -> would walk to {target}'); continue
        ok, trail = walk(wo_id, target)
        after = read_status(wo_id)
        got.setdefault(after, []).append(wo_id)
        mark = '✅' if after == target else '🔴'
        print(f'  {wo_id[:8]} {before} -> {target}: {mark} landed on {after}   {trail}')

    print('\n=== statuses actually reached (read back, never assumed) ===')
    for st, v in sorted(got.items(), key=lambda x: -len(x[1])):
        print(f'  {str(st):18} {len(v)}')
    if CONFIRM:
        json.dump({k: v for k, v in got.items()},
                  open(f'{HERE}/wo-statuses-gsv2-{_seed["ENV_LABEL"]}.json', 'w'), indent=1)
        print(f'  written: wo-statuses-gsv2-{_seed["ENV_LABEL"]}.json')

main()
