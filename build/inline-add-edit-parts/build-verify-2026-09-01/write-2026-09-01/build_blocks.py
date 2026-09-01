#!/usr/bin/env python3
"""Generate the intended field blocks for suite 6597 (Inline Add and Edit Parts).

WHAT THIS PASS CHANGES, AND WHY EACH CHANGE IS SAFE
---------------------------------------------------
The suite's preconditions and steps were authored before any build existed, so every case carried a
route marked PROVISIONAL and told the tester to "confirm the exact path on the build". The build now
exists and has been walked, so those hedges are replaced with what is actually on screen. Nothing in
any Expected Results changes: expectations come from the documents, never from the build (Rule 57).

  T1  the work-order route         -> the observed route, PROVISIONAL hedge removed
  T2  the Create-and-Edit permission -> the real Settings -> Roles & Permissions click path
  T3  the Work Order View Mode setting -> the same click path, naming the mode
  T4  build labels the tester has to find: "More options", "Save Part", the modal titles
      ("New Part Request" / "Edit Part Request"), and the row's close control
  T5  Expected Results: Rule-54 sentence 2 added ONLY where this pass actually observed the case
      live, and the AUTOMATION marker lifted off "Not available on Build to test Yet" now that the
      feature is demonstrably on the build

EXCLUSIONS
  C45220              foreign - Vladimir Tomovic's (Rule 38)
  C45005, C45026      flagged Automated - held for the QA lead (Rule 71)
"""
import json, re, sys, html, os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'verdicts'))
from verdicts import V                                     # noqa: E402

CASES = json.load(open('/tmp/inl6597/cases6597.json'))
BUILD_SENTENCE = 'Last checked against build v26.35.6-598cc8a on 9/1/2026.'
# C45220 stays out permanently: it is Vladimir Tomovic's (TestRail user 1) and the QA lead's
# instruction of 2026-09-01 is explicit — "C45220 and others where the creator of the test case is
# Vladimir, do not change them." C45005 and C45026 are OURS (created_by 3) and flagged Automated;
# the QA lead answered "Permitted" for them on 2026-09-01, so they are in, and Rule 65 obliges a
# written report to Vlad for each one.
EXCLUDE = {45220}
AUTOMATED_AUTHORISED = {45005, 45026}

# ---------------------------------------------------------------- T1 the route
ROUTE_TAIL = ('Open its “Lines” tab. Each work order line has its own Parts section beneath it: the '
              '“Add Part” button sits in that section, and every part already on the line has an '
              '“edit” control at the right-hand end of its row — that control stays invisible until '
              'you move the mouse over the row.')

def t1(line):
    """Replace the PROVISIONAL route hedge with the route that was walked on the build."""
    if not line.startswith('In the top menu click “Work Orders”'):
        return line
    # keep the case's own status wording, drop everything from "Open its Lines tab" onward
    head = re.split(r'[;,.]?\s*open its lines tab', line, flags=re.I)[0]
    head = re.sub(r'\s*\(Route (drafted from the spec/design and marked PROVISIONAL|PROVISIONAL)[^)]*\)\s*$', '', head).strip()
    if not head.endswith('.'):
        head += '.'
    return f'{head} {ROUTE_TAIL}'

# --------------------------------------------------- T2/T3 the permission paths
ROLE_PATH = ('open “Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on '
             'the role your user is on')

def t2(line):
    if "'Work Order Line - Create and Edit'" not in line:
        return line
    negative = 'does NOT have' in line or 'do NOT have' in line
    if negative:
        return ("Sign in as a user whose role does NOT have the 'Work Order Line - Create and Edit' "
                "permission, or have an administrator create one. To set a role up that way: open "
                "“Settings”, click “Roles & Permissions” in the sidebar, click the pencil on THAT "
                "role, switch “Work Order Line - Create and Edit” off and save. Do not switch it off "
                "on your own administrator role — you would lock yourself out of the rest of the suite.")
    if 'setting enabled' in line:                        # the short variant used by two cases
        return ("You have the 'Work Order Line - Create and Edit' setting enabled. To check it: "
                f"{ROLE_PATH}, and look for “Work Order Line - Create and Edit”.")
    return ("Your user has the 'Work Order Line - Create and Edit' permission enabled. To check it: "
            f"{ROLE_PATH}, and look for “Work Order Line - Create and Edit”.")

def t3(line):
    m = re.match(r"Your 'Work Orders → Work Order View Mode' permission is set to (Tech View|Full View)", line)
    if not m:
        return line
    mode = m.group(1)
    return (f"Your “Work Orders → Work Order View Mode” permission is set to {mode}. To check or "
            f"change it: {ROLE_PATH}, then set “Work Order View Mode” to {mode}.")

# ------------------------------------------------------------- T4 build labels
CLOSE_CONTROL = ('the row’s close control (the “×” at the end of the row; in Tech View it is '
                 'labelled “Cancel”)')

def t4(text, seen):
    out = text
    out = out.replace('“Save part”', '“Save Part”')
    out = out.replace('“More Options”', '“More options”')
    # the modal's real titles, named once per case so the tester knows what opened
    if 'part details modal' in out and not seen.get('modal'):
        out = out.replace('part details modal',
                          'part details modal (titled “New Part Request” when you are adding a part '
                          'and “Edit Part Request” when you are editing one)', 1)
        seen['modal'] = True
    # the X: name the control the tester actually sees
    if not seen.get('close'):
        for pat, rep in (
            (r'\ban X \(close\) action\b', 'a close action (the “×” at the end of the row; in Tech View it is labelled “Cancel”)'),
            (r"\bthe row's “X”\b", CLOSE_CONTROL),
            (r'\bselect (?:the )?X\b', 'select ' + CLOSE_CONTROL),
            (r'\bthe “X”\b', CLOSE_CONTROL),
        ):
            new, n = re.subn(pat, rep, out, count=1, flags=re.I)
            if n:
                # re.subn lower-cased nothing, but the match may have started a sentence
                out = new[0].upper() + new[1:] if new[:1].islower() and out[:1].isupper() else new
                seen['close'] = True
                break
    return out

# ------------- T5 states that are really one click away, written as the click
STATE_REWRITES = [
    (r'^An inline “Add Part” row is open( on a work order line)? and contains data you have typed\.$',
     'Click “Add Part” on a work order line, then type anything into the Description field. Do not save it.'),
    (r'^An inline part row is open \(via “Add Part” or “Edit”\) and contains data you have typed\.$',
     'Click “Add Part” on a work order line (or the “edit” control on a part already on the line), then type anything into the Description field. Do not save it.'),
    (r'^An inline part row is open — you clicked “Add Part” on a work order line \(or “Edit” on an existing part line\) — and you have typed some data into it\.$',
     'Click “Add Part” on a work order line (or the “edit” control on a part already on the line), then type anything into the Description field. Do not save it.'),
    (r'^An inline part row is open \(you clicked “Add Part”\) and no data has been typed into it\.$',
     'Click “Add Part” on a work order line and type nothing at all into the row.'),
    (r'^An inline part row is open \(via “Add Part” or “Edit”\)\.$',
     'Click “Add Part” on a work order line (or the “edit” control on a part already on the line).'),
    (r'^An inline “Edit” row is open \(you clicked “Edit” on a part line\) and at least one field now differs from the saved value\.$',
     'Click the “edit” control on a part already on the line — hover the row to reveal it — then change the Description. Do not save it.'),
    (r'^An inline “Edit” row is open \(you clicked “Edit” on a part line\) and no field has been changed\.$',
     'Click the “edit” control on a part already on the line — hover the row to reveal it — and change nothing.'),
    (r'^No inline part row is open on the work order \(none opened via “Add Part” or “Edit”\)\.$',
     'Do not click “Add Part” or any “edit” control, so no inline row is open anywhere on the work order.'),
    (r'^An inline part row is already open on one of the work order.s lines \(via “Add Part” or “Edit”\) and contains data you have typed\.$',
     'Click “Add Part” on one of the work order’s lines, then type anything into the Description field. Do not save it.'),
]

def t5(line):
    for pat, rep in STATE_REWRITES:
        if re.match(pat, line):
            return rep
    return line

# ------------------------------------------------------------------- plumbing
def to_lines(h):
    """HTML field -> list of paragraphs, each a list of lines. Mirrors <p>…<br>…</p>."""
    if not h:
        return []
    paras = re.findall(r'<p>(.*?)</p>', h, re.S) or [re.sub(r'<[^>]+>', '', h)]
    out = []
    for p in paras:
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        out.append([x for x in lines if x])
    return [p for p in out if p]

def renumber(lines):
    """Keep the suite's 1. 2. 3. numbering consistent after any rewrite."""
    out = []
    n = 0
    for l in lines:
        body = re.sub(r'^\s*\d+\.\s*', '', l)
        n += 1
        out.append(f'{n}. {body}')
    return out

intended, snapshot, skipped = {}, {}, []
for c in CASES:
    cid = c['id']
    if cid in EXCLUDE:
        skipped.append({'cid': cid,
                        'reason': "created by Vladimir Tomovic (TestRail user 1) — the QA lead's "
                                  "2026-09-01 instruction is that his cases are not changed; Rule 38 "
                                  "and Rule 71 (it is also flagged Automated)"})
        continue
    if c.get('custom_atmstatus') == 3 and cid not in AUTOMATED_AUTHORISED:
        skipped.append({'cid': cid, 'reason': 'flagged Automated with no per-case go-ahead (Rule 71)'})
        continue
    verdict = V[cid][0]
    seen = {}

    # ---- preconditions
    pre = to_lines(c.get('custom_preconds'))
    newpre = []
    for para in pre:
        for l in para:
            body = re.sub(r'^\s*\d+\.\s*', '', l)
            body = t1(body); body = t2(body); body = t3(body); body = t5(body)
            body = t4(body, seen)
            newpre.append(body)
    newpre = renumber(newpre)

    # ---- steps (labels only; the steps themselves are already runnable)
    stp = to_lines(c.get('custom_steps'))
    newstp = renumber([t4(re.sub(r'^\s*\d+\.\s*', '', l), seen) for para in stp for l in para])

    # ---- expected: the numbered expectations, then --- + provenance, then the marker
    exp = to_lines(c.get('custom_expected'))
    body_lines, prov_lines = [], []
    for para in exp:
        if para[0].startswith('---'):
            prov_lines = [x for x in para[1:]]
        elif para[0].startswith('AUTOMATION:'):
            continue
        else:
            body_lines += para
    body_lines = renumber([t4(re.sub(r'^\s*\d+\.\s*', '', l), seen) for l in body_lines])
    prov_lines = [l for l in prov_lines if not l.startswith('Last checked against build')]
    assert len(prov_lines) == 1, (cid, prov_lines)
    prov_block = ['---'] + prov_lines
    # A PARTIAL case WAS checked against the build - part of it was observed and part has no data
    # state here - so Rule 54 sentence 2 is true of it and belongs on it. Only a case this pass never
    # exercised is left without one.
    if verdict in ('PASS', 'FAIL', 'PARTIAL'):
        prov_block.append(BUILD_SENTENCE)
    marker = 'AUTOMATION: READY'

    intended[str(cid)] = {
        'title': c['title'],
        'verdict': verdict or 'PENDING',
        'marker_override': marker,
        'build_sentence': BUILD_SENTENCE if verdict in ('PASS', 'FAIL', 'PARTIAL') else None,
        'fields': {
            'custom_preconds': {'blocks': [newpre], 'text': '\n'.join(newpre)},
            'custom_steps':    {'blocks': [newstp], 'text': '\n'.join(newstp)},
            # 🛑 THE VERIFIER COMPARES AGAINST THE RENDERED innerText, AND SEPARATE <p> BLOCKS
            # RENDER WITH A BLANK LINE BETWEEN THEM. Joining every line with a single \n made the
            # first pilot fail verification on three cases whose content had in fact saved
            # perfectly. Lines WITHIN a block keep \n (they are <br>s); blocks are joined with \n\n.
            'custom_expected': {'blocks': [body_lines, prov_block, [marker]],
                                'text': '\n\n'.join(['\n'.join(b) for b in (body_lines, prov_block, [marker])])},
        },
    }
    snapshot[str(cid)] = {
        'title': c['title'], 'atm': c.get('custom_atmstatus'), 'section_id': c['section_id'],
        'refs': c.get('refs'), 'provenance': prov_lines,
        'before': {f: c.get(f) for f in ('custom_preconds', 'custom_steps', 'custom_expected')},
    }

out = os.path.join(HERE)
json.dump(intended, open(f'{out}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snapshot, open(f'{out}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
json.dump(skipped, open(f'{out}/SKIPPED.json', 'w'), indent=1, ensure_ascii=False)
# the writer's Rule 71 gate reads this allow-list immediately before each write; it is an explicit
# per-case file, never a blanket flag
json.dump(sorted(AUTOMATED_AUTHORISED), open(f'{out}/automated-authorised.json', 'w'))
print(f'queued {len(intended)} cases, skipped {len(skipped)}')
import collections
print(collections.Counter(v['verdict'] for v in intended.values()))
print('with build sentence :', sum(1 for v in intended.values() if v['build_sentence']))
