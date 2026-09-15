#!/usr/bin/env python3
"""SV-10061, shortened.

QA lead, 2026-09-15: "do NOT forget ever to keep the ticket simple and explanatory and short as
much as possible."

Same eight headings, same facts, roughly a third of the words. What was cut: the long restatement
of the mechanism in heading 2, the reasoning paragraphs under Sources, the running commentary in
Current behaviour. What was kept: every step, every measured fact, all three screenshots, the one
requirement quote that points a developer at the right place.

The apology-and-history comment stays as a COMMENT, not in the description - a reader wanting the
defect should not have to wade through our correction history to reach it.
"""
import json, os, subprocess, sys

DIR = os.path.dirname(os.path.abspath(__file__))
EVDIR = os.path.join(DIR, 'enter-evidence')
JIRA = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
KEY = 'SV-10061'
BRANCH = 'https://sv9160.qa.shopview.com'
SPECLINK = ('https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/'
            'Global+Search+-+Product+Requirements')
SUMMARY = ('Global Search: moving the mouse over a result changes which record Enter opens, and it '
           'stays changed after the mouse leaves and after the search is reopened')


def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload_v4.json'
        open(p, 'w').write(json.dumps(payload))
        args.append(p)
    r = subprocess.run(args, capture_output=True, text=True)
    status = None
    for line in r.stdout.splitlines():
        if line.startswith('__HTTP:'):
            status = int(line.split(':')[1])
    return status, r.stdout.split('__HTTP:')[0].strip()[:300]


BODY = """h2. 1. Environment

* [%(b)s/workorders|%(b)s/workorders] - QA branch sv9160, Global Search V2
* Signed in as an administrator, 15 September 2026
* No special data. Any word with a long list of results; this used *Truck*, which returned 41.

h2. 2. The problem

Moving the mouse across the results changes which record Enter opens. Nothing is clicked, and
nothing on screen shows that the target has moved.

h2. 3. Steps to reproduce

# Open the search box (the magnifying glass in the top bar, or Ctrl and K).
# Type *Truck*. The first row is selected - this is correct.
# Move the mouse over the ninth row. Do NOT click. Then move it away to the side, off the list.
# The ninth row is now the selected one.
# Press Escape, then open the search again.
# The ninth row is still selected. Press Enter - the ninth record opens, not the first.

h2. 4. Screenshots

*After typing, mouse away from the list: the first row is selected. Correct.*

!S1-typed-row-one-selected.png|width=760!

*After the mouse passed over the ninth row and left. Blue is the top result, red is what Enter will
now open.*

!S2-hovered-then-pointer-away.png|width=760!

*After closing and reopening the search: still the ninth row.*

!S3-still-selected-after-reopen.png|width=760!

h2. 5. Current behaviour

* Typing selects the first row.
* Hovering the ninth row selects it. No click.
* It stays selected after the mouse leaves the list.
* It stays selected after the search is closed and reopened, before anything is typed.
* Enter then opens that record instead of the top result.

h2. 6. Expected behaviour

* Moving the mouse over the list should not change which record Enter opens.
* Enter opens the top result, unless the person picked another with the arrow keys.
* The previous version, live on production, opens the first record.

h2. 7. Sources

Global Search - Product Requirements, page 576978945, version 1.5, read 15 September 2026:
[%(s)s|%(s)s]

{quote}The keyboard-focused row must be visually distinguishable from the mouse-hovered row.{quote}

Here they are the same thing: hovering sets the keyboard focus.

h2. 8. Test cases

Run 415: [https://shopview.testrail.io/index.php?/runs/view/415|https://shopview.testrail.io/index.php?/runs/view/415]

* C55673: [https://shopview.testrail.io/index.php?/cases/view/55673|https://shopview.testrail.io/index.php?/cases/view/55673]
""" % {'b': BRANCH, 's': SPECLINK}


def main():
    for f in ('S1-typed-row-one-selected.png', 'S2-hovered-then-pointer-away.png',
              'S3-still-selected-after-reopen.png'):
        if not os.path.exists(os.path.join(EVDIR, f)):
            sys.exit('REFUSING: missing screenshot ' + f)
    if '--dry-run' in sys.argv:
        print('SUMMARY:', SUMMARY)
        print('words in description:', len(BODY.split()))
        print()
        print(BODY)
        return
    s1, r1 = jira('PUT', '/rest/api/3/issue/%s' % KEY, {"fields": {"summary": SUMMARY}})
    print('summary: HTTP %s %s' % (s1, r1 if s1 not in (200, 204) else ''))
    s2, r2 = jira('PUT', '/rest/api/2/issue/%s' % KEY, {"fields": {"description": BODY}})
    print('description: HTTP %s %s' % (s2, r2 if s2 not in (200, 204) else ''))
    print('words in description:', len(BODY.split()))
    print('\nhttps://shopview.atlassian.net/browse/%s' % KEY)


if __name__ == '__main__':
    main()
