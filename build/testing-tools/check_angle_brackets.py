#!/usr/bin/env python3
"""check_angle_brackets.py — the Rule/core-3.8 pre-import gate.

TestRail's HTML pipeline EATS anything that looks like a tag, so a placeholder written
`<query>` is destroyed on import and cannot be recovered from the live case afterwards
(only the local source still knows what it said). This gate is therefore a PRE-FLIGHT,
never an audit.

Run it over case sources and generated import CSVs BEFORE any add_case / update_case /
CSV import:

    python3 build/testing-tools/check_angle_brackets.py build/<project>/cases/
    python3 build/testing-tools/check_angle_brackets.py build/<project>/testrail-import/*.csv
    python3 build/testing-tools/check_angle_brackets.py --selftest

Exit 0 = clean · exit 1 = at least one hit (REFUSE to import) · exit 2 = bad usage.

THE FIX IS SQUARE BRACKETS: `[query]`, not `<query>`. They pass through untouched, so
the assertion survives. Deleting the placeholder instead loses real information -- the
point being made is usually "the message echoes what you typed".

Scar: 2026-08-25, four cases across the six August suites reached TestRail with 7 field
instances destroyed (C44864 <query>, C44875 <q>, C44892 <that customer>, C45055
<typed text>); earlier, TU-DAY-01/C30418 imported as "Expand 's daily breakdown".
"""
import sys
import os
import re
import json
import glob

# A tag-like run: <word ...>. Deliberately NOT matching a lone "<" or "a < b", because a
# scanner that cries wolf gets switched off and then protects nothing.
TAGLIKE = re.compile(r'<[A-Za-z/!][^<>\n]{0,60}>')

# Real HTML we legitimately store in case text (line breaks, and what TestRail itself
# renders). These are not placeholder bugs, so they are not reported.
ALLOWED = {
    'br', 'br/', 'br /', 'p', '/p', 'ol', '/ol', 'li', '/li', 'ul', '/ul',
    'hr', 'hr/', 'hr /', 'strong', '/strong', 'em', '/em', 'b', '/b', 'i', '/i',
    'code', '/code', 'pre', '/pre',
}

TEXT_EXT = {'.json', '.csv', '.md', '.txt', '.tsv'}


def is_allowed(tag_body: str) -> bool:
    inner = tag_body[1:-1].strip()
    if inner.lower() in ALLOWED:
        return True
    # <a href="..."> and </a> are TestRail's own autolink output
    if inner.lower().startswith('a ') or inner.lower() == '/a':
        return True
    return False


def scan_text(text: str):
    """yield (lineno, tag, line) for each offending tag-like run"""
    for i, line in enumerate(text.splitlines(), 1):
        for m in TAGLIKE.finditer(line):
            if not is_allowed(m.group(0)):
                yield i, m.group(0), line.strip()


def iter_files(paths):
    for p in paths:
        if os.path.isdir(p):
            for root, _dirs, files in os.walk(p):
                for f in files:
                    if os.path.splitext(f)[1].lower() in TEXT_EXT:
                        yield os.path.join(root, f)
        elif os.path.isfile(p):
            yield p
        else:
            for g in glob.glob(p):
                if os.path.isfile(g):
                    yield g


def selftest() -> int:
    ok = True
    bad = '{"title": "No matches shows \'No results for <query>\' plus buttons"}'
    hits = list(scan_text(bad))
    print(f"  [{'PASS' if hits else 'FAIL'}] <query> placeholder is caught")
    ok = ok and bool(hits)

    good = '{"title": "No matches shows \'No results for [query]\' plus buttons"}'
    hits = list(scan_text(good))
    print(f"  [{'PASS' if not hits else 'FAIL'}] [query] square-bracket form is NOT flagged")
    ok = ok and not hits

    markup = '<p>1. Open the palette.<br>\n2. Type a query.</p>'
    hits = list(scan_text(markup))
    print(f"  [{'PASS' if not hits else 'FAIL'}] legitimate <p>/<br> markup is NOT flagged")
    ok = ok and not hits

    maths = 'The count is < 5 and a > b in that column.'
    hits = list(scan_text(maths))
    print(f"  [{'PASS' if not hits else 'FAIL'}] a bare comparison operator is NOT flagged")
    ok = ok and not hits

    print("\nSELFTEST:", "ALL PASSED" if ok else "*** FAILED ***")
    return 0 if ok else 1


def main(argv) -> int:
    if not argv:
        print(__doc__)
        return 2
    if argv[0] == '--selftest':
        return selftest()

    total = 0
    files = 0
    for path in iter_files(argv):
        try:
            with open(path, encoding='utf-8', errors='replace') as fh:
                text = fh.read()
        except OSError as e:
            print(f"  ! could not read {path}: {e}")
            continue
        files += 1
        for lineno, tag, line in scan_text(text):
            total += 1
            print(f"{path}:{lineno}: {tag}")
            print(f"    {line[:150]}")

    if total:
        print(f"\n*** {total} angle-bracket placeholder(s) in {files} file(s) scanned. "
              f"DO NOT IMPORT. ***")
        print("Replace each <thing> with [thing] -- square brackets survive TestRail's "
              "HTML pipeline; angle brackets never do (core 3.8).")
        return 1
    print(f"angle-bracket gate clean -- {files} file(s) scanned, 0 placeholders at risk")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
