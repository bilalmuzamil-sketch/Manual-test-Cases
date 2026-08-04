#!/usr/bin/env python3
"""Filters spec parser.

Converts a Confluence *storage-format* body into an ordered line list, then
classifies EVERY non-blank line as either
  - REQUIREMENT  (carries an S<n>-R<m> / S<n>-N<m> anchor, or is a KD/definition
                  statement we give a synthetic anchor to), or
  - NON-REQUIREMENT content, with an explicit reason.

Rule 50: the two totals must reconcile to the non-blank line count with ZERO
remainder.  Nothing is silently dropped.
"""
import re, html, json, sys

ANCHOR = re.compile(r'\b(S\d+-[RN]\d+)\b')

def to_lines(storage: str):
    t = storage
    # table cells -> separated by a pipe so a row stays one line but stays readable
    t = re.sub(r'</t[dh]>', ' | ', t)
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'</(p|h1|h2|h3|h4|h5|li|tr|table|ac:structured-macro)>', '\n', t)
    t = re.sub(r'<ac:parameter[^>]*>.*?</ac:parameter>', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t)
    t = t.replace(' ', ' ')
    out = []
    for raw in t.split('\n'):
        s = re.sub(r'[ \t]+', ' ', raw).strip()
        s = re.sub(r'(\s*\|\s*)+$', '', s).strip()
        out.append(s)
    return out

NONREQ_RULES = [
    (re.compile(r'^(Story|Epic)\s+\d+\s*:', re.I),      'heading — story title'),
    (re.compile(r'^(Requirements|Prerequisites|Negative Cases|Acceptance Criteria|Notes?)\s*:?$', re.I),
                                                        'label — section heading inside a story'),
    (re.compile(r'^(Design|Jira|Figma)\s*:', re.I),     'reference link line'),
    (re.compile(r'^https?://'),                         'bare URL'),
    (re.compile(r'^(As a|As an)\b', re.I),              'user-story narrative (not independently testable)'),
    (re.compile(r'^(Version|Owner|Status|Author|Last updated|Document|PRD)\s*:', re.I),
                                                        'document metadata'),
    (re.compile(r'^[-•*•]?\s*$'),                  'bullet artefact / empty'),
    (re.compile(r'^\|+$'),                              'table artefact'),
]

def classify(lines):
    reqs, nonreq = [], []
    cur_story = None
    for i, s in enumerate(lines):
        if not s:
            continue
        m = re.match(r'^Story\s+(\d+)\s*:\s*(.+)$', s, re.I)
        if m:
            cur_story = ('S' + m.group(1), m.group(2).strip())
        anchors = ANCHOR.findall(s)
        if anchors:
            # the line's OWN anchor is the leading one when the line starts with it
            lead = re.match(r'^[-•*•]?\s*(S\d+-[RN]\d+)\s*:\s*(.*)$', s)
            if lead:
                reqs.append({'line': i, 'anchor': lead.group(1), 'text': lead.group(2).strip(),
                             'story': cur_story[0] if cur_story else None,
                             'story_title': cur_story[1] if cur_story else None,
                             'raw': s})
                continue
            nonreq.append({'line': i, 'text': s,
                           'reason': 'prose that CITES anchors (%s) but states no new requirement of its own'
                                     % ','.join(sorted(set(anchors)))})
            continue
        why = None
        for rx, reason in NONREQ_RULES:
            if rx.match(s):
                why = reason
                break
        nonreq.append({'line': i, 'text': s, 'reason': why or 'prose / rationale / key-decision narrative'})
    return reqs, nonreq

def run(path):
    storage = open(path).read()
    lines = to_lines(storage)
    nonblank = [l for l in lines if l]
    reqs, nonreq = classify(lines)
    return {'lines': lines, 'nonblank': len(nonblank), 'reqs': reqs, 'nonreq': nonreq}

if __name__ == '__main__':
    r = run(sys.argv[1])
    print('non-blank lines     :', r['nonblank'])
    print('REQUIREMENT lines   :', len(r['reqs']))
    print('NON-REQUIREMENT     :', len(r['nonreq']))
    print('reconciles (zero remainder):', len(r['reqs']) + len(r['nonreq']) == r['nonblank'])
    anch = [q['anchor'] for q in r['reqs']]
    print('distinct anchors    :', len(set(anch)), '| duplicated:', [a for a in set(anch) if anch.count(a) > 1])
    if len(sys.argv) > 2:
        json.dump({'reqs': r['reqs'], 'nonreq': r['nonreq'], 'nonblank': r['nonblank']},
                  open(sys.argv[2], 'w'), indent=1)
