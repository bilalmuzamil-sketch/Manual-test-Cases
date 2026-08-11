import tr, json
rows = json.load(open('rows.json'))
cand = [r for r in rows if r['atm']==3 and r['created_by']==3 and r['proj'] in ('Filters','ReportSuite')]
cand.sort(key=lambda r:(r['proj'], r['id']))
print('candidates', len(cand), {p: sum(1 for c in cand if c['proj']==p) for p in ('Filters','ReportSuite')})
users = {}
def uname(uid):
    if uid not in users:
        st,d = tr.req(f'get_user/{uid}')
        users[uid] = d.get('name') if st==200 else f'user {uid} (unreadable {st})'
    return users[uid]
out=[]
for i,c in enumerate(cand,1):
    h = tr.getall(f"get_history_for_case/{c['id']}", 'history')
    atm_changes=[]
    for entry in h:
        for ch in (entry.get('changes') or []):
            if ch.get('field')=='custom_atmstatus':
                atm_changes.append(dict(created_on=entry.get('created_on'), user_id=entry.get('user_id'),
                                        old=ch.get('old_text') or ch.get('old_value'),
                                        new=ch.get('new_text') or ch.get('new_value')))
    rec = dict(c)
    rec['history_entries_total']=len(h)
    rec['atm_changes']=atm_changes
    rec['atm_change_users']=sorted({a['user_id'] for a in atm_changes})
    rec['atm_change_user_names']=[uname(u) for u in rec['atm_change_users']]
    out.append(rec)
    if i%10==0: print('  ...',i)
json.dump(out, open('history.json','w'), indent=1)
noent=[r for r in out if not r['atm_changes']]
withent=[r for r in out if r['atm_changes']]
print('WITH atm history entry:', len(withent))
print('WITHOUT any atm history entry:', len(noent))
print('users who ever set the flag:', {u: users[u] for u in {u for r in out for u in r["atm_change_users"]}})
for r in noent: print('  NO-HISTORY', r['proj'], 'C%d'%r['id'], 'total hist entries', r['history_entries_total'], r['title'][:60])
