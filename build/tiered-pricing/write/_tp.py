"""Shared helpers for the Tiered Pricing TestRail write scripts (consolidation, 14 Nov 2026). DRY RUN unless --apply, and --apply is run only by
the coordinator with the QA lead's go-ahead (Rule 6). A dry run READS TestRail (GET only) so its plan is checked against the live folder; it never
writes. Credentials: /tmp/testrail/creds.json through build/dashboards/currency-2026-10-14/apply/trlib.py (never printed). Every operation is
logged with C-id, HTTP status and read-back (Rule 50) to log-<name>.jsonl beside these scripts. Patterns: build/founder-mode/internal-work-orders/
(authoring/create.py, authoring/make_run.py, layout-stress-2026-11-14/create_layout_stress.py, po-answers-2026-11-12/write-v14/)."""
import json, os, sys, csv, time, base64, uuid, urllib.request, urllib.error
W = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(W); AU = f"{P}/authoring"
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); sys.path.insert(0, f"{P}/../testing-tools")
APPLY = "--apply" in sys.argv
SUITE, TOP, ASSIGN = 1, 138770, 6
RUN_NAME = "Tiered Pricing - Execution"
NOTE = ("Test cases are current as of 11/14/2026. Before you start testing, check whether the PRD, design or any other source has changed since "
        "then; if it has, update the test cases first.")
SECJ = f"{AU}/sections.json"; MAPF = f"{P}/testrail-id-map.csv"; RUNJ = f"{W}/run.json"
FIELDS = ["title", "template_id", "type_id", "priority_id", "custom_automation_type", "custom_atmstatus", "custom_preconds", "custom_steps", "custom_expected"]
PRD_VERSION = "PRD 938213378 page v37 (v0.17); reports PRD 968687617 page v21"


def prop(): return json.load(open(f"{AU}/proposals.json"))
def secs(): return json.load(open(SECJ))
def mapping():
    return {r["key"]: r for r in csv.DictReader(open(MAPF))} if os.path.exists(MAPF) else {}
def map_add(key, cid, sec, title):
    new = not os.path.exists(MAPF)
    with open(MAPF, "a", newline="") as f:
        w = csv.writer(f)
        if new: w.writerow(["key", "case_id", "section", "title", "link", "prd_version"])
        w.writerow([key, cid, sec, title, f"https://shopview.testrail.io/index.php?/cases/view/{cid}", PRD_VERSION])


def readiness():
    import tester_readiness_check as TRC
    TRC.require(P)          # Rule 138: refuses (exits) on any hard problem; runs on the dry run too, so its result is always seen


def tr():
    from trlib import api, LAST
    return api, LAST


def safe(api, ep, data=None):
    try: return api(ep, data), None
    except SystemExit as e: return None, str(e)[:300]


def logger(name):
    f = open(f"{W}/log-{name}.jsonl", "a")
    def L(rec):
        rec = {"at": time.strftime("%Y-%m-%dT%H:%M:%S"), "apply": APPLY, **rec}
        f.write(json.dumps(rec, ensure_ascii=False) + "\n"); f.flush(); return rec
    return L


def paged(api, ep, key):
    out, off = [], 0
    while True:
        r = api(f"{ep}&limit=250&offset={off}"); c = r[key] if isinstance(r, dict) else r; out += c
        if len(c) < 250: return out
        off += 250


def project_id(api): return api(f"get_suite/{SUITE}")["project_id"]


def tree(api):
    """Every section under TOP (any depth) and every case in TOP or under it, read live (paged)."""
    allsec = paged(api, f"get_sections/{project_id(api)}&suite_id={SUITE}", "sections")
    kids, frontier = [], {TOP}
    while frontier:
        nxt = [s for s in allsec if s.get("parent_id") in frontier]; kids += nxt; frontier = {s["id"] for s in nxt}
    cases = []
    for sid in [TOP] + [s["id"] for s in kids]:
        cases += paged(api, f"get_cases/{SUITE}&section_id={sid}", "cases")
    return kids, cases


def foreign(kids, cases):
    """Sections and cases under TOP that are not ours (Rules 38, 123): ours = the section ids in sections.json and the cases in our map."""
    our_s = {v["id"] for v in secs()["sections"].values() if v.get("id")}
    our_c = {int(r["case_id"]) for r in mapping().values()}
    return [s for s in kids if s["id"] not in our_s], [c for c in cases if c["id"] not in our_c]


def tests(api, run):
    return paged(api, f"get_tests/{run}", "tests")


def attachments(api, cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}


def upload(cid, path):
    c = json.load(open("/tmp/testrail/creds.json"))
    auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
    host = (c.get("host") or "https://shopview.testrail.io").rstrip("/")
    b = uuid.uuid4().hex; name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
        + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"{host}/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + auth, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(6):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code == 429 and a < 5: time.sleep(25); continue
            if e.code < 500 or a == 5: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 5: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))


def creds_ok():
    return os.path.exists("/tmp/testrail/creds.json")
