#!/usr/bin/env python3
"""
Standing Rule 54 provenance retrofit — build the operation plan for ONE project.

Produces plan.json: one entry per TestRail write, carrying
  * the EXACT intended payload, and
  * a pre-write snapshot of EVERY field,
so the executor can do the Rule-50 field-by-field byte verification and prove that
every field we did NOT intend to change is byte-identical afterwards.

  usage:  python3 build_plan.py schedule
          python3 build_plan.py filters

LAYERS
  L1  provenance line   — appended to custom_expected on 100% of the cases (Rule 54)
  L2  Filters refs      — the literal "Filters (no Jira epic)" replaced by the owning
                          story key, because epic SV-8785 now EXISTS (Rule 31/20).
                          Schedule refs already carry story keys: untouched.
  L3  mechanical repair — two unambiguous formatting defects found by the Rule-41
                          whole-case re-reads.  Nothing substantive.

Rule 38: the plan REFUSES to include any case not created by us (created_by != 3).
"""
import json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from classify import PROJECT, CLASSIFY, provenance, strip_provenance   # noqa: E402

# ─────────────── L2: Filters story map, verified live 2026-08-04 ───────────────
# Epic SV-8785 has exactly 14 children, and they map 1:1 BY TITLE AND IN ORDER onto
# the spec's 14 stories, so  Story n -> SV-(8785 + n).
FILTERS_STALE_TICKET = 'Filters (no Jira epic)'
FILTERS_EPIC = 'SV-8785'
# NOTE: the compact '[epic]' marker is deliberate.  TestRail rejects any single
# comma-entry over 248 chars with HTTP 400 'does not match the required pattern'
# (Rule 50 declared behaviour), and the Filters refs already run to 248 chars.
# The fuller '[epic - cross-cutting; no single-story owner]' wording used on
# Schedule would push 1 case to 274 chars, so the level is marked compactly here
# and the cross-cutting reason is recorded in the id-map + the audit log.
FILTERS_XCUT = f'{FILTERS_EPIC} [epic]'
STORY_RE = re.compile(r'S(\d+)-[RNE]\d+')

# ───────────────────────── L3: the mechanical repairs ─────────────────────────
# Each entry is (field, exact OLD text, exact NEW text).  The executor asserts the
# OLD text still matches live before writing, so a drifted case stops the batch.
REPAIRS = {
    'schedule': {
        # SCH-HRS-04 — a bare internal case cross-reference "(/02)" leaked into
        # tester-facing preconditions.  Meaningless to a manual tester (Rules 7/9).
        38849: [('custom_preconds',
                 "1. The shop has business hours set (/02).\n"
                 "2. A technician has the 'Set custom hours for this technician' toggle OFF.",
                 "1. The shop has business hours set for the shop.\n"
                 "2. A technician has the 'Set custom hours for this technician' toggle OFF.")],
    },
    'filters': {
        # FLT-MOB-04 — a paste accident put a note into the References field after a
        # ",-," separator.  The note text is preserved, the artefact removed.
        # (The BODY of this case is also corrupted; that repair is STAGED, not
        #  executed, because the case sits in the mobile cluster whose product
        #  question is open — see STAGED-REPAIRS.md.)
        29624: [('refs', None, None)],   # handled specially in refs_for()
    },
}


def refs_for(project, case):
    """L2 — return (new_refs, note) or (None, None) if refs is not being written."""
    if project != 'filters':
        return None, None
    refs = case.get('refs') or ''
    if FILTERS_STALE_TICKET not in refs:
        return None, None

    tail = refs.split(FILTERS_STALE_TICKET, 1)[1].lstrip()

    # C29624: strip the ",-,<note>" paste artefact out of refs, keeping the note text
    if case['id'] == 29624:
        tail = tail.replace(
            '] ,-,', '] ')          # defensive
        tail = re.sub(r'\s*,\s*-\s*,\s*', ' ; ', tail)

    stories = sorted({int(m) for m in STORY_RE.findall(refs)})
    if len(stories) == 1 and 1 <= stories[0] <= 14:
        ticket = f'SV-{8785 + stories[0]}'
        kind = f'story SV-{8785 + stories[0]} (spec Story {stories[0]})'
    else:
        ticket = FILTERS_XCUT
        kind = ('epic (cross-cutting: %s)' %
                ('no numbered story anchor' if not stories
                 else 'spans spec Stories ' + ', '.join(str(s) for s in stories)))
    new = f'{ticket} {tail}'.strip()
    # TestRail's DECLARED refs normalisation: split on comma, trim, rejoin bare comma
    new = ','.join(p.strip() for p in new.split(','))
    return new, kind


def main():
    project = sys.argv[1]
    p = PROJECT[project]
    snap_path = os.path.join(HERE, '..', 'snapshots',
                             f'pre-write-live-cases-{p["group"]}.json')
    cases = json.load(open(snap_path))
    mine = [c for c in cases if c.get('created_by') == 3]
    foreign = [c for c in cases if c.get('created_by') != 3]
    if foreign:
        raise SystemExit(f'FATAL Rule 38: {len(foreign)} foreign case(s) in the '
                         f'snapshot: {[c["id"] for c in foreign]}')
    expected_n = {'schedule': 165, 'filters': 110}[project]
    assert len(mine) == expected_n, f'{project}: {len(mine)} != {expected_n}'

    FIELDS = ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected',
              'custom_atmstatus', 'custom_automation_type', 'section_id', 'type_id',
              'template_id', 'priority_id', 'estimate', 'milestone_id')

    plan, stats = [], collections.Counter()
    for c in sorted(mine, key=lambda x: x['id']):
        cid = c['id']
        snapshot = {f: c.get(f) for f in FIELDS}
        intended = {}

        # ---- L1: the provenance line (100% of cases) ----
        base = strip_provenance(c.get('custom_expected') or '')
        block = provenance(project, c)
        intended['custom_expected'] = f'{base}\n\n{block}' if base else block
        kind = CLASSIFY.get(project, {}).get(cid, ('plain', None))[0]
        stats[kind] += 1

        # ---- L2: Filters refs epic backfill ----
        new_refs, refs_kind = refs_for(project, c)
        if new_refs and new_refs != (c.get('refs') or ''):
            intended['refs'] = new_refs
            stats['refs_backfilled'] += 1
            # Rule 50 declared normalisation guard: every comma-entry <= 248 chars
            for part in new_refs.split(','):
                if len(part.strip()) > 248:
                    raise SystemExit(f'FATAL C{cid}: refs entry {len(part.strip())} '
                                     f'chars > 248 -> TestRail would HTTP 400')

        # ---- L3: mechanical repairs ----
        for field, old, new in REPAIRS.get(project, {}).get(cid, []):
            if old is None:
                continue                      # handled by refs_for()
            cur = c.get(field) or ''
            if cur != old:
                raise SystemExit(f'FATAL C{cid}.{field}: staged OLD text does not '
                                 f'match live.\n  live:   {cur!r}\n  staged: {old!r}')
            intended[field] = new
            stats['repairs'] += 1

        if intended['custom_expected'] == snapshot['custom_expected'] and len(intended) == 1:
            stats['already_current_skipped'] += 1
            continue
        plan.append({'case_id': cid, 'kind': kind,
                     'refs_kind': refs_kind,
                     'intended': intended, 'snapshot': snapshot})

    out = os.path.join(HERE, '..', 'plan.json')
    json.dump(plan, open(out, 'w'), indent=1)
    print(f'{project}: {len(plan)} operations planned over {len(mine)} cases')
    for k, v in sorted(stats.items()):
        print(f'   {k:26s} {v}')
    # honesty: show a couple of rendered sentences
    for want in ('plain', 'po_ruling', 'no_anchor', 'spec_two_ways',
                 'design_awaiting', 'techplan_detail', 'po_prose_only'):
        for e in plan:
            if e['kind'] == want:
                print(f'\n[{want}] C{e["case_id"]}')
                print('   ' + e['intended']['custom_expected'].split('---')[-1].strip())
                break


if __name__ == '__main__':
    main()
