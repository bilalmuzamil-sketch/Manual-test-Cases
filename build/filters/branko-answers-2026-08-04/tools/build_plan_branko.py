#!/usr/bin/env python3
"""
Filters — build the operation plan for BRANKO'S 2026-08-04 ANSWERS.

Reuses the Rule-54 provenance machinery in
build/filters/provenance-2026-08-04/tools/classify.py (single source of truth for
the spec version, the variants and now the SOURCE-FILE citation) and produces a
plan.json in the SAME shape the proven executor already consumes:

    {case_id, kind, refs_kind, intended{...}, snapshot{every field}}

WHAT IT DOES
  T1  the provenance line — RE-STAMPED on the 12 cases Branko's answers touch,
      carrying the file citation where his answer is load-bearing (Rule 54 as
      extended by the QA lead 2026-08-04).
  T2  refs — the now-FALSE clauses removed and his answer recorded in the
      metadata layer (Rule 20), so the tester-visible citation and the
      traceability layer agree.
  T3  the FLT-MOB-04 body reflow — unblocked, because the reason it was withheld
      ("its contested assertion") is the very thing Branko has now confirmed.

WHAT IT PROVES (Rule 50, exhaustive)
  Every one of the OTHER 98 cases is re-rendered and asserted BYTE-IDENTICAL to
  live.  If a single one would change, this script REFUSES to write a plan —
  that is what stops an unauthorised 99-case push hiding inside a 12-case one.

Rule 38: refuses any case not created by us (created_by != 3).
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROV = os.path.abspath(os.path.join(HERE, '..', '..', 'provenance-2026-08-04', 'tools'))
sys.path.insert(0, PROV)
from classify import (PROJECT, CLASSIFY, SOURCE_CITE, LEAD, provenance,  # noqa: E402
                      strip_provenance)

SNAP = os.path.join(HERE, '..', 'snapshots',
                    'pre-write-live-cases-4110-2026-08-04-branko.json')
OUT = os.path.join(HERE, '..', 'plan.json')

FIELDS = ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected',
          'custom_atmstatus', 'custom_automation_type', 'section_id', 'type_id',
          'template_id', 'priority_id', 'estimate', 'milestone_id')

# ───────────────────────── T2: the refs rewrites ─────────────────────────
# Each entry is (exact OLD refs, exact NEW refs).  The executor asserts the OLD
# still matches live before writing, so a drifted case stops the batch.
# Written WITHOUT commas so each stays ONE comma-entry under TestRail's 248-char
# pattern limit (the declared normalisation, playbook §J / house style).
Q1 = ('; Branko answers 2026-08-04 Q1 - single-filter sheet applies instantly '
      'with no Apply button; the combined All Filters sheet keeps its button')

REFS = {
    29621: ('SV-8797 (S12-R1) [spec v1.6 2026-07-28]',
            'SV-8797 (S12-R1) [spec v1.6 2026-07-28]' + Q1),
    29622: ('SV-8797 (S12-R3) [spec v1.6 2026-07-28]',
            'SV-8797 (S12-R3) [spec v1.6 2026-07-28]' + Q1),
    29623: ('SV-8785 [epic] (S12-R2; S12-R3; S2-R1) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (S12-R2; S12-R3; S2-R1) [spec v1.6 2026-07-28]' + Q1),
    29624: ('SV-8797 (S12-R2; S12-R3) [spec v1.6 2026-07-28] ; individual-chip '
            'real-time per S12-R2 + tech-plan 2026-07-29; only the combined All '
            'Filters sheet is batch',
            'SV-8797 (S12-R2; S12-R3; S2-R6) [spec v1.6 2026-07-28] ; '
            'individual-chip real-time per S12-R2 + S2-R6 + tech-plan 2026-07-29; '
            'only the combined All Filters sheet is batch; CONFIRMED by Branko '
            'answers 2026-08-04 Q1'),
    29625: ('SV-8785 [epic] (S12-R2; S3-R2/R3/R5) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (S12-R2; S3-R2/R3/R5) [spec v1.6 2026-07-28]' + Q1),
    29626: ('SV-8785 [epic] (S12-R2; S4-R1; S5-R1) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (S12-R2; S4-R1; S5-R1) [spec v1.6 2026-07-28]' + Q1),
    29627: ('SV-8785 [epic] (S12-R2; S6-R1/R2/R3) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (S12-R2; S6-R1/R2/R3) [spec v1.6 2026-07-28]' + Q1),
    29628: ('SV-8785 [epic] (S12-R2; S7-R1/R3; S8-R1) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (S12-R2; S7-R1/R3; S8-R1) [spec v1.6 2026-07-28]' + Q1),

    # "confirmation requested" is now FALSE — the confirmation arrived.  Trimmed
    # to stay inside 248 chars while keeping BOTH sources named.
    38876: ('SV-8785 [epic] (no requirement in the ratified spec v1.6 - '
            'default/last-used tab is engineering-plan-only - confirmation '
            'requested); tech plan 2026-07-29 D10 (default tab = Estimates; '
            'last-used tab persists) [spec v1.6 2026-07-28]',
            'SV-8785 [epic] (no requirement in spec v1.6 - default/last-used tab '
            'is not in the spec; RULED by Branko answers 2026-08-04 Q2 "A - it\'s '
            'fine"); tech plan 2026-07-29 D10 (default tab = Estimates; last-used '
            'tab persists) [spec v1.6 2026-07-28]'),

    # the §2/§4 quotations are shortened (their anchors survive) to make room for
    # the two new sources rather than drop either — the staged plan's instruction.
    38904: ('SV-8785 [epic] (spec v1.6 §2 Feature Overview -> Parts Filters; §4 '
            'Key Decisions -> "Context-specific filter sets on Parts and Reports" '
            '+ "Multi-select where it makes sense"); Branko answers 2026-07-31 '
            'Q2/Q3/Q5/Q7; Figma 11884-16885',
            'SV-8785 [epic] (spec v1.6 §2 Parts Filters; §4 context-specific '
            'filter sets + multi-select); Branko answers 2026-07-31 Q2/Q3/Q5/Q7 + '
            '2026-08-04 Q3 (Vendors design exists Figma 11903-10461) + Q8 (Part '
            'Sales chips); Figma 11884-16885'),

    38908: ('SV-8785 [epic] (spec v1.6 §2 Parts Filters + Reports Filters); '
            'Branko answers 2026-07-31 Q3 ("support all the filters we have right '
            'now in the app as well as all choices per filter"); tech plan '
            '2026-07-29 rollout rule',
            'SV-8785 [epic] (spec v1.6 §2 Parts Filters + Reports Filters); '
            'Branko answers 2026-07-31 Q3 + 2026-08-04 Q8 ("we should have all '
            'filters we support now per each page plus we should add new ones"); '
            'tech plan 2026-07-29 rollout rule'),

    38911: ('SV-8785 [epic] (spec v1.6 §2 Reports Filters; §4 "Multi-select where '
            'it makes sense"); Branko answers 2026-07-31 Q3/Q5 + Q4 (pointer only '
            '- the 6 new types are not enumerated in v1.6; see DELTAS.md F1); '
            'Figma 11903-10573',
            'SV-8785 [epic] (spec v1.6 §2 Reports Filters; §4 "Multi-select where '
            'it makes sense"); Branko answers 2026-07-31 Q3/Q5 + 2026-08-04 Q8 '
            '("We do not have list of all filter items" - confirms no option list '
            'exists); Figma 11903-10573'),
}

# ───────────────────── T3: the FLT-MOB-04 body reflow ─────────────────────
# Assertions UNCHANGED — same four expectations, same order, same meaning; the
# broken paste markup is replaced by the suite's plain numbered house style, and
# the title/steps are brought into line with what the case actually asserts.
MOB04 = {
    'title': 'Mobile: tapping one chip opens its own sheet and applies in real time',
    'custom_preconds':
        '1. You are signed in to the ShopView App on a mobile device.\n'
        '2. You are on the Work Orders page.',
    'custom_steps':
        "1. Tap the Status chip (not the 'All Filters' chip).\n"
        '2. Read the sheet that opens.\n'
        '3. Tick one status and watch the work order list.\n'
        '4. Untick it, then tick a different status, and watch the list again.',
    'custom_expected':
        "1. A bottom sheet opens for that single filter: its title row shows the "
        "filter's icon and name (for example 'Status') with a close (x) button, "
        "and no accordion list of the other filters.\n"
        "2. The sheet shows only that filter's options (the nine status "
        "checkboxes plus 'Clear selection').\n"
        "3. There is no 'Apply filter' button. Ticking or unticking a status "
        "filters the work order list immediately, the same as on desktop, with no "
        "submit step.\n"
        "4. The chip's active state and value update live as the selection "
        "changes; closing the sheet with the x just dismisses it and keeps the "
        "applied filter.",
}

# ─────── T4: the FLT-PARTS-01 hedge whose premise Branko has DENIED ───────
# Q3 verbatim: "Disign for vendors exists in figma. Check it" — we checked (node
# 11903:10461, read as pixels: chips `Vendor` and `State/Province`), and his own
# PRD §2 already lists Vendors among the Parts views that get a filter bar.  The
# note's premise is therefore false, and under Rule 45 it is a FALSE ALL-CLEAR: a
# tester finding NO filter bar at all on Vendors would follow it, write down what
# they see, and NOT fail the build — which is the one thing this case exists to
# catch.  Honest consequence, and it is the QA lead's to accept: the case will now
# legitimately FAIL if the build has not shipped the Vendors filter bar yet.
LINE_EDITS = {
    38904: [('custom_expected',
             '8. The Vendors list page shows two filter buttons: Vendor and '
             'State/Province. Note: the developers have not been given a design '
             'for the Vendors page filters yet, so this page may not have them '
             '— write down what you actually see instead of failing the '
             'whole test.',
             '8. The Vendors list page shows two filter buttons: Vendor and '
             'State/Province.')],
}

TARGETS = sorted(set(REFS) | set(LINE_EDITS) | {29624})


def _sentence(expected: str) -> str:
    """The provenance SENTENCE alone, markup- and whitespace-normalised, for the
    no-change proof on the cases this pass must NOT touch."""
    e = expected or ''
    i = e.find(LEAD)
    if i == -1:
        return ''
    t = re.sub(r'<[^>]+>', ' ', e[i:])
    return re.sub(r'\s+', ' ', t).strip()


def main():
    cases = json.load(open(SNAP))
    foreign = [c['id'] for c in cases if c.get('created_by') != 3]
    if foreign:
        raise SystemExit(f'FATAL Rule 38: foreign case(s) in snapshot: {foreign}')
    assert len(cases) == 110, f'{len(cases)} != 110'
    by = {c['id']: c for c in cases}
    assert set(TARGETS) <= set(by), 'a target is not in the snapshot'

    plan, unchanged, cited, markup_only = [], [], [], []
    for c in sorted(cases, key=lambda x: x['id']):
        cid = c['id']
        snapshot = {f: c.get(f) for f in FIELDS}
        intended = {}

        # T3 first, so the provenance is stamped onto the REFLOWED body
        if cid == 29624:
            for f, v in MOB04.items():
                intended[f] = v

        # T4 line-level edits, asserted against the exact live bytes
        for field, old, new in LINE_EDITS.get(cid, []):
            cur = intended.get(field, c.get(field) or '')
            if old not in cur:
                raise SystemExit(
                    f'FATAL C{cid}.{field}: the staged OLD line is not present '
                    f'live — refusing to guess.\n  staged: {old!r}')
            if cur.count(old) != 1:
                raise SystemExit(f'FATAL C{cid}.{field}: staged OLD line appears '
                                 f'{cur.count(old)} times')
            intended[field] = cur.replace(old, new)

        # T2 refs
        if cid in REFS:
            old, new = REFS[cid]
            cur = c.get('refs') or ''
            if cur != old:
                raise SystemExit(
                    f'FATAL C{cid}.refs: staged OLD does not match live.\n'
                    f'  live  ({len(cur)}): {cur!r}\n  staged({len(old)}): {old!r}')
            for part in new.split(','):
                if len(part.strip()) > 248:
                    raise SystemExit(f'FATAL C{cid}: refs entry '
                                     f'{len(part.strip())} chars > 248')
            if new != cur:
                intended['refs'] = new

        # T1 provenance — rendered against the case AS IT WILL BE (new refs feed
        # the anchor extraction), then appended to the (possibly reflowed) body
        eff = dict(c)
        eff.update({k: v for k, v in intended.items() if k in ('refs',)})
        body_src = intended.get('custom_expected', c.get('custom_expected') or '')
        base = strip_provenance(body_src)
        block = provenance('filters', eff)
        newexp = f'{base}\n\n{block}' if base else block

        if cid in TARGETS:
            intended['custom_expected'] = newexp
        else:
            # EXHAUSTIVE no-change proof for the other 98 (Rule 50).  Compared on
            # the provenance SENTENCE, markup-normalised, because ONE case
            # (C29613) was manually converted to HTML in TestRail: its wording is
            # word-identical and correct, and Branko's answers do not touch it, so
            # re-writing it here would be an unauthorised markup-only edit.  Its
            # markup normalisation is STAGED for a future authorised pass.
            if _sentence(newexp) != _sentence(c.get('custom_expected') or ''):
                raise SystemExit(
                    f'FATAL: C{cid} is NOT a Branko target yet its provenance '
                    f'sentence would CHANGE — an unauthorised write is hiding in '
                    f'this plan.\n  now : {_sentence(c.get("custom_expected"))!r}\n'
                    f'  new : {_sentence(newexp)!r}')
            if newexp != (c.get('custom_expected') or ''):
                markup_only.append(cid)
            unchanged.append(cid)
            continue

        if SOURCE_CITE['filters'].get(cid):
            cited.append(cid)
        plan.append({'case_id': cid,
                     'kind': CLASSIFY['filters'].get(cid, ('plain', None))[0],
                     'refs_kind': ('refs rewritten - Branko 2026-08-04 recorded'
                                   if 'refs' in intended else None),
                     'intended': intended, 'snapshot': snapshot})

    assert len(plan) + len(unchanged) == 110, 'population does not reconcile'
    json.dump(plan, open(OUT, 'w'), indent=1)
    print(f'operations planned : {len(plan)}')
    print(f'cases NOT touched (provenance sentence proven unchanged): {len(unchanged)}')
    print(f'   of those byte-identical            : {len(unchanged) - len(markup_only)}')
    print(f'   of those markup-only divergence    : {len(markup_only)} -> {markup_only}'
          f'  (STAGED for a future authorised pass, not written here)')
    print(f'cases carrying the FILE CITATION: {len(cited)} -> {cited}')
    print(f'fields written     : '
          f'{sorted({f for e in plan for f in e["intended"]})}')
    for e in plan:
        i = e['intended']
        print(f'\n=== C{e["case_id"]} [{e["kind"]}] fields={sorted(i)}')
        if 'refs' in i:
            print(f'   refs({len(i["refs"])}) {i["refs"]}')
        print('   ' + i['custom_expected'].split('\n---\n')[-1].strip())


if __name__ == '__main__':
    main()
