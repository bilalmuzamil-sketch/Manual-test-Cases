#!/usr/bin/env python3
"""Rule 125 — the regression-ticket gate. A ticket that says "X behaves differently from production / from before the
release" is not drafted for the QA lead, and never filed, until this script says PASS on its gate file.

Why it exists: SV-12853 (16 Nov 2026) compared a "before" screen whose app time-zone setting was never set (so UTC) with
an "after" screen set to the location's zone, skipped production, and was closed OBSOLETE "expected behavior" the next
day under the QA lead's name (MISTAKES-AND-CHECKS.md M15).

    python3 build/testing-tools/regression_ticket_gate.py <gate.json>      exit 0 = PASS, 1 = REFUSED

The gate file (one per candidate, committed next to its evidence):
{
  "claim": "one plain sentence: what differs",
  "settings": {                       # every key measured on BOTH sides, never assumed
    "before": {"build": "...", "environment": "...", "app_time_zone_setting": "...", "location": "...",
               "role": "...", "as_of_date": "...", "as_of_is_today": "yes|no", "browser_time_zone": "...",
               "data_source": "screen|data call|export"},
    "after":  {...same keys...},
    "how_measured": {"app_time_zone_setting": "localStorage 'timezone' read on both pages", ...}   # one per key
  },
  "production_check": {"reproduced": true, "build": "...", "signed_in_normally_at": "<location>",
                       "picture": "path/to/production.png", "checked_utc": "..."},
  "own_record_page": {"what": "the record's own page (e.g. the bill) at the same location", "agrees_with_claim": true},
  "innocent_explanations": [ {"explanation": "...", "how_tested": "...", "result": "ruled out"}, ... ],   # at least 2
  "doubts_for_qa_lead": ["anything not proved, in plain words"]                                              # may be []
}
Only "build" (and "environment", when one side IS production) may differ between the two sides.
"""
import json, os, sys

KEYS = ['build', 'environment', 'app_time_zone_setting', 'location', 'role', 'as_of_date', 'as_of_is_today',
        'browser_time_zone', 'data_source']
MAY_DIFFER = {'build', 'environment'}
UNKNOWN = {'', 'unknown', 'not set', 'n/a', 'na', 'none', '?', 'tbd', 'assumed'}


def check(g, base):
    refuse, notes = [], []
    s = g.get('settings') or {}
    b, a, how = s.get('before') or {}, s.get('after') or {}, s.get('how_measured') or {}
    for k in KEYS:
        bv, av = str(b.get(k, '')).strip(), str(a.get(k, '')).strip()
        if bv.lower() in UNKNOWN or av.lower() in UNKNOWN:
            refuse.append(f'setting "{k}" not measured on both sides (before={bv or "-"}, after={av or "-"})')
        elif k not in MAY_DIFFER and bv != av:
            refuse.append(f'setting "{k}" DIFFERS between the sides (before={bv}, after={av}) — the difference may be ours')
        if not str(how.get(k, '')).strip():
            refuse.append(f'no "how_measured" for "{k}" — say how it was read, on both sides')
    p = g.get('production_check') or {}
    if p.get('reproduced') is not True:
        refuse.append('the claim is not reproduced on PRODUCTION with a normal sign-in — no production proof, no ticket')
    pic = p.get('picture') or ''
    if not pic or not os.path.isfile(os.path.join(base, pic) if not os.path.isabs(pic) else pic):
        refuse.append('no production picture file')
    for k in ('build', 'signed_in_normally_at', 'checked_utc'):
        if not str(p.get(k, '')).strip():
            refuse.append(f'production_check.{k} missing')
    if p.get('signed_in_normally_at') and a.get('location') and p['signed_in_normally_at'] != a.get('location'):
        refuse.append(f'production was checked at "{p["signed_in_normally_at"]}", the claim at "{a.get("location")}" — not the same location')
    r = g.get('own_record_page') or {}
    if not r.get('what') or r.get('agrees_with_claim') is not True:
        refuse.append("the record's own page was not checked, or it does not agree with the claim")
    ie = g.get('innocent_explanations') or []
    if len(ie) < 2:
        refuse.append('fewer than 2 innocent explanations written down and tested')
    for i, x in enumerate(ie, 1):
        if str(x.get('result', '')).strip().lower() != 'ruled out' or not str(x.get('how_tested', '')).strip():
            refuse.append(f'innocent explanation {i} not tested and ruled out: {x.get("explanation", "")[:80]}')
    if 'doubts_for_qa_lead' not in g:
        refuse.append('"doubts_for_qa_lead" missing (write [] only if nothing is unproved)')
    else:
        notes += [f'DOUBT for the QA lead: {d}' for d in g['doubts_for_qa_lead']]
    return refuse, notes


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    path = sys.argv[1]; g = json.load(open(path)); base = os.path.dirname(os.path.abspath(path))
    refuse, notes = check(g, base)
    print('CLAIM:', g.get('claim', '(none)'))
    for n in notes:
        print('  ' + n)
    if refuse:
        print('REFUSED — do not draft or file this ticket (Rule 125):')
        for x in refuse:
            print('  ✗ ' + x)
        sys.exit(1)
    print('PASS — the draft may now be shown to the QA lead WITH the settings table, the production picture, the ruled-out '
          'explanations and the doubts above. Filing still needs his per-ticket go-ahead (Rule 62).')


if __name__ == '__main__':
    main()
