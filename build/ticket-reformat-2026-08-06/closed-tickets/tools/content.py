"""The rewritten body of every CLOSED ticket, in the QA lead's five-part shape.

Shape, in order, and nothing else:
  1 Description        concise
  2 Steps to reproduce preceded by ONE Environment line
  3 Current behaviour  plain layman words
  4 Expected behaviour plain layman words
  5 a line break, then Source

Two deliberate departures, both flagged in DECISIONS.md rather than hidden:

  * SV-8902 is not a defect at all -- it is a disposable ZZAUTOTEST probe of Jira's own
    behaviour. Forcing "Steps to reproduce / Current behaviour / Expected behaviour" onto
    it would dress a probe up as a defect, which is the one thing the instruction forbids.
    It gets a short honest body and a Source line saying no requirement is behind it.
  * SV-8923 was withdrawn BY US as a false defect. It keeps the five parts, but the
    Description leads with the withdrawal so it cannot be read as a live defect, and
    Current behaviour records the CORRECT behaviour we observed on the re-check.

Every ticket here is closed. None of the bodies below asks anyone to fix anything, and
none of them changes a status -- only the description field is ever written.
"""

RS_ENV = ('Environment: QA branch sv8582 (https://sv8582.qa.shopview.com). '
          'Desktop browser, signed in as an Admin.')
FLT_ENV = ('Environment: QA branch sv8785 (https://sv8785.qa.shopview.com/workorders). '
           'Desktop browser, signed in as an Admin.')
SCH_ENV = ('Environment: QA branch sv8685 (https://sv8685.qa.shopview.com). '
           'Desktop browser, signed in as an Admin.')

PV = ('Parts Velocity report specification', 5,
      'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report')
FLT = ('Filters specification', 19,
       'https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters')
SCH = ('Schedule specification', 25,
       'https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule')

TICKETS = {

    # ------------------------------------------------------------------ SV-8819
    # Report Suite - Done / fixed. Kept as the record of what was fixed.
    'SV-8819': {
        'half': 'Report Suite',
        'description': [
            'On the Parts Velocity report the Turns / Yr figure came out slightly too high '
            'whenever the date range was set with the This Year shortcut, because the '
            'shortcut counted one day too few. Setting the very same period by picking the '
            'dates by hand gave the right answer, so the sum itself was correct — it was the '
            "shortcut's idea of how long the period is that was wrong.",
            'This ticket is closed as Done. It is kept as the record of what was fixed, so '
            'anyone re-checking the fix can follow the same steps.',
        ],
        'env': RS_ENV,
        'steps': [
            'Open Reports, then Parts Velocity.',
            'Set the date range with the This Year shortcut and press Apply.',
            'Open Column Selection and switch Turns / Yr on — it is hidden until you do.',
            'Search for the part BRAKECLEAN and write down its Units Sold, On Hand and '
            'Turns / Yr.',
            'Now set the same period by hand on the calendar — 1 January 2026 to 4 August '
            '2026 — press Apply, and look at the same part again.',
            'Compare the two Turns / Yr figures for that part.',
        ],
        'current': [
            'The two figures are different even though the period is identical. The shortcut '
            'gave 1.40648754422 and the hand-picked dates gave 1.39997602781, and the '
            'hand-picked one is the correct one: 1 January to 4 August, counting both the '
            'first and the last day, is 216 days, and the shortcut counted 215.',
            'Nothing on screen shows that anything is wrong, so two people looking at the '
            'same period — one using the shortcut, one picking the dates by hand — see '
            'different numbers with no way to tell which is right. The shorter the period, '
            'the bigger the difference.',
        ],
        'expected': [
            'Both the first and the last day of the chosen period are counted, so the '
            'shortcut gives exactly the same Turns / Yr figure as picking the same two dates '
            'by hand.',
        ],
        'source': [
            ('spec', PV, 'Story 5 (Metric Calculations), the definition of Window',
             'Window — the whole-day span of the selected range, inclusive of both the start '
             'and end dates, with a floor of 1 day (so a single-day range such as Today has '
             'Window = 1). This is the divisor used to annualize Turns / Yr.'),
            ('same', 'the Turns / Yr column in the same Story 5 table',
             '(Units Sold ÷ Window days × 365) ÷ On Hand; renders 0.00 when On Hand is 0.'),
        ],
    },

    # ------------------------------------------------------------------ SV-8821
    # Report Suite - OBSOLETE. No documented source, and that is said plainly.
    'SV-8821': {
        'half': 'Report Suite',
        'description': [
            'Creating an invoice from a completed work order works, provided the work order '
            'has a contact person on it. Where there is no contact, the product does not let '
            'you try: the Finance tab is greyed out and says why, so there is no button to '
            'press and nothing a person using the product can run into.',
            'This ticket is closed as OBSOLETE and is kept only as a record. It was '
            'originally raised the wrong way round — it said that pressing Create Invoice '
            'fails with a server error — and re-testing on the same branch showed that is not '
            'what happens.',
        ],
        'env': RS_ENV,
        'steps': [
            'Go to Work Orders and press Create Work Order.',
            'Choose Customer Aaborough Works and Asset the 2020 Ford Transit with serial '
            '86J8FAC1VALJ43SJY, then press Save.',
            'Add any job line to the work order and complete it.',
            'While the work order still has no contact person, look at the Finance tab. It is '
            'greyed out, and resting the pointer on it reads "Please select a contact for the '
            'asset". There is no Create Invoice button on screen.',
            'Set a contact on that asset, open the work order again and look at the Finance '
            'tab. It is now available, Create Invoice appears, and pressing it creates the '
            'invoice and moves the work order to Invoiced.',
        ],
        'current': [
            'On screen the product behaves correctly throughout: it stops you when there is '
            'no contact, tells you what is missing, and works as soon as the contact is set.',
            'What is left is behind the screens only. If the invoice request is sent straight '
            'to the back end for a work order with no contact — skipping the screen that '
            'would have stopped you — the answer is a general "something went wrong" server '
            'error rather than a clear message saying a contact is missing. Nobody can reach '
            'that by using the product.',
            'The pre-set job chosen for the work order makes no difference. Eleven different '
            'pre-set jobs, covering every way they can be priced, all behaved the same. The '
            'only thing that matters is whether a contact is set.',
            'The two pictures below show both halves: the greyed-out Finance tab while there '
            'is no contact, and the invoice created once a contact has been set.',
        ],
        'expected': [
            'A work order with no contact person cannot be invoiced, and the product says so '
            'on screen — which is what it does.',
            'Behind the screens, the same request would ideally come back with a clear '
            'message saying the contact is missing, rather than a general server error.',
        ],
        'source': [
            ('note', 'Source — none. No written requirement covers this, and that is said '
                     'plainly rather than dressed up: creating an invoice is not a reporting '
                     'feature, and none of the six report descriptions mentions it. The '
                     'expectation above is ordinary robustness, not a quoted requirement.'),
            ('note', 'This is one of the two tickets in the estate with no documented source. '
                     'It is recorded as such in our own notes, and it is closed.'),
        ],
    },

    # ------------------------------------------------------------------ SV-8822
    # Report Suite - OBSOLETE, withdrawn as API-only. No documented source.
    'SV-8822': {
        'half': 'Report Suite',
        'description': [
            'Saving a customer came back with a server error when the request carried a '
            "sales-representative id. The same save works normally when it carries the "
            'representative’s name instead — and the name is what the Edit Customer '
            'screen actually sends, so nobody using the product can run into this.',
            'This ticket was withdrawn because it can only be reached behind the screens, and '
            'it is closed as OBSOLETE. It is kept as a record of what was found.',
        ],
        'env': RS_ENV,
        'steps': [
            'Open Customers and pick Aaborough Works.',
            'Press Edit, choose a Sales Representative, and press Save. The save works '
            'normally.',
            'There are no steps that produce the failure. The Edit Customer screen always '
            'sends the representative’s name, and the name version saves correctly, so '
            'the failing shape cannot be produced from any screen in the product.',
        ],
        'current': [
            'Sent behind the screens with a representative id, the save comes back as a '
            'server error and nothing is saved. Sent with the representative’s name — '
            'which is what the screen sends — it saves normally.',
            'What it shows is that the save does not defend itself: an unexpected field '
            'produces a server error rather than a clear "that field is not valid" message. '
            'It also briefly misled our own testing into thinking customer assignments could '
            'not be created at all, when in fact they can.',
            'One thing worth knowing came out of it, and it is a design fact rather than a '
            'fault: a customer’s sales representative is stored as a first name and a '
            'last name, not as a link to a staff record. Anything that later needs to know '
            'whether that representative is still on the staff has to match on the name.',
        ],
        'expected': [
            'An unrecognised or unsupported field is answered with a clear message explaining '
            'what is wrong, rather than a general server error.',
        ],
        'source': [
            ('note', 'Source — none. No written requirement covers this, and that is stated '
                     'plainly: saving a customer is not a reporting feature and none of the '
                     'six report descriptions mentions it. The expectation above is ordinary '
                     'robustness, not a quoted requirement, and if the team’s view is '
                     'that it does not matter, that is a reasonable answer — which is why the '
                     'ticket is closed.'),
        ],
    },

    # ------------------------------------------------------------------ SV-8843
    # Filters - OBSOLETE. Our records say the first half still reproduces; its own
    # stated reason is wrong. Position stated neutrally; status untouched.
    'SV-8843': {
        'half': 'Filters',
        'description': [
            'On a desktop screen the five filter buttons sit on the same row as the tabs, '
            'instead of on their own row directly below them.',
            'This ticket is closed as OBSOLETE and is kept as a record. One correction '
            'belongs with it: the second half of the original claim was wrong. It said that '
            'collapsing the filter bar frees no space, and collapsing it does free space.',
        ],
        'env': FLT_ENV,
        'steps': [
            'Open Work Orders on a desktop browser in a window about 1680 by 1050, on the '
            'All tab.',
            'Look at where the five filter buttons — Status, Customer, Lead Technician, '
            'Service Advisor, Asset on Site — sit in relation to the tab row (All, Estimates, '
            'Completed, My Work Orders).',
            'Click the filter icon to the left of the Status button to collapse the filter '
            'bar.',
            'Watch whether the table moves up into the space the buttons were using.',
        ],
        'current': [
            'The five filter buttons sit on the same row as the tabs, to the right of My Work '
            'Orders, rather than on their own row below them. A later live check found this '
            'still happening: the tabs and the filter bar were measured side by side in one '
            'row.',
            'The other half of the original claim does not hold. Collapsing the bar hides all '
            'five buttons and the table does move up into the space they were using, so that '
            'part of the product is behaving as it should.',
            'The ticket is closed and has not been reopened. Whether the remaining half is '
            'worth reopening is the QA lead’s decision, not ours.',
        ],
        'expected': [
            'The five filter buttons sit on their own row directly below the tab row, and '
            'collapsing the bar frees the space it was using so the table moves up.',
        ],
        'source': [
            ('spec', FLT, 'requirement S1-R1',
             'The filter bar is displayed below the tab navigation row (All, Estimates, '
             'Completed, My Work Orders) by default'),
            ('same', 'requirement S1-R5',
             'When the user collapses the filter bar, the bar is hidden and the table expands '
             'to use the reclaimed vertical space'),
            ('note', 'The first requirement is the half that still happens. The second is the '
                     'half the original ticket got wrong.'),
        ],
    },

    # ------------------------------------------------------------------ SV-8844
    # Filters - OBSOLETE, the fault it reported is fixed. Two media nodes preserved.
    'SV-8844': {
        'half': 'Filters',
        'description': [
            'Typing into the page Search on the Work Orders screen did not narrow the list — '
            'the search had no effect on what was shown.',
            'This ticket is closed as OBSOLETE because the fault it reported has since been '
            'fixed. It is kept as a record.',
        ],
        'env': FLT_ENV,
        'steps': [
            'Open Work Orders on a desktop browser, All tab, with no filters on and nothing '
            'typed in the page Search.',
            'Click the Search button in the page toolbar, to the left of the columns icon.',
            'Type: Lastone',
            'Watch the list of work orders underneath.',
        ],
        'current': [
            'At the time this was raised the list did not change at all. Typing Lastone left '
            'every work order on the page, so there was no way to narrow the list from the '
            'page search.',
            'The picture and the short screen recording below were both taken at the time and '
            'show what was happening. A second picture, image-20260805-074204.png, is '
            'attached to the ticket as well.',
            'This has since been fixed and the ticket is closed.',
        ],
        'expected': [
            'The list narrows as you type, without pressing a button and without a separate '
            'results screen — the same table simply shows fewer rows.',
        ],
        'source': [
            ('spec', FLT, 'requirement S13-R7',
             'The query applies as the user types, debounced at 300ms. There is no apply or '
             'submit button and Enter is not required.'),
            ('same', 'requirement S13-R12',
             'Results replace the table contents in place. There is no separate results view '
             'or results page'),
        ],
    },

    # ------------------------------------------------------------------ SV-8847
    # Filters - OBSOLETE. Records say it still reproduces except one half.
    'SV-8847': {
        'half': 'Filters',
        'description': [
            'When only a page search is active and nothing matches it, the empty screen says '
            'no work orders match your filters and offers a Clear Filters link. No filter is '
            'on, so that link does nothing useful and there is no way to clear the search '
            'from the empty screen.',
            'This ticket is closed as OBSOLETE and is kept as a record.',
        ],
        'env': FLT_ENV,
        'steps': [
            'Open Work Orders on a desktop browser, All tab, and use Clear Filters first so '
            'that no filter is on.',
            'Click the Search button in the page toolbar and type text that matches nothing, '
            'for example: ZZQQNOMATCHXX',
            'Read the message in the empty table area and look at the link underneath it.',
        ],
        'current': [
            'The message reads "No work orders match your filters" even though no filter is '
            'on, and the only link offered is Clear Filters. Clicking it changes nothing, '
            'because there are no filters to clear: the search text stays and the screen '
            'stays empty. Nothing on the empty screen clears the search.',
            'A later live check found this still happening. One part of the original report '
            'does now behave correctly: clearing filters no longer clears the search text.',
            'A screen recording taken at the time is attached. The ticket is closed and has '
            'not been reopened — that is the QA lead’s decision, not ours.',
        ],
        'expected': [
            'The empty screen tells the user that nothing matched their search and offers a '
            'way to clear the search. Where both a search and filters are on, it offers each '
            'of them separately, so clearing one does not clear the other.',
        ],
        'source': [
            ('spec', FLT, 'requirement S8-R3',
             'When the combination of active filters and any active search query produces no '
             'matching records, the table shows an empty state with a message indicating no '
             'results were found for the current filters and search'),
            ('same', 'requirement S8-R4',
             'The empty state includes a prompt or link to clear filters and, where a search '
             'query is active, to clear the query'),
            ('same', 'requirement S8-R5',
             'Where both a query and filters are active, each is cleared independently from '
             'the empty state. Clearing filters does not clear the query and clearing the '
             'query does not clear the filters, consistent with S13-R13'),
        ],
    },

    # ------------------------------------------------------------------ SV-8902
    # NOT a defect. Deliberately NOT forced into the five-part shape - see DECISIONS.md.
    'SV-8902': {
        'half': 'Schedule',
        'shape': 'probe',
        'body': [
            'ZZAUTOTEST — a disposable probe, not a defect report.',
            'This ticket was created on 6 August 2026 for one purpose: to find out whether '
            'Jira allows a ticket of this kind to be given a Story as its parent. It does. '
            'Creating it this way succeeded, while the identical request naming the epic as '
            'the parent was refused. That answer is now part of how we file defect tickets.',
            'It describes no fault in the product, and nobody is being asked to look at it. '
            'It was closed as OBSOLETE the same day it was made. It could not be deleted '
            'because our account is not allowed to delete Jira issues, so it stays on the '
            'record as a closed probe.',
        ],
        'source': [
            ('note', 'Source — none, and none is claimed. This is a probe of how Jira itself '
                     'behaves, not a defect, so no product requirement stands behind it.'),
        ],
    },

    # ------------------------------------------------------------------ SV-8923
    # Withdrawn BY US as a false defect. Description leads with the withdrawal.
    'SV-8923': {
        'half': 'Schedule',
        'description': [
            'Withdrawn — this was not a real fault, and it should stay closed.',
            'It reported that the Business Hours switch on the Schedule shaded nothing. The '
            'first check was made against a shop that had no working hours set, which is the '
            'one condition the check needed: with no working hours there is nothing to shade. '
            'We re-checked it ourselves against a shop that does have working hours set, and '
            'the switch behaves correctly.',
            'It is closed as OBSOLETE. It was kept rather than deleted because the reasoning '
            'is worth having on the record.',
        ],
        'env': SCH_ENV,
        'steps': [
            'Sign in as an Administrator and pick the location Staging Heavy Duty - 9919.',
            'Open that location for editing and check that "Set business hours for this shop" '
            'is switched on, with Monday to Friday reading 06:00 to 18:00 and no Saturday or '
            'Sunday rows. This is the condition the original report was missing.',
            'Open Schedule from the top navigation, choose Day view, and go to Thursday, '
            '6 August 2026.',
            'Open the FILTER & DISPLAY dropdown and find the Business Hours switch.',
            'Turn it on and look along the timeline from 12 AM through to 11 PM, then turn it '
            'off and look again.',
        ],
        'current': [
            'With the switch on, midnight to six in the morning and six in the evening to the '
            'end of the day are shaded grey, and the working day between six and six is left '
            'clear. Turning the switch off removes the shading, and turning it back on brings '
            'it back. That is correct behaviour.',
            'The original report was made on a shop with no working hours set. In that state '
            'there is no working day to draw a boundary around, so nothing is shaded — which '
            'is why the switch looked broken.',
        ],
        'expected': [
            'With the switch on, the hours outside the working day are covered by a grey '
            'overlay and the working hours are left clear. Turning the switch off removes the '
            'shading.',
        ],
        'source': [
            ('spec', SCH, 'section 4.8 (Day view: timeline interactions)',
             'Business-hours shading. An optional grey overlay outside working hours.'),
            ('same', 'section 9 (View options and customization), the View Options table',
             'Business Hours … Off … Shades non-working hours in day view.'),
            ('note', 'The earlier version of this ticket quoted a sentence that does not '
                     'appear in the specification. The two quotations above were read from '
                     'the live page and are what it actually says.'),
        ],
    },
}
