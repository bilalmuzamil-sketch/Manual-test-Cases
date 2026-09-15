#!/usr/bin/env python3
"""Reconcile the 42 demonstrated old-search behaviours against the regression suite in run 415.

The demo page ("How the old search behaved") is a rebuilt, runnable copy of the previous search,
with 42 keywords each naming a FIELD and the records that should come back. The question it poses to
the suite is simple and worth answering exactly: is there a test for each of those 42, and if not,
which ones would ship unchecked?

Two passes, because either alone is misleading:

  LITERAL  — does any case quote the keyword itself? Strongest evidence, but the demo's records are
             illustrative and the live branch is seeded with different ones, so an absent literal
             proves nothing on its own.
  CONCEPT  — does any case exercise that FIELD by name (postcode, second address line, licence
             plate, contact job title...)? This is what actually decides coverage.

A preset counts as covered only when a case is found that names the field AND puts the keyword kind
into the search box. Everything else is listed for a human to judge, never quietly counted.
"""
import sys, json, re, html
sys.path.insert(0, 'build/testing-tools')
import tr_client as t
from which_standard import DECLARES_OLD_VERSION

DIR = 'build/global-search/artifact-coverage-2026-09-15'

def strip(s):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

# the field each preset is about, as words a case would actually use
CONCEPTS = {
 "ZZAUTOTEST Bridgeport Hauling": [r"customer'?s? name", r"company name", r"by name"],
 "ZZAUTOTESTBridgeportHauling":   [r"without (the )?spaces", r"space-free", r"no spaces", r"spaces removed", r"run together"],
 "idgepor":                       [r"middle of (a|the) word", r"mid-?word", r"fragment"],
 "Kestrelway":                    [r"address", r"street"],
 "Dock 7B":                       [r"second (line of the )?address", r"address line 2", r"address 2"],
 "Fernvale":                      [r"\bcity\b", r"\btown\b"],
 "ernva":                         [r"middle of .*(town|city)", r"(town|city).*(middle|fragment)", r"mid-?word"],
 "Ohio":                          [r"state", r"province", r"county"],
 "44872-9931":                    [r"post(al)? ?code", r"\bzip\b"],
 "419-555-0143":                  [r"(phone|telephone)"],
 "555-0143":                      [r"part of (a|the|its|their) (phone|telephone)", r"(phone|telephone) number.*(part|partial|last)", r"partial (phone|telephone)"],
 "bridgeporthauling-zzt.com":     [r"web ?site", r"web address"],
 "Marlene":                       [r"contact'?s? (first )?name", r"contact name", r"a contact"],
 "Okonkwo":                       [r"contact'?s? (sur|last )name", r"contact name", r"a contact"],
 "Dispatch Supervisor":           [r"job title", r"contact'?s? title", r"\btitle\b"],
 "419-555-0177":                  [r"contact'?s? (own )?(phone|telephone)", r"contact.*(phone|telephone)"],
 "ZZT-4471":                      [r"unit number", r"\bunit\b"],
 "1FUJGLDR9KLZZ4471":             [r"\bvin\b", r"chassis", r"serial"],
 "ZZ4471":                        [r"part of .*(vin|chassis|serial)", r"(vin|chassis|serial).*(part|partial|last)"],
 "OHZZT471":                      [r"licence plate", r"license plate", r"number plate", r"plate"],
 "2019":                          [r"\byear\b"],
 "Freightliner":                  [r"\bmake\b"],
 "Cascadia":                      [r"\bmodel\b"],
 "2019 Freightliner":             [r"year and .*make", r"year .*make", r"two words.*vehicle", r"make and .*year"],
 "17611":                         [r"(job|work order) number.*(digits|plain|without)", r"just the (digits|number)", r"digits only"],
 "S-17611":                       [r"(job|work order) number"],
 "S9160-17611":                   [r"shop number", r"(job|work order) number.*(prefix|shop)", r"full.*(job|work order) number"],
 "Estimate":                      [r"status"],
 "qualitycheck":                  [r"two-?word status", r"status.*one word", r"quality check"],
 "ZZAUTOTEST Kestrel Parts Supply":[r"(vendor|supplier)'?s? name", r"(vendor|supplier).*by name"],
 "Halbrook":                      [r"(vendor|supplier).*address", r"address.*(vendor|supplier)"],
 "Bay 12C":                       [r"second (line of the )?address", r"address line 2", r"address 2"],
 "Marnston":                      [r"(vendor|supplier).*(city|town)", r"(city|town).*(vendor|supplier)"],
 "43055-2210":                    [r"post(al)? ?code", r"\bzip\b"],
 "614-555-0188":                  [r"(vendor|supplier).*(phone|telephone)", r"(phone|telephone).*(vendor|supplier)"],
 "parts@kestrelsupply-zzt.com":   [r"e-?mail"],
 "ZZT-77-3300":                   [r"part number"],
 "ZZT773300":                     [r"without (the )?dash", r"dash-?free", r"no dashes", r"dashes removed"],
 "Vernway":                       [r"never been stocked", r"never stocked", r"catalogue", r"catalog"],
 "Darlene":                       [r"differently spelled", r"different spelling", r"near spelling", r"one letter"],
 "a":                             [r"single character", r"one character", r"two characters", r"minimum"],
 "zzzqqq":                        [r"no results", r"finds nothing", r"nothing is found", r"recently viewed", r"recent"],
}

def main():
    presets = json.load(open(f'{DIR}/PRESETS.json'))
    tests, off = [], 0
    while True:
        code, r = t.get('get_tests/415&limit=250&offset=%d' % off)
        b = r['tests']; tests += b
        if len(b) < 250: break
        off += 250
    reg = [x for x in tests if DECLARES_OLD_VERSION.search(x.get('custom_expected') or '')]
    corpus = []
    for x in reg:
        text = ' '.join([x['title'], strip(x.get('custom_preconds')),
                         strip(x.get('custom_steps')), strip(x.get('custom_expected'))])
        corpus.append({'case_id': x['case_id'], 'test_id': x['id'], 'title': x['title'],
                       'status_id': x['status_id'], 'text': text, 'low': text.lower()})
    print(f'regression cases read live from the run: {len(corpus)}')

    STATUS = {1:'Passed', 2:'Blocked', 3:'Untested', 4:'Retest', 5:'Failed'}
    out = []
    for p in presets:
        kw = p['keyword']
        literal = [c for c in corpus if kw.lower() in c['low']]
        pats = CONCEPTS.get(kw, [])
        concept = [c for c in corpus
                   if any(re.search(pt, c['low']) for pt in pats)]
        hits = {c['case_id']: c for c in literal}
        for c in concept: hits.setdefault(c['case_id'], c)
        out.append({
            'area': p['area'], 'keyword': kw, 'what': p['what'], 'field': p['field'],
            'expect': p['expect_groups'], 'on_v2_today': p['on_v2_today'],
            'literal': [{'c': c['case_id'], 't': c['test_id'], 'title': c['title'],
                         'status': STATUS.get(c['status_id'])} for c in literal],
            'concept': [{'c': c['case_id'], 't': c['test_id'], 'title': c['title'],
                         'status': STATUS.get(c['status_id'])} for c in concept],
            'covered': bool(hits),
        })
    json.dump(out, open(f'{DIR}/COVERAGE.json', 'w'), indent=1, ensure_ascii=False)

    nocover = [o for o in out if not o['covered']]
    weak    = [o for o in out if o['covered'] and not o['literal']]
    print(f'\npresets with no case at all: {len(nocover)}')
    for o in nocover:
        print(f"   [{o['area']}] {o['keyword']!r} — {o['what']} ({o['field']})")
    print(f'\npresets matched only by the field, never by the keyword itself: {len(weak)}')
    for o in weak:
        print(f"   [{o['area']}] {o['keyword']!r} -> " +
              ', '.join(f"C{h['c']}" for h in o['concept'][:4]))
    print(f'\npresets with a case quoting the keyword: {len([o for o in out if o["literal"]])}')

if __name__ == '__main__':
    main()
