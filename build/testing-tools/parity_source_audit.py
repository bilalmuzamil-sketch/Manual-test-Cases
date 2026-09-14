#!/usr/bin/env python3
"""Audits that every case in a V1->V2 parity suite is SOURCED TO V1 (Skill 19 §4, Rule 109c).

Rule 109(c): the expected result states the V1 behaviour, and the SOURCE line LEADS WITH the V1
repository - commit, file, lines - naming the V2 document only afterwards, as context.

A case whose SOURCE line presents the V2 specification as the authority for its expectation is
testing the wrong thing. This finds those.

FOUR CHECKS per case:
  refs-has-commit    the case's refs field carries the baseline commit
  prov-has-commit    the provenance block carries it too
  prov-has-v1-file   the provenance cites a real V1 source file (or a DOCUMENTED ABSENCE)
  v1-leads           V1 is named BEFORE ANY V2 artefact - the PRD, the EPIC, a story, a spec
                     version. An epic leading the sentence reads V2-first even when V1 follows.
  has-v1-banner      the case opens with "SOURCE - THIS CASE IS TESTED AGAINST V1"

USAGE
  python3 parity_source_audit.py --config parity.json [--json out.json]

Extra config keys used by this tool:
  "commit"            : "55767168"
  "v1_files"          : ["FetchDataQueryHandler.php", "useGlobalSearch.ts", ...]
  "v2_doc_marker"     : "Product Requirements specification"
  "absence_markers"   : ["ABSENCE of any feature flag"]   # optional: a capability that is an ABSENCE
                        has no file to cite; inventing one would be worse than citing the absence.

Credentials: /tmp/testrail/creds.json   (Rule 82: /tmp only, never committed)
"""
import json, base64, urllib.request, urllib.error, ssl, re, html, time, sys, argparse

CA = '/root/.ccr/ca-bundle.crt'

def make_api(creds):
    host = creds['host'].rstrip('/')
    pw = creds.get('login_password') or creds['password']
    auth = base64.b64encode(f"{creds['user']}:{pw}".encode()).decode()
    try:
        ctx = ssl.create_default_context(cafile=CA)
    except FileNotFoundError:
        ctx = ssl.create_default_context()
    def api(path):
        req = urllib.request.Request(f"{host}/index.php?/api/v2/{path}",
                                     headers={'Authorization': 'Basic ' + auth})
        for attempt in range(4):
            try:
                return json.loads(urllib.request.urlopen(req, context=ctx, timeout=60).read())
            except urllib.error.HTTPError as e:
                if e.code < 500 or attempt == 3:
                    raise SystemExit(f"TestRail HTTP {e.code} on {path}: {e.read()[:200]!r}")
                time.sleep(2 ** attempt)
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(2 ** attempt)
    return api

def paged(api, path, key):
    out, off = [], 0
    while True:
        r = api(f"{path}&limit=250&offset={off}")
        chunk = r[key] if isinstance(r, dict) else r
        out += chunk
        if len(chunk) < 250:
            return out
        off += 250

# TRAP: TestRail wraps text fields in <p> on write, so exact-equality read-back is a false
# negative. Always compare by CONTENT, like this.
def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--config', required=True)
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--json')
    a = ap.parse_args()

    cfg = json.load(open(a.config))
    commit = cfg['commit']
    v1_files = cfg['v1_files']
    v2_marker = cfg.get('v2_doc_marker', 'Product Requirements specification')
    absences = cfg.get('absence_markers', [])
    # the one unmissable opening every parity case must carry
    banner = cfg.get('v1_banner', 'SOURCE - THIS CASE IS TESTED AGAINST V1')
    api = make_api(json.load(open(a.creds)))

    sections = cfg.get('section_ids') or [cfg['section_id']]
    cases = []
    for sec in sections:
        cases += paged(api, f"get_cases/1&suite_id={cfg['suite_id']}&section_id={sec}", 'cases')
    bad, rows = [], []
    for c in sorted(cases, key=lambda x: x['id']):
        expected = plain(c.get('custom_expected'))
        refs = c.get('refs') or ''
        # the provenance block is what follows the '---' separator
        prov = expected.split('---', 1)[1] if '---' in expected else expected
        # A V2 ARTEFACT IS NOT ONLY THE PRD. An epic id, a story id or a spec version leading the
        # sentence reads V2-first to a human even when V1 is mentioned later. 32 cases opened
        # "as per epic SV-9160 and the V1 behaviour recorded in ..." and this audit passed them,
        # because it only looked for the PRD wording. The QA lead caught it. Every V2 artefact
        # now counts.
        v2_markers = [v2_marker] + cfg.get('v2_artefacts', ['epic ', 'SV-9160', 'story ', 'PRD'])
        i_v1 = prov.find(commit)
        v2_hits = [prov.find(m) for m in v2_markers if prov.find(m) != -1]
        i_v2 = min(v2_hits) if v2_hits else -1
        checks = {
            'refs-has-commit':  commit in refs,
            'prov-has-commit':  commit in prov,
            'prov-has-v1-file': any(f in prov for f in v1_files) or any(m in prov for m in absences),
            'v1-leads':         i_v1 != -1 and (i_v2 == -1 or i_v1 < i_v2),
            'has-v1-banner':    banner in prov,
        }
        ok = all(checks.values())
        rows.append({'case_id': c['id'], 'title': c['title'], 'ok': ok,
                     'failing': [k for k, v in checks.items() if not v]})
        if not ok:
            bad.append(c['id'])
            print(f"FIX  C{c['id']}  {c['title'][:52]:54s} {[k for k, v in checks.items() if not v]}")

    print(f"\n{len(cases)} cases | sourced to V1: {len(cases) - len(bad)} | NEED FIX: {len(bad)}")
    if bad:
        print("FIX_IDS=" + ",".join(str(i) for i in bad))
        print("\nEach of these presents the V2 document as the authority for its expectation, or omits\n"
              "the V1 citation entirely. Rewrite the SOURCE line to lead with the V1 repository.")
    else:
        print("PASS - every case states the V1 behaviour and cites V1 as its source (Rule 109c).")
    if a.json:
        json.dump({'commit': commit, 'cases': len(cases), 'need_fix': bad, 'rows': rows,
                   'pass': not bad}, open(a.json, 'w'), indent=1)
        print(f"written: {a.json}")
    sys.exit(0 if not bad else 1)

if __name__ == '__main__':
    main()
