#!/usr/bin/env python3
"""Creates the two role fixtures section 6734 needs and that NO stock role provides.

MEASURED FIRST, BUILT SECOND. The branch already ships 11 roles, and most of what 6734 asks for is
already there — creating six roles would have been five more than necessary, and every extra role is
another thing to keep straight. What the stock roles give us (measured 2026-09-17 by reading each
role's fe_permissions and applying SearchSectionAccess's own mapping):

  Admin / Office User / Foreman / …  every group            -> C44877 (a role WITH parts access)
  Technician                         work orders, customers, assets only
                                     (no parts, no part sales, no vendors, no pricing)
                                                             -> C44878, C44881, part of C44882
  Sales Representative               no parts, no vendor management
                                                             -> part of C44882
  Time Clock User                    NOTHING AT ALL          -> the TimeClock clause of C44882

  🔴 MISSING, because EVERY stock role holds workOrdersView and customersView:
     - a role with no Work Orders: View   -> C44879, part of C44882
     - a role with no Customers: View     -> part of C44882

THE MAPPING THE SEARCH ACTUALLY USES (api/src/Search/Application/Permission/SearchSectionAccess.php
@ 21b4db9) — not the section names in the UI:
    work orders                      workOrdersView
    customers AND assets             customersView          (one permission, two groups)
    parts                            catalogInventoryView
    part sales                       partSalesView AND seeFinancialData   🔴 THREE conditions
    vendors, POs, vendor invoices    vendorOrderManagementView
    the Time Clock TEMPLATE          sees nothing, whatever its bundles say

🔴 A PERMISSION CAN REFUSE TO COME OFF AND ANSWER 200 WHILE DOING IT (playbook §U). Work-order
line-edit and pick-parts depend on workOrdersView, so removing it alone silently keeps it. Every role
written here is READ BACK and the removal is proved, never assumed.

Run:  python3 seed_roles.py [--confirm]
"""
import json, os, sys, runpy, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']
CONFIRM = '--confirm' in sys.argv
STATE = f'{HERE}/roles-gsv2-{ENV}.json'

# the role we clone from: the widest one, so removing exactly one bundle is the only difference
SOURCE_ROLE_NAME = 'Office User'

# 🔴 `drop` IS A LIST, NOT ONE CODE, AND THAT IS THE WHOLE LESSON.
# A view permission will not come off on its own while a permission that DEPENDS on it is still
# held - and the create still answers 201 and reads back with the permission intact. Removing
# `customersView` alone did exactly that (measured 2026-09-17: 201, then 26 permissions back, all
# of them). Its dependants are `customersCreateAndEdit` and `customersDelete`: you cannot edit or
# delete what you cannot view, so the server keeps the view. Remove the whole family and it takes.
WANTED = [
    {'name': 'ZZAUTOTEST No Work Orders View',
     'drop': ['workOrdersView', 'woFullViewMode'],
     'gate': 'workOrdersView', 'serves': 'C44879, C44882, C55732',
     'staff': {'first': 'ZZAUTOTEST', 'last': 'NoWorkOrders', 'email': 'zzautotest.nowo@staging.shopview.local'},
     'note': 'viewMode must be null - a role with no Work Order View has no meaningful view mode, '
             'and the product FE sends null for exactly this shape. woFullViewMode goes with it.'},
    {'name': 'ZZAUTOTEST No Customers View',
     'drop': ['customersView', 'customersCreateAndEdit', 'customersDelete'],
     'gate': 'customersView', 'serves': 'C44882',
     'staff': {'first': 'ZZAUTOTEST', 'last': 'NoCustomers', 'email': 'zzautotest.nocust@staging.shopview.local'},
     'note': 'removes BOTH the Customers and the Assets groups - they share one permission. The '
             'create/edit and delete permissions must go too or the view refuses to come off.'},
]

def list_roles():
    r = call('/api/iam/list-roles')
    return (r['json'] or {}).get('data', {}).get('collection') or []

def read_role(rid):
    r = call(f'/api/roles/{rid}')
    return (r['json'] or {}).get('data') or {}

def codes(role):
    return [p.get('code') or p.get('name') for p in (role.get('fe_permissions') or [])
            if isinstance(p, dict) and (p.get('code') or p.get('name'))]

def org_id():
    """🔴 /api/staff rows do NOT carry organization_id (measured: the field is absent, so reading it
    yields None and the create then fails on a missing entity rather than on anything informative).
    The vendor and customer list rows DO carry it."""
    for path in ('/api/parts-catalogue/vendors?limit=1', '/api/customers?limit=1'):
        r = call(path)
        rows = (r['json'] or {}).get('data', {}).get('collection') or []
        if rows and rows[0].get('organization_id'):
            return rows[0]['organization_id']
    return None

def main():
    roles = list_roles()
    by_name = {r['label']: r['id'] for r in roles}
    src_id = by_name.get(SOURCE_ROLE_NAME)
    if not src_id: sys.exit(f'source role {SOURCE_ROLE_NAME!r} not found')
    src = read_role(src_id)
    src_codes = codes(src)
    print(f'cloning from {SOURCE_ROLE_NAME}: {len(src_codes)} permissions')

    org = org_id()
    print(f'organization: {org}')
    state = {}
    try: state = json.load(open(STATE))
    except Exception: pass

    for spec in WANTED:
        name, drop, gate = spec['name'], spec['drop'], spec['gate']
        existing = by_name.get(name)
        if existing:
            role = read_role(existing)
            held = codes(role)
            ok = gate not in held
            print(f"  {name:34} exists -> {gate} removed? {'✅ yes' if ok else '🔴 NO, still held'}")
            state[name] = {'id': existing, 'drops': drop, 'serves': spec['serves'],
                           'removal_verified': ok}
            continue
        if not CONFIRM:
            print(f'  {name:34} would create (clone of {SOURCE_ROLE_NAME} minus {drop})'); continue
        # 🔴 fePermissions IS A LIST OF PERMISSION ID STRINGS. The DTO's #[MapArray(class:
        # FEPermission::class)] resolves entities, so {'code': …} and {'id': …} and the whole
        # permission objects ALL answer 500 - a bare 500, naming nothing. Only the plain uuid
        # strings work. Found by posting four candidate shapes and keeping the one that returned 201.
        keep = [p['id'] for p in (src.get('fe_permissions') or [])
                if (p.get('code') or p.get('name')) not in drop]
        body = {'name': name,
                'fePermissions': keep,
                'organization': org,
                'viewMode': None if 'workOrdersView' in drop else src.get('view_mode'),
                'crossToggles': src.get('cross_toggles') or
                                {'seeFinancialData': True, 'seeApArData': True, 'viewHistoryLogs': True},
                'description': f'ZZAUTOTEST fixture for {spec["serves"]} - {SOURCE_ROLE_NAME} without {drop}',
                'templateId': src.get('template_id')}
        r = call('/api/roles', 'POST', body)
        print(f"  {name:34} create -> {r['status']}"
              + ('' if r['status'] in (200, 201) else f"  {str(r['raw'])[:220]}"))
        if r['status'] not in (200, 201): continue
        # 🔴 READ BACK. A 200 is not evidence the permission came off.
        rid = next((x['id'] for x in list_roles() if x['label'] == name), None)
        if not rid: print('       🔴 created but not in the list'); continue
        held = codes(read_role(rid))
        ok = gate not in held
        print(f"       read back: {len(held)} permissions, {gate} removed? "
              f"{'✅ yes' if ok else '🔴 NO — it refused to come off'}")
        state[name] = {'id': rid, 'drops': drop, 'serves': spec['serves'], 'removal_verified': ok}

    # 🔴 A ROLE NOBODY HOLDS PROVES NOTHING (2026-10-05). The e2e permission checks act as a real
    # staff member (switch-user inside the full-access session), so each fixture role needs one person
    # on it. Found by email; created with the recipe in seed-manifest.json (POST /api/iam/create).
    # 🔴 THE PERSON MUST WORK WHERE THE TEST DATA LIVES (2026-10-05). The first run put them in "QB
    # Location" (the first workplace a list happened to show); the checks switch to Staging Heavy Duty,
    # where every seeded record is. And 🔴 THE PLAIN STAFF LIST LEAVES THEM OUT (measured: 22 rows,
    # neither new person among them, both found at once by ?search=), so look people up by search.
    wps = ((call('/api/staff/my-workplaces')['json'] or {}).get('data')) or []
    wps = wps.get('collection', []) if isinstance(wps, dict) else wps      # answered as {collection: [...]}
    wp = next((w['id'] for w in wps if 'heavy duty' in str(w.get('name', '')).lower()), None) \
        or next((w['id'] for w in wps if w.get('id')), None)
    def find_staff(email):
        r = call('/api/staff?search=' + urllib.parse.quote(email))
        rows = ((r['json'] or {}).get('data') or {}).get('collection') or []
        return next((x for x in rows if str(x.get('email', '')).lower() == email), None)
    for spec in WANTED:
        st = spec.get('staff'); rid = (state.get(spec['name']) or {}).get('id') or by_name.get(spec['name'])
        if not st or not rid: continue
        have = find_staff(st['email'])
        if have:
            ok = (have.get('role_id') == rid or have.get('role_label') == spec['name']) and have.get('workplace_id') == wp
            print(f"  staff {st['email']:42} exists on {have.get('role_label')!r} at "
                  f"{have.get('defaultWorkplaceName')!r} {'✅' if ok else '🔴 WRONG ROLE OR WORKPLACE'} active={have.get('is_active')}")
            if not ok and CONFIRM:
                # 🔴 A MISPLACED PERSON IS REPLACED, NOT MOVED (2026-10-05). /api/staff/{id}/change takes a
                # different workplace field and no departments; posting workplace_id there answered 201 and
                # left the workplace EMPTY. Deleting and re-creating in the right workplace is clean.
                sid = have.get('staff_id') or have.get('id')
                r = call(f'/api/staff/{sid}', 'DELETE')
                print(f"       removed to re-create at the test workplace -> {r['status']}")
                if r['status'] >= 300:
                    continue
                have = None
            if have:
                continue
        if not CONFIRM:
            print(f"  staff {st['email']:42} would create on {spec['name']!r}"); continue
        # 🔴 THE FIELD NAMES ARE SNAKE_CASE AND A DEPARTMENT IS REQUIRED (read from the product,
        # api/src/IAM/Application/Create/CreateController.php @ f559d24, 2026-10-05). The camelCase
        # body in the old recipe answered 400 "First name is missing ... Workplace ID is missing".
        deps = (call('/api/departments')['json'] or {}).get('data')
        deps = deps.get('collection', deps) if isinstance(deps, dict) else (deps or [])
        dep_ids = [d['id'] for d in deps if isinstance(d, dict) and d.get('id')][:1]
        body = {'email': st['email'], 'first_name': st['first'], 'last_name': st['last'], 'role_id': rid,
                'departments': dep_ids, 'workplace_id': wp}
        r = call('/api/iam/create', 'POST', body)
        print(f"  staff {st['email']:42} create -> {r['status']}" + ('' if r['status'] < 300 else f"  {str(r['raw'])[:300]}"))
        state.setdefault(spec['name'], {})['staff_create'] = r['status']

    if CONFIRM:
        json.dump(state, open(STATE, 'w'), indent=1)
        print(f'\nstate: {STATE}')

    # The full per-role table costs 11 extra reads and tells a reseed nothing it did not already
    # prove. It is genuinely useful when you are DECIDING which role a case should use, so it stays -
    # behind a flag.
    if '--summary' not in sys.argv:
        print('\n(run with --summary for the per-role entity-group table)')
        return
    print('\n=== WHAT EACH ROLE SEES IN GLOBAL SEARCH (from SearchSectionAccess) ===')
    for r in list_roles():
        role = read_role(r['id']); h = set(codes(role))
        seen = []
        if 'workOrdersView' in h: seen.append('work orders')
        if 'customersView' in h: seen += ['customers', 'assets']
        if 'catalogInventoryView' in h: seen.append('parts')
        if 'partSalesView' in h and 'seeFinancialData' in h: seen.append('part sales')
        if 'vendorOrderManagementView' in h: seen += ['vendors', 'POs', 'invoices']
        if 'Time Clock' in r['label']: seen = ['NOTHING (Time Clock template)']
        print(f"  {r['label'][:34]:35} {', '.join(seen) if seen else '(none)'}")

main()
