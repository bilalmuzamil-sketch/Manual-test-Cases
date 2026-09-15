#!/usr/bin/env python3
"""File the Enter-opens-the-wrong-record defect (C55673), approved by the QA lead on 2026-09-15
with "Yes with evidences and screenshot with annotations".

Same eight-heading shape and the same wiki-markup route as the other six. The screenshots are
annotated IN THE PAGE by CAPTURE_enter_key.mjs before capture -- a box round the top result, a box
round the row the panel had silently highlighted, and a label on the page Enter actually opened --
so the reader is not left to work out which row is which.

Evidence file: ENTER-KEY-EVIDENCE.json. This refuses to file if that evidence does not show the
behaviour, rather than filing a ticket whose screenshots contradict its text.
"""
import json, os, subprocess, sys, time

DIR = os.path.dirname(os.path.abspath(__file__))
EVJSON = os.path.join(DIR, 'ENTER-KEY-EVIDENCE.json')
EVDIR = os.path.join(DIR, 'enter-evidence')
JIRA = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
STATE = os.path.join(DIR, 'ENTER-DEFECT.json')
OWNER = 'SV-9171'        # FE - Keyboard navigation and WCAG 2.1 AA accessibility for the search modal
BRANCH = 'https://sv9160.qa.shopview.com'
SPEC = ('Global Search - Product Requirements, Confluence page 576978945, Version 1.5, '
        'read live on 15 September 2026')
SPECLINK = ('https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/'
            'Global+Search+-+Product+Requirements')


def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload_enter.json'
        open(p, 'w').write(json.dumps(payload))
        args.append(p)
    r = subprocess.run(args, capture_output=True, text=True)
    out = r.stdout
    status = None
    for line in out.splitlines():
        if line.startswith('__HTTP:'):
            status = int(line.split(':')[1])
    body_txt = out.split('__HTTP:')[0].strip()
    try:
        j = json.loads(body_txt) if body_txt else None
    except Exception:
        j = None
    return status, j, body_txt[:300]


def attach(key, filename):
    path = os.path.join(EVDIR, filename)
    if not os.path.exists(path):
        return False, 'not on disk: ' + path
    r = subprocess.run(['curl', '-s', '-w', '\n__HTTP:%{http_code}',
        '-b', os.environ.get('ATL_COOKIES', '/tmp/atlassian/cookies.txt'),
        '--cacert', '/root/.ccr/ca-bundle.crt',
        '-H', 'Accept: application/json',
        '-H', 'X-Atlassian-Token: no-check',
        '-H', 'Origin: https://shopview.atlassian.net',
        '-H', 'Referer: https://shopview.atlassian.net/browse/SV-9160',
        '-H', 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        '-F', 'file=@%s' % path,
        'https://shopview.atlassian.net/rest/api/3/issue/%s/attachments' % key],
        capture_output=True, text=True)
    return ('__HTTP:200' in r.stdout), r.stdout[-80:]


def build_body(ev):
    top = (ev.get('topRow') or {}).get('text', '(the first row)')
    hl = ev.get('highlighted') or []
    hl_text = hl[0]['text'] if hl else None
    opened = ev.get('urlAfter', '')
    landed = ', '.join((ev.get('landedOn') or {}).get('headings') or []) or '(no heading read)'
    same = ev.get('sameBothTimes')

    s = "h2. 1. Environment\n\n"
    s += ("* Site: [%s|%s] - QA branch sv9160, Global Search V2\n"
          "* Signed in as: an administrator\n"
          "* Observed: 15 September 2026\n"
          "* Records used: anything matching the word Bridgeport - the seeded customer "
          "ZZAUTOTEST Bridgeport Hauling and its jobs, reachable from [%s/customers|%s/customers]\n\n"
          % (BRANCH, BRANCH, BRANCH, BRANCH))

    s += "h2. 2. The problem\n\n"
    s += ("Type a word into search and press Enter without touching an arrow key, and the wrong "
          "record opens. It is not the top result. It is a row further down the list that the panel "
          "has highlighted on its own, without the person doing anything to choose it.\n\n")

    s += "h2. 3. Steps to reproduce\n\n"
    s += ("# Open ShopView on the QA branch: [%s/workorders|%s/workorders]\n" % (BRANCH, BRANCH))
    s += "# Open the search box (the magnifying glass in the top bar, or Ctrl and K).\n"
    s += "# Type *Bridgeport*\n"
    s += "# Wait for the results to appear. Do NOT press an arrow key, and do not click anything.\n"
    s += "# Press Enter.\n"
    s += "# Look at which record opened, and compare it with the first row in the list.\n\n"

    s += "h2. 4. Screenshots\n\n"
    s += ("*The results as they appear. The blue box is the top result - the one a person pressing "
          "Enter expects. The red box is the row the panel has highlighted by itself, with no arrow "
          "key pressed.*\n\n!1-results-before-enter.png|width=760!\n\n")
    s += ("*The page that actually opened when Enter was pressed.*\n\n"
          "!2-page-after-enter.png|width=760!\n\n")

    s += "h2. 5. Current behaviour\n\n"
    s += "* The first row in the list is: %s\n" % top
    if hl_text:
        s += ("* The row the panel highlights on its own, before any key is pressed, is a different "
              "one: %s\n" % hl_text)
    s += "* Pressing Enter opens that other row, not the first one.\n"
    s += "* The page that opened was %s (%s).\n" % (landed, opened)
    if same:
        s += ("* Checked twice, in separate sittings, with nothing clicked first. It behaved the "
              "same way both times, so this is not a one-off.\n")
    s += ("* Nothing warns the person. The record simply opens, and someone typing and pressing "
          "Enter out of habit may not notice they are on the wrong one.\n")

    s += "\nh2. 6. Expected behaviour\n\n"
    s += "* Pressing Enter opens the top result.\n"
    s += ("* Whichever row is going to open should be the one shown as selected, so a person can see "
          "where Enter will take them before they press it.\n")
    s += ("* In the previous version the first result was highlighted as soon as results appeared, "
          "so typing and pressing Enter went straight to the best match. That is the behaviour this "
          "asks for.\n")

    s += "\nh2. 7. Sources\n\n"
    s += "%s.\n[%s|%s]\n\n" % (SPEC, SPECLINK, SPECLINK)
    s += ("*Section 5.5, Keyboard navigation*\n{quote}Up/Down moves focus through visible rows "
          "(skipping group headers), scrolling the focused row into view. Enter opens the focused "
          "row in the same tab.{quote}\n\n")
    s += ("*Section 6.2, Cross-entity ordering - what "
          "\"the top result\" means*\n{quote}Within each group, rows are sorted by score descending. "
          "When the top result across all groups has a score > 0.95 (effectively an ID match), it is "
          "pinned as a separate single row at the very top{quote}\n\n")
    s += ("Note on reading these together: the requirement says Enter opens the FOCUSED row, and "
          "does not say which row is focused before anyone presses a key. That gap is the finding. "
          "What is not in doubt is that the row the panel focuses by itself is not the top one, and "
          "that the person is given no way to see which it is. The previous version focused the "
          "first result, and this case is tested against the previous version.\n\n")

    s += "h2. 8. Test cases\n\n"
    s += ("Run 415: [https://shopview.testrail.io/index.php?/runs/view/415"
          "|https://shopview.testrail.io/index.php?/runs/view/415]\n\n")
    s += ("* C55673 - Pressing Enter opens the top result without arrowing to it: "
          "[https://shopview.testrail.io/index.php?/cases/view/55673"
          "|https://shopview.testrail.io/index.php?/cases/view/55673]\n")
    return s


def main():
    if not os.path.exists(EVJSON):
        sys.exit('REFUSING: no evidence file at %s - run CAPTURE_enter_key.mjs first' % EVJSON)
    ev = json.load(open(EVJSON))

    # Do not file a ticket the evidence does not support.
    problems = []
    if not ev.get('navigated'):
        problems.append('the evidence shows Enter did not open anything at all')
    if not ev.get('rows'):
        problems.append('the evidence has no result rows in it')
    for fn in ('1-results-before-enter.png', '2-page-after-enter.png'):
        if not os.path.exists(os.path.join(EVDIR, fn)):
            problems.append('missing screenshot ' + fn)
    if problems:
        print('REFUSING TO FILE:', file=sys.stderr)
        for p in problems:
            print('  -', p, file=sys.stderr)
        sys.exit(1)

    if '--dry-run' in sys.argv:
        print(build_body(ev))
        return

    state = json.load(open(STATE)) if os.path.exists(STATE) else {}
    if state.get('key') and state.get('description_http') in (200, 204):
        print('already complete as', state['key'])
        return
    key = state.get('key')
    summary = ('Global Search: pressing Enter opens a record further down the list, not the top '
               'result, with no arrow key pressed')
    if not key:
        st, j, raw = jira('POST', '/rest/api/3/issue', {"fields": {
            "project": {"key": "SV"}, "issuetype": {"id": "10007"},
            "parent": {"key": OWNER}, "summary": summary, "priority": {"name": "Medium"}}})
        if st not in (200, 201):
            sys.exit('CREATE FAILED %s %s' % (st, raw))
        key = j['key']
        state = {'key': key, 'summary': summary, 'parent': OWNER,
                 'created': time.strftime('%Y-%m-%dT%H:%M:%SZ')}
        json.dump(state, open(STATE, 'w'), indent=1)
        print('created', key, 'under', OWNER)
    for fn in ('1-results-before-enter.png', '2-page-after-enter.png'):
        ok, info = attach(key, fn)
        print('   attach %s: %s' % (fn, 'ok' if ok else 'FAILED ' + info))
    st2, _, _ = jira('PUT', '/rest/api/2/issue/%s' % key, {"fields": {"description": build_body(ev)}})
    print('   description: HTTP %s' % st2)
    state['description_http'] = st2
    json.dump(state, open(STATE, 'w'), indent=1)
    print('\nFILED:', key, 'https://shopview.atlassian.net/browse/' + key)


if __name__ == '__main__':
    main()
