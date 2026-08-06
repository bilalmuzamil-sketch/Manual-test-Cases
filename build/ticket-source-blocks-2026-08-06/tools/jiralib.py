import json, subprocess, urllib.parse, os
CJ = '/tmp/atlassian/cookies.json'
_cj = json.load(open(CJ))
_items = _cj if isinstance(_cj, list) else _cj.get('cookies', [])
CK = '; '.join(f"{c['name']}={c['value']}" for c in _items)
BASE = 'https://shopview.atlassian.net'

def _curl(args, out):
    r = subprocess.run(['curl','-s','-g','-o',out,'-w','%{http_code}'] + args, capture_output=True, text=True)
    code = r.stdout.strip()
    try:
        return code, json.load(open(out))
    except Exception:
        return code, open(out, errors='replace').read()[:600]

def get(path, out='/tmp/_jl.json'):
    return _curl(['-H', f'Cookie: {CK}', '-H', 'Accept: application/json', BASE+path], out)

def put(path, payload, out='/tmp/_jlp.json'):
    p = '/tmp/_jl_payload.json'
    json.dump(payload, open(p,'w'))
    return _curl(['-X','PUT','-H', f'Cookie: {CK}', '-H','Content-Type: application/json',
                  '-H','Accept: application/json','-H',f'Origin: {BASE}','-H',f'Referer: {BASE}/jira/software/projects/SV/issues',
                  '--data-binary', '@'+p, BASE+path], out)

def issue(key, fields=None, out=None):
    q = '?expand=renderedFields' + (('&fields='+fields) if fields else '')
    return get(f'/rest/api/3/issue/{key}{q}', out or '/tmp/_jl_issue.json')
