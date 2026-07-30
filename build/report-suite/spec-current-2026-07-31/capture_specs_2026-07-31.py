import json,os,subprocess,sys,html2text
COOKIE=open('/tmp/fd-tickets/all-cookie-header.txt').read().strip()
PAGES=[("577634305","Sales-By-Customer-Report"),("585629698","Sales-By-Representative-Report"),
("620888066","Parts-Velocity-Report"),("641400833","Technician-Utilization-Report"),
("703660034","Work-In-Progress-Report"),("720142338","Inventory-Value-Report")]
OUT='build/report-suite/spec-current-2026-07-31'
def norm(t):
    for a,b in [('\\.','.'),('\\!','!'),('\\{','{'),('\\}','}')]: t=t.replace(a,b)
    return '\n'.join(l.rstrip() for l in t.split('\n'))
meta={}
for pid,slug in PAGES:
    r=subprocess.run(['curl','-sS','-H','Cookie: '+COOKIE,'-H','Accept: application/json','-w','\n__H%{http_code}',
      f"https://shopview.atlassian.net/wiki/rest/api/content/{pid}?expand=body.storage,version,space"],capture_output=True,text=True)
    body,code=r.stdout.rsplit('\n__H',1); assert code=='200',(slug,code)
    d=json.loads(body); v=d['version']
    h=html2text.HTML2Text(); h.body_width=0; h.unicode_snob=True
    md=norm(h.handle(d['body']['storage']['value']))
    hdr=(f"# {d['title']}\n\n> **VERBATIM CAPTURE — current Confluence spec**\n> - pageId: {pid}\n"
         f"> - Page title: {d['title']}\n> - Current version: v{v['number']}\n"
         f"> - Last updated: {v['when']} by {v.get('by',{}).get('displayName','?')}\n"
         f"> - Confluence space: {d['space']['key']}\n"
         f"> - Captured: 2026-07-31 (REST storage-format -> markdown via html2text, unicode-preserving; "
         f"escape-normalized to match the 2026-07-28 capture pipeline — validated 6/6 byte-identical on the prior versions)\n\n---\n")
    open(f"{OUT}/{slug}-current.md","w").write(hdr+md)
    meta[slug]={'pid':pid,'ver':v['number'],'when':v['when'],'by':v.get('by',{}).get('displayName','?')}
    # also normalized prev for diffing
    open(f"/tmp/rs31/nprev/{slug}.md","w").write(norm(open(f"/tmp/rs31/prev/{slug}.md").read()))
    open(f"/tmp/rs31/ncur/{slug}.md","w").write(md)
    print("OK",slug,"v%d"%v['number'],v['when'])
json.dump(meta,open('/tmp/rs31/meta.json','w'),indent=1)
