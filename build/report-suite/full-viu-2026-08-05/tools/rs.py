"""Report Suite live-observation harness, 2026-08-05 full VIU pass.
RAW COOKIES ONLY - never calls POST /api/quick-login (it rotates the shared
sv_sso_session and sibling workers are using it). Secrets read from /tmp at
runtime, never committed.
"""
import json, os, subprocess, time, hashlib

CK = '/tmp/rs-viu/cookie-header.txt'
APP = 'https://sv8582.qa.shopview.com'
BASE = 'https://sv8582api.qa.shopview.com'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
EV = '/tmp/rs-viu/ev'
os.makedirs(EV, exist_ok=True)

def cookie():
    return open(CK).read().strip()

def _curl(args, out):
    r = subprocess.run(['curl','-s','-g','-o',out,'-w','%{http_code}|%{size_download}',
                        '--max-time','120']+args, capture_output=True, text=True)
    code,size = (r.stdout.strip().split('|')+['0'])[:2]
    return int(code or 0), int(size or 0)

def api(path, method='GET', body=None, tag=None, raw=False):
    """GET/POST an API path with raw cookies. Returns (status, parsed_or_bytes, file)."""
    url = path if path.startswith('http') else BASE + path
    out = f'{EV}/{tag}.json' if tag else '/tmp/rs-viu/_t.json'
    args = ['-H', f'Cookie: {cookie()}', '-H', f'User-Agent: {UA}',
            '-H', 'Accept: application/json', '-H', f'Origin: {APP}',
            '-H', f'Referer: {APP}/', '-X', method, url]
    if body is not None:
        args = ['-H','Content-Type: application/json','--data-binary',json.dumps(body)] + args
    st, size = _curl(args, out)
    if raw:
        return st, open(out,'rb').read(), out
    try:
        return st, json.load(open(out)), out
    except Exception:
        return st, open(out, errors='replace').read()[:800], out

def download(path, out, accept='*/*'):
    """Download an export (csv/pdf/xlsx). Returns (status, bytes, sha256, path)."""
    url = path if path.startswith('http') else BASE + path
    args = ['-H', f'Cookie: {cookie()}', '-H', f'User-Agent: {UA}',
            '-H', f'Accept: {accept}', '-H', f'Origin: {APP}',
            '-D', out + '.hdr', url]
    st, size = _curl(args, out)
    b = open(out,'rb').read()
    return st, len(b), hashlib.sha256(b).hexdigest()[:16], out

def build_marker():
    """Read the live build marker. Returns dict."""
    out='/tmp/rs-viu/_idx.html'
    st,_=_curl(['-D','/tmp/rs-viu/_idx.hdr',APP+'/'], out)
    h=open('/tmp/rs-viu/_idx.hdr',errors='replace').read()
    body=open(out,errors='replace').read()
    import re
    ver=(re.search(r'app-version"\s+content="([^"]+)"',body) or [None,None])[1]
    lm=(re.search(r'(?im)^last-modified:\s*(.+)$',h) or [None,None])[1]
    et=(re.search(r'(?im)^etag:\s*(.+)$',h) or [None,None])[1]
    return dict(http=st, version=ver, last_modified=(lm or '').strip(),
                etag=(et or '').strip(),
                sha256=hashlib.sha256(body.encode()).hexdigest(),
                at=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()))
