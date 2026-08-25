#!/usr/bin/env python3
"""Apply the Global Search v1.2 reconciliation to TestRail, losslessly and in place.

Authorized by the QA lead (2026-08-25). Updates existing cases by C-ID (preserving IDs,
run membership and assignments), moves the 8 quick-action cases to a new Out-of-V1 section,
adds the new V1 cases, re-backfills the id-map, then union-syncs run R415 and re-assigns it
to Bilal (id 3). Idempotent: re-running updates in place and never duplicates (dedupe by title).

Creds: /tmp/shopview-creds.env (Rule 82). Old internal_id->C-ID map: /tmp/gs-oldidmap.csv.
"""
import urllib.request, json, base64, ssl, csv, re, html as H, time, glob

creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
EMAIL = creds["CLAUDE_USERNAME"]; KEY = creds["TESTRAIL_API_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
GROUP = 6720; RUN = 415; BILAL = 3
OUT_AREA = "Global Search - Out of V1 Scope (not tested this release)"

def call(path, body=None, tries=4):
    for t in range(tries):
        try:
            data = json.dumps(body).encode() if body is not None else None
            r = urllib.request.Request(BASE + path, data=data, method="POST" if body is not None else "GET")
            r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
            if body is not None: r.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(r, context=CTX, timeout=120) as x:
                raw = x.read().decode().strip()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            if e.code == 429 and t < tries - 1: time.sleep(2 * (t + 1)); continue
            raise
        except (urllib.error.URLError, ConnectionError, OSError) as e:
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
    items = "".join(f"<li>{esc(strip_num(x))}</li>\n" for x in v if str(x).strip())
    return f"<ol>\n{items}</ol>\n"
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
kids = {}
for s in secs: kids.setdefault(s.get("parent_id"), []).append(s)
def subtree(root):
    out = {}; stack = [root]
    while stack:
        n = stack.pop()
        for c in kids.get(n, []):
            out[c["name"]] = c["id"]; stack.append(c["id"])
    return out
sec_by_name = subtree(GROUP)
def ensure_section(name):
    if name in sec_by_name: return sec_by_name[name]
    r = call("add_section/1", {"suite_id": 1, "parent_id": GROUP, "name": name})
    sec_by_name[name] = r["id"]; print("  created section:", name, "->", r["id"]); return r["id"]

oldmap = {}
for row in csv.DictReader(open("/tmp/gs-oldidmap.csv")):
    if row["testrail_case_id"].strip():
        oldmap[row["internal_id"]] = int(row["testrail_case_id"].strip().lstrip("C"))

local = []
for f in sorted(glob.glob("build/global-search/cases/*.json")):
    local += json.load(open(f))
print("local cases:", len(local), "| existing mapped:", len(oldmap))

live = paged("get_cases/1&suite_id=1", "cases")
sub_ids = set(sec_by_name.values())
live_title2cid = {c["title"]: c["id"] for c in live if c["section_id"] in sub_ids}

updated = added = moved = 0; newmap = {}
for c in local:
    iid = c["id"]; area = c["area"]
    fields = {"title": c["title"][:250],
              "custom_preconds": to_ol(c.get("preconditions")),
              "custom_steps": to_ol(c.get("steps")),
              "custom_expected": expected_html(c["expected"]),
              "refs": (c.get("refs") or "")[:250]}
    if iid in oldmap:
        cid = oldmap[iid]; call(f"update_case/{cid}", fields); newmap[iid] = cid; updated += 1
        if area == OUT_AREA:
            sid = ensure_section(OUT_AREA)
            call(f"move_cases_to_section/{sid}", {"suite_id": 1, "case_ids": [cid]}); moved += 1
    elif c["title"] in live_title2cid:
        cid = live_title2cid[c["title"]]; call(f"update_case/{cid}", fields); newmap[iid] = cid; updated += 1
    else:
        sid = ensure_section(area)
        f2 = dict(fields); f2["custom_atmstatus"] = 1; f2["custom_automation_type"] = 0
        r = call(f"add_case/{sid}", f2); newmap[iid] = r["id"]; added += 1; live_title2cid[c["title"]] = r["id"]
    if (updated + added) % 25 == 0: print(f"  progress: updated {updated}, added {added}, moved {moved}")
print(f"DONE cases: updated {updated}, added {added}, moved {moved}")

rows = [[c["id"], f"C{newmap.get(c['id'],'')}", c["title"], c["area"], c.get("refs", "")] for c in local]
with open("build/global-search/testrail-id-map.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["internal_id", "testrail_case_id", "title", "section", "refs"]); w.writerows(rows)
print("id-map backfilled:", sum(1 for r in rows if r[1] != "C"), "of", len(rows))

allids = sorted(set(newmap.values()))
cur = paged(f"get_tests/{RUN}", "tests")
union = sorted(set(t["case_id"] for t in cur) | set(allids))
call(f"update_run/{RUN}", {"include_all": False, "case_ids": union})
call(f"update_run/{RUN}", {"assignedto_id": BILAL})
res = call(f"add_results_for_cases/{RUN}", {"results": [{"case_id": cid, "assignedto_id": BILAL} for cid in allids]})
print(f"run R{RUN} synced -> {len(union)} cases (was {len(cur)}); reassigned {len(res) if isinstance(res,list) else res} to Bilal")

tests = paged(f"get_tests/{RUN}", "tests")
grp_cases = [c for c in paged("get_cases/1&suite_id=1", "cases") if c["section_id"] in set(subtree(GROUP).values())]
print(f"VERIFY: group has {len(grp_cases)} cases; run R{RUN} {len(tests)} tests, "
      f"{sum(1 for t in tests if t.get('assignedto_id')==BILAL)} to Bilal, statuses={set(t['status_id'] for t in tests)}")
