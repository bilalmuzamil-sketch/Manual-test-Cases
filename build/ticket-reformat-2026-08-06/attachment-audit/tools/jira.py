"""Jira read/write over the live browser session cookies. Read-only helpers plus a
description-only PUT. Cookies live in /tmp and are NEVER written to the repo."""
import json, subprocess, os, re

CJ = '/tmp/atlassian/cookies.json'
_cj = json.load(open(CJ))
_items = _cj if isinstance(_cj, list) else _cj.get('cookies', [])
CK = '; '.join(f"{c['name']}={c['value']}" for c in _items)
BASE = 'https://shopview.atlassian.net'


def _curl(args, out):
    r = subprocess.run(['curl', '-s', '-g', '-o', out, '-w', '%{http_code}'] + args,
                       capture_output=True, text=True)
    code = r.stdout.strip()
    try:
        return code, json.load(open(out))
    except Exception:
        return code, open(out, errors='replace').read()[:800]


def get(path, out='/tmp/_aa_get.json'):
    return _curl(['-H', f'Cookie: {CK}', '-H', 'Accept: application/json', BASE + path], out)


def put(path, payload, out='/tmp/_aa_put.json'):
    p = '/tmp/_aa_payload.json'
    json.dump(payload, open(p, 'w'))
    return _curl(['-X', 'PUT', '-H', f'Cookie: {CK}', '-H', 'Content-Type: application/json',
                  '-H', 'Accept: application/json', '-H', f'Origin: {BASE}',
                  '-H', f'Referer: {BASE}/jira/software/projects/SV/issues',
                  '--data-binary', '@' + p, BASE + path], out)


def issue(key, out=None):
    """Full issue read, everything, so any field movement is detectable."""
    return get(f'/rest/api/3/issue/{key}?expand=names', out or f'/tmp/_aa_{key}.json')


def media_id(attachment_id):
    """Attachment id -> media-services UUID, read off the 303 redirect. The signed
    token on that URL is a secret and is never stored or printed."""
    r = subprocess.run(['curl', '-s', '-D', '-', '-o', '/dev/null', '-H', f'Cookie: {CK}',
                        f'{BASE}/rest/api/3/attachment/content/{attachment_id}'],
                       capture_output=True, text=True)
    m = re.search(r'location:\s*https://api\.media\.atlassian\.com/file/([0-9a-f-]{36})/',
                  r.stdout, re.I)
    return m.group(1) if m else None


def media_nodes(adf):
    """Every media node in an ADF document, as (media_id, alt)."""
    out = []

    def walk(n):
        if isinstance(n, dict):
            if n.get('type') == 'media':
                a = n.get('attrs', {})
                out.append((a.get('id'), a.get('alt') or a.get('collection') or ''))
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(adf or {})
    return out
