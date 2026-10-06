import json, urllib.request, urllib.parse, base64, time, re, sys

creds = json.load(open("/tmp/testrail/creds.json"))
host = creds["host"].rstrip("/")
auth = base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()

def api(path):
    url = f"{host}/index.php?/api/v2/{path}"
    req = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2); continue
            raise
    raise RuntimeError("retries exhausted")

# 1. all sections (paginate)
sections = []
offset = 0
while True:
    d = api(f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    if isinstance(d, dict):
        chunk = d.get("sections", [])
        sections.extend(chunk)
        nxt = d.get("_links", {}).get("next")
        if nxt and chunk:
            offset += 250; continue
        break
    else:
        sections.extend(d); break
print(f"total sections: {len(sections)}", file=sys.stderr)

# find descendants of 6658
by_id = {s["id"]: s for s in sections}
target = 6658
desc = set([target])
changed = True
while changed:
    changed = False
    for s in sections:
        if s.get("parent_id") in desc and s["id"] not in desc:
            desc.add(s["id"]); changed = True
desc_sections = [by_id[i] for i in desc if i in by_id]
print(f"section 6658 + descendants: {len(desc)}", file=sys.stderr)
for s in sorted(desc_sections, key=lambda x: x["id"]):
    print(f"  SEC {s['id']} parent={s.get('parent_id')} :: {s['name']}", file=sys.stderr)

# 2. cases per section
all_cases = []
for sid in sorted(desc):
    offset = 0
    while True:
        d = api(f"get_cases/1&suite_id=1&section_id={sid}&limit=250&offset={offset}")
        if isinstance(d, dict):
            chunk = d.get("cases", [])
            all_cases.extend(chunk)
            nxt = d.get("_links", {}).get("next")
            if nxt and chunk:
                offset += 250; continue
            break
        else:
            all_cases.extend(d); break
print(f"total cases under 6658 tree: {len(all_cases)}", file=sys.stderr)

json.dump({"sections": desc_sections, "cases": all_cases}, open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/di_cases.json","w"))
print("saved", file=sys.stderr)
