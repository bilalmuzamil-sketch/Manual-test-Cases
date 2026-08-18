#!/usr/bin/env python3
"""Minimal TestRail v2 client. Creds from /tmp/testrail/creds.json (never committed).
URL separator inside index.php? path is ALWAYS & (core §3.3). Paging via _links.next style."""
import json, base64, urllib.request, urllib.error, time, os

_C = json.load(open('/tmp/testrail/creds.json'))
_HOST = _C['host'].rstrip('/')
_AUTH = base64.b64encode(f"{_C.get('user') or _C['email']}:{_C['password']}".encode()).decode()
_BASE = f"{_HOST}/index.php?/api/v2/"

def _req(method, path, body=None):
    url = _BASE + path
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header('Authorization', 'Basic ' + _AUTH)
    r.add_header('Content-Type', 'application/json')
    for attempt in range(4):
        try:
            with urllib.request.urlopen(r, timeout=60) as resp:
                raw = resp.read().decode()
                return resp.status, (json.loads(raw) if raw else None)
        except urllib.error.HTTPError as e:
            raw = e.read().decode()
            if e.code in (429, 502, 503) and attempt < 3:
                time.sleep(2 * (attempt + 1)); continue
            return e.code, (json.loads(raw) if raw.strip().startswith(('{', '[')) else raw)
        except Exception as e:
            if attempt < 3:
                time.sleep(2 * (attempt + 1)); continue
            return 0, str(e)

def get(path):  return _req('GET', path)
def post(path, body): return _req('POST', path, body)

def get_case(cid):
    return _req('GET', f'get_case/{cid}')

def get_cases(project_id=1, suite_id=1, section_id=None):
    """Paged get_cases with & separators only."""
    out = []
    offset = 0
    while True:
        path = f'get_cases/{project_id}&suite_id={suite_id}&limit=250&offset={offset}'
        if section_id is not None:
            path += f'&section_id={section_id}'
        st, d = _req('GET', path)
        if st != 200:
            raise RuntimeError(f'get_cases {st}: {d}')
        chunk = d['cases'] if isinstance(d, dict) and 'cases' in d else d
        out.extend(chunk)
        if isinstance(d, dict) and d.get('_links', {}).get('next'):
            offset += 250
        elif len(chunk) == 250:
            offset += 250
        else:
            break
    return out

def get_sections(project_id=1, suite_id=1):
    out = []; offset = 0
    while True:
        st, d = _req('GET', f'get_sections/{project_id}&suite_id={suite_id}&limit=250&offset={offset}')
        if st != 200: raise RuntimeError(f'get_sections {st}: {d}')
        chunk = d['sections'] if isinstance(d, dict) and 'sections' in d else d
        out.extend(chunk)
        if len(chunk) == 250: offset += 250
        else: break
    return out

if __name__ == '__main__':
    import sys
    st, d = get('get_case/' + sys.argv[1])
    print(st); print(json.dumps(d, indent=2)[:3000])
