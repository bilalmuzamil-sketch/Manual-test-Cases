# What/Why — follow-up writes after the QA lead's "Yes please" to walking the four unconfirmed screens (28 Oct 2026).
# Evidence: probe 18 (quick sign-in offers only Admin and Tech; New Staff Member window), 18/19/19b (Title Clear x present in
# the page but never shown after picking a canned line: pointer over it, and box selected), 19b/20/20b/20d/21c/22 (part added,
# ordered, received; row's status cleared after reload). Same guards as apply.py; only the named fields change.
import json, sys, os, re, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
PART_HOW = (' To add part A: under line 1 click + Add Part, fill Part number (for example ZZAUTOTEST-PA), Description, Qty 1 and '
            'Sell price, then click Save; click Order on the part. To add fee A: click the three-dot menu at the top right of the Lines tab, '
            'then Add Work Order Fee / Discount, give it a Name and an Amount, then click Add Fee. The shop supplies charge is added by itself '
            'and shows as Shop Supplies in the Financial Info card.')
RECV_HOW = (' To receive part A: click Receive on the part; in the Receive parts window pick any vendor under Assign Vendor, fill Vendor '
            'Invoice Number and Cost, tick the part, then click Receive Parts (1); after the page reloads the part no longer shows Awaiting Receive.')
PLAN = {
 154722: {'pre': [('a shop supplies charge and a fee (fee A).', 'a shop supplies charge and a fee (fee A).' + PART_HOW),
                  ('part A received, and work order 1 completed and invoiced today as invoice A.',
                   'part A received, and work order 1 completed and invoiced today as invoice A.' + RECV_HOW)],
          'marker': '<p>AUTOMATION: READY</p>'},
 154708: {'marker': '<p>AUTOMATION: HOLD - step 4 cannot be followed on staging: after a canned line is picked the Title box shows no clear (x) button (checked with the pointer over it and with the box selected)</p>'},
 154719: {'marker': '<p>AUTOMATION: HOLD - needs a second user with a custom role, but staging&#39;s sign-in offers only the Admin and Tech users</p>'},
 549088: {'marker': '<p>AUTOMATION: HOLD - needs a second user with a custom role, but staging&#39;s sign-in offers only the Admin and Tech users</p>'},
}
write = '--write' in sys.argv
log = open(f'{D}/write-log.txt', 'a') if write else None
for i, p in PLAN.items():
    cur = L.call(f'get_case/{i}'); time.sleep(0.3)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3, (i, 'guard')
    assert cur['updated_by'] == 3, (i, 'last edited by someone else', cur['updated_by'])
    d = {}
    if 'pre' in p:
        t = cur['custom_preconds']
        for a, b in p['pre']: assert t.count(a) == 1, (i, a, t.count(a)); t = t.replace(a, b)
        d['custom_preconds'] = t
    e = cur['custom_expected']; mk = re.findall(r'<p>AUTOMATION:[^<]*</p>', e); assert len(mk) == 1, (i, mk)
    d['custom_expected'] = e.replace(mk[0], p['marker'])
    d = {f: v for f, v in d.items() if v != cur[f]}
    if not write: print(i, 'PREVIEW', sorted(d), mk[0][13:60], '->', p['marker'][13:80]); continue
    r = L.call(f'update_case/{i}', d); time.sleep(1)
    ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} fields={sorted(d)} marker={p['marker'][3:-4]} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
