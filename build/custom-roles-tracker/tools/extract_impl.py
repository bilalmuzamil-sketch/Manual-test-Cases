#!/usr/bin/env python3
"""Custom Roles & Permissions Evolution Tracker - IMPLEMENTATION snapshot extractor.

Reads the ShopView product repository AT A NAMED COMMIT OR TAG - never the working tree - and
writes one structured snapshot of how Custom Roles & Permissions are implemented there:

  permissions      every bundle code, its on-screen label, its group, the back-end atoms it grants
  roles            the 11 seeded system roles, which can be edited, which can clock in
  role_defaults    which permissions each system role holds by default
  dependencies     the server-side cascade (child -> implied parent)
  endpoints        every API route and the atoms that guard it (#[IsGranted] incl. expressions)
  voters           every isGranted()/denyAccessUnlessGranted() check on an atom, by file
  fe_references    which front-end files reference each permission code (screens/gates)
  fe_dependency_logic   a fingerprint of the role editor's cascade code (comments stripped)

Sources inside the repo, all read with `git show <commit>:<path>`:
  api/src/Auth/Domain/Model/FEPermissionEnum.php            permission catalog
  api/src/Auth/UI/Cli/Command/RoleFePermissionMappings.php  system-role defaults
  api/src/Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php permission -> atoms
  api/src/Auth/Domain/Model/FEPermissionCascade.php         server cascade
  api/src/Auth/Domain/Model/Role.php                        editability / clock-capable
  api/src/**.php                                            #[Route] + #[IsGranted] + voters
  app/src/components/ts/administration/permissions/labels.ts  on-screen labels
  app/src/services/permissions/cascade.ts                   role-editor cascade logic
  app/src/**                                                front-end references

Usage:
  python3 extract_impl.py --repo /home/user/shopview --ref v26.43.3 [--build-marker v26.43.3-439ddb6]
          [--out ../snapshots/impl-v26.43.3.json]

Nothing here is inferred. A layer that cannot be read at that commit is listed under
"unavailable" and every consumer shows it as NEEDS VERIFICATION, never as empty.
"""
import argparse, datetime, hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EXTRACTOR_VERSION = '1.0.1'

LABELS_TS = 'app/src/components/ts/administration/permissions/labels.ts'
CASCADE_TS = 'app/src/services/permissions/cascade.ts'
FE_DEFINITION_FILES = {LABELS_TS, CASCADE_TS, 'app/src/services/permissions/bundleCatalog.ts'}


def git(repo, *args, check=True):
    r = subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip()[:300]}")
    return r.stdout


def git_show(repo, commit, path):
    r = subprocess.run(['git', '-C', repo, 'show', f'{commit}:{path}'], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def cat_files(repo, commit, paths):
    """Read many blobs in one process (git cat-file --batch)."""
    if not paths:
        return {}
    p = subprocess.Popen(['git', '-C', repo, 'cat-file', '--batch'], stdin=subprocess.PIPE,
                         stdout=subprocess.PIPE)
    data, _ = p.communicate(''.join(f'{commit}:{x}\n' for x in paths).encode())
    out, i = {}, 0
    for path in paths:
        nl = data.index(b'\n', i)
        header = data[i:nl].decode()
        i = nl + 1
        if header.endswith('missing'):
            continue
        size = int(header.split()[2])
        out[path] = data[i:i + size].decode('utf-8', 'replace')
        i += size + 1
    return out


# ── PHP attribute parsing ────────────────────────────────────────────────────────────────────────
def _balanced(text, start, open_ch, close_ch):
    """Return index just past the bracket that closes text[start] (an open_ch). String-aware."""
    depth, i, n, q = 0, start, len(text), None
    while i < n:
        c = text[i]
        if q:
            if c == '\\':
                i += 2
                continue
            if c == q:
                q = None
        elif c in '\'"':
            q = c
        elif c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return n


def strip_php_comments(src):
    """Remove // # /* */ comments, keeping strings and #[attributes] intact. A docblock that
    MENTIONS #[IsGranted(...)] must never be read as a guard."""
    out, i, n, q = [], 0, len(src), None
    while i < n:
        c = src[i]
        if q:
            out.append(c)
            if c == '\\' and i + 1 < n:
                out.append(src[i + 1]); i += 2; continue
            if c == q:
                q = None
            i += 1; continue
        if c in '\'"':
            q = c; out.append(c); i += 1; continue
        if src.startswith('/*', i):
            j = src.find('*/', i + 2); i = n if j == -1 else j + 2; out.append(' '); continue
        if src.startswith('//', i) or (c == '#' and not src.startswith('#[', i)):
            j = src.find('\n', i); i = n if j == -1 else j; continue
        out.append(c); i += 1
    return ''.join(out)


DECL = re.compile(r'\b(?:(?:abstract|final|readonly)\s+)*class\s+(\w+)|\bfunction\s+(\w+)\s*\(')


def php_declarations(src):
    """Yield (kind, name, [attribute texts]) for each class/function, with the attributes that
    immediately precede it. Attributes are '#[ ... ]' blocks, bracket-balanced."""
    pending, i, n = [], 0, len(src)
    while i < n:
        a = src.find('#[', i)
        d = DECL.search(src, i)
        if a != -1 and (d is None or a < d.start()):
            end = _balanced(src, a + 1, '[', ']')
            pending.append(src[a + 2:end - 1])
            i = end
            continue
        if d is None:
            break
        nxt = DECL.search(src, d.end())
        body = src[d.end():nxt.start() if nxt else n]
        yield ('class' if d.group(1) else 'function', d.group(1) or d.group(2), pending, body)
        pending = []
        i = d.end()


def attr_name_args(attr):
    m = re.match(r'\s*([\\\w]+)\s*(\((.*)\))?\s*$', attr, re.S)
    if not m:
        return None, ''
    return m.group(1).split('\\')[-1], (m.group(3) or '')


SHORT_ROUTES = {'Get': 'GET', 'Post': 'POST', 'Put': 'PUT', 'Patch': 'PATCH', 'Delete': 'DELETE'}


def route_info(args, consts, verb=None):
    path = None
    m = re.search(r"(?:path\s*:\s*)?['\"]([^'\"]*)['\"]", args)
    if m:
        path = m.group(1)
    methods = []
    mm = re.search(r'methods\s*:\s*(\[[^\]]*\]|[^,)]+)', args)
    if mm:
        for tok in re.findall(r"'([A-Z]+)'|\"([A-Z]+)\"|METHOD_([A-Z]+)", mm.group(1)):
            methods.append(next(t for t in tok if t))
    if verb:
        methods = [verb]
    return path, sorted(set(methods))


def atoms_in(text, aliases, atom_consts):
    found = set()
    for alias in aliases:
        for c in re.findall(rf'\b{re.escape(alias)}::(\w+)', text):
            if c in atom_consts:
                found.add(atom_consts[c])
    for s in re.findall(r"['\"](ROLE_[A-Z0-9_*]+::[A-Z0-9_*]+)['\"]", text):
        found.add(s)
    return sorted(found)


def permission_aliases(src):
    al = {'PermissionEnum'}
    for m in re.finditer(r'use\s+App\\IAM\\AccessControl\\Domain\\PermissionEnum(?:\s+as\s+(\w+))?\s*;', src):
        if m.group(1):
            al.add(m.group(1))
    return al


def extract_backend_enforcement(repo, commit, atom_consts):
    files = git(repo, 'grep', '-l', '-E', r'IsGranted|isGranted\(|denyAccessUnlessGranted|PermissionEnum', commit,
                '--', 'api/src', check=False).splitlines()
    files = [f.split(':', 1)[1] for f in files if f.endswith('.php')]
    blobs = {p: strip_php_comments(t) for p, t in cat_files(repo, commit, files).items()}

    # Voters / permission resolvers: every atom the class refers to, by class short name.
    # Voters / resolvers / policies: the atoms AND the bundles each class checks. Some voters read
    # the role's BUNDLES directly (FEPermissionEnum::x) because no atom expresses the rule - those
    # are enforcement too, and must not be lost. One hop is followed into an injected resolver.
    voter_atoms = {}
    for path, src in blobs.items():
        base = os.path.basename(path)[:-4]
        if base.endswith(('Voter', 'Resolver', 'Policy')):
            al = permission_aliases(src)
            atoms = {atom_consts[c] for a in al for c in re.findall(rf'\b{re.escape(a)}::(\w+)', src)
                     if c in atom_consts}
            bundles = set(re.findall(r'\bFEPermissionEnum::(\w+)', src))
            uses = set(re.findall(r'\b(\w+(?:Resolver|Policy))\s+\$', src))
            voter_atoms[base] = {'file': path, 'atoms': atoms, 'bundles': bundles, 'uses': uses}
    for v in voter_atoms.values():
        for u in list(v['uses']):
            if u in voter_atoms:
                v['atoms'] |= voter_atoms[u]['atoms']; v['bundles'] |= voter_atoms[u]['bundles']

    def resolve(text, aliases):
        atoms, bundles, via = set(atoms_in(text, aliases, atom_consts)), set(), []
        for vc in sorted(set(re.findall(r'\b(\w+(?:Voter|Resolver|Policy))::\w+', text))):
            if vc in voter_atoms:
                atoms |= voter_atoms[vc]['atoms']; bundles |= voter_atoms[vc]['bundles']
                via.append(voter_atoms[vc]['file'])
            else:
                via.append(vc)
        return sorted(atoms), sorted(bundles), via

    endpoints, unrouted = {}, []
    for path, src in blobs.items():
        aliases = permission_aliases(src)
        class_prefix, class_methods, class_guards = '', [], []
        for kind, name, attrs, body in php_declarations(src):
            routes, guards = [], []
            for a in attrs:
                nm, args = attr_name_args(a)
                if nm == 'Route' or nm in SHORT_ROUTES:
                    routes.append(route_info(args, atom_consts, SHORT_ROUTES.get(nm)))
                elif nm == 'IsGranted':
                    first = re.split(r',\s*(?:subject|message|statusCode|exceptionCode)\s*:', args)[0]
                    atoms, bundles, via = resolve(first, aliases)
                    guards.append({'where': 'attribute', 'expression': re.sub(r'\s+', ' ', first).strip(),
                                   'atoms': atoms, 'bundles': bundles, 'via': via})
            if kind == 'class':
                class_guards = guards
                class_prefix, class_methods = (routes[0][0] or '', routes[0][1]) if routes else ('', [])
                continue
            for m in re.finditer(r'(?:isGranted|denyAccessUnlessGranted)\(\s*([^,)]+)', body):
                expr = m.group(1).strip()
                atoms, bundles, via = resolve(expr, aliases)
                if atoms or bundles or via or 'ROLE_' in expr:
                    guards.append({'where': 'in-method', 'expression': re.sub(r'\s+', ' ', expr),
                                   'atoms': atoms, 'bundles': bundles, 'via': via})
            all_guards = class_guards + guards
            def add(full, meths):
                full = '/' + full.lstrip('/')   # some routes are written without the leading slash
                eid = f"{'|'.join(meths)} {full}"
                endpoints[eid] = {'id': eid, 'path': full, 'methods': meths,
                                  'controller': f'{path}::{name}', 'guards': all_guards,
                                  'atoms': sorted({x for g in all_guards for x in g['atoms']}),
                                  'bundles': sorted({x for g in all_guards for x in g.get('bundles', [])})}
            if routes:
                for p, meth in routes:
                    if class_prefix and name != '__invoke':
                        full = class_prefix.rstrip('/') + '/' + (p or '').lstrip('/')
                    else:
                        full = p or class_prefix
                    add(full.rstrip('/') or '/', meth or class_methods or ['ANY'])
            elif name == '__invoke' and class_prefix:
                add(class_prefix, class_methods or ['ANY'])
            elif any(g['where'] == 'attribute' for g in guards) and path.endswith('Controller.php'):
                unrouted.append({'site': f'{path}::{name}', 'guards': guards})
    return endpoints, voter_atoms, unrouted


# ── front end ────────────────────────────────────────────────────────────────────────────────────
def extract_labels(src):
    if not src:
        return {}
    block = src[src.find('BUNDLE_LABELS'):]
    return {m.group(1): m.group(2) for m in re.finditer(r"^\s*(\w+)\s*:\s*'((?:[^'\\]|\\.)*)'", block, re.M)}


def strip_ts_comments(src):
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    src = re.sub(r'(^|[^:])//[^\n]*', r'\1', src)
    return re.sub(r'\s+', ' ', src).strip()


BE_DEFINITION_FILES = ('FEPermissionEnum.php', 'RoleFePermissionMappings.php', 'FEPermissionMappings.php',
                       'FEPermissionCascade.php')


def extract_be_bundle_checks(repo, commit, codes):
    """Every back-end file that names a permission (bundle) code outside the files that DEFINE the
    catalog: handlers, voters and policies that check a bundle directly."""
    if not codes:
        return {}
    pat = r"FEPermissionEnum::(" + '|'.join(sorted(codes, key=len, reverse=True)) + r")\b|['\"](" + \
          '|'.join(sorted(codes, key=len, reverse=True)) + r")['\"]"
    out = git(repo, 'grep', '-n', '-o', '-E', pat, commit, '--', 'api/src', check=False)
    refs = {c: set() for c in codes}
    for line in out.splitlines():
        parts = line.split(':', 3)
        if len(parts) < 4:
            continue
        path = parts[1]
        if path.endswith(BE_DEFINITION_FILES) or '/OneOff/' in path:
            continue
        tok = re.sub(r"^FEPermissionEnum::|['\"]", '', parts[3])
        if tok in refs:
            refs[tok].add(path)
    return {c: sorted(v) for c, v in refs.items()}


def extract_fe_references(repo, commit, codes):
    if not codes:
        return {}
    pattern = r"['\"`](" + '|'.join(sorted(codes, key=len, reverse=True)) + r")['\"`]"
    out = git(repo, 'grep', '-n', '-o', '-E', pattern, commit, '--', 'app/src', check=False)
    refs = {c: set() for c in codes}
    for line in out.splitlines():
        parts = line.split(':', 3)
        if len(parts) < 4:
            continue
        path, token = parts[1], parts[3].strip('\'"`')
        if (path in FE_DEFINITION_FILES or '/tests/' in path or '/test/' in path or '.spec.' in path
                or '__tests__' in path or path.startswith('app/src/testing/')):
            continue
        if token in refs:
            refs[token].add(path)
    return {c: sorted(v) for c, v in refs.items()}


def group_of(code, label):
    if label and ' — ' in label:
        return label.split(' — ')[0]
    if code.startswith('accounting') or code == 'hrPageAccess':
        return 'Accounting'
    if code.startswith('settings'):
        return 'Settings'
    if code in ('seeFinancialData', 'seeApArData', 'viewHistoryLogs'):
        return 'Cross-cutting'
    if code.endswith('PageAccess'):
        return 'Page access'
    return 'Other'


# ── ticket references written next to the code (leads, never proof of approval) ───────────────────
ENUM_PHP = 'api/src/Auth/Domain/Model/FEPermissionEnum.php'
ROLE_MAP_PHP = 'api/src/Auth/UI/Cli/Command/RoleFePermissionMappings.php'


def code_ticket_refs(enum_src, rolemap_src, name_to_slug):
    """Jira keys written in the comment block directly above each permission's enum case, and above
    each FEPermissionEnum::x line inside each role's default list."""
    perm, role = {}, {}
    if enum_src:
        lines = enum_src.splitlines()
        for i, ln in enumerate(lines):
            m = re.match(r'\s*case (\w+) = ', ln)
            if not m:
                continue
            j, block = i - 1, []
            while j >= 0 and re.match(r'\s*//', lines[j]) and not re.match(r'\s*//\s*===', lines[j]):
                block.insert(0, lines[j].strip()[2:].strip()); j -= 1
            if block:
                perm[m.group(1)] = {'tickets': sorted(set(re.findall(r'\bSV-\d+', ' '.join(block)))),
                                    'comment': ' '.join(block)}
    if rolemap_src:
        cur, block, started = None, [], False
        for ln in rolemap_src.splitlines():
            rm = re.match(r"\s*DefaultRoleNameEnum::(\w+)->value\s*=>\s*\[", ln)
            if rm:
                cur, block, started = rm.group(1), [], False
                continue
            if re.match(r'\s*//', ln):
                block.append(ln.strip()[2:].strip()); continue
            pm = re.match(r'\s*FEPermissionEnum::(\w+)->value', ln)
            if pm and cur and block:
                t = sorted(set(re.findall(r'\bSV-\d+', ' '.join(block))))
                # the comment that OPENS a role's list describes the role, not its first permission
                key = '_role' if not started else pm.group(1)
                role.setdefault(cur, {})[key] = {'tickets': t, 'comment': ' '.join(block)}
            if pm:
                started = True
            if pm or ln.strip().startswith('],'):
                block = []
    return perm, role


# ── main ─────────────────────────────────────────────────────────────────────────────────────────
def extract(repo, ref, build_marker=None):
    commit = git(repo, 'rev-parse', f'{ref}^{{commit}}').strip()
    cdate = git(repo, 'log', '-1', '--format=%cI', commit).strip()
    tags = git(repo, 'tag', '--points-at', commit, check=False).split()
    dump = json.loads(subprocess.run(['php', os.path.join(HERE, 'php', 'dump_permissions.php'), repo, commit],
                                     capture_output=True, text=True, check=True).stdout)
    unavailable = dict(dump.get('unavailable') or {})
    # A method that did not exist yet at this release is NOT a gap in our reading of it.
    not_present = {}
    for k, why in list(unavailable.items()):
        if 'Call to undefined method' in why or 'does not exist' in why:
            not_present[k] = why
            unavailable.pop(k)
    atom_consts = dump.get('atoms') or {}
    bundles = list((dump.get('bundles') or {}).values())
    labels = extract_labels(git_show(repo, commit, LABELS_TS))
    if not labels:
        unavailable['fe_labels'] = f'{LABELS_TS} not readable at this commit'
    name_to_slug = {}
    drn, rt = dump.get('default_role_names') or {}, dump.get('role_templates') or {}
    for case, display in drn.items():
        if case in rt:
            name_to_slug[display] = rt[case]
    uneditable = set(dump.get('uneditable_templates') or [])
    clockable = set(dump.get('clock_capable_templates') or [])
    roles = [{'key': rt[c], 'name': drn.get(c, c), 'enum_case': c,
              'editable_when_system': (rt[c] not in uneditable) if 'uneditable_templates' in dump else None,
              'deletable_when_system': False,
              'clock_capable': (rt[c] in clockable) if 'clock_capable_templates' in dump else None}
             for c in rt]
    role_defaults = {}
    for display, codes in (dump.get('role_defaults') or {}).items():
        role_defaults[name_to_slug.get(display, display)] = sorted(set(codes))
    implied = dump.get('cascade_implied_parents') or {}
    dependencies = sorted(({'child': c, 'parent': p, 'kind': 'implies', 'enforced_by': 'server cascade (FEPermissionCascade)'}
                           for c, ps in implied.items() for p in ps), key=lambda d: (d['child'], d['parent']))
    endpoints, voters, unrouted = extract_backend_enforcement(repo, commit, atom_consts)
    voters = {v['file']: {'atoms': sorted(v['atoms']), 'bundles': sorted(v['bundles'])}
              for v in voters.values() if v['atoms'] or v['bundles']}
    atom_endpoints = {}
    for e in endpoints.values():
        for a in e['atoms']:
            atom_endpoints.setdefault(a, []).append(e['id'])
    cascade_src = git_show(repo, commit, CASCADE_TS)
    perm_refs, role_refs_by_case = code_ticket_refs(git_show(repo, commit, ENUM_PHP),
                                                    git_show(repo, commit, ROLE_MAP_PHP), name_to_slug)
    role_refs = {rt.get(case, case): v for case, v in role_refs_by_case.items()}
    bundle_atoms = dump.get('bundle_atoms') or {}
    hub = set(dump.get('accounting_hub_bundles') or [])
    fe_refs = extract_fe_references(repo, commit, bundles)
    be_checks = extract_be_bundle_checks(repo, commit, bundles)
    office_editable = set(dump.get('office_editable_permissions') or [])
    jwt_file = None
    if hub:
        # the file that WRITES the claim, not one that merely lists the bundles (e.g. a seeder)
        hits = git(repo, 'grep', '-l', "'accounting_permissions'", commit, '--', 'api/src', check=False).split()
        hits = sorted((h.split(':', 1)[1] for h in hits), key=lambda f: ('Jwt' not in f, f))
        jwt_file = hits[0] if hits else None
    permissions = []
    for code in bundles:
        atoms = bundle_atoms.get(code, [])
        eps = sorted({eid for a in atoms for eid in atom_endpoints.get(a, [])} |
                     {e['id'] for e in endpoints.values() if code in e.get('bundles', [])})
        permissions.append({'key': code, 'label': labels.get(code), 'group': group_of(code, labels.get(code)),
                            'accounting_hub': code in hub, 'atoms': atoms,
                            'backend_endpoints': eps,
                            'backend_bundle_checks': be_checks.get(code, []),
                            'enforced_outside_repo': ({'by': 'the standalone accounting service',
                                                       'how': 'core puts the code in the proxy JWT claim accounting_permissions',
                                                       'evidence': jwt_file} if code in hub and code != 'accountingView' and jwt_file else None),
                            'office_editable': code in office_editable if 'office_editable_permissions' in dump else None,
                            'code_comment': perm_refs.get(code),
                            'fe_references': fe_refs.get(code, [])})
    snap = {
        'schema_version': 1,
        'kind': 'implementation',
        'release': {'ref': ref, 'tags': tags, 'commit': commit, 'commit_short': commit[:7],
                    'commit_date': cdate, 'build_marker': build_marker},
        'extracted_at': datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(),
        'extractor_version': EXTRACTOR_VERSION,
        'evidence_level': 'Repository analysis at the named commit. NOT verified behaviour on a running build.',
        'roles': roles,
        'permissions': permissions,
        'role_defaults': role_defaults,
        'dependencies': dependencies,
        'default_code_comments': role_refs,
        'endpoints': sorted(endpoints.values(), key=lambda e: e['id']),
        'atom_endpoints': {a: sorted(v) for a, v in sorted(atom_endpoints.items())},
        'voters': dict(sorted(voters.items())),
        'guarded_without_route': unrouted,
        'atoms': sorted(set(atom_consts.values())),
        'intentional_atom_changes': dump.get('intentional_atom_changes'),
        'fe_dependency_logic': {'file': CASCADE_TS,
                                'fingerprint': hashlib.sha256(strip_ts_comments(cascade_src).encode()).hexdigest()
                                if cascade_src else None,
                                'functions': sorted(set(re.findall(r'export const (\w+)', cascade_src or '')))},
        'unavailable': unavailable,
        'not_present_at_release': not_present,
    }
    if not cascade_src:
        snap['unavailable']['fe_dependency_logic'] = f'{CASCADE_TS} not readable at this commit'
    return snap


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='/home/user/shopview')
    ap.add_argument('--ref', required=True)
    ap.add_argument('--build-marker')
    ap.add_argument('--out')
    a = ap.parse_args()
    s = extract(a.repo, a.ref, a.build_marker)
    text = json.dumps(s, indent=1, ensure_ascii=False, sort_keys=False)
    if a.out:
        open(a.out, 'w').write(text + '\n')
        print(f"{a.out}: {len(s['permissions'])} permissions, {len(s['roles'])} roles, "
              f"{len(s['endpoints'])} endpoints, {len(s['dependencies'])} dependencies, "
              f"unavailable={list(s['unavailable'])}")
    else:
        print(text)
