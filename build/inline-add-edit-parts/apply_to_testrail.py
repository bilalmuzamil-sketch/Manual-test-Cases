#!/usr/bin/env python3
"""Apply the Inline Add and Edit Parts v13->v16 source re-verification to TestRail.

Authorized by the QA lead for this pass (case create/update permitted; Jira hold active — no Jira).
Updates the existing 96 cases IN PLACE by C-ID (preserving IDs, run membership, assignments) and
re-stamps them to spec v16; adds the 22 new Story-7 (Bin Allocation) cases under a new section in
group 6597; re-backfills the id-map. Then the caller union-syncs run R418 (sync_runs.py).

Block-only HTML (Rule / APP-ACTIONS-PLAYBOOK §J): <ol><li> for preconds/steps, <ol><li> + <hr /> + <p>
for expected. NEVER <br> or styling inline tags in an API payload. New cases send custom_atmstatus=1
(Not Automated) + custom_automation_type=0 — NEVER 3 (Rule 65 / testrail_add_case.py).

Rule 71: any existing case live-flagged Automated (custom_atmstatus==3) is SKIPPED and reported, never
edited without the QA lead. update_case carries custom_preconds+steps+expected every time (TestRail
re-renders omitted text fields — APP-ACTIONS-PLAYBOOK §J).

Creds: /tmp/shopview-creds.env (Rule 82). Existing internal_id->C-ID map: /tmp/iaep-oldidmap.csv.
Idempotent: re-running updates in place and dedupes new cases by title.

Usage:
  python3 build/inline-add-edit-parts/apply_to_testrail.py            # dry-run
  python3 build/inline-add-edit-parts/apply_to_testrail.py --apply    # write
"""
import urllib.request, urllib.error, json, base64, ssl, csv, re, html as H, time, glob, sys

APPLY = "--apply" in sys.argv
creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
EMAIL = creds["CLAUDE_USERNAME"]; KEY = creds["TESTRAIL_API_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
GROUP = 6597
BIN_AREA = "Inline Add and Edit Parts - Bin Allocation"

def call(path, body=None, tries=4):
    for t in range(tries):
        try:
            data = json.dumps(body).encode() if body is not None else None
            r = urllib.request.Request(BASE + path, data=data,
                                       method="POST" if body is not None else "GET")
            r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
            if body is not None: r.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(r, context=CTX, timeout=120) as x:
                raw = x.read().decode().strip()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and t < tries - 1:
                time.sleep(2 * (t + 1)); continue
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

# --- sections under GROUP ---
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
    if not APPLY:
        print(f"  [dry-run] would create section: {name}"); return -1
    r = call("add_section/1", {"suite_id": 1, "parent_id": GROUP, "name": name})
    sec_by_name[name] = r["id"]; print("  created section:", name, "->", r["id"]); return r["id"]

# --- existing internal_id -> C-ID (snapshot taken before gen_import blanked the live id-map) ---
oldmap = {}
for row in csv.DictReader(open("/tmp/iaep-oldidmap.csv")):
    v = (row.get("testrail_case_id") or "").strip().lstrip("C")
    if v: oldmap[row["internal_id"]] = int(v)

local = []
for f in sorted(glob.glob("build/inline-add-edit-parts/cases/cases-*.json")):
    local += json.load(open(f))
print(f"local cases: {len(local)} | existing mapped: {len(oldmap)} | APPLY={APPLY}")

live = paged("get_cases/1&suite_id=1", "cases")
sub_ids = set(sec_by_name.values())
live_title2cid = {c["title"]: c["id"] for c in live if c["section_id"] in sub_ids}
live_atm = {c["id"]: c.get("custom_atmstatus") for c in live}

updated = added = held = 0; newmap = {}; held_ids = []
for c in local:
    iid = c["id"]
    fields = {"title": c["title"][:250],
              "custom_preconds": to_ol(c.get("preconditions")),
              "custom_steps": to_ol(c.get("steps")),
              "custom_expected": expected_html(c["expected"]),
              "refs": (c.get("refs") or "")[:250]}
    cid = oldmap.get(iid) or live_title2cid.get(c["title"])
    if cid:
        if live_atm.get(cid) == 3:                       # Rule 71 — never edit an Automated case
            held += 1; held_ids.append((iid, cid)); newmap[iid] = cid
            print(f"  HOLD (Automated) {iid} C{cid} — skipped per Rule 71"); continue
        if APPLY: call(f"update_case/{cid}", fields)
        newmap[iid] = cid; updated += 1
    else:
        sid = ensure_section(c["area"])
        if APPLY and sid and sid > 0:
            f2 = dict(fields); f2["custom_atmstatus"] = 1; f2["custom_automation_type"] = 0
            r = call(f"add_case/{sid}", f2); newmap[iid] = r["id"]; live_title2cid[c["title"]] = r["id"]
        added += 1
    if APPLY and (updated + added) % 25 == 0:
        print(f"  progress: updated {updated}, added {added}, held {held}")
print(f"DONE: updated {updated}, added {added}, held {held}")
if held_ids: print("HELD (Automated):", held_ids)

if APPLY:
    rows = [[c["id"], f"C{newmap.get(c['id'],'')}" if newmap.get(c["id"]) else "",
             c["title"], c["area"], c.get("refs", "")] for c in local]
    with open("build/inline-add-edit-parts/testrail-id-map.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["internal_id", "testrail_case_id", "title", "section", "refs"]); w.writerows(rows)
    print("id-map backfilled:", sum(1 for r in rows if r[1]), "of", len(rows))
else:
    print("\nDRY-RUN only. Re-run with --apply to write.")
