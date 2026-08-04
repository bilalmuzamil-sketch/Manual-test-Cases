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
    # Q3 2026-08-04 puts Vendors in scope and denies the "no design" premise; Q8
    # names the Part Sales chips in his own words -> newest decision is 2026-08-04.
    38904: ('po_prose_only', '2026-08-04'),  # FLT-PARTS-01 designed filter buttons
    38905: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-09 Part Type Core/Non Core
    38906: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-11 narrows that page
    38907: ('po_prose_only', '2026-07-31'),  # FLT-PARTS-12 multi-choice + clear
    # Q8 2026-08-04 restates the parity rule this case exists to test.
    38908: ('po_prose_only', '2026-08-04'),  # FLT-PARTS-13 nothing lost in redesign
    38909: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-01 report filter buttons
    38910: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-21 narrows the report
    # date DELIBERATELY stays 2026-07-31: Q8 confirms only that no written option
    # list exists, not the multi-select / no-Apply behaviour.  Cited as CONFIRMING.
    38911: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-22 the six new filter types
    38882: ('po_prose_only', '2026-07-31'),  # FLT-RPTS-23 date-range filter

    # ── The mobile "All Filters" bottom sheet with its "Apply filters" button is in
    #    the agreed design.  The spec has NO such screen (re-verified live this
    #    pass: v1.6 contains "Apply filters" 0 times and "All Filters" 0 times), and
    #    S2-R6 says filters apply "in real time ... (no confirm/apply button
    #    needed)" while S12-R2 says mobile chips "behave identically to desktop".
    #    BRANKO ANSWERED 2026-08-04, sheet Q1: "A - no apply button" — option A as
    #    sent named the engineering model, whose decision D15 keeps the "Apply
    #    filters" button on the COMBINED sheet only.  So the awaiting-a-decision
    #    half is retired and the design provenance is kept.
    29621: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-01 row starts All Filters
    29622: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-02 sheet w/ Apply filters
    29623: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-03 tapping Apply filters
    # C29624 goes the OTHER way and that is the honest outcome, not a downgrade:
    # with no Apply button on the single-filter sheet the behaviour agrees with the
    # spec OUTRIGHT (S12-R3 bottom sheet + S12-R2 identical-to-desktop + S2-R6 real
    # time), so it needs no override variant at all -> 'plain', with his answer
    # cited as a CONFIRMATION in SOURCE_CITE.
    29624: ('plain', None),                    # FLT-MOB-04 single chip applies live
    29625: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-05 customer in the sheet
    29626: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-06 tech/advisor in sheet
    29627: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-07 asset on site in sheet
    # Added by the Rule-28 cross-case sweep 2026-08-04: its own precondition 2 reads
    # "at least one filter applied VIA THE SHEET", so its route depends on the same
    # design-only screen even though its assertions are spec-backed.  Left plain it
    # would have been the one sibling in the cluster claiming plain spec agreement.
    29628: ('design_po_ruled', '2026-08-04'),  # FLT-MOB-08 chips + Clear on mobile

    # ── FLT-TAB-06: no numbered v1.6 requirement covers the default / last-used tab
    #    (re-verified live this pass).  Branko RULED on it 2026-08-04 (Q2 "A - it's
    #    fine"), so crediting the engineering plan alone now under-claims our basis.
    38876: ('po_ruling_no_anchor', '2026-08-04'),  # FLT-TAB-06 default tab
    # ── No numbered v1.6 requirement covers these at all
    38881: ('no_anchor', None),           # FLT-PERS-06 one-off migration
},
}

# ───────── SOURCE FILES cited IN the tester-facing provenance line ─────────
# Standing Rule 54, EXTENDED 2026-08-04 by the QA lead's ruling, verbatim:
#   "If Branko said this in his new file then yes, but below the expected
#    behavior give the file link and mention that this is coming from Branko's
#    responses here. Anyting that you do if that has the reference from the file
#    only - follow the same practice."
#
# The LINK in tester-facing text is a DELIBERATE, QA-LEAD-AUTHORISED EXCEPTION to
# the no-jargon guidance of Rules 7/20 — recorded here exactly as the requirement
# anchor already is, so a later pass does not strip it as a Rule-7 violation.
#
# A link is cited ONLY where that file is genuinely LOAD-BEARING for the
# assertion (Rule 54 honesty clause).  Pasting it onto a case the file does not
# govern would manufacture false authority just as surely as omitting a source.
SOURCE_FILES = {
    'branko_2026_08_04': {
        'who': 'Branko',
        'date': '2026-08-04',
        'link': ('https://docs.google.com/spreadsheets/d/'
                 '1fkjdt9hoYSGv2MToXUFJ_4tTMzP7a7X2/edit'),
    },
}

# per case: (mode, source-file key)
#   'governing'   the expectation RESTS on that file — the spec does not carry it,
#                 so the line names the file as the source of the decision
#   'confirming'  the spec already supports the expectation and the file
#                 CONFIRMS it — the line must not imply the file is the basis
SOURCE_CITE = {
'schedule': {},
'filters': {
    # Q1 "A - no apply button" — the mobile sheets.  The screens are in the agreed
    # design and NOT in the spec (live v1.6 contains "Apply filters" 0 times and
    # "All Filters" 0 times), so his answer is what approves them: GOVERNING.
    29621: ('governing', 'branko_2026_08_04'),
    29622: ('governing', 'branko_2026_08_04'),
    29623: ('governing', 'branko_2026_08_04'),
    29625: ('governing', 'branko_2026_08_04'),
    29626: ('governing', 'branko_2026_08_04'),
    29627: ('governing', 'branko_2026_08_04'),
    29628: ('governing', 'branko_2026_08_04'),
    # C29624 is the exception INSIDE the same cluster: with no Apply button on the
    # single-filter sheet the behaviour agrees with the spec outright (S12-R3 gives
    # the bottom sheet, S12-R2 "behave identically to desktop", S2-R6 "in real time
    # ... no confirm/apply button needed" — all three re-read live this pass), so
    # the spec IS the basis and his answer CONFIRMS it.
    29624: ('confirming', 'branko_2026_08_04'),
    # Q2 "A - it's fine" — the default tab exists in no numbered requirement, so
    # his answer is the only product source: GOVERNING.
    38876: ('governing', 'branko_2026_08_04'),
    # Q3 "Disign for vendors exists in figma. Check it" + Q8 (the Part Sales chip
    # list, in his own words) — GOVERNING for a case the spec covers in prose only.
    38904: ('governing', 'branko_2026_08_04'),
    # Q8 "we should have all filters we support now per each page plus we should
    # add new ones" — the second statement of the parity rule this case exists to
    # test, so it is the governing decision.
    38908: ('governing', 'branko_2026_08_04'),
    # Q8 "We do not have list of all filter items" CONFIRMS this case's own honest
    # sentence ("They have not been written down anywhere yet").  The detailed
    # behaviour still follows the 2026-07-31 decision, so the date stays there and
    # the file is cited as a confirmation, not as the basis.
    38911: ('confirming', 'branko_2026_08_04'),
},
}


def source_clause(project: str, cid: int) -> str:
    """The file-citation sentence, or '' where no file is load-bearing."""
    ent = SOURCE_CITE.get(project, {}).get(cid)
    if not ent:
        return ''
    mode, key = ent
    f = SOURCE_FILES[key]
    if mode == 'governing':
        return (f" That decision is recorded in {f['who']}'s answers, in this "
                f"file: {f['link']}")
    return (f" {f['who']} confirmed this on {f['date']} in his answers in this "
            f"file: {f['link']}")


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
    elif kind == 'design_po_ruled':
        # the 2026-08-04 successor to 'design_awaiting': the decision ARRIVED.  The
        # design provenance is KEPT (the screen really is design-derived — the spec
        # has no such screen); only the awaiting-a-decision half is replaced.
        body = (f'{LEAD} {epic} and {ref}. The screen described above comes from the '
                f'agreed design rather than that specification, and the product '
                f'owner approved it on {date}.')
    elif kind == 'po_ruling_no_anchor':
        # a real PO decision on a point the spec does NOT cover at all.  Reusing
        # 'po_ruling' here would imply the spec covers it; reusing 'no_anchor'
        # would credit the engineering plan for a product decision.  Both halves
        # must be true in one sentence: the ruling is real, the silence admitted.
        body = (f'{LEAD} {epic} and a product owner decision dated {date}. No '
                f'numbered requirement in {spec} covers this point.')
    elif kind == 'techplan_detail':
        body = (f'{LEAD} {epic} and {ref}, with the specific limits above taken from '
                f'the engineering technical plan.')
    else:
        body = f'{LEAD} {epic} and {ref}.'
    # Rule 54 (as extended 2026-08-04): name the source FILE where it is
    # load-bearing.  Appended LAST so the block stays ONE line after the
    # separator and strip_provenance() remains trivially correct.
    body += source_clause(project, cid)
    return f'{SEP}\n{body}'


def strip_provenance(expected: str) -> str:
    """IDEMPOTENT: remove a previously written provenance block so a re-stamp
    REPLACES it and never appends a second one.

    HARDENED 2026-08-04.  A manual TestRail edit had converted ONE case
    (FLT-PERS-01 = C29613) to HTML, turning the '---' separator into '<hr />' and
    wrapping the sentence in '<p>...</p>'.  The plain-text matcher below could not
    see that block, so a future full re-stamp would have APPENDED A SECOND
    provenance line to it.  The HTML forms are now recognised too.  The plain-text
    path is unchanged, so every other case renders byte-identically.
    """
    if not expected:
        return expected or ''
    # HTML form: an <hr> (any spelling) followed by the sentence, in <p> or bare
    m = re.search(r'\n?\s*<hr\s*/?>\s*\n?\s*(?:<p>)?\s*' + re.escape(LEAD),
                  expected)
    if m:
        return expected[:m.start()].rstrip()
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
