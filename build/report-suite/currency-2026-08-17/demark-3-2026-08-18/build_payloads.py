"""Demark + currency re-stamp the 3 raw-markup Report Suite cases skipped by the whole-suite
currency pass. Documents-only (build deferred). Formatting-only body change proven word-for-word;
provenance re-stamped to current spec version + owning story + read-date 18 Aug 2026, sentence 2
(build) OMITTED; marker per policy.  DRY-RUN builds + prints payloads; execute is a separate step."""
import sys, json, re
sys.path.insert(0, '/home/user/Manual-test-Cases/build/markup-regression-2026-08-10')
import demark as D

SNAP = 'snap_before.json'  # committed pre-write live snapshot

# --- per-case new provenance (sentence 1 only: epic + owning story + spec name/version/anchor +
#     read-dates 18 Aug 2026; sentence 2 build OMITTED) and marker policy ---
NEWPROV = {
 30458: ("This is the expected behaviour as per epic SV-8582 and story SV-8658, read on 18 August 2026, "
         "and the Work In Progress report specification version 21 (S2-R4), read on 18 August 2026. "
         "That specification also carries a newer Key Decision, added in version 11, stating that buckets "
         "are keyed on line state rather than work-order status and that a work order with lines in several "
         "states appears in each matching tab. The two cannot both be true. Chris Ward has been asked which "
         "governs, so the requirement above is asserted unchanged and the newer reading is not asserted here."),
 30588: ("This is the expected behaviour as per epic SV-8582 and story SV-8677, read on 18 August 2026, "
         "and the Inventory Value report specification version 10 (S10-R3, S10-R4, S10-R5, S10-R6, S10-R15), "
         "read on 18 August 2026."),
 30606: ("This is the expected behaviour as per epic SV-8582 and story SV-8678, read on 18 August 2026, "
         "and the Inventory Value report specification version 10 (S11-R2), read on 18 August 2026."),
}
# marker: C30458 keep HOLD ; C30588 plain-READY -> Rule-69 ; C30606 keep HOLD
RULE69 = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"
MARKER = {
 30458: 'KEEP',   # keep existing HOLD verbatim
 30588: RULE69,
 30606: 'KEEP',   # keep existing HOLD verbatim
}
NEWREFS = {
 30458: ("SV-8658 (WIP spec v21 2026-08-18 Story 2 S2-R4 — one work order in exactly one tab; "
         "CONTRADICTED by the v11 §3 Key Decision that buckets are keyed on line state so a work order can "
         "appear in several tabs; Chris Ward asked; S2-R4 asserted unchanged)"),
 30588: ("SV-8677 (IV spec v10 2026-08-18 Story 10 S10-R3; S10-R4; S10-R5; S10-R6; S10-R15 — downloads keep "
         "the shown columns and order; honour the filters; include the Totals row; S10-R15 = the "
         "\"Locations:\" line and the Location column when shown)"),
 30606: ("SV-8678 (IV spec v10 2026-08-18 Story 11 S11-R2; §2 Relationship to nightly history)"),
}

def demark_field(s):
    out = D.demark(s or '')
    return out[0] if isinstance(out, tuple) else out

def split_expected_plain(e):
    """Split a PLAIN (demarked) expected into body / prov / marker by --- and AUTOMATION:."""
    lines = e.split('\n')
    sep = next((i for i, ln in enumerate(lines) if ln.strip() == '---'), None)
    if sep is None: raise ValueError('no --- separator')
    mi = next((i for i in range(len(lines)-1, -1, -1) if lines[i].startswith('AUTOMATION:')), None)
    if mi is None: raise ValueError('no marker')
    body = '\n'.join(lines[:sep]).rstrip()
    prov = '\n'.join(lines[sep+1:mi]).strip()
    marker = lines[mi].strip()
    return body, prov, marker

def build(cid, live):
    pre_raw = live.get('custom_preconds') or ''
    stp_raw = live.get('custom_steps') or ''
    exp_raw = live.get('custom_expected') or ''
    pre = demark_field(pre_raw).rstrip('\n')
    stp = demark_field(stp_raw).rstrip('\n')
    exp = demark_field(exp_raw)
    body, oldprov, oldmarker = split_expected_plain(exp)
    newmarker = oldmarker if MARKER[cid] == 'KEEP' else MARKER[cid]
    newexp = body.rstrip() + "\n\n---\n" + NEWPROV[cid].strip() + "\n\n" + newmarker
    pay = {'custom_preconds': pre, 'custom_steps': stp, 'custom_expected': newexp, 'refs': NEWREFS[cid]}
    # word-for-word preservation checks (formatting-only for pre/steps/body)
    checks = {
        'preconds_words': D.words(pre_raw) == D.words(pre),
        'steps_words':    D.words(stp_raw) == D.words(stp),
        'body_words':     D.words(_orig_body(exp_raw)) == D.words(body),
        'no_raw_html':    not re.search(r'<(ol|li|ul|p|br|hr|a)\b', pay['custom_preconds']+pay['custom_steps']+pay['custom_expected'], re.I),
    }
    return pay, {'oldmarker': oldmarker, 'newmarker': newmarker, 'checks': checks,
                 'oldbody_words': len(D.words(_orig_body(exp_raw))), 'newbody_words': len(D.words(body))}

def _orig_body(exp_raw):
    """The original expected BODY (before the <hr/> that precedes 'This is the expected')."""
    m = re.split(r'<hr\s*/?>', exp_raw, flags=re.I)
    return m[0]

if __name__ == '__main__':
    live = {c['id']: c for c in json.load(open(SNAP))}
    for cid in (30458, 30588, 30606):
        pay, meta = build(cid, live[cid])
        print('=' * 78)
        print(f"C{cid}  marker: {meta['oldmarker'][:40]!r} -> {meta['newmarker'][:40]!r}")
        print(f"  checks: {meta['checks']}   body words {meta['oldbody_words']}->{meta['newbody_words']}")
        for f in ('custom_preconds', 'custom_steps', 'custom_expected', 'refs'):
            print(f"----- {f} -----"); print(pay[f])
