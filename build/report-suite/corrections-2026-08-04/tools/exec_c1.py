"""CORRECTION 1 — re-link the SV-8823 cases.

Standing Rule 50: pre-write snapshot -> drift check -> write ONE field -> re-GET ->
byte-compare EVERY field; untouched fields proven byte-identical. A mismatch = the write
FAILED: stop the batch, dump both byte sequences, do not retry.
Standing Rule 38: hard refusal on any case not created_by==3, and on the 5 known foreign ids.
"""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAP = os.path.join(HERE, 'data', 'live-4281-START.json')
FOREIGN = {38919, 38920, 38921, 38922, 38923}
VOLATILE = {'updated_on', 'updated_by'}
TICKET = 'https://shopview.atlassian.net/browse/SV-8823'
KNOWN = ('Known issue: the product does not currently do this. '
         'It has been filed for a fix here: ' + TICKET)

DNA = ('DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. '
       'Automating it now could lock in the wrong behaviour.\n'
       'The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx '
       '— https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/'
       'slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/'
       'Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx')

NEW = {}

NEW[30162] = (
 "1. Margin % is a plain number to one decimal with no percent sign (for example, 64.7); "
 "it is EMPTY when the row's Subtotal is zero or below.\n"
 "2. Dates export as mm-dd-yyyy — for example, 05-14-2026.\n"
 "3. Currency values are plain numbers with no dollar sign and no thousands separators.\n"
 "4. The CSV has no color; the signed Inv. Hrs value still conveys direction.\n"
 "On this build the money in the spreadsheet file comes out as \"$224.92\" - with a dollar sign, "
 "and with a comma as well once the value passes a thousand - instead of the plain number "
 "described in point 3 above.\n"
 + KNOWN + "\n---\n"
 "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), "
 "and as per the Sales By Customer report specification version 13 "
 "(S14-R9, S14-R10, S14-R11, S14-R12, S14-R13)."
)

NEW[30287] = (
 "1. Numeric columns are plain numbers — NO currency symbol, thousands separators, or "
 "parentheses; a negative uses a leading minus (for example, -1234.56).\n"
 "2. Money values carry two decimals; Hrs Worked / Hrs Invoiced / Inv. Hrs carry their full "
 "stored precision; Inv. Hrs keeps its leading + or - sign.\n"
 "3. Margin % is a plain number to one decimal (for example, 45.2) with no % sign, and the cell "
 "is EMPTY where Margin % is undefined (Subtotal ≤ 0).\n"
 "4. The \"Sales Representative\" name carries the \"(Inactive)\" tag when applicable; the "
 "on-screen (N) count is NOT embedded in the name.\n"
 "5. Text fields are quoted per standard CSV escaping; both CSVs are monochrome (Inv. Hrs "
 "conveys direction only by its sign).\n"
 "6. Note for the tester: the product owner has ruled that the full word \"Sales Representative\" "
 "replaces the short \"Sales Rep\" everywhere. If the screen or file still shows \"Sales Rep\", "
 "mark this test Failed and report it as the pending rename — do not change the test.\n"
 "On this build the money in the spreadsheet file comes out as \"$1,979.40\" - with a dollar sign "
 "and a comma - instead of the plain number described in point 1 above.\n"
 + KNOWN + "\n---\n"
 "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), "
 "and as per the Sales By Representative report specification version 15 (S14-R17)."
)

NEW[30588] = (
 "1. Both downloads include only the columns currently shown, in the same left-to-right order as "
 "the screen, with Total Cost last.\n"
 "2. Both downloads honor the current date, category, vendor, location, and part-search filters, "
 "and apply the current sort.\n"
 "3. Both downloads include a totals row labeled \"Totals\" matching the on-screen totals (the "
 "full-filtered-set totals).\n"
 "4. Each download (PDF and CSV) carries a \"Locations:\" line naming the location(s) the report "
 "was scoped to (exact position in the file is confirmed in the build).\n"
 "5. Note for the tester: the files carry the Location column when Location is turned ON in the "
 "column-selection control (it sits between Vendor and Qty). It does not appear just because you "
 "have more than one location selected.\n"
 "On this build the spreadsheet file ignores the columns you picked and puts them in a different "
 "order from the screen, so point 1 above will not match - record what you see and carry on.\n"
 + KNOWN + "\n---\n"
 + DNA + "\n\n"
 "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), "
 "and as per the Inventory Value report specification version 3 "
 "(S10-R3, S10-R4, S10-R5, S10-R6, S10-R15)."
)

NEW[30589] = (
 "1. Money uses two decimals and Margin % one decimal in both files; an undefined Margin % "
 "shows \"—\".\n"
 "2. In the CSV, money values are written as plain numbers with two decimals and NO thousands "
 "separators (so they parse cleanly in a spreadsheet).\n"
 "3. The PDF uses the same on-screen currency formatting with the \"$\" and thousands "
 "separators.\n"
 "On this build the money in the spreadsheet file comes out as \"$11,176.88\" - with a dollar "
 "sign and a comma - instead of the plain number described in point 2 above.\n"
 + KNOWN + "\n---\n"
 "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), "
 "and as per the Inventory Value report specification version 3 (S10-R7)."
)


def norm_refs(s):
    """The ONE declared normalisation (APP-ACTIONS-PLAYBOOK §J): TestRail splits refs on
    commas, trims each entry, rejoins with a bare comma."""
    if s is None:
        return None
    return ','.join(p.strip() for p in str(s).split(','))


def cmp_fields(pre, post, intended_field, intended_value):
    """Return (ok, report). EVERY field compared, not just the intended one."""
    diffs = []
    keys = sorted(set(pre) | set(post))
    compared = 0
    for k in keys:
        if k in VOLATILE:
            continue
        a, b = pre.get(k), post.get(k)
        if k == 'refs':
            a, b = norm_refs(a), norm_refs(b)
        compared += 1
        if k == intended_field:
            if b != intended_value:
                diffs.append((k, 'INTENDED-VALUE-NOT-WRITTEN', repr(intended_value)[:400], repr(b)[:400]))
        else:
            if a != b:
                diffs.append((k, 'COLLATERAL-CHANGE', repr(a)[:400], repr(b)[:400]))
    return (not diffs), dict(fields_compared=compared, diffs=diffs)


def main():
    dry = '--apply' not in sys.argv
    snap = {c['id']: c for c in json.load(open(SNAP))}
    log = []
    for cid in sorted(NEW):
        pre = snap[cid]
        assert cid not in FOREIGN, f'Rule 38: refusing foreign case {cid}'
        assert pre.get('created_by') == 3, f'Rule 38: refusing case {cid} created_by={pre.get("created_by")}'
        # re-GET immediately before writing: prove no one moved it under us
        s, now = tr.api(f'get_case/{cid}')
        if s != 200:
            print(f'C{cid}: get_case {s} {now}'); return 2
        drift = [k for k in set(pre) | set(now)
                 if k not in VOLATILE and (norm_refs(pre.get(k)) if k == 'refs' else pre.get(k))
                 != (norm_refs(now.get(k)) if k == 'refs' else now.get(k))]
        if drift:
            print(f'C{cid}: DRIFTED since snapshot on {drift} — ABORTING BATCH'); return 3
        newval = NEW[cid]
        if now['custom_expected'] == newval:
            print(f'C{cid}: already identical — no write needed (idempotent)')
            log.append(dict(case=cid, op='skip-identical'))
            continue
        if dry:
            print(f'C{cid}: WOULD WRITE custom_expected  '
                  f'{len(now["custom_expected"])} -> {len(newval)} chars')
            log.append(dict(case=cid, op='dry'))
            continue
        st, resp = tr.api(f'update_case/{cid}', {'custom_expected': newval})
        if st != 200:
            print(f'C{cid}: update_case HTTP {st} {resp} — STOPPING'); return 4
        s2, post = tr.api(f'get_case/{cid}')
        if s2 != 200:
            print(f'C{cid}: verify get_case {s2} — STOPPING'); return 5
        ok, rep = cmp_fields(now, post, 'custom_expected', newval)
        if not ok:
            print(f'C{cid}: *** BYTE VERIFICATION FAILED — THE WRITE FAILED ***')
            for d in rep['diffs']:
                print('   field:', d[0], d[1]); print('   pre :', d[2]); print('   post:', d[3])
            return 6
        print(f'C{cid}: 200 + byte-verified MATCH, {rep["fields_compared"]} fields compared')
        log.append(dict(case=cid, op='update_case', http=st,
                        fields_compared=rep['fields_compared'], verified='MATCH',
                        before_len=len(now['custom_expected']), after_len=len(newval),
                        at=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())))
        time.sleep(0.4)
    out = os.path.join(HERE, 'data', 'exec-c1-%s.jsonl' % ('apply' if not dry else 'dry'))
    with open(out, 'w') as f:
        for r in log:
            f.write(json.dumps(r) + '\n')
    print('log ->', out)
    return 0


if __name__ == '__main__':
    sys.exit(main())
