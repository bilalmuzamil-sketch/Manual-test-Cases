#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PHASE 1 - classify every remaining Report Suite re-pin case BEFORE any write.

For each case it records, from the RENDERED case view page (the only place the
information exists - get_case does NOT expose it):

  * the container class of each of the three text fields.
      "markdown fr-view"  -> the stored value is emitted RAW, so stored HTML RENDERS
      "markdown"          -> the stored value goes through the markdown renderer,
                             which ESCAPES tags, so a stored <p> is shown to the
                             tester as literal text.  Writing to such a field via
                             the API is what damaged 72 cases on 2026-08-26.
  * whether a literal tag / visible entity is ALREADY on screen,
  * custom_atmstatus (3 = Automated -> Rule 71, never write),
  * the currently cited spec version and the intended new pin,
  * whether custom_expected is a single top-level block (multi-block bodies are
    silently restructured by the API sanitiser).

READ ONLY.  No update_case call anywhere in this file.
"""
import json, re, os, sys, time
import urllib.request, urllib.parse, http.cookiejar

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
SV = os.path.join(RS, 'source-verify-2026-08-26')
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from tr import call                                    # noqa: E402

LIVE = {'IV': '10', 'PV': '11', 'SBC': '20', 'SBR': '24', 'TU': '9', 'WIP': '28'}
BASE = 'https://shopview.testrail.io'
FIELDS = [('Preconditions', 'custom_preconds'), ('Steps', 'custom_steps'),
          ('Expected Result', 'custom_expected')]
LITERALS = ('&lt;p&gt;', '&lt;/p&gt;', '&lt;br&gt;', '&lt;ol&gt;', '&lt;/ol&gt;',
            '&lt;li&gt;', '&lt;/li&gt;', '&lt;hr&gt;', '&lt;strong&gt;')
ENTITIES = ('&amp;mdash;', '&amp;rsquo;', '&amp;nbsp;', '&amp;amp;')


def login():
    C = json.load(open('/tmp/testrail/creds.json'))
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [('User-Agent', 'QA-observation')]
    op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
    op.open(BASE + '/index.php?/auth/login/',
            urllib.parse.urlencode({'name': C['email'], 'password': C['password'],
                                    'submit_login': 'Log In'}).encode(), timeout=60).read()
    return op


def field_containers(page):
    """Map field label -> (container class, rendered inner html)."""
    out = {}
    for label, _ in FIELDS:
        m = re.search(r'<span class="field-title-inner">%s</span>' % re.escape(label), page)
        if not m:
            out[label] = (None, '')
            continue
        d = re.search(r'<div class="(markdown[^"]*)">(.*?)</div>\s*</div>',
                      page[m.end():m.end() + 200000], re.S)
        out[label] = (d.group(1).strip(), d.group(2)) if d else (None, '')
    return out


def top_level_blocks(v):
    """Count top-level blocks in a stored value (the API sanitiser keeps only one)."""
    v = (v or '').strip()
    if not v:
        return 0
    n, depth, i = 0, 0, 0
    for m in re.finditer(r'<(/?)(p|ol|ul|hr|div|h[1-6]|blockquote|pre|table)\b[^>]*?(/?)>', v):
        closing, tag, selfclose = m.group(1), m.group(2), m.group(3)
        if tag == 'hr' or selfclose:
            if depth == 0:
                n += 1
            continue
        if closing:
            depth -= 1
        else:
            if depth == 0:
                n += 1
            depth += 1
    if n == 0:
        return 1                      # bare text = one implicit block
    return n


def main():
    data = json.load(open(os.path.join(HERE, 'remaining-set.json')))
    remaining, cat = data['remaining'], data['category']
    pins = {p['cid']: p for p in json.load(open(SV + '/data/case-version-pins.json'))}
    op = login()
    rows, raw = [], {}
    for n, cid in enumerate(remaining, 1):
        num = cid[1:]
        s, case = call('get_case/' + num)
        if s != 200:
            rows.append({'cid': cid, 'error': 'get_case HTTP %s' % s})
            continue
        for attempt in range(3):
            try:
                page = op.open(f'{BASE}/index.php?/cases/view/{num}', timeout=90)\
                         .read().decode('utf-8', 'replace')
                break
            except Exception as e:
                if attempt == 2:
                    page = ''
                    err = str(e)
                time.sleep(3)
        if not page:
            rows.append({'cid': cid, 'error': 'view page: ' + err})
            continue
        fc = field_containers(page)
        exp_class, exp_html = fc['Expected Result']
        rep = pins[cid]['report']
        cited = pins[cid]['cited']
        lit = sorted({t.replace('&lt;', '<').replace('&gt;', '>')
                      for label, _ in FIELDS
                      for t in LITERALS if t in fc[label][1]})
        ents = sorted({t for label, _ in FIELDS for t in ENTITIES if t in fc[label][1]})
        stored = case.get('custom_expected') or ''
        rows.append({
            'cid': cid,
            'report': rep,
            'category': cat[cid],
            'container_preconds': fc['Preconditions'][0],
            'container_steps': fc['Steps'][0],
            'container_expected': exp_class,
            'expected_renders': 'YES' if exp_class == 'markdown fr-view' else 'NO',
            'atmstatus': case.get('custom_atmstatus'),
            'automated': 'YES' if case.get('custom_atmstatus') == 3 else 'NO',
            'current_pin': cited,
            'intended_pin': LIVE[rep],
            'pin_token_present': ('specification version %s' % cited) in stored,
            'live_token_already_present': ('specification version %s' % LIVE[rep]) in stored,
            'expected_top_level_blocks': top_level_blocks(stored),
            'literal_tags_visible': '|'.join(lit),
            'visible_entities': '|'.join(ents),
            'updated_on': case.get('updated_on'),
        })
        raw[cid] = {'containers': re.findall(r'<div class="(markdown[^"]*)">', page),
                    'stored_expected': stored}
        if n % 10 == 0:
            print('  %d/%d' % (n, len(remaining)), flush=True)

    import csv
    cols = ['cid', 'report', 'category', 'container_expected', 'expected_renders',
            'container_preconds', 'container_steps', 'atmstatus', 'automated',
            'current_pin', 'intended_pin', 'pin_token_present',
            'live_token_already_present', 'expected_top_level_blocks',
            'literal_tags_visible', 'visible_entities', 'updated_on', 'error']
    with open(os.path.join(HERE, 'CLASSIFICATION.csv'), 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        for r in rows:
            w.writerow(r)
    json.dump(raw, open('/tmp/rspin/classification-raw.json', 'w'))

    from collections import Counter
    print('\nclassified', len(rows))
    print('container_expected:', Counter(r.get('container_expected') for r in rows))
    print('automated:', Counter(r.get('automated') for r in rows))
    print('blocks:', Counter(r.get('expected_top_level_blocks') for r in rows))
    print('errors:', [r['cid'] for r in rows if r.get('error')])


if __name__ == '__main__':
    main()
