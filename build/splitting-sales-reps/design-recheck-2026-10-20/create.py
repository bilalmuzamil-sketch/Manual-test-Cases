"""Create the missing SSR design cases (QA lead, 20 Oct 2026: "see if you had missed adding the test cases related to design for this
and add the missed one"), attach each case's board pictures, read back. SSR has no test run (QA lead: "No run for now")."""
import sys, json, re, html, os, uuid, urllib.request, urllib.error, time
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply"); import trlib; from trlib import api, LAST
R = "/home/user/Manual-test-Cases/"
d = json.load(open("new-design-cases.json")); tmpl = api("get_case/666028")
def attach(cid, path):
    b = uuid.uuid4().hex; data = open(R + path, "rb").read(); name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + data + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"{trlib._HOST}/index.php?/api/v2/add_attachment_to_case/{cid}", data=body, headers={"Authorization": "Basic " + trlib._AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try: x = urllib.request.urlopen(r, timeout=120); return x.status
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: return e.code
        except Exception:
            if a == 3: return 0
        time.sleep(3 * (a + 1))
n = lambda x: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x or ""))).strip(); log = []
for v in d["cases"]:
    body = {k: v[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected")}
    body.update(template_id=tmpl["template_id"], type_id=tmpl["type_id"], priority_id=tmpl["priority_id"], refs=v.get("refs") or tmpl["refs"], custom_atmstatus=1)
    if tmpl.get("custom_automation_type") is not None: body["custom_automation_type"] = tmpl["custom_automation_type"]
    c = api(f"add_case/{v.get('section_id', 84277)}", body); st = LAST["status"]; cid = c["id"]
    hs = [attach(cid, p) for p in v["boards"]]
    a = api(f"get_case/{cid}"); att = api(f"get_attachments_for_case/{cid}"); att = att.get("attachments", att) if isinstance(att, dict) else att
    names = {x.get("name") or x.get("filename") for x in att}
    ok = all(n(a[k]) == n(body[k]) for k in ("custom_preconds", "custom_steps", "custom_expected")) and a["title"] == body["title"] and a["section_id"] == 84277
    json.dump(a, open(f"applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.append(dict(key=v["key"], case=cid, http=st, readback_ok=ok, attach_http=hs, pictures_ok={os.path.basename(p) for p in v["boards"]} <= names, title=a["title"]))
    print(log[-1])
json.dump(log, open("applied/create-log.json", "w"), indent=1, ensure_ascii=False)
