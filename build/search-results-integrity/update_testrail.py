#!/usr/bin/env python3
"""Re-push the case bodies to TestRail and report EXACTLY which ones changed.

Written because the QA lead has a session running these cases right now and needs to know which
ones to retest. It compares field by field against what TestRail currently holds and updates only
what differs, so the "changed" list is the truth rather than "everything I touched".

update_case on an EXISTING case is CORRECTION, not creation, and continues under the Rule 62 hold.
"""
import sys, os, csv, json, argparse
sys.path.insert(0, '/tmp/claude-0')
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'push_to_testrail.py')).read().split("def main()")[0]
ns = {'__name__': 'notmain', '__file__': os.path.join(HERE, 'push_to_testrail.py')}
exec(compile(src, 'push', 'exec'), ns)
# 🔴 USE THE RETRYING CLIENT, not the raw one. A bare `from trail import tr` here meant a single
# dropped connection killed the run mid-update — the same transient that killed the first create
# pass. push_to_testrail.py already defines a wrapper that retries the TRANSPORT and never the
# decision; this is that wrapper.
tr = ns['tr']

ap = argparse.ArgumentParser(); ap.add_argument('--confirm', action='store_true')
args = ap.parse_args()

idmap = {}
with open(os.path.join(HERE, 'testrail-id-map.csv')) as f:
    for row in csv.DictReader(f):
        if row.get('case_id'): idmap[row['local_id']] = row['case_id']

changed, same, failed = [], [], []
for sheet, d in ns['rows']():
    cid = idmap.get(str(d['id']))
    if not cid: print(f"   {d['id']}: no TestRail id — skipped"); continue
    title, pre, steps, exp = ns['case_body'](d)
    st, cur = tr(f'get_case/{cid}')
    if st != 200: failed.append((d['id'], cid, f'get {st}')); continue
    want = {'title': title, 'custom_preconds': pre, 'custom_steps': steps, 'custom_expected': exp}
    diff = [k for k, v in want.items() if (cur.get(k) or '') != v]
    if not diff:
        same.append((d['id'], cid)); continue
    if not args.confirm:
        changed.append((d['id'], cid, sheet, diff, d['title'])); continue
    st2, _ = tr(f'update_case/{cid}', want)
    st3, back = tr(f'get_case/{cid}')
    ok = st2 == 200 and st3 == 200 and all((back.get(k) or '') == v for k, v in want.items())
    (changed if ok else failed).append((d['id'], cid, sheet, diff, d['title']) if ok
                                       else (d['id'], cid, f'update {st2} verify {ok}'))
    print(f"   {d['id']:14} C{cid}  {'✅ updated and read back' if ok else '🔴 FAILED'}  "
          f"({', '.join(diff)})")

print(f"\n{'WOULD CHANGE' if not args.confirm else 'CHANGED'}: {len(changed)}   "
      f"already identical: {len(same)}   failed: {len(failed)}")
if not args.confirm:
    for lid, cid, sheet, diff, title in changed:
        print(f"   {lid:14} C{cid}  [{sheet}]  fields: {', '.join(diff)}")
    print("\nDRY RUN — nothing written. Re-run with --confirm.")
else:
    out = os.path.join(HERE, 'RETEST-LIST.csv')
    with open(out, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['local_id', 'testrail_case', 'link', 'tab', 'fields_changed', 'title'])
        for lid, cid, sheet, diff, title in changed:
            w.writerow([lid, f'C{cid}',
                        f'https://shopview.testrail.io/index.php?/cases/view/{cid}',
                        sheet, ' + '.join(diff), title])
    print(f"retest list written: {out}")
if failed:
    print("🔴 FAILURES:", failed)
