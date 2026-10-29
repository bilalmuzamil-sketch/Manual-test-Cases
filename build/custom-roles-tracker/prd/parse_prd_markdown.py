#!/usr/bin/env python3
"""Parse a VERBATIM Confluence markdown export of the Custom Roles PRD into a PRD snapshot.

Used for every PRD version after the original (v7 is built by build_prd_snapshot.py from tables
that are cell-checked against the v7 source). The input file is the export itself, saved
unedited under prd/source/; nothing is retyped, so every quote in the snapshot is the PRD's own
sentence (Rule 113).

  python3 parse_prd_markdown.py source/prd-v54.md 54   -> ../snapshots/prd-v54.json

What it reads, by section:
  System Role Templates -> Permission Matrix   role x setting matrix (4 tables) + Role Descriptions
  Permission Settings: Complete Reference      per-setting "Controls"/"Behavior" text, keyed by the
                                               section's **Key:** line, or by the row's own `key`
A section with NO key line (e.g. v54 "1h. View Part History") is kept, given a key derived from
its label, and flagged `prd_key_missing` - it is never dropped and never guessed into a code.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_prd_snapshot import PAGE, PRD_ROLE_TO_IMPL, CRUD_ROWS  # noqa: E402

AREA_KEYS = {'workOrders', 'workOrderLines', 'schedule', 'customers', 'partSales', 'catalogInventory',
             'vendorOrderManagement', 'invoicingPayments', 'timesheets'}
LEVEL = {'View': 'View', 'Edit': 'CreateAndEdit', 'Delete': 'Delete', 'Delete / Reverse': 'Delete'}
TOGGLE_KEYS = {'reports': 'reportsPageAccess', 'customerPortal': 'customerPortalPageAccess',
               'billingPortal': 'billingPortalPageAccess', 'partsDepartment': 'partsDepartment',
               'settings': 'settings', 'seeFinancialData': 'seeFinancialData', 'seeApArData': 'seeApArData',
               'viewHistoryLogs': 'viewHistoryLogs'}
SETTING_LABELS = {'App Settings': 'settingsApp', 'Service': 'settingsService', 'Parts': 'settingsParts',
                  'Integrations': 'settingsIntegrations', 'Finance': 'settingsFinance',
                  'Data Import': 'settingsDataImport', 'View/Manage Wages': 'settingsWages', 'Wages': 'settingsWages'}
TOGGLE_ROWS = {'Reports': 'reportsPageAccess', 'Customer Portal': 'customerPortalPageAccess',
               'Parts Dept': 'partsDepartment', 'Billing Portal': 'billingPortalPageAccess', 'Settings': 'settings'}
OTHER_ROWS = {'Review WOs': 'woReviewWorkOrders', 'Pick Parts': 'woPickParts', 'Order Parts': 'woOrderParts',
              'See Financial': 'seeFinancialData', 'See AP/AR': 'seeApArData', 'History Logs': 'viewHistoryLogs'}
# A setting the PRD RELABELLED without a **Key:** line -> the code it was before, ONLY where the
# PRD's own change log says so (see relabel_evidence). Never inferred from a similar name.
RELABELLED = {'View Part History': 'viewHistoryLogs'}


def relabel_evidence(body, label):
    m = re.search(r'Changed - “View History Logs”[^|]*?Relabel “' + re.escape(label) + r'”[^|]*', body)
    return {'section': 'Change Log', 'verbatim': m.group(0).strip()} if m else None


HEADER_ROLE = {'Owner': 'system-owner', 'Admin': 'system-admin', 'Svc Mgr': 'system-sm', 'Sr. SA': 'system-ssa',
               'Svc Advisor': 'system-jsa', 'Foreman': 'system-foreman', 'Tech': 'system-tech',
               'Parts Mgr': 'system-pm', 'Parts Tech': 'system-pt', 'Office': 'system-office',
               'Sales Rep': 'system-salesrep', 'Time Clock': 'system-timeclock'}


def table_rows(lines):
    out = []
    for ln in lines:
        if not ln.startswith('|'):
            continue
        cells = [c.strip() for c in ln.strip().strip('|').split('|')]
        if all(set(c) <= {'-', ' '} for c in cells):
            continue
        out.append(cells)
    return out


def sections(body):
    """[(heading, [lines])] for every #..#### heading. A heading's block that holds MORE THAN ONE
    **Key:** line is split there, and the extra part is named after its **Label:** - v54 dropped the
    "1c. Schedule" heading, so Schedule's rows sit inside "1b. Work Order Lines"; without the split
    they would be read as Work Order Lines permissions."""
    raw, cur, buf = [], None, []
    for ln in body.splitlines():
        if re.match(r'^#{1,4} ', ln):
            if cur is not None:
                raw.append((cur, buf))
            cur, buf = ln.lstrip('#').strip(), []
        else:
            buf.append(ln)
    if cur is not None:
        raw.append((cur, buf))
    out = []
    for h, ls in raw:
        keys = [i for i, ln in enumerate(ls) if ln.startswith('**Key:**')]
        if len(keys) <= 1:
            out.append((h, ls)); continue
        out.append((h, ls[:keys[1]]))
        for n, k in enumerate(keys[1:]):
            part = ls[k:keys[n + 2]] if n + 2 < len(keys) else ls[k:]
            lab = next((re.sub(r'\*\*Label:\*\*\s*', '', x).strip() for x in part if x.startswith('**Label:**')), 'unnamed')
            out.append((f'{lab} (no heading in this version; follows "{h}")', part))
    return out


def clean(c):
    return c.replace('**', '').strip()


def parse(path, version, created=None):
    raw = open(path).read()
    m = re.match(r'<!--(.*?)-->\n', raw, re.S)
    body = raw[m.end():] if m else raw
    if created is None and m:
        cm = re.search(r'created (\S+),', m.group(1))
        created = cm.group(1) if cm else None
    secs = sections(body)
    sd = {h: ls for h, ls in secs}

    # ── matrix ──
    defaults, cell_ev, matrix_cols, coverage = {}, {}, None, {}
    matrix_lines = sd.get('Permission Matrix', [])
    blocks, cur = [], []
    for ln in matrix_lines:
        if ln.startswith('|'):
            cur.append(ln)
        elif cur:
            blocks.append(cur); cur = []
    if cur:
        blocks.append(cur)
    for blk in blocks:
        rows = table_rows(blk)
        header, data = rows[0], rows[1:]
        cols = [HEADER_ROLE[h] for h in header[1:]]
        for c in cols:
            defaults.setdefault(c, set())
        if header[0] == 'Area':
            matrix_cols = cols
        for cells in data:
            label, vals = clean(cells[0]), cells[1:]
            if header[0] == 'Area':
                area, levels = CRUD_ROWS[label]
                row_keys = [f'{area}{l}' for l in levels.split('/') if l not in ('inherit', '-')]
            elif header[0] == 'Toggle':
                row_keys = [TOGGLE_ROWS[label]]
            elif header[0] == 'Sub-setting':
                row_keys = [SETTING_LABELS[label]]
            elif label == 'View Mode':
                row_keys = ['woFullViewMode', 'woTechViewMode']
            else:
                row_keys = [OTHER_ROWS[label]]
            # Sub-settings are listed only for roles with Settings ON; the PRD says so
            # ("only for roles with Settings ON"), so every other role is STATED off, not unstated.
            covered = list(HEADER_ROLE.values()) if header[0] == 'Sub-setting' else cols
            for k in row_keys:
                coverage.setdefault(k, set()).update(covered)
            for role, v in zip(cols, vals):
                v = v.strip()
                if v in ('—', '-', ''):
                    continue
                grants = []
                if header[0] == 'Area':
                    area, levels = CRUD_ROWS[label]
                    for letter, lvl in zip('VED', levels.split('/')):
                        if letter in v.split('/') and lvl not in ('inherit', '-'):
                            grants.append(f'{area}{lvl}')
                elif header[0] == 'Toggle' and v == 'ON':
                    grants.append(TOGGLE_ROWS[label])
                elif header[0] == 'Sub-setting' and v == 'ON':
                    grants.append(SETTING_LABELS[label])
                elif header[0] == 'Setting':
                    if label == 'View Mode':
                        grants.append('woFullViewMode' if v == 'Full' else 'woTechViewMode')
                    elif v == 'ON':
                        grants.append(OTHER_ROWS[label])
                for g in grants:
                    defaults[role].add(g)
                    cell_ev.setdefault(role, {})[g] = {'table': f'Permission Matrix — {header[0]}', 'row': label, 'cell': v}

    roles = []
    for cells in table_rows(sd.get('Role Descriptions', []))[1:]:
        rid = cells[1].strip('`')
        roles.append({'key': rid, 'name': cells[0], 'description_verbatim': cells[2],
                      'impl_role': PRD_ROLE_TO_IMPL.get(rid), 'deletable_when_system': False})

    # ── per-setting descriptions ──
    perms, seen = [], set()
    for h, ls in secs:
        text = '\n'.join(ls)
        km = re.search(r'\*\*Key:\*\*\s*`([^`]+)`', text)
        key = km.group(1) if km else None
        lm = re.search(r'\*\*Label:\*\*\s*(.+?)\s*$', text, re.M)
        label = lm.group(1).strip() if lm else h
        rows = table_rows(ls)
        if not rows:
            continue
        head = [clean(c) for c in rows[0]]
        for cells in rows[1:]:
            first = clean(cells[0])
            pk, lbl, verb = None, None, cells[-1]
            if key in AREA_KEYS and first in LEVEL:
                pk, lbl = f'{key}{LEVEL[first]}', f'{label} — {clean(cells[1])}'
            elif len(cells) >= 3 and re.fullmatch(r'`\w+`', cells[1].strip()):
                pk, lbl = cells[1].strip('` '), clean(cells[2]) if len(cells) > 3 else first
            elif head[0] == 'Sub-setting' and first in SETTING_LABELS:
                pk, lbl = SETTING_LABELS[first], first
            elif key == 'viewMode' and first in ('Full View', 'Tech View'):
                pk, lbl = ('woFullViewMode' if first == 'Full View' else 'woTechViewMode'), f'View Mode — {first}'
            elif head[:1] == ['State'] and first == 'ON':
                if key in TOGGLE_KEYS:
                    pk, lbl = TOGGLE_KEYS[key], label
                elif key is None and label in RELABELLED:
                    pk, lbl = RELABELLED[label], label
                elif key is None:
                    pk, lbl = 'prd:' + re.sub(r'\W+', '-', label.lower()).strip('-'), label
            if pk and pk not in seen:
                seen.add(pk)
                entry = {'key': pk, 'label': lbl, 'prd_section': h, 'controls_verbatim': verb,
                         'prd_only': pk in ('partsDepartment', 'settings') or pk.startswith('prd:'),
                         'prd_key_missing': key is None and head[:1] == ['State']}
                if key is None and label in RELABELLED:
                    entry['key_mapping_evidence'] = relabel_evidence(body, label)
                perms.append(entry)

    # ── dependencies, each with the PRD's own sentence where one exists ──
    deps = []
    def q(sec, pat):
        t = '\n'.join(sd.get(sec, []))
        m2 = re.search(pat, t)
        return {'section': sec, 'verbatim': m2.group(0).strip()} if m2 else {'section': sec, 'verbatim': None}
    crud_q = q('1. CRUD Areas', r'\*\*Enabling a higher level[^\n]*|Enabling a higher level[^\n]*')
    for a in ('workOrders', 'schedule', 'customers', 'partSales', 'catalogInventory', 'vendorOrderManagement',
              'invoicingPayments'):
        deps += [{'child': f'{a}Delete', 'parent': f'{a}CreateAndEdit', 'kind': 'implies', 'quote': crud_q},
                 {'child': f'{a}CreateAndEdit', 'parent': f'{a}View', 'kind': 'implies', 'quote': crud_q}]
    deps += [{'child': 'timesheetsCreateAndEdit', 'parent': 'timesheetsView', 'kind': 'implies', 'quote': crud_q},
             {'child': 'workOrderLinesDelete', 'parent': 'workOrderLinesCreateAndEdit', 'kind': 'implies', 'quote': crud_q},
             {'child': 'workOrderLinesCreateAndEdit', 'parent': 'workOrdersView', 'kind': 'implies',
              'quote': q('1b. Work Order Lines', r'Work Order Lines is a child of Work Orders\.[^\n]*')}]
    sub_q = q('1a. Work Orders', r'[^\n]*only require Work Orders[^\n]*')
    for c in ('woReviewWorkOrders', 'woPickParts', 'woOrderParts'):
        deps.append({'child': c, 'parent': 'workOrdersView', 'kind': 'implies', 'quote': sub_q})
    parts_q = q('2d. Parts Department (Parent Gate)', r'\| OFF \|[^\n]*')
    for a in ('partSales', 'catalogInventory', 'vendorOrderManagement'):
        for lvl in ('View', 'CreateAndEdit', 'Delete'):
            deps.append({'child': f'{a}{lvl}', 'parent': 'partsDepartment', 'kind': 'gated_by', 'quote': parts_q})
    fin_q = q('5a. See Financial Data', r'\*\*Dependenc(?:y|ies):\*\*[^\n]*')
    if not fin_q['verbatim']:
        fin_q = q('Part Sales', r'\*\*Financial gate:\*\*[^\n]*')
    for a in ('partSales', 'invoicingPayments'):
        for lvl in ('View', 'CreateAndEdit', 'Delete'):
            deps.append({'child': f'{a}{lvl}', 'parent': 'seeFinancialData', 'kind': 'requires', 'quote': fin_q})
    apar_fin = q('5b. Manage Accounts Payable and Receivable', r'\*\*Financial gate:\*\*[^\n]*')
    if apar_fin['verbatim']:
        deps.append({'child': 'seeApArData', 'parent': 'seeFinancialData', 'kind': 'requires', 'quote': apar_fin})
    inv_del = q('1i. Invoicing', r'2\. “Delete” additionally requires[^\n]*')
    if inv_del['verbatim']:
        deps.append({'child': 'invoicingPaymentsDelete', 'parent': 'seeApArData', 'kind': 'requires', 'quote': inv_del})
    set_q = q('3. Settings Access', r'\| OFF \|[^\n]*')
    for k in sorted(set(SETTING_LABELS.values())):
        if any(p['key'] == k for p in perms):
            deps.append({'child': k, 'parent': 'settings', 'kind': 'gated_by', 'quote': set_q})

    rules = []
    for sec, pat, key in (('Roles', r'[^\n]*System roles can be edited[^\n]*|[^\n]*cannot be edited[^\n]*', 'role_editability'),
                          ('Office Users Cannot Create Invoices', r'Office users are expected[^\n]*', 'office_no_invoice'),
                          ('Office Users Cannot Create Invoices', r'- A hard coded rule[^\n]*', 'office_no_invoice_rule'),
                          ('Staff Page Updates', r"[^\n]*forced logout[^\n]*", 'forced_logout')):
        m3 = re.search(pat, '\n'.join(sd.get(sec, [])))
        if m3:
            rules.append({'key': key, 'section': sec, 'verbatim': m3.group(0).strip()})

    change_log = []
    for cells in table_rows(sd.get('Change Log', []))[1:]:
        if any(c.strip() for c in cells):
            change_log.append({'date': cells[0].strip() or None, 'reporter': cells[1].strip() or None,
                               'change_verbatim': cells[2].strip() if len(cells) > 2 else ''})
    return {
        'schema_version': 1, 'kind': 'prd',
        'change_log': change_log,
        'source': dict(PAGE, version=version, created_at=created, source_file=os.path.relpath(path, HERE),
                       status_in_page=(re.search(r'\*\*Status:\*\*\s*(\w+)', body) or [None, None])[1]),
        'evidence_level': 'Documented intent (PRD). Not implementation, not verified behaviour.',
        'roles': roles, 'permissions': perms,
        'role_defaults': {r: sorted(v) for r, v in defaults.items()},
        'cell_evidence': cell_ev, 'dependencies': deps, 'rules': rules,
        'matrix_roles': matrix_cols,
        'matrix_coverage': {k: sorted(v & set(matrix_cols or [])) for k, v in sorted(coverage.items())},
    }


if __name__ == '__main__':
    src, ver = sys.argv[1], int(sys.argv[2])
    snap = parse(os.path.join(HERE, src) if not os.path.isabs(src) else src, ver)
    out = os.path.join(HERE, 'out', f'prd-v{ver}.json')
    json.dump(snap, open(out, 'w'), indent=1, ensure_ascii=False)
    print(f"{os.path.normpath(out)}: {len(snap['roles'])} roles, {len(snap['permissions'])} settings described, "
          f"{sum(len(x) for x in snap['role_defaults'].values())} role grants, {len(snap['dependencies'])} dependencies, "
          f"{len(snap['rules'])} rules")
