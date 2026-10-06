# Restores coverage of anchors the old cases cited and the first draft of the replacements dropped.
def apply(U, N):
    u = U[146323]
    u['steps'].insert(1, 'Leave the covered step empty on a second new service "PM-X" whose canned line is the same as one of PM-A\'s, and save it; check whether anything was ticked for you.')
    u['results'].insert(1, 'PM-X saves with nothing covered: covering is never filled in from shared lines or interval length; only what the shop picks is covered.')
    u['quotes'].insert(0, ['S2-R16', 'A service can name the other services on its schedule that it also covers, in a step before canned lines: a multi-select of the schedule\'s other services'])
    u['quotes'].insert(2, ['S2-E6', 'A service may cover nothing, and most will. Covering is never inferred from shared canned lines or from interval length; a shop states it'])

    u = U[146336]
    u['steps'].insert(0, 'Open the row menu of "Highway Tractor PM" and look for any Delete.')
    u['results'].insert(0, 'The row menu offers Edit, Duplicate and Archive; there is no Delete.')
    u['quotes'].insert(0, ['S6-R5', 'A schedule can be archived, never deleted'])

    u = U[146340]
    u['steps'].append('Read asset 402\'s Maintenance tab.')
    u['results'].append('Every service of "Highway Tractor PM" was added (none skipped), and PM-A appears on separate rows for "Yard PM" and "Highway Tractor PM": overlapping services on two schedules are allowed.')
    u['quotes'].append(['S7-E5', 'Enrolment applies the schedule as it stands. Nothing is skipped or negotiated'])
    u['quotes'].append(['S7-E4', 'An asset may be enrolled on more than one schedule. Overlapping services are allowed and produce separate rows'])

    u = U[146343]
    u['quotes'].insert(1, ['S7-R14', 'Enrolling an asset on a schedule and enrolling a customer in notifications are two separate acts'])

    u = U[146348]
    u['steps'].insert(3, 'Click + Add record for a certificate issued months ago by another shop: Term 12 months and type Start date 14 Oct 2025 by hand; read End date.')
    u['results'].insert(3, 'The Start date can be typed by hand; End date fills in as 14 Oct 2026.')
    u['quotes'].insert(3, ['S8-E1', 'A certificate arrives already months old, issued by another shop. The Start date is entered by hand'])

    u = U[146346]
    u['quotes'].append(['S8-N1', 'A record can exist with no schedule and no enrolment'])

    u = U[146358]
    u['quotes'].append(['S13-R11', 'The list will be server side paged and sorted'])

    u = U[146365]
    u['quotes'].insert(1, ['S13-R38', 'Create work order raises the work order at the location chosen in the header, as creating a work order does today'])

    u = U[146372]
    u['results'].append('Nothing on the card or the row shows whether the customer opened the email.')
    u['quotes'].append(['S14-E3', 'Read receipts are not tracked'])

    n = N[22]  # NEW-23 view-only permissions
    assert 'View-only' in n['title'], n['title']
    n['quotes'].insert(3, ['S7-R22', 'Changing it follows the permission to edit a customer'])

from p_common import ADVISOR, WORKLIST, HISTORY
TILESEED = ('Seed rows with day intervals and BLANK last service dates (a date typed at enrolment rests the row until its first reminder, so it would not be listed): '
            'a schedule "Tile check" with "D10" Every 10 days, "D20" Every 20 days, "D45" Every 45 days, "D80" Every 80 days and "NR" Every 30 days + Distance Every 15,000 mileage; '
            'enrol two test assets on it with blank dates (asset 2 must have no mileage reading so NR is a Needs readings row). '
            'For Overdue rows enrol a third asset on a schedule "Late check" with "L30" Every 30 days and last service date 100 days before today (it fell due 70 days ago and has missed several 30-day cycles; its reminder is reached, so it is listed).')
def mech_fix(cid, u):
    if cid == 146310:
        u['preconds'][-1] = 'An organization with no maintenance schedules at all (schedules are shared by the whole organization, so a new location does not give an empty list). If the environment has none, mark the case Blocked with that reason.'
        u['why'] += ' Precondition said a fresh location gives an empty list; schedules are now organization-wide (S1-R1).'
    if cid == 146359:
        u['preconds'] = [ADVISOR, WORKLIST, TILESEED]
        u['why'] += ' Seeding by backdated last service dates cannot produce listed rows in the 31-91 day window, because a date entered at enrolment rests the row (S13-R43, new); seeding now uses blank dates.'
    if cid == 146388:
        u['preconds'] = [u['preconds'][0], TILESEED + ' Add "D60" Every 60 days to "Late check" and leave its last service date blank at enrolment, so the third asset has one row Overdue (L30) and one row due in 60 days (Due in 3 months).',
                         'A two-workplace organization with assets whose last work order was at each workplace (for step 4).']
        u['why'] += ' Seeding made explicit so rows are listed despite the rest after an entered date (S13-R43, new).'
    if cid == 146364:
        u['preconds'].insert(2, HISTORY)
        u['why'] += ' Precondition now says how to find an asset with estimates (tech plan testability note B5).'
