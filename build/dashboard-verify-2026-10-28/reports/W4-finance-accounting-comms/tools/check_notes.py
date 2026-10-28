#!/usr/bin/env python3
"""W4 — Notes Report and Reminders Report: lists, date ranges, filters, counts, sort order.

No written source exists for either report (searches recorded in RESULTS.md), so these are internal
consistency checks: every listed note satisfies the chosen filter; every note that satisfies it is
listed; the sort is in the chosen order. Requests are sent exactly as the screen sends them (one
request, no page number — the screen has no "load more"). The full population is read separately
with paging. Date windows: the screen builds them from the BROWSER clock; here the location's time
zone is used (a user's browser normally runs in the shop's time zone).
"""
import json, sys, collections, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl, WORKPLACES
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
rows = []
def chk(cid, loc, desc, ok, observed=None, expected=None):
    rows.append({'check': cid, 'location': loc, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected})

def enc(filters, extra):
    q = []
    for i, f in enumerate(filters):
        q += [(f'filters[{i}][field]', f['field']), (f'filters[{i}][operator]', f['operator']), (f'filters[{i}][value]', f['value'])]
    return urlencode(q + extra)

def windows(now, tz):
    z = ZoneInfo(tz); d = now.astimezone(z).date()
    mid = lambda x: dt.datetime.combine(x, dt.time(0), z).astimezone(dt.timezone.utc)
    dow = (d.weekday() + 1) % 7                       # JS getDay(): Sunday = 0
    first = d.replace(day=1); nm = (first + dt.timedelta(days=32)).replace(day=1); pm = (first - dt.timedelta(days=1)).replace(day=1)
    nnm = (nm + dt.timedelta(days=32)).replace(day=1)
    ws = d - dt.timedelta(days=dow)
    return {'all': (None, None), 'today': (mid(d), mid(d + dt.timedelta(days=1))), 'this_week': (mid(ws), mid(ws + dt.timedelta(days=7))),
            'next_week': (mid(ws + dt.timedelta(days=7)), mid(ws + dt.timedelta(days=14))), 'last_week': (mid(ws - dt.timedelta(days=7)), mid(ws)),
            'this_month': (mid(first), mid(nm)), 'next_month': (mid(nm), mid(nnm)), 'last_month': (mid(pm), mid(first)),
            'custom_sep': (mid(dt.date(2026, 9, 1)), mid(dt.date(2026, 10, 1)))}

iso = lambda t: t.strftime('%Y-%m-%dT%H:%M:%S.000Z')
ts = lambda s: (dt.datetime.strptime(s[:19], '%Y-%m-%d %H:%M:%S') if len(s) > 10 else dt.datetime.strptime(s[:10], '%Y-%m-%d')).replace(tzinfo=dt.timezone.utc) if s else None
summary = {}
ME = '6d71382d-4ddb-4707-a0f3-33b4bb78b0b8'   # Admin ShopView — the id the screen sends as mention_id (observed 2026-10-28)
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}); H = {'X-Location-ID': wid}
    allnotes, page = [], 1
    while True:
        s, j = curl('GET', '/api/notes?' + urlencode([('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true'), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
        allnotes += j['data']['notes']
        if not j['data']['pagination'].get('hasMore'):
            break
        page += 1
    summary[name] = {'notes_total': len(allnotes)}
    now = dt.datetime.now(dt.timezone.utc)
    W = windows(now, tz)
    for key in ('all', 'today', 'this_week', 'last_week', 'this_month', 'last_month', 'custom_sep'):
        a, b = W[key]
        f = ([{'field': 'created_after', 'operator': 'gte', 'value': iso(a)}] if a else []) + ([{'field': 'created_before', 'operator': 'lte', 'value': iso(b)}] if b else [])
        for sortname, extra in (('newest', [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true')]), ('oldest', [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'false')])):
            s, j = curl('GET', '/api/notes?' + enc(f, extra), extra_headers=H)
            got = j['data']['notes']; more = j['data']['pagination'].get('hasMore')
            expect = [n for n in allnotes if (a is None or ts(n['createdAt']) >= a) and (b is None or ts(n['createdAt']) <= b)]
            outside = [n['id'] for n in got if not ((a is None or ts(n['createdAt']) >= a) and (b is None or ts(n['createdAt']) <= b))]
            chk('N1', name, f'Notes Report "{key}" ({sortname}): every listed note is inside the date range', not outside, len(outside), 0)
            chk('N2', name, f'Notes Report "{key}" ({sortname}): every note in the date range is listed', len(got) >= len(expect) and not more,
                {'listed': len(got), 'in_range': len(expect), 'server_says_more': more}, len(expect))
            c = [n['createdAt'] for n in got]
            chk('N3', name, f'Notes Report "{key}": "{ "Newest First" if sortname == "newest" else "Oldest First"}" order', c == sorted(c, reverse=(sortname == 'newest')), None, None)
    # author filter: the most frequent author
    au = collections.Counter(n['userId'] for n in allnotes).most_common(1)
    if au:
        uid = au[0][0]
        s, j = curl('GET', '/api/notes?' + enc([{'field': 'author_id', 'operator': 'eq', 'value': uid}], [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true')]), extra_headers=H)
        got = j['data']['notes']
        chk('N4', name, 'Notes Report "Filter by Author": every listed note is by that author', all(n['userId'] == uid for n in got), sum(n['userId'] != uid for n in got), 0)
        chk('N5', name, 'Notes Report "Filter by Author": every note by that author is listed', len(got) == au[0][1] and not j['data']['pagination'].get('hasMore'),
            {'listed': len(got), 'by_author': au[0][1]}, au[0][1])
    # mention filter
    men = collections.Counter(m.get('referenceId') for n in allnotes for m in (n.get('mentions') or []) if isinstance(m, dict))
    if men:
        mid_, cnt = men.most_common(1)[0]
        s, j = curl('GET', '/api/notes?' + enc([], [('mention_id', mid_), ('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true')]), extra_headers=H)
        got = j['data']['notes']
        ok_all = all(any(m.get('referenceId') == mid_ for m in (n.get('mentions') or []) if isinstance(m, dict)) for n in got)
        chk('N6', name, 'Notes Report "Filter by Mention": every listed note mentions that person', ok_all, None, None)
        chk('N7', name, 'Notes Report "Filter by Mention": every note mentioning that person is listed', len(got) >= cnt, {'listed': len(got), 'mentioning': cnt}, cnt)
    # Reminders report: has_reminder + mention current user
    summary[name]['notes_with_reminder'] = sum(1 for n in allnotes if n.get('reminderDate'))
    for key in ('all', 'today', 'this_week', 'next_week', 'last_week', 'this_month', 'next_month', 'last_month'):
        a, b = W[key]
        f = ([{'field': 'reminder_after', 'operator': 'gte', 'value': iso(a)}] if a else []) + ([{'field': 'reminder_before', 'operator': 'lte', 'value': iso(b)}] if b else [])
        s, j = curl('GET', '/api/notes?' + enc(f, [('has_reminder', 'true'), ('mention_id', ME)]), extra_headers=H)
        got = j['data']['notes']
        bad = [n['id'] for n in got if not n.get('reminderDate') or not ((a is None or ts(n['reminderDate']) >= a) and (b is None or ts(n['reminderDate']) <= b))]
        chk('R1', name, f'Reminders Report "{key}": every listed note has a reminder inside the range', not bad, len(bad), 0)
        exp = [n for n in allnotes if n.get('reminderDate') and any(m.get('referenceId') == ME for m in (n.get('mentions') or []) if isinstance(m, dict)) and (a is None or ts(n['reminderDate']) >= a) and (b is None or ts(n['reminderDate']) <= b)]
        # what a user means: the reminder's own calendar date falls inside the chosen days (location calendar)
        if a is not None:
            la, lb = a.astimezone(ZoneInfo(tz)).date(), b.astimezone(ZoneInfo(tz)).date()
            mine = [n for n in allnotes if n.get('reminderDate') and any(m.get('referenceId') == ME for m in (n.get('mentions') or []) if isinstance(m, dict))]
            want_ids = {n['id'] for n in mine if la <= dt.date.fromisoformat(n['reminderDate'][:10]) < lb}
            got_ids = {n['id'] for n in got}
            chk('R3', name, f'Reminders Report "{key}": lists exactly the reminders whose reminder DATE is inside the chosen days',
                want_ids == got_ids, {'listed': len(got_ids), 'should': len(want_ids), 'extra': sorted(n['reminderDate'] for n in got if n['id'] not in want_ids)[:6],
                'missing': sorted(n['reminderDate'] for n in mine if n['id'] in want_ids - got_ids)[:6], 'window_days': [str(la), str(lb)]}, len(want_ids))
        chk('R2', name, f'Reminders Report "{key}" (mentioning me): every note with a reminder in the range that mentions me is listed', len(got) >= len(exp) and not j['data']['pagination'].get('hasMore'),
            {'listed': len(got), 'in_range': len(exp)}, len(exp))
json.dump({'summary': summary, 'checks': rows}, open(f'{OUT}/results-notes-reminders.json', 'w'), indent=1)
curl('POST', '/api/iam/change-location', {'workplace_id': WORKPLACES[0][0], 'workplace_timezone': WORKPLACES[0][2]})
print(json.dumps(summary)); print(collections.Counter(r['result'] for r in rows))
for r in rows:
    if r['result'] == 'FAIL':
        print('FAIL', r['check'], r['location'], r['desc'], json.dumps(r['observed'])[:200])
