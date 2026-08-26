#!/usr/bin/env python3
"""Push the Global Search V1 regression suite to TestRail (authorized 2026-08-26).

Creates section "Global Search V2 - V1 Regression Suite" under group 6720 and adds the
20 regression cases, then backfills the id-map. Idempotent: re-running updates existing
cases by title instead of duplicating. Read-only creds from /tmp. No case is deleted.
"""
import urllib.request, json, base64, ssl, csv, re, html as H, time

creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
EMAIL = creds["CLAUDE_USERNAME"]; KEY = creds["TESTRAIL_API_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
GROUP = 6720
SECTION_NAME = "Global Search V2 - V1 Regression Suite"

def call(path, body=None, tries=4):
    for t in range(tries):
        try:
            data = json.dumps(body).encode() if body is not None else None
            r = urllib.request.Request(BASE + path, data=data, method="POST" if body is not None else "GET")
            r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
            if body is not None: r.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(r, context=CTX, timeout=120) as x:
                raw = x.read().decode().strip(); return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            if e.code == 429 and t < tries - 1: time.sleep(2 * (t + 1)); continue
            raise
        except (urllib.error.URLError, ConnectionError, OSError):
            if t < tries - 1: time.sleep(2 * (t + 1)); continue
            raise

def paged(path, key):
    out = []; off = 0
    while True:
        r = call(f"{path}&limit=250&offset={off}")
        b = r[key] if isinstance(r, dict) and key in r else r
        out += b
        if len(b) < 250: break
        off += 250
    return out

def esc(s): return H.escape(str(s), quote=False)
def strip_num(x): return re.sub(r'^\s*\d+\.\s*', '', str(x)).strip()
def to_ol(v):
    if v is None: v = []
    if isinstance(v, str): v = [l for l in v.split("\n") if l.strip()]
    return "<ol>\n" + "".join(f"<li>{esc(strip_num(x))}</li>\n" for x in v if str(x).strip()) + "</ol>\n"
def expected_html(exp):
    parts = re.split(r'\n\s*---\s*\n', exp, maxsplit=1)
    body = [strip_num(l) for l in parts[0].split("\n") if l.strip()]
    out = "<ol>\n" + "".join(f"<li>{esc(l)}</li>\n" for l in body) + "</ol>\n"
    if len(parts) > 1 and parts[1].strip():
        out += "\n<hr />\n"
        for para in re.split(r'\n\s*\n', parts[1].strip()):
            out += f"\n<p>{esc(para.strip())}</p>\n"
    return out

# sections under GROUP
secs = paged("get_sections/1&suite_id=1", "sections")
sid = next((s["id"] for s in secs if s["name"] == SECTION_NAME and s.get("parent_id") == GROUP), None)
if sid is None:
    sid = call("add_section/1", {"suite_id": 1, "parent_id": GROUP, "name": SECTION_NAME})["id"]
    print("created section", SECTION_NAME, "->", sid)
else:
    print("section exists ->", sid)

# existing cases in this section (idempotent)
existing = {c["title"]: c["id"] for c in paged("get_cases/1&suite_id=1", "cases") if c["section_id"] == sid}

cases = json.load(open("build/global-search/regression-2026-08-26/cases/regression-cases.json"))
newmap = {}; added = updated = 0
for c in cases:
    fields = {"title": c["title"][:250],
              "custom_preconds": to_ol(c.get("preconditions")),
              "custom_steps": to_ol(c.get("steps")),
              "custom_expected": expected_html(c["expected"]),
              "refs": (c.get("refs") or "")[:250]}
    if c["title"] in existing:
        cid = existing[c["title"]]; call(f"update_case/{cid}", fields); updated += 1
    else:
        f2 = dict(fields); f2["custom_atmstatus"] = 1; f2["custom_automation_type"] = 0
        cid = call(f"add_case/{sid}", f2)["id"]; added += 1
    newmap[c["id"]] = cid

rows = [[c["id"], f"C{newmap[c['id']]}", c["title"], c["area"], c.get("refs", "")] for c in cases]
with open("build/global-search/regression-2026-08-26/testrail-id-map.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["internal_id", "testrail_case_id", "title", "section", "refs"]); w.writerows(rows)

live = [c for c in paged("get_cases/1&suite_id=1", "cases") if c["section_id"] == sid]
print(f"added {added}, updated {updated}; section now has {len(live)} cases; id-map backfilled {len(rows)}")
