# Shared helpers for the Chunk 1 proposals (2026-10-06)
STORY = {
 'S1': ('SV-10558', 'S1, Create a maintenance schedule'),
 'S2': ('SV-10559', 'S2, Add a routine service to a schedule'),
 'S3': ('SV-10560', 'S3, Add a compliance inspection service'),
 'S4': ('SV-10561', 'S4, Attach canned lines to a service'),
 'S5': ('SV-10562', 'S5, Reminder timing'),
 'S6': ('SV-10563', 'S6, Edit and archive a schedule'),
 'S7': ('SV-10564', 'S7, Enrol an asset onto a schedule'),
 'S8': ('SV-10565', 'S8, Compliance inspection records on the asset'),
 'S9': ('SV-10566', 'S9, The asset Maintenance tab'),
 'S13': ('SV-10570', 'S13, The maintenance reminders worklist'),
 'S14': ('SV-10571', 'S14, Contact the customer from a row'),
 'S21': ('SV-10576', 'S21, The audit trail'),
}
P1 = 'Plan 1 — Track, act, clear — Technical Implementation Plan'
P2 = 'Plan 2 — The work order and the customer — Technical Implementation Plan'
MAIN = 'Maintenance Reminders V1 (Confluence 833290250) as edited 5 October 2026'
DES = 'Design board "Chunk 1.dc.html" (MR V2 Claude Design project, version of 6 October 2026)'

def src(story, section=None, plan1=None, plan2=None, main=None, design=None):
    key, name = STORY[story]
    s = f'Epic SV-3780, story {key} ({name}), Chunk 1 MR (Confluence 886931488) as edited 5 October 2026, {section or story}'
    if main: s += f'; {MAIN}, {main}'
    if plan1: s += f'; {P1}, {plan1}'
    if plan2: s += f'; {P2}, {plan2}'
    if design: s += f'; {DES}, {design}'
    return s + '; read 6 Oct 2026.'

ADMIN = 'You are signed in, on the build under test, as an Owner/Admin or as a user with "Settings Service" enabled.'
NAV = 'In the left sidebar under Settings, open the "Maintenance" entry beneath "Inspection Templates" (if the build labels it "Maintenance schedules", use that entry; the label is an open question). Schedules are shared by the whole organization, whichever location is chosen in the header.'
SEED = ['Seed a maintenance schedule (standard steps):',
        '↳ In Settings > Maintenance click New schedule; the "Untitled schedule" editor opens.',
        '↳ Inline-edit the title to a test name (e.g. "Highway Tractor PM").',
        '↳ Click Add service, give it a name (e.g. "PM-A") and a calendar interval (e.g. Every 3 months), and save the service.',
        '↳ Click Save on the schedule.']
ADVISOR = 'You are signed in, on the build under test, as a service advisor with the view customers and create and edit customers permissions.'
ENROL = ['Enrol an asset (standard steps):',
         '↳ Open Customers, open a test customer (e.g. "Aacrest Works"), open its Assets tab and open an asset (e.g. unit 402 · 2019 Freightliner Cascadia).',
         '↳ Open the asset\'s Maintenance tab (the last tab, after Notes) and click Enroll in Schedule.',
         '↳ Pick the schedule (e.g. "Highway Tractor PM"), leave the last service dates blank unless the case says otherwise, and click Enroll.']
WORKLIST = 'Open Customers from the top navigation and switch to its "Maintenance reminders" tab.'
TWO_WP = 'Your organization has two workplaces (locations), e.g. "Calgary South" and "Red Deer", and your user can open both; you switch between them with the location control in the header.'
HISTORY = ('Readings come only from the asset\'s past work orders (loaded once on the test environment) and from new entries dated today; a dated reading history cannot be typed in by hand. '
           'Pick an asset whose Work Orders tab lists past work orders carrying a Mileage value, and note each work order\'s date and mileage. If no such asset exists on the environment, mark the case Blocked with that reason.')
