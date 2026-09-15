#!/usr/bin/env python3
"""Rewrite SV-10061. The first version described the wrong thing.

What it said: "pressing Enter opens a record further down the list, not the top result" -- which
reads as a general failure. It is not general. The QA lead checked and found a fresh keyword works,
and he was right: four of six words I tried highlight the first row and Enter opens it correctly.

Had this gone to a developer as filed, they would have typed a short search, seen it work, and
closed it as not reproducible.

What is actually happening, measured:
  1. On a LONG result list the highlight starts on the EIGHTH row, not the first.
     2, 3, 6 and 8-row lists start on row 1; 13, 22 and 41-row lists start on row 8.
  2. Once you click a row yourself, THAT POSITION sticks -- and follows you into later searches,
     including a different word, where row 5 now holds a completely different record.

Approved by the QA lead on 2026-09-15: "you can file it this way with screenshot and change the
description of the ticket with annotated screenshot as needed and then I will change the ticket
status to open again."
"""
import json, os, subprocess, sys

DIR = os.path.dirname(os.path.abspath(__file__))
EVDIR = os.path.join(DIR, 'enter-evidence')
JIRA = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
KEY = 'SV-10061'
BRANCH = 'https://sv9160.qa.shopview.com'
SPEC = ('Global Search - Product Requirements, Confluence page 576978945, Version 1.5, '
        'read live on 15 September 2026')
SPECLINK = ('https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/'
            'Global+Search+-+Product+Requirements')
SHOTS = ['N1-highlight-is-not-the-first-row.png', 'N2-clicking-the-fifth-row.png',
         'N3-same-position-different-record.png', 'N4-position-follows-a-different-word.png']
SUMMARY = ('Global Search: Enter opens the wrong record - the highlight starts on the 8th row of a '
           'long list, and once you click a row that POSITION sticks across later searches')


def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload_rewrite.json'
        open(p, 'w').write(json.dumps(payload))
        args.append(p)
    r = subprocess.run(args, capture_output=True, text=True)
    status = None
    for line in r.stdout.splitlines():
        if line.startswith('__HTTP:'):
            status = int(line.split(':')[1])
    return status, r.stdout.split('__HTTP:')[0].strip()[:300]


def attach(filename):
    path = os.path.join(EVDIR, filename)
    if not os.path.exists(path):
        return False, 'not on disk: ' + filename
    r = subprocess.run(['curl', '-s', '-w', '\n__HTTP:%{http_code}',
        '-b', os.environ.get('ATL_COOKIES', '/tmp/atlassian/cookies.txt'),
        '--cacert', '/root/.ccr/ca-bundle.crt',
        '-H', 'Accept: application/json', '-H', 'X-Atlassian-Token: no-check',
        '-H', 'Origin: https://shopview.atlassian.net',
        '-H', 'Referer: https://shopview.atlassian.net/browse/SV-9160',
        '-H', 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        '-F', 'file=@%s' % path,
        'https://shopview.atlassian.net/rest/api/3/issue/%s/attachments' % KEY],
        capture_output=True, text=True)
    return ('__HTTP:200' in r.stdout), r.stdout[-70:]


def body(ev):
    first = ev.get('beforeAnyClick', {})
    picked = ev.get('picked', {})
    same = ev.get('sameWordAgain', {})
    diff = ev.get('differentWord', {})

    s = "h2. 1. Environment\n\n"
    s += ("* Site: [%s|%s] - QA branch sv9160, Global Search V2\n"
          "* Signed in as: an administrator\n"
          "* Observed: 15 September 2026\n"
          "* No special data needed - any word that returns a long list of results will do. The runs "
          "below used *Truck* and *Repair*.\n\n" % (BRANCH, BRANCH))

    s += "h2. 2. The problem\n\n"
    s += ("Typing a word and pressing Enter does not reliably open the top result. There are two "
          "separate things going wrong, and they are easy to mistake for one.\n\n"
          "First, on a long list of results the row the panel highlights on its own is the *eighth*, "
          "not the first - so Enter opens the eighth record.\n\n"
          "Second, once you click a row yourself, *that position* is remembered. From then on, "
          "searching again - including for a completely different word - keeps the same row number "
          "highlighted, and Enter opens whatever record now happens to sit there.\n\n"
          "*Please note before testing:* a short search looks fine. Lists of a few results start on "
          "the first row and Enter behaves. This was nearly closed as not reproducible for exactly "
          "that reason.\n\n")

    s += "h2. 3. Steps to reproduce\n\n"
    s += "*Part one - the highlight does not start on the first row*\n\n"
    s += ("# Open ShopView on the QA branch: [%s/workorders|%s/workorders]\n" % (BRANCH, BRANCH))
    s += "# Open the search box (the magnifying glass in the top bar, or Ctrl and K).\n"
    s += "# Type *Truck*, which returns a long list.\n"
    s += "# Do NOT press an arrow key and do not click anything. Look at which row is highlighted.\n"
    s += "# Press Enter and see which record opens.\n\n"
    s += "*Part two - the position sticks and follows you*\n\n"
    s += "# Search *Truck* again and this time click the FIFTH row yourself.\n"
    s += "# Open the search box again and type *Truck*. The fifth row is highlighted again.\n"
    s += ("# Now clear the box and type a different word, *Repair*. The fifth row is highlighted "
          "there too - a different record entirely.\n")
    s += "# Press Enter. That unrelated record opens.\n\n"

    s += "h2. 4. Screenshots\n\n"
    s += ("*A long list, before anything has been clicked. The top result is boxed in blue; the row "
          "the app highlights by itself - the eighth - is boxed in red. No key was pressed.*\n\n"
          "!N1-highlight-is-not-the-first-row.png|width=760!\n\n")
    s += ("*Clicking the fifth row by hand. This is the only choice the person makes.*\n\n"
          "!N2-clicking-the-fifth-row.png|width=760!\n\n")
    s += ("*The same word searched again. The fifth row is highlighted, not the first.*\n\n"
          "!N3-same-position-different-record.png|width=760!\n\n")
    s += ("*A completely different word. The fifth row is highlighted here too, and Enter opens that "
          "record - which has nothing to do with the earlier choice.*\n\n"
          "!N4-position-follows-a-different-word.png|width=760!\n\n")

    s += "h2. 5. Current behaviour\n\n"
    s += ("* On a list of %s results, nothing pressed or clicked, the highlighted row is row %s.\n"
          % (first.get('rows', 'many'), (first.get('highlighted') or 0) + 1))
    s += ("* Short lists are fine. Measured: lists of 2, 3, 6 and 8 results start on the first row; "
          "lists of 13, 22 and 41 results start on the eighth.\n")
    s += "* Clicking the fifth row makes the fifth row the highlighted one from then on.\n"
    if same.get('sameRowNumberAsPicked'):
        s += ("* Searching the same word again keeps the fifth row highlighted, and Enter opens it.\n")
    if diff.get('sameRowNumberAsPicked'):
        s += ("* Searching a DIFFERENT word keeps the fifth row highlighted, and Enter opened "
              "%s - a record with no connection to the one that was clicked.\n"
              % diff.get('enterOpened', 'a different record'))
    s += ("* It is the POSITION that is remembered, not the record. In a separate run where the "
          "results had shifted between searches, the same row number held a different job and Enter "
          "opened that one instead.\n")
    s += "* Nothing on screen says which row Enter will open.\n"

    s += "\nh2. 6. Expected behaviour\n\n"
    s += "* With nothing pressed or clicked, the first result is the highlighted one.\n"
    s += "* Pressing Enter opens the top result.\n"
    s += ("* Choosing a result once should not change where Enter goes on any later search, and "
          "certainly not on a search for a different word.\n")
    s += ("* Whichever row Enter will open should be visibly marked, so a person can see where they "
          "are about to go.\n")

    s += "\nh2. 7. Sources\n\n"
    s += "%s.\n[%s|%s]\n\n" % (SPEC, SPECLINK, SPECLINK)
    s += ("*Section 5.5, Keyboard navigation*\n{quote}Up/Down moves focus through visible rows "
          "(skipping group headers), scrolling the focused row into view. Enter opens the focused "
          "row in the same tab.{quote}\n\n")
    s += ("*Section 5.2, States - Persisting search*\n{quote}When the modal closes (either by Esc or "
          "by navigating to a result), the most recent query string is preserved in the header search "
          "field as plain text. Reopening the modal restores the query, the scope tab, and the result "
          "list, and pre-selects the query text so that typing replaces it.{quote}\n\n")
    s += ("Reading these together: the requirement asks for the QUERY to be restored. It does not ask "
          "for a chosen ROW POSITION to be restored, and it says nothing about which row is focused "
          "before anyone presses a key. What is not in doubt is that the focused row is not the top "
          "one, that it survives into unrelated searches, and that the person is given no way to see "
          "which row it is.\n\n")
    s += ("On the previous version, live on production: typing a word and pressing Enter takes you to "
          "the first record in the list. Confirmed on production by the QA lead on 15 September 2026.\n\n")

    s += "h2. 8. Test cases\n\n"
    s += ("Run 415: [https://shopview.testrail.io/index.php?/runs/view/415"
          "|https://shopview.testrail.io/index.php?/runs/view/415]\n\n")
    s += ("* C55673 - Pressing Enter opens the top result without arrowing to it: "
          "[https://shopview.testrail.io/index.php?/cases/view/55673"
          "|https://shopview.testrail.io/index.php?/cases/view/55673]\n")
    return s


def main():
    evpath = os.path.join(DIR, 'ENTER-ANNOTATED.json')
    if not os.path.exists(evpath):
        sys.exit('REFUSING: no ENTER-ANNOTATED.json - run CAPTURE_enter_annotated.mjs first')
    ev = json.load(open(evpath))

    problems = [f for f in SHOTS if not os.path.exists(os.path.join(EVDIR, f))]
    c = ev.get('conclusion') or {}
    if not c.get('clickingARowMakesThatPositionStick'):
        problems.append('the evidence does not show the position sticking')
    if problems:
        print('REFUSING TO REWRITE:', file=sys.stderr)
        for p in problems:
            print('  -', p, file=sys.stderr)
        sys.exit(1)

    if '--dry-run' in sys.argv:
        print('SUMMARY:', SUMMARY)
        print()
        print(body(ev))
        return

    for f in SHOTS:
        ok, info = attach(f)
        print('   attach %s: %s' % (f, 'ok' if ok else 'FAILED ' + info))
    st, raw = jira('PUT', '/rest/api/3/issue/%s' % KEY, {"fields": {"summary": SUMMARY}})
    print('   summary: HTTP %s %s' % (st, raw if st not in (200, 204) else ''))
    st2, raw2 = jira('PUT', '/rest/api/2/issue/%s' % KEY, {"fields": {"description": body(ev)}})
    print('   description: HTTP %s %s' % (st2, raw2 if st2 not in (200, 204) else ''))
    jira('POST', '/rest/api/2/issue/%s/comment' % KEY, {"body":
        "Description and title rewritten 15 September 2026, with the QA lead's approval.\n\n"
        "The first version said Enter opens a record further down the list, which read as a general "
        "failure. It is not general: a short search behaves correctly, and anyone testing it that way "
        "would have closed this as not reproducible. Two specific things are wrong instead - the "
        "highlight starts on the eighth row of a long list, and clicking a row makes that POSITION "
        "stick across later searches, including searches for a different word.\n\n"
        "The four screenshots are annotated: the top result in blue, the highlighted row in red."})
    print('\nREWRITTEN: https://shopview.atlassian.net/browse/%s' % KEY)


if __name__ == '__main__':
    main()
