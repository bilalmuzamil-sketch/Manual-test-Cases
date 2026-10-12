"""Read-only Google Analytics (GA4) access for report checks. The token lives ONLY in /tmp/google/ga-token.json
(chmod 600, never committed — Rule 82). Get one: developers.google.com/oauthplayground > Google Analytics Data API v1beta
+ Admin API v1beta > analytics.readonly > Authorize > Exchange > Access token (valid 1 hour)."""
import json, urllib.request, urllib.error
TOK = json.load(open('/tmp/google/ga-token.json'))['access_token']
def call(method, url, body=None):
    req = urllib.request.Request(url, method=method, data=None if body is None else json.dumps(body).encode(),
                                 headers={'Authorization': 'Bearer ' + TOK, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r: return r.status, json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b'{}')
def admin(path): return call('GET', 'https://analyticsadmin.googleapis.com/v1beta/' + path)
def report(prop, body): return call('POST', f'https://analyticsdata.googleapis.com/v1beta/{prop}:runReport', body)
def metadata(prop): return call('GET', f'https://analyticsdata.googleapis.com/v1beta/{prop}/metadata')
