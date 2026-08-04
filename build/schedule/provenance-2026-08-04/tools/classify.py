#!/usr/bin/env python3
"""
Standing Rule 54 provenance retrofit — the CLASSIFICATION tables for Schedule and
Filters, and the sentence builder.

THE VARIABLES (Rule 54 requires these be single constants, not 275 hand-typed
strings — a later pass edits one line here and re-runs):

    PROJECT['schedule']['spec_version'] = '23'
    PROJECT['filters']['spec_version']  = '1.6'

Every provenance sentence in both suites is generated from these plus the case's own
`refs`.  Nothing is hard-coded per case except the CLASSIFICATION (which honesty
variant a case needs) and the RULING DATE — both of which are evidence, not wording.

The state written is STATE 1 of Rule 54 (spec + epic, NO build date): neither suite
has a QA environment, so nothing here has been live-verified.
"""
import re

# ───────────────────────────── THE VARIABLES ─────────────────────────────
PROJECT = {
    'schedule': {
        'group': 4254,
        'epic': 'SV-8685',
        'spec_name': 'Schedule',
        'spec_version': '23',          # Confluence page version, verified live 2026-08-04
        'anchor_style': 'section',     # §4.9 style
    },
    'filters': {
        'group': 4110,
        'epic': 'SV-8785',             # DISCOVERED 2026-07-31, verified live 2026-08-04
        'spec_name': 'Filters',
        'spec_version': '1.6',         # page-body version; Confluence version 14
        'anchor_style': 'requirement', # S2-R6 style
    },
}

SEP = '---'
LEAD = 'This is the expected behaviour as per epic'

# ─────────────────── CLASSIFICATION: which honesty variant ───────────────────
# 'plain'            the spec supports the expectation as written
# 'po_ruling'        a later PO decision overrides the spec text  -> needs a date
# 'po_prose_only'    spec covers the area in prose only (no numbered requirement)
#                    and the detail comes from a later PO decision -> needs a date
# 'spec_two_ways'    the spec states the point two different ways and NO ruling
#                    exists yet (Rule 15: never pick a side silently)
# 'design_awaiting'  the screen comes from the agreed design, the spec does not
#                    describe it, and a PO decision is still awaited
# 'techplan_detail'  the spec covers the area but the specific limits come from
#                    the engineering technical plan
# 'no_anchor'        no numbered requirement in the spec covers this at all

CLASSIFY = {
'schedule': {
    # ── PO ruling: Branko Q3, 2026-07-22 — "We do not show total $ anywhere in the
    #    schedule."  Spec §4.9 still says the modal lists lines "with labor/total
    #    figures", so the ruling overrides the spec text.
    30011: ('po_ruling', '2026-07-22'),   # SCH-MODAL-04 no money fields in the modal
    30614: ('po_ruling', '2026-07-22'),   # SCH-PERM-12 money-bearing fields masked
    38874: ('po_ruling', '2026-07-22'),   # SCH-API-03 no pricing fields in responses

    # ── PO ruling: Branko Q6=A, 2026-07-31 — "Vin is always visible on hover
    #    regardless of the toggle."  The §9 View-options table row puts the tooltip
    #    VIN under the toggle; §4.13 lists it unconditionally.  Ruling settles it.
    30034: ('po_ruling', '2026-07-31'),   # SCH-TIP-01 tooltip shows VIN regardless
    30045: ('po_ruling', '2026-07-31'),   # SCH-VIEW-04 toggle gates the block only

    # ── Spec states it BOTH ways and Branko has NOT answered (question NQ-1):
    #    §4.5  "Shop closures and public holidays are not skipped in V1."
    #    §12   "Shop closures ... block the spread step from placing shifts on
    #           those days."
    30089: ('spec_two_ways', None),       # SCH-EDGE-05 closures do not block spread
    29983: ('spec_two_ways', None),       # SCH-SPREAD-07 closures not skipped
    29984: ('spec_two_ways', None),       # SCH-SPREAD-08 only skip reason is a weekend

    # ── Spec covers the spread; the 8-week / 120-shift caps are tech-plan only
    38863: ('techplan_detail', None),     # SCH-SPREAD-11 series caps
    38873: ('techplan_detail', None),     # SCH-API-02 409 / 422 caps

    # ── No Schedule-specification requirement at all (tech plan only)
    38867: ('no_anchor', None),           # SCH-REG-01 data migration
    38868: ('no_anchor', None),           # SCH-REG-02 dashboard one row
    38869: ('no_anchor', None),           # SCH-REG-03 appointment scheduler
    38870: ('no_anchor', None),           # SCH-REG-04 WO primary location
    38875: ('no_anchor', None),           # SCH-API-04 location scoping
},
'filters': {
    # ── PO ruling: Branko Q4=B, 2026-07-17 — the Status chip on Estimates /
    #    Completed is "Shown but greyed out, pre-filled with the tab's status, and
    #    not clickable".  Spec S1-N1 / S2-N1 / S2-N2 / S9-R2 / S9-R3 ALL still say
    #    the chip is hidden / not shown.  He agreed on 2026-07-20 (Round-2 Q1=a) to
    #    fix the text and has not yet done so — v1.6 still reads "hidden".
    29559: ('po_ruling', '2026-07-17'),   # FLT-BAR-03 other four chips on Estimates
    29609: ('po_ruling', '2026-07-17'),   # FLT-TAB-02 Estimates greyed-out chip
    29610: ('po_ruling', '2026-07-17'),   # FLT-TAB-03 Completed greyed-out chip
    29612: ('po_ruling', '2026-07-17'),   # FLT-TAB-05 kept while switching tabs

    # ── Spec covers Parts / Reports in §2 Feature Overview + §4 Key Decisions only
    #    (spec §7 Requirements has NO Parts story and NO Reports story, so there is
    #    no S#-R# anchor for any of them).  Detail from Branko 2026-07-31 Q2/Q3/Q5/Q7.
    38904: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-01 designed filter buttons
    38905: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-09 Part Type Core/Non Core
    38906: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-11 narrows that page
    38907: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-12 multi-choice + clear
    38908: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-13 nothing lost in redesign
    38909: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-01 report filter buttons
    38910: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-21 narrows the report
    38911: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-22 the six new filter types
    38882: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-23 date-range filter

    # ── The mobile "All Filters" bottom sheet with its "Apply filters" button is in
    #    the agreed design.  The spec has NO such screen, and S2-R6 says filters
    #    apply "in real time ... (no confirm/apply button needed)" while S12-R2 says
    #    mobile chips "behave identically to desktop".  Branko question B3 is OPEN.
    29621: ('design_awaiting', None),     # FLT-MOB-01 row starts with All Filters
    29622: ('design_awaiting', None),     # FLT-MOB-02 sheet with Apply filters
    29623: ('design_awaiting', None),     # FLT-MOB-03 tapping Apply filters
    29624: ('design_awaiting', None),     # FLT-MOB-04 single chip applies live
    29625: ('design_awaiting', None),     # FLT-MOB-05 customer filter in the sheet
    29626: ('design_awaiting', None),     # FLT-MOB-06 tech/advisor in the sheet
    29627: ('design_awaiting', None),     # FLT-MOB-07 asset on site in the sheet

    # ── No numbered v1.6 requirement covers these at all
    38876: ('no_anchor', None),           # FLT-TAB-06 default / last-used tab
    38881: ('no_anchor', None),           # FLT-PERS-06 one-off migration
},
}

# ────────────────── anchor extraction from the case's own refs ──────────────────
REQ_RE = re.compile(r'S\d+-[RNE]\d+(?:/[RNE]?\d+)*[a-z]?')
SEC_RE = re.compile(r'§\s?\d+(?:\.\d+)?')
TECHPLAN_RE = re.compile(r'tech[- ]plan|tech plan', re.I)


def _dedupe(seq):
    out = []
    for x in seq:
        if x not in out:
            out.append(x)
    return out


def anchors_for(refs: str, style: str) -> str:
    """Render the governing requirement reference(s) from the case's own refs.

    Only SPEC-side fragments are read: a fragment naming the engineering tech plan
    is skipped, so a tech-plan section number never masquerades as a spec anchor.
    """
    if not refs:
        return ''
    inner = refs
    m = re.search(r'\((.*)\)', refs, re.S)      # widest parenthesised group
    if m:
        inner = m.group(1)
    frags = re.split(r'[;,]|\s\+\s', inner)
    spec_frags = [f for f in frags if not TECHPLAN_RE.search(f)]
    body = ' ; '.join(spec_frags)
    if style == 'requirement':
        found = _dedupe(REQ_RE.findall(body))
        if found:
            return ', '.join(found)
        # fall back to the named prose sections the refs cites
        secs = _dedupe(s.replace('§ ', '§') for s in SEC_RE.findall(body))
        return ', '.join(secs)
    else:
        secs = _dedupe(s.replace('§ ', '§') for s in SEC_RE.findall(body))
        if secs:
            return ', '.join(secs)
        found = _dedupe(REQ_RE.findall(body))
        return ', '.join(found)


# ─────────────────────────── the sentence builder ───────────────────────────
def provenance(project: str, case: dict) -> str:
    """Build the full provenance block (separator line + one plain sentence)."""
    p = PROJECT[project]
    epic, name, ver = p['epic'], p['spec_name'], p['spec_version']
    cid = case['id']
    kind, date = CLASSIFY.get(project, {}).get(cid, ('plain', None))
    anch = anchors_for(case.get('refs') or '', p['anchor_style'])
    spec = f'the {name} specification version {ver}'
    ref = spec + (f' ({anch})' if anch else '')

    if kind == 'no_anchor':
        body = (f'{LEAD} {epic} and the engineering technical plan. No numbered '
                f'requirement in {spec} covers this point yet.')
    elif kind == 'po_ruling':
        body = (f'{LEAD} {epic} and {ref}. The current behaviour follows a later '
                f'product owner decision dated {date}.')
    elif kind == 'po_prose_only':
        body = (f'{LEAD} {epic} and {ref}, which covers this area in its overview '
                f'and key decisions only. The detailed behaviour above follows a '
                f'later product owner decision dated {date}.')
    elif kind == 'spec_two_ways':
        body = (f'{LEAD} {epic} and {ref}. That specification describes this point '
                f'in two different ways, so the behaviour above follows its '
                f'first-release wording and a product owner decision is still awaited.')
    elif kind == 'design_awaiting':
        body = (f'{LEAD} {epic} and {ref}. The screen described above comes from the '
                f'agreed design rather than that specification, and a product owner '
                f'decision is still awaited.')
    elif kind == 'techplan_detail':
        body = (f'{LEAD} {epic} and {ref}, with the specific limits above taken from '
                f'the engineering technical plan.')
    else:
        body = f'{LEAD} {epic} and {ref}.'
    return f'{SEP}\n{body}'


def strip_provenance(expected: str) -> str:
    """IDEMPOTENT: remove a previously written provenance block so a re-stamp
    REPLACES it and never appends a second one."""
    if not expected:
        return expected or ''
    lines = expected.split('\n')
    for i in range(len(lines) - 1):
        if lines[i].strip() == SEP and lines[i + 1].lstrip().startswith(LEAD):
            return '\n'.join(lines[:i]).rstrip()
    # also catch a trailing separator with the sentence on the SAME line
    for i, ln in enumerate(lines):
        if ln.strip().startswith(LEAD):
            j = i - 1
            if j >= 0 and lines[j].strip() == SEP:
                return '\n'.join(lines[:j]).rstrip()
            return '\n'.join(lines[:i]).rstrip()
    return expected.rstrip()
