#!/usr/bin/env python3
"""Mechanical Dimension-2/3 checks over the audit population, from LIVE text.

Every check here is objective -- it either fires or it does not, and each finding
quotes the offending text. Judgement calls (usefulness, cold-read coherence) are
made by hand and recorded separately; this file exists so that the objective half
is exhaustive rather than sampled (Standing Rule 50).

Checks
  M1  raw HTML markup shown literally to the tester (<ol> <li> <p> <br> <hr>, CRLF)
  M2  automation marker count != 1, or marker not the last non-empty line
  M3  provenance line count != 1
  M4  title longer than 80 characters
  M5  closed enumeration ("exactly", "only", "no other", ...) without a version pin (Rule 42/F7)
  M6  jargon / API leakage in tester-facing text of a NON-API case (Rules 7/9)
  M7  AUTOMATION: READY - EXPECT FAIL lacking the Rule-61 three-outcome block
  M8  refs missing, or missing a spec anchor (Rule 20)
  M9  the word "VIU" or a feature-flag name in tester-facing text
"""
import json
import re
import sys
from collections import OrderedDict

LIVE = '/tmp/qg/live-3proj.json'
POP = 'build/quality-gate-2026-08-11/evidence/population.json'

MARKUP = re.compile(r'</?(?:ol|ul|li|p|br|hr|div|span|strong|em|table|tr|td)\b[^>]*>', re.I)
MARKER = re.compile(r'^\s*AUTOMATION:\s*(.+?)\s*$', re.M)
PROV = re.compile(r'This is the expected behaviour as per', re.I)
CLOSED = re.compile(r'\b(exactly|only these|no other|the complete list|in order, are)\b', re.I)
VERSIONPIN = re.compile(r'\[spec v[\d.]+|specification (?:at Confluence )?version \d+|spec v[\d.]+ \d{4}-\d{2}-\d{2}', re.I)
# jargon that has no business in a non-API tester-facing field
JARGON = re.compile(r'\b(HTTP\s*\d{3}|GET /|POST /|PUT /|PATCH /|DELETE /|/api/|endpoint|payload|'
                    r'JSON|request body|status code|20[014]\b|40[0-9]\b|50[0-9]\b|'
                    r'querystring|query param|custom_[a-z_]+|section_id|case_id)\b')
VIUWORD = re.compile(r'\bVIU\b')
FLAGWORD = re.compile(r'\bfeature[- ]flag\b|\bfeature flag\b', re.I)
OUTCOME3 = re.compile(r'if it passes', re.I)


def norm(s):
    return '' if s is None else str(s)


def split_expected(raw):
    t = norm(raw).replace('\r\n', '\n')
    marks = MARKER.findall(t)
    marker = marks[-1].strip() if marks else ''
    body = MARKER.sub('', t).split('\n---')[0].strip()
    return body, marker


def main():
    live = json.load(open(LIVE))
    pop = json.load(open(POP))
    bycid = {}
    for proj in pop:
        for c in live[proj]:
            bycid[str(c['id'])] = (proj, c)

    findings = []
    scoped = []
    for proj, d in pop.items():
        for cid in list(d['created']) + list(d['material'].keys()):
            scoped.append((proj, cid))

    for proj, cid in scoped:
        _, c = bycid[cid]
        title = norm(c.get('title'))
        pre = norm(c.get('custom_preconds'))
        steps = norm(c.get('custom_steps'))
        exp = norm(c.get('custom_expected'))
        body, marker = split_expected(exp)
        allfields = {'title': title, 'preconditions': pre, 'steps': steps, 'expected': exp}
        tester_txt = {'title': title, 'preconditions': pre, 'steps': steps, 'expected-body': body}
        api_case = 'api' in norm(c.get('section_name', '')).lower()

        def add(code, field, quote, detail=''):
            findings.append({'cid': 'C' + cid, 'project': proj, 'check': code,
                             'field': field, 'quote': quote[:300], 'detail': detail,
                             'title': title})

        # M1 raw markup
        for f, v in allfields.items():
            m = MARKUP.search(v)
            if m:
                add('M1-raw-markup', f, m.group(0), 'literal HTML shown to the tester')
            if '\r\n' in v:
                add('M1-crlf', f, 'CRLF', 'carriage returns in stored text')
        # M2 marker
        marks = MARKER.findall(exp)
        if len(marks) != 1:
            add('M2-marker-count', 'expected', str(marks), '%d markers found' % len(marks))
        else:
            tail = [l for l in exp.replace('\r\n', '\n').split('\n') if l.strip()]
            if tail and not tail[-1].strip().startswith('AUTOMATION:'):
                add('M2-marker-not-last', 'expected', tail[-1], 'marker is not the last line')
        # M3 provenance
        np = len(PROV.findall(exp))
        if np != 1:
            add('M3-provenance-count', 'expected', '', '%d provenance lines' % np)
        # M4 title length
        if len(title) > 80:
            add('M4-title-length', 'title', title, '%d chars' % len(title))
        # M5 closed enumeration
        for f, v in tester_txt.items():
            m = CLOSED.search(v)
            if m and not VERSIONPIN.search(norm(c.get('refs')) + ' ' + exp):
                add('M5-closed-enum', f, m.group(0), 'no version pin in refs/provenance')
        # M6 jargon (non-API cases only)
        if not api_case:
            for f in ('title', 'preconditions', 'steps', 'expected-body'):
                m = JARGON.search(tester_txt[f])
                if m:
                    add('M6-jargon', f, m.group(0), 'technical term in tester-facing text')
        # M7 expect-fail without three outcomes
        if 'EXPECT FAIL' in marker and not OUTCOME3.search(exp):
            add('M7-expectfail-no-outcomes', 'expected', marker,
                'Rule 61 requires the symptom and all three outcomes')
        # M8 refs
        refs = norm(c.get('refs'))
        if not refs.strip():
            add('M8-refs-missing', 'refs', '', 'no ticket and no spec anchor')
        elif not re.search(r'\(', refs):
            add('M8-refs-no-anchor', 'refs', refs, 'ticket present, spec anchor absent')
        # M9 VIU / flag words
        for f, v in tester_txt.items():
            if VIUWORD.search(v):
                add('M9-viu-word', f, 'VIU', 'internal jargon')
            if FLAGWORD.search(v):
                add('M9-flag-word', f, FLAGWORD.search(v).group(0), 'feature-flag name')

    out = OrderedDict()
    for f in findings:
        out.setdefault(f['check'], []).append(f)
    print('POPULATION CHECKED: %d cases\n' % len(scoped))
    for k in sorted(out):
        cids = sorted({x['cid'] for x in out[k]})
        print('%-28s %3d finding(s) on %3d case(s)' % (k, len(out[k]), len(cids)))
    tgt = sys.argv[1] if len(sys.argv) > 1 else \
        'build/quality-gate-2026-08-11/evidence/mechanical-findings.json'
    json.dump({'population': [c for _, c in scoped], 'findings': findings},
              open(tgt, 'w'), indent=1)
    print('\nwritten:', tgt)


if __name__ == '__main__':
    main()
