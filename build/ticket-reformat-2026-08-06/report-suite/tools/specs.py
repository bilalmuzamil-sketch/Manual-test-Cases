#!/usr/bin/env python3
"""Fetch all six Report Suite specs LIVE from Confluence, record the CONFLUENCE version."""
import sys, os, json, re, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jiralib as J
PAGES = {
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
HERE=os.path.dirname(os.path.abspath(__file__))
D=os.path.join(HERE,'..','specs'); os.makedirs(D, exist_ok=True)
meta={}
for slug,(pid,name) in PAGES.items():
    code,d = J.get(f'/wiki/api/v2/pages/{pid}?body-format=storage', out=f'/tmp/_rfconf_{slug}.json')
    if code!='200':
        print(slug,code,str(d)[:200]); meta[slug]={'http':code}; continue
    ver=d['version']['number']; txt=strip(d['body']['storage']['value'])
    open(os.path.join(D,f'{slug}-v{ver}.txt'),'w').write(txt)
    inbody = re.search(r'Version[:\s|]+([0-9.]+)', txt)
    meta[slug]={'pageId':pid,'name':name,'confluence_version':ver,'title':d['title'],
                'edited':d['version'].get('createdAt'),'chars':len(txt),
                'file':f'{slug}-v{ver}.txt','in_body_version_field':inbody.group(1) if inbody else None}
    print(f"{slug:4s} page {pid}  CONFLUENCE v{ver:<3} in-body says {meta[slug]['in_body_version_field']}  {len(txt)} chars  edited {d['version'].get('createdAt')}")
json.dump(meta, open(os.path.join(D,'SPEC-VERSIONS.json'),'w'), indent=1)
