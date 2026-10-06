# Coordinator decisions of 6 Oct 2026 (second pass): hand-seeded reading histories (S18-R19 route),
# mail to the tester's own inbox, Feature flags page wording. Applied after p_patch.
from p_common import *

SEEDWHY = ' Reading history is now seeded by hand: Mark complete On a work order records that work order\'s mileage and engine hours as readings dated the Reset date (S18-R19), with worked values that produce exactly what the case checks.'
HTPM = 'enrol it on any schedule with a mileage-driven service (e.g. "Highway Tractor PM" with PM-A: calendar Every 12 months + Distance Every 15,000 mileage), dates blank, so its Maintenance tab shows the reading cards'

def multi_seed(units, extra_then):
    """units: list of (label, [(days, mileage, hours|None), ...]). One throwaway schedule serves all units."""
    n = max(len(r) for _, r in units)
    base = seed('each unit', units[0][1])[:3]
    base[0] = 'Seed each unit\'s reading history by hand (standard steps; Mark complete on a work order records that work order\'s mileage and engine hours as readings dated its Reset date):'
    base[1] = ('↳ In Settings > Maintenance (needs Settings Service) create, once, a throwaway schedule "ZZAUTOTEST Reading seed" with one routine service per reading: '
               + ', '.join(f'"ZZ Seed {i}"' for i in range(1, n + 1)) + ' (calendar Every 12 months each). Enrol each test unit on it in turn (its Maintenance tab > Enroll in Schedule, dates blank).')
    for label, rd in units:
        parts = []
        for i, (d, m, h) in enumerate(rd, 1):
            t = f'ZZ Seed {i} {d} days before today, Mileage {fmt(m)}'
            if h is not None: t += f', Engine Hours {fmt(h)}'
            parts.append(t)
        base.append(f'↳ Unit {label}: ' + '; '.join(parts) + '.')
    base.append(f'↳ After each unit is seeded, remove it from the throwaway schedule (Maintenance tab > schedule menu > Remove from schedule), then {extra_then}.')
    return base

def ladder(n, last, step_days=30, start=100000, step=3000):
    return [(last + step_days * (n - 1 - i), start + step * i, None) for i in range(n)]

def apply(U, N):
    # ---- C146352: recorded vs estimate, Low not red ----
    u = U[146352]
    from p_upd1 import FLAGWHY
    u['why'] = 'The reading cards need a dated reading history, which the old precondition could not produce by hand.' + SEEDWHY + ' ' + FLAGWHY
    u['preconds'] = [ADVISOR, *seed('a test unit (e.g. unit 402)', [(120, 100000, None), (60, 104000, None)], HTPM)]
    u['results'] = ['The tab opens with the two reading cards: mileage says it is recorded (104,000, recorded 60 days ago) and shows an estimate beside it; engine hours has no reading yet.',
                    'The recorded 104,000 shows exactly, with no qualifier; the estimate carries a badge (e.g. "Estimated") and its basis (e.g. "measured from 2 visits").',
                    'The mileage confidence reads Low (one usable pair, last reading 60 days old) and its meter is not red.']
    u['quotes'] = [['S9-R1', 'The tab will open with current readings: distance and engine hours, each showing whether it is recorded or estimated, with its age'],
                   ['S9-R2', 'A recorded reading will show the exact value with no qualifier. An estimate will carry a badge and its basis'],
                   ['S11-R24', '31 to 90 days: one pair Low'],
                   ['S9-R17', 'The confidence meter\'s Low state is never red. Red is reserved for overdue']]
    u['source'] = src('S9', 'S9 (The two reading cards; S9-R1, S9-R2, S9-R17; S11-R24 copied from Chunk 2)')

    # ---- C146355: Other triggers ----
    u = U[146355]
    u['why'] += SEEDWHY
    u['preconds'] = [ADVISOR, *seed('asset A (e.g. unit 402)', [(90, 100000, 5000), (60, 103000, 5150), (30, 106000, 5300)],
                                    'enrol it on a schedule with PM-C (calendar Every 12 months + Distance Every 60,000 mileage + Engine hours Every 1,000 hours), dates blank'),
                     'Asset B: a new test unit created with Mileage left empty (Customers > the customer > Assets > New Asset), enrolled with blank dates on a schedule with "TIRES" (calendar Every 6 months + Distance Every 90,000 mileage).']
    u['steps'] = ['On asset A read PM-C\'s Due cell: how many dates and which trigger.',
                  'Open PM-C\'s row menu > Other triggers and read the list.',
                  'On asset B read the TIRES row.']

    # ---- C146357: estimated month, overdue estimate, certificate, calendar ----
    u = U[146357]
    u['why'] = u['why'].replace(' Precondition now says how to find an asset with estimates (testability note B5).', '') + SEEDWHY
    u['preconds'] = [ADVISOR, *seed('unit 402', [(200, 100000, None), (20, 130000, None)],
                                    'enrol it on a schedule "Due check" with PM-A (calendar Every 12 months + Distance Every 15,000 mileage) and PM-B (calendar Every 12 months + Distance Every 60,000 mileage), both with last service date 200 days before today, CVIP (compliance, Term 12 months) and "Lube" (calendar Every 60 days, date blank)'),
                     'On the asset card Compliance section click + Add record for CVIP: Term 12 months, End date = 30 days after today; Save.',
                     'Worked values: the rate is 30,000 mileage over 180 days, about 167 a day; PM-A came due at 115,000 (about 110 days ago); PM-B comes due at 160,000 (30,000 after the last reading, about 180 days after it, so about 160 days ahead, before its calendar date 165 days ahead).']
    u['steps'] = ['Read PM-B\'s Due cell: the date and what sits beneath it; hover the confidence meter.',
                  'Read PM-A\'s Due cell and badge.',
                  'Read the CVIP and Lube Due cells.',
                  'Click Enter mileage, save 140,000, and read PM-B\'s Due cell again.']
    u['results'] = ['PM-B shows a month about 160 days ahead, with the confidence meter and "Medium confidence" beneath (one pair, last reading 20 days old); the meter\'s hover gives the rule (e.g. "based on mileage estimate").',
                    'PM-A reads Overdue with its estimated month (about 110 days ago) and carries no figure, never "overdue by … mileage".',
                    'CVIP reads its End date and "Certificate" (e.g. "5 Nov 2026 · Certificate"); Lube reads its month and "Calendar".',
                    'PM-B\'s date is worked out again at once from the new reading and moves earlier.']
    u['quotes'] = [['S11-R9', 'Every estimated due date shows a month, at every confidence, with its confidence beneath it as the meter and a word: High, Medium or Low confidence. The rule that produced it, for example based on mileage estimate, sits in the meter\'s hover'],
                   ['S11-R24', 'Up to 30 days: one pair Medium'],
                   ['S11-R13', 'An overdue row derived from a meter estimate shows its estimated month and carries no figure at any confidence: never overdue by 1,200 mileage'],
                   ['S11-R13', 'A date from a certificate reads its End date and Certificate, for example 14 Oct 2026 · Certificate, because the certificate names the day. A date from the calendar reads its month and Calendar'],
                   ['S9-E2', 'Entering a reading here recalculates every dependent service immediately']]
    u['source'] = src('S9', 'S9 (Confidence, as the cards show it; S11-R9, S11-R13, S11-R24 copied from Chunk 2; S9-E2)')

    # ---- C146385: confidence table ----
    u = U[146385]
    u['why'] = u['why'].replace(' Testability: reading histories cannot be typed in by hand (testability note B5), so the case reads assets that already have them.', '') + SEEDWHY
    units = [('(a)', ladder(2, 10)), ('(b)', ladder(3, 20)), ('(c)', ladder(2, 60)), ('(d)', ladder(4, 60)), ('(e)', ladder(5, 60)),
             ('(f)', ladder(2, 120)), ('(g)', ladder(3, 120)), ('(h)', ladder(4, 200)), ('(i)', ladder(5, 200)), ('(j)', ladder(2, 400))]
    u['preconds'] = [ADVISOR, 'These are number and date accuracy cases: enter the exact inputs, read the value the screen shows, and compare it with the value worked out below.',
                     'Ten test units, (a) to (j). Readings are 30 days apart and rise by 3,000 (100 a day), so every pair is usable; N visits make N − 1 usable pairs.',
                     *multi_seed(units, HTPM)]
    u['steps'] = ['For each unit open its Maintenance tab and read the mileage card: the last recorded date, "Measured from N visits" and the confidence word.',
                  'Compare each word with the expected grade below.']
    u['results'] = ['Up to 30 days: (a) 2 visits, 1 pair, last 10 days ago -> Medium; (b) 3 visits, 2 pairs, last 20 days ago -> High.',
                    '31 to 90 days: (c) 1 pair, 60 days -> Low; (d) 4 visits, 3 pairs, 60 days -> Medium; (e) 5 visits, 4 pairs, 60 days -> High.',
                    '91 to 180 days: (f) 1 pair, 120 days -> Low; (g) 2 pairs, 120 days -> Medium.',
                    '181 to 365 days: (h) 3 pairs, 200 days -> Low; (i) 4 pairs, 200 days -> Medium.',
                    'Over 365 days: (j) 1 pair, 400 days -> Low.']
    u['source'] = src('S9', 'S9 (Confidence, as the cards show it: S11-R22 to S11-R24 and the confidence table, copied from Chunk 2)')

    # ---- C146386: worked examples ----
    u = U[146386]
    u['why'] = u['why'] + SEEDWHY
    units = [('(a)', [(31, 100000, None), (1, 103000, None)]),
             ('(b)', ladder(6, 120)),
             ('(d)', [(455, 100000, None), (425, 103000, None)]),
             ('(e)', [(790, 100000, None), (760, 103000, None)]),
             ('(f)', [(130, 100000, 5000), (100, 103000, 5150), (70, 106000, None), (40, 109000, None), (10, 112000, None)]),
             ('(g)', [(60, 100000, None), (57, 100300, None), (30, 103000, None)])]
    u['preconds'] = [ADVISOR, 'These are number and date accuracy cases: enter the exact inputs, read the value the screen shows, and compare it with the value worked out below.',
                     'Six test units, (a), (b), (d), (e), (f) and (g).',
                     *multi_seed(units, 'enrol it on a schedule with "Oil" (calendar Every 6 months + Distance Every 15,000 mileage), dates blank')]
    u['steps'] = ['For (a), (b) and (d) read the mileage card\'s confidence word.',
                  'For (e) read the mileage card and Oil\'s Due cell.',
                  'For (f) read the mileage card and the engine-hours card.',
                  'For (g) read "Measured from N visits" on the mileage card.']
    u['results'] = ['(a) Medium (one pair, last reading yesterday); (b) Medium (five pairs, last reading 120 days old); (d) Low (last reading about 14 months old).',
                    '(e) No data: the mileage card offers no estimate, and Oil\'s Due cell shows its calendar date (the meter offers no date).',
                    '(f) Each meter grades on its own: mileage High (four pairs, last reading 10 days old), engine hours Low (one pair, last reading 100 days old).',
                    '(g) "Measured from 2 visits", not 3: the first two readings are 3 days apart, so that pair is discarded and the first visit takes part in no usable pair.']
    u['quotes'] = [['S11-E5', 'Two visits, the last one yesterday: one pair, under 30 days, Medium. Six visits, five pairs, the last reading 120 days old: Medium ... The same unit fourteen months after its last visit: Low'],
                   ['S11-R26', 'A unit whose readings are all older than that reads No data and the calendar governs, as for a unit never read'],
                   ['S11-R10', 'Distance and engine hours will each carry their own confidence, computed independently'],
                   ['S11-R24', 'Up to 30 days: one pair Medium, two or more High'],
                   ['S11-R24', '91 to 180 days: one pair Low'],
                   ['S11-R25', 'Measured from N visits, where a card shows it, counts the readings that took part in at least one usable pair. A visit whose only pairs were discarded does not count'],
                   ['S11-R4 (Chunk 2 MR, Confluence 897679389)', 'Pairs less than seven days apart will be discarded'],
                   ['S11-R17', 'No data is a separate state, not a confidence level']]
    u['source'] = src('S9', 'S9 (Confidence, as the cards show it: S11-R10, S11-R17, S11-R24 to S11-R26, S11-E5, copied from Chunk 2; S11-R4 from Chunk 2 MR, Confluence 897679389)')

    # ---- NEW-2: Feature flags page ----
    n = N[1]
    assert 'Digital Inspections' in n['title']
    n['preconds'] = [ADMIN, 'The organization\'s Feature flags page (Settings > Feature flags) lets you turn Digital Inspections off for a test organization; confirm the page\'s exact label on the build.']
    n['steps'] = ['On the organization\'s Feature flags page turn Digital Inspections off.',
                  'As a user with Settings Service, open Settings and look for the Maintenance entry beneath "Inspection Templates".',
                  'On the Feature flags page turn Digital Inspections back on.']

    # ---- NEW-7: confidence hover ----
    n = N[6]
    assert 'hover' in n['title']
    n['preconds'] = [ADVISOR, *seed('a test unit (e.g. unit 402)', [(120, 100000, None), (60, 104000, None)],
                                    'enrol it on a schedule with PM-A (calendar Every 12 months + Distance Every 15,000 mileage), dates blank, so PM-A\'s Due cell shows an estimated month with a confidence meter')]
    n['why'] += SEEDWHY

def mech_fix(cid, u):
    if cid != 146364:
        return
    # ---- C146364: worklist due cell ----
    u['why'] = u['why'].replace(' Precondition now says how to find an asset with estimates (tech plan testability note B5).', '') + SEEDWHY
    u['preconds'] = [ADVISOR, WORKLIST, *seed('unit 402', [(200, 100000, None), (20, 130000, None)],
                                              'enrol it on a schedule "Due check" with PM-A (calendar Every 12 months + Distance Every 15,000 mileage, last service date 200 days before today; overdue by its mileage estimate), CVIP (compliance, Term 12 months) and "Lube" (calendar Every 60 days, date blank)'),
                     'On unit 402\'s asset card add a CVIP record: Term 12 months, End date = 20 days after today (+ Add record, Save).',
                     'A second test unit created with Mileage left empty, enrolled with blank dates on a service "NR" (calendar Every 30 days + Distance Every 15,000 mileage).']
    u['steps'] = ['Read the area beneath the due date on unit 402\'s PM-A row (meter, word) and hover the meter.',
                  'Read unit 402\'s CVIP row and Lube row beneath the due date.',
                  'Read the second unit\'s NR row.']

