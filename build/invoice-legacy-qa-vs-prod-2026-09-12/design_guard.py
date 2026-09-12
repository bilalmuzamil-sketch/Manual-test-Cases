#!/usr/bin/env python3
"""DESIGN-MODE GUARD  (Standing Rule 75: configuration first)

Other testers switch this org between Legacy and Modern while we work.
NEVER capture, measure or judge an invoice without running this first.

  python3 design_guard.py <invoice_id> [expected: legacy|modern]

Exit 0 = the document is in the expected design.  Exit 3 = WRONG DESIGN,
the capture is invalid, do not use it.  Exit 4 = could not tell.
"""
import subprocess, sys, io, os
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))

# The two designs are distinguishable with certainty, two ways each.
SIGNATURE = {
    'legacy': dict(fonts={'Nunito'},  words=['Service Order', 'Bill To', 'Remit payment to']),
    'modern': dict(fonts={'Inter'},   words=['Work Order', 'ADDRESSES', 'WORK PERFORMED']),
}

def fetch(invoice_id, env='prod'):
    if env == 'prod':
        out = subprocess.run([f'{HERE}/api.sh', 'GET',
              f'/api/invoices/preview?invoice_id={invoice_id}&type=pdf'],
              capture_output=True).stdout
    else:
        raise SystemExit('qa fetch: use the qa cookie path')
    i = out.rfind(b'__HTTP:')
    return out[:i], out[i+7:].decode().strip()

def classify(pdf_bytes):
    d = pymupdf.open(stream=pdf_bytes, filetype='pdf')
    fams, text = set(), []
    for b in d[0].get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                fams.add(s['font'].split('-')[0]); text.append(s['text'])
    txt = ' '.join(text)
    scores = {}
    for name, sig in SIGNATURE.items():
        f = len(sig['fonts'] & fams)
        w = sum(1 for x in sig['words'] if x in txt)
        scores[name] = (f, w)
    # a design is IDENTIFIED only when its font matches AND at least one word does
    hits = [n for n, (f, w) in scores.items() if f and w]
    return (hits[0] if len(hits) == 1 else None), fams, scores

if __name__ == '__main__':
    inv = sys.argv[1]
    want = (sys.argv[2] if len(sys.argv) > 2 else 'legacy').lower()
    body, code = fetch(inv)
    if code != '200' or len(body) < 2000:
        print(f'GUARD: could not fetch invoice {inv} (HTTP {code})'); sys.exit(4)
    got, fams, scores = classify(body)
    print(f'GUARD  invoice={inv}  fonts={sorted(fams)}  scores={scores}')
    if got is None:
        print('GUARD: DESIGN NOT IDENTIFIABLE - do not use this capture'); sys.exit(4)
    if got != want:
        print(f'GUARD: *** WRONG DESIGN *** document is {got.upper()}, expected {want.upper()}')
        print('GUARD: someone switched the org design. Switch it back before capturing,')
        print('GUARD: and DISCARD anything already measured in this run.')
        sys.exit(3)
    print(f'GUARD: OK - document is {got.upper()} as expected')
    sys.exit(0)

# ---------------------------------------------------------------------------
# HOW TO SWITCH THE DESIGN (found live 2026-09-12, production)
#
#   READ   GET  /api/organizations/invoice-settings/view   -> data.documentDesign
#                                                             = 'legacy' | 'modern'
#
#   WRITE  *** the API does NOT accept it. ***
#          POST /api/organizations/invoice-settings/change returns 200 and
#          silently ignores documentDesign / document_design / design /
#          invoice_design / documentDesignType / document_type / template
#          (all six tried live, all 200, value never moved).
#
#          The ONLY thing that writes it is the UI toggle:
#            Settings -> Invoice tab -> "Legacy invoice layout" -> Save Details
#          The toggle sits at the FAR RIGHT of its row (x ~1410 at 1500px wide),
#          not beside its label. Click the .q-toggle host by coordinate; the
#          hidden input's .checked lags, so do not assert on it - assert on
#          GET .../invoice-settings/view afterwards.
#          Working script: switch_design.mjs / probe_toggle.mjs in this folder.
#
#   Browser needs all THREE localStorage keys or it bounces to /login:
#     user, token, fe_permissions_wrapper  (playbook R.2), plus the MITM bridge.
# ---------------------------------------------------------------------------
