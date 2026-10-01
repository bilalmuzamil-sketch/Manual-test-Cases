#!/usr/bin/env python3
"""Rule 111: correct a stale identifier in a case — THE IDENTIFIER ONLY.

Not the wording, not the provenance line, not a helpful note. Each replacement below was MEASURED
on production first (the record the search actually returns, or a near miss proved to return
nothing), never derived by arithmetic from the old one.

🔴 WHAT IS DELIBERATELY NOT TOUCHED. Seven cases also name `S2-15276`, and every one of them has it
inside a sentence QUOTED FROM THE PRD — "if you typed `S2-15276`, jump straight to that WO". Rule
113 says the Expected Result is the source's own words and changes only when the SOURCE changes, so
those stay exactly as they are: the identifier there is the spec's illustration, not an instruction
to the tester, and the steps tell the tester what to type. Sixteen more flags were `INV-72`-style
references to the V1 INVARIANT register, not identifiers at all.

    python3 correct_identifiers_for_prod.py            # dry run
    python3 correct_identifiers_for_prod.py --confirm
"""
import csv, html, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/tmp/claude-0')
src = open(os.path.join(HERE, 'push_to_testrail.py')).read().split("def main()")[0]
ns = {'__name__': 'notmain', '__file__': os.path.join(HERE, 'push_to_testrail.py')}
exec(compile(src, 'push', 'exec'), ns)
tr = ns['tr']
CONFIRM = '--confirm' in sys.argv

# (case, field, old, new, what the measurement was)
FIXES = [
    ('146208', 'custom_preconds', 'S2-34378', 'S2-955',
     "typing ZZSOFTHIT on production returns work order S2-955 as a fuzzy customer_name match"),
    ('146265', 'custom_preconds', 'P2-2273', 'P2-78',
     "typing ZZSOFTHIT on production returns part sale P2-78 as a fuzzy customer_name match"),
    ('44847', 'custom_preconds', 'S2-15430', 'S2-889',
     "S2-889 is the seeded Fibridge work order on production and the search returns it"),
    ('44847', 'custom_steps', 'S2-15430', 'S2-889', 'same record, named again in the steps'),
    ('44847', 'custom_preconds', 'S2-15431', 'S2-909',
     "S2-909 was PROBED on production and returns nothing - the near miss has to be genuinely absent"),
    ('44847', 'custom_steps', 'S2-15431', 'S2-909', 'same near miss, named again in the steps'),
]


def main():
    done, skipped, failed, touched = [], [], [], {}
    for cid, field, old, new, why in FIXES:
        st, c = tr(f'get_case/{cid}')
        if st != 200:
            failed.append((cid, field, f'get {st}')); continue
        # Rule 71: a case TestRail flags as AUTOMATED (atmstatus 3) is never changed without the
        # QA lead's go-ahead. 1 = Not Automated; automation_type is the intended KIND, not a flag.
        if c.get('custom_atmstatus') == 3:
            skipped.append((cid, 'flagged AUTOMATED — held for the QA lead (Rule 71)')); continue
        body = str(c.get(field) or '')
        if old not in body:
            skipped.append((cid, f'{field}: {old!r} not present (already corrected?)')); continue
        new_body = body.replace(old, new)
        n = body.count(old)
        if not CONFIRM:
            done.append((cid, field, old, new, n, 'DRY RUN'))
            continue
        st2, _ = tr(f'update_case/{cid}', {field: new_body})
        st3, back = tr(f'get_case/{cid}')
        ok = st2 == 200 and st3 == 200 and old not in str(back.get(field) or '') \
            and new in str(back.get(field) or '')
        (done if ok else failed).append((cid, field, old, new, n, f'http {st2}, read-back {"OK" if ok else "MISMATCH"}'))
        if ok:
            touched.setdefault(cid, []).append(f'{field}: {old} -> {new}')

    print(f"\n=== {'APPLIED' if CONFIRM else 'DRY RUN'} — Rule 111 identifier corrections for production")
    for d in done:
        print(f"   C{d[0]:7} {d[1]:17} {d[2]:10} -> {d[3]:10} ({d[4]}x)  {d[5]}")
    for s_ in skipped:
        print(f"   C{s_[0]:7} skipped: {s_[1]}")
    for f_ in failed:
        print(f"   🔴 C{f_[0]} {f_[1]} {f_[2] if len(f_) < 4 else f_[5]}")
    print(f"\n   {len(done)} change(s), {len(skipped)} skipped, {len(failed)} failed")

    if CONFIRM and touched:
        out = os.path.join(HERE, 'RETEST-LIST-PROD.csv')
        with open(out, 'w', newline='') as f:
            w = csv.writer(f)
            w.writerow(['testrail_case', 'link', 'what changed', 'why'])
            for cid, changes in touched.items():
                w.writerow([f'C{cid}',
                            f'https://shopview.testrail.io/index.php?/cases/view/{cid}',
                            '; '.join(changes),
                            'named an identifier production does not hold (Rule 111)'])
        print(f"   retest list -> {out}")
    if not CONFIRM:
        print("\n   Nothing was written. Re-run with --confirm.")


if __name__ == '__main__':
    main()
