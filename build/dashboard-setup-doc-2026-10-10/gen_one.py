# One Google Doc for all tests, one heading per test (QA lead, 10 Oct 2026: "One doc with the heading per test").
import json,re,html,os,sys
D=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,D); import gen
live=gen.live
secs={s['id']:s for s in json.load(open('/tmp/cln/docjob/sections.json'))}
ids=[int(i) for i in open('/tmp/cln/scope-1010.txt').read().split()]
ids.sort(key=lambda i:(secs[live[i]['section_id']]['order'],live[i]['display_order']))
def body(i):
    doc=open(f'{D}/docs/C{i}.html').read()
    must=re.search(r'<h2>What must be true before you start</h2>(<ol>.*?</ol>)',doc,re.S).group(1)
    setup=re.search(r'<h1>Part 1\. Setup for manual QA tester</h1><p>[^<]*</p>(<ul>.*?</ul>)<h1>Part 2',doc,re.S)
    setup=setup.group(1) if setup else '<p>No setup needed beyond the list above.</p>'
    return (f'<h2 id="c{i}">{html.escape(live[i]["title"])}</h2>'
            f'<p>Test case: <a href="https://shopview.testrail.io/index.php?/cases/view/{i}">C{i}</a></p>'
            f'<h3>What must be true before you start</h3>{must}<h3>Setup for manual QA tester</h3>{setup}')
out=['<html><body><h1>Dashboard tests: what must be true and how to set it up</h1>',
 '<p>One heading per test, in the same order as TestRail. Each test\'s Preconditions box links straight to its heading. Under each heading: the list of what must be true before you start (the same list as in the test), then the setup: for each numbered line that needs work, the clicks to set it up. Lines not listed need no setup.</p>']
toc=['<h1>Contents</h1>'];cs=None
for i in ids:
    s=live[i]['section_id']
    if s!=cs:
        if cs is not None: toc.append('</ul>')
        toc.append(f'<p><strong>{html.escape(secs[s]["name"])}</strong></p><ul>'); cs=s
    toc.append(f'<li><a href="#c{i}">{html.escape(live[i]["title"])}</a></li>')
toc.append('</ul>'); out+=toc
cur=None
for i in ids:
    s=live[i]['section_id']
    if s!=cur: out.append(f'<h1>{html.escape(secs[s]["name"])}</h1>'); cur=s
    out.append(body(i))
p2=open(f'{D}/part2.html').read().replace('<h1>Part 2. Setup for Claude session</h1>','<h1>For a Claude session preparing these tests</h1>').replace('Prepare the same starting state by carrying out Part 1','Prepare a test\'s starting state by carrying out its setup')
out.append(p2+'</body></html>')
h=''.join(out)
open(f'{D}/dashboard-setup-all.html','w').write(h)
json.dump(ids,open(f'{D}/order.json','w'))
print(len(h),'bytes',len(ids),'tests')
