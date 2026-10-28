"""Every filter control x every value that occurs in the data (Category: every category in the option list
for IV, every category present for PV; Vendor: every vendor present; Bin: every bin in the option list;
Search: fixed term set; Location: two locations together). IV = today, PV = This Year.
Raw -> /tmp/cln/dv/w3/flt/. 3 worker threads."""
from common import *
from concurrent.futures import ThreadPoolExecutor
out = RAW + '/flt'; os.makedirs(out, exist_ok=True)
HD, LE = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'f8a8b802-7780-4b16-bf10-343caeb616b2'
vend, page = [], 1
while True:
    st, v = curl('GET', '/api/parts-catalogue/vendors?' + urlencode([('pagination[page]', page), ('pagination[rowsPerPage]', 1000)]), extra_headers={'X-Location-ID': HD})
    c = v['data']['collection']; vend += c
    if len(c) < 1000: break
    page += 1
json.dump(vend, open(out + '/_vendors.json', 'w'))
name2vid = {}
for x in vend: name2vid.setdefault(x['name'], []).append(x['id'])
st, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers={'X-Location-ID': HD}); cats = cats['data']['collection']
json.dump(cats, open(out + '/_categories.json', 'w'))
lab2cid = {}
for c in cats: lab2cid.setdefault(c['label'], []).append(c['value'])
SEARCH = ['brake', 'BRAKE', 'Filter', 'oil', '12', '-', 'zzq-nothing-matches']
jobs = []
for wid in (HD, LE):
    change_loc(wid)
    today = dt.datetime.now(ZoneInfo(TZ[wid])).date()
    P = json.load(open(f'{RAW}/parts/{wid}.json'))['rows']
    iv_v = sorted({p['vendor_id'] for p in P if p['vendor_id']} )
    pv = json.load(open(f'{RAW}/pv/{wid}__this_year__both.json'))
    pv_c = sorted({r['category'] for r in pv['rows'] if r['category']}); pv_v = sorted({r['vendor'] for r in pv['rows'] if r['vendor'] and r['vendor'] != 'Multiple'})
    st, b = curl('GET', '/api/inventory/bin-locations', extra_headers={'X-Location-ID': wid}); bins = b['data']['binLocations']
    json.dump(bins, open(f'{out}/_bins_{wid}.json', 'w'))
    f0, t0 = dt.date.fromisoformat(pv['from']), dt.date.fromisoformat(pv['to'])
    for c in cats: jobs.append(('iv', wid, 'category', c['value'], [('categories', c['value'])], today))
    for v_ in iv_v: jobs.append(('iv', wid, 'vendor', v_, [('vendors', v_)], today))
    for s_ in SEARCH: jobs.append(('iv', wid, 'search', s_, [('search', s_)], today))
    for c in pv_c: jobs.append(('pv', wid, 'category', c, [('categories', ','.join(lab2cid.get(c, ['missing'])))], (f0, t0)))
    for v_ in pv_v: jobs.append(('pv', wid, 'vendor', v_, [('vendors', ','.join(name2vid.get(v_, ['missing'])))], (f0, t0)))
    for b_ in bins: jobs.append(('pv', wid, 'bin', b_['id'], [('bins', b_['id'])], (f0, t0)))
    for s_ in SEARCH: jobs.append(('pv', wid, 'search', s_, [('search', s_)], (f0, t0)))
jobs.append(('pv', [HD, LE], 'locations', 'HD+LE', [], (dt.date(2026, 1, 1), dt.date(2026, 10, 28))))
jobs.append(('iv', [HD, LE], 'locations', 'HD+LE', [], dt.date(2026, 10, 28)))
print('jobs', len(jobs), flush=True)
def run(i_job):
    i, (rep, wid, kind, val, extra, when) = i_job
    t = time.time()
    if rep == 'iv':
        st, d, rows, tot = iv_all(wid, when, extra)
        meta = {k: v for k, v in d.items() if k != 'collection'} if st == 200 else d
    else:
        st, meta, rows = pv_all(wid, when[0], when[1], 'both', extra)
    json.dump({'rep': rep, 'wid': wid, 'kind': kind, 'value': val, 'extra': extra, 'status': st, 'meta': meta, 'rows': rows}, open(f'{out}/{rep}_{i:04d}.json', 'w'))
    if i % 25 == 0: print(i, rep, kind, st, len(rows), round(time.time() - t, 1), flush=True)
with ThreadPoolExecutor(3) as ex:
    list(ex.map(run, enumerate(jobs)))
print('DONE', flush=True)
