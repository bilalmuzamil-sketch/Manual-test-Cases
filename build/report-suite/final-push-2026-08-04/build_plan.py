#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — build the complete operation plan.

Produces plan.json: one entry per TestRail write, with the EXACT intended payload
and the pre-write snapshot of every field, so the executor can do Rule-50
field-by-field byte verification.

THREE mechanical layers + one hand-authored layer:
  L1  attestation   — build-date + spec-version line appended to custom_expected (ALL 478)
  L2  refs pin      — Rule 42 version pin replacing the bare spec file path (358)
  L3  wording       — hand-authored repairs from wording_edits.py (Group C)

VARIABLES (the QA lead requires these be single constants — a later pass edits
one line here, not 478 strings):
"""
import json, re, os, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

# ─────────────────────────── THE VARIABLES ───────────────────────────
BUILD_DATE = "8/4/2026"          # M/D/YYYY — update this ONE constant next pass
BUILD_MARKER = "v3.4.1-0ed4433"  # for the audit log / recheck queue only

# report key -> (full tester-facing report name, spec version, spec lastModified date)
SPEC = {
    'SBC': ('Sales By Customer',        13, '2026-07-31'),
    'SBR': ('Sales By Representative',  15, '2026-07-29'),
    'PV':  ('Parts Velocity',            4, '2026-07-29'),
    'TU':  ('Technician Utilization',    5, '2026-07-29'),
    'WIP': ('Work In Progress',          6, '2026-07-29'),
    'IV':  ('Inventory Value',           3, '2026-07-29'),
}
SECTION_REPORT = {4282: 'SBC', 4283: 'SBR', 4284: 'PV', 4285: 'TU', 4286: 'WIP', 4287: 'IV'}

# bare spec file path -> the version-pinned replacement (Rule 42)
PATH_PIN = {
    'specs/sbc-sales-by-customer.md':       'SBC spec v13 2026-07-31',
    'specs/sbr-sales-by-representative.md': 'SBR spec v15 2026-07-29',
    'specs/parts-velocity.md':              'PV spec v4 2026-07-29',
    'specs/technician-utilization.md':      'TU spec v5 2026-07-29',
    'specs/wip-work-in-progress.md':        'WIP spec v6 2026-07-29',
    'specs/inventory-value.md':             'IV spec v3 2026-07-29',
}

ATTEST_SEP = '---'
ATTEST_LEAD = 'This is the expected behaviour as per the build tested on'

# ── the 8 Location-column cases: case text follows the BUILD, spec says the
#    opposite, Chris's ruling is PENDING.  Attestation must NOT claim the spec
#    agrees (coordinator instruction).  Held: attestation ONLY.
LOCATION_HELD = {30551, 30554, 30580, 30588, 38917, 30466, 30467, 38916}

# ── the ~10 defect-finding cases: our case asserts the spec, the build breaches
#    it, a ticket is filed.  QA lead 2026-08-04: "where there is a bug and you
#    found that, do not change those test cases".  Held: attestation ONLY.
DEFECT_HELD = {
    30554,  # IV S3-R13/S8-R3 default columns unbuilt  (also Location)
    30503,  # WIP S7-R9 first-visit location default
    30536,  # IV S1-R3 same
    30574,  # IV S7-R2 same
    30565,  # IV S5-R6 late as-of indicator
    30588,  # IV S10-R3 export ignores column selection/order  (also Location)
    30589,  # IV Story 10 money formatting as text
    30597,  # IV S12-R3 control order
    30519,  # WIP S10-R1 header colour
    30596,  # IV S12-R1 header colour
}

# ── held for Chris Ward: asset-identifier chain / single-location filter /
#    Estimates quoted value / date-picker preset list / rep label / PO-first
CHRIS_HELD = {
    30470, 30485, 30500,          # asset-identifier chain (VIN -> Unit # -> plate)
    30503, 30577,                 # single-location filter hidden
    30491,                        # Estimates quoted value
    30102, 30201, 30501, 30561, 30502,   # date-picker preset enumerations + cap
    30310, 30315,                 # rep label
    30186, 30096,                 # PO-should-see-first
    30173, 30291,                 # empty-export: two sources disagree, needs re-observation
}

# ── cases with NO spec anchor at all: the attestation says so plainly
NO_ANCHOR_TEXT = {
    38925: 'and this point is not covered by any of the six report specifications — '
           'it comes from the engineering technical plan.',
}

ANCHOR_RE = re.compile(r'S\d+-[RNE]\d+[a-z]?')
# spec-location fallbacks when there is no Sn-Rn anchor
STORY_RE = re.compile(r'(Story \d+[A-Za-z \-]*?|§\d+[A-Za-z \-]*?)(?=[;)—\-]|$)')

# markers in refs meaning: a later product decision overrides the spec wording
SUPERSEDE_RE = re.compile(
    r'RE-RULED|RULED HIDDEN|superseded|is stale|RENAMED|ADDED per|video-overrides-spec|'
    r'RESCOPED|newest-wins|still names|still has no|still carries|HIDDEN per|reshaped|'
    r'un-updated|spec drift|overrid', re.I)


def strip_attestation(expected: str) -> str:
    """Remove a previously written attestation block (idempotency)."""
    if not expected:
        return expected or ''
    lines = expected.split('\n')
    # find a trailing  '---'  followed by a line starting with the lead phrase
    for i in range(len(lines) - 1):
        if lines[i].strip() == ATTEST_SEP and lines[i + 1].lstrip().startswith(ATTEST_LEAD):
            return '\n'.join(lines[:i]).rstrip()
    return expected.rstrip()


def anchors_for(refs: str) -> str:
    """Tester-facing rendering of the governing requirement reference(s)."""
    a = ANCHOR_RE.findall(refs or '')
    if a:
        seen = []
        for x in a:
            if x not in seen:
                seen.append(x)
        return ', '.join(seen)
    # fall back to the Story / § location the refs names
    inner = refs
    m = re.search(r'\((.*)\)\s*$', refs or '', re.S)
    if m:
        inner = m.group(1)
    s = STORY_RE.findall(inner)
    if s:
        seen = []
        for x in s:
            x = x.strip()
            if x and x not in seen:
                seen.append(x)
        return ', '.join(seen)
    return ''


def attestation(case, report_key) -> str:
    name, ver, _d = SPEC[report_key]
    cid = case['id']
    if cid in NO_ANCHOR_TEXT:
        body = (f'{ATTEST_LEAD} {BUILD_DATE}, ' + NO_ANCHOR_TEXT[cid])
        return f'{ATTEST_SEP}\n{body}'
    anch = anchors_for(case.get('refs') or '')
    ref_part = (f'the {name} report specification version {ver}'
                + (f' ({anch})' if anch else ''))
    if cid in LOCATION_HELD:
        tail = ('; on this point that specification currently states otherwise and a '
                'product decision is still awaited, so treat the behaviour described '
                'above as what the build does today.')
    elif SUPERSEDE_RE.search(case.get('refs') or ''):
        tail = ('; where the wording of that specification differs, the behaviour above '
                'follows a later product decision, which is the authority.')
    else:
        tail = '.'
    body = f'{ATTEST_LEAD} {BUILD_DATE}, and as per {ref_part}{tail}'
    return f'{ATTEST_SEP}\n{body}'


STALE_PIN_RE = re.compile(r'(SBC|SBR|PV|TU|WIP|IV) spec v(\d+) (\d{4}-\d{2}-\d{2})')


def pin_refs(refs: str):
    """Rule 42 version pin. Returns (new_refs, kind) where kind is
    'pin' (bare file path -> version pin), 'refresh' (stale pin -> current), or None."""
    if not refs:
        return refs, None
    # (a) refresh a STALE pin — a stale spec version is itself a finding
    def _fix(m):
        rk = m.group(1)
        _n, ver, _d = SPEC[rk]
        d = SPEC[rk][2]
        return f'{rk} spec v{ver} {d}'
    refreshed = STALE_PIN_RE.sub(_fix, refs)
    if refreshed != refs:
        return refreshed, 'refresh'
    if STALE_PIN_RE.search(refs):
        return refs, None
    # (b) pin a bare spec file path
    for path, pin in PATH_PIN.items():
        if path in refs:
            return refs.replace(path, pin), 'pin'
    return refs, None


def norm_refs(s: str) -> str:
    """TestRail's DECLARED normalisation: split on comma, trim, rejoin bare comma."""
    return ','.join(p.strip() for p in (s or '').split(','))


def main():
    snap = json.load(open(os.path.join(HERE, 'snapshots', 'pre-write-live-cases-4281.json')))
    secs = {s['id']: s for s in json.load(open(os.path.join(HERE, 'data', 'live-sections.json')))}
    mine = [c for c in snap if c['created_by'] == 3]
    foreign = [c for c in snap if c['created_by'] != 3]
    assert len(mine) == 478, len(mine)
    assert len(foreign) == 5, len(foreign)

    def report_of(sid):
        while sid in secs:
            if sid in SECTION_REPORT:
                return SECTION_REPORT[sid]
            sid = secs[sid]['parent_id']
        raise KeyError(sid)

    sys.path.insert(0, HERE)
    from wording_edits import EDITS  # hand-authored layer

    plan, stats = [], collections.Counter()
    held = LOCATION_HELD | DEFECT_HELD | CHRIS_HELD
    for c in sorted(mine, key=lambda x: x['id']):
        cid = c['id']
        rk = report_of(c['section_id'])
        intended, snapshot = {}, {}
        for f in ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected',
                  'custom_atmstatus', 'custom_automation_type', 'section_id', 'type_id',
                  'template_id', 'priority_id', 'estimate', 'milestone_id'):
            snapshot[f] = c.get(f)

        # ---- L3 hand-authored wording (skipped entirely for held cases) ----
        ed = EDITS.get(cid)
        if ed and cid in held:
            raise SystemExit(f'FATAL: wording edit staged for HELD case C{cid}')
        base_expected = c.get('custom_expected') or ''
        if ed:
            for field, (old, new) in ed['fields'].items():
                cur = c.get(field) or ''
                if cur != old:
                    raise SystemExit(
                        f'FATAL C{cid}.{field}: staged OLD text does not match live.\n'
                        f'  live: {cur!r}\n  staged: {old!r}')
                intended[field] = new
                if field == 'custom_expected':
                    base_expected = new
            stats['L3_wording_cases'] += 1

        # ---- L1 attestation (ALL 478) ----
        new_expected = strip_attestation(base_expected) + '\n' + attestation(c, rk)
        if new_expected != (c.get('custom_expected') or ''):
            intended['custom_expected'] = new_expected
            stats['L1_attestation'] += 1

        # ---- L2 refs version pin ----
        # Coordinator instruction 2026-08-04, scoped verbatim to "the ~10 defect-finding
        # cases and the 7 Location cases, where this remains the ONLY permitted change":
        # those two families get the attestation and NOTHING else — not even a refs pin.
        # Their outstanding pins are reported for a separate go-ahead.
        nr, kind = pin_refs(c.get('refs') or '')
        if kind and cid in (DEFECT_HELD | LOCATION_HELD):
            stats['L2_withheld_attestation_only'] += 1
            kind = None
        if kind:
            if len(nr) > 248:
                raise SystemExit(f'FATAL C{cid}: pinned refs {len(nr)} chars > 248')
            if ',' in nr:
                raise SystemExit(f'FATAL C{cid}: pinned refs contains a comma')
            intended['refs'] = nr
            stats['L2_refs_' + kind] += 1

        if not intended:
            stats['no_op'] += 1
            continue
        plan.append({
            'case_id': cid, 'internal_report': rk,
            'title_snapshot': c['title'],
            'held': cid in held,
            'layers': sorted(set(
                (['L3'] if ed else []) +
                (['L1'] if 'custom_expected' in intended else []) +
                (['L2'] if 'refs' in intended else []))),
            'intended': intended, 'snapshot': snapshot,
        })
        stats['writes'] += 1

    out = os.path.join(HERE, 'plan.json')
    json.dump(plan, open(out, 'w'), indent=1)
    print('=== PLAN BUILT ===')
    for k, v in sorted(stats.items()):
        print('  %-22s %d' % (k, v))
    print('  held cases in plan     %d' % sum(1 for p in plan if p['held']))
    print('  held w/ ONLY L1        %d' % sum(1 for p in plan if p['held'] and p['layers'] == ['L1']))
    fields = collections.Counter()
    for p in plan:
        for f in p['intended']:
            fields[f] += 1
    print('  field-change counts:', dict(fields))
    # attestation variants
    v = collections.Counter()
    for p in plan:
        e = p['intended'].get('custom_expected', '')
        if 'still awaited' in e:
            v['pending-product-decision'] += 1
        elif 'later product decision, which is the authority' in e:
            v['later-product-decision'] += 1
        elif 'not covered by any of the six' in e:
            v['no-spec-anchor'] += 1
        elif ATTEST_LEAD in e:
            v['plain-spec-agreement'] += 1
    print('  attestation variants:', dict(v))
    print('  plan written ->', out)


if __name__ == '__main__':
    main()
