"""Shared helpers for the 16 Nov 2026 named-set writes (PRD v38 + Matt Barge's answers). QA lead's go-ahead, 16 Nov 2026: "Named set, write it
(Recommended)". Credentials only from /tmp/testrail/creds.json (never printed). Retries 403 (proxy), 429 and 5xx; handles the empty reply body of
move_cases_to_section and delete_case. Every operation is logged with C-id, HTTP status and read-back (Rule 50) to log-<name>.jsonl here.
Run from build/tiered-pricing/po-answers-2026-11-16/write."""
import json, os, sys, time, base64, csv, urllib.request, urllib.error
W = os.path.dirname(os.path.abspath(__file__)); TP = os.path.dirname(os.path.dirname(W)); AU = f"{TP}/authoring"
sys.path.insert(0, f"{TP}/../testing-tools")
APPLY = "--apply" in sys.argv
SUITE, TOP, RUN, ASSIGN = 1, 138770, 560, 6
FIELDS = ["title", "template_id", "type_id", "priority_id", "custom_automation_type", "custom_atmstatus", "custom_preconds", "custom_steps", "custom_expected"]
LOCK = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs", "section_id"]
_C = json.load(open("/tmp/testrail/creds.json"))
_AUTH = base64.b64encode(f"{_C.get('email') or _C.get('user')}:{_C['password']}".encode()).decode()
_HOST = (_C.get("host") or "https://shopview.testrail.io").rstrip("/")
LAST = {"status": None}


def api(ep, data=None, tries=10):
    """GET (data None) or POST. Returns the parsed JSON body, or {} for an empty body. Raises RuntimeError(status, body) on a final failure."""
    r = urllib.request.Request(f"{_HOST}/index.php?/api/v2/{ep}", data=(json.dumps(data).encode() if data is not None else None),
                               headers={"Authorization": "Basic " + _AUTH, "Content-Type": "application/json"})
    for a in range(tries):
        try:
            resp = urllib.request.urlopen(r, timeout=120); LAST["status"] = resp.status
            body = resp.read()
            return json.loads(body) if body.strip() else {}
        except urllib.error.HTTPError as e:
            LAST["status"] = e.code; body = e.read()[:400].decode("utf-8", "replace")
            if e.code in (403, 429, 500, 502, 503, 504) and a < tries - 1:
                if e.code == 403 and "Authentication" in body: raise RuntimeError(e.code, body)
                time.sleep(25 if e.code == 429 else 3 * (a + 1)); continue
            raise RuntimeError(e.code, body)
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == tries - 1: raise RuntimeError(0, str(e)[:200])
            time.sleep(3 * (a + 1))


def paged(ep, key):
    out, off = [], 0
    while True:
        r = api(f"{ep}&limit=250&offset={off}"); c = r[key] if isinstance(r, dict) else r; out += c
        if len(c) < 250: return out
        off += 250


def logger(name):
    f = open(f"{W}/log-{name}.jsonl", "a")
    def L(rec):
        rec = {"at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "apply": APPLY, **rec}
        f.write(json.dumps(rec, ensure_ascii=False) + "\n"); f.flush(); return rec
    return L


def prop(): return json.load(open(f"{AU}/proposals.json"))
def secs(): return json.load(open(f"{AU}/sections.json"))["sections"]
def idmap(): return {r["key"]: r for r in csv.DictReader(open(f"{TP}/testrail-id-map.csv"))}
def impact(): return json.load(open(f"{TP}/po-answers-2026-11-16/IMPACT-CASES.json"))
def last_readback(cid):
    p = f"{TP}/write/applied/C{cid}-after.json"
    return json.load(open(p)) if os.path.exists(p) else None
def norm_refs(s): return (s or "").replace(" ", "")


def readiness():
    import tester_readiness_check as TRC
    TRC.require(TP)          # Rule 138: refuses (exits) on any hard problem
