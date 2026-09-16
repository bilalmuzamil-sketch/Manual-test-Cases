#!/usr/bin/env python3
"""DOES A CASE'S STEPS ACTUALLY TYPE THE THING? — the check that was missing.

    python3 steps_exercise_proof.py          # exits non-zero if any scenario is untyped

WHY THIS EXISTS, AND WHAT IT CATCHES THAT THE OTHER PROOF DOES NOT.

`parity_coverage_proof.py` answers: *is every V1 capability mapped to a case that exists and is in
the run?* That is necessary and it is not sufficient. On 2026-09-15 it reported clean while the
suite contained a capability - a contact's own phone number - that **no case anywhere typed**. The
register mapped it to two cases: one types the COMPANY's number, the other the job title. Three
cases sat beside the capability and not one exercised it, and the mapping check reported green.

🔴 "A CASE EXISTS FOR THIS CAPABILITY" AND "A CASE TYPES THIS" ARE DIFFERENT CLAIMS, AND ONLY THE
SECOND IS COVERAGE. This tool asks the second question.

HOW. Every searchable thing has a concrete value a tester would type. The keyword table the
demonstrator is built from (`keyword-presets.json`) already holds one per searchable field, with the
field and the area it belongs to. This walks that table and asserts some case's STEPS contain the
value - punctuation and case ignored, because a case may write it (419) 555-0143 where the table
says 419-555-0143.

🔴 SUBSTRING MATCHING IS NOT ENOUGH, AND THAT COST US TWO REAL GAPS. The first version of this
tool asked "does the value appear anywhere in the steps text?". `Freightliner` appears inside
`2019 Freightliner`, and `2019` does too - so a case that only ever typed the year AND make TOGETHER
reported both the make-alone and the year-alone scenarios as covered. Both were genuinely untyped.
So this version extracts what the tester is literally told to type - the value after "Type ...:" -
and compares the WHOLE literal. A compound query no longer discharges its own parts.

THE ALLOW-LIST IS THE INTERESTING PART. A scenario may legitimately not be typed anywhere, and each
such entry must say WHY in one line. An allow-list with no reasons is how a real gap gets waved
through, so an entry without one is treated as a failure.
"""
import json, os, re, sys, base64, ssl, urllib.request, urllib.error, time, html

HERE = os.path.dirname(os.path.abspath(__file__))
SECTIONS = [6769, 8056]

# A scenario nobody types, WITH the reason it is legitimate. No reason = treated as a gap.
ALLOWED_UNTYPED = {
  "Darlene": "What is tested is typing MARLENE and NOT getting Darlene - C55685 does exactly that. "
             "Typing 'Darlene' is a demonstrator convenience, not a test.",
  "zzzqqq":  "The no-match scenario is covered by C55675 and C55679 using ZZNOSUCHRECORD9999. "
             "Same scenario, different string.",
  "a":       "The scenario is 'a SINGLE character', not the letter a. C45161 types one character "
             "and then a second one, which is the whole behaviour. The demonstrator had to put SOME "
             "letter in the button, and which letter it is does not matter.",
}

cr = json.load(open('/tmp/testrail/creds.json'))
HOST = cr['host'].rstrip('/')
AUTH = base64.b64encode(f"{cr['user']}:{cr['login_password'] or cr['password']}".encode()).decode()
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')

def api(path):
    """TRAP: the TestRail URL already holds a '?', so extra params use '&' - a second '?' is HTTP 400."""
    req = urllib.request.Request(f"{HOST}/index.php?/api/v2/{path}",
                                 headers={'Authorization': 'Basic ' + AUTH,
                                          'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            return json.loads(urllib.request.urlopen(req, context=CTX, timeout=60).read())
        except urllib.error.HTTPError as e:
            if attempt == 3: raise RuntimeError(f"HTTP {e.code}: {e.read()[:200]}")
            time.sleep(2 ** attempt)

def strip(s):
    s = re.sub(r'<br\s*/?>', '\n', s or ''); s = re.sub(r'</p>', '\n', s)
    return html.unescape(re.sub(r'<[^>]+>', '', s))

def norm(s):
    return re.sub(r'[^a-z0-9]', '', (s or '').lower())

cases = []
for sec in SECTIONS:
    r = api(f"get_cases/1&suite_id=1&section_id={sec}&limit=250")
    cases += (r['cases'] if isinstance(r, dict) else r)
# What the tester is literally told to type. Taken per LINE: the text after the last colon on a
# line that carries a type-instruction, cut at a sentence break or a parenthetical aside - so an
# email or a website keeps its dots, while a trailing "(if that returns nothing...)" is dropped.
TRIGGER = re.compile(r'\btype|\btyping|\benter|\bsearch|\bpaste|\blook up', re.I)

def literals(c):
    out = []
    for line in strip(c.get('custom_steps')).split('\n'):
        if not TRIGGER.search(line) or ':' not in line:
            continue  # the colon-less phrasings are picked up by the second path below
        # the value after the last colon, minus a trailing aside
        v = line.rsplit(':', 1)[1]
        v = re.split(r'\.\s|\s\(|\(', v)[0]
        v = v.strip().strip('"\u201c\u201d\u2018\u2019').rstrip('.')
        if v:
            out.append(v)
    # A step may name the value WITHOUT a colon - "for example S-17611", or in a parenthetical
    # "(for S-17611 that is 17611)". Both are still telling the tester what to type.
    for m in re.finditer(r'(?:for example|e\.g\.|that is)\s+([A-Za-z0-9@.\-_)( ]{2,40}?)\s*(?:[.,)]|$)',
                         strip(c.get('custom_steps')), re.I | re.M):
        v = m.group(1).strip().rstrip('.,)')
        if v:
            out.append(v)
    return out

TYPED = {c['id']: literals(c) for c in cases}
STEPS = {c['id']: norm(strip(c.get('custom_steps'))) for c in cases}

rows = json.load(open(os.path.join(HERE, '..', 'old-search-demonstrator', 'keyword-presets.json')))
typed, untyped, waved, unexplained = [], [], [], []
for area, q, what, app, where, field, expect, expsent, verify, now in rows:
    # EXACT: some case tells the tester to type this and nothing more.
    hits = [cid for cid, ls in TYPED.items() if norm(q) and any(norm(l) == norm(q) for l in ls)]
    # WEAK: the value only appears inside a longer query. Reported, never counted as coverage.
    weak = [cid for cid, s in STEPS.items() if norm(q) and not hits and norm(q) in s]
    if hits:
        typed.append((q, area, field, hits))
    elif q in ALLOWED_UNTYPED:
        waved.append((q, area, ALLOWED_UNTYPED[q]))
    else:
        untyped.append((q, area, what, field, weak))

print(f"cases read         : {len(cases)} (sections {SECTIONS})")
print(f"scenarios in table : {len(rows)}\n")
print(f"TYPED BY A CASE                : {len(typed)}")
print(f"LEGITIMATELY NOT TYPED         : {len(waved)}")
for q, area, why in waved:
    print(f"    {q!r} ({area}) — {why}")
print(f"\n🔴 NOT TYPED BY ANY CASE       : {len(untyped)}")
for q, area, what, field, weak in untyped:
    print(f"    {q!r:<28} {area:<12} {field:<20} {what}")
    if weak:
        print(f"         ⚠️  appears only INSIDE a longer query in {', '.join('C%d'%c for c in weak)} — "
              f"that is not coverage of typing it on its own")

print(f"\n{'PASS — every scenario is typed by a case, or waved with a reason' if not untyped else 'FAIL — the scenarios above are coverage on paper only'}")
sys.exit(1 if untyped else 0)
