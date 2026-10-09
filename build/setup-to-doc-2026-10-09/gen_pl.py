# Part Lifecycle: Setup section -> one Google Doc per case (verbatim); Needs/Build lines removed (QA lead 9 Oct 2026).
import json, re, html, os
D = 'build/setup-to-doc-2026-10-09'; O = f'{D}/part-lifecycle'
snap = {c['id']: c for c in json.load(open(f'{D}/snapshot-before.json'))}
secs = {s['id']: s for s in json.load(open(f'{D}/sections.json'))}
def under(sid, g):
    s = secs[sid]
    while s:
        if s['id'] == g: return True
        s = secs.get(s['parent_id'])
el = sorted([c for c in snap.values() if under(c['section_id'], 20439) and not under(c['section_id'], 54275)
             and c['created_by'] == 3 and c.get('updated_by') == 3 and c.get('custom_atmstatus') != 3], key=lambda c: c['id'])
PART2 = open(f'{D}/part2-common.html').read()
M, P = '<p><strong>Setup</strong></p>', '<p><strong>Preconditions</strong></p>'
plan, problems = [], []
for c in el:
    p = c['custom_preconds']
    if p.count(M) != 1 or not p.startswith(P): problems.append(c['id']); continue
    pre, setup = p[:p.index(M)], p[p.index(M) + len(M):]
    items = re.findall(r'<li>.*?</li>', pre, re.S)
    drop = [i for i in items if re.match(r'<li>\s*(Needs:|Build:)', i)]
    keep = [i for i in items if i not in drop]
    if len(drop) != 2 or not re.fullmatch(r'\s*<ul>(?:\s*<li>.*?</li>)+\s*</ul>\s*', pre[len(P):], re.S): problems.append(c['id']); continue
    title = html.escape(c['title'])
    doc = (f"<html><body><h1>Setup: {title}</h1>"
           f"<p>Test case: <a href=\"https://shopview.testrail.io/index.php?/cases/view/{c['id']}\">C{c['id']}</a>, Founder Mode / Part Lifecycle. "
           "Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.</p>"
           "<p>How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. "
           "Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.</p>"
           "<h2>What the setup creates</h2><ul>" + "".join(keep) + "</ul>"
           "<h1>Part 1. Setup for manual QA tester</h1>" + setup +
           PART2 + "</body></html>")
    open(f"{O}/docs/C{c['id']}.html", 'w').write(doc)
    newpre = P + '<ul>' + ''.join(keep) + '</ul>'
    plan.append({'id': c['id'], 'title': c['title'], 'updated_on': c['updated_on'], 'new_pre_body': newpre, 'dropped': drop})
json.dump(plan, open(f'{O}/plan.json', 'w'), indent=1, ensure_ascii=False)
print(len(el), 'eligible ·', len(plan), 'planned · problems', problems)
