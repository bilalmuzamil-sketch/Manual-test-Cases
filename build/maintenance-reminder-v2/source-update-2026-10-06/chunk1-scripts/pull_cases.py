import json, urllib.request, urllib.error, base64, time, re, html

creds = json.load(open("/tmp/testrail/creds.json"))
host = creds["host"].rstrip("/")
auth = base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()

def api(path):
    url = f"{host}/index.php?/api/v2/{path}"
    req = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}", "Content-Type":"application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code in (429,502,503):
                time.sleep(2*(attempt+1)); continue
            print("HTTP", e.code, path, e.read()[:200]); raise
        except Exception as ex:
            time.sleep(2); continue
    raise RuntimeError("failed "+path)

# 1. All sections
sections = []
offset = 0
while True:
    data = api(f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    if isinstance(data, dict):
        chunk = data.get("sections", [])
        sections.extend(chunk)
        nxt = data.get("_links",{}).get("next")
        if nxt and len(chunk)>0:
            offset += 250; continue
        else:
            break
    else:
        sections.extend(data); break

print("total sections:", len(sections))

# build descendants of 19397
by_parent = {}
for s in sections:
    by_parent.setdefault(s.get("parent_id"), []).append(s)

ROOT = 19397
desc = set([ROOT])
stack = [ROOT]
while stack:
    cur = stack.pop()
    for c in by_parent.get(cur, []):
        if c["id"] not in desc:
            desc.add(c["id"]); stack.append(c["id"])

sec_name = {s["id"]: s["name"] for s in sections}
print("19397 subtree sections:", sorted(desc))
for sid in sorted(desc):
    print("  ", sid, sec_name.get(sid, "ROOT" if sid==ROOT else "?"))

# 2. cases per section
all_cases = []
for sid in sorted(desc):
    offset = 0
    while True:
        data = api(f"get_cases/1&suite_id=1&section_id={sid}&limit=250&offset={offset}")
        if isinstance(data, dict):
            chunk = data.get("cases", [])
            all_cases.extend(chunk)
            if data.get("_links",{}).get("next") and len(chunk)>0:
                offset += 250; continue
            break
        else:
            all_cases.extend(data); break

print("total cases in subtree:", len(all_cases))
json.dump({"sections":{str(k):sec_name.get(k) for k in desc}, "cases":all_cases},
          open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json","w"))
print("saved")
