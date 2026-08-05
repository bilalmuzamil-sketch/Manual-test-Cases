# -*- coding: utf-8 -*-
import json
PROV_HEAD='\n\n---\n'
NEW=[]

# ---------------- 1. SCH-NAV-08 ----------------
NEW.append(dict(
  internal_id='SCH-NAV-08', section_id=4255, priority_id=4, type_id=6,
  title='Schedule opens on Day view the first time you open it from the navigation',
  refs='SV-8863 (SV-8686 acceptance criterion - grid displays with day view as default)',
  preconds=(
    '1. You are signed in to the ShopView App on a desktop browser (window at least 960px wide).\n'
    '2. Your role has the Schedule: View permission.\n'
    '3. You are NOT already on the Schedule page - start from another page, for example Work Orders, '
    'so that opening Schedule is a fresh arrival.'),
  steps=(
    '1. In the top navigation, click Schedule.\n'
    '2. Without clicking anything else, look at the Day / Week / Month buttons at the top right of the grid.\n'
    '3. Look at the grid itself.'),
  expected=(
    '1. The Schedule page opens.\n'
    '2. Of the three buttons Day, Week and Month, the one that is switched on (highlighted) is Day.\n'
    '3. The grid shows the Day layout: a 24-hour timeline for each technician row, with shifts placed at their times.\n'
    '\n'
    'Known issue on the build checked: the Schedule opens on Week view instead - Week is the highlighted '
    'button and the grid draws the 7-column week layout. This is already raised with the developers as '
    'SV-8863 (https://shopview.atlassian.net/browse/SV-8863) and has been accepted for fixing. Until it '
    'is fixed this test will fail - mark it FAILED and link SV-8863; do not raise a new ticket.'),
  prov=(
    'This is the expected behaviour as per epic SV-8685 and the acceptance criterion of its story '
    'SV-8686, which states that when the schedule page loads the grid displays with day view as '
    'default. The Schedule specification version 23 does not say which view the page opens on, so this '
    'expectation comes from the story rather than the specification. '
    'Last checked against build v3.5-d122eef on 8/5/2026.'),
  marker='AUTOMATION: READY - EXPECT FAIL (SV-8863)',
  verdict='DEVIATION (ticketed, SV-8863)'))

# ---------------- 2. SCH-DND-09 ----------------
NEW.append(dict(
  internal_id='SCH-DND-09', section_id=4260, priority_id=3, type_id=6,
  title='Month view: dragging a work order onto a day creates a shift for that day',
  refs='SV-8870 (§4.1 drag-and-drop scheduling + §4.2 start-time hierarchy)',
  preconds=(
    '1. You are signed in to the ShopView App on a desktop browser (window at least 960px wide).\n'
    '2. Your role has the Schedule: Edit permission.\n'
    '3. You are on the Schedule page with Month switched on.\n'
    '4. Use the right arrow next to the Today button to move to a month with nothing scheduled in it - '
    'on the test shop, November 2026 is empty. The grid then shows the line "Nothing is scheduled in '
    'this range. Drag a work order from the list to book it."\n'
    '5. A work order with approved lines is visible in the sidebar list. Use work order S-12876 '
    '(customer Pamill Paving, unit 713, 2 lines, 1h Est.).'),
  steps=(
    '1. Press and hold the mouse on the S-12876 card in the sidebar list.\n'
    '2. Drag it over any day box in the month grid - for example 10 November 2026 - and watch that day box.\n'
    '3. Release the mouse on that day box.\n'
    '4. Look at the day box you dropped on.'),
  expected=(
    '1. While the card is held over a day box, that day box shows it is a drop target.\n'
    '2. Releasing on the day box books the work order onto that day, exactly as dropping it does in '
    'Week view: because this work order has more than one line, the scope picker opens so you can '
    'choose the whole order, one line, or several lines.\n'
    '3. After you confirm a scope, a shift appears in that day box, and its start time comes from the '
    'usual order of preference - the technician\'s own working hours first, otherwise the shop\'s '
    'business hours, otherwise 7:00 AM.\n'
    '\n'
    'Please read before running this test: what should happen in MONTH view specifically has not been '
    'settled yet. The Schedule specification version 23 says that a work order is dragged from the '
    'sidebar onto a cell in the grid without naming which view, and the acceptance criterion of story '
    'SV-8688 names only Week view. The question has been put to the product owner on '
    'SV-8870 (https://shopview.atlassian.net/browse/SV-8870), together with the point that Month view '
    'invites the user to drag ("Nothing is scheduled in this range. Drag a work order from the list to '
    'book it."). Until the product owner answers, treat a failure here as already reported under '
    'SV-8870 - mark it FAILED and link SV-8870; do not raise a new ticket.\n'
    '\n'
    'What was seen on the build checked: the card lifts and follows the mouse, but no day box shows as '
    'a drop target and releasing does nothing at all - no scope picker, no shift, no message. The same '
    'drag of the same work order in Week view does open the scope picker, so the difference is Month '
    'view itself.'),
  prov=(
    'This is the expected behaviour as per epic SV-8685 and the Schedule specification version 23 '
    '(§4.1, §4.2), which describe dragging a work order from the sidebar onto a cell in the grid and '
    'the order of preference for the start time. Neither that specification nor story SV-8688 says '
    'whether Month view accepts the drop, so that point is an open product-owner question rather than '
    'a settled requirement. '
    'Last checked against build v3.5-d122eef on 8/5/2026.'),
  marker="AUTOMATION: HOLD - waiting on the product owner's answer on SV-8870 about whether Month view accepts the drag",
  verdict='WAITING ON THE PRODUCT OWNER (SV-8870)'))

# ---------------- 3. SCH-REAS-07 ----------------
NEW.append(dict(
  internal_id='SCH-REAS-07', section_id=4275, priority_id=3, type_id=6,
  title='Week view: a shift that is part of a repeating series can be reassigned',
  refs='SV-8867 (§7 shift reassignment + §12 series is a grouping over ordinary shifts)',
  preconds=(
    '1. You are signed in to the ShopView App on a desktop browser (window at least 960px wide).\n'
    '2. Your role has the Schedule: Edit permission.\n'
    '3. You are on the Schedule page with Week switched on.\n'
    '4. A repeating series of shifts exists on the week you are looking at. On the test shop, work '
    'order S-9379 (customer Xiriver Apparel, unit 16604, 11 Lines) has a series sitting on technician '
    'Jose Young; its blocks are labelled "Part of a series" or "Week 1 of 2". If none exists, make one '
    'first: drag a work order with several lines onto a technician, choose Schedule whole work order, '
    'and let it spread over several days.\n'
    '5. A second technician has a row on the same screen - use MQ Test Tech Qamar.'),
  steps=(
    '1. Find one block of the series in the week grid (it is labelled "Part of a series" or "Week 1 of 2").\n'
    '2. Press and hold the mouse on that block.\n'
    '3. Drag it up or down onto the other technician\'s row and release the mouse.\n'
    '4. Look at what appears, and then at which technician\'s row the block is in.'),
  expected=(
    '1. The block lifts and follows the mouse as you drag it.\n'
    '2. When you release it on the other technician\'s row, a small window asks you to confirm the '
    'move to that technician - the same confirmation you get when you move an ordinary shift.\n'
    '3. After you confirm, the block sits in the new technician\'s row, that technician is added to the '
    'work order line\'s technician list, and the previous one is taken off it.\n'
    '\n'
    'Known issue on the build checked: the block does lift and move while you drag it, but on release '
    'it jumps straight back to the technician it started on - no confirmation window and no toast. An '
    'ordinary shift that is not part of a series, dragged between the same two technician rows, does '
    'ask for confirmation ("Move this shift to MQ Test Tech Qamar?"), so the problem is specific to '
    'series blocks. This is already raised with the developers as '
    'SV-8867 (https://shopview.atlassian.net/browse/SV-8867). Until it is fixed this test will fail - '
    'mark it FAILED and link SV-8867; do not raise a new ticket.\n'
    '\n'
    'Why this test covers Week view only: the specification describes reassignment as dragging a shift '
    'from one technician row to another, and Month view has no technician rows at all - it is a '
    'calendar of day boxes. Whether reassignment should be possible in Month view is therefore part of '
    'the open question on SV-8867 and is deliberately not asserted here.'),
  prov=(
    'This is the expected behaviour as per epic SV-8685 and the Schedule specification version 23 '
    '(§7, §12): dragging a shift block from one technician row to another reassigns it and a '
    'confirmation handles cross-technician moves, and a series is a grouping over ordinary daily '
    'shifts rather than a different kind of thing, so an ordinary shift\'s behaviour applies to a '
    'series member too. Story SV-8692 covers series-aware deletion only and says nothing about '
    'reassignment. '
    'Last checked against build v3.5-d122eef on 8/5/2026.'),
  marker='AUTOMATION: READY - EXPECT FAIL (SV-8867)',
  verdict='DEVIATION (ticketed, SV-8867)'))

for c in NEW:
    c['expected_full']=c['expected']+PROV_HEAD+c['prov']+'\n\n'+c['marker']+'\n'
    assert len(c['title'])<=80, (c['internal_id'],len(c['title']))
    for part in ('preconds','steps','expected_full'):
        t=c[part]
        for bad in ('API','HTTP','endpoint','200','201','403','PATCH','POST','GET '):
            assert bad not in t, (c['internal_id'],part,bad)
    assert 'VIU' not in c['expected_full']
    for bad in ('as per the build','verified against','tested on','as the build behaves'):
        assert bad.lower() not in c['expected_full'].lower(), (c['internal_id'],bad)
    for e in c['refs'].split(','):
        assert len(e)<=248, (c['internal_id'],len(e))
json.dump(NEW,open('new-cases.json','w'),indent=1)
for c in NEW:
    print('='*70); print(c['internal_id'],'| title len',len(c['title']),'|',c['title'])
    print('section',c['section_id'],'| refs:',c['refs'])
    print('--- EXPECTED (full) ---'); print(c['expected_full'])
