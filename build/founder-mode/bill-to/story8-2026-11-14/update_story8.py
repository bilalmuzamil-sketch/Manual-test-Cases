#!/usr/bin/env python3
"""DRAFT, NOT RUN (14 Nov 2026). Story 8 named-set update (QA lead's approval, 14 Nov 2026, after the PRD page was edited on 14 Nov 2026):
updates every live Bill To case whose rebuilt fields differ from our last read-back: the named set rewritten top to bottom (Rule 134) and
the cases whose From line is only re-stamped to the 14 Nov 2026 copy (restamp-proof.json: every quote word for word in the new copy).
Mirrors authoring/update_changed.py and layout-stress-2026-11-14/update_held_stress.py.

  1. tester-readiness check first (Rule 138); refuses on failure
  2. per case, LOCKED ON THE LIVE TEXT (Rule 87): get_case, save the before-copy, compare title, refs, preconditions, steps and expected
     result with our last read-back (applied/C<id>-after.json). Any difference = edited outside our library: NOT written, listed in
     edited-outside.json for the QA lead (Rule 123). Automated cases are held (Rule 71); cases created by someone else are refused.
  3. update_case with only the changed fields, read back field by field, read-back saved as applied/C<id>-after.json
  4. pictures: each named-set case gets its redrawn page 4 pictures (design-2026-11-09/images/*-2026-11-14.png), idempotent, read back by
     name; its old page 4 pictures are deleted where TestRail allows (a picture attached to a closed run cannot be deleted: logged, and the
     case text names only the new pictures)
  5. testrail-id-map.csv: the prd_version of each case written is set to "0.5 (edited 14 Nov 2026)" (before-copy kept); afterwards
     authoring/prd_moves.json can be emptied
  6. no run change: rewritten cases are already in run 558 (held ones stay out); S8-09 is not touched (proposed for deletion)
Log: story8-2026-11-14/applied/update-log.jsonl (operation, C-id, HTTP status, read-back; Rule 50).
Dry run unless --apply (the dry run reads nothing from TestRail: it compares with the saved read-backs).
python3 update_story8.py [--apply] [--keys K1,K2]"""
import sys, os, json, csv, re, base64, uuid, time, shutil, urllib.request, urllib.error
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H); D = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
APPLY = "--apply" in sys.argv
NEWV = "0.5 (edited 14 Nov 2026)"
FIELDS = ["title", "refs", "custom_preconds", "custom_steps", "custom_expected"]
OURS = 3
PROP = json.load(open(f"{D}/proposals.json")); MAP = f"{P}/testrail-id-map.csv"; IMG = f"{P}/design-2026-11-09/images"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
NAMED = set(json.load(open(f"{H}/named-set.json")))
SKIP = {"S8-09"}                                        # proposed for deletion: left exactly as it is
ONLY = set(sys.argv[sys.argv.index("--keys") + 1].split(",")) if "--keys" in sys.argv else None
PICRE = re.compile(r"bt-p\d-\d\d-[\w-]+\.png")
OLD4 = re.compile(r"^bt-p4-\d\d-(before|after)-[a-z-]+(?<!-2026-11-14)\.png$")
def pics(k): return sorted(set(PICRE.findall(PROP[k]["fields"]["custom_expected"].split("References from Design")[-1])))
plan, part = [], {}
for k, cid in ids.items():
    if k in SKIP or (ONLY and k not in ONLY): continue
    last = json.load(open(f"{P}/applied/C{cid}-after.json"))
    ch = [f for f in FIELDS if (last.get(f) or "") != PROP[k]["fields"][f]]
    part[k] = {f: ("CHANGED" if f in ch else "CONFIRMED") for f in FIELDS}
    if ch: plan.append((k, cid, ch, last))
json.dump(part, open(f"{H}/update-plan-parts.json", "w"), indent=1)
print(f"cases with a change: {len(plan)} (named set {sum(k in NAMED for k, *_ in plan)}, re-stamp only {sum(k not in NAMED for k, *_ in plan)})"
      f" | unchanged: {len(part) - len(plan)} | skipped: {sorted(SKIP)}")
TRC.require(P)          # Rule 138
if not APPLY:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)

sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{H}/applied", exist_ok=True)
log = open(f"{H}/applied/update-log.jsonl", "a"); outside, written = [], []
def L(x): log.write(json.dumps(x, ensure_ascii=False) + "\n"); log.flush()
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
        + open(f"{IMG}/{name}", "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(6):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code == 429 and a < 5: time.sleep(25); continue
            if e.code < 500 or a == 5: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 5: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))
def atts(cid):
    d = api(f"get_attachments_for_case/{cid}"); return d.get("attachments", d) if isinstance(d, dict) else d
for k, cid, ch, last in plan:
    live = api(f"get_case/{cid}")
    json.dump(live, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    moved = [f for f in FIELDS if (live.get(f) or "") != (last.get(f) or "")]
    if moved: outside.append({"key": k, "case": f"C{cid}", "fields": moved}); L({"op": "lock_refused", "key": k, "case": f"C{cid}", "live_differs": moved}); continue
    if live.get("custom_automation_type") not in (None, 0, 2): outside.append({"key": k, "case": f"C{cid}", "fields": ["Automated"]}); L({"op": "held_automated", "case": f"C{cid}"}); continue
    if live.get("created_by") != OURS: outside.append({"key": k, "case": f"C{cid}", "fields": ["created by someone else"]}); L({"op": "held_foreign", "case": f"C{cid}"}); continue
    api(f"update_case/{cid}", {f: PROP[k]["fields"][f] for f in ch}); st = LAST["status"]
    a = api(f"get_case/{cid}"); bad = [f for f in ch if (a.get(f) or "") != PROP[k]["fields"][f]]
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": ch, "readback_ok": not bad, "bad": bad})
    if not bad: written.append(k)
    if k in NAMED:                                    # pictures
        want = pics(k); have = atts(cid); names = {x.get("name") or x.get("filename") for x in have}
        for n in want:
            if n not in names:
                hs, res = upload(cid, n); L({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": hs, "error": res.get("error")})
        for x in have:
            n = x.get("name") or x.get("filename") or ""
            if OLD4.match(n):
                try: r = api(f"delete_attachment/{x['id']}", {})          # POST (a GET answers 404 "Unsupported HTTP method")
                except Exception as e: r = {"error": str(e)[:200]}
                L({"op": "delete_attachment", "key": k, "case": f"C{cid}", "file": n, "http": LAST["status"], "body": r if isinstance(r, dict) else None})
        now = {x.get("name") or x.get("filename") for x in atts(cid)}
        L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": set(want) <= now,
           "old_page4_left": sorted(n for n in now if n and OLD4.match(n))})
json.dump(outside, open(f"{H}/edited-outside.json", "w"), indent=1)
shutil.copyfile(MAP, f"{H}/applied/testrail-id-map-before-update.csv")
rows = list(csv.DictReader(open(MAP))); fn = list(rows[0].keys())
for r in rows:
    if r["key"] in written: r["prd_version"] = NEWV
with open(MAP, "w", newline="") as f: w = csv.DictWriter(f, fieldnames=fn); w.writeheader(); w.writerows(rows)
print(f"written {len(written)} | edited outside our library (not written, for the QA lead): {outside}")
