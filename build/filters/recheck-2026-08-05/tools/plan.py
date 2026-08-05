#!/usr/bin/env python3
"""Build the 110-case write plan for the 2026-08-05 Filters re-check."""
import json, csv, re, os, sys
sys.path.insert(0,'/tmp/frc')

LIVE = json.load(open('/tmp/frc/snap/live-cases-START.json'))
IDMAP = {int(r['testrail_case_id'][1:]): r for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/filters/testrail-id-map.csv'))}
I2C = {r['internal_id']: cid for cid, r in IDMAP.items()}

OLD_FRAG = 'the build tested on 8/4/2026 (ShopView v3.4.2-4f8211c on the Filters QA branch)'
NEW_FRAG = 'the build tested on 8/5/2026 (ShopView v3.4.2-d00239b on the Filters QA branch)'
SEP = '\n\n---\n'

ACCEPTED = ('Known and accepted: the product behaves this way on purpose for now. '
            'Do not raise this as a new problem.')

# ---------- the groups ----------
SV8824 = ['FLT-STAT-03','FLT-STAT-04','FLT-STAT-05','FLT-CUST-03','FLT-CUST-05','FLT-CUST-07',
          'FLT-TECH-03','FLT-TECH-05','FLT-ADV-03','FLT-ADV-05','FLT-ASSET-05','FLT-CHIP-01']
SV8844 = ['FLT-PSRCH-10','FLT-PSRCH-11','FLT-PSRCH-12']
ACCEPT5 = ['FLT-BAR-01','FLT-COLL-02','FLT-EMPTY-01','FLT-EMPTY-02','FLT-PSRCH-09']

def split_prov(txt):
    parts = txt.split(SEP)
    assert len(parts) == 2, f'expected exactly one provenance separator, found {len(parts)-1}'
    return parts[0], parts[1]

def blocks(body):
    return body.split('\n\n')

def join(bs):
    return '\n\n'.join(b for b in bs if b.strip())

def drop_block(body, pred):
    bs = blocks(body); keep = [b for b in bs if not pred(b)]
    assert len(keep) == len(bs) - 1, f'expected to drop exactly 1 block, dropped {len(bs)-len(keep)}'
    return join(keep)

def replace_block(body, pred, new):
    bs = blocks(body); hits = [i for i, b in enumerate(bs) if pred(b)]
    assert len(hits) == 1, f'expected exactly 1 matching block, found {len(hits)}'
    bs[hits[0]] = new
    return join(bs)

def append_block(body, new):
    return join(blocks(body) + [new])

def restamp(prov):
    assert OLD_FRAG in prov, 'provenance line does not carry the expected build fragment'
    out = prov.replace(OLD_FRAG, NEW_FRAG)
    assert out.count(NEW_FRAG) == 1, 'restamp produced a doubled build reference'
    return out

# ---------- per-case transforms ----------
PLAN = {}
NOTES = {}

for cid, c in LIVE.items():
    cid = int(cid)
    iid = IDMAP[cid]['internal_id']
    body, prov = split_prov(c['custom_expected'])
    orig_body = body
    acts = []

    if iid in SV8824:
        body = drop_block(body, lambda b: b.strip().startswith('Known issue: on the build tested the dropdown closes'))
        acts.append('removed the SV-8824 known-issue line (defect fixed on this build)')

    if iid in SV8844:
        body = drop_block(body, lambda b: b.strip().startswith('Known issue:') and 'SV-8844' in b)
        acts.append('removed the SV-8844 known-issue line entirely (defect fixed; QA lead decision 1)')

    if iid in ACCEPT5:
        def is_dead(b):
            s = b.strip()
            return s.startswith('Known issue:') and ('SV-8843' in s or 'SV-8847' in s)
        old = [b for b in blocks(body) if is_dead(b)][0]
        # keep the plain description of what happens, swap the fix promise for the accepted sentence
        head = old.strip().split(' Until it is fixed')[0]
        head = head.replace('Known issue:', 'Known and accepted:', 1)
        tail = ACCEPTED.split(': ', 1)[1]
        newblk = head.rstrip('.') + '. ' + tail[0].upper() + tail[1:]
        body = replace_block(body, is_dead, newblk)
        acts.append('replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2)')

    if iid == 'FLT-PERS-01':
        body = append_block(body,
            'Known issue: on the build tested the Customer, Lead Technician and Service Advisor buttons come back '
            'switched on but WITHOUT the name of the value you picked - the button reads just "Customer" instead of '
            '"Customer: Iibay Landscaping". The list is still filtered correctly. The Status and Asset on Site buttons '
            'keep their value. Until it is fixed this test is expected to fail on that point - it is already reported. '
            'Ticket: https://shopview.atlassian.net/browse/SV-8871')
        acts.append('added the SV-8871 known-issue line (new defect found on this build)')

    if iid == 'FLT-PERS-04':
        body = append_block(body,
            'Known issue: on the build tested the deleted customer is hidden from the dropdown but is STILL used to '
            'filter the table - the address bar and the request to the server both still carry it. So step 3 above is '
            'expected to fail. It is already reported. Ticket: https://shopview.atlassian.net/browse/SV-8832')
        acts.append('added the SV-8832 known-issue line (we reproduced this with seeded data; our earlier pass had not)')

    if iid == 'FLT-URL-02':
        body = replace_block(body,
            lambda b: b.strip().startswith('Known issue: on a phone-sized screen'),
            'Known issue: two points on this test are expected to fail on the build tested. On a phone-sized screen a '
            'link carrying filters shows the buttons as on but lists the wrong work orders (ticket: '
            'https://shopview.atlassian.net/browse/SV-8845). And on a desktop screen a Customer, Lead Technician or '
            'Service Advisor button opened from a link comes back switched on but without the name of the value, so it '
            'reads just "Customer" (ticket: https://shopview.atlassian.net/browse/SV-8871). The list itself is filtered '
            'correctly on desktop. Both are already reported.')
        acts.append('extended the shared-link known-issue line with the desktop half (SV-8871)')

    if iid == 'FLT-RPTS-23':
        body = ('1. The panel that opens offers a set of ready-made periods to choose from - on the build tested these '
                'are Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last quarter, This '
                'year, Last year - plus a Custom option and a Clear Selection link. The exact set of ready-made periods '
                'may differ per report, so check the ones your report offers rather than expecting this list.\n'
                '2. A period is already filled in when the panel first opens (on Timesheet Activities it is This month), '
                'and the button reads that period, for example "Date Range: This month".\n'
                '3. Choosing a ready-made period applies it straight away: the results update, the button reads the '
                'period you chose, and the web address records it.\n'
                '4. Choosing Custom shows a From box and a To box. After you fill in only the From date the results do '
                'NOT change yet.\n'
                '5. As soon as you fill in the To date the results update to show only records inside that range, and '
                'the button reads "Date Range: Custom".\n'
                '6. Only one date range can be active at a time on that button.\n\n'
                'Note: dates are typed in month/day/year order, the way the build shows them (for example 07/01/2026).\n\n'
                'Where to run this on the build tested: the Reports area has this date button on the Timesheet '
                'Activities report. Other report tabs do not have a filter bar yet - if the report you open has no '
                'date button, mark this test BLOCKED, not failed.')
        acts.append('rewrote the expected results to follow the newer specification (ready-made periods and a '
                    'pre-filled default range), written so it does not depend on one fixed list of periods')

    prov = restamp(prov)

    if iid == 'FLT-RPTS-23':
        prov = ('This is the expected behaviour as per the build tested on 8/5/2026 (ShopView v3.4.2-d00239b on the '
                'Filters QA branch) and epic SV-8785. It follows the NEWER wording of the Filters specification '
                'version 1.6, in the revision published on the afternoon of 4 August 2026, which changed the date '
                'filter description in the Feature Overview and in the Key Decisions section: the date button now '
                'offers standard ready-made periods and starts with the current default range already filled in. '
                'An earlier revision of the same specification said the opposite, and this test follows the newer '
                'one. The specification does not give this a numbered requirement, so there is no requirement number '
                'to quote.')

    new_exp = body + SEP + prov
    intended = {}
    if new_exp != c['custom_expected']:
        intended['custom_expected'] = new_exp

    if iid == 'FLT-RPTS-23':
        intended['title'] = 'Date range filter offers ready-made periods and a custom start/end range'
        intended['custom_preconds'] = (
            '1. You are signed in to the ShopView App on a desktop browser.\n'
            '2. You are on a report that has a Date Range button - on the build tested that is Reports then the '
            'Timesheet Activities report.\n'
            '3. Records exist inside and outside the date range you will pick.')
        intended['custom_steps'] = (
            '1. Click the Date Range button.\n'
            '2. Look at what the panel offers, and at what the button already reads before you change anything.\n'
            '3. Choose one of the ready-made periods (for example Today) and watch the results.\n'
            '4. Open the button again and choose Custom.\n'
            '5. Fill in the From date only, and watch the results.\n'
            '6. Fill in the To date.\n'
            '7. Look at the results and at the button.')
        acts.append('re-titled and rewrote the preconditions and steps to match, and named the report to use')
    if iid == 'FLT-RPTS-23':
        intended['refs'] = ('SV-8785 [epic] (Filters spec v1.6 rev 2026-08-04 pm: Feature Overview + Key Decisions '
                            '"New date-range filter type" - standard predefined ranges; pre-populated default range; '
                            'preset applies on selection; custom applies on 2nd date)')
        acts.append('pinned the reference to the newer specification revision')

    PLAN[cid] = {'iid': iid, 'intended': intended, 'actions': acts or ['re-stamped the provenance line only']}

open('/tmp/frc/push/plan.json','w').write(json.dumps(PLAN, indent=1))
print('cases planned:', len(PLAN))
print('cases with a text change beyond the stamp:', sum(1 for v in PLAN.values() if len(v['actions'])>1 or v['actions'][0]!='re-stamped the provenance line only'))
print('cases writing refs:', sum(1 for v in PLAN.values() if 'refs' in v['intended']))
print('cases with NO intended change (would be skipped):', [c for c,v in PLAN.items() if not v['intended']])
for cid,v in PLAN.items():
    if v['actions'][0]!='re-stamped the provenance line only':
        print(f"  C{cid} {v['iid']:<14} {'; '.join(v['actions'])[:120]}")
