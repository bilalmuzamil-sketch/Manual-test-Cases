#!/usr/bin/env python3
"""READ-ONLY live inventory of the staging-only customer-portal HOLD marker in TestRail.

WHY: the marker literal is FINAL and lives in 7 documentation files plus live case bodies.
The repo copies are the INSTRUCTION; the case bodies are the DEPLOYMENT. Only four case ids
were ever known (C44947, C44951, C44952, C45175) and nobody had confirmed that was all of them.

DISCIPLINE
  * GET ONLY. No add_case / update_case / delete_case / run write / result write. The only
    verbs this file contains are tr_client.get(...) — grep it and see.
  * Every list call is PAGED to exhaustion. An unpaged get_cases/get_sections returns 250 and
    then "finds zero" for anything past the first page (core §3.3, playbook §J).
  * Rule 88: nothing but the SUMMARY is meant to be read by a human/session. Bodies stay in
    the JSON on disk.

OUTPUT
  matches.json   every matching case, with the exact matched substring and its field
  sections.json  section id -> full path (for the section/project column)
  SUMMARY.txt    the only thing you should read into context
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'testing-tools'))
import tr_client as tr  # noqa: E402

OUT = os.path.dirname(os.path.abspath(__file__))

# The FINAL literal, per build/skills/00-COMMON-CORE.md §5.0-b.
CANON = 'AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch'
# The load-bearing core of it -- what we actually sweep for, so a re-worded tail is still FOUND
# and then reported as a VARIANT rather than missed altogether.
NEEDLE = 'customer portal only exists on staging'
# A wider net: catch a paraphrase that drifted off the needle but is plainly the same marker.
WIDE = re.compile(r'customer[\s\-]*portal[^<]{0,80}(staging|qa branch)', re.I)

TEXT_FIELDS = ('preconds', 'steps', 'expected', 'title', 'custom_preconds', 'custom_steps',
               'custom_expected', 'custom_steps_separated')


def all_sections():
    """Paged get_sections -> {id: {...}} plus a resolved full path per section."""
    out, offset = {}, 0
    while True:
        st, d = tr.get(f'get_sections/1&limit=250&offset={offset}')
        if st != 200:
            raise RuntimeError(f'get_sections {st}: {str(d)[:200]}')
        chunk = d['sections'] if isinstance(d, dict) and 'sections' in d else d
        for s in chunk:
            out[s['id']] = s
        if len(chunk) < 250:
            break
        offset += 250
    for sid, s in out.items():
        parts, cur, guard = [], s, 0
        while cur is not None and guard < 40:
            parts.append(cur.get('name') or f'#{cur["id"]}')
            pid = cur.get('parent_id')
            cur = out.get(pid) if pid else None
            guard += 1
        s['_path'] = ' > '.join(reversed(parts))
    return out


def all_cases():
    """Paged get_cases over the whole project. suite_mode 1 -> no suite_id needed."""
    out, offset = [], 0
    while True:
        st, d = tr.get(f'get_cases/1&limit=250&offset={offset}')
        if st != 200:
            raise RuntimeError(f'get_cases {st}: {str(d)[:200]}')
        chunk = d['cases'] if isinstance(d, dict) and 'cases' in d else d
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out


def scan(case):
    """Return list of (field, matched_marker_line, kind) for one case."""
    hits = []
    for f in TEXT_FIELDS:
        v = case.get(f)
        if not isinstance(v, str) or not v:
            continue
        if NEEDLE.lower() not in v.lower() and not WIDE.search(v):
            continue
        # Pull out the marker sentence(s) so the JSON stays small and diffable.
        for frag in re.split(r'(?i)</?p>|</?li>|</?ul>|</?ol>|<hr\s*/?>|\n', v):
            frag = frag.strip()
            if not frag:
                continue
            if NEEDLE.lower() in frag.lower() or WIDE.search(frag):
                kind = 'BYTE-EXACT' if frag == CANON else 'VARIANT'
                hits.append({'field': f, 'text': frag, 'kind': kind})
    # de-duplicate identical (field, text)
    seen, uniq = set(), []
    for h in hits:
        k = (h['field'], h['text'])
        if k not in seen:
            seen.add(k)
            uniq.append(h)
    return uniq


def main():
    secs = all_sections()
    cases = all_cases()
    matches = []
    for c in cases:
        hits = scan(c)
        if not hits:
            continue
        sec = secs.get(c.get('section_id'), {})
        matches.append({
            'case_id': c['id'],
            'cid': f"C{c['id']}",
            'title': c.get('title'),
            'section_id': c.get('section_id'),
            'section_path': sec.get('_path'),
            'created_by': c.get('created_by'),
            'atmstatus': c.get('custom_atmstatus'),
            'hits': hits,
            'byte_exact': all(h['kind'] == 'BYTE-EXACT' for h in hits),
        })
    matches.sort(key=lambda m: m['case_id'])

    json.dump({'canonical_literal': CANON,
               'needle': NEEDLE,
               'sections_paged': len(secs),
               'cases_paged': len(cases),
               'matches': matches},
              open(os.path.join(OUT, 'matches.json'), 'w'), indent=1)
    json.dump({str(k): v.get('_path') for k, v in secs.items()},
              open(os.path.join(OUT, 'sections.json'), 'w'), indent=1)

    exact = [m for m in matches if m['byte_exact']]
    var = [m for m in matches if not m['byte_exact']]
    lines = [
        f'sections paged : {len(secs)}',
        f'cases paged    : {len(cases)}',
        f'cases matching : {len(matches)}',
        f'  byte-exact   : {len(exact)}  {" ".join(m["cid"] for m in exact)}',
        f'  VARIANT      : {len(var)}  {" ".join(m["cid"] for m in var)}',
        '',
    ]
    for m in matches:
        lines.append(f'{m["cid"]:>8}  {"EXACT " if m["byte_exact"] else "VARIANT"}  '
                     f'sec {m["section_id"]}  {m["section_path"]}')
        lines.append(f'          title: {m["title"]}')
        for h in m['hits']:
            lines.append(f'          [{h["kind"]}] {h["field"]}: {h["text"]}')
    open(os.path.join(OUT, 'SUMMARY.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines[:6]))
    print(f'-> {OUT}/SUMMARY.txt')


if __name__ == '__main__':
    main()
