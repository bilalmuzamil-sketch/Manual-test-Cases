#!/usr/bin/env python3
"""Push the Search Results Integrity cases into TestRail, and add them to run 415.

🔴 TESTRAIL IS THE ONLY REAL PRODUCTION SYSTEM WE TOUCH (Rule 6). This script writes only with
--confirm, prints exactly what it would do without it, and verifies every write by reading the
record back. "200 OK" alone is not evidence (Rule 50).

🔴 RULE 34 — THE RUN IS SYNCED BY UNION, NEVER BY REPLACEMENT. Run 415 has include_all=False and
carries 184 passed results. update_run replaces the case list wholesale, so sending only the new
ids would DELETE 193 existing tests and every result on them. This script reads the run's current
case ids first and sends existing ∪ new. It refuses to send a list shorter than the current one.

The case text is read from the generated workbook, so TestRail and the Excel the tester holds
cannot say different things.
"""
import sys, os, csv, json, html, argparse
sys.path.insert(0, '/tmp/claude-0')
from trail import tr as _tr, paged as _paged
import time, urllib.error

def _retry(fn, *a, **k):
    """One transient reset killed a run 89 cases in. Retry the transport, never the decision."""
    for attempt in range(4):
        try: return fn(*a, **k)
        except (urllib.error.URLError, OSError) as e:
            if attempt == 3: raise
            print(f"      transport error ({e}) — retry {attempt+1}/3 in {2**attempt*3}s")
            time.sleep(2 ** attempt * 3)

def tr(*a, **k): return _retry(_tr, *a, **k)
def paged(*a, **k): return _retry(_paged, *a, **k)
from openpyxl import load_workbook

HERE = os.path.dirname(os.path.abspath(__file__))
WB = os.path.join(HERE, 'ShopView-Global-Search-Result-Row-Tests-for-Manual-QA.xlsx')
PROJECT, SUITE, PARENT_SECTION, RUN = 1, 1, 6720, 415
PARENT_NAME = 'Search Results Integrity — result row display (SV-10619 / SV-10551)'
REFS = 'SV-10619, SV-10551, SV-9170'
# Non-case sheets. 'Ticket to create' was added later and has no ID column, which crashed the
# reader — a new sheet must be added here or it is treated as a sheet full of test cases.
SKIP = ('How to run this', 'Summary', 'Questions for the PO', 'Ticket to create')

def p(text):
    """Plain text -> the HTML shape every existing case in this suite uses."""
    if not text: return ''
    return '<p>' + html.escape(str(text)).replace('\n', '<br>') + '</p>'

def rows():
    wb = load_workbook(WB)
    for sheet in wb.sheetnames:
        if sheet in SKIP: continue
        w = wb[sheet]
        COL = {w.cell(1, c).value: c for c in range(1, w.max_column + 1)}
        for r in range(2, w.max_row + 1):
            g = lambda c: w.cell(r, c).value
            if not g(1): continue
            # 🔴 COLUMNS BY HEADER NAME, NEVER BY FIXED INDEX. Adding the TestRail column at
            # position 2 shifted every later column right by one, and this reader — which used
            # fixed indices — then pulled the C-id as the title and the search term as the steps.
            # Run with --confirm it would have written that garbage into all 110 live cases. The
            # dry run caught it; the fix is to stop counting columns.
            yield sheet, {'id': g(COL['ID']), 'title': g(COL['What you are checking']),
                          'why': g(COL['Why it matters to a real user']),
                          'before': g(COL['Before you start']), 'type': g(COL['TYPE THIS']),
                          'todo': g(COL['What to do']), 'expect': g(COL['What you should see']),
                          'source': g(COL['Where that comes from']),
                          'quote': g(COL['The exact wording of the requirement']),
                          'held': g(COL['Result']) == 'HELD - do not run'}

def case_body(d):
    # The workbook says "the term in the green cell" - meaningless once the text is in TestRail,
    # where there is no green cell. Same words, right place.
    d = dict(d)
    for k in ('todo', 'expect', 'before'):
        if d.get(k):
            d[k] = (str(d[k]).replace('the term in the green cell',
                                      'the term given in PRECONDITIONS')
                             .replace('THIS ROW IS HELD', 'THIS CASE IS HELD')
                             .replace('Mark this row Not run', 'Mark this case Untested')
                             .replace('THIS ROW DOES NOT APPLY', 'THIS CASE DOES NOT APPLY')
                             .replace('Mark it Not run.', 'Leave it Untested.'))
    title = f"{d['id']} — {d['title']}"
    if len(title) > 250: title = title[:247] + '…'
    typed = '' if str(d['type']).startswith('FIND THE DATA') else d['type']
    pre = (f"WHY THIS MATTERS TO A REAL USER\n{d['why']}\n\n"
           f"BEFORE YOU START\n{d['before']}\n\n"
           + (f"TYPE THIS INTO THE SEARCH BOX — exactly as written:\n{typed}\n"
              if typed else
              "YOU MUST FIND THE DATA YOURSELF — see BEFORE YOU START. No record on the test "
              "environment matched this field when we last looked.\n"))
    exp = d['expect'] + "\n\n---\nSOURCE — quoted verbatim from " + str(d['source']) + ":\n\"" \
          + str(d['quote']) + "\"\n\n" \
          + ("This case's expected result is the source's own sentence, unchanged (Rule 113). "
             "The plain-language wording above is our restatement, added after the quote; where "
             "the two could be read as disagreeing, the quote wins.")
    exp += "\n\nLast checked against the sources on 2026-09-29. Not yet run against any build."
    exp += ("\n\nAUTOMATION: HOLD - the expected outcome is a PO decision (question Q1), not yet "
            "answered" if d['held'] else "\n\nAUTOMATION: READY")
    return title, p(pre), p(d['todo']), p(exp)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--confirm', action='store_true')
    args = ap.parse_args()
    data = list(rows())
    tabs = sorted({s for s, _ in data}, key=lambda s: [t for t, _ in data].index(s))
    print(f"{len(data)} cases across {len(tabs)} tabs -> section '{PARENT_NAME}' under {PARENT_SECTION}")
    for t in tabs:
        n = sum(1 for s, _ in data if s == t)
        held = sum(1 for s, d in data if s == t and d['held'])
        print(f"   {t:24} {n:3} cases  ({held} held)")
    if not args.confirm:
        print("\nDRY RUN — nothing written. Re-run with --confirm.")
        s, d = data[0]
        title, pre, steps, exp = case_body(d)
        print(f"\n--- sample: {title}\n  preconds: {pre[:220]}…\n  steps: {steps[:160]}…\n"
              f"  expected: {exp[:300]}…")
        return 0

    # ── sections ─────────────────────────────────────────────────────────────────────────────
    st, existing = paged(f'get_sections/{PROJECT}', 'sections')
    parent = next((x for x in existing if x['name'] == PARENT_NAME
                   and x.get('parent_id') == PARENT_SECTION), None)
    if parent is None:
        st, parent = tr(f'add_section/{PROJECT}',
                        {'suite_id': SUITE, 'parent_id': PARENT_SECTION, 'name': PARENT_NAME,
                         'description': 'Does the result ROW tell the user what they need to know '
                         '— can they pick the right record without opening it, and tell two '
                         'similar records apart? Behind SV-10619 and SV-10551. Data is seeded and '
                         'rebuilt by build/global-search/seeding/reseed_everything.sh (Rule 114).'})
        print(f"add_section parent -> {st}  id={parent.get('id')}")
        if st != 200: return 1
    else:
        print(f"parent section already exists: id={parent['id']}")
    child = {}
    for t in tabs:
        found = next((x for x in existing if x['name'] == t and x.get('parent_id') == parent['id']), None)
        if found: child[t] = found['id']; print(f"   section '{t}' exists id={found['id']}"); continue
        st, sec = tr(f'add_section/{PROJECT}',
                     {'suite_id': SUITE, 'parent_id': parent['id'], 'name': t})
        print(f"   add_section {t!r} -> {st} id={sec.get('id')}")
        if st != 200: return 1
        child[t] = sec['id']

    # ── cases ────────────────────────────────────────────────────────────────────────────────
    # 🔴 IDEMPOTENT, BECAUSE add_case ALWAYS CREATES. A connection reset 89 cases into the first
    # run, and a naive re-run would have produced 89 duplicates in a production system. Read what is
    # already in each section and skip by title.
    have = {}
    for t, sid in child.items():
        stx, cs = paged(f'get_cases/{PROJECT}&section_id={sid}', 'cases')
        have[t] = {c['title']: c['id'] for c in cs}
        if have[t]: print(f"   {t:24} already holds {len(have[t])} case(s) — those are skipped")

    created, log = [], []
    for sheet, d in data:
        title, pre, steps, exp = case_body(d)
        if title in have.get(sheet, {}):
            cid = have[sheet][title]
            created.append(cid)
            log.append({'local_id': d['id'], 'tab': sheet, 'case_id': cid, 'http': 'existing',
                        'verified': True, 'title': title})
            continue
        st, c = tr(f'add_case/{child[sheet]}',
                   {'title': title, 'template_id': 1, 'type_id': 7, 'priority_id': 2,
                    'refs': REFS, 'custom_preconds': pre, 'custom_steps': steps,
                    'custom_expected': exp,
                    # 🔴 BOTH ARE REQUIRED FIELDS ON THIS INSTANCE and add_case answers a bare 400
                    # naming one of them without either. 1 = "Not Automated", 0 = "None", which is
                    # what 63 of the 66 existing cases in this suite carry.
                    'custom_automation_type': 0, 'custom_atmstatus': 1})
        ok = st == 200 and c and c.get('id')
        # 🔴 READ IT BACK. A 200 is not proof the case is there with the text we sent (Rule 50).
        back = None
        if ok:
            st2, back = tr(f"get_case/{c['id']}")
            ok = st2 == 200 and back.get('title') == title
        log.append({'local_id': d['id'], 'tab': sheet, 'case_id': c.get('id') if c else None,
                    'http': st, 'verified': bool(ok), 'title': title})
        print(f"   {d['id']:14} -> C{c.get('id') if c else '—'}  HTTP {st}  "
              f"{'✅ read back' if ok else '🔴 NOT VERIFIED'}")
        if ok: created.append(c['id'])
        else: print("   🔴 STOPPING — a case did not verify."); break

    with open(os.path.join(HERE, 'testrail-id-map.csv'), 'w', newline='') as f:
        wri = csv.DictWriter(f, fieldnames=['local_id', 'tab', 'case_id', 'http', 'verified', 'title'])
        wri.writeheader(); wri.writerows(log)
    print(f"\n{len(created)} of {len(data)} cases created and read back.")
    if len(created) != len(data):
        print("🔴 NOT syncing the run — the case set is incomplete."); return 1

    # ── the run: UNION, never replacement ────────────────────────────────────────────────────
    st, tests = paged(f'get_tests/{RUN}', 'tests')
    current = sorted({t['case_id'] for t in tests})
    union = sorted(set(current) | set(created))
    print(f"\nrun {RUN}: {len(current)} cases now, {len(created)} new, {len(union)} after union")
    if len(union) < len(current):
        print("🔴 REFUSING: the union is smaller than the current list. That would delete tests.")
        return 1
    st, _ = tr(f'update_run/{RUN}', {'case_ids': union})
    print(f"update_run -> {st}")
    st, tests2 = paged(f'get_tests/{RUN}', 'tests')
    after = {t['case_id'] for t in tests2}
    print(f"read back: {len(after)} tests in the run  "
          f"{'✅' if set(union) == after else '🔴 MISMATCH'}")
    missing = set(current) - after
    print(f"previously-present cases still in the run: {len(set(current) & after)}/{len(current)}"
          + (f"  🔴 LOST {len(missing)}" if missing else "  ✅ none lost"))
    return 0

sys.exit(main())
