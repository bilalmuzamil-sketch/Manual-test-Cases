#!/usr/bin/env python3
"""COLLAPSE CENSUS v2 — replacing my own faulty v1 detector. READ-ONLY.

v1 (wrong): flagged any field holding <p> + a newline + no <br>. That over-flags the
NORMAL, CORRECT shape produced by the CSV import — a field made of block elements
(<ol><li>…</ol>, <hr />, <p>…</p>) separated by newlines. Those newlines sit BETWEEN
blocks, where they are insignificant whitespace, and the field renders perfectly.
Acting on v1 damaged C44506.

v2 (correct): a field collapses only when a SINGLE <p> element's own inner text carries
a newline and that paragraph has no <br>. Then, and only then, several lines of text are
rendered as one run-on paragraph. Also reports plain-text fields with newlines and no
markup at all, which render fine today but WILL be <p>-wrapped-and-collapsed by the next
update_case (core 2.1a) — a different, forward-looking risk, counted separately.
"""
import json, base64, urllib.request, re, collections

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'


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


allc = paged("get_cases/1&suite_id=1", "cases")
bysec = collections.defaultdict(list)
for c in allc:
    bysec[c['section_id']].append(c)

G = {'digital-inspections-v2': 6658, 'global-search': 6720, 'simple-flow-v2': 6665,
     'invoice-ui-refresh': 6559, 'inline-add-edit-parts': 6597, 'printer-friendly-wo': 6617}
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')
P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)


def genuine_collapse(t):
    """a single <p> whose own inner text holds a newline and no <br>"""
    if not t:
        return False
    for inner in P_BLOCK.findall(t):
        if '\n' in inner.strip() and '<br' not in inner.lower():
            return True
    return False


def plain_multiline(t):
    """no markup at all, but multi-line: renders fine now, collapses on the NEXT write"""
    if not t:
        return False
    has_markup = any(x in t.lower() for x in ('<p', '<ol', '<li', '<br', '<hr', '<ul'))
    return (not has_markup) and '\n' in t.strip()


rows = []
summary = {}
for slug, gid in G.items():
    live = [c for s in sub(gid) for c in bysec.get(s, [])]
    n_col = n_plain = 0
    for c in live:
        cf = [f for f in FIELDS if genuine_collapse(c.get(f))]
        pf = [f for f in FIELDS if plain_multiline(c.get(f))]
        if cf:
            n_col += 1
            rows.append({'slug': slug, 'cid': c['id'], 'kind': 'GENUINE-COLLAPSE',
                         'fields': cf, 'title': c['title'][:70]})
        if pf:
            n_plain += 1
            rows.append({'slug': slug, 'cid': c['id'], 'kind': 'plain-multiline',
                         'fields': pf, 'title': c['title'][:70]})
    summary[slug] = {'live': len(live), 'genuine_collapse': n_col, 'plain_multiline': n_plain}

json.dump({'summary': summary, 'rows': rows},
          open('build/build-verify-session-2026-08-21/evidence/collapse-census-v2.json', 'w'), indent=1)

print(f"{'PROJECT':<28}{'LIVE':>5}{'GENUINE COLLAPSE':>18}{'plain multiline':>17}")
t = collections.Counter()
for s, r in summary.items():
    t['live'] += r['live']
    t['c'] += r['genuine_collapse']
    t['p'] += r['plain_multiline']
    print(f"{s:<28}{r['live']:>5}{r['genuine_collapse']:>18}{r['plain_multiline']:>17}")
print(f"{'TOTAL':<28}{t['live']:>5}{t['c']:>18}{t['p']:>17}")

gen = [r for r in rows if r['kind'] == 'GENUINE-COLLAPSE']
print(f"\ngenuinely collapsed cases: {len(gen)}")
for r in gen[:15]:
    print(f"   C{r['cid']} [{r['slug']}] {r['fields']} {r['title'][:55]}")
print("\nv1 flagged 16. Those 16 were the NORMAL block-HTML shape, not a defect.")
