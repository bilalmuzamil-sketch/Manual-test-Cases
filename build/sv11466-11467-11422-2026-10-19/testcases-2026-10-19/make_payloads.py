"""Two short manual cases (19 Oct 2026): SV-11467 count numbers on the pill, SV-11422 first Tab to an off-screen work order.
Written for a layman tester: no setup, existing staging data, one action per step. Run: python3 make_payloads.py"""
import json, html
D = '/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/testcases-2026-10-19/'
e = html.escape

def ul(items): return '<ul>' + ''.join(f'<li>{e(i)}</li>' for i in items) + '</ul>'
def ol(items): return '<ol>' + ''.join(f'<li>{e(i)}</li>' for i in items) + '</ol>'

SIGNIN = 'Sign in as an Owner/Admin user (on staging or a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView"). Browser zoom 100%.'
LOC = 'Location "Staging Heavy Duty - 9919" (shown in the top bar next to the bell). To change it: click your initials at the top right > Change Location.'

S2R19 = ('S2-R19: “Tech View’s Status column is the same status pill List shows in production, with the same red '
         'service-actions count and blue parts-actions count on it. Its size follows density (S6-R2a).”')
S6R2a = ('S6-R2a: “In Tech View the status pill is 16px tall at Compact and Regular and 22px tall at Comfortable, the design’s small and '
         'regular badges. List’s status pill is unchanged: for the same work orders on the same page, every List pill is the same width and '
         'height as in production, including production’s matching widths down the column (for example, Approved as wide as Ready For Review '
         'when both are on the page). Tech View’s pill takes the same widths as List’s; only its height follows density.”')
S11R1 = ('S11-R1: “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, '
         'when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s '
         'first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group '
         'is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work '
         'order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first '
         'card in view); the focused row or card shows a visible focus ring.”')

def expected(results, source, quotes, prov):
    return ('<p><strong>Expected results</strong></p>' + ul(results)
            + f'<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p>'
            + '<p><strong>Exact quote from the source</strong></p>' + ul(quotes)
            + f'<p>{e(prov)}</p><p>AUTOMATION: READY</p>')

A = {
 'title': 'Tech View count numbers sit on the status pill as in List, at every density',
 'template_id': 1, 'type_id': 7, 'priority_id': 2,
 'refs': 'SV-11467, SV-10045 (S2-R19 Tech View pill keeps List red and blue counts - spec v66)',
 'custom_automation_type': 0, 'custom_atmstatus': 3,
 'custom_preconds': '<p><strong>Preconditions</strong></p>' + ul([
    'Needs: 1 user · 1 browser · about 5 minutes · no setup',
    SIGNIN + ' Window about 1600 px wide.', LOC,
    'Work order S2-33351 has the status "Ready For Review" with a red number and a blue number on its status pill. '
    '(On another environment use any work order whose status pill shows both a red and a blue number.)']),
 'custom_steps': ol([
    'Open this link: https://app.staging.shopview.com/workorders?tab=all&search=S2-33351 (it opens Work Orders on the All tab with S2-33351 in the Search box).',
    'At the right of the bar above the list, click List (the left of the three view buttons). Look at the status pill of S2-33351 and where the red and blue numbers sit on it.',
    'Click Tech View (the middle view button, a person icon). If the "Unassigned" group is closed, click the small arrow to the left of "Unassigned" to open it.',
    'Click the density button (the icon just right of "Asset on Site") and choose Compact. Look at the pill of S2-33351.',
    'Click the density button and choose Regular. Look at the pill again.',
    'Click the density button and choose Comfortable. Look at the pill again.']),
 'custom_expected': expected([
    'Step 2: the pill reads "Ready For Review". The red 2 and the blue 3 sit on its top-right corner and only touch the top of the letters, so the word is easy to read.',
    'Steps 4, 5 and 6: at Compact, Regular and Comfortable the red and blue numbers sit on the pill exactly as in List at step 2: on the top-right corner, only touching the top of the letters. They never cover the word.',
    'The pill is lower at Compact and Regular than at Comfortable. That is correct.'],
    'Epic SV-10043; story SV-10045 (Story 2, Tech View); ticket SV-11467; PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 66, S2-R19 and S6-R2a, read 19 Oct 2026.',
    [S2R19, S6R2a],
    'This is the expected behaviour as per epic SV-10043, story SV-10045, ticket SV-11467 and the Work Orders — Board View & Tech View Display Options specification version 66 (S2-R19, S6-R2a). Last checked against build v26.40.19-c850386 on 10/19/2026.')}

B = {
 'title': 'First Tab goes to the work order even when it is far down or off to the side',
 'template_id': 1, 'type_id': 7, 'priority_id': 2,
 'refs': 'SV-11422, SV-10054 (S11-R1 first Tab lands on the first work order shown with a visible focus ring - spec v66)',
 'custom_automation_type': 0, 'custom_atmstatus': 3,
 'custom_preconds': '<p><strong>Preconditions</strong></p>' + ul([
    'Needs: 1 user · 1 browser · about 5 minutes · no setup',
    SIGNIN + ' Window about 1440 x 900 px (an ordinary laptop screen).', LOC,
    'Work order S2-16688 (status Paid) has Brandi Smith as its lead technician, and no other work order matches the search "S2-16688". '
    '(On another environment use any work order whose lead technician’s group is further down the page than the screen shows.)']),
 'custom_steps': ol([
    'Open this link: https://app.staging.shopview.com/workorders?tab=all&search=S2-16688 (it opens Work Orders on the All tab with S2-16688 in the Search box).',
    'At the right of the bar above the list, click Tech View (the middle of the three view buttons, a person icon).',
    'Make sure every group is open: point at the small arrow at the far left of the row of column names. If its tooltip says "Expand all", click it once.',
    'Look at the table without scrolling.',
    'Click once in the Search box, then press Tab until the keyboard focus moves into the table.',
    'Click Board View (the right-most view button).',
    'Click once in the Search box, then press Tab until a blue focus ring shows on the board.']),
 'custom_expected': expected([
    'Step 4: "Unassigned" shows 0 work orders ("No work orders"). S2-16688 is not on the screen: it is further down, under Brandi Smith.',
    'Step 5: the list moves down to Brandi Smith’s group and the S2-16688 row has the blue focus ring. The whole row and its ring can be seen; nothing covers them. The ring is not on the "Unassigned" heading.',
    'Step 7: the board scrolls sideways to Brandi Smith’s column and the S2-16688 card has the blue focus ring and is fully on the screen. The ring is not on the "Unassigned" column heading.'],
    'Epic SV-10043; story SV-10054 (Story 11, Keyboard access and focus); ticket SV-11422; PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 66, S11-R1, read 19 Oct 2026. Chris Ward in SV-11422 (16 Oct 2026): "The Tab stop must land on a work order row, never the Unassigned header while a row is shown."',
    [S11R1],
    'This is the expected behaviour as per epic SV-10043, story SV-10054, ticket SV-11422 and the Work Orders — Board View & Tech View Display Options specification version 66 (S11-R1). Last checked against build v26.40.19-c850386 on 10/19/2026.')}

for k, p in (('A-SV-11467', A), ('B-SV-11422', B)):
    assert len(p['title']) <= 80, p['title']
    assert all(len(x.strip()) <= 248 for x in p['refs'].split(',')), p['refs']
    json.dump(p, open(D + f'add_case_{k}.json', 'w'), ensure_ascii=False, indent=1)
    print(k, len(p['title']), 'ok')
