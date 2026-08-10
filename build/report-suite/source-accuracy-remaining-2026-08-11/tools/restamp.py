"""Source-accuracy re-stamp for SBR / PV / IV, 2026-08-11.
Bumps ONLY the spec-version token, in the provenance line and in refs, plus a small set of
hand-adjudicated text corrections. Deliberately does NOT touch the build-stamp sentence:
nothing was observed on the application this pass, so a new build date would be a claim we
cannot support (Rule 12). All three text fields sent explicitly every time (TestRail
re-renders any text field omitted from the payload).
"""
import json, re, sys
sys.path.insert(0, '/tmp/testrail')
import tr

LIVE = {'SBR': (18, '2026-08-07'), 'PV': (6, '2026-08-07'), 'IV': (5, '2026-08-07')}
NAME = {'SBR': 'Sales By Representative', 'PV': 'Parts Velocity', 'IV': 'Inventory Value'}
MARKER_RE = re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$', re.M)

def sanity(exp, refs, cid):
    provs = [l for l in exp.splitlines() if l.strip().startswith('This is the expected behaviour')]
    marks = MARKER_RE.findall(exp)
    assert len(provs) == 1, f'C{cid}: {len(provs)} provenance lines'
    assert len(marks) <= 1, f'C{cid}: {len(marks)} markers'
    if marks:
        assert exp.rstrip().splitlines()[-1].startswith('AUTOMATION:'), f'C{cid}: marker not last'
    assert not re.search(r'<(?:ol|li|ul|p|hr|br|strong|em|div|span|table|tr|td)\b', exp, re.I), f'C{cid}: raw markup'
    for entry in refs.split(','):
        assert len(entry) <= 248, f'C{cid}: refs entry {len(entry)} chars > 248'

def mask_ok(old, new, pattern, cid, field, maxhits):
    """Prove the ONLY difference lies inside the spans this pass matched."""
    ho = list(re.finditer(pattern, old)); hn = list(re.finditer(pattern, new))
    if len(ho) != len(hn):
        raise RuntimeError(f'C{cid} {field}: match count moved {len(ho)} -> {len(hn)}')
    if len(ho) > maxhits:
        raise RuntimeError(f'C{cid} {field}: {len(ho)} matches > {maxhits}')
    def mask(s, hits):
        out, last = [], 0
        for m in hits:
            out.append(s[last:m.start()]); out.append('\x00M\x00'); last = m.end()
        out.append(s[last:]); return ''.join(out)
    if mask(old, ho) != mask(new, hn):
        raise RuntimeError(f'C{cid} {field}: change OUTSIDE the matched span')

# --- hand-adjudicated text corrections, each verified against the live spec body ---
SPECIAL = {
 # class 1: refs asserts a spec edit is still owed; Chris has made it
 30216: [('refs', 'the S21-N1 "still sees the filter" note is stale; spec edit pending',
                  'confirmed by his spec edit: S21-N1 now reads "A single-location user does not see the filter; it is hidden" (SBR v16, 2026-08-05)')],
 30340: [('refs', 'the S2-E4 "still sees the filter" note is stale; spec edit pending',
                  'confirmed by his spec edit: S2-E4 now reads "A user with access to only one location does not see the Location filter; it is hidden" (PV v5, 2026-08-05)')],
 30577: [('refs', 'the S7-N1 "still sees the filter" note is stale; spec edit pending',
                  'confirmed by his spec edit: S7-N1 now reads "A user with access to only one location does not see the filter; it is hidden" (IV v4, 2026-08-05)')],
 30325: [('refs', 'PV S1-R4 still names Inventory Reports > View — his spec edit owed',
                  'his spec edit is MADE: S1-R4 now names the single reports permission, no per-report permission (PV v5)')],
 30603: [('refs', 'the IV prerequisite still names the inventory-reports permission — his spec edit owed',
                  'his spec edit is MADE: the Story 1 prerequisite now names the single reports permission, no per-report permission (IV v4)')],
 # class 3: a divergence hedge over a difference that no longer exists
 30561: [('exp', 'This is the expected behaviour as per epic SV-8582 and Chris Ward\'s decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. Where the Inventory Value report specification version 5 (S5-R1) says something different, his decision is the later word and is the authority.',
                 'This is the expected behaviour as per epic SV-8582 and the Inventory Value report specification version 5 (S5-R1), which now sets out these nine periods and states that "Today", "Yesterday", "Custom" and "All Time" are not offered. Chris Ward confirmed the same thing on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true')],
 # provenance carried anchors but no version at all
 30288: [('exp', 'the Sales By Representative report specification (S22-R2, S22-R4, S14-R19)',
                 'the Sales By Representative report specification version 18 (S22-R2, S22-R4, S14-R19)')],
}

def plan(live_case, rep):
    ver, date = LIVE[rep]
    exp = live_case.get('custom_expected') or ''
    refs = live_case.get('refs') or ''
    new_exp = re.sub(r'(the %s report specification version )\d+' % re.escape(NAME[rep]),
                     r'\g<1>%d' % ver, exp)
    new_refs = re.sub(r'\b(%s spec v)\d+ \d{4}-\d{2}-\d{2}' % rep,
                      r'\g<1>%d %s' % (ver, date), refs)
    return new_exp, new_refs
