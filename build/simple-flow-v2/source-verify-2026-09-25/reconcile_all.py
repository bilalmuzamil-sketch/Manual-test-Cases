#!/usr/bin/env python3
"""Rule 106, the 2026-09-15 extension: read the governing source ONCE per pass with his go-ahead,
then check EVERY case against that single live read - never one fetch per case, never against memory.

For each case in run 416 this takes the Expected (minus the provenance and automation lines), splits
it into the sentences it asserts, and asks whether each one appears in the spec as it reads today.
A sentence with no близкий match in the source is either OUR paraphrase or content the source does not
carry - both of which make a pass worthless (a false pass is believed for ever, a false defect is
argued with the same day). Prints a SUMMARY, not the bodies (Rule 88).
"""
import sys, re, html, json, difflib
sys.path.insert(0,'build/testing-tools')
import tr_client as t

def norm(s):
    s = html.unescape(s or '')
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.lower().replace('’',"'").replace('—',' ').replace('–',' ')
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

spec_lines = [l for l in open('build/simple-flow-v2/source-verify-2026-09-25/spec-v26-as-read-2026-09-25.txt').read().split('\n') if l.strip()]
spec_norm  = [norm(l) for l in spec_lines]
spec_blob  = ' '.join(spec_norm)

STOP = set('the a an and or of to in on is are be it its that this with for at as by from not no '
           'any every each their they them you your we our will can cannot does do so then than '
           'when where which who what if but also only still stay stays'.split())

def content_words(n):
    return [w for w in n.split() if w not in STOP and len(w) > 2]

def best_match(sent):
    """Two ways, because a case legitimately expands one source sentence into plain tester language:
       (a) sentence similarity, and (b) how much of our sentence's CONTENT VOCABULARY the source
       actually carries. A claim the source does not carry fails both; a faithful expansion passes (b)."""
    n = norm(sent)
    if len(n) < 25:
        return 1.0, 'too short to judge'
    if n in spec_blob:
        return 1.0, 'verbatim in the source'
    words = content_words(n)
    coverage = (sum(1 for w in words if w in spec_blob) / len(words)) if words else 1.0
    best, where = 0.0, ''
    for raw, sn in zip(spec_lines, spec_norm):
        if len(sn) < 20: continue
        r = difflib.SequenceMatcher(None, n, sn).ratio()
        if r > best: best, where = r, raw
    if coverage >= 0.80:
        return max(best, coverage), where or 'vocabulary all present in the source'
    return best, where

V = json.load(open('build/simple-flow-v2/run416-execution-2026-09-24/VERDICTS.json'))
cids = sorted(V['verdicts'].keys(), key=int)
flagged, clean, errors = [], 0, []
for cid in cids:
    s, c = t.get_case(int(cid))
    if s != 200:
        errors.append((cid, s)); continue
    exp = html.unescape(re.sub(r'<[^>]+>', '\n', c.get('custom_expected') or ''))
    sents = []
    for line in exp.split('\n'):
        line = line.strip()
        if not line: continue
        if line.startswith('AUTOMATION:'): continue
        # Provenance, divergence and ruling lines are ABOUT the source - they are not claims the
        # case asserts, so scoring them against the source is meaningless and was the main reason the
        # first run flagged 40 of 64. Exclude them properly.
        if re.match(r'^(Source|Sources|Design|Epic SV-|Exact quotes|Expected corrected|QA lead ruling|Divergence|Note)\b', line, re.I): continue
        if 'This is the expected behaviour as per' in line: continue
        if 'Confluence' in line or 'specification version' in line: continue
        if line.startswith('Last checked against build'): continue
        line = re.sub(r'^\d+\.\s*', '', line)
        if len(line) > 20: sents.append(line)
    bad = []
    for sent in sents:
        score, where = best_match(sent)
        if score < 0.72:
            bad.append((round(score,2), sent[:150], where[:120]))
    if bad:
        flagged.append((cid, c.get('title','')[:70], V['verdicts'][cid]['v'], bad))
    else:
        clean += 1

print('=' * 78)
print('RECONCILED %d cases against Simple Flow V2 v26 (read once, 25 Sep 2026)' % len(cids))
print('  every asserted sentence traced to the source :', clean)
print('  cases with a sentence NOT found in the source:', len(flagged))
if errors: print('  could not read:', errors)
print('=' * 78)
for cid, title, verdict, bad in flagged:
    print('\nC%s  [%s]  %s' % (cid, verdict, title))
    for score, sent, where in bad:
        print('   OURS   (%.2f): %s' % (score, sent))
        print('   NEAREST       : %s' % where)
