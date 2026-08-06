import sys, json, re, os, html
sys.path.insert(0,'.')
import jiralib as J
PAGES = {
 'schedule': ('713031682','Schedule'),
 'filters': ('572030978','Filters'),
 'sbc': ('577634305','Sales By Customer'),
 'sbr': ('585629698','Sales By Representative'),
 'pv':  ('620888066','Parts Velocity'),
 'tu':  ('641400833','Technician Utilization'),
 'wip': ('703660034','Work In Progress'),
 'iv':  ('720142338','Inventory Value'),
}
def strip(h):
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S|re.I)
    h = re.sub(r'</(p|div|li|tr|h[1-6]|td|th)>', '\n', h, flags=re.I)
    h = re.sub(r'<br\s*/?>', '\n', h, flags=re.I)
    h = re.sub(r'<li[^>]*>', '- ', h, flags=re.I)
    h = re.sub(r'<td[^>]*>|<th[^>]*>', ' | ', h, flags=re.I)
    h = re.sub(r'<[^>]+>', '', h)
    h = html.unescape(h)
    h = re.sub(r'[ \t]+', ' ', h)
    h = re.sub(r'\n\s*\n+', '\n', h)
    return h.strip()

os.makedirs('../specs', exist_ok=True)
meta = {}
for slug,(pid,name) in PAGES.items():
    code, d = J.get(f'/wiki/api/v2/pages/{pid}?body-format=storage', out=f'/tmp/_conf_{slug}.json')
    if code != '200':
        print(slug, code, str(d)[:200]); meta[slug]={'http':code}; continue
    ver = d['version']['number']
    body = d['body']['storage']['value']
    txt = strip(body)
    open(f'../specs/{slug}-v{ver}.txt','w').write(txt)
    meta[slug] = {'pageId': pid, 'name': name, 'confluence_version': ver,
                  'title': d['title'], 'createdAt': d['version'].get('createdAt'),
                  'chars': len(txt), 'file': f'{slug}-v{ver}.txt'}
    print(f"{slug:9s} page {pid} CONFLUENCE v{ver}  {len(txt)} chars  edited {d['version'].get('createdAt')}  '{d['title']}'")
json.dump(meta, open('../specs/SPEC-VERSIONS.json','w'), indent=1)
