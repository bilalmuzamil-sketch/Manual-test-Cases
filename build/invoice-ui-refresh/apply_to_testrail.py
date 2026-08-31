#!/usr/bin/env python3
"""Apply the Invoice UI Refresh v45 source re-verification to TestRail, in place.

Authorized by the QA lead (2026-08-31 source re-verification pass, spec v39->v45).
Updates existing cases by C-ID (preserving IDs, run membership, assignments) using
BLOCK-ONLY HTML (to_ol / expected_html), adds the 2 net-new cases (INV-VIS-10,
INV-VIS-11) into the Document Visual Standard section, re-backfills the id-map, then
union-syncs run R417 (Rule 34, union-only). Idempotent per C-ID; new cases dedupe by title.

Creds: /tmp/shopview-creds.env (Rule 82). Old internal_id->C-ID map: /tmp/inv-oldidmap.csv.
Formatting: block tags only via the proven global-search converters (APP-ACTIONS-PLAYBOOK J).
"""
import urllib.request, urllib.error, json, base64, ssl, csv, re, html as H, time, glob

creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
EMAIL = creds["CLAUDE_USERNAME"]; KEY = creds["TESTRAIL_API_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
GROUP = 6559; RUN = 417

def call(path, body=None, tries=5):
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
            if e.code in (429, 502, 503) and t < tries - 1: time.sleep(2 * (t + 1)); continue
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

# existing internal_id -> C-ID
oldmap = {}
for row in csv.DictReader(open("/tmp/inv-oldidmap.csv")):
    if row["testrail_case_id"].strip():
        oldmap[row["internal_id"]] = int(row["testrail_case_id"].strip().lstrip("C"))
print("existing mapped C-IDs:", len(oldmap))

local = []
for f in sorted(glob.glob("build/invoice-ui-refresh/cases/*.json")):
    local += json.load(open(f))
print("local cases:", len(local))

# section for the new INV-VIS cases: reuse an existing INV-VIS case's section_id
vis_anchor = oldmap.get("INV-VIS-09")
sec_vis = call(f"get_case/{vis_anchor}")["section_id"]
print("Document Visual Standard section_id:", sec_vis)

live = paged("get_cases/1&suite_id=1", "cases")
title2cid = {c["title"]: c["id"] for c in live}

updated = added = 0; newmap = {}
for c in local:
    iid = c["id"]
    fields = {"title": c["title"][:250],
              "custom_preconds": to_ol(c.get("preconditions")),
              "custom_steps": to_ol(c.get("steps")),
              "custom_expected": expected_html(c["expected"]),
              "refs": (c.get("refs") or "")[:250]}
    if iid in oldmap:
        cid = oldmap[iid]; call(f"update_case/{cid}", fields); newmap[iid] = cid; updated += 1
    elif c["title"] in title2cid:
        cid = title2cid[c["title"]]; call(f"update_case/{cid}", fields); newmap[iid] = cid; updated += 1
    else:
        f2 = dict(fields); f2["custom_atmstatus"] = 1; f2["custom_automation_type"] = 0
        r = call(f"add_case/{sec_vis}", f2); newmap[iid] = r["id"]; added += 1
        title2cid[c["title"]] = r["id"]
        print(f"  ADDED {iid} -> C{r['id']}")
print(f"DONE cases: updated {updated}, added {added}")

# backfill id-map (all 89)
rows = [[c["id"], f"C{newmap.get(c['id'],'')}", c["title"], c["area"], c.get("refs", "")] for c in local]
with open("build/invoice-ui-refresh/testrail-id-map.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["internal_id", "testrail_case_id", "title", "section", "refs"]); w.writerows(rows)
print("id-map backfilled:", sum(1 for r in rows if r[1] != "C"), "of", len(rows))

# union-sync R417 (Rule 34, union-only): current tests U all group-6559-subtree cases
secs = paged("get_sections/1&suite_id=1", "sections")
kids = {}
for s in secs: kids.setdefault(s.get("parent_id"), []).append(s["id"])
def subtree(root):
    ids = set(); stack = [root]
    while stack:
        n = stack.pop()
        for cid in kids.get(n, []):
            ids.add(cid); stack.append(cid)
    return ids
sub_ids = subtree(GROUP)
grp_case_ids = [c["id"] for c in paged("get_cases/1&suite_id=1", "cases") if c["section_id"] in sub_ids]
cur = paged(f"get_tests/{RUN}", "tests")
before = len(cur)
union = sorted(set(t["case_id"] for t in cur) | set(grp_case_ids))
call(f"update_run/{RUN}", {"include_all": False, "case_ids": union})
after = len(paged(f"get_tests/{RUN}", "tests"))
print(f"run R{RUN}: before {before} tests -> after {after} tests; group subtree has {len(grp_case_ids)} cases")
print("NEW C-IDs:", {k: newmap[k] for k in ("INV-VIS-10", "INV-VIS-11") if k in newmap})
