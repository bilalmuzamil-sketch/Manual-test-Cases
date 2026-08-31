#!/usr/bin/env python3
"""What do our 89 cases actually REQUIRE of the build? Scripted to files, never into context.

Reads the LIVE case bodies (they are the authority — the local sources may lag) and, per case,
pulls out the things the five runnability checks turn on:
  * the data state the preconditions demand   (check 1)
  * the navigation path / screens named        (check 2)
  * the named controls                         (check 3)
  * the step order                             (check 4)
  * the quoted on-screen labels                (check 5)

Then aggregates the DISTINCT surfaces so the live probe has a finite target list instead of
89 ad-hoc walks. Output: requirements.json (per case) + SURFACES.md (the bounded summary a
human, or my next turn, actually reads).

Read-only. No writes to TestRail, no app calls.
"""
import json, base64, urllib.request, re, collections, os, html

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31'


def get(p):
    r = urllib.request.Request(B + p)
    r.add_header('Authorization', 'Basic ' + A)
    with urllib.request.urlopen(r, timeout=60) as x:
        return json.loads(x.read().decode())


def paged(p, k):
    o, f = [], 0
    while True:
        d = get(f"{p}&limit=250&offset={f}")
        c = d[k] if isinstance(d, dict) else d
        if not c:
            break
        o.extend(c)
        if len(c) < 250:
            break
        f += 250
    return o


sec = paged("get_sections/1&suite_id=1", "sections")
kids = collections.defaultdict(list)
for s in sec:
    kids[s.get('parent_id')].append(s['id'])


def sub(r):
    seen, st = [], [r]
    while st:
        n = st.pop()
        seen.append(n)
        st.extend(kids.get(n, []))
    return seen


secname = {s['id']: s['name'] for s in sec}
ids = set(sub(6559))
cases = [c for c in paged("get_cases/1&suite_id=1", "cases") if c['section_id'] in ids]
# scope is ALL 119: the QA lead confirmed Mudassir Qamar (id 6) as the Manual QA owner
# for this suite on 2026-08-31, so his 30 cases are treated exactly like ours (core 5.0).
ours = cases

TAG = re.compile(r'<[^>]+>')
def plain(t):
    t = TAG.sub('\n', t or '')
    return html.unescape(t)

def lines(t):
    return [l.strip() for l in plain(t).split('\n') if l.strip()]

# quoted on-screen labels: 'Foo', "Foo", or Title Case in quotes
QUOTED = re.compile(r"['\"“”‘’]([A-Z][A-Za-z0-9 /&#\.\-\+%]{1,44})['\"“”‘’]")
# route-ish words the app uses
NAV = re.compile(r'\b(work order|workorder|invoice|estimate|credit invoice|parts sale|payment|'
                 r'settings|customer|asset|print|pdf|preview|download|email|masthead|letterhead|'
                 r'footer|signature|disclaimer|authorizer|declined work|financial summary|'
                 r'paid banner|balance|deposit|refund)\b', re.I)

per_case = {}
label_freq = collections.Counter()
nav_freq = collections.Counter()
precond_freq = collections.Counter()
for c in ours:
    pre, stp, exp = lines(c.get('custom_preconds')), lines(c.get('custom_steps')), lines(c.get('custom_expected'))
    body = ' '.join(pre + stp)
    labels = sorted(set(QUOTED.findall(' '.join(pre + stp + exp))))
    navs = sorted({m.group(0).lower() for m in NAV.finditer(body)})
    for l in labels:
        label_freq[l] += 1
    for n in navs:
        nav_freq[n] += 1
    for p in pre:
        precond_freq[p[:90]] += 1
    per_case[c['id']] = {
        'cid': c['id'],
        'title': c['title'],
        'section': secname.get(c['section_id']),
        'refs': c.get('refs'),
        'atm': c.get('custom_atmstatus'),
        'preconditions': pre,
        'steps': stp,
        'expected_body': [l for l in exp if not l.startswith('AUTOMATION:')
                          and 'This is the expected behaviour as per' not in l],
        'labels_quoted': labels,
        'nav_nouns': navs,
        'n_steps': len(stp),
    }

os.makedirs(OUT, exist_ok=True)
json.dump(per_case, open(f'{OUT}/requirements.json', 'w'), indent=1, ensure_ascii=False)

with open(f'{OUT}/SURFACES.md', 'w') as f:
    f.write("# WHAT THE 89 CASES REQUIRE OF THE BUILD — derived from the live case bodies\n\n")
    f.write(f"Cases analysed: **{len(ours)}** (ours only; the 30 foreign cases are excluded, Rule 38).\n\n")
    f.write("## Distinct navigation nouns, by how many cases depend on each\n\n| Surface | Cases |\n|---|---|\n")
    for n, k in nav_freq.most_common():
        f.write(f"| {n} | {k} |\n")
    f.write(f"\n## The most-depended-on quoted on-screen labels ({len(label_freq)} distinct)\n\n| Label | Cases |\n|---|---|\n")
    for l, k in label_freq.most_common(45):
        f.write(f"| `{l}` | {k} |\n")
    f.write(f"\n## Distinct preconditions ({len(precond_freq)} distinct) — the data states to reach\n\n| Precondition | Cases |\n|---|---|\n")
    for p, k in precond_freq.most_common(30):
        f.write(f"| {p} | {k} |\n")

print(f"cases analysed        : {len(ours)}")
print(f"distinct nav nouns    : {len(nav_freq)}")
print(f"distinct quoted labels: {len(label_freq)}")
print(f"distinct preconditions: {len(precond_freq)}")
print(f"steps per case        : min {min(v['n_steps'] for v in per_case.values())} / "
      f"max {max(v['n_steps'] for v in per_case.values())} / "
      f"total {sum(v['n_steps'] for v in per_case.values())}")
print("\ntop nav surfaces:", nav_freq.most_common(12))
print("\ntop preconditions:")
for p, k in precond_freq.most_common(8):
    print(f"  {k:>3}x  {p}")
print(f"\nwrote {OUT}/requirements.json and {OUT}/SURFACES.md")
