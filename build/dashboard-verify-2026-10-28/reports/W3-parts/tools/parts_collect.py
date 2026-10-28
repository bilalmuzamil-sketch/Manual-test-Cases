"""Collect every inventory part (parts list = a different code path from the reports), the pricing matrix
and the fixed-price list, per location. Raw -> /tmp/cln/dv/w3/parts."""
from common import *
out = RAW + '/parts'; os.makedirs(out, exist_ok=True)
for wid, name, tz in WORKPLACES:
    rows, page = [], 1
    while True:
        st, j = curl('GET', '/api/inventory/parts?' + urlencode([('pagination[page]', page), ('pagination[rowsPerPage]', 500)]), extra_headers={'X-Location-ID': wid})
        if st != 200:
            print(name, 'page', page, st, str(j)[:300]); break
        c = j['data']['collection']; rows += c
        if len(c) < 500: break
        page += 1
    json.dump({'wid': wid, 'rows': rows, 'fetched_at': dt.datetime.utcnow().isoformat()}, open(f'{out}/{wid}.json', 'w'))
    st1, pr = curl('GET', '/api/pricing-rules/list?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers={'X-Location-ID': wid})
    st2, fp = curl('GET', '/api/parts/list-fixed-price?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers={'X-Location-ID': wid})
    json.dump({'pricing': pr, 'fixed': fp, 's': [st1, st2]}, open(f'{out}/{wid}__pricing.json', 'w'))
    print(name, len(rows), st1, st2, flush=True)
