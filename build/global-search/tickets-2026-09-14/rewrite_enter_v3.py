#!/usr/bin/env python3
"""SV-10061, third and final description. The first two were both my own instrument.

Version 1: "Enter opens a record further down the list, not the top result." Wrong - general.
Version 2: "the highlight starts on the 8th row of a long list, and clicking a row makes that
           position stick." Also wrong - BOTH halves were my own mouse pointer, left sitting where
           it had clicked. The panel reopens in the same screen position, so the cursor was still
           hovering whatever occupied that spot.

The QA lead found it, described the real mechanism, and it reproduces exactly as he said. Measured
with the pointer parked in a corner and the parking VERIFIED by document.elementFromPoint:

  type "Truck" (41 results), pointer away from the list  -> row 1 selected      correct
  move the mouse ACROSS row 9, never clicking            -> row 9 selected
  move the pointer off the list entirely                 -> row 9 STILL selected
  press Escape, reopen the search on the same page       -> row 9 STILL selected, before typing
  type the same word again                               -> row 9 selected, Enter opens row 9

So: brushing the list with the mouse silently re-arms Enter, and the change outlives the mouse and
outlives closing the panel. No click is needed anywhere.
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
SHOTS = ['S1-typed-row-one-selected.png', 'S2-hovered-then-pointer-away.png',
         'S3-still-selected-after-reopen.png']
SUMMARY = ('Global Search: moving the mouse over a result silently changes which record Enter opens, '
           'and it stays changed after the mouse leaves and after the search is closed and reopened')


def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload_v3.json'
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
    st = ev.get('steps', {})
    hovered = ev.get('hoveredRowNumber', 9)
    rows = (st.get('1_afterTyping') or {}).get('rows', 'many')
    reopened = (st.get('4_onReopen_beforeTyping') or {}).get('focusedRow')
    again = st.get('5_sameWordAgain') or {}

    s = "h2. 1. Environment\n\n"
    s += ("* Site: [%s|%s] - QA branch sv9160, Global Search V2\n"
          "* Signed in as: an administrator\n"
          "* Observed: 15 September 2026\n"
          "* No special data needed. Any word returning a long list will do; the run below used "
          "*Truck*, which returned %s results.\n\n" % (BRANCH, BRANCH, rows))

    s += "h2. 2. The problem\n\n"
    s += ("Moving the mouse across the list of results changes which record Enter will open - even "
          "though nothing is clicked.\n\n"
          "Type a word and the first result is selected, which is right. But let the pointer pass "
          "over a row on its way somewhere else, and that row becomes the selected one. Move the "
          "mouse right off the list and it stays selected. Close the search and open it again and it "
          "is still selected. Press Enter and that record opens instead of the top one.\n\n"
          "Nothing on screen says the target has moved, and the person never chose anything.\n\n")

    s += "h2. 3. Steps to reproduce\n\n"
    s += ("# Open ShopView on the QA branch: [%s/workorders|%s/workorders]\n" % (BRANCH, BRANCH))
    s += "# Open the search box (the magnifying glass in the top bar, or Ctrl and K).\n"
    s += "# Type *Truck*. A long list appears and the FIRST row is selected - this part is correct.\n"
    s += ("# Move the mouse down over the list until it is over the ninth row. Do NOT click. Then "
          "move the mouse away to the side, so it is not over any row at all.\n")
    s += "# The ninth row is now the selected one.\n"
    s += "# Press Escape to close the search, then open it again on the same page.\n"
    s += "# The ninth row is STILL the selected one, before you type anything.\n"
    s += "# Type *Truck* again and press Enter. The ninth record opens, not the first.\n\n"

    s += "h2. 4. Screenshots\n\n"
    s += ("*After typing, with the pointer away from the list. The first row is selected - this is "
          "correct behaviour.*\n\n!S1-typed-row-one-selected.png|width=760!\n\n")
    s += ("*After the mouse passed over the ninth row and then left the list. Nothing was clicked. "
          "The top result is boxed in blue; the row now selected is boxed in red.*\n\n"
          "!S2-hovered-then-pointer-away.png|width=760!\n\n")
    s += ("*After closing the search and reopening it. The ninth row is still selected, and Enter "
          "opens it.*\n\n!S3-still-selected-after-reopen.png|width=760!\n\n")

    s += "h2. 5. Current behaviour\n\n"
    s += "* Typing a word selects the first result. Correct.\n"
    s += ("* Moving the mouse over row %s selects row %s. No click is involved.\n" % (hovered, hovered))
    s += "* Moving the pointer off the list leaves row %s selected.\n" % hovered
    if reopened:
        s += ("* Closing the search and reopening it on the same page leaves row %s selected, before "
              "anything is typed.\n" % reopened)
    if again.get('theHoveredRowIsSelectedAgain'):
        s += ("* Typing the same word again keeps row %s selected, and Enter opens it: %s\n"
              % (hovered, again.get('enterOpened', 'that record')))
    s += "* Nothing on screen tells the person that the target of Enter has moved.\n"

    s += "\nh2. 6. Expected behaviour\n\n"
    s += ("* Moving the mouse over the list should not change which record Enter opens. Hovering is "
          "not choosing.\n")
    s += ("* If passing the mouse over a row is meant to select it, that selection should not "
          "outlive the mouse leaving the row - and certainly not survive closing the search.\n")
    s += "* Whichever row Enter will open should be clearly marked, so the person can see it.\n"
    s += ("* On the previous version, live on production, typing a word and pressing Enter takes you "
          "to the first record in the list. Confirmed on production by the QA lead on 15 September "
          "2026.\n")

    s += "\nh2. 7. Sources\n\n"
    s += "%s.\n[%s|%s]\n\n" % (SPEC, SPECLINK, SPECLINK)
    s += ("*Section 5.5, Keyboard navigation*\n{quote}Up/Down moves focus through visible rows "
          "(skipping group headers), scrolling the focused row into view. Enter opens the focused "
          "row in the same tab.{quote}\n\n")
    s += ("*Section 9, Non-Functional Requirements - accessibility*\n{quote}The keyboard-focused row "
          "must be visually distinguishable from the mouse-hovered row.{quote}\n\n")
    s += ("That last line is the requirement this breaks most directly: the two are not merely "
          "indistinguishable here, they are the same thing - hovering a row makes it the "
          "keyboard-focused row. Section 5.5 says Enter opens the focused row, and it does; the "
          "fault is in what moves the focus.\n\n")
    s += ("Section 5.2 does ask for the query and the result list to be restored when the search is "
          "reopened. It does not ask for a selection to be restored, and the selection here was "
          "never made deliberately.\n\n")

    s += "h2. 8. Test cases\n\n"
    s += ("Run 415: [https://shopview.testrail.io/index.php?/runs/view/415"
          "|https://shopview.testrail.io/index.php?/runs/view/415]\n\n")
    s += ("* C55673 - Pressing Enter opens the top result without arrowing to it: "
          "[https://shopview.testrail.io/index.php?/cases/view/55673"
          "|https://shopview.testrail.io/index.php?/cases/view/55673]\n")
    return s


def main():
    evpath = os.path.join(DIR, 'ENTER-HOVER-REOPEN.json')
    if not os.path.exists(evpath):
        sys.exit('REFUSING: no ENTER-HOVER-REOPEN.json - run CAPTURE_hover_reopen.mjs first')
    ev = json.load(open(evpath))
    c = ev.get('conclusion') or {}

    problems = [f for f in SHOTS if not os.path.exists(os.path.join(EVDIR, f))]
    if not c.get('hoveringMovesTheSelection'):
        problems.append('the evidence does not show hovering moving the selection')
    if not c.get('itStaysAfterThePointerLeaves'):
        problems.append('the evidence does not show it staying after the pointer leaves')
    if problems:
        print('REFUSING TO REWRITE:', file=sys.stderr)
        for p in problems:
            print('  -', p, file=sys.stderr)
        sys.exit(1)

    if '--dry-run' in sys.argv:
        print('SUMMARY:', SUMMARY, '\n')
        print(body(ev))
        return

    for f in SHOTS:
        ok, info = attach(f)
        print('   attach %s: %s' % (f, 'ok' if ok else 'FAILED ' + info))
    s1, r1 = jira('PUT', '/rest/api/3/issue/%s' % KEY, {"fields": {"summary": SUMMARY}})
    print('   summary: HTTP %s %s' % (s1, r1 if s1 not in (200, 204) else ''))
    s2, r2 = jira('PUT', '/rest/api/2/issue/%s' % KEY, {"fields": {"description": body(ev)}})
    print('   description: HTTP %s %s' % (s2, r2 if s2 not in (200, 204) else ''))
    jira('POST', '/rest/api/2/issue/%s/comment' % KEY, {"body":
        "Description rewritten again, 15 September 2026. This is the third version and the first "
        "one that describes the product rather than our test harness.\n\n"
        "Both earlier versions were wrong for the same reason: our automation clicked a result row "
        "and then left the mouse pointer sitting at those coordinates. The search panel reopens in "
        "the same place on screen, so the pointer was still hovering whatever now occupied that "
        "spot. That produced a stable, repeatable artefact that looked exactly like a product "
        "fault - first as \"Enter opens a record further down the list\", then as \"the highlight "
        "starts on the 8th row and the position sticks\". Neither happens.\n\n"
        "The QA lead identified the real mechanism from a screen recording. It has now been "
        "measured with the mouse pointer parked away from the list and the parking verified, not "
        "assumed: typing selects the first row correctly, and it is HOVERING that moves the "
        "selection - with no click, outliving the mouse leaving the row, and surviving the search "
        "being closed and reopened.\n\n"
        "Apologies for the noise on this ticket. The three screenshots are annotated."})
    print('\nREWRITTEN: https://shopview.atlassian.net/browse/%s' % KEY)


if __name__ == '__main__':
    main()
