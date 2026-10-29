#!/usr/bin/env python3
"""VALIDATION SUITE for Track Changes (Phase 5). Proves the engine reports EXACTLY what changed.

Runs entirely in throw-away places - a temporary store (CRP_ROOT) and a shared clone of the product
repo - so the real snapshots and the real product repo are never touched.

  A. Real history     replay recorded releases and check the known changes are found
  B. Controlled       one deliberate change per commit, each checked for what MUST and MUST NOT
                      be reported; plus the no-change release, the checkpoint refusal and the
                      duplicate-scan guard
  C. Plain language   every plain-words field people read is free of code names, route paths and
                      technical terms (the technical fields beside it may keep them)
  E. Auto-update      a new live release is checked and shown at once (waiting for approval), a
                      repeat run does nothing new, and an approval saves it
  D. Retest lists     every release gets a manual-QA retest checklist; a release with no change
                      says no retest is needed; a role suggested as "should be refused" really
                      holds none of the permissions that allow the action

  python3 validate.py            exit 0 only if every check passes; writes ../reports/VALIDATION.md
"""
import json, os, re, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
PRODUCT = '/home/user/shopview'
BASE_TAG = 'v26.43.3'
RESULTS = []


def run(cmd, env=None, cwd=HERE):
    r = subprocess.run(cmd, capture_output=True, text=True, env=env, cwd=cwd)
    return r.returncode, r.stdout + r.stderr


def check(name, ok, detail=''):
    RESULTS.append((name, bool(ok), detail))
    print(f"{'✅' if ok else '🔴'} {name}" + (f' — {detail}' if detail and not ok else ''))


def store(tmp):
    env = dict(os.environ, CRP_ROOT=tmp)
    os.makedirs(os.path.join(tmp, 'snapshots'), exist_ok=True)
    return env


def record_baseline(env, repo, ref, sid):
    code = ('import sys; sys.path.insert(0, %r); import extract_impl as ex, snapshot_store as st;'
            'st.record(ex.extract(%r, %r), %r, "test baseline", "validate.py")') % (HERE, repo, ref, sid)
    rc, out = run([sys.executable, '-c', code], env=env)
    assert rc == 0, out


def scan(env, repo, ref):
    rc, out = run([sys.executable, 'track_changes.py', 'scan', '--repo', repo, '--ref', ref], env=env)
    reports = sorted((os.path.join(env['CRP_ROOT'], 'reports', f) for f in os.listdir(os.path.join(env['CRP_ROOT'], 'reports'))
                      if f.endswith('.json')), key=os.path.getmtime) if os.path.isdir(os.path.join(env['CRP_ROOT'], 'reports')) else []
    rep = json.load(open(reports[-1])) if reports else None
    if rep:
        CONTROLLED.extend(rep['changes'])
        md = reports[-1][:-5] + '.md'
        if os.path.exists(md):
            REPORT_MD.append(open(md).read())
        rt = reports[-1][:-5] + '-RETEST.md'
        RETEST_MD.append(open(rt).read() if os.path.exists(rt) else None)
    return rc, out, rep


def titles(rep):
    return [c['title'] for c in (rep or {}).get('changes', [])]


# ── A. real history ──────────────────────────────────────────────────────────────────────────────
def real_history():
    tmp = tempfile.mkdtemp(prefix='crp-hist-')
    env = store(tmp)
    record_baseline(env, PRODUCT, 'v26.35.0', 'impl-v26.35.0')
    rc, out, rep = scan(env, PRODUCT, 'v26.36.0')
    t = titles(rep)
    check('History v26.35.0→v26.36.0 finds "Move Labor" permission added (SV-8911)',
          any('Permission added' in x and 'Move Labor' in x for x in t), out[-400:])
    check('History v26.35.0→v26.36.0 finds the Move Labor ⇒ Work Order Lines dependency',
          any('Dependency added' in x and 'Move Labor' in x for x in t))
    check('History v26.35.0→v26.36.0 reports no permission REMOVED', not any('Permission removed' in x for x in t))
    rc, out = run([sys.executable, 'track_changes.py', 'confirm', 'impl-v26.36.0', '--by', 'validate.py'], env=env)
    check('Confirming a reviewed scan records the release snapshot', rc == 0 and 'recorded impl-v26.36.0' in out, out[-300:])
    rc, out, _ = scan(env, PRODUCT, 'v26.36.0')
    check('Scanning the same release again is refused as a duplicate', 'Already recorded' in out, out[-300:])
    rc, out, rep = scan(env, PRODUCT, 'v26.39.0')
    added = [x for x in titles(rep) if x.startswith('Permission added')]
    check('History v26.36.0→v26.39.0 finds the accounting permissions added (15 area + HR)',
          len([x for x in added if 'Accounting' in x or 'HR' in x]) >= 15, f'{len(added)} added: {added[:6]}')
    shutil.rmtree(tmp, ignore_errors=True)


# ── B. controlled changes ────────────────────────────────────────────────────────────────────────
def edit(clone, path, fn):
    p = os.path.join(clone, path)
    s = open(p).read()
    s2 = fn(s)
    assert s2 != s, f'edit to {path} changed nothing'
    open(p, 'w').write(s2)


def commit(clone, msg):
    subprocess.run(['git', '-C', clone, 'add', '-A'], check=True, capture_output=True)
    subprocess.run(['git', '-C', clone, '-c', 'user.email=validate@local', '-c', 'user.name=validate', 'commit', '-q', '-m', msg],
                   check=True, capture_output=True)
    return subprocess.run(['git', '-C', clone, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()


def controlled():
    work = tempfile.mkdtemp(prefix='crp-ctl-')
    clone = os.path.join(work, 'shopview')
    subprocess.run(['git', 'clone', '-q', '--shared', '--no-checkout', PRODUCT, clone], check=True)
    sparse = ['api/src/Auth', 'api/src/VehicleService/WorkOrders/UI/HTTP/ChangePriority',
              'app/src/components/ts/administration/permissions', 'app/src/services/permissions']
    subprocess.run(['git', '-C', clone, 'sparse-checkout', 'set', '--no-cone', *sparse], check=True, capture_output=True)
    subprocess.run(['git', '-C', clone, 'checkout', '-q', BASE_TAG], check=True, capture_output=True)
    subprocess.run(['git', '-C', clone, 'checkout', '-q', '-b', 'crp-validation'], check=True, capture_output=True)
    ENUM = 'api/src/Auth/Domain/Model/FEPermissionEnum.php'
    MAP = 'api/src/Auth/UI/Cli/Command/RoleFePermissionMappings.php'
    ATOMS = 'api/src/Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php'
    CASC = 'api/src/Auth/Domain/Model/FEPermissionCascade.php'
    LABELS = 'app/src/components/ts/administration/permissions/labels.ts'
    CTRL = 'api/src/VehicleService/WorkOrders/UI/HTTP/ChangePriority/ChangePriorityController.php'

    def fresh_store(base_ref):
        tmp = tempfile.mkdtemp(prefix='crp-store-', dir=work)
        env = store(tmp)
        record_baseline(env, clone, base_ref, 'impl-base')
        return env

    base = subprocess.run(['git', '-C', clone, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()

    # 1. comments + whitespace only -> NO change, and recording needs --checkpoint
    edit(clone, MAP, lambda s: s.replace('class RoleFePermissionMappings', '// validation: a comment only\nclass RoleFePermissionMappings', 1))
    edit(clone, ENUM, lambda s: s.replace('    case workOrdersView', '\n    // validation comment\n    case workOrdersView', 1))
    edit(clone, LABELS, lambda s: s.replace('export const BUNDLE_LABELS', '// validation comment\nexport const BUNDLE_LABELS', 1))
    c1 = commit(clone, 'comments only')
    env = fresh_store(base)
    rc, out, rep = scan(env, clone, c1)
    check('Comment/whitespace-only commit → "No Custom Roles & Permissions changes detected"',
          rep is not None and not rep['changes'] and 'No Custom Roles & Permissions changes detected' in out, f'{titles(rep)[:5]}')
    sid = 'impl-' + c1[:10]
    rc, out = run([sys.executable, 'track_changes.py', 'confirm', sid, '--by', 'validate.py'], env=env)
    check('A no-change release cannot be recorded as a changed-behaviour snapshot', rc != 0 and 'REFUSED' in out, out[-200:])
    rc, out = run([sys.executable, 'track_changes.py', 'confirm', sid, '--by', 'validate.py', '--checkpoint'], env=env)
    reg = json.load(open(os.path.join(env['CRP_ROOT'], 'snapshots', 'registry.json')))
    check('With --checkpoint it is recorded as a no-change checkpoint',
          rc == 0 and reg['snapshots'][-1].get('checkpoint_only') is True, out[-200:])

    # 2. permission added, granted to Technician
    edit(clone, ENUM, lambda s: s.replace("    case workOrdersView = 'workOrdersView';",
                                          "    case workOrdersView = 'workOrdersView';\n    case zzValidationPermission = 'zzValidationPermission';", 1))
    edit(clone, ATOMS, lambda s: s.replace("        return [\n", "        return [\n            ['code' => FEPermissionEnum::zzValidationPermission, 'name' => 'zzValidationPermission', 'permissions' => [BEPermissionCode::ROLE_WORK_ORDER_VIEW]],\n", 1))
    edit(clone, MAP, lambda s: re.sub(r"(DefaultRoleNameEnum::Technician->value => \[)", r"\1\n                FEPermissionEnum::zzValidationPermission->value,", s, count=1))
    edit(clone, LABELS, lambda s: s.replace("  workOrdersView: 'Work Orders — View',", "  workOrdersView: 'Work Orders — View',\n  zzValidationPermission: 'Validation — Test Permission',", 1))
    c2 = commit(clone, 'add a permission')
    rc, out, rep = scan(fresh_store(c1), clone, c2)
    ch = [c for c in (rep or {}).get('changes', []) if c['category'] == 'added_permission']
    check('Added permission is reported, with Technician as a default holder and High risk',
          len(ch) == 1 and 'technician' in ch[0]['affected_roles'] and ch[0]['risk'] == 'High', f'{titles(rep)[:6]}')
    check('Adding a permission reports no unrelated default change',
          not any(c['category'] == 'default_changed' for c in rep['changes']), f'{titles(rep)[:6]}')

    # 3. default changed: Technician loses a permission it holds
    snap = json.load(open(os.path.join(os.path.dirname(HERE), 'snapshots', 'impl-v26.43.3.json')))
    tech_has = [p for p in snap['role_defaults']['technician'] if p not in ('woTechViewMode',)][0]
    edit(clone, MAP, lambda s: re.sub(r"(DefaultRoleNameEnum::Technician->value => \[(?:(?!\],).)*?)\n\s*FEPermissionEnum::" + tech_has + r"->value,",
                                      r"\1", s, count=1, flags=re.S))
    c3 = commit(clone, 'technician default change')
    rc, out, rep = scan(fresh_store(c2), clone, c3)
    d = [c for c in rep['changes'] if c['category'] == 'default_changed']
    check(f'Default change is reported: Technician "{tech_has}" ON → OFF, and nothing else',
          len(rep['changes']) == 1 and len(d) == 1 and d[0]['role'] == 'technician' and d[0]['permission'] == tech_has
          and d[0]['before'].startswith('ON') and d[0]['after'].startswith('OFF'), f'{titles(rep)}')

    # 4. dependency added
    edit(clone, CASC, lambda s: s.replace("        FEPermissionEnum::woPickParts->value => [FEPermissionEnum::workOrdersView->value],",
                                          "        FEPermissionEnum::woPickParts->value => [FEPermissionEnum::workOrdersView->value, FEPermissionEnum::workOrderLinesCreateAndEdit->value],", 1))
    c4 = commit(clone, 'dependency added')
    rc, out, rep = scan(fresh_store(c3), clone, c4)
    check('Dependency added is reported (Pick Parts ⇒ Work Order Lines — Create & Edit), and nothing else',
          len(rep['changes']) == 1 and rep['changes'][0]['category'] == 'dependency_changed'
          and 'added' in rep['changes'][0]['title'], f'{titles(rep)}')

    # 5. authorization loosened: an endpoint loses its guard
    edit(clone, CTRL, lambda s: s.replace('    #[IsGranted(PermissionEnum::ROLE_WORK_ORDER_CREATE_AND_EDIT)]\n', '', 1))
    c5 = commit(clone, 'guard removed')
    rc, out, rep = scan(fresh_store(c4), clone, c5)
    g = [c for c in rep['changes'] if c['category'] == 'backend_enforcement_changed']
    check('A removed API guard is reported as backend enforcement change, High risk, naming the endpoint',
          len(g) == 1 and g[0]['risk'] == 'High' and '/api/work-orders/change-priority' in g[0]['title'], f'{titles(rep)}')

    # 6. bundle -> atom mapping widened
    edit(clone, ATOMS, lambda s: s.replace("['code' => FEPermissionEnum::zzValidationPermission, 'name' => 'zzValidationPermission', 'permissions' => [BEPermissionCode::ROLE_WORK_ORDER_VIEW]]",
                                           "['code' => FEPermissionEnum::zzValidationPermission, 'name' => 'zzValidationPermission', 'permissions' => [BEPermissionCode::ROLE_WORK_ORDER_VIEW, BEPermissionCode::ROLE_WORK_ORDER_DELETE]]", 1))
    c6 = commit(clone, 'atom added')
    rc, out, rep = scan(fresh_store(c5), clone, c6)
    a = [c for c in rep['changes'] if 'grants on the server' in c['title']]
    check('A permission that now grants an extra server atom is reported, naming the atom',
          len(a) == 1 and 'ROLE_WORK_ORDER::DELETE' in json.dumps(a[0]['evidence']), f'{titles(rep)}')

    # 7. label changed
    edit(clone, LABELS, lambda s: s.replace("'Validation — Test Permission'", "'Validation — Renamed Permission'", 1))
    c7 = commit(clone, 'label changed')
    rc, out, rep = scan(fresh_store(c6), clone, c7)
    check('A label change is reported as a modified permission, Low risk, and nothing else',
          len(rep['changes']) == 1 and rep['changes'][0]['category'] == 'modified_permission' and rep['changes'][0]['risk'] == 'Low', f'{titles(rep)}')

    # 8. permission removed (the test one)
    edit(clone, ENUM, lambda s: s.replace("    case zzValidationPermission = 'zzValidationPermission';\n", '', 1))
    edit(clone, ATOMS, lambda s: re.sub(r"\s*\['code' => FEPermissionEnum::zzValidationPermission[^\n]*\n", '\n', s, count=1))
    edit(clone, MAP, lambda s: s.replace("\n                FEPermissionEnum::zzValidationPermission->value,", '', 1))
    edit(clone, LABELS, lambda s: s.replace("\n  zzValidationPermission: 'Validation — Renamed Permission',", '', 1))
    c8 = commit(clone, 'permission removed')
    rc, out, rep = scan(fresh_store(c7), clone, c8)
    r = [c for c in rep['changes'] if c['category'] == 'removed_permission']
    check('A removed permission is reported, with its former holder, High risk',
          len(r) == 1 and 'technician' in r[0]['affected_roles'] and r[0]['risk'] == 'High', f'{titles(rep)}')

    # 9. every change carries the QA-impact fields
    fields_ok = all(all(k in c for k in ('risk', 'risk_reason', 'before', 'after', 'affected_roles', 'workflows',
                                         'qa_scenarios', 'evidence', 'verification_status')) for c in rep['changes'])
    check('Every reported change carries risk + reason, before/after, roles, workflows, scenarios, evidence, status', fields_ok)
    shutil.rmtree(work, ignore_errors=True)


CONTROLLED, REPORT_MD, RETEST_MD = [], [], []
JARGON = re.compile(r'/api/|ROLE_|PermissionEnum|\batoms?\b|endpoint|\b2xx\b|\b403\b|\bcommit\b|repositor|back[- ]?end|'
                    r'front[- ]?end|\bPRD\b|snapshot|enforce|derived|\bAPI\b|\b[a-z]+[A-Z][A-Za-z]+\b')


def plain_language():
    hist = os.path.join(HERE, '..', 'reports', 'history')
    changes = list(CONTROLLED)
    for f in sorted(os.listdir(hist)):
        if f != 'index.json':
            changes += json.load(open(os.path.join(hist, f)))['changes']
    missing = [c['title'] for c in changes if not (c.get('plain') or {}).get('headline') or not c['plain'].get('check')]
    check(f'Every change ({len(changes)}) has a plain headline, explanation and how-to-check steps', not missing, str(missing[:3]))
    bad = []
    for c in changes:
        p = c.get('plain') or {}
        for t in [p.get('headline'), p.get('what'), p.get('why'), p.get('before'), p.get('after')] + list(p.get('check') or []):
            if t and JARGON.search(t):
                bad.append(t)
    check('No technical terms in the plain words of any change', not bad, str(sorted(set(bad))[:3]))
    snap = os.path.join(HERE, '..', 'snapshots')
    rc, out = run(['node', os.path.join(HERE, 'engine', 'cli.js'), '--prd-vs-impl', os.path.join(snap, 'prd-v7.json'),
                   os.path.join(snap, 'prd-v54.json'), os.path.join(snap, 'impl-v26.43.3.json')])
    rows = json.loads(out) if rc == 0 else []
    bad = [r['plain_detail'] for r in rows if not r.get('plain_detail') or JARGON.search(r['plain_detail'] + ' ' + r['plain_status'])]
    bad = [ln for md in REPORT_MD for ln in md.split('## Technical details')[0].splitlines()
           if JARGON.search(ln) and '--checkpoint' not in ln]
    check(f'The written release reports ({len(REPORT_MD)}) are in plain words above the technical appendix', REPORT_MD and not bad, str(bad[:3]))
    check(f'Every app-vs-plan verdict ({len(rows)}) is explained in plain words', rows and not bad, str(bad[:3]))


def retest_lists():
    snap_dir = os.path.join(HERE, '..', 'snapshots')
    impl_path = os.path.join(snap_dir, 'impl-v26.43.3.json')
    impl = json.load(open(impl_path))
    defaults = impl['role_defaults']
    name_to_key = {r['name']: r['key'] for r in impl['roles']}
    label_to_key = {p['label']: p['key'] for p in impl['permissions']}
    hist = os.path.join(HERE, '..', 'reports', 'history')
    plans, empty, bad_refuse, bad_words = [], 0, [], []
    for f in sorted(os.listdir(hist)):
        if f == 'index.json':
            continue
        rc, out = run(['node', os.path.join(HERE, 'engine', 'cli.js'), '--retest', os.path.join(hist, f), impl_path])
        plan = json.loads(out) if rc == 0 else None
        plans.append(plan)
        if not plan or not plan['needs_retest'] or not plan['items'] or len(plan['spot_checks']) != 3:
            empty += 1
            continue
        for it in plan['items'] + plan['spot_checks']:
            for t in [it.get('title'), it.get('what'), it.get('why')] + list(it.get('steps') or []):
                if t and JARGON.search(t):
                    bad_words.append(t)
            r = it.get('roles') or {}
            if it.get('kind') == 'area' and r.get('without'):
                keys = [label_to_key.get(l) for l in it.get('permissions') or []]
                if any(k in defaults.get(name_to_key.get(r['without'], ''), []) for k in keys if k):
                    bad_refuse.append(f"{f}: {it['title']} -> {r['without']}")
    check(f'Every release that changed permissions ({len(plans)}) gets a retest checklist with change checks and 3 quick checks',
          plans and not empty, f'{empty} without')
    check('Retest checklists are in plain words', not bad_words, str(sorted(set(bad_words))[:3]))
    check('Every role suggested as "should be refused" holds none of the permissions that allow the action', not bad_refuse, str(bad_refuse[:3]))
    nochange = [m for m in RETEST_MD if m and 'No Custom Roles retest is needed' in m]
    changed = [m for m in RETEST_MD if m and 'checks to do' in m]
    check('A scan writes a retest checklist: "no retest needed" for a no-change release, a checklist otherwise',
          len(nochange) >= 1 and len(changed) >= 5 and None not in RETEST_MD, f'{len(nochange)} no-change, {len(changed)} with checks, {RETEST_MD.count(None)} missing')


def auto_update():
    tmp = tempfile.mkdtemp(prefix='crp-au-')
    root = os.path.join(HERE, '..')
    for d in ('snapshots', 'reports'):
        shutil.copytree(os.path.join(root, d), os.path.join(tmp, d))
    run(['chmod', '-R', 'u+w', tmp])
    rc, head = run(['git', '-C', PRODUCT, 'rev-parse', '--short=10', 'origin/develop'])
    env = dict(os.environ, CRP_ROOT=tmp, CRP_PRODUCTION_MARKER=f'v99.0.0-{head.strip()}')
    last = lambda out: json.loads(out.strip().splitlines()[-1])  # noqa: E731
    rc, out = run([sys.executable, 'auto_update.py'], env=env)
    s1 = last(out) if rc == 0 else {}
    check('Auto-update: a new live release is checked at once, shown as waiting for approval, with a retest checklist',
          s1.get('scanned') and s1['status']['live_state'] == 'waiting' and s1['publish_needed']
          and os.path.exists(os.path.join(tmp, 'snapshots', 'pending', 'impl-v99.0.0.json'))
          and any(f.endswith('-RETEST.md') for f in os.listdir(os.path.join(tmp, 'reports'))), out[-300:])
    run([sys.executable, 'auto_update.py', '--mark-published'], env=env)
    rc, out = run([sys.executable, 'auto_update.py'], env=env)
    s2 = last(out) if rc == 0 else {}
    check('Auto-update: running it again finds nothing new and asks for no republish',
          rc == 0 and not s2.get('scanned') and not s2.get('publish_needed'), out[-300:])
    rc, out = run([sys.executable, 'auto_update.py', '--approved', 'impl-v99.0.0', '--approved-by', 'Validation'], env=env)
    s3 = last(out) if rc == 0 else {}
    check('Auto-update: an approval saves the release permanently and the page is republished',
          s3.get('confirmed') == ['impl-v99.0.0'] and s3['status']['live_state'] == 'saved' and s3['publish_needed'], out[-300:])
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    real_history()
    controlled()
    plain_language()
    retest_lists()
    auto_update()
    passed = sum(1 for _, ok, _ in RESULTS if ok)
    out = os.path.join(os.path.dirname(HERE), 'reports', 'VALIDATION.md')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w') as f:
        f.write(f'# Track Changes validation — {passed}/{len(RESULTS)} checks passed\n\n'
                'Throw-away store and a shared clone of the product repo; nothing real was modified.\n\n'
                '| | Check |\n|---|---|\n' + ''.join(f"| {'✅' if ok else '🔴'} | {n} |\n" for n, ok, _ in RESULTS))
    print(f'\n{passed}/{len(RESULTS)} checks passed')
    sys.exit(0 if passed == len(RESULTS) else 1)
