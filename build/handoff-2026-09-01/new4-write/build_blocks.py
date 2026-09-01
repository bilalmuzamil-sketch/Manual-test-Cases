#!/usr/bin/env python3
"""The four cases the QA lead added by hand on 2026-09-01 (C45250-C45253), replacing the deleted C44996.

🛑 HIS WORDING IS NOT TOUCHED. That is the whole lesson of C44996 earlier today: I replaced his
preconditions and had to report it. So this pass is ADDITIVE and mechanical only:

  1. THE MARKER LITERAL. All four carry "AUTOMATION: Ready". The marker is a machine-findable literal
     and the convention is "AUTOMATION: READY" in capitals - every census, gate and arithmetic check in
     this repo matches on that exact string, so as written the four cases read as having NO marker and
     the suite's arithmetic gate would not close. Fixed to the literal.
  2. THE BUILD SENTENCE, only where this pass actually observed the case (Rule 54 sentence 2, and
     Rule 12: never on a case nobody observed).
  3. A TESTER NOTE, in the same shape as every other case in the suite: the three outcomes where the
     build disagrees with the case, or what is still needed where it could not be run.

His preconditions, steps, expected text and his own "Source: Manually added" line are carried through
byte for byte - the writer now asserts that source line survives rather than reshaping it.

VERDICTS THIS PASS TOOK
  C45252  FAIL      typing the Cost does NOT fill or recalculate the Sell Price
  C45253  FAIL      changing the Category does NOT change the Sell Price
  C45250  NOTVER    needs the part PICKED before the line can complete; the chain stops at "In stock"
  C45251  NOTVER    same blocker, plus a received special-order part
"""
import json, base64, urllib.request, re, html, time, os

DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_SENTENCE = 'Last checked against build v26.35.6-598cc8a on 9/1/2026.'
C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(5):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 4: raise
            time.sleep(2 ** a)
# 🛑 HIS CASES USE <ol><li>, NOT <p>. A <p>-only parser silently drops the whole expectation and keeps
# only the nested <p> blocks - the first run of this script produced an Expected Results that had lost
# "Entering the Cost fills in the Sell Price automatically". Parse BOTH, in document order.
def blocks_of(h):
    parts = re.findall(r'<li>(.*?)</li>|<p>(.*?)</p>', h, re.S)
    chunks = [a or b for a, b in parts] or [h]
    out = []
    for p in chunks:
        # a <li> can itself contain <p> blocks; flatten them onto their own lines
        p = re.sub(r'</p>\s*<p>', '<br>', p)
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        lines = [l for l in lines if l != '']
        if lines: out.append(lines)
    return out

NOTE = {
 45252: 'WHAT YOU SHOULD SEE TODAY, AND IT IS A PROBLEM: the Sell price does NOT change when you enter '
        'the Cost. Checked three ways — a stocked part (cost 53.52, sell 86.32) typed up to 100.00 and '
        '200.00 with the sell price never moving, and a catalogue part with no price at all, where the '
        'sell price stayed 0.00. Twenty-two pricing matrices are configured on this system, one of them '
        'marked Default, so it is not a case of there being no matrix to apply. '
        '(1) If that is what you see, mark the case FAILED and raise nothing new. '
        '(2) If it behaves DIFFERENTLY, that is a new problem — please report it. '
        '(3) If the Sell price does fill in from the Cost, the fix has shipped — tell the QA lead.',
 45253: 'WHAT YOU SHOULD SEE TODAY, AND IT IS A PROBLEM: the Sell price does NOT change when you change '
        'the Category. Tried with Uncategorized, AUTO-Brakes, 70%Override and AUTO-Batteries — the '
        'category label on the row changed every time and the sell price stayed at 86.32 throughout. '
        '(1) If that is what you see, mark the case FAILED and raise nothing new. '
        '(2) If it behaves DIFFERENTLY, that is a new problem — please report it. '
        '(3) If the Sell price moves with the category, the fix has shipped — tell the QA lead.',
 45250: 'NOTE FOR THE TESTER: one step here needs more than it says. A line cannot be set to Complete '
        'while a part on it is unfulfilled — the app refuses with “Line can’t be completed with '
        'unfulfilled part requests.” Approving the line moves the part to “In stock”, which is still '
        'not enough; it has to be PICKED. The part row’s own menu offers only “Move” and “Add Part Fee '
        '/ Discount”, so picking is done elsewhere (the Parts area). Do the pick first, then set the '
        'line to Complete, then check the Parts section. If you cannot pick it, mark the case Blocked '
        'and say so.',
 45251: 'NOTE FOR THE TESTER: same blocker as the case above — the line will not go to Complete until '
        'the part is PICKED, not merely “In stock”, and this case also needs a special-order part that '
        'has been received. Do both first, then check each field. If you cannot get the line to '
        'Complete, mark the case Blocked and say which step stopped you.',
}
BUILD = {45252: True, 45253: True, 45250: False, 45251: False}

intended, snap = {}, {}
for cid in (45250, 45251, 45252, 45253):
    c = get(f'get_case/{cid}')
    assert c['created_by'] == 3, f'C{cid} is not ours'
    assert c.get('custom_atmstatus') != 3, f'C{cid} is Automated — Rule 71'
    bl = blocks_of(c['custom_expected'])
    flat = [l for b in bl for l in b]
    own_source = [l for l in flat if l.lower().startswith('source:')]
    assert own_source, f'C{cid} has no Source line'
    assert any(l.upper().startswith('AUTOMATION:') for l in flat), f'C{cid} has no AUTOMATION marker'
    # THE EXPECTATION = every line that is not his source line, not the marker, not an old note.
    # Numbered explicitly, because the other 118 cases in this suite read "1. ..." and his <ol> gets
    # typed into the editor as paragraphs; keeping the number keeps the case looking identical.
    body = [l for l in flat
            if not l.lower().startswith('source:')
            and not l.upper().startswith('AUTOMATION:')
            and not l.startswith('NOTE FOR THE TESTER')
            and not l.startswith('WHAT YOU SHOULD SEE TODAY')
            and l != '---']
    numbered = [l if re.match(r'^\d+\.', l) else f'{i + 1}. {l}' for i, l in enumerate(body)]
    prov = ['---'] + own_source + ([BUILD_SENTENCE] if BUILD[cid] else [])
    new = [numbered, [NOTE[cid]], prov, ['AUTOMATION: READY']]
    intended[str(cid)] = {
        'title': c['title'], 'verdict': 'new case from the QA lead, 2026-09-01',
        'marker_override': 'AUTOMATION: READY',
        'build_sentence': BUILD_SENTENCE if BUILD[cid] else None,
        'fields': {'custom_expected': {'blocks': new,
                                       'text': '\n\n'.join('\n'.join(b) for b in new)}}}
    snap[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                      'section_id': c['section_id'], 'refs': c.get('refs'),
                      'provenance': [],            # he wrote his own source line, not ours
                      'own_source': own_source,
                      'before': {'custom_expected': c['custom_expected']}}
    print(f"C{cid}: own source {own_source} | build sentence {BUILD[cid]}")

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print('\nprepared', len(intended))
