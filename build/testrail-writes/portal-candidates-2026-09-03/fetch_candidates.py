#!/usr/bin/env python3
"""READ-ONLY fetch of the 11 customer-portal CANDIDATE cases named by PH-3 (2026-09-02).

WHY: the portal-hold inventory of 2026-09-02 surfaced 11 cases that LOOK like portal cases and
carry no marker, and explicitly claimed NO verdict because their preconditions were never
individually re-read. This script pulls exactly those 11, plus the section path and the author
name for each, so the assessment can be made from the case's own words.

DISCIPLINE
  * GET ONLY. The only TestRail verb in this file is tr.get(...). No add_case / update_case /
    delete_case / run write / result write. grep it and see.
  * 11 named ids -- no estate paging, nothing bulk-read (Rule 88).
  * Rule 38 / 71: created_by and custom_atmstatus are captured for every case so a foreign or
    Automated case is visible BEFORE anyone proposes touching it.

OUTPUT
  cases.json     the 11 raw case objects, verbatim from the API
  sections.json  section id -> full path
  users.json     user id -> {name, email}
  SUMMARY.txt    de-HTMLed preconditions / steps / expected per case -- the assessment input
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'testing-tools'))
import tr_client as tr  # noqa: E402

OUT = os.path.dirname(os.path.abspath(__file__))

CANDIDATES = [18621, 18622, 18649, 18671, 18672, 18678, 18679, 18706, 18728, 18729, 45245]

ATM = {1: 'Not automated', 2: 'To be automated', 3: 'AUTOMATED', 4: 'Automation N/A'}
ATYPE = {0: 'None', 1: 'E2E', 2: 'Functional', 3: 'Unit'}


def detag(s):
    if not s:
        return ''
    s = re.sub(r'<\s*br\s*/?\s*>', '\n', s, flags=re.I)
    s = re.sub(r'</\s*(p|li|ol|ul|div|tr)\s*>', '\n', s, flags=re.I)
    s = re.sub(r'<\s*li\s*[^>]*>', '  - ', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()


def main():
    cases, sections, users = {}, {}, {}

    for cid in CANDIDATES:
        st, d = tr.get(f'get_case/{cid}')
        if st != 200:
            raise RuntimeError(f'get_case/{cid} -> {st}: {str(d)[:200]}')
        cases[cid] = d

    # section paths, walked upward one section at a time (no estate paging needed for 11 cases)
    def section(sid):
        if sid in sections:
            return sections[sid]
        st, d = tr.get(f'get_section/{sid}')
        if st != 200:
            raise RuntimeError(f'get_section/{sid} -> {st}')
        sections[sid] = d
        return d

    def path(sid):
        parts, cur, guard = [], section(sid), 0
        while cur is not None and guard < 40:
            parts.append(cur.get('name') or f'#{cur["id"]}')
            pid = cur.get('parent_id')
            cur = section(pid) if pid else None
            guard += 1
        return ' > '.join(reversed(parts))

    for c in cases.values():
        uid = c.get('created_by')
        if uid not in users:
            st, d = tr.get(f'get_user/{uid}')
            users[uid] = d if st == 200 else {'name': f'(get_user/{uid} -> {st})'}

    json.dump(cases, open(os.path.join(OUT, 'cases.json'), 'w'), indent=1, sort_keys=True)
    json.dump(sections, open(os.path.join(OUT, 'sections.json'), 'w'), indent=1, sort_keys=True)
    json.dump(users, open(os.path.join(OUT, 'users.json'), 'w'), indent=1, sort_keys=True)

    marker = re.compile(r'AUTOMATION:[^\n<]*')
    with open(os.path.join(OUT, 'SUMMARY.txt'), 'w') as f:
        for cid in CANDIDATES:
            c = cases[cid]
            u = users.get(c.get('created_by'), {})
            body = ' '.join(str(c.get(k) or '') for k in c)
            mk = marker.findall(detag(body))
            f.write('=' * 100 + '\n')
            f.write(f'C{cid}  {c.get("title")}\n')
            f.write(f'  section {c.get("section_id")}: {path(c["section_id"])}\n')
            f.write(f'  created_by {c.get("created_by")} = {u.get("name")} <{u.get("email")}>\n')
            f.write(f'  atmstatus {c.get("custom_atmstatus")} = {ATM.get(c.get("custom_atmstatus"), "?")}'
                    f'   automation_type {c.get("custom_automation_type")} = '
                    f'{ATYPE.get(c.get("custom_automation_type"), "?")}\n')
            f.write(f'  refs {c.get("refs")}   suite {c.get("suite_id")}   updated_by {c.get("updated_by")}\n')
            f.write(f'  AUTOMATION markers found: {mk if mk else "NONE"}\n')
            for label, key in (('PRECONDITIONS', 'custom_preconds'), ('STEPS', 'custom_steps'),
                               ('EXPECTED', 'custom_expected')):
                f.write(f'\n--- {label} ---\n{detag(c.get(key)) or "(empty)"}\n')
            sep = c.get('custom_steps_separated')
            if sep:
                f.write('\n--- STEPS (separated) ---\n')
                for i, s in enumerate(sep, 1):
                    f.write(f'{i}. {detag(s.get("content"))}\n   => {detag(s.get("expected"))}\n')
            f.write('\n')
    print('wrote cases.json / sections.json / users.json / SUMMARY.txt for', len(cases), 'cases')


if __name__ == '__main__':
    main()
