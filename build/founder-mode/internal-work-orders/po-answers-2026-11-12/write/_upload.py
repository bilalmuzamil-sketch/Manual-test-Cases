"""Picture upload for update_cases.py (the same request as authoring/create.py's upload, kept here so update_cases can attach a picture a
rewritten body newly names)."""
import json, base64, uuid, time, urllib.request, urllib.error, os
_C = json.load(open("/tmp/testrail/creds.json")); _AUTH = base64.b64encode(f"{_C.get('email') or _C.get('user')}:{_C['password']}".encode()).decode()
IMG = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "design-2026-11-12", "images")
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
        + open(f"{IMG}/{name}", "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + _AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(6):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code == 429 and a < 5: time.sleep(25); continue
            if e.code < 500 or a == 5: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 5: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))
